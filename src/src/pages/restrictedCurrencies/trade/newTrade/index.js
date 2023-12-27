import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Form, Card, Row, Col, Timeline, Select, Icon, Input, Button, Radio, Spin } from 'antd'

import { amountFormatter } from 'utilities/transformer'

import {
  getIntroducers,
  getMerchants,
  getIntroducerClients,
  getMerchantClients,
} from 'redux/general/actions'
import {
  updateIntroducerOrMerchant,
  updateSelectedIntroducer,
  removeIntroducer,
  updateSelectedMerchant,
  removeMerchant,
  updateIntroducerClient,
  removeIntroducerClient,
  updateMerchantClient,
  removeMerchantClient,
  getBeneficiaryByClientId,
  updateAccountPreference,
  updateBeneficiary,
  removeBeneficiary,
  initiateNewTrade,
  updateDepositCurrency,
  updateSourceAmount,
  createTrade,
  handleSettlementPref,
  handleSettlementPrefAsCrypto,
  handleSettlementPrefAsFiat,
  getCryptoBeneficiaryByClientId,
} from 'redux/restrictedCurrencies/trade/newTrade/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, general, npChat, npNewTrade, npTrade }) => ({
  beneficiaries: general.clientBeneficiaries,
  introducers: general.introducers,
  merchants: general.merchants,
  clients: general.clients,
  merchantClients: general.merchantClients,
  introducerClients: general.introducerClients,
  token: user.token,
  email: user.email,
  chatToken: npChat.token,
  introducerOrMerchant: npNewTrade.introducerOrMerchant,
  selectedIntroducer: npNewTrade.selectedIntroducer,
  selectedMerchant: npNewTrade.selectedMerchant,
  selectedIntroducerClient: npNewTrade.selectedIntroducerClient,
  selectedMerchantClient: npNewTrade.selectedMerchantClient,
  sourceAmount: npNewTrade.sourceAmount,
  sourceCurrency: npNewTrade.sourceCurrency,
  depositAccountPreference: npNewTrade.depositAccountPreference,
  depositsInCorporateAccount: npNewTrade.depositsInCorporateAccount,
  depositsInPersonalAccount: npNewTrade.depositsInPersonalAccount,
  selectedBeneficiary: npNewTrade.selectedBeneficiary,
  tradeConfirmed: npNewTrade.tradeConfirmed,
  canShowIntroducerClient: npNewTrade.canShowIntroducerClient,
  canShowMerchantClient: npNewTrade.canShowMerchantClient,
  loading: npNewTrade.loading,
  tradeId: npTrade.tradeId,
  isSettlementPreferenceSelected: npNewTrade.isSettlementPreferenceSelected,
  introducerOrMerchantProfile: npNewTrade.introducerOrMerchantProfile,
  isCrypto: npNewTrade.isCrypto,
  isBeneficiaryFetching: npNewTrade.isBeneficiaryFetching,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
