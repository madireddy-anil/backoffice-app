const actions = {
  GET_ALL_VENDOR_CONFIGURATION: 'GET_ALL_VENDOR_CONFIGURATION',
  GET_ALL_VENDOR_CONFIGURATION_SUCCESS: 'GET_ALL_VENDOR_CONFIGURATION_SUCCESS',
  GET_ALL_VENDOR_CONFIGURATION_FAILURE: 'GET_ALL_VENDOR_CONFIGURATION_FAILURE',

  GET_VENDOR_CONFIGURATION_BY_FILTERS: 'GET_VENDOR_CONFIGURATION_BY_FILTERS',
  GET_VENDOR_CONFIGURATION_BY_FILTERS_SUCCESS: 'GET_VENDOR_CONFIGURATION_BY_FILTERS_SUCCESS',
  GET_VENDOR_CONFIGURATION_BY_FILTERS_FAILURE: 'GET_VENDOR_CONFIGURATION_BY_FILTERS_FAILURE',

  GET_VENDOR_CONFIGURATION_DATA_BY_ID: 'GET_VENDOR_CONFIGURATION_DATA_BY_ID',
  GET_VENDOR_CONFIGURATION_DATA_BY_ID_SUCCESS: 'GET_VENDOR_CONFIGURATION_DATA_BY_ID_SUCCESS',
  GET_VENDOR_CONFIGURATION_DATA_BY_ID_FAILURE: 'GET_VENDOR_CONFIGURATION_DATA_BY_ID_FAILURE',

  ADD_NEW_VENDOR_CONFIGURATION: 'ADD_NEW_VENDOR_CONFIGURATION',
  ADD_NEW_VENDOR_CONFIGURATION_SUCCESS: 'ADD_NEW_VENDOR_CONFIGURATION_SUCCESS',
  ADD_NEW_VENDOR_CONFIGURATION_FAILURE: 'ADD_NEW_VENDOR_CONFIGURATION_FAILURE',

  UPDATE_VENDOR_CONFIG_VIEW_PAGE: 'UPDATE_VENDOR_CONFIG_VIEW_PAGE',

  // vendor Data

  UPDATE_VENDOR_DATA: 'UPDATE_VENDOR_DATA',
  UPDATE_VENDOR_DATA_SUCCESS: 'UPDATE_VENDOR_DATA_SUCCESS',
  UPDATE_VENDOR_DATA_FAILURE: 'UPDATE_VENDOR_DATA_FAILURE',

  UPDATE_VENDOR_DATA_VIEW_MODE: 'UPDATE_VENDOR_DATA_VIEW_MODE',

  UPDATE_VENDOR_DATA_EDIT_MODE: 'UPDATE_VENDOR_DATA_EDIT_MODE',

  // adrress data

  UPDATE_VENDOR_ADDRESS: 'UPDATE_VENDOR_ADDRESS',
  UPDATE_VENDOR_ADDRESS_SUCCESS: 'UPDATE_VENDOR_ADDRESS_SUCCESS',
  UPDATE_VENDOR_ADDRESS_FAILURE: 'UPDATE_VENDOR_ADDRESS_FAILURE',

  UPDATE_ADDRESS_EDIT_MODE: 'UPDATE_ADDRESS_EDIT_MODE',

  // complaiance data

  UPDATE_VENDOR_COMPLIANANCE_INFO: 'UPDATE_VENDOR_COMPLIANANCE_INFO',
  UPDATE_VENDOR_COMPLIANANCE_INFO_SUCCESS: 'UPDATE_VENDOR_COMPLIANANCE_INFO_SUCCESS',
  UPDATE_VENDOR_COMPLIANANCE_INFO_FAILURE: 'UPDATE_VENDOR_COMPLIANANCE_INFO_FAILURE',

  UPDATE_COMPLIANCE_EDIT_MODE: 'UPDATE_COMPLIANCE_EDIT_MODE',

  DELETE_VENDOR_CONFIGURATION: 'DELETE_VENDOR_CONFIGURATION',
  DELETE_VENDOR_CONFIGURATION_SUCCESS: 'DELETE_VENDOR_CONFIGURATION_SUCCESS',
  DELETE_VENDOR_CONFIGURATION_FAILURE: 'DELETE_VENDOR_CONFIGURATION_FAILURE',

  // Payments Currencies supported

  UPDATE_VENDOR_PAYMNET_ADD_MODE: 'UPDATE_VENDOR_PAYMNET_ADD_MODE',

  ADD_VENDOR_PAYMENTS_DATA: 'ADD_VENDOR_PAYMENTS_DATA',
  ADD_VENDOR_PAYMENTS_DATA_SUCCESS: 'ADD_VENDOR_PAYMENTS_DATA_SUCCESS',
  ADD_VENDOR_PAYMENTS_DATA_FAILURE: 'ADD_VENDOR_PAYMENTS_DATA_FAILURE',

  EDIT_VENDOR_PAYMENTS_DATA: 'EDIT_VENDOR_PAYMENTS_DATA',
  EDIT_VENDOR_PAYMENTS_DATA_SUCCESS: 'EDIT_VENDOR_PAYMENTS_DATA_SUCCESS',
  EDIT_VENDOR_PAYMENTS_DATA_FAILURE: 'EDIT_VENDOR_PAYMENTS_DATA_FAILURE',

  ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED: 'ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED',
  ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED_SUCCESS: 'ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED_SUCCESS',
  ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED_FAILURE: 'ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED_FAILURE',

  EDIT_PAYMENTS_CURRENCIES_SUPPORTED: 'EDIT_PAYMENTS_CURRENCIES_SUPPORTED',
  EDIT_PAYMENTS_CURRENCIES_SUPPORTED_SUCCESS: 'EDIT_PAYMENTS_CURRENCIES_SUPPORTED_SUCCESS',
  EDIT_PAYMENTS_CURRENCIES_SUPPORTED_FAILURE: 'EDIT_PAYMENTS_CURRENCIES_SUPPORTED_FAILURE',

  UPDATE_ADD_PAYMNET_CURRENCY_SUPP_ADD_MODE: 'UPDATE_ADD_PAYMNET_CURRENCY_SUPP_ADD_MODE',
  UPDATE_PAYMNET_CURRENCY_SUPP_EDIT_MODE: 'UPDATE_PAYMNET_CURRENCY_SUPP_EDIT_MODE',

  UPDATE_SELECTED_RECORD_TO_EDIT: 'UPDATE_SELECTED_RECORD_TO_EDIT',

  DELETE_P_CURRENCY_SUPPORTED: 'DELETE_P_CURRENCY_SUPPORTED',
  DELETE_P_CURRENCY_SUPPORTED_SUCCESS: 'DELETE_P_CURRENCY_SUPPORTED_SUCCESS',
  DELETE_P_CURRENCY_SUPPORTED_FAILURE: 'DELETE_P_CURRENCY_SUPPORTED_FAILURE',

  // Forieng Exchange

  UPDATE_VENDOR_FX_DATA_ADD_MODE: 'UPDATE_VENDOR_FX_DATA_ADD_MODE',

  UPDATE_ADD_FX_CURRENCY_PAIR_ADD_MODE: 'UPDATE_ADD_FX_CURRENCY_PAIR_ADD_MODE',
  UPDATE_ADD_FX_CURRENCY_PAIR_EDIT_MODE: 'UPDATE_ADD_FX_CURRENCY_PAIR_EDIT_MODE',

  ADD_VENDOR_FX_DATA: 'ADD_VENDOR_FX_DATA',
  ADD_VENDOR_FX_DATA_SUCCESS: 'ADD_VENDOR_FX_DATA_SUCCESS',
  ADD_VENDOR_FX_DATA_FAILURE: 'ADD_VENDOR_FX_DATA_FAILURE',

  EDIT_VENDOR_FX_DATA: 'EDIT_VENDOR_FX_DATA',
  EDIT_VENDOR_FX_DATA_SUCCESS: 'EDIT_VENDOR_FX_DATA_SUCCESS',
  EDIT_VENDOR_FX_DATA_FAILURE: 'EDIT_VENDOR_FX_DATA_FAILURE',

  ADD_NEW_FX_CURRENCY_PAIR: 'ADD_NEW_FX_CURRENCY_PAIR',
  ADD_NEW_FX_CURRENCY_PAIR_SUCCESS: 'ADD_NEW_FX_CURRENCY_PAIR_SUCCESS',
  ADD_NEW_FX_CURRENCY_PAIR_FAILURE: 'ADD_NEW_FX_CURRENCY_PAIR_FAILURE',

  EDIT_FX_CURRENCY_PAIR: 'EDIT_FX_CURRENCY_PAIR',
  EDIT_FX_CURRENCY_PAIR_SUCCESS: 'EDIT_FX_CURRENCY_PAIR_SUCCESS',
  EDIT_FX_CURRENCY_PAIR_FAILURE: 'EDIT_FX_CURRENCY_PAIR_FAILURE',

  DELETE_SELECTED_VENDOR_CURRENCY_PAIR: 'DELETE_SELECTED_VENDOR_CURRENCY_PAIR',
  DELETE_SELECTED_VENDOR_CURRENCY_PAIR_SUCCESS: 'DELETE_SELECTED_VENDOR_CURRENCY_PAIR_SUCCESS',
  DELETE_SELECTED_VENDOR_CURRENCY_PAIR_FAILURE: 'DELETE_SELECTED_VENDOR_CURRENCY_PAIR_FAILURE',

  // Local Accounts

  UPDATE_VENDOR_LOCAL_ACCOUNT_ADD_MODE: 'UPDATE_VENDOR_LOCAL_ACCOUNT_ADD_MODE',

  UPDATE_ADD_FEE_ADD_MODE: 'UPDATE_ADD_FEE_ADD_MODE',
  UPDATE_ADD_FEE_EDIT_MODE: 'UPDATE_ADD_FEE_EDIT_MODE',

  ADD_VENDOR_LOCAL_ACCOUNT_DATA: 'ADD_VENDOR_LOCAL_ACCOUNT_DATA',
  ADD_VENDOR_LOCAL_ACCOUNT_DATA_SUCCESS: 'ADD_VENDOR_LOCAL_ACCOUNT_DATA_SUCCESS',
  ADD_VENDOR_LOCAL_ACCOUNT_DATA_FAILURE: 'ADD_VENDOR_LOCAL_ACCOUNT_DATA_FAILURE',

  EDIT_VENDOR_LOCAL_ACCOUNT_DATA: 'EDIT_VENDOR_LOCAL_ACCOUNT_DATA',
  EDIT_VENDOR_LOCAL_ACCOUNT_DATA_SUCCESS: 'EDIT_VENDOR_LOCAL_ACCOUNT_DATA_SUCCESS',
  EDIT_VENDOR_LOCAL_ACCOUNT_DATA_FAILURE: 'EDIT_VENDOR_LOCAL_ACCOUNT_DATA_FAILURE',

  ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR: 'ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR',
  ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR_SUCCESS: 'ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR_SUCCESS',
  ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR_FAILURE: 'ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR_FAILURE',

  EDIT_LOCAL_ACCOUNT_FEE_PAIR: 'EDIT_LOCAL_ACCOUNT_FEE_PAIR',
  EDIT_LOCAL_ACCOUNT_FEE_PAIR_SUCCESS: 'EDIT_LOCAL_ACCOUNT_FEE_PAIR_SUCCESS',
  EDIT_LOCAL_ACCOUNT_FEE_PAIR_FAILURE: 'EDIT_LOCAL_ACCOUNT_FEE_PAIR_FAILURE',

  DELETE_SELECTED_FEE_RECORD: 'DELETE_SELECTED_FEE_RECORD',
  DELETE_SELECTED_FEE_RECORD_SUCCESS: 'DELETE_SELECTED_FEE_RECORD_SUCCESS',
  DELETE_SELECTED_FEE_RECORD_FAILURE: 'DELETE_SELECTED_FEE_RECORD_FAILURE',

  UPDATE_VENDOR_PAYMENT_EDIT_MODE: 'UPDATE_VENDOR_PAYMENT_EDIT_MODE',
  UPDATE_VENDOR_FX_EDIT_MODE: 'UPDATE_VENDOR_FX_EDIT_MODE',
  UPDATE_VENDOR_LOCAL_ACCOUNT_EDIT_MODE: 'UPDATE_VENDOR_LOCAL_ACCOUNT_EDIT_MODE',
}

