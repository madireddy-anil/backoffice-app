import React, { Component } from 'react'
import { Card, Form, Row, Col, Select, Spin, Button, Input, notification } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import Spacer from 'components/CleanUIComponents/Spacer'
import EditbankDetails from '../dynamicForm/editBeneForm'
import BeneficiarySummary from '../beneficiarySummary'
import { transformBeneKey } from '../../../utilities/transformer'
import jsondata from '../data.json'
import { getBeneficiaryById, updateBeneficiary } from '../../../redux/beneficiary/actions'

import styles from './style.module.scss'

const { Option } = Select
const { TextArea } = Input

const mapStateToProps = ({ user, beneficiary, general }) => ({
  token: user.token,
  beneficiary: beneficiary.beneficiary,
  beneficiaryLoading: beneficiary.beneficiaryLoading,
  currencies: general.currencies,
  appliedFilters: beneficiary.appliedBeneficiaryFilters,
})

@Form.create()
@connect(mapStateToProps)
class EditBeneficiary extends Component {
  state = {
    clientOrVendorId: {},
    beneId: '',
    beneReference: 'Beneficiary',
    beneficiaryType: '',
    selectedCountry: '',
    selectedCurrency: '',
    viewOrEdit: true,
    isFieldsDisabled: true,
    viewBankDetails: [],
    viewBeneficiaryDetails: [],
    viewIntermediaryDetails: [],

    // progressbar
    isBankDetailsEntered: 'Bank Account Details',
    isBeneDetailsEntered: 'Beneficiary Details',
    isinterMDetailsEntered: 'Inetermediary Bank Details',

    nameOnAccount: '',
    bankName: '',
    accountNumber: '',
    branchCode: '',
    iban: '',
    bicswift: '',
    beneficiaryCity: '',
    beneficiaryStreet: '',
    beneficiaryStateOrProvince: '',
    beneficiaryZipOrPostalCode: '',
    intermediaryAccountNumber: '',
    intermediarySwiftOrBicCode: '',
    intermediaryIban: '',
    intermediaryBranchCode: '',
    intermediaryReference: '',
    beneStatus: '',
    comments: '',
  }

