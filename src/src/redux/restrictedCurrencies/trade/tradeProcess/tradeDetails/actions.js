const actions = {
  // trade leg actions
  NP_UPDATE_CURRENT_TRADE_ID: 'NP_UPDATE_CURRENT_TRADE_ID',

  NP_UPDATE_SOURCE_AMOUNT: 'NP_UPDATE_SOURCE_AMOUNT',
  NP_UPDATE_SOURCE_CURRENCY: 'NP_UPDATE_SOURCE_CURRENCY',
  NP_UPDATE_SELECTED_SOURCE_DETAILS: 'NP_UPDATE_SELECTED_SOURCE_DETAILS',

  NP_GET_TRADE_DETAILS_BY_ID: 'NP_GET_TRADE_DETAILS_BY_ID',
  NP_GET_TRADE_DETAILS_BY_ID_SUCCESS: 'NP_GET_TRADE_DETAILS_BY_ID_SUCCESS',
  NP_GET_TRADE_DETAILS_BY_ID_FAILURE: 'NP_GET_TRADE_DETAILS_BY_ID_FAILURE',

  NP_GET_ROUTE_BY_TRADE_ID: 'NP_GET_ROUTE_BY_TRADE_ID',
  NP_GET_ROUTE_BY_TRADE_ID_SUCCESS: 'NP_GET_ROUTE_BY_TRADE_ID_SUCCESS',
  NP_GET_ROUTE_BY_TRADE_ID_FAILURE: 'NP_GET_ROUTE_BY_TRADE_ID_FAILURE',

  NP_UPDATE_ROUTE_VALUE: 'NP_UPDATE_ROUTE_VALUE',
  NP_UPDATE_ROUTE_VALUE_SUCCESS: 'NP_UPDATE_ROUTE_VALUE_SUCCESS',
  NP_UPDATE_ROUTE_VALUE_FAILURE: 'NP_UPDATE_ROUTE_VALUE_FAILURE',

  NP_ADD_NEW_ROUTE_DATA: 'NP_ADD_NEW_ROUTE_DATA',
  NP_CHANGE_EDIT_MODE: 'NP_CHANGE_EDIT_MODE',
  NP_CHANGE_CHAT_MODE: 'NP_CHANGE_CHAT_MODE',

  NP_UPDATE_SELECTED_CLIENT: 'NP_UPDATE_SELECTED_CLIENT',
  NP_UPDATE_SELECTED_CLIENT_SUCCESS: 'NP_UPDATE_SELECTED_CLIENT_SUCCESS',
  NP_UPDATE_SELECTED_CLIENT_FAILURE: 'NP_UPDATE_SELECTED_CLIENT_FAILURE',

  NP_SELECTED_INTRODUCERS_CLIENT: 'NP_SELECTED_INTRODUCERS_CLIENT',

  NP_UPDATE_CLIENT: 'NP_UPDATE_CLIENT',
  NP_UPDATE_CLIENT_SUCCESS: 'NP_UPDATE_CLIENT_SUCCESS',
  NP_UPDATE_CLIENT_FAILURE: 'NP_UPDATE_CLIENT_FAILURE',

  NP_UPDATE_INTRODUCERS_CLIENT: 'NP_UPDATE_INTRODUCERS_CLIENT',
  NP_UPDATE_INTRODUCERS_CLIENT_SUCCESS: 'NP_UPDATE_INTRODUCERS_CLIENT_SUCCESS',
  NP_UPDATE_INTRODUCERS_CLIENT_FAILURE: 'NP_UPDATE_INTRODUCERS_CLIENT_FAILURE',

  NP_UPDATE_SOURCE_DETAILS: 'NP_UPDATE_SOURCE_DETAILS',
  NP_UPDATE_SOURCE_DETAILS_SUCCESS: 'NP_UPDATE_SOURCE_DETAILS_SUCCESS',
  NP_UPDATE_SOURCE_DETAILS_FAILURE: 'NP_UPDATE_SOURCE_DETAILS_FAILURE',

  NP_UPDATE_BENEFICIARY_DETAILS: 'NP_UPDATE_BENEFICIARY_DETAILS',
  NP_UPDATE_BENEFICIARY_DETAILS_SUCCESS: 'NP_UPDATE_BENEFICIARY_DETAILS_SUCCESS',
  NP_UPDATE_BENEFICIARY_DETAILS_FAILURE: 'NP_UPDATE_BENEFICIARY_DETAILS_FAILURE',

  NP_ENTERED_DEPOSITED_AMOUNT: 'NP_ENTERED_DEPOSITED_AMOUNT',

  NP_ENTERED_DEPOSIT_CONFIRMATION_AMOUNT: 'NP_ENTERED_DEPOSIT_CONFIRMATION_AMOUNT',
  NP_SELECTED_DEPOSIT_CONFIRMATION_DATE: 'NP_SELECTED_DEPOSIT_CONFIRMATION_DATE',

  NP_UPDATE_DEPOSITED_AMOUNT: 'NP_UPDATE_DEPOSITED_AMOUNT',
  NP_UPDATE_DEPOSITED_AMOUNT_SUCCESS: 'NP_UPDATE_DEPOSITED_AMOUNT_SUCCESS',
  NP_UPDATE_DEPOSITED_AMOUNT_FAILURE: 'NP_UPDATE_DEPOSITED_AMOUNT_FAILURE',

  NP_UPDATE_TRADE_AMOUNT: 'NP_UPDATE_TRADE_AMOUNT',
  NP_UPDATE_TRADE_AMOUNT_SUCCESS: 'NP_UPDATE_TRADE_AMOUNT_SUCCESS',
  NP_UPDATE_TRADE_AMOUNT_FAILURE: 'NP_UPDATE_TRADE_AMOUNT_FAILURE',

  NP_ENTERED_FUNDS_RECEIPT_CONFIRMATION_AMOUNT: 'NP_ENTERED_FUNDS_RECEIPT_CONFIRMATION_AMOUNT',
  NP_SELECTED_FUNDS_RECEIPT_CONFIRMATION_DATE: 'NP_SELECTED_FUNDS_RECEIPT_CONFIRMATION_DATE',

  NP_CONFIRM_FINAL_FUNDS: 'NP_CONFIRM_FINAL_FUNDS',
  NP_CONFIRM_FINAL_FUNDS_SUCCESS: 'NP_CONFIRM_FINAL_FUNDS_SUCCESS',
  NP_CONFIRM_FINAL_FUNDS_FAILURE: 'NP_CONFIRM_FINAL_FUNDS_FAILURE',

  // CS - change stream
  // NP_UPDATE_CS_CURRENT_TRADE: 'NP_UPDATE_CS_CURRENT_TRADE',

  NP_CREATE_ROUTE: 'NP_CREATE_ROUTE',
  NP_CREATE_ROUTE_SUCCESS: 'NP_CREATE_ROUTE_SUCCESS',
  NP_CREATE_ROUTE_FAILURE: 'NP_CREATE_ROUTE_FAILURE',

  NP_CREATE_MANUAL_ROUTE: 'NP_CREATE_MANUAL_ROUTE',
  NP_CREATE_MANUAL_ROUTE_SUCCESS: 'NP_CREATE_MANUAL_ROUTE_SUCCESS',
  NP_CREATE_MANUAL_ROUTE_FAILURE: 'NP_CREATE_MANUAL_ROUTE_FAILURE',

  NP_UPDATE_ROUTE_ON_CANCEL_TXN: 'NP_UPDATE_ROUTE_ON_CANCEL_TXN',
  NP_UPDATE_ROUTE_ON_CANCEL_TXN_SUCCESS: 'NP_UPDATE_ROUTE_ON_CANCEL_TXN_SUCCESS',
  NP_UPDATE_ROUTE_ON_CANCEL_TXN_FAILURE: 'NP_UPDATE_ROUTE_ON_CANCEL_TXN_FAILURE',

  NP_UPDATE_ROUTE_ON_DELETE_TXN: 'NP_UPDATE_ROUTE_ON_DELETE_TXN',
  NP_UPDATE_ROUTE_ON_DELETE_TXN_SUCCESS: 'NP_UPDATE_ROUTE_ON_DELETE_TXN_SUCCESS',
  NP_UPDATE_ROUTE_ON_DELETE_TXN_FAILURE: 'NP_UPDATE_ROUTE_ON_DELETE_TXN_FAILURE',

  NP_UPDATE_ROUTE_SEQUENCE: 'NP_UPDATE_ROUTE_SEQUENCE',
  NP_UPDATE_ROUTE_SEQUENCE_SUCCESS: 'NP_UPDATE_ROUTE_SEQUENCE_SUCCESS',
  NP_UPDATE_ROUTE_SEQUENCE_FAILURE: 'NP_UPDATE_ROUTE_SEQUENCE_FAILURE',

  NP_UPDATE_ROUTE_STATUS: 'NP_UPDATE_ROUTE_STATUS',
  NP_UPDATE_ROUTE_STATUS_SUCCESS: 'NP_UPDATE_ROUTE_STATUS_SUCCESS',
  NP_UPDATE_ROUTE_STATUS_FAILURE: 'NP_UPDATE_ROUTE_STATUS_FAILURE',

  // Rates

  NP_CHANGE_INVERSE_RATE: 'NP_CHANGE_INVERSE_RATE',
  NP_CHANGE_NEW_CALCULATION: 'NP_CHANGE_NEW_CALCULATION',
  NP_APPLY_PRECISION_CHECK: 'NP_APPLY_PRECISION_CHECK',
  NP_ENTERED_PRECISION: 'NP_ENTERED_PRECISION',
  NP_APPLY_XE_DATE_TIME_CHECK: 'NP_APPLY_XE_DATE_TIME_CHECK',
  NP_UPDATE_XE_DATE_TIME: 'NP_UPDATE_XE_DATE_TIME',

  NP_GET_RATES_BY_TRADE_ID: 'NP_GET_RATES_BY_TRADE_ID',
  NP_GET_RATES_BY_TRADE_ID_SUCCESS: 'NP_GET_RATES_BY_TRADE_ID_SUCCESS',
  NP_GET_RATES_BY_TRADE_ID_FAILURE: 'NP_GET_RATES_BY_TRADE_ID_FAILURE',

  NP_GET_FEES_BY_TRADE_ID: 'NP_GET_FEES_BY_TRADE_ID',
  NP_GET_FEES_BY_TRADE_ID_SUCCESS: 'NP_GET_FEES_BY_TRADE_ID_SUCCESS',
  NP_GET_FEES_BY_TRADE_ID_FAILURE: 'NP_GET_FEES_BY_TRADE_ID_FAILURE',

  NP_GET_RATE: 'NP_GET_RATE',
  NP_GET_RATE_SUCCESS: 'NP_GET_RATE_SUCCESS',
  NP_GET_RATE_FAILURE: 'NP_GET_RATE_FAILURE',

  NP_CREATE_RATE_RECORD: 'NP_CREATE_RATE_RECORD',
  NP_CREATE_RATE_RECORD_SUCCESS: 'NP_CREATE_RATE_RECORD_SUCCESS',
  NP_CREATE_RATE_RECORD_FAILURE: 'NP_CREATE_RATE_RECORD_FAILURE',

  NP_CONFIRM_RATE: 'NP_CONFIRM_RATE',
  NP_CONFIRM_RATE_SUCCESS: 'NP_CONFIRM_RATE_SUCCESS',
  NP_CONFIRM_RATE_FAILURE: 'NP_CONFIRM_RATE_FAILURE',

  NP_UPDATE_SELL_RATE: 'NP_UPDATE_SELL_RATE',
  NP_UPDATE_SELL_RATE_SUCCESS: 'NP_UPDATE_SELL_RATE_SUCCESS',
  NP_UPDATE_SELL_RATE_FAILURE: 'NP_UPDATE_SELL_RATE_FAILURE',

  NP_UPDATE_FEE: 'NP_UPDATE_FEE',
  NP_UPDATE_FEE_SUCCESS: 'NP_UPDATE_FEE_SUCCESS',
  NP_UPDATE_FEE_FAILURE: 'NP_UPDATE_FEE_FAILURE',

  NP_GET_DEPOSIT_SLIPS_BY_TRADE_ID: 'NP_GET_DEPOSIT_SLIPS_BY_TRADE_ID',
  NP_GET_DEPOSIT_SLIPS_BY_TRADE_ID_SUCCESS: 'NP_GET_DEPOSIT_SLIPS_BY_TRADE_ID_SUCCESS',
  NP_GET_DEPOSIT_SLIPS_BY_TRADE_ID_FAILURE: 'NP_GET_DEPOSIT_SLIPS_BY_TRADE_ID_FAILURE',

  NP_DELETE_DEPOSIT_SLIP: 'NP_DELETE_DEPOSIT_SLIP',
  NP_DELETE_DEPOSIT_SLIP_SUCCESS: 'NP_DELETE_DEPOSIT_SLIP_SUCCESS',
  NP_DELETE_DEPOSIT_SLIP_FAILURE: 'NP_DELETE_DEPOSIT_SLIP_FAILURE',

  NP_UPDATE_TRADE_DETAILS: 'NP_UPDATE_TRADE_DETAILS',
  NP_UPDATE_TRADE_DETAILS_SUCCESS: 'NP_UPDATE_TRADE_DETAILS_SUCCESS',
  NP_UPDATE_TRADE_DETAILS_FAILURE: 'NP_UPDATE_TRADE_DETAILS_FAILURE',

  // Introducer commision
  NP_UPDATE_CURRENT_TRADE_CLIENT: 'NP_UPDATE_CURRENT_TRADE_CLIENT',

  NP_CHANGE_REVENUE: 'NP_CHANGE_REVENUE',
  NP_CHANGE_SETTLEMENT: 'NP_CHANGE_SETTLEMENT',
  NP_CHANGE_DEPOSIT: 'NP_CHANGE_DEPOSIT',

  NP_GET_TRADE_PC_MARGIN: 'NP_GET_TRADE_PC_MARGIN',
  NP_GET_TRADE_PC_MARGIN_SUCCESS: 'NP_GET_TRADE_PC_MARGIN_SUCCESS',
  NP_GET_TRADE_PC_MARGIN_FAILURE: 'NP_GET_TRADE_PC_MARGIN_FAILURE',

  NP_ENTERED_PC_MARGIN_PERCENTAGE: 'NP_ENTERED_PC_MARGIN_PERCENTAGE',

  NP_GET_INTRODUCER_COMMISION: 'NP_GET_INTRODUCER_COMMISION',
  NP_GET_INTRODUCER_COMMISION_SUCCESS: 'NP_GET_INTRODUCER_COMMISION_SUCCESS',
  NP_GET_INTRODUCER_COMMISION_FAILURE: 'NP_GET_INTRODUCER_COMMISION_FAILURE',

  NP_UPDATE_FEES_PC_MARGIN: 'NP_UPDATE_FEES_PC_MARGIN',
  NP_UPDATE_FEES_PC_MARGIN_SUCCESS: 'NP_UPDATE_FEES_PC_MARGIN_SUCCESS',
  NP_UPDATE_FEES_PC_MARGIN_FAILURE: 'NP_UPDATE_FEES_PC_MARGIN_FAILURE',

  NP_UPDATE_INTRODUCER_FEE: 'NP_UPDATE_INTRODUCER_FEE',
  NP_UPDATE_INTRODUCER_FEE_SUCCESS: 'NP_UPDATE_INTRODUCER_FEE_SUCCESS',
  NP_UPDATE_INTRODUCER_FEE_FAILURE: 'NP_UPDATE_INTRODUCER_FEE_FAILURE',

  NP_SHOW_NEXT_STEP_NOTIFICATION: 'NP_SHOW_NEXT_STEP_NOTIFICATION',
  NP_CLOSE_NEXT_STEP_NOTIFICATION: 'NP_CLOSE_NEXT_STEP_NOTIFICATION',

  NP_CREATE_MANUAL_RATE: 'NP_CREATE_MANUAL_RATE',
  NP_CREATE_MANUAL_RATE_SUCCESS: 'NP_CREATE_MANUAL_RATE_SUCCESS',
  NP_CREATE_MANUAL_RATE_FAILURE: 'NP_CREATE_MANUAL_RATE_FAILURE',

  NP_CREATE_MANUAL_FEES: 'NP_CREATE_MANUAL_FEES',
  NP_CREATE_MANUAL_FEES_SUCCESS: 'NP_CREATE_MANUAL_FEES_SUCCESS',
  NP_CREATE_MANUAL_FEES_FAILURE: 'NP_CREATE_MANUAL_FEES_FAILURE',

  NP_DELETE_TRADE_RATE: 'NP_DELETE_TRADE_RATE',
  NP_DELETE_TRADE_RATE_SUCCESS: 'NP_DELETE_TRADE_RATE_SUCCESS',
  NP_DELETE_TRADE_RATE_FAILURE: 'NP_DELETE_TRADE_RATE_FAILURE',

  NP_DELETE_TRADE_FEES: 'NP_DELETE_TRADE_FEES',
  NP_DELETE_TRADE_FEES_SUCCESS: 'NP_DELETE_TRADE_FEES_SUCCESS',
  NP_DELETE_TRADE_FEES_FAILURE: 'NP_DELETE_TRADE_FEES_FAILURE',

  NP_CONFIRM_EXISTING_SELL_RATE: 'NP_CONFIRM_EXISTING_SELL_RATE',
  NP_CONFIRM_EXISTING_SELL_RATE_SUCESS: 'NP_CONFIRM_EXISTING_SELL_RATE_SUCESS',
  NP_CONFIRM_EXISTING_SELL_RATE_FAILURE: 'NP_CONFIRM_EXISTING_SELL_RATE_FAILURE',

  NP_UPDATE_BACKDATED_TRADE: 'NP_UPDATE_BACKDATED_TRADE',
  NP_UPDATE_BACKDATED_TRADE_SUCCESS: 'NP_UPDATE_BACKDATED_TRADE_SUCCESS',
  NP_UPDATE_BACKDATED_TRADE_FAILURE: 'NP_UPDATE_BACKDATED_TRADE_FAILURE',

  NP_UPDATE_BENEFICIARY_DETAILS_TEMP: 'NP_UPDATE_BENEFICIARY_DETAILS_TEMP',

  NP_UPDATE_CURRENT_CHANNEL_DETAILS: 'NP_UPDATE_CURRENT_CHANNEL_DETAILS',
  NP_UPDATE_CURRENT_CHANNEL_DETAILS_SUCCESS: 'NP_UPDATE_CURRENT_CHANNEL_DETAILS_SUCCESS',
  NP_UPDATE_CURRENT_CHANNEL_DETAILS_FAILURE: 'NP_UPDATE_CURRENT_CHANNEL_DETAILS_FAILURE',
}
export default actions

