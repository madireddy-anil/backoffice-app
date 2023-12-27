import { all } from 'redux-saga/effects'
import user from './user/sagas'
import settings from './settings/sagas'
import dashboard from './dashboard/saga'
import general from './general/saga'
import register from './register/saga'

import trades from './trades/saga'
import newTrade from './newTrade/saga'
import trade from './trade/saga'
import chat from './chat/saga'
import routingEngine from './routingEngine/saga'
import transactions from './transactions/saga'
import upload from './upload/saga'
import beneficiary from './beneficiary/saga'
// import newBeneficiary from './newBeneficiary/saga'
import bankAccount from './bankAccounts/saga'
import feeConfig from './feeconfig/saga'
import fxBaseRate from './fxBaseRate/saga'
import cryptoTransactions from './cryptoTransactions/saga'
import volumeAndProfit from './reports/volumeAndProfit/saga'
import customerReport from './reports/customerReports/sagas'
import marginReport from './reports/marginReport/saga'
import vendorReport from './reports/vendorReport/saga'
import customerSummaryReport from './reports/customerSummaryReport/saga'
import vendorSummaryPortfolioReport from './reports/vendorSummaryPortfolioReport/saga'
import vendorSummaryReport from './reports/vendorSummaryReport/saga'
import cryptoBeneficiary from './cryptoBeneficiary/saga'
import notifications from './notifications/saga'
import tradeSummaryReport from './reports/tradeSummaryReport/saga'
import currencyAccounts from './currencyAccounts/saga'
import finOpsReports from './reports/FinOpsReport/saga'
import tatSummaryReport from './reports/tatSummaryReport/saga'
import tatSummaryPortfolioReport from './reports/tatSummaryPortfolioReport/saga'

// currency accounts
import currencies from './currencies/saga'
import currencyPairs from './currencyPairs/saga'
// import pricingProfiles from './pricing/saga'
import pricing from './pricingProfile/saga'
import paymentProcessFlow from './paymentProcessFlow/saga'
import permissions from './permissions/saga'
import roles from './roles/saga'
import users from './users/saga'
import caBeneficiaries from './caBeneficiaries/saga'
import caTransactions from './caTransactions/saga'
import caBalanceAdjustments from './caBalanceAdjustments/saga'
import digitalPayment from './digitalPayment/saga'
import accountingProfile from './accountingProfile/saga'
import paymentErrorQueue from './paymentErrorQueue/saga'
import vendorConfiguration from './vendorConfiguration/saga'
import vendorStatements from './vendorStatements/saga'

// New Process
import npTrades from './restrictedCurrencies/trade/tradesHistory/saga'
import npNewTrade from './restrictedCurrencies/trade/newTrade/saga'
import npTrade from './restrictedCurrencies/trade/tradeProcess/tradeDetails/saga'
import npChat from './restrictedCurrencies/trade/tradeProcess/chat/saga'
import npTransaction from './restrictedCurrencies/trade/tradeProcess/transactions/saga'
import npRoutingEngine from './restrictedCurrencies/trade/tradeProcess/routeEngine/saga'

import clientManagement from './clientManagement/saga'

export default function* rootSaga() {
  yield all([
    user(),
    settings(),
    register(),
    dashboard(),
    general(),
    trades(),
    newTrade(),
    trade(),
    chat(),
    routingEngine(),
    transactions(),
    upload(),
    beneficiary(),
    // newBeneficiary(),
    bankAccount(),
    feeConfig(),
    fxBaseRate(),
    cryptoTransactions(),
    volumeAndProfit(),
    customerReport(),
    marginReport(),
    vendorReport(),
    customerSummaryReport(),
    vendorSummaryPortfolioReport(),
    vendorSummaryReport(),
    cryptoBeneficiary(),
    notifications(),
    tradeSummaryReport(),
    currencies(),
    currencyAccounts(),
    finOpsReports(),
    tatSummaryReport(),
    tatSummaryPortfolioReport(),
    permissions(),
    roles(),
    caTransactions(),
    caBalanceAdjustments(),
    users(),
    digitalPayment(),
    caBeneficiaries(),
    currencyPairs(),
    // pricingProfiles(),
    paymentProcessFlow(),
    vendorConfiguration(),
    vendorStatements(),
    pricing(),
    npTrades(),
    npNewTrade(),
    npTrade(),
    npChat(),
    npTransaction(),
    npRoutingEngine(),
    accountingProfile(),
    clientManagement(),
    paymentErrorQueue(),
  ])
}
