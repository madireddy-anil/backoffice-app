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
  // enteredReceivedAmount,
  updateTransactionAmount,
  selectReceivedAmountConfirmationDate,
  confirmReceivedAmountConfirmation,
} from 'redux/restrictedCurrencies/trade/tradeProcess/transactions/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, general, npTransactions, settings }) => ({
  token: user.token,
  srcCurrencies: general.currencies,
  isEditTxnMode: npTransactions.isEditTxnMode,
  txnConfirmReceivedAmountLoading: npTransactions.txnConfirmReceivedAmountLoading,
  depositCurrency: npTransactions.selectedTransaction.depositCurrency,
  totalDepositAmount: npTransactions.selectedTransaction.totalDepositAmount,
  isReceivedAmountConfirmed: npTransactions.isReceivedAmountConfirmed,
  depositsInPersonalAccount: npTransactions.selectedTransaction.depositsInPersonalAccount,
  depositsInCorporateAccount: npTransactions.selectedTransaction.depositsInCorporateAccount,
  updateTxnAmountLoader: npTransactions.updateTxnAmountLoader,
  conformReceivedAmountLoader: npTransactions.conformReceivedAmountLoader,
  progressLogs: npTransactions.selectedTransaction.progressLogs,
  txnDateTime: npTransactions.selectedTransaction.progressLogs.transactionRequestedAt,
  confirmedReceivedAmountDateByClient:
    npTransactions.selectedTransaction.progressLogs.depositsReceiptConfirmationByVendorAt,
  transactionId: npTransactions.selectedTransaction.id,
  timeZone: settings.timeZone.value,
})

@Form.create()
@connect(mapStateToProps)
class ReceivedAmount extends Component {
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

  handleReceivedAmountPopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleReceivedAmountChange = visible => {
    this.setState({ visible })
  }

  handleReceivedAmountChange = e => {
    const { form } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    // dispatch(enteredReceivedAmount(value ? parseFloat(value) : null))
    form.setFieldsValue({
      confirmedDepositAmountByClient: value ? parseFloat(value) : null,
    })
    this.setState({ enteredAmount: value ? parseFloat(value) : null })
  }

  onReceivedAmountBlurHandler = value => {
    // const { form } = this.props
    // form.setFieldsValue({
    //   confirmedDepositAmountByClient: amountFormatter(value),
    // })
    console.log(value)
  }

  onConfirmedReceivedAmountFocusHandler = value => {
    // const { form } = this.props
    // form.setFieldsValue({
    //   confirmedDepositAmountByClient: value,
    // })
    console.log(value)
  }

  handleUpdateTransactionAmount = () => {
    const {
      dispatch,
      token,
      transactionId,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
    } = this.props
    const value = {
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      transactionId,
    }
    dispatch(updateTransactionAmount(value, token))
  }

  handleReceivedDateConfirmationChange = value => {
    const { dispatch } = this.props
    let stringDate
    if (value) {
      const newDate = new Date(value)
      stringDate = newDate.toISOString()
    } else {
      stringDate = null
    }

    dispatch(selectReceivedAmountConfirmationDate(stringDate))
  }

  onReceivedConfirmationDateOk = value => {
    const { dispatch } = this.props
    const newDate = new Date(value)
    const stringDate = newDate.toISOString()
    dispatch(selectReceivedAmountConfirmationDate(stringDate))
  }

  handleConfirmReceivedConfirmation = () => {
    const {
      dispatch,
      transactionId,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      confirmedReceivedAmountDateByClient,
      progressLogs,
      token,
      form,
    } = this.props
    const value = {
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      date: confirmedReceivedAmountDateByClient,
      progressLogs,
      transactionId,
    }

    form.validateFields((err, values) => {
      if (!err) {
        values.confirmedDepositAmountByClient = values.confirmedDepositAmountByClient.replace(
          /,/g,
          '',
        )
        if (
          values.confirmedDepositAmountByClient !== depositsInCorporateAccount &&
          depositsInCorporateAccount !== 0
        ) {
          value.depositsInCorporateAccount = parseFloat(values.confirmedDepositAmountByClient)
          dispatch(confirmReceivedAmountConfirmation(value, token))
        } else if (
          values.confirmedDepositAmountByClient !== depositsInPersonalAccount &&
          depositsInPersonalAccount !== 0
        ) {
          value.depositsInPersonalAccount = parseFloat(values.confirmedDepositAmountByClient)
          dispatch(confirmReceivedAmountConfirmation(value, token))
        } else {
          dispatch(confirmReceivedAmountConfirmation(value, token))
        }
      } else {
        dispatch(confirmReceivedAmountConfirmation(value, token))
      }
    })
  }

