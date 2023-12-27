const actions = {
  GET_ALL_PRICING_PROFILES_LIST: 'GET_ALL_PRICING_PROFILES_LIST',
  GET_ALL_PRICING_PROFILES_LIST_SUCCESS: 'GET_ALL_PRICING_PROFILES_LIST_SUCCESS',
  GET_ALL_PRICING_PROFILES_LIST_FAILURE: 'GET_ALL_PRICING_PROFILES_LIST_FAILURE',

  UPDATE_SELECTED_PRICING_PROFILE: 'UPDATE_SELECTED_PRICING_PROFILE',

  UPDATE_IS_NEW_PRICING_PROFILE: 'UPDATE_IS_NEW_PRICING_PROFILE',

  GET_PRICING_PROFILE_BY_ID: 'GET_PRICING_PROFILE_BY_ID',
  GET_PRICING_PROFILE_BY_ID_SUCCESS: 'GET_PRICING_PROFILE_BY_ID_SUCCESS',
  GET_PRICING_PROFILE_BY_ID_FAILURE: 'GET_PRICING_PROFILE_BY_ID_FAILURE',

  ADD_NEW_PRICING_PROFILE: 'ADD_NEW_PRICING_PROFILE',
  ADD_NEW_PRICING_PROFILE_SUCCESS: 'ADD_NEW_PRICING_PROFILE_SUCCESS',
  ADD_NEW_PRICING_PROFILE_FAILURE: 'ADD_NEW_PRICING_PROFILE_FAILURE',

  EDIT_PRICING_PROFILE: 'EDIT_PRICING_PROFILE',
  EDIT_PRICING_PROFILE_SUCCESS: 'EDIT_PRICING_PROFILE_SUCCESS',
  EDIT_PRICING_PROFILE_FAILURE: 'EDIT_PRICING_PROFILE_FAILURE',

  DELETE_SELECTED_PRICING_PROFILE: 'DELETE_SELECTED_PRICING_PROFILE',
  DELETE_SELECTED_PRICING_PROFILE_SUCCESS: 'DELETE_SELECTED_PRICING_PROFILE_SUCCESS',
  DELETE_SELECTED_PRICING_PROFILE_FAILURE: 'DELETE_SELECTED_PRICING_PROFILE_FAILURE',

  ADD_PAYMENT_PRICING_DATA_BY_ID: 'ADD_PAYMENT_PRICING_DATA_BY_ID',
  ADD_PAYMENT_PRICING_DATA_BY_ID_SUCCESS: 'ADD_PAYMENT_PRICING_DATA_BY_ID_SUCCESS',
  ADD_PAYMENT_PRICING_DATA_BY_ID_FAILURE: 'ADD_PAYMENT_PRICING_DATA_BY_ID_FAILURE',

  EDIT_PAYMENT_PRICING_DATA_BY_ID: 'EDIT_PAYMENT_PRICING_DATA_BY_ID',
  EDIT_PAYMENT_PRICING_DATA_BY_ID_SUCCESS: 'EDIT_PAYMENT_PRICING_DATA_BY_ID_SUCCESS',
  EDIT_PAYMENT_PRICING_DATA_BY_ID_FAILURE: 'EDIT_PAYMENT_PRICING_DATA_BY_ID_FAILURE',

  DELETE_PAYMENT_PRICING_DATA_BY_ID: 'DELETE_PAYMENT_PRICING_DATA_BY_ID',
  DELETE_PAYMENT_PRICING_DATA_BY_ID_SUCCESS: 'DELETE_PAYMENT_PRICING_DATA_BY_ID_SUCCESS',
  DELETE_PAYMENT_PRICING_DATA_BY_ID_FAILURE: 'DELETE_PAYMENT_PRICING_DATA_BY_ID_FAILURE',

  ADD_PAYMENTS_TIERING: 'ADD_PAYMENTS_TIERING',
  ADD_PAYMENTS_TIERING_SUCCESS: 'ADD_PAYMENTS_TIERING_SUCCESS',
  ADD_PAYMENTS_TIERING_FAILURE: 'ADD_PAYMENTS_TIERING_FAILURE',

  EDIT_PAYMENT_TIERING_DATA_BY_ID: 'EDIT_PAYMENT_TIERING_DATA_BY_ID',
  EDIT_PAYMENT_TIERING_DATA_BY_ID_SUCCESS: 'EDIT_PAYMENT_TIERING_DATA_BY_ID_SUCCESS',
  EDIT_PAYMENT_TIERING_DATA_BY_ID_FAILURE: 'EDIT_PAYMENT_TIERING_DATA_BY_ID_FAILURE',

  DELETE_SELECTED_PAYMENT_TIERING: 'DELETE_SELECTED_PAYMENT_TIERING',
  DELETE_SELECTED_PAYMENT_TIERING_SUCCESS: 'DELETE_SELECTED_PAYMENT_TIERING_SUCCESS',
  DELETE_SELECTED_PAYMENT_TIERING_FAILURE: 'DELETE_SELECTED_PAYMENT_TIERING_FAILURE',

  UPDATE_PAYMENT_DATA_ADD_VIEW: 'UPDATE_PAYMENT_DATA_ADD_VIEW',
  UPDATE_PAYMENT_DATA_EDIT_VIEW: 'UPDATE_PAYMENT_DATA_EDIT_VIEW',
  UPDATE_PAYMENT_DATA_VIEW_MODE: 'UPDATE_PAYMENT_DATA_VIEW_MODE',

  UPDATE_PAYMENT_TIERING_ADD_VIEW: 'UPDATE_PAYMENT_TIERING_ADD_VIEW',
  UPDATE_PAYMENT_TIERING_EDIT_VIEW: 'UPDATE_PAYMENT_TIERING_EDIT_VIEW',
  UPDATE_PAYMENT_TIERING_VIEW_MODE: 'UPDATE_PAYMENT_TIERING_VIEW_MODE',

  UPDATE_PAYMENT_TIERING_SELECTED: 'UPDATE_PAYMENT_TIERING_SELECTED',
  UPDATE_IS_PAYMENT_TIERING: 'UPDATE_IS_PAYMENT_TIERING',

  UPDATE_SELECTED_PAYMENT_TIERING: 'UPDATE_SELECTED_PAYMENT_TIERING',
  SHOW_PAYMNET_TIERING_OPTIONS: 'SHOW_PAYMNET_TIERING_OPTIONS',

  // Trades

  UPDATE_TRADE_DATA_ADD_VIEW: 'UPDATE_TRADE_DATA_ADD_VIEW',
  UPDATE_TRADE_DATA_EDIT_VIEW: 'UPDATE_TRADE_DATA_EDIT_VIEW',
  UPDATE_TRADE_DATA_VIEW_MODE: 'UPDATE_TRADE_DATA_VIEW_MODE',

  ADD_TRADE_PRICING_DATA_BY_ID: 'ADD_TRADE_PRICING_DATA_BY_ID',
  ADD_TRADE_PRICING_DATA_BY_ID_SUCCESS: 'ADD_TRADE_PRICING_DATA_BY_ID_SUCCESS',
  ADD_TRADE_PRICING_DATA_BY_ID_FAILURE: 'ADD_TRADE_PRICING_DATA_BY_ID_FAILURE',

  EDIT_TRADE_PRICING_DATA_BY_ID: 'EDIT_TRADE_PRICING_DATA_BY_ID',
  EDIT_TRADE_PRICING_DATA_BY_ID_SUCCESS: 'EDIT_TRADE_PRICING_DATA_BY_ID_SUCCESS',
  EDIT_TRADE_PRICING_DATA_BY_ID_FAILURE: 'EDIT_TRADE_PRICING_DATA_BY_ID_FAILURE',

  DELETE_TRADE_PRICING_DATA_BY_ID: 'DELETE_TRADE_PRICING_DATA_BY_ID',
  DELETE_TRADE_PRICING_DATA_BY_ID_SUCCESS: 'DELETE_TRADE_PRICING_DATA_BY_ID_SUCCESS',
  DELETE_TRADE_PRICING_DATA_BY_ID_FAILURE: 'DELETE_TRADE_PRICING_DATA_BY_ID_FAILURE',

  UPDATE_TRADE_TIERING_SELECTED: 'UPDATE_TRADE_TIERING_SELECTED',
  UPDATE_IS_TRADE_TIERING: 'UPDATE_IS_TRADE_TIERING',

  UPDATE_TRADE_TIERING_ADD_VIEW: 'UPDATE_TRADE_TIERING_ADD_VIEW',
  UPDATE_TRADE_TIERING_EDIT_VIEW: 'UPDATE_TRADE_TIERING_EDIT_VIEW',
  UPDATE_TRADE_TIERING_VIEW_MODE: 'UPDATE_TRADE_TIERING_VIEW_MODE',

  ADD_TRADE_TIERING: 'ADD_TRADE_TIERING',
  ADD_TRADE_TIERING_SUCCESS: 'ADD_TRADE_TIERING_SUCCESS',
  ADD_TRADE_TIERING_FAILURE: 'ADD_TRADE_TIERING_FAILURE',

  EDIT_TRADE_TIERING_DATA_BY_ID: 'EDIT_TRADE_TIERING_DATA_BY_ID',
  EDIT_TRADE_TIERING_DATA_BY_ID_SUCCESS: 'EDIT_TRADE_TIERING_DATA_BY_ID_SUCCESS',
  EDIT_TRADE_TIERING_DATA_BY_ID_FAILURE: 'EDIT_TRADE_TIERING_DATA_BY_ID_FAILURE',

  DELETE_SELECTED_TRADE_TIERING: 'DELETE_SELECTED_TRADE_TIERING',
  DELETE_SELECTED_TRADE_TIERING_SUCCESS: 'DELETE_SELECTED_TRADE_TIERING_SUCCESS',
  DELETE_SELECTED_TRADE_TIERING_FAILURE: 'DELETE_SELECTED_TRADE_TIERING_FAILURE',
}

