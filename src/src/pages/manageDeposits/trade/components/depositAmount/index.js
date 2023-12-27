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
  Spin,
  Popconfirm,
  Card,
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
  isDepositsInPersonalAccount: trade.isDepositsInPersonalAccount,
  isDepositsInCorporateAccount: trade.isDepositsInCorporateAccount,
  timeZone: settings.timeZone.value,
})

@Form.create()
@connect(mapStateToProps)
class DepositAmount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      enteredAmount: props.depositsInPersonalAccount || props.depositsInCorporateAccount,
    }
  }

  componentDidUpdate(prevProps) {
    const { depositsInPersonalAccount, depositsInCorporateAccount } = this.props
    if (
      prevProps.depositsInPersonalAccount !== depositsInPersonalAccount ||
      prevProps.depositsInCorporateAccount !== depositsInCorporateAccount
    ) {
      this.setEnteredAmount()
    }
  }

  setEnteredAmount = () => {
    const { depositsInPersonalAccount, depositsInCorporateAccount } = this.props
    const confirmedDepositAmountByClient = depositsInPersonalAccount || depositsInCorporateAccount
    this.setState({ enteredAmount: confirmedDepositAmountByClient })
  }

  hideSourcePopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleSourceChange = visible => {
    this.setState({ visible })
  }

  handleEditDepositAmountChange = e => {
    const { form } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    form.setFieldsValue({
      confirmedDepositAmountByClient: value ? parseFloat(value) : null,
    })
    this.setState({ enteredAmount: value ? parseFloat(value) : null })
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
    const { enteredAmount } = this.state
    const confirmedDepositAmountByClient = depositsInPersonalAccount || depositsInCorporateAccount

    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="" hasFeedback>
          {form.getFieldDecorator('confirmedDepositAmountByClient', {
            initialValue: amountFormatter(confirmedDepositAmountByClient),
            rules: [{ required: true, message: 'Please enter amount' }],
          })(
            <Input
              addonBefore={depositCurrency}
              onChange={this.handleEditDepositAmountChange}
              onBlur={() => this.onDepositBlurHandler(enteredAmount)}
              onFocus={() => this.onConfirmedDepositFocusHandler(enteredAmount)}
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
              // onChange={this.handleDepositConfirmationDateChange}
              // onOk={this.onDepositConfirmationDateOk}
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
          <Button className="m-1" type="primary">
            Update
          </Button>
          <Card className="mt-2" style={{ height: 100 }}>
            <Comment
              // actions={confirmDepositActions}
              author={<a>PayConstruct Service</a>}
              avatar={<Icon type="warning" theme="twoTone" twoToneColor="#faad14" />}
              content={
                <p>
                  Confirmed deposit amount does not match with the trade request. This will be
                  automatically updated
                </p>
              }
            />
          </Card>
        </Popconfirm>
      </Form>
    )
  }

  updateDepositConfirm = () => {
    const {
      form,
      dispatch,
      tradeId,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      isDepositsInPersonalAccount,
      isDepositsInCorporateAccount,
      progressLogs,
      token,
    } = this.props

    form.validateFields((err, value) => {
      if (!err) {
        value.confirmedDepositAmountByClient = value.confirmedDepositAmountByClient.replace(
          /,/g,
          '',
        )
        const amount = value.confirmedDepositAmountByClient
          ? parseFloat(value.confirmedDepositAmountByClient)
          : null
        const values = {
          depositsInPersonalAccount: isDepositsInPersonalAccount
            ? amount
            : depositsInPersonalAccount,
          depositsInCorporateAccount: isDepositsInCorporateAccount
            ? amount
            : depositsInCorporateAccount,
          date: new Date(value.confirmedDepositDateByClient).toISOString(),
          progressLogs,
          tradeId,
        }
        dispatch(confirmDepositConfirmation(values, token))
        this.hideSourcePopOver()
      }
    })
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
      isDepositsInCorporateAccount,
      // isDepositsInPersonalAccount,
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

    const spinIcon = <Icon type="loading" style={{ fontSize: 14 }} spin />

    const confirmedDepositAmountByClient = depositsInPersonalAccount || depositsInCorporateAccount

    return (
      <Row hidden={hidden} className="mt-4">
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <div>
            <h6>
              <strong>
                {isDepositsInCorporateAccount
                  ? 'Deposited Amount In Corporate Account:'
                  : 'Deposited Amount In Personal Account:'}
              </strong>
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
                              <Spin
                                spinning={conformDepositLoader}
                                className="ml-3"
                                indicator={spinIcon}
                              />
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
