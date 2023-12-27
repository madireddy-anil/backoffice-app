import React from 'react'
import { withRouter } from 'react-router-dom'
import Text from 'components/CleanUIComponents/Text'
import Spacer from 'components/CleanUIComponents/Spacer'
import moment from 'moment'
import { connect } from 'react-redux'
import { Card, Spin, Empty, Button, Form, Table, Icon, Tooltip } from 'antd'
import lodash from 'lodash'
import { amountFormatter, cryptoAmountFormatter } from 'utilities/transformer'
import {
  getAccountDetailsById,
  getFiatBalTransactionsById,
  getCryptoBalTransactionsById,
  updateSelectedPaymentType,
} from 'redux/caTransactions/actions'
import { twoFAauthorizationModal } from 'redux/auth0/actions'
import ManualCredit from '../balanceAdjustment/manualCredit'
import ManualDebit from '../balanceAdjustment/manualDebit'

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
  vendors: general.newVendors,
  selectedAccount: currencyAccounts.selectedAccount,
})

@withRouter
@Form.create()
@connect(mapStateToProps)
class AccountDetails extends React.Component {
  state = {
    unUsedValues: false,
    expandedRowKeys: [],
  }

  componentWillMount() {
    const { dispatch } = this.props
    this.getClientId()
    dispatch(twoFAauthorizationModal(false))
  }

  getClientId = () => {
    const { dispatch, token, match } = this.props
    const ID = match.params.id
    dispatch(getAccountDetailsById(ID, token))
    this.getTransactions()
  }

  getTransactions = () => {
    const { dispatch, token, match } = this.props
    const ID = match.params.id
    const { selectedAccount } = this.props
    if (selectedAccount.accountType === 'fiat') {
      dispatch(getFiatBalTransactionsById(ID, token))
    }
    if (selectedAccount.accountType === 'crypto') {
      dispatch(getCryptoBalTransactionsById(ID, token))
    }
  }

  onClickBack = () => {
    const { dispatch, history } = this.props
    dispatch(updateSelectedPaymentType(''))
    history.push(`/vendor-balances`)
  }

  handleOnClickCredit = () => {
    const { dispatch } = this.props
    dispatch(updateSelectedPaymentType('credit'))
    // this.setState({ manualCredit: true, manualDebit: false })
  }

  handleOnClickDebit = () => {
    const { dispatch } = this.props
    dispatch(updateSelectedPaymentType('debit'))
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

  getVendorNameForID = clientId => {
    const { vendors } = this.props
    const filteredVendor = vendors.filter(vendor => vendor.id === clientId)
    return filteredVendor.length > 0 ? filteredVendor[0].genericInformation?.tradingName : ''
  }

  render() {
    const {
      selectedAccountDetails,
      summaryLoading,
      form,
      selectedAccountBalSummary,
      balTxnLoading,
      paymentType,
    } = this.props
    const { amount, displayAmount, unUsedValues, expandedRowKeys } = this.state

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
    const sortedBalTxn =
      selectedAccountBalSummary.length > 0
        ? lodash.orderBy(selectedAccountBalSummary, ['createdAt'], ['desc'])
        : []
    const columns = [
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
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
                  {/* <Card className={styles.activeCard} bordered>
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
                          {selectedAccountDetails.accountId
                            ? this.getVendorNameForID(selectedAccountDetails.accountId)
                            : '__'}
                        </div>
                      </div>
                      <div className="col-6 col-lg-5">
                        <div className={styles.typeBlock}>
                          {selectedAccountDetails.accountType
                            ? lodash.capitalize(selectedAccountDetails.accountType)
                            : '--'}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8 col-lg-6">
                        <div className={styles.accountNumber}>
                          {selectedAccountDetails.accountNumber.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ' ',
                          )}
                        </div>
                      </div>
                      <div className="col-8 col-lg-5">
                        <div className={styles.currencyBlock}>
                          {selectedAccountDetails.currency}
                        </div>
                      </div>
                    </div>
                    {selectedAccountDetails.accountType === 'crypto' ? (
                      <div className="row">
                        <div className="col-8 col-lg-6">
                          <div className={styles.addressBlock}>
                            {selectedAccountDetails.address.address}
                          </div>
                        </div>
                        <div className="col-8 col-lg-5">
                          <div className={styles.balanceBlock}>
                            {cryptoAmountFormatter(selectedAccountDetails.balance.balance)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row">
                        <div className="col-8 col-lg-11">
                          <div className={styles.balanceBlock}>
                            {amountFormatter(selectedAccountDetails.balance.balance)}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-8 col-lg-11">
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
                          top: 66,
                          right: -20,
                          opacity: '25%',
                          height: '120px',
                          width: '120px',
                        }}
                      />
                    </div>{' '}
                  </Card> */}
                  {selectedAccountDetails.accountType === 'crypto' ? (
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
                            {selectedAccountDetails.clientId
                              ? this.getVendorNameForID(selectedAccountDetails.clientId)
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
                            {selectedAccountDetails.reference.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
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
                            {selectedAccountDetails.accountType
                              ? lodash.capitalize(selectedAccountDetails.accountType)
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
                            {selectedAccountDetails.clientId
                              ? this.getVendorNameForID(selectedAccountDetails.clientId)
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
                            {selectedAccountDetails.reference.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
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
                            {selectedAccountDetails.accountType
                              ? lodash.capitalize(selectedAccountDetails.accountType)
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
                    selectedAccountDetails.accountType === 'fiat' ? (
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

                        {selectedAccountDetails.balance.balance > 0 ? (
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
                        ) : (
                          <Tooltip title="Insufficient Funds !">
                            <Button
                              className={styles.debitBtn}
                              onClick={this.handleOnClickDebit}
                              disabled
                            >
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
                          </Tooltip>
                        )}
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
                    // borderBottomRightRadius: '10px',
                    // borderBottomLeftRadius: '10px',
                  }}
                  className={styles.mainCard}
                >
                  <div>
                    {selectedAccountDetails.accountType === 'crypto' ? (
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
                        dataSource={sortedBalTxn}
                        className={styles.txnTable}
                        pagination
                      />
                    ) : (
                      <Table
                        columns={columns}
                        dataSource={sortedBalTxn}
                        className={styles.txnTable}
                        pagination
                      />
                    )}
                  </div>
                </Card>
              )}

              {paymentType === 'credit' && <ManualCredit />}
              {paymentType === 'debit' && <ManualDebit />}
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
