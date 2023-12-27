import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Form, Card, Row, Col, Timeline, Select, Icon, Input, Button } from 'antd'

import { amountFormatter } from 'utilities/transformer'

import {
  selectedVendor,
  getBeneficiaryByVendorId,
  updateBeneficiary,
  removeVendor,
  removeBeneficiary,
  initiateNewTransaction,
  updateDepositCurrency,
  updateDepositAmount,
  createTransaction,
} from 'redux/transactions/actions'
import { getTradeById } from 'redux/trade/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, general, chat, transactions, trade }) => ({
  beneficiaries: general.clientBeneficiaries,
  currencies: general.currencies,
  clients: general.clients,
  vendors: general.newVendors,
  token: user.token,
  email: user.email,
  chatToken: chat.token,
  selectedVendorInNew: transactions.selectedVendorInNew,
  selectedBeneficiaryInNew: transactions.selectedBeneficiaryInNew,
  sourceAmountInNew: transactions.sourceAmountInNew,
  sourceCurrencyInNew: transactions.sourceCurrencyInNew,
  tradeId: trade.tradeId,
})

@Form.create()
@connect(mapStateToProps)
export class NewTransaction extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(initiateNewTransaction())
  }

  componentDidUpdate() {
    const { tradeConfirmed, tradeId, token } = this.props
    if (tradeConfirmed) {
      getTradeById(tradeId, token)
    }
  }

  handleVendorChange = value => {
    const { vendors, dispatch, token } = this.props
    const vendorSelected = vendors.filter(item => item.id === value)
    dispatch(selectedVendor(vendorSelected[0]))
    dispatch(getBeneficiaryByVendorId(value, token))
  }

  removeSelectedVendor = () => {
    const { form, dispatch } = this.props
    form.setFieldsValue({
      sourceAmountInNew: '',
      sourceCurrencyInNew: '',
    })
    dispatch(removeVendor())
  }

  handlBeneficiaryChange = value => {
    const { beneficiaries, dispatch } = this.props
    const beneSelected = beneficiaries.filter(item => item.id === value)
    dispatch(updateBeneficiary(beneSelected[0]))
  }

  removeSelectedBeneficiary = () => {
    const { dispatch } = this.props
    dispatch(removeBeneficiary())
  }

  handleSourceCurrencyChange = value => {
    const { dispatch } = this.props
    dispatch(updateDepositCurrency(value))
  }

  handleSourceAmountChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(updateDepositAmount(value ? parseFloat(value) : null))
  }

  onBlurHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      sourceAmountInNew: amountFormatter(value),
    })
  }

  onFocusHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      sourceAmountInNew: value,
    })
  }

  //   onAccountPreferenceChange = e => {
  //     const { dispatch } = this.props
  //     dispatch(updateAccountPreference(e.target.value))
  //   }

  handleConfirmTransaction = () => {
    const {
      sourceAmountInNew,
      sourceCurrencyInNew,
      depositsInCorporateAccount,
      depositsInPersonalAccount,
      selectedBeneficiaryInNew,
      selectedVendorInNew,
      email,
      chatToken,
      token,
      dispatch,
    } = this.props

    const value = {
      sourceAmountInNew,
      sourceCurrencyInNew,
      selectedBeneficiaryInNew,
      selectedVendorInNew,
      depositsInCorporateAccount,
      depositsInPersonalAccount,
      email,
      chatToken,
    }
    dispatch(createTransaction(value, token))
  }

  render() {
    const {
      form,
      vendors,
      currencies,
      beneficiaries,
      selectedVendorInNew,
      sourceAmountInNew,
      sourceCurrencyInNew,
      depositAccountPreference,
      selectedBeneficiaryInNew,
      loading,
    } = this.props

    const currencyOption = currencies.map(currency => {
      return (
        <Option key={currency.id} value={currency.value}>
          {currency.value}
        </Option>
      )
    })

    const beneficiaryOption = beneficiaries.map(bene => {
      return (
        <Option key={bene.id}>
          <div className="list-card">
            <h5>{bene.beneficiaryDetails.beneName}</h5>
            <div>
              <small>{bene.bankAccountDetails.bankAccountCurrency}</small>
            </div>
          </div>
        </Option>
      )
    })

    const vendorOption = vendors.map(vendor => {
      return (
        <Option key={vendor.id}>
          <div className="list-card">
            <h5>{vendor.vendorName}</h5>
            <div>
              <small>{vendor.vendorType}</small>
            </div>
          </div>
        </Option>
      )
    })

    const SuccessIcon = (
      <Icon
        type="check-circle"
        style={{ fontSize: '16px' }}
        theme="twoTone"
        twoToneColor="#52c41a"
      />
    )

    return (
      <Card>
        <Helmet title="Trade" />
        <div className="trade">
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 24 }}>
              <div className="mb-3">
                <div className={`utils__title utils__title--flat mb-3 ${styles.tradeHeader}`}>
                  <strong className="text-uppercase font-size-16">New Transaction</strong>
                </div>
                <div>
                  <Timeline>
                    <Timeline.Item
                      dot={Object.entries(selectedVendorInNew).length !== 0 ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Vendors:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Vendor</span>
                          </div>
                          <div>
                            {Object.entries(selectedVendorInNew).length === 0 &&
                            selectedVendorInNew.constructor === Object ? (
                              <Form.Item label="">
                                {form.getFieldDecorator('client', {
                                  initialValue: '',
                                })(
                                  <Select
                                    className={styles.singleInput}
                                    onChange={this.handleVendorChange}
                                  >
                                    {vendorOption}
                                  </Select>,
                                )}
                              </Form.Item>
                            ) : (
                              <div
                                className={`${styles.flexSpaceBetween} ${styles.listCard} ${styles.singleInput}`}
                              >
                                <div>
                                  <h6>
                                    {selectedVendorInNew
                                      ? selectedVendorInNew.registeredCompanyName.tradingName
                                      : ''}
                                  </h6>
                                  <div>
                                    <small>
                                      {selectedVendorInNew
                                        ? selectedVendorInNew.registeredCompanyName.clientName
                                        : ''}
                                    </small>
                                  </div>
                                  <div className={styles.flexSpaceBetween}>
                                    {selectedVendorInNew.entityType ? (
                                      <small> Type : {selectedVendorInNew.entityType}</small>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                                <div style={{ alignItems: 'center', cursor: 'pointer' }}>
                                  <Icon onClick={this.removeSelectedVendor} type="close" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={depositAccountPreference === ''}
                      dot={sourceCurrencyInNew && sourceAmountInNew ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Source:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select deposit currency and amount</span>
                          </div>
                          <div className={styles.flex}>
                            <Form.Item label="">
                              {form.getFieldDecorator('sourceCurrencyInNew', {
                                initialValue: '',
                              })(
                                <Select
                                  className={styles.srcCcyLayout}
                                  onChange={this.handleSourceCurrencyChange}
                                >
                                  {currencyOption}
                                </Select>,
                              )}
                            </Form.Item>
                            <Form.Item className={`${styles.mt1}`} label="">
                              {form.getFieldDecorator('sourceAmountInNew', {
                                initialValue: '',
                              })(
                                <Input
                                  className={styles.srcAmntLayout}
                                  onChange={this.handleSourceAmountChange}
                                  onBlur={() => this.onBlurHandler(sourceAmountInNew)}
                                  onFocus={() => this.onFocusHandler(sourceAmountInNew)}
                                />,
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={(sourceCurrencyInNew && sourceAmountInNew) === ''}
                      dot={Object.entries(selectedBeneficiaryInNew).length !== 0 ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Beneficiary:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select beneficiary</span>
                          </div>
                          {Object.entries(selectedBeneficiaryInNew).length === 0 &&
                          selectedBeneficiaryInNew.constructor === Object ? (
                            <Select
                              className={styles.singleInput}
                              defaultValue="Beneficiary"
                              onChange={this.handlBeneficiaryChange}
                            >
                              {beneficiaryOption}
                            </Select>
                          ) : (
                            <div
                              className={`${styles.flexSpaceBetween} ${styles.listCard} ${styles.singleInput}`}
                            >
                              <div>
                                <h6>
                                  {selectedBeneficiaryInNew
                                    ? selectedBeneficiaryInNew.beneficiaryDetails.beneName
                                    : ''}
                                </h6>
                                <div>
                                  <small>
                                    {selectedBeneficiaryInNew
                                      ? selectedBeneficiaryInNew.bankAccountDetails
                                          .bankAccountCurrency
                                      : ''}
                                  </small>
                                </div>
                                <div className={styles.flexSpaceBetween}>
                                  {selectedBeneficiaryInNew.bankAccountDetails.accountNumber ? (
                                    <small>
                                      {' '}
                                      Account Number :{' '}
                                      {selectedBeneficiaryInNew.bankAccountDetails.accountNumber}
                                    </small>
                                  ) : (
                                    ''
                                  )}
                                </div>
                                <div>
                                  {selectedBeneficiaryInNew.bankAccountDetails.bicswift ? (
                                    <small>
                                      {' '}
                                      Bic Swift :{' '}
                                      {selectedBeneficiaryInNew.bankAccountDetails.bicswift}
                                    </small>
                                  ) : (
                                    ''
                                  )}
                                </div>
                                <div>
                                  <small>
                                    {selectedBeneficiaryInNew.bankAccountDetails.bankName
                                      ? `Bank : ${selectedBeneficiaryInNew.bankAccountDetails.bankName}`
                                      : ''}
                                  </small>
                                </div>
                              </div>
                              <div style={{ alignItems: 'center', cursor: 'pointer' }}>
                                <Icon onClick={this.removeSelectedBeneficiary} type="close" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button type="deafult" className="mb-3 mr-3">
                          Cancel
                        </Button>
                        <Button
                          loading={loading}
                          type="primary"
                          className="mb-3"
                          onClick={this.handleConfirmTransaction}
                        >
                          Confirm Trade
                        </Button>
                      </div>
                    </Timeline.Item>
                  </Timeline>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    )
  }
}
export default NewTransaction