export const updateBackDatedTrade = (value, token) => {
  return {
    type: actions.NP_UPDATE_BACKDATED_TRADE,
    value,
    token,
  }
}

export const updateBeneficiaryTemp = () => {
  return {
    type: actions.NP_UPDATE_BENEFICIARY_DETAILS_TEMP,
  }
}

export const confirmExistingSellRate = (value, tradeUpdateData, token) => {
  return {
    type: actions.NP_CONFIRM_EXISTING_SELL_RATE,
    value,
    tradeUpdateData,
    token,
  }
}

export const updateCurrentTradeId = value => {
  return {
    type: actions.NP_UPDATE_CURRENT_TRADE_ID,
    value,
  }
}

export const updateCurrentChannelDetails = value => {
  return {
    type: actions.NP_UPDATE_CURRENT_CHANNEL_DETAILS,
    value,
  }
}

export const getTradeById = (value, token) => {
  return {
    type: actions.NP_GET_TRADE_DETAILS_BY_ID,
    value,
    token,
  }
}

export const getRouteByTradeId = (value, token) => {
  return {
    type: actions.NP_GET_ROUTE_BY_TRADE_ID,
    value,
    token,
  }
}

export const updateRouteData = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_ROUTE_VALUE,
    value,
    tradeId,
    token,
  }
}

