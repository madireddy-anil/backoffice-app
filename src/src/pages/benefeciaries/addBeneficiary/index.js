import React, { Component } from 'react'
// import _ from 'lodash'
import { Radio, Card, Form, Row, Col, Select, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import AddbankDetails from '../dynamicForm/addBeneForm'
import BeneficiarySummary from '../beneficiarySummary'
import { createBeneficiary } from '../../../redux/beneficiary/actions'
import { transformBeneKey } from '../../../utilities/transformer'
import jsondata from '../data.json'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ general, user, beneficiary }) => ({
  clients: general.clients,
  vendors: general.newVendors,
  currencies: general.currencies,
  token: user.token,
  beneficiaryLoading: beneficiary.beneficiaryLoading,
})

@Form.create()
@connect(mapStateToProps)
class AddBeneficiary extends Component {
  state = {
    selectedClientOrVendor: '',
    selectedClientOrVendorId: {},
    clientName: undefined,
    vendorName: undefined,
    beneficiaryType: '',
    selectedCountry: '',
    selectedCurrency: '',
    buttonTitle: 'NEXT',
    isfirstStepComplted: true,
    isBeneStepCompleted: false,
    beneBankDetailsView: false,
    beneficiaryDetailsView: false,
    intermediaryDetailsView: false,
    viewOrHideButton: true,

    // progressbar
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

    // steps
    isBankDetailsEntered: false,
    isBeneDetailsEntered: false,
    isinterMDetailsEntered: false,
    clientId: '',
    vendorId: '',
  }

  handleCancelCreateBene = () => {
    const { history } = this.props
    history.push('/beneficiaries')
  }

  onChangeClentOrVendorOption = e => {
    const { clientName, vendorName } = this.state
    this.setState({ selectedClientOrVendor: e.target.value })
    if (e.target.value === 'client') {
      this.setState({ vendorName: undefined })
    }
    if (e.target.value === 'vendor') {
      this.setState({ clientName: undefined })
    }
    if (!clientName || !vendorName) {
      this.setState({
        beneficiaryType: '',
        selectedCountry: '',
        selectedCurrency: '',
      })
    }
  }

  onChangeSelectClient = (name, id) => {
    const { selectedClientOrVendorId } = this.state
    Promise.resolve(this.setState({ vendorName: undefined })).then(() => {
      this.setState({ clientName: id.props.label, clientId: id.key })
    })
    selectedClientOrVendorId.clientId = id.key
  }

  onChangeSelectVendor = (name, id) => {
    const { selectedClientOrVendorId } = this.state
    Promise.resolve(this.setState({ clientName: undefined })).then(() => {
      this.setState({ vendorName: id.props.label })
    })
    selectedClientOrVendorId.vendorId = id.key
  }

  handleSelectedBeneType = obj => {
    this.setState({ beneficiaryType: obj.value })
    const { selectedCountry, selectedCurrency } = this.state
    if (selectedCountry && selectedCurrency) {
      this.setState({ isBeneStepCompleted: true })
    } else {
      this.setState({ isBeneStepCompleted: false })
    }
  }

  onChangeCountrySelect = country => {
    // const findCurrency = _.find(jsondata.countryFields, el => el.country === country)
    this.setState({ selectedCountry: country })
    const { beneficiaryType, selectedCurrency } = this.state
    if (beneficiaryType && selectedCurrency) {
      this.setState({ isBeneStepCompleted: true })
    } else {
      this.setState({ isBeneStepCompleted: false })
    }
  }

  onChangeCurrencySelect = currency => {
    // const findCurrency = _.find(jsondata.countryFields, el => el.currency === currency)
    this.setState({ selectedCurrency: currency })
    const { beneficiaryType, selectedCountry } = this.state
    if (beneficiaryType && selectedCountry) {
      this.setState({ isBeneStepCompleted: true })
    } else {
      this.setState({ isBeneStepCompleted: false })
    }
  }

