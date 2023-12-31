const actions = {
  CHANGE_MODE_OPERATION: 'CHANGE_MODE_OPERATION',

  FETCH_BANK_ACCOUNTS: 'FETCH_BANK_ACCOUNTS',
  FETCH_BANK_ACCOUNTS_SUCCESS: 'FETCH_BANK_ACCOUNTS_SUCCESS',
  FETCH_BANK_ACCOUNTS_FAILURE: 'FETCH_BANK_ACCOUNTS_FAILURE',

  UPDATE_ROUTE_TYPE: 'UPDATE_ROUTE_TYPE',

  GET_ALL_CRYPTO_TRANSACTIONS: 'GET_ALL_CRYPTO_TRANSACTIONS',
  GET_ALL_CRYPTO_TRANSACTIONS_SUCCESS: 'GET_ALL_CRYPTO_TRANSACTIONS_SUCCESS',
  GET_ALL_CRYPTO_TRANSACTIONS_FAILURE: 'GET_ALL_CRYPTO_TRANSACTIONS_FAILURE',

  INITIATE_CRYPTO_TRANSACTION: 'INITIATE_CRYPTO_TRANSACTION',

  GET_CRYPTO_TRANSACTION_BY_ID: 'GET_CRYPTO_TRANSACTION_BY_ID',
  GET_CRYPTO_TRANSACTION_BY_ID_SUCCESS: 'GET_CRYPTO_TRANSACTION_BY_ID_SUCCESS',
  GET_CRYPTO_TRANSACTION_BY_ID_FAILURE: 'GET_CRYPTO_TRANSACTION_BY_ID_FAILURE',

  GET_CRYPTO_TRANSACTION_BY_CLIENT_ID: 'GET_CRYPTO_TRANSACTION_BY_CLIENT_ID',
  GET_CRYPTO_TRANSACTION_BY_CLIENT_ID_SUCCESS: 'GET_CRYPTO_TRANSACTION_BY_CLIENT_ID_SUCCESS',
  GET_CRYPTO_TRANSACTION_BY_CLIENT_ID_FAILURE: 'GET_CRYPTO_TRANSACTION_BY_CLIENT_ID_FAILURE',

  SELECTED_LIST_CRYPTO_TRANSACTION: 'SELECTED_LIST_CRYPTO_TRANSACTION',

  CHANGE_EDIT_TXN_MODE: 'CHANGE_EDIT_TXN_MODE',

  UPDATE_CRYPTO_TRANSACTION: 'UPDATE_CRYPTO_TRANSACTION',
  UPDATE_CRYPTO_TRANSACTION_SUCCESS: 'UPDATE_CRYPTO_TRANSACTION_SUCCESS',
  UPDATE_CRYPTO_TRANSACTION_FAILURE: 'UPDATE_CRYPTO_TRANSACTION_FAILURE',

  CANCEL_CRYPTO_TRANSACTION: 'CANCEL_CRYPTO_TRANSACTION',
  CANCEL_CRYPTO_TRANSACTION_SUCCESS: 'CANCEL_CRYPTO_TRANSACTION_SUCCESS',
  CANCEL_CRYPTO_TRANSACTION_FAILURE: 'CANCEL_CRYPTO_TRANSACTION_FAILURE',

  DELETE_CRYPTO_TRANSACTION: 'DELETE_CRYPTO_TRANSACTION',
  DELETE_CRYPTO_TRANSACTION_SUCCESS: 'DELETE_CRYPTO_TRANSACTION_SUCCESS',
  DELETE_CRYPTO_TRANSACTION_FAILURE: 'DELETE_CRYPTO_TRANSACTION_FAILURE',

  BULK_DELETE_CRYPTO_TRANSACTION: 'BULK_DELETE_CRYPTO_TRANSACTION',
  BULK_DELETE_CRYPTO_TRANSACTION_SUCCESS: 'BULK_DELETE_CRYPTO_TRANSACTION_SUCCESS',
  BULK_DELETE_CRYPTO_TRANSACTION_FAILURE: 'BULK_DELETE_CRYPTO_TRANSACTION_FAILURE',

  UPDATE_VENDOR: 'UPDATE_VENDOR',
  UPDATE_VENDOR_SUCCESS: 'UPDATE_VENDOR_SUCCESS',
  UPDATE_VENDOR_FAILURE: 'UPDATE_VENDOR_FAILURE',

  SELECTED_VENDOR: 'SELECTED_VENDOR',

  GET_BENEFICIARY_BY_VENDOR_ID: 'GET_BENEFICIARY_BY_VENDOR_ID',
  GET_BENEFICIARY_BY_VENDOR_ID_SUCCESS: 'GET_BENEFICIARY_BY_VENDOR_ID_SUCCESS',
  GET_BENEFICIARY_BY_VENDOR_ID_FAILURE: 'GET_BENEFICIARY_BY_VENDOR_ID_FAILURE',

  REMOVE_VENDOR: 'REMOVE_VENDOR',
  UPDATE_BENEFICIARY: 'UPDATE_BENEFICIARY',
  REMOVE_BENEFICIARY: 'REMOVE_BENEFICIARY',
  UPDATE_DEPOSIT_CURRENCY: 'UPDATE_DEPOSIT_CURRENCY',
  UPDATE_DEPOSIT_AMOUNT: 'UPDATE_DEPOSIT_AMOUNT',

  CREATE_CRYPTO_TRANSACTION: 'CREATE_CRYPTO_TRANSACTION',
  CREATE_CRYPTO_TRANSACTION_SUCCESS: 'CREATE_CRYPTO_TRANSACTION_SUCCESS',
  CREATE_CRYPTO_TRANSACTION_FAILURE: 'CREATE_CRYPTO_TRANSACTION_FAILURE',

  UPDATE_CRYPTO_SELECTED_BENEFICIARY: 'UPDATE_CRYPTO_SELECTED_BENEFICIARY',
  UPDATE_CRYPTO_SELECTED_BENEFICIARY_SUCCESS: 'UPDATE_CRYPTO_SELECTED_BENEFICIARY_SUCCESS',
  UPDATE_CRYPTO_SELECTED_BENEFICIARY_FAILURE: 'UPDATE_CRYPTO_SELECTED_BENEFICIARY_FAILURE',

  UPDATE_CRYPTO_SELECTED_VENDOR: 'UPDATE_CRYPTO_SELECTED_VENDOR',
  UPDATE_CRYPTO_SELECTED_VENDOR_SUCCESS: 'UPDATE_CRYPTO_SELECTED_VENDOR_SUCCESS',
  UPDATE_CRYPTO_SELECTED_VENDOR_FAILURE: 'UPDATE_CRYPTO_SELECTED_VENDOR_FAILURE',

  SELECTED_ACCOUNT_REQUESTED_DATE: 'SELECTED_ACCOUNT_REQUESTED_DATE',
  SELECTED_ACCOUNT_RECEIVED_DATE: 'SELECTED_ACCOUNT_RECEIVED_DATE',

  CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE: 'CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE',
  CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE_SUCCESS: 'CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE_SUCCESS',
  CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE_FAILURE: 'CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE_FAILURE',

  CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE: 'CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE',
  CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE_SUCCESS: 'CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE_SUCCESS',
  CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE_FAILURE: 'CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE_FAILURE',

  ENTERED_CRYPTO_RECEIVED_AMOUNT: 'ENTERED_CRYPTO_RECEIVED_AMOUNT',
  SELECTED_RECEIVED_AMOUNT_CONFIRMATION_DATE_CRYPTO:
    'SELECTED_RECEIVED_AMOUNT_CONFIRMATION_DATE_CRYPTO',

  UPDATE_CRYPTO_TRANSACTION_AMOUNT: 'UPDATE_CRYPTO_TRANSACTION_AMOUNT',
  UPDATE_CRYPTO_TRANSACTION_AMOUNT_SUCCESS: 'UPDATE_CRYPTO_TRANSACTION_AMOUNT_SUCCESS',
  UPDATE_CRYPTO_TRANSACTION_AMOUNT_FAILURE: 'UPDATE_CRYPTO_TRANSACTION_AMOUNT_FAILURE',

  CONFIRM_RECEIVED_CRYPTO_AMOUNT: 'CONFIRM_RECEIVED_CRYPTO_AMOUNT',
  CONFIRM_RECEIVED_CRYPTO_AMOUNT_SUCCESS: 'CONFIRM_RECEIVED_CRYPTO_AMOUNT_SUCCESS',
  CONFIRM_RECEIVED_CRYPTO_AMOUNT_FAILURE: 'CONFIRM_RECEIVED_CRYPTO_AMOUNT_FAILURE',

  ENTERED_REMITTED_AMOUNT: 'ENTERED_REMITTED_AMOUNT',
  SELECTED_REMITED_AMOUNT_CONFIRMATION_DATE: 'SELECTED_REMITED_AMOUNT_CONFIRMATION_DATE',

  CONFIRM_CRYPTO_REMITED_FUNDS: 'CONFIRM_CRYPTO_REMITED_FUNDS',
  CONFIRM_CRYPTO_REMITED_FUNDS_SUCCESS: 'CONFIRM_CRYPTO_REMITED_FUNDS_SUCCESS',
  CONFIRM_CRYPTO_REMITED_FUNDS_FAILURE: 'CONFIRM_CRYPTO_REMITED_FUNDS_FAILURE',

  UPDATE_CRYPTO_VENDOR_DETAILS: 'UPDATE_CRYPTO_VENDOR_DETAILS',

  GET_CRYPTO_BUY_RATE: 'GET_CRYPTO_BUY_RATE',
  GET_CRYPTO_BUY_RATE_SUCCESS: 'GET_CRYPTO_BUY_RATE_SUCCESS',
  GET_CRYPTO_BUY_RATE_FAILURE: 'GET_CRYPTO_BUY_RATE_FAILURE',

  CHANGE_DAY_RATE: 'CHANGE_DAY_RATE',
  UPDATE_DAY_RATE: 'UPDATE_DAY_RATE',
  CHANGE_INVERSE_RATE: 'CHANGE_INVERSE_RATE',
  CHECK_PRECISION: 'CHECK_PRECISION',
  UPDATE_PRECISION: 'UPDATE_PRECISION',
  ENTERED_NEW_RATE: 'ENTERED_NEW_RATE',

  GET_FX_BASE_RATE_BY_CRYPTO_VENDOR: 'GET_FX_BASE_RATE_BY_CRYPTO_VENDOR',
  GET_FX_BASE_RATE_BY_CRYPTO_VENDOR_SUCCESS: 'GET_FX_BASE_RATE_BY_CRYPTO_VENDOR_SUCCESS',
  GET_FX_BASE_RATE_BY_CRYPTO_VENDOR_FAILURE: 'GET_FX_BASE_RATE_BY_CRYPTO_VENDOR_FAILURE',

  UPDATE_CRYPTO_TRANSACTION_VALUES: 'UPDATE_CRYPTO_TRANSACTION_VALUES',
  UPDATE_CRYPTO_TRANSACTION_VALUES_SUCCESS: 'UPDATE_CRYPTO_TRANSACTION_VALUES_SUCCESS',
  UPDATE_CRYPTO_TRANSACTION_VALUES_FAILURE: 'UPDATE_CRYPTO_TRANSACTION_VALUES_FAILURE',

  CREATE_CRYPTO_TXN_FEES: 'CREATE_CRYPTO_TXN_FEES',
  CREATE_CRYPTO_TXN_FEES_SUCCESS: 'CREATE_CRYPTO_TXN_FEES_SUCCESS',
  CREATE_CRYPTO_TXN_FEES_FAILURE: 'CREATE_CRYPTO_TXN_FEES_FAILURE',

  GET_CRYTXN_BY_CRYTXN_ID: 'GET_CRYTXN_BY_CRYTXN_ID',
  GET_CRYTXN_BY_CRYTXN_ID_SUCCESS: 'GET_CRYTXN_BY_CRYTXN_ID_SUCCESS',
  GET_CRYTXN_BY_CRYTXN_ID_FAILURE: 'GET_CRYTXN_BY_CRYTXN_ID_FAILURE',

  GET_CRYTXN_RATE_BY_ID: 'GET_CRYTXN_RATE_BY_ID',
  GET_CRYTXN_RATE_BY_ID_SUCCESS: 'GET_CRYTXN_RATE_BY_ID_SUCCESS',
  GET_CRYTXN_RATE_BY_ID_FAILURE: 'GET_CRYTXN_RATE_BY_ID_FAILURE',

  CREATE_CRYPTO_TXN_RATES: 'CREATE_CRYPTO_TXN_RATES',
  CREATE_CRYPTO_TXN_RATES_SUCCESS: 'CREATE_CRYPTO_TXN_RATES_SUCCESS',
  CREATE_CRYPTO_TXN_RATES_FAILURE: 'CREATE_CRYPTO_TXN_RATES_FAILURE',

  CREATE_REMITTANCE_SLIP_SUCCESS_OTC: 'CREATE_REMITTANCE_SLIP_SUCCESS_OTC',
  CREATE_REMITTANCE_SLIP_FAILURE_OTC: 'CREATE_REMITTANCE_SLIP_FAILURE_OTC',

  CREATE_REMITTANCE_SLIP_SUCCESS_LIQUIDATE: 'CREATE_REMITTANCE_SLIP_SUCCESS_LIQUIDATE',
  CREATE_REMITTANCE_SLIP_FAILURE_LIQUIDATE: 'CREATE_REMITTANCE_SLIP_FAILURE_LIQUIDATE',

  CREATE_REMITTANCE_SLIP_SUCCESS_CWALLET: 'CREATE_REMITTANCE_SLIP_SUCCESS_CWALLET',
  CREATE_REMITTANCE_SLIP_FAILURE_CWALLET: 'CREATE_REMITTANCE_SLIP_FAILURE_CWALLET',

  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_LIQUIDATE: 'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_LIQUIDATE',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_LIQUIDATE:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_LIQUIDATE',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_LIQUIDATE:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_LIQUIDATE',

  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_CWALLET: 'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_CWALLET',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_CWALLET:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_CWALLET',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_CWALLET:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_CWALLET',

  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_OTC: 'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_OTC',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_OTC:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_OTC',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_OTC:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_OTC',

  // local accounts
  // UPDATE_BANK_ACCOUNTS_ON_VENDOR: 'UPDATE_BANK_ACCOUNTS_ON_VENDOR',

  SELECTED_BANK_ACCOUNTS: 'SELECTED_BANK_ACCOUNTS',

  UPDATE_LOCAL_AMOUNT: 'UPDATE_LOCAL_AMOUNT',

  DELETE_SELECTED_ACCOUNT: 'DELETE_SELECTED_ACCOUNT',
  DELETE_SELECTED_ACCOUNT_SUCCESS: 'DELETE_SELECTED_ACCOUNT_SUCCESS',
  DELETE_SELECTED_ACCOUNT_FAILURE: 'DELETE_SELECTED_ACCOUNT_FAILURE',

  UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION: 'UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION',
  UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION_SUCCESS:
    'UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION_SUCCESS',
  UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION_FAILURE:
    'UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION_FAILURE',

  UPDATE_LOCAL_ACCOUNTS_TO_TRADE: 'UPDATE_LOCAL_ACCOUNTS_TO_TRADE',
  UPDATE_LOCAL_ACCOUNTS_TO_TRADE_SUCCESS: 'UPDATE_LOCAL_ACCOUNTS_TO_TRADE_SUCCESS',
  UPDATE_LOCAL_ACCOUNTS_TO_TRADE_FAILURE: 'UPDATE_LOCAL_ACCOUNTS_TO_TRADE_FAILURE',

  UPDATE_LOCAL_BANK_ACCOUNTS: 'UPDATE_LOCAL_BANK_ACCOUNTS',
  UPDATE_LOCAL_BANK_ACCOUNTS_SUCCESS: 'UPDATE_LOCAL_BANK_ACCOUNTS_SUCCESS',
  UPDATE_LOCAL_BANK_ACCOUNTS_FAILURE: 'UPDATE_LOCAL_BANK_ACCOUNTS_FAILURE',

  GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR: 'GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR',
  GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR_SUCCESS: 'GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR_SUCCESS',
  GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR_FAILURE: 'GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR_FAILURE',

  UPDATE_CRYPTO_TXN_SOURCE_CURRENCY: 'UPDATE_CRYPTO_TXN_SOURCE_CURRENCY',
  UPDATE_CRYPTO_TXN_SOURCE_AMOUNT: 'UPDATE_CRYPTO_TXN_SOURCE_AMOUNT',
  UPDATE_CRYPTO_TXN_SOURCE_DETAILS: 'UPDATE_CRYPTO_TXN_SOURCE_DETAILS',

  ENTERED_AMOUNT_SOLD: 'ENTERED_AMOUNT_SOLD',

  HANDLE_PAGINATION: 'HANDLE_PAGINATION',

  UPDATE_SENDER_ADDRESS: 'UPDATE_SENDER_ADDRESS',
  UPDATE_SENDER_ADDRESS_SUCCESS: 'UPDATE_SENDER_ADDRESS_SUCCESS',
  UPDATE_SENDER_ADDRESS_FAILURE: 'UPDATE_SENDER_ADDRESS_FAILURE',

  CREATE_CRYPTO_MANUAL_FEES: 'CREATE_CRYPTO_MANUAL_FEES',
  CREATE_CRYPTO_MANUAL_FEES_SUCCESS: 'CREATE_CRYPTO_MANUAL_FEES_SUCCESS',
  CREATE_CRYPTO_MANUAL_FEES_FAILURE: 'CREATE_CRYPTO_MANUAL_FEES_FAILURE',

  CREATE_CRYPTO_MANUAL_RATE: 'CREATE_CRYPTO_MANUAL_RATE',
  CREATE_CRYPTO_MANUAL_RATE_SUCCESS: 'CREATE_CRYPTO_MANUAL_RATE_SUCCESS',
  CREATE_CRYPTO_MANUAL_RATE_FAILURE: 'CREATE_CRYPTO_MANUAL_RATE_FAILURE',

  UPDATE_RECEIVER_HASH: 'UPDATE_RECEIVER_HASH',
  UPDATE_RECEIVER_HASH_SUCCESS: 'UPDATE_RECEIVER_HASH_SUCCESS',
  UPDATE_RECEIVER_HASH_FAILURE: 'UPDATE_RECEIVER_HASH_FAILURE',

  UPDATE_CRYPTO_RATE: 'UPDATE_CRYPTO_RATE',
  UPDATE_CRYPTO_RATE_SUCCESS: 'UPDATE_CRYPTO_RATE_SUCCESS',
  UPDATE_CRYPTO_RATE_FAILURE: 'UPDATE_CRYPTO_RATE_FAILURE',

  UPDATE_CRYPTO_FEES: 'UPDATE_CRYPTO_FEES',
  UPDATE_CRYPTO_FEES_SUCCESS: 'UPDATE_CRYPTO_FEES_SUCCESS',
  UPDATE_CRYPTO_FEES_FAILURE: 'UPDATE_CRYPTO_FEES_FAILURE',

  DELETE_CRYPTO_FEES: 'DELETE_CRYPTO_FEES',
  DELETE_CRYPTO_FEES_SUCCESS: 'DELETE_CRYPTO_FEES_SUCCESS',
  DELETE_CRYPTO_FEES_FAILURE: 'DELETE_CRYPTO_FEES_FAILURE',

  DELETE_CRYPTO_RATE: 'DELETE_CRYPTO_RATE',
  DELETE_CRYPTO_RATE_SUCCESS: 'DELETE_CRYPTO_RATE_SUCCESS',
  DELETE_CRYPTO_RATE_FAILURE: 'DELETE_CRYPTO_RATE_FAILURE',

  HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION: 'HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION',
  HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION_SUCCESS:
    'HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION_SUCCESS',
  HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION_FAILURE:
    'HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION_FAILURE',

  ENTERED_AMOUNT_SOLD_IN_CRYPTO: 'ENTERED_AMOUNT_SOLD_IN_CRYPTO',
}
export default actions

