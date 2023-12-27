import { all, takeEvery, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import actions from './action'

const { cAPrivateGet, cAPrivatePost, cAPrivatePut, cAPrivateDelete } = axiosMethod

const getAllPaymentProcess = token => {
  return cAPrivateGet(`payment-process-flow`, token).then(response => {
    return response.data.data
  })
}

export function* getAllPaymentProcessList(values) {
  const { token } = values
  try {
    const response = yield call(getAllPaymentProcess, token)
    yield put({
      type: actions.GET_ALL_PAYMENTS_PROCESS_LIST_SUCCESS,
      value: response.Items,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_PAYMENTS_PROCESS_LIST_FAILURE,
      payload: err,
    })
  }
}

const addProcessFlow = (body, token) => {
  return cAPrivatePost(`payment-process-flow`, body, token).then(response => {
    return response.data
  })
}

export function* addNewProcessFlow(values) {
  const { value, token } = values

  try {
    const response = yield call(addProcessFlow, value, token)
    yield put({
      type: actions.ADD_NEW_PROCESS_FLOW_SUCCESS,
      value: response.data,
    })
    yield put(push('/payment-order-list'))
    notification.success({
      message: 'Success!',
      description: `Process flow created successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_PROCESS_FLOW_FAILURE,
      payload: err.response.data.message,
    })

    notification.error({
      message: err.response.data.message,
      description: 'Failed to create the record',
    })
  }
}

const editProcessFlowData = (id, body, token) => {
  return cAPrivatePut(`payment-process-flow/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editProcessFlow(values) {
  const { id, value, token } = values

  try {
    const response = yield call(editProcessFlowData, id, value, token)
    yield put({
      type: actions.EDIT_NEW_PROCESS_FLOW_SUCCESS,
      value: response,
    })
    yield put(push('/payment-order-list'))
    notification.success({
      message: 'Success!',
      description: `Process flow updated successfully`,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_NEW_PROCESS_FLOW_FAILURE,
      payload: err.response.data.message,
    })

    notification.error({
      message: err.response.data.message,
      description: 'Failed to edit the record',
    })
  }
}

const deleteProcessFlowById = (id, token) => {
  return cAPrivateDelete(`payment-process-flow/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteProcessFlow(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteProcessFlowById, id, token)
    yield put({
      type: actions.DELETE_PROCESS_FLOW_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: `Deleted record successfully`,
    })
    yield put({
      type: actions.GET_ALL_PAYMENTS_PROCESS_LIST,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_PROCESS_FLOW_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to delete the record',
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ALL_PAYMENTS_PROCESS_LIST, getAllPaymentProcessList),
    takeEvery(actions.ADD_NEW_PROCESS_FLOW, addNewProcessFlow),
    takeEvery(actions.EDIT_NEW_PROCESS_FLOW, editProcessFlow),
    takeEvery(actions.DELETE_PROCESS_FLOW, deleteProcessFlow),
  ])
}
