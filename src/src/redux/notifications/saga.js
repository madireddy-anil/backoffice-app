import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'

import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'

import actions from './actions'

const { chatPrivateGet, chatPrivatePut } = axiosMethod
const { globalMessages } = Variables

const getAllNotifications = (email, token) => {
  return chatPrivateGet(
    `chat-service/notifications?email=${email}&orderBy=messageIndex&sortBy=desc&limit=0`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getAllNotificationItems(values) {
  try {
    const response = yield call(getAllNotifications, values.email, values.token)
    yield put({
      type: actions.GET_ALL_NOTIFICATIONS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_NOTIFICATIONS_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateReadStatus = (email, value, token) => {
  const body = value
  return chatPrivatePut(`chat-service/notifications?email=${email}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateNotificationRedability(values) {
  try {
    const response = yield call(updateReadStatus, values.email, values.value, values.token)
    yield put({
      type: actions.UPDATE_READ_STATUS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_READ_STATUS_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const markAllRead = (email, value, token) => {
  const body = value
  return chatPrivatePut(`chat-service/notifications?email=${email}`, body, token).then(response => {
    return response.data.data
  })
}

export function* markAllAsReadStatus(values) {
  try {
    const response = yield call(markAllRead, values.email, values.value, values.token)
    yield put({
      type: actions.MARK_ALL_TO_READ_STATUS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.MARK_ALL_TO_READ_STATUS_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_ALL_NOTIFICATIONS, getAllNotificationItems),
    takeLatest(actions.UPDATE_READ_STATUS, updateNotificationRedability),
    takeLatest(actions.MARK_ALL_TO_READ_STATUS, markAllAsReadStatus),
  ])
}
