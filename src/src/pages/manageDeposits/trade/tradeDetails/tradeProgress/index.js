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
} from 'redux/trade/actions'

import Client from '../../components/clients'
import SourceAndBene from '../../components/source'
import LocalDepositsView from '../../components/localDepositsView'
import UploadPayslip from '../../components/uploadPayslip'
import DepositAmount from '../../components/depositAmount'
import FundReceiptConfirm from '../../components/fundReceiptConfirm'
import TradeRates from '../../components/tradeRates'
import UpdateBackDatedTrade from '../../components/backDatedTrade'

const mapStateToProps = ({ user, general, trade }) => ({
  token: user.token,
  clients: general.clients,
  srcCurrencies: general.currencies,
  clientBeneficiaries: general.clientBeneficiaries,
  currentTradeClient: general.currentTradeClient,
  routeEngineData: trade.routeEngineData,
  isEditMode: trade.isEditMode,
  tradeLoading: trade.tradeLoading,
  sourceCurrency: trade.sourceCurrency,
  depositCurrency: trade.depositCurrency,
  totalDepositAmount: trade.totalDepositAmount,
  depositsInPersonalAccount: trade.depositsInPersonalAccount,
  depositsInCorporateAccount: trade.depositsInCorporateAccount,
  beneficiary: trade.beneficiary,
  tradeId: trade.tradeId,
  clientId: trade.clientId,
  parentId: trade.parentId,
  clientName: trade.clientName,
  progressLogs: trade.progressLogs,
  uploadedPaySlips: trade.paySlips,
  localDepositAccounts: trade.localDepositAccounts,
  isLocalAccountsFetched: trade.isLocalAccountsFetched,
  isPayslipReceived: trade.isPayslipReceived,
  isDepositAmountConfirmed: trade.isDepositAmountConfirmed,
  isRateConfirmed: trade.isRateConfirmed,
  isSlipDeleteEnabled: trade.isSlipDeleteEnabled,
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
