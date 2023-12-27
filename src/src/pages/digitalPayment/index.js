import React, { Component } from 'react'
import { connect } from 'react-redux'
import lodash from 'lodash'
import {
  Card,
  Form,
  Row,
  Col,
  Timeline,
  Icon,
  Select,
  Button,
  Spin,
  InputNumber,
  Input,
  Alert,
  Modal,
  // Radio,
  Typography,
} from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
import InfoCard from 'components/customComponents/InfoCard'
import AuthorizationModal from 'components/customComponents/AuthorizationModal'
// import moment from 'moment'
import { getCAofClientById, getPlCAById, getSuspenseCAById } from 'redux/currencyAccounts/action'
import {
  updateSelectedClient,
  updateSelectedCompany,
  setToInitialValue,
  updateSelectedCA,
  removeSelectedCA,
  updateNewBeneficiaryDetails,
  removeBeneficiaryData,
  getBeneficiariesByOwnerEntityId,
  updateErrorMessage,
  updateDebitAmount,
  updateCreditAmount,
  resetCreditDebitAmount,
  initiateDigitalPayment,
  getBeneFieldsByValues,
  updateBeneFieldsByValues,
  updateClientOrCompanyAsBeneficiary,
  // getLiftingFee,
  getDigitalPaymentDetails,
  removePaymentInformation,
} from 'redux/digitalPayment/action'

import { createNewBeneficiary } from 'redux/caBeneficiaries/action'
import NewBeneficiary from 'pages/beneficiaries/addBeneficiary'
import EditBeneficiary from 'pages/beneficiaries/editBeneficiary'
// import { twoFAauthorizationModal } from '../../redux/auth0/actions'
import { getClientsByKycStatusPass } from 'redux/general/actions'
import {
  cryptoAmountFormatter,
  amountFormatter,
  precisionBasedAmountFormatter,
  formatToZoneDate,
  flattenObject,
  transformFormEditFields,
} from '../../utilities/transformer'
import styles from './style.module.scss'
import jsonData from './data.json'

const { Option } = Select
const { Paragraph, Text } = Typography

const mapStateToProps = ({ general, digitalPayment, user, currencyAccounts, settings, auth0 }) => ({
  selectedClientOrCompanyId: digitalPayment.newPayment.clientOrCompanyId,
  selectedClientOrCompanyIdAsBeneficiary: digitalPayment.newPayment.clientOrCompanyIdAsBeneficiary,
  selectedCurrencyAccount: digitalPayment.newPayment.selectedCurrencyAccount,
  token: user.token,
  clientAccounts: currencyAccounts.clientAccounts,
  companyAccounts: currencyAccounts.companyAccounts,
  CAlistLoading: currencyAccounts.CAlistLoading,
  beneficiaryData: digitalPayment.newPayment.beneficiaryData,
  beneficiaries: digitalPayment.beneficiaries,
  errorMsg: digitalPayment.errorMsg,
  loading: digitalPayment.loading,
  debitAmount: digitalPayment.newPayment.debitAmount,
  creditAmount: digitalPayment.newPayment.creditAmount,
  timeZone: settings.timeZone.value,
  timeZoneCode: settings.timeZone.code,
  newPayment: digitalPayment.newPayment,
  rateDetails: digitalPayment.rateDetails,
  isRateFetched: digitalPayment.isRateFetched,
  rateLoading: digitalPayment.rateLoading,
  errorList: digitalPayment.errorList,
  paymentLoading: digitalPayment.paymentLoading,
  paymentInformation: digitalPayment.paymentInformation,
  paymentInformationError: digitalPayment.paymentInformationError,
  paymentInformationLoading: digitalPayment.paymentInformationLoading,
  twoFAauthModal: auth0.twoFAauthModal,
  countries: general.countries,
  clients: general.KycStatusPassedClients,
  vendors: general.newVendors,
  companies: general.companies,
  currencies: general.newCurrencies,
  isFetchBeneFields: digitalPayment.isFetchBeneFields,
  beneFieldsList: digitalPayment.beneFieldsList,
  beneListLoading: digitalPayment.beneListLoading,
  fees: digitalPayment.fees,
})

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}
@Form.create()
@connect(mapStateToProps)
class digitalPayment extends Component {
  state = {
    selecetedBeneOption: undefined,
    viewBeneVisible: false,
    selectedBeneId: undefined,
    editBeneVisible: false,
    remarks: undefined,
    isFxTransaction: false,
    beneAccountType: undefined,

    addBeneVisible: false,
    canShowCountryInNewBeneficiary: false,
    paymentForValue: undefined,
    paymentToValue: undefined,
    triggerIntervalFn: null,
  }