export default actions

export const getAllVendorConfigurations = (value, token) => {
  return {
    type: actions.GET_ALL_VENDOR_CONFIGURATION,
    value,
    token,
  }
}

export const getVendorConfigurationByFilters = (value, token) => {
  return {
    type: actions.GET_VENDOR_CONFIGURATION_BY_FILTERS,
    value,
    token,
  }
}

export const getVendorConfigurationById = (id, token) => {
  return {
    type: actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID,
    id,
    token,
  }
}

export const addNewVendorConfiguration = (value, token) => {
  return {
    type: actions.ADD_NEW_VENDOR_CONFIGURATION,
    value,
    token,
  }
}

// Vendor Name Block

export const updateVendorData = (id, value, token) => {
  return {
    type: actions.UPDATE_VENDOR_DATA,
    id,
    token,
    value,
  }
}

export const updateVendorNameBlockEdit = value => {
  return {
    type: actions.UPDATE_VENDOR_DATA_EDIT_MODE,
    value,
  }
}

// Address Block

export const updateVendorAddress = (id, value, token) => {
  return {
    type: actions.UPDATE_VENDOR_ADDRESS,
    id,
    value,
    token,
  }
}

export const updateAddressEditMode = value => {
  return {
    type: actions.UPDATE_ADDRESS_EDIT_MODE,
    value,
  }
}