export class NewTrade extends Component {
  componentDidMount() {
    const { form, dispatch } = this.props
    dispatch(initiateNewTrade())
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  // componentDidUpdate() {
  //   const { token, tradeConfirmed, tradeId } = this.props
  //   if (tradeConfirmed) {
  //     getTradeById(tradeId, token)
  //   }
  // }

  onChangeIntroducerOrMerchant = e => {
    const { dispatch, token } = this.props
    dispatch(updateIntroducerOrMerchant(e.target.value))
    if (e.target.value === 'merchant') {
      dispatch(getMerchants(token))
    } else {
      dispatch(getIntroducers(token))
    }
  }

  handleIntroducerChange = value => {
    const { clients, dispatch, token, form } = this.props
    const clientSelected = clients.find(item => item.id === value)
    if (clientSelected) {
      if (clientSelected.genericInformation.hasPartnerCompanies) {
        dispatch(getIntroducerClients(clientSelected.id, token))
      } else {
        dispatch(getBeneficiaryByClientId(clientSelected.id, token))
      }
      dispatch(updateSelectedIntroducer(clientSelected))
    }
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  handleMerchantChange = value => {
    const { clients, dispatch, token, form } = this.props
    const clientSelected = clients.find(item => item.id === value)
    if (clientSelected) {
      if (clientSelected.genericInformation.hasPartnerCompanies) {
        dispatch(getMerchantClients(clientSelected.id, token))
      }
      if (clientSelected.profile.settlementPreferences.length === 1) {
        if (clientSelected.profile.settlementPreferences[0] === 'crypto') {
          dispatch(getCryptoBeneficiaryByClientId(clientSelected.id, token))
        } else {
          dispatch(getBeneficiaryByClientId(clientSelected.id, token))
        }
      }

      dispatch(updateSelectedMerchant(clientSelected))
    }
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  handleIntroducerClientChange = value => {
    const { clients, token, dispatch, form } = this.props
    const clientSelected = clients.find(item => item.id === value)
    if (clientSelected) {
      // dispatch(getIntroducerClients(clientSelected.id, token))
      dispatch(updateIntroducerClient(clientSelected))
      // dispatch(getBeneficiaryByClientId(clientSelected.id, token))
      if (clientSelected.profile.settlementPreferences.length === 1) {
        if (clientSelected.profile.settlementPreferences[0] === 'crypto') {
          dispatch(getCryptoBeneficiaryByClientId(clientSelected.id, token))
        } else {
          dispatch(getBeneficiaryByClientId(clientSelected.id, token))
        }
      }
    }
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  handleMerchantClientChange = value => {
    const { clients, dispatch, form } = this.props
    const clientSelected = clients.find(item => item.id === value)
    if (clientSelected) {
      // dispatch(getMerchantClients(clientSelected.id, token))
      dispatch(updateMerchantClient(clientSelected))
      // dispatch(getBeneficiaryByClientId(clientSelected.id, token))
    }
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  removeSelectedIntroducer = () => {
    const { form, dispatch } = this.props
    dispatch(removeIntroducer())
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  removeSelectedMerchant = () => {
    const { dispatch, form } = this.props
    dispatch(removeMerchant())
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  removeSelectedIntroducerClient = () => {
    const { dispatch, form } = this.props
    dispatch(removeIntroducerClient())
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  removeSelectedMerchantClient = () => {
    const { dispatch, form } = this.props
    dispatch(removeMerchantClient())
    form.setFieldsValue({
      sourceCurrency: '',
      sourceAmount: '',
    })
  }

  handleBeneficiaryChange = value => {
    const { beneficiaries, dispatch } = this.props
    const beneSelected = beneficiaries.find(item => item.id === value)
    dispatch(updateBeneficiary(beneSelected))
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
    dispatch(updateSourceAmount(value ? parseFloat(value) : null))
  }

  onBlurHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      sourceAmount: amountFormatter(value),
    })
  }

  onFocusHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      sourceAmount: value,
    })
  }

  onAccountPreferenceChange = e => {
    const { dispatch } = this.props
    dispatch(updateAccountPreference(e.target.value))
  }

  handleConfirmTrade = () => {
    const {
      introducerOrMerchant,
      selectedIntroducer,
      selectedMerchant,
      selectedIntroducerClient,
      selectedMerchantClient,
      sourceAmount,
      sourceCurrency,
      depositsInCorporateAccount,
      depositsInPersonalAccount,
      selectedBeneficiary,
      email,
      chatToken,
      token,
      isCrypto,
      dispatch,
    } = this.props

    const getClientId = () => {
      switch (introducerOrMerchant) {
        case 'introducer':
          if (selectedIntroducer.genericInformation.hasPartnerCompanies) {
            return selectedIntroducerClient.id
          }
          return selectedIntroducer.id

        case 'merchant':
          if (selectedMerchant.genericInformation.hasPartnerCompanies) {
            return selectedMerchantClient.id
          }
          return selectedMerchant.id

        default:
          return ''
      }
    }

    const getClientName = () => {
      switch (introducerOrMerchant) {
        case 'introducer':
          if (selectedIntroducer.genericInformation.hasPartnerCompanies) {
            return selectedIntroducerClient.tradingName
          }
          return selectedIntroducer.tradingName

        case 'merchant':
          if (selectedMerchant.genericInformation.hasPartnerCompanies) {
            return selectedMerchantClient.tradingName
          }
          return selectedMerchant.tradingName

        default:
          return ''
      }
    }

    const getParentId = () => {
      switch (introducerOrMerchant) {
        case 'introducer':
          if (selectedIntroducer.genericInformation.hasPartnerCompanies) {
            return selectedIntroducer.id
          }
          return selectedIntroducer.id

        case 'merchant':
          if (selectedMerchant.genericInformation.hasPartnerCompanies) {
            return selectedMerchant.id
          }
          return selectedMerchant.id

        default:
          return ''
      }
    }

    const getParentName = () => {
      switch (introducerOrMerchant) {
        case 'introducer':
          if (selectedIntroducer.genericInformation.hasPartnerCompanies) {
            return selectedIntroducer.tradingName
          }
          return selectedIntroducer.tradingName

        case 'merchant':
          if (selectedMerchant.genericInformation.hasPartnerCompanies) {
            return selectedMerchant.tradingName
          }
          return selectedMerchant.tradingName

        default:
          return ''
      }
    }

    const type = isCrypto ? 'crypto' : 'fiat'

    const value = {
      parentId: getParentId(),
      parentName: getParentName(),
      clientId: getClientId(),
      clientName: getClientName(),
      sourceAmount,
      sourceCurrency,
      selectedBeneficiary,
      depositsInCorporateAccount,
      depositsInPersonalAccount,
      email,
      chatToken,
      type,
    }
    dispatch(createTrade(value, token))
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/np-trades')
  }

  handleSettlementPreference = value => {
    const {
      token,
      introducerOrMerchant,
      selectedIntroducer,
      selectedMerchant,
      dispatch,
    } = this.props
    const client = introducerOrMerchant === 'introducer' ? selectedIntroducer : selectedMerchant

    if (value.target.value === 'crypto') {
      dispatch(handleSettlementPrefAsCrypto(true))
      dispatch(getCryptoBeneficiaryByClientId(client.id, token))
    }
    if (value.target.value === 'fiat') {
      dispatch(handleSettlementPrefAsFiat())
      dispatch(getBeneficiaryByClientId(client.id, token))
    }
    dispatch(handleSettlementPref(true))
  }

  canShowSettlePreference = () => {
    const { introducerOrMerchantProfile, dispatch } = this.props
    if (introducerOrMerchantProfile) {
      if (introducerOrMerchantProfile.settlementPreferences.length === 1) {
        if (introducerOrMerchantProfile.settlementPreferences[0] === 'crypto') {
          dispatch(handleSettlementPrefAsCrypto(true))
          // dispatch(getCryptoBeneficiaryByClientId(client.id, token))
        }
        // else {
        //   dispatch(getBeneficiaryByClientId(client.id, token))
        // }
        dispatch(handleSettlementPref(true))
        return false
      }
      return true
    }

    return false
  }

  render() {
    const {
      form,
      introducerOrMerchant,
      introducers,
      selectedIntroducer,
      selectedIntroducerClient,
      selectedMerchantClient,
      merchants,
      selectedMerchant,
      introducerClients,
      merchantClients,
      beneficiaries,
      sourceAmount,
      sourceCurrency,
      depositAccountPreference,
      selectedBeneficiary,
      canShowIntroducerClient,
      canShowMerchantClient,
      loading,
      isSettlementPreferenceSelected,
      introducerOrMerchantProfile,
      isBeneficiaryFetching,
      isCrypto,
    } = this.props

    const getBeneficiary = () => {
      if (isCrypto) {
        return beneficiaries.map(bene => {
          return (
            <Option key={bene.id}>
              <div className="list-card">
                <h5>{bene.aliasName && bene.aliasName}</h5>
                <div>
                  <small>{bene.cryptoCurrency && bene.cryptoCurrency}</small>
                </div>
                <div>
                  <small>
                    {bene.cryptoWalletAddress && `Wallet Address: ${bene.cryptoWalletAddress}`}
                  </small>
                </div>
              </div>
            </Option>
          )
        })
      }
      return beneficiaries.map(bene => {
        return (
          <Option key={bene.id}>
            <div className="list-card">
              <h5>{bene.bankAccountDetails && bene.bankAccountDetails.nameOnAccount}</h5>
              <div>
                <small>
                  {bene.bankAccountDetails && bene.bankAccountDetails.bankAccountCurrency}
                </small>
              </div>
              <div>
                <small>
                  {bene.bankAccountDetails &&
                    `Account Number: ${bene.bankAccountDetails.accountNumber}`}
                </small>
              </div>
            </div>
          </Option>
        )
      })
    }

    const introducerOption = introducers.map(client => {
      return (
        <Option key={client.id}>
          <div className="list-card">
            <h5>{client.genericInformation.tradingName}</h5>
            <div>
              <small>{client.genericInformation.registeredCompanyName}</small>
            </div>
          </div>
        </Option>
      )
    })

    const merchantOption = merchants.map(client => {
      return (
        <Option key={client.id}>
          <div className="list-card">
            <h5>{client.genericInformation.tradingName}</h5>
            <div>
              <small>{client.genericInformation.registeredCompanyName}</small>
            </div>
          </div>
        </Option>
      )
    })

    const introducerClientOption = introducerClients.map(client => {
      return (
        <Option key={client.id}>
          <div className="list-card">
            <h5>{client.genericInformation.tradingName}</h5>
            <div>
              <small>{client.genericInformation.registeredCompanyName}</small>
            </div>
          </div>
        </Option>
      )
    })

    const merchantClientOption = merchantClients.map(client => {
      return (
        <Option key={client.id}>
          <div className="list-card">
            <h5>{client.genericInformation.tradingName}</h5>
            <div>
              <small>{client.genericInformation.registeredCompanyName}</small>
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

    const canShowAccountPreference = () => {
      switch (introducerOrMerchant) {
        case 'introducer':
          if (canShowIntroducerClient) {
            return Object.entries(selectedIntroducerClient).length === 0
          }
          return Object.entries(selectedIntroducer).length === 0

        case 'merchant':
          if (canShowMerchantClient) {
            return Object.entries(selectedMerchantClient).length === 0
          }
          return Object.entries(selectedMerchant).length === 0

        default:
          return true
      }
    }

    const getPersonalAccontBoolean = () => {
      switch (introducerOrMerchant) {
        case 'introducer':
          if (canShowIntroducerClient) {
            return selectedIntroducerClient.isPersonalAccount
          }
          return selectedIntroducer.isPersonalAccount

        case 'merchant':
          if (canShowMerchantClient) {
            return selectedMerchantClient.isPersonalAccount
          }
          return selectedMerchant.isPersonalAccount

        default:
          return true
      }
    }

    const getCurrencies = () => {
      if (introducerOrMerchantProfile) {
        const currencies = [
          ...introducerOrMerchantProfile.currencyPreferences.depositCurrencies,
          ...introducerOrMerchantProfile.cryptoCurrencyPreferences.depositCurrencies,
        ]
        return currencies.map((currency, index) => {
          const key = index + 1000
          return (
            <Option key={key} value={currency}>
              {currency}
            </Option>
          )
        })
      }
      return null
    }

    const getCorporateAccontBoolean = () => {
      switch (introducerOrMerchant) {
        case 'introducer':
          if (canShowIntroducerClient) {
            return selectedIntroducerClient.isCorporateAccount
          }
          return selectedIntroducer.isCorporateAccount

        case 'merchant':
          if (canShowMerchantClient) {
            return selectedMerchantClient.isCorporateAccount
          }
          return selectedMerchant.isCorporateAccount

        default:
          return true
      }
    }

    return (
      <Card
        title="New Trade"
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
      >
        <Helmet title="New Trade" />
        <div className="trade">
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 24 }}>
              <div className="mb-3">
                {/* <div className={`utils__title utils__title--flat mb-3 ${styles.tradeHeader}`}>
                  <strong className="text-uppercase font-size-16">New Trade</strong>
                </div> */}
                <div>
                  <Timeline>
                    <Timeline.Item dot={introducerOrMerchant !== '' ? SuccessIcon : ''}>
                      <div className={styles.processSection}>
                        <strong className="font-size-15">
                          Select Introducer or Client for the Trade:
                        </strong>
                        <div className={styles.prgressContent}>
                          <div>
                            <Radio.Group
                              value={introducerOrMerchant}
                              onChange={this.onChangeIntroducerOrMerchant}
                            >
                              <Radio value="introducer">Introducer</Radio>
                              <Radio value="merchant">Merchant</Radio>
                            </Radio.Group>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      dot={Object.entries(selectedIntroducer).length !== 0 ? SuccessIcon : ''}
                      hidden={introducerOrMerchant === 'merchant' || introducerOrMerchant === ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Introducer:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Introducer</span>
                          </div>
                          <div>
                            {Object.entries(selectedIntroducer).length === 0 &&
                            selectedIntroducer.constructor === Object ? (
                              <Form.Item label="">
                                {form.getFieldDecorator('introducer', {
                                  initialValue: '',
                                })(
                                  <Select
                                    className={styles.singleInput}
                                    onChange={this.handleIntroducerChange}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.props.children.props.children[0].props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                  >
                                    {introducerOption}
                                  </Select>,
                                )}
                              </Form.Item>
                            ) : (
                              <div
                                className={`${styles.flexSpaceBetween} ${styles.listCard} ${styles.singleInput}`}
                              >
                                <div>
                                  <h6>
                                    {selectedIntroducer ? selectedIntroducer.tradingName : ''}
                                  </h6>
                                  <div>
                                    <small>
                                      {selectedIntroducer
                                        ? selectedIntroducer.registeredCompanyName
                                        : ''}
                                    </small>
                                  </div>
                                  <div className={styles.flexSpaceBetween}>
                                    {selectedIntroducer.entityType ? (
                                      <small> Type : {selectedIntroducer.entityType}</small>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                                <div style={{ alignItems: 'center', cursor: 'pointer' }}>
                                  <Icon onClick={this.removeSelectedIntroducer} type="close" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      dot={Object.entries(selectedMerchant).length !== 0 ? SuccessIcon : ''}
                      hidden={introducerOrMerchant === 'introducer' || introducerOrMerchant === ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Merchant:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Merchant</span>
                          </div>
                          <div>
                            {Object.entries(selectedMerchant).length === 0 &&
                            selectedMerchant.constructor === Object ? (
                              <Form.Item label="">
                                {form.getFieldDecorator('merchant', {
                                  initialValue: '',
                                })(
                                  <Select
                                    className={styles.singleInput}
                                    onChange={this.handleMerchantChange}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.props.children.props.children[0].props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                  >
                                    {merchantOption}
                                  </Select>,
                                )}
                              </Form.Item>
                            ) : (
                              <div
                                className={`${styles.flexSpaceBetween} ${styles.listCard} ${styles.singleInput}`}
                              >
                                <div>
                                  <h6>{selectedMerchant ? selectedMerchant.tradingName : ''}</h6>
                                  <div>
                                    <small>
                                      {selectedMerchant
                                        ? selectedMerchant.registeredCompanyName
                                        : ''}
                                    </small>
                                  </div>
                                  <div className={styles.flexSpaceBetween}>
                                    {selectedMerchant.entityType ? (
                                      <small> Type : {selectedMerchant.entityType}</small>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                                <div style={{ alignItems: 'center', cursor: 'pointer' }}>
                                  <Icon onClick={this.removeSelectedMerchant} type="close" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={!canShowIntroducerClient}
                      dot={Object.entries(selectedIntroducerClient).length !== 0 ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Introducer&apos;s Client:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Introducer&apos;s Client</span>
                          </div>
                          <div>
                            {Object.entries(selectedIntroducerClient).length === 0 &&
                            selectedIntroducerClient.constructor === Object ? (
                              <Form.Item className={`${styles.mt1}`} label="">
                                {form.getFieldDecorator('intoducersClient', {
                                  initialValue: '',
                                })(
                                  <Select
                                    className={styles.singleInput}
                                    onChange={this.handleIntroducerClientChange}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.props.children.props.children[0].props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                  >
                                    {introducerClientOption}
                                  </Select>,
                                )}
                              </Form.Item>
                            ) : (
                              <div
                                className={`${styles.flexSpaceBetween} ${styles.listCard} ${styles.singleInput}`}
                              >
                                <div>
                                  <h6>
                                    {selectedIntroducerClient
                                      ? selectedIntroducerClient.tradingName
                                      : ''}
                                  </h6>
                                  <div>
                                    <small>
                                      {selectedIntroducerClient
                                        ? selectedIntroducerClient.registeredCompanyName
                                        : ''}
                                    </small>
                                  </div>
                                  <div className={styles.flexSpaceBetween}>
                                    {selectedIntroducerClient.entityType ? (
                                      <small> Type : {selectedIntroducerClient.entityType}</small>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                                <div style={{ alignItems: 'center', cursor: 'pointer' }}>
                                  <Icon
                                    onClick={this.removeSelectedIntroducerClient}
                                    type="close"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={!canShowMerchantClient}
                      dot={Object.entries(selectedMerchantClient).length !== 0 ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Merchant&apos;s Client:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Merchant&apos;s Client</span>
                          </div>
                          <div>
                            {Object.entries(selectedMerchantClient).length === 0 &&
                            selectedMerchantClient.constructor === Object ? (
                              <Form.Item className={`${styles.mt1}`} label="">
                                {form.getFieldDecorator('merchantsClient', {
                                  initialValue: '',
                                })(
                                  <Select
                                    className={styles.singleInput}
                                    onChange={this.handleMerchantClientChange}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      option.props.children.props.children[0].props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                  >
                                    {merchantClientOption}
                                  </Select>,
                                )}
                              </Form.Item>
                            ) : (
                              <div
                                className={`${styles.flexSpaceBetween} ${styles.listCard} ${styles.singleInput}`}
                              >
                                <div>
                                  <h6>
                                    {selectedMerchantClient
                                      ? selectedMerchantClient.tradingName
                                      : ''}
                                  </h6>
                                  <div>
                                    <small>
                                      {selectedMerchantClient
                                        ? selectedMerchantClient.registeredCompanyName
                                        : ''}
                                    </small>
                                  </div>
                                  <div className={styles.flexSpaceBetween}>
                                    {selectedMerchantClient.entityType ? (
                                      <small> Type : {selectedMerchantClient.entityType}</small>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                                <div style={{ alignItems: 'center', cursor: 'pointer' }}>
                                  <Icon onClick={this.removeSelectedMerchantClient} type="close" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={canShowAccountPreference()}
                      dot={depositAccountPreference !== '' ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Account Preference:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Local deposit account preference</span>
                          </div>
                          <Radio.Group
                            onChange={this.onAccountPreferenceChange}
                            value={depositAccountPreference}
                          >
                            <Radio value="PersonalAccount" hidden={!getPersonalAccontBoolean}>
                              Personal Account
                            </Radio>
                            <Radio value="CorporateAccount" hidden={!getCorporateAccontBoolean}>
                              Corporate Account
                            </Radio>
                          </Radio.Group>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={depositAccountPreference === ''}
                      dot={sourceCurrency && sourceAmount ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Source:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select deposit currency and amount</span>
                          </div>
                          <div className={styles.flex}>
                            <Form.Item label="">
                              {form.getFieldDecorator('sourceCurrency', {
                                initialValue: '',
                              })(
                                <Select
                                  className={styles.srcCcyLayout}
                                  onChange={this.handleSourceCurrencyChange}
                                  showSearch
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {getCurrencies()}
                                </Select>,
                              )}
                            </Form.Item>
                            <Form.Item className={`${styles.mt1}`} label="">
                              {form.getFieldDecorator('sourceAmount', {
                                initialValue: '',
                              })(
                                <Input
                                  className={styles.srcAmntLayout}
                                  onChange={this.handleSourceAmountChange}
                                  onBlur={() => this.onBlurHandler(sourceAmount)}
                                  onFocus={() => this.onFocusHandler(sourceAmount)}
                                />,
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={
                        !((sourceCurrency && sourceAmount) !== '' && this.canShowSettlePreference())
                      }
                      dot={isSettlementPreferenceSelected ? SuccessIcon : ''}
                    >
                      <div className="pb-3">
                        <span className="font-size-12">Settlement Preference</span>
                      </div>
                      <Radio.Group onChange={this.handleSettlementPreference}>
                        <Radio value="crypto">Crypto</Radio>
                        <Radio value="fiat">Fiat</Radio>
                      </Radio.Group>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={!isSettlementPreferenceSelected}
                      dot={Object.entries(selectedBeneficiary).length !== 0 ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Beneficiary:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select beneficiary</span>
                          </div>
                          {Object.entries(selectedBeneficiary).length === 0 &&
                          selectedBeneficiary.constructor === Object ? (
                            <Spin tip="Fetching Beneficiary..." spinning={isBeneficiaryFetching}>
                              <Select
                                className={styles.singleInput}
                                defaultValue="Beneficiary"
                                onChange={this.handleBeneficiaryChange}
                              >
                                {getBeneficiary()}
                              </Select>
                            </Spin>
                          ) : (
                            <div
                              className={`${styles.flexSpaceBetween} ${styles.listCard} ${styles.singleInput}`}
                            >
                              <div>
                                <h6>
                                  {selectedBeneficiary.bankAccountDetails
                                    ? selectedBeneficiary.bankAccountDetails.nameOnAccount
                                    : ''}
                                  {selectedBeneficiary.aliasName
                                    ? selectedBeneficiary.aliasName
                                    : ''}
                                </h6>
                                <div>
                                  <small>
                                    {selectedBeneficiary.cryptoCurrency
                                      ? `Crypto Currency : ${selectedBeneficiary.cryptoCurrency}`
                                      : ''}
                                    {selectedBeneficiary.bankAccountDetails
                                      ? `Currency : ${selectedBeneficiary.bankAccountDetails.bankAccountCurrency}`
                                      : ''}
                                  </small>
                                </div>
                                <div className={styles.flexSpaceBetween}>
                                  {selectedBeneficiary.cryptoWalletAddress ? (
                                    <small>
                                      {' '}
                                      Crypto Wallet Address :{' '}
                                      {selectedBeneficiary.cryptoWalletAddress}
                                    </small>
                                  ) : (
                                    ''
                                  )}
                                  {selectedBeneficiary.bankAccountDetails ? (
                                    <small>
                                      {' '}
                                      Account Number :{' '}
                                      {selectedBeneficiary.bankAccountDetails.accountNumber}
                                    </small>
                                  ) : (
                                    ''
                                  )}
                                </div>
                                <div>
                                  {selectedBeneficiary.bankAccountDetails ? (
                                    <small>
                                      {' '}
                                      Bic Swift : {selectedBeneficiary.bankAccountDetails.bicswift}
                                    </small>
                                  ) : (
                                    ''
                                  )}
                                </div>
                                <div>
                                  <small>
                                    {selectedBeneficiary.bankAccountDetails
                                      ? `Bank : ${selectedBeneficiary.bankAccountDetails.bankName}`
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
                        <Button type="deafult" className="mb-3 mr-3" onClick={this.onCancelHandler}>
                          Cancel
                        </Button>
                        <Button
                          loading={loading}
                          type="primary"
                          className="mb-3"
                          onClick={this.handleConfirmTrade}
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
export default NewTrade
