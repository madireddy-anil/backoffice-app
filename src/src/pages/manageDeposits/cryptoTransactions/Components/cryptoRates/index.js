import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Icon,
  Input,
  Switch,
  Checkbox,
  InputNumber,
  DatePicker,
  Tooltip,
} from 'antd'

import {
  amountFormatter,
  formatToZoneDate,
  formatToZoneDateTZFormat,
  disabledFutureDate,
} from 'utilities/transformer'

import {
  getCalculatedRate,
  updateVendorDetails,
  getFxBaseRateByVendor,
  changeDateRate,
  updateDateRate,
  changeInverseRate,
  checkApplyPrecision,
  updatePrecision,
  enteredNewActualRate,
  // updateTransactionValues,
  // createTxnFee,
  createTxnRates,
  handleCryptoTxnFeeCalculation,
} from 'redux/cryptoTransactions/actions'

import { createFxBaseRate } from 'redux/fxBaseRate/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ general, user, cryptoTransaction, settings, trade }) => ({
  vendors: general.newVendors,
  token: user.token,
  rate: cryptoTransaction.rate,
  buyRateLoading: cryptoTransaction.buyRateLoading,
  fxBaseRatesByVendor: cryptoTransaction.fxBaseRatesByVendor,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  selectedVendor: cryptoTransaction.selectedVendor,
  isQuoteConfirmed: cryptoTransaction.isQuoteConfirmed,
  fxRateByVendorLoader: cryptoTransaction.fxRateByVendorLoader,
  timeZone: settings.timeZone.value,
  timeZoneCode: settings.timeZone.code,
  sourceCurrency: cryptoTransaction.selectedTransaction.depositCurrency,
  sourceAmount: cryptoTransaction.selectedTransaction.totalDepositAmount,
  tradeCryptoTransactions: trade.cryptoTransactions,
  tradeId: trade.id,
})

const { Option } = Select

@Form.create()
@connect(mapStateToProps)
class CryptoRates extends Component {
  state = {
    rateSelected: false,
    isNoMatchClicked: false,
    isContinueClicked: false,
    selectedRate: {},
    showNewCalculation: false,
  }

