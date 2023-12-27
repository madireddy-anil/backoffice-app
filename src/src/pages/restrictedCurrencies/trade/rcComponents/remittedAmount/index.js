import React, { Component } from 'react'
import { Row, Col, Form, Input, DatePicker, Button, Popover, Popconfirm, message } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  amountFormatter,
  formatToZoneDate,
  formatToZoneDateTZFormat,
  disabledFutureDate,
} from 'utilities/transformer'
import {
  enteredRemittedAmount,
  selectRemittedAmountConfirmDate,
  confirmRemittedFunds,
  // handleTxnFeeCalculation,
} from 'redux/restrictedCurrencies/trade/tradeProcess/transactions/actions'

import {
  createAutoRoute,
  updateRouteStatus,
  updateTradeDetails,
  // updateFeesPcMargin,
} from 'redux/restrictedCurrencies/trade/tradeProcess/tradeDetails/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ settings, user, npTransactions, npTrade }) => ({
  token: user.token,
  isEditTxnMode: npTransactions.isEditTxnMode,
  transactionId: npTransactions.selectedTransaction.id,
  txnConfirmRemittedFundsLoading: npTransactions.txnConfirmRemittedFundsLoading,
  settlementCurrency: npTransactions.selectedTransaction.settlementCurrency,
  isRemittedFundsConfirmed: npTransactions.isRemittedFundsConfirmed,
  fundReceiptConfirmAmountByClient: npTransactions.selectedTransaction.settlementAmount,
  fundReceiptConfirmDateByClient:
    npTransactions.selectedTransaction.progressLogs.fundsRemittedByVendorAt,
  txnDateTime: npTransactions.selectedTransaction.progressLogs.transactionRequestedAt,
  selectedTransaction: npTransactions.selectedTransaction,
  timeZone: settings.timeZone.value,
  routeEngineData: npTrade.routeEngineData,
  tradeId: npTrade.id,
  clientId: npTrade.clientId,
  progressLogs: npTrade.progressLogs,
  sourceCurrency: npTransactions.selectedTransaction.depositCurrency,
  sourceAmount: npTransactions.selectedTransaction.totalDepositAmount,
  amountSold: npTransactions.selectedTransaction.amountSold,
  rate: npTransactions.rate,
})

@Form.create()
@connect(mapStateToProps)
class RemittedAmount extends Component {
  state = {
    visible: false,
  }

  hideSourcePopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleSourceChange = visible => {
    this.setState({ visible })
  }

  handleRemittedAmountChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(enteredRemittedAmount(value ? parseFloat(value) : null))
  }

  onRemittedAmountBlurHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      finalReceivedAmount: amountFormatter(value),
    })
  }

  onRemittedAmountFocusHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      finalReceivedAmount: value,
    })
  }

  handleRemittedAmountConfirmDateChange = value => {
    const { dispatch } = this.props
    let stringDate
    if (value) {
      const newDate = new Date(value)
      stringDate = newDate.toISOString()
    } else {
      stringDate = null
    }

    dispatch(selectRemittedAmountConfirmDate(stringDate))
  }

  onRemittedAmountConfirmDateOk = value => {
    const { dispatch } = this.props
    const newDate = new Date(value)
    const stringDate = newDate.toISOString()
    dispatch(selectRemittedAmountConfirmDate(stringDate))
  }

  handleRemittedAmountConfirm = () => {
    const {
      dispatch,
      transactionId,
      fundReceiptConfirmAmountByClient,
      fundReceiptConfirmDateByClient,
      token,
      selectedTransaction,
      progressLogs,
      tradeId,
      routeEngineData,
      // clientId,
      // sourceCurrency,
      // sourceAmount,
      // rate,
      // amountSold,
      // settlementCurrency,
    } = this.props

    // const { rateAppliedAt } = rate

    const value = {
      amount: fundReceiptConfirmAmountByClient,
      date: fundReceiptConfirmDateByClient,
      transactionId,
      progressLogs: selectedTransaction.progressLogs,
    }
    Promise.resolve(dispatch(confirmRemittedFunds(value, token))).then(() => {
      // if(isRemittedFundsConfirmed){
      const routeId = selectedTransaction.tradeRouterId
      const currentRoute = routeEngineData.find(el => el.id === routeId)
      const values = {
        routeId,
        status: 'completed',
      }
      dispatch(updateRouteStatus(values, tradeId, token))
      if (!currentRoute.allSequenceComplete) {
        this.createRoute()
        message
          .loading('Analysing transaction sequence..', 1)
          .then(() => message.warning('All sequences is not completed', 1))
          .then(() => message.info('Creating another route', 2.5))
      } else {
        message
          .loading('Analysing transaction sequence..', 1)
          .then(() => message.success('All sequences completed', 1))
          .then(() => message.success('Trade fund remitted', 2.5))

        // trade update funds remitted
        const tradeValues = {
          settlementAmount: fundReceiptConfirmAmountByClient,
          tradeStatus: 'funds_remitted',
          progressLogs: {
            ...progressLogs,
            fundsRemittedToClientAt: fundReceiptConfirmDateByClient,
          },
        }
        dispatch(updateTradeDetails(tradeValues, tradeId, token))

        // fee Calc

        // const rateApplied = rateAppliedAt

        // const feeCalc = {
        //   accountType: 'payconstruct',
        //   feeType: 'pc_revenue',
        //   feeCurrency: settlementCurrency,
        //   tradeAmount: sourceAmount,
        //   rateAppliedAt: rateApplied || '',
        //   amountSold,
        //   tradeId,
        //   clientId,
        //   sourceCurrency,
        // }

        // dispatch(handleTxnFeeCalculation(feeCalc, token))
      }
      // }
    })
  }

  createRoute = () => {
    const { routeEngineData, tradeId, clientId, selectedTransaction, dispatch, token } = this.props
    const newRow = {
      tradeId,
      clientId,
      depositCurrency: selectedTransaction.settlementCurrency,
      settlementCurrency: '',
      depositsInPersonalAccount: selectedTransaction.depositsInPersonalAccount
        ? selectedTransaction.settlementAmount
        : 0,
      depositsInCorporateAccount: selectedTransaction.depositsInCorporateAccount
        ? selectedTransaction.settlementAmount
        : 0,
      sequence: routeEngineData.length + 1,
      routeStatus: 'new',
    }
    dispatch(createAutoRoute(newRow, token))
  }

  getEditSource = () => {
    const {
      form,
      settlementCurrency,
      fundReceiptConfirmAmountByClient,
      fundReceiptConfirmDateByClient,
      // txnDateTime,
      timeZone,
    } = this.props
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('finalReceivedAmount', {
            initialValue: amountFormatter(fundReceiptConfirmAmountByClient),
          })(
            <Input
              addonBefore={settlementCurrency}
              onChange={this.handleRemittedAmountChange}
              onBlur={() => this.onRemittedAmountBlurHandler(fundReceiptConfirmAmountByClient)}
              onFocus={() => this.onRemittedAmountFocusHandler(fundReceiptConfirmAmountByClient)}
            />,
          )}
        </Form.Item>
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('fundReceiptConfirmDateByClient', {
            initialValue: fundReceiptConfirmDateByClient
              ? moment(new Date(formatToZoneDateTZFormat(fundReceiptConfirmDateByClient, timeZone)))
              : null,
          })(
            <DatePicker
              disabledDate={disabledFutureDate}
              showTime={{
                defaultValue: moment(
                  fundReceiptConfirmDateByClient
                    ? fundReceiptConfirmDateByClient.substring(11, 19)
                    : null,
                  'HH:mm:ss',
                ),
              }}
              placeholder="Select Date"
              format="DD/MM/YYYY HH:mm:ss"
              onChange={this.handleRemittedAmountConfirmDateChange}
              onOk={this.onRemittedAmountConfirmDateOk}
            />,
          )}
        </Form.Item>
        <Popconfirm
          title="Sure to update?"
          onConfirm={() => {
            this.updateFinalFunds()
          }}
        >
          <Button className="mt-2" type="primary">
            Update
          </Button>
        </Popconfirm>
        {/* <Button className="mt-2" type="primary" onClick={this.updateFinalFunds}>
          Update
        </Button> */}
      </Form>
    )
  }

  updateFinalFunds = () => {
    this.handleRemittedAmountConfirm()
    this.hideSourcePopOver()
  }

  render() {
    const {
      isRemittedFundsConfirmed,
      settlementCurrency,
      fundReceiptConfirmAmountByClient,
      fundReceiptConfirmDateByClient,
      txnConfirmRemittedFundsLoading,
      form,
      isEditTxnMode,
      timeZone,
    } = this.props
    const { visible } = this.state
    return (
      <Row className="mt-4">
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <div>
            <h6>
              <strong>Funds Remit Confirmation:</strong>
            </h6>
            <div className={styles.prgressContent}>
              {isRemittedFundsConfirmed ? (
                <div className="rates-card">
                  <span className="font-size-12">Final funds remitted:</span>
                  <div className={styles.prgressContent}>
                    <div>
                      <div className="pt-3">
                        {isEditTxnMode ? (
                          <Popover
                            content={this.getEditSource()}
                            title="Deposit Confirmation Date and Amount"
                            trigger="click"
                            placement="topLeft"
                            visible={visible}
                            onVisibleChange={this.handleVisibleSourceChange}
                            arrowPointAtCenter
                          >
                            <span className="font-size-15">
                              <strong>{settlementCurrency} </strong>
                              <strong className="edit-mode">
                                {fundReceiptConfirmAmountByClient
                                  ? amountFormatter(fundReceiptConfirmAmountByClient)
                                  : ''}
                              </strong>
                              {' at '}
                              <span className="edit-mode">
                                {fundReceiptConfirmDateByClient
                                  ? formatToZoneDate(fundReceiptConfirmDateByClient, timeZone)
                                  : ''}
                              </span>
                            </span>
                          </Popover>
                        ) : (
                          <span className="font-size-15">
                            <strong>
                              {settlementCurrency}{' '}
                              {fundReceiptConfirmAmountByClient
                                ? amountFormatter(fundReceiptConfirmAmountByClient)
                                : ''}
                            </strong>{' '}
                            {fundReceiptConfirmDateByClient
                              ? formatToZoneDate(fundReceiptConfirmDateByClient, timeZone)
                              : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <div className="pb-3">
                      <span className="font-size-12">Please confirm total amount Remitted</span>
                    </div>
                    <Form.Item label="">
                      {form.getFieldDecorator('finalReceivedAmount', {
                        initialValue: amountFormatter(fundReceiptConfirmAmountByClient),
                        rules: [{ message: 'Please Enter Recieved Amount!' }],
                      })(
                        <Input
                          style={{ width: '50%' }}
                          addonBefore={settlementCurrency}
                          disabled={isRemittedFundsConfirmed}
                          onChange={this.handleRemittedAmountChange}
                          onBlur={() =>
                            this.onRemittedAmountBlurHandler(fundReceiptConfirmAmountByClient)
                          }
                          onFocus={() =>
                            this.onRemittedAmountFocusHandler(fundReceiptConfirmAmountByClient)
                          }
                        />,
                      )}
                    </Form.Item>
                    <div className="pt-3">
                      <DatePicker
                        disabledDate={disabledFutureDate}
                        showTime={{
                          defaultValue: moment(
                            fundReceiptConfirmDateByClient
                              ? fundReceiptConfirmDateByClient.substring(11, 19)
                              : '',
                            'HH:mm:ss',
                          ),
                        }}
                        placeholder="Select Date"
                        format="DD/MM/YYYY HH:mm:ss"
                        defaultValue={
                          fundReceiptConfirmDateByClient
                            ? moment(
                                new Date(
                                  formatToZoneDateTZFormat(
                                    fundReceiptConfirmDateByClient,
                                    timeZone,
                                  ),
                                ),
                                'DD/MM/YYYY',
                              )
                            : null
                        }
                        onChange={this.handleRemittedAmountConfirmDateChange}
                        disabled={
                          fundReceiptConfirmAmountByClient === null || isRemittedFundsConfirmed
                        }
                        onOk={this.onRemittedAmountConfirmDateOk}
                      />
                    </div>
                  </div>
                  <div className="pt-3" hidden={isRemittedFundsConfirmed}>
                    <Button
                      type="primary"
                      className="mr-3"
                      loading={txnConfirmRemittedFundsLoading}
                      onClick={this.handleRemittedAmountConfirm}
                      disabled={
                        fundReceiptConfirmAmountByClient === 0 ||
                        fundReceiptConfirmDateByClient === undefined ||
                        fundReceiptConfirmDateByClient === ''
                      }
                    >
                      Confirm Remitted Funds
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
export default RemittedAmount
