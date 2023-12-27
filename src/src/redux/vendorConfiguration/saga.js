import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { push } from 'react-router-redux'
import axiosMethod from '../../utilities/apiCaller'

import actions from './action'

const {
  clientConnectPrivatePost,
  clientConnectPrivatePut,
  clientConnectPrivateGet,
  clientConnectPrivateDelete,
} = axiosMethod

const getVendorConfigurations = (value, token) => {
  const { limit, activePage } = value
  const limitSize = limit || limit === 0 ? `?limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return clientConnectPrivateGet(`entities/vendors${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllVendorConfigurations(values) {
  try {
    const response = yield call(getVendorConfigurations, values.value, values.token)
    yield put({
      type: actions.GET_ALL_VENDOR_CONFIGURATION_SUCCESS,
      value: response.entities,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_VENDOR_CONFIGURATION_FAILURE,
      payload: err,
    })
  }
}

const getVendorConfigurByFilters = (value, token) => {
  const { limit, activePage } = value
  const limitSize = limit || limit === 0 ? `?limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return clientConnectPrivateGet(`entities/vendors${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getVendorConfigurationsByFilters(values) {
  try {
    const response = yield call(getVendorConfigurByFilters, values.value, values.token)
    yield put({
      type: actions.GET_VENDOR_CONFIGURATION_BY_FILTERS_SUCCESS,
      value: response.entities,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_VENDOR_CONFIGURATION_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

const getVendorConfigById = values => {
  const { id, token } = values
  return clientConnectPrivateGet(`entities/vendors/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getVendorConfigurationById(values) {
  try {
    const response = yield call(getVendorConfigById, values)
    yield put({
      type: actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const addVendorConfiguration = values => {
  const { value, token } = values

  return clientConnectPrivatePost(`entities/vendors`, value, token).then(response => {
    return response.data.data
  })
}

export function* addNewVendorConfiguration(values) {
  try {
    const response = yield call(addVendorConfiguration, values)
    yield put({
      type: actions.ADD_NEW_VENDOR_CONFIGURATION_SUCCESS,
      value: response,
    })
    yield put(push('/edit-vendor-configuration'))
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_VENDOR_CONFIGURATION_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to add the vendor',
    })
  }
}

// Vendor Name and servicec blaock

const editVendorNameData = values => {
  const { id, value, token } = values
  return clientConnectPrivatePut(`entities/vendors/${id}`, value, token).then(response => {
    return response.data.data
  })
}

export function* updateVendorData(values) {
  try {
    const response = yield call(editVendorNameData, values)
    yield put({
      type: actions.UPDATE_VENDOR_DATA_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_VENDOR_DATA_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

// Address Block

const editVendorAddress = values => {
  const { id, value, token } = values
  return clientConnectPrivatePut(`entities/vendors/${id}/address`, value, token).then(response => {
    return response.data.data
  })
}

export function* updateVendorAddressByID(values) {
  try {
    const response = yield call(editVendorAddress, values)
    yield put({
      type: actions.UPDATE_VENDOR_ADDRESS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_VENDOR_ADDRESS_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

// Compliance Info

const editVendorComplianceInfo = values => {
  const { id, value, token } = values
  return clientConnectPrivatePut(`entities/vendors/${id}/compliance`, value, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateVendorComplianceInfo(values) {
  try {
    const response = yield call(editVendorComplianceInfo, values)
    yield put({
      type: actions.UPDATE_VENDOR_COMPLIANANCE_INFO_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_VENDOR_COMPLIANANCE_INFO_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const deleteVendorConfigu = values => {
  const { id, token } = values
  return clientConnectPrivateDelete(`entities/vendors/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteVendorConfiguration(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteVendorConfigu, values)
    yield put({
      type: actions.DELETE_VENDOR_CONFIGURATION_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID,
      id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_VENDOR_CONFIGURATION_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

// Payments

const postVendorPaymentsData = values => {
  const { id, value, token } = values
  return clientConnectPrivatePost(`entities/vendors/${id}/payments`, value, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* addVendorPaymentsData(values) {
  try {
    const response = yield call(postVendorPaymentsData, values)
    yield put({
      type: actions.ADD_VENDOR_PAYMENTS_DATA_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_VENDOR_PAYMENTS_DATA_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const updateVendorPaymentsData = values => {
  const { id, value, token } = values
  return clientConnectPrivatePut(`entities/vendors/${id}/payments`, value, token).then(response => {
    return response.data.data
  })
}

export function* editVendorPaymentsData(values) {
  try {
    const response = yield call(updateVendorPaymentsData, values)
    yield put({
      type: actions.EDIT_VENDOR_PAYMENTS_DATA_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_PAYMENTS_DATA_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const addPaymentsCurrSupported = values => {
  const { id, value, token } = values
  return clientConnectPrivatePost(
    `entities/vendors/${id}/payments/currenciesSupported`,
    value,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* addPaymentsCurrencySupported(values) {
  try {
    const response = yield call(addPaymentsCurrSupported, values)
    yield put({
      type: actions.ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const editPaymentsCurrSupported = values => {
  const { entityId, currencySupportedId, value, token } = values
  return clientConnectPrivatePut(
    `entities/vendors/${entityId}/payments/currenciesSupported/${currencySupportedId}`,
    value,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* editPaymentsCurrencySupported(values) {
  try {
    const response = yield call(editPaymentsCurrSupported, values)
    yield put({
      type: actions.EDIT_PAYMENTS_CURRENCIES_SUPPORTED_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_PAYMENTS_CURRENCIES_SUPPORTED_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const deleteCurrencySupported = values => {
  const { id, currenciesSupportedId, token } = values
  return clientConnectPrivateDelete(
    `entities/vendors/${id}/payments/currenciesSupported/${currenciesSupportedId}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* deleteCurrencySupportedPair(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteCurrencySupported, values)
    yield put({
      type: actions.DELETE_P_CURRENCY_SUPPORTED_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID,
      id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_P_CURRENCY_SUPPORTED_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

// Foriengn exchnage

const postVendorFXData = values => {
  const { id, value, token } = values
  return clientConnectPrivatePost(`entities/vendors/${id}/foreignExchange`, value, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* addVendorFXData(values) {
  try {
    const response = yield call(postVendorFXData, values)
    yield put({
      type: actions.ADD_VENDOR_FX_DATA_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_VENDOR_FX_DATA_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const updateVendorFXData = values => {
  const { id, value, token } = values
  return clientConnectPrivatePut(`entities/vendors/${id}/foreignExchange`, value, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* editVendorFXData(values) {
  try {
    const response = yield call(updateVendorFXData, values)
    yield put({
      type: actions.EDIT_VENDOR_FX_DATA_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_FX_DATA_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const postNewFXCurrencyPair = values => {
  const { id, value, token } = values
  return clientConnectPrivatePost(
    `entities/vendors/${id}/foreignExchange/currencyPair`,
    value,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* addFXCurrencyPair(values) {
  try {
    const response = yield call(postNewFXCurrencyPair, values)
    yield put({
      type: actions.ADD_NEW_FX_CURRENCY_PAIR_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_FX_CURRENCY_PAIR_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const editFXCurrencyPair = values => {
  const { entityId, currencyPairId, value, token } = values
  return clientConnectPrivatePut(
    `entities/vendors/${entityId}/foreignExchange/currencyPairs/${currencyPairId}`,
    value,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* editFXCurrencyPairData(values) {
  try {
    const response = yield call(editFXCurrencyPair, values)
    yield put({
      type: actions.EDIT_FX_CURRENCY_PAIR_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_FX_CURRENCY_PAIR_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const deleteCurrencyPairData = values => {
  const { id, currencyPairId, token } = values
  return clientConnectPrivateDelete(
    `entities/vendors/${id}/foreignExchange/currencyPairs/${currencyPairId}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* deleteCurrencyPair(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteCurrencyPairData, values)
    yield put({
      type: actions.DELETE_SELECTED_VENDOR_CURRENCY_PAIR_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID,
      id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SELECTED_VENDOR_CURRENCY_PAIR_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

// Local accounts

const postVendorLocalAccountData = values => {
  const { id, value, token } = values
  return clientConnectPrivatePost(`entities/vendors/${id}/localAccounts`, value, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* addVendorLocalAccountData(values) {
  try {
    const response = yield call(postVendorLocalAccountData, values)
    yield put({
      type: actions.ADD_VENDOR_LOCAL_ACCOUNT_DATA_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_VENDOR_LOCAL_ACCOUNT_DATA_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const updateVendorLocalAccountData = values => {
  const { id, value, token } = values
  return clientConnectPrivatePost(`entities/vendors/${id}/localAccounts`, value, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* editVendorLocalAccountData(values) {
  try {
    const response = yield call(updateVendorLocalAccountData, values)
    yield put({
      type: actions.EDIT_VENDOR_LOCAL_ACCOUNT_DATA_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_LOCAL_ACCOUNT_DATA_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const postLocalAccountFeeData = values => {
  const { id, value, token } = values
  return clientConnectPrivatePost(`entities/vendors/${id}/localAccounts/fees`, value, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* addLocalAccountFeeData(values) {
  try {
    const response = yield call(postLocalAccountFeeData, values)
    yield put({
      type: actions.ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const editLocalAccountFeeDetails = values => {
  const { entityId, currencyPairId, value, token } = values
  return clientConnectPrivatePut(
    `entities/vendors/${entityId}/localAccounts/fees/${currencyPairId}`,
    value,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* editLocalAccountFeeData(values) {
  try {
    const response = yield call(editLocalAccountFeeDetails, values)
    yield put({
      type: actions.EDIT_LOCAL_ACCOUNT_FEE_PAIR_SUCCESS,
      value: response,
    })

    notification.success({
      message: 'Success ...!',
      description: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_LOCAL_ACCOUNT_FEE_PAIR_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

const deleteLocalAccFeeData = values => {
  const { id, feeId, token } = values
  return clientConnectPrivateDelete(
    `entities/vendors/${id}/localAccounts/fees/${feeId}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* deleteLocalAccountFeeData(values) {
  const { id, token } = values
  try {
    const response = yield call(deleteLocalAccFeeData, values)
    yield put({
      type: actions.DELETE_SELECTED_FEE_RECORD_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID,
      id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SELECTED_FEE_RECORD_FAILURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: err.response.data.message,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_ALL_VENDOR_CONFIGURATION, getAllVendorConfigurations),
    takeEvery(actions.GET_VENDOR_CONFIGURATION_BY_FILTERS, getVendorConfigurationsByFilters),
    takeEvery(actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID, getVendorConfigurationById),
    takeEvery(actions.ADD_NEW_VENDOR_CONFIGURATION, addNewVendorConfiguration),
    takeEvery(actions.UPDATE_VENDOR_DATA, updateVendorData),

    takeEvery(actions.UPDATE_VENDOR_ADDRESS, updateVendorAddressByID),

    takeEvery(actions.UPDATE_VENDOR_COMPLIANANCE_INFO, updateVendorComplianceInfo),

    takeEvery(actions.DELETE_VENDOR_CONFIGURATION, deleteVendorConfiguration),

    takeEvery(actions.ADD_VENDOR_PAYMENTS_DATA, addVendorPaymentsData),
    takeEvery(actions.EDIT_VENDOR_PAYMENTS_DATA, editVendorPaymentsData),
    takeEvery(actions.ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED, addPaymentsCurrencySupported),
    takeEvery(actions.EDIT_PAYMENTS_CURRENCIES_SUPPORTED, editPaymentsCurrencySupported),
    takeEvery(actions.DELETE_P_CURRENCY_SUPPORTED, deleteCurrencySupportedPair),

    takeEvery(actions.ADD_VENDOR_FX_DATA, addVendorFXData),
    takeEvery(actions.EDIT_VENDOR_FX_DATA, editVendorFXData),
    takeEvery(actions.ADD_NEW_FX_CURRENCY_PAIR, addFXCurrencyPair),
    takeEvery(actions.EDIT_FX_CURRENCY_PAIR, editFXCurrencyPairData),
    takeEvery(actions.DELETE_SELECTED_VENDOR_CURRENCY_PAIR, deleteCurrencyPair),

    takeEvery(actions.ADD_VENDOR_LOCAL_ACCOUNT_DATA, addVendorLocalAccountData),

    takeEvery(actions.EDIT_VENDOR_LOCAL_ACCOUNT_DATA, editVendorLocalAccountData),
    takeEvery(actions.ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR, addLocalAccountFeeData),
    takeEvery(actions.EDIT_LOCAL_ACCOUNT_FEE_PAIR, editLocalAccountFeeData),
    takeEvery(actions.DELETE_SELECTED_FEE_RECORD, deleteLocalAccountFeeData),
  ])
}
