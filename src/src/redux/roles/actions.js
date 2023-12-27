const actions = {
  VIEW_ROLE_MODAL: 'VIEW_ROLE_MODAL',
  VIEW_CLOSE_ROLE_MODAL: 'VIEW_CLOSE_ROLE_MODAL',

  ADD_VIEW_ROLE_MODAL: 'ADD_VIEW_ROLE_MODAL',
  ADD_CLOSE_ROLE_MODAL: 'ADD_CLOSE_ROLE_MODAL',

  EDIT_VIEW_ROLE_MODAL: 'EDIT_VIEW_ROLE_MODAL',
  EDIT_CLOSE_ROLE_MODAL: 'EDIT_CLOSE_ROLE_MODAL',

  GET_ROLES: 'GET_ROLES',
  GET_ROLES_SUCCESS: 'GET_ROLES_SUCCESS',
  GET_ROLES_FAILURE: 'GET_ROLES_FAILURE',

  ADD_NEW_ROLE: 'ADD_NEW_ROLE',
  ADD_NEW_ROLE_SUCCESS: 'ADD_NEW_ROLE_SUCCESS',
  ADD_NEW_ROLE_FAILURE: 'ADD_NEW_ROLE_FAILURE',

  EDIT_ROLE: 'EDIT_ROLE',
  EDIT_ROLE_SUCCESS: 'EDIT_ROLE_SUCCESS',
  EDIT_ROLE_FAILURE: 'EDIT_ROLE_FAILURE',

  DELETE_ROLE: 'DELETE_ROLE',
  DELETE_ROLE_SUCCESS: 'DELETE_ROLE_SUCCESS',
  DELETE_ROLE_FAILURE: 'DELETE_ROLE_FAILURE',

  UPDATE_SELECTED_ROLE_RECORD: 'UPDATE_SELECTED_ROLE_RECORD',
  UPDATE_SEARCH_ROLES: 'UPDATE_SEARCH_ROLES',

  GET_ROLE_DATA_BY_ID: 'GET_ROLE_DATA_BY_ID',
  GET_ROLE_DATA_BY_ID_SUCCESS: 'GET_ROLE_DATA_BY_ID_SUCCESS',
  GET_ROLE_DATA_BY_ID_FAILURE: 'GET_ROLE_DATA_BY_ID_FAILURE',
}
export default actions

export const addViewRoleModal = value => {
  return {
    type: actions.ADD_VIEW_ROLE_MODAL,
    value,
  }
}

export const addCloseRoleModal = value => {
  return {
    type: actions.ADD_CLOSE_ROLE_MODAL,
    value,
  }
}

export const editViewRoleModal = value => {
  return {
    type: actions.EDIT_VIEW_ROLE_MODAL,
    value,
  }
}

export const editCloseRoleModal = value => {
  return {
    type: actions.EDIT_CLOSE_ROLE_MODAL,
    value,
  }
}

export const viewRoleModal = value => {
  return {
    type: actions.VIEW_ROLE_MODAL,
    value,
  }
}

export const viewCloseRoleModal = value => {
  return {
    type: actions.VIEW_CLOSE_ROLE_MODAL,
    value,
  }
}

export const updateSelectedRoleRecord = value => {
  return {
    type: actions.UPDATE_SELECTED_ROLE_RECORD,
    value,
  }
}

export const getRolesList = token => {
  return {
    type: actions.GET_ROLES,
    token,
  }
}

export const addRole = (value, token) => {
  return {
    type: actions.ADD_NEW_ROLE,
    value,
    token,
  }
}

export const editRole = (id, value, token) => {
  return {
    type: actions.EDIT_ROLE,
    id,
    value,
    token,
  }
}

export const deleteRole = (id, token) => {
  return {
    type: actions.DELETE_ROLE,
    id,
    token,
  }
}

export const updateRoles = value => {
  return {
    type: actions.UPDATE_SEARCH_ROLES,
    value,
  }
}

export const getRoleDataById = (id, token) => {
  return {
    type: actions.GET_ROLE_DATA_BY_ID,
    id,
    token,
  }
}
