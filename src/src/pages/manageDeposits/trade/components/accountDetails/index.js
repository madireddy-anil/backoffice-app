import React, { Component } from 'react'
import { Row, Col, Form, DatePicker, Popover } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  formatToZoneDate,
  formatToZoneDateTZFormat,
  disabledFutureDate,
} from 'utilities/transformer'

import {
  // selectedAccountRequestedDate,
  // selectedAccountReceivedDate,
  confirmAccountRequestedDate,
  confirmAccountReceivedDate,
} from 'redux/transactions/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, general, transactions, settings }) => ({
  token: user.token,
  srcCurrencies: general.currencies,
  isEditTxnMode: transactions.isEditTxnMode,
  progressLogs: transactions.selectedTransaction.progressLogs,
  bankAccountsRequestedToVendorAt:
    transactions.selectedTransaction.progressLogs.bankAccountsRequestedToVendorAt,
  bankAccountsReceivedByVendorAt:
    transactions.selectedTransaction.progressLogs.bankAccountsReceivedByVendorAt,
  selectedTransaction: transactions.selectedTransaction,
  timeZone: settings.timeZone.value,
})

@Form.create()
@connect(mapStateToProps)
class DepositAmount extends Component {
  state = {
    accountRequestVisible: false,
    accountReceivedVisible: false,
    accountRequestedDate: '',
    accountReceivedDate: '',
  }

  hideAccountRequestedPopOver = () => {
    this.setState({
      accountRequestVisible: false,
    })
  }

  hideAccountReceivedPopOver = () => {
    this.setState({
      accountReceivedVisible: false,
    })
  }

  handleVisibleAccountRequested = accountRequestVisible => {
    this.setState({ accountRequestVisible })
  }

  handleVisibleAccountReceived = accountReceivedVisible => {
    this.setState({ accountReceivedVisible })
  }

  handleAccountRequestedDate = value => {
    // const { dispatch } = this.props
    let stringDate
    if (value) {
      const newDate = new Date(value)
      stringDate = newDate.toISOString()
    } else {
      stringDate = null
    }
    // dispatch(selectedAccountRequestedDate(stringDate))
    this.setState({ accountRequestedDate: stringDate })
  }

  handleAccountReceivedDate = value => {
    // const { dispatch } = this.props
    let stringDate
    if (value) {
      const newDate = new Date(value)
      stringDate = newDate.toISOString()
    } else {
      stringDate = null
    }
    // dispatch(selectedAccountReceivedDate(stringDate))
    this.setState({ accountReceivedDate: stringDate })
  }

  onAccountRequestedDateOk = value => {
    // const { dispatch } = this.props
    const newDate = new Date(value)
    const stringDate = newDate.toISOString()
    Promise.resolve(this.setState({ accountRequestedDate: stringDate })).then(() => {
      this.handleAccountRequestedConfirmation()
      this.hideAccountRequestedPopOver()
    })
  }

  onAccountReceivedDateOk = value => {
    // const { dispatch } = this.props
    const newDate = new Date(value)
    const stringDate = newDate.toISOString()
    Promise.resolve(this.setState({ accountReceivedDate: stringDate })).then(() => {
      this.handleAccountReceivedConfirmation()
      this.hideAccountReceivedPopOver()
    })
  }

  handleAccountRequestedConfirmation = () => {
    const { accountRequestedDate } = this.state
    const { dispatch, selectedTransaction, progressLogs, token } = this.props
    const value = {
      date: accountRequestedDate,
      progressLogs,
      id: selectedTransaction.id,
    }
    dispatch(confirmAccountRequestedDate(value, token))
  }

  handleAccountReceivedConfirmation = () => {
    const { accountReceivedDate } = this.state
    const { dispatch, selectedTransaction, progressLogs, token } = this.props
    const value = {
      date: accountReceivedDate,
      progressLogs,
      id: selectedTransaction.id,
    }
    dispatch(confirmAccountReceivedDate(value, token))
  }

