import { all, takeLatest, put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { notification } from 'antd'
import actions from './action'

import axiosMethod from '../../utilities/apiCaller'

const { cAPrivateGet, cAPrivatePost, cAPrivatePut, cAPrivateDelete } = axiosMethod

const getCurrencyAccountByClientId = (value, token) => {
  const { clientId, limit, activePage } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  const clientid = clientId ? `&ownerEntityId=${clientId}` : ''
  return cAPrivateGet(`accounts?accountType=client${limitSize}${page}${clientid}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getClientCAByFilters(values) {
  try {
    const response = yield call(getCurrencyAccountByClientId, values.value, values.token)
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_CLIENT_BY_FILTERS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_CLIENT_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

const addCurrencyAccount = (body, token) => {
  return cAPrivatePost(`accounts`, body, token).then(response => {
    return response.data
  })
}

export function* addAccountByCurrency(values) {
  try {
    const response = yield call(addCurrencyAccount, values.value, values.token)
    yield put({
      type: actions.ADD_ACCOUNT_BY_CURRENCY_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_CLIENT_BY_FILTERS,
      value: {
        limit: 50,
        activePage: 1,
        clientId: response.data.ownerEntityId,
      },
      token: values.token,
    })
    yield put({
      type: actions.CLOSE_CURRENCY_LIST_MODAL,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_ACCOUNT_BY_CURRENCY_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const getAllClientAccountsList = (value, token) => {
  const { limit, activePage } = value
  const limitSize = limit || limit === 0 ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return cAPrivateGet(`accounts?accountType=client${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllClientAccounts(values) {
  try {
    const response = yield call(getAllClientAccountsList, values.value, values.token)
    yield put({
      type: actions.GET_CLIENT_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CLIENT_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

const getAllplAccountsList = (value, token) => {
  const { limit, activePage } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return cAPrivateGet(`accounts?accountType=pl${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllplAccounts(values) {
  try {
    const response = yield call(getAllplAccountsList, values.value, values.token)
    yield put({
      type: actions.GET_P_AND_L_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_P_AND_L_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

// remove
const getAllVendorAccountsList = (value, token) => {
  const { limit, activePage } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return cAPrivateGet(`accounts?accountType=vendor${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllVendorAccounts(values) {
  try {
    const response = yield call(getAllVendorAccountsList, values.value, values.token)
    yield put({
      type: actions.GET_VENDOR_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_VENDOR_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

const getCAByFiltersList = (value, token) => {
  const { vendorId, limit, activePage } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  const accountid = vendorId ? `&accountId=${vendorId}` : ''
  return cAPrivateGet(`accounts?accountType=vendor${limitSize}${page}${accountid}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getCAofVendorByFilters(values) {
  try {
    const response = yield call(getCAByFiltersList, values.value, values.token)
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_BY_FILTERS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

const addVendorCA = (body, token) => {
  return cAPrivatePost(`accounts`, body, token).then(response => {
    return response.data
  })
}

export function* addVendorCAByCurrency(values) {
  try {
    const response = yield call(addVendorCA, values.value, values.token)
    yield put({
      type: actions.ADD_VENDOR_CA_BY_CURRENCY_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_BY_FILTERS,
      value: {
        limit: 50,
        activePage: 1,
        ownerEntityId: values.value.ownerEntityId,
      },
      token: values.token,
    })
    yield put({
      type: actions.CLOSE_CURRENCY_LIST_MODAL,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_VENDOR_CA_BY_CURRENCY_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// new

const getAllClientVendorAccountList = (value, token) => {
  const { limit, activePage } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return cAPrivateGet(`accounts?accountType=vendor_client${limitSize}${page}`, token).then(
    response => {
      return response.data.data
    },
  )
}

const getAllVendorClientVendorPlAccountsList = token => {
  const limitSize = `&limit=0`
  return cAPrivateGet(`accounts/vendor-accounts?${limitSize}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllClientVendorAccounts(values) {
  try {
    const response = yield call(getAllClientVendorAccountList, values.value, values.token)
    yield put({
      type: actions.GET_ALL_VENDOR_CLIENT_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_VENDOR_CLIENT_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

export function* getAllVendorClientVendorPlAccounts(values) {
  try {
    const response = yield call(getAllVendorClientVendorPlAccountsList, values.token)
    yield put({
      type: actions.GET_ALL_VENDOR_CLIENT_VENDOR_PL_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_VENDOR_CLIENT_VENDOR_PL_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

const getCAofVendorClientByFiltersList = (value, token) => {
  const { clientId, limit, activePage } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  const clientid = clientId ? `&ownerEntityId=${clientId}` : ''
  return cAPrivateGet(
    `accounts?accountType=vendor_client${limitSize}${page}${clientid}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getCAofVendorClientByFilters(values) {
  try {
    const response = yield call(getCAofVendorClientByFiltersList, values.value, values.token)
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_CLIENT_BY_FILTERS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_CLIENT_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}
// Vednor PL

const getAllVendorPLAccountsList = (value, token) => {
  const { limit, activePage } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return cAPrivateGet(`accounts?accountType=vendor_pl${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllVendorPLAccounts(values) {
  try {
    const response = yield call(getAllVendorPLAccountsList, values.value, values.token)
    yield put({
      type: actions.GET_ALL_VENDOR_PL_ACCOUNTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_VENDOR_PL_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

const getCAofVendorPLByFiltersList = (value, token) => {
  const { clientId, limit, activePage } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  const clientid = clientId ? `&ownerEntityId=${clientId}` : ''
  return cAPrivateGet(`accounts?accountType=vendor_pl${limitSize}${page}${clientid}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getCAofVendorPLByFilters(values) {
  try {
    const response = yield call(getCAofVendorPLByFiltersList, values.value, values.token)
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_PL_BY_FILTERS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_PL_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

// add vendor client CA

const addVendorClientCA = (body, token) => {
  return cAPrivatePost(`accounts`, body, token).then(response => {
    return response.data
  })
}

export function* addVendorClientCAByCurrency(values) {
  try {
    const response = yield call(addVendorClientCA, values.value, values.token)
    yield put({
      type: actions.ADD_VENDOR_CLIENT_CA_BY_CURRENCY_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_CLIENT_BY_FILTERS,
      value: {
        limit: 50,
        activePage: 1,
        ownerEntityId: values.value.ownerEntityId,
      },
      token: values.token,
    })
    yield put({
      type: actions.CLOSE_CURRENCY_LIST_MODAL,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_VENDOR_CLIENT_CA_BY_CURRENCY_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// add vendor PL CA

const addVendorPLCA = (body, token) => {
  return cAPrivatePost(`accounts`, body, token).then(response => {
    return response.data
  })
}

export function* addVendorPLCAByCurrency(values) {
  try {
    const response = yield call(addVendorPLCA, values.value, values.token)
    yield put({
      type: actions.ADD_VENDOR__PL_CA_BY_CURRENCY_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_PL_BY_FILTERS,
      value: {
        limit: 50,
        activePage: 1,
        ownerEntityId: values.value.ownerEntityId,
      },
      token: values.token,
    })
    yield put({
      type: actions.CLOSE_CURRENCY_LIST_MODAL,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_VENDOR__PL_CA_BY_CURRENCY_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addPandLCA = (body, token) => {
  return cAPrivatePost(`accounts`, body, token).then(response => {
    return response.data
  })
}

export function* addPandLCAByCurrency(values) {
  try {
    const response = yield call(addPandLCA, values.value, values.token)
    yield put({
      type: actions.ADD_PL_CA_BY_CURRENCY_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_P_AND_L_ACCOUNTS,
      value: {
        limit: 50,
        activePage: 1,
      },
      token: values.token,
    })
    yield put({
      type: actions.CLOSE_CURRENCY_LIST_MODAL,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    notification.error({
      message: err.response.data.data.message,
    })
    yield put({
      type: actions.ADD_PL_CA_BY_CURRENCY_FAILURE,
      payload: err,
    })
  }
}

const PandLCAByFiltersList = (value, token) => {
  const { limit, activePage, searchedAccountNum } = value
  const limitSize = limit ? `&limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  const accountNumber = searchedAccountNum ? `&accountNumber=${searchedAccountNum}` : ''
  return cAPrivateGet(`accounts?accountType=pl${limitSize}${page}${accountNumber}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* addPandLCAByFilters(values) {
  try {
    const response = yield call(PandLCAByFiltersList, values.value, values.token)
    yield put({
      type: actions.GET_P_AND_L_ACCOUNTS_BY_FILTERS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_P_AND_L_ACCOUNTS_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

const getCurrencyAccountById = (value, token) => {
  const clientid = value ? `?ownerEntityId=${value}` : ''
  return cAPrivateGet(`accounts/client${clientid}&limit=100`, token).then(response => {
    return response.data.data
  })
}

export function* getClientCAById(values) {
  try {
    const response = yield call(getCurrencyAccountById, values.value, values.token)
    yield put({
      type: actions.GET_CLIENT_CA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CLIENT_CA_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const getPlCurrencyAccountById = (value, token) => {
  const companyid = value ? `?ownerEntityId=${value}` : ''
  return cAPrivateGet(`accounts/pl${companyid}&limit=100`, token).then(response => {
    return response.data.data
  })
}

export function* getPLCAById(values) {
  try {
    const response = yield call(getPlCurrencyAccountById, values.value, values.token)
    yield put({
      type: actions.GET_PL_CA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PL_CA_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const getSuspenseCurrencyAccountById = (value, token) => {
  const companyid = value ? `?ownerEntityId=${value}` : ''
  return cAPrivateGet(`accounts/suspense${companyid}&limit=100`, token).then(response => {
    return response.data.data
  })
}

export function* getSuspenseCAById(values) {
  try {
    const response = yield call(getSuspenseCurrencyAccountById, values.value, values.token)
    yield put({
      type: actions.GET_SUSPENSE_CA_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_SUSPENSE_CA_BY_ID_FAILURE,
      payload: err,
    })
  }
}

// New version 2

const getAllPaymentsAccountsList = (value, token) => {
  const { limit, activePage } = value
  const limitSize = limit || limit === 0 ? `?limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  return cAPrivateGet(`accounts${limitSize}${page}`, token).then(response => {
    return response.data.data
  })
}

export function* getAllPaymentsAccounts(values) {
  try {
    const response = yield call(getAllPaymentsAccountsList, values.value, values.token)
    yield put({
      type: actions.GET_ALL_PAYMENT_ACCOUNTS_SUCCESS,
      value: response.accounts,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_PAYMENT_ACCOUNTS_FAILURE,
      payload: err,
    })
  }
}

const getAccountDetails = values => {
  const { id, token } = values
  return cAPrivateGet(`accounts/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getAccountDetailsById(values) {
  try {
    const response = yield call(getAccountDetails, values)
    yield put({
      type: actions.GET_PAYMENT_ACCOUNT_DETAILS_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PAYMENT_ACCOUNT_DETAILS_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const getPaymentAccountsByFiltersList = (value, token) => {
  const {
    limit,
    activePage,
    selectedAccountType,
    selectedCurrency,
    selectedOnwerEntityId,
    selectedIssuerEntityId,
  } = value
  const limitSize = limit ? `?limit=${limit}` : ''
  const page = limit ? `&page=${activePage}` : ''
  const accountType = selectedAccountType ? `&accountType=${selectedAccountType}` : ''
  const currency = selectedCurrency ? `&currency=${selectedCurrency}` : ''
  const issuerEntityId = selectedIssuerEntityId ? `&issuerEntityId=${selectedIssuerEntityId}` : ''
  const ownerEntityId = selectedOnwerEntityId ? `&ownerEntityId=${selectedOnwerEntityId}` : ''
  return cAPrivateGet(
    `accounts${limitSize}${page}${accountType}${currency}${issuerEntityId}${ownerEntityId}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* getPaymentAccountsByFilters(values) {
  try {
    const response = yield call(getPaymentAccountsByFiltersList, values.value, values.token)
    yield put({
      type: actions.GET_PAYMENT_ACCOUNTS_BY_FILTERS_SUCCESS,
      value: response.accounts,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PAYMENT_ACCOUNTS_BY_FILTERS_FAILURE,
      payload: err,
    })
  }
}

const addNewAccount = (body, token) => {
  return cAPrivatePost(`accounts`, body, token).then(response => {
    return response.data
  })
}

export function* addNewPaymentAccount(values) {
  try {
    const response = yield call(addNewAccount, values.value, values.token)
    yield put({
      type: actions.ADD_NEW_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })

    yield put(push(`/edit-currency-account/${response.data.id}`))
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_PAYMENT_ACCOUNT_FAILURE,
      payload: err.response.data.data.errors,
    })
    // notification.error({
    //   message: err.response.data.data.message,
    // })
  }
}

const editPaymentsAccount = (id, body, token) => {
  return cAPrivatePut(`accounts/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editPaymentAccount(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(editPaymentsAccount, accountId, value, token)
    yield put({
      type: actions.EDIT_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_PAYMENT_ACCOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deletePaymentAccountData = (accountId, token) => {
  return cAPrivateDelete(`accounts/${accountId}`, token).then(response => {
    return response.data
  })
}

export function* deletePaymentAccount(values) {
  const { accountId, token } = values
  try {
    const response = yield call(deletePaymentAccountData, accountId, token)
    yield put({
      type: actions.DELETE_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_PAYMENT_ACCOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addAccountIdentifer = (id, body, token) => {
  return cAPrivatePost(`accounts/${id}/identification`, body, token).then(response => {
    return response.data
  })
}

export function* addAccountIdentification(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addAccountIdentifer, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_ACCOUNT_IDENTIFICATION_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_ACCOUNT_IDENTIFICATION_FAILURE,
      payload: err.response.data.data.errors,
    })
    // notification.error({
    //   message: err.response.data.data.message,
    // })
  }
}

const deleteAccIdentification = (accountId, accIdentifierId, token) => {
  return cAPrivateDelete(`accounts/${accountId}/identification/${accIdentifierId}`, token).then(
    response => {
      return response.data
    },
  )
}

export function* deleteAccountIdentification(values) {
  try {
    const response = yield call(
      deleteAccIdentification,
      values.accountId,
      values.accIdentifierId,
      values.token,
    )
    yield put({
      type: actions.DELETE_ACCOUNT_IDENTIFICATION_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_ACCOUNT_IDENTIFICATION_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// External Reference

const addExternalReferenceData = (id, body, token) => {
  return cAPrivatePost(`accounts/${id}/external-reference`, body, token).then(response => {
    return response.data
  })
}

export function* addExternalReference(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addExternalReferenceData, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteExternalRef = (accountId, externalReferenceId, token) => {
  return cAPrivateDelete(
    `accounts/${accountId}/external-reference/${externalReferenceId}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* deleteExternalReference(values) {
  const { accountId, externalReferenceId, token } = values
  try {
    const response = yield call(deleteExternalRef, accountId, externalReferenceId, token)
    yield put({
      type: actions.DELETE_ACCOUNT_REFERENCE_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_ACCOUNT_REFERENCE_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// Account Thresholds

const addAccountThresholds = (id, body, token) => {
  return cAPrivatePost(`accounts/${id}/thresholds`, body, token).then(response => {
    return response.data
  })
}

export function* addNewAccountThresholds(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addAccountThresholds, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_ACCOUNT_THRESHOLD_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_ACCOUNT_THRESHOLD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteAccountLimits = (accountId, thresholdId, token) => {
  return cAPrivateDelete(`accounts/${accountId}/thresholds/${thresholdId}`, token).then(
    response => {
      return response.data
    },
  )
}

export function* deleteAccountThreshold(values) {
  const { accountId, thresholdId, token } = values
  try {
    const response = yield call(deleteAccountLimits, accountId, thresholdId, token)
    yield put({
      type: actions.DELETE_ACCOUNT_THRESHOLD_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_ACCOUNT_THRESHOLD_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// exotic fx config

const addExoticFXConfig = (id, body, token) => {
  return cAPrivatePost(`accounts/${id}/exotic-foreign-exchange`, body, token).then(response => {
    return response.data
  })
}

export function* addNewExoticFXConfig(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addExoticFXConfig, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_EXOTIC_FX_CONFIG_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_EXOTIC_FX_CONFIG_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteExoticFXConfigBYId = (accountId, exoticForeignExchangeId, token) => {
  return cAPrivateDelete(
    `accounts/${accountId}/exotic-foreign-exchange/${exoticForeignExchangeId}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* deleteExoticFXConfig(values) {
  const { accountId, exoticForeignExchangeId, token } = values
  try {
    const response = yield call(deleteExoticFXConfigBYId, accountId, exoticForeignExchangeId, token)
    yield put({
      type: actions.DELETE_EXOTIC_FX_CONFIG_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_EXOTIC_FX_CONFIG_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// Version 3

const addNewClientAccount = (body, token) => {
  return cAPrivatePost(`accounts/client`, body, token).then(response => {
    return response.data
  })
}

export function* addNewClientPaymentAccount(values) {
  try {
    const response = yield call(addNewClientAccount, values.value, values.token)
    yield put({
      type: actions.ADD_NEW_CLIENT_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })

    yield put(push(`/edit-client-payment-account/${response.data.id}`))
    notification.success({
      message: response.message,
    })
  } catch (err) {
    const otherErr = {
      'invalid-params': {
        error:
          err.response.data.data.title !== undefined
            ? [err.response.data.data.title]
            : 'Something is wrong',
      },
    }
    err.response.data.data.otherErr = otherErr
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_PAYMENT_ACCOUNT_FAILURE,
      payload:
        err.response.data.data.errors !== undefined ? err.response.data.data.errors : otherErr,
      otherErr: err.response.data,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const editClientsPaymentAccount = (id, body, token) => {
  return cAPrivatePut(`accounts/client/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editClientPaymentAccount(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(editClientsPaymentAccount, accountId, value, token)
    yield put({
      type: actions.EDIT_CLIENT_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_CLIENT_PAYMENT_ACCOUNT_FAILURE,
      payload: err.response.data.data.errors,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const deleteClientPaymentAccountData = (accountId, token) => {
  return cAPrivateDelete(`accounts/client/${accountId}`, token).then(response => {
    return response.data
  })
}

export function* deleteClientPaymentAccount(values) {
  const { accountId, token } = values
  try {
    const response = yield call(deleteClientPaymentAccountData, accountId, token)
    yield put({
      type: actions.DELETE_CLIENT_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_CLIENT_PAYMENT_ACCOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// external Reference

const addClientExternalReferenceData = (id, body, token) => {
  return cAPrivatePost(`accounts/external-reference/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* addClientExternalReference(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addClientExternalReferenceData, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_CLIENT_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_CLIENT_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editClientExternalReferenceData = (accountId, externalReferenceId, body, token) => {
  return cAPrivatePut(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    body,
    token,
  ).then(response => {
    return response.data
  })
}

export function* editClientExternalReference(values) {
  const { accountId, externalReferenceId, value, token } = values
  try {
    const response = yield call(
      editClientExternalReferenceData,
      accountId,
      externalReferenceId,
      value,
      token,
    )
    yield put({
      type: actions.EDIT_CLIENT_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_CLIENT_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteClientExternalRef = (accountId, externalReferenceId, token) => {
  return cAPrivateDelete(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* deleteClientExternalReference(values) {
  const { accountId, externalReferenceId, token } = values
  try {
    const response = yield call(deleteClientExternalRef, accountId, externalReferenceId, token)
    yield put({
      type: actions.DELETE_CLIENT_EXTERNAL_REFERENCE_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_CLIENT_EXTERNAL_REFERENCE_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addClientAccountThresholds = (id, body, token) => {
  return cAPrivatePost(`accounts/client/thresholds/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* addNewClientAccountThresholds(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addClientAccountThresholds, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_CLIENT_ACCOUNT_THRESHOLD_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_CLIENT_ACCOUNT_THRESHOLD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editClientAccountThresholdsData = (accountId, thresholdId, body, token) => {
  return cAPrivatePut(`accounts/client/thresholds/${accountId}/${thresholdId}`, body, token).then(
    response => {
      return response.data
    },
  )
}

export function* editClientAccountThresholds(values) {
  const { accountId, thresholdId, value, token } = values
  try {
    const response = yield call(
      editClientAccountThresholdsData,
      accountId,
      thresholdId,
      value,
      token,
    )
    yield put({
      type: actions.EDIT_CLIENT_ACCOUNT_THRESHOLD_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_CLIENT_ACCOUNT_THRESHOLD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteClientAccountLimits = (accountId, thresholdId, token) => {
  return cAPrivateDelete(`accounts/client/thresholds/${accountId}/${thresholdId}`, token).then(
    response => {
      return response.data
    },
  )
}

export function* deleteClientAccountThreshold(values) {
  const { accountId, thresholdId, token } = values
  try {
    const response = yield call(deleteClientAccountLimits, accountId, thresholdId, token)
    yield put({
      type: actions.DELETE_CLIENT_ACCOUNT_THRESHOLD_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_CLIENT_ACCOUNT_THRESHOLD_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// PL Accounts

const addPLPaymentAccount = (body, token) => {
  return cAPrivatePost(`accounts/pl`, body, token).then(response => {
    return response.data
  })
}

export function* addNewPLPaymentAccount(values) {
  try {
    const response = yield call(addPLPaymentAccount, values.value, values.token)
    yield put({
      type: actions.ADD_NEW_PL_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })

    yield put(push(`/edit-pl-payment-account/${response.data.id}`))
    notification.success({
      message: response.message,
    })
  } catch (err) {
    const otherErr = {
      'invalid-params': {
        error:
          err.response.data.data.title !== undefined
            ? [err.response.data.data.title]
            : 'Something is wrong',
      },
    }
    err.response.data.data.otherErr = otherErr
    yield put({
      type: actions.ADD_NEW_PL_PAYMENT_ACCOUNT_FAILURE,
      payload:
        err.response.data.data.errors !== undefined ? err.response.data.data.errors : otherErr,
    })

    // notification.error({
    //   message: err.response.data.data.message,
    // })
  }
}

const editPLPaymentAccountData = (id, body, token) => {
  return cAPrivatePut(`accounts/pl/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editPLPaymentAccount(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(editPLPaymentAccountData, accountId, value, token)
    yield put({
      type: actions.EDIT_PL_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_PL_PAYMENT_ACCOUNT_FAILURE,
      payload: err.response.data.data.errors,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const deletePLPaymentAccountData = (accountId, token) => {
  return cAPrivateDelete(`accounts/pl/${accountId}`, token).then(response => {
    return response.data
  })
}

export function* deletePLPaymentAccount(values) {
  const { accountId, token } = values
  try {
    const response = yield call(deletePLPaymentAccountData, accountId, token)
    yield put({
      type: actions.DELETE_PL_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_PL_PAYMENT_ACCOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addPLExternalReferenceData = (id, body, token) => {
  return cAPrivatePost(`accounts/external-reference/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* addPLExternalReference(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addPLExternalReferenceData, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_PL_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_PL_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editPlExternalReferenceData = (accountId, externalReferenceId, body, token) => {
  return cAPrivatePut(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    body,
    token,
  ).then(response => {
    return response.data
  })
}

export function* editPlExternalReference(values) {
  const { accountId, externalReferenceId, value, token } = values
  try {
    const response = yield call(
      editPlExternalReferenceData,
      accountId,
      externalReferenceId,
      value,
      token,
    )
    yield put({
      type: actions.EDIT_PL_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_PL_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deletePlExternalRef = (accountId, externalReferenceId, token) => {
  return cAPrivateDelete(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* deletePlExternalReference(values) {
  const { accountId, externalReferenceId, token } = values
  try {
    const response = yield call(deletePlExternalRef, accountId, externalReferenceId, token)
    yield put({
      type: actions.DELETE_PL_EXTERNAL_REFERENCE_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_PL_EXTERNAL_REFERENCE_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// Vendor Client

const addVendorClientAccount = (body, token) => {
  return cAPrivatePost(`accounts/vendor-client`, body, token).then(response => {
    return response.data
  })
}

export function* addVendorClientPaymentAccount(values) {
  try {
    const response = yield call(addVendorClientAccount, values.value, values.token)
    yield put({
      type: actions.ADD_NEW_VENDOR_CLIENT_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })

    yield put(push(`/edit-vendor-client-payment-account/${response.data.id}`))
    notification.success({
      message: response.message,
    })
  } catch (err) {
    const otherErr = {
      'invalid-params': {
        error:
          err.response.data.data.title !== undefined
            ? [err.response.data.data.title]
            : 'Something is wrong',
      },
    }
    err.response.data.data.otherErr = otherErr
    yield put({
      type: actions.ADD_NEW_VENDOR_CLIENT_PAYMENT_ACCOUNT_FAILURE,
      payload:
        err.response.data.data.errors !== undefined ? err.response.data.data.errors : otherErr,
    })
    // notification.error({
    //   message: err.response.data.data.message,
    // })
  }
}

const editVendorClientAccount = (id, body, token) => {
  return cAPrivatePut(`accounts/vendor-client/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editVendorClientPaymentAccount(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(editVendorClientAccount, accountId, value, token)
    yield put({
      type: actions.EDIT_VENDOR_CLIENT_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_CLIENT_PAYMENT_ACCOUNT_FAILURE,
      payload: err.response.data.data.errors,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const deleteVendorClientPaymentData = (accountId, token) => {
  return cAPrivateDelete(`accounts/vendor-client/${accountId}`, token).then(response => {
    return response.data
  })
}

export function* deleteVendorClientPaymentAccount(values) {
  const { accountId, token } = values
  try {
    const response = yield call(deleteVendorClientPaymentData, accountId, token)
    yield put({
      type: actions.DELETE_VENDOR_CLIENT_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_VENDOR_CLIENT_PAYMENT_ACCOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addVendorClientExternalRefData = (id, body, token) => {
  return cAPrivatePost(`accounts/external-reference/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* addVendorClientExternalReference(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addVendorClientExternalRefData, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_VENDOR_CLIENT_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_VENDOR_CLIENT_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editVendorClientExternalRefData = (accountId, externalReferenceId, body, token) => {
  return cAPrivatePut(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    body,
    token,
  ).then(response => {
    return response.data
  })
}

export function* editVendorClientExternalReference(values) {
  const { accountId, externalReferenceId, value, token } = values
  try {
    const response = yield call(
      editVendorClientExternalRefData,
      accountId,
      externalReferenceId,
      value,
      token,
    )
    yield put({
      type: actions.EDIT_VENDOR_CLIENT_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_CLIENT_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteVendorClientExternalRef = (accountId, externalReferenceId, token) => {
  return cAPrivateDelete(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* deleteVendorClientExternalReference(values) {
  const { accountId, externalReferenceId, token } = values
  try {
    const response = yield call(
      deleteVendorClientExternalRef,
      accountId,
      externalReferenceId,
      token,
    )
    yield put({
      type: actions.DELETE_VENDOR_CLIENT_EXTERNAL_REFERENCE_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_VENDOR_CLIENT_EXTERNAL_REFERENCE_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addVendorClientAccountThresholds = (id, body, token) => {
  return cAPrivatePost(`accounts/vendor-client/thresholds/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* addNewVendorClientAccountThresholds(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addVendorClientAccountThresholds, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_VENDOR_CLIENT_ACCOUNT_THRESHOLD_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_VENDOR_CLIENT_ACCOUNT_THRESHOLD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editVendorClientAccountThresholdsData = (accountId, thresholdId, body, token) => {
  return cAPrivatePut(
    `accounts/vendor-client/thresholds/${accountId}/${thresholdId}`,
    body,
    token,
  ).then(response => {
    return response.data
  })
}

export function* editVendorClientAccountThresholds(values) {
  const { accountId, thresholdId, value, token } = values
  try {
    const response = yield call(
      editVendorClientAccountThresholdsData,
      accountId,
      thresholdId,
      value,
      token,
    )
    yield put({
      type: actions.EDIT_VENDOR_CLIENT_ACCOUNT_THRESHOLD_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_CLIENT_ACCOUNT_THRESHOLD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteVendorClientAccountLimits = (accountId, thresholdId, token) => {
  return cAPrivateDelete(
    `accounts/vendor-client/thresholds/${accountId}/${thresholdId}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* deleteVendorClientAccountThreshold(values) {
  const { accountId, thresholdId, token } = values
  try {
    const response = yield call(deleteVendorClientAccountLimits, accountId, thresholdId, token)
    yield put({
      type: actions.DELETE_VENDOR_CLIENT_ACCOUNT_THRESHOLD_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_VENDOR_CLIENT_ACCOUNT_THRESHOLD_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addNewVendorClientExoticFX = (id, body, token) => {
  return cAPrivatePost(`accounts/vendor-client/exotic-foreign-exchange/${id}`, body, token).then(
    response => {
      return response.data
    },
  )
}

export function* addNewVendorClientExoticFXConfig(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addNewVendorClientExoticFX, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_VENDOR_CLIENT_EXOTIC_FX_CONFIG_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_VENDOR_CLIENT_EXOTIC_FX_CONFIG_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editVendorClientExoticFX = (id, body, token) => {
  return cAPrivatePut(`accounts/vendor-client/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editVendorClientExoticFXConfig(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(editVendorClientExoticFX, accountId, value, token)
    yield put({
      type: actions.EDIT_VENDOR_CLIENT_EXOTIC_FX_CONFIG_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_CLIENT_EXOTIC_FX_CONFIG_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// Vendor PL

const addVendorPLAccount = (body, token) => {
  return cAPrivatePost(`accounts/vendor-pl`, body, token).then(response => {
    return response.data
  })
}

export function* addVendorPLPaymentAccount(values) {
  try {
    const response = yield call(addVendorPLAccount, values.value, values.token)
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })

    yield put(push(`/edit-vendor-pl-payment-account/${response.data.id}`))
    notification.success({
      message: response.message,
    })
  } catch (err) {
    const otherErr = {
      'invalid-params': {
        error:
          err.response.data.data.title !== undefined
            ? [err.response.data.data.title]
            : 'Something is wrong',
      },
    }
    err.response.data.data.otherErr = otherErr
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_PAYMENT_ACCOUNT_FAILURE,
      payload:
        err.response.data.data.errors !== undefined ? err.response.data.data.errors : otherErr,
    })
    // notification.error({
    //   message: err.response.data.data.message,
    // })
  }
}

const editVendorPLAccount = (id, body, token) => {
  return cAPrivatePut(`accounts/vendor-pl/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editVendorPLPaymentAccount(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(editVendorPLAccount, accountId, value, token)
    yield put({
      type: actions.EDIT_VENDOR_PL_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_PL_PAYMENT_ACCOUNT_FAILURE,
      payload: err.response.data.data.errors,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const deleteVendorPLPaymentData = (accountId, token) => {
  return cAPrivateDelete(`accounts/vendor-pl/${accountId}`, token).then(response => {
    return response.data
  })
}

export function* deleteVendorPLPaymentAccount(values) {
  const { accountId, token } = values
  try {
    const response = yield call(deleteVendorPLPaymentData, accountId, token)
    yield put({
      type: actions.DELETE_VENDOR_PL_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_VENDOR_PL_PAYMENT_ACCOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// vendor pl external reference

const addVendorPLExternalRefData = (id, body, token) => {
  return cAPrivatePost(`accounts/external-reference/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* addVendorPLExternalReference(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addVendorPLExternalRefData, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editVendorPLExternalRefData = (accountId, externalReferenceId, body, token) => {
  return cAPrivatePut(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    body,
    token,
  ).then(response => {
    return response.data
  })
}

export function* editVendorPLExternalReference(values) {
  const { accountId, externalReferenceId, value, token } = values
  try {
    const response = yield call(
      editVendorPLExternalRefData,
      accountId,
      externalReferenceId,
      value,
      token,
    )
    yield put({
      type: actions.EDIT_VENDOR_PL_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_PL_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteVendorPLExternalRef = (accountId, externalReferenceId, token) => {
  return cAPrivateDelete(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* deleteVendorPLExternalReference(values) {
  const { accountId, externalReferenceId, token } = values
  try {
    const response = yield call(deleteVendorPLExternalRef, accountId, externalReferenceId, token)
    yield put({
      type: actions.DELETE_VENDOR_PL_EXTERNAL_REFERENCE_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_VENDOR_PL_EXTERNAL_REFERENCE_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addVendorPLAccountThresholds = (id, body, token) => {
  return cAPrivatePost(`accounts/vendor-pl/thresholds/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* addNewVendorPLAccountThresholds(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addVendorPLAccountThresholds, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_ACCOUNT_THRESHOLD_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_ACCOUNT_THRESHOLD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editVendorPLAccountThresholdsData = (accountId, thresholdId, body, token) => {
  return cAPrivatePut(
    `accounts/vendor-pl/thresholds/${accountId}/${thresholdId}`,
    body,
    token,
  ).then(response => {
    return response.data
  })
}

export function* editVendorPLAccountThresholds(values) {
  const { accountId, thresholdId, value, token } = values
  try {
    const response = yield call(
      editVendorPLAccountThresholdsData,
      accountId,
      thresholdId,
      value,
      token,
    )
    yield put({
      type: actions.EDIT_VENDOR_PL_ACCOUNT_THRESHOLD_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_PL_ACCOUNT_THRESHOLD_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteVendorPLAccountLimits = (accountId, thresholdId, token) => {
  return cAPrivateDelete(`accounts/vendor-pl/thresholds/${accountId}/${thresholdId}`, token).then(
    response => {
      return response.data
    },
  )
}

export function* deleteVendorPLAccountThreshold(values) {
  const { accountId, thresholdId, token } = values
  try {
    const response = yield call(deleteVendorPLAccountLimits, accountId, thresholdId, token)
    yield put({
      type: actions.DELETE_VENDOR_PL_ACCOUNT_THRESHOLD_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_VENDOR_PL_ACCOUNT_THRESHOLD_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// Vendor PL Exotic FX

const addNewVendorPLExoticFX = (id, body, token) => {
  return cAPrivatePost(`accounts/vendor-pl/exotic-foreign-exchange/${id}`, body, token).then(
    response => {
      return response.data
    },
  )
}

export function* addNewVendorPLExoticFXConfig(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addNewVendorPLExoticFX, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_EXOTIC_FX_CONFIG_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_VENDOR_PL_EXOTIC_FX_CONFIG_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editVendorPLExoticFX = (id, body, token) => {
  return cAPrivatePut(`accounts/vendor-pl/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editVendorPLExoticFXConfig(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(editVendorPLExoticFX, accountId, value, token)
    yield put({
      type: actions.EDIT_VENDOR_PL_EXOTIC_FX_CONFIG_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_VENDOR_PL_EXOTIC_FX_CONFIG_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

// Suspense Accounts

const addSuspensePaymentAccount = (body, token) => {
  return cAPrivatePost(`accounts/suspense`, body, token).then(response => {
    return response.data
  })
}

export function* addNewSuspensePaymentAccount(values) {
  try {
    const response = yield call(addSuspensePaymentAccount, values.value, values.token)
    yield put({
      type: actions.ADD_NEW_SUSPENSE_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })

    yield put(push(`/edit-suspense-payment-account/${response.data.id}`))
    notification.success({
      message: response.message,
    })
  } catch (err) {
    const otherErr = {
      'invalid-params': {
        error:
          err.response.data.data.title !== undefined
            ? [err.response.data.data.title]
            : 'Something is wrong',
      },
    }
    err.response.data.data.otherErr = otherErr
    yield put({
      type: actions.ADD_NEW_SUSPENSE_PAYMENT_ACCOUNT_FAILURE,
      payload:
        err.response.data.data.errors !== undefined ? err.response.data.data.errors : otherErr,
    })

    // notification.error({
    //   message: err.response.data.data.message,
    // })
  }
}

const editSuspensePaymentAccountData = (id, body, token) => {
  return cAPrivatePut(`accounts/suspense/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* editSuspensePaymentAccount(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(editSuspensePaymentAccountData, accountId, value, token)
    yield put({
      type: actions.EDIT_SUSPENSE_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    const otherErr = {
      'invalid-params': {
        error:
          err.response.data.data.title !== undefined
            ? [err.response.data.data.title]
            : 'Something is wrong',
      },
    }
    err.response.data.data.otherErr = otherErr
    yield put({
      type: actions.EDIT_SUSPENSE_PAYMENT_ACCOUNT_FAILURE,
      payload:
        err.response.data.data.errors !== undefined ? err.response.data.data.errors : otherErr,
    })
  }
}

const deleteSuspensePaymentAccountData = (accountId, token) => {
  return cAPrivateDelete(`accounts/suspense/${accountId}`, token).then(response => {
    return response.data
  })
}

export function* deleteSuspensePaymentAccount(values) {
  const { accountId, token } = values
  try {
    const response = yield call(deleteSuspensePaymentAccountData, accountId, token)
    yield put({
      type: actions.DELETE_SUSPENSE_PAYMENT_ACCOUNT_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SUSPENSE_PAYMENT_ACCOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const addSuspenseExternalReferenceData = (id, body, token) => {
  return cAPrivatePost(`accounts/external-reference/${id}`, body, token).then(response => {
    return response.data
  })
}

export function* addSuspenseExternalReference(values) {
  const { accountId, value, token } = values
  try {
    const response = yield call(addSuspenseExternalReferenceData, accountId, value, token)
    yield put({
      type: actions.ADD_NEW_SUSPENSE_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_NEW_SUSPENSE_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const editSuspenseExternalReferenceData = (accountId, externalReferenceId, body, token) => {
  return cAPrivatePut(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    body,
    token,
  ).then(response => {
    return response.data
  })
}

export function* editSuspenseExternalReference(values) {
  const { accountId, externalReferenceId, value, token } = values
  try {
    const response = yield call(
      editSuspenseExternalReferenceData,
      accountId,
      externalReferenceId,
      value,
      token,
    )
    yield put({
      type: actions.EDIT_SUSPENSE_EXTERNAL_REFERENCE_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.EDIT_SUSPENSE_EXTERNAL_REFERENCE_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

const deleteSuspenseExternalRef = (accountId, externalReferenceId, token) => {
  return cAPrivateDelete(
    `accounts/external-reference/${accountId}/${externalReferenceId}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* deleteSuspenseExternalReference(values) {
  const { accountId, externalReferenceId, token } = values
  try {
    const response = yield call(deleteSuspenseExternalRef, accountId, externalReferenceId, token)
    yield put({
      type: actions.DELETE_SUSPENSE_EXTERNAL_REFERENCE_BY_ID_SUCCESS,
      value: response.data,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_SUSPENSE_EXTERNAL_REFERENCE_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.message,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_CURRENCY_ACCOUNTS_OF_CLIENT_BY_FILTERS, getClientCAByFilters),
    takeLatest(actions.ADD_ACCOUNT_BY_CURRENCY, addAccountByCurrency),
    takeLatest(actions.GET_CLIENT_ACCOUNTS, getAllClientAccounts),

    // Vendor
    // remove
    takeLatest(actions.GET_VENDOR_ACCOUNTS, getAllVendorAccounts),
    takeLatest(actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_BY_FILTERS, getCAofVendorByFilters),
    takeLatest(actions.ADD_VENDOR_CA_BY_CURRENCY, addVendorCAByCurrency),

    // new
    takeLatest(actions.GET_ALL_VENDOR_CLIENT_ACCOUNTS, getAllClientVendorAccounts),
    takeLatest(
      actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_CLIENT_BY_FILTERS,
      getCAofVendorClientByFilters,
    ),
    takeLatest(actions.ADD_VENDOR_CLIENT_CA_BY_CURRENCY, addVendorClientCAByCurrency),

    takeLatest(
      actions.GET_ALL_VENDOR_CLIENT_VENDOR_PL_ACCOUNTS,
      getAllVendorClientVendorPlAccounts,
    ),

    takeLatest(actions.GET_ALL_VENDOR_PL_ACCOUNTS, getAllVendorPLAccounts),
    takeLatest(actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_PL_BY_FILTERS, getCAofVendorPLByFilters),
    takeLatest(actions.ADD_VENDOR__PL_CA_BY_CURRENCY, addVendorPLCAByCurrency),

    // P&L
    takeLatest(actions.GET_P_AND_L_ACCOUNTS, getAllplAccounts),
    takeLatest(actions.ADD_PL_CA_BY_CURRENCY, addPandLCAByCurrency),
    takeLatest(actions.GET_P_AND_L_ACCOUNTS_BY_FILTERS, addPandLCAByFilters),

    takeLatest(actions.GET_CLIENT_CA_BY_ID, getClientCAById),
    takeLatest(actions.GET_PL_CA_BY_ID, getPLCAById),
    takeLatest(actions.GET_SUSPENSE_CA_BY_ID, getSuspenseCAById),
    // New version 2
    takeLatest(actions.GET_ALL_PAYMENT_ACCOUNTS, getAllPaymentsAccounts),
    takeLatest(actions.GET_PAYMENT_ACCOUNTS_BY_FILTERS, getPaymentAccountsByFilters),

    takeLatest(actions.GET_PAYMENT_ACCOUNT_DETAILS_BY_ID, getAccountDetailsById),

    takeLatest(actions.ADD_NEW_PAYMENT_ACCOUNT, addNewPaymentAccount),
    takeLatest(actions.EDIT_PAYMENT_ACCOUNT, editPaymentAccount),
    takeLatest(actions.DELETE_PAYMENT_ACCOUNT, deletePaymentAccount),

    takeLatest(actions.ADD_NEW_ACCOUNT_IDENTIFICATION, addAccountIdentification),
    takeLatest(actions.DELETE_ACCOUNT_IDENTIFICATION, deleteAccountIdentification),

    takeLatest(actions.ADD_NEW_EXTERNAL_REFERENCE, addExternalReference),
    takeLatest(actions.DELETE_ACCOUNT_REFERENCE_BY_ID, deleteExternalReference),

    takeLatest(actions.ADD_NEW_ACCOUNT_THRESHOLD, addNewAccountThresholds),
    takeLatest(actions.DELETE_ACCOUNT_THRESHOLD_BY_ID, deleteAccountThreshold),

    takeLatest(actions.ADD_NEW_EXOTIC_FX_CONFIG, addNewExoticFXConfig),
    takeLatest(actions.DELETE_EXOTIC_FX_CONFIG_BY_ID, deleteExoticFXConfig),

    // Version 3
    takeLatest(actions.ADD_NEW_CLIENT_PAYMENT_ACCOUNT, addNewClientPaymentAccount),
    takeLatest(actions.EDIT_CLIENT_PAYMENT_ACCOUNT, editClientPaymentAccount),
    takeLatest(actions.DELETE_CLIENT_PAYMENT_ACCOUNT, deleteClientPaymentAccount),

    takeLatest(actions.ADD_NEW_CLIENT_EXTERNAL_REFERENCE, addClientExternalReference),
    takeLatest(actions.EDIT_CLIENT_EXTERNAL_REFERENCE, editClientExternalReference),
    takeLatest(actions.DELETE_CLIENT_EXTERNAL_REFERENCE_BY_ID, deleteClientExternalReference),

    takeLatest(actions.ADD_NEW_CLIENT_ACCOUNT_THRESHOLD, addNewClientAccountThresholds),
    takeLatest(actions.EDIT_CLIENT_ACCOUNT_THRESHOLD, editClientAccountThresholds),
    takeLatest(actions.DELETE_CLIENT_ACCOUNT_THRESHOLD_BY_ID, deleteClientAccountThreshold),

    // PL accounts

    takeLatest(actions.ADD_NEW_PL_PAYMENT_ACCOUNT, addNewPLPaymentAccount),
    takeLatest(actions.EDIT_PL_PAYMENT_ACCOUNT, editPLPaymentAccount),
    takeLatest(actions.DELETE_PL_PAYMENT_ACCOUNT, deletePLPaymentAccount),

    takeLatest(actions.ADD_NEW_PL_EXTERNAL_REFERENCE, addPLExternalReference),
    takeLatest(actions.EDIT_PL_EXTERNAL_REFERENCE, editPlExternalReference),
    takeLatest(actions.DELETE_PL_EXTERNAL_REFERENCE_BY_ID, deletePlExternalReference),

    // Vendor Client

    takeLatest(actions.ADD_NEW_VENDOR_CLIENT_PAYMENT_ACCOUNT, addVendorClientPaymentAccount),
    takeLatest(actions.EDIT_VENDOR_CLIENT_PAYMENT_ACCOUNT, editVendorClientPaymentAccount),
    takeLatest(actions.DELETE_VENDOR_CLIENT_PAYMENT_ACCOUNT, deleteVendorClientPaymentAccount),

    takeLatest(actions.ADD_NEW_VENDOR_CLIENT_EXTERNAL_REFERENCE, addVendorClientExternalReference),
    takeLatest(actions.EDIT_VENDOR_CLIENT_EXTERNAL_REFERENCE, editVendorClientExternalReference),
    takeLatest(
      actions.DELETE_VENDOR_CLIENT_EXTERNAL_REFERENCE_BY_ID,
      deleteVendorClientExternalReference,
    ),

    takeLatest(
      actions.ADD_NEW_VENDOR_CLIENT_ACCOUNT_THRESHOLD,
      addNewVendorClientAccountThresholds,
    ),
    takeLatest(actions.EDIT_VENDOR_CLIENT_ACCOUNT_THRESHOLD, editVendorClientAccountThresholds),
    takeLatest(
      actions.DELETE_VENDOR_CLIENT_ACCOUNT_THRESHOLD_BY_ID,
      deleteVendorClientAccountThreshold,
    ),

    takeLatest(actions.ADD_NEW_VENDOR_CLIENT_EXOTIC_FX_CONFIG, addNewVendorClientExoticFXConfig),
    takeLatest(actions.EDIT_VENDOR_CLIENT_EXOTIC_FX_CONFIG, editVendorClientExoticFXConfig),

    // Vendor PL

    takeLatest(actions.ADD_NEW_VENDOR_PL_PAYMENT_ACCOUNT, addVendorPLPaymentAccount),
    takeLatest(actions.EDIT_VENDOR_PL_PAYMENT_ACCOUNT, editVendorPLPaymentAccount),
    takeLatest(actions.DELETE_VENDOR_PL_PAYMENT_ACCOUNT, deleteVendorPLPaymentAccount),

    takeLatest(actions.ADD_NEW_VENDOR_PL_EXTERNAL_REFERENCE, addVendorPLExternalReference),
    takeLatest(actions.EDIT_VENDOR_PL_EXTERNAL_REFERENCE, editVendorPLExternalReference),
    takeLatest(actions.DELETE_VENDOR_PL_EXTERNAL_REFERENCE_BY_ID, deleteVendorPLExternalReference),

    takeLatest(actions.ADD_NEW_VENDOR_PL_ACCOUNT_THRESHOLD, addNewVendorPLAccountThresholds),
    takeLatest(actions.EDIT_VENDOR_PL_ACCOUNT_THRESHOLD, editVendorPLAccountThresholds),
    takeLatest(actions.DELETE_VENDOR_PL_ACCOUNT_THRESHOLD_BY_ID, deleteVendorPLAccountThreshold),

    takeLatest(actions.ADD_NEW_VENDOR_PL_EXOTIC_FX_CONFIG, addNewVendorPLExoticFXConfig),
    takeLatest(actions.EDIT_VENDOR_PL_EXOTIC_FX_CONFIG, editVendorPLExoticFXConfig),

    // Suspense accounts

    takeLatest(actions.ADD_NEW_SUSPENSE_PAYMENT_ACCOUNT, addNewSuspensePaymentAccount),
    takeLatest(actions.EDIT_SUSPENSE_PAYMENT_ACCOUNT, editSuspensePaymentAccount),
    takeLatest(actions.DELETE_SUSPENSE_PAYMENT_ACCOUNT, deleteSuspensePaymentAccount),

    takeLatest(actions.ADD_NEW_SUSPENSE_EXTERNAL_REFERENCE, addSuspenseExternalReference),
    takeLatest(actions.EDIT_SUSPENSE_EXTERNAL_REFERENCE, editSuspenseExternalReference),
    takeLatest(actions.DELETE_SUSPENSE_EXTERNAL_REFERENCE_BY_ID, deleteSuspenseExternalReference),
  ])
}
