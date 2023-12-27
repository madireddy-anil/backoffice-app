import { all, takeEvery, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'

import axiosMethod from 'utilities/apiCaller'
import Variables from 'utilities/variables'

import actions from './actions'

const { txnPrivateGet, txnPrivateDelete, txnPrivatePost } = axiosMethod
const { globalMessages } = Variables

const reStructureIfCrypto = responseData => {
  const data = responseData.trades
  const newResponse = []
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].cryptoBeneficiary) {
      data[i].beneficiary = {
        bankAccountDetails: {
          nameOnAccount: data[i].cryptoBeneficiary.aliasName,
        },
      }
      newResponse.push(data[i])
    } else {
      newResponse.push(data[i])
    }
  }
  return {
    trades: newResponse,
    total: responseData.total,
  }
}

const getallTrades = (value, token) => {
  const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit = value.limit ? encodeURI(`&limit=${value.limit}`) : ''
  const clientId = value.clientId ? encodeURI(`&clientId=${value.clientId}`) : ''
  const clientName = value.clientName ? encodeURI(`&clientName=${value.clientName}`) : ''
  const tradeReference = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  const fiatBeneficiaryId = value.fiatBeneficiaryId
    ? encodeURI(`&beneficiary.id=${value.fiatBeneficiaryId}`)
    : ''
  const cryptoBeneficiaryId = value.cryptoBeneficiaryId
    ? encodeURI(`&cryptoBeneficiary.id=${value.cryptoBeneficiaryId}`)
    : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const totalDepositAmount = value.totalDepositAmount
    ? encodeURI(`&totalDepositAmount=${value.totalDepositAmount}`)
    : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const settlementAmount = value.settlementAmount
    ? encodeURI(`&settlementAmount=${value.settlementAmount}`)
    : ''
  const pageNumber = value.pageNumber ? value.pageNumber : ''
  const dayFromString = value.dateFrom ? encodeURI(`&dateFrom=${value.dateFrom}`) : ''
  const dayToString = value.dateTo ? encodeURI(`&dateTo=${value.dateTo}`) : ''
  const status = value.status ? encodeURI(`&tradeStatus=${value.status}`) : ''
  const orderBy = encodeURI('?orderBy=progressLogs.tradeRequestedAt')
  const dateFilterBy =
    value.dateFrom || value.dateTo ? encodeURI('&dateFilterBy=progressLogs.tradeRequestedAt') : ''
  return txnPrivateGet(
    `tx-service/trades${orderBy}${page}${limit}${clientId}${clientName}${pageNumber}${tradeReference}${fiatBeneficiaryId}${cryptoBeneficiaryId}${depositCurrency}${totalDepositAmount}${settlementCurrency}${settlementAmount}${dayFromString}${dayToString}${status}${dateFilterBy}`,
    token,
  ).then(response => {
    return reStructureIfCrypto(response.data.data)
  })
}

export function* getAllTradesList(values) {
  try {
    const response = yield call(getallTrades, values.value, values.token)
    yield put({
      type: actions.NP_GET_TRADES_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.NP_GET_TRADES_FAILURE,
      value: e,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteTde = (value, token) => {
  return txnPrivateDelete(`tx-service/trades/${value}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteTrade(values) {
  try {
    const response = yield call(deleteTde, values.value, values.token)
    yield put({
      type: actions.NP_DELETE_TRADE_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.NP_GET_TRADES,
      value: '',
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.NP_DELETE_TRADE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const bulkDeleteTdes = (value, token) => {
  const body = { tradeIDs: value }
  return txnPrivatePost(`tx-service/trades/bulk-delete`, body, token).then(response => {
    return response.data.data
  })
}

export function* bulkDeleteTrades(values) {
  try {
    const response = yield call(bulkDeleteTdes, values.value, values.token)
    yield put({
      type: actions.NP_BULK_DELETE_TRADES_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.NP_GET_TRADES,
      value: { page: 1 },
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.NP_BULK_DELETE_TRADES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getAllTradesDownload = (value, token) => {
  const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit = value.limit ? encodeURI(`&limit=${value.limit}`) : encodeURI(`&limit=0`)
  const clientId = value.clientId ? encodeURI(`&clientId=${value.clientId}`) : ''
  const clientName = value.clientName ? encodeURI(`&clientName=${value.clientName}`) : ''
  const tradeReference = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  const nameOnAccount = value.nameOnAccount
    ? encodeURI(`&beneficiary.bankAccountDetails.nameOnAccount=${value.nameOnAccount}`)
    : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const totalDepositAmount = value.totalDepositAmount
    ? encodeURI(`&totalDepositAmount=${value.totalDepositAmount}`)
    : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const settlementAmount = value.settlementAmount
    ? encodeURI(`&settlementAmount=${value.settlementAmount}`)
    : ''
  const pageNumber = value.pageNumber ? value.pageNumber : ''
  const dayFromString = value.dateFrom ? encodeURI(`&dateFrom=${value.dateFrom}`) : ''
  const dayToString = value.dateTo ? encodeURI(`&dateTo=${value.dateTo}`) : ''
  const status = value.status ? encodeURI(`&tradeStatus=${value.status}`) : ''
  const orderBy = encodeURI('?orderBy=progressLogs.tradeRequestedAt')
  const dateFilterBy =
    value.dateFrom || value.dateTo ? encodeURI('&dateFilterBy=progressLogs.tradeRequestedAt') : ''
  return txnPrivateGet(
    `tx-service/trades${orderBy}${page}${limit}${clientId}${clientName}${pageNumber}${tradeReference}${nameOnAccount}${depositCurrency}${totalDepositAmount}${settlementCurrency}${settlementAmount}${dayFromString}${dayToString}${status}${dateFilterBy}`,
    token,
  ).then(response => {
    return reStructureIfCrypto(response.data.data)
  })
}

export function* getTradesBulkDownload(values) {
  try {
    const response = yield call(getAllTradesDownload, values.value, values.token)
    yield put({
      type: actions.NP_GET_TRADES_BULK_DOWNLOAD_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.NP_GET_TRADES_BULK_DOWNLOAD_FAILURE,
      value: e,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.NP_DELETE_TRADE, deleteTrade),
    takeEvery(actions.NP_GET_TRADES, getAllTradesList),
    takeLatest(actions.NP_BULK_DELETE_TRADES, bulkDeleteTrades),
    takeLatest(actions.NP_GET_TRADES_BULK_DOWNLOAD, getTradesBulkDownload),
  ])
}