  componentDidMount() {
    const { appliedFilters } = this.props
    this.getBeneficiary()
    if (appliedFilters.viewOrEdit === 'View') {
      this.setState({
        viewOrEdit: true,
        isFieldsDisabled: true,
        beneStatus: appliedFilters.selectedRecordBeneStatus,
        comments: appliedFilters.selectedRecordComment,
      })
    } else {
      this.setState({
        viewOrEdit: false,
        isFieldsDisabled: false,
        beneStatus: appliedFilters.selectedRecordBeneStatus,
        comments: appliedFilters.selectedRecordComment,
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isBeneFetched) {
      this.beneficiarySummary()
    }
  }

  componentWillUnmount() {
    this.setState({
      comments: '',
      beneStatus: '',
    })
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { beneficiary } = this.props
    const isPropsUpdated = {
      isBeneFetched: prevProps.beneficiary !== beneficiary,
    }
    return isPropsUpdated
  }

  getBeneficiary = () => {
    const { dispatch, match, token } = this.props
    const clientOrVendorId = match.params.id
    dispatch(getBeneficiaryById(clientOrVendorId, token))
  }

  beneficiarySummary = () => {
    const { beneficiary } = this.props
    const { isFieldsDisabled, clientOrVendorId } = this.state
    if (Object.entries(beneficiary).length > 0) {
      const tramsformBankDetails = this.transformFields(
        isFieldsDisabled,
        jsondata.beneBankDetails,
        beneficiary.bankAccountDetails,
      )
      const tramsformBeneficiaryDetails = this.transformFields(
        isFieldsDisabled,
        jsondata.beneficiaryDetails,
        beneficiary.beneficiaryDetails,
      )
      this.setState({
        // isBeneFetched: true,
        beneId: beneficiary.id,
        beneReference: beneficiary.beneReference,
        viewBankDetails: tramsformBankDetails,
        viewBeneficiaryDetails: tramsformBeneficiaryDetails,
        beneficiaryType: beneficiary.beneficiaryDetails
          ? beneficiary.beneficiaryDetails.beneficiaryType
          : '',
        selectedCountry: beneficiary.beneficiaryDetails
          ? beneficiary.beneficiaryDetails.beneficiaryCountry
          : '',
        selectedCurrency: beneficiary.beneficiaryDetails
          ? beneficiary.bankAccountDetails.bankAccountCurrency
          : '',
      })
      if (
        beneficiary.intermediaryBankDetails !== undefined &&
        Object.entries(beneficiary.intermediaryBankDetails).length > 0
      ) {
        const tramsformIntermediaryDetails = this.transformFields(
          isFieldsDisabled,
          jsondata.intermediaryDetails,
          beneficiary.intermediaryBankDetails,
        )
        this.setState({
          viewIntermediaryDetails: tramsformIntermediaryDetails,
        })
      }
      this.setState({
        nameOnAccount: beneficiary.bankAccountDetails
          ? beneficiary.bankAccountDetails.nameOnAccount
          : '',
        bankName: beneficiary.bankAccountDetails ? beneficiary.bankAccountDetails.bankName : '',
        accountNumber: beneficiary.bankAccountDetails
          ? beneficiary.bankAccountDetails.accountNumber
          : '',
        branchCode: beneficiary.bankAccountDetails
          ? beneficiary.bankAccountDetails.bankBranchCode
          : '',
        iban: beneficiary.bankAccountDetails ? beneficiary.bankAccountDetails.iban : '',
        bicswift: beneficiary.bankAccountDetails ? beneficiary.bankAccountDetails.bicswift : '',
        beneficiaryCity: beneficiary.beneficiaryDetails
          ? beneficiary.beneficiaryDetails.beneficiaryCity
          : '',
        beneficiaryStreet: beneficiary.beneficiaryDetails
          ? beneficiary.beneficiaryDetails.beneficiaryStreet
          : '',
        beneficiaryStateOrProvince: beneficiary.beneficiaryDetails
          ? beneficiary.beneficiaryDetails.beneficiaryStateOrProvince
          : '',
        beneficiaryZipOrPostalCode: beneficiary.beneficiaryDetails
          ? beneficiary.beneficiaryDetails.beneficiaryZipOrPostalCode
          : '',
        intermediaryAccountNumber: beneficiary.intermediaryBankDetails
          ? beneficiary.intermediaryBankDetails.intermediaryAccountNumber
          : '',
        intermediarySwiftOrBicCode: beneficiary.intermediaryBankDetails
          ? beneficiary.intermediaryBankDetails.intermediarySwiftOrBicCode
          : '',
        intermediaryIban: beneficiary.intermediaryBankDetails
          ? beneficiary.intermediaryBankDetails.intermediaryIban
          : '',
        intermediaryBranchCode: beneficiary.intermediaryBankDetails
          ? beneficiary.intermediaryBankDetails.intermediaryBranchCode
          : '',
        intermediaryReference: beneficiary.intermediaryBankDetails
          ? beneficiary.intermediaryBankDetails.intermediaryReference
          : '',
      })
      if (beneficiary.clientId) {
        clientOrVendorId.clientId = beneficiary.clientId
      }
      if (beneficiary.vendorId) {
        clientOrVendorId.vendorId = beneficiary.vendorId
      }
    }
  }

  formatData = type => {
    let returnResp
    switch (type) {
      case 'individual':
        returnResp = 'INDIVIDUAL'
        break
      case 'business':
        returnResp = 'BUSINESS'
        break
      default:
        break
    }
    return returnResp
  }

  transformFields = (disabled, jsonData, beneDetails) => {
    const formatedData = []
    Object.entries(beneDetails).forEach(([key, value]) => {
      jsonData.forEach(account => {
        if (key === account.schemaName) {
          const formatData = {
            fieldName: account.fieldName,
            schemaName: key,
            regEx: account.regEx,
            required: account.required,
            isEnable: disabled,
            value,
          }
          formatedData.push(formatData)
        }
      })
    })
    return formatedData
  }

  handleSelectedBeneType = obj => {
    this.setState({ beneficiaryType: obj.value })
  }

  onChangeCountrySelect = country => {
    this.setState({ selectedCountry: country })
  }

  onChangeCurrencySelect = currency => {
    this.setState({ selectedCurrency: currency })
  }

  handleAddintermediarykDetails = event => {
    event.preventDefault()
    const { dispatch, form, token, appliedFilters } = this.props
    const {
      beneId,
      clientOrVendorId,
      beneficiaryType,
      selectedCountry,
      selectedCurrency,
      beneStatus,
      comments,
    } = this.state
    const bankAccountDetails = {}
    const beneficiaryDetails = {}
    const intermediaryBankDetails = {}
    form.validateFields((error, values) => {
      if (!error) {
        Object.entries(values).forEach(([key, value]) => {
          const banksDetails = transformBeneKey(key, jsondata.beneBankDetails)
          if (banksDetails) {
            bankAccountDetails[`${key}`] = value
          }
          const beneDetails = transformBeneKey(key, jsondata.beneficiaryDetails)
          if (beneDetails) {
            beneficiaryDetails[`${key}`] = value
          }
          const intermediateDetails = transformBeneKey(key, jsondata.intermediaryDetails)
          if (intermediateDetails) {
            intermediaryBankDetails[`${key}`] = value
          }
        })
        bankAccountDetails.bankAccountCurrency = selectedCurrency
        beneficiaryDetails.beneficiaryCountry = selectedCountry
        beneficiaryDetails.beneficiaryType = beneficiaryType
        const formatData = {
          bankAccountDetails,
          beneficiaryDetails,
          intermediaryBankDetails,
          beneStatus,
          comments: comments.split(' '),
        }
        formatData.id = beneId
        Object.assign(formatData, clientOrVendorId)
        if (beneStatus === 'in_active' && comments.trim() === '') {
          notification.warning({
            message: 'Enter a valid reason!',
          })
        } else if (comments.trim() === '' && appliedFilters.selectedRecordComment !== '') {
          notification.warning({
            message: 'Enter a valid reason!',
          })
        } else {
          dispatch(updateBeneficiary(formatData, token))
        }
      }
    })
  }

  beneficiaryTypes = () => {
    const { beneficiaryType, viewOrEdit } = this.state
    const isEnabled = viewOrEdit ? 'none' : 'auto'
    return jsondata.beneficiaryTypes.map(item => {
      return (
        <Card
          key={uuidv4()}
          size="small"
          disabled={viewOrEdit}
          className={
            item.value === beneficiaryType ? styles.activeBeneTypeCard : styles.beneTypeCard
          }
          style={{ pointerEvents: isEnabled }}
          onClick={() => this.handleSelectedBeneType(item)}
        >
          <Row>
            <Col xs={{ span: 4 }} md={{ span: 4 }} lg={{ span: 4 }}>
              <i className={item.icon} style={{ fontSize: 15 }} />
            </Col>
            <div className={styles.beneTypeRow}>
              <Col xs={{ span: 18 }} md={{ span: 18 }} lg={{ span: 18 }}>
                {item.label}
              </Col>
            </div>
          </Row>
        </Card>
      )
    })
  }

  countryAndCurrencyList = () => {
    const { currencies } = this.props
    const { selectedCountry, selectedCurrency, viewOrEdit } = this.state
    const countryOption = jsondata.countryFields.map(option => (
      <Option key={option.id} value={option.country}>
        {option.country}
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <div className="row">
        <div className="col-lg-6">
          <strong className="font-size-15">Select Country</strong>
          <div className="pb-3 mt-3">
            <Select
              style={{ width: '100%' }}
              className={styles.cstmSelectInput}
              disabled={viewOrEdit}
              showSearch
              optionLabelProp="value"
              filterOption={(input, option) =>
                option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={selectedCountry && selectedCountry}
              onSelect={(country, id) => this.onChangeCountrySelect(country, id)}
            >
              {countryOption}
            </Select>
          </div>
        </div>
        <div className="col-lg-6">
          <strong className="font-size-15">Select Currency</strong>
          <div className="pb-3 mt-3">
            <Select
              style={{ width: '100%' }}
              className={styles.cstmSelectInput}
              disabled={viewOrEdit}
              showSearch
              optionLabelProp="value"
              filterOption={(input, option) =>
                option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={selectedCurrency && selectedCurrency}
              onChange={(currency, id) => this.onChangeCurrencySelect(currency, id)}
            >
              {currencyOption}
            </Select>
          </div>
        </div>
      </div>
    )
  }

  handleOnchange = (e, header, title) => {
    const enteredText = e.target.value
    switch (header) {
      case 'nameOnAccount':
        this.setState({ nameOnAccount: enteredText })
        break
      case 'bankName':
        this.setState({ bankName: enteredText })
        break
      case 'accountNumber':
        this.setState({ accountNumber: enteredText })
        break
      case 'branchCode':
        this.setState({ branchCode: enteredText })
        break
      case 'iban':
        this.setState({ iban: enteredText })
        break
      case 'bicswift':
        this.setState({ bicswift: enteredText })
        break
      case 'beneficiaryCity':
        this.setState({ beneficiaryCity: enteredText })
        break
      case 'beneficiaryStreet':
        this.setState({ beneficiaryStreet: enteredText })
        break
      case 'beneficiaryStateOrProvince':
        this.setState({ beneficiaryStateOrProvince: enteredText })
        break
      case 'beneficiaryZipOrPostalCode':
        this.setState({ beneficiaryZipOrPostalCode: enteredText })
        break
      case 'intermediaryAccountNumber':
        this.setState({ intermediaryAccountNumber: enteredText })
        break
      case 'intermediarySwiftOrBicCode':
        this.setState({ intermediarySwiftOrBicCode: enteredText })
        break
      case 'intermediaryIban':
        this.setState({ intermediaryIban: enteredText })
        break
      case 'intermediaryBranchCode':
        this.setState({ intermediaryBranchCode: enteredText })
        break
      case 'intermediaryReference':
        this.setState({ intermediaryReference: enteredText })
        break
      default:
        break
    }
    switch (title) {
      case 'Bank Account Details':
        this.setState({ isBankDetailsEntered: true })
        break
      case 'Beneficiary Details':
        this.setState({ isBeneDetailsEntered: true })
        break
      case 'Inetermediary Bank Details':
        this.setState({ isinterMDetailsEntered: true })
        break
      default:
        break
    }
  }

  navigateBackTo = () => {
    const { history } = this.props
    history.push('/beneficiaries')
  }

  getBeneStatus = () => {
    const { isFieldsDisabled, beneStatus } = this.state

    const { appliedFilters } = this.props

    return (
      <>
        <p className={styles.beneTitle}>Status : </p>
        <Select
          disabled={isFieldsDisabled}
          value={beneStatus}
          style={{ width: '47%', marginBottom: '30px' }}
          onChange={evt => {
            this.setState({ beneStatus: evt, comments: '' })
          }}
          showSearch
          placeholder="Select Beneficiary Status"
        >
          <Option value="active" key="Active">
            Active
          </Option>
          <Option value="in_active" key="Inactive">
            Inactive
          </Option>
        </Select>
        {(appliedFilters.selectedRecordComment !== '' || beneStatus === 'in_active') && (
          <>
            <h5>
              Reason<span style={{ color: 'red', fontSize: '1.5rem' }}>*</span> :{' '}
            </h5>
            <TextArea
              disabled={isFieldsDisabled}
              defaultValue={appliedFilters.selectedRecordComment}
              onChange={evt => {
                this.setState({ comments: evt.target.value })
              }}
            />
          </>
        )}
      </>
    )
  }

  render() {
    const {
      beneficiaryType,
      beneReference,
      viewBankDetails,
      viewBeneficiaryDetails,
      viewIntermediaryDetails,
      viewOrEdit,
      selectedCountry,
      selectedCurrency,

      // progress
      isBankDetailsEntered,
      isBeneDetailsEntered,
      isinterMDetailsEntered,

      nameOnAccount,
      bankName,
      accountNumber,
      branchCode,
      iban,
      bicswift,
      beneficiaryCity,
      beneficiaryStreet,
      beneficiaryStateOrProvince,
      beneficiaryZipOrPostalCode,
      intermediaryAccountNumber,
      intermediarySwiftOrBicCode,
      intermediaryIban,
      intermediaryBranchCode,
      intermediaryReference,
    } = this.state
    const { form, beneficiaryLoading, appliedFilters } = this.props

    return (
      <Spin spinning={beneficiaryLoading}>
        <Card
          title={
            <div>
              <span className="font-size-16">{beneReference}</span>
            </div>
          }
          bordered={false}
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          extra={
            <Button type="link" onClick={() => this.navigateBackTo()}>
              Back
            </Button>
          }
          bodyStyle={{
            padding: '0',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
        >
          <Helmet title="Add Beneficiary" />
          <div className="row">
            <div className="col-lg-7">
              <div className={styles.timelineCard}>
                <strong className="font-size-15">Selected Beneficiary Type</strong>
                <div className="pb-3 mt-3">
                  <div className={styles.beneTypeBlock}>{this.beneficiaryTypes()}</div>
                </div>
                <Spacer height="24px" />
                <div>{this.countryAndCurrencyList()}</div>
                <Spacer height="20px" />
                {this.getBeneStatus()}
                <Spacer height="20px" />
                <EditbankDetails
                  formFields={viewBankDetails}
                  formProps={form}
                  btnTitle={
                    viewBeneficiaryDetails.length === 0 && viewIntermediaryDetails.length === 0
                      ? 'UPDATE'
                      : 'HIDE'
                  }
                  title="Bank Account Details"
                  columnStyle="col-sm-6 col-lg-6"
                  viewButton={viewOrEdit}
                  confirmBtnLoading={beneficiaryLoading}
                  inputTyping={(e, value, title) => this.handleOnchange(e, value, title)}
                  onSubmitAddBeneficiary={this.handleAddintermediarykDetails}
                />
                <EditbankDetails
                  formFields={viewBeneficiaryDetails}
                  formProps={form}
                  btnTitle={
                    viewBankDetails.length > 0 && viewIntermediaryDetails.length === 0
                      ? 'UPDATE'
                      : 'HIDE'
                  }
                  title="Beneficiary Details"
                  columnStyle="col-sm-6 col-lg-6"
                  viewCheckBox
                  viewButton={viewOrEdit}
                  confirmBtnLoading={beneficiaryLoading}
                  inputTyping={(e, value, title) => this.handleOnchange(e, value, title)}
                  onSubmitAddBeneficiary={this.handleAddintermediarykDetails}
                />
                <EditbankDetails
                  formFields={viewIntermediaryDetails}
                  formProps={form}
                  btnTitle={
                    viewBankDetails.length > 0 && viewBeneficiaryDetails.length > 0
                      ? 'UPDATE'
                      : 'HIDE'
                  }
                  title="Inetermediary Bank Details"
                  columnStyle="col-sm-6 col-lg-6"
                  viewButton={viewOrEdit}
                  confirmBtnLoading={beneficiaryLoading}
                  inputTyping={(e, value, title) => this.handleOnchange(e, value, title)}
                  onSubmitAddBeneficiary={this.handleAddintermediarykDetails}
                />
              </div>
            </div>
            <div className="col-lg-5">
              <BeneficiarySummary
                BankDetails={viewBankDetails.length > 0 ? isBankDetailsEntered : ''}
                beneDetails={viewBeneficiaryDetails.length > 0 ? isBeneDetailsEntered : ''}
                interMDetails={viewIntermediaryDetails.length > 0 ? isinterMDetailsEntered : ''}
                beneType={this.formatData(beneficiaryType)}
                Country={selectedCountry}
                Currency={selectedCurrency}
                AccountName={nameOnAccount}
                BankName={bankName}
                AccountNumber={accountNumber}
                BranchCode={branchCode}
                Iban={iban}
                Bicswift={bicswift}
                city={beneficiaryCity}
                Street={beneficiaryStreet}
                Province={beneficiaryStateOrProvince}
                Postalcode={beneficiaryZipOrPostalCode}
                IAccountnumber={intermediaryAccountNumber}
                IBiccode={intermediarySwiftOrBicCode}
                IIBan={intermediaryIban}
                IBranchcode={intermediaryBranchCode}
                IReference={intermediaryReference}
                status={
                  appliedFilters.selectedRecordBeneStatus === 'in_active' ? 'Inactive' : 'Active'
                }
              />
            </div>
          </div>
        </Card>
      </Spin>
    )
  }
}

export default EditBeneficiary
