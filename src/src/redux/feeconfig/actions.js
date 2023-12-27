const actions = {
  GET_FEE_CONFIGS: 'GET_FEE_CONFIGS',
  GET_FEE_CONFIGS_SUCCESS: 'GET_FEE_CONFIGS_SUCCESS',
  GET_FEE_CONFIGS_FAILURE: 'GET_FEE_CONFIGS_FAILURE',

  GET_FEE_CONFIG_BY_ID: 'GET_FEE_CONFIG_BY_ID',
  GET_FEE_CONFIG_BY_ID_SUCCESS: 'GET_FEE_CONFIG_BY_ID_SUCCESS',
  GET_FEE_CONFIG_BY_ID_FAILURE: 'GET_FEE_CONFIG_BY_ID_FAILURE',

  UPDATE_FEE_CONFIG: 'UPDATE_FEE_CONFIG',
  UPDATE_FEE_CONFIG_SUCCESS: 'UPDATE_FEE_CONFIG_SUCCESS',
  UPDATE_FEE_CONFIG_FAILURE: 'UPDATE_FEE_CONFIG_FAILURE',

  DELETE_FEE_CONFIG: 'DELETE_FEE_CONFIG',
  DELETE_FEE_CONFIG_SUCCESS: 'DELETE_FEE_CONFIG_SUCCESS',
  DELETE_FEE_CONFIG_FAILURE: 'DELETE_FEE_CONFIG_FAILURE',

  BULK_DELETE_FEE_CONFIGS: 'BULK_DELETE_FEE_CONFIGS',
  BULK_DELETE_FEE_CONFIGS_SUCCESS: 'BULK_DELETE_FEE_CONFIGS_SUCCESS',
  BULK_DELETE_FEE_CONFIGS_FAILURE: 'BULK_DELETE_FEE_CONFIGS_FAILURE',

  HANDLE_FEE_CONFIGS_PAGINATION: 'HANDLE_FEE_CONFIGS_PAGINATION',

  INITIATE_NEW_FEE_CONFIG: 'INITIATE_NEW_FEE_CONFIG',
  UPDATE_CLIENT_FROM_FEE_CONFIG: 'UPDATE_CLIENT_FROM_FEE_CONFIG',
  REMOVE_CLIENT_FROM_FEE_CONFIG: 'REMOVE_CLIENT_FROM_FEE_CONFIG',
  UPDATE_SELECTED_SOURCE_CURRENCY_FOR_FEE_CONFIG: 'UPDATE_SELECTED_SOURCE_CURRENCY_FOR_FEE_CONFIG',
  UPDATE_SELECTED_DESTINATION_CURRENCY_FOR_FEE_CONFIG:
    'UPDATE_SELECTED_DESTINATION_CURRENCY_FOR_FEE_CONFIG',
  UPDATE_SELECTED_TRADING_HOURS_FOR_FEE_CONFIG: 'UPDATE_SELECTED_TRADING_HOURS_FOR_FEE_CONFIG',
  UPDATE_SELECTED_SPREAD_TYPE_FOR_FEE_CONFIG: 'UPDATE_SELECTED_SPREAD_TYPE_FOR_FEE_CONFIG',
  UPDATE_FEE_VALUE_FOR_FEE_CONFIG: 'UPDATE_FEE_VALUE_FOR_FEE_CONFIG',
  UPDATE_FEE_CONFIG_CLIENTORVENDOR_PREFERENCE_FOR_FEE_CONFIG:
    'UPDATE_FEE_CONFIG_CLIENTORVENDOR_PREFERENCE_FOR_FEE_CONFIG',
  UPDATE_SELECTED_VENDOR_FOR_FEE_CONFIG: 'UPDATE_SELECTED_VENDOR_FOR_FEE_CONFIG',
  REMOVE_SELECTED_VENDOR_FROM_FEE_CONFIG: 'REMOVE_SELECTED_VENDOR_FROM_FEE_CONFIG',

  CREATE_FEE_CONFIG: 'CREATE_FEE_CONFIG',
  CREATE_FEE_CONFIG_SUCCESS: 'CREATE_FEE_CONFIG_SUCCESS',
  CREATE_FEE_CONFIG_FAILURE: 'CREATE_FEE_CONFIG_FAILURE',

  UPDATE_FEE_CONFIG_STATUS: 'UPDATE_FEE_CONFIG_STATUS',
  UPDATE_FEE_CONFIG_STATUS_SUCCESS: 'UPDATE_FEE_CONFIG_STATUS_SUCCESS',
  UPDATE_FEE_CONFIG_STATUS_FAILURE: 'UPDATE_FEE_CONFIG_STATUS_FAILURE',

  CLEAR_FEE_CONFIG_DATA: 'CLEAR_FEE_CONFIG_DATA',

  HANDLE_FEE_CONFIG_FILTERS: 'HANDLE_FEE_CONFIG_FILTERS',
}
export default actions