export const addNewRouteData = rowData => {
  return {
    type: actions.NP_ADD_NEW_ROUTE_DATA,
    value: rowData,
  }
}

export const changeEditMode = value => {
  return {
    type: actions.NP_CHANGE_EDIT_MODE,
    value,
  }
}

export const changeChatMode = value => {
  return {
    type: actions.NP_CHANGE_CHAT_MODE,
    value,
  }
}

export const updateSelectedClient = (value, token) => {
  return {
    type: actions.NP_UPDATE_SELECTED_CLIENT,
    value,
    token,
  }
}

export const updateSelectedIntroducerClient = value => {
  return {
    type: actions.NP_SELECTED_INTRODUCERS_CLIENT,
    value,
  }
}

export const updateSelectedSourceDetails = value => {
  return {
    type: actions.NP_UPDATE_SELECTED_SOURCE_DETAILS,
    value,
  }
}

export const updateSourceDetails = (value, token) => {
  return {
    type: actions.NP_UPDATE_SOURCE_DETAILS,
    value,
    token,
  }
}

export const updateBeneficiary = (value, token) => {
  return {
    type: actions.NP_UPDATE_BENEFICIARY_DETAILS,
    value,
    token,
  }
}

export const enteredDepositAmount = value => {
  return {
    type: actions.NP_ENTERED_DEPOSIT_CONFIRMATION_AMOUNT,
    value,
  }
}

