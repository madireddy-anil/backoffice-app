import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { push } from 'react-router-redux'
import method from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'
import actions from './actions'

import {
  getAllCurrencies,
  getAllIntroducers,
  getAllMerchants,
  getAllClients,
  getAllCountries,
  getAllVendors,
  getAllBeneficiaries,
  getAllStreamChannels,
  getCryptoBeneficiaries,
  getAllVendorsList,
  getAllCompaniesList,
  getAllProductsList,
  getAllBrandsList,
  getAllEntities,
  getAllClientsByKycStatusPass,
} from '../general/saga'
import { getUsersList } from '../users/saga'
import { getChatAccessToken } from '../chat/saga'
import { getAllNotificationItems } from '../notifications/saga'

const { urls } = Variables
const { globalMessages } = Variables

const userLoginDeprecated = userCredentials => {
  return method
    .authPrivatePost('authenticate/login', userCredentials)
    .then(response => {
      return response.data
    })
    .catch(err => {
      notification.warning({
        err,
        message: 'Wrong Credientials',
        description: 'Login Failed, Try Again',
      })
    })
}

const userLogin = userCredentials => {
  userCredentials.portal = 'bms'
  return method
    .clientConnectPrivatePost('auth/login', userCredentials)
    .then(response => {
      return response.data.data
    })
    .catch(err => {
      notification.warning({
        err,
        message: err.response.data.message,
        description: 'Login Failed, Try Again',
      })
    })
}

export function* setLogin(payload) {
  const { values, isAuthDeprecated } = payload.payload
  let userLoginResponseDeprecated = {}
  let loginResponse = {}

  if (isAuthDeprecated) {
    try {
      userLoginResponseDeprecated = yield call(userLoginDeprecated, values)
      yield put({
        type: actions.LOGIN_SUCCESS_DEPRECATED,
        value: userLoginResponseDeprecated.data,
      })
      const { email } = values
      const { token } = userLoginResponseDeprecated.data

      yield all([
        call(userDetailsDeprecated, { email, token }),
        call(getChatAccessToken, { values: { email, token } }),
        call(getAllIntroducers, { token }),
        call(getAllMerchants, { token }),
        call(getAllClients, { token }),
        call(getAllCurrencies, { token }),
        call(getAllCountries, { token }),
        call(getAllVendors, { token }),
        call(getAllBeneficiaries, { token }),
        call(getAllStreamChannels, { token }),
        call(getCryptoBeneficiaries, { token }),
        call(getAllNotificationItems, { email, token }),
        call(getAllClientsByKycStatusPass, { token }),
      ])
    } catch (err) {
      yield put({
        type: actions.LOGIN_FAILURE_DEPRECATED,
        payload: err,
      })
    }
  } else {
    try {
      loginResponse = yield call(userLogin, values)
      if (loginResponse) {
        yield put({
          type: actions.LOGIN_SUCCESS,
          value: loginResponse,
        })
      }

      if (!loginResponse.isMFAset) {
        yield put(push(urls.setUp2faUrl))
      }

      if (loginResponse.isMFAset) {
        yield put(push(urls.codeValidatorUrl))
      }

      if (!loginResponse.isMFAset) {
        yield put({
          type: actions.SETUP_MFA_AUTHENTICATOR,
          values: loginResponse,
        })
      }
    } catch (err) {
      yield put({
        type: actions.LOGIN_FAILURE,
        payload: err,
      })
    }
  }
}

const set2FactorAuth = value => {
  const values = {
    authenticator_types: ['otp'],
    mfa_token: value.mfa_token,
  }
  return method.clientConnectPrivatePost('auth/setup-authenticator', values).then(response => {
    return response.data.data
  })
}

export function* setup2FactorAuth(value) {
  try {
    const mfaDetails = yield call(set2FactorAuth, value.values)
    yield put({
      type: actions.SETUP_MFA_AUTHENTICATOR_SUCCESS,
      value: mfaDetails,
    })
  } catch (err) {
    yield put({
      type: actions.SETUP_MFA_AUTHENTICATOR_FAILURE,
      payload: err,
    })
  }
}

