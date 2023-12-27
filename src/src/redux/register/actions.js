const actions = {
  UPDATE_PASSWORD_STRENGTH: 'UPDATE_PASSWORD_STRENGTH',

  NEW_REGISTRATION: 'NEW_REGISTRATION',
  NEW_REGISTRATION_SUCCESS: 'NEW_REGISTRATION_SUCCESS',
  NEW_REGISTRATION_FAILURE: 'NEW_REGISTRATION_FAILURE',

  ADD_USER_INFORMATION: 'ADD_USER_INFORMATION',
  ADD_USER_INFORMATION_SUCCESS: 'ADD_USER_INFORMATION_SUCCESS',
  ADD_USER_INFORMATION_FAILURE: 'ADD_USER_INFORMATION_FAILURE',

  UPDATE_EMAIL: 'UPDATE_EMAIL',

  SHOW_CHANGE_PASSWORD_MODAL: 'SHOW_CHANGE_PASSWORD_MODAL',
  CLOSE_CHANGE_PASSWORD_MODAL: 'CLOSE_CHANGE_PASSWORD_MODAL',
}

export default actions

export const updatePassowrdStrength = value => {
  return {
    type: actions.UPDATE_PASSWORD_STRENGTH,
    value,
  }
}

export const newUserRegistration = value => {
  return {
    type: actions.NEW_REGISTRATION,
    value,
  }
}

export const addUserInformation = (value, token) => {
  return {
    type: actions.ADD_USER_INFORMATION,
    value,
    token,
  }
}

export const updateEmail = (value, token) => {
  return {
    type: actions.UPDATE_EMAIL,
    value,
    token,
  }
}

export const showChangePasswordModal = () => {
  return {
    type: actions.SHOW_CHANGE_PASSWORD_MODAL,
  }
}

export const closeChangePasswordModal = () => {
  return {
    type: actions.CLOSE_CHANGE_PASSWORD_MODAL,
  }
}
