import { all, takeEvery, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import { getParamByProcessFlow } from '../../utilities/transformer'

import actions from './action'

const { cAPrivateGet, cAPrivatePut } = axiosMethod

const getAllErrorQueues = (value, token) => {
  const { limit, activePage } = value
  const page = activePage ? `&page=${activePage}` : ''
  return cAPrivateGet(`payments/error-queue?limit=${limit}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllErrorQueueList(values) {
  const { value, token } = values
  try {
    const response = yield call(getAllErrorQueues, value, token)
    yield put({
      type: actions.GET_ALL_ERROR_QUEUE_LIST_SUCCESS,
      value: response.payments,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_ERROR_QUEUE_LIST_FAILURE,
      payload: err,
    })
  }
}

const getQueueListByFilters = (value, token) => {
  const {
    limit,
    activePage,
    selectedOwnerEntityId,
    selectedDays,
    selectedProcessFlow,
    selectedCurrency,
    selectedExitStatusCode,
    sortBy,
  } = value
  const pageLimit = limit && limit ? `&limit=${limit}` : ''
  const ownerEntityId = selectedOwnerEntityId ? `&ownerEntityId=${selectedOwnerEntityId}` : ''
  const processFlow = selectedProcessFlow ? `&processFlow=${selectedProcessFlow}` : ''
  const currency =
    selectedProcessFlow && selectedCurrency
      ? getParamByProcessFlow(selectedProcessFlow, selectedCurrency)
      : ''
  const daysOutstanding = selectedDays === 0 || selectedDays ? `&relativeDate=${selectedDays}` : ''
  const exitStatusCode = selectedExitStatusCode ? `&exitStatusCode=${selectedExitStatusCode}` : ''
  const sortedByDaysOusatanding = sortBy ? `&sortBy=${sortBy}&orderBy=updatedAt` : ''
  return cAPrivateGet(
    `payments/error-queue?page=${activePage}${pageLimit}${ownerEntityId}${processFlow}${currency}${daysOutstanding}${sortedByDaysOusatanding}${exitStatusCode}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getErrorQueueListByFilters(values) {
  const { value, token } = values
  try {
    const response = yield call(getQueueListByFilters, value, token)
    yield put({
      type: actions.GET_ERROR_QUEUE_LIST_BY_FILTERS_SUCCESS,
      value: response.payments,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ERROR_QUEUE_LIST_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

const getPaymentsListByFilters = (value, token) => {
  const { id } = value
  return cAPrivateGet(`payments/error-queue/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getPaymentsByFilters(values) {
  const { value, token } = values
  try {
    const response = yield call(getPaymentsListByFilters, value, token)
    yield put({
      type: actions.GET_PAYMENTS_BY_FILTERS_SUCCESS,
      values: response.errorPayment,
      matchedPayments: response.reference,
      // value: getPaymentRecord(value.id, response.payments),
    })
  } catch (err) {
    yield put({
      type: actions.GET_PAYMENTS_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

const getRejectedPaymentsByFiltersList = (value, token) => {
  const { limit, activePage, selectedOwnerEntityId, selectedProcessFlow, selectedCurrency } = value
  const pageLimit = limit && limit ? `?limit=${limit}` : ''
  const page = activePage ? `&page=${activePage}` : ''
  const ownerEntityId = selectedOwnerEntityId ? `&ownerEntityId=${selectedOwnerEntityId}` : ''
  const processFlow = selectedProcessFlow ? `&processFlow=${selectedProcessFlow}` : ''
  const currency =
    selectedProcessFlow && selectedCurrency
      ? getParamByProcessFlow(selectedProcessFlow, selectedCurrency)
      : ''
  return cAPrivateGet(
    `payments?exitStatusCode=R1${page}${pageLimit}${ownerEntityId}${processFlow}${currency}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getRejectedPaymentsByFilters(values) {
  const { value, token } = values
  try {
    const response = yield call(getRejectedPaymentsByFiltersList, value, token)
    yield put({
      type: actions.GET_REJECTED_PAYMENTS_BY_FILTERS_SUCCESS,
      value: response.payments,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_REJECTED_PAYMENTS_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

const approvePaymentRequestData = values => {
  const { value, id, token } = values
  return cAPrivatePut(`/payments/error-queue/${id}`, value, token).then(response => {
    return response.data.data
  })
}

export function* approvePaymentRequest(values) {
  try {
    const response = yield call(approvePaymentRequestData, values)
    yield put({
      type: actions.APPROVE_PAYMENT_RECORD_SUCCESS,
      value: response.payments,
    })
    const redirectionUrl = {
      pathname: `/error-queue-list`,
      state: 'approval-Summary',
    }
    yield put(push(redirectionUrl))
  } catch (err) {
    yield put({
      type: actions.APPROVE_PAYMENT_RECORD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err?.response?.data?.message,
    })
  }
}

const rejectPaymentRequestData = values => {
  const { value, id, token } = values
  return cAPrivatePut(`/payments/error-queue/${id}`, value, token).then(response => {
    return response.data.data
  })
}

export function* rejectPaymentRequest(values) {
  try {
    const response = yield call(rejectPaymentRequestData, values)
    yield put({
      type: actions.REJECT_PAYMENT_RECORD_SUCCESS,
      value: response.payments,
    })
    const redirectionUrl = {
      pathname: `/error-queue-list`,
      state: 'approval-Summary',
    }
    yield put(push(redirectionUrl))
  } catch (err) {
    yield put({
      type: actions.REJECT_PAYMENT_RECORD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err?.response?.data?.message,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ALL_ERROR_QUEUE_LIST, getAllErrorQueueList),
    takeEvery(actions.GET_ERROR_QUEUE_LIST_BY_FILTERS, getErrorQueueListByFilters),

    takeEvery(actions.GET_REJECTED_PAYMENTS_BY_FILTERS, getRejectedPaymentsByFilters),
    takeEvery(actions.GET_PAYMENTS_BY_FILTERS, getPaymentsByFilters),

    takeEvery(actions.APPROVE_PAYMENT_RECORD, approvePaymentRequest),
    takeEvery(actions.REJECT_PAYMENT_RECORD, rejectPaymentRequest),
  ])
}
