import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, Collapse, Divider, Button, Empty } from 'antd'
import Text from 'components/customComponents/Text'
import { validateDataWithNoErrors, amountFormatter } from 'utilities/transformer'
import CardList from './components/cardList'
import { getCountriesList, getSplitCurrencies } from './transformer'

import styles from './style.module.scss'

const { Panel } = Collapse

const mapStateToProps = ({ clientManagement }) => ({
  operationalInformation: clientManagement.operationalInformation,
  selectedPayconstructProducts: clientManagement.selectedPayconstructProducts,

  exoticFX: clientManagement.exoticFX,
  ecommercePayment: clientManagement.ecommercePayment,
  foreignExchange: clientManagement.foreignExchange,
  globalAccounts: clientManagement.globalAccounts,
})

@connect(mapStateToProps)
class OperationalInformation extends Component {
  state = {
    textEmpty: '--',
  }

  panelTitle = (
    <div className={styles.panel__header}>
      <Text size="default">Product Specific Information - Currency Accounts</Text>
    </div>
  )

  panelTitleOne = (
    <div className={styles.panel__header}>
      <Text size="default">Product Specific Information - Restricted Currency Transfer</Text>
    </div>
  )

  currencyAccountsDetails = () => {
    const { textEmpty } = this.state
    const { operationalInformation } = this.props
    const operationInfo = validateDataWithNoErrors(operationalInformation.currencyAccount, 'object')
    return (
      <div style={{ padding: '20px' }}>
        <Text size="large-bold">Inbound</Text>
        <Row className="mt-3 mb-4">
          <Col lg={{ span: 7 }}>
            <Text>Inbound currencies required</Text>
            <br />
            <Text size="xsmall-bold">
              {validateDataWithNoErrors(operationInfo.inboundCurrencies, 'array')
                .map(inboundCurrency => {
                  const returnResp = !inboundCurrency ? textEmpty : inboundCurrency
                  return returnResp
                })
                .join('/')}
            </Text>
          </Col>
          <Col lg={{ span: 1 }}>
            <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
          </Col>
          <Col lg={{ span: 7 }}>
            <Text>Inbound value per month</Text>
            <br />
            <Text size="xsmall-bold">{operationInfo.inboundValueAmount}</Text>
          </Col>
          <Col lg={{ span: 1 }}>
            <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
          </Col>
          <Col lg={{ span: 7 }}>
            <Text>Inbound volume per month</Text>
            <br />
            <Text size="xsmall-bold">{amountFormatter(operationInfo.inboundVolumeAmount, 2)}</Text>
          </Col>
        </Row>
        <Text size="large-bold">Outbound</Text>
        <Row className="mt-3">
          <Col lg={{ span: 7 }}>
            <Text>Outbound currencies required</Text>
            <br />
            <Text size="xsmall-bold">
              {validateDataWithNoErrors(operationInfo.outboundCurrencies, 'array')
                .map(inboundCurrency => {
                  const returnResp = !inboundCurrency ? textEmpty : inboundCurrency
                  return returnResp
                })
                .join('/')}
            </Text>
          </Col>
          <Col lg={{ span: 1 }}>
            <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
          </Col>
          <Col lg={{ span: 7 }}>
            <Text>Outbound value per month</Text>
            <br />
            <Text size="xsmall-bold">{operationInfo.outboundValueAmount}</Text>
          </Col>
          <Col lg={{ span: 1 }}>
            <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
          </Col>
          <Col lg={{ span: 7 }}>
            <Text>Outbound volume per month</Text>
            <br />
            <Text size="xsmall-bold">{amountFormatter(operationInfo.outboundVolumeAmount, 2)}</Text>
          </Col>
        </Row>
      </div>
    )
  }

  rcMarkets = () => {
    const { operationalInformation } = this.props
    const operationInfo = validateDataWithNoErrors(
      operationalInformation.restrictedCurrency.restrictedCurrencyMarkets,
      'array',
    )
    const remittanceTrue = (
      <Button icon="check-circle" shape="round" className={styles.ccremittancetrue}>
        Remittance Service
      </Button>
    )
    const remittanceFalse = (
      <Button icon="close-circle" shape="round" className={styles.ccremittancefalse}>
        Remittance Service
      </Button>
    )
    return operationInfo.map(item => {
      return (
        <div key={item.id} style={{ padding: '6px' }}>
          <Card style={{ borderRadius: '7px', marginBottom: '10px' }}>
            <Text size="small">
              Restricted Currency Transfer - {item.restrictedCurrencyCurrentMarketLive}
            </Text>
            <Row className="mt-3">
              <Col lg={{ span: 6 }}>
                <Text>Avg. fiat volumes</Text>
                <br />
                <Text size="xsmall-bold">{amountFormatter(item.rctAverageFiatVolumes, 2)}</Text>
              </Col>
              <Col lg={{ span: 5 }}>
                {item.remittanceServicesRequired ? remittanceTrue : remittanceFalse}
              </Col>
            </Row>
          </Card>
        </div>
      )
    })
  }

