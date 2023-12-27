import { all, call, put, takeEvery } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import Variables from '../../utilities/variables'
import actions from './action'

import axiosMethod from '../../utilities/apiCaller'

const { globalMessages } = Variables

const {
  clientConnectPrivateGet,
  clientConnectPrivatePost,
  clientConnectPrivatePut,
  // clientConnectPrivateDelete,
} = axiosMethod

const getAllUsers = token => {
  return clientConnectPrivateGet('users?limit=0', token).then(response => {
    return response.data.data
  })
}

export function* getUsersList(values) {
  try {
    const response = yield call(getAllUsers, values.token)
    yield put({
      type: actions.GET_ALL_USERS_LIST_SUCCESS,
      value: response.user,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_USERS_LIST_FAILURE,
      payload: err,
    })
  }
}

const addUser = (value, token) => {
  return clientConnectPrivatePost('users', value, token).then(response => {
    return response.data.data
  })
}

export function* addNewUser(values) {
  const { value, token } = values
  try {
    const response = yield call(addUser, value, token)
    yield put({
      type: actions.ADD_NEW_USER_SUCCESS,
      value: response.user,
    })
    notification.success({
      message: 'Success!',
      description: `Created successfully`,
    })
    yield put(push(`/users`))
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_USER_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to created the record',
    })
  }
}

const editRole = (id, value, token) => {
  return clientConnectPrivatePut(`users/${id}`, value, token).then(response => {
    return response.data.data
  })
}

export function* editSelectedRole(values) {
  const { id, value, token } = values
  try {
    const response = yield call(editRole, id, value, token)
    yield put({
      type: actions.EDIT_USER_SUCCESS,
      value: response,
    })
    yield put(push(`/users`))
    notification.success({
      message: 'Success!',
      description: `Updated successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_USER_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to update the record',
    })
  }
}

const deleteRole = (id, token) => {
  const value = {}
  return clientConnectPrivatePut(`users/${id}/block`, value, token).then(response => {
    return response.data.data
  })
}

export function* deleteSelectedRole(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteRole, id, token)
    yield put({
      type: actions.DELETE_USER_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_ALL_USERS_LIST,
      token,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_USER_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to delete the record',
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ALL_USERS_LIST, getUsersList),
    takeEvery(actions.ADD_NEW_USER, addNewUser),
    takeEvery(actions.EDIT_USER, editSelectedRole),
    takeEvery(actions.DELETE_USER, deleteSelectedRole),
  ])
}
