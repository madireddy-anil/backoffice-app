const actions = {
  ADD_VIEW_PERMISSION_MODAL: 'ADD_VIEW_PERMISSION_MODAL',
  ADD_CLOSE_PERMISSION_MODAL: 'ADD_CLOSE_PERMISSION_MODAL',

  EDIT_VIEW_PERMISSION_MODAL: 'EDIT_VIEW_PERMISSION_MODAL',
  EDIT_CLOSE_PERMISSION_MODAL: 'EDIT_CLOSE_PERMISSION_MODAL',

  GET_PERMISSIONS: 'GET_PERMISSIONS',
  GET_PERMISSIONS_SUCCESS: 'GET_PERMISSIONS_SUCCESS',
  GET_PERMISSIONS_FAILURE: 'GET_PERMISSIONS_FAILURE',

  ADD_NEW_PERMISSION: 'ADD_NEW_PERMISSION',
  ADD_NEW_PERMISSION_SUCCESS: 'ADD_NEW_PERMISSION_SUCCESS',
  ADD_NEW_PERMISSION_FAILURE: 'ADD_NEW_PERMISSION_FAILURE',

  EDIT_PERMISSION: 'EDIT_PERMISSION',
  EDIT_PERMISSION_SUCCESS: 'EDIT_PERMISSION_SUCCESS',
  EDIT_PERMISSION_FAILURE: 'EDIT_PERMISSION_FAILURE',

  DELETE_PERMISSION: 'DELETE_PERMISSION',
  DELETE_PERMISSION_SUCCESS: 'DELETE_PERMISSION_SUCCESS',
  DELETE_PERMISSION_FAILURE: 'DELETE_PERMISSION_FAILURE',

  UPDATE_SELECTED_RECORD: 'UPDATE_SELECTED_RECORD',

  UPDATE_SEARCH_PERMISSIONS: 'UPDATE_SEARCH_PERMISSIONS',
}
export default actions

export const addViewPermissionModal = value => {
  return {
    type: actions.ADD_VIEW_PERMISSION_MODAL,
    value,
  }
}

export const addClosePermissionModal = value => {
  return {
    type: actions.ADD_CLOSE_PERMISSION_MODAL,
    value,
  }
}

export const editViewPermissionModal = value => {
  return {
    type: actions.EDIT_VIEW_PERMISSION_MODAL,
    value,
  }
}

export const editClosePermissionModal = value => {
  return {
    type: actions.EDIT_CLOSE_PERMISSION_MODAL,
    value,
  }
}

export const getPermissionsList = value => {
  return {
    type: actions.GET_PERMISSIONS,
    value,
  }
}

export const addPermission = (value, token) => {
  return {
    type: actions.ADD_NEW_PERMISSION,
    value,
    token,
  }
}

export const editPermission = (id, value, token) => {
  return {
    type: actions.EDIT_PERMISSION,
    id,
    value,
    token,
  }
}

export const deletePermission = (id, token) => {
  return {
    type: actions.DELETE_PERMISSION,
    id,
    token,
  }
}

export const updateSelectedRecord = value => {
  return {
    type: actions.UPDATE_SELECTED_RECORD,
    value,
  }
}

export const updatedPermissions = value => {
  return {
    type: actions.UPDATE_SEARCH_PERMISSIONS,
    value,
  }
}