const twoFactorAuthorization = values => {
  return method.clientConnectPrivatePost('auth/login/otp', values).then(response => {
    return response.data.data
  })
}

export function* validate2FACode(value) {
  try {
    const response = yield call(twoFactorAuthorization, value.values)
    yield put({
      type: actions.AUTHORIZE_CODE_2FA_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_USER_DATA,
      values: response.access_token,
    })
  } catch (e) {
    yield put({
      type: actions.AUTHORIZE_CODE_2FA_FAILURE,
    })
    notification.warning({
      message: 'You have entered wrong code',
      description: 'Try Again',
    })
  }
}

const getUserDataDeprecated = values => {
  return method
    .authPrivateGet(`authenticate/user/${values.email}`, values.token)
    .then(response => {
      return response.data.data
    })
    .catch(err => {
      notification.warning({
        err,
        message: 'Something went wrong, try again',
      })
    })
}

export function* userDetailsDeprecated(values) {
  try {
    const response = yield call(getUserDataDeprecated, values)
    yield put({
      type: actions.GET_USER_DATA_SUCCESS_DEPRECATED,
      value: response,
    })

    if (response) {
      notification.success({
        message: 'Logged In',
        description: 'You have successfully loggedIn',
      })
    }
  } catch (err) {
    yield put({
      type: actions.GET_USER_DATA_FAILURE_DEPRECATED,
      payload: err,
    })
  }
}

const getUserData = token => {
  return method
    .clientConnectPrivateGet(`profile`, token)
    .then(response => {
      return response.data.data
    })
    .catch(err => {
      notification.warning({
        err,
        message: 'Something went wrong, try again',
      })
    })
}

export function* userDetails(value) {
  try {
    const response = yield call(getUserData, value.values)

    yield put({
      type: actions.GET_USER_DATA_SUCCESS,
      value: response,
    })

    if (response) {
      notification.success({
        message: 'Logged In',
        description: 'You have successfully loggedIn',
      })
    }

    const { email } = response
    const token = value.values

    yield all([
      call(getChatAccessToken, { values: { email, token } }),
      call(getAllIntroducers, { token }),
      call(getAllMerchants, { token }),
      call(getAllClients, { token }),
      call(getAllCurrencies, { token }),
      call(getAllCountries, { token }),
      call(getAllVendors, { token }),
      call(getAllBeneficiaries, { token }),
      call(getAllStreamChannels, { token }),
      call(getCryptoBeneficiaries, { token }),
      call(getAllNotificationItems, { email, token }),
      call(getAllVendorsList, { token }),
      call(getAllCompaniesList, { token }),
      call(getAllProductsList, { token }),
      call(getAllBrandsList, { token }),
      call(getUsersList, { token }),
      call(getAllEntities, { token }),
      call(getAllClientsByKycStatusPass, { token }),
    ])
  } catch (err) {
    yield put({
      type: actions.GET_USER_DATA_FAILURE,
      payload: err,
    })
  }
}

const sendEmail = value => {
  const email = value.values

  return method.clientConnectPrivatePost('auth/password/reset', email).then(response => {
    return response.data
  })
}

export function* emailResetLink(values) {
  try {
    const response = yield call(sendEmail, values)
    if (response) {
      notification.success({
        message: response.message,
        description: 'Please reset your password from the registered email address.',
      })
    }
    yield put({
      type: actions.SEND_RESET_EMAIL_SUCCESS,
      value: response,
    })
  } catch (err) {
    notification.warning({
      err,
      message: 'Reset Failed',
      description: 'Email Incorrect,Please check',
    })
    yield put({
      type: actions.SEND_RESET_EMAIL_FALIURE,
      payload: err,
    })
  }
}

const sendEmailDeprecated = value => {
  const email = value.values

  return method.authPrivatePost('authenticate/password/reset', email).then(response => {
    return response.data
  })
}

