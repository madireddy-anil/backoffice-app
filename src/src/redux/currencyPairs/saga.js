import { all, takeEvery, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'
import generalAction from '../general/actions'
import actions from './action'

const { globalMessages } = Variables

const { cAPrivatePut, cAPrivatePost, cAPrivateDelete } = axiosMethod

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

const addCurrencyPair = (body, token) => {
  return cAPrivatePost(`vendor-trade-currency-pairs`, body, token).then(response => {
    return response.data
  })
}

export function* addNewCurrencyPair(values) {
  const { value, token } = values

  try {
    const response = yield call(addCurrencyPair, value, token)
    yield put({
      type: actions.ADD_NEW_CURRENCIES_PAIR_SUCCESS,
      value: response.data,
    })
    yield put(push('/currency-pair'))
    notification.success({
      message: 'Success!',
      description: `Currency Pair created successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_CURRENCIES_PAIR_FAILURE,
      payload: err.response.data.data.errors,
    })
    // notification.error({
    //   message: err.response.data.data.invalidParams[0].reason,
    // })
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_SELECTED_CURRENCY_PAIR, updateSelectedCurrencyPair),
    takeEvery(actions.DELETE_SELECTED_CURRENCY_PAIR, deleteSelectedCurrencyPair),
    takeEvery(actions.ADD_NEW_CURRENCIES_PAIR, addNewCurrencyPair),
  ])
}