  getEditAccountRequestedDate = () => {
    const { form, bankAccountsRequestedToVendorAt, timeZone } = this.props
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('bankAccountsRequestedToVendorAt', {
            initialValue: bankAccountsRequestedToVendorAt
              ? moment(
                  new Date(formatToZoneDateTZFormat(bankAccountsRequestedToVendorAt, timeZone)),
                )
              : null,
          })(
            <DatePicker
              disabledDate={disabledFutureDate}
              showTime={{
                defaultValue: moment(
                  bankAccountsRequestedToVendorAt
                    ? bankAccountsRequestedToVendorAt.substring(11, 19)
                    : null,
                  'HH:mm:ss',
                ),
              }}
              placeholder="Select Date"
              format="DD/MM/YYYY HH:mm:ss"
              onChange={this.handleAccountRequestedDate}
              onOk={this.onAccountRequestedDateOk}
            />,
          )}
        </Form.Item>
      </Form>
    )
  }

  getEditAccountReceivedDate = () => {
    const { form, bankAccountsReceivedByVendorAt, timeZone } = this.props
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('bankAccountsReceivedByVendorAt', {
            initialValue: bankAccountsReceivedByVendorAt
              ? moment(new Date(formatToZoneDateTZFormat(bankAccountsReceivedByVendorAt, timeZone)))
              : null,
          })(
            <DatePicker
              disabledDate={disabledFutureDate}
              showTime={{
                defaultValue: moment(
                  bankAccountsReceivedByVendorAt
                    ? bankAccountsReceivedByVendorAt.substring(11, 19)
                    : null,
                  'HH:mm:ss',
                ),
              }}
              placeholder="Select Date"
              format="DD/MM/YYYY HH:mm:ss"
              onChange={this.handleAccountReceivedDate}
              onOk={this.onAccountReceivedDateOk}
            />,
          )}
        </Form.Item>
      </Form>
    )
  }

  render() {
    const {
      depositCurrency,
      // tradeDateTime,
      isEditTxnMode,
      bankAccountsRequestedToVendorAt,
      bankAccountsReceivedByVendorAt,
      timeZone,
    } = this.props

    const { accountRequestVisible, accountReceivedVisible } = this.state

    return (
      <Row>
        <Col className="mt-4" xs={{ span: 24 }} lg={{ span: 12 }}>
          <div>
            <h6>
              <strong>Accounts Requested Date:</strong>
            </h6>
            <div className={styles.prgressContent}>
              {bankAccountsRequestedToVendorAt ? (
                <div>
                  <div className={styles.prgressContent}>
                    <div>
                      <div>
                        {isEditTxnMode ? (
                          <Popover
                            content={this.getEditAccountRequestedDate()}
                            title="Deposit Confirmation Date and Amount"
                            trigger="click"
                            placement="topLeft"
                            accountRequestVisible={accountRequestVisible}
                            onVisibleChange={this.handleVisibleAccountRequested}
                            arrowPointAtCenter
                          >
                            <span className="font-size-15">
                              <strong>{depositCurrency} </strong>
                              <span className="edit-mode">
                                {bankAccountsRequestedToVendorAt
                                  ? formatToZoneDate(bankAccountsRequestedToVendorAt, timeZone)
                                  : ''}
                              </span>
                            </span>
                          </Popover>
                        ) : (
                          <div className={styles.inputBox}>
                            <span className="font-size-15">
                              {bankAccountsRequestedToVendorAt
                                ? formatToZoneDate(bankAccountsRequestedToVendorAt, timeZone)
                                : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pt-3">
                    <DatePicker
                      disabledDate={disabledFutureDate}
                      showTime={{
                        defaultValue: moment(
                          bankAccountsRequestedToVendorAt
                            ? bankAccountsRequestedToVendorAt.substring(11, 19)
                            : null,
                          'HH:mm:ss',
                        ),
                      }}
                      placeholder="Select Date"
                      format="DD/MM/YYYY HH:mm:ss"
                      defaultValue={
                        bankAccountsRequestedToVendorAt
                          ? moment(new Date(bankAccountsRequestedToVendorAt), 'DD/MM/YYYY')
                          : null
                      }
                      onChange={this.handleAccountRequestedDate}
                      onOk={this.onAccountRequestedDateOk}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col className="mt-4" xs={{ span: 24 }} lg={{ span: 12 }}>
          <div>
            <h6>
              <strong>Accounts Received Date:</strong>
            </h6>
            <div className={styles.prgressContent}>
              {bankAccountsReceivedByVendorAt ? (
                <div>
                  <div className={styles.prgressContent}>
                    <div>
                      <div>
                        {isEditTxnMode ? (
                          <Popover
                            content={this.getEditAccountReceivedDate()}
                            title="Accounts Received Date"
                            trigger="click"
                            placement="topLeft"
                            accountRequestVisible={accountReceivedVisible}
                            onVisibleChange={this.handleVisibleAccountReceived}
                            arrowPointAtCenter
                          >
                            <span className="font-size-15">
                              <strong>{depositCurrency} </strong>
                              <span className="edit-mode">
                                {bankAccountsReceivedByVendorAt
                                  ? formatToZoneDate(bankAccountsReceivedByVendorAt, timeZone)
                                  : ''}
                              </span>
                            </span>
                          </Popover>
                        ) : (
                          <div className={styles.inputBox}>
                            <span className="font-size-15">
                              {bankAccountsReceivedByVendorAt
                                ? formatToZoneDate(bankAccountsReceivedByVendorAt, timeZone)
                                : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="pt-3">
                    <DatePicker
                      disabledDate={disabledFutureDate}
                      showTime={{
                        defaultValue: moment(
                          bankAccountsReceivedByVendorAt
                            ? bankAccountsReceivedByVendorAt.substring(11, 19)
                            : null,
                          'HH:mm:ss',
                        ),
                      }}
                      placeholder="Select Date"
                      format="DD/MM/YYYY HH:mm:ss"
                      defaultValue={
                        bankAccountsReceivedByVendorAt
                          ? moment(new Date(bankAccountsReceivedByVendorAt), 'DD/MM/YYYY')
                          : null
                      }
                      onChange={this.handleAccountReceivedDate}
                      onOk={this.onAccountReceivedDateOk}
                    />
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