export const handleCryptoTxnFeeCalculation = (value, token) => {
  return {
    type: actions.HANDLE_CRYPTO_TRANSACTION_FEE_CALCULATION,
    value,
    token,
  }
}

export const modeChange = mode => {
  return {
    type: actions.CHANGE_MODE_OPERATION,
    mode,
  }
}

export const changeRouteType = value => {
  return {
    type: actions.UPDATE_ROUTE_TYPE,
    value,
  }
}

export const getBankAccountByVendorId = (id, token) => {
  return {
    type: actions.FETCH_BANK_ACCOUNTS,
    id,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.HANDLE_PAGINATION,
    value,
  }
}

export const getAllTransactions = (value, token) => {
  return {
    type: actions.GET_ALL_CRYPTO_TRANSACTIONS,
    value,
    token,
  }
}

export const initiateNewTransaction = () => {
  return {
    type: actions.INITIATE_CRYPTO_TRANSACTION,
  }
}

export const getTransactionsByClientId = (value, token) => {
  return {
    type: actions.GET_CRYPTO_TRANSACTION_BY_CLIENT_ID,
    value,
    token,
  }
}

export const selectedTransaction = value => {
  return {
    type: actions.SELECTED_LIST_CRYPTO_TRANSACTION,
    value,
  }
}

