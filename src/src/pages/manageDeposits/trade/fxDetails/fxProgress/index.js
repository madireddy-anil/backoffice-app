import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Spin, Skeleton } from 'antd'

import { getBeneficiaries, getVendors } from 'redux/general/actions'
import {
  updateVendorDetails,
  getDepositSlipsByTransactionIdFX,
  updateSwapTxnSourceDetails,
  updateTransactionValues,
} from 'redux/transactions/actions'
import Vendor from '../../components/vendors'
import SourceAndBene from '../../components/vendorSource'
import UploadPayslip from '../../components/uploadPayslip'
// import UploadRemittanceSlip from '../../components/remittanceSlip'
// import DepositAmount from '../../components/depositAmount'
import Fees from '../../components/txnFees'
import ReceivedAmount from '../../components/receivedAmount'
import RemittedAmount from '../../components/remittedAmount'
import AmountSold from '../../components/amountSold'

const mapStateToProps = ({ user, general, trade, transactions }) => ({
  token: user.token,
  srcCurrencies: general.currencies,
  vendors: general.newVendors,
  vendorBeneficiaries: general.beneficiaries,
  routeEngineData: trade.routeEngineData,
  isEditTxnMode: transactions.isEditTxnMode,
  txnLoading: transactions.txnLoading,
  selectedTransaction: transactions.selectedTransaction,
  selectedVendor: transactions.selectedVendor,
  progressLogs: transactions.selectedTransaction.progressLogs,
  uploadedRemittanceSlipsFx: transactions.selectedRemittanceSlipsFX,
  tradeTransactions: trade.transactions,

  isBeneficiarySelected: transactions.isBeneficiarySelected,
  isReceivedAmountConfirmed: transactions.isReceivedAmountConfirmed,
  isQuoteConfirmed: transactions.isQuoteConfirmed,
  isRemittanceSlipUploadedFx: transactions.isRemittanceSlipUploadedFx,
  isAmountSoldConfirmed: transactions.isAmountSoldConfirmed,
  isSlipDeleteEnabled: trade.isSlipDeleteEnabled,
})

@connect(mapStateToProps)
class FxProgress extends Component {
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
      dispatch(getDepositSlipsByTransactionIdFX(id, token))
      dispatch(getVendors(token))
      dispatch(getBeneficiaries(token))
    }
  }

  onSourceUpdate = values => {
    const {
      dispatch,
      token,
      selectedTransaction: {
        id,
        depositCurrency,
        depositsInPersonalAccount,
        depositsInCorporateAccount,
      },
    } = this.props
    const payload = {
      id: values.id,
      sourceCurrency: depositCurrency,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
    }
    Promise.resolve(dispatch(updateSwapTxnSourceDetails(values))).then(
      dispatch(updateTransactionValues(payload, id, token)),
    )
  }

  render() {
    const {
      isEditTxnMode,
      txnLoading,
      srcCurrencies,
      vendorBeneficiaries,
      selectedTransaction,
      uploadedRemittanceSlipsFx,
      selectedVendor,
      progressLogs,
      tradeTransactions,

      isBeneficiarySelected,
      isReceivedAmountConfirmed,
      isQuoteConfirmed,
      isAmountSoldConfirmed,
      isSlipDeleteEnabled,
    } = this.props

    const currentTransaction = tradeTransactions.find(el => el.id === selectedTransaction.id)
    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Skeleton loading={txnLoading}>
          <Spin spinning={txnLoading}>
            <Vendor />
            <SourceAndBene
              srcCurrencies={srcCurrencies}
              clientBeneficiaries={vendorBeneficiaries}
              isEditMode={isEditTxnMode}
              depositCurrency={selectedTransaction.depositCurrency}
              totalDepositAmount={selectedTransaction.totalDepositAmount}
              beneficiary={selectedTransaction.beneficiary}
              id={selectedTransaction.transactionId}
              onSourceUpdate={value => this.onSourceUpdate(value)}
              onBeneUpdate={value => this.onBeneUpdate(value)}
            />
            {(isBeneficiarySelected || isEditTxnMode) && <ReceivedAmount />}
            {(isReceivedAmountConfirmed || isEditTxnMode) && (
              <Fees feeFor="fxprovider" feeAccountType="fx" />
            )}
            {(isQuoteConfirmed || isEditTxnMode) && (
              <UploadPayslip
                tradeOrTranId={selectedTransaction?.id}
                clientOrVendorName={selectedVendor?.genericInformation?.tradingName}
                uploadView={{
                  canUpload: true,
                  viewUploadList: true,
                  canDelete: isSlipDeleteEnabled,
                }}
                showPaySlips={uploadedRemittanceSlipsFx}
                title="Remittance Slip"
                progressLogs={currentTransaction ? currentTransaction.progressLogs : progressLogs}
                category={selectedVendor?.isFx ? 'Fx' : ''}
                categoryType="Fx"
              />
            )}
            {(isQuoteConfirmed || isEditTxnMode) && <AmountSold />}
            {(isAmountSoldConfirmed || isEditTxnMode) && <RemittedAmount />}
          </Spin>
        </Skeleton>
      </Card>
    )
  }
}
export default FxProgress
