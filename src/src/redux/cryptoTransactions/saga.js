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

const getBankAccountsByVendor = (id, token) => {
  return txnPrivateGet(`tx-service/bank-accounts?vendorId=${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getBankAccountsByVendorId(values) {
  const { id, token } = values
  try {
    const response = yield call(getBankAccountsByVendor, id, token)
    yield put({
      type: actions.FETCH_BANK_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.FETCH_BANK_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

const getTransactions = (values, token) => {
  const questionMarkSymbol =
    values.page ||
    values.clientId ||
    values.transactionReference ||
    values.vendorId ||
    values.depositCurrency ||
    values.totalDepositAmount ||
    values.settlementCurrency ||
    values.transactionStatus
      ? '?'
      : ''
  const page = values.page ? encodeURI(`page=${values.page}`) : ''
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
  return txnPrivateGet(
    `tx-service/crypto-transactions${questionMarkSymbol}${page}${limit}${clientId}${transactionReference}${vendorId}${depositCurrency}${totalDepositAmount}${settlementCurrency}${transactionStatus}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getAllTransactions(values) {
  try {
    const response = yield call(getTransactions, values.value, values.token)
    yield put({
      type: actions.GET_ALL_CRYPTO_TRANSACTIONS_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_ALL_CRYPTO_TRANSACTIONS_FAILURE,
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
    depositCurrency: values.value.depositCurrency,
    depositsInPersonalAccount: values.value.depositsInPersonalAccount,
    depositsInCorporateAccount: values.value.depositsInCorporateAccount,
    isDepositsInPersonalAccount: values.value.isDepositsInPersonalAccount,
    isDepositsInCorporateAccount: values.value.isDepositsInCorporateAccount,
    totalDepositAmount: values.value.totalDepositAmount,
    vendorName: values.value.vendorName,
    vendorId: values.value.vendorId,
    clientId: values.value.clientId,
    settlementCurrency: values.value.settlementCurrency,
    tradeRouterId: values.value.id,
  }
  return txnPrivatePost(`tx-service/crypto-transactions`, body, values.token).then(response => {
    return response.data.data
  })
}

export function* createNewTransaction(values) {
  try {
    const response = yield call(createTransaction, values)
    yield put({
      type: actions.CREATE_CRYPTO_TRANSACTION_SUCCESS,
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
      type: actions.CREATE_CRYPTO_TRANSACTION_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getTxnByClientId = values => {
  return txnPrivateGet(
    `tx-service/crypto-transactions?clientId=${values.value}`,
    values.token,
  ).then(response => {
    return response.data.data
  })
}

export function* getTransactionsByClientId(values) {
  try {
    const response = yield call(getTxnByClientId, values)
    yield put({
      type: actions.GET_CRYPTO_TRANSACTION_BY_CLIENT_ID_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_CRYPTO_TRANSACTION_BY_CLIENT_ID_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getTxnById = values => {
  return txnPrivateGet(`tx-service/crypto-transactions/${values.value}`, values.token).then(
    response => {
      let { buyRates } = response.data.data
      if (buyRates.length !== 0) {
        buyRates = buyRates.map(rate => {
          rate.baseAmount = rate.baseAmount ? formatNumberDecimal(rate.baseAmount) : 0
          rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
          rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
          rate.sellRateInverse = rate.sellRateInverse
            ? formatNumberDecimal(rate.sellRateInverse)
            : 0
          rate.settlementAmount = rate.settlementAmount
            ? formatNumberDecimal(rate.settlementAmount)
            : 0
          rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
          return rate
        })
      }
      response.data.data.buyRates = buyRates
      return response.data.data
    },
  )
}

export function* getTransactionsById(values) {
  try {
    const response = yield call(getTxnById, values)
    yield put({
      type: actions.GET_CRYPTO_TRANSACTION_BY_ID_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CRYTXN_BY_CRYTXN_ID,
      value: response.id,
      token: values.token,
    })
    yield put({
      type: actions.GET_CRYTXN_RATE_BY_ID,
      value: response.id,
      token: values.token,
    })
  } catch (e) {
    yield put({
      type: actions.GET_CRYPTO_TRANSACTION_BY_ID_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateTxn = (value, token) => {
  const body = value
  return txnPrivateGet(`tx-service/crypto-transactions?${value.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* editTransaction(values) {
  try {
    const response = yield call(updateTxn, values.value, values.token)
    yield put({
      type: actions.UPDATE_CRYPTO_TRANSACTION_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.UPDATE_CRYPTO_TRANSACTION_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const cancelTxn = (value, token) => {
  const body = { transactionStatus: 'CANCELLED' }
  return txnPrivatePut(`tx-service/crypto-transactions/${value.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* cancelTransaction(values) {
  try {
    const response = yield call(cancelTxn, values.value, values.token)
    yield put({
      type: actions.CANCEL_CRYPTO_TRANSACTION_SUCCESS,
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
      type: actions.CANCEL_CRYPTO_TRANSACTION_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteTxn = (value, token) => {
  return txnPrivateDelete(`tx-service/crypto-transactions/${value.id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteTransaction(values) {
  try {
    const response = yield call(deleteTxn, values.value, values.token)
    yield put({
      type: actions.DELETE_CRYPTO_TRANSACTION_SUCCESS,
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
      type: actions.GET_ALL_CRYPTO_TRANSACTIONS,
      value: { page: 1 },
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_CRYPTO_TRANSACTION_FAILURE,
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
  return txnPrivatePost(`tx-service/crypto-transactions/bulk-delete`, body, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* bulkDeleteTransaction(values) {
  try {
    const response = yield call(bulkDeleteTxn, values.value, values.token)
    yield put({
      type: actions.BULK_DELETE_CRYPTO_TRANSACTION_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_ALL_CRYPTO_TRANSACTIONS,
      value: { page: 1 },
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.BULK_DELETE_CRYPTO_TRANSACTION_FAILURE,
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
  return txnPrivatePut(`tx-service/crypto-transactions/${values.id}`, body, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateSelectedBeneficiary(values) {
  try {
    const response = yield call(updateBene, values.value, values.token)
    yield put({
      type: actions.UPDATE_CRYPTO_SELECTED_BENEFICIARY_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_CRYPTO_SELECTED_BENEFICIARY_FAILURE,
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
  return txnPrivatePut(`tx-service/crypto-transactions/${value.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateTxnVendor(values) {
  try {
    const response = yield call(updateVendor, values.value, values.token)
    yield put({
      type: actions.UPDATE_CRYPTO_SELECTED_VENDOR_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_CRYPTO_SELECTED_VENDOR_FAILURE,
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
  return txnPrivatePut(`tx-service/crypto-transactions/${values.id}`, body, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateAccountRequestedDate(values) {
  try {
    const response = yield call(updateAccRequestedDate, values.value, values.token)
    yield put({
      type: actions.CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE_FAILURE,
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
  return txnPrivatePut(`tx-service/crypto-transactions/${values.id}`, body, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateAccountReceivedDate(values) {
  try {
    const response = yield call(updateAccReceivedDate, values.value, values.token)
    yield put({
      type: actions.CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE_FAILURE,
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
    totalDepositAmount: values.totalDepositAmount,
  }
  return txnPrivatePut(
    `tx-service/crypto-transactions/${values.cryptoTransactionId}`,
    body,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* updateTransactionAmount(values) {
  try {
    const response = yield call(updateTxnAmount, values.value, values.token)
    yield put({
      type: actions.UPDATE_CRYPTO_TRANSACTION_AMOUNT_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_CRYPTO_TRANSACTION_AMOUNT_FAILURE,
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
    totalDepositAmount: values.totalDepositAmount,
    depositsInPersonalAccount: values.depositsInPersonalAccount,
    depositsInCorporateAccount: values.depositsInCorporateAccount,
  }
  return txnPrivatePut(
    `tx-service/crypto-transactions/${values.cryptoTransactionId}`,
    body,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* confirmReceivedAmountAndDate(values) {
  try {
    const response = yield call(confirmReceivedDeposit, values.value, values.token)
    yield put({
      type: actions.CONFIRM_RECEIVED_CRYPTO_AMOUNT_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CONFIRM_RECEIVED_CRYPTO_AMOUNT_FAILURE,
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
  return txnPrivatePut(`tx-service/crypto-transactions/${values.transactionId}`, body, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* confirmRemittedAmountAndDate(values) {
  try {
    const response = yield call(confirmRemittedFunds, values.value, values.token)
    yield put({
      type: actions.CONFIRM_CRYPTO_REMITED_FUNDS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CONFIRM_CRYPTO_REMITED_FUNDS_FAILURE,
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
      type: actions.GET_CRYPTO_BUY_RATE_SUCCESS,
      value: response,
    })
  } catch (err) {
    NProgress.done()
    yield put({
      type: actions.GET_CRYPTO_BUY_RATE_FAILURE,
      value: err,
    })
    if (err.response.data.message.constructor === Object) {
      notification.error({
        message: err.response.data.message.title,
      })
    } else {
      notification.error({
        message: err.response.data.message || globalMessages.errorMessage,
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
      type: actions.GET_FX_BASE_RATE_BY_CRYPTO_VENDOR_SUCCESS,
      value: response.fxBaseRates,
    })
  } catch (err) {
    yield put({
      type: actions.GET_FX_BASE_RATE_BY_CRYPTO_VENDOR_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateValues = (values, id, token) => {
  return txnPrivatePut(`tx-service/crypto-transactions/${id}`, values, token).then(response => {
    return response.data.data
  })
}

export function* updateTxnValues(values) {
  try {
    const response = yield call(updateValues, values.value, values.txnId, values.token)
    yield put({
      type: actions.UPDATE_CRYPTO_TRANSACTION_VALUES_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_CRYPTO_TRANSACTION_VALUES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getTxnFeesById = (transactionId, token) => {
  return txnPrivateGet(`tx-service/crypto-fees?cryptoTransactionId=${transactionId}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getTxnFeesByTxnId(values) {
  try {
    const response = yield call(getTxnFeesById, values.value, values.token)
    yield put({
      type: actions.GET_CRYTXN_BY_CRYTXN_ID_SUCCESS,
      value: response.cryptoFees,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CRYTXN_BY_CRYTXN_ID_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getTxnRatesById = (transactionId, token) => {
  return txnPrivateGet(`tx-service/crypto-rates?cryptoTransactionId=${transactionId}`, token).then(
    response => {
      let { cryptoRates } = response.data.data
      if (cryptoRates.length !== 0) {
        cryptoRates = cryptoRates.map(rate => {
          rate.baseAmount = rate.baseAmount ? formatNumberDecimal(rate.baseAmount) : 0
          rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
          rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
          rate.sellRateInverse = rate.sellRateInverse
            ? formatNumberDecimal(rate.sellRateInverse)
            : 0
          rate.settlementAmount = rate.settlementAmount
            ? formatNumberDecimal(rate.settlementAmount)
            : 0
          rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
          return rate
        })
      }
      response.data.data.cryptoRates = cryptoRates
      return response.data.data
    },
  )
}

export function* getTxnRatesByTxnId(values) {
  try {
    const response = yield call(getTxnRatesById, values.value, values.token)
    yield put({
      type: actions.GET_CRYTXN_RATE_BY_ID_SUCCESS,
      value: response.cryptoRates,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CRYTXN_RATE_BY_ID_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const createFees = (values, token) => {
  return txnPrivatePost(`tx-service/crypto-fees`, values, token).then(response => {
    return response.data.data
  })
}

export function* createTxnFees(values) {
  try {
    const response = yield call(createFees, values.value, values.token)
    yield put({
      type: actions.CREATE_CRYPTO_TXN_FEES_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_CRYPTO_TXN_FEES_FAILURE,
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
  //   baseCurrency: values.depositCurrency,
  //   baseAmount: values.baseAmount,
  //   tradeAmount: values.totalDepositAmount,
  //   targetCurrency: values.targetCurrency,
  //   settlementAmount: values.settlementAmount,
  //   targetAmount: values.targetAmount,
  //   inverseAmount: values.inverseAmount,
  //   sellRate: values.sellRate,
  //   quoteStatus: values.quoteStatus || 'new',
  //   isIndicative: values.isIndicative || false,
  //   rateAppliedAt: new Date(),
  // }
  return txnPrivatePost(`tx-service/crypto-rates`, values, token).then(response => {
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
    const response = yield call(createRates, _.omit(values.value, 'tradeId'), values.token)
    yield put({
      type: actions.CREATE_CRYPTO_TXN_RATES_SUCCESS,
      value: response,
    })
    yield call(triggerTradeFetchCall, values.value, values.token)
  } catch (err) {
    yield put({
      type: actions.CREATE_CRYPTO_TXN_RATES_FAILURE,
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

export function* getDepositSlipsByTransactionIdOTC(values) {
  try {
    const response = yield call(getAllDepositSlips, values.value, values.token)
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_OTC,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_OTC,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export function* getDepositSlipsByTransactionIdLequidate(values) {
  try {
    const response = yield call(getAllDepositSlips, values.value, values.token)
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_LIQUIDATE,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_LIQUIDATE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export function* getDepositSlipsByTransactionIdCwallet(values) {
  try {
    const response = yield call(getAllDepositSlips, values.value, values.token)
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_CWALLET,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_CWALLET,
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
  return txnPrivatePut(`tx-service/crypto-transactions/${transactionId}`, body, token).then(
    response => {
      return response.data.data
    },
  )
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
      type: actions.UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION_FAILURE,
      value: err,
    })
    notification.error({
      message: 'warning',
      description: 'Failed to update local accounts',
    })
  }
}

const getBankAccountByvendorId = (values, token) => {
  const vendorId = values.vendorId ? `?vendorId=${values.vendorId}` : ''
  const accountStatus = values.accountStatus ? `&accountStatus=${values.accountStatus}` : ''
  const limit = '&limit=0'
  return txnPrivateGet(`tx-service/bank-accounts${vendorId}${accountStatus}${limit}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getAllBankAccounts(values) {
  try {
    const response = yield call(getBankAccountByvendorId, values.values, values.token)
    yield put({
      type: actions.GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR_SUCCESS,
      value: response.bankAccount,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR_FAILURE,
      value: err,
    })
  }
}

const updateSenderAddress = (values, token) => {
  const body = {
    recipientBitAddress: values.receipientBitAddress,
    tradeId: values.tradeId,
  }
  return txnPrivatePut(
    `tx-service/crypto-transactions/${values.cryptoTransactionId}`,
    body,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* updateSelectedSenderAddress(values) {
  try {
    const response = yield call(updateSenderAddress, values.value, values.token)
    yield put({
      type: actions.UPDATE_SENDER_ADDRESS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_SENDER_ADDRESS_FAILURE,
      value: err,
    })
  }
}

const updateReceiverHash = (values, token) => {
  const body = {
    transactionHash: values.transactionHash,
    tradeId: values.tradeId,
  }
  return txnPrivatePut(
    `tx-service/crypto-transactions/${values.cryptoTransactionId}`,
    body,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* updateTransactionHash(values) {
  try {
    const response = yield call(updateReceiverHash, values.value, values.token)
    yield put({
      type: actions.UPDATE_RECEIVER_HASH_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_RECEIVER_HASH_FAILURE,
      value: err,
    })
  }
}

const manualFeesCreation = (values, token) => {
  return txnPrivatePost(`tx-service/crypto-fees`, values, token).then(response => {
    return response.data.data
  })
}

export function* createManualFees(values) {
  try {
    const response = yield call(manualFeesCreation, values.value, values.token)
    yield put({
      type: actions.CREATE_CRYPTO_MANUAL_FEES_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_CRYPTO_MANUAL_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const manualRateCreation = (values, token) => {
  return txnPrivatePost(`tx-service/crypto-rates`, values, token).then(response => {
    return response.data.data
  })
}

export function* createManualRate(values) {
  try {
    const response = yield call(manualRateCreation, values.value, values.token)
    yield put({
      type: actions.CREATE_CRYPTO_MANUAL_RATE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_CRYPTO_MANUAL_FEES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateSellRate = (values, tradeId, token) => {
  if (tradeId) values.tradeId = tradeId

  return txnPrivatePut(`tx-service/crypto-rates/${values.id}`, values, token).then(response => {
    return response.data.data
  })
}

export function* updateTradeSellRate(values) {
  try {
    const response = yield call(
      updateSellRate,
      values.value.payload,
      values.value.tradeId,
      values.value.token,
    )
    yield put({
      type: actions.UPDATE_CRYPTO_RATE_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CRYTXN_RATE_BY_ID,
      value: values.value.payload.cryptoTransactionId,
      token: values.value.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_CRYPTO_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateCryptofees = (values, tradeId, token) => {
  return txnPrivatePut(`tx-service/crypto-fees/${values.id}`, values, token).then(response => {
    return response.data.data
  })
}

export function* updateCryptoFees(values) {
  try {
    const response = yield call(updateCryptofees, values.value, values.tradeId, values.token)
    yield put({
      type: actions.UPDATE_CRYPTO_FEES_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CRYTXN_BY_CRYTXN_ID,
      value: values.value.cryptoTransactionId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_CRYPTO_FEES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteCryptoFee = (id, token) => {
  return txnPrivateDelete(`tx-service/crypto-fees/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteCryptoFees(values) {
  try {
    const response = yield call(deleteCryptoFee, values.values.feesId, values.token)
    yield put({
      type: actions.DELETE_CRYPTO_FEES_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CRYTXN_BY_CRYTXN_ID,
      value: values.values.cryptoTransactionId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_CRYPTO_FEES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteCryptoRate = (id, token) => {
  return txnPrivateDelete(`tx-service/crypto-rates/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteCryptoRates(values) {
  try {
    const response = yield call(deleteCryptoRate, values.values.sellRateId, values.token)
    yield put({
      type: actions.DELETE_CRYPTO_RATE_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CRYTXN_RATE_BY_ID,
      value: values.values.cryptoTransactionId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_CRYPTO_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
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
      type: actions.HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION_SUCCESS,
      value: res,
    })
  } catch (err) {
    yield put({
      type: actions.HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION_FAILURE,
      value: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    // Fee Calc
    takeLatest(actions.HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION, handleFeeCalc),
    takeLatest(actions.GET_ALL_CRYPTO_TRANSACTIONS, getAllTransactions),
    takeLatest(actions.CREATE_CRYPTO_TRANSACTION, createNewTransaction),
    takeLatest(actions.GET_CRYPTO_TRANSACTION_BY_CLIENT_ID, getTransactionsByClientId),
    takeLatest(actions.GET_CRYPTO_TRANSACTION_BY_ID, getTransactionsById),
    takeLatest(actions.UPDATE_CRYPTO_TRANSACTION, editTransaction),
    takeLatest(actions.CANCEL_CRYPTO_TRANSACTION, cancelTransaction),
    takeLatest(actions.DELETE_CRYPTO_TRANSACTION, deleteTransaction),
    takeLatest(actions.BULK_DELETE_CRYPTO_TRANSACTION, bulkDeleteTransaction),
    takeLatest(actions.UPDATE_CRYPTO_SELECTED_BENEFICIARY, updateSelectedBeneficiary),
    takeLatest(actions.UPDATE_CRYPTO_SELECTED_VENDOR, updateTxnVendor),
    takeLatest(actions.CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE, updateAccountRequestedDate),
    takeLatest(actions.CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE, updateAccountReceivedDate),
    takeLatest(actions.UPDATE_CRYPTO_TRANSACTION_AMOUNT, updateTransactionAmount),
    takeLatest(actions.CONFIRM_RECEIVED_CRYPTO_AMOUNT, confirmReceivedAmountAndDate),
    takeLatest(actions.CONFIRM_CRYPTO_REMITED_FUNDS, confirmRemittedAmountAndDate),
    takeLatest(actions.GET_CRYPTO_BUY_RATE, getCalculatedRate),
    takeLatest(actions.GET_FX_BASE_RATE_BY_CRYPTO_VENDOR, getFxRateByVendor),
    takeLatest(actions.UPDATE_CRYPTO_TRANSACTION_VALUES, updateTxnValues),
    takeLatest(actions.GET_CRYTXN_BY_CRYTXN_ID, getTxnFeesByTxnId),
    takeLatest(actions.GET_CRYTXN_RATE_BY_ID, getTxnRatesByTxnId),
    takeLatest(actions.CREATE_CRYPTO_TXN_FEES, createTxnFees),
    takeLatest(actions.CREATE_CRYPTO_TXN_RATES, createTxnRates),
    takeLatest(actions.CREATE_CRYPTO_MANUAL_FEES, createManualFees),
    takeLatest(actions.CREATE_CRYPTO_MANUAL_RATE, createManualRate),
    takeLatest(actions.UPDATE_RECEIVER_HASH, updateTransactionHash),
    takeLatest(actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_OTC, getDepositSlipsByTransactionIdOTC),
    takeLatest(
      actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_LIQUIDATE,
      getDepositSlipsByTransactionIdLequidate,
    ),
    takeLatest(actions.UPDATE_CRYPTO_FEES, updateCryptoFees),
    takeLatest(actions.UPDATE_CRYPTO_RATE, updateTradeSellRate),
    takeLatest(actions.DELETE_CRYPTO_FEES, deleteCryptoFees),
    takeLatest(actions.DELETE_CRYPTO_RATE, deleteCryptoRates),
    takeLatest(
      actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_CWALLET,
      getDepositSlipsByTransactionIdCwallet,
    ),
    takeLatest(actions.FETCH_BANK_ACCOUNTS, getBankAccountsByVendorId),
    // local deposits
    takeLatest(actions.UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION, updateAccountstoTransaction),
    takeLatest(actions.GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR, getAllBankAccounts),
    takeLatest(actions.UPDATE_SENDER_ADDRESS, updateSelectedSenderAddress),
    takeLatest(actions.DELETE_SELECTED_ACCOUNT, deleteSelectedBankAccount),
  ])
}
