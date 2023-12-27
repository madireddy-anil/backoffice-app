const actions = {
  GET_FX_BASE_RATES: 'GET_FX_BASE_RATES',
  GET_FX_BASE_RATES_SUCCESS: 'GET_FX_BASE_RATES_SUCCESS',
  GET_FX_BASE_RATES_FAILURE: 'GET_FX_BASE_RATES_FAILURE',

  GET_FX_BASE_RATE_BY_ID: 'GET_FX_BASE_RATE_BY_ID',
  GET_FX_BASE_RATE_BY_ID_SUCCESS: 'GET_FX_BASE_RATE_BY_ID_SUCCESS',
  GET_FX_BASE_RATE_BY_ID_FAILURE: 'GET_FX_BASE_RATE_BY_ID_FAILURE',

  UPDATE_FX_BASE_RATE: 'UPDATE_FX_BASE_RATE',
  UPDATE_FX_BASE_RATE_SUCCESS: 'UPDATE_FX_BASE_RATE_SUCCESS',
  UPDATE_FX_BASE_RATE_FAILURE: 'UPDATE_FX_BASE_RATE_FAILURE',

  DELETE_FX_BASE_RATE: 'DELETE_FX_BASE_RATE',
  DELETE_FX_BASE_RATE_SUCCESS: 'DELETE_FX_BASE_RATE_SUCCESS',
  DELETE_FX_BASE_RATE_FAILURE: 'DELETE_FX_BASE_RATE_FAILURE',

  BULK_DELETE_FX_BASE_RATES: 'BULK_DELETE_FX_BASE_RATES',
  BULK_DELETE_FX_BASE_RATES_SUCCESS: 'BULK_DELETE_FX_BASE_RATES_SUCCESS',
  BULK_DELETE_FX_BASE_RATES_FAILURE: 'BULK_DELETE_FX_BASE_RATES_FAILURE',

  HANDLE_FX_BASE_RATES_PAGINATION: 'HANDLE_FX_BASE_RATES_PAGINATION',

  UPDATE_CURRENT_FX_BASE_RATE_ID: 'UPDATE_CURRENT_FX_BASE_RATE_ID',

  // create Fx Base Rate
  INITIATE_NEW_FX_BASE_RATE: 'INITIATE_NEW_FX_BASE_RATE',
  UPDATE_SELECTED_VENDOR_FOR_FX_RATE: 'UPDATE_SELECTED_VENDOR_FOR_FX_RATE',
  REMOVE_SELECTED_VENDOR_FROM_FX_RATE: 'REMOVE_SELECTED_VENDOR_FROM_FX_RATE',
  UPDATE_SELECTED_SOURCE_CURRENCY_FOR_FX_RATE: 'UPDATE_SELECTED_SOURCE_CURRENCY_FOR_FX_RATE',
  UPDATE_SELECTED_DESTINATION_CURRENCY_FOR_FX_RATE:
    'UPDATE_SELECTED_DESTINATION_CURRENCY_FOR_FX_RATE',
  UPDATE_RATE_FOR_FX_RATE: 'UPDATE_RATE_FOR_FX_RATE',
  UPDATE_RATE_APPLIED_DATE_FOR_FX_RATE: 'UPDATE_RATE_APPLIED_DATE_FOR_FX_RATE',

  GET_ANALYSED_RATE: 'GET_ANALYSED_RATE',
  GET_ANALYSED_RATE_SUCCESS: 'GET_ANALYSED_RATE_SUCCESS',
  GET_ANALYSED_RATE_FAILURE: 'GET_ANALYSED_RATE_FAILURE',

  SET_ANALYSE_RATE_AGAIN: 'SET_ANALYSE_RATE_AGAIN',

  CREATE_FX_BASE_RATE: 'CREATE_FX_BASE_RATE',
  CREATE_FX_BASE_RATE_SUCCESS: 'CREATE_FX_BASE_RATE_SUCCESS',
  CREATE_FX_BASE_RATE_FAILURE: 'CREATE_FX_BASE_RATE_FAILURE',

  HANDLE_FX_BASE_RATE_FILTER: 'HANDLE_FX_BASE_RATE_FILTER',
}
export default actions

export const handleFxBaseRateFilter = value => {
  return {
    type: actions.HANDLE_FX_BASE_RATE_FILTER,
    value,
  }
}

export const getAllFxBaseRates = (value, token) => {
  return {
    type: actions.GET_FX_BASE_RATES,
    value,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.HANDLE_FX_BASE_RATES_PAGINATION,
    value,
  }
}

export const updateCurrentFxBaseRateId = value => {
  return {
    type: actions.UPDATE_CURRENT_FX_BASE_RATE_ID,
    value,
  }
}

export const initiateFxBaseRate = () => {
  return {
    type: actions.INITIATE_NEW_FX_BASE_RATE,
  }
}

export const updateVendor = value => {
  return {
    type: actions.UPDATE_SELECTED_VENDOR_FOR_FX_RATE,
    value,
  }
}

export const removeSelectedVendor = value => {
  return {
    type: actions.REMOVE_SELECTED_VENDOR_FROM_FX_RATE,
    value,
  }
}

export const updateSourceCurrency = value => {
  return {
    type: actions.UPDATE_SELECTED_SOURCE_CURRENCY_FOR_FX_RATE,
    value,
  }
}

export const updateDistinationCurrency = value => {
  return {
    type: actions.UPDATE_SELECTED_DESTINATION_CURRENCY_FOR_FX_RATE,
    value,
  }
}

export const updateEnteredRate = value => {
  return {
    type: actions.UPDATE_RATE_FOR_FX_RATE,
    value,
  }
}

export const selectRateAppliedDate = value => {
  return {
    type: actions.UPDATE_RATE_APPLIED_DATE_FOR_FX_RATE,
    value,
  }
}

export const getAnalysedRate = (value, token) => {
  return {
    type: actions.GET_ANALYSED_RATE,
    value,
    token,
  }
}

export const setAnalyseRateAgain = () => {
  return {
    type: actions.SET_ANALYSE_RATE_AGAIN,
  }
}

export const createFxBaseRate = (value, token) => {
  return {
    type: actions.CREATE_FX_BASE_RATE,
    value,
    token,
  }
}

export const getFxBaseRateDetailsById = (value, token) => {
  return {
    type: actions.GET_FX_BASE_RATE_BY_ID,
    value,
    token,
  }
}
