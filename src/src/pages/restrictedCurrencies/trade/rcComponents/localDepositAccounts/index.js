import React, { Component } from 'react'
import { Select, Card, Input, Row, Col, Button } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import { v4 as uuidv4 } from 'uuid'
import { formatToZoneDateTZFormat, amountFormatter } from 'utilities/transformer'
// import { selectedLocalAccounts, updateLocalAmount, deleteSelectedAccount } from 'redux/bankAccounts/actions'
import {
  selectedLocalAccounts,
  updateLocalAmount,
  deleteSelectedAccount,
  updateLocalAccountsToTransaction,
  updateLocalAccountsToTrade,
  updateBankAccounts,
  getBankAccountByvendorId,
} from 'redux/restrictedCurrencies/trade/tradeProcess/transactions/actions'
import { connect } from 'react-redux'

import _ from 'lodash'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ general, npTransactions, user, npTrade, settings }) => ({
  token: user.token,
  vendors: general.newVendors,
  selectedVendor: npTransactions.selectedVendor,
  localDepositAccounts: npTransactions.selectedTransaction.localDepositAccounts,
  progressLogs: npTrade.progressLogs,
  selectedAccountNames: npTransactions.selectedAccountNames,
  bankAccounts: general.bankAccounts,
  allBankAccounts: npTransactions.allBankAccounts,
  selectedTransaction: npTransactions.selectedTransaction,
  isTransactionDetailsFetched: npTransactions.isTransactionDetailsFetched,
  updateBankAccLoading: npTransactions.updateBankAccLoading,
  routeEngineData: npTrade.routeEngineData,
  timeZone: settings.timeZone.value,
})

@connect(mapStateToProps)
class LocalDepositAccounts extends Component {
  state = {
    empty: '--',
    isAccountsSelected: false,
  }

  componentDidMount() {
    const { isTransactionDetailsFetched } = this.props
    if (isTransactionDetailsFetched) {
      this.getSelectedVendor()
    }
  }

  getSelectedVendor = () => {
    const { dispatch, selectedVendor, token, localDepositAccounts } = this.props
    if (Object.entries(selectedVendor).length > 0) {
      dispatch(getBankAccountByvendorId(selectedVendor.id, token))
    }
    if (localDepositAccounts.length > 0) {
      this.setState({ isAccountsSelected: true })
    }
  }

  handleAccounts = () => {
    const {
      dispatch,
      token,
      localDepositAccounts,
      selectedTransaction,
      progressLogs,
      routeEngineData,
      timeZone,
    } = this.props
    progressLogs.bankAccountsSharedToClientAt = formatToZoneDateTZFormat(new Date(), timeZone)
    const { isAccountsSelected } = this.state
    const accounts = localDepositAccounts
    const currentRoute = routeEngineData.find(el => el.transactionId === selectedTransaction.id)
    console.log(currentRoute)
    if (!isAccountsSelected) {
      const tradeValue = {
        tradeStatus: 'accounts_provided',
        progressLogs,
        localDepositAccounts: accounts,
      }
      const txnValue = {
        transactionStatus: 'accounts_provided',
        localDepositAccounts: accounts,
      }
      localDepositAccounts.forEach(item => {
        item.accountStatus = 'blocked'
      })
      if (currentRoute && currentRoute.sequence === 1) {
        console.log(currentRoute.sequence)
        dispatch(updateLocalAccountsToTrade(selectedTransaction.tradeId, tradeValue, token))
      }
      dispatch(updateLocalAccountsToTransaction(selectedTransaction.id, txnValue, token))
      // dispatch(updateLocalAccountsToTrade(selectedTransaction.tradeId, tradeValue, token))
      dispatch(updateBankAccounts(localDepositAccounts, token))
      this.setState({ isAccountsSelected: true })
    } else {
      const value = { localDepositAccounts: accounts }
      dispatch(updateLocalAccountsToTransaction(selectedTransaction.id, value, token))
      if (currentRoute && currentRoute.sequence === 1) {
        console.log(currentRoute.sequence)
        dispatch(updateLocalAccountsToTrade(selectedTransaction.tradeId, value, token))
      }
      localDepositAccounts.forEach(item => {
        item.accountStatus = 'available'
      })
      dispatch(updateBankAccounts(localDepositAccounts, token))
    }
  }

  onChangeAddLocalAccounts = (names, event) => {
    const { dispatch, allBankAccounts, localDepositAccounts } = this.props
    const accounts = []
    const namesList = []
    const selectedAccounts = []
    const localAccountList = _.concat(allBankAccounts, localDepositAccounts)

    if (event.length > 0) {
      event.forEach(item => {
        const acc = localAccountList.find(el => item.key === el.accountNumber)
        if (acc) {
          selectedAccounts.push(acc)
        }
      })

      dispatch(selectedLocalAccounts(selectedAccounts, names))
    } else {
      dispatch(selectedLocalAccounts(accounts, namesList))
    }
  }

  onChangeEnterAmount = (e, account) => {
    const { localDepositAccounts, dispatch } = this.props
    const depositAmount = e.target.value
    const finalAmount = { depositAmount }
    if (account && e.target.value) {
      localDepositAccounts.forEach(el => {
        if (account.accountNumber === el.accountNumber) {
          Object.assign(el, finalAmount)
        }
      })
    }
    dispatch(updateLocalAmount(localDepositAccounts))
  }

