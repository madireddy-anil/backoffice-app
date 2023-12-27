const actions = {
  UPDATE_CURRENT_TRADE_ID: 'UPDATE_CURRENT_TRADE_ID',
  UPDATE_CURRENT_CHANNEL_DETAILS: 'UPDATE_CURRENT_CHANNEL_DETAILS',

  UPDATE_SOURCE_AMOUNT: 'UPDATE_SOURCE_AMOUNT',
  UPDATE_SOURCE_CURRENCY: 'UPDATE_SOURCE_CURRENCY',
  UPDATE_SELECTED_SOURCE_DETAILS: 'UPDATE_SELECTED_SOURCE_DETAILS',

  GET_TRADE_DETAILS_BY_ID: 'GET_TRADE_DETAILS_BY_ID',
  GET_TRADE_DETAILS_BY_ID_SUCCESS: 'GET_TRADE_DETAILS_BY_ID_SUCCESS',
  GET_TRADE_DETAILS_BY_ID_FAILURE: 'GET_TRADE_DETAILS_BY_ID_FAILURE',

  GET_ROUTE_BY_TRADE_ID: 'GET_ROUTE_BY_TRADE_ID',
  GET_ROUTE_BY_TRADE_ID_SUCCESS: 'GET_ROUTE_BY_TRADE_ID_SUCCESS',
  GET_ROUTE_BY_TRADE_ID_FAILURE: 'GET_ROUTE_BY_TRADE_ID_FAILURE',

  UPDATE_ROUTE_VALUE: 'UPDATE_ROUTE_VALUE',
  UPDATE_ROUTE_VALUE_SUCCESS: 'UPDATE_ROUTE_VALUE_SUCCESS',
  UPDATE_ROUTE_VALUE_FAILURE: 'UPDATE_ROUTE_VALUE_FAILURE',

  ADD_NEW_ROUTE_DATA: 'ADD_NEW_ROUTE_DATA',
  CHANGE_EDIT_MODE: 'CHANGE_EDIT_MODE',
  CHANGE_CHAT_MODE: 'CHANGE_CHAT_MODE',

  UPDATE_SELECTED_CLIENT: 'UPDATE_SELECTED_CLIENT',
  UPDATE_SELECTED_CLIENT_SUCCESS: 'UPDATE_SELECTED_CLIENT_SUCCESS',
  UPDATE_SELECTED_CLIENT_FAILURE: 'UPDATE_SELECTED_CLIENT_FAILURE',

  SELECTED_INTRODUCERS_CLIENT: 'SELECTED_INTRODUCERS_CLIENT',

  UPDATE_CLIENT: 'UPDATE_CLIENT',
  UPDATE_CLIENT_SUCCESS: 'UPDATE_CLIENT_SUCCESS',
  UPDATE_CLIENT_FAILURE: 'UPDATE_CLIENT_FAILURE',

  UPDATE_INTRODUCERS_CLIENT: 'UPDATE_INTRODUCERS_CLIENT',
  UPDATE_INTRODUCERS_CLIENT_SUCCESS: 'UPDATE_INTRODUCERS_CLIENT_SUCCESS',
  UPDATE_INTRODUCERS_CLIENT_FAILURE: 'UPDATE_INTRODUCERS_CLIENT_FAILURE',

  UPDATE_SOURCE_DETAILS: 'UPDATE_SOURCE_DETAILS',
  UPDATE_SOURCE_DETAILS_SUCCESS: 'UPDATE_SOURCE_DETAILS_SUCCESS',
  UPDATE_SOURCE_DETAILS_FAILURE: 'UPDATE_SOURCE_DETAILS_FAILURE',

  UPDATE_BENEFICIARY_DETAILS: 'UPDATE_BENEFICIARY_DETAILS',
  UPDATE_BENEFICIARY_DETAILS_SUCCESS: 'UPDATE_BENEFICIARY_DETAILS_SUCCESS',
  UPDATE_BENEFICIARY_DETAILS_FAILURE: 'UPDATE_BENEFICIARY_DETAILS_FAILURE',

  ENTERED_DEPOSITED_AMOUNT: 'ENTERED_DEPOSITED_AMOUNT',

  ENTERED_DEPOSIT_CONFIRMATION_AMOUNT: 'ENTERED_DEPOSIT_CONFIRMATION_AMOUNT',
  SELECTED_DEPOSIT_CONFIRMATION_DATE: 'SELECTED_DEPOSIT_CONFIRMATION_DATE',

  UPDATE_DEPOSITED_AMOUNT: 'UPDATE_DEPOSITED_AMOUNT',
  UPDATE_DEPOSITED_AMOUNT_SUCCESS: 'UPDATE_DEPOSITED_AMOUNT_SUCCESS',
  UPDATE_DEPOSITED_AMOUNT_FAILURE: 'UPDATE_DEPOSITED_AMOUNT_FAILURE',

  UPDATE_TRADE_AMOUNT: 'UPDATE_TRADE_AMOUNT',
  UPDATE_TRADE_AMOUNT_SUCCESS: 'UPDATE_TRADE_AMOUNT_SUCCESS',
  UPDATE_TRADE_AMOUNT_FAILURE: 'UPDATE_TRADE_AMOUNT_FAILURE',

  ENTERED_FUNDS_RECEIPT_CONFIRMATION_AMOUNT: 'ENTERED_FUNDS_RECEIPT_CONFIRMATION_AMOUNT',
  SELECTED_FUNDS_RECEIPT_CONFIRMATION_DATE: 'SELECTED_FUNDS_RECEIPT_CONFIRMATION_DATE',

  CONFIRM_FINAL_FUNDS: 'CONFIRM_FINAL_FUNDS',
  CONFIRM_FINAL_FUNDS_SUCCESS: 'CONFIRM_FINAL_FUNDS_SUCCESS',
  CONFIRM_FINAL_FUNDS_FAILURE: 'CONFIRM_FINAL_FUNDS_FAILURE',

  // CS - change stream
  UPDATE_CS_CURRENT_TRADE: 'UPDATE_CS_CURRENT_TRADE',

  CREATE_ROUTE: 'CREATE_ROUTE',
  CREATE_ROUTE_SUCCESS: 'CREATE_ROUTE_SUCCESS',
  CREATE_ROUTE_FAILURE: 'CREATE_ROUTE_FAILURE',

  CREATE_MANUAL_ROUTE: 'CREATE_MANUAL_ROUTE',
  CREATE_MANUAL_ROUTE_SUCCESS: 'CREATE_MANUAL_ROUTE_SUCCESS',
  CREATE_MANUAL_ROUTE_FAILURE: 'CREATE_MANUAL_ROUTE_FAILURE',

  UPDATE_ROUTE_ON_CANCEL_TXN: 'UPDATE_ROUTE_ON_CANCEL_TXN',
  UPDATE_ROUTE_ON_CANCEL_TXN_SUCCESS: 'UPDATE_ROUTE_ON_CANCEL_TXN_SUCCESS',
  UPDATE_ROUTE_ON_CANCEL_TXN_FAILURE: 'UPDATE_ROUTE_ON_CANCEL_TXN_FAILURE',

  UPDATE_ROUTE_ON_DELETE_TXN: 'UPDATE_ROUTE_ON_DELETE_TXN',
  UPDATE_ROUTE_ON_DELETE_TXN_SUCCESS: 'UPDATE_ROUTE_ON_DELETE_TXN_SUCCESS',
  UPDATE_ROUTE_ON_DELETE_TXN_FAILURE: 'UPDATE_ROUTE_ON_DELETE_TXN_FAILURE',

  UPDATE_ROUTE_SEQUENCE: 'UPDATE_ROUTE_SEQUENCE',
  UPDATE_ROUTE_SEQUENCE_SUCCESS: 'UPDATE_ROUTE_SEQUENCE_SUCCESS',
  UPDATE_ROUTE_SEQUENCE_FAILURE: 'UPDATE_ROUTE_SEQUENCE_FAILURE',

  UPDATE_ROUTE_STATUS: 'UPDATE_ROUTE_STATUS',
  UPDATE_ROUTE_STATUS_SUCCESS: 'UPDATE_ROUTE_STATUS_SUCCESS',
  UPDATE_ROUTE_STATUS_FAILURE: 'UPDATE_ROUTE_STATUS_FAILURE',

  // Rates

  CHANGE_INVERSE_RATE: 'CHANGE_INVERSE_RATE',
  CHANGE_NEW_CALCULATION: 'CHANGE_NEW_CALCULATION',
  APPLY_PRECISION_CHECK: 'APPLY_PRECISION_CHECK',
  ENTERED_PRECISION: 'ENTERED_PRECISION',
  APPLY_XE_DATE_TIME_CHECK: 'APPLY_XE_DATE_TIME_CHECK',
  UPDATE_XE_DATE_TIME: 'UPDATE_XE_DATE_TIME',

  GET_RATES_BY_TRADE_ID: 'GET_RATES_BY_TRADE_ID',
  GET_RATES_BY_TRADE_ID_SUCCESS: 'GET_RATES_BY_TRADE_ID_SUCCESS',
  GET_RATES_BY_TRADE_ID_FAILURE: 'GET_RATES_BY_TRADE_ID_FAILURE',

  GET_FEES_BY_TRADE_ID: 'GET_FEES_BY_TRADE_ID',
  GET_FEES_BY_TRADE_ID_SUCCESS: 'GET_FEES_BY_TRADE_ID_SUCCESS',
  GET_FEES_BY_TRADE_ID_FAILURE: 'GET_FEES_BY_TRADE_ID_FAILURE',

  GET_RATE: 'GET_RATE',
  GET_RATE_SUCCESS: 'GET_RATE_SUCCESS',
  GET_RATE_FAILURE: 'GET_RATE_FAILURE',

  CREATE_RATE_RECORD: 'CREATE_RATE_RECORD',
  CREATE_RATE_RECORD_SUCCESS: 'CREATE_RATE_RECORD_SUCCESS',
  CREATE_RATE_RECORD_FAILURE: 'CREATE_RATE_RECORD_FAILURE',

  CONFIRM_RATE: 'CONFIRM_RATE',
  CONFIRM_RATE_SUCCESS: 'CONFIRM_RATE_SUCCESS',
  CONFIRM_RATE_FAILURE: 'CONFIRM_RATE_FAILURE',

  UPDATE_SELL_RATE: 'UPDATE_SELL_RATE',
  UPDATE_SELL_RATE_SUCCESS: 'UPDATE_SELL_RATE_SUCCESS',
  UPDATE_SELL_RATE_FAILURE: 'UPDATE_SELL_RATE_FAILURE',

  UPDATE_FEE: 'UPDATE_FEE',
  UPDATE_FEE_SUCCESS: 'UPDATE_FEE_SUCCESS',
  UPDATE_FEE_FAILURE: 'UPDATE_FEE_FAILURE',

  GET_DEPOSIT_SLIPS_BY_TRADE_ID: 'GET_DEPOSIT_SLIPS_BY_TRADE_ID',
  GET_DEPOSIT_SLIPS_BY_TRADE_ID_SUCCESS: 'GET_DEPOSIT_SLIPS_BY_TRADE_ID_SUCCESS',
  GET_DEPOSIT_SLIPS_BY_TRADE_ID_FAILURE: 'GET_DEPOSIT_SLIPS_BY_TRADE_ID_FAILURE',

  DELETE_DEPOSIT_SLIP: 'DELETE_DEPOSIT_SLIP',
  DELETE_DEPOSIT_SLIP_SUCCESS: 'DELETE_DEPOSIT_SLIP_SUCCESS',
  DELETE_DEPOSIT_SLIP_FAILURE: 'DELETE_DEPOSIT_SLIP_FAILURE',

  UPDATE_TRADE_DETAILS: 'UPDATE_TRADE_DETAILS',
  UPDATE_TRADE_DETAILS_SUCCESS: 'UPDATE_TRADE_DETAILS_SUCCESS',
  UPDATE_TRADE_DETAILS_FAILURE: 'UPDATE_TRADE_DETAILS_FAILURE',

  // Introducer commision
  UPDATE_CURRENT_TRADE_CLIENT: 'UPDATE_CURRENT_TRADE_CLIENT',

  CHANGE_REVENUE: 'CHANGE_REVENUE',
  CHANGE_SETTLEMENT: 'CHANGE_SETTLEMENT',
  CHANGE_DEPOSIT: 'CHANGE_DEPOSIT',

  GET_TRADE_PC_MARGIN: 'GET_TRADE_PC_MARGIN',
  GET_TRADE_PC_MARGIN_SUCCESS: 'GET_TRADE_PC_MARGIN_SUCCESS',
  GET_TRADE_PC_MARGIN_FAILURE: 'GET_TRADE_PC_MARGIN_FAILURE',

  ENTERED_PC_MARGIN_PERCENTAGE: 'ENTERED_PC_MARGIN_PERCENTAGE',

  GET_INTRODUCER_COMMISION: 'GET_INTRODUCER_COMMISION',
  GET_INTRODUCER_COMMISION_SUCCESS: 'GET_INTRODUCER_COMMISION_SUCCESS',
  GET_INTRODUCER_COMMISION_FAILURE: 'GET_INTRODUCER_COMMISION_FAILURE',

  UPDATE_FEES_PC_MARGIN: 'UPDATE_FEES_PC_MARGIN',
  UPDATE_FEES_PC_MARGIN_SUCCESS: 'UPDATE_FEES_PC_MARGIN_SUCCESS',
  UPDATE_FEES_PC_MARGIN_FAILURE: 'UPDATE_FEES_PC_MARGIN_FAILURE',

  UPDATE_INTRODUCER_FEE: 'UPDATE_INTRODUCER_FEE',
  UPDATE_INTRODUCER_FEE_SUCCESS: 'UPDATE_INTRODUCER_FEE_SUCCESS',
  UPDATE_INTRODUCER_FEE_FAILURE: 'UPDATE_INTRODUCER_FEE_FAILURE',

  SHOW_NEXT_STEP_NOTIFICATION: 'SHOW_NEXT_STEP_NOTIFICATION',
  CLOSE_NEXT_STEP_NOTIFICATION: 'CLOSE_NEXT_STEP_NOTIFICATION',

  CREATE_MANUAL_RATE: 'CREATE_MANUAL_RATE',
  CREATE_MANUAL_RATE_SUCCESS: 'CREATE_MANUAL_RATE_SUCCESS',
  CREATE_MANUAL_RATE_FAILURE: 'CREATE_MANUAL_RATE_FAILURE',

  CREATE_MANUAL_FEES: 'CREATE_MANUAL_FEES',
  CREATE_MANUAL_FEES_SUCCESS: 'CREATE_MANUAL_FEES_SUCCESS',
  CREATE_MANUAL_FEES_FAILURE: 'CREATE_MANUAL_FEES_FAILURE',

  DELETE_TRADE_RATE: 'DELETE_TRADE_RATE',
  DELETE_TRADE_RATE_SUCCESS: 'DELETE_TRADE_RATE_SUCCESS',
  DELETE_TRADE_RATE_FAILURE: 'DELETE_TRADE_RATE_FAILURE',

  DELETE_TRADE_FEES: 'DELETE_TRADE_FEES',
  DELETE_TRADE_FEES_SUCCESS: 'DELETE_TRADE_FEES_SUCCESS',
  DELETE_TRADE_FEES_FAILURE: 'DELETE_TRADE_FEES_FAILURE',

  CONFIRM_EXISTING_SELL_RATE: 'CONFIRM_EXISTING_SELL_RATE',
  CONFIRM_EXISTING_SELL_RATE_SUCESS: 'CONFIRM_EXISTING_SELL_RATE_SUCESS',
  CONFIRM_EXISTING_SELL_RATE_FAILURE: 'CONFIRM_EXISTING_SELL_RATE_FAILURE',

  UPDATE_BACKDATED_TRADE: 'UPDATE_BACKDATED_TRADE',
  UPDATE_BACKDATED_TRADE_SUCCESS: 'UPDATE_BACKDATED_TRADE_SUCCESS',
  UPDATE_BACKDATED_TRADE_FAILURE: 'UPDATE_BACKDATED_TRADE_FAILURE',

  UPDATE_BENEFICIARY_DETAILS_TEMP: 'UPDATE_BENEFICIARY_DETAILS_TEMP',
}

