import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import NProgress from 'nprogress'

import _ from 'lodash'
import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'
import { formatNumberDecimal } from '../../utilities/transformer'

import actions from './actions'
import tradeRouteActions from '../routingEngine/actions'
import tradeActions from '../trade/actions'

import { getTrade } from '../trade/saga'

const { txnPrivateGet, txnPrivatePut, txnPrivatePost, txnPrivateDelete } = axiosMethod
const { globalMessages } = Variables

const getTransactions = (values, token) => {
  const page = values.page ? encodeURI(`&page=${values.page}`) : ''
  const limit = values.limit ? encodeURI(`&limit=${values.limit}`) : ''
  const clientId = values.clientId ? encodeURI(`&clientId=${values.clientId}`) : ''
  const transactionReference = values.transactionReference
    ? encodeURI(`&transactionReference=${values.transactionReference}`)
    : ''
  const vendorId = values.vendorId ? encodeURI(`&vendorId=${values.vendorId}`) : ''
  const depositCurrency = values.depositCurrency
    ? encodeURI(`&depositCurrency=${values.depositCurrency}`)
    : ''
  const totalDepositAmount = values.totalDepositAmount
    ? encodeURI(`&totalDepositAmount=${values.totalDepositAmount}`)
    : ''
  const settlementCurrency = values.settlementCurrency
    ? encodeURI(`&settlementCurrency=${values.settlementCurrency}`)
    : ''
  const transactionStatus = values.transactionStatus
    ? encodeURI(`&transactionStatus=${values.transactionStatus}`)
    : ''
  const orderBy = encodeURI('?orderBy=progressLogs.transactionRequestedAt')
  return txnPrivateGet(
    `tx-service/transactions${orderBy}${page}${limit}${clientId}${transactionReference}${vendorId}${depositCurrency}${totalDepositAmount}${settlementCurrency}${transactionStatus}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getAllTransactions(values) {
  try {
    const response = yield call(getTransactions, values.value, values.token)
    yield put({
      type: actions.GET_ALL_TRANSACTIONS_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_ALL_TRANSACTIONS_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const createTransaction = values => {
  const body = {
    tradeId: values.value.tradeId,
    transactionCurrency: values.value.depositCurrency,
    depositsInPersonalAccount: values.value.depositsInPersonalAccount,
    depositsInCorporateAccount: values.value.depositsInCorporateAccount,
    isDepositsInPersonalAccount: values.value.depositsInPersonalAccount !== 0,
    isDepositsInCorporateAccount: values.value.depositsInCorporateAccount !== 0,
    vendorName: values.value.vendorName,
    vendorId: values.value.vendorId,
    clientId: values.value.clientId,
    settlementCurrency: values.value.settlementCurrency,
    tradeRouterId: values.value.id,
  }
  return txnPrivatePost(`tx-service/transactions`, body, values.token).then(response => {
    return response.data.data
  })
}

export function* createNewTransaction(values) {
  try {
    const response = yield call(createTransaction, values)
    yield put({
      type: actions.CREATE_TRANSACTION_SUCCESS,
      value: response,
    })
    yield put({
      type: tradeRouteActions.UPDATE_ROUTE_DETAILS,
      routeId: values.value.id,
      value: { transactionId: response.id },
      token: values.token,
    })
  } catch (e) {
    yield put({
      type: actions.CREATE_TRANSACTION_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getTxnByClientId = values => {
  return txnPrivateGet(`tx-service/transactions?clientId=${values.value}`, values.token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getTransactionsByClientId(values) {
  try {
    const response = yield call(getTxnByClientId, values)
    yield put({
      type: actions.GET_TRANSACTIONS_BY_CLIENT_ID_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_TRANSACTIONS_BY_CLIENT_ID_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getTxnById = values => {
  return txnPrivateGet(`tx-service/transactions/${values.value}`, values.token).then(response => {
    let { buyRates } = response.data.data
    if (buyRates.length !== 0) {
      buyRates = buyRates.map(rate => {
        rate.inverseAmount = formatNumberDecimal(rate.inverseAmount)
        rate.sellRate = formatNumberDecimal(rate.sellRate)
        rate.sellRateInverse = formatNumberDecimal(rate.sellRateInverse)
        rate.settlementAmount = formatNumberDecimal(rate.settlementAmount)
        rate.targetAmount = formatNumberDecimal(rate.targetAmount)
        return rate
      })
    }
    response.data.data.buyRates = buyRates
    return response.data.data
  })
}

export function* getTransactionsById(values) {
  try {
    const response = yield call(getTxnById, values)
    yield put({
      type: actions.GET_TRANSACTIONS_BY_ID_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_TXN_FEES_BY_TXN_ID,
      value: response.id,
      token: values.token,
    })
    yield put({
      type: actions.GET_TXN_RATES_BY_TXN_ID,
      value: response.id,
      token: values.token,
    })
  } catch (e) {
    yield put({
      type: actions.GET_TRANSACTIONS_BY_ID_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateTxn = (value, token) => {
  const body = value
  return txnPrivateGet(`tx-service/transactions?${value.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* editTransaction(values) {
  try {
    const response = yield call(updateTxn, values.value, values.token)
    yield put({
      type: actions.UPDATE_TRANSACTION_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.UPDATE_TRANSACTION_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const cancelTxn = (value, token) => {
  const body = { transactionStatus: 'CANCELLED' }
  return txnPrivatePut(`tx-service/transactions/${value.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* cancelTransaction(values) {
  try {
    const response = yield call(cancelTxn, values.value, values.token)
    yield put({
      type: actions.CANCEL_TRANSACTION_SUCCESS,
      value: response,
    })
    const routeData = {
      id: values.value.tradeRouterId,
    }
    yield put({
      type: tradeActions.UPDATE_ROUTE_ON_CANCEL_TXN,
      value: routeData,
      tradeId: values.value.tradeId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.CANCEL_TRANSACTION_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteTxn = (value, token) => {
  return txnPrivateDelete(`tx-service/transactions/${value.id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteTransaction(values) {
  try {
    const response = yield call(deleteTxn, values.value, values.token)
    yield put({
      type: actions.DELETE_TRANSACTION_SUCCESS,
      value: response,
    })
    const routeData = {
      id: values.value.tradeRouterId,
    }
    yield put({
      type: tradeActions.UPDATE_ROUTE_ON_DELETE_TXN,
      value: routeData,
      tradeId: values.value.tradeId,
      token: values.token,
    })
    yield put({
      type: actions.GET_ALL_TRANSACTIONS,
      value: { page: 1 },
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_TRANSACTION_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const bulkDeleteTxn = (value, token) => {
  const body = { transactionIDs: value }
  return txnPrivatePost(`tx-service/transactions/bulk-delete`, body, token).then(response => {
    return response.data.data
  })
}

export function* bulkDeleteTransaction(values) {
  try {
    const response = yield call(bulkDeleteTxn, values.value, values.token)
    yield put({
      type: actions.BULK_DELETE_TRANSACTION_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_ALL_TRANSACTIONS,
      value: { page: 1 },
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.BULK_DELETE_TRANSACTION_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateBene = (values, token) => {
  const body = {
    beneficiary: values.beneficiary,
    tradeRouterId: values.tradeRouterId,
  }
  return txnPrivatePut(`tx-service/transactions/${values.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateSelectedBeneficiary(values) {
  try {
    const response = yield call(updateBene, values.value, values.token)
    yield put({
      type: actions.UPDATE_SELECTED_BENEFICIARY_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_SELECTED_BENEFICIARY_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateVendor = (value, token) => {
  const body = {
    vendorId: value.updatedVendor.id,
    vendorName: value.updatedVendor.tradingName,
  }
  return txnPrivatePut(`tx-service/transactions/${value.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateTxnVendor(values) {
  try {
    const response = yield call(updateVendor, values.value, values.token)
    yield put({
      type: actions.UPDATE_SELECTED_VENDOR_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_SELECTED_VENDOR_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateAccRequestedDate = (values, token) => {
  const body = {
    progressLogs: { ...values.progressLogs, bankAccountsRequestedToVendorAt: values.date },
    transactionStatus: 'accounts_requested',
  }
  return txnPrivatePut(`tx-service/transactions/${values.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateAccountRequestedDate(values) {
  try {
    const response = yield call(updateAccRequestedDate, values.value, values.token)
    yield put({
      type: actions.CONFIRM_ACCOUNT_REQUESTED_DATE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CONFIRM_ACCOUNT_REQUESTED_DATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateAccReceivedDate = (values, token) => {
  const body = {
    progressLogs: { ...values.progressLogs, bankAccountsReceivedByVendorAt: values.date },
    transactionStatus: 'accounts_in_progress',
  }
  return txnPrivatePut(`tx-service/transactions/${values.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateAccountReceivedDate(values) {
  try {
    const response = yield call(updateAccReceivedDate, values.value, values.token)
    yield put({
      type: actions.CONFIRM_ACCOUNT_RECEIVED_DATE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CONFIRM_ACCOUNT_RECEIVED_DATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateTxnAmount = (values, token) => {
  const body = {
    depositsInPersonalAccount: values.depositsInPersonalAccount,
    depositsInCorporateAccount: values.depositsInCorporateAccount,
  }
  return txnPrivatePut(`tx-service/transactions/${values.transactionId}`, body, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateTransactionAmount(values) {
  try {
    const response = yield call(updateTxnAmount, values.value, values.token)
    yield put({
      type: actions.UPDATE_TRANSACTION_AMOUNT_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_TRANSACTION_AMOUNT_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const confirmReceivedDeposit = (values, token) => {
  const body = {
    progressLogs: { ...values.progressLogs, depositsReceiptConfirmationByVendorAt: values.date },
    depositsInPersonalAccount: values.depositsInPersonalAccount,
    depositsInCorporateAccount: values.depositsInCorporateAccount,
  }
  return txnPrivatePut(`tx-service/transactions/${values.transactionId}`, body, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* confirmReceivedAmountAndDate(values) {
  try {
    const response = yield call(confirmReceivedDeposit, values.value, values.token)
    yield put({
      type: actions.UPDATE_TRANSACTION_AMOUNT_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_TRANSACTION_AMOUNT_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const confirmRemittedFunds = (values, token) => {
  const body = {
    transactionStatus: 'completed',
    progressLogs: { ...values.progressLogs, fundsRemittedByVendorAt: values.date },
    settlementAmount: values.amount,
  }
  return txnPrivatePut(`tx-service/transactions/${values.transactionId}`, body, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* confirmRemittedAmountAndDate(values) {
  try {
    const response = yield call(confirmRemittedFunds, values.value, values.token)
    yield put({
      type: actions.CONFIRM_REMITED_FUNDS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CONFIRM_REMITED_FUNDS_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getBuyRate = (values, token) => {
  const body = {
    IsInverse: values.isInverse || true,
    accountId: values.accountId,
    vendorName: values.vendorName,
    vendorRate: values.vendorRate || '',
    rateType: 'BUYRATE',
    fxRateDateAndTime: values.rateAppliedAt,
    targetCurrency: values.targetCurrency,
    tradeAmount: values.totalDepositAmount,
    tradeCurrency: values.tradeCurrency,
    precision: values.precision,
  }
  return txnPrivatePost(`tx-service/rate-calculate`, body, token).then(response => {
    NProgress.done()
    return response.data.data
  })
}

export function* getCalculatedRate(values) {
  try {
    NProgress.start()
    const response = yield call(getBuyRate, values.value, values.token)
    yield put({
      type: actions.GET_BUY_RATE_SUCCESS,
      value: response,
    })
  } catch (err) {
    NProgress.done()
    yield put({
      type: actions.GET_BUY_RATE_FAILURE,
      value: err,
    })
    if (err.response.status === 400) {
      notification.error({
        message: err.response.data.message,
      })
    }
  }
}

const getFxRate = (values, token) => {
  const { vendor, dateFrom, dateTo, baseCurrency, targetCurrency } = values
  return txnPrivateGet(
    `tx-service/fx-base-rates?vendor=${vendor}&dateFilterBy=rateAppliedAt&dateFrom=${dateFrom}&dateTo=${dateTo}&baseCurrency=${baseCurrency}&targetCurrency=${targetCurrency}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getFxRateByVendor(values) {
  try {
    const response = yield call(getFxRate, values.value, values.token)
    yield put({
      type: actions.GET_FX_BASE_RATE_BY_VENDOR_SUCCESS,
      value: response.fxBaseRates,
    })
  } catch (err) {
    yield put({
      type: actions.GET_FX_BASE_RATE_BY_VENDOR_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateValues = (values, id, token) => {
  return txnPrivatePut(`tx-service/transactions/${id}`, values, token).then(response => {
    return response.data.data
  })
}

export function* updateTxnValues(values) {
  try {
    const response = yield call(updateValues, values.value, values.txnId, values.token)
    yield put({
      type: actions.UPDATE_TRANSACTION_VALUES_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_TRANSACTION_VALUES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getTxnFeesById = (transactionId, token) => {
  return txnPrivateGet(`tx-service/fees?transactionId=${transactionId}`, token).then(response => {
    return response.data.data
  })
}

export function* getTxnFeesByTxnId(values) {
  try {
    const response = yield call(getTxnFeesById, values.value, values.token)
    yield put({
      type: actions.GET_TXN_FEES_BY_TXN_ID_SUCCESS,
      value: response.fees,
    })
  } catch (err) {
    yield put({
      type: actions.GET_TXN_FEES_BY_TXN_ID_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getTxnRatesById = (transactionId, token) => {
  return txnPrivateGet(`tx-service/sell-rates?transactionId=${transactionId}`, token).then(
    response => {
      return response.data.data.sellRates.map(rate => {
        rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
        rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
        rate.sellRateInverse = rate.sellRateInverse ? formatNumberDecimal(rate.sellRateInverse) : 0
        rate.settlementAmount = rate.settlementAmount
          ? formatNumberDecimal(rate.settlementAmount)
          : 0
        rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
        return rate
      })
    },
  )
}

export function* getTxnRatesByTxnId(values) {
  try {
    const response = yield call(getTxnRatesById, values.value, values.token)
    yield put({
      type: actions.GET_TXN_RATES_BY_TXN_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_TXN_RATES_BY_TXN_ID_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const createFees = (values, token) => {
  return txnPrivatePost(`tx-service/fees`, values, token).then(response => {
    return response.data.data
  })
}

export function* createTxnFees(values) {
  try {
    const response = yield call(createFees, values.value, values.token)
    yield put({
      type: actions.CREATE_TXN_FEES_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_TXN_FEES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const createRates = (values, token) => {
  // const body = {
  //   transactionId: values.transactionId,
  //   actualRate: values.actualRate,
  //   actualRemittanceAmount: values.actualRemittanceAmount,
  //   actualSpread: values.actualSpread,
  //   expectedRate: values.expectedRate,
  //   expectedRemittanceAmount: values.expectedRemittanceAmount,
  //   expectedSpread: values.expectedSpread,
  //   spreadDifference: values.spreadDifference,
  //   fxProvider: values.fxProvider,
  //   fxRate: values.fxRate,
  //   baseCurrency: values.depositCurrency,
  //   baseAmount: values.baseAmount,
  //   tradeAmount: values.totalDepositAmount,
  //   targetCurrency: values.settlementCurrency,
  //   settlementAmount: values.actualRemittanceAmount,
  //   targetAmount: values.targetAmount,
  //   inverseAmount: values.inverseAmount,
  //   sellRate: values.sellRate,
  //   quoteStatus: values.quoteStatus || 'new',
  //   isIndicative: values.isIndicative || false,
  //   rateAppliedAt: new Date(),
  // }

  return txnPrivatePost(`tx-service/sell-rates`, values, token).then(response => {
    NProgress.done()
    return response.data.data
  })
}

export function* triggerTradeFetchCall(value, token) {
  try {
    const tradeResponse = yield call(getTrade, value.tradeId, token)
    yield put({
      type: tradeActions.GET_TRADE_DETAILS_BY_ID_SUCCESS,
      value: tradeResponse,
    })
  } catch (err) {
    notification.error({
      message: "Can't Get Trade Details",
      description: globalMessages.errorDescription,
    })
  }
}

export function* createTxnRates(values) {
  try {
    NProgress.start()
    const response = yield call(createRates, _.omit(values.value, 'tradeId'), values.token)
    yield put({
      type: actions.CREATE_TXN_RATES_SUCCESS,
      value: response,
    })
    yield call(triggerTradeFetchCall, values.value, values.token)
  } catch (err) {
    yield put({
      type: actions.CREATE_TXN_RATES_FAILURE,
      value: err,
    })
    NProgress.done()
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getAllAccOnlyDepositSlips = (transactionId, token) => {
  return txnPrivateGet(`tx-service/files?transactionId=${transactionId}&limit=0`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getDepositSlipsByTransactionIdAccountsOnly(values) {
  try {
    const response = yield call(getAllAccOnlyDepositSlips, values.value, values.token)
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_ACCOUNTS_ONLY,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_ACCOUNTS_ONLY,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getAllDepositSlips = (transactionId, token) => {
  return txnPrivateGet(`tx-service/files?transactionId=${transactionId}&limit=0`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getDepositSlipsByTransactionIdSwap(values) {
  try {
    const response = yield call(getAllDepositSlips, values.value, values.token)
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_SWAP,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_SWAP,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export function* getDepositSlipsByTransactionIdFX(values) {
  try {
    const response = yield call(getAllDepositSlips, values.value, values.token)
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_FX,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_FX,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

// local deposits

const updateLocalAccountsToTransaction = (transactionId, body, token) => {
  return txnPrivatePut(`tx-service/transactions/${transactionId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateAccountstoTransaction(value) {
  try {
    const response = yield call(
      updateLocalAccountsToTransaction,
      value.id,
      value.values,
      value.token,
    )
    yield put({
      type: actions.UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION_FAILURE,
      value: err,
    })
    notification.error({
      message: 'warning',
      description: 'Failed to update local accounts',
    })
  }
}

const updateLocalAccountsToTrade = (tradeId, body, token) => {
  return txnPrivatePut(`tx-service/trades/${tradeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateAccountstoTrade(value) {
  try {
    const response = yield call(updateLocalAccountsToTrade, value.id, value.values, value.token)
    yield put({
      type: actions.UPDATE_LOCAL_ACCOUNTS_TO_TRADE_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Update successfully!',
      description: 'Updated local accounts to trade',
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_LOCAL_ACCOUNTS_TO_TRADE_FAILURE,
      value: err,
    })
    notification.error({
      message: 'warning',
      description: 'Failed to update local accounts',
    })
  }
}

const updateBankAccounts = (body, token) => {
  return txnPrivatePut(`tx-service/bank-accounts`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateLocalBankAccounts(value) {
  try {
    const response = yield call(updateBankAccounts, value.values, value.token)
    yield put({
      type: actions.UPDATE_LOCAL_BANK_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_LOCAL_BANK_ACCOUNTS_FAILURE,
      value: err,
    })
    notification.error({
      message: 'warning',
      description: 'Failed to update local accounts',
    })
  }
}

const getBankAccountByvendorId = (id, token) => {
  const vendorId = id ? `?vendorId=${id}` : ''
  const accountStatus = '&accountStatus=available'
  const limit = '&limit=0'
  return txnPrivateGet(`tx-service/bank-accounts${vendorId}${accountStatus}${limit}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getAllBankAccounts(values) {
  try {
    const response = yield call(getBankAccountByvendorId, values.id, values.token)
    yield put({
      type: actions.GET_ALL_BANK_ACCOUNTS_BY_VENDOR_SUCCESS,
      value: response.bankAccount,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_BANK_ACCOUNTS_BY_VENDOR_FAILURE,
      value: err,
    })
  }
}

const deleteSelectedBankaccount = (selectedAccount, token) => {
  return txnPrivateDelete(`tx-service/bank-accounts/${selectedAccount.id}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* deleteSelectedBankAccount(values) {
  const { payload } = values
  const { localDepositAccounts, selectedAccount, selectedAccountNames, token } = payload
  try {
    yield call(deleteSelectedBankaccount, selectedAccount, token)

    yield put({
      type: actions.DELETE_SELECTED_ACCOUNT_SUCCESS,
      value: { localDepositAccounts, selectedAccountNames },
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SELECTED_ACCOUNT_FAILURE,
      value: err,
    })
  }
}

const deleteAccOnlySlip = (id, token) => {
  return txnPrivateDelete(`tx-service/files/${id}`, token).then(response => {
    return response.data
  })
}

export function* deleteRemittanceSlipAccountsOnly(values) {
  const { id, token } = values
  try {
    yield call(deleteAccOnlySlip, id, token)
    yield put({
      type: actions.DELETE_REMITTANCE_SLIP_SUCCESS_ACCOUNTS_ONLY,
      value: id,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_REMITTANCE_SLIP_FAILURE_ACCOUNTS_ONLY,
      value: err,
    })
  }
}

const deleteSlip = (id, token) => {
  return txnPrivateDelete(`tx-service/files/${id}`, token).then(response => {
    return response.data
  })
}

export function* deleteRemittanceSlipSwap(values) {
  const { id, token } = values
  try {
    yield call(deleteSlip, id, token)
    yield put({
      type: actions.DELETE_REMITTANCE_SLIP_SUCCESS_SWAP,
      value: id,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_REMITTANCE_SLIP_FAILURE_SWAP,
      value: err,
    })
  }
}

export function* deleteRemittanceSlipFX(values) {
  const { id, token } = values
  try {
    yield call(deleteSlip, id, token)
    yield put({
      type: actions.DELETE_REMITTANCE_SLIP_SUCCESS_FX,
      value: id,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_REMITTANCE_SLIP_FAILURE_FX,
      value: err,
    })
  }
}

const feeCalc = (value, token) => {
  return txnPrivatePost('tx-service/fee-automation', value, token).then(response => {
    return response.data.data
  })
}

export function* handleFeeCalc(values) {
  const { value, token } = values
  try {
    const res = yield call(feeCalc, value, token)
    yield put({
      type: actions.HANDLE_TXN_FEE_CALCULATION_SUCCESS,
      value: res,
    })
  } catch (err) {
    yield put({
      type: actions.HANDLE_TXN_FEE_CALCULATION_FAILURE,
      value: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    // Fee Calc

    takeLatest(actions.HANDLE_TXN_FEE_CALCULATION, handleFeeCalc),

    takeLatest(actions.DELETE_REMITTANCE_SLIP_ACCOUNTS_ONLY, deleteRemittanceSlipAccountsOnly),
    takeLatest(actions.DELETE_REMITTANCE_SLIP_SWAP, deleteRemittanceSlipSwap),
    takeLatest(actions.DELETE_REMITTANCE_SLIP_FX, deleteRemittanceSlipFX),
    takeLatest(actions.GET_ALL_TRANSACTIONS, getAllTransactions),
    takeLatest(actions.CREATE_TRANSACTION, createNewTransaction),
    takeLatest(actions.GET_TRANSACTIONS_BY_CLIENT_ID, getTransactionsByClientId),
    takeLatest(actions.GET_TRANSACTIONS_BY_ID, getTransactionsById),
    takeLatest(actions.UPDATE_TRANSACTION, editTransaction),
    takeLatest(actions.CANCEL_TRANSACTION, cancelTransaction),
    takeLatest(actions.DELETE_TRANSACTION, deleteTransaction),
    takeLatest(actions.BULK_DELETE_TRANSACTION, bulkDeleteTransaction),
    takeLatest(actions.UPDATE_SELECTED_BENEFICIARY, updateSelectedBeneficiary),
    takeLatest(actions.UPDATE_SELECTED_VENDOR, updateTxnVendor),
    takeLatest(actions.CONFIRM_ACCOUNT_REQUESTED_DATE, updateAccountRequestedDate),
    takeLatest(actions.CONFIRM_ACCOUNT_RECEIVED_DATE, updateAccountReceivedDate),
    takeLatest(actions.UPDATE_TRANSACTION_AMOUNT, updateTransactionAmount),
    takeLatest(actions.CONFIRM_RECEIVED_AMOUNT, confirmReceivedAmountAndDate),
    takeLatest(actions.CONFIRM_REMITED_FUNDS, confirmRemittedAmountAndDate),
    takeLatest(actions.GET_BUY_RATE, getCalculatedRate),
    takeLatest(actions.GET_FX_BASE_RATE_BY_VENDOR, getFxRateByVendor),
    takeLatest(actions.UPDATE_TRANSACTION_VALUES, updateTxnValues),
    takeLatest(actions.GET_TXN_FEES_BY_TXN_ID, getTxnFeesByTxnId),
    takeLatest(actions.GET_TXN_RATES_BY_TXN_ID, getTxnRatesByTxnId),
    takeLatest(actions.CREATE_TXN_FEES, createTxnFees),
    takeLatest(actions.CREATE_TXN_RATES, createTxnRates),
    takeLatest(
      actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_ACCOUNTS_ONLY,
      getDepositSlipsByTransactionIdAccountsOnly,
    ),
    takeLatest(
      actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SWAP,
      getDepositSlipsByTransactionIdSwap,
    ),
    takeLatest(actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FX, getDepositSlipsByTransactionIdFX),

    // local deposits
    takeLatest(actions.UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION, updateAccountstoTransaction),
    takeLatest(actions.UPDATE_LOCAL_ACCOUNTS_TO_TRADE, updateAccountstoTrade),
    takeLatest(actions.UPDATE_LOCAL_BANK_ACCOUNTS, updateLocalBankAccounts),
    takeLatest(actions.GET_ALL_BANK_ACCOUNTS_BY_VENDOR, getAllBankAccounts),
    takeLatest(actions.DELETE_SELECTED_ACCOUNT, deleteSelectedBankAccount),
  ])
}
