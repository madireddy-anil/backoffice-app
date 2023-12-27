import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Timeline, Icon, Skeleton, Tooltip } from 'antd'

import { amountFormatter, formatChatLongTime } from 'utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ general, trade, transactions, settings }) => ({
  vendors: general.newVendors,
  routeEngineData: trade.routeEngineData,
  sourceAmount: trade.totalDepositAmount,
  sourceCurrency: trade.depositCurrency,
  selectedTransaction: transactions.selectedTransaction,
  txnLoading: transactions.txnLoading,
  txnConfirmed: transactions.selectedTransaction.progressLogs.transactionRequestedAt,
  accRequested: transactions.selectedTransaction.progressLogs.bankAccountsRequestedToVendorAt,
  accReceived: transactions.selectedTransaction.progressLogs.bankAccountsReceivedByVendorAt,
  depositConfirmedByClient:
    transactions.selectedTransaction.progressLogs.depositsReceiptConfirmationByVendorAt,
  fundsRecceiptConfirmationByClient:
    transactions.selectedTransaction.progressLogs.fundsRemittedByVendorAt,
  timeZone: settings.timeZone.value,
})

@connect(mapStateToProps)
class SwapSummary extends Component {
  getTransactionVendor = () => {
    const {
      selectedTransaction: { vendorId, vendorName },
      vendors,
    } = this.props
    const vendorObj = vendors.find(el => el.id === vendorId)

    if (!vendorObj) {
      if (vendorName) {
        return (
          <div className={`${styles.listCard}`}>
            <h6>{vendorName}</h6>
            <span>---</span>
            <div>
              <small>---</small>
            </div>
          </div>
        )
      }
      return (
        <div className={`${styles.listCard}`}>
          <Tooltip title="Name not found!">
            <h6>---</h6>
            <span>---</span>
            <div>
              <small>---</small>
            </div>
          </Tooltip>
        </div>
      )
    }

    return (
      <div className={`${styles.listCard}`}>
        <h6>{vendorObj ? vendorObj.genericInformation?.tradingName : ''}</h6>
        <span>{vendorObj ? vendorObj.genericInformation?.registeredCompanyName : ''}</span>
        <div>
          <small>{vendorObj ? vendorObj.genericInformation?.vendorType : ''}</small>
        </div>
      </div>
    )
  }

  getBeneName = (bene, nullSymbol) => {
    if (bene.bankAccountDetails) {
      return bene.bankAccountDetails.nameOnAccount
    }
    return nullSymbol
  }

  getBeneCurrency = (beneficiary, nullSymbol) => {
    if (beneficiary.bankAccountDetails) {
      return beneficiary.bankAccountDetails.bankAccountCurrency
    }
    return nullSymbol
  }

  getBeneAccountNumber = (beneficiary, nullSymbol) => {
    if (beneficiary.bankAccountDetails) {
      return beneficiary.bankAccountDetails.accountNumber
    }
    return nullSymbol
  }

  getBeneBicSwift = (beneficiary, nullSymbol) => {
    if (beneficiary.bankAccountDetails) {
      return beneficiary.bankAccountDetails.bicswift
    }
    return nullSymbol
  }

  getBeneBankName = (beneficiary, nullSymbol) => {
    if (beneficiary.bankAccountDetails) {
      return beneficiary.bankAccountDetails.bankName
    }
    return nullSymbol
  }

  render() {
    const {
      txnConfirmed,
      accRequested,
      accReceived,
      fundsRecceiptConfirmationByClient,
      selectedTransaction,
      timeZone,
      txnLoading,
    } = this.props
    const beneficiary =
      Object.entries(selectedTransaction).length !== 0 ? selectedTransaction.beneficiary : {}
    const SuccessIcon = (
      <Icon style={{ fontSize: '16px', color: '#4c7a34' }} type="check-circle" theme="filled" />
    )
    const nullSymbol = '---'
    return (
      <Card bordered={false} className={styles.timelineCard}>
        <Skeleton loading={txnLoading}>
          <Timeline>
            <Timeline.Item dot={SuccessIcon}>
              <div>
                <strong className="font-size-15">Vendor:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">Selected Vendor</span>
                </div>
                {this.getTransactionVendor()}
              </div>
            </Timeline.Item>
            <Timeline.Item dot={SuccessIcon}>
              <div>
                <strong className="font-size-15">Source:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">Selected currency and trade amount</span>
                </div>
                <div className={`${styles.inputBox} ${styles.flex}`}>
                  <div className={styles.leftInput}>{selectedTransaction.depositCurrency}</div>
                  <div className={styles.rightInput}>
                    {amountFormatter(selectedTransaction.totalDepositAmount)}
                  </div>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item dot={txnConfirmed ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Transaction Confirmed:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {txnConfirmed ? formatChatLongTime(txnConfirmed, timeZone) : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item dot={Object.entries(beneficiary).length !== 0 ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Destination:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    Selected beneficiary to receive converted funds
                  </span>
                </div>
                <div className={`${styles.listCard}`}>
                  <h6>
                    {Object.entries(beneficiary).length !== 0
                      ? this.getBeneName(beneficiary, nullSymbol)
                      : nullSymbol}
                  </h6>
                  <div>
                    <small>
                      {Object.entries(beneficiary).length !== 0
                        ? `Currency : ${this.getBeneCurrency(beneficiary, nullSymbol)}`
                        : nullSymbol}
                    </small>
                  </div>
                  <div className={styles.flex}>
                    {Object.entries(beneficiary).length !== 0 ? (
                      <small>
                        {' '}
                        Account Number : {this.getBeneAccountNumber(beneficiary, nullSymbol)}
                      </small>
                    ) : (
                      nullSymbol
                    )}
                  </div>
                  <div>
                    {Object.entries(beneficiary).length !== 0 ? (
                      <small> Bic Swift : {this.getBeneBicSwift(beneficiary, nullSymbol)}</small>
                    ) : (
                      nullSymbol
                    )}
                  </div>
                  <div>
                    <small>
                      {Object.entries(beneficiary).length !== 0
                        ? `Bank : ${this.getBeneBankName(beneficiary, nullSymbol)}`
                        : nullSymbol}
                    </small>
                  </div>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item dot={accRequested ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Account Requested Date:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {accRequested ? formatChatLongTime(accRequested, timeZone) : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item dot={accReceived ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Account Received Date:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {accReceived ? formatChatLongTime(accReceived, timeZone) : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item dot={fundsRecceiptConfirmationByClient ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Funds Receipt Confirmation:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {fundsRecceiptConfirmationByClient
                      ? formatChatLongTime(fundsRecceiptConfirmationByClient, timeZone)
                      : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
          </Timeline>
        </Skeleton>
      </Card>
    )
  }
}
export default SwapSummary
