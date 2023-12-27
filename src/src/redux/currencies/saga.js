import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'

import actions from './actions'

const { globalMessages } = Variables

const { cAPrivatePut } = axiosMethod

const editSelectedCurrency = (id, body, token) => {
  return cAPrivatePut(`currencies/${id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateSelectedCurrency(values) {
  const { id, value, token } = values
  try {
    const response = yield call(editSelectedCurrency, id, value, token)
    yield put({
      type: actions.EDIT_SELECTED_CURRENCY_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Updated successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_SELECTED_CURRENCY_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to update the record',
    })
  }
}

const editSelectedCountry = (id, body, token) => {
  return cAPrivatePut(`countries/${id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateSelectedCountry(values) {
  const { id, value, token } = values
  try {
    const response = yield call(editSelectedCountry, id, value, token)
    yield put({
      type: actions.EDIT_SELECTED_COUNTRY_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Updated successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_SELECTED_COUNTRY_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to update the record',
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_SELECTED_CURRENCY, updateSelectedCurrency),
    takeEvery(actions.EDIT_SELECTED_COUNTRY, updateSelectedCountry),
  ])
}
