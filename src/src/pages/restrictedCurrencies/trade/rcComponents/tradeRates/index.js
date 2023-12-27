import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Form, Switch, Checkbox, InputNumber, DatePicker, Button } from 'antd'
import moment from 'moment'

import {
  amountFormatter,
  formatToZoneDate,
  formatToZoneDateTZFormat,
  disabledFutureDate,
} from 'utilities/transformer'

import {
  changeInverseRate,
  changeNewCalculation,
  checkApplyPrecision,
  enteredPrecision,
  checkApplyXeDateTime,
  updateXeDateTime,
  getTradeRate,
  createRateRecord,
  // confirmExistingSellRate,
} from 'redux/restrictedCurrencies/trade/tradeProcess/tradeDetails/actions'
import styles from './style.module.scss'

const mapStateToProps = ({ general, user, npTrade, settings }) => ({
  clients: general.clients,
  currentClient: general.currentTradeClient,
  token: user.token,
  tradeId: npTrade.tradeId,
  totalDepositAmount: npTrade.totalDepositAmount,
  clientId: npTrade.clientId,
  depositCurrency: npTrade.depositCurrency,
  settlementCurrency: npTrade.settlementCurrency,
  progressLogs: npTrade.progressLogs,
  tradeRequestedAt: npTrade.progressLogs.tradeRequestedAt,
  depositConfirmedByClientAt: npTrade.progressLogs.depositConfirmedByClientAt,
  isDepositAmountConfirmed: npTrade.isDepositAmountConfirmed,
  isRateConfirmed: npTrade.isRateConfirmed,
  isInverseRate: npTrade.isInverseRate,
  isNewCalculation: npTrade.isNewCalculation,
  isPrecisionApply: npTrade.isPrecisionApply,
  precision: npTrade.precision,
  isXeDateTimeApply: npTrade.isXeDateTimeApply,
  rateAppliedAt: npTrade.rateAppliedAt,
  rateDetails: npTrade.rateDetails,
  isEditMode: npTrade.isEditMode,
  timeZone: settings.timeZone.value,
  timeZoneCode: settings.timeZone.code,
  sellRates: npTrade.sellRates,
})

@Form.create()
@connect(mapStateToProps)
class TradeRates extends Component {
  componentDidMount() {
    const { isDepositAmountConfirmed, dispatch, currentClient, rateDetails } = this.props
    const { isInverse, isNewCalculation } = currentClient.profile.tradingPreference
    if (isDepositAmountConfirmed && Object.entries(rateDetails).length === 0) {
      this.getRate()
    }
    dispatch(changeNewCalculation(isNewCalculation))
    dispatch(changeInverseRate(isInverse))
  }

  getRate = () => {
    const {
      dispatch,
      totalDepositAmount,
      clients,
      clientId,
      depositCurrency,
      settlementCurrency,
      tradeRequestedAt,
      depositConfirmedByClientAt,
      isInverseRate,
      isNewCalculation,
      precision,
      token,
      tradeId,
      rateAppliedAt,
    } = this.props
    const clientObj = clients.find(el => el.id === clientId)
    const values = {
      tradeId,
      clientName: clientObj ? clientObj.genericInformation.tradingName : '',
      totalDepositAmount,
      clientId,
      depositCurrency,
      settlementCurrency,
      tradeRequestedAt,
      depositConfirmedByClientAt,
      isInverseRate,
      isNewCalculation,
      precision,
      rateAppliedAt,
    }
    dispatch(getTradeRate(values, token))
  }

  createRate = e => {
    e.preventDefault()
    const {
      dispatch,
      token,
      tradeId,
      rateDetails: {
        baseCurrency,
        settlementAmount,
        sellRate,
        sellRateInverse,
        agreedSpread,
        rateAppliedAt,
        targetAmount,
        inverseAmount,
        isIndicative,
        baseAmount,
        targetCurrency,
        tradingHours,
      },
    } = this.props
    const values = {
      tradeId,
      baseCurrency,
      targetCurrency,
      settlementAmount,
      sellRate,
      sellRateInverse,
      rateAppliedAt,
      agreedSpread,
      baseAmount,
      targetAmount,
      inverseAmount,
      quoteStatus: 'new',
      rateCategory: 'sell',
      rateStatus: 'active',
      isIndicative,
      tradingHours,
    }
    dispatch(createRateRecord(values, {}, token))
  }

