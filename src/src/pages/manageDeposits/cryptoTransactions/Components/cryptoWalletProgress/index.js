import React from 'react'
import { connect } from 'react-redux'
import { Spin, Skeleton } from 'antd'
import { getBeneficiaries, getVendors } from 'redux/general/actions'
import {
  updateVendorDetails,
  getDepositSlipsByTransactionIdCWallet,
  getBankAccountByvendorId,
  // updateSwapTxnSourceDetails,
  // updateTransactionValues,
} from 'redux/cryptoTransactions/actions'

import UploadPayslip from '../../../trade/components/uploadPayslip'
import Vendors from '../vendors'
import Source from '../source'
import ReceivedAmount from '../receivedAmount'
import RemittedAmount from '../remittedAmount'
import SenderReceiverDetails from '../SenderReceiverDetails'
import AmountSold from '../amountSold'

const mapStateToProps = ({ user, general, cryptoTransaction }) => ({
  token: user.token,
  vendors: general.newVendors,
  isEditCryptoTxnMode: cryptoTransaction.isEditCryptoTxnMode,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  selectedVendor: cryptoTransaction.selectedVendor,
  uploadedCWalletTxnPaySlips: cryptoTransaction.selectedRemittanceSlipsCWallet,
  txnLoading: cryptoTransaction.txnLoading,
  isBeneficiarySelected: cryptoTransaction.isBeneficiarySelected,
  isReceivedAmountConfirmed: cryptoTransaction.isReceivedAmountConfirmed,
  isTransactionHashConfirmed: cryptoTransaction.isTransactionHashConfirmed,
})

@connect(mapStateToProps)
export default class CryptoWalletProgress extends React.Component {
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
      dispatch(getDepositSlipsByTransactionIdCWallet(id, token))
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
      isTransactionHashConfirmed,
      uploadedCWalletTxnPaySlips,
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
              <UploadPayslip
                tradeOrTranId={selectedTransaction?.id}
                clientOrVendorName={selectedVendor?.genericInformation?.tradingName}
                uploadView={{ canUpload: true, viewUploadList: true }}
                showPaySlips={uploadedCWalletTxnPaySlips}
                title="Remittance Slip"
                category="crypto_wallet"
              />
            )}
            {(isReceivedAmountConfirmed || isEditCryptoTxnMode) && <AmountSold />}
            {(isReceivedAmountConfirmed || isEditCryptoTxnMode) && <SenderReceiverDetails />}
            {(isTransactionHashConfirmed || isEditCryptoTxnMode) && <RemittedAmount />}
          </Spin>
        </Skeleton>
      </React.Fragment>
    )
  }
}
