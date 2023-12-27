const actions = {
  GET_ALL_TRANSACTIONS: 'GET_ALL_TRANSACTIONS',
  GET_ALL_TRANSACTIONS_SUCCESS: 'GET_ALL_TRANSACTIONS_SUCCESS',
  GET_ALL_TRANSACTIONS_FAILURE: 'GET_ALL_TRANSACTIONS_FAILURE',

  INITIATE_TRANSACTION: 'INITIATE_TRANSACTION',

  GET_TRANSACTIONS_BY_ID: 'GET_TRANSACTIONS_BY_ID',
  GET_TRANSACTIONS_BY_ID_SUCCESS: 'GET_TRANSACTIONS_BY_ID_SUCCESS',
  GET_TRANSACTIONS_BY_ID_FAILURE: 'GET_TRANSACTIONS_BY_ID_FAILURE',

  GET_TRANSACTIONS_BY_CLIENT_ID: 'GET_TRANSACTIONS_BY_CLIENT_ID',
  GET_TRANSACTIONS_BY_CLIENT_ID_SUCCESS: 'GET_TRANSACTIONS_BY_CLIENT_ID_SUCCESS',
  GET_TRANSACTIONS_BY_CLIENT_ID_FAILURE: 'GET_TRANSACTIONS_BY_CLIENT_ID_FAILURE',

  SELECTED_LIST_TRANSACTION: 'SELECTED_LIST_TRANSACTION',

  CHANGE_EDIT_TXN_MODE: 'CHANGE_EDIT_TXN_MODE',

  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  UPDATE_TRANSACTION_SUCCESS: 'UPDATE_TRANSACTION_SUCCESS',
  UPDATE_TRANSACTION_FAILURE: 'UPDATE_TRANSACTION_FAILURE',

  CANCEL_TRANSACTION: 'CANCEL_TRANSACTION',
  CANCEL_TRANSACTION_SUCCESS: 'CANCEL_TRANSACTION_SUCCESS',
  CANCEL_TRANSACTION_FAILURE: 'CANCEL_TRANSACTION_FAILURE',

  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  DELETE_TRANSACTION_SUCCESS: 'DELETE_TRANSACTION_SUCCESS',
  DELETE_TRANSACTION_FAILURE: 'DELETE_TRANSACTION_FAILURE',

  BULK_DELETE_TRANSACTION: 'BULK_DELETE_TRANSACTION',
  BULK_DELETE_TRANSACTION_SUCCESS: 'BULK_DELETE_TRANSACTION_SUCCESS',
  BULK_DELETE_TRANSACTION_FAILURE: 'BULK_DELETE_TRANSACTION_FAILURE',

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

  CREATE_TRANSACTION: 'CREATE_TRANSACTION',
  CREATE_TRANSACTION_SUCCESS: 'CREATE_TRANSACTION_SUCCESS',
  CREATE_TRANSACTION_FAILURE: 'CREATE_TRANSACTION_FAILURE',

  UPDATE_SELECTED_BENEFICIARY: 'UPDATE_SELECTED_BENEFICIARY',
  UPDATE_SELECTED_BENEFICIARY_SUCCESS: 'UPDATE_SELECTED_BENEFICIARY_SUCCESS',
  UPDATE_SELECTED_BENEFICIARY_FAILURE: 'UPDATE_SELECTED_BENEFICIARY_FAILURE',

  UPDATE_SELECTED_VENDOR: 'UPDATE_SELECTED_VENDOR',
  UPDATE_SELECTED_VENDOR_SUCCESS: 'UPDATE_SELECTED_VENDOR_SUCCESS',
  UPDATE_SELECTED_VENDOR_FAILURE: 'UPDATE_SELECTED_VENDOR_FAILURE',

  SELECTED_ACCOUNT_REQUESTED_DATE: 'SELECTED_ACCOUNT_REQUESTED_DATE',
  SELECTED_ACCOUNT_RECEIVED_DATE: 'SELECTED_ACCOUNT_RECEIVED_DATE',

  CONFIRM_ACCOUNT_REQUESTED_DATE: 'CONFIRM_ACCOUNT_REQUESTED_DATE',
  CONFIRM_ACCOUNT_REQUESTED_DATE_SUCCESS: 'CONFIRM_ACCOUNT_REQUESTED_DATE_SUCCESS',
  CONFIRM_ACCOUNT_REQUESTED_DATE_FAILURE: 'CONFIRM_ACCOUNT_REQUESTED_DATE_FAILURE',

  CONFIRM_ACCOUNT_RECEIVED_DATE: 'CONFIRM_ACCOUNT_RECEIVED_DATE',
  CONFIRM_ACCOUNT_RECEIVED_DATE_SUCCESS: 'CONFIRM_ACCOUNT_RECEIVED_DATE_SUCCESS',
  CONFIRM_ACCOUNT_RECEIVED_DATE_FAILURE: 'CONFIRM_ACCOUNT_RECEIVED_DATE_FAILURE',

  ENTERED_RECEIVED_AMOUNT: 'ENTERED_RECEIVED_AMOUNT',
  SELECTED_RECEIVED_AMOUNT_CONFIRMATION_DATE: 'SELECTED_RECEIVED_AMOUNT_CONFIRMATION_DATE',

  UPDATE_TRANSACTION_AMOUNT: 'UPDATE_TRANSACTION_AMOUNT',
  UPDATE_TRANSACTION_AMOUNT_SUCCESS: 'UPDATE_TRANSACTION_AMOUNT_SUCCESS',
  UPDATE_TRANSACTION_AMOUNT_FAILURE: 'UPDATE_TRANSACTION_AMOUNT_FAILURE',

  CONFIRM_RECEIVED_AMOUNT: 'CONFIRM_RECEIVED_AMOUNT',
  CONFIRM_RECEIVED_AMOUNT_SUCCESS: 'CONFIRM_RECEIVED_AMOUNT_SUCCESS',
  CONFIRM_RECEIVED_AMOUNT_FAILURE: 'CONFIRM_RECEIVED_AMOUNT_FAILURE',

  ENTERED_REMITTED_AMOUNT: 'ENTERED_REMITTED_AMOUNT',
  SELECTED_REMITED_AMOUNT_CONFIRMATION_DATE: 'SELECTED_REMITED_AMOUNT_CONFIRMATION_DATE',

  CONFIRM_REMITED_FUNDS: 'CONFIRM_REMITED_FUNDS',
  CONFIRM_REMITED_FUNDS_SUCCESS: 'CONFIRM_REMITED_FUNDS_SUCCESS',
  CONFIRM_REMITED_FUNDS_FAILURE: 'CONFIRM_REMITED_FUNDS_FAILURE',

  UPDATE_VENDOR_DETAILS: 'UPDATE_VENDOR_DETAILS',

  GET_BUY_RATE: 'GET_BUY_RATE',
  GET_BUY_RATE_SUCCESS: 'GET_BUY_RATE_SUCCESS',
  GET_BUY_RATE_FAILURE: 'GET_BUY_RATE_FAILURE',

  CHANGE_DAY_RATE: 'CHANGE_DAY_RATE',
  UPDATE_DAY_RATE: 'UPDATE_DAY_RATE',
  CHANGE_INVERSE_RATE: 'CHANGE_INVERSE_RATE',
  CHECK_PRECISION: 'CHECK_PRECISION',
  UPDATE_PRECISION: 'UPDATE_PRECISION',
  ENTERED_NEW_RATE: 'ENTERED_NEW_RATE',

  GET_FX_BASE_RATE_BY_VENDOR: 'GET_FX_BASE_RATE_BY_VENDOR',
  GET_FX_BASE_RATE_BY_VENDOR_SUCCESS: 'GET_FX_BASE_RATE_BY_VENDOR_SUCCESS',
  GET_FX_BASE_RATE_BY_VENDOR_FAILURE: 'GET_FX_BASE_RATE_BY_VENDOR_FAILURE',

  UPDATE_TRANSACTION_VALUES: 'UPDATE_TRANSACTION_VALUES',
  UPDATE_TRANSACTION_VALUES_SUCCESS: 'UPDATE_TRANSACTION_VALUES_SUCCESS',
  UPDATE_TRANSACTION_VALUES_FAILURE: 'UPDATE_TRANSACTION_VALUES_FAILURE',

  CREATE_TXN_FEES: 'CREATE_TXN_FEES',
  CREATE_TXN_FEES_SUCCESS: 'CREATE_TXN_FEES_SUCCESS',
  CREATE_TXN_FEES_FAILURE: 'CREATE_TXN_FEES_FAILURE',

  GET_TXN_FEES_BY_TXN_ID: 'GET_TXN_FEES_BY_TXN_ID',
  GET_TXN_FEES_BY_TXN_ID_SUCCESS: 'GET_TXN_FEES_BY_TXN_ID_SUCCESS',
  GET_TXN_FEES_BY_TXN_ID_FAILURE: 'GET_TXN_FEES_BY_TXN_ID_FAILURE',

  GET_TXN_RATES_BY_TXN_ID: 'GET_TXN_RATES_BY_TXN_ID',
  GET_TXN_RATES_BY_TXN_ID_SUCCESS: 'GET_TXN_RATES_BY_TXN_ID_SUCCESS',
  GET_TXN_RATES_BY_TXN_ID_FAILURE: 'GET_TXN_RATES_BY_TXN_ID_FAILURE',

  CREATE_TXN_RATES: 'CREATE_TXN_RATES',
  CREATE_TXN_RATES_SUCCESS: 'CREATE_TXN_RATES_SUCCESS',
  CREATE_TXN_RATES_FAILURE: 'CREATE_TXN_RATES_FAILURE',

  CREATE_REMITTANCE_SLIP_SUCCESS_ACCOUNTS_ONLY: 'CREATE_REMITTANCE_SLIP_SUCCESS_ACCOUNTS_ONLY',
  CREATE_REMITTANCE_SLIP_FAILURE_ACCOUNTS_ONLY: 'CREATE_REMITTANCE_SLIP_FAILURE_ACCOUNTS_ONLY',

  DELETE_REMITTANCE_SLIP_ACCOUNTS_ONLY: 'DELETE_REMITTANCE_SLIP_ACCOUNTS_ONLY',
  DELETE_REMITTANCE_SLIP_SUCCESS_ACCOUNTS_ONLY: 'DELETE_REMITTANCE_SLIP_SUCCESS_ACCOUNTS_ONLY',
  DELETE_REMITTANCE_SLIP_FAILURE_ACCOUNTS_ONLY: 'DELETE_REMITTANCE_SLIP_FAILURE_ACCOUNTS_ONLY',

  CREATE_REMITTANCE_SLIP_SUCCESS_SWAP: 'CREATE_REMITTANCE_SLIP_SUCCESS_SWAP',
  CREATE_REMITTANCE_SLIP_FAILURE_SWAP: 'CREATE_REMITTANCE_SLIP_FAILURE_SWAP',

  DELETE_REMITTANCE_SLIP_SWAP: 'DELETE_REMITTANCE_SLIP_SWAP',
  DELETE_REMITTANCE_SLIP_SUCCESS_SWAP: 'DELETE_REMITTANCE_SLIP_SUCCESS_SWAP',
  DELETE_REMITTANCE_SLIP_FAILURE_SWAP: 'DELETE_REMITTANCE_SLIP_FAILURE_SWAP',

  CREATE_REMITTANCE_SLIP_SUCCESS_FX: 'CREATE_REMITTANCE_SLIP_SUCCESS_FX',
  CREATE_REMITTANCE_SLIP_FAILURE_FX: 'CREATE_REMITTANCE_SLIP_FAILURE_FX',

  DELETE_REMITTANCE_SLIP_FX: 'DELETE_REMITTANCE_SLIP_FX',
  DELETE_REMITTANCE_SLIP_SUCCESS_FX: 'DELETE_REMITTANCE_SLIP_SUCCESS_FX',
  DELETE_REMITTANCE_SLIP_FAILURE_FX: 'DELETE_REMITTANCE_SLIP_FAILURE_FX',

  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FX: 'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FX',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_FX: 'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_FX',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_FX: 'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_FX',

  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_ACCOUNTS_ONLY:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_ACCOUNTS_ONLY',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_ACCOUNTS_ONLY:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_ACCOUNTS_ONLY',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_ACCOUNTS_ONLY:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_ACCOUNTS_ONLY',

  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SWAP: 'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SWAP',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_SWAP:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_SWAP',
  GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_SWAP:
    'GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FAILURE_SWAP',

  // local accounts
  // UPDATE_BANK_ACCOUNTS_ON_VENDOR: 'UPDATE_BANK_ACCOUNTS_ON_VENDOR',

  SELECTED_BANK_ACCOUNTS: 'SELECTED_BANK_ACCOUNTS',

  UPDATE_LOCAL_AMOUNT: 'UPDATE_LOCAL_AMOUNT',

  DELETE_SELECTED_ACCOUNT: 'DELETE_SELECTED_ACCOUNT',
  DELETE_SELECTED_ACCOUNT_SUCCESS: 'DELETE_SELECTED_ACCOUNT_SUCCESS',
  DELETE_SELECTED_ACCOUNT_FAILURE: 'DELETE_SELECTED_ACCOUNT_FAILURE',

  UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION: 'UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION',
  UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION_SUCCESS: 'UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION_SUCCESS',
  UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION_FAILURE: 'UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION_FAILURE',

  UPDATE_LOCAL_ACCOUNTS_TO_TRADE: 'UPDATE_LOCAL_ACCOUNTS_TO_TRADE',
  UPDATE_LOCAL_ACCOUNTS_TO_TRADE_SUCCESS: 'UPDATE_LOCAL_ACCOUNTS_TO_TRADE_SUCCESS',
  UPDATE_LOCAL_ACCOUNTS_TO_TRADE_FAILURE: 'UPDATE_LOCAL_ACCOUNTS_TO_TRADE_FAILURE',

  UPDATE_LOCAL_BANK_ACCOUNTS: 'UPDATE_LOCAL_BANK_ACCOUNTS',
  UPDATE_LOCAL_BANK_ACCOUNTS_SUCCESS: 'UPDATE_LOCAL_BANK_ACCOUNTS_SUCCESS',
  UPDATE_LOCAL_BANK_ACCOUNTS_FAILURE: 'UPDATE_LOCAL_BANK_ACCOUNTS_FAILURE',

  GET_ALL_BANK_ACCOUNTS_BY_VENDOR: 'GET_ALL_BANK_ACCOUNTS_BY_VENDOR',
  GET_ALL_BANK_ACCOUNTS_BY_VENDOR_SUCCESS: 'GET_ALL_BANK_ACCOUNTS_BY_VENDOR_SUCCESS',
  GET_ALL_BANK_ACCOUNTS_BY_VENDOR_FAILURE: 'GET_ALL_BANK_ACCOUNTS_BY_VENDOR_FAILURE',

  UPDATE_SWAP_TXN_SOURCE_CURRENCY: 'UPDATE_SWAP_TXN_SOURCE_CURRENCY',
  UPDATE_SWAP_TXN_SOURCE_AMOUNT: 'UPDATE_SWAP_TXN_SOURCE_AMOUNT',
  UPDATE_SWAP_TXN_SOURCE_DETAILS: 'UPDATE_SWAP_TXN_SOURCE_DETAILS',

  ENTERED_AMOUNT_SOLD: 'ENTERED_AMOUNT_SOLD',

  HANDLE_TXN_PAGINATION: 'HANDLE_TXN_PAGINATION',

  // Fee Calc

  HANDLE_TXN_FEE_CALCULATION: 'HANDLE_TXN_FEE_CALCULATION',
  HANDLE_TXN_FEE_CALCULATION_SUCCESS: 'HANDLE_TXN_FEE_CALCULATION_SUCCESS',
  HANDLE_TXN_FEE_CALCULATION_FAILURE: 'HANDLE_TXN_FEE_CALCULATION_FAILURE',
}
export default actions

