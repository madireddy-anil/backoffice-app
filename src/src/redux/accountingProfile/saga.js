import { all, put, call, takeLatest } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'

import actions from './actions'

const { cAPrivatePost, cAPrivatePut, cAPrivateGet, cAPrivateDelete } = axiosMethod

const getAllAccountingProfileList = (values, token) => {
  return cAPrivateGet(`accounting-profiles`, values, token).then(response => {
    return response.data.data
  })
}

export function* getAllAccountingProfile(values) {
  try {
    const response = yield call(getAllAccountingProfileList, values.value, values.token)
    yield put({
      type: actions.GET_ALL_ACCOUNTING_PROFILES_SUCCESS,
      value: response.accounting,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_ACCOUNTING_PROFILES_FAILURE,
      payload: err,
    })
  }
}

const getAccountingProfileData = (id, token) => {
  return cAPrivateGet(`accounting-profiles/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getAccountingProfileById(values) {
  try {
    const response = yield call(getAccountingProfileData, values.id, values.token)
    yield put({
      type: actions.GET_ACCOUNTING_PROFILE_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ACCOUNTING_PROFILE_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const addAccountingProfile = (values, token) => {
  return cAPrivatePost(`accounting-profiles`, values, token).then(response => {
    return response.data.data
  })
}

export function* addNewAccountingProfile(values) {
  try {
    const response = yield call(addAccountingProfile, values.value, values.token)
    yield put({
      type: actions.ADD_NEW_ACCOUNTING_PROFILE_SUCCESS,
      value: response,
    })
    yield put(push('/edit-accounting-pprofile'))
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_ACCOUNTING_PROFILE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const updateAccountingProfileData = (profileId, values, token) => {
  return cAPrivatePut(`accounting-profiles/${profileId}`, values, token).then(response => {
    return response.data.data
  })
}

export function* updateAccountingProfile(values) {
  const { profileId, value, token } = values
  try {
    const response = yield call(updateAccountingProfileData, profileId, value, token)
    yield put({
      type: actions.UPDATE_ACCOUNTING_PROFILE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_ACCOUNTING_PROFILE_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error!',
      description: 'Failed to update record',
    })
  }
}

const deleteAccountingProfileData = (profileId, values, token) => {
  return cAPrivateDelete(`accounting-profiles/${profileId}`, values, token).then(response => {
    return response.data.data
  })
}

export function* deleteAccountingProfile(values) {
  const { profileId, token } = values
  try {
    const response = yield call(deleteAccountingProfileData, profileId, token)
    yield put({
      type: actions.DELETE_ACCOUNTING_PROFILE_SUCCESS,
      value: response,
    })
    // yield put(push('/accounting-profile-list'))
  } catch (err) {
    yield put({
      type: actions.DELETE_ACCOUNTING_PROFILE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addProfileEntry = (values, token) => {
  return cAPrivatePost(`accounting-entries`, values, token).then(response => {
    return response.data.data
  })
}

export function* addAccountingProfileEntry(values) {
  try {
    const response = yield call(addProfileEntry, values.value, values.token)
    yield put({
      type: actions.ADD_ACCOUNTING_PROFILE_ENTRY_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_ACCOUNTING_PROFILE_ENTRY_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editProfileEntry = (id, values, token) => {
  return cAPrivatePut(`accounting-entries/${id}`, values, token).then(response => {
    return response.data.data
  })
}

export function* editAccountingProfileEntry(values) {
  try {
    const response = yield call(editProfileEntry, values.id, values.value, values.token)
    yield put({
      type: actions.EDIT_ACCOUNTING_PROFILE_ENTRY_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_ACCOUNTING_PROFILE_ENTRY_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error!',
      description: 'Failed to edit record',
    })
  }
}

const deleteAccountingEntryData = values => {
  const { entryId, profileId, token } = values
  return cAPrivateDelete(`/accounting-entries/${entryId}/${profileId}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteAccountingEntry(values) {
  try {
    const response = yield call(deleteAccountingEntryData, values)
    yield put({
      type: actions.DELETE_ACCOUNTING_ENTRY_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_ACCOUNTING_ENTRY_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_ALL_ACCOUNTING_PROFILES, getAllAccountingProfile),
    takeLatest(actions.GET_ACCOUNTING_PROFILE_BY_ID, getAccountingProfileById),

    takeLatest(actions.ADD_NEW_ACCOUNTING_PROFILE, addNewAccountingProfile),
    takeLatest(actions.UPDATE_ACCOUNTING_PROFILE, updateAccountingProfile),
    takeLatest(actions.DELETE_ACCOUNTING_PROFILE, deleteAccountingProfile),

    takeLatest(actions.ADD_ACCOUNTING_PROFILE_ENTRY, addAccountingProfileEntry),
    takeLatest(actions.EDIT_ACCOUNTING_PROFILE_ENTRY, editAccountingProfileEntry),
    takeLatest(actions.DELETE_ACCOUNTING_ENTRY, deleteAccountingEntry),
  ])
}
