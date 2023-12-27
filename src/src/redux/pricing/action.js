const actions = {
  GET_ALL_PRICING_PROFILES: 'GET_ALL_PRICING_PROFILES',
  GET_ALL_PRICING_PROFILES_SUCCESS: 'GET_ALL_PRICING_PROFILES_SUCCESS',
  GET_ALL_PRICING_PROFILES_FAILURE: 'GET_ALL_PRICING_PROFILES_FAILURE',

  ADD_NEW_PRICING_PROFILE: 'ADD_NEW_PRICING_PROFILE',
  ADD_NEW_PRICING_PROFILE_SUCCESS: 'ADD_NEW_PRICING_PROFILE_SUCCESS',
  ADD_NEW_PRICING_PROFILE_FAILURE: 'ADD_NEW_PRICING_PROFILE_FAILURE',

  EDIT_SELECTED_PRICING_PROFILE: 'EDIT_SELECTED_PRICING_PROFILE',
  EDIT_SELECTED_PRICING_PROFILE_SUCCESS: 'EDIT_SELECTED_PRICING_PROFILE_SUCCESS',
  EDIT_SELECTED_PRICING_PROFILE_FAILURE: 'EDIT_SELECTED_PRICING_PROFILE_FAILURE',

  UPDATE_ERROR_LIST: 'UPDATE_ERROR_LIST',

  UPDATE_PAYMENT_LIST: 'UPDATE_PAYMENT_LIST',
  UPDATE_PAYMENT_LIST_VIEW: 'UPDATE_PAYMENT_LIST_VIEW',
  UPDATE_PAYMENT_ADD_VIEW: 'UPDATE_PAYMENT_ADD_VIEW',
  UPDATE_PAYMENT_EDIT_VIEW: 'UPDATE_PAYMENT_EDIT_VIEW',

  UPDATE_TRADE_LIST: 'UPDATE_TRADE_LIST',
  UPDATE_TRADE_LIST_VIEW: 'UPDATE_TRADE_LIST_VIEW',
  UPDATE_TRADE_ADD_VIEW: 'UPDATE_TRADE_ADD_VIEW',
  UPDATE_TRADE_EDIT_VIEW: 'UPDATE_TRADE_EDIT_VIEW',

  SET_TO_INITIAL_VALUES: 'SET_TO_INITIAL_VALUES',

  UPDATE_SELECTED_PRICING_PROFILE: 'UPDATE_SELECTED_PRICING_PROFILE',

  GET_PRICING_PROFILE_BY_ID: 'GET_PRICING_PROFILE_BY_ID',
  GET_PRICING_PROFILE_BY_ID_SUCCESS: 'GET_PRICING_PROFILE_BY_ID_SUCCESS',
  GET_PRICING_PROFILE_BY_ID_FAILURE: 'GET_PRICING_PROFILE_BY_ID_FAILURE',

  DELETE_SELECTED_PRICING_PROFILE: 'DELETE_SELECTED_PRICING_PROFILE',
  DELETE_SELECTED_PRICING_PROFILE_SUCCESS: 'DELETE_SELECTED_PRICING_PROFILE_SUCCESS',
  DELETE_SELECTED_PRICING_PROFILE_FAILURE: 'DELETE_SELECTED_PRICING_PROFILE_FAILURE',

  UPDATE_PAYMENT_PRICING_DATA: 'UPDATE_PAYMENT_PRICING_DATA',
  UPDATE_PAYMENT_TIERING_SELECTED: 'UPDATE_PAYMENT_TIERING_SELECTED',
  UPDATE_IS_PAYMENT_TIERING: 'UPDATE_IS_PAYMENT_TIERING',

  UPDATE_TRADE_PRICING_DATA: 'UPDATE_TRADE_PRICING_DATA',
  UPDATE_TRADE_TIERING_SELECTED: 'UPDATE_TRADE_TIERING_SELECTED',
  UPDATE_IS_TRADE_TIERING: 'UPDATE_IS_TRADE_TIERING',

  DELETE_SELECTED_PAYMENT_TIERING: 'DELETE_SELECTED_PAYMENT_TIERING',
  DELETE_SELECTED_PAYMENT_TIERING_SUCCESS: 'DELETE_SELECTED_PAYMENT_TIERING_SUCCESS',
  DELETE_SELECTED_PAYMENT_TIERING_FAILURE: 'DELETE_SELECTED_PAYMENT_TIERING_FAILURE',

  DELETE_SELECTED_TRADE_TIERING: 'DELETE_SELECTED_TRADE_TIERING',
  DELETE_SELECTED_TRADE_TIERING_SUCCESS: 'DELETE_SELECTED_TRADE_TIERING_SUCCESS',
  DELETE_SELECTED_TRADE_TIERING_FAILURE: 'DELETE_SELECTED_TRADE_TIERING_FAILURE',

  GET_PAYMENT_TIERING_LIST_BY_ID: 'GET_PAYMENT_TIERING_LIST_BY_ID',
  GET_PAYMENT_TIERING_LIST_BY_ID_SUCCESS: 'GET_PAYMENT_TIERING_LIST_BY_ID',
  GET_PAYMENT_TIERING_LIST_BY_ID_FAILURE: 'GET_PAYMENT_TIERING_LIST_BY_ID_FAILURE',

  GET_TRADE_TIERING_LIST_BY_ID: 'GET_TRADE_TIERING_LIST_BY_ID',
  GET_TRADE_TIERING_LIST_BY_ID_SUCCESS: 'GET_TRADE_TIERING_LIST_BY_ID_SUCCESS',
  GET_TRADE_TIERING_LIST_BY_ID_FAILURE: 'GET_TRADE_TIERING_LIST_BY_ID_FAILURE',

  UPDATE_IS_NEW_PRICING_PROFILE: 'UPDATE_IS_NEW_PRICING_PROFILE',
}
export default actions

