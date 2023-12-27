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

const getPermissionsList = token => {
  return clientConnectPrivateGet(`permissions?limit=0`, token).then(response => {
    return response.data.data
  })
}

export function* getPermissions(values) {
  const { value } = values
  try {
    const response = yield call(getPermissionsList, value)
    yield put({
      type: actions.GET_PERMISSIONS_SUCCESS,
      value: response.permission,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PERMISSIONS_FAILURE,
      payload: err,
    })
  }
}

const addPermission = (value, token) => {
  return clientConnectPrivatePost(`permissions`, value, token).then(response => {
    return response.data.data
  })
}

export function* addNewPermission(values) {
  const { value, token } = values
  try {
    const response = yield call(addPermission, value, token)
    yield put({
      type: actions.ADD_NEW_PERMISSION_SUCCESS,
      value: response.permission,
    })
    notification.success({
      message: 'Success!',
      description: `Created successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_PERMISSION_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to created the record',
    })
  }
}

const editPermission = (id, value, token) => {
  return clientConnectPrivatePut(`permissions/${id}`, value, token).then(response => {
    return response.data.data
  })
}

export function* editSelectedPermission(values) {
  const { id, value, token } = values
  try {
    const response = yield call(editPermission, id, value, token)
    yield put({
      type: actions.EDIT_PERMISSION_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Updated successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_PERMISSION_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: 'Failed to update the record',
    })
  }
}

const deletePermission = (id, token) => {
  return clientConnectPrivateDelete(`permissions/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteSelectedPermission(values) {
  const { id, token } = values
  try {
    const response = yield call(deletePermission, id, token)
    yield put({
      type: actions.DELETE_PERMISSION_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_PERMISSION_FAILURE,
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
    takeEvery(actions.GET_PERMISSIONS, getPermissions),
    takeEvery(actions.ADD_NEW_PERMISSION, addNewPermission),
    takeEvery(actions.EDIT_PERMISSION, editSelectedPermission),
    takeEvery(actions.DELETE_PERMISSION, deleteSelectedPermission),
  ])
}
