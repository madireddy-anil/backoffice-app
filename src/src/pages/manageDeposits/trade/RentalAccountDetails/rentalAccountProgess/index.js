/* Changed Deposit upload component as optional - 12-09-2020  */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Spin } from 'antd'

import { getBeneficiaries, getVendors } from 'redux/general/actions'
import {
  updateVendorDetails,
  getDepositSlipsByTransactionIdAccountsOnly,
  getBankAccountByvendorId,
  updateSwapTxnSourceDetails,
  updateTransactionValues,
} from 'redux/transactions/actions'
import Vendor from '../../components/vendors'
import SourceAndBene from '../../components/vendorSource'
import LocalDepositAccounts from '../../components/localDepositAccounts'
import UploadPayslip from '../../components/uploadPayslip'
import ReceivedAmount from '../../components/receivedAmount'
import RemittedAmount from '../../components/remittedAmount'

const mapStateToProps = ({ user, general, trade, transactions }) => ({
  token: user.token,
  vendors: general.newVendors,
  srcCurrencies: general.currencies,
  vendorBeneficiaries: general.beneficiaries,
  routeEngineData: trade.routeEngineData,
  isEditTxnMode: transactions.isEditTxnMode,
  txnLoading: transactions.txnLoading,
  selectedTransaction: transactions.selectedTransaction,
  uploadedTradePaySlips: trade.paySlips,
  uploadedTransactionPaySlips: transactions.selectedRemittanceSlipsAccountsOnly,
  selectedVendor: transactions.selectedVendor,
  progressLogs: transactions.selectedTransaction.progressLogs,
  depositsInCorporateAccount: transactions.selectedTransaction.depositsInCorporateAccount,
  depositsInPersonalAccount: transactions.selectedTransaction.depositsInPersonalAccount,
  depositCurrency: transactions.selectedTransaction.depositCurrency,
  tradeTransactions: trade.transactions,

  isBeneficiarySelected: transactions.isBeneficiarySelected,
  isLocalAccountsProvided: transactions.isLocalAccountsProvided,
  isReceivedAmountConfirmed: transactions.isReceivedAmountConfirmed,
  isSlipDeleteEnabled: trade.isSlipDeleteEnabled,
})

@connect(mapStateToProps)
class RentalAccountProgress extends Component {
  componentDidUpdate(prevProps) {
    const {
      dispatch,
      vendors,
      selectedTransaction: { id, vendorId },
      token,
    } = this.props
    if (prevProps.selectedTransaction.vendorId !== vendorId && vendorId !== '') {
      const vendorData = vendors.find(el => el.id === vendorId)
      dispatch(updateVendorDetails(vendorData))
      dispatch(getDepositSlipsByTransactionIdAccountsOnly(id, token))
      dispatch(getBankAccountByvendorId(vendorId, token))
      dispatch(getVendors(token))
      dispatch(getBeneficiaries(token))
    }
  }

  onSourceUpdate = values => {
    const {
      dispatch,
      token,
      selectedTransaction: { id },
    } = this.props
    let payload
    Promise.resolve(dispatch(updateSwapTxnSourceDetails(values))).then(() => {
      const { depositCurrency, depositsInCorporateAccount, depositsInPersonalAccount } = this.props
      payload = {
        id: values.id,
        depositCurrency,
        depositsInPersonalAccount,
        depositsInCorporateAccount,
      }
      dispatch(updateTransactionValues(payload, id, token))
    })
  }

  onBeneUpdate = value => {
    console.log(value)
  }

  render() {
    const {
      isEditTxnMode,
      txnLoading,
      srcCurrencies,
      vendorBeneficiaries,
      selectedTransaction,
      uploadedTradePaySlips,
      uploadedTransactionPaySlips,
      selectedVendor,
      progressLogs,
      tradeTransactions,

      isBeneficiarySelected,
      isLocalAccountsProvided,
      isReceivedAmountConfirmed,
      isSlipDeleteEnabled,
    } = this.props
    const currentTransaction = tradeTransactions.find(el => el.id === selectedTransaction.id)
    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Spin spinning={txnLoading}>
          <Vendor />
          <SourceAndBene
            srcCurrencies={srcCurrencies}
            clientBeneficiaries={vendorBeneficiaries}
            isEditMode={isEditTxnMode}
            depositCurrency={selectedTransaction.depositCurrency}
            totalDepositAmount={selectedTransaction.totalDepositAmount}
            beneficiary={selectedTransaction.beneficiary}
            id={selectedTransaction.id}
            onSourceUpdate={value => this.onSourceUpdate(value)}
            onBeneUpdate={value => this.onBeneUpdate(value)}
          />
          {(isBeneficiarySelected || isEditTxnMode) && <LocalDepositAccounts />}
          {(isLocalAccountsProvided || isEditTxnMode) && (
            <UploadPayslip
              tradeOrTranId={selectedTransaction.id}
              clientOrVendorName={selectedVendor?.genericInformation?.tradingName}
              uploadView={{ canUpload: false, viewUploadList: true, canDelete: false }}
              showPaySlips={uploadedTradePaySlips}
              title="Deposit Slip"
              category={selectedVendor?.isAccountOnly ? 'IsAccountOnly' : ''}
              categoryType="IsAccountOnly"
            />
          )}
          {(isLocalAccountsProvided || isEditTxnMode) && <ReceivedAmount />}
          {(isReceivedAmountConfirmed || isEditTxnMode) && (
            <UploadPayslip
              tradeOrTranId={selectedTransaction?.id}
              clientOrVendorName={selectedVendor?.genericInformation?.tradingName}
              uploadView={{ canUpload: true, viewUploadList: true, canDelete: isSlipDeleteEnabled }}
              showPaySlips={uploadedTransactionPaySlips}
              title="Remittance Slip"
              progressLogs={currentTransaction ? currentTransaction.progressLogs : progressLogs}
              category={selectedVendor?.isAccountOnly ? 'IsAccountOnly' : ''}
              categoryType="IsAccountOnly"
            />
          )}
          {(isReceivedAmountConfirmed || isEditTxnMode) && <RemittedAmount />}
        </Spin>
      </Card>
    )
  }
}
export default RentalAccountProgress