  handleBeneStepOne = () => {
    this.setState({ beneBankDetailsView: true, isfirstStepComplted: false })
  }

  handleBneBankDetailsNext = () => {
    this.setState({ beneficiaryDetailsView: true, viewOrHideButton: false, buttonTitle: 'CREATE' })
  }

  intermediaryDetailsRequired = e => {
    if (e.target.checked) {
      this.setState({ intermediaryDetailsView: true, viewOrHideButton: false })
    } else {
      this.setState({ intermediaryDetailsView: false })
    }
  }

  handleAddintermediarykDetails = event => {
    event.preventDefault()
    const { dispatch, form, token } = this.props
    const {
      selectedClientOrVendorId,
      beneficiaryType,
      selectedCountry,
      selectedCurrency,
      clientId,
      vendorId,
      vendorName,
      clientName,
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
          clientId,
          vendorId,
          vendorName,
          clientName,
        }
        Object.assign(formatData, selectedClientOrVendorId)
        dispatch(createBeneficiary(formatData, token))
      }
    })
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

  beneficiaryTypes = () => {
    const { beneficiaryType } = this.state
    return jsondata.beneficiaryTypes.map(item => {
      return (
        <Card
          key={item.id}
          size="small"
          className={
            item.value === beneficiaryType ? styles.activeBeneTypeCard : styles.beneTypeCard
          }
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
    const { selectedCurrency, selectedCountry } = this.state
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
              // bordered
              className={styles.cstmSelectInput}
              value={selectedCountry}
              showSearch
              optionLabelProp="value"
              filterOption={(input, option) =>
                option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
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
              showSearch
              style={{ width: '100%' }}
              bordered={false}
              value={selectedCurrency}
              className={styles.cstmSelectInput}
              optionLabelProp="value"
              filterOption={(input, option) =>
                option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(currency, id) => this.onChangeCurrencySelect(currency, id)}
            >
              {currencyOption}
            </Select>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      selectedClientOrVendor,
      isfirstStepComplted,
      clientName,
      vendorName,
      isBeneStepCompleted,
      beneBankDetailsView,
      beneficiaryDetailsView,
      intermediaryDetailsView,
      buttonTitle,
      viewOrHideButton,
      beneficiaryType,

      selectedCountry,
      selectedCurrency,

      // progressbar
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

      // steps
      isBankDetailsEntered,
      isBeneDetailsEntered,
      isinterMDetailsEntered,
    } = this.state
    const { form, clients, vendors, beneficiaryLoading } = this.props

    const clientOption = clients.map(option => (
      <Option key={option.id} label={option.genericInformation.registeredCompanyName}>
        <h5>{option.genericInformation.tradingName}</h5>
        <small>{option.genericInformation.registeredCompanyName}</small>
      </Option>
    ))
    const vendorOption = vendors.map(option => (
      <Option key={option.id} label={option.genericInformation?.tradingName}>
        <h5>{option.genericInformation?.tradingName}</h5>
        <small>{option.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))
    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Beneficiary</span>
          </div>
        }
        bordered={false}
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
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
              <strong className="font-size-15">Select Client or Vendor Options</strong>
              <div className="pb-3 mt-3">
                <div className={styles.beneTypeBlock}>
                  <Radio.Group
                    value={selectedClientOrVendor}
                    onChange={this.onChangeClentOrVendorOption}
                  >
                    <Radio value="client">Select Client</Radio>
                    <Radio value="vendor">Select Vendor</Radio>
                  </Radio.Group>
                </div>
              </div>
              <Spacer height="15px" />
              {selectedClientOrVendor ? (
                <div>
                  <strong className="font-size-15">
                    {selectedClientOrVendor === 'client' ? 'Select Client' : 'Select Vendor'}
                  </strong>
                  <div className="pb-3 mt-3">
                    <div className={styles.beneTypeBlock}>
                      {selectedClientOrVendor === 'client' ? (
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          value={clientName}
                          className={styles.cstmSelectInput}
                          onSelect={(name, id) => this.onChangeSelectClient(name, id)}
                          optionLabelProp="label"
                          onFilterProp="label"
                          filterOption={(input, option) =>
                            option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {clientOption}
                        </Select>
                      ) : (
                        <Select
                          showSearch
                          style={{ width: '100%' }}
                          value={vendorName}
                          className={styles.cstmSelectInput}
                          onSelect={(name, id) => this.onChangeSelectVendor(name, id)}
                          optionLabelProp="label"
                          onFilterProp="children"
                          filterOption={(input, option) =>
                            option.props.children[0].props.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {vendorOption}
                        </Select>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
              <Spacer height="15px" />
              {vendorName !== undefined || clientName !== undefined ? (
                <div>
                  <strong className="font-size-15">Select Beneficiary Type</strong>
                  <div className="pb-3 mt-3">
                    <div className={styles.beneTypeBlock}>{this.beneficiaryTypes()}</div>
                  </div>
                </div>
              ) : (
                ''
              )}
              <Spacer height="24px" />
              {beneficiaryType ? <div>{this.countryAndCurrencyList()}</div> : ''}
              <Spacer height="20px" />
              {isBeneStepCompleted &&
              isfirstStepComplted &&
              beneficiaryType &&
              selectedCountry &&
              selectedCurrency ? (
                <Button className={styles.btnNext} onClick={this.handleBeneStepOne}>
                  NEXT
                </Button>
              ) : (
                ''
              )}
              {beneBankDetailsView ? (
                <AddbankDetails
                  formFields={jsondata.beneBankDetails}
                  formProps={form}
                  btnTitle={buttonTitle === 'NEXT' ? buttonTitle : ''}
                  title="Bank Account Details"
                  columnStyle="col-sm-6 col-lg-6"
                  isNextClicked={viewOrHideButton}
                  handleNext={this.handleBneBankDetailsNext}
                  inputTyping={(e, value, title) => this.handleOnchange(e, value, title)}
                />
              ) : (
                ''
              )}
              {beneficiaryDetailsView ? (
                <AddbankDetails
                  formFields={jsondata.beneficiaryDetails}
                  formProps={form}
                  btnTitle={buttonTitle === 'CREATE' && !intermediaryDetailsView ? buttonTitle : ''}
                  btnCancel="CANCEL"
                  title="Beneficiary Details"
                  columnStyle="col-sm-6 col-lg-6"
                  viewCheckBox
                  isNextClicked={viewOrHideButton}
                  confirmBtnLoading={beneficiaryLoading}
                  handleCancel={this.handleCancelCreateBene}
                  ischecked={this.intermediaryDetailsRequired}
                  inputTyping={(e, value, title) => this.handleOnchange(e, value, title)}
                  onSubmitAddBeneficiary={this.handleAddintermediarykDetails}
                />
              ) : (
                ''
              )}
              {intermediaryDetailsView ? (
                <AddbankDetails
                  formFields={jsondata.intermediaryDetails}
                  formProps={form}
                  btnTitle={buttonTitle}
                  btnCancel="CANCEL"
                  title="Inetermediary Bank Details"
                  columnStyle="col-sm-6 col-lg-6"
                  handleCancel={this.handleCancelCreateBene}
                  confirmBtnLoading={beneficiaryLoading}
                  inputTyping={(e, value, title) => this.handleOnchange(e, value, title)}
                  onSubmitAddBeneficiary={this.handleAddintermediarykDetails}
                />
              ) : (
                ''
              )}
            </div>
          </div>
          <div className="col-lg-5">
            <BeneficiarySummary
              clientOrVendor={clientName || vendorName}
              BankDetails={isBankDetailsEntered}
              beneDetails={isBeneDetailsEntered}
              interMDetails={isinterMDetailsEntered}
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
              status="Pending"
            />
          </div>
        </div>
      </Card>
    )
  }
}

export default AddBeneficiary