export default actions

export const updateBackDatedTrade = (value, token) => {
  return {
    type: actions.UPDATE_BACKDATED_TRADE,
    value,
    token,
  }
}

export const updateBeneficiaryTemp = () => {
  return {
    type: actions.UPDATE_BENEFICIARY_DETAILS_TEMP,
  }
}

export const confirmExistingSellRate = (value, tradeUpdateData, token) => {
  return {
    type: actions.CONFIRM_EXISTING_SELL_RATE,
    value,
    tradeUpdateData,
    token,
  }
}

export const updateCurrentTradeId = value => {
  return {
    type: actions.UPDATE_CURRENT_TRADE_ID,
    value,
  }
}

export const updateCurrentChannelDetails = value => {
  return {
    type: actions.UPDATE_CURRENT_CHANNEL_DETAILS,
    value,
  }
}

export const getTradeById = (value, token) => {
  return {
    type: actions.GET_TRADE_DETAILS_BY_ID,
    value,
    token,
  }
}

export const getRouteByTradeId = (value, token) => {
  return {
    type: actions.GET_ROUTE_BY_TRADE_ID,
    value,
    token,
  }
}

export const updateRouteData = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_ROUTE_VALUE,
    value,
    tradeId,
    token,
  }
}

export const addNewRouteData = rowData => {
  return {
    type: actions.ADD_NEW_ROUTE_DATA,
    value: rowData,
  }
}