export const handleFeeConfigFilter = value => {
  return {
    type: actions.HANDLE_FEE_CONFIG_FILTERS,
    value,
  }
}

export const getAllFeeConfigs = (value, token) => {
  return {
    type: actions.GET_FEE_CONFIGS,
    value,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.HANDLE_FEE_CONFIGS_PAGINATION,
    value,
  }
}

export const getFeeConfigById = (id, token) => {
  return {
    type: actions.GET_FEE_CONFIG_BY_ID,
    id,
    token,
  }
}

export const deleteFeeConfig = (value, token) => {
  return {
    type: actions.DELETE_FEE_CONFIG,
    value,
    token,
  }
}

export const bulkDeleteFeeConfigs = (value, token) => {
  return {
    type: actions.BULK_DELETE_FEE_CONFIGS,
    value,
    token,
  }
}

export const initiateNewFeeConfig = () => {
  return {
    type: actions.INITIATE_NEW_FEE_CONFIG,
  }
}

export const updateClient = value => {
  return {
    type: actions.UPDATE_CLIENT_FROM_FEE_CONFIG,
    value,
  }
}

export const removeClient = () => {
  return {
    type: actions.REMOVE_CLIENT_FROM_FEE_CONFIG,
  }
}

export const createFeeConfig = (value, token) => {
  return {
    type: actions.CREATE_FEE_CONFIG,
    value,
    token,
  }
}

export const updateSourceCurrency = value => {
  return {
    type: actions.UPDATE_SELECTED_SOURCE_CURRENCY_FOR_FEE_CONFIG,
    value,
  }
}

export const updateFeeConfigClientOrVendorPreference = value => {
  return {
    type: actions.UPDATE_FEE_CONFIG_CLIENTORVENDOR_PREFERENCE_FOR_FEE_CONFIG,
    value,
  }
}

export const updateDestinationCurrency = value => {
  return {
    type: actions.UPDATE_SELECTED_DESTINATION_CURRENCY_FOR_FEE_CONFIG,
    value,
  }
}

export const updateTradingHours = value => {
  return {
    type: actions.UPDATE_SELECTED_TRADING_HOURS_FOR_FEE_CONFIG,
    value,
  }
}

export const updateSpreadType = value => {
  return {
    type: actions.UPDATE_SELECTED_SPREAD_TYPE_FOR_FEE_CONFIG,
    value,
  }
}

export const updateFeeValue = value => {
  return {
    type: actions.UPDATE_FEE_VALUE_FOR_FEE_CONFIG,
    value,
  }
}

export const updateVendor = value => {
  return {
    type: actions.UPDATE_SELECTED_VENDOR_FOR_FEE_CONFIG,
    value,
  }
}

export const removeSelectedVendor = value => {
  return {
    type: actions.REMOVE_SELECTED_VENDOR_FROM_FEE_CONFIG,
    value,
  }
}

export const updatedFeeConfig = (id, value, token) => {
  return {
    type: actions.UPDATE_FEE_CONFIG,
    id,
    value,
    token,
  }
}

export const clearFeeConfigData = () => {
  return {
    type: actions.CLEAR_FEE_CONFIG_DATA,
  }
}