export const changeEditTxnMode = value => {
  return {
    type: actions.CHANGE_EDIT_TXN_MODE,
    value,
  }
}

export const editTransaction = (value, token) => {
  return {
    type: actions.UPDATE_CRYPTO_TRANSACTION,
    value,
    token,
  }
}

export const deleteTransaction = (value, token) => {
  return {
    type: actions.DELETE_CRYPTO_TRANSACTION,
    value,
    token,
  }
}

export const cancelTransaction = (value, token) => {
  return {
    type: actions.CANCEL_CRYPTO_TRANSACTION,
    value,
    token,
  }
}

export const bulkDeleteTransaction = (value, token) => {
  return {
    type: actions.BULK_DELETE_CRYPTO_TRANSACTION,
    value,
    token,
  }
}

// create Txn

export const selectedVendor = value => {
  return {
    type: actions.SELECTED_VENDOR,
    value,
  }
}

export const getBeneficiaryByVendorId = value => {
  return {
    type: actions.GET_BENEFICIARY_BY_VENDOR_ID,
    value,
  }
}

export const removeVendor = () => {
  return {
    type: actions.REMOVE_VENDOR,
  }
}

export const updateBeneficiary = (value, token) => {
  return {
    type: actions.UPDATE_CRYPTO_SELECTED_BENEFICIARY,
    value,
    token,
  }
}

