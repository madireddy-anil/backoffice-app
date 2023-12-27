import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { createHashHistory } from 'history'
// import reducer from 'antd/es/form'
import storage from 'redux-persist/es/storage'
import user from './user/reducers'
import register from './register/reducer'
import menu from './menu/reducers'
import settings from './settings/reducers'
import dashboard from './dashboard/reducer'
import general from './general/reducer'

import trades from './trades/reducer'
import newTrade from './newTrade/reducer'
import trade from './trade/reducer'
import chat from './chat/reducer'
import routingEngine from './routingEngine/reducer'
import transactions from './transactions/reducer'
import upload from './upload/reducer'
import beneficiary from './beneficiary/reducer'
import newBeneficiary from './newBeneficiary/reducer'
import bankAccount from './bankAccounts/reducer'
import feeConfig from './feeconfig/reducer'
import fxBaseRate from './fxBaseRate/reducer'
import cryptoTransaction from './cryptoTransactions/reducer'
import volumeAndProfit from './reports/volumeAndProfit/reducer'
import customerReports from './reports/customerReports/reducers'
import marginReport from './reports/marginReport/reducer'
import vendorReport from './reports/vendorReport/reducer'
import customerSummaryReport from './reports/customerSummaryReport/reducer'
import vendorSummaryPortfolioReport from './reports/vendorSummaryPortfolioReport/reducer'
import vendorSummaryReport from './reports/vendorSummaryReport/reducer'
import cryptoBeneficiary from './cryptoBeneficiary/reducer'
import notifications from './notifications/reducer'
import tradeSummaryReport from './reports/tradeSummaryReport/reducer'
import currencies from './currencies/reducer'
import currencyAccounts from './currencyAccounts/reducer'
import currencyPairs from './currencyPairs/reducer'
import paymentProcessFlow from './paymentProcessFlow/reducer'
import vendorConfiguration from './vendorConfiguration/reducer'
import vendorStatements from './vendorStatements/reducer'
// import pricingProfiles from './pricing/reducer'
import pricing from './pricingProfile/reducer'
import digitalPayment from './digitalPayment/reducer'
import accountingProfile from './accountingProfile/reducer'
import paymentErrorQueue from './paymentErrorQueue/reducer'
import finOpsReports from './reports/FinOpsReport/reducer'
import tatSummaryReport from './reports/tatSummaryReport/reducer'
import tatSummaryPortfolioReport from './reports/tatSummaryPortfolioReport/reducer'
import permissions from './permissions/reducer'
import roles from './roles/reducer'
import users from './users/reducer'

import caTransactions from './caTransactions/reducer'
import caBalanceAdjustments from './caBalanceAdjustments/reducer'
import caBeneficiaries from './caBeneficiaries/reducer'
import auth0 from './auth0/reducer'

// New Process
import npTrades from './restrictedCurrencies/trade/tradesHistory/reducer'
import npNewTrade from './restrictedCurrencies/trade/newTrade/reducer'
import npTrade from './restrictedCurrencies/trade/tradeProcess/tradeDetails/reducer'
import npChat from './restrictedCurrencies/trade/tradeProcess/chat/reducer'
import npTransactions from './restrictedCurrencies/trade/tradeProcess/transactions/reducer'
import npRoutingEngine from './restrictedCurrencies/trade/tradeProcess/routeEngine/reducer'

import clientManagement from './clientManagement/reducer'

const history = createHashHistory()

const appReducer = combineReducers({
  router: connectRouter(history),
  // reducer,
  user,
  register,
  menu,
  settings,
  dashboard,
  general,
  trades,
  newTrade,
  trade,
  chat,
  routingEngine,
  transactions,
  upload,
  beneficiary,
  newBeneficiary,
  bankAccount,
  feeConfig,
  fxBaseRate,
  cryptoTransaction,
  volumeAndProfit,
  customerReports,
  marginReport,
  vendorReport,
  customerSummaryReport,
  vendorSummaryPortfolioReport,
  vendorSummaryReport,
  cryptoBeneficiary,
  notifications,
  tradeSummaryReport,
  currencies,
  currencyAccounts,
  finOpsReports,
  tatSummaryReport,
  tatSummaryPortfolioReport,
  permissions,
  roles,
  users,
  digitalPayment,
  caTransactions,
  caBalanceAdjustments,
  auth0,
  caBeneficiaries,
  currencyPairs,
  accountingProfile,
  vendorConfiguration,
  vendorStatements,
  // pricingProfiles,
  pricing,
  // new process
  npTrades,
  npNewTrade,
  npTrade,
  npChat,
  npTransactions,
  npRoutingEngine,
  paymentProcessFlow,
  paymentErrorQueue,
  clientManagement,
})

const rootReducer = (state, action) => {
  if (action.type === 'LOG_OUT') {
    state = {}
    storage.removeItem('persist:appReducer')
  }
  return appReducer(state, action)
}

export default rootReducer