export const handleTxnFeeCalculation = (value, token) => {
  return {
    type: actions.HANDLE_TXN_FEE_CALCULATION,
    value,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.HANDLE_TXN_PAGINATION,
    value,
  }
}

export const getAllTransactions = (value, token) => {
  return {
    type: actions.GET_ALL_TRANSACTIONS,
    value,
    token,
  }
}

export const initiateNewTransaction = () => {
  return {
    type: actions.INITIATE_TRANSACTION,
  }
}

export const getTransactionsByClientId = (value, token) => {
  return {
    type: actions.GET_TRANSACTIONS_BY_CLIENT_ID,
    value,
    token,
  }
}

export const selectedTransaction = value => {
  return {
    type: actions.SELECTED_LIST_TRANSACTION,
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
    type: actions.UPDATE_TRANSACTION,
    value,
    token,
  }
}

export const deleteTransaction = (value, token) => {
  return {
    type: actions.DELETE_TRANSACTION,
    value,
    token,
  }
}

export const cancelTransaction = (value, token) => {
  return {
    type: actions.CANCEL_TRANSACTION,
    value,
    token,
  }
}

export const bulkDeleteTransaction = (value, token) => {
  return {
    type: actions.BULK_DELETE_TRANSACTION,
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

export const updateBeneficiary = value => {
  return {
    type: actions.UPDATE_BENEFICIARY,
    value,
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

export const createTransaction = (value, token) => {
  return {
    type: actions.CREATE_TRANSACTION,
    value,
    token,
  }
}

export const getTransactionById = (value, token) => {
  return {
    type: actions.GET_TRANSACTIONS_BY_ID,
    value,
    token,
  }
}

export const updateSelectedBeneficiary = (value, token) => {
  return {
    type: actions.UPDATE_SELECTED_BENEFICIARY,
    value,
    token,
  }
}

export const updateSelectedVendor = (value, token) => {
  return {
    type: actions.UPDATE_SELECTED_VENDOR,
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
    type: actions.CONFIRM_ACCOUNT_REQUESTED_DATE,
    value,
    token,
  }
}

export const confirmAccountReceivedDate = (value, token) => {
  return {
    type: actions.CONFIRM_ACCOUNT_RECEIVED_DATE,
    value,
    token,
  }
}

export const enteredReceivedAmount = value => {
  return {
    type: actions.ENTERED_RECEIVED_AMOUNT,
    value,
  }
}

export const updateTransactionAmount = (value, token) => {
  return {
    type: actions.UPDATE_TRANSACTION_AMOUNT,
    value,
    token,
  }
}

export const selectReceivedAmountConfirmationDate = value => {
  return {
    type: actions.SELECTED_RECEIVED_AMOUNT_CONFIRMATION_DATE,
    value,
  }
}

export const confirmReceivedAmountConfirmation = (value, token) => {
  return {
    type: actions.CONFIRM_RECEIVED_AMOUNT,
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
    type: actions.CONFIRM_REMITED_FUNDS,
    value,
    token,
  }
}

export const updateVendorDetails = value => {
  return {
    type: actions.UPDATE_VENDOR_DETAILS,
    value,
  }
}

export const getCalculatedRate = (value, token) => {
  return {
    type: actions.GET_BUY_RATE,
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
    type: actions.GET_FX_BASE_RATE_BY_VENDOR,
    value,
    token,
  }
}

export const updateTransactionValues = (value, txnId, token) => {
  return {
    type: actions.UPDATE_TRANSACTION_VALUES,
    value,
    txnId,
    token,
  }
}

export const getTxnFeesByTxnId = (value, token) => {
  return {
    type: actions.GET_TXN_FEES_BY_TXN_ID,
    value,
    token,
  }
}

export const getTxnRatesByTxnId = (value, token) => {
  return {
    type: actions.GET_TXN_RATES_BY_TXN_ID,
    value,
    token,
  }
}

export const createTxnFee = (value, token) => {
  return {
    type: actions.CREATE_TXN_FEES,
    value,
    token,
  }
}

export const createTxnRates = (value, token) => {
  return {
    type: actions.CREATE_TXN_RATES,
    value,
    token,
  }
}

export const getDepositSlipsByTransactionIdAccountsOnly = (value, token) => {
  return {
    type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_ACCOUNTS_ONLY,
    value,
    token,
  }
}

export const getDepositSlipsByTransactionIdSwap = (value, token) => {
  return {
    type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SWAP,
    value,
    token,
  }
}

export const getDepositSlipsByTransactionIdFX = (value, token) => {
  return {
    type: actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_FX,
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
    type: actions.UPDATE_LOCAL_ACCOUNTS_TO_TRANSACTION,
    id,
    values,
    token,
  }
}

export const updateLocalAccountsToTrade = (id, values, token) => {
  return {
    type: actions.UPDATE_LOCAL_ACCOUNTS_TO_TRADE,
    id,
    values,
    token,
  }
}

export const updateBankAccounts = (values, token) => {
  return {
    type: actions.UPDATE_LOCAL_BANK_ACCOUNTS,
    values,
    token,
  }
}

export const getBankAccountByvendorId = (id, token) => {
  return {
    type: actions.GET_ALL_BANK_ACCOUNTS_BY_VENDOR,
    id,
    token,
  }
}

export const updateTxnSourceCurrency = value => {
  return {
    type: actions.UPDATE_SWAP_TXN_SOURCE_CURRENCY,
    value,
  }
}

export const updateTxnSourceAmount = value => {
  return {
    type: actions.UPDATE_SWAP_TXN_SOURCE_AMOUNT,
    value,
  }
}

export const updateSwapTxnSourceDetails = value => {
  return {
    type: actions.UPDATE_SWAP_TXN_SOURCE_DETAILS,
    value,
  }
}

export const enteredAmountSold = value => {
  return {
    type: actions.ENTERED_AMOUNT_SOLD,
    value,
  }
}

export const deleteRemittanceSlipAccountsOnly = (id, token) => {
  return {
    type: actions.DELETE_REMITTANCE_SLIP_ACCOUNTS_ONLY,
    id,
    token,
  }
}

export const deleteRemittanceSlipSwap = (id, token) => {
  return {
    type: actions.DELETE_REMITTANCE_SLIP_SWAP,
    id,
    token,
  }
}

export const deleteRemittanceSlipFX = (id, token) => {
  return {
    type: actions.DELETE_REMITTANCE_SLIP_FX,
    id,
    token,
  }
}
