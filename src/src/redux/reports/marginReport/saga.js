import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'

import axiosMethod from '../../../utilities/apiCaller'
import Variables from '../../../utilities/variables'

import actions from './actions'

const { reportsPrivateGet } = axiosMethod
const { globalMessages } = Variables

const getallMarginReport = (value, token) => {
  const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit = value.limit ? encodeURI(`&limit=${value.limit}`) : ''
  const clientId = value.customerName ? encodeURI(`&clientId=${value.customerName}`) : ''
  const tradeReference = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const depositAmountLocal = value.depositAmountLocal
    ? encodeURI(`&totalDepositAmount=${value.depositAmountLocal}`)
    : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const tradeStatus = value.tradeStatus ? encodeURI(`&tradeStatus=${value.tradeStatus}`) : ''
  const dayFromString = value.dateFrom ? encodeURI(`&dateFrom=${value.dateFrom}`) : ''
  const dayToString = value.dateTo ? encodeURI(`&dateTo=${value.dateTo}`) : ''
  const dateFilterBy =
    value.dateFrom || value.dateTo
      ? encodeURI('&dateFilterBy=progressLogs.depositConfirmedByClientAt')
      : ''
  const orderBy = encodeURI('?orderBy=progressLogs.depositConfirmedByClientAt')
  return reportsPrivateGet(
    `margin-report${orderBy}${page}${limit}${tradeReference}${clientId}${depositCurrency}${settlementCurrency}${depositAmountLocal}${tradeStatus}${dayFromString}${dayToString}${dateFilterBy}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getMarginReportList(values) {
  try {
    const response = yield call(getallMarginReport, values.value, values.token)
    yield put({
      type: actions.GET_MARGIN_REPORT_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_MARGIN_REPORT_FAILURE,
      value: e,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getMarginReportDownload = (value, token) => {
  const limit = value.limit ? encodeURI(`&limit=${value.limit}`) : encodeURI(`&limit=0`)
  const clientId = value.clientId ? encodeURI(`&clientId=${value.clientId}`) : ''
  const tradeReference = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const depositAmountLocal = value.depositAmountLocal
    ? encodeURI(`&totalDepositAmount=${value.depositAmountLocal}`)
    : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const tradeStatus = value.tradeStatus ? encodeURI(`&tradeStatus=${value.tradeStatus}`) : ''
  const dayFromString = value.dateFrom ? encodeURI(`&dateFrom=${value.dateFrom}`) : ''
  const dayToString = value.dateTo ? encodeURI(`&dateTo=${value.dateTo}`) : ''
  const dateFilterBy =
    value.dateFrom || value.dateTo
      ? encodeURI('&dateFilterBy=progressLogs.depositConfirmedByClientAt')
      : ''
  const orderBy = encodeURI('?orderBy=progressLogs.depositConfirmedByClientAt')
  return reportsPrivateGet(
    `margin-report${orderBy}${limit}${tradeReference}${clientId}${depositCurrency}${settlementCurrency}${depositAmountLocal}${tradeStatus}${dayFromString}${dayToString}${dateFilterBy}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getMarginReportBulkDownload(values) {
  try {
    const response = yield call(getMarginReportDownload, values.value, values.token)
    yield put({
      type: actions.GET_MARGIN_REPORT_BULK_DOWNLOAD_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_MARGIN_REPORT_BULK_DOWNLOAD_FAILURE,
      value: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_MARGIN_REPORT, getMarginReportList),
    takeEvery(actions.GET_MARGIN_REPORT_BULK_DOWNLOAD, getMarginReportBulkDownload),
  ])
}
