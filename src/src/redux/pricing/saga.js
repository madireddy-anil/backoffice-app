import { all, takeEvery, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'
import generalAction from '../general/actions'
import actions from './action'

const { globalMessages } = Variables

const { cAPrivatePut, cAPrivatePost, cAPrivateDelete, cAPrivateGet } = axiosMethod

const getPricingProfiles = token => {
  return cAPrivateGet(`pricing`, token).then(response => {
    return response.data.data
  })
}

export function* getAllPricingProfiles(values) {
  const { token } = values
  try {
    const response = yield call(getPricingProfiles, token)
    yield put({
      type: actions.GET_ALL_PRICING_PROFILES_SUCCESS,
      value: response.pricing,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_PRICING_PROFILES_FAILURE,
      payload: err,
    })
  }
}

const updateCurrencyPair = (id, body, token) => {
  return cAPrivatePut(`vendor-trade-currency-pairs/${id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateSelectedCurrencyPair(values) {
  const { id, value, token } = values
  try {
    const response = yield call(updateCurrencyPair, id, value, token)
    yield put({
      type: actions.EDIT_SELECTED_CURRENCY_PAIR_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Updated successfully`,
    })
    yield put(push('/currency-pair'))
  } catch (err) {
    yield put({
      type: actions.EDIT_SELECTED_CURRENCY_PAIR_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to update the record',
    })
  }
}

const addPricingProfile = (body, token) => {
  return cAPrivatePost(`pricing`, body, token).then(response => {
    return response.data
  })
}

export function* addNewPricingProfile(values) {
  const { value, token } = values

  try {
    const response = yield call(addPricingProfile, value, token)
    yield put({
      type: actions.ADD_NEW_PRICING_PROFILE_SUCCESS,
      value: response.data,
    })
    yield put(push('/pricing-profiles'))
    notification.success({
      message: 'Success!',
      description: `Pricing Profile created successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_PRICING_PROFILE_FAILURE,
      payload: err.response.data.data.errors,
    })
    notification.error({
      message: err.response.data.data.message,
    })
    // notification.error({
    //   message: globalMessages.errorMessage,
    //   description: 'Failed to update the record',
    // })
  }
}

const deleteCurrencyPair = (id, token) => {
  return cAPrivateDelete(`vendor-trade-currency-pairs/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteSelectedCurrencyPair(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteCurrencyPair, id, token)
    yield put({
      type: actions.DELETE_SELECTED_CURRENCY_PAIR_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted record successfully`,
    })
    yield put({
      type: generalAction.GET_CURRENCY_PAIRS,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SELECTED_CURRENCY_PAIR_FAILURE,
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

const updatePricingProfile = (id, body, token) => {
  return cAPrivatePut(`pricing/${id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateSelectedPricingProfile(values) {
  const { id, value, token, helperVariable } = values
  try {
    const response = yield call(updatePricingProfile, id, value, token)
    yield put({
      type: actions.EDIT_SELECTED_PRICING_PROFILE_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Updated successfully`,
    })
    yield put({
      type: actions.GET_PRICING_PROFILE_BY_ID,
      id,
      token,
    })
    if (helperVariable) {
      yield put(push('/pricing-profiles'))
    }
  } catch (err) {
    yield put({
      type: actions.EDIT_SELECTED_PRICING_PROFILE_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to update the record',
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
      type: actions.GET_ALL_PRICING_PROFILES,
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

const deletePaymentTiering = (id, token) => {
  return cAPrivateDelete(`pricing-payments-tiering/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteSelectedPaymentTiering(values) {
  const { profileid, id, token } = values
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
      id: profileid,
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

const deleteTradeTiering = (id, token) => {
  return cAPrivateDelete(`pricing-trades-tiering/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteSelectedTradeTiering(values) {
  const { id, token, profileid } = values
  try {
    const response = yield call(deleteTradeTiering, id, token)
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
      id: profileid,
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

const getPaymentTierings = (id, token) => {
  return cAPrivateGet(`pricing-payments-tiering/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getPaymentTieringListById(values) {
  const { id, token } = values
  try {
    const response = yield call(getPaymentTierings, id, token)
    yield put({
      type: actions.GET_PAYMENT_TIERING_LIST_BY_ID_SUCCESS,
      value: response.pricing,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PAYMENT_TIERING_LIST_BY_ID_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_SELECTED_PRICING_PROFILE, updateSelectedPricingProfile),
    takeEvery(actions.DELETE_SELECTED_PRICING_PROFILE, deleteSelectedPricingProfile),
    takeEvery(actions.ADD_NEW_PRICING_PROFILE, addNewPricingProfile),
    takeEvery(actions.GET_ALL_PRICING_PROFILES, getAllPricingProfiles),
    takeEvery(actions.GET_PRICING_PROFILE_BY_ID, getPricingProfileById),

    takeEvery(actions.DELETE_SELECTED_PAYMENT_TIERING, deleteSelectedPaymentTiering),
    takeEvery(actions.DELETE_SELECTED_TRADE_TIERING, deleteSelectedTradeTiering),

    takeEvery(actions.GET_PAYMENT_TIERING_LIST_BY_ID, getPaymentTieringListById),
  ])
}
