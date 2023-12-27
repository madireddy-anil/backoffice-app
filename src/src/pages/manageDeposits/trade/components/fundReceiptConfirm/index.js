import React, { Component } from 'react'
import { Row, Col, Form, Input, DatePicker, Button, Popover, Spin, Icon, Popconfirm } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  amountFormatter,
  formatToZoneDate,
  formatToZoneDateTZFormat,
  disabledFutureDate,
} from 'utilities/transformer'
import {
  enteredFundReceiptConfirmAmount,
  selectFundReceivedConfirmDate,
  confirmFinalFunds,
} from 'redux/trade/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ settings, user, chat, trade }) => ({
  token: user.token,
  email: user.email,
  chatToken: chat.token,
  isEditMode: trade.isEditMode,
  tradeId: trade.tradeId,
  settlementCurrency: trade.settlementCurrency,
  isFundReceiptConfirmed: trade.isFundReceiptConfirmed,
  fundReceiptConfirmAmountByClient: trade.fundReceiptConfirmAmountByClient,
  fundReceiptConfirmDateByClient: trade.fundReceiptConfirmDateByClient,
  confirmFundsLoader: trade.confirmFundsLoader,
  channelId: trade.chat.channelId,
  progressLogs: trade.progressLogs,
  tradeDateTime: trade.progressLogs.tradeRequestedAt,
  isTradeFundRemitted: trade.progressLogs.fundsRemittedToClientAt,
  timeZone: settings.timeZone.value,
})