  getEditSource = () => {
    const {
      form,
      depositCurrency,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      confirmedReceivedAmountDateByClient,
      // txnDateTime,
      timeZone,
    } = this.props
    const { enteredAmount } = this.state
    const confirmedDepositAmountByClient = depositsInPersonalAccount || depositsInCorporateAccount
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('confirmedDepositAmountByClient', {
            initialValue: amountFormatter(confirmedDepositAmountByClient),
          })(
            <Input
              addonBefore={depositCurrency}
              onChange={this.handleReceivedAmountChange}
              onFocus={() => this.onConfirmedReceivedAmountFocusHandler(enteredAmount)}
            />,
          )}
        </Form.Item>
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('confirmedReceivedAmountDateByClient', {
            initialValue: confirmedReceivedAmountDateByClient
              ? moment(
                  new Date(formatToZoneDateTZFormat(confirmedReceivedAmountDateByClient, timeZone)),
                )
              : null,
          })(
            <DatePicker
              disabledDate={disabledFutureDate}
              showTime={{
                defaultValue: moment(
                  confirmedReceivedAmountDateByClient
                    ? confirmedReceivedAmountDateByClient.substring(11, 19)
                    : null,
                  'HH:mm:ss',
                ),
              }}
              placeholder="Select Date"
              format="DD/MM/YYYY HH:mm:ss"
              // onChange={this.handleReceivedDateConfirmationChange}
              // onOk={this.onReceivedConfirmationDateOk}
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
    const {
      form,
      dispatch,
      transactionId,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
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
          depositsInPersonalAccount:
            depositsInPersonalAccount !== 0 && depositsInPersonalAccount !== amount
              ? amount
              : depositsInPersonalAccount,
          depositsInCorporateAccount:
            depositsInCorporateAccount !== 0 && depositsInCorporateAccount !== amount
              ? amount
              : depositsInCorporateAccount,
          date: new Date(value.confirmedReceivedAmountDateByClient).toISOString(),
          progressLogs,
          transactionId,
        }
        dispatch(confirmReceivedAmountConfirmation(values, token))
        this.handleReceivedAmountPopOver()
      }
    })
  }

  render() {
    const {
      depositCurrency,
      totalDepositAmount,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      confirmedReceivedAmountDateByClient,
      isReceivedAmountConfirmed,
      updateTxnAmountLoader,
      txnConfirmReceivedAmountLoading,
      // txnDateTime,
      form,
      isEditTxnMode,
      timeZone,
    } = this.props

    const { visible } = this.state

    const confirmDepositActions = [
      <span key="comment-basic-like">
        <Tooltip title="Update Trade Amount with this Deposit Amount">
          <Button
            type="primary"
            onClick={this.handleUpdateTransactionAmount}
            loading={updateTxnAmountLoader}
          >
            Update Transaction
          </Button>
        </Tooltip>
      </span>,
    ]

    const confirmedDepositAmountByClient = depositsInPersonalAccount || depositsInCorporateAccount

    return (
      <Row className="mt-4">
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <div>
            <h6>
              <strong>Received Amount:</strong>
            </h6>
            <div className={styles.prgressContent}>
              {isReceivedAmountConfirmed ? (
                <div className="rates-card">
                  <span className="font-size-12">Received Amount Confirmation:</span>
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
                            onVisibleChange={this.handleVisibleReceivedAmountChange}
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
                                {confirmedReceivedAmountDateByClient
                                  ? formatToZoneDate(confirmedReceivedAmountDateByClient, timeZone)
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
                            {confirmedReceivedAmountDateByClient
                              ? formatToZoneDate(confirmedReceivedAmountDateByClient, timeZone)
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
                        Please confirm total amount received in {depositCurrency}
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
                          disabled={isReceivedAmountConfirmed}
                          onChange={this.handleReceivedAmountChange}
                          onFocus={() =>
                            this.onConfirmedReceivedAmountFocusHandler(
                              confirmedDepositAmountByClient,
                            )
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
                      isReceivedAmountConfirmed
                    }
                  >
                    <Comment
                      actions={confirmDepositActions}
                      author={<a>PayConstruct Service</a>}
                      avatar={<Icon type="warning" theme="twoTone" twoToneColor="#faad14" />}
                      content={
                        <p className={styles.comment}>
                          Confirmed deposit amount does not match with the transaction request.
                          Please update the transaction request to continue and upload remittance
                          slip.
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
                          confirmedReceivedAmountDateByClient
                            ? confirmedReceivedAmountDateByClient.substring(11, 19)
                            : null,
                          'HH:mm:ss',
                        ),
                      }}
                      placeholder="Select Date"
                      format="DD/MM/YYYY HH:mm:ss"
                      defaultValue={
                        confirmedReceivedAmountDateByClient
                          ? moment(new Date(confirmedReceivedAmountDateByClient), 'DD/MM/YYYY')
                          : null
                      }
                      onChange={this.handleReceivedDateConfirmationChange}
                      disabled={
                        totalDepositAmount !== confirmedDepositAmountByClient ||
                        isReceivedAmountConfirmed
                      }
                      onOk={this.onReceivedConfirmationDateOk}
                    />
                  </div>
                  <div className="pt-3">
                    <Button
                      type="primary"
                      loading={txnConfirmReceivedAmountLoading}
                      onClick={this.handleConfirmReceivedConfirmation}
                      disabled={
                        confirmedDepositAmountByClient === 0 ||
                        confirmedDepositAmountByClient === null ||
                        confirmedReceivedAmountDateByClient === null
                      }
                      // hidden={isReceivedAmountConfirmed}
                    >
                      Confirm Received Amount
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
export default ReceivedAmount