export const updateTradeAmount = (value, token) => {
  return {
    type: actions.NP_UPDATE_TRADE_AMOUNT,
    value,
    token,
  }
}

export const selectDepositConfirmationDate = value => {
  return {
    type: actions.NP_SELECTED_DEPOSIT_CONFIRMATION_DATE,
    value,
  }
}

export const confirmDepositConfirmation = (value, token) => {
  return {
    type: actions.NP_UPDATE_DEPOSITED_AMOUNT,
    value,
    token,
  }
}

export const enteredFundReceiptConfirmAmount = value => {
  return {
    type: actions.NP_ENTERED_FUNDS_RECEIPT_CONFIRMATION_AMOUNT,
    value,
  }
}

export const selectFundReceivedConfirmDate = value => {
  return {
    type: actions.NP_SELECTED_FUNDS_RECEIPT_CONFIRMATION_DATE,
    value,
  }
}

export const confirmFinalFunds = (value, token) => {
  return {
    type: actions.NP_CONFIRM_FINAL_FUNDS,
    value,
    token,
  }
}

// export const updateCurrentTrade = (trade, changeStramIndex) => {
//   return {
//     type: actions.NP_UPDATE_CS_CURRENT_TRADE,
//     payload: { trade, changeStramIndex },
//   }
// }