  // componentDidMount() {
  //   this.getFxBaseRatesByVendor()
  // }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      vendors,
      selectedTransaction: { id, vendorId },
      selectedVendor,
    } = this.props
    if (prevProps.selectedTransaction.id !== id && vendorId !== '') {
      const vendorData = vendors.find(el => el.id === vendorId)
      Promise.resolve(dispatch(updateVendorDetails(vendorData))).then(() =>
        this.getFxBaseRatesByVendor(),
      )
    }
    if (Object?.entries?.(selectedVendor ?? {})?.length !== 0) {
      if (prevProps.selectedVendor.id !== selectedVendor.id) {
        this.getFxBaseRatesByVendor()
      }
    }
  }

  getFxBaseRatesByVendor = e => {
    if (e) e.preventDefault()
    const {
      dispatch,
      token,
      selectedTransaction: { depositCurrency, settlementCurrency, vendorId },
      form,
    } = this.props
    // const yesterday = new Date(Date.now() - 864e5)
    // yesterday.setUTCHours(0, 0, 0, 0)
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const values = {
        vendor: vendorId,
        // dateFrom: yesterday.toISOString(),
        dateFrom: fieldsValue.fxRateDate.format('YYYY-MM-DD'),
        dateTo: fieldsValue.fxRateDate.format('YYYY-MM-DD'),
        baseCurrency: depositCurrency,
        targetCurrency: settlementCurrency,
      }
      dispatch(getFxBaseRateByVendor(values, token))
    })
  }

  onChange = value => {
    const { fxBaseRatesByVendor } = this.props
    const selectedFxBaseRate = fxBaseRatesByVendor.find(el => el.id === value)
    this.setState({
      selectedRate: selectedFxBaseRate,
      rateSelected: true,
      isNoMatchClicked: false,
      isContinueClicked: false,
    })
  }

  removeSelectedBeneficiary = () => {
    this.setState({
      rateSelected: false,
      isNoMatchClicked: false,
      isContinueClicked: false,
    })
  }

  onClickContinueHandler = () => {
    const {
      dispatch,
      selectedVendor,
      rate: { isInverse },
      token,
      selectedTransaction: { totalDepositAmount, depositCurrency, settlementCurrency },
    } = this.props
    const { selectedRate } = this.state
    const values = {
      accountId: selectedVendor.id,
      vendorName: selectedVendor.genericInformation?.tradingName,
      vendorRate: selectedRate.inverseAmount,
      isInverse: isInverse || true,
      totalDepositAmount,
      tradeCurrency: depositCurrency,
      targetCurrency: settlementCurrency,
      rateAppliedAt: selectedRate.rateAppliedAt,
    }
    dispatch(getCalculatedRate(values, token))
    this.setState({ isNoMatchClicked: false, isContinueClicked: true })
  }

  onClickNoMatchHandler = () => {
    const {
      dispatch,
      selectedVendor,
      rate: { isInverse },
      token,
      selectedTransaction: { totalDepositAmount, depositCurrency, settlementCurrency },
    } = this.props
    const values = {
      accountId: selectedVendor.id,
      vendorName: selectedVendor.genericInformation?.tradingName,
      isInverse: isInverse || true,
      totalDepositAmount,
      tradeCurrency: depositCurrency,
      targetCurrency: settlementCurrency,
    }
    dispatch(getCalculatedRate(values, token))
    this.setState({ isNoMatchClicked: true, isContinueClicked: false })
  }

  getQuoteForExistedRate = () => {
    const {
      timeZone,
      timeZoneCode,
      rate,
      buyRateLoading,
      selectedTransaction: { totalDepositAmount, depositCurrency, settlementCurrency },
    } = this.props
    const {
      baseAmount,
      actualSpread,
      agreedSpread,
      spreadDifference,
      baseProviderName,
      inverseAmount,
      sellRate,
      settlementAmount,
      expectedRate,
      expectedRemittanceAmount,
    } = rate
    const {
      selectedRate: { rateAppliedAt },
    } = this.state
    return (
      <>
        <div className="rates-card mt-3 p-10">
          <h5 className="pl-3">Expected Rate</h5>
          <div className="rate-content">
            <div>
              <span className="font-size-15">
                <strong>
                  {`${depositCurrency} ${amountFormatter(
                    totalDepositAmount,
                  )} @ ${expectedRate} = ${settlementCurrency} ${amountFormatter(
                    expectedRemittanceAmount,
                  )}`}
                </strong>
              </span>
            </div>
            <div>
              <span className="font-size-15">
                Spread applied @ <strong>{agreedSpread}%</strong>
              </span>
            </div>
            <div>
              <span className="font-size-15">
                {baseProviderName} mid rate applied{' '}
                <strong>
                  {baseAmount} {depositCurrency} = {inverseAmount} {settlementCurrency}{' '}
                </strong>{' '}
                @ {formatToZoneDate(rateAppliedAt, timeZone)} {timeZoneCode}
              </span>
            </div>
          </div>
        </div>
        <div className="rates-card mt-3 p-10">
          <h5 className="pl-3">Actual Rate</h5>
          <div className="rate-content">
            <div>
              <span className="font-size-15">
                <strong>
                  {`${depositCurrency} ${
                    totalDepositAmount !== undefined ? amountFormatter(totalDepositAmount) : '---'
                  }
                      @ ${
                        sellRate !== undefined ? amountFormatter(sellRate) : '---'
                      } = ${settlementCurrency} ${
                    settlementAmount ? amountFormatter(settlementAmount) : '---'
                  }`}
                </strong>
              </span>
            </div>
            <div>
              <span className="font-size-15">
                Spread applied @ <strong>{actualSpread}%</strong>
              </span>
            </div>
            <div>
              <span className="font-size-15">
                {baseProviderName} mid rate applied{' '}
                <strong>
                  {baseAmount} {depositCurrency} = {inverseAmount} {settlementCurrency}{' '}
                </strong>{' '}
                @ {formatToZoneDate(rateAppliedAt, timeZone)} {timeZoneCode}
              </span>
            </div>
            <div className="mt-2">
              <h6>Difference:</h6>
              <span>
                {sellRate} is <strong>{spreadDifference}%</strong> Over {baseProviderName} Rate{' '}
                {inverseAmount}
              </span>
            </div>
          </div>
          <div className="rate-action">
            <Button
              type="link"
              onClick={this.existingRateConfirmHandler}
              disabled={buyRateLoading}
              loading={buyRateLoading}
            >
              CONFIRM QUOTE
            </Button>
          </div>
        </div>
      </>
    )
  }

  onChangeDayRate = checked => {
    const { dispatch } = this.props
    dispatch(changeDateRate(checked))
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

    dispatch(updateDateRate(stringDate))
  }

  onRateAppliedDateOk = value => {
    const { dispatch } = this.props
    const newDate = new Date(value)
    newDate.setUTCMilliseconds(0)
    const stringDate = newDate.toISOString()
    dispatch(updateDateRate(stringDate))
  }

  onChangeInverseRate = checked => {
    const { dispatch } = this.props
    dispatch(changeInverseRate(checked))
  }

  onPrecisionCheck = e => {
    const { checked } = e.target
    const { dispatch } = this.props
    dispatch(checkApplyPrecision(checked))
  }

  onPrecisionChange = value => {
    const { dispatch } = this.props
    dispatch(updatePrecision(value))
  }

  getRateOptions = () => {
    const {
      form: { getFieldDecorator },
      rate: {
        isDayRate,
        rateAppliedAt,
        // isInverse,
        isPrecisionApply,
        precision,
      },
      timeZone,
    } = this.props
    return (
      <Form layout="inline" onSubmit={this.onClickCalculateHandler}>
        <Form.Item>
          {getFieldDecorator('isDayRate', {
            valuePropName: 'checked',
          })(
            <>
              <Switch
                className="mr-1"
                checked={isDayRate}
                size="small"
                onChange={this.onChangeDayRate}
              />{' '}
              Day Rate
            </>,
          )}
        </Form.Item>
        {!isDayRate && (
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
        <Form.Item>
          {getFieldDecorator('isInverse', {
            valuePropName: 'checked',
          })(
            <>
              <Switch
                className="mr-1"
                checked
                disabled
                size="small"
                onChange={this.onChangeInverseRate}
              />{' '}
              Inverse Rate
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
          <Form.Item label="Precision">
            {getFieldDecorator('precision', {
              initailValue: precision,
              rules: [{ required: true, message: 'Please enter precision!' }],
            })(<InputNumber min={1} max={10} onChange={this.onPrecisionChange} />)}
          </Form.Item>
        )}
      </Form>
    )
  }

  enteredNewRate = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(enteredNewActualRate(value ? parseFloat(value) : null))
  }

  newRateBlurHandler = value => {
    const {
      form,
      rate: { precision },
    } = this.props
    form.setFieldsValue({
      inputRate: amountFormatter(value, precision),
    })
  }

  newRateFocusHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      inputRate: value,
    })
  }

  onClickCalculateHandler = e => {
    e.preventDefault()
    const {
      dispatch,
      selectedVendor,
      rate: { isInverse, rateAppliedAt, precision, inputRate },
      token,
      selectedTransaction: { totalDepositAmount, depositCurrency, settlementCurrency },
    } = this.props
    const values = {
      accountId: selectedVendor.id,
      vendorName: selectedVendor.genericInformation?.tradingName,
      isInverse: isInverse || true,
      totalDepositAmount,
      tradeCurrency: depositCurrency,
      targetCurrency: settlementCurrency,
      rateAppliedAt,
      precision,
      vendorRate: inputRate,
    }
    dispatch(getCalculatedRate(values, token))
    this.setState({ showNewCalculation: true })
  }

  getQuoteForNewRate = () => {
    const {
      timeZone,
      timeZoneCode,
      rate,
      selectedTransaction: { totalDepositAmount, depositCurrency, settlementCurrency },
      form,
      buyRateLoading,
    } = this.props
    const { showNewCalculation } = this.state
    const {
      baseAmount,
      actualSpread,
      agreedSpread,
      spreadDifference,
      rateAppliedAt,
      baseProviderName,
      inverseAmount,
      sellRate,
      settlementAmount,
      expectedRate,
      expectedRemittanceAmount,
      inputRate,
      precision,
    } = rate
    return (
      <>
        <div className="rates-card mt-3 p-10">
          <h5 className="pl-3">Expected Rate</h5>
          <div className="rate-content">
            <div>
              <span className="font-size-15">
                <strong>
                  {`${depositCurrency} ${amountFormatter(
                    totalDepositAmount,
                  )} @ ${expectedRate} = ${settlementCurrency} ${amountFormatter(
                    expectedRemittanceAmount,
                  )}`}
                </strong>
              </span>
            </div>
            <div>
              <span className="font-size-15">
                Spread applied @ <strong>{agreedSpread}%</strong>
              </span>
            </div>
            <div>
              <span className="font-size-15">
                {baseProviderName} mid rate applied{' '}
                <strong>
                  {baseAmount} {depositCurrency} = {inverseAmount} {settlementCurrency}{' '}
                </strong>{' '}
                @ {formatToZoneDate(rateAppliedAt, timeZone)} {timeZoneCode}
              </span>
            </div>
          </div>
        </div>
        <div className="rates-card mt-3 p-10">
          <h5 className="pl-3">Actual Rate</h5>
          <div className="rate-options">{this.getRateOptions()}</div>
          <div className="rate-content">
            <div className="pb-4">
              <Form layout="inline">
                <Form.Item className={`${styles.mt1}`} label="">
                  {form.getFieldDecorator('inputRate', {
                    initialValue: amountFormatter(inputRate, precision),
                  })(
                    <Input
                      addonBefore="Rate"
                      onChange={this.enteredNewRate}
                      onBlur={() => this.newRateBlurHandler(inputRate)}
                      onFocus={() => this.newRateFocusHandler(inputRate)}
                    />,
                  )}
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.onClickCalculateHandler}
                  disabled={
                    inputRate === '' ||
                    inputRate === null ||
                    rateAppliedAt === '' ||
                    rateAppliedAt === null ||
                    rateAppliedAt === undefined
                  }
                >
                  CALCULATE QUOTE
                </Button>
              </Form>
            </div>
            {showNewCalculation ? (
              <div>
                <div>
                  <span className="font-size-15">
                    <strong>
                      {`${depositCurrency} ${
                        totalDepositAmount !== undefined
                          ? amountFormatter(totalDepositAmount)
                          : '---'
                      }
                      @ ${sellRate !== undefined ? sellRate : '---'} = ${settlementCurrency} ${
                        settlementAmount ? amountFormatter(settlementAmount) : '---'
                      }`}
                    </strong>
                  </span>
                </div>
                <div>
                  <span className="font-size-15">
                    Spread applied @ <strong>{actualSpread !== '' ? actualSpread : '---'}%</strong>
                  </span>
                </div>
                <div>
                  <span className="font-size-15">
                    {baseProviderName} mid rate applied{' '}
                    <strong>
                      {baseAmount} {depositCurrency} = {inverseAmount} {settlementCurrency}{' '}
                    </strong>{' '}
                    @ {rateAppliedAt ? formatToZoneDate(rateAppliedAt, timeZone) : '---'}{' '}
                    {timeZoneCode}
                  </span>
                </div>
                <div className="mt-2">
                  <h6>Difference:</h6>
                  <span>
                    {sellRate !== '' ? sellRate : '---'} is <strong>{spreadDifference}%</strong>{' '}
                    Over {baseProviderName} Rate {inverseAmount}
                  </span>
                </div>
                <div className="rate-action pt-2">
                  <Button
                    onClick={this.newRateConfirmHandler}
                    type="primary"
                    loading={buyRateLoading}
                    disabled={buyRateLoading}
                  >
                    CONFIRM QUOTE
                  </Button>
                </div>
              </div>
            ) : (
              `Please click on "Calculate Quote" to see new quote`
            )}
          </div>
        </div>
      </>
    )
  }

  newRateConfirmHandler = () => {
    const {
      dispatch,
      token,
      selectedTransaction,
      selectedVendor,
      rate,
      timeZone,
      // feeFor,
      feeAccountType,
      sourceAmount,
      sourceCurrency,
      selectedTransaction: { settlementCurrency },
      tradeId,
    } = this.props
    const {
      baseAmount,
      targetAmount,
      actualSpread,
      agreedSpread,
      spreadDifference,
      rateAppliedAt,
      baseCurrency,
      baseProviderName,
      inverseAmount,
      sellRate,
      sellRateInverse,
      settlementAmount,
      targetCurrency,
      // expectedFee,
      // feesDifference,
      // actualFee,
    } = rate
    // const { totalDepositAmount } = selectedTransaction
    // create fx base rates
    const baseRateValuesVendor = {
      ...rate,
      rateAppliedAt: rateAppliedAt || formatToZoneDateTZFormat(new Date(), timeZone),
      baseProviderName: selectedVendor.genericInformation?.tradingName || '',
      vendor: selectedVendor.id,
      baseCurrency,
      baseAmount,
      targetCurrency: settlementCurrency,
      inverseAmount,
    }
    dispatch(createFxBaseRate(baseRateValuesVendor, token))

    // // create fees
    // const values = {
    //   vendorId: selectedVendor.id,
    //   cryptoTransactionId: selectedTransaction.id,
    //   accountType: feeFor,
    //   feeType: 'spread',
    //   agreedSpread,
    //   actualSpread,
    //   expectedFee,
    //   actualFee,
    //   spreadDifference,
    //   feesDifference,
    //   feeCurrency: targetCurrency,
    // }
    // dispatch(createTxnFee(values, token))

    // create buyrate
    const rateValues = {
      cryptoTransactionId: selectedTransaction.id,
      baseCurrency,
      targetCurrency,
      baseAmount,
      targetAmount,
      inverseAmount,
      sellRate,
      sellRateInverse,
      settlementAmount,
      baseProviderName,
      agreedSpread,
      actualSpread,
      rateCategory: 'buy',
      quoteStatus: 'quote_confirmed',
      rateStatus: 'active',
      spreadDifference,
      rateAppliedAt,
      tradeId,
    }
    dispatch(createTxnRates(rateValues, token))

    // update txn
    // const now = formatToZoneDateTZFormat(new Date(), timeZone)
    // const value = {
    //   transactionStatus: 'quote_confirmed',
    //   progressLogs: {
    //     ...selectedTransaction.progressLogs,
    //     quoteConfirmedToVendorAt: now,
    //   },
    // }
    // dispatch(updateTransactionValues(value, selectedTransaction.id, token))

    // Fee Calc

    const rateApplied = rateAppliedAt
    const actualspread = actualSpread
    const feeCalc = {
      vendorId: selectedVendor.id,
      transactionId: selectedTransaction.id,
      accountType: feeAccountType,
      feeType: 'conversion',
      feeCurrency: targetCurrency,
      xeRate: inverseAmount,
      vendorRate: sellRate,
      transactionAmount: sourceAmount,
      rateAppliedAt: rateApplied || '',
      actualSpread: actualspread,
      sourceCurrency,
    }

    dispatch(handleCryptoTxnFeeCalculation(feeCalc, token))
  }

  existingRateConfirmHandler = () => {
    const {
      dispatch,
      token,
      selectedTransaction,
      selectedVendor,
      rate,
      // timeZone,
      // feeFor,
      feeAccountType,
      sourceAmount,
      sourceCurrency,
      tradeId,
    } = this.props
    const {
      baseAmount,
      targetAmount,
      actualSpread,
      agreedSpread,
      spreadDifference,
      rateAppliedAt,
      baseCurrency,
      baseProviderName,
      inverseAmount,
      sellRate,
      sellRateInverse,
      settlementAmount,
      targetCurrency,
      // expectedFee,
      // feesDifference,
      // actualFee,
      expectedRate,
      expectedRemittanceAmount,
    } = rate
    // const { selectedRate } = this.state
    // create fees
    // const values = {
    //   vendorId: selectedVendor.id,
    //   cryptoTransactionId: selectedTransaction.id,
    //   accountType: feeFor,
    //   feeType: 'spread',
    //   feeCurrency: targetCurrency,
    //   agreedSpread,
    //   sellRate,
    //   expectedFee,
    //   actualFee,
    //   spreadDifference,
    //   feesDifference,
    // }
    // dispatch(createTxnFee(values, token))

    // create buyrate
    const rateValues = {
      cryptoTransactionId: selectedTransaction.id,
      sellRate,
      settlementAmount,
      actualSpread,
      expectedRate,
      expectedRemittanceAmount,
      agreedSpread,
      spreadDifference,
      baseProviderName,
      inverseAmount,
      baseCurrency,
      targetCurrency,
      baseAmount,
      targetAmount,
      sellRateInverse,
      rateAppliedAt,
      rateCategory: 'buy',
      quoteStatus: 'quote_confirmed',
      rateStatus: 'active',
      tradeId,
    }
    dispatch(createTxnRates(rateValues, token))

    // update txn
    // const now = formatToZoneDateTZFormat(new Date(), timeZone)
    // const value = {
    //   transactionStatus: 'quote_confirmed',
    //   progressLogs: {
    //     ...selectedTransaction.progressLogs,
    //     quoteConfirmedToVendorAt: now,
    //   },
    // }
    // dispatch(updateTransactionValues(value, selectedTransaction.id, token))

    // Fee Calc

    const rateApplied = rateAppliedAt
    const actualspread = actualSpread
    const feeCalc = {
      vendorId: selectedVendor.id,
      transactionId: selectedTransaction.id,
      accountType: feeAccountType,
      feeType: 'conversion',
      feeCurrency: targetCurrency,
      xeRate: inverseAmount,
      vendorRate: sellRate,
      transactionAmount: sourceAmount,
      rateAppliedAt: rateApplied || '',
      actualSpread: actualspread,
      sourceCurrency,
    }

    dispatch(handleCryptoTxnFeeCalculation(feeCalc, token))
  }

  render() {
    const { rateSelected, isNoMatchClicked, isContinueClicked, selectedRate } = this.state
    const {
      fxBaseRatesByVendor,
      rate,
      selectedTransaction,
      isQuoteConfirmed,
      timeZone,
      timeZoneCode,
      tradeCryptoTransactions,
      fxRateByVendorLoader,
      form,
    } = this.props
    const { getFieldDecorator } = form
    const currentTransaction = tradeCryptoTransactions.find(el => el.id === selectedTransaction.id)
    let activeBuyRate
    if (currentTransaction) {
      if (currentTransaction.buyRates && currentTransaction.buyRates.length !== 0) {
        activeBuyRate = currentTransaction.buyRates.find(el => el.rateStatus === 'active')
      }
    }
    const checkNumberDecimal = value => {
      if (value.$numberDecimal) {
        return parseFloat(value.$numberDecimal)
      }
      return value
    }

    const {
      baseCurrency,
      isInverse,
      sellRate,
      targetCurrency,
      settlementAmount,
      actualSpread,
      fxProvider,
      fxRate,
      baseAmount,
      // actualRate,
      inverseAmount,
      targetAmount,
      // spreadDifference,
      rateAppliedAt,
    } = activeBuyRate || rate

    const rateOptions = fxBaseRatesByVendor.map(rateItem => {
      return (
        <Option key={rateItem.id} value={rateItem.id}>
          <h6>{rateItem.fxBaseRateReference}</h6>
          <div>
            <span>
              {isInverse ? rateItem.inverseAmount : rateItem.targetAmount} @{' '}
              {formatToZoneDate(rateItem.rateAppliedAt, timeZone)} {timeZoneCode}
            </span>
          </div>
          <small>
            <span>{rateItem.baseCurrency}</span>{' '}
            {rateItem.baseCurrency && rateItem.targetCurrency ? '-' : ''}{' '}
            <span>{rateItem.targetCurrency}</span>
          </small>
        </Option>
      )
    })
    return (
      <Row className="mt-4">
        <Col>
          <div>
            <h6>
              <strong>Rate Setting:</strong>
            </h6>
            {isQuoteConfirmed ? (
              <div className={styles.prgressContent}>
                <div className="rates-card mt-3 p-10">
                  <h5 className="pl-3">Confirmed Rate</h5>
                  <div className="rate-content">
                    <div>
                      <span className="font-size-15">
                        <div>
                          <span className="font-size-15">
                            {fxProvider || 'XE'} mid rate applied{' '}
                            <strong>
                              {checkNumberDecimal(baseAmount)} {baseCurrency} ={' '}
                              {amountFormatter(checkNumberDecimal(sellRate))} {targetCurrency}{' '}
                            </strong>{' '}
                            @ {formatToZoneDate(rateAppliedAt, timeZone)} {timeZoneCode}
                          </span>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rates-card mt-3 p-10">
                  <h5 className="pl-3">Applied Rate</h5>
                  <div className="rate-content">
                    <div>
                      <span className="font-size-15">
                        <strong>
                          {`${baseCurrency && baseCurrency} ${amountFormatter(
                            selectedTransaction.totalDepositAmount,
                          )} @ ${checkNumberDecimal(
                            sellRate,
                          )} = ${targetCurrency} ${amountFormatter(
                            checkNumberDecimal(settlementAmount),
                          )}`}
                        </strong>
                      </span>
                    </div>
                    <div>
                      <span className="font-size-15">
                        Spread applied @ <strong>{actualSpread}%</strong>
                      </span>
                    </div>
                    <div>
                      <span className="font-size-15">
                        {fxProvider || 'XE'} mid rate applied{' '}
                        <strong>
                          {checkNumberDecimal(baseAmount)} {baseCurrency} ={' '}
                          {fxRate ||
                            (isInverse
                              ? checkNumberDecimal(inverseAmount)
                              : checkNumberDecimal(targetAmount))}{' '}
                          {targetCurrency}{' '}
                        </strong>{' '}
                        @ {formatToZoneDate(rateAppliedAt, timeZone)} {timeZoneCode}
                      </span>
                    </div>
                    {/* <div className="mt-2">
                      <h6>Difference:</h6>
                      <span>
                        {actualRate} is <strong>{spreadDifference}%</strong> Over {fxProvider} Rate {fxRate}
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.prgressContent}>
                <div>
                  {rateSelected ? (
                    <div className={`${styles.flexSpaceBetween} ${styles.listCard}`}>
                      <div>
                        <h6>{selectedRate.fxBaseRateReference}</h6>
                        <div>
                          <span>
                            {isInverse ? selectedRate.inverseAmount : selectedRate.targetAmount} @{' '}
                            {formatToZoneDate(selectedRate.rateAppliedAt, timeZone)} {timeZoneCode}
                          </span>
                        </div>
                        <div>
                          <small>
                            <span>{selectedRate.baseCurrency}</span>-
                            <span>{selectedRate.targetCurrency}</span>
                          </small>
                        </div>
                      </div>
                      <div style={{ alignItems: 'center', cursor: 'pointer' }}>
                        <Icon onClick={this.removeSelectedBeneficiary} type="close" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Form
                        name="fxRateForm"
                        layout="inline"
                        onSubmit={this.getFxBaseRatesByVendor}
                      >
                        <Form.Item>
                          {getFieldDecorator('fxRateDate', {
                            initialValue: moment(),
                            rules: [{ required: true, message: 'Please select Date!' }],
                          })(
                            <DatePicker
                              disabledDate={disabledFutureDate}
                              placeholder="Select Date"
                              format="DD/MM/YYYY"
                              onChange={this.handleFxrateDateChange}
                              onOk={this.onFxrateDateOk}
                            />,
                          )}
                        </Form.Item>
                        <Form.Item>
                          <Tooltip title={`Fetch ${selectedTransaction.vendorName} Rates`}>
                            <Button
                              loading={fxRateByVendorLoader}
                              type="primary"
                              className="ml-2"
                              icon="search"
                              htmlType="submit"
                            >
                              Fetch Rate
                            </Button>
                          </Tooltip>
                        </Form.Item>
                      </Form>
                      <Select
                        showSearch
                        style={{ width: 300 }}
                        placeholder="Select a Rate"
                        optionFilterProp="children"
                        onChange={this.onChange}
                        onSearch={this.onSearch}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {rateOptions}
                      </Select>
                      {/* <Tooltip title={`Refresh ${selectedTransaction.vendorName} Rates`}>
                            <Icon
                              className="ml-3"
                              type="reload"
                              onClick={this.getFxBaseRatesByVendor}
                            />
                          </Tooltip> */}
                    </>
                  )}
                  <div className="pt-3">
                    <Button
                      hidden={!rateSelected}
                      onClick={this.onClickContinueHandler}
                      className="mr-3"
                      type="primary"
                    >
                      Continue
                    </Button>
                    <Button
                      hidden={rateSelected}
                      onClick={this.onClickNoMatchHandler}
                      className="mt-2"
                      type="primary"
                    >
                      Spot Rate
                    </Button>
                  </div>
                </div>

                {isContinueClicked ? this.getQuoteForExistedRate() : ''}

                {isNoMatchClicked ? this.getQuoteForNewRate() : ''}
              </div>
            )}
          </div>
        </Col>
      </Row>
    )
  }
}
export default CryptoRates
