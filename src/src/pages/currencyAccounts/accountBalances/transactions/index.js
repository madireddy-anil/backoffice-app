import React from 'react'
import { withRouter } from 'react-router-dom'
import Text from 'components/CleanUIComponents/Text'
import Spacer from 'components/CleanUIComponents/Spacer'
import moment from 'moment'
import { connect } from 'react-redux'
import { Card, Spin, Empty, Button, Form, Table, Icon, Pagination, Row, Col, Tooltip } from 'antd'
import lodash from 'lodash'
import {
  amountFormatter,
  cryptoAmountFormatter,
  getCompanyName,
  getName,
} from 'utilities/transformer'
import {
  getAccountDetailsById,
  getFiatBalTransactionsById,
  updateSelectedPaymentType,
  // getCryptoBalTransactionsById,
  updateSelectedTransactionRecordId,
} from 'redux/caTransactions/actions'
import { twoFAauthorizationModal } from 'redux/auth0/actions'
import ManualCredit from '../balanceAdjustment/manualCredit'
import ManualDebit from '../balanceAdjustment/manualDebit'
import SendCryptoPayment from '../balanceAdjustment/cryptoSendPayment'

import styles from './style.module.scss'
// import { string } from 'exceljs/dist/exceljs'

const mapStateToProps = ({ user, currencyAccounts, caTransactions, general }) => ({
  token: user.token,
  creditDebitLoading: currencyAccounts.creditDebitLoading,

  selectedAccountDetails: caTransactions.selectedAccountDetails,
  summaryLoading: caTransactions.summaryLoading,
  selectedAccountBalSummary: caTransactions.selectedAccountBalSummary,
  totalBalTxns: caTransactions.totalBalTxns,
  balTxnLoading: caTransactions.balTxnLoading,
  paymentType: caTransactions.paymentType,
  selectedAccount: currencyAccounts.selectedAccount,

  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,
  introducers: general.introducers,
})

@withRouter
@Form.create()
@connect(mapStateToProps)
class AccountDetails extends React.Component {
  state = {
    unUsedValues: false,
    expandedRowKeys: [],
    fromNumber: 1,
    toNumber: 50,
    // pageSize: 10,
    activePage: 1,
    limit: 50,
    defaultCurrent: 1,
    clientAndIntroducers: [],
  }

  componentDidMount() {
    const { dispatch, clients, introducers } = this.props
    this.getClientId()
    dispatch(twoFAauthorizationModal(false))
    this.setState({
      clientAndIntroducers: clients.concat(introducers),
    })
  }

  getClientId = () => {
    const { dispatch, token, match } = this.props
    const { limit } = this.state
    const ID = match.params.id
    dispatch(getAccountDetailsById(ID, token))
    const value = {
      limit,
      activePage: 1,
    }
    this.getTransactions(value)
    // dispatch(getTransactionsListById(ID, token))
  }

  getTransactions = value => {
    const { dispatch, token, match, selectedAccount } = this.props
    const ID = match.params.id
    dispatch(
      getFiatBalTransactionsById(ID, { ...value, accountType: selectedAccount.accountType }, token),
    )
  }

  handleRefresh = () => {
    const { limit } = this.state
    const value = {
      limit,
      activePage: 1,
    }
    this.getClientId()
    this.getTransactions(value)
  }

  onClickBack = () => {
    const { dispatch, history } = this.props
    dispatch(updateSelectedPaymentType(''))
    history.push(`/payments-accounts-list`)
  }

  handleOnClickCredit = () => {
    const { dispatch } = this.props
    dispatch(updateSelectedPaymentType('credit'))
    // this.setState({ manualCredit: true, manualDebit: false })
  }

  handleOnClickDebit = () => {
    const { dispatch } = this.props
    dispatch(updateSelectedPaymentType('debit'))
    // this.setState({ manualDebit: true, manualCredit: false })
  }

  handleCryptoSend = () => {
    const { dispatch } = this.props
    dispatch(updateSelectedPaymentType('cryptoSend'))
  }