export const changeEditMode = value => {
  return {
    type: actions.CHANGE_EDIT_MODE,
    value,
  }
}

export const changeChatMode = value => {
  return {
    type: actions.CHANGE_CHAT_MODE,
    value,
  }
}

export const updateSelectedClient = (value, token) => {
  return {
    type: actions.UPDATE_SELECTED_CLIENT,
    value,
    token,
  }
}

export const updateSelectedIntroducerClient = value => {
  return {
    type: actions.SELECTED_INTRODUCERS_CLIENT,
    value,
  }
}

export const updateSelectedSourceDetails = value => {
  return {
    type: actions.UPDATE_SELECTED_SOURCE_DETAILS,
    value,
  }
}

export const updateSourceDetails = (value, token) => {
  return {
    type: actions.UPDATE_SOURCE_DETAILS,
    value,
    token,
  }
}

export const updateBeneficiary = (value, token) => {
  return {
    type: actions.UPDATE_BENEFICIARY_DETAILS,
    value,
    token,
  }
}

export const enteredDepositAmount = value => {
  return {
    type: actions.ENTERED_DEPOSIT_CONFIRMATION_AMOUNT,
    value,
  }
}

export const updateTradeAmount = (value, token) => {
  return {
    type: actions.UPDATE_TRADE_AMOUNT,
    value,
    token,
  }
}

