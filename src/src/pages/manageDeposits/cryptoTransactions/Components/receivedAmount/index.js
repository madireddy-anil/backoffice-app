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
} from 'redux/cryptoTransactions/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, general, settings, cryptoTransaction, routingEngine }) => ({
  token: user.token,
  srcCurrencies: general.currencies,
  isEditCryptoTxnMode: cryptoTransaction.isEditCryptoTxnMode,
  depositCurrency: cryptoTransaction.selectedTransaction.depositCurrency,
  totalDepositAmount: cryptoTransaction.selectedTransaction.totalDepositAmount,
  isReceivedAmountConfirmed: cryptoTransaction.isReceivedAmountConfirmed,
  updateTxnAmountLoader: cryptoTransaction.updateTxnAmountLoader,
  conformReceivedAmountLoader: cryptoTransaction.conformReceivedAmountLoader,
  progressLogs: cryptoTransaction.selectedTransaction.progressLogs,
  depositsInPersonalAccount: cryptoTransaction.selectedTransaction.depositsInPersonalAccount,
  depositsInCorporateAccount: cryptoTransaction.selectedTransaction.depositsInCorporateAccount,
  isDepositsInPersonalAccount: cryptoTransaction.selectedTransaction.isDepositsInPersonalAccount,
  isDepositsInCorporateAccount: cryptoTransaction.selectedTransaction.isDepositsInCorporateAccount,
  txnDateTime: cryptoTransaction.selectedTransaction.progressLogs.transactionRequestedAt,
  confirmedReceivedAmountDateByClient:
    cryptoTransaction.selectedTransaction.progressLogs.depositsReceiptConfirmationByVendorAt,
  cryptoTransactionId: cryptoTransaction.selectedTransaction.id,
  timeZone: settings.timeZone.value,
  totalValue: cryptoTransaction.receivedValue,
  routingEngineData: routingEngine.routeEngineData,
})

@Form.create()
@connect(mapStateToProps)
class ReceivedAmount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      enteredAmount: props.totalDepositAmount,
    }
  }

  componentDidUpdate(prevProps) {
    const { totalDepositAmount } = this.props
    if (prevProps.totalDepositAmount !== totalDepositAmount) {
      this.setEnteredAmount()
    }
  }

  setEnteredAmount = () => {
    const { totalDepositAmount } = this.props
    const confirmedDepositAmountByClient = totalDepositAmount
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
    form.setFieldsValue({
      confirmedDepositAmountByClient: value ? parseFloat(value) : null,
    })
    this.setState({ enteredAmount: value ? parseFloat(value) : null })
  }

  onReceivedAmountBlurHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      confirmedDepositAmountByClient: amountFormatter(value),
    })
  }

  onConfirmedReceivedAmountFocusHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      confirmedDepositAmountByClient: value,
    })
  }

  handleUpdateTransactionAmount = () => {
    const { dispatch, token, cryptoTransactionId, totalDepositAmount } = this.props
    const value = {
      totalDepositAmount,
      cryptoTransactionId,
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
      cryptoTransactionId,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      confirmedReceivedAmountDateByClient,
      isDepositsInPersonalAccount,
      isDepositsInCorporateAccount,
      progressLogs,
      token,
      form,
    } = this.props
    const value = {
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      date: confirmedReceivedAmountDateByClient,
      progressLogs,
      cryptoTransactionId,
    }

    form.validateFields((err, values) => {
      if (!err) {
        values.confirmedDepositAmountByClient = values.confirmedDepositAmountByClient.replace(
          /,/g,
          '',
        )
        // if (totalDepositAmount !== values.confirmedDepositAmountByClient) {
        //   value.totalDepositAmount = parseFloat(values.confirmedDepositAmountByClient)
        //   dispatch(confirmReceivedAmountConfirmation(value, token))
        // }
        if (
          values.confirmedDepositAmountByClient !== depositsInCorporateAccount &&
          isDepositsInCorporateAccount
        ) {
          value.depositsInCorporateAccount = parseFloat(values.confirmedDepositAmountByClient)
          dispatch(confirmReceivedAmountConfirmation(value, token))
        } else if (
          values.confirmedDepositAmountByClient !== depositsInPersonalAccount &&
          isDepositsInPersonalAccount
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
      confirmedReceivedAmountDateByClient,
      timeZone,
      totalDepositAmount,
    } = this.props
    const { enteredAmount } = this.state
    const confirmedDepositAmountByClient = totalDepositAmount
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('confirmedDepositAmountByClient', {
            initialValue: amountFormatter(confirmedDepositAmountByClient),
          })(
            <Input
              addonBefore={depositCurrency}
              onChange={this.handleReceivedAmountChange}
              onBlur={() => this.onReceivedAmountBlurHandler(enteredAmount)}
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
      cryptoTransactionId,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
      isDepositsInPersonalAccount,
      routingEngineData,
      isDepositsInCorporateAccount,
      progressLogs,
      token,
    } = this.props

    let isDepositConfirmedByVendorInSeq1 = false

    if (routingEngineData.length > 0) {
      if (
        routingEngineData[0].transactionId === cryptoTransactionId &&
        routingEngineData[0].sequence === 1
      ) {
        isDepositConfirmedByVendorInSeq1 = true
      }
    }

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
          isDepositConfirmedByVendorInSeq1,
          depositsInPersonalAccount:
            isDepositsInPersonalAccount && depositsInPersonalAccount !== amount
              ? amount
              : depositsInPersonalAccount,
          depositsInCorporateAccount:
            isDepositsInCorporateAccount && depositsInCorporateAccount !== amount
              ? amount
              : depositsInCorporateAccount,
          date: new Date(value.confirmedReceivedAmountDateByClient).toISOString(),
          progressLogs,
          cryptoTransactionId,
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
      confirmedReceivedAmountDateByClient,
      isReceivedAmountConfirmed,
      updateTxnAmountLoader,
      conformReceivedAmountLoader,
      form,
      isEditCryptoTxnMode,
      timeZone,
      totalValue,
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

    const confirmedDepositAmountByClient = totalDepositAmount

    return (
      <React.Fragment>
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
                          {isEditCryptoTxnMode ? (
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
                                    ? formatToZoneDate(
                                        confirmedReceivedAmountDateByClient,
                                        timeZone,
                                      )
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
                            style={{
                              width: '90%',
                            }}
                            addonBefore={depositCurrency}
                            disabled={isReceivedAmountConfirmed}
                            onChange={this.handleReceivedAmountChange}
                            onBlur={() =>
                              this.onReceivedAmountBlurHandler(confirmedDepositAmountByClient)
                            }
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
                        totalDepositAmount === totalValue ||
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
                        style={{
                          width: '90%',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="pt-3">
              <Button
                type="primary"
                loading={conformReceivedAmountLoader}
                onClick={this.handleConfirmReceivedConfirmation}
                disabled={
                  confirmedDepositAmountByClient === 0 ||
                  confirmedDepositAmountByClient === null ||
                  confirmedReceivedAmountDateByClient === null ||
                  confirmedReceivedAmountDateByClient === undefined
                }
                hidden={isReceivedAmountConfirmed}
              >
                Confirm Received Amount
              </Button>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}
export default ReceivedAmount
