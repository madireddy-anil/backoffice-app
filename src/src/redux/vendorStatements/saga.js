import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { push } from 'react-router-redux'
import axiosMethod from '../../utilities/apiCaller'

import actions from './action'

const { cAPrivatePost, cAPrivateGet } = axiosMethod

const uploadBalanceStatements = (value, token) => {
  return cAPrivatePost(`payments/vendor-statements/upload`, value, token).then(response => {
    return response.data
  })
}

export function* uploadVendorBalanceStatements(values) {
  try {
    const response = yield call(uploadBalanceStatements, values.value, values.token)
    yield put({
      type: actions.UPLOAD_VENDOR_BALANCE_STATEMENTS_SUCCESS,
      value: response,
    })
    yield put(push(`/statements-upload-files-list`))
    notification.success({
      message: 'File upload successful',
      description: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.UPLOAD_VENDOR_BALANCE_STATEMENTS_FAILURE,
      payload: err.response.data.data,
    })
    notification.error({
      message: 'Upload Failed ...!',
      description: 'Please check the below error',
    })
  }
}

const uploadVendorTxnstatements = (value, token) => {
  return cAPrivatePost(`payments/vendor-statements/upload`, value, token).then(response => {
    return response.data
  })
}

export function* uploadVendorTransactionStatements(values) {
  try {
    const response = yield call(uploadVendorTxnstatements, values.value, values.token)
    yield put({
      type: actions.UPLOAD_VENDOR_TRANSACTIONS_STATEMENTS_SUCCESS,
      value: response,
    })
    yield put(push(`/statements-upload-files-list`))
    notification.success({
      message: 'File upload successful',
      description: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.UPLOAD_VENDOR_TRANSACTIONS_STATEMENTS_FAILURE,
      payload: err.response.data.data,
    })
    notification.error({
      message: 'Upload Failed ...!',
      description: 'Please check the below error',
    })
  }
}

const getAllVendorStatementsList = token => {
  return cAPrivateGet(`payments/vendor-statements/s3Files`, token).then(response => {
    return response.data
  })
}

export function* getAllVendorStatements(values) {
  try {
    const response = yield call(getAllVendorStatementsList, values.token)
    yield put({
      type: actions.GET_ALL_VENDOR_STATEMENTS_SUCCESS,
      value: response.data,
      total: response.data.length,
    })
    // notification.success({
    //   message: 'Success ...!',
    //   description: response.message,
    // })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_VENDOR_STATEMENTS_FAILURE,
      payload: err,
    })
  }
}

const getVendorStatementFileByFileName = (filename, token) => {
  return cAPrivateGet(`payments/vendor-statements/s3Files/${filename}`, token).then(response => {
    return response.data
  })
}

export function* getVendorStatementsFileByFileName(values) {
  try {
    const response = yield call(getVendorStatementFileByFileName, values.filename, values.token)
    yield put({
      type: actions.GET_VENDOR_STATEMENTS_BY_FILENAME_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: 'Success ...!',
      description: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.GET_VENDOR_STATEMENTS_BY_FILENAME_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.UPLOAD_VENDOR_BALANCE_STATEMENTS, uploadVendorBalanceStatements),
    takeEvery(actions.UPLOAD_VENDOR_TRANSACTIONS_STATEMENTS, uploadVendorTransactionStatements),

    takeEvery(actions.GET_ALL_VENDOR_STATEMENTS, getAllVendorStatements),

    takeEvery(actions.GET_VENDOR_STATEMENTS_BY_FILENAME, getVendorStatementsFileByFileName),
  ])
}