export const removeBeneficiary = () => {
  return {
    type: actions.REMOVE_BENEFICIARY,
  }
}

export const updateDepositCurrency = value => {
  return {
    type: actions.UPDATE_DEPOSIT_CURRENCY,
    value,
  }
}

export const updateDepositAmount = value => {
  return {
    type: actions.UPDATE_DEPOSIT_AMOUNT,
    value,
  }
}

export const createCryptoTransaction = (value, token) => {
  return {
    type: actions.CREATE_CRYPTO_TRANSACTION,
    value,
    token,
  }
}

export const getCryptoTransactionById = (value, token) => {
  return {
    type: actions.GET_CRYPTO_TRANSACTION_BY_ID,
    value,
    token,
  }
}

export const updateSelectedBeneficiary = (value, token) => {
  return {
    type: actions.UPDATE_CRYPTO_SELECTED_BENEFICIARY,
    value,
    token,
  }
}

export const updateSelectedVendor = (value, token) => {
  return {
    type: actions.UPDATE_CRYPTO_SELECTED_VENDOR,
    value,
    token,
  }
}

export const selectedAccountRequestedDate = (value, token) => {
  return {
    type: actions.SELECTED_ACCOUNT_REQUESTED_DATE,
    value,
    token,
  }
}

export const selectedAccountReceivedDate = (value, token) => {
  return {
    type: actions.SELECTED_ACCOUNT_RECEIVED_DATE,
    value,
    token,
  }
}

