import { all, put, call, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd'
import { push } from 'react-router-redux'
import axiosMethod from '../../utilities/apiCaller'

import actions from './actions'

const { txnPrivateGet, txnPrivateDelete, txnPrivatePut, txnPrivatePost } = axiosMethod

const getBankAccount = value => {
  return txnPrivateGet(`tx-service/bank-accounts/${value.id}`, value.token).then(response => {
    return response.data.data
  })
}

export function* getBankAccountDetailsById(id, token) {
  try {
    const response = yield call(getBankAccount, id, token)
    yield put({
      type: actions.GET_BANK_ACCOUNT_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_BANK_ACCOUNT_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const deletebankaccount = value => {
  return txnPrivateDelete(`tx-service/bank-accounts/${value.id}`, value.token).then(response => {
    return response.data.data
  })
}

export function* deleteBankAccount(id, token) {
  try {
    const response = yield call(deletebankaccount, id, token)
    yield put({
      type: actions.DELETE_BANK_ACCOUNT_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: 'Deleted successfully',
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_BANK_ACCOUNT_FAILURE,
      payload: err,
    })
  }
}

const createbankaccount = values => {
  const { value, token } = values
  return txnPrivatePost('tx-service/bank-accounts', value, token).then(response => {
    return response.data.data
  })
}

export function* createBankAccount(value) {
  try {
    const response = yield call(createbankaccount, value)
    yield put({
      type: actions.CREATE_BANK_ACCOUNT_SUCCESS,
      value: response,
    })
    if (response) {
      yield put(push('/bank-accounts'))
    }
    notification.success({
      message: 'Success!',
      description: 'Accounts Created successfully',
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_BANK_ACCOUNT_FAILURE,
      payload: err,
    })
    notification.warning({
      description: err.response.data.data.message,
    })
  }
}

const updatebankaccount = values => {
  const { value, accId, token } = values
  return txnPrivatePut(`tx-service/bank-accounts/${accId}`, value, token).then(response => {
    return response.data.data
  })
}

export function* updateBankAccount(values) {
  try {
    const response = yield call(updatebankaccount, values)
    yield put({
      type: actions.UPDATE_BANK_ACCOUNT_SUCCESS,
      value: response,
    })
    yield put(push(`/view-account/${response.id}`))
    notification.success({
      message: 'Success!',
      description: 'Updated successfully',
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_BANK_ACCOUNT_FAILURE,
      payload: err,
    })
  }
}

const getBankAccounts = (values, token) => {
  const querySymbol =
    values.page ||
    values.limit ||
    values.vendorId ||
    values.accountCurrency ||
    values.accountNumber ||
    values.nameOnAccount ||
    values.bankName ||
    values.accountStatus ||
    values.accountType
      ? '?'
      : ''
  const vendorid = values.vendorId ? `&vendorId=${values.vendorId}` : ''
  const page = values.page ? encodeURI(`page=${values.page}`) : ''
  const limit = values.limit ? encodeURI(`&limit=${values.limit}`) : ''
  const accNo = values.accountNumber ? `&accountNumber=${values.accountNumber}` : ''
  const accCurrency = values.accountCurrency ? `&accountCurrency=${values.accountCurrency}` : ''
  const nameOnAccount = values.nameOnAccount
    ? encodeURI(`&nameOnAccount=${values.nameOnAccount}`)
    : ''
  const bankName = values.bankName ? encodeURI(`&bankName=${values.bankName}`) : ''
  const accountType = values.accountType ? encodeURI(`&accountType=${values.accountType}`) : ''
  const accountStatus = values.accountStatus
    ? encodeURI(`&accountStatus=${values.accountStatus}`)
    : ''
  return txnPrivateGet(
    `tx-service/bank-accounts${querySymbol}${page}${limit}${accNo}${accCurrency}${vendorid}${nameOnAccount}${bankName}${accountType}${accountStatus}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getAllBankAccounts(values) {
  const { value, token } = values
  try {
    const response = yield call(getBankAccounts, value, token)
    yield put({
      type: actions.GET_BANK_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_BANK_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_BANK_ACCOUNT_BY_ID, getBankAccountDetailsById),
    takeLatest(actions.DELETE_BANK_ACCOUNT, deleteBankAccount),
    takeLatest(actions.GET_BANK_ACCOUNTS, getAllBankAccounts),
    takeLatest(actions.CREATE_BANK_ACCOUNT, createBankAccount),
    takeLatest(actions.UPDATE_BANK_ACCOUNT, updateBankAccount),
  ])
}
