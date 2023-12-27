import { all, takeEvery, put, call } from 'redux-saga/effects'

import axiosMethod from '../../../utilities/apiCaller'

import actions from './actions'

const { txnPrivateGet } = axiosMethod

const getCustomerReports = value => {
  const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit = value.limit ? encodeURI(`&limit=${value.limit}`) : ''
  const customerName = value.customerName ? encodeURI(`&clientId=${value.customerName}`) : ''
  const tradeReference = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  const dateAndTimeOfRequest = value.dateAndTimeOfRequest
    ? encodeURI(`&dateAndTimeOfRequest=${value.dateAndTimeOfRequest}`)
    : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const depositAmount = value.depositAmount
    ? encodeURI(`&totalDepositAmount=${value.depositAmount}`)
    : ''
  const dateAndTimeLocalAccountsProvided = value.dateAndTimeLocalAccountsProvided
    ? encodeURI(`&dateAndTimeLocalAccountsProvided=${value.dateAndTimeLocalAccountsProvided}`)
    : ''
  const depositConfirmedByClientAt = value.depositConfirmedByClientAt
    ? encodeURI(`&depositConfirmedByClientAt=${value.depositConfirmedByClientAt}`)
    : ''
  const dateAndTimeSwappedFundsRemitted = value.dateAndTimeSwappedFundsRemitted
    ? encodeURI(`&dateAndTimeSwappedFundsRemitted=${value.dateAndTimeSwappedFundsRemitted}`)
    : ''
  const destinationCurrency = value.destinationCurrency
    ? encodeURI(`&settlementCurrency=${value.destinationCurrency}`)
    : ''
  const remittedAmountDestinationCurrency = value.remittedAmount
    ? encodeURI(`&settlementAmount=${value.remittedAmount}`)
    : ''
  const dateAndTimeFundsRemittedToClientAccount = value.dateAndTimeFundsRemittedToClientAccount
    ? encodeURI(
        `&dateAndTimeFundsRemittedToClientAccount=${value.dateAndTimeFundsRemittedToClientAccount}`,
      )
    : ''
  const pcRateApplied = value.pcRateApplied
    ? encodeURI(`&pcRateApplied=${value.pcRateApplied}`)
    : ''
  const timeTakenToMakeTransferInDays = value.timeTakenToMakeTransferInDays
    ? encodeURI(`&timeTakenToMakeTransferInDays=${value.timeTakenToMakeTransferInDays}`)
    : ''
  const dayFromString = value.dateFrom ? encodeURI(`&dateFrom=${value.dateFrom}`) : ''
  const dayToString = value.dateTo ? encodeURI(`&dateTo=${value.dateTo}`) : ''
  const status = value.status ? encodeURI(`&tradeStatus=${value.status}`) : ''
  const dateFilterBy =
    value.dateFrom || value.dateTo ? encodeURI('&dateFilterBy=progressLogs.tradeRequestedAt') : ''
  const orderBy = encodeURI('?orderBy=progressLogs.tradeRequestedAt')

  return txnPrivateGet(
    `tx-service/trade-client-report${orderBy}${page}${limit}${customerName}${tradeReference}${dateAndTimeOfRequest}${depositCurrency}${depositAmount}${dateAndTimeLocalAccountsProvided}${depositConfirmedByClientAt}${dateAndTimeSwappedFundsRemitted}${destinationCurrency}${remittedAmountDestinationCurrency}${dateAndTimeFundsRemittedToClientAccount}${pcRateApplied}${timeTakenToMakeTransferInDays}${dayFromString}${dayToString}${status}${dateFilterBy}`,
    value.token,
  ).then(response => {
    return response.data.data
  })
}

export function* getCustomerReport(value) {
  const { values } = value
  try {
    const response = yield call(getCustomerReports, values)
    yield put({
      type: actions.GET_CUSTOMER_REPORT_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CUSTOMER_REPORT_FAILURE,
      payload: err,
    })
  }
}

