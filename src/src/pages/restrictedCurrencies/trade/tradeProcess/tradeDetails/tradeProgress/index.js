/* Changed Deposit upload component as optional - 12-09-2020  */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Spin, Skeleton } from 'antd'

import {
  updateCurrentClient,
  geDepositSlipsByTradeId,
  updateSelectedSourceDetails,
  updateSourceDetails,
  updateBeneficiary,
} from 'redux/restrictedCurrencies/trade/tradeProcess/tradeDetails/actions'

import Client from '../../../rcComponents/clients'
import SourceAndBene from '../../../rcComponents/source'
import LocalDepositsView from '../../../rcComponents/localDepositsView'
import UploadPayslip from '../../../rcComponents/uploadPayslip'
import DepositAmount from '../../../rcComponents/depositAmount'
import FundReceiptConfirm from '../../../rcComponents/fundReceiptConfirm'
import TradeRates from '../../../rcComponents/tradeRates'
import UpdateBackDatedTrade from '../../../rcComponents/backDatedTrade'

const mapStateToProps = ({ user, general, npTrade }) => ({
  token: user.token,
  clients: general.clients,
  srcCurrencies: general.currencies,
  clientBeneficiaries: general.clientBeneficiaries,
  currentTradeClient: general.currentTradeClient,
  routeEngineData: npTrade.routeEngineData,
  isEditMode: npTrade.isEditMode,
  tradeLoading: npTrade.tradeLoading,
  sourceCurrency: npTrade.sourceCurrency,
  depositCurrency: npTrade.depositCurrency,
  totalDepositAmount: npTrade.totalDepositAmount,
  depositsInPersonalAccount: npTrade.depositsInPersonalAccount,
  depositsInCorporateAccount: npTrade.depositsInCorporateAccount,
  beneficiary: npTrade.beneficiary,
  tradeId: npTrade.tradeId,
  clientId: npTrade.clientId,
  parentId: npTrade.parentId,
  clientName: npTrade.clientName,
  progressLogs: npTrade.progressLogs,
  uploadedPaySlips: npTrade.paySlips,
  localDepositAccounts: npTrade.localDepositAccounts,
  isLocalAccountsFetched: npTrade.isLocalAccountsFetched,
  isPayslipReceived: npTrade.isPayslipReceived,
  isDepositAmountConfirmed: npTrade.isDepositAmountConfirmed,
  isRateConfirmed: npTrade.isRateConfirmed,
  isSlipDeleteEnabled: npTrade.isSlipDeleteEnabled,
})

@connect(mapStateToProps)
class TradeProgress extends Component {
  componentDidUpdate(prevProps) {
    const { dispatch, parentId, clientId, clients, tradeId, token } = this.props
    if (prevProps.clientId !== clientId && clientId !== '') {
      dispatch(geDepositSlipsByTradeId(tradeId, token))
    }
    if (prevProps.parentId !== parentId && parentId !== '') {
      const clientObj = clients.find(el => el.id === clientId)
      if (clientObj) {
        dispatch(updateCurrentClient(clientObj))
      }
    }
  }

  onSourceUpdate = values => {
    const {
      dispatch,
      token,
      sourceCurrency,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
    } = this.props
    const payload = {
      id: values.id,
      sourceCurrency,
      depositsInPersonalAccount,
      depositsInCorporateAccount,
    }
    Promise.resolve(dispatch(updateSelectedSourceDetails(values))).then(
      dispatch(updateSourceDetails(payload, token)),
    )
  }

  onBeneUpdate = values => {
    const { dispatch, token } = this.props
    dispatch(updateBeneficiary(values, token))
  }

  render() {
    const {
      srcCurrencies,
      clientBeneficiaries,
      tradeId,
      tradeLoading,
      isEditMode,
      totalDepositAmount,
      depositCurrency,
      beneficiary,
      clientName,
      progressLogs,
      uploadedPaySlips,
      currentTradeClient,
      localDepositAccounts,

      isLocalAccountsFetched,
      isPayslipReceived,
      isDepositAmountConfirmed,
      isRateConfirmed,
      isSlipDeleteEnabled,
    } = this.props
    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Skeleton loading={tradeLoading} active>
          <Spin spinning={tradeLoading}>
            <Client />
            {isEditMode && <UpdateBackDatedTrade />}
            <SourceAndBene
              srcCurrencies={srcCurrencies}
              clientBeneficiaries={clientBeneficiaries}
              isEditMode={isEditMode}
              depositCurrency={depositCurrency}
              totalDepositAmount={totalDepositAmount}
              beneficiary={beneficiary}
              id={tradeId}
              onSourceUpdate={value => this.onSourceUpdate(value)}
              onBeneUpdate={value => this.onBeneUpdate(value)}
            />
            {(isLocalAccountsFetched || isEditMode) && (
              <LocalDepositsView bankAccounts={localDepositAccounts} />
            )}
            {(isLocalAccountsFetched || isEditMode) && (
              <UploadPayslip
                tradeOrTranId={tradeId}
                clientOrVendorName={clientName}
                uploadView={{
                  canUpload: true,
                  viewUploadList: true,
                  canDelete: isSlipDeleteEnabled,
                }}
                showPaySlips={uploadedPaySlips}
                title="Deposit Slip"
                progressLogs={progressLogs}
                category={currentTradeClient !== undefined && currentTradeClient.entityType}
                categoryType="Deposit Slip"
              />
            )}
            {(isPayslipReceived || isEditMode) && <DepositAmount />}
            {(isDepositAmountConfirmed || isEditMode) && <TradeRates />}
            {(isRateConfirmed || isEditMode) && <FundReceiptConfirm />}
          </Spin>
        </Skeleton>
      </Card>
    )
  }
}
export default TradeProgress
