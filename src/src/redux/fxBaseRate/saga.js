import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'

import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'

import actions from './actions'

const { txnPrivateGet, txnPrivatePost } = axiosMethod
const { globalMessages } = Variables

const getFxBaseRates = (values, token) => {
  const questionMarkSymbol =
    values.page ||
    values.limit ||
    values.vendorId ||
    values.sourceCurrency ||
    values.destinationCurrency ||
    values.fxBaseRateReference ||
    values.feeValue ||
    values.feeCategory ||
    values.rateStatus ||
    values.targetAmount ||
    values.inverseAmount ||
    values.baseAmount ||
    values.vendor ||
    values.sortBy
      ? '?'
      : ''
  const page = values.page ? encodeURI(`page=${values.page}`) : ''
  const limit = values.limit ? encodeURI(`&limit=${values.limit}`) : ''
  // const baseRateProviderName = values.baseRateProviderName ? encodeURI(`&baseRateProviderName=${values.baseRateProviderName}`) : ''
  const sourceCurrency = values.sourceCurrency
    ? encodeURI(`&baseCurrency=${values.sourceCurrency}`)
    : ''
  const destinationCurrency = values.destinationCurrency
    ? encodeURI(`&targetCurrency=${values.destinationCurrency}`)
    : ''
  const vendor = values.vendor ? encodeURI(`&vendor=${values.vendor}`) : ''
  const fxBaseRateReference = values.fxBaseRateReference
    ? encodeURI(`&fxBaseRateReference=${values.fxBaseRateReference}`)
    : ''
  const feeValue = values.feeValue ? encodeURI(`&feeValue=${values.feeValue}`) : ''
  const feeCategory = values.feeCategory ? encodeURI(`&feeCategory=${values.feeCategory}`) : ''
  const rateStatus = values.rateStatus ? encodeURI(`&rateStatus=${values.rateStatus}`) : ''
  const targetAmount = values.targetAmount ? encodeURI(`&targetAmount=${values.targetAmount}`) : ''
  const inverseAmount = values.inverseAmount
    ? encodeURI(`&inverseAmount=${values.inverseAmount}`)
    : ''
  const baseAmount = values.baseAmount ? encodeURI(`&baseAmount=${values.baseAmount}`) : ''
  const sortBy = values.sortBy ? encodeURI(`&sortBy=${values.sortBy}`) : ''
  const orderBy = values.orderBy ? encodeURI(`&orderBy=${values.orderBy}`) : ''
  return txnPrivateGet(
    `tx-service/fx-base-rates${questionMarkSymbol}${page}${limit}${sortBy}${sourceCurrency}${destinationCurrency}${vendor}${fxBaseRateReference}${feeValue}${feeCategory}${rateStatus}${targetAmount}${inverseAmount}${baseAmount}${orderBy}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getAllFxBaseRates(values) {
  try {
    const response = yield call(getFxBaseRates, values.value, values.token)
    yield put({
      type: actions.GET_FX_BASE_RATES_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_FX_BASE_RATES_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getFxBaseRate = (fxBaseRateId, token) => {
  return txnPrivateGet(`tx-service/fx-base-rates/${fxBaseRateId}`, token).then(response => {
    return response.data.data
  })
}

export function* getFxBaseRateById(values) {
  try {
    const response = yield call(getFxBaseRate, values.value, values.token)
    yield put({
      type: actions.GET_FX_BASE_RATE_BY_ID_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_FX_BASE_RATE_BY_ID_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getAnalysedRate = (values, token) => {
  return txnPrivatePost(`tx-service/rate-calculate`, values, token).then(response => {
    return response.data
  })
}

export function* getAnalysedRateForFx(values) {
  try {
    const response = yield call(getAnalysedRate, values.value, values.token)
    yield put({
      type: actions.GET_ANALYSED_RATE_SUCCESS,
      value: response.data,
    })
  } catch (err) {
    console.log(err)
    yield put({
      type: actions.GET_ANALYSED_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const createFxBase = (values, token) => {
  return txnPrivatePost(`tx-service/fx-base-rates`, values, token).then(response => {
    return response.data.data
  })
}

export function* createFxBaseRate(values) {
  try {
    const response = yield call(createFxBase, values.value, values.token)
    yield put({
      type: actions.CREATE_FX_BASE_RATE_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Fx Base Rate Created Successfully',
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_FX_BASE_RATE_FAILURE,
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
    takeLatest(actions.GET_FX_BASE_RATES, getAllFxBaseRates),
    takeLatest(actions.GET_FX_BASE_RATE_BY_ID, getFxBaseRateById),
    takeLatest(actions.GET_ANALYSED_RATE, getAnalysedRateForFx),
    takeLatest(actions.CREATE_FX_BASE_RATE, createFxBaseRate),
  ])
}