export const confirmAccountRequestedDate = (value, token) => {
  return {
    type: actions.CONFIRM_CRYPTO_ACCOUNT_REQUESTED_DATE,
    value,
    token,
  }
}

export const confirmAccountReceivedDate = (value, token) => {
  return {
    type: actions.CONFIRM_CRYPTO_ACCOUNT_RECEIVED_DATE,
    value,
    token,
  }
}

export const enteredReceivedAmount = value => {
  return {
    type: actions.ENTERED_CRYPTO_RECEIVED_AMOUNT,
    value,
  }
}

export const updateTransactionAmount = (value, token) => {
  return {
    type: actions.UPDATE_CRYPTO_TRANSACTION_AMOUNT,
    value,
    token,
  }
}

export const selectReceivedAmountConfirmationDate = value => {
  return {
    type: actions.SELECTED_RECEIVED_AMOUNT_CONFIRMATION_DATE_CRYPTO,
    value,
  }
}

export const confirmReceivedAmountConfirmation = (value, token) => {
  return {
    type: actions.CONFIRM_RECEIVED_CRYPTO_AMOUNT,
    value,
    token,
  }
}

export const enteredRemittedAmount = value => {
  return {
    type: actions.ENTERED_REMITTED_AMOUNT,
    value,
  }
}

