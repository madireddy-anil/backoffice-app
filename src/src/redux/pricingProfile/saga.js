import { all, takeEvery, put, call } from 'redux-saga/effects'
// import { push } from 'react-router-redux'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'
// import generalAction from '../general/actions'
import actions from './action'

const { globalMessages } = Variables

const { cAPrivateDelete, cAPrivateGet, cAPrivatePost, cAPrivatePut } = axiosMethod

const getPricingProfiles = values => {
  const { token } = values
  const page = values.page ? `?page=${values.page}` : ''
  const limit = values.pageSize ? `&limit=${values.pageSize}` : ''
  const entityId = values.entityId ? `&entityId=${values.entityId}` : ''
  return cAPrivateGet(`pricing${page}${limit}${entityId}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllPricingProfiles(value) {
  try {
    const response = yield call(getPricingProfiles, value.values)
    yield put({
      type: actions.GET_ALL_PRICING_PROFILES_LIST_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_PRICING_PROFILES_LIST_FAILURE,
      payload: err,
    })
  }
}

const deletePricingProfile = (id, token) => {
  return cAPrivateDelete(`pricing/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteSelectedPricingProfile(values) {
  const { id, token } = values
  try {
    const response = yield call(deletePricingProfile, id, token)
    yield put({
      type: actions.DELETE_SELECTED_PRICING_PROFILE_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted record successfully`,
    })
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID,
      id: response.id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SELECTED_PRICING_PROFILE_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to delete the record',
    })
  }
}

const getPricingProfileDataById = (id, token) => {
  return cAPrivateGet(`pricing/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getPricingProfileById(values) {
  const { id, token } = values
  try {
    const response = yield call(getPricingProfileDataById, id, token)
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const addPricingProfiles = values => {
  const { body, token } = values
  return cAPrivatePost(`pricing`, body, token).then(response => {
    return response.data.data
  })
}

export function* addNewPricingProfile(values) {
  try {
    const response = yield call(addPricingProfiles, values)
    yield put({
      type: actions.ADD_NEW_PRICING_PROFILE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_PRICING_PROFILE_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to add pricing profile record ...',
    })
  }
}

const editPricingProfileData = values => {
  const { pricingId, body, token } = values
  return cAPrivatePut(`pricing/${pricingId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* editPricingProfile(values) {
  try {
    const response = yield call(editPricingProfileData, values)
    yield put({
      type: actions.EDIT_PRICING_PROFILE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_PRICING_PROFILE_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to edit pricing profile ...',
    })
  }
}

const addNewPaymentPricingData = values => {
  const { body, token } = values
  return cAPrivatePost(`pricing-payments`, body, token).then(response => {
    return response.data.data
  })
}

export function* addPaymentPricingData(values) {
  try {
    const response = yield call(addNewPaymentPricingData, values)
    yield put({
      type: actions.ADD_PAYMENT_PRICING_DATA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_PAYMENT_PRICING_DATA_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to add payment pricing record ...',
    })
  }
}

const editPaymentPricingData = values => {
  const { pricingId, body, token } = values
  return cAPrivatePut(`pricing-payments/${pricingId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* editPaymentPricing(values) {
  try {
    const response = yield call(editPaymentPricingData, values)
    yield put({
      type: actions.EDIT_PAYMENT_PRICING_DATA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_PAYMENT_PRICING_DATA_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to edit payment pricing record ...',
    })
  }
}

const addPaymentsTieringData = values => {
  const { body, token } = values
  return cAPrivatePost(`pricing-payments-tiering`, body, token).then(response => {
    return response.data.data
  })
}

export function* addPaymentsTiering(values) {
  try {
    const response = yield call(addPaymentsTieringData, values)
    yield put({
      type: actions.ADD_PAYMENTS_TIERING_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_PAYMENTS_TIERING_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to add payment tiering record ...',
    })
  }
}

const editPaymentsTieringData = values => {
  const { tieringId, body, token } = values
  return cAPrivatePut(`pricing-payments-tiering/${tieringId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* editPaymentsTiering(values) {
  try {
    const response = yield call(editPaymentsTieringData, values)
    yield put({
      type: actions.EDIT_PAYMENT_TIERING_DATA_BY_ID_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID,
      id: response.id,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_PAYMENT_TIERING_DATA_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to edit payment tiering record ...',
    })
  }
}

const deletePaymentTiering = (id, token) => {
  return cAPrivateDelete(`pricing-payments-tiering/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteSelectedPaymentTiering(values) {
  const { id, token } = values
  try {
    const response = yield call(deletePaymentTiering, id, token)
    yield put({
      type: actions.DELETE_SELECTED_PAYMENT_TIERING_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted record successfully`,
    })
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID,
      id: response.id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SELECTED_PAYMENT_TIERING_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to delete the record',
    })
  }
}

const deletePaymentPricingData = values => {
  const { paymentsId, pricingId, token } = values
  return cAPrivateDelete(`pricing-payments/${paymentsId}/${pricingId}`, token).then(response => {
    return response.data.data
  })
}

export function* deletePaymentPricing(values) {
  const { pricingId, token } = values
  try {
    const response = yield call(deletePaymentPricingData, values)
    yield put({
      type: actions.DELETE_PAYMENT_PRICING_DATA_BY_ID_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted record successfully`,
    })
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID,
      id: pricingId,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_PAYMENT_PRICING_DATA_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to delete the record',
    })
  }
}

// Trades

const addNewTradePricingData = values => {
  const { body, token } = values
  return cAPrivatePost(`pricing-trades`, body, token).then(response => {
    return response.data.data
  })
}

export function* addTradePricingData(values) {
  try {
    const response = yield call(addNewTradePricingData, values)
    yield put({
      type: actions.ADD_TRADE_PRICING_DATA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_TRADE_PRICING_DATA_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to add payment pricing record ...',
    })
  }
}

const editTradePricingData = values => {
  const { pricingtradeId, body, token } = values
  return cAPrivatePut(`pricing-trades/${pricingtradeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* editTradePricing(values) {
  try {
    const response = yield call(editTradePricingData, values)
    yield put({
      type: actions.EDIT_TRADE_PRICING_DATA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_TRADE_PRICING_DATA_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to edit trade pricing record ...',
    })
  }
}

const deleteTradePricingData = values => {
  const { tradesId, pricingId, token } = values
  return cAPrivateDelete(`pricing-trades/${tradesId}/${pricingId}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteTradePricing(values) {
  const { pricingId, token } = values
  try {
    const response = yield call(deleteTradePricingData, values)
    yield put({
      type: actions.DELETE_TRADE_PRICING_DATA_BY_ID_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted record successfully`,
    })
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID,
      id: pricingId,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_TRADE_PRICING_DATA_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to delete the record',
    })
  }
}

const addTradesTieringData = values => {
  const { body, token } = values
  return cAPrivatePost(`pricing-trades-tiering`, body, token).then(response => {
    return response.data.data
  })
}

export function* addTradesTiering(values) {
  try {
    const response = yield call(addTradesTieringData, values)
    yield put({
      type: actions.ADD_TRADE_TIERING_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_TRADE_TIERING_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to add trades tiering record ...',
    })
  }
}

const editTradeTieringData = values => {
  const { tieringId, body, token } = values
  return cAPrivatePut(`pricing-trades-tiering/${tieringId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* editTradeTiering(values) {
  try {
    const response = yield call(editTradeTieringData, values)
    yield put({
      type: actions.EDIT_TRADE_TIERING_DATA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_TRADE_TIERING_DATA_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to edit payment tiering record ...',
    })
  }
}

const deleteTradeTieringData = (id, token) => {
  return cAPrivateDelete(`pricing-trades-tiering/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteTradeTieringPricing(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteTradeTieringData, id, token)
    yield put({
      type: actions.DELETE_SELECTED_TRADE_TIERING_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted record successfully`,
    })
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID,
      id: response.id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SELECTED_TRADE_TIERING_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to delete the record',
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ALL_PRICING_PROFILES_LIST, getAllPricingProfiles),
    takeEvery(actions.GET_PRICING_PROFILE_BY_ID, getPricingProfileById),

    takeEvery(actions.ADD_NEW_PRICING_PROFILE, addNewPricingProfile),
    takeEvery(actions.EDIT_PRICING_PROFILE, editPricingProfile),
    takeEvery(actions.DELETE_SELECTED_PRICING_PROFILE, deleteSelectedPricingProfile),

    takeEvery(actions.ADD_PAYMENT_PRICING_DATA_BY_ID, addPaymentPricingData),
    takeEvery(actions.EDIT_PAYMENT_PRICING_DATA_BY_ID, editPaymentPricing),
    takeEvery(actions.DELETE_PAYMENT_PRICING_DATA_BY_ID, deletePaymentPricing),

    takeEvery(actions.ADD_PAYMENTS_TIERING, addPaymentsTiering),
    takeEvery(actions.EDIT_PAYMENT_TIERING_DATA_BY_ID, editPaymentsTiering),
    takeEvery(actions.DELETE_SELECTED_PAYMENT_TIERING, deleteSelectedPaymentTiering),

    // Trades

    takeEvery(actions.ADD_TRADE_PRICING_DATA_BY_ID, addTradePricingData),
    takeEvery(actions.EDIT_TRADE_PRICING_DATA_BY_ID, editTradePricing),
    takeEvery(actions.DELETE_TRADE_PRICING_DATA_BY_ID, deleteTradePricing),

    takeEvery(actions.ADD_TRADE_TIERING, addTradesTiering),
    takeEvery(actions.EDIT_TRADE_TIERING_DATA_BY_ID, editTradeTiering),
    takeEvery(actions.DELETE_SELECTED_TRADE_TIERING, deleteTradeTieringPricing),
  ])
}
