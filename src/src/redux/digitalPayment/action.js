const actions = {
  UPDATE_SELECED_CLIENT: 'UPDATE_SELECED_CLIENT',
  UPDATE_SELECTED_COMPANY: 'UPDATE_SELECTED_COMPANY',
  SET_TO_INITIAL_VALUES: 'SET_TO_INITIAL_VALUES',

  UPDATE_SELECED_CA: 'UPDATE_SELECED_CA',

  REMOVE_SELECED_CA_FROM_NEW_PAYMENT: 'REMOVE_SELECED_CA_FROM_NEW_PAYMENT',
  UPDATE_NEW_BENEFICIARY_DATA: 'UPDATE_NEW_BENEFICIARY_DATA',

  REMOVE_SELECED_BENEFICIARY_DATA: 'REMOVE_SELECED_BENEFICIARY_DATA',

  GET_BENEFICIARY_LIST_ID: 'GET_BENEFICIARY_LIST_ID',
  GET_BENEFICIARY_LIST_ID_SUCCESS: 'GET_BENEFICIARY_LIST_ID_SUCCESS',
  GET_BENEFICIARY_LIST_ID_FAILURE: 'GET_BENEFICIARY_LIST_ID_FAILURE',

  UPDATE_ERROR_MESSAGE: 'UPDATE_ERROR_MESSAGE',

  UPDATE_DEBIT_AMOUNT: 'UPDATE_DEBIT_AMOUNT',
  UPDATE_CREDIT_AMOUNT: 'UPDATE_CREDIT_AMOUNT',
  RESET_CREDIT_DEBIT_AMOUNT: 'RESET_CREDIT_DEBIT_AMOUNT',

  GET_QUOTE: 'GET_QUOTE',
  GET_QUOTE_SUCCESS: 'GET_QUOTE_SUCCESS',
  GET_QUOTE_FAILURE: 'GET_QUOTE_FAILURE',

  GET_DIGITAL_PAYMENT_DEATILS: 'GET_DIGITAL_PAYMENT_DEATILS',
  GET_DIGITAL_PAYMENT_DEATILS_SUCCESS: 'GET_DIGITAL_PAYMENT_DEATILS_SUCCESS',
  GET_DIGITAL_PAYMENT_DEATILS_FAILURE: 'GET_DIGITAL_PAYMENT_DEATILS_FAILURE',

  REMOVE_PAYMENT_INFORMATION: 'REMOVE_PAYMENT_INFORMATION',

  INITIATE_DIGITAL_PAYMENT: 'INITIATE_DIGITAL_PAYMENT',
  INITIATE_DIGITAL_PAYMENT_SUCCESS: 'INITIATE_DIGITAL_PAYMENT_SUCCESS',
  INITIATE_DIGITAL_PAYMENT_FAILURE: 'INITIATE_DIGITAL_PAYMENT_FAILURE',

  GET_BENEFICIARY_FIELDS_LIST: 'GET_BENEFICIARY_FIELDS_LIST',
  GET_BENEFICIARY_FIELDS_LIST_SUCCESS: 'GET_BENEFICIARY_FIELDS_LIST_SUCCESS',
  GET_BENEFICIARY_FIELDS_LIST_FAILURE: 'GET_BENEFICIARY_FIELDS_LIST_FAILURE',

  UPDATE_BENEFICIARY_FIELDS_LIST: 'UPDATE_BENEFICIARY_FIELDS_LIST',

  UPDATE_CLIENT_OR_COMPANY_AS_BENEFICIARY: 'UPDATE_CLIENT_OR_COMPANY_AS_BENEFICIARY',

  GET_LIFTING_FEE: 'GET_LIFTING_FEE',
  GET_LIFTING_FEE_SUCCESS: 'GET_LIFTING_FEE_SUCCESS',
  GET_LIFTING_FEE_FAILURE: 'GET_LIFTING_FEE_FAILURE',
}

export default actions

export const getLiftingFee = value => {
  return {
    type: actions.GET_LIFTING_FEE,
    value,
  }
}

export const updateSelectedClient = value => {
  return {
    type: actions.UPDATE_SELECED_CLIENT,
    value,
  }
}

export const updateSelectedCompany = value => {
  return {
    type: actions.UPDATE_SELECTED_COMPANY,
    value,
  }
}

export const setToInitialValue = value => {
  return {
    type: actions.SET_TO_INITIAL_VALUES,
    value,
  }
}

export const updateSelectedCA = value => {
  return {
    type: actions.UPDATE_SELECED_CA,
    value,
  }
}

export const removeSelectedCA = value => {
  return {
    type: actions.REMOVE_SELECED_CA_FROM_NEW_PAYMENT,
    value,
  }
}

export const updateNewBeneficiaryDetails = value => {
  return {
    type: actions.UPDATE_NEW_BENEFICIARY_DATA,
    value,
  }
}

export const removeBeneficiaryData = value => {
  return {
    type: actions.REMOVE_SELECED_BENEFICIARY_DATA,
    value,
  }
}

export const getBeneficiariesByOwnerEntityId = (id, token) => {
  return {
    type: actions.GET_BENEFICIARY_LIST_ID,
    id,
    token,
  }
}

export const updateErrorMessage = value => {
  return {
    type: actions.UPDATE_ERROR_MESSAGE,
    value,
  }
}

export const updateDebitAmount = value => {
  return {
    type: actions.UPDATE_DEBIT_AMOUNT,
    value,
  }
}

export const updateCreditAmount = value => {
  return {
    type: actions.UPDATE_CREDIT_AMOUNT,
    value,
  }
}

export const resetCreditDebitAmount = () => {
  return {
    type: actions.RESET_CREDIT_DEBIT_AMOUNT,
  }
}

export const getQuote = (value, token) => {
  return {
    type: actions.GET_QUOTE,
    value,
    token,
  }
}

export const removePaymentInformation = () => {
  return {
    type: actions.REMOVE_PAYMENT_INFORMATION,
  }
}

export const getDigitalPaymentDetails = (value, token) => {
  return {
    type: actions.GET_DIGITAL_PAYMENT_DEATILS,
    value,
    token,
  }
}

export const initiateDigitalPayment = (value, token) => {
  return {
    type: actions.INITIATE_DIGITAL_PAYMENT,
    value,
    token,
  }
}

export const getBeneFieldsByValues = (value, token) => {
  return {
    type: actions.GET_BENEFICIARY_FIELDS_LIST,
    value,
    token,
  }
}

export const updateClientOrCompanyAsBeneficiary = value => {
  return {
    type: actions.UPDATE_CLIENT_OR_COMPANY_AS_BENEFICIARY,
    value,
  }
}

export const updateBeneFieldsByValues = value => {
  return {
    type: actions.UPDATE_BENEFICIARY_FIELDS_LIST,
    value,
  }
}
