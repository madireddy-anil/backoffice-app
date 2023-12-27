import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Switch, Button, InputNumber } from 'antd'

import { amountFormatter, formatToZoneDateTZFormat } from 'utilities/transformer'

import {
  enteredPCMarginPercentage,
  getTradePcMargin,
  getTradeCommision,
  updateIntroducerFee,
  changeRevenue,
  changeSettlement,
  changeDeposit,
  updateTradeDetails,
} from 'redux/trade/actions'
import styles from './style.module.scss'

const mapStateToProps = ({ user, trade, general, settings }) => ({
  token: user.token,
  clients: general.clients,
  tradeId: trade.tradeId,
  parentId: trade.parentId,
  clientId: trade.clientId,
  progressLogs: trade.progressLogs,
  introducerCommission: trade.introducerCommission,
  isEditMode: trade.isEditMode,
  depositCurrency: trade.depositCurrency,
  settlementCurrency: trade.settlementCurrency,
  totalDepositAmount: trade.totalDepositAmount,
  rateDetails: trade.rateDetails,
  pcMarginDetails: trade.pcMarginDetails,
  isCommissionFetched: trade.isCommissionFetched,
  isCommisionConfirmed: trade.isCommisionConfirmed,
  tradeFees: trade.tradeFees,
  timeZone: settings.timeZone.value,
})

@Form.create()
@connect(mapStateToProps)
class IntroducerCommision extends Component {
  getCommision = () => {
    const {
      dispatch,
      introducerCommission: { isRevenue, isSettlement, isDeposit },
      clients,
      clientId,
      parentId,
      depositCurrency,
      settlementCurrency,
      totalDepositAmount,
      rateDetails: { precision },
      pcMarginDetails: { pcMargin, pcMarginCurrency, pcPercentage },
      token,
    } = this.props

    const clientObj = clients.find(el => el.id === clientId)
    const { isInverse, isNewCalculation } = clientObj.profile.tradingPreference

    let values = {}
    if (isRevenue) {
      values = {
        pcMargin,
        percentage: pcPercentage,
        commissionType: 'onrevenue',
        pcMarginCurrency,
      }
    }
    if (isSettlement) {
      values = {
        tradeAmount: totalDepositAmount,
        IsInverse: isInverse || true,
        clientId,
        introducerId: parentId,
        fxRate: 8.75,
        targetCurrency: settlementCurrency,
        tradeCurrency: depositCurrency,
        commissionType: 'onsettlementamount',
        isNewCalculation: isNewCalculation || true,
        precision,
      }
    }
    if (isDeposit) {
      values = {
        tradeAmount: totalDepositAmount,
        IsInverse: isInverse || true,
        clientId,
        introducerId: parentId,
        fxRate: 8.75,
        tradeCurrency: depositCurrency,
        targetCurrency: settlementCurrency,
        commissionType: 'ontradeamount',
        isNewCalculation: isNewCalculation || true,
        precision,
      }
    }
    dispatch(getTradeCommision(values, token))
  }

  confirmCommision = e => {
    const {
      dispatch,
      tradeId,
      progressLogs,
      timeZone,
      token,
      tradeFees,
      pcMarginDetails: { pcMargin, pcMarginCurrency, pcPercentage },
    } = this.props
    e.preventDefault()
    const introducerFee = tradeFees.find(el => el.accountType === 'introducer')
    if (introducerFee) {
      const values = {
        id: introducerFee.id,
        expectedFees: pcMargin,
        actualFees: pcMargin,
        feeCurrency: pcMarginCurrency,
        actualSpread: pcPercentage,
      }
      dispatch(updateIntroducerFee(values, tradeId, token))
      const tradeData = {
        progressLogs: {
          ...progressLogs,
          introducerCommissionConfirmedAt: formatToZoneDateTZFormat(new Date(), timeZone),
        },
      }
      dispatch(updateTradeDetails(tradeData, tradeId, token))
    }
  }

  onChangeRevenue = checked => {
    const { dispatch } = this.props
    dispatch(changeRevenue(checked))
  }

  onChangeSettlement = checked => {
    const { dispatch } = this.props
    dispatch(changeSettlement(checked))
  }

  onChangeDeposit = checked => {
    const { dispatch } = this.props
    dispatch(changeDeposit(checked))
  }

