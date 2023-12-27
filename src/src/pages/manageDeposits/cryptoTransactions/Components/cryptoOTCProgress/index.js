import React from 'react'
import { connect } from 'react-redux'
import { Spin, Skeleton } from 'antd'
import { getBeneficiaries, getVendors } from 'redux/general/actions'
import {
  updateVendorDetails,
  getDepositSlipsByTransactionIdOTC,
  getBankAccountByvendorId,
} from 'redux/cryptoTransactions/actions'

import UploadPayslip from '../../../trade/components/uploadPayslip'
import Vendors from '../vendors'
import Source from '../source'
import TradeRates from '../cryptoRates'
import LocalDepositAccounts from '../localDepositAccounts'
import ReceivedAmount from '../receivedAmount'
import RemittedAmount from '../remittedAmount'
import SenderReceiverDetails from '../SenderReceiverDetails'
import AccountDetails from '../accountDetails'
import AmountSold from '../amountSold'

const mapStateToProps = ({ user, general, cryptoTransaction, trade }) => ({
  token: user.token,
  vendors: general.newVendors,
  isEditCryptoTxnMode: cryptoTransaction.isEditCryptoTxnMode,
  txnLoading: cryptoTransaction.txnLoading,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  selectedVendor: cryptoTransaction.selectedVendor,
  uploadedTradePaySlips: trade.paySlips,
  uploadedOTCTxnPaySlips: cryptoTransaction.selectedRemittanceSlipsOTC,

  isBeneficiarySelected: cryptoTransaction.isBeneficiarySelected,
  isAccountsReceivedFromVendor: cryptoTransaction.isAccountsReceivedFromVendor,
  isAccountsRequestedToVendor: cryptoTransaction.isAccountsRequestedToVendor,
  isLocalAccountsProvided: cryptoTransaction.isLocalAccountsProvided,
  isDepositAmountConfirmed: trade.isDepositAmountConfirmed,
  isReceivedAmountConfirmed: cryptoTransaction.isReceivedAmountConfirmed,
  isQuoteConfirmed: cryptoTransaction.isQuoteConfirmed,
  isTransactionHashConfirmed: cryptoTransaction.isTransactionHashConfirmed,
})

@connect(mapStateToProps)
export default class CryptoOTCProgress extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      dispatch,
      vendors,
      selectedTransaction: { id, vendorId },
      token,
    } = this.props
    if (prevProps.selectedTransaction.vendorId !== vendorId && vendorId !== '') {
      const vendorData = vendors.find(el => el.id === vendorId)
      const bankAccounts = {
        vendorId,
        accountStatus: 'available',
      }
      dispatch(updateVendorDetails(vendorData))
      dispatch(getDepositSlipsByTransactionIdOTC(id, token))
      dispatch(getBankAccountByvendorId(bankAccounts, token))
      dispatch(getVendors(token))
      dispatch(getBeneficiaries(token))
    }
  }

  render() {
    const {
      selectedTransaction,
      selectedVendor,
      uploadedTradePaySlips,
      isEditCryptoTxnMode,
      isBeneficiarySelected,
      isAccountsReceivedFromVendor,
      isAccountsRequestedToVendor,
      isLocalAccountsProvided,
      isDepositAmountConfirmed,
      isReceivedAmountConfirmed,
      isQuoteConfirmed,
      isTransactionHashConfirmed,
      uploadedOTCTxnPaySlips,
      txnLoading,
    } = this.props
    return (
      <React.Fragment>
        <Skeleton loading={txnLoading} active>
          <Spin spinning={txnLoading}>
            <Vendors />
            <Source />
            {(isBeneficiarySelected || isEditCryptoTxnMode) && <AccountDetails />}
            {((isAccountsReceivedFromVendor && isAccountsRequestedToVendor) ||
              isEditCryptoTxnMode) && <LocalDepositAccounts />}
            {(isLocalAccountsProvided || isEditCryptoTxnMode) && (
              <UploadPayslip
                tradeOrTranId={selectedTransaction.id}
                clientOrVendorName={selectedVendor?.genericInformation?.tradingName}
                uploadView={{ canUpload: false, viewUploadList: true }}
                showPaySlips={uploadedTradePaySlips}
                title="Deposit Slip"
                category="otc"
              />
            )}
            {(isDepositAmountConfirmed || isEditCryptoTxnMode) && <ReceivedAmount />}
            {(isReceivedAmountConfirmed || isEditCryptoTxnMode) && (
              <TradeRates feeAccountType="otc" />
            )}
            {(isQuoteConfirmed || isEditCryptoTxnMode) && (
              <UploadPayslip
                tradeOrTranId={selectedTransaction?.id}
                clientOrVendorName={selectedVendor?.genericInformation?.tradingName}
                uploadView={{ canUpload: true, viewUploadList: true }}
                showPaySlips={uploadedOTCTxnPaySlips}
                title="Remittance Slip"
                category="otc"
              />
            )}
            {(isQuoteConfirmed || isEditCryptoTxnMode) && <AmountSold />}
            {(isQuoteConfirmed || isEditCryptoTxnMode) && <SenderReceiverDetails />}
            {(isTransactionHashConfirmed || isEditCryptoTxnMode) && <RemittedAmount />}
          </Spin>
        </Skeleton>
      </React.Fragment>
    )
  }
}