export const createAutoRoute = (value, token) => {
  return {
    type: actions.NP_CREATE_ROUTE,
    value,
    token,
  }
}

export const createManualRoute = (value, token) => {
  return {
    type: actions.NP_CREATE_MANUAL_ROUTE,
    value,
    token,
  }
}

export const updateRouteOnCancelTxn = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_ROUTE_ON_CANCEL_TXN,
    value,
    tradeId,
    token,
  }
}

export const updateRouteOnDeleteTxn = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_ROUTE_ON_DELETE_TXN,
    value,
    tradeId,
    token,
  }
}

export const updateRouteSequence = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_ROUTE_SEQUENCE,
    value,
    tradeId,
    token,
  }
}

export const updateRouteStatus = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_ROUTE_STATUS,
    value,
    tradeId,
    token,
  }
}

export const updateSourceAmount = value => {
  return {
    type: actions.NP_UPDATE_SOURCE_AMOUNT,
    value,
  }
}

export const updateSourceCurrency = value => {
  return {
    type: actions.NP_UPDATE_SOURCE_CURRENCY,
    value,
  }
}

// Rates

export const changeInverseRate = value => {
  return {
    type: actions.NP_CHANGE_INVERSE_RATE,
    value,
  }
}

export const changeNewCalculation = value => {
  return {
    type: actions.NP_CHANGE_NEW_CALCULATION,
    value,
  }
}