export default actions

export const getAllPricingProfiles = values => {
  return {
    type: actions.GET_ALL_PRICING_PROFILES_LIST,
    values,
  }
}

export const getPricingProfileById = (id, token) => {
  return {
    type: actions.GET_PRICING_PROFILE_BY_ID,
    id,
    token,
  }
}

export const deleteSelectedPricingProfile = (id, token) => {
  return {
    type: actions.DELETE_SELECTED_PRICING_PROFILE,
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

export const addNewPricingProfile = (body, token) => {
  return {
    type: actions.ADD_NEW_PRICING_PROFILE,
    body,
    token,
  }
}

export const updatePricingProfile = (pricingId, body, token) => {
  return {
    type: actions.EDIT_PRICING_PROFILE,
    pricingId,
    body,
    token,
  }
}

export const addPaymentPricingData = (body, token) => {
  return {
    type: actions.ADD_PAYMENT_PRICING_DATA_BY_ID,
    body,
    token,
  }
}

export const editPaymentPricingData = (pricingId, body, token) => {
  return {
    type: actions.EDIT_PAYMENT_PRICING_DATA_BY_ID,
    pricingId,
    body,
    token,
  }
}

export const deletePaymentRecord = (paymentsId, pricingId, token) => {
  return {
    type: actions.DELETE_PAYMENT_PRICING_DATA_BY_ID,
    paymentsId,
    pricingId,
    token,
  }
}

export const addPaymentTiering = (body, token) => {
  return {
    type: actions.ADD_PAYMENTS_TIERING,
    body,
    token,
  }
}

export const updatePaymentDataAddView = value => {
  return {
    type: actions.UPDATE_PAYMENT_DATA_ADD_VIEW,
    value,
  }
}

export const updatePaymentDataEditView = value => {
  return {
    type: actions.UPDATE_PAYMENT_DATA_EDIT_VIEW,
    value,
  }
}

export const updatePaymentDataViewMode = value => {
  return {
    type: actions.UPDATE_PAYMENT_DATA_VIEW_MODE,
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

export const updatePaymentTieringAddView = value => {
  return {
    type: actions.UPDATE_PAYMENT_TIERING_ADD_VIEW,
    value,
  }
}

export const updatePaymentTieringEditMode = value => {
  return {
    type: actions.UPDATE_PAYMENT_TIERING_EDIT_VIEW,
    value,
  }
}

export const updatePaymentTieringViewMode = value => {
  return {
    type: actions.UPDATE_PAYMENT_TIERING_VIEW_MODE,
    value,
  }
}

export const updateTieringRecordEdit = value => {
  return {
    type: actions.UPDATE_SELECTED_PAYMENT_TIERING,
    value,
  }
}

export const editPaymentTieringById = (tieringId, body, token) => {
  return {
    type: actions.EDIT_PAYMENT_TIERING_DATA_BY_ID,
    tieringId,
    body,
    token,
  }
}

export const deleteSelectedPaymentTiering = (id, token) => {
  return {
    type: actions.DELETE_SELECTED_PAYMENT_TIERING,
    id,
    token,
  }
}

export const showPaymentTieringOptions = value => {
  return {
    type: actions.SHOW_PAYMNET_TIERING_OPTIONS,
    value,
  }
}

// Trades

export const updateTradeDataAddView = value => {
  return {
    type: actions.UPDATE_TRADE_DATA_ADD_VIEW,
    value,
  }
}

export const updateTradeDataEditView = value => {
  return {
    type: actions.UPDATE_TRADE_DATA_EDIT_VIEW,
    value,
  }
}

export const updateTradeDataViewMode = value => {
  return {
    type: actions.UPDATE_TRADE_DATA_VIEW_MODE,
    value,
  }
}

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

export const addTradePricingData = (body, token) => {
  return {
    type: actions.ADD_TRADE_PRICING_DATA_BY_ID,
    body,
    token,
  }
}

export const editTradePricingData = (pricingtradeId, body, token) => {
  return {
    type: actions.EDIT_TRADE_PRICING_DATA_BY_ID,
    pricingtradeId,
    body,
    token,
  }
}

export const deleteTradeRecord = (tradesId, pricingId, token) => {
  return {
    type: actions.DELETE_TRADE_PRICING_DATA_BY_ID,
    tradesId,
    pricingId,
    token,
  }
}

export const addTradeTiering = (body, token) => {
  return {
    type: actions.ADD_TRADE_TIERING,
    body,
    token,
  }
}

export const editTradeTieringById = (tieringId, body, token) => {
  return {
    type: actions.EDIT_TRADE_TIERING_DATA_BY_ID,
    tieringId,
    body,
    token,
  }
}

export const deleteSelectedTradeTiering = (id, token) => {
  return {
    type: actions.DELETE_SELECTED_TRADE_TIERING,
    id,
    token,
  }
}

export const updateTradeTieringAddView = value => {
  return {
    type: actions.UPDATE_TRADE_TIERING_ADD_VIEW,
    value,
  }
}

export const updateTradeTieringEditMode = value => {
  return {
    type: actions.UPDATE_TRADE_TIERING_EDIT_VIEW,
    value,
  }
}

export const updateTradeTieringViewMode = value => {
  return {
    type: actions.UPDATE_TRADE_TIERING_VIEW_MODE,
    value,
  }
}