  componentDidMount() {
    const { dispatch, form, token } = this.props
    dispatch(setToInitialValue())
    dispatch(getClientsByKycStatusPass(token))
    // get payment data for every 60 sec
    this.setState({
      triggerIntervalFn: setInterval(this.getPaymentInfoByOnBlurAndTimeInterval, 60000),
    })

    // To disable submit button at the beginning.
    form.validateFields()
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isBeneFetched) {
      this.checkFxTransactionOrNot()
    }
  }

  componentWillUnmount() {
    const { triggerIntervalFn } = this.state
    clearInterval(triggerIntervalFn)
    console.log('Time interval trigger cleared')
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { beneficiaryData } = this.props
    const isPropsUpdated = {
      isBeneFetched: prevProps.beneficiaryData !== beneficiaryData,
    }
    return isPropsUpdated
  }

  handleAuthroizePayment = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { parameters } = this.state
    form.validateFields(error => {
      if (!error) {
        dispatch(initiateDigitalPayment(parameters, token))
      }
    })
  }

  onChangePaymentForOptionsHandler = value => {
    const { dispatch } = this.props
    const { paymentForValue } = this.state
    if (paymentForValue !== value) {
      if (paymentForValue === 'client') {
        dispatch(updateSelectedClient(undefined))
      } else {
        dispatch(updateSelectedCompany(undefined))
      }
    }
    this.setState({ paymentForValue: value })
  }

  onChangeMoveFundsToOptionsHandler = value => {
    const { dispatch } = this.props
    dispatch(updateClientOrCompanyAsBeneficiary(undefined))
    this.removeBeneficiary()
    this.setState({
      paymentToValue: value,
      selectedBeneId: undefined,
    })
  }

  handleClientChange = value => {
    const { dispatch, token } = this.props
    const { paymentForValue } = this.state
    this.setState({
      viewBeneVisible: false,
      selectedBeneId: undefined,
      remarks: undefined,
      selecetedBeneOption: undefined,
    })
    dispatch(removePaymentInformation())
    switch (paymentForValue) {
      case 'client':
        dispatch(updateSelectedClient(value))
        dispatch(getCAofClientById(value, token))
        break
      case 'pl':
        dispatch(updateSelectedCompany(value))
        dispatch(getPlCAById(value, token))
        break
      case 'suspense':
        dispatch(updateSelectedCompany(value))
        dispatch(getSuspenseCAById(value, token))
        break
      default:
        break
    }

    dispatch(updateErrorMessage(''))
  }

  onChangeClientOrCompanyAsBeneficiaryHandler = value => {
    const { dispatch, token } = this.props
    const { paymentToValue } = this.state
    this.setState({
      remarks: undefined,
      selectedBeneId: undefined,
    })
    dispatch(updateClientOrCompanyAsBeneficiary(value))
    this.removeBeneficiary()
    switch (paymentToValue) {
      case 'client':
        dispatch(getCAofClientById(value, token))
        break
      case 'pl':
        dispatch(getPlCAById(value, token))
        break
      case 'suspense':
        dispatch(getSuspenseCAById(value, token))
        break
      default:
        break
    }
    // dispatch(updateErrorMessage(''))
  }

  validateBalance = data => {
    const { dispatch } = this.props
    let errMsg
    if (data.balance.availableBalance <= 0) {
      errMsg = 'InSufficient Funds to proceed'
    }
    dispatch(updateErrorMessage(errMsg))
  }

  handleSelectedCA = value => {
    const { dispatch, clientAccounts, companyAccounts } = this.props

    let selectedCA

    if (clientAccounts.find(item => item.id === value)) {
      selectedCA = clientAccounts.find(item => item.id === value)
    } else {
      selectedCA = companyAccounts.find(item => item.id === value)
    }

    this.validateBalance(selectedCA)

    // update selected currency Account
    dispatch(updateSelectedCA(selectedCA))
  }

  removeCurrecnyAccount = () => {
    const { form, dispatch } = this.props
    form.resetFields()
    dispatch(removeSelectedCA())
    dispatch(removePaymentInformation())
    dispatch(updateClientOrCompanyAsBeneficiary(undefined))
    this.setState({
      viewBeneVisible: false,
      selecetedBeneOption: undefined,
      remarks: undefined,
      paymentToValue: undefined,
    })
  }

  handleBeneOption = e => {
    const { dispatch, selectedClientOrCompanyId, token } = this.props
    dispatch(removeBeneficiaryData())
    dispatch(updateClientOrCompanyAsBeneficiary(undefined))
    this.setState({
      selecetedBeneOption: e.target.value,
      viewBeneVisible: false,
      selectedBeneId: undefined,
      remarks: undefined,
      editBeneVisible: false,
      selectedBeneCountry: undefined,
      selectedBeneCurrency: undefined,
      beneAccountType: undefined,
      addBeneVisible: false,
      paymentToValue: undefined,
    })
    if (e.target.value === 'existBeneficiary') {
      dispatch(getBeneficiariesByOwnerEntityId(selectedClientOrCompanyId, token))
    }
  }

  addNewBeneficiary = (event, form) => {
    event.preventDefault()
    const { dispatch, clients, companies, selectedCurrencyAccount, token } = this.props
    const { selectedBeneCurrency, selectedBeneCountry, beneAccountType } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        values.currency = selectedBeneCurrency
        // values.country = selectedBeneCountry
        values.type = beneAccountType
        const combainedEnttities = [...clients, ...companies]
        const selectedEntity = combainedEnttities.find(
          entity => entity.id === selectedCurrencyAccount.ownerEntityId,
        )
        const payload = {
          accountDetails: {
            nameOnAccount: values.nameOnAccount,
            bankName: values.bankName,
            accountNumber: values.accountNumber,
            bic: values.bic,
            branchCode: values.branchCode,
            iban: values.iban,
            bankCountry: selectedBeneCountry,
            intermediaryBank: values.intermediaryBank,
          },
          beneficiaryDetails: {
            address: {
              buildingNumber: values.buildingNumber,
              city: values.city,
              country: values.country,
              stateOrProvince: values.stateOrProvince,
              street: values.street,
              zipOrPostalCode: values.zipOrPostalCode,
            },
            name: values.nameOnAccount,
            type: values.type,
          },
          currency: values.currency,
          isDeleted: false,
          entityId: selectedEntity.id,
          entityName: selectedEntity?.genericInformation?.registeredCompanyName,
          status: 'new',
          isSaved: values.isSaved,
        }
        const transformedObj = flattenObject(values)
        dispatch(updateNewBeneficiaryDetails(transformedObj))
        dispatch(createNewBeneficiary(payload, token))
        this.setState({ viewBeneVisible: true })
      }
    })
  }

  getAddBeneLayout = () => {
    const {
      beneficiaryData,
      form,
      countries,
      currencies,
      beneFieldsList,
      beneListLoading,
      // beneData
    } = this.props
    const {
      beneAccountType,
      selectedBeneCurrency,
      selectedBeneCountry,
      addBeneVisible,
      editBeneVisible,
      canShowCountryInNewBeneficiary,
    } = this.state
    const SuccessIcon = (
      <Icon type="check-circle" style={{ fontSize: '16px', color: '#4c7a34' }} theme="filled" />
    )
    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.code} label={option.code}>
        {option.code}
      </Option>
    ))

    return Object.entries(beneficiaryData).length === 0 && !editBeneVisible ? (
      <React.Fragment>
        <Spacer height="15px" />
        <Timeline>
          <Timeline.Item
            dot={selectedBeneCountry && beneAccountType && selectedBeneCurrency ? SuccessIcon : ''}
          >
            <div className={styles.processSection}>
              <strong className="font-size-15">Select below beneficiary details to proceed</strong>
              <div className={styles.prgressContent}>
                <div className={`row ${styles.singleInput}`}>
                  <div className="col-12 col-lg-4">
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="select currency"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                      value={selectedBeneCurrency}
                      onChange={(value, id) => this.onChangeCurrencySelected(value, id)}
                    >
                      {currencyOption}
                    </Select>
                  </div>
                  <div className="col-12 col-lg-4">
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Account Type"
                      optionLabelProp="label"
                      autoComplete="off"
                      value={beneAccountType}
                      onChange={(value, id) => this.handleBeneAccountType(value, id)}
                    >
                      {jsonData.accountTypes.map(item => {
                        return (
                          <Option key={item.key} value={item.value} label={item.label}>
                            <div className="demo-option-label-item">
                              <b>{item.label}</b>
                            </div>
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                  {canShowCountryInNewBeneficiary && (
                    <div className="col-12 col-lg-4">
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                        optionLabelProp="label"
                        placeholder="select Beneficiary's Bank Country"
                        filterOption={(input, option) =>
                          option.props.label
                            ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : ''
                        }
                        value={selectedBeneCountry}
                        onChange={(value, id) => this.onChangeCountrySelected(value, id)}
                      >
                        {countriesOptions}
                      </Select>
                    </div>
                  )}
                  <Spacer height="15px" />
                  <div className="col-12 col-lg-4">
                    <Button
                      type="primary"
                      className={styles.btnNext}
                      disabled={!this.checkNewBeneficiaryNextBtnValidation()}
                      onClick={this.handleNextClicked}
                      loading={beneListLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Timeline.Item>
          {addBeneVisible ? (
            <React.Fragment>
              <Timeline.Item hidden={beneFieldsList.length === 0}>
                <NewBeneficiary
                  onSubmitAccount={(e, formValue) => this.addNewBeneficiary(e, formValue)}
                  formFields={beneFieldsList}
                  formProps={form}
                  columnStyle="col-sm-6 col-lg-3"
                  handleCancel={this.handleAddBeneCancel}
                  handleCountryChange={this.onChangeCountrySelect}
                />
              </Timeline.Item>
            </React.Fragment>
          ) : (
            ''
          )}
        </Timeline>
      </React.Fragment>
    ) : (
      ''
    )
  }

  getSelectFromBeneListLayout = () => {
    const { beneficiaries, loading } = this.props
    const { selectedBeneId } = this.state
    const beneficiaryOption = beneficiaries.map(option => (
      <Option key={option.id} label={option.accountDetails.nameOnAccount} value={option.id}>
        <h5>{option.accountDetails.nameOnAccount}</h5>
        <small>
          {option.accountDetails.accountNumber
            ? option.accountDetails.accountNumber
            : option.accountDetails.iban}
        </small>
        <small>{option.currency}</small>
      </Option>
    ))

    return (
      <div className={styles.prgressContent}>
        <Spin spinning={loading} className={styles.singleInput}>
          <Select
            placeholder="search beneficiary...."
            showSearch
            className={styles.singleInput}
            onChange={this.handleBeneSelected}
            optionLabelProp="label"
            optionFilterProp="label"
            value={selectedBeneId}
          >
            {beneficiaryOption}
          </Select>
        </Spin>
      </div>
    )
  }

  getMoveBtwAcountsLayout = () => {
    const {
      clientAccounts,
      selectedCurrencyAccount,
      companyAccounts,
      // selectedClientOrCompanyId,
      selectedClientOrCompanyIdAsBeneficiary,
      clients,
      companies,
    } = this.props
    const { selectedBeneId, paymentToValue } = this.state

    const SuccessIcon = (
      <Icon type="check-circle" style={{ fontSize: '16px', color: '#4c7a34' }} theme="filled" />
    )
    const paymentToOption = jsonData.paymentEntities.map(item => (
      <Option key={item.key} value={item.value} label={item.label}>
        <div className="demo-option-label-item">
          <h5>{item.label}</h5>
        </div>
      </Option>
    ))
    const clientOption = clients.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        <h5>{option.genericInformation.registeredCompanyName}</h5>
        <small style={{ color: '#bfbfbf' }}>{option.type}</small>
      </Option>
    ))
    const companyOption = companies.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        <h5>{option.genericInformation.registeredCompanyName}</h5>
        <small style={{ color: '#bfbfbf' }}>{option.type}</small>
      </Option>
    ))
    const filteredCAList = paymentToValue === 'client' ? clientAccounts : companyAccounts
    const currencyAccountListexceptSelectedAccount = filteredCAList.filter(
      el => el.id !== selectedCurrencyAccount.id,
    )
    const beneficiaryAccountsOption = currencyAccountListexceptSelectedAccount.map(option => (
      <Option key={option.id} label={option.currency} value={option.id}>
        <div className="list-card">
          <div className={styles.flexJCSpaceBetween}>
            <div>
              <h5>{option.currency}</h5>
              <div>
                {option.currencyType === 'crypto' ? (
                  <div>
                    <small>{`Wallet Address: ${option.accountIdentification.accountNumber}`}</small>
                  </div>
                ) : option.accountIdentification.accountNumber ? (
                  <div>
                    <small>{`Account Number : ${option.accountIdentification.accountNumber}`}</small>
                  </div>
                ) : (
                  <div>
                    <small>{`IBAN : ${option.accountIdentification.IBAN}`}</small>
                  </div>
                )}
              </div>
              <small>{`Account Type: ${option.accountType}`}</small>
            </div>
            <div>
              <h5>
                {option.currencyType === 'crypto'
                  ? cryptoAmountFormatter(option.balance.balance)
                  : amountFormatter(option.balance.availableBalance)}
              </h5>
            </div>
          </div>
        </div>
      </Option>
    ))

    return (
      <React.Fragment>
        <Spacer height="15px" />
        <Timeline>
          <Timeline.Item dot={paymentToValue ? SuccessIcon : ''}>
            <div className={styles.processSection}>
              <strong className="font-size-15">Move Funds To:</strong>
              <div className={styles.prgressContent}>
                <div>
                  <Select
                    showSearch
                    className={styles.singleInput}
                    value={paymentToValue}
                    onChange={this.onChangeMoveFundsToOptionsHandler}
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      option.props.label
                        ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        : ''
                    }
                  >
                    {paymentToOption}
                  </Select>
                </div>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item
            hidden={paymentToValue === undefined}
            dot={selectedClientOrCompanyIdAsBeneficiary ? SuccessIcon : ''}
          >
            <div className={styles.processSection}>
              <strong className="font-size-15">
                Select beneficiary {paymentToValue === 'client' ? 'Client' : 'Company'} Name:
              </strong>
              <div className={styles.prgressContent}>
                <div>
                  <Select
                    showSearch
                    className={styles.singleInput}
                    value={selectedClientOrCompanyIdAsBeneficiary}
                    onChange={this.onChangeClientOrCompanyAsBeneficiaryHandler}
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      option.props.label
                        ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        : ''
                    }
                  >
                    {paymentToValue === 'client' ? clientOption : companyOption}
                  </Select>
                </div>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item
            // dot={selectedBeneCountry && beneAccountType && selectedBeneCurrency ? SuccessIcon : ''}
            hidden={selectedClientOrCompanyIdAsBeneficiary === undefined}
            dot={selectedBeneId ? SuccessIcon : ''}
          >
            <div className={styles.processSection}>
              <strong className="font-size-15">
                I`d like to move funds to the following account:
              </strong>
              <div className={styles.prgressContent}>
                <Select
                  placeholder="search account to transfer..."
                  showSearch
                  value={selectedBeneId}
                  className={styles.singleInput}
                  onChange={this.handleSelectedSenderCA}
                  optionLabelProp="label"
                  filterOption={(input, option) =>
                    option.props.label
                      ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      : ''
                  }
                >
                  {beneficiaryAccountsOption}
                </Select>
              </div>
            </div>
          </Timeline.Item>
        </Timeline>
      </React.Fragment>
    )
  }

  manageAddBeneOptions = addBeneOption => {
    let returnLayout
    switch (addBeneOption) {
      case 'addBeneficiary':
        returnLayout = this.getAddBeneLayout()
        return returnLayout
      case 'existBeneficiary':
        returnLayout = this.getSelectFromBeneListLayout()
        return returnLayout
      case 'payPerformBenificary':
        returnLayout = this.getMoveBtwAcountsLayout()
        return returnLayout
      default:
        returnLayout = ''
        return returnLayout
    }
  }

  editBeneficiarySubmit = (event, form) => {
    event.preventDefault()
    // const { token } = this.props
    const { selectedBeneCurrency, beneAccountType } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        const { dispatch } = this.props
        values.currency = selectedBeneCurrency
        // values.country = selectedBeneCountry
        values.type = beneAccountType
        dispatch(updateNewBeneficiaryDetails(values))
        // TODO: If bene update api ready, will implement
        // dispatch(updateNewBeneficiary(values, token))
        this.setState({ viewBeneVisible: true, editBeneVisible: false })
      }
    })
  }

  handleBeneAccountType = e => {
    const { dispatch } = this.props
    dispatch(removeBeneficiaryData())
    this.setState({
      beneAccountType: e,
      addBeneVisible: false,
      editBeneVisible: false,
    })
  }

  onChangeCurrencySelected = value => {
    const { currencies, dispatch } = this.props
    dispatch(removeBeneficiaryData())
    const currencyData = currencies.find(item => item.code === value)
    if (currencyData.type === 'fiat') {
      this.setState(prevState => {
        return {
          ...prevState,
          canShowCountryInNewBeneficiary: true,
        }
      })
    } else {
      this.setState(prevState => {
        return {
          ...prevState,
          canShowCountryInNewBeneficiary: false,
        }
      })
    }
    this.setState({
      selectedBeneCurrency: currencyData.code,
      addBeneVisible: false,
      editBeneVisible: false,
    })
  }

  onChangeCountrySelected = e => {
    const { dispatch } = this.props
    dispatch(removeBeneficiaryData())
    this.setState({ selectedBeneCountry: e, addBeneVisible: false, editBeneVisible: false })
  }

  handleNextClicked = () => {
    const { dispatch, token } = this.props
    const {
      beneAccountType,
      selectedBeneCurrency,
      selectedBeneCountry,
      canShowCountryInNewBeneficiary,
    } = this.state
    let value = {}
    if (canShowCountryInNewBeneficiary) {
      value = {
        beneAccountType,
        selectedBeneCurrency,
        selectedBeneCountry,
      }
      dispatch(getBeneFieldsByValues(value, token))
    } else {
      value = [
        {
          isRequired: true,
          labelName: 'Beneficiary Name',
          message: 'Invalid Wallet Address',
          regex: '',
          schemaName: 'nameOnAccount',
          type: 'input',
        },
        {
          isRequired: true,
          labelName: 'Wallet Address',
          message: 'Invalid Wallet Address',
          regex: '',
          schemaName: 'accountNumber',
          type: 'input',
        },
      ]
      dispatch(updateBeneFieldsByValues(value))
    }
    this.setState({ addBeneVisible: true })
  }

  checkNewBeneficiaryNextBtnValidation = () => {
    const {
      beneAccountType,
      selectedBeneCurrency,
      selectedBeneCountry,
      canShowCountryInNewBeneficiary,
    } = this.state
    if (canShowCountryInNewBeneficiary) {
      return beneAccountType && selectedBeneCurrency && selectedBeneCountry
    }
    return beneAccountType && selectedBeneCurrency
  }

  getEditBeneLayout = () => {
    const {
      form,
      countries,
      currencies,
      beneFieldsList,
      beneListLoading,
      beneficiaryData,
    } = this.props
    const {
      beneAccountType,
      selectedBeneCurrency,
      selectedBeneCountry,
      editBeneVisible,
    } = this.state
    const SuccessIcon = (
      <Icon type="check-circle" style={{ fontSize: '16px', color: '#4c7a34' }} theme="filled" />
    )
    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.code} label={option.code}>
        {option.code}
      </Option>
    ))
    const ErrorIcon = (
      <Icon type="close-circle" style={{ fontSize: '16px', color: 'red' }} theme="filled" />
    )
    // this.setState({addBeneVisible : true, viewBeneVisible : false})
    return (
      <React.Fragment>
        <Spacer height="15px" />
        <Timeline>
          <Timeline.Item
            dot={selectedBeneCountry && beneAccountType && selectedBeneCurrency ? SuccessIcon : ''}
            // hidden={beneAccountType === undefined}
          >
            <div className={styles.processSection}>
              <strong className="font-size-15">Select below beneficiary details to proceed</strong>
              <div className={styles.prgressContent}>
                <div className={`row ${styles.singleInput}`}>
                  <div className="col-12 col-lg-4">
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Account Type"
                      optionLabelProp="label"
                      autoComplete="off"
                      value={beneAccountType}
                      onChange={(value, id) => this.handleBeneAccountType(value, id)}
                    >
                      {jsonData.accountTypes.map(item => {
                        return (
                          <Option key={item.key} value={item.value} label={item.label}>
                            <div className="demo-option-label-item">
                              <b>{item.label}</b>
                            </div>
                          </Option>
                        )
                      })}
                    </Select>
                  </div>
                  <div className="col-12 col-lg-4">
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="select country"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                      value={selectedBeneCountry}
                      onChange={(value, id) => this.onChangeCountrySelected(value, id)}
                    >
                      {countriesOptions}
                    </Select>
                  </div>
                  <div className="col-12 col-lg-4">
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="select currency"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                      value={selectedBeneCurrency}
                      onChange={(value, id) => this.onChangeCurrencySelected(value, id)}
                    >
                      {currencyOption}
                    </Select>
                  </div>
                  <Spacer height="15px" />
                  <div className="col-12 col-lg-4">
                    <Button
                      type="primary"
                      className={styles.btnNext}
                      disabled={!(beneAccountType && selectedBeneCurrency && selectedBeneCountry)}
                      onClick={this.handleNextClicked}
                      loading={beneListLoading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Timeline.Item>
          {editBeneVisible ? (
            <React.Fragment>
              <Timeline.Item dot={ErrorIcon} hidden={beneFieldsList.length !== 0}>
                <Spin spinning={beneListLoading}>
                  <strong className="font-size-15">
                    Something went wrong please contact support..
                  </strong>
                </Spin>
              </Timeline.Item>
              <Timeline.Item hidden={beneFieldsList.length === 0}>
                <EditBeneficiary
                  onSubmitAccount={(e, formValue) => this.editBeneficiarySubmit(e, formValue)}
                  formProps={form}
                  handleCancel={this.handleEditViewCancel}
                  editData={transformFormEditFields(beneficiaryData, beneFieldsList)}
                  columnStyle="col-sm-6 col-lg-3"
                />
              </Timeline.Item>
            </React.Fragment>
          ) : (
            ''
          )}
        </Timeline>
      </React.Fragment>
    )
  }

  removeBeneficiary = () => {
    const { form, dispatch } = this.props
    form.resetFields()
    dispatch(removeBeneficiaryData())
    dispatch(removePaymentInformation())
    this.setState({
      viewBeneVisible: false,
      selectedBeneId: undefined,
      remarks: undefined,
      selectedBeneCurrency: undefined,
      selectedBeneCountry: undefined,
      beneAccountType: undefined,
      addBeneVisible: false,
    })
  }

  handleSelectedSenderCA = value => {
    const { dispatch, clientAccounts, companyAccounts } = this.props
    const { paymentToValue } = this.state
    let selectedCA
    if (paymentToValue === 'client') {
      selectedCA = clientAccounts.find(item => item.id === value)
    } else {
      selectedCA = companyAccounts.find(item => item.id === value)
    }

    dispatch(updateNewBeneficiaryDetails(selectedCA))
    this.setState({ viewBeneVisible: true, selectedBeneId: selectedCA.id })
  }

  handleBeneSelected = value => {
    const { dispatch, beneficiaries } = this.props
    const selectedCA = beneficiaries.find(item => item.id === value)
    const transformedObj = flattenObject(selectedCA)
    dispatch(updateNewBeneficiaryDetails(transformedObj))
    dispatch(resetCreditDebitAmount())
    this.setState({ viewBeneVisible: true, selectedBeneId: transformedObj.id })
  }

  editNewBeneficiaryData = () => {
    this.setState({ viewBeneVisible: false, editBeneVisible: true })
  }

  handleEditViewCancel = () => {
    this.setState({ viewBeneVisible: true, editBeneVisible: false })
  }

  handleAddBeneCancel = () => {
    this.setState({
      selecetedBeneOption: undefined,
      selectedBeneCountry: undefined,
      selectedBeneCurrency: undefined,
      beneAccountType: undefined,
      addBeneVisible: false,
    })
  }

  handleDebitorAmount = value => {
    const { dispatch } = this.props
    this.calculateCreditorAmount(value)
    dispatch(updateDebitAmount(value || undefined))
  }

  getPaymentInfoByOnBlurAndTimeInterval = () => {
    const { dispatch, selectedCurrencyAccount, newPayment, debitAmount, token } = this.props
    const { selecetedBeneOption } = this.state
    const payload = {
      entityId: selectedCurrencyAccount.ownerEntityId,
      accountId: newPayment.selectedCurrencyAccount.id,
      creditorAccountId:
        selecetedBeneOption === 'payPerformBenificary' ? newPayment.beneficiaryData.id : '',
      beneficiaryId:
        selecetedBeneOption !== 'payPerformBenificary' ? newPayment.beneficiaryData.id : '',
      currencyPair: `${newPayment.selectedCurrencyAccount.currency}.${newPayment.beneficiaryData.currency}`,
      direction: 'outbound',
      type: selecetedBeneOption !== 'payPerformBenificary' ? 'external' : 'internal',
      priority: 'normal',
      amount: debitAmount,
    }
    // if debit amount present, get the data
    if (
      debitAmount !== 0 &&
      debitAmount !== undefined &&
      debitAmount <= selectedCurrencyAccount?.balance?.availableBalance
    ) {
      dispatch(getDigitalPaymentDetails(payload, token))
    } else {
      this.errasePreviousPaymentInfoData()
    }
  }

  errasePreviousPaymentInfoData = () => {
    const { dispatch } = this.props
    dispatch(removePaymentInformation())
  }

  calculateCreditorAmount = amount => {
    const { rateDetails, dispatch } = this.props
    const { isFxTransaction } = this.state
    if (isFxTransaction) {
      const creditAmount = rateDetails.rate * amount
      dispatch(updateCreditAmount(creditAmount || undefined))
    } else {
      dispatch(updateCreditAmount(amount || undefined))
    }
  }

  handleCreditAmountChange = value => {
    const { dispatch } = this.props
    this.calculateDebitorAmount(value)
    dispatch(updateCreditAmount(value || undefined))
  }

  calculateDebitorAmount = amount => {
    const { rateDetails, dispatch } = this.props
    const debitAmount = (1 / rateDetails.rate) * amount
    dispatch(updateDebitAmount(debitAmount || undefined))
  }

  handleRemitanceInput = e => {
    this.setState({ remarks: e.target.value })
  }

  handleCancel = () => {
    const { dispatch } = this.props
    this.setState({
      paymentForValue: undefined,
      remarks: undefined,
      selectedBeneId: undefined,
      viewBeneVisible: false,
    })
    dispatch(setToInitialValue())
    dispatch(updateClientOrCompanyAsBeneficiary(undefined))
    dispatch(removeBeneficiaryData())
    dispatch(removePaymentInformation())
  }

  checkFxTransactionOrNot = () => {
    const { beneficiaryData, selectedCurrencyAccount } = this.props
    if (Object.entries(beneficiaryData).length > 0) {
      const data = {
        sellCurrency: selectedCurrencyAccount.currency,
        buyCurrency: beneficiaryData.currency,
      }

      if (data.sellCurrency !== data.buyCurrency) {
        // dispatch(getQuote(data, token))
        this.setState({ isFxTransaction: true })
      } else {
        this.setState({ isFxTransaction: false })
      }
    }
  }

  getCreditor = beneData => {
    const { selecetedBeneOption } = this.state
    let value = ''
    if (selecetedBeneOption === 'payPerformBenificary') {
      value = this.getActiveAccountNumberOrIBAN(beneData.accountIdentification)
    } else {
      value = beneData.iban && beneData.iban.length !== 0 ? beneData.iban : beneData.accountNumber
    }

    return value
  }

  getDebitor = accountDetails => {
    const value = this.getActiveAccountNumberOrIBAN(accountDetails)
    return value
  }

  getActiveAccountNumberOrIBAN = accountDetails => {
    let value = ''
    value =
      accountDetails.IBAN && accountDetails.IBAN.length > 0
        ? accountDetails.IBAN
        : accountDetails.accountNumber

    return value
  }

  getOwner = (type, ownerEntityId) => {
    const { clients, companies } = this.props
    let data
    if (clients.filter(entity => entity.id === ownerEntityId).length === 0) {
      data = companies.filter(entity => entity.id === ownerEntityId)
    } else {
      data = clients.filter(entity => entity.id === ownerEntityId)
    }
    return data.length > 0 ? data[0].genericInformation.registeredCompanyName : ''
  }

  handleNewPayment = e => {
    e.preventDefault()
    const {
      newPayment,
      debitAmount,
      dispatch,
      selectedCurrencyAccount,
      paymentInformation,
      token,
      form,
    } = this.props
    const { selecetedBeneOption } = this.state
    let beneData = {}
    if (selecetedBeneOption !== 'payPerformBenificary') {
      beneData = {
        ...newPayment.beneficiaryData,
      }
    }
    let newPayload = {
      accountId: newPayment.selectedCurrencyAccount.id,
      debitCurrency: newPayment.selectedCurrencyAccount.currency,
      debitAmount,
      creditCurrency: newPayment.beneficiaryData.currency,
      creditAmount: paymentInformation?.creditAmount,
      isSaveBeneficiary:
        selecetedBeneOption === 'addBeneficiary' ? newPayment.beneficiaryData.isSaved : false,
      // remittanceInformation: remarks,
    }
    switch (selecetedBeneOption) {
      case 'addBeneficiary':
        newPayload = {
          ...newPayload,
          beneficiaryId: beneData.id,
        }
        break
      case 'existBeneficiary':
        newPayload = {
          ...newPayload,
          beneficiaryId: beneData.id,
        }
        break
      case 'payPerformBenificary':
        newPayload = {
          ...newPayload,
          creditorAccountId: newPayment.beneficiaryData.id,
        }
        break
      default:
        break
    }
    this.setState({ parameters: newPayload })
    if (debitAmount > selectedCurrencyAccount.balance.availableBalance) {
      Modal.error({
        title: <p style={{ color: 'red' }}>InSufficient balance....</p>,
        content: 'Please maintain sufficient amount in account to make this transaction...',
      })
    } else {
      // dispatch(twoFAauthorizationModal(true))
      form.validateFields((err, values) => {
        if (!err) {
          newPayload.remittanceInformation = values?.remarks
          dispatch(initiateDigitalPayment(newPayload, token))
        }
      })
    }
  }

  getClientName = value => {
    const { clients } = this.props
    const client = clients.find(item => item.id === value)
    return client.genericInformation.tradingName
  }

  format = num => {
    return num.toString().replace(/^[+-]?\d+/, int => {
      return int.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    })
  }

  getCountryLabel = alpha2code => {
    const { countries } = this.props
    let label = ''

    countries.map(country => {
      if (alpha2code === country.alpha2Code) {
        label = country.name
      }
      return label
    })

    return label
  }

  render() {
    const {
      clients,
      selectedClientOrCompanyId,
      clientAccounts,
      companyAccounts,
      selectedCurrencyAccount,
      beneficiaryData,
      form,
      CAlistLoading,
      errorMsg,
      debitAmount,
      timeZone,
      timeZoneCode,
      rateLoading,
      errorList,
      paymentLoading,
      paymentInformation,
      paymentInformationError,
      paymentInformationLoading,
      twoFAauthModal,
      companies,
    } = this.props

    const {
      selecetedBeneOption,
      viewBeneVisible,
      editBeneVisible,
      remarks,
      paymentForValue,
    } = this.state
    const SuccessIcon = (
      <Icon type="check-circle" style={{ fontSize: '16px', color: '#4c7a34' }} theme="filled" />
    )
    const ErrorIcon = (
      <Icon type="close-circle" style={{ fontSize: '16px', color: 'red' }} theme="filled" />
    )

    const paymentForOption = jsonData.paymentEntities.map(item => (
      <Option key={item.key} value={item.value} label={item.label}>
        <div className="demo-option-label-item">
          <h5>{item.label}</h5>
        </div>
      </Option>
    ))

    const clientOption = clients.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        <h5>{option.genericInformation.registeredCompanyName}</h5>
        <small style={{ color: '#bfbfbf' }}>{option.type}</small>
      </Option>
    ))

    const companyOption = companies.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        <h5>{option.genericInformation.registeredCompanyName}</h5>
        <small style={{ color: '#bfbfbf' }}>{option.type}</small>
      </Option>
    ))

    const clientAccountsOptions = clientAccounts.map(option => (
      <Option key={option.id} label={option.currency} value={option.id}>
        <div className="list-card">
          <div className={styles.flexJCSpaceBetween}>
            <div>
              <h5>{option.currency}</h5>
              <div>
                {option.currencyType === 'crypto' ? (
                  <div>
                    <small>{`Wallet Address: ${option.accountIdentification.accountNumber}`}</small>
                  </div>
                ) : option.accountIdentification.accountNumber ? (
                  <div>
                    <small>{`Account Number : ${option.accountIdentification.accountNumber}`}</small>
                  </div>
                ) : (
                  <div>
                    <small>{`IBAN : ${option.accountIdentification.IBAN}`}</small>
                  </div>
                )}
              </div>
              <small>{`Account Type: ${option.accountType}`}</small>
            </div>
            <div>
              <h5>
                {option.currencyType === 'crypto'
                  ? cryptoAmountFormatter(option.balance.balance)
                  : amountFormatter(option.balance.availableBalance)}
              </h5>
            </div>
          </div>
        </div>
      </Option>
    ))

    const companyAccountsOptions = companyAccounts.map(option => (
      <Option key={option.id} label={option.currency} value={option.id}>
        <div className="list-card">
          <div className={styles.flexJCSpaceBetween}>
            <div>
              <h5>{option.currency}</h5>
              <div>
                {option.currencyType === 'crypto' ? (
                  <div>
                    <small>{`Wallet Address: ${option.accountIdentification.accountNumber}`}</small>
                  </div>
                ) : option.accountIdentification.accountNumber ? (
                  <div>
                    <small>{`Account Number : ${option.accountIdentification.accountNumber}`}</small>
                  </div>
                ) : (
                  <div>
                    <small>{`IBAN : ${option.accountIdentification.IBAN}`}</small>
                  </div>
                )}
              </div>
              <small>{`Account Type: ${option.accountType}`}</small>
            </div>
            <div>
              <h5>
                {option.currencyType === 'crypto'
                  ? cryptoAmountFormatter(option.balance.balance)
                  : amountFormatter(option.balance.availableBalance)}
              </h5>
            </div>
          </div>
        </div>
      </Option>
    ))

    const getRemarksTimlineIcon = () => {
      let remarksIcon
      if (form.isFieldTouched('remarks') && form.getFieldError('remarks')) {
        remarksIcon = ErrorIcon
      } else if (
        form.isFieldTouched('remarks') &&
        form.getFieldValue('remarks') !== '' &&
        !form.getFieldError('remarks')
      ) {
        remarksIcon = SuccessIcon
      } else {
        remarksIcon = ''
      }
      return remarksIcon
    }

    return (
      <Card
        title="New Payment"
        bordered={false}
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
        className={styles.mainCard}
      >
        <Row>
          <Col>
            <div className={styles.timelineCard}>
              {errorList.length > 0 ? (
                <div className={styles.errorBlock}>
                  <Alert
                    // showIcon
                    type="error"
                    message={
                      <div className="desc">
                        <Paragraph>
                          <Text
                            strong
                            style={{
                              fontSize: 14,
                            }}
                          >
                            The content you submitted has the following errors:
                          </Text>
                        </Paragraph>
                        {errorList.map(item => {
                          return (
                            <Paragraph>
                              <Icon style={{ color: 'red' }} type="close-circle" /> {item}
                            </Paragraph>
                          )
                        })}
                      </div>
                    }
                  />
                </div>
              ) : (
                ''
              )}

              <Form onSubmit={this.handleNewPayment}>
                <Timeline>
                  <Timeline.Item dot={paymentForValue ? SuccessIcon : ''}>
                    <div className={styles.processSection}>
                      <strong className="font-size-15">Initiate Payment For :</strong>
                      <div className={styles.prgressContent}>
                        <div>
                          <Select
                            showSearch
                            className={styles.singleInput}
                            value={paymentForValue}
                            onChange={this.onChangePaymentForOptionsHandler}
                            optionLabelProp="label"
                            filterOption={(input, option) =>
                              option.props.label
                                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                : ''
                            }
                          >
                            {paymentForOption}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item
                    hidden={paymentForValue === undefined}
                    dot={selectedClientOrCompanyId ? SuccessIcon : ''}
                  >
                    <div className={styles.processSection}>
                      <strong className="font-size-15">
                        Select {paymentForValue === 'client' ? 'Client' : 'Company'} Name:
                      </strong>
                      <div className={styles.prgressContent}>
                        <div>
                          <Select
                            showSearch
                            className={styles.singleInput}
                            value={selectedClientOrCompanyId}
                            onChange={this.handleClientChange}
                            optionLabelProp="label"
                            filterOption={(input, option) =>
                              option.props.label
                                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                : ''
                            }
                          >
                            {paymentForValue === 'client' ? clientOption : companyOption}
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item
                    hidden={selectedClientOrCompanyId === undefined}
                    dot={Object.entries(selectedCurrencyAccount).length === 0 ? '' : SuccessIcon}
                  >
                    <div className={styles.processSection}>
                      <strong className="font-size-15">
                        I’d like to pay from the following account:
                      </strong>
                      <div className={styles.prgressContent}>
                        {Object.entries(selectedCurrencyAccount).length === 0 ? (
                          <Spin spinning={CAlistLoading} className={styles.singleInput}>
                            <div>
                              <Select
                                showSearch
                                className={styles.singleInput}
                                onChange={this.handleSelectedCA}
                                optionLabelProp="label"
                                optionFilterProp="label"
                              >
                                {paymentForValue === 'client'
                                  ? clientAccountsOptions
                                  : companyAccountsOptions}
                              </Select>
                            </div>
                          </Spin>
                        ) : (
                          <div className={styles.singleInput}>
                            <InfoCard
                              minHeight="100px"
                              imgHeight="100px"
                              imgTop="53%"
                              header={
                                <div>
                                  {selectedCurrencyAccount.accountIdentification.accountNumber
                                    ? selectedCurrencyAccount.accountIdentification.accountNumber
                                    : selectedCurrencyAccount.accountIdentification.IBAN}
                                </div>
                              }
                              list1={
                                <div className={styles.titleBlock}>
                                  {selectedCurrencyAccount.currency}
                                </div>
                              }
                              subHeader={
                                selectedCurrencyAccount.accounType === 'crypto'
                                  ? cryptoAmountFormatter(selectedCurrencyAccount.balance.balance)
                                  : amountFormatter(
                                      selectedCurrencyAccount.balance.availableBalance,
                                    )
                              }
                              closeButton={this.removeCurrecnyAccount}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Timeline.Item>
                  {errorMsg ? (
                    <Timeline.Item dot={ErrorIcon}>
                      <strong className="font-size-15">{errorMsg}</strong>
                    </Timeline.Item>
                  ) : (
                    <Timeline.Item
                      hidden={Object.entries(selectedCurrencyAccount).length === 0}
                      dot={Object.entries(beneficiaryData).length === 0 ? '' : SuccessIcon}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">I’d like to:</strong>
                        <div className={styles.prgressContent}>
                          <div className={`row ${styles.singleInput}`}>
                            <div className="col-12 col-lg-4">
                              <Button
                                className={
                                  selecetedBeneOption === 'addBeneficiary'
                                    ? styles.activebuttonStyle
                                    : styles.inactivebuttonStyle
                                }
                                value="addBeneficiary"
                                onClick={this.handleBeneOption}
                              >
                                PAY A NEW BENEFICIARY
                              </Button>
                            </div>
                            <div className="col-12 col-lg-3">
                              <Button
                                className={
                                  selecetedBeneOption === 'existBeneficiary'
                                    ? `${styles.activebuttonStyle} ${styles.buttonBene}`
                                    : `${styles.inactivebuttonStyle} ${styles.buttonBene}`
                                }
                                // className={`${styles.buttonStyle} ${styles.buttonBene}`}
                                value="existBeneficiary"
                                onClick={this.handleBeneOption}
                              >
                                PAY A BENEFICIARY
                              </Button>
                            </div>
                            <div className="col-12 col-lg-3">
                              <Button
                                className={
                                  selecetedBeneOption === 'payPerformBenificary'
                                    ? styles.activebuttonStyle
                                    : styles.inactivebuttonStyle
                                }
                                value="payPerformBenificary"
                                onClick={this.handleBeneOption}
                              >
                                MOVE FUNDS BETWEEN ACCOUNTS
                              </Button>
                            </div>
                          </div>
                        </div>

                        {this.manageAddBeneOptions(selecetedBeneOption)}

                        {editBeneVisible && selecetedBeneOption === 'addBeneficiary' ? (
                          <React.Fragment>{this.getEditBeneLayout()}</React.Fragment>
                        ) : (
                          ''
                        )}
                        {viewBeneVisible && selecetedBeneOption === 'addBeneficiary' ? (
                          <div className={styles.singleInput}>
                            <Card
                              className={styles.activeCard}
                              bordered
                              style={{ borderRadius: 'none' }}
                              bodyStyle={{ height: '132px' }}
                            >
                              <Row>
                                <Col span={20}>
                                  <div className={styles.headerBlock}>
                                    {beneficiaryData.nameOnAccount}
                                  </div>
                                </Col>
                                {/* <Col span={2}>
                                  <Icon
                                    type="edit"
                                    size="small"
                                    className={styles.closeBtn}
                                    onClick={this.editNewBeneficiaryData}
                                  />
                                </Col> */}
                                <Col span={4}>
                                  <Icon
                                    type="delete"
                                    size="small"
                                    className={styles.closeBtn}
                                    onClick={this.removeBeneficiary}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col span={20}>
                                  <Spacer height="14px" />
                                  <div className={styles.subHeaderBlock}>
                                    {beneficiaryData.iban && beneficiaryData.iban.length > 0
                                      ? beneficiaryData.iban
                                      : beneficiaryData.accountNumber}
                                  </div>
                                </Col>
                                <Col span={4}>
                                  <Spacer height="14px" />
                                  <div className={styles.headerBlock}>
                                    {lodash.startCase(beneficiaryData.type)}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col span={4}>
                                  <Spacer height="14px" />

                                  <div className={styles.headerBlock}>
                                    {beneficiaryData.currency}
                                  </div>
                                </Col>
                                <Col span={20}>
                                  <Spacer height="14px" />
                                  <div className={styles.countryBlock}>
                                    {this.getCountryLabel(beneficiaryData.country)}
                                  </div>
                                </Col>
                              </Row>
                              <div>
                                <img
                                  src="resources/images/logo_square-mobile.svg"
                                  alt=""
                                  className={styles.imageBlock}
                                  style={{
                                    position: 'absolute',
                                    top: 87,
                                    right: -20,
                                    opacity: '25%',
                                    height: 100,
                                    width: '120px',
                                  }}
                                />
                              </div>
                            </Card>
                          </div>
                        ) : (
                          ''
                        )}

                        {viewBeneVisible && selecetedBeneOption === 'existBeneficiary' ? (
                          <div className={styles.singleInput}>
                            <Card
                              className={styles.activeCard}
                              bordered
                              style={{ borderRadius: 'none' }}
                              bodyStyle={{ height: '132px' }}
                            >
                              <Row>
                                <Col span={20}>
                                  <div className={styles.headerBlock}>
                                    {beneficiaryData.nameOnAccount}
                                  </div>
                                  <Spacer height="14px" />
                                  <div className={styles.subHeaderBlock}>
                                    {beneficiaryData.accountNumber
                                      ? beneficiaryData.accountNumber
                                      : beneficiaryData.iban}
                                  </div>
                                  <Spacer height="14px" />
                                  <div className={styles.headerBlock}>
                                    {beneficiaryData.currency}
                                  </div>
                                </Col>
                                <Col span={4}>
                                  <Icon
                                    type="delete"
                                    size="small"
                                    className={styles.closeBtn}
                                    onClick={this.removeBeneficiary}
                                  />
                                </Col>
                              </Row>
                              <div>
                                <img
                                  src="resources/images/logo_square-mobile.svg"
                                  alt=""
                                  className={styles.imageBlock}
                                  style={{
                                    position: 'absolute',
                                    top: 87,
                                    right: -20,
                                    opacity: '25%',
                                    height: 100,
                                    width: '120px',
                                  }}
                                />
                              </div>
                            </Card>
                          </div>
                        ) : (
                          ''
                        )}
                        {viewBeneVisible && selecetedBeneOption === 'payPerformBenificary' ? (
                          <div className={styles.singleInput}>
                            <Card
                              className={styles.activeCard}
                              bordered
                              style={{ borderRadius: 'none' }}
                              bodyStyle={{ height: '132px' }}
                            >
                              <Row>
                                <Col span={20}>
                                  <div className={styles.headerBlock}>
                                    {beneficiaryData.currency}
                                  </div>
                                  <Spacer height="14px" />
                                  <div className={styles.subHeaderBlock}>
                                    {beneficiaryData?.accountIdentification?.accountNumber
                                      ? beneficiaryData?.accountIdentification?.accountNumber
                                      : ''}
                                  </div>
                                  <Spacer height="14px" />
                                  <div className={styles.headerBlock}>
                                    {beneficiaryData?.accounType === 'crypto'
                                      ? cryptoAmountFormatter(beneficiaryData?.balance?.balance)
                                      : amountFormatter(beneficiaryData?.balance?.availableBalance)}
                                  </div>
                                </Col>
                                <Col span={4}>
                                  <Icon
                                    type="close"
                                    size="small"
                                    className={styles.closeBtn}
                                    onClick={this.removeBeneficiary}
                                  />
                                </Col>
                              </Row>
                              <div>
                                <img
                                  src="resources/images/logo_square-mobile.svg"
                                  alt=""
                                  className={styles.imageBlock}
                                  style={{
                                    position: 'absolute',
                                    top: 87,
                                    right: -20,
                                    opacity: '25%',
                                    height: 100,
                                    width: '120px',
                                  }}
                                />
                              </div>
                            </Card>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </Timeline.Item>
                  )}
                  <Timeline.Item
                    hidden={Object.entries(beneficiaryData).length === 0}
                    dot={debitAmount && debitAmount ? SuccessIcon : ''}
                  >
                    <Spin spinning={rateLoading}>
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Enter Amount</strong>
                        <div className={styles.prgressContent}>
                          <div className="row">
                            <div className="col-lg-3">
                              <p>You Send</p>
                              <InputNumber
                                style={{ width: '100%', borderColor: '#0190fe' }}
                                size="large"
                                placeholder="Enter Amount"
                                addonAfter={selectedCurrencyAccount.currency}
                                min={0}
                                onChange={this.handleDebitorAmount}
                                onBlur={this.getPaymentInfoByOnBlurAndTimeInterval}
                                value={debitAmount}
                                formatter={value => this.format(value, 2)}
                                // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                stringMode
                              />
                              {debitAmount &&
                                debitAmount >
                                  selectedCurrencyAccount?.balance?.availableBalance && (
                                  <small style={{ color: 'red', fontWeight: 'bold' }}>
                                    Available balance exceeded. Please enter a lower amount.
                                  </small>
                                )}
                              {debitAmount &&
                                debitAmount >
                                  selectedCurrencyAccount?.balance?.availableBalance && (
                                  <small style={{ color: '#9599a8' }}>
                                    {' '}
                                    (Available balance:{' '}
                                    {amountFormatter(
                                      selectedCurrencyAccount?.balance?.availableBalance,
                                    )}
                                    )
                                  </small>
                                )}
                            </div>
                            <div>
                              <Spacer height="14px" />
                              <div className={`col-lg-1 ${styles.swapIcon}`}>
                                <Icon type="swap" size="large" />
                              </div>
                            </div>

                            <div className="col-lg-3">
                              <p>
                                {Object.entries(beneficiaryData).length > 0 &&
                                selecetedBeneOption !== 'payPerformBenificary'
                                  ? `${beneficiaryData.nameOnAccount} will receive`
                                  : 'You Get'}{' '}
                              </p>
                              {/* Changed to Input from InputNumber. Future we can implement */}
                              <Input
                                style={{
                                  width: '100%',
                                  borderColor: '#0190fe',
                                  color: '#313343',
                                }}
                                size="large"
                                value={precisionBasedAmountFormatter(
                                  paymentInformation?.creditAmount,
                                )}
                                disabled
                              />
                            </div>
                          </div>
                          {paymentInformation?.fxInfo?.allInRate &&
                            debitAmount > selectedCurrencyAccount?.balance?.availableBalance && (
                              <div className="row">
                                <div className={`col-7 ${styles.infoBlock}`}>
                                  <Spacer height="8px" />
                                  <p>
                                    1 {selectedCurrencyAccount.currency} equals{' '}
                                    {paymentInformation?.fxInfo?.allInRate}{' '}
                                    {beneficiaryData.currency}@{' '}
                                    {formatToZoneDate(
                                      paymentInformation?.fxInfo?.createdAt,
                                      timeZone,
                                    )}{' '}
                                    {timeZoneCode}
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </Spin>
                  </Timeline.Item>
                  <Spin spinning={paymentInformationLoading}>
                    <Timeline.Item dot={ErrorIcon} hidden={paymentInformationError === ''}>
                      <strong className="font-size-15">{paymentInformationError}</strong>
                    </Timeline.Item>
                  </Spin>
                  <Timeline.Item
                    hidden={
                      paymentInformation?.pricingInfo?.liftingFeeAmount === undefined ||
                      debitAmount > selectedCurrencyAccount?.balance?.availableBalance
                    }
                    dot={SuccessIcon}
                  >
                    <div className={styles.processSection}>
                      <strong className="font-size-15">Fee Charges :</strong>
                      <div className={styles.prgressContent}>
                        <Card className={styles.singleInput}>
                          <div className="row">
                            <div className={`col-12 ${styles.feeBlock}`}>
                              <p>The following fee is lifted from your payment : </p>{' '}
                              <strong className={styles.amountBlock}>
                                {`${precisionBasedAmountFormatter(
                                  paymentInformation?.pricingInfo?.liftingFeeAmount,
                                )} ${paymentInformation?.pricingInfo?.liftingFeeCurrency}`}
                              </strong>
                            </div>
                            <div className={`col-12 ${styles.feeBlock}`}>
                              <p>
                                {selecetedBeneOption !== 'payPerformBenificary'
                                  ? `${beneficiaryData.nameOnAccount} is credited with`
                                  : 'You Get'}
                              </p>
                              <strong className={styles.amountBlock}>
                                {precisionBasedAmountFormatter(paymentInformation?.creditAmount)}
                              </strong>
                            </div>
                            {paymentInformation?.fxInfo?.allInRate && (
                              <div className={`col-12 ${styles.feeBlock}`}>
                                <p>Exchange Rate: </p>{' '}
                                <strong className={styles.amountBlock}>
                                  {paymentInformation?.fxInfo?.allInRate}
                                </strong>
                              </div>
                            )}
                          </div>
                          <div>
                            <img
                              src="resources/images/logo_square-mobile.svg"
                              alt=""
                              className={styles.imageBlock}
                              style={{
                                position: 'absolute',
                                top: 96,
                                right: -20,
                                opacity: '25%',
                                height: 100,
                                width: '120px',
                              }}
                            />
                          </div>
                        </Card>
                      </div>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item
                    hidden={
                      paymentInformation?.creditAmount === undefined ||
                      debitAmount > selectedCurrencyAccount?.balance?.availableBalance
                    }
                    dot={getRemarksTimlineIcon()}
                  >
                    <div className={styles.processSection}>
                      <strong className="font-size-15">Remittance Information</strong>
                      <Spacer height="10px" />
                      <div className="row">
                        <div className="col-lg-6">
                          <Form.Item
                            hasFeedback
                            validateStatus={
                              form.isFieldTouched && form.getFieldError('remarks') ? 'error' : ''
                            }
                          >
                            {form.getFieldDecorator('remarks', {
                              initialValue: remarks,
                              rules: [
                                {
                                  pattern: `^[ A-Za-z0-9./\-?:().,'+]*$`,
                                  message:
                                    'Invalid character entered. Please enter valid characters only',
                                },
                              ],
                            })(
                              <Input
                                placeholder="Enter Remittance information"
                                style={{ width: '100%', borderColor: '#0190fe' }}
                                size="large"
                                onChange={this.handleRemitanceInput}
                              />,
                            )}
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                  <Timeline.Item
                    hidden={
                      paymentInformation?.creditAmount === undefined ||
                      debitAmount > selectedCurrencyAccount?.balance?.availableBalance
                    }
                  >
                    <div className={styles.processSection}>
                      <strong className="font-size-15">Confirmation</strong>
                      <div className={styles.flexJCFlexStart}>
                        <div>
                          <Spacer height="10px" />
                          <Button className={styles.btnCANCEL} onClick={this.handleCancel}>
                            Cancel
                          </Button>
                        </div>
                        <div>
                          <Spacer height="10px" />
                          <Button
                            className={styles.btnNext}
                            htmlType="submit"
                            // onClick={this.handleNewPayment}
                            loading={paymentLoading}
                            disabled={hasErrors(form.getFieldsError())}
                          >
                            Confirm
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Timeline.Item>
                </Timeline>
                <Modal
                  title={false}
                  width={550}
                  visible={twoFAauthModal}
                  footer={null}
                  closable={false}
                  destroyOnClose
                >
                  <AuthorizationModal
                    authorizePayment={this.handleAuthroizePayment}
                    formProps={form}
                    loading={paymentLoading}
                  />
                </Modal>
              </Form>
            </div>
          </Col>
        </Row>
      </Card>
    )
  }
}
export default digitalPayment