export const selectRemittedAmountConfirmDate = value => {
  return {
    type: actions.SELECTED_REMITED_AMOUNT_CONFIRMATION_DATE,
    value,
  }
}

export const confirmRemittedFunds = (value, token) => {
  return {
    type: actions.CONFIRM_CRYPTO_REMITED_FUNDS,
    value,
    token,
  }
}

export const updateVendorDetails = value => {
  return {
    type: actions.UPDATE_CRYPTO_VENDOR_DETAILS,
    value,
  }
}

export const getCalculatedRate = (value, token) => {
  return {
    type: actions.GET_CRYPTO_BUY_RATE,
    value,
    token,
  }
}

export const changeDateRate = value => {
  return {
    type: actions.CHANGE_DAY_RATE,
    value,
  }
}

export const updateDateRate = value => {
  return {
    type: actions.UPDATE_DAY_RATE,
    value,
  }
}

export const changeInverseRate = value => {
  return {
    type: actions.CHANGE_INVERSE_RATE,
    value,
  }
}

export const checkApplyPrecision = value => {
  return {
    type: actions.CHECK_PRECISION,
    value,
  }
}

export const updatePrecision = value => {
  return {
    type: actions.UPDATE_PRECISION,
    value,
  }
}

export const enteredNewActualRate = value => {
  return {
    type: actions.ENTERED_NEW_RATE,
    value,
  }
}