  onExpand = (expanded, record) => {
    this.updateExpandedRowKeys({ record })
  }

  updateExpandedRowKeys = ({ record }) => {
    const { id } = record
    const { expandedRowKeys } = this.state
    const isExpanded = expandedRowKeys.find(key => key === id)
    let expandedRowKey = []
    if (isExpanded) {
      expandedRowKey = expandedRowKeys.reduce((acc, key) => {
        if (key !== id) acc.push(key)
        return acc
      }, [])
    } else {
      expandedRowKey.push(id)
    }
    this.setState({
      expandedRowKeys: expandedRowKey,
    })
  }

  getClientNameForID = clientId => {
    const { clients } = this.props
    const filteredClients = clients.filter(vendor => vendor.id === clientId)
    return filteredClients.length > 0 ? filteredClients[0].tradingName : ''
  }

  handleTableChange = currentPage => {
    const { limit } = this.state
    this.setState({
      activePage: currentPage,
    })
    const value = {
      limit,
      activePage: currentPage,
    }
    this.getTransactions(value)
    this.arrayPaginationCount(limit, currentPage)
  }

  arrayPaginationCount = (limit, activePage) => {
    const skip = (activePage - 1) * limit
    const fromNumb = skip + 1
    const toNumb = skip + limit
    this.setState({
      fromNumber: fromNumb,
      toNumber: toNumb,
    })
  }

  handlePageSizeChange = (current, pageSize) => {
    const { activePage } = this.state
    const value = {
      limit: pageSize,
      activePage: 1,
    }
    Promise.resolve(
      this.setState({ limit: pageSize, activePage: 1, fromNumber: current }),
    ).then(() => this.getTransactions(value))
    this.arrayPaginationCount(pageSize, activePage)
  }

  getOwner = (type, ownerEntityId) => {
    const { companies } = this.props
    const { clientAndIntroducers } = this.state
    switch (type) {
      case 'client':
        return getName(clientAndIntroducers, ownerEntityId)
      case 'pl':
        return getCompanyName(companies, ownerEntityId)
      case 'vendor_client':
        return getCompanyName(companies, ownerEntityId)
      case 'vendor_pl':
        return getCompanyName(companies, ownerEntityId)
      case 'suspense':
        return getCompanyName(companies, ownerEntityId)
      default:
        return ''
    }
  }

  getActiveAccountNumber = accountDetails => {
    const activeRecord = accountDetails.filter(e => e.isActiveAccountIdentification === true)
    return activeRecord.length > 0 ? activeRecord[0].accountNumber : '--'
  }

  navigateToTransactionSummary = reference => {
    const { history, dispatch, selectedAccountDetails } = this.props
    dispatch(
      updateSelectedTransactionRecordId({
        id: selectedAccountDetails.id,
        type: selectedAccountDetails.accountType,
      }),
    )
    history.push(`/payment-transaction-summary/${reference}`)
  }

  getCounterPartyDetails = record => {
    let value
    const { payments } = record
    if (typeof payments !== 'string') {
      if (
        payments.processFlow !== 'manual_debit_adjustment' &&
        payments.processFlow !== 'manual_credit_adjustment'
      ) {
        if (payments.isOutbound) {
          value = payments.creditor
            ? payments.creditor.creditorName
            : lodash.startCase(payments.processFlow)
        } else {
          value = payments.debtor
            ? payments.debtor.debtorName
            : lodash.startCase(payments.processFlow)
        }
      } else {
        value = lodash.startCase(payments.processFlow)
      }
    }

    return value
  }

