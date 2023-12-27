import { all, takeEvery, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import generalActions from 'redux/general/actions'
import axiosMethod from '../../utilities/apiCaller'

import actions from './actions'

const { txnPrivateGet, txnPrivatePost, txnPrivatePut, txnPrivateDelete } = axiosMethod

const getCryptoBeneficiaries = (values, token) => {
  const querySymbol =
    values.page ||
    values.limit ||
    values.clientId ||
    values.vendorId ||
    values.aliasName ||
    values.cryptoCurrency ||
    values.beneStatus
      ? '?'
      : ''
  const page = values.page ? encodeURI(`page=${values.page}`) : ''
  const limit = values.limit ? encodeURI(`&limit=${values.limit}`) : ''
  const clientId = values.clientId ? `&clientId=${values.clientId}` : ''
  const vendorId = values.vendorId ? `&vendorId=${values.vendorId}` : ''
  const aliasName = values.aliasName ? `&aliasName=${values.aliasName}` : ''
  const cryptoCurrency = values.cryptoCurrency ? `&cryptoCurrency=${values.cryptoCurrency}` : ''
  const beneStatus = values.beneStatus ? `&beneStatus=${values.beneStatus}` : ''
  return txnPrivateGet(
    `tx-service/crypto-beneficiaries${querySymbol}${page}${limit}${clientId}${vendorId}${aliasName}${cryptoCurrency}${beneStatus}`,
    token,
  ).then(response => {
    const responseData = response.data.data
    const beneficiaries = responseData.beneficiaries.map(dataItem => {
      return {
        ...dataItem,
        clientOrVendor: dataItem.clientName || dataItem.vendorName,
      }
    })
    return {
      beneficiaries,
      total: response.data.data.total,
    }
  })
}
export function* getAllCryptoBeneficiaries(values) {
  const { value, token } = values
  try {
    const response = yield call(getCryptoBeneficiaries, value, token)
    yield put({
      type: actions.GET_CRYPTO_BENEFICIARIES_SUCCESS,
      value: response,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CRYPTO_BENEFICIARIES_FAILURE,
      payload: err,
    })
  }
}

const getcryptoBeneficiaryById = value => {
  return txnPrivateGet(`tx-service/crypto-beneficiaries/${value.id}`, value.token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getCryptoBeneficiaryById(id, token) {
  try {
    const response = yield call(getcryptoBeneficiaryById, id, token)
    yield put({
      type: actions.GET_CRYPTO_BENEFICIARY_BY_ID_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_CRYPTO_BENEFICIARY_BY_ID_FALIURE,
    })
  }
}

const createCryptoBeneficiary = (values, token) => {
  return txnPrivatePost(`tx-service/crypto-beneficiaries`, values, token).then(response => {
    return response.data.data
  })
}

export function* createNewCryptoBeneficiary(values) {
  try {
    const response = yield call(createCryptoBeneficiary, values.value, values.token)
    yield put({
      type: actions.CREATE_CRYPTO_BENEFICIARY_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: 'Created successfully',
    })
    if (response) {
      yield put(push('/cryptoBeneficiaries'))
    }
  } catch (err) {
    yield put({
      type: actions.CREATE_CRYPTO_BENEFICIARY_FAILURE,
      payload: err,
    })
  }
}

const updatecryptobeneficiary = values => {
  const { value, token } = values
  return txnPrivatePut(`tx-service/crypto-beneficiaries/${value.id}`, value, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateBeneficiaryStatus(values, token) {
  try {
    const response = yield call(updatecryptobeneficiary, values, token)
    notification.success({
      message: 'Updated successfully!',
    })
    yield put({
      type: generalActions.GET_ALL_CRYPTO_BENEFICIARIES,
      token: values.token,
    })
    yield put({
      type: actions.GET_CRYPTO_BENEFICIARIES,
      value: values.value.filters,
      token: values.token,
    })
    yield put({
      type: actions.UDPATE_CRYPTO_BENE_STATUS_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.UDPATE_CRYPTO_BENE_STATUS_FAILURE,
    })
    notification.warning({
      message: 'Something is went wrong',
      description: 'Please try again!',
    })
  }
}

export function* updateCryptoBeneficiary(values, token) {
  try {
    const response = yield call(updatecryptobeneficiary, values, token)
    yield put({
      type: actions.UPDATE_CRYPTO_BENEFICIARY_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Updated successfully!',
    })
    if (response) {
      yield put(push('/cryptoBeneficiaries'))
    }
    yield put({
      type: actions.GET_CRYPTO_BENEFICIARY_BY_ID,
      value: values.value,
      token: values.token,
    })
  } catch (e) {
    yield put({
      type: actions.UPDATE_CRYPTO_BENEFICIARY_FAILURE,
    })
    notification.warning({
      message: 'Something is went wrong',
      description: 'Please try again!',
    })
  }
}

const deletecryptoBeneficiary = (value, token) => {
  return txnPrivateDelete(`tx-service/crypto-beneficiaries/${value}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteCryptoBeneficiary(values) {
  try {
    const response = yield call(deletecryptoBeneficiary, values.value, values.token)
    yield put({
      type: actions.DELETE_CRYPTO_BENEFICIARY_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Deleted successfully!',
    })
    yield put({
      type: actions.GET_CRYPTO_BENEFICIARIES,
      value: '',
      token: values.token,
    })
  } catch (e) {
    yield put({
      type: actions.DELETE_CRYPTO_BENEFICIARY_FAILURE,
    })
    notification.warning({
      message: 'Something went wrong',
      description: 'Please try again!',
    })
  }
}

const getDownloadData = values => {
  const querySymbol =
    values.page ||
    values.limit !== undefined ||
    values.limit !== '' ||
    values.clientId ||
    values.vendorId ||
    values.aliasName ||
    values.cryptoCurrency ||
    values.beneStatus
      ? '?'
      : ''

  const page = values.page ? encodeURI(`page=${values.page}`) : ''
  const limit =
    values.limit !== undefined || values.limit !== '' ? encodeURI(`&limit=${values.limit}`) : ''
  const clientId = values.clientId ? `&clientId=${values.clientId}` : ''
  const vendorId = values.vendorId ? `&vendorId=${values.vendorId}` : ''
  const aliasName = values.aliasName ? `&aliasName=${values.aliasName}` : ''
  const cryptoCurrency = values.cryptoCurrency ? `&cryptoCurrency=${values.cryptoCurrency}` : ''
  const beneStatus = values.beneStatus ? `&beneStatus=${values.beneStatus}` : ''

  return txnPrivateGet(
    `tx-service/crypto-beneficiaries${querySymbol}${page}${limit}${clientId}${vendorId}${aliasName}${cryptoCurrency}${beneStatus}`,
    values.token,
  ).then(response => {
    const responseData = response.data.data
    const beneficiaries = responseData.beneficiaries.map(dataItem => {
      return {
        ...dataItem,
        clientOrVendor: dataItem.clientName || dataItem.vendorName,
      }
    })
    return {
      beneficiaries,
      total: response.data.data.total,
    }
  })
}

export function* getBulkDownload(values) {
  const { value } = values
  try {
    const response = yield call(getDownloadData, value)
    yield put({
      type: actions.GET_BULK_DOWNLOAD_FOR_CRYPTO_BENEFICIARY_SUCCESS,
      value: response.beneficiaries,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_BULK_DOWNLOAD_FOR_CRYPTO_BENEFICIARY_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CRYPTO_BENEFICIARIES, getAllCryptoBeneficiaries),
    takeEvery(actions.GET_CRYPTO_BENEFICIARY_BY_ID, getCryptoBeneficiaryById),
    takeEvery(actions.CREATE_CRYPTO_BENEFICIARY, createNewCryptoBeneficiary),
    takeEvery(actions.UPDATE_CRYPTO_BENEFICIARY, updateCryptoBeneficiary),
    takeEvery(actions.UDPATE_CRYPTO_BENE_STATUS, updateBeneficiaryStatus),
    takeEvery(actions.DELETE_CRYPTO_BENEFICIARY, deleteCryptoBeneficiary),
    takeEvery(actions.GET_BULK_DOWNLOAD_FOR_CRYPTO_BENEFICIARY, getBulkDownload),
  ])
}