export const selectDepositConfirmationDate = value => {
  return {
    type: actions.SELECTED_DEPOSIT_CONFIRMATION_DATE,
    value,
  }
}

export const confirmDepositConfirmation = (value, token) => {
  return {
    type: actions.UPDATE_DEPOSITED_AMOUNT,
    value,
    token,
  }
}

export const enteredFundReceiptConfirmAmount = value => {
  return {
    type: actions.ENTERED_FUNDS_RECEIPT_CONFIRMATION_AMOUNT,
    value,
  }
}

export const selectFundReceivedConfirmDate = value => {
  return {
    type: actions.SELECTED_FUNDS_RECEIPT_CONFIRMATION_DATE,
    value,
  }
}

export const confirmFinalFunds = (value, token) => {
  return {
    type: actions.CONFIRM_FINAL_FUNDS,
    value,
    token,
  }
}

export const updateCurrentTrade = (trade, changeStramIndex) => {
  return {
    type: actions.UPDATE_CS_CURRENT_TRADE,
    payload: { trade, changeStramIndex },
  }
}

export const createAutoRoute = (value, token) => {
  return {
    type: actions.CREATE_ROUTE,
    value,
    token,
  }
}

export const createManualRoute = (value, token) => {
  return {
    type: actions.CREATE_MANUAL_ROUTE,
    value,
    token,
  }
}