export const checkApplyPrecision = value => {
  return {
    type: actions.NP_APPLY_PRECISION_CHECK,
    value,
  }
}

export const enteredPrecision = value => {
  return {
    type: actions.NP_ENTERED_PRECISION,
    value,
  }
}

export const checkApplyXeDateTime = value => {
  return {
    type: actions.NP_APPLY_XE_DATE_TIME_CHECK,
    value,
  }
}

export const updateXeDateTime = value => {
  return {
    type: actions.NP_UPDATE_XE_DATE_TIME,
    value,
  }
}

export const getRatesByTradeId = (value, token) => {
  return {
    type: actions.NP_GET_RATES_BY_TRADE_ID,
    value,
    token,
  }
}

export const getFeesByTradeId = (value, token) => {
  return {
    type: actions.NP_GET_FEES_BY_TRADE_ID,
    value,
    token,
  }
}

export const getTradeRate = (value, token) => {
  return {
    type: actions.NP_GET_RATE,
    value,
    token,
  }
}

export const createRateRecord = (value, tradeValue, token) => {
  return {
    type: actions.NP_CREATE_RATE_RECORD,
    value,
    tradeValue,
    token,
  }
}

export const updateSellRate = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_SELL_RATE,
    value,
    tradeId,
    token,
  }
}

