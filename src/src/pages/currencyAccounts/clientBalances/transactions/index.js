import React from 'react'
import { withRouter } from 'react-router-dom'
import Text from 'components/CleanUIComponents/Text'
import Spacer from 'components/CleanUIComponents/Spacer'
import moment from 'moment'
import { connect } from 'react-redux'
import { Card, Spin, Empty, Button, Form, Table, Icon, Tooltip, Pagination, Row, Col } from 'antd'
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
  // getCryptoBalTransactionsById,
  updateSelectedPaymentType,
} from 'redux/caTransactions/actions'
import { twoFAauthorizationModal } from 'redux/auth0/actions'
import ManualCredit from '../balanceAdjustment/manualCredit'
import ManualDebit from '../balanceAdjustment/manualDebit'
import SendCryptoPayment from '../balanceAdjustment/cryptoSendPayment'

import styles from './style.module.scss'

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
    companiesAndClients: [],
  }

  componentDidMount() {
    const { dispatch, clients, companies } = this.props
    this.getClientId()
    dispatch(updateSelectedPaymentType(''))
    dispatch(twoFAauthorizationModal(false))
    this.setState({
      companiesAndClients: clients.concat(companies),
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
    const { dispatch, token, match } = this.props
    const ID = match.params.id
    dispatch(getFiatBalTransactionsById(ID, value, token))

    // if (selectedAccount.currencyType === 'crypto') {
    //   dispatch(getCryptoBalTransactionsById(ID, value, token))
    // }
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
    // this.setState({ manualCredit: true, manualDebit: false })
  }

  // onSubmitHandle = () => {
  //   const { amount, reference, manualCredit } = this.state
  //   const { selectedAccountDetails, token, dispatch } = this.props
  //   const value = {
  //     clientId: selectedAccountDetails.clientId,
  //     currencyAccountId: selectedAccountDetails.id,
  //     amount,
  //     remarks: reference,
  //     debitCredit: manualCredit === true ? 'credit' : 'debit',
  //   }
  //   dispatch(manualCreditDebit(value, token))
  // }

  // handleCancel = () => {
  //   this.setState({ manualDebit: false, manualCredit: false, reference: '', amount: '' })
  // }

  // handleRefernce = e => {
  //   const { amount } = this.state
  //   this.setState({ reference: e.target.value, step: 1 })
  //   if (amount) {
  //     this.setState({ step: 1 })
  //   }
  // }

  // handleAmount = value => {
  //   const { reference } = this.state
  //   this.setState({ amount: value })
  //   if (reference) {
  //     this.setState({ step: 0 })
  //   }
  // }

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
    return filteredClients.length > 0 ? filteredClients[0].genericInformation.tradingName : ''
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
    const { clients, companies } = this.props
    const { companiesAndClients } = this.state
    switch (type) {
      case 'client':
        return getName(clients, ownerEntityId)
      case 'pl':
        return getCompanyName(companiesAndClients, ownerEntityId)
      case 'vendor_client':
        return getCompanyName(companies, ownerEntityId)
      case 'vendor_pl':
        return getCompanyName(companies, ownerEntityId)
      default:
        return ''
    }
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
      selectedAccountDetails.currencyType === 'fiat' ||
      (selectedAccountDetails.currencyType === 'crypto' &&
        selectedAccountDetails.productId !== 'currency_accounts')

    const columns = [
      {
        title: 'Date',
        dataIndex: 'valueDate',
        key: 'valueDate',
        align: 'center',
        render: text => <a>{moment(text, 'YYY-MM-DD').format('DD MMM YY')}</a>,
      },
      {
        title: 'Description',
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
    ]
    const crypTocolumns = [
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: text => <a>{moment(text, 'YYY-MM-DD').format('DD MMM YY')}</a>,
      },
      {
        title: 'Description',
        dataIndex: 'txHash',
        key: 'txHash',
        // align :  'center',
        render: (text, record) => (
          <div className="row">
            <div className="col-lg-12">
              Hash : <span className={styles.listHeader}>{text}</span>
            </div>
            <div className="col-lg-12">
              <Button
                type="link"
                icon="right"
                className={styles.moreInfo}
                onClick={() => this.updateExpandedRowKeys({ record })}
              >
                More Info
              </Button>
            </div>
          </div>
        ),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        // render: text => <span className={styles.balance}>{cryptoAmountFormatter(text)}</span>,
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
        <Spin spinning={summaryLoading || balTxnLoading}>
          {Object.entries(selectedAccountDetails).length > 0 ? (
            <div>
              <div className="row">
                <div className="col">
                  {selectedAccountDetails.currencyType === 'crypto' &&
                  selectedAccountDetails.product === 'currency_accounts' ? (
                    <Card className={styles.activeCard} bordered>
                      <div className={`row ${styles.closeIcon}`}>
                        {/* <div className="col-lg-11">
                          <Icon
                            type="edit"
                            style={{ float: 'right', color: 'white' }}
                            onClick={this.onClickBack}
                          />
                        </div> */}
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
                              ? this.getClientNameForID(selectedAccountDetails.ownerEntityId)
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
                          <div className={styles.accountNumber}>
                            {selectedAccountDetails.externalAccountNumber
                              ? selectedAccountDetails.externalAccountNumber
                              : selectedAccountDetails.accountNumber
                              ? selectedAccountDetails.accountNumber.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ' ',
                                )
                              : ''}
                          </div>
                        </div>
                        <div className="col-8 col-lg-3">
                          <span className={styles.statusBlock}>Available Balance : </span>
                        </div>
                        <div className="col-8 col-lg-2">
                          <div className={styles.availablebalanceBlock}>
                            {cryptoAmountFormatter(selectedAccountDetails.balance.availableBalance)}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-8 col-lg-6">
                          <div className={styles.addressBlock}>
                            {selectedAccountDetails.address.address}
                          </div>
                        </div>
                        <div className="col-8 col-lg-3">
                          <span className={styles.statusBlock}>Balance : </span>
                        </div>
                        <div className="col-8 col-lg-2">
                          <div className={styles.balanceBlock}>
                            {cryptoAmountFormatter(selectedAccountDetails.balance.balance)}
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
                        {/* <div className="col-lg-11">
                          <Icon
                            type="edit"
                            className={styles.editIcon}
                            style={{ float: 'right', color: 'white' }}
                            onClick={this.onClickBack}
                          />
                        </div> */}
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
                          <div className={styles.accountNumber}>
                            {selectedAccountDetails.externalAccountNumber
                              ? selectedAccountDetails.externalAccountNumber
                              : selectedAccountDetails.accountNumber
                              ? selectedAccountDetails.accountNumber.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ' ',
                                )
                              : ''}
                          </div>
                        </div>
                        <div className="col-8 col-lg-5">
                          <div className={styles.balanceBlock}>
                            {amountFormatter(selectedAccountDetails.balance.balance)}
                          </div>
                        </div>
                      </div>
                      <Spacer height="5px" />
                      <div className="row">
                        <div className="col-6 col-lg-5">
                          <div className={styles.typeBlock}>
                            {selectedAccountDetails.currencyType
                              ? lodash.capitalize(selectedAccountDetails.currencyType)
                              : '--'}
                          </div>
                        </div>
                        <div className="col-8 col-lg-6">
                          <div className={styles.statusBlock}>
                            {lodash.capitalize(selectedAccountDetails.accountStatus)}
                          </div>
                        </div>
                      </div>
                      {/* <div className="row">
                        <div className="col-8 col-lg-11">
                          <div className={styles.statusBlock}>
                            {lodash.capitalize(selectedAccountDetails.accountStatus)}
                          </div>
                        </div>
                      </div> */}

                      <div>
                        <img
                          src="resources/images/logo_square-mobile.svg"
                          alt=""
                          className={styles.imageBlock}
                          style={{
                            position: 'absolute',
                            top: 61,
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
                    ) : (
                      <div className={styles.tableHeader}>
                        {selectedAccountDetails.balance.balance > 0 ? (
                          <Button onClick={this.handleCryptoSend}>
                            <div className="row">
                              <div className="col-7 col-lg-7">Send Payment</div>
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
                        ) : (
                          <Tooltip title="Insufficient Funds !">
                            <Button disabled onClick={this.handleCryptoSend}>
                              <div className="row">
                                <div className="col-7 col-lg-7">Send Payment</div>
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
                          </Tooltip>
                        )}
                      </div>
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
                    // borderBottomRightRadius: '10px',
                    // borderBottomLeftRadius: '10px',
                  }}
                  className={styles.mainCard}
                >
                  <div>
                    {selectedAccountDetails.currencyType === 'crypto' &&
                    selectedAccountDetails.product === 'currency_accounts' ? (
                      <Table
                        rowKey={record => record.id}
                        columns={crypTocolumns}
                        expandedRowKeys={expandedRowKeys}
                        expandIconColumnIndex={1}
                        expandIcon={() => null}
                        expandIconAsCell={false}
                        expandedRowRender={record => (
                          <div className={styles.moreInfoBlock}>
                            <div className="row">
                              <div className="col-5 col-lg-11 offset-1 offset-lg-1">
                                Source Address :{' '}
                                <strong>
                                  {record.details !== undefined
                                    ? record.details.sources[0].address
                                    : ''}
                                </strong>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-5 col-lg-11 offset-1 offset-lg-1">
                                Destination Address :{' '}
                                <strong>
                                  {record.details !== undefined
                                    ? record.details.destinations[0].address
                                    : ''}
                                </strong>
                              </div>
                            </div>
                          </div>
                        )}
                        onExpand={this.onExpand}
                        dataSource={selectedAccountBalSummary}
                        className={styles.txnTable}
                        pagination
                      />
                    ) : (
                      <div>
                        <Table
                          columns={columns}
                          dataSource={selectedAccountBalSummary}
                          className={styles.txnTable}
                          pagination={false}
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
                    )}
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
