import { all, takeEvery, put, call } from 'redux-saga/effects'
import axiosMethod from '../../utilities/apiCaller'

import actions from './actions'

const { privateGet } = axiosMethod

const getallDasboardBalances = value => {
  return privateGet(`dashboard?relativeDate=${value.datePeriod}`, value.token).then(response => {
    return response.data.data
  })
}

export function* getAllBalancesList(datePeriod, token) {
  try {
    const response = yield call(getallDasboardBalances, datePeriod, token)
    yield put({
      type: actions.GET_ALL_DASHBOARD_BALANCES_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_ALL_DASHBOARD_BALANCES_FALIURE,
    })
  }
}

const getBalancesByFilters = (value, token) => {
  const { datePeriod, accountId, selectedMID } = value
  const peroid = datePeriod ? `?relativeDate=${datePeriod}` : ''
  const accId = accountId ? `&accountId=${accountId}` : ''
  const PMId = selectedMID ? `&paymeroMerchantId=${selectedMID}` : ''

  return privateGet(`dashboard${peroid}${accId}${PMId}`, token).then(response => {
    return response.data.data
  })
}

export function* BalancesByPeroid(values) {
  try {
    const response = yield call(getBalancesByFilters, values.value, values.token)
    yield put({
      type: actions.GET_BALANCES_ON_FILTERS_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_BALANCES_ON_FILTERS_FAILURE,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ALL_DASHBOARD_BALANCES, getAllBalancesList),
    takeEvery(actions.GET_BALANCES_ON_FILTERS, BalancesByPeroid),
  ])
}
