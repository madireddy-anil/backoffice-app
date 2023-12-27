import { all, takeEvery, put, call } from 'redux-saga/effects'
// import { push } from 'react-router-redux'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'
import actions from './actions'

const { ccAuthPrivatePost } = axiosMethod
const { globalMessages } = Variables

const newUserRegistration = values => {
  values.portal = 'cms'
  return ccAuthPrivatePost(`auth/signup`, values).then(response => {
    return response.data.data
  })
}

export function* newRegistration(values) {
  const { value } = values
  try {
    const response = yield call(newUserRegistration, value)
    yield put({
      type: actions.NEW_REGISTRATION_SUCCESS,
      value: response.mfa_token,
    })
    // yield put(push('/user/personal-details'))
  } catch (err) {
    yield put({
      type: actions.NEW_REGISTRATION_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: err.response.data.message,
    })
  }
}

const addUserInformation = (body, token) => {
  return ccAuthPrivatePost(`profile`, body, token).then(response => {
    return response.data.data
  })
}

export function* userInformation(values) {
  try {
    const response = yield call(addUserInformation, values.value, values.token)
    yield put({
      type: actions.ADD_USER_INFORMATION_SUCCESS,
      value: response.access_token,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_USER_INFORMATION_FAILURE,
      payload: err.response,
    })
    notification.error({
      message: globalMessages.errorMessage,
      // description: err.response.data.message,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.NEW_REGISTRATION, newRegistration),
    takeEvery(actions.ADD_USER_INFORMATION, userInformation),
  ])
}
