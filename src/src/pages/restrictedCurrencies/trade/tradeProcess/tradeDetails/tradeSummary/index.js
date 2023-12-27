import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Timeline, Icon, Skeleton } from 'antd'

import { amountFormatter, formatChatLongTime } from 'utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ general, npTrade, settings }) => ({
  clients: general.clients,
  routeEngineData: npTrade.routeEngineData,
  clientId: npTrade.clientId,
  sourceAmount: npTrade.totalDepositAmount,
  sourceCurrency: npTrade.depositCurrency,
  beneficiary: npTrade.beneficiary,
  tradeLoading: npTrade.tradeLoading,
  tradeConfirmed: npTrade.progressLogs.tradeRequestedAt,
  localBankRequestedDate: npTrade.progressLogs.bankAccountsRequestedByClientAt,
  localBankReceivedDate: npTrade.progressLogs.bankAccountsSharedToClientAt,
  paySlipRecivedDate: npTrade.progressLogs.depositSlipsSharedByClientAt,
  depositConfirmedDate: npTrade.progressLogs.depositConfirmedByClientAt,
  quoteConfirmedDate: npTrade.progressLogs.quoteConfirmedByClientAt,
  fundsRemittedDate: npTrade.progressLogs.fundsRemittedToClientAt,
  fundsReceivedDate: npTrade.progressLogs.fundsRecceiptConfirmationByClientAt,
  timeZone: settings.timeZone.value,

  isLocalAccountsRequested: npTrade.isLocalAccountsRequested,
  isLocalAccountsFetched: npTrade.isLocalAccountsFetched,
  isPayslipReceived: npTrade.isPayslipReceived,
  isDepositAmountConfirmed: npTrade.isDepositAmountConfirmed,
  isRateConfirmed: npTrade.isRateConfirmed,
  isCommisionConfirmed: npTrade.isCommisionConfirmed,
  isFundsRemitted: npTrade.isFundsRemitted,
})

@connect(mapStateToProps)
class TradeSummary extends Component {
  getTradeClient = () => {
    const { clientId, clients } = this.props
    const clientObj = clients.find(el => el.id === clientId)
    return (
      <div className={`${styles.listCard}`}>
        <h6>{clientObj ? clientObj.genericInformation.tradingName : ''}</h6>
        <div>
          <small>{clientObj ? clientObj.genericInformation.registeredCompanyName : ''}</small>
        </div>
        <div className={styles.flexSpaceBetween}>
          {clientObj ? <small> Type : {clientObj.entityType}</small> : ''}
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
      sourceAmount,
      sourceCurrency,
      beneficiary,
      tradeConfirmed,
      localBankRequestedDate,
      localBankReceivedDate,
      paySlipRecivedDate,
      depositConfirmedDate,
      quoteConfirmedDate,
      fundsRemittedDate,
      fundsReceivedDate,
      timeZone,

      isLocalAccountsRequested,
      isLocalAccountsFetched,
      isPayslipReceived,
      isDepositAmountConfirmed,
      isRateConfirmed,
      // isCommisionConfirmed,
      isFundsRemitted,
      tradeLoading,
    } = this.props
    const baseBeneficiary = {
      bankAccountDetails: {
        nameOnAccount: '',
        bankCurrency: '',
        accountNumber: '',
        bicswift: '',
        bankName: '',
      },
    }
    const bene = beneficiary || baseBeneficiary
    const SuccessIcon = <Icon type="check-circle" style={{ color: '#72bb53' }} />
    const nullSymbol = '---'

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
        <Skeleton loading={tradeLoading} active>
          <Timeline>
            <Timeline.Item dot={SuccessIcon}>
              <div>
                <strong className="font-size-15">Client:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">Selected Client</span>
                </div>
                {this.getTradeClient()}
              </div>
            </Timeline.Item>
            <Timeline.Item dot={SuccessIcon}>
              <div>
                <strong className="font-size-15">Source:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">Selected currency and trade amount</span>
                </div>
                <div className={`${styles.inputBox} ${styles.flex}`}>
                  <div className={styles.leftInput}>{sourceCurrency}</div>
                  <div className={styles.rightInput}>{amountFormatter(sourceAmount)}</div>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item dot={Object.entries(bene).length !== 0 ? SuccessIcon : ''}>
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
            <Timeline.Item dot={tradeConfirmed ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Trade Confirmed:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {tradeConfirmed ? formatChatLongTime(tradeConfirmed, timeZone) : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item
              hidden={tradeConfirmed === ''}
              dot={isLocalAccountsRequested ? SuccessIcon : ''}
            >
              <div>
                <strong className="font-size-15">Local Bank Requested:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {localBankRequestedDate
                      ? formatChatLongTime(localBankRequestedDate, timeZone)
                      : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item
              hidden={!isLocalAccountsRequested}
              dot={isLocalAccountsFetched ? SuccessIcon : ''}
            >
              <div>
                <strong className="font-size-15">Local Bank Received:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {localBankReceivedDate
                      ? formatChatLongTime(localBankReceivedDate, timeZone)
                      : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item
              hidden={!isLocalAccountsFetched}
              dot={isPayslipReceived ? SuccessIcon : ''}
            >
              <div>
                <strong className="font-size-15">Payslip Received:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {paySlipRecivedDate
                      ? formatChatLongTime(localBankReceivedDate, timeZone)
                      : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item
              hidden={!isPayslipReceived}
              dot={isDepositAmountConfirmed ? SuccessIcon : ''}
            >
              <div>
                <strong className="font-size-15">Deposit Confirmation:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {depositConfirmedDate
                      ? formatChatLongTime(depositConfirmedDate, timeZone)
                      : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item
              hidden={!isDepositAmountConfirmed}
              dot={isRateConfirmed ? SuccessIcon : ''}
            >
              <div>
                <strong className="font-size-15">Quote Confirmation:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {quoteConfirmedDate
                      ? formatChatLongTime(quoteConfirmedDate, timeZone)
                      : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item hidden={!isRateConfirmed} dot={isFundsRemitted ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Funds Remitted:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {fundsRemittedDate
                      ? formatChatLongTime(fundsRemittedDate, timeZone)
                      : nullSymbol}
                  </span>
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item hidden={!isFundsRemitted} dot={fundsReceivedDate ? SuccessIcon : ''}>
              <div>
                <strong className="font-size-15">Funds Receipt Confirmation:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">
                    {fundsReceivedDate
                      ? formatChatLongTime(fundsReceivedDate, timeZone)
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
export default TradeSummary
