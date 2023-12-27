const actions = {
  LOGIN: 'LOGIN',
  LOGIN_SUCCESS_DEPRECATED: 'LOGIN_SUCCESS_DEPRECATED',
  LOGIN_FAILURE_DEPRECATED: 'LOGIN_FAILURE_DEPRECATED',

  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',

  GET_USER_DATA_DEPRECATED: 'GET_USER_DATA_DEPRECATED',
  GET_USER_DATA_SUCCESS_DEPRECATED: 'GET_USER_DATA_SUCCESS_DEPRECATED',
  GET_USER_DATA_FAILURE_DEPRECATED: 'GET_USER_DATA_FAILURE_DEPRECATED',

  GET_USER_DATA: 'GET_USER_DATA',
  GET_USER_DATA_SUCCESS: 'GET_USER_DATA_SUCCESS',
  GET_USER_DATA_FAILURE: 'GET_USER_DATA_FAILURE',

  SEND_RESET_EMAIL_DEPRECATED: 'SEND_RESET_EMAIL_DEPRECATED',
  SEND_RESET_EMAIL_SUCCESS_DEPRECATED: 'SEND_RESET_EMAIL_SUCCESS_DEPRECATED',
  SEND_RESET_EMAIL_FALIURE_DEPRECATED: 'SEND_RESET_EMAIL_FALIURE_DEPRECATED',

  SEND_RESET_EMAIL: 'SEND_RESET_EMAIL',
  SEND_RESET_EMAIL_SUCCESS: 'SEND_RESET_EMAIL_SUCCESS',
  SEND_RESET_EMAIL_FALIURE: 'SEND_RESET_EMAIL_FALIURE',

  RESET_PASSWORD: 'RESET_PASSWORD',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_FALIURE: 'RESET_PASSWORD_FALIURE',

  RESET_PASSWORD_DEPRECATED: 'RESET_PASSWORD_DEPRECATED',
  RESET_PASSWORD_SUCCESS_DEPRECATED: 'RESET_PASSWORD_SUCCESS_DEPRECATED',
  RESET_PASSWORD_FALIURE_DEPRECATED: 'RESET_PASSWORD_FALIURE_DEPRECATED',

  GET_OPS_USERS: 'GET_OPS_USERS',
  GET_OPS_USERS_SUCCESS: 'GET_OPS_USERS_SUCCESS',
  GET_OPS_USERS_FAILURE: 'GET_OPS_USERS_FAILURE',

  GET_USERS_BY_CLIENT: 'GET_USERS_BY_CLIENT',
  GET_USERS_BY_CLIENT_SUCCESS: 'GET_USERS_BY_CLIENT_SUCCESS',
  GET_USERS_BY_CLIENT_FAILURE: 'GET_USERS_BY_CLIENT_FAILURE',

  SET_TOKEN: 'SET_TOKEN',

  LOG_OUT: 'LOG_OUT',

  RESET_USER_STATE: 'RESET_USER_STATE',

  SETUP_MFA_AUTHENTICATOR: 'SETUP_MFA_AUTHENTICATOR',
  SETUP_MFA_AUTHENTICATOR_SUCCESS: 'SETUP_MFA_AUTHENTICATOR_SUCCESS',
  SETUP_MFA_AUTHENTICATOR_FAILURE: 'SETUP_MFA_AUTHENTICATOR_FAILURE',

  AUTHORIZE_CODE_2FA: 'AUTHORIZE_CODE_2FA',
  AUTHORIZE_CODE_2FA_SUCCESS: 'AUTHORIZE_CODE_2FA_SUCCESS',
  AUTHORIZE_CODE_2FA_FAILURE: 'AUTHORIZE_CODE_2FA_FAILURE',

  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_FALIURE: 'CHANGE_PASSWORD_FALIURE',
}
export default actions

export const resetUserState = () => {
  return {
    type: actions.RESET_USER_STATE,
  }
}

export const userLogin = payload => {
  return {
    type: actions.LOGIN,
    payload,
  }
}

export const changePassword = values => {
  return {
    type: actions.CHANGE_PASSWORD,
    values,
  }
}

export const validateOtp = values => {
  return {
    type: actions.AUTHORIZE_CODE_2FA,
    values,
  }
}

export const setup2FactorAuth = value => {
  return {
    type: actions.SETUP_MFA_AUTHENTICATOR,
    values: value,
  }
}

export const getUserDataDeprecated = (email, token) => {
  return {
    type: actions.GET_USER_DATA_DEPRECATED,
    email,
    token,
  }
}

export const setToken = token => {
  return {
    type: actions.SET_TOKEN,
    token,
  }
}

export const userLogOut = () => {
  return {
    type: actions.LOG_OUT,
  }
}

export const sendEmailToResetPassword = value => {
  return {
    type: actions.SEND_RESET_EMAIL,
    values: value,
  }
}

export const sendEmailToResetPasswordDeprecated = value => {
  return {
    type: actions.SEND_RESET_EMAIL_DEPRECATED,
    values: value,
  }
}

export const resetPasswordDeprecated = value => {
  return {
    type: actions.RESET_PASSWORD_DEPRECATED,
    values: value,
  }
}

export const resetPassword = value => {
  return {
    type: actions.RESET_PASSWORD,
    values: value,
  }
}

export const getOpsUsers = token => {
  return {
    type: actions.GET_OPS_USERS,
    token,
  }
}

export const getClientUsers = (clientId, token) => {
  return {
    type: actions.GET_USERS_BY_CLIENT,
    clientId,
    token,
  }
}
