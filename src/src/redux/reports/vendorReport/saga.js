import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'

import axiosMethod from '../../../utilities/apiCaller'
import Variables from '../../../utilities/variables'

import actions from './actions'

const { reportsPrivateGet } = axiosMethod
const { globalMessages } = Variables

const getallVendorReport = (value, token) => {
  const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit =
    value.limit !== undefined ? encodeURI(`&limit=${value.limit}`) : encodeURI(`&limit=10`)
  const clientId = value.customerName ? encodeURI(`&clientId=${value.customerName}`) : ''
  const vendorId = value.vendorId ? encodeURI(`&vendorId=${value.vendorId}`) : ''
  const tradeReference = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  const dateOfDeposit = value.dateOfDeposit
    ? encodeURI(`&fundReceiptConfirmDateByClient=${value.dateOfDeposit}`)
    : ''
  const vendorName = value.vendorName ? encodeURI(`&vendorName=${value.vendorName}`) : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const depositAmountLocal = value.depositAmountLocal
    ? encodeURI(`&totalDepositAmount=${value.depositAmountLocal}`)
    : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const settlementAmount = value.settlementAmount
    ? encodeURI(`&settlementAmount=${value.settlementAmount}`)
    : ''

  let dayFromString = ''
  let dayToString = ''
  if (value.dateFromOfInitiate || value.dateToOfInitiate) {
    dayFromString = value.dateFromOfInitiate
      ? encodeURI(`&dateFrom=${value.dateFromOfInitiate}`)
      : ''
    dayToString = value.dateToOfInitiate ? encodeURI(`&dateTo=${value.dateToOfInitiate}`) : ''
  }
  if (value.dateFromOfDeposit || value.dateToOfDeposit) {
    dayFromString = value.dateFromOfDeposit ? encodeURI(`&dateFrom=${value.dateFromOfDeposit}`) : ''
    dayToString = value.dateToOfDeposit ? encodeURI(`&dateTo=${value.dateToOfDeposit}`) : ''
  }

  const tradeStatus = value.tradeStatus ? encodeURI(`&tradeStatus=${value.tradeStatus}`) : ''
  let dateFilterBy = ''
  if (value.dateFromOfInitiate || value.dateToOfInitiate) {
    dateFilterBy = encodeURI('&dateFilterBy=progressLogs.tradeRequestedAt')
  }
  if (value.dateFromOfDeposit || value.dateToOfDeposit) {
    dateFilterBy = encodeURI('&dateFilterBy=progressLogs.depositConfirmedByClientAt')
  }
  const orderBy = encodeURI('?orderBy=progressLogs.depositConfirmedByClientAt')
  return reportsPrivateGet(
    `vendor-report${orderBy}${page}${limit}${tradeReference}${dateOfDeposit}${clientId}${vendorId}${vendorName}${depositCurrency}${depositAmountLocal}${settlementCurrency}${settlementAmount}${dayFromString}${dayToString}${tradeStatus}${dateFilterBy}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getVendorReportList(values) {
  try {
    const response = yield call(getallVendorReport, values.value, values.value.token)
    yield put({
      type: actions.GET_VENDOR_REPORT_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_VENDOR_REPORT_FAILURE,
      value: e,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getVendorReportDownload = (value, token) => {
  const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit = value.limit !== undefined ? encodeURI(`&limit=${value.limit}`) : ''
  const clientId = value.customerName ? encodeURI(`&clientId=${value.customerName}`) : ''
  const vendorId = value.vendorId ? encodeURI(`&vendorId=${value.vendorId}`) : ''
  const tradeReference = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  const dateOfDeposit = value.dateOfDeposit
    ? encodeURI(`&fundReceiptConfirmDateByClient=${value.dateOfDeposit}`)
    : ''
  const vendorName = value.vendorName ? encodeURI(`&vendorName=${value.vendorName}`) : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const depositAmountLocal = value.depositAmountLocal
    ? encodeURI(`&totalDepositAmount=${value.depositAmountLocal}`)
    : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const settlementAmount = value.settlementAmount
    ? encodeURI(`&settlementAmount=${value.settlementAmount}`)
    : ''

  let dayFromString = ''
  let dayToString = ''
  if (value.dateFromOfInitiate || value.dateToOfInitiate) {
    dayFromString = value.dateFromOfInitiate
      ? encodeURI(`&dateFrom=${value.dateFromOfInitiate}`)
      : ''
    dayToString = value.dateToOfInitiate ? encodeURI(`&dateTo=${value.dateToOfInitiate}`) : ''
  }
  if (value.dateFromOfDeposit || value.dateToOfDeposit) {
    dayFromString = value.dateFromOfDeposit ? encodeURI(`&dateFrom=${value.dateFromOfDeposit}`) : ''
    dayToString = value.dateToOfDeposit ? encodeURI(`&dateTo=${value.dateToOfDeposit}`) : ''
  }

  const tradeStatus = value.tradeStatus ? encodeURI(`&tradeStatus=${value.tradeStatus}`) : ''
  let dateFilterBy = ''
  if (value.dateFromOfInitiate || value.dateToOfInitiate) {
    dateFilterBy = encodeURI('&dateFilterBy=progressLogs.tradeRequestedAt')
  }
  if (value.dateFromOfDeposit || value.dateToOfDeposit) {
    dateFilterBy = encodeURI('&dateFilterBy=progressLogs.depositConfirmedByClientAt')
  }
  const orderBy = encodeURI('?orderBy=progressLogs.depositConfirmedByClientAt')
  return reportsPrivateGet(
    `vendor-report${orderBy}${page}${limit}${tradeReference}${dateOfDeposit}${clientId}${vendorId}${vendorName}${depositCurrency}${depositAmountLocal}${settlementCurrency}${settlementAmount}${dayFromString}${dayToString}${tradeStatus}${dateFilterBy}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getVendorReportBulkDownload(values) {
  try {
    const response = yield call(getVendorReportDownload, values.value, values.token)
    yield put({
      type: actions.GET_VENDOR_REPORT_BULK_DOWNLOAD_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_VENDOR_REPORT_BULK_DOWNLOAD_FAILURE,
      value: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_VENDOR_REPORT, getVendorReportList),
    takeEvery(actions.GET_VENDOR_REPORT_BULK_DOWNLOAD, getVendorReportBulkDownload),
  ])
}
