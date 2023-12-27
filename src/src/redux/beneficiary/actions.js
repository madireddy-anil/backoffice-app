const actions = {
  GET_BENEFICIARIES: 'GET_BENEFICIARIES',
  GET_BENEFICIARIES_SUCCESS: 'GET_BENEFICIARIES_SUCCESS',
  GET_BENEFICIARIES_FAILURE: 'GET_BENEFICIARIES_FAILURE',

  GET_BENEFICIARY_BY_ID: 'GET_BENEFICIARY_BY_ID',
  GET_BENEFICIARY_BY_ID_SUCCESS: 'GET_BENEFICIARY_BY_ID_SUCCESS',
  GET_BENEFICIARY_BY_ID_FALIURE: 'GET_BENEFICIARY_BY_ID_FALIURE',

  CREATE_BENEFICIARY: 'CREATE_BENEFICIARY',
  CREATE_BENEFICIARY_SUCCESS: 'CREATE_BENEFICIARY_SUCCESS',
  CREATE_BENEFICIARY_FAILURE: 'CREATE_BENEFICIARY_FAILURE',

  ADD_BENEFICIARY: 'ADD_BENEFICIARY',
  ADD_BENEFICIARY_SUCCESS: 'ADD_BENEFICIARY_SUCCESS',
  ADD_BENEFICIARY_FAILURE: 'ADD_BENEFICIARY_FAILURE',

  UPDATE_BENEFICIARY: 'UPDATE_BENEFICIARY',
  UPDATE_BENEFICIARY_SUCCESS: 'UPDATE_BENEFICIARY_SUCCESS',
  UPDATE_BENEFICIARY_FAILURE: 'UPDATE_BENEFICIARY_FAILURE',

  UPDATE_BENE_STATUS: 'UPDATE_BENE_STATUS',
  UPDATE_BENE_STATUS_SUCCESS: 'UPDATE_BENE_STATUS_SUCCESS',
  UPDATE_BENE_STATUS_FAILURE: 'UPDATE_BENE_STATUS_FAILURE',

  HANDLE_BENEFICIARIES_PAGINATION: 'HANDLE_BENEFICIARIES_PAGINATION',

  GET_BULK_DOWNLOAD_FOR_BENEFICIARY: 'GET_BULK_DOWNLOAD_FOR_BENEFICIARY',
  GET_BULK_DOWNLOAD_FOR_BENEFICIARY_SUCCESS: 'GET_BULK_DOWNLOAD_FOR_BENEFICIARY_SUCCESS',
  GET_BULK_DOWNLOAD_FOR_BENEFICIARY_FAILURE: 'GET_BULK_DOWNLOAD_FOR_BENEFICIARY_FAILURE',

  HANDLE_BENEFICIARY_FILTERS: 'HANDLE_BENEFICIARY_FILTERS',
}

export default actions

export const updateBeneficiaryStatus = (value, token) => {
  return {
    type: actions.UPDATE_BENE_STATUS,
    value,
    token,
  }
}

export const handleBeneficiaryFilters = value => {
  return {
    type: actions.HANDLE_BENEFICIARY_FILTERS,
    value,
  }
}

export const getBulkDownloadDataForBeneficiary = value => {
  return {
    type: actions.GET_BULK_DOWNLOAD_FOR_BENEFICIARY,
    value,
  }
}

export const createBeneficiary = (value, token) => {
  return {
    type: actions.CREATE_BENEFICIARY,
    value,
    token,
  }
}

export const getBeneficiaries = (value, token) => {
  return {
    type: actions.GET_BENEFICIARIES,
    value,
    token,
  }
}

export const getBeneficiaryById = (id, token) => {
  return {
    type: actions.GET_BENEFICIARY_BY_ID,
    id,
    token,
  }
}

export const addBeneficiary = (id, token) => {
  return {
    type: actions.ADD_BENEFICIARY,
    id,
    token,
  }
}

export const updateBeneficiary = (value, token) => {
  return {
    type: actions.UPDATE_BENEFICIARY,
    value,
    token,
  }
}

export const handlePagination = (value, token) => {
  return {
    type: actions.HANDLE_BENEFICIARIES_PAGINATION,
    value,
    token,
  }
}
