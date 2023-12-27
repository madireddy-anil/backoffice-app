/* eslint-disable prefer-destructuring */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import generalActions from 'redux/general/actions'
import axiosMethod from '../../utilities/apiCaller'

import actions from './actions'

const { txnPrivateGet, txnPrivatePost, txnPrivatePut } = axiosMethod

const getBeneficiaries = (values, token) => {
  const querySymbol =
    values.page ||
    values.limit ||
    values.beneReference ||
    values.nameOnAccount ||
    values.beneficiaryType ||
    values.bankAccountCurrency ||
    values.accountNumber ||
    clientId ||
    vendorId ||
    values.bicsiwft ||
    values.beneStatus
      ? '?'
      : ''

  const clientId = values.clientId ? `&clientId=${values.clientId}` : ''
  const vendorId = values.vendorId ? `&vendorId=${values.vendorId}` : ''
  const page = values.page ? encodeURI(`page=${values.page}`) : ''
  const limit = values.limit ? encodeURI(`&limit=${values.limit}`) : encodeURI(`?limit=0`)
  const beneficiaryReference = values.beneReference
    ? encodeURI(`&beneReference=${values.beneReference}`)
    : ''
  const nameOnAccount = values.nameOnAccount ? encodeURI(`&id=${values.nameOnAccount}`) : ''
  const beneficiaryType = values.beneficiaryType
    ? encodeURI(`&beneficiaryDetails.beneficiaryType=${values.beneficiaryType}`)
    : ''
  const bankAccountCurrency = values.bankAccountCurrency
    ? encodeURI(`&bankAccountDetails.bankAccountCurrency=${values.bankAccountCurrency}`)
    : ''
  const bicsiwft = values.bicswift
    ? encodeURI(`&bankAccountDetails.bicswift=${values.bicswift}`)
    : ''
  const accountNumber = values.accountNumber
    ? encodeURI(`&bankAccountDetails.accountNumber=${values.accountNumber}`)
    : ''
  const beneStatus = values.beneStatus ? encodeURI(`&beneStatus=${values.beneStatus}`) : ''
  return txnPrivateGet(
    `tx-service/beneficiaries${querySymbol}${page}${limit}${beneficiaryReference}${accountNumber}${nameOnAccount}${beneficiaryType}${bankAccountCurrency}${bicsiwft}${beneStatus}${vendorId}${clientId}`,
    token,
  ).then(response => {
    return reStructureBeneficiary(response.data.data)
  })
}

const reStructureBeneficiary = response => {
  const newResponse = []

  const data = response.beneficiaries

  for (let i = 0; i < data.length; i += 1) {
    const newObj = data[i]
    if (data[i].vendorName) {
      newObj.clientOrVendor = data[i].vendorName
    } else if (data[i].clientName) {
      newObj.clientOrVendor = data[i].clientName
    } else {
      newObj.clientOrVendor = '---'
    }
    newResponse.push(newObj)
  }
  return { beneficiaries: newResponse, total: response.total }
}

export function* getAllBeneficiaries(values) {
  const { value, token } = values
  try {
    const response = yield call(getBeneficiaries, value, token)
    yield put({
      type: actions.GET_BENEFICIARIES_SUCCESS,
      value: response.beneficiaries,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_BENEFICIARIES_FAILURE,
      payload: err,
    })
  }
}

const getbeneficiaryById = value => {
  return txnPrivateGet(`tx-service/beneficiaries/${value.id}`, value.token).then(response => {
    return response.data.data
  })
}

export function* getBeneficiaryById(id, token) {
  try {
    const response = yield call(getbeneficiaryById, id, token)
    yield put({
      type: actions.GET_BENEFICIARY_BY_ID_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_BENEFICIARY_BY_ID_FALIURE,
    })
  }
}

const addbeneficiary = value => {
  return txnPrivatePost('tx-service/beneficiaries', value, value.token).then(response => {
    return response.data.data
  })
}

export function* addBeneficiary(value, token) {
  try {
    const response = yield call(addbeneficiary, value, token)
    yield put({
      type: actions.ADD_BENEFICIARY_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.ADD_BENEFICIARY_FAILURE,
    })
  }
}

const updatebeneficiary = values => {
  const { value, token } = values
  return txnPrivatePut(`tx-service/beneficiaries/${value.id}`, value, token).then(response => {
    return response.data.data
  })
}

export function* updateBeneficiaryStatus(values, token) {
  try {
    const response = yield call(updatebeneficiary, values, token)
    notification.success({
      message: 'Updated successfully!',
    })
    yield put({
      type: generalActions.GET_ALL_BENEFICIARIES,
      token: values.token,
    })
    yield put({
      type: actions.GET_BENEFICIARIES,
      value: values.value.filters,
      token: values.token,
    })
    yield put({
      type: actions.UPDATE_BENE_STATUS_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.UPDATE_BENE_STATUS_FAILURE,
    })
    notification.warning({
      message: 'Something is went wrong',
      description: 'Please try again!',
    })
  }
}

