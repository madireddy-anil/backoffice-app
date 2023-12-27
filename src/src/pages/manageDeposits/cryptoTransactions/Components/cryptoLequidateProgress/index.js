import React from 'react'
import { connect } from 'react-redux'
import { Spin, Skeleton } from 'antd'
import { getBeneficiaries, getVendors } from 'redux/general/actions'
import {
  updateVendorDetails,
  getDepositSlipsByTransactionIdLequidate,
  getBankAccountByvendorId,
  // updateSwapTxnSourceDetails,
  // updateTransactionValues,
} from 'redux/cryptoTransactions/actions'

import UploadPayslip from '../../../trade/components/uploadPayslip'
import Vendors from '../vendors'
import Source from '../source'
import TradeRates from '../cryptoRates'
import ReceivedAmount from '../receivedAmount'
import RemittedAmount from '../remittedAmount'
import AmountSold from '../amountSold'

const mapStateToProps = ({ user, general, cryptoTransaction, trade }) => ({
  token: user.token,
  vendors: general.newVendors,
  isEditCryptoTxnMode: cryptoTransaction.isEditCryptoTxnMode,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  txnLoading: cryptoTransaction.txnLoading,
  selectedVendor: cryptoTransaction.selectedVendor,
  uploadedLiquidateTxnPaySlips: cryptoTransaction.selectedRemittanceSlipsLiquidate,

  isBeneficiarySelected: cryptoTransaction.isBeneficiarySelected,
  isLocalAccountsProvided: cryptoTransaction.isLocalAccountsProvided,
  isPayslipReceived: trade.isPayslipReceived,
  isReceivedAmountConfirmed: cryptoTransaction.isReceivedAmountConfirmed,
  isQuoteConfirmed: cryptoTransaction.isQuoteConfirmed,
  isTransactionHashConfirmed: cryptoTransaction.isTransactionHashConfirmed,
})

@connect(mapStateToProps)
export default class CryptoLequidateProgress extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      dispatch,
      vendors,
      selectedTransaction: { id, vendorId },
      token,
    } = this.props
    const bankAccounts = {
      vendorId,
      accountStatus: 'available',
    }
    if (prevProps.selectedTransaction.vendorId !== vendorId && vendorId !== '') {
      const vendorData = vendors.find(el => el.id === vendorId)
      dispatch(updateVendorDetails(vendorData))
      dispatch(getDepositSlipsByTransactionIdLequidate(id, token))
      dispatch(getBankAccountByvendorId(bankAccounts, token))
      dispatch(getVendors(token))
      dispatch(getBeneficiaries(token))
    }
  }

  render() {
    const {
      selectedTransaction,
      selectedVendor,
      isEditCryptoTxnMode,
      isBeneficiarySelected,
      isReceivedAmountConfirmed,
      isQuoteConfirmed,
      uploadedLiquidateTxnPaySlips,
      txnLoading,
    } = this.props
    return (
      <React.Fragment>
        <Skeleton loading={txnLoading} active>
          <Spin spinning={txnLoading}>
            <Vendors />
            <Source />
            {(isBeneficiarySelected || isEditCryptoTxnMode) && <ReceivedAmount />}
            {(isReceivedAmountConfirmed || isEditCryptoTxnMode) && (
              <TradeRates feeAccountType="liquidate" />
            )}
            {(isQuoteConfirmed || isEditCryptoTxnMode) && (
              <UploadPayslip
                tradeOrTranId={selectedTransaction?.id}
                clientOrVendorName={selectedVendor?.genericInformation?.tradingName}
                uploadView={{ canUpload: true, viewUploadList: true }}
                showPaySlips={uploadedLiquidateTxnPaySlips}
                title="Remittance Slip"
                category="liquidate"
              />
            )}
            {(isQuoteConfirmed || isEditCryptoTxnMode) && <AmountSold />}
            {(isQuoteConfirmed || isEditCryptoTxnMode) && <RemittedAmount />}
          </Spin>
        </Skeleton>
      </React.Fragment>
    )
  }
}