  rcBeneficiaries = () => {
    const { operationalInformation } = this.props
    const operationInfo = validateDataWithNoErrors(
      operationalInformation.restrictedCurrency.beneficiaries,
      'array',
    )
    const remittanceTrue = (
      <Button icon="check-circle" shape="round" className={styles.ccremittancetrue}>
        Group Company
      </Button>
    )
    const remittanceFalse = (
      <Button icon="close-circle" shape="round" className={styles.ccremittancefalse}>
        Group Company
      </Button>
    )
    return operationInfo.map(item => {
      return (
        <div key={item.id} style={{ padding: '6px' }}>
          <Card style={{ borderRadius: '7px', marginBottom: '10px' }}>
            <Text size="small">Beneficiary</Text>
            <Row className="mt-3">
              <Col lg={{ span: 6 }}>
                <Text>{item.beneficiaryName}</Text>
                <br />
                <Text size="xsmall-bold">Residing Country {item.beneficiaryResidingCountry}</Text>
              </Col>
              <Col lg={{ span: 5 }}>
                {item.beneficiaryGroupCompany ? remittanceTrue : remittanceFalse}
              </Col>
            </Row>
          </Card>
        </div>
      )
    })
  }

  exoticFX = data => {
    const returnResp = []
    data.map(item => {
      const currencies = item.exoticCurrencyPair && getSplitCurrencies(item.exoticCurrencyPair)
      const formatObj = {
        content: [
          {
            label: 'Exotic Currency Pair',
            value: `${currencies[0]} - ${currencies[1]}`,
          },
          {
            label: 'Est. total monthly value of transactions',
            value: item.monthlyNumberOfTransactions,
          },
          {
            label: 'Est. average single transaction value',
            value: item.averageSingleTransactionVolume,
          },
          {
            label: 'Est. of transactions per month',
            value: item.monthlyVolumeTransactions,
          },
          {
            label: 'From which countries will you be sending these funds from',
            value: getCountriesList(item?.countriesSendingFunds),
          },
          {
            label: 'From which countries will you be sending these funds to',
            value: getCountriesList(item?.countriesReceivingFunds),
          },
        ],
      }
      return returnResp.push(formatObj)
    })
    return returnResp
  }

  ecommercePayments = data => {
    const returnResp = []
    data.map(item => {
      const formatObj = {
        content: [
          {
            label: 'Currency',
            value: item?.currency,
          },
          {
            label: `Est. total monthly deposit value in ${item?.currency}`,
            value: item.monthlyValueOfTransactions,
          },
          {
            label: `Est. av. single txn. value in ${item?.currency}`,
            value: item.averageSingleTransactionValue,
          },
          {
            label: `Est. no. of txn. per month in ${item?.currency}`,
            value: item.monthlyNumberOfTransactions,
          },
        ],
      }
      return returnResp.push(formatObj)
    })
    return returnResp
  }

  foreignExchange = data => {
    const returnResp = []
    data.map(item => {
      const currencies = item?.fxCurrencyPair && getSplitCurrencies(item?.fxCurrencyPair)
      const formatObj = {
        content: [
          {
            label: 'Currency Pair',
            value: `${currencies[0]} - ${currencies[1]}`,
          },
          {
            label: 'Est. total monthly transaction value',
            value: item.monthlyNumberOfTransactions,
          },
          {
            label: 'Est. average single transaction value',
            value: item.averageSingleTransactionValue,
          },
          {
            label: 'Est. number of transactions per month',
            value: item.monthlyValueOfTransactions,
          },
        ],
      }
      return returnResp.push(formatObj)
    })
    return returnResp
  }

