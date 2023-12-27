const actions = {
  GET_BANK_ACCOUNTS: 'GET_BANK_ACCOUNTS',
  GET_BANK_ACCOUNTS_SUCCESS: 'GET_BANK_ACCOUNTS_SUCCESS',
  GET_BANK_ACCOUNTS_FAILURE: 'GET_BANK_ACCOUNTS_FAILURE',

  GET_BANK_ACCOUNT_BY_ID: 'GET_BANK_ACCOUNT_BY_ID',
  GET_BANK_ACCOUNT_BY_ID_SUCCESS: 'GET_BANK_ACCOUNT_BY_ID_SUCCESS',
  GET_BANK_ACCOUNT_BY_ID_FAILURE: 'GET_BANK_ACCOUNT_BY_ID_FAILURE',

  DELETE_BANK_ACCOUNT: 'DELETE_BANK_ACCOUNT',
  DELETE_BANK_ACCOUNT_SUCCESS: 'DELETE_BANK_ACCOUNT_SUCCESS',
  DELETE_BANK_ACCOUNT_FAILURE: 'DELETE_BANK_ACCOUNT_FAILURE',

  CREATE_BANK_ACCOUNT: 'CREATE_BANK_ACCOUNT',
  CREATE_BANK_ACCOUNT_SUCCESS: 'CREATE_BANK_ACCOUNT_SUCCESS',
  CREATE_BANK_ACCOUNT_FAILURE: 'CREATE_BANK_ACCOUNT_FAILURE',

  UPDATE_BANK_ACCOUNT: 'UPDATE_BANK_ACCOUNT',
  UPDATE_BANK_ACCOUNT_SUCCESS: 'UPDATE_BANK_ACCOUNT_SUCCESS',
  UPDATE_BANK_ACCOUNT_FAILURE: 'UPDATE_BANK_ACCOUNT_FAILURE',

  HANDLE_BANK_ACCOUNTS_PAGINATION: 'HANDLE_BANK_ACCOUNTS_PAGINATION',

  UPDATE_REQUIRED_FIELDS: 'UPDATE_REQUIRED_FIELDS',

  GET_FORMATED_BANK_ACCOUNTS: 'GET_FORMATED_BANK_ACCOUNTS',

  HANDLE_BANK_ACCOUNTS_FILTERS: 'HANDLE_BANK_ACCOUNTS_FILTERS',
}
export default actions

export const handleBankAccountFilters = value => {
  return {
    type: actions.HANDLE_BANK_ACCOUNTS_FILTERS,
    value,
  }
}

export const getAllBankAccounts = (value, token) => {
  return {
    type: actions.GET_BANK_ACCOUNTS,
    value,
    token,
  }
}

export const getBankAccountById = (id, token) => {
  return {
    type: actions.GET_BANK_ACCOUNT_BY_ID,
    id,
    token,
  }
}

export const deleteBankAccount = (id, token) => {
  return {
    type: actions.DELETE_BANK_ACCOUNT,
    id,
    token,
  }
}

export const createBankAccount = (value, token) => {
  return {
    type: actions.CREATE_BANK_ACCOUNT,
    value,
    token,
  }
}

export const updateBankAccount = (value, accId, token) => {
  return {
    type: actions.UPDATE_BANK_ACCOUNT,
    value,
    accId,
    token,
  }
}

export const getFormatedBankAccounts = value => {
  return {
    type: actions.GET_FORMATED_BANK_ACCOUNTS,
    value,
  }
}

export const handlePagination = value => {
  return {
    type: actions.HANDLE_BANK_ACCOUNTS_PAGINATION,
    value,
  }
}

export const updateRequiredFields = value => {
  return {
    type: actions.UPDATE_REQUIRED_FIELDS,
    value,
  }
}