  getCommisionOptions = () => {
    const {
      form: { getFieldDecorator },
      introducerCommission: { isRevenue, isSettlement, isDeposit },
    } = this.props
    return (
      <Form layout="inline" onSubmit={this.handleRateOptionSubmit}>
        <Form.Item>
          {getFieldDecorator('isRevenue', {
            valuePropName: 'checked',
          })(
            <>
              <Switch
                className="mr-1"
                checked={isRevenue}
                size="small"
                onChange={this.onChangeRevenue}
              />{' '}
              On Revenue
            </>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('isSettlement', {
            valuePropName: 'checked',
          })(
            <>
              <Switch
                className="mr-1"
                checked={isSettlement}
                size="small"
                onChange={this.onChangeSettlement}
              />{' '}
              On Settlement
            </>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('isDeposit', {
            valuePropName: 'checked',
          })(
            <>
              <Switch
                className="mr-1"
                checked={isDeposit}
                size="small"
                onChange={this.onChangeDeposit}
              />{' '}
              On Deposit
            </>,
          )}
        </Form.Item>
      </Form>
    )
  }

  onChangePcMarginPercentage = value => {
    const { dispatch } = this.props
    dispatch(enteredPCMarginPercentage, value)
  }

  onPcMarginButtonHandler = () => {
    const { dispatch, tradeId, token } = this.props
    dispatch(getTradePcMargin(tradeId, token))
  }

  render() {
    const {
      depositCurrency,
      totalDepositAmount,
      introducerCommission: {
        isRevenue,
        introducerCommission,
        clientSpread,
        introducerCommissionCurrency,
      },
      pcMarginDetails: { pcMargin, pcMarginCurrency, pcPercentage },
      rateDetails: { agreedSpread },
      isCommissionFetched,
      isCommisionConfirmed,
      hidden,
    } = this.props
    return (
      <Row hidden={hidden} className="mt-4">
        {!isCommisionConfirmed && (
          <Col>
            <h6>
              <strong>Introducer Commision Type:</strong>
            </h6>
            <div className={styles.prgressContent}>
              <div className="rates-card">
                <div className="rate-options">{this.getCommisionOptions()}</div>
                <div hidden={!isRevenue}>
                  <Button type="link" onClick={this.onPcMarginButtonHandler}>
                    GET PC MARGIN
                  </Button>
                  <div className="pl-3 mr-2 ml-1">
                    <span className="mr-2 mt-2" hidden={pcMargin === ''}>
                      PC Margin : {pcMargin}
                    </span>
                    <span className="mr-2 mt-2" hidden={pcMarginCurrency === ''}>
                      PC Margin Currency: {pcMarginCurrency}
                    </span>
                    {pcMargin && (
                      <div className="mt-2">
                        Percentage :{' '}
                        <InputNumber
                          size="small"
                          onChange={this.onChangePcMarginPercentage}
                          defaultValue={pcPercentage}
                        />
                        %
                      </div>
                    )}
                  </div>
                  <div className={`${styles.divider} mr-4 ml-4 pb-2`} />
                </div>
                <div className="rate-content">
                  <div>
                    <span className="font-size-15">
                      Commission spread applied @ <strong>{agreedSpread}%</strong>
                    </span>
                  </div>
                  <div>
                    <span className="font-size-15">
                      <small>
                        Commission on revenue for currency{' '}
                        <strong>{introducerCommissionCurrency}</strong>
                      </small>
                    </span>
                  </div>
                  {isCommissionFetched && (
                    <div>
                      <span className="font-size-15">
                        Total commission{' '}
                        <strong>
                          {introducerCommissionCurrency} {amountFormatter(introducerCommission)}
                        </strong>{' '}
                        @ <strong>{clientSpread}%</strong> for{' '}
                        <strong>
                          {depositCurrency} {amountFormatter(totalDepositAmount)}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
                <div className="rate-action">
                  <Button hidden={isRevenue} type="link" onClick={this.getCommision}>
                    GET COMMISION
                  </Button>
                  <Button
                    hidden={!isRevenue}
                    disabled={pcMargin === '' || pcMarginCurrency === '' || pcPercentage === null}
                    type="link"
                    onClick={this.getCommision}
                  >
                    GET COMMISION
                  </Button>
                  <Button type="link" onClick={this.confirmCommision} hidden={!isCommissionFetched}>
                    CONFIRM COMMISION
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        )}
      </Row>
    )
  }
}
export default IntroducerCommision
