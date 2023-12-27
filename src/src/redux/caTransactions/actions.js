const actions = {
  UPDATE_SELECED_PAYMENT_TYPE: 'UPDATE_SELECED_PAYMENT_TYPE',

  GET_ACCOUNT_DETAILS_BY_ID: 'GET_ACCOUNT_DETAILS_BY_ID',
  GET_ACCOUNT_DETAILS_BY_ID_SUCCESS: 'GET_ACCOUNT_DETAILS_BY_ID_SUCCESS',
  GET_ACCOUNT_DETAILS_BY_ID_FAILURE: 'GET_ACCOUNT_DETAILS_BY_ID_FAILURE',

  GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID: 'GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID',
  GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID_SUCCESS: 'GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID_SUCCESS',
  GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID_FAILURE: 'GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID_FAILURE',

  GET_FIAT_BALANCE_TRANSACTIONS_BY_ID: 'GET_FIAT_BALANCE_TRANSACTIONS_BY_ID',
  GET_FIAT_BALANCE_TRANSACTIONS_BY_ID_SUCCESS: 'GET_FIAT_BALANCE_TRANSACTIONS_BY_ID_SUCCESS',
  GET_FIAT_BALANCE_TRANSACTIONS_BY_ID_FAILURE: 'GET_FIAT_BALANCE_TRANSACTIONS_BY_ID_FAILURE',

  GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE: 'GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE',
  GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE_SUCCESS:
    'GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE_SUCCESS',
  GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE_FAILURE:
    'GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE_FAILURE',

  UPDATE_SELECTED_TRANSACTION_RECORD_ID: 'UPDATE_SELECTED_TRANSACTION_RECORD_ID',

  GET_TRANSACTION_SUMMARY_DETAILS: 'GET_TRANSACTION_SUMMARY_DETAILS',
  GET_TRANSACTION_SUMMARY_DETAILS_SUCCESS: 'GET_TRANSACTION_SUMMARY_DETAILS_SUCCESS',
  GET_TRANSACTION_SUMMARY_DETAILS_FAILURE: 'GET_TRANSACTION_SUMMARY_DETAILS_FAILURE',
}

export default actions

export const updateSelectedTransactionRecordId = value => {
  return {
    type: actions.UPDATE_SELECTED_TRANSACTION_RECORD_ID,
    value,
  }
}

export const updateSelectedPaymentType = value => {
  return {
    type: actions.UPDATE_SELECED_PAYMENT_TYPE,
    value,
  }
}

export const getAccountDetailsById = (clientId, token) => {
  return {
    type: actions.GET_ACCOUNT_DETAILS_BY_ID,
    clientId,
    token,
  }
}

export const getFiatBalTransactionsById = (Id, value, token) => {
  return {
    type: actions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
    Id,
    value,
    token,
  }
}

export const getCryptoBalTransactionsById = (Id, value, token) => {
  return {
    type: actions.GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID,
    Id,
    value,
    token,
  }
}

export const getPaymentTransactionDetailsById = (transactionReference, token) => {
  return {
    type: actions.GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE,
    transactionReference,
    token,
  }
}

export const getPaymentTransactionSummary = (txnRef, token) => {
  return {
    type: actions.GET_TRANSACTION_SUMMARY_DETAILS,
    txnRef,
    token,
  }
}