  render() {
    const {
      selectedAccountDetails,
      summaryLoading,
      form,
      selectedAccountBalSummary,
      balTxnLoading,
      paymentType,
      totalBalTxns,
    } = this.props
    const {
      amount,
      displayAmount,
      unUsedValues,
      expandedRowKeys,
      fromNumber,
      toNumber,
      defaultCurrent,
    } = this.state
    if (unUsedValues) {
      console.log(
        'selectedAccountDetails',
        selectedAccountDetails,
        amount,
        displayAmount,
        form,
        expandedRowKeys,
      )
    }
    const manualButtonVisible =
      selectedAccountDetails?.currencyType === 'fiat' ||
      selectedAccountDetails?.currencyType === 'crypto'

    // const sortedBalTxn =
    //   selectedAccountBalSummary.length > 0
    //     ? lodash.orderBy(selectedAccountBalSummary, ['createdAt'], ['desc'])
    //     : []
    const columns = [
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: text => <a>{moment(text, 'YYY-MM-DD').format('DD MMM YY')}</a>,
      },
      {
        title: 'Counterparty ',
        key: 'counterParty',
        dataIndex: 'counterParty',
        align: 'center',
        render: (text, record) => (
          <>{Object.entries(record).length > 0 ? this.getCounterPartyDetails(record) : undefined}</>
        ),
      },
      {
        title: 'Transaction Reference',
        dataIndex: 'reference',
        key: 'reference',
        align: 'center',
      },
      {
        title: 'Remittance information',
        dataIndex: 'remarks',
        key: 'remarks',
        // align :  'center',
        render: text => (
          <div className="row">
            <div className="col-lg-12">
              <span>{text}</span>
            </div>
            {/* <div className="col-lg-12">
              <Button type="link" icon="right" className={styles.moreInfo}>
                More Info
              </Button>
            </div> */}
          </div>
        ),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
      },
      {
        title: 'Balance',
        key: 'balance',
        dataIndex: 'balance',
        align: 'center',
        render: text => <span className={styles.balance}>{amountFormatter(text)}</span>,
      },

      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: record => {
          if (record === 'complete') {
            return (
              <Button
                type="link"
                icon="check-circle"
                size="small"
                style={{ color: '#3CB371', fontWeight: '600' }}
              >
                Completed
              </Button>
            )
          }

          if (record === 'pending') {
            return (
              <Button
                type="link"
                size="small"
                icon="info-circle"
                style={{ color: '#40A0EE', fontWeight: '600' }}
              >
                {lodash.capitalize(record)}
              </Button>
            )
          }
          if (record === 'cancelled') {
            return (
              <Button
                type="link"
                size="small"
                icon="close-circle"
                style={{ color: '#ff6e6e', fontWeight: '600' }}
              >
                {lodash.capitalize(record)}
              </Button>
            )
          }
          return record
        },
      },
    ]

    return (
      <div>
        <div className={styles.summaryHeader}>
          <Text weight="thin" size="xlarge" className="font-size-15 bold">
            <Button
              type="link"
              icon="arrow-left"
              className={styles.backArrowIcon}
              onClick={this.onClickBack}
            />
            {`${' '} ${'Back To Accounts'}`}
          </Text>
        </div>
        <Spin spinning={summaryLoading}>
          {Object.entries(selectedAccountDetails).length > 0 ? (
            <div>
              <div className="row">
                <div className="col">
                  {selectedAccountDetails.currencyType === 'crypto' ? (
                    <Card className={styles.activeCard} bordered>
                      <div className={`row ${styles.closeIcon}`}>
                        <div className="col-lg-12">
                          <Icon
                            type="close"
                            style={{ float: 'right', color: 'white' }}
                            onClick={this.onClickBack}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 col-lg-6">
                          <div className={styles.nameBlock}>
                            {selectedAccountDetails.ownerEntityId
                              ? this.getOwner(
                                  selectedAccountDetails.accountType,
                                  selectedAccountDetails.ownerEntityId,
                                )
                              : '__'}
                          </div>
                        </div>
                        <div className="col-8 col-lg-5">
                          <div className={styles.currencyBlock}>
                            {selectedAccountDetails.currency}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-8 col-lg-6">
                          <div className={styles.accountNameBlock}>
                            {selectedAccountDetails.accountName
                              ? selectedAccountDetails.accountName
                              : '--'}
                          </div>
                        </div>
                        <div className="col-8 col-lg-3">
                          <span className={styles.statusBlock}>Available Balance : </span>
                        </div>
                        <div className="col-8 col-lg-2">
                          <div className={styles.availablebalanceBlock}>
                            {cryptoAmountFormatter(
                              selectedAccountDetails.balance.availableBalance,
                              8,
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-8 col-lg-6">
                          <div className={styles.addressBlock}>
                            {selectedAccountDetails.accountIdentification
                              ? selectedAccountDetails.accountIdentification.accountNumber
                              : '--'}
                          </div>
                        </div>
                        <div className="col-8 col-lg-3">
                          <span className={styles.statusBlock}>Balance : </span>
                        </div>
                        <div className="col-8 col-lg-2">
                          <div className={styles.balanceBlock}>
                            {cryptoAmountFormatter(selectedAccountDetails.balance.balance, 8)}
                          </div>
                        </div>
                      </div>
                      <Spacer height="5px" />
                      <div className="row">
                        <div className="col-8 col-lg-6">
                          <div className={styles.typeBlock}>
                            {selectedAccountDetails.currencyType
                              ? lodash.capitalize(selectedAccountDetails.currencyType)
                              : '--'}
                          </div>
                        </div>
                        <div className="col-8 col-lg-5">
                          <div className={styles.statusBlock}>
                            {lodash.capitalize(selectedAccountDetails.accountStatus)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <img
                          src="resources/images/logo_square-mobile.svg"
                          alt=""
                          className={styles.imageBlock}
                          style={{
                            position: 'absolute',
                            top: 86,
                            right: -20,
                            opacity: '25%',
                            height: '120px',
                            width: '120px',
                          }}
                        />
                      </div>
                    </Card>
                  ) : (
                    <Card className={styles.activeCard} bordered>
                      <div className={`row ${styles.closeIcon}`}>
                        <div className="col-lg-12">
                          <Icon
                            type="close"
                            style={{ float: 'right', color: 'white' }}
                            onClick={this.onClickBack}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6 col-lg-6">
                          <div className={styles.nameBlock}>
                            {selectedAccountDetails.ownerEntityId
                              ? this.getOwner(
                                  selectedAccountDetails.accountType,
                                  selectedAccountDetails.ownerEntityId,
                                )
                              : '__'}
                          </div>
                        </div>
                        <div className="col-8 col-lg-5">
                          <div className={styles.currencyBlock}>
                            {selectedAccountDetails.currency}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-8 col-lg-6">
                          <div className={styles.accountNameBlock}>
                            {selectedAccountDetails.accountName
                              ? selectedAccountDetails.accountName
                              : '--'}
                          </div>
                        </div>
                        <div className="col-8 col-lg-3">
                          <span className={styles.statusBlock}>Available Balance : </span>
                        </div>
                        <div className="col-8 col-lg-2">
                          <div className={styles.availablebalanceBlock}>
                            {amountFormatter(selectedAccountDetails.balance.availableBalance)}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-8 col-lg-6">
                          <div className={styles.addressBlock}>
                            {selectedAccountDetails.accountIdentification
                              ? selectedAccountDetails.accountIdentification.accountNumber
                              : ''}
                          </div>
                        </div>
                        <div className="col-8 col-lg-3">
                          <span className={styles.statusBlock}>Balance : </span>
                        </div>
                        <div className="col-8 col-lg-2">
                          <div className={styles.balanceBlock}>
                            {amountFormatter(selectedAccountDetails.balance.balance)}
                          </div>
                        </div>
                      </div>
                      <Spacer height="5px" />
                      <div className="row">
                        <div className="col-8 col-lg-6">
                          <div className={styles.typeBlock}>
                            {selectedAccountDetails.currencyType
                              ? lodash.capitalize(selectedAccountDetails.currencyType)
                              : '--'}
                          </div>
                        </div>
                        <div className="col-8 col-lg-5">
                          <div className={styles.statusBlock}>
                            {lodash.capitalize(selectedAccountDetails.accountStatus)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <img
                          src="resources/images/logo_square-mobile.svg"
                          alt=""
                          className={styles.imageBlock}
                          style={{
                            position: 'absolute',
                            top: 86,
                            right: -20,
                            opacity: '25%',
                            height: '120px',
                            width: '120px',
                          }}
                        />
                      </div>
                    </Card>
                  )}
                </div>
              </div>
              <Spacer height="10px" />
              {!paymentType && (
                <Card
                  title={
                    manualButtonVisible ? (
                      <div className={styles.tableHeader}>
                        <div className="row">
                          <div className="col-7 col-lg-2">
                            <Button onClick={this.handleOnClickCredit}>
                              <div className="row">
                                <div className="col-7 col-lg-7">Manual Credit</div>
                                <div className="col-5 col-lg-5">
                                  <img
                                    src="resources/images/initiate-money-transfer.png"
                                    alt=""
                                    style={{
                                      position: 'absolute',
                                      top: -1,
                                      right: 15,
                                      height: '20px',
                                      width: '20px',
                                    }}
                                  />
                                </div>
                              </div>
                            </Button>
                          </div>
                          <div className="col-7 col-lg-2">
                            <Button className={styles.debitBtn} onClick={this.handleOnClickDebit}>
                              <div className="row">
                                <div className="col-7 col-lg-7">Manual Debit</div>
                                <div className="col-5 col-lg-5">
                                  <img
                                    src="resources/images/initiate-money-transfer.png"
                                    alt=""
                                    style={{
                                      position: 'absolute',
                                      top: -1,
                                      right: 15,
                                      height: '20px',
                                      width: '20px',
                                    }}
                                  />
                                </div>
                              </div>
                            </Button>
                          </div>
                          <div className={`col-7 col-lg-8 ${styles.refreshBtn}`}>
                            <Tooltip title="Refresh to get new transactions">
                              <Icon type="reload" onClick={this.handleRefresh} />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )
                  }
                  headStyle={{
                    padding: '0',
                    border: '1px solid #a8c6fa',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    borderBottom: 'none',
                  }}
                  bodyStyle={{
                    padding: '0',
                    border: '1px solid #a8c6fa',
                  }}
                  className={styles.mainCard}
                >
                  <div>
                    <div>
                      <Table
                        columns={columns}
                        dataSource={selectedAccountBalSummary}
                        className={styles.txnTable}
                        loading={balTxnLoading}
                        pagination={false}
                        onRow={record => ({
                          onClick: () => {
                            this.navigateToTransactionSummary(record.reference)
                          },
                        })}
                      />
                      <div className="pl-3 mt-4 mb-3">
                        <Row>
                          <Col
                            xs={{ span: 12 }}
                            md={{ span: 5 }}
                            lg={{ span: 4 }}
                            className={styles.totalPageBlock}
                          >
                            <span>
                              Show {fromNumber} to <b>{toNumber}</b> of <b>{totalBalTxns}</b>{' '}
                              entries
                            </span>
                          </Col>
                          <Col xs={{ span: 12 }} md={{ span: 19 }} lg={{ span: 20 }}>
                            <Pagination
                              className={styles.paginationTab}
                              onChange={this.handleTableChange}
                              showSizeChanger
                              defaultCurrent={defaultCurrent}
                              defaultPageSize={50}
                              pageSizeOptions={['10', '50', '100']}
                              onShowSizeChange={this.handlePageSizeChange}
                              total={totalBalTxns}
                              loading={balTxnLoading || summaryLoading}
                            />
                          </Col>
                        </Row>
                      </div>
                    </div>
                    {/* )} */}
                  </div>
                </Card>
              )}

              {paymentType === 'credit' && <ManualCredit />}
              {paymentType === 'debit' && <ManualDebit />}
              {paymentType === 'cryptoSend' && <SendCryptoPayment />}
            </div>
          ) : (
            <Empty />
          )}
        </Spin>
      </div>
    )
  }
}

export default AccountDetails
