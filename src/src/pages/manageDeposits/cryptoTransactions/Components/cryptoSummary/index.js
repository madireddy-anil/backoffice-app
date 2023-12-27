import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Timeline, Icon, Skeleton, Tooltip } from 'antd'

import { amountFormatter, formatChatLongTime } from 'utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ general, trade, cryptoTransaction, settings }) => ({
  vendors: general.newVendors,
  routeEngineData: trade.routeEngineData,
  txnLoading: cryptoTransaction.txnLoading,
  sourceAmount: cryptoTransaction.selectedTransaction.sourceAmount,
  sourceCurrency: cryptoTransaction.selectedTransaction.sourceCurrencyss,
  currentRouteType: cryptoTransaction.currentRouteType,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  txnConfirmed: cryptoTransaction.selectedTransaction.progressLogs.transactionRequestedAt,
  accRequested: cryptoTransaction.selectedTransaction.progressLogs.bankAccountsRequestedToVendorAt,
  accReceived: cryptoTransaction.selectedTransaction.progressLogs.bankAccountsReceivedByVendorAt,
  depositConfirmedByClient:
    cryptoTransaction.selectedTransaction.progressLogs.depositsReceiptConfirmationByVendorAt,
  fundsRecceiptConfirmationByClient:
    cryptoTransaction.selectedTransaction.progressLogs.fundsRemittedByVendorAt,
  timeZone: settings.timeZone.value,
})

@connect(mapStateToProps)
class CryptoSummary extends Component {
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
      // currentRouteType,
    } = this.props
    const beneficiary =
      Object.entries(selectedTransaction).length !== 0 ? selectedTransaction.beneficiary : {}
    const SuccessIcon = (
      <Icon style={{ fontSize: '16px', color: '#4c7a34' }} type="check-circle" theme="filled" />
    )
    const nullSymbol = '---'
    const bene = beneficiary

    const getFiatBene = () => {
      return (
        <div className={`${styles.listCard}`}>
          <h6>{bene ? this.getBeneName(bene, nullSymbol) : nullSymbol}</h6>
          <div>
            <small>
              {bene ? `Currency : ${this.getBeneCurrency(bene, nullSymbol)}` : nullSymbol}
            </small>
          </div>
          <div className={styles.flex}>
            {bene ? (
              <small> Account Number : {this.getBeneAccountNumber(bene, nullSymbol)}</small>
            ) : (
              nullSymbol
            )}
          </div>
          <div>
            {bene ? (
              <small> Bic Swift : {this.getBeneBicSwift(bene, nullSymbol)}</small>
            ) : (
              nullSymbol
            )}
          </div>
          <div>
            <small>{bene ? `Bank : ${this.getBeneBankName(bene, nullSymbol)}` : nullSymbol}</small>
          </div>
        </div>
      )
    }

    const getCryptoBene = () => {
      return (
        <div className={`${styles.listCard}`}>
          <h6>{bene.aliasName ? bene.aliasName : nullSymbol}</h6>
          <div>
            <small>
              {bene.cryptoCurrency ? `Crypto Currency : ${bene.cryptoCurrency}` : nullSymbol}
            </small>
          </div>
          <div>
            <small>
              {bene
                ? `Crypto Wallet Address : ${bene.cryptoWalletAddress}`
                : `Crypto Wallet Address : ${nullSymbol}`}
            </small>
          </div>
          <div>
            {bene ? <small>Alias Name : {bene.aliasName}</small> : `Alias Name : ${nullSymbol}`}
          </div>
        </div>
      )
    }

    return (
      <Card bordered={false} className={styles.timelineCard}>
        <Skeleton loading={txnLoading} active>
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
            {/* {currentRouteType !== 'cryptoWallet' &&
              <Timeline.Item dot={txnConfirmed ? SuccessIcon : ''}>
                <div>
                  <strong className="font-size-15">Inductive Rate:</strong>
                  <div className="pb-3 mt-1">
                    <span className="font-size-12">
                      {txnConfirmed ? formatChatLongTime(txnConfirmed, timeZone) : nullSymbol}
                    </span>
                  </div>
                </div>
              </Timeline.Item>
            } */}
            <Timeline.Item dot={Object.entries(beneficiary).length !== 0 ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Destination:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    Selected beneficiary to receive converted funds
                  </span>
                </div>
                {bene.cryptoCurrency ? getCryptoBene() : getFiatBene()}
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

export default CryptoSummary