export const updateAddressAddMode = value => {
  return {
    type: actions.UPDATE_ADDRESS_ADD_MODE,
    value,
  }
}

// complaince Inffo

export const updateVendorComplianceInfo = (id, value, token) => {
  return {
    type: actions.UPDATE_VENDOR_COMPLIANANCE_INFO,
    id,
    value,
    token,
  }
}

export const updateComplianceEditMode = value => {
  return {
    type: actions.UPDATE_COMPLIANCE_EDIT_MODE,
    value,
  }
}

export const deleteVendorConfiguration = (id, token) => {
  return {
    type: actions.DELETE_VENDOR_CONFIGURATION,
    id,
    token,
  }
}

// Payments Currencies supported

export const updateVendorPaymentAddMode = value => {
  return {
    type: actions.UPDATE_VENDOR_PAYMNET_ADD_MODE,
    value,
  }
}

export const updatePayemntCurrSupportedAddMode = value => {
  return {
    type: actions.UPDATE_ADD_PAYMNET_CURRENCY_SUPP_ADD_MODE,
    value,
  }
}

export const addVendorPaymentsData = (id, value, token) => {
  return {
    type: actions.ADD_VENDOR_PAYMENTS_DATA,
    id,
    value,
    token,
  }
}

export const editVendorPaymentsData = (id, value, token) => {
  return {
    type: actions.EDIT_VENDOR_PAYMENTS_DATA,
    id,
    value,
    token,
  }
}