export const updateFees = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_FEE,
    value,
    tradeId,
    token,
  }
}

// Introducer Commision
export const changeRevenue = value => {
  return {
    type: actions.NP_CHANGE_REVENUE,
    value,
  }
}

export const changeSettlement = value => {
  return {
    type: actions.NP_CHANGE_SETTLEMENT,
    value,
  }
}

export const changeDeposit = value => {
  return {
    type: actions.NP_CHANGE_DEPOSIT,
    value,
  }
}

export const geDepositSlipsByTradeId = (value, token) => {
  return {
    type: actions.NP_GET_DEPOSIT_SLIPS_BY_TRADE_ID,
    value,
    token,
  }
}

export const updateTradeDetails = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_TRADE_DETAILS,
    value,
    tradeId,
    token,
  }
}

export const updateCurrentClient = (value, token) => {
  return {
    type: actions.NP_UPDATE_CURRENT_TRADE_CLIENT,
    value,
    token,
  }
}

export const enteredPCMarginPercentage = value => {
  return {
    type: actions.NP_ENTERED_PC_MARGIN_PERCENTAGE,
    value,
  }
}
export const getTradePcMargin = (tradeId, token) => {
  return {
    type: actions.NP_GET_TRADE_PC_MARGIN,
    tradeId,
    token,
  }
}

export const updateFeesPcMargin = (value, token) => {
  return {
    type: actions.NP_UPDATE_FEES_PC_MARGIN,
    value,
    token,
  }
}

export const getTradeCommision = (value, token) => {
  return {
    type: actions.NP_GET_INTRODUCER_COMMISION,
    value,
    token,
  }
}

export const updateIntroducerFee = (value, tradeId, token) => {
  return {
    type: actions.NP_UPDATE_INTRODUCER_FEE,
    value,
    tradeId,
    token,
  }
}

export const showNextNotification = () => {
  return {
    type: actions.NP_SHOW_NEXT_STEP_NOTIFICATION,
  }
}

export const closeNextNotification = () => {
  return {
    type: actions.NP_CLOSE_NEXT_STEP_NOTIFICATION,
  }
}

export const createManualRate = (value, token) => {
  return {
    type: actions.NP_CREATE_MANUAL_RATE,
    value,
    token,
  }
}

export const createManualFees = (value, token) => {
  return {
    type: actions.NP_CREATE_MANUAL_FEES,
    value,
    token,
  }
}

export const deleteTradeRate = (values, token) => {
  return {
    type: actions.NP_DELETE_TRADE_RATE,
    values,
    token,
  }
}

export const deleteTradeFees = (values, token) => {
  return {
    type: actions.NP_DELETE_TRADE_FEES,
    values,
    token,
  }
}

export const deleteDepositSlip = (id, token) => {
  return {
    type: actions.NP_DELETE_DEPOSIT_SLIP,
    id,
    token,
  }
}
