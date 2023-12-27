const actions = {
  NP_INITIATE_NEW_TRADE: 'NP_INITIATE_NEW_TRADE',
  NP_UPDATE_DEPOSIT_CURRENCY: 'NP_UPDATE_DEPOSIT_CURRENCY',
  NP_UPDATE_DEPOSIT_AMOUNT: 'NP_UPDATE_DEPOSIT_AMOUNT',

  NP_UPDATE_INTRODUCER_OR_MERCHANT: 'NP_UPDATE_INTRODUCER_OR_MERCHANT',
  NP_UPDATE_SELECTED_INTRODUCER: 'NP_UPDATE_SELECTED_INTRODUCER',
  NP_UPDATE_SELECTED_MERCHANT: 'NP_UPDATE_SELECTED_MERCHANT',
  NP_UPDATE_SELECTED_INTRODUCER_CLIENT: 'NP_UPDATE_SELECTED_INTRODUCER_CLIENT',
  NP_UPDATE_SELECTED_MERCHANT_CLIENT: 'NP_UPDATE_SELECTED_MERCHANT_CLIENT',
  NP_REMOVE_INTRODUCER: 'NP_REMOVE_INTRODUCER',
  NP_REMOVE_MERCHANT: 'NP_REMOVE_MERCHANT',
  NP_REMOVE_INTRODUCER_CLIENT: 'NP_REMOVE_INTRODUCER_CLIENT',
  NP_REMOVE_MERCHANT_CLIENT: 'NP_REMOVE_MERCHANT_CLIENT',

  NP_UPDATE_ACCOUNT_PREFERENCE: 'NP_UPDATE_ACCOUNT_PREFERENCE',
  NP_SELECTED_TRADE_BENEFICIARY: 'NP_SELECTED_TRADE_BENEFICIARY',
  NP_REMOVE_BENEFICIARY: 'NP_REMOVE_BENEFICIARY',

  NP_GET_BENEFICIARY_BY_CLIENT_ID: 'NP_GET_BENEFICIARY_BY_CLIENT_ID',
  NP_GET_BENEFICIARY_BY_CLIENT_ID_SUCCESS: 'NP_GET_BENEFICIARY_BY_CLIENT_ID_SUCCESS',
  NP_GET_BENEFICIARY_BY_CLIENT_ID_FAILURE: 'NP_GET_BENEFICIARY_BY_CLIENT_ID_FAILURE',

  NP_CREATE_TRADE: 'NP_CREATE_TRADE',
  NP_CREATE_TRADE_SUCCESS: 'NP_CREATE_TRADE_SUCCESS',
  NP_CREATE_TRADE_FAILURE: 'NP_CREATE_TRADE_FAILURE',

  NP_UPDATE_TRADE_STATUS: 'NP_UPDATE_TRADE_STATUS',
  NP_UPDATE_TRADE_STATUS_SUCCESS: 'NP_UPDATE_TRADE_STATUS_SUCCESS',
  NP_UPDATE_TRADE_STATUS_FAILURE: 'NP_UPDATE_TRADE_STATUS_FAILURE',

  NP_HANDLE_SETTLEMENT_PREFERENCE: 'NP_HANDLE_SETTLEMENT_PREFERENCE',
  NP_HANDLE_SETTLEMENT_PREFERENCE_CRYPTO: 'NP_HANDLE_SETTLEMENT_PREFERENCE_CRYPTO',
  NP_HANDLE_SETTLEMENT_PREFERENCE_FIAT: 'NP_HANDLE_SETTLEMENT_PREFERENCE_FIAT',

  NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID: 'NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID',
  NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_SUCCESS: 'NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_SUCCESS',
  NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_FAILURE: 'NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_FAILURE',
}

export default actions

export const getCryptoBeneficiaryByClientId = (value, token) => {
  return {
    type: actions.NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID,
    value,
    token,
  }
}

export const handleSettlementPrefAsCrypto = value => {
  return {
    type: actions.NP_HANDLE_SETTLEMENT_PREFERENCE_CRYPTO,
    value,
  }
}

export const handleSettlementPrefAsFiat = () => {
  return {
    type: actions.NP_HANDLE_SETTLEMENT_PREFERENCE_FIAT,
  }
}

export const handleSettlementPref = value => {
  return {
    type: actions.NP_HANDLE_SETTLEMENT_PREFERENCE,
    value,
  }
}

export const initiateNewTrade = () => {
  return {
    type: actions.NP_INITIATE_NEW_TRADE,
  }
}

export const selectBeneficiary = value => {
  return {
    type: actions.NP_SELECT_BENEFICIARY,
    value,
  }
}

export const updateDepositCurrency = value => {
  return {
    type: actions.NP_UPDATE_DEPOSIT_CURRENCY,
    value,
  }
}

export const updateSourceAmount = value => {
  return {
    type: actions.NP_UPDATE_DEPOSIT_AMOUNT,
    value,
  }
}

export const updateIntroducerOrMerchant = value => {
  return {
    type: actions.NP_UPDATE_INTRODUCER_OR_MERCHANT,
    value,
  }
}

export const updateSelectedIntroducer = value => {
  return {
    type: actions.NP_UPDATE_SELECTED_INTRODUCER,
    value,
  }
}

export const updateSelectedMerchant = value => {
  return {
    type: actions.NP_UPDATE_SELECTED_MERCHANT,
    value,
  }
}

export const updateIntroducerClient = value => {
  return {
    type: actions.NP_UPDATE_SELECTED_INTRODUCER_CLIENT,
    value,
  }
}

export const updateMerchantClient = value => {
  return {
    type: actions.NP_UPDATE_SELECTED_MERCHANT_CLIENT,
    value,
  }
}

export const removeIntroducer = value => {
  return {
    type: actions.NP_REMOVE_INTRODUCER,
    value,
  }
}

export const removeMerchant = value => {
  return {
    type: actions.NP_REMOVE_MERCHANT,
    value,
  }
}

export const removeIntroducerClient = value => {
  return {
    type: actions.NP_REMOVE_INTRODUCER_CLIENT,
    value,
  }
}

export const removeMerchantClient = value => {
  return {
    type: actions.NP_REMOVE_MERCHANT_CLIENT,
    value,
  }
}

export const getBeneficiaryByClientId = (value, token) => {
  return {
    type: actions.NP_GET_BENEFICIARY_BY_CLIENT_ID,
    value,
    token,
  }
}

export const updateBeneficiary = value => {
  return {
    type: actions.NP_SELECTED_TRADE_BENEFICIARY,
    value,
  }
}

export const updateAccountPreference = value => {
  return {
    type: actions.NP_UPDATE_ACCOUNT_PREFERENCE,
    value,
  }
}

export const removeClient = () => {
  return {
    type: actions.NP_REMOVE_CLIENT,
  }
}

export const removeBeneficiary = () => {
  return {
    type: actions.NP_REMOVE_BENEFICIARY,
  }
}

export const createTrade = (value, token) => {
  return {
    type: actions.NP_CREATE_TRADE,
    value,
    token,
  }
}