  handleDelete = (e, selectedAccount, index) => {
    selectedAccount.depositAmount = 0
    const { dispatch, localDepositAccounts, selectedAccountNames, token } = this.props
    localDepositAccounts.splice(index, 1)
    const deleteAccNames = _.findIndex(
      selectedAccountNames,
      el => el !== selectedAccount.nameOnAccount,
    )
    selectedAccountNames.splice(deleteAccNames, 1)
    dispatch(
      deleteSelectedAccount({ localDepositAccounts, selectedAccount, selectedAccountNames, token }),
    )
  }

  selectedLocalAccounts = () => {
    const { localDepositAccounts } = this.props
    const { empty } = this.state
    return (
      <div>
        {localDepositAccounts.length > 0
          ? localDepositAccounts.map(item => {
              return (
                <div key={item.accountNumber} className={styles.selectedBeneCard}>
                  <Card
                    bordered={false}
                    bodyStyle={{
                      border: '1px solid #a8c6fa',
                      borderRadius: '10PX',
                      marginBottom: '30px',
                    }}
                  >
                    {/* <div className={styles.iconClose}>
                      <Icon type="delete" onClick={e => this.handleDelete(e, item, index)} />
                    </div> */}
                    <Row>
                      <Col span={12}>
                        <p className="font-size-11 mb-1">Name On Account</p>
                        <p className="font-weight-bold font-size-11 mb-3">
                          {item.nameOnAccount ? item.nameOnAccount : empty}
                        </p>
                      </Col>
                      <Col span={12}>
                        <p className="font-size-11 mb-1">Account Number</p>
                        <p className="font-weight-bold font-size-11 mb-3">
                          {item.accountNumber ? item.accountNumber : empty}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p className="font-size-11 mb-1">Bank Name</p>
                        <p className="font-weight-bold font-size-11 mb-3">
                          {item.bankName ? item.bankName : empty}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p className="font-size-11 mb-1">Account Currency</p>
                        <p className="font-weight-bold font-size-11 mb-3">
                          {item.accountCurrency ? item.accountCurrency : empty}
                        </p>
                      </Col>
                      <Col span={12}>
                        <p className="font-size-11 mb-1">AccountType</p>
                        <p className="font-weight-bold font-size-11 mb-3">
                          {item.localAccountType ? item.localAccountType : empty}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p className="font-size-11 mb-1">Maximum Amount</p>
                        <p className="font-weight-bold font-size-11 mb-3">
                          {item.maxAmount ? amountFormatter(item.maxAmount) : empty}
                        </p>
                      </Col>
                      <Col span={12}>
                        <p className="font-size-11 mb-1">Minimum Amount</p>
                        <p className="font-weight-bold font-size-11 mb-3">
                          {item.minAmount ? amountFormatter(item.minAmount) : empty}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p className="font-size-11 mb-1">Balance On Account</p>
                        <p className="font-weight-bold font-size-11 mb-3">
                          {item.balanceAmount ? amountFormatter(item.balanceAmount) : empty}
                        </p>
                      </Col>
                    </Row>
                    <Spacer height="5px" />
                    <Row>
                      <Col span={18}>
                        <Input
                          className={styles.inputEnterAmt}
                          defaultValue={
                            item.depositAmount && item.depositAmount !== undefined
                              ? item.depositAmount
                              : 0
                          }
                          addonBefore={
                            <div style={{ width: 80 }}>
                              {item.accountCurrency ? item.accountCurrency : 'CURRENCY'}
                            </div>
                          }
                          placeholder="Enter Settlement Amount"
                          onChange={e => this.onChangeEnterAmount(e, item)}
                        />
                      </Col>
                    </Row>
                  </Card>
                </div>
              )
            })
          : ''}
      </div>
    )
  }

  render() {
    const {
      allBankAccounts,
      localDepositAccounts,
      selectedAccountNames,
      updateBankAccLoading,
    } = this.props

    const { isAccountsSelected } = this.state
    const accountOption = allBankAccounts.map(option => (
      <Option key={option.accountNumber} label={option.accountNumber} value={option.accountNumber}>
        <h5>{option.nameOnAccount}</h5>
        <div>
          <b>{option.accountNumber}</b>
        </div>
      </Option>
    ))
    return (
      <div className="mt-4">
        <strong className="font-size-15">Select Local Deposit Accounts</strong>
        <div className="pb-3 mt-3">
          <Select
            mode="multiple"
            optionLabelProp="label"
            style={{ width: '100%' }}
            value={selectedAccountNames}
            className={styles.cstmSelectInput}
            onChange={this.onChangeAddLocalAccounts}
          >
            {accountOption}
          </Select>
        </div>
        <div className="pb-3 mt-3">{this.selectedLocalAccounts()}</div>
        {localDepositAccounts.length > 0 && (
          <div>
            <Button
              type="primary"
              style={{ marginTop: '-27px' }}
              loading={updateBankAccLoading}
              onClick={this.handleAccounts}
            >
              {!isAccountsSelected ? 'Save' : 'Update'}
            </Button>
          </div>
        )}
      </div>
    )
  }
}
export default LocalDepositAccounts