const getCustomerReportDownloads = value => {
  // const querySymbol = value.page || value.limit ? '?' : ''
  // const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit = value.limit ? encodeURI(`?limit=${value.limit}`) : encodeURI(`?limit=0`)
  const customerName = value.customerName ? encodeURI(`&clientId=${value.customerName}`) : ''
  const tradeReference = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  const dateAndTimeOfRequest = value.dateAndTimeOfRequest
    ? encodeURI(`&dateAndTimeOfRequest=${value.dateAndTimeOfRequest}`)
    : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const depositAmount = value.depositAmount
    ? encodeURI(`&totalDepositAmount=${value.depositAmount}`)
    : ''
  const dateAndTimeLocalAccountsProvided = value.dateAndTimeLocalAccountsProvided
    ? encodeURI(`&dateAndTimeLocalAccountsProvided=${value.dateAndTimeLocalAccountsProvided}`)
    : ''
  const depositConfirmedByClientAt = value.depositConfirmedByClientAt
    ? encodeURI(`&depositConfirmedByClientAt=${value.depositConfirmedByClientAt}`)
    : ''
  const dateAndTimeSwappedFundsRemitted = value.dateAndTimeSwappedFundsRemitted
    ? encodeURI(`&dateAndTimeSwappedFundsRemitted=${value.dateAndTimeSwappedFundsRemitted}`)
    : ''
  const destinationCurrency = value.destinationCurrency
    ? encodeURI(`&settlementCurrency=${value.destinationCurrency}`)
    : ''
  const remittedAmountDestinationCurrency = value.remittedAmountDestinationCurrency
    ? encodeURI(`&settlementAmount=${value.remittedAmountDestinationCurrency}`)
    : ''
  const dateAndTimeFundsRemittedToClientAccount = value.dateAndTimeFundsRemittedToClientAccount
    ? encodeURI(
        `&dateAndTimeFundsRemittedToClientAccount=${value.dateAndTimeFundsRemittedToClientAccount}`,
      )
    : ''
  const pcRateApplied = value.pcRateApplied
    ? encodeURI(`&pcRateApplied=${value.pcRateApplied}`)
    : ''
  const timeTakenToMakeTransferInDays = value.timeTakenToMakeTransferInDays
    ? encodeURI(`&timeTakenToMakeTransferInDays=${value.timeTakenToMakeTransferInDays}`)
    : ''
  const dayFromString = value.dateFrom ? encodeURI(`&dateFrom=${value.dateFrom}`) : ''
  const dayToString = value.dateTo ? encodeURI(`&dateTo=${value.dateTo}`) : ''
  const status = value.status ? encodeURI(`&tradeStatus=${value.status}`) : ''
  const dateFilterBy =
    value.dateFrom || value.dateTo ? encodeURI('&dateFilterBy=progressLogs.tradeRequestedAt') : ''
  // const orderBy = encodeURI('?orderBy=progressLogs.tradeRequestedAt')

  return txnPrivateGet(
    `tx-service/trade-client-report${limit}${customerName}${tradeReference}${dateAndTimeOfRequest}${depositCurrency}${depositAmount}${dateAndTimeLocalAccountsProvided}${depositConfirmedByClientAt}${dateAndTimeSwappedFundsRemitted}${destinationCurrency}${remittedAmountDestinationCurrency}${dateAndTimeFundsRemittedToClientAccount}${pcRateApplied}${timeTakenToMakeTransferInDays}${dayFromString}${dayToString}${status}${dateFilterBy}`,
    value.token,
  ).then(response => {
    return response.data.data
  })
}

export function* getCustomerReportDownload(value) {
  const { values } = value
  try {
    const response = yield call(getCustomerReportDownloads, values)
    yield put({
      type: actions.GET_CUSTOMER_REPORT_BULK_DOWNLOAD_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CUSTOMER_REPORT_BULK_DOWNLOAD_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CUSTOMER_REPORT, getCustomerReport),
    takeEvery(actions.GET_CUSTOMER_REPORT_BULK_DOWNLOAD, getCustomerReportDownload),
  ])
}
