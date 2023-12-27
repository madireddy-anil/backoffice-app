import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { push } from 'react-router-redux'

import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'

import actions from './actions'
// import tradeRouteActions from '../routingEngine/actions'
// import tradeActions from '../trade/actions'

const { txnPrivateGet, txnPrivatePost, txnPrivateDelete, txnPrivatePut } = axiosMethod
const { globalMessages } = Variables

const getFeeConfig = (values, token) => {
  const querySymbol =
    values.page ||
    values.limit ||
    values.clientId ||
    values.vendorId ||
    values.depositCurrency ||
    values.settlementCurrency ||
    values.feeConfigReference ||
    values.feeCategory ||
    values.feeValue ||
    values.spreadType ||
    values.tradingHours
      ? '?'
      : ''
  const clientId = values.clientId ? `&clientId=${values.clientId}` : ''
  const vendorId = values.vendorId ? `&vendorId=${values.vendorId}` : ''
  const page = values.page ? encodeURI(`page=${values.page}`) : ''
  const limit = values.limit ? encodeURI(`&limit=${values.limit}`) : ''
  const depositCurrency = values.depositCurrency ? `&sourceCurrency=${values.depositCurrency}` : ''
  const settlementCurrency = values.settlementCurrency
    ? `&destinationCurrency=${values.settlementCurrency}`
    : ''
  const feeConfigReference = values.feeConfigReference
    ? `&feeConfigReference=${values.feeConfigReference}`
    : ''
  const feeCategory = values.feeCategory ? `&feeCategory=${values.feeCategory}` : ''
  const feeValue = values.feeValue ? `&feeValue=${values.feeValue}` : ''
  const spreadType = values.spreadType ? `&spreadType=${values.spreadType}` : ''
  const tradingHours = values.tradingHours ? `&tradingHours=${values.tradingHours}` : ''
  return txnPrivateGet(
    `tx-service/fee-config${querySymbol}${page}${limit}${clientId}${vendorId}${depositCurrency}${settlementCurrency}${feeConfigReference}${feeCategory}${feeValue}${spreadType}${tradingHours}`,
    token,
  ).then(response => {
    const feeConfig = response.data.data.feeConfig.map(option => {
      return {
        ...option,
        clientOrVendor: option.vendorId || option.clientId,
      }
    })
    return {
      feeConfig,
      total: response.data.data.total,
    }
  })
}

export function* getAllFeeConfigs(values) {
  try {
    const response = yield call(getFeeConfig, values.value, values.token)
    yield put({
      type: actions.GET_FEE_CONFIGS_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_FEE_CONFIGS_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getFeeConById = (id, token) => {
  return txnPrivateGet(`tx-service/fee-config/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getFeeConfigById(values) {
  try {
    const response = yield call(getFeeConById, values.id, values.token)
    yield put({
      type: actions.GET_FEE_CONFIG_BY_ID_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_FEE_CONFIG_BY_ID_FAILURE,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updatedFeeConfig = (id, body, token) => {
  return txnPrivatePut(`tx-service/fee-config/${id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updatedSelectedFeeConfig(values) {
  try {
    const response = yield call(updatedFeeConfig, values.id, values.value, values.token)
    yield put({
      type: actions.UPDATE_FEE_CONFIG_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: 'Updated Successfully',
    })
  } catch (e) {
    yield put({
      type: actions.UPDATE_FEE_CONFIG_FAILURE,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to update record',
    })
  }
}

const bulkDeleteFeeCons = (value, token) => {
  const body = { routeIDs: value }
  return txnPrivatePost(`tx-service/fee-config/bulk-delete`, body, token).then(response => {
    return response.data.data
  })
}

export function* bulkDeleteFeeConfigs(values) {
  try {
    const response = yield call(bulkDeleteFeeCons, values.value, values.token)
    yield put({
      type: actions.BULK_DELETE_FEE_CONFIGS_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_FEE_CONFIGS,
      value: { page: 1 },
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.BULK_DELETE_FEE_CONFIGS_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteFeeCon = (value, token) => {
  return txnPrivateDelete(`tx-service/fee-config/${value}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteFeeConfig(values) {
  try {
    const response = yield call(deleteFeeCon, values.value, values.token)
    yield put({
      type: actions.DELETE_FEE_CONFIG_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_FEE_CONFIGS,
      value: '',
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_FEE_CONFIG_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const createFeeCon = (body, token) => {
  return txnPrivatePost(`tx-service/fee-config`, body, token).then(response => {
    return response.data.data
  })
}

export function* createFeeConfig(values) {
  try {
    const response = yield call(createFeeCon, values.value, values.token)
    yield put({
      type: actions.CREATE_FEE_CONFIG_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Fee Config Created Successfully',
    })
    yield put(push('/fee-configs'))
  } catch (err) {
    yield put({
      type: actions.CREATE_FEE_CONFIG_FAILURE,
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
    takeLatest(actions.DELETE_FEE_CONFIG, deleteFeeConfig),
    takeLatest(actions.GET_FEE_CONFIGS, getAllFeeConfigs),
    takeLatest(actions.GET_FEE_CONFIG_BY_ID, getFeeConfigById),
    takeLatest(actions.BULK_DELETE_FEE_CONFIGS, bulkDeleteFeeConfigs),
    takeLatest(actions.CREATE_FEE_CONFIG, createFeeConfig),
    takeLatest(actions.UPDATE_FEE_CONFIG, updatedSelectedFeeConfig),
  ])
}
