const actions = {
  UPDATE_SELECTED_USER: 'UPDATE_SELECTED_USER',

  GET_ALL_USERS_LIST: 'GET_ALL_USERS_LIST',
  GET_ALL_USERS_LIST_SUCCESS: 'GET_ALL_USERS_LIST_SUCCESS',
  GET_ALL_USERS_LIST_FAILURE: 'GET_ALL_USERS_LIST_FAILURE',

  ADD_NEW_USER: 'ADD_NEW_USER',
  ADD_NEW_USER_SUCCESS: 'ADD_NEW_USER_SUCCESS',
  ADD_NEW_USER_FAILURE: 'ADD_NEW_USER_FAILURE',

  UPDATE_PASSWORD_STRENGTH: 'UPDATE_PASSWORD_STRENGTH',

  EDIT_USER: 'EDIT_USER',
  EDIT_USER_SUCCESS: 'EDIT_USER_SUCCESS',
  EDIT_USER_FAILURE: 'EDIT_USER_FAILURE',

  DELETE_USER: 'DELETE_USER',
  DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
  DELETE_USER_FAILURE: 'DELETE_USER_FAILURE',

  UPDATE_SEARCH_USERS: 'UPDATE_SEARCH_USERS',
}
export default actions

export const updateSelectedUser = value => {
  return {
    type: actions.UPDATE_SELECTED_USER,
    value,
  }
}

export const getAllUsers = token => {
  return {
    type: actions.GET_ALL_USERS_LIST,
    token,
  }
}

export const addNewUser = (value, token) => {
  return {
    type: actions.ADD_NEW_USER,
    value,
    token,
  }
}

export const updatePassowrdStrength = value => {
  return {
    type: actions.UPDATE_PASSWORD_STRENGTH,
    value,
  }
}

export const editUser = (id, value, token) => {
  return {
    type: actions.EDIT_USER,
    id,
    value,
    token,
  }
}

export const deleteUser = (id, token) => {
  return {
    type: actions.DELETE_USER,
    id,
    token,
  }
}

export const updatedUsers = value => {
  return {
    type: actions.UPDATE_SEARCH_USERS,
    value,
  }
}
