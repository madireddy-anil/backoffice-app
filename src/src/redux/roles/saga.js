import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'

import actions from './actions'

const { globalMessages } = Variables

const {
  clientConnectPrivateGet,
  clientConnectPrivatePut,
  clientConnectPrivatePost,
  clientConnectPrivateDelete,
} = axiosMethod

const getRolesList = token => {
  return clientConnectPrivateGet(`roles?limit=0`, token).then(response => {
    return response.data.data
  })
}

export function* getRoles(values) {
  const { token } = values
  try {
    const response = yield call(getRolesList, token)
    yield put({
      type: actions.GET_ROLES_SUCCESS,
      value: response.role,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ROLES_FAILURE,
      payload: err,
    })
  }
}

const addRole = (value, token) => {
  return clientConnectPrivatePost(`roles`, value, token).then(response => {
    return response.data.data
  })
}

export function* addNewRole(values) {
  const { value, token } = values
  try {
    const response = yield call(addRole, value, token)
    yield put({
      type: actions.ADD_NEW_ROLE_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Created successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_ROLE_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to created the record',
    })
  }
}

const editRole = (id, value, token) => {
  return clientConnectPrivatePut(`roles/${id}`, value, token).then(response => {
    return response.data.data
  })
}

export function* editSelectedRole(values) {
  const { id, value, token } = values
  try {
    const response = yield call(editRole, id, value, token)
    yield put({
      type: actions.EDIT_ROLE_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Updated successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_ROLE_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to update the record',
    })
  }
}

const deleteRole = (id, token) => {
  return clientConnectPrivateDelete(`roles/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteSelectedRole(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteRole, id, token)
    yield put({
      type: actions.DELETE_ROLE_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_ROLE_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to delete the record',
    })
  }
}

const getRoleById = (id, token) => {
  return clientConnectPrivateGet(`roles/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getRoleDataById(values) {
  const { token, id } = values
  try {
    const response = yield call(getRoleById, id, token)
    yield put({
      type: actions.GET_ROLE_DATA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ROLE_DATA_BY_ID_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ROLES, getRoles),
    takeEvery(actions.ADD_NEW_ROLE, addNewRole),
    takeEvery(actions.EDIT_ROLE, editSelectedRole),
    takeEvery(actions.DELETE_ROLE, deleteSelectedRole),
    takeEvery(actions.GET_ROLE_DATA_BY_ID, getRoleDataById),
  ])
}
