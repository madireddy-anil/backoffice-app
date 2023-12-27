import { all, takeLatest, put, call } from 'redux-saga/effects'
import actions from './actions'

import axiosMethod from '../../utilities/apiCaller'

const { cAPrivateGet } = axiosMethod

const getAccountDetailsList = (clientId, token) => {
  return cAPrivateGet(`accounts/${clientId}`, token).then(response => {
    return response.data.data
  })
}

export function* getAccountDetails(values) {
  try {
    const response = yield call(getAccountDetailsList, values.clientId, values.token)
    yield put({
      type: actions.GET_ACCOUNT_DETAILS_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ACCOUNT_DETAILS_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const getFiatBalanceTxnList = (Id, value, token) => {
  const { limit, activePage } = value
  const limitSize = limit || limit === 0 ? `limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return cAPrivateGet(`accounts/${Id}/transactions?${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getFiatBalanceTransactionsById(values) {
  try {
    const response = yield call(getFiatBalanceTxnList, values.Id, values.value, values.token)
    yield put({
      type: actions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID_SUCCESS,
      value: { ...response, accountType: values.value.accountType },
    })
  } catch (err) {
    yield put({
      type: actions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const getCryptoBalanceTxnList = (Id, value, token) => {
  const { limit, activePage } = value
  const limitSize = limit || limit === 0 ? `limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return cAPrivateGet(`accounts/${Id}/transactions?${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getCryptoBalanceTransactionsById(values) {
  try {
    const response = yield call(getCryptoBalanceTxnList, values.Id, values.value, values.token)
    yield put({
      type: actions.GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const getPaymentTransactionDetailById = (transactionReference, token) => {
  const reference = transactionReference ? `?transactionReference=${transactionReference}` : ''
  return cAPrivateGet(`payments${reference}`, token).then(response => {
    return response.data.data
  })
}

export function* getPaymentTransactionDetailsById(values) {
  try {
    const response = yield call(
      getPaymentTransactionDetailById,
      values.transactionReference,
      values.token,
    )
    yield put({
      type: actions.GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE_SUCCESS,
      value: response.payments,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE_FAILURE,
      payload: err,
    })
  }
}

const getTxnSummary = (txnRef, token) => {
  return cAPrivateGet(`payments/activity/${txnRef}`, token).then(res => {
    return res.data.data
  })
}

export function* getPaymentTransactionSummaryByRef(values) {
  try {
    const response = yield call(getTxnSummary, values.txnRef, values.token)
    yield put({
      type: actions.GET_TRANSACTION_SUMMARY_DETAILS_SUCCESS,
      value: response.activity,
    })
  } catch (err) {
    yield put({
      type: actions.GET_TRANSACTION_SUMMARY_DETAILS_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_ACCOUNT_DETAILS_BY_ID, getAccountDetails),
    takeLatest(actions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID, getFiatBalanceTransactionsById),
    takeLatest(actions.GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID, getCryptoBalanceTransactionsById),

    takeLatest(
      actions.GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE,
      getPaymentTransactionDetailsById,
    ),
    takeLatest(actions.GET_TRANSACTION_SUMMARY_DETAILS, getPaymentTransactionSummaryByRef),
  ])
}
