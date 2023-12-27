import React, { Component } from 'react'
import { Radio, Card, Form, Select, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import AddbankDetails from '../dynamicForm/addBeneForm'
import { createCryptoBeneficiary } from '../../../redux/cryptoBeneficiary/actions'
import { transformBeneKey } from '../../../utilities/transformer'
import jsondata from '../data.json'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ general, user, cryptoBeneficiary }) => ({
  clients: general.clients,
  vendors: general.newVendors,
  currencies: general.currencies,
  token: user.token,
  cryptoBeneficiaryLoading: cryptoBeneficiary.beneficiaryLoading,
})

@Form.create()
@connect(mapStateToProps)
class AddCryptoBeneficiary extends Component {
  state = {
    selectedClientOrVendor: '',
    clientName: undefined,
    vendorName: undefined,
    selectedCurrency: '',
    buttonTitle: 'NEXT',
    isfirstStepComplted: true,
    isBeneStepCompleted: false,
    beneBankDetailsView: false,
    beneficiaryDetailsView: false,
    viewOrHideButton: true,
    clientId: '',
    vendorId: '',
  }

  handleCancelCreateBene = () => {
    const { history } = this.props
    history.push('/cryptoBeneficiaries')
  }

  onChangeClientOrVendorOption = e => {
    const { clientName, vendorName } = this.state
    this.setState({ selectedClientOrVendor: e.target.value })
    // this.setState({beneBankDetailsView:false})
    if (e.target.value === 'client') {
      this.setState({ vendorName: undefined })
    }
    if (e.target.value === 'vendor') {
      this.setState({ clientName: undefined })
    }
    if (!clientName || !vendorName) {
      this.setState({
        selectedCurrency: '',
      })
    }
  }

  onChangeSelectClient = (name, id) => {
    Promise.resolve(this.setState({ vendorName: undefined })).then(() => {
      this.setState({ clientName: id.props.label, clientId: id.key })
    })
  }

  onChangeSelectVendor = (name, id) => {
    Promise.resolve(this.setState({ clientName: undefined })).then(() => {
      this.setState({ vendorName: id.props.label, vendorId: id.key })
    })
  }

  onChangeCurrencySelect = currency => {
    this.setState({ selectedCurrency: currency })
    this.setState({ isBeneStepCompleted: true })
  }

  handleBeneStepOne = () => {
    this.setState({ beneBankDetailsView: true, isfirstStepComplted: false })
  }

  handleBneBankDetailsNext = () => {
    this.setState({ beneficiaryDetailsView: true, viewOrHideButton: false, buttonTitle: 'CREATE' })
  }

  handleAddCryptoBeneficiary = event => {
    event.preventDefault()
    const { dispatch, form, token } = this.props
    const { clientName, vendorName, selectedCurrency, clientId, vendorId } = this.state
    const bankAccountDetails = {}
    const beneficiaryDetails = {}
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
        })
        const cryptoCurrency = selectedCurrency
        const { cryptoWalletAddress } = bankAccountDetails
        const { aliasName } = beneficiaryDetails
        const formatData = {
          clientName,
          clientId,
          vendorName,
          vendorId,
          cryptoCurrency,
          cryptoWalletAddress,
          aliasName,
        }
        Object.assign(formatData)
        dispatch(createCryptoBeneficiary(formatData, token))
      }
    })
  }

  CurrencyList = () => {
    const { clients, vendors } = this.props
    const { selectedCurrency, clientName, vendorName } = this.state
    let currencyOption

    if (clientName !== undefined) {
      const client = clients.find(el => el.genericInformation.tradingName === clientName)
      currencyOption = client?.profile?.cryptoCurrencyPreferences?.settlementCurrencies?.map(
        settlementCurrency => (
          <Option key={settlementCurrency} label={settlementCurrency}>
            {settlementCurrency}
          </Option>
        ),
      )
    } else {
      const vendor = vendors.find(el => el.genericInformation?.tradingName === vendorName)
      currencyOption = vendor?.profile?.cryptoCurrencyPreferences?.settlementCurrencies?.map(
        settlementCurrency => (
          <Option key={settlementCurrency} label={settlementCurrency}>
            {settlementCurrency}
          </Option>
        ),
      )
    }

    return (
      <div className="row">
        <div className="col-lg-6">
          <strong className="font-size-15">Select Currency</strong>
          <div className="pb-3 mt-3">
            <Select
              showSearch
              style={{ width: '100%' }}
              bordered={false}
              value={selectedCurrency}
              className={styles.cstmSelectInput}
              optionLabelProp="label"
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
      buttonTitle,
      viewOrHideButton,
      selectedCurrency,
    } = this.state
    const { form, clients, vendors, beneficiaryLoading } = this.props
    const clientOption = clients.map(option => (
      <Option key={option.id} label={option.genericInformation.tradingName}>
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
            <span className="font-size-16">Crypto Beneficiary</span>
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
        <Helmet title="Add Crypto Beneficiary" />
        <div>
          <div className={styles.timelineCard}>
            <strong className="font-size-15">Select Client or Vendor Options</strong>
            <div className="pb-3 mt-3">
              <div className={styles.beneTypeBlock}>
                <Radio.Group
                  value={selectedClientOrVendor}
                  onChange={this.onChangeClientOrVendorOption}
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
                <div>
                  <div className={styles.beneTypeBlock}>
                    {selectedClientOrVendor === 'client' ? (
                      <Select
                        showSearch
                        style={{ width: '30%' }}
                        value={clientName}
                        className={styles.cstmSelectInput}
                        onSelect={(name, id) => this.onChangeSelectClient(name, id)}
                        optionLabelProp="label"
                        onFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {clientOption}
                      </Select>
                    ) : (
                      <Select
                        showSearch
                        style={{ width: '30%' }}
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
            <Spacer height="24px" />
            {vendorName !== undefined || clientName !== undefined ? (
              <div>{this.CurrencyList()}</div>
            ) : (
              ''
            )}
            <Spacer height="20px" />
            {isBeneStepCompleted && isfirstStepComplted && selectedCurrency ? (
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
                title="Crypto Wallet Details"
                columnStyle="col-sm-4 col-lg-4"
                isNextClicked={viewOrHideButton}
                handleNext={this.handleBneBankDetailsNext}
              />
            ) : (
              ''
            )}
            {beneficiaryDetailsView ? (
              <AddbankDetails
                formFields={jsondata.beneficiaryDetails}
                formProps={form}
                btnTitle={buttonTitle === 'CREATE' ? buttonTitle : ''}
                btnCancel="CANCEL"
                title="Beneficiary Details"
                columnStyle="col-sm-4 col-lg-4"
                viewCheckBox
                isNextClicked={viewOrHideButton}
                confirmBtnLoading={beneficiaryLoading}
                handleCancel={this.handleCancelCreateBene}
                inputTyping={(e, value, title) => this.handleOnchange(e, value, title)}
                onSubmitAddBeneficiary={this.handleAddCryptoBeneficiary}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </Card>
    )
  }
}

export default AddCryptoBeneficiary