  globalAccounts = (data, type) => {
    const returnResp = []
    data.map(item => {
      const formatObj = {
        content: [
          {
            label: 'Currency',
            value: item?.currency,
          },
          {
            label: `Est. total monthly payment value in ${item?.currency}`,
            value: item.monthlyValueOfTransactions,
          },
          {
            label: `Est. average single payment value in ${item?.currency}`,
            value: item.averageSingleTransactionValue,
          },
          {
            label: `Est. number of transactions per month in ${item?.currency}`,
            value: item.monthlyNumberOfTransactions,
          },
          {
            label:
              type === 'inbound' ? 'Countries sending the funds' : 'Countries receiving the funds',
            value:
              type === 'inbound'
                ? getCountriesList(item?.countriesSendingFunds)
                : getCountriesList(item?.countriesReceivingFunds),
          },
          {
            label: type === 'Payment types',
            value: getCountriesList(item?.paymentTypesRequired),
          },
        ],
      }
      return returnResp.push(formatObj)
    })
    return returnResp
  }

  render() {
    const {
      operationalInformation,
      exoticFX,
      ecommercePayment,
      foreignExchange,
      globalAccounts,
      selectedPayconstructProducts,
    } = this.props
    return (
      <React.Fragment>
        <Card>
          {selectedPayconstructProducts.includes('currency_accounts') &&
            Object.entries(
              validateDataWithNoErrors(operationalInformation.currencyAccount, 'object'),
            ).length > 0 && (
              <Collapse className={styles.pi__collapse}>
                <Panel header={this.panelTitle}>{this.currencyAccountsDetails()}</Panel>
              </Collapse>
            )}
          {selectedPayconstructProducts.includes('restricted_currencies') &&
            validateDataWithNoErrors(
              operationalInformation.restrictedCurrency.restrictedCurrencyMarkets,
              'array',
            ).length > 0 && (
              <Collapse className={styles.pi__collapse}>
                <Panel header={this.panelTitleOne}>
                  <div className="ml-3 mt-2 mb-1">
                    <Text size="small">Market specific information</Text>
                  </div>
                  {this.rcMarkets()}
                  <div className="ml-3 mt-2 mb-1">
                    <Text size="small">Beneficiaries</Text>
                  </div>
                  {this.rcBeneficiaries()}
                </Panel>
              </Collapse>
            )}
          {!selectedPayconstructProducts.includes('currency_accounts') &&
            !selectedPayconstructProducts.includes('restricted_currencies') &&
            !selectedPayconstructProducts.includes('exotic_fx') &&
            !selectedPayconstructProducts.includes('global_accounts') && (
              <div style={{ height: '80px' }}>
                <Empty
                  imageStyle={{
                    height: 40,
                  }}
                  description="No available records!"
                />
              </div>
            )}

          {/* new requirement  */}
          {selectedPayconstructProducts.includes('E-commerce_crypto_payments') && (
            <Collapse className={styles.pi__collapse}>
              <Panel header="Ecommerce Payments">
                <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                  <Text size="small">Deposits</Text>
                </div>
                <CardList contentList={this.ecommercePayments(ecommercePayment?.deposits_payins)} />
                <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                  <Text size="small">Payouts</Text>
                </div>
                <CardList contentList={this.ecommercePayments(ecommercePayment?.payouts)} />
              </Panel>
            </Collapse>
          )}

          {selectedPayconstructProducts.includes('exotic_fx') && (
            <Collapse className={styles.pi__collapse}>
              <Panel header="Exotic FX">
                <CardList contentList={this.exoticFX(exoticFX)} />
              </Panel>
            </Collapse>
          )}
          {selectedPayconstructProducts.includes('foreign_exchange') ||
            (selectedPayconstructProducts.includes('global_accounts') && (
              <Collapse className={styles.pi__collapse}>
                <Panel header="Foreign Exchange">
                  <CardList contentList={this.foreignExchange(foreignExchange)} />
                </Panel>
              </Collapse>
            ))}
          {selectedPayconstructProducts.includes('global_accounts') && (
            <Collapse className={styles.pi__collapse}>
              <Panel header="Global Accounts">
                <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                  <Text size="small">Inbound</Text>
                </div>
                <CardList contentList={this.globalAccounts(globalAccounts?.inbound, 'inbound')} />
                <div style={{ marginBottom: '15px', marginTop: '15px' }}>
                  <Text size="small">Outbound</Text>
                </div>
                <CardList contentList={this.globalAccounts(globalAccounts?.outbound, 'outbound')} />
              </Panel>
            </Collapse>
          )}
        </Card>
      </React.Fragment>
    )
  }
}

export default OperationalInformation
