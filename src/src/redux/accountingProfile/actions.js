const actions = {
  GET_ALL_ACCOUNTING_PROFILES: 'GET_ALL_ACCOUNTING_PROFILES',
  GET_ALL_ACCOUNTING_PROFILES_SUCCESS: 'GET_ALL_ACCOUNTING_PROFILES_SUCCESS',
  GET_ALL_ACCOUNTING_PROFILES_FAILURE: 'GET_ALL_ACCOUNTING_PROFILES_FAILURE',

  GET_ACCOUNTING_PROFILE_BY_ID: 'GET_ACCOUNTING_PROFILE_BY_ID',
  GET_ACCOUNTING_PROFILE_BY_ID_SUCCESS: 'GET_ACCOUNTING_PROFILE_BY_ID_SUCCESS',
  GET_ACCOUNTING_PROFILE_BY_ID_FAILURE: 'GET_ACCOUNTING_PROFILE_BY_ID_FAILURE',

  ADD_NEW_ACCOUNTING_PROFILE: 'ADD_NEW_ACCOUNTING_PROFILE',
  ADD_NEW_ACCOUNTING_PROFILE_SUCCESS: 'ADD_NEW_ACCOUNTING_PROFILE_SUCCESS',
  ADD_NEW_ACCOUNTING_PROFILE_FAILURE: 'ADD_NEW_ACCOUNTING_PROFILE_FAILURE',

  UPDATE_ACCOUNTING_PROFILE: 'UPDATE_ACCOUNTING_PROFILE',
  UPDATE_ACCOUNTING_PROFILE_SUCCESS: 'UPDATE_ACCOUNTING_PROFILE_SUCCESS',
  UPDATE_ACCOUNTING_PROFILE_FAILURE: 'UPDATE_ACCOUNTING_PROFILE_FAILURE',

  DELETE_ACCOUNTING_PROFILE: 'DELETE_ACCOUNTING_PROFILE',
  DELETE_ACCOUNTING_PROFILE_SUCCESS: 'DELETE_ACCOUNTING_PROFILE_SUCCESS',
  DELETE_ACCOUNTING_PROFILE_FAILURE: 'DELETE_ACCOUNTING_PROFILE_FAILURE',

  UPDATE_ADD_PROFILE_MODE: 'UPDATE_ADD_PROFILE_MODE',
  UPDATE_EDIT_PROFILE_MODE: 'UPDATE_EDIT_PROFILE_MODE',
  IS_NEW_ACCOUTING_PROFILE: 'IS_NEW_ACCOUTING_PROFILE',

  UPDATE_ADD_ENTRIES_MODE: 'UPDATE_ADD_ENTRIES_MODE',
  UPDATE_EDIT_ENTRIES_MODE: 'UPDATE_EDIT_ENTRIES_MODE',

  UPDATE_SELCTED_ENTRY: 'UPDATE_SELCTED_ENTRY',

  ADD_ACCOUNTING_PROFILE_ENTRY: 'ADD_ACCOUNTING_PROFILE_ENTRY',
  ADD_ACCOUNTING_PROFILE_ENTRY_SUCCESS: 'ADD_ACCOUNTING_PROFILE_ENTRY_SUCCESS',
  ADD_ACCOUNTING_PROFILE_ENTRY_FAILURE: 'ADD_ACCOUNTING_PROFILE_ENTRY_FAILURE',

  EDIT_ACCOUNTING_PROFILE_ENTRY: 'EDIT_ACCOUNTING_PROFILE_ENTRY',
  EDIT_ACCOUNTING_PROFILE_ENTRY_SUCCESS: 'EDIT_ACCOUNTING_PROFILE_ENTRY_SUCCESS',
  EDIT_ACCOUNTING_PROFILE_ENTRY_FAILURE: 'EDIT_ACCOUNTING_PROFILE_ENTRY_FAILURE',

  DELETE_ACCOUNTING_ENTRY: 'DELETE_ACCOUNTING_ENTRY',
  DELETE_ACCOUNTING_ENTRY_SUCCESS: 'DELETE_ACCOUNTING_ENTRY_SUCCESS',
  DELETE_ACCOUNTING_ENTRY_FAILURE: 'DELETE_ACCOUNTING_ENTRY_FAILURE',
}
export default actions

export const getAllAccountingProfile = (value, token) => {
  return {
    type: actions.GET_ALL_ACCOUNTING_PROFILES,
    value,
    token,
  }
}

export const getAccountingProfileById = (id, token) => {
  return {
    type: actions.GET_ACCOUNTING_PROFILE_BY_ID,
    id,
    token,
  }
}

export const addNewAccountingProfile = (value, token) => {
  return {
    type: actions.ADD_NEW_ACCOUNTING_PROFILE,
    value,
    token,
  }
}

export const updateAddProfileMode = value => {
  return {
    type: actions.UPDATE_ADD_PROFILE_MODE,
    value,
  }
}

export const updateEditProfileMode = value => {
  return {
    type: actions.UPDATE_EDIT_PROFILE_MODE,
    value,
  }
}

export const updateAccountingProfile = (profileId, value, token) => {
  return {
    type: actions.UPDATE_ACCOUNTING_PROFILE,
    profileId,
    value,
    token,
  }
}

export const deleteAccountingProfile = (profileId, token) => {
  return {
    type: actions.DELETE_ACCOUNTING_PROFILE,
    profileId,
    token,
  }
}

export const updateIsNewAccoutingProfile = value => {
  return {
    type: actions.IS_NEW_ACCOUTING_PROFILE,
    value,
  }
}

export const updateAddEntriesMode = value => {
  return {
    type: actions.UPDATE_ADD_ENTRIES_MODE,
    value,
  }
}

export const updateEditEntriesMode = value => {
  return {
    type: actions.UPDATE_EDIT_ENTRIES_MODE,
    value,
  }
}

export const addAccountingProfileEntry = (value, token) => {
  return {
    type: actions.ADD_ACCOUNTING_PROFILE_ENTRY,
    value,
    token,
  }
}

export const updateSelectedEntry = value => {
  return {
    type: actions.UPDATE_SELCTED_ENTRY,
    value,
  }
}

export const editAccountingProfileEntry = (id, value, token) => {
  return {
    type: actions.EDIT_ACCOUNTING_PROFILE_ENTRY,
    id,
    value,
    token,
  }
}

export const deleteSelectedProfileEntry = (entryId, profileId, token) => {
  return {
    type: actions.DELETE_ACCOUNTING_ENTRY,
    entryId,
    profileId,
    token,
  }
}