@Form.create()
@connect(mapStateToProps)
class FundReceiptConfirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      enteredAmount: props.fundReceiptConfirmAmountByClient,
    }
  }

  componentDidUpdate(prevProps) {
    const { fundReceiptConfirmAmountByClient } = this.props
    if (prevProps.fundReceiptConfirmAmountByClient !== fundReceiptConfirmAmountByClient) {
      this.setEnteredAmount()
    }
  }

  setEnteredAmount = () => {
    const { fundReceiptConfirmAmountByClient } = this.props
    this.setState({ enteredAmount: fundReceiptConfirmAmountByClient })
  }

  hideSourcePopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleSourceChange = visible => {
    this.setState({ visible })
  }

  handleEditFinalFundReceivedConfirmAmountChange = e => {
    const { form } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    form.setFieldsValue({
      finalReceivedAmount: value ? parseFloat(value) : null,
    })
    this.setState({ enteredAmount: value ? parseFloat(value) : null })
  }

  handleFinalFundReceivedConfirmAmountChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(enteredFundReceiptConfirmAmount(value ? parseFloat(value) : null))
  }

  onFinalFundBlurHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      finalReceivedAmount: amountFormatter(value),
    })
  }

  onFinalFundFocusHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      finalReceivedAmount: value,
    })
  }

  handleFinalFundReceivedConfirmDateChange = value => {
    const { dispatch } = this.props
    let stringDate
    if (value) {
      const newDate = new Date(value)
      stringDate = newDate.toISOString()
    } else {
      stringDate = null
    }

    dispatch(selectFundReceivedConfirmDate(stringDate))
  }

  onFinalFundReceivedConfirmDateOk = value => {
    const { dispatch } = this.props
    const newDate = new Date(value)
    const stringDate = newDate.toISOString()
    dispatch(selectFundReceivedConfirmDate(stringDate))
  }

  handleFinalFundReceivedConfirm = () => {
    const {
      dispatch,
      channelId,
      tradeId,
      fundReceiptConfirmAmountByClient,
      fundReceiptConfirmDateByClient,
      progressLogs,
      token,
      chatToken,
      email,
    } = this.props
    const value = {
      amount: fundReceiptConfirmAmountByClient,
      date: fundReceiptConfirmDateByClient,
      tradeId,
      progressLogs,

      chatToken,
      channelId,
      clientEmail: email,
    }
    dispatch(confirmFinalFunds(value, token))
  }

  getEditSource = () => {
    const {
      form,
      settlementCurrency,
      fundReceiptConfirmAmountByClient,
      fundReceiptConfirmDateByClient,
      // tradeDateTime,
      timeZone,
    } = this.props
    const { enteredAmount } = this.state
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="" hasFeedback>
          {form.getFieldDecorator('finalReceivedAmount', {
            initialValue: amountFormatter(fundReceiptConfirmAmountByClient),
            rules: [{ required: true, message: 'Please input amount' }],
          })(
            <Input
              addonBefore={settlementCurrency}
              onChange={this.handleEditFinalFundReceivedConfirmAmountChange}
              onBlur={() => this.onFinalFundBlurHandler(enteredAmount)}
              onFocus={() => this.onFinalFundFocusHandler(enteredAmount)}
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
              // onChange={this.handleFinalFundReceivedConfirmDateChange}
              // onOk={this.onFinalFundReceivedConfirmDateOk}
            />,
          )}
        </Form.Item>
        {/* <Button className="mt-2" type="primary" onClick={this.updateDepositConfirm}>
          Update
        </Button> */}
        <Popconfirm
          title="Sure to update?"
          onConfirm={() => {
            this.updateDepositConfirm()
          }}
        >
          <Button className="mt-2" type="primary">
            Update
          </Button>
        </Popconfirm>
      </Form>
    )
  }

  updateDepositConfirm = () => {
    const { form, dispatch, channelId, tradeId, progressLogs, token, chatToken, email } = this.props
    form.validateFields((err, value) => {
      if (!err) {
        value.finalReceivedAmount = value.finalReceivedAmount.replace(/,/g, '')
        const values = {
          amount: value.finalReceivedAmount ? parseFloat(value.finalReceivedAmount) : null,
          date: new Date(value.fundReceiptConfirmDateByClient).toISOString(),
          tradeId,
          progressLogs,

          chatToken,
          channelId,
          clientEmail: email,
        }
        dispatch(confirmFinalFunds(values, token))
        this.hideSourcePopOver()
      }
    })
  }

  render() {
    const {
      isTradeFundRemitted,
      isFundReceiptConfirmed,
      settlementCurrency,
      fundReceiptConfirmAmountByClient,
      fundReceiptConfirmDateByClient,
      confirmFundsLoader,
      form,
      isEditMode,
      timeZone,
      hidden,
    } = this.props
    const { visible } = this.state
    const spinIcon = <Icon type="loading" style={{ fontSize: 14 }} spin />
    return (
      <Row hidden={hidden} className="mt-4">
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <div>
            <h6>
              <strong>Funds Receipt Confirmation:</strong>
            </h6>
            <div className={styles.prgressContent}>
              {isFundReceiptConfirmed ? (
                <div className="rates-card">
                  <span className="font-size-12">Final funds received to client:</span>
                  <div className={styles.prgressContent}>
                    <div>
                      <div className="pt-3">
                        {isEditMode ? (
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
                              <Spin
                                spinning={confirmFundsLoader}
                                className="ml-3"
                                indicator={spinIcon}
                              />
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
              ) : isTradeFundRemitted ? (
                <div>
                  <div>
                    <div className="pb-3">
                      <span className="font-size-12">Please confirm total amount Received</span>
                    </div>
                    <Form.Item label="">
                      {form.getFieldDecorator('finalReceivedAmount', {
                        initialValue: amountFormatter(fundReceiptConfirmAmountByClient),
                        rules: [{ message: 'Please Enter Recieved Amount!' }],
                      })(
                        <Input
                          style={{ width: '50%' }}
                          addonBefore={settlementCurrency}
                          disabled={isFundReceiptConfirmed}
                          onChange={this.handleFinalFundReceivedConfirmAmountChange}
                          onBlur={() =>
                            this.onFinalFundBlurHandler(fundReceiptConfirmAmountByClient)
                          }
                          onFocus={() =>
                            this.onFinalFundFocusHandler(fundReceiptConfirmAmountByClient)
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
                            ? moment(new Date(fundReceiptConfirmDateByClient), 'DD/MM/YYYY')
                            : null
                        }
                        onChange={this.handleFinalFundReceivedConfirmDateChange}
                        disabled={
                          fundReceiptConfirmAmountByClient === null || isFundReceiptConfirmed
                        }
                        onOk={this.onFinalFundReceivedConfirmDateOk}
                      />
                    </div>
                  </div>
                  <div className="pt-3" hidden={isFundReceiptConfirmed}>
                    <Button
                      type="primary"
                      className="mr-3"
                      loading={confirmFundsLoader}
                      onClick={this.handleFinalFundReceivedConfirm}
                      disabled={
                        fundReceiptConfirmAmountByClient === 0 ||
                        fundReceiptConfirmAmountByClient === null ||
                        fundReceiptConfirmDateByClient === null
                      }
                    >
                      Confirm Funds
                    </Button>
                    <Button type="secondary" disabled>
                      Request Review
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rates-card">
                  <div className="pb-3">
                    <span className="font-size-12">
                      Please wait until the final funds to remit...
                    </span>
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
export default FundReceiptConfirm