  confirmRate = e => {
    e.preventDefault()
    const {
      dispatch,
      token,
      tradeId,
      progressLogs,
      timeZone,
      totalDepositAmount,
      rateDetails,
      sellRates,
    } = this.props
    const activeSellRate = sellRates.find(el => el.rateStatus === 'active')
    console.log('confirm trigred', activeSellRate, rateDetails)
    const {
      baseCurrency,
      baseAmount,
      targetCurrency,
      targetAmount,
      inverseAmount,
      sellRate,
      sellRateInverse,
      settlementAmount,
      agreedSpread,
      // quoteStatus,
      tradingHours,
      rateAppliedAt,
      id,
    } = activeSellRate || rateDetails
    const values = {
      id,
      tradeId,
      baseCurrency,
      baseAmount,
      totalDepositAmount,
      targetCurrency,
      targetAmount,
      inverseAmount,
      sellRate,
      sellRateInverse,
      settlementAmount,
      agreedSpread,
      quoteStatus: 'quote_confirmed',
      rateCategory: 'sell',
      rateStatus: 'active',
      isIndicative: false,
      tradingHours,
      rateAppliedAt,
    }

    const tradeUpdateData = {
      tradeStatus: 'quote_confirmed',
      settlementAmount,
      progressLogs: {
        ...progressLogs,
        quoteConfirmedByClientAt: formatToZoneDateTZFormat(new Date(), timeZone),
      },
      rateDetails: {
        ...rateDetails,
        quoteStatus: 'quote_confirmed',
      },
    }

    // if (quoteStatus !== undefined) {
    //   if (quoteStatus === 'new') {
    //     dispatch(confirmExistingSellRate(values, tradeUpdateData, token))
    //   }
    // } else {
    //   dispatch(createRateRecord(values, tradeUpdateData, token))
    // }

    dispatch(createRateRecord(values, tradeUpdateData, token))
  }

  updateRate = () => {
    console.log('update')
  }

  onChangeInverseRate = checked => {
    const { dispatch } = this.props
    dispatch(changeInverseRate(checked))
  }

  onChangeNewCalculation = checked => {
    const { dispatch } = this.props
    dispatch(changeNewCalculation(checked))
  }

  onPrecisionCheck = e => {
    const { checked } = e.target
    const { dispatch } = this.props
    dispatch(checkApplyPrecision(checked))
  }

  onPrecisionChange = value => {
    const { dispatch } = this.props
    dispatch(enteredPrecision(value))
  }

  onXeDateTimeCheck = e => {
    const { checked } = e.target
    const { dispatch } = this.props
    dispatch(checkApplyXeDateTime(checked))
  }

  handleRateAppliedDateChange = value => {
    const { dispatch } = this.props
    let stringDate
    if (value) {
      const newDate = new Date(value)
      newDate.setUTCMilliseconds(0)
      stringDate = newDate.toISOString()
    } else {
      stringDate = null
    }

    dispatch(updateXeDateTime(stringDate))
  }

  onRateAppliedDateOk = value => {
    const { dispatch } = this.props
    const newDate = new Date(value)
    newDate.setUTCMilliseconds(0)
    const stringDate = newDate.toISOString()
    dispatch(updateXeDateTime(stringDate))
  }

