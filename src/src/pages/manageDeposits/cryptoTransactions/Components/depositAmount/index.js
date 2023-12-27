import React, { Component } from 'react'
import {
  Row,
  Col,
  Form,
  Input,
  Comment,
  Icon,
  Tooltip,
  DatePicker,
  Button,
  Popover,
  Popconfirm,
} from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  amountFormatter,
  formatToZoneDate,
  formatToZoneDateTZFormat,
  disabledFutureDate,
} from 'utilities/transformer'

import {
  enteredDepositAmount,
  updateTradeAmount,
  selectDepositConfirmationDate,
  confirmDepositConfirmation,
} from 'redux/trade/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, general, trade, settings }) => ({
  token: user.token,
  srcCurrencies: general.currencies,
  isEditMode: trade.isEditMode,
  depositCurrency: trade.depositCurrency,
  totalDepositAmount: trade.totalDepositAmount,
  isDepositAmountConfirmed: trade.isDepositAmountConfirmed,
  depositsInPersonalAccount: trade.depositsInPersonalAccount,
  depositsInCorporateAccount: trade.depositsInCorporateAccount,
  updateTradeAmountLoader: trade.updateTradeAmountLoader,
  conformDepositLoader: trade.conformDepositLoader,
  progressLogs: trade.progressLogs,
  tradeDateTime: trade.progressLogs.tradeRequestedAt,
  confirmedDepositDateByClient: trade.progressLogs.depositConfirmedByClientAt || null,
  tradeId: trade.tradeId,
  timeZone: settings.timeZone.value,
})

@Form.create()
@connect(mapStateToProps)
class DepositAmount extends Component {
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

  handleDepositAmountChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(enteredDepositAmount(value ? parseFloat(value) : null))
  }

  onDepositBlurHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      confirmedDepositAmountByClient: amountFormatter(value),
    })
  }

  onConfirmedDepositFocusHandler = value => {
    const { form } = this.props
    console.log(value)
    form.setFieldsValue({
      confirmedDepositAmountByClient: value,
    })
  }

  handleUpdateTradeAmount = () => {
    const {
      dispatch,
      tradeId,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      token,
    } = this.props
    const value = {
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      tradeId,
    }
    dispatch(updateTradeAmount(value, token))
  }

  handleDepositConfirmationDateChange = value => {
    const { dispatch } = this.props
    let stringDate
    if (value) {
      const newDate = new Date(value)
      stringDate = newDate.toISOString()
    } else {
      stringDate = null
    }

    dispatch(selectDepositConfirmationDate(stringDate))
  }

  onDepositConfirmationDateOk = value => {
    const { dispatch } = this.props
    const newDate = new Date(value)
    const stringDate = newDate.toISOString()
    dispatch(selectDepositConfirmationDate(stringDate))
  }

  handleConfirmDepositConfirmation = () => {
    const {
      dispatch,
      tradeId,
      confirmedDepositDateByClient,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      progressLogs,
      token,
    } = this.props
    const value = {
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      date: confirmedDepositDateByClient,
      progressLogs,
      tradeId,
    }
    dispatch(confirmDepositConfirmation(value, token))
  }

  getEditSource = () => {
    const {
      form,
      depositCurrency,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      confirmedDepositDateByClient,
      // tradeDateTime,
      timeZone,
    } = this.props
    const confirmedDepositAmountByClient = depositsInPersonalAccount || depositsInCorporateAccount
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('confirmedDepositAmountByClient', {
            initialValue: amountFormatter(confirmedDepositAmountByClient),
          })(
            <Input
              addonBefore={depositCurrency}
              onChange={this.handleDepositAmountChange}
              onBlur={() => this.onDepositBlurHandler(confirmedDepositAmountByClient)}
              onFocus={() => this.onConfirmedDepositFocusHandler(confirmedDepositAmountByClient)}
            />,
          )}
        </Form.Item>
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('confirmedDepositDateByClient', {
            initialValue: confirmedDepositDateByClient
              ? moment(new Date(formatToZoneDateTZFormat(confirmedDepositDateByClient, timeZone)))
              : null,
          })(
            <DatePicker
              disabledDate={disabledFutureDate}
              showTime={{
                defaultValue: moment(
                  confirmedDepositDateByClient
                    ? confirmedDepositDateByClient.substring(11, 19)
                    : null,
                  'HH:mm:ss',
                ),
              }}
              placeholder="Select Date"
              format="DD/MM/YYYY HH:mm:ss"
              onChange={this.handleDepositConfirmationDateChange}
              onOk={this.onDepositConfirmationDateOk}
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
    this.handleConfirmDepositConfirmation()
    this.hideSourcePopOver()
  }

  render() {
    const {
      depositCurrency,
      totalDepositAmount,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      confirmedDepositDateByClient,
      isDepositAmountConfirmed,
      updateTradeAmountLoader,
      conformDepositLoader,
      // tradeDateTime,
      form,
      isEditMode,
      hidden,
      timeZone,
    } = this.props

    const { visible } = this.state

    const confirmDepositActions = [
      <span key="comment-basic-like">
        <Tooltip title="Update Trade Amount with this Deposit Amount">
          <Button
            type="primary"
            onClick={this.handleUpdateTradeAmount}
            loading={updateTradeAmountLoader}
          >
            Update Trade Amount
          </Button>
        </Tooltip>
      </span>,
    ]

    const confirmedDepositAmountByClient = depositsInPersonalAccount || depositsInCorporateAccount

    return (
      <Row hidden={hidden} className="mt-4">
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <div>
            <h6>
              <strong>Deposit Amount:</strong>
            </h6>
            <div className={styles.prgressContent}>
              {isDepositAmountConfirmed ? (
                <div className="rates-card">
                  <span className="font-size-12">Deposited Confirmation:</span>
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
                              <strong>{depositCurrency} </strong>
                              <strong className="edit-mode">
                                {confirmedDepositAmountByClient
                                  ? amountFormatter(confirmedDepositAmountByClient)
                                  : ''}
                              </strong>
                              {' at '}
                              <span className="edit-mode">
                                {confirmedDepositDateByClient
                                  ? formatToZoneDate(confirmedDepositDateByClient, timeZone)
                                  : ''}
                              </span>
                            </span>
                          </Popover>
                        ) : (
                          <span className="font-size-15">
                            <strong>
                              {depositCurrency}{' '}
                              {confirmedDepositAmountByClient
                                ? amountFormatter(confirmedDepositAmountByClient)
                                : ''}
                            </strong>
                            {' at '}
                            {confirmedDepositDateByClient
                              ? formatToZoneDate(confirmedDepositDateByClient, timeZone)
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
                      <span className="font-size-12">
                        Please confirm total amount deposited in {depositCurrency}
                      </span>
                    </div>
                    <Form.Item label="">
                      {form.getFieldDecorator('confirmedDepositAmountByClient', {
                        initialValue: amountFormatter(confirmedDepositAmountByClient),
                        rules: [{ message: 'Please Enter Deposited Amount!' }],
                      })(
                        <Input
                          style={{ width: '50%' }}
                          addonBefore={depositCurrency}
                          disabled={isDepositAmountConfirmed}
                          onChange={this.handleDepositAmountChange}
                          onBlur={() => this.onDepositBlurHandler(confirmedDepositAmountByClient)}
                          onFocus={() =>
                            this.onConfirmedDepositFocusHandler(confirmedDepositAmountByClient)
                          }
                        />,
                      )}
                    </Form.Item>
                  </div>
                  <div
                    className={styles.notification}
                    hidden={
                      totalDepositAmount === confirmedDepositAmountByClient ||
                      confirmedDepositAmountByClient === null ||
                      isDepositAmountConfirmed
                    }
                  >
                    <Comment
                      actions={confirmDepositActions}
                      author={<a>PayConstruct Service</a>}
                      avatar={<Icon type="warning" theme="twoTone" twoToneColor="#faad14" />}
                      content={
                        <p className={styles.comment}>
                          Confirmed deposit amount does not match with the trade request. Please
                          update the trade request to continue and receive rate.
                        </p>
                      }
                      datetime={
                        <Tooltip title={moment().format('DD/MM/YYYY HH:mm:ss')}>
                          <span>{moment().fromNow()}</span>
                        </Tooltip>
                      }
                    />
                  </div>
                  <div className="pt-3">
                    <DatePicker
                      disabledDate={disabledFutureDate}
                      showTime={{
                        defaultValue: moment(
                          confirmedDepositDateByClient
                            ? confirmedDepositDateByClient.substring(11, 19)
                            : null,
                          'HH:mm:ss',
                        ),
                      }}
                      placeholder="Select Date"
                      format="DD/MM/YYYY HH:mm:ss"
                      defaultValue={
                        confirmedDepositDateByClient
                          ? moment(new Date(confirmedDepositDateByClient), 'DD/MM/YYYY')
                          : null
                      }
                      onChange={this.handleDepositConfirmationDateChange}
                      disabled={
                        totalDepositAmount !== confirmedDepositAmountByClient ||
                        isDepositAmountConfirmed
                      }
                      onOk={this.onDepositConfirmationDateOk}
                    />
                  </div>
                  <div className="pt-3">
                    <Button
                      type="primary"
                      loading={conformDepositLoader}
                      onClick={this.handleConfirmDepositConfirmation}
                      disabled={
                        confirmedDepositAmountByClient === 0 ||
                        confirmedDepositAmountByClient === null ||
                        confirmedDepositDateByClient === null
                      }
                      // hidden={isDepositAmountConfirmed}
                    >
                      Confirm Deposits
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
export default DepositAmount