export function* updateBeneficiary(values, token) {
  try {
    const response = yield call(updatebeneficiary, values, token)
    yield put({
      type: actions.UPDATE_BENEFICIARY_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Updated successfully!',
    })
    yield put({
      type: generalActions.GET_ALL_BENEFICIARIES,
      token: values.token,
    })
    if (response) {
      yield put(push('/beneficiaries'))
    }
    yield put({
      type: actions.GET_BENEFICIARY_BY_ID,
      id: values.value.id,
      token: values.token,
    })
  } catch (e) {
    yield put({
      type: actions.UPDATE_BENEFICIARY_FAILURE,
    })
    notification.warning({
      message: 'Something is went wrong',
      description: 'Please try again!',
    })
  }
}

const createBeneficiary = (values, token) => {
  return txnPrivatePost(`tx-service/beneficiaries`, values, token).then(response => {
    return response.data.data
  })
}

export function* createNewBeneficiary(values) {
  const { value, token } = values
  try {
    const response = yield call(createBeneficiary, value, token)
    yield put({
      type: actions.CREATE_BENEFICIARY_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: 'Created successfully',
    })
    yield put({
      type: generalActions.GET_ALL_BENEFICIARIES,
      token,
    })
    if (response) {
      yield put(push('/beneficiaries'))
    }
  } catch (err) {
    yield put({
      type: actions.CREATE_BENEFICIARY_FAILURE,
      payload: err,
    })
  }
}

const getDownloadData = values => {
  const { value } = values

  const querySymbol =
    value.page ||
    value.limit ||
    value.beneficiaryReference ||
    value.nameOnAccount ||
    value.beneficiaryType ||
    value.bankAccountCurrency ||
    value.accountNumber ||
    value.clientId ||
    value.vendorId ||
    value.bicsiwft ||
    value.beneStatus
      ? '?'
      : ''

  const clientId = value.clientId ? `&clientId=${value.clientId}` : ''
  const vendorId = value.vendorId ? `&vendorId=${value.vendorId}` : ''
  const page = value.page ? encodeURI(`page=${values.page}`) : ''
  const limit = value.limit ? encodeURI(`&limit=${value.limit}`) : encodeURI(`?limit=0`)
  const beneficiaryReference = value.beneReference
    ? encodeURI(`&beneReference=${value.beneReference}`)
    : ''
  const nameOnAccount = value.nameOnAccount
    ? encodeURI(`&bankAccountDetails.nameOnAccount=${value.nameOnAccount}`)
    : ''
  const beneficiaryType = value.beneficiaryType
    ? encodeURI(`&beneficiaryDetails.beneficiaryType=${value.beneficiaryType}`)
    : ''
  const bankAccountCurrency = value.bankAccountCurrency
    ? encodeURI(`&bankAccountDetails.bankAccountCurrency=${value.bankAccountCurrency}`)
    : ''
  const bicsiwft = value.bicsiwft ? encodeURI(`&bankAccountDetails.bicsiwft=${value.bicsiwft}`) : ''
  const beneStatus = value.beneStatus ? encodeURI(`&beneStatus=${value.beneStatus}`) : ''
  return txnPrivateGet(
    `tx-service/beneficiaries${querySymbol}${page}${limit}${beneficiaryReference}${nameOnAccount}${beneficiaryType}${bankAccountCurrency}${bicsiwft}${beneStatus}${vendorId}${clientId}`,
    value.token,
  ).then(response => {
    return reStructureBeneficiary(response.data.data)
  })
}

export function* getBulkDownload(values) {
  try {
    const response = yield call(getDownloadData, values)

    yield put({
      type: actions.GET_BULK_DOWNLOAD_FOR_BENEFICIARY_SUCCESS,
      value: response.beneficiaries,
    })
    notification.success({
      message: 'Success!',
      description: 'Created successfully',
    })
  } catch (err) {
    yield put({
      type: actions.GET_BULK_DOWNLOAD_FOR_BENEFICIARY_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_BENEFICIARIES, getAllBeneficiaries),
    takeEvery(actions.GET_BENEFICIARY_BY_ID, getBeneficiaryById),
    takeEvery(actions.ADD_BENEFICIARY, addBeneficiary),
    takeEvery(actions.UPDATE_BENEFICIARY, updateBeneficiary),
    takeEvery(actions.UPDATE_BENE_STATUS, updateBeneficiaryStatus),
    takeEvery(actions.CREATE_BENEFICIARY, createNewBeneficiary),
    takeEvery(actions.GET_BULK_DOWNLOAD_FOR_BENEFICIARY, getBulkDownload),
  ])
}