export const getAllPricingProfiles = token => {
  return {
    type: actions.GET_ALL_PRICING_PROFILES,
    token,
  }
}

export const addNewPricingProfile = (value, token) => {
  return {
    type: actions.ADD_NEW_PRICING_PROFILE,
    value,
    token,
  }
}

export const updateErrorList = value => {
  return {
    type: actions.UPDATE_ERROR_LIST,
    value,
  }
}

export const updatePaymentRecord = value => {
  return {
    type: actions.UPDATE_PAYMENT_LIST,
    value,
  }
}

export const updatePaymentListView = value => {
  return {
    type: actions.UPDATE_PAYMENT_LIST_VIEW,
    value,
  }
}

export const updatePaymentAddView = value => {
  return {
    type: actions.UPDATE_PAYMENT_ADD_VIEW,
    value,
  }
}

export const updateTradeRecord = value => {
  return {
    type: actions.UPDATE_TRADE_LIST,
    value,
  }
}

export const updateTradeListView = value => {
  return {
    type: actions.UPDATE_TRADE_LIST_VIEW,
    value,
  }
}

export const updateTradeAddView = value => {
  return {
    type: actions.UPDATE_TRADE_ADD_VIEW,
    value,
  }
}

export const setToInitialValues = () => {
  return {
    type: actions.SET_TO_INITIAL_VALUES,
  }
}

export const updatePaymentEditView = value => {
  return {
    type: actions.UPDATE_PAYMENT_EDIT_VIEW,
    value,
  }
}

export const updateTradeEditView = value => {
  return {
    type: actions.UPDATE_TRADE_EDIT_VIEW,
    value,
  }
}

export const updateSelectedPricingProfile = value => {
  return {
    type: actions.UPDATE_SELECTED_PRICING_PROFILE,
    value,
  }
}

export const getPricingProfileById = (id, token) => {
  return {
    type: actions.GET_PRICING_PROFILE_BY_ID,
    id,
    token,
  }
}

export const editSelectedPricingProfile = (id, value, token, helperVariable) => {
  return {
    type: actions.EDIT_SELECTED_PRICING_PROFILE,
    id,
    value,
    token,
    helperVariable,
  }
}

export const deleteSelectedPricingProfile = (id, token) => {
  return {
    type: actions.DELETE_SELECTED_PRICING_PROFILE,
    id,
    token,
  }
}

export const updatePaymentPricingData = value => {
  return {
    type: actions.UPDATE_PAYMENT_PRICING_DATA,
    value,
  }
}

export const updatePaymentTieringMethodSelected = value => {
  return {
    type: actions.UPDATE_PAYMENT_TIERING_SELECTED,
    value,
  }
}

export const updateIsPaymentTieredPricing = value => {
  return {
    type: actions.UPDATE_IS_PAYMENT_TIERING,
    value,
  }
}

// export const updatePaymentAddMoreTieiringView = value => {
//   return {
//     type: actions.UPDATE_ADD_MOREPAYMENT_TIERING,
//     value,
//   }
// }

export const updateTradeTieringMethodSelected = value => {
  return {
    type: actions.UPDATE_TRADE_TIERING_SELECTED,
    value,
  }
}

export const updateIsTradeTieredPricing = value => {
  return {
    type: actions.UPDATE_IS_TRADE_TIERING,
    value,
  }
}

export const updateTradePricingData = value => {
  return {
    type: actions.UPDATE_TRADE_PRICING_DATA,
    value,
  }
}

export const deleteSelectedPaymentTiering = (profileid, id, token) => {
  return {
    type: actions.DELETE_SELECTED_PAYMENT_TIERING,
    profileid,
    id,
    token,
  }
}

export const deleteSelectedTradeTiering = (profileid, id, token) => {
  return {
    type: actions.DELETE_SELECTED_TRADE_TIERING,
    profileid,
    id,
    token,
  }
}

export const getPaymentTieringListById = (id, token) => {
  return {
    type: actions.GET_PAYMENT_TIERING_LIST_BY_ID,
    id,
    token,
  }
}

export const getTradeTieringListById = (id, token) => {
  return {
    type: actions.GET_TRADE_TIERING_LIST_BY_ID,
    id,
    token,
  }
}

export const updateIsNewPricingProfile = value => {
  return {
    type: actions.UPDATE_IS_NEW_PRICING_PROFILE,
    value,
  }
}
