import { all, takeEvery, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'

import axiosMethod from 'utilities/apiCaller'
import Variables from 'utilities/variables'

import actions from './actions'
import tradeAction from '../tradeDetails/actions'

const { txnPrivateGet, txnPrivatePut, txnPrivateDelete, txnPrivatePost } = axiosMethod
const { globalMessages } = Variables

const getRoutes = (value, token) => {
  const queryIdParams =
    value.page ||
    value.limit ||
    value.clientId ||
    value.depositCurrency ||
    value.settlementCurrency ||
    value.allSequenceComplete ||
    value.sequence ||
    value.totalDepositAmount ||
    value.routeReference ||
    value.status
      ? '?'
      : ''
  const page = value.page ? encodeURI(`page=${value.page}`) : ''
  const limit = value.limit ? encodeURI(`&limit=${value.limit}`) : ''
  const clientId = value.clientId ? encodeURI(`&clientId=${value.clientId}`) : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const status = value.status ? encodeURI(`&routeStatus=${value.status}`) : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const sequence = value.sequence ? encodeURI(`&sequence=${value.sequence}`) : ''
  const allSequenceComplete = value.allSequenceComplete
    ? encodeURI(`&allSequenceComplete=${value.allSequenceComplete}`)
    : ''
  const totalDepositAmount = value.totalDepositAmount
    ? encodeURI(`&totalDepositAmount=${value.totalDepositAmount}`)
    : ''
  const routeReference = value.routeReference
    ? encodeURI(`&routeReference=${value.routeReference}`)
    : ''
  return txnPrivateGet(
    `tx-service/trade-routes${queryIdParams}${page}${limit}${clientId}${depositCurrency}${status}${settlementCurrency}${sequence}${allSequenceComplete}${totalDepositAmount}${routeReference}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getAllRoutes(values) {
  try {
    const response = yield call(getRoutes, values.value, values.token)
    yield put({
      type: actions.NP_GET_ALL_ROUTES_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.NP_GET_ALL_ROUTES_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateRoutes = (routeId, values, token) => {
  const body = {
    transactionId: values.transactionId,
    routeStatus: 'requested',
  }
  return txnPrivatePut(`tx-service/trade-routes/${routeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateRouteDetails(values) {
  try {
    const response = yield call(updateRoutes, values.routeId, values.value, values.token)
    yield put({
      type: actions.NP_UPDATE_ROUTE_DETAILS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.NP_UPDATE_ROUTE_DETAILS_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteTxn = (value, token) => {
  return txnPrivateDelete(`tx-service/trade-routes/${value}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteRoutes(values) {
  try {
    const response = yield call(deleteTxn, values.value, values.token)
    yield put({
      type: actions.NP_DELETE_ROUTES_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.NP_GET_ALL_ROUTES,
      value: { page: 1, limit: 10 },
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.NP_DELETE_ROUTES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteRouteInTrade = (value, token) => {
  return txnPrivateDelete(`tx-service/trade-routes/${value}`, token).then(response => {
    return response.data.data
  })
}

export function* onDeleteRoutes(values) {
  try {
    const response = yield call(deleteRouteInTrade, values.value, values.token)
    yield put({
      type: actions.NP_DELETE_ROUTE_TRADE_PAGE_SUCCESS,
      value: response,
    })
    yield put({
      type: tradeAction.NP_GET_ROUTE_BY_TRADE_ID,
      value: values.tradeId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.NP_DELETE_ROUTE_TRADE_PAGE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const bulkDeleteRts = (value, token) => {
  const body = { routeIDs: value }
  return txnPrivatePost(`tx-service/trade-routes/bulk-delete`, body, token).then(response => {
    return response.data.data
  })
}

export function* bulkDeleteRoutes(values) {
  try {
    const response = yield call(bulkDeleteRts, values.value, values.token)
    yield put({
      type: actions.NP_BULK_DELETE_ROUTES_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.NP_GET_ALL_ROUTES,
      value: { page: 1 },
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.NP_BULK_DELETE_ROUTES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.NP_GET_ALL_ROUTES, getAllRoutes),
    takeEvery(actions.NP_UPDATE_ROUTE_DETAILS, updateRouteDetails),
    takeLatest(actions.NP_DELETE_ROUTES, deleteRoutes),
    takeLatest(actions.NP_DELETE_ROUTE_TRADE_PAGE, onDeleteRoutes),
    takeLatest(actions.NP_BULK_DELETE_ROUTES, bulkDeleteRoutes),
  ])
}