export const updateRouteOnCancelTxn = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_ROUTE_ON_CANCEL_TXN,
    value,
    tradeId,
    token,
  }
}

export const updateRouteOnDeleteTxn = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_ROUTE_ON_DELETE_TXN,
    value,
    tradeId,
    token,
  }
}

export const updateRouteSequence = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_ROUTE_SEQUENCE,
    value,
    tradeId,
    token,
  }
}

export const updateRouteStatus = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_ROUTE_STATUS,
    value,
    tradeId,
    token,
  }
}

export const updateSourceAmount = value => {
  return {
    type: actions.UPDATE_SOURCE_AMOUNT,
    value,
  }
}

export const updateSourceCurrency = value => {
  return {
    type: actions.UPDATE_SOURCE_CURRENCY,
    value,
  }
}

// Rates

export const changeInverseRate = value => {
  return {
    type: actions.CHANGE_INVERSE_RATE,
    value,
  }
}

export const changeNewCalculation = value => {
  return {
    type: actions.CHANGE_NEW_CALCULATION,
    value,
  }
}

export const checkApplyPrecision = value => {
  return {
    type: actions.APPLY_PRECISION_CHECK,
    value,
  }
}

export const enteredPrecision = value => {
  return {
    type: actions.ENTERED_PRECISION,
    value,
  }
}