export const getFxBaseRateByVendor = (value, token) => {
  return {
    type: actions.GET_FX_BASE_RATE_BY_CRYPTO_VENDOR,
    value,
    token,
  }
}

export const updateCryptoTransactionValues = (value, txnId, token) => {
  return {
    type: actions.UPDATE_CRYPTO_TRANSACTION_VALUES,
    value,
    txnId,
    token,
  }
}

export const getTxnFeesByTxnId = (value, token) => {
  return {
    type: actions.GET_CRYTXN_BY_ID,
    value,
    token,
  }
}

export const getTxnRatesByTxnId = (value, token) => {
  return {
    type: actions.GET_CRYTXN_RATE_BY_ID,
    value,
    token,
  }
}

export const createTxnFee = (value, token) => {
  return {
    type: actions.CREATE_CRYPTO_TXN_FEES,
    value,
    token,
  }
}

export const createTxnRates = (value, token) => {
  return {
    type: actions.CREATE_CRYPTO_TXN_RATES,
    value,
    token,
  }
}

export const getDepositSlipsByTransactionIdOTC = (value, token) => {
  return {
    type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_OTC,
    value,
    token,
  }
}

export const getDepositSlipsByTransactionIdLequidate = (value, token) => {
  return {
    type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_LIQUIDATE,
    value,
    token,
  }
}