export const addNewPaymentsCurrencySupported = (id, value, token) => {
  return {
    type: actions.ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED,
    id,
    value,
    token,
  }
}

export const updateVendorConfigViewMode = value => {
  return {
    type: actions.UPDATE_VENDOR_CONFIG_VIEW_PAGE,
    value,
  }
}

export const updateSelectedRecordToEdit = value => {
  return {
    type: actions.UPDATE_SELECTED_RECORD_TO_EDIT,
    value,
  }
}

export const updatePayemntCurrSupportedEditMode = value => {
  return {
    type: actions.UPDATE_PAYMNET_CURRENCY_SUPP_EDIT_MODE,
    value,
  }
}

export const updatePaymentCurrencySupported = (entityId, currencySupportedId, value, token) => {
  return {
    type: actions.EDIT_PAYMENTS_CURRENCIES_SUPPORTED,
    entityId,
    currencySupportedId,
    value,
    token,
  }
}

export const deleteCurrencySupportedRecord = (id, currenciesSupportedId, token) => {
  return {
    type: actions.DELETE_P_CURRENCY_SUPPORTED,
    id,
    currenciesSupportedId,
    token,
  }
}

// Foriegn Exchange

export const updateVendorFXDataAddMode = value => {
  return {
    type: actions.UPDATE_VENDOR_FX_DATA_ADD_MODE,
    value,
  }
}

