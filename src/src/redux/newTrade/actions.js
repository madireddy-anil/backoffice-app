const actions = {
  INITIATE_NEW_TRADE: 'INITIATE_NEW_TRADE',
  UPDATE_DEPOSIT_CURRENCY: 'UPDATE_DEPOSIT_CURRENCY',
  UPDATE_DEPOSIT_AMOUNT: 'UPDATE_DEPOSIT_AMOUNT',

  UPDATE_INTRODUCER_OR_MERCHANT: 'UPDATE_INTRODUCER_OR_MERCHANT',
  UPDATE_SELECTED_INTRODUCER: 'UPDATE_SELECTED_INTRODUCER',
  UPDATE_SELECTED_MERCHANT: 'UPDATE_SELECTED_MERCHANT',
  UPDATE_SELECTED_INTRODUCER_CLIENT: 'UPDATE_SELECTED_INTRODUCER_CLIENT',
  UPDATE_SELECTED_MERCHANT_CLIENT: 'UPDATE_SELECTED_MERCHANT_CLIENT',
  REMOVE_INTRODUCER: 'REMOVE_INTRODUCER',
  REMOVE_MERCHANT: 'REMOVE_MERCHANT',
  REMOVE_INTRODUCER_CLIENT: 'REMOVE_INTRODUCER_CLIENT',
  REMOVE_MERCHANT_CLIENT: 'REMOVE_MERCHANT_CLIENT',

  UPDATE_ACCOUNT_PREFERENCE: 'UPDATE_ACCOUNT_PREFERENCE',
  SELECTED_TRADE_BENEFICIARY: 'SELECTED_TRADE_BENEFICIARY',
  REMOVE_BENEFICIARY: 'REMOVE_BENEFICIARY',

  GET_BENEFICIARY_BY_CLIENT_ID: 'GET_BENEFICIARY_BY_CLIENT_ID',
  GET_BENEFICIARY_BY_CLIENT_ID_SUCCESS: 'GET_BENEFICIARY_BY_CLIENT_ID_SUCCESS',
  GET_BENEFICIARY_BY_CLIENT_ID_FAILURE: 'GET_BENEFICIARY_BY_CLIENT_ID_FAILURE',

  CREATE_TRADE: 'CREATE_TRADE',
  CREATE_TRADE_SUCCESS: 'CREATE_TRADE_SUCCESS',
  CREATE_TRADE_FAILURE: 'CREATE_TRADE_FAILURE',

  UPDATE_TRADE_STATUS: 'UPDATE_TRADE_STATUS',
  UPDATE_TRADE_STATUS_SUCCESS: 'UPDATE_TRADE_STATUS_SUCCESS',
  UPDATE_TRADE_STATUS_FAILURE: 'UPDATE_TRADE_STATUS_FAILURE',

  HANDLE_SETTLEMENT_PREFERENCE: 'HANDLE_SETTLEMENT_PREFERENCE',
  HANDLE_SETTLEMENT_PREFERENCE_CRYPTO: 'HANDLE_SETTLEMENT_PREFERENCE_CRYPTO',
  HANDLE_SETTLEMENT_PREFERENCE_FIAT: 'HANDLE_SETTLEMENT_PREFERENCE_FIAT',

  GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID: 'GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID',
  GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_SUCCESS: 'GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_SUCCESS',
  GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_FAILURE: 'GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_FAILURE',
}

export default actions

export const getCryptoBeneficiaryByClientId = (value, token) => {
  return {
    type: actions.GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID,
    value,
    token,
  }
}

export const handleSettlementPrefAsCrypto = value => {
  return {
    type: actions.HANDLE_SETTLEMENT_PREFERENCE_CRYPTO,
    value,
  }
}

export const handleSettlementPrefAsFiat = () => {
  return {
    type: actions.HANDLE_SETTLEMENT_PREFERENCE_FIAT,
  }
}

export const handleSettlementPref = value => {
  return {
    type: actions.HANDLE_SETTLEMENT_PREFERENCE,
    value,
  }
}

export const initiateNewTrade = () => {
  return {
    type: actions.INITIATE_NEW_TRADE,
  }
}

export const selectBeneficiary = value => {
  return {
    type: actions.SELECT_BENEFICIARY,
    value,
  }
}

export const updateDepositCurrency = value => {
  return {
    type: actions.UPDATE_DEPOSIT_CURRENCY,
    value,
  }
}

export const updateSourceAmount = value => {
  return {
    type: actions.UPDATE_DEPOSIT_AMOUNT,
    value,
  }
}

export const updateIntroducerOrMerchant = value => {
  return {
    type: actions.UPDATE_INTRODUCER_OR_MERCHANT,
    value,
  }
}

export const updateSelectedIntroducer = value => {
  return {
    type: actions.UPDATE_SELECTED_INTRODUCER,
    value,
  }
}

export const updateSelectedMerchant = value => {
  return {
    type: actions.UPDATE_SELECTED_MERCHANT,
    value,
  }
}

export const updateIntroducerClient = value => {
  return {
    type: actions.UPDATE_SELECTED_INTRODUCER_CLIENT,
    value,
  }
}

export const updateMerchantClient = value => {
  return {
    type: actions.UPDATE_SELECTED_MERCHANT_CLIENT,
    value,
  }
}

export const removeIntroducer = value => {
  return {
    type: actions.REMOVE_INTRODUCER,
    value,
  }
}

export const removeMerchant = value => {
  return {
    type: actions.REMOVE_MERCHANT,
    value,
  }
}

export const removeIntroducerClient = value => {
  return {
    type: actions.REMOVE_INTRODUCER_CLIENT,
    value,
  }
}

export const removeMerchantClient = value => {
  return {
    type: actions.REMOVE_MERCHANT_CLIENT,
    value,
  }
}

export const getBeneficiaryByClientId = (value, token) => {
  return {
    type: actions.GET_BENEFICIARY_BY_CLIENT_ID,
    value,
    token,
  }
}

export const updateBeneficiary = value => {
  return {
    type: actions.SELECTED_TRADE_BENEFICIARY,
    value,
  }
}

export const updateAccountPreference = value => {
  return {
    type: actions.UPDATE_ACCOUNT_PREFERENCE,
    value,
  }
}

export const removeClient = () => {
  return {
    type: actions.REMOVE_CLIENT,
  }
}

export const removeBeneficiary = () => {
  return {
    type: actions.REMOVE_BENEFICIARY,
  }
}

export const createTrade = (value, token) => {
  return {
    type: actions.CREATE_TRADE,
    value,
    token,
  }
}