  getRateOptions = () => {
    const {
      form: { getFieldDecorator },
      isInverseRate,
      isNewCalculation,
      isPrecisionApply,
      precision,
      isXeDateTimeApply,
      rateAppliedAt,
      timeZone,
    } = this.props
    return (
      <Form layout="inline" onSubmit={this.handleRateOptionSubmit}>
        <Form.Item>
          {getFieldDecorator('isInverseRate', {
            valuePropName: 'checked',
          })(
            <>
              <Switch
                className="mr-1"
                checked={isInverseRate}
                size="small"
                onChange={this.onChangeInverseRate}
              />{' '}
              Inverse Rate
            </>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('isNewCalculation', {
            valuePropName: 'checked',
          })(
            <>
              <Switch
                className="mr-1"
                checked={isNewCalculation}
                size="small"
                onChange={this.onChangeNewCalculation}
              />{' '}
              New Calculation
            </>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('isPrecisionApply', {
            initailValue: isPrecisionApply,
          })(
            <>
              <Checkbox checked={isPrecisionApply} onChange={this.onPrecisionCheck}>
                Apply Precision
              </Checkbox>
            </>,
          )}
        </Form.Item>
        {isPrecisionApply && (
          <Form.Item>
            {getFieldDecorator('precision', {
              initailValue: precision,
            })(<InputNumber min={1} max={10} onChange={this.onPrecisionChange} />)}
          </Form.Item>
        )}
        <Form.Item>
          {getFieldDecorator('isXeDateTimeApply', {
            initailValue: isXeDateTimeApply,
          })(
            <>
              <Checkbox checked={isXeDateTimeApply} onChange={this.onXeDateTimeCheck}>
                Apply Xe Date Time
              </Checkbox>
            </>,
          )}
        </Form.Item>
        {isXeDateTimeApply && (
          <Form.Item className={`${styles.mt1}`} label="Rate Applied at">
            {getFieldDecorator('rateAppliedAt', {
              initialValue: rateAppliedAt
                ? moment(new Date(formatToZoneDateTZFormat(rateAppliedAt, timeZone)))
                : null,
              rules: [{ required: true, message: 'Please select Date!' }],
            })(
              <DatePicker
                disabledDate={disabledFutureDate}
                showTime={{
                  defaultValue: moment(
                    rateAppliedAt ? rateAppliedAt.substring(11, 19) : null,
                    'HH:mm:ss',
                  ),
                }}
                placeholder="Select Date"
                format="DD/MM/YYYY HH:mm:ss"
                onChange={this.handleRateAppliedDateChange}
                onOk={this.onRateAppliedDateOk}
              />,
            )}
          </Form.Item>
        )}
      </Form>
    )
  }

  showRates = () => {
    const {
      timeZone,
      timeZoneCode,
      totalDepositAmount,
      rateDetails,
      isInverseRate,
      progressLogs,
      sellRates,
    } = this.props
    const activeSellRate = sellRates.find(el => el.rateStatus === 'active')
    const {
      baseCurrency,
      settlementAmount,
      targetCurrency,
      sellRate,
      inverseAmount,
      targetAmount,
      tradingHours,
      agreedSpread,
      rateAppliedAt,
      isIndicative,
    } = activeSellRate || rateDetails

    const isRateConfirmed = progressLogs.quoteConfirmedByClientAt !== undefined

    const checkNumberDecimal = value => {
      if (value.$numberDecimal) {
        return parseFloat(value.$numberDecimal)
      }
      return value
    }

    return (
      <div>
        {Object.entries(activeSellRate || rateDetails).length !== 0 ? (
          <div className="rates-card p-4">
            <div className="rate-options" hidden={isRateConfirmed}>
              {this.getRateOptions()}
            </div>
            <h5 className="pl-4">
              {isRateConfirmed ? 'Applied ' : ''}
              {isIndicative ? 'Indicative ' : 'Sell '}Rate
            </h5>
            <div className="pl-4">
              <span className="font-size-15">
                <strong>
                  {` ${baseCurrency} ${amountFormatter(totalDepositAmount)} @ ${checkNumberDecimal(
                    sellRate,
                  )} = ${targetCurrency} ${amountFormatter(checkNumberDecimal(settlementAmount))}`}
                </strong>
              </span>
            </div>
            <div className="pl-4">
              <span className="font-size-15">
                <small>
                  {tradingHours} spread applied @ <strong>{agreedSpread}%</strong>
                </small>
              </span>
            </div>
            <div className="pl-4">
              <span className="font-size-15">
                Xe mid rate applied{' '}
                <strong>
                  1 {baseCurrency} ={' '}
                  {isInverseRate
                    ? checkNumberDecimal(inverseAmount)
                    : checkNumberDecimal(targetAmount)}{' '}
                  {targetCurrency}{' '}
                </strong>{' '}
                @ {formatToZoneDate(rateAppliedAt, timeZone)} {timeZoneCode}
              </span>
            </div>
            <div className="rate-action">
              <Button hidden={isRateConfirmed} type="link" onClick={this.getRate}>
                GET RATE
              </Button>
              <Button hidden={!isIndicative} type="link" onClick={this.createRate}>
                CREATE RATE RECORD
              </Button>
              <Button
                hidden={isRateConfirmed || isIndicative}
                type="link"
                onClick={this.confirmRate}
              >
                CONFIRM RATE
              </Button>
            </div>
          </div>
        ) : (
          <div className="rates-card p-4">
            <span className="font-size-15 pl-4">
              Rate not available. Please click Get Rate to view the rate
            </span>
            <div className="rate-action pt-2">
              <Button type="link" onClick={this.getRate}>
                GET RATE
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  render() {
    const { hidden } = this.props

    return (
      <Row hidden={hidden} className="mt-4">
        <Col>
          <h6>
            <strong>Rate:</strong>
          </h6>
          <div className={styles.prgressContent}>{this.showRates()}</div>
        </Col>
      </Row>
    )
  }
}
export default TradeRates