export const addVendorForiegnExchangeData = (id, value, token) => {
  return {
    type: actions.ADD_VENDOR_FX_DATA,
    id,
    value,
    token,
  }
}

export const addNewFXCurrencyPair = (id, value, token) => {
  return {
    type: actions.ADD_NEW_FX_CURRENCY_PAIR,
    id,
    value,
    token,
  }
}

export const updateFXCurrencyPair = (entityId, currencyPairId, value, token) => {
  return {
    type: actions.EDIT_FX_CURRENCY_PAIR,
    entityId,
    currencyPairId,
    value,
    token,
  }
}

export const updateFXCurrPairEditMode = value => {
  return {
    type: actions.UPDATE_ADD_FX_CURRENCY_PAIR_EDIT_MODE,
    value,
  }
}

export const updateFXCurrPairAddMode = value => {
  return {
    type: actions.UPDATE_ADD_FX_CURRENCY_PAIR_ADD_MODE,
    value,
  }
}

export const deleteVendorCurrencyPair = (id, currencyPairId, token) => {
  return {
    type: actions.DELETE_SELECTED_VENDOR_CURRENCY_PAIR,
    id,
    currencyPairId,
    token,
  }
}

// Local Accounts

export const updateVendorFeeEditMode = value => {
  return {
    type: actions.UPDATE_ADD_FEE_EDIT_MODE,
    value,
  }
}

export const updateVendorFeeAddMode = value => {
  return {
    type: actions.UPDATE_ADD_FEE_ADD_MODE,
    value,
  }
}

export const updateVendorLocalAccountAddMode = value => {
  return {
    type: actions.UPDATE_VENDOR_LOCAL_ACCOUNT_ADD_MODE,
    value,
  }
}

export const addVendorLocalAccount = (id, value, token) => {
  return {
    type: actions.ADD_VENDOR_LOCAL_ACCOUNT_DATA,
    id,
    value,
    token,
  }
}

export const addNewLocalAcountFeeData = (id, value, token) => {
  return {
    type: actions.ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR,
    id,
    value,
    token,
  }
}

export const editLocalAcountFeeData = (entityId, currencyPairId, value, token) => {
  return {
    type: actions.EDIT_LOCAL_ACCOUNT_FEE_PAIR,
    entityId,
    currencyPairId,
    value,
    token,
  }
}

export const deleteFeeRecord = (id, feeId, token) => {
  return {
    type: actions.DELETE_SELECTED_FEE_RECORD,
    id,
    feeId,
    token,
  }
}

export const updateVendorPaymentEditMode = value => {
  return {
    type: actions.UPDATE_VENDOR_PAYMENT_EDIT_MODE,
    value,
  }
}

export const updateVendorFXEditMode = value => {
  return {
    type: actions.UPDATE_VENDOR_FX_EDIT_MODE,
    value,
  }
}

export const updateVendorLocalAccountsEditMode = value => {
  return {
    type: actions.UPDATE_VENDOR_LOCAL_ACCOUNT_EDIT_MODE,
    value,
  }
}

export const editVendorForiegnExchangeData = (id, value, token) => {
  return {
    type: actions.EDIT_VENDOR_FX_DATA,
    id,
    value,
    token,
  }
}

export const editVendorLocalAccount = (id, value, token) => {
  return {
    type: actions.EDIT_VENDOR_LOCAL_ACCOUNT_DATA,
    id,
    value,
    token,
  }
}