export const checkApplyXeDateTime = value => {
  return {
    type: actions.APPLY_XE_DATE_TIME_CHECK,
    value,
  }
}

export const updateXeDateTime = value => {
  return {
    type: actions.UPDATE_XE_DATE_TIME,
    value,
  }
}

export const getRatesByTradeId = (value, token) => {
  return {
    type: actions.GET_RATES_BY_TRADE_ID,
    value,
    token,
  }
}

export const getFeesByTradeId = (value, token) => {
  return {
    type: actions.GET_FEES_BY_TRADE_ID,
    value,
    token,
  }
}

export const getTradeRate = (value, token) => {
  return {
    type: actions.GET_RATE,
    value,
    token,
  }
}

export const createRateRecord = (value, tradeValue, token) => {
  return {
    type: actions.CREATE_RATE_RECORD,
    value,
    tradeValue,
    token,
  }
}

export const updateSellRate = value => {
  return {
    type: actions.UPDATE_SELL_RATE,
    value,
  }
}

export const updateFees = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_FEE,
    value,
    tradeId,
    token,
  }
}

// Introducer Commision
export const changeRevenue = value => {
  return {
    type: actions.CHANGE_REVENUE,
    value,
  }
}

export const changeSettlement = value => {
  return {
    type: actions.CHANGE_SETTLEMENT,
    value,
  }
}

export const changeDeposit = value => {
  return {
    type: actions.CHANGE_DEPOSIT,
    value,
  }
}

export const geDepositSlipsByTradeId = (value, token) => {
  return {
    type: actions.GET_DEPOSIT_SLIPS_BY_TRADE_ID,
    value,
    token,
  }
}

export const updateTradeDetails = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_TRADE_DETAILS,
    value,
    tradeId,
    token,
  }
}

export const updateCurrentClient = (value, token) => {
  return {
    type: actions.UPDATE_CURRENT_TRADE_CLIENT,
    value,
    token,
  }
}

export const enteredPCMarginPercentage = value => {
  return {
    type: actions.ENTERED_PC_MARGIN_PERCENTAGE,
    value,
  }
}
export const getTradePcMargin = (tradeId, token) => {
  return {
    type: actions.GET_TRADE_PC_MARGIN,
    tradeId,
    token,
  }
}

export const updateFeesPcMargin = (value, token) => {
  return {
    type: actions.UPDATE_FEES_PC_MARGIN,
    value,
    token,
  }
}

export const getTradeCommision = (value, token) => {
  return {
    type: actions.GET_INTRODUCER_COMMISION,
    value,
    token,
  }
}

export const updateIntroducerFee = (value, tradeId, token) => {
  return {
    type: actions.UPDATE_INTRODUCER_FEE,
    value,
    tradeId,
    token,
  }
}

export const showNextNotification = () => {
  return {
    type: actions.SHOW_NEXT_STEP_NOTIFICATION,
  }
}

export const closeNextNotification = () => {
  return {
    type: actions.CLOSE_NEXT_STEP_NOTIFICATION,
  }
}

export const createManualRate = (value, token) => {
  return {
    type: actions.CREATE_MANUAL_RATE,
    value,
    token,
  }
}

export const createManualFees = (value, token) => {
  return {
    type: actions.CREATE_MANUAL_FEES,
    value,
    token,
  }
}

export const deleteTradeRate = (values, token) => {
  return {
    type: actions.DELETE_TRADE_RATE,
    values,
    token,
  }
}

export const deleteTradeFees = (values, token) => {
  return {
    type: actions.DELETE_TRADE_FEES,
    values,
    token,
  }
}

export const deleteDepositSlip = (id, token) => {
  return {
    type: actions.DELETE_DEPOSIT_SLIP,
    id,
    token,
  }
}
