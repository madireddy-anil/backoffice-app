import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { push } from 'react-router-redux'

import axiosMethod from 'utilities/apiCaller'
import Variables from 'utilities/variables'

import actions from './actions'
import chatActions from '../tradeProcess/chat/actions'
import tradeActions from '../tradeProcess/tradeDetails/actions'

const { txnPrivateGet, txnPrivatePost, txnPrivatePut } = axiosMethod
const { globalMessages } = Variables

const getBeneficiaries = values => {
  return txnPrivateGet(`tx-service/beneficiaries?clientId=${values.value}`, values.token).then(
    response => {
      return response.data.data
    },
  )
}
// cryptoBeneficiaries
export function* getAllBeneficiariesById(values) {
  try {
    const response = yield call(getBeneficiaries, values)
    yield put({
      type: actions.NP_GET_BENEFICIARY_BY_CLIENT_ID_SUCCESS,
      value: response.beneficiaries,
    })
  } catch (err) {
    yield put({
      type: actions.NP_GET_BENEFICIARY_BY_CLIENT_ID_FAILURE,
      payload: err,
    })
  }
}

const createTrade = (values, token) => {
  const beneficiary =
    values.type === 'crypto'
      ? {
          cryptoBeneficiary: values.selectedBeneficiary,
        }
      : {
          beneficiary: values.selectedBeneficiary,
        }
  const body = {
    tradeAmount: values.depositsInCorporateAccount + values.depositsInPersonalAccount,
    tradeCurrency: values.sourceCurrency,
    clientName: values.clientName,
    clientId: values.clientId,
    parentId: values.parentId,
    parentName: values.parentName,
    ...beneficiary,
    depositsInCorporateAccount: values.depositsInCorporateAccount,
    depositsInPersonalAccount: values.depositsInPersonalAccount,
    isDepositsInPersonalAccount: values.depositsInPersonalAccount !== 0,
    isDepositsInCorporateAccount: values.depositsInCorporateAccount !== 0,
    settlementPreference: values.type,
  }

  return txnPrivatePost(`tx-service/trades`, body, token).then(response => {
    return response.data.data
  })
}

export function* createNewTrade(values) {
  try {
    const response = yield call(createTrade, values.value, values.token)
    yield put({
      type: actions.NP_CREATE_TRADE_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `${response.tradeReference} created successfully`,
    })
    values.tradeId = response.id
    values.tradeReference = response.tradeReference
    yield put({
      type: chatActions.NP_CREATE_CHAT_CHANNEL,
      value: values,
      token: values.value.chatToken,
    })
    yield put(push('/np-trade'))
    yield put({
      type: tradeActions.NP_GET_TRADE_DETAILS_BY_ID,
      value: response.id,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.NP_CREATE_TRADE_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateStatus = (value, token) => {
  const body = value
  return txnPrivatePut(`tx-service/trades/${value.tradeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateTradeStatus(values) {
  try {
    const response = yield call(updateStatus, values.value, values.token)
    yield put({
      type: actions.NP_UPDATE_TRADE_STATUS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.NP_UPDATE_TRADE_STATUS_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getBene = values => {
  const { value, token } = values
  return txnPrivateGet(`tx-service/crypto-beneficiaries?clientId=${value}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getCryptoBeneficiaries(values) {
  try {
    const response = yield call(getBene, values)
    yield put({
      type: actions.NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_FAILURE,
      value: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.NP_GET_BENEFICIARY_BY_CLIENT_ID, getAllBeneficiariesById),
    takeLatest(actions.NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID, getCryptoBeneficiaries),
    takeLatest(actions.NP_CREATE_TRADE, createNewTrade),
    takeLatest(actions.NP_UPDATE_TRADE_STATUS, updateTradeStatus),
  ])
}