export function* emailResetLinkDeprecated(values) {
  try {
    const response = yield call(sendEmailDeprecated, values)
    if (response) {
      notification.success({
        message: response.message,
        description: 'Please reset your password from the registered email address.',
      })
    }
    yield put({
      type: actions.SEND_RESET_EMAIL_SUCCESS_DEPRECATED,
      value: response,
    })
  } catch (err) {
    notification.warning({
      err,
      message: 'Reset Failed',
      description: 'Email Incorrect,Please check',
    })
    yield put({
      type: actions.SEND_RESET_EMAIL_FALIURE_DEPRECATED,
      payload: err,
    })
  }
}

export function* resetPassword(value) {
  try {
    const response = yield call(updatePassword, value.values)
    if (response) {
      notification.success({
        message: 'Password Reset Successful',
        description: 'Please Login',
      })
    }
    yield put({
      type: actions.RESET_PASSWORD_SUCCESS,
      value: response,
    })

    yield put(push('login'))
  } catch (err) {
    notification.warning({
      err,
      message: 'Update password falied',
    })
    yield put({
      type: actions.RESET_PASSWORD_FALIURE,
      payload: err,
    })
  }
}

const updatePassword = value => {
  return method.authPrivatePost('authenticate/password/change', value).then(response => {
    return response.data
  })
}

const getAgents = token => {
  return method.authPrivateGet('authenticate/user?userType=ops', token).then(response => {
    return response.data.data
  })
}

export function* getOpsUsers(values) {
  try {
    const response = yield call(getAgents, values.token)
    yield put({
      type: actions.GET_OPS_USERS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_OPS_USERS_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getUsersByClient = (clientId, token) => {
  return method.authPrivateGet(`authenticate/user?clientId=${clientId}`, token).then(response => {
    return response.data.data
  })
}

export function* getClientUsers(values) {
  try {
    const response = yield call(getUsersByClient, values.clientId, values.token)
    yield put({
      type: actions.GET_USERS_BY_CLIENT_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_USERS_BY_CLIENT_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updatePasswordDeprecated = value => {
  return method.authPrivatePost('authenticate/password/change', value).then(response => {
    return response.data
  })
}
export function* resetPasswordDeprecated(value) {
  try {
    const response = yield call(updatePasswordDeprecated, value.values)
    if (response) {
      notification.success({
        message: 'Password Reset Successful',
        description: 'Please Login',
      })
    }
    yield put({
      type: actions.RESET_PASSWORD_SUCCESS_DEPRECATED,
      value: response,
    })

    yield put(push('login'))
  } catch (err) {
    notification.warning({
      err,
      message: 'Update password falied',
    })
    yield put({
      type: actions.RESET_PASSWORD_FALIURE_DEPRECATED,
      payload: err,
    })
  }
}

const changeUserPassword = body => {
  return method.clientConnectPrivatePost('auth/password/change', body).then(response => {
    return response
  })
}

export function* changePassword(value) {
  try {
    const response = yield call(changeUserPassword, value.values)
    if (response) {
      notification.success({
        message: response.data.message,
      })
    }
    yield put({
      type: actions.CHANGE_PASSWORD_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CHANGE_PASSWORD_FALIURE,
      payload: err.response.data.message,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOGIN, setLogin),
    takeLatest(actions.GET_USER_DATA_DEPRECATED, userDetailsDeprecated),
    takeLatest(actions.GET_USER_DATA, userDetails),
    takeLatest(actions.SEND_RESET_EMAIL_DEPRECATED, emailResetLinkDeprecated),
    takeLatest(actions.SEND_RESET_EMAIL, emailResetLink),
    takeLatest(actions.RESET_PASSWORD_DEPRECATED, resetPasswordDeprecated),
    takeLatest(actions.RESET_PASSWORD, resetPassword),
    takeLatest(actions.CHANGE_PASSWORD, changePassword),
    takeLatest(actions.GET_OPS_USERS, getOpsUsers),
    takeLatest(actions.GET_USERS_BY_CLIENT, getClientUsers),
    takeLatest(actions.SETUP_MFA_AUTHENTICATOR, setup2FactorAuth),
    takeLatest(actions.AUTHORIZE_CODE_2FA, validate2FACode),
  ])
}