export const getDepositSlipsByTransactionIdCWallet = (value, token) => {
  return {
    type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_CWALLET,
    value,
    token,
  }
}

// local deposits

// export const getAllAndUpdateBankAccounts = value => {
//   return {
//     type: actions.UPDATE_BANK_ACCOUNTS_ON_VENDOR,
//     value
//   }
// }

export const selectedLocalAccounts = (values, accountNames) => {
  return {
    type: actions.SELECTED_BANK_ACCOUNTS,
    values,
    accountNames,
  }
}

export const updateLocalAmount = value => {
  return {
    type: actions.UPDATE_LOCAL_AMOUNT,
    value,
  }
}

export const deleteSelectedAccount = payload => {
  return {
    type: actions.DELETE_SELECTED_ACCOUNT,
    payload,
  }
}

export const updateLocalAccountsToTransaction = (id, values, token) => {
  return {
    type: actions.UPDATE_LOCAL_ACCOUNTS_TO_CRYPTO_TRANSACTION,
    id,
    values,
    token,
  }
}

export const getBankAccountByvendorId = (values, token) => {
  return {
    type: actions.GET_ALL_BANK_ACCOUNTS_BY_CRYPTO_VENDOR,
    values,
    token,
  }
}

export const updateTxnSourceCurrency = value => {
  return {
    type: actions.UPDATE_CRYPTO_TXN_SOURCE_CURRENCY,
    value,
  }
}

export const updateTxnSourceAmount = value => {
  return {
    type: actions.UPDATE_CRYPTO_TXN_SOURCE_AMOUNT,
    value,
  }
}

export const updateTxnSourceDetails = value => {
  return {
    type: actions.UPDATE_CRYPTO_TXN_SOURCE_DETAILS,
    value,
  }
}

export const enteredAmountSoldInCrypto = value => {
  return {
    type: actions.ENTERED_AMOUNT_SOLD_IN_CRYPTO,
    value,
  }
}

export const updateReceiverAddress = (value, token) => {
  return {
    type: actions.UPDATE_SENDER_ADDRESS,
    value,
    token,
  }
}

export const updateReceiverHash = (value, token) => {
  return {
    type: actions.UPDATE_RECEIVER_HASH,
    value,
    token,
  }
}

export const createManualRate = (value, token) => {
  return {
    type: actions.CREATE_CRYPTO_MANUAL_RATE,
    value,
    token,
  }
}

export const createManualFees = (value, token) => {
  return {
    type: actions.CREATE_CRYPTO_MANUAL_FEES,
    value,
    token,
  }
}

export const updateCryptoRate = value => {
  return {
    type: actions.UPDATE_CRYPTO_RATE,
    value,
  }
}

export const updateCryptoFees = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_CRYPTO_FEES,
    value,
    tradeId,
    token,
  }
}

export const updateTransactionValues = (value, txnId, token) => {
  return {
    type: actions.UPDATE_CRYPTO_TRANSACTION_VALUES,
    value,
    txnId,
    token,
  }
}

export const deleteCryptoFees = (values, token) => {
  return {
    type: actions.DELETE_CRYPTO_FEES,
    values,
    token,
  }
}

export const deleteCryptoRates = (values, token) => {
  return {
    type: actions.DELETE_CRYPTO_RATE,
    values,
    token,
  }
}
