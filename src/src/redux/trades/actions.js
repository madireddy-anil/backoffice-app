const actions = {
  GET_TRADES: 'GET_TRADES',
  GET_TRADES_SUCCESS: 'GET_TRADES_SUCCESS',
  GET_TRADES_FAILURE: 'GET_TRADES_FAILURE',
  UPDATE_TRADES: 'UPDATE_TRADES',
  UPDATE_TRADES_SUCCESS: 'UPDATE_TRADES_SUCCESS',
  UPDATE_TRADES_FAILURE: 'UPDATE_TRADES_FAILURE',
  UPDATE_DAY_FROM: 'UPDATE_DAY_FROM',
  UPDATE_DAY_TO: 'UPDATE_DAY_TO',
  CLEAR_DATES: 'CLEAR_DATES',

  // CS - Change Straem
  INSERT_CS_NEW_TRADE: 'INSERT_CS_NEW_TRADE',
  UPDATE_CS_TRDAE: 'UPDATE_CS_TRDAE',

  DELETE_TRADE: 'DELETE_TRADE',
  DELETE_TRADE_SUCCESS: 'DELETE_TRADE_SUCCESS',
  DELETE_TRADE_FAILURE: 'DELETE_TRADE_FAILURE',

  BULK_DELETE_TRADES: 'BULK_DELETE_TRADES',
  BULK_DELETE_TRADES_SUCCESS: 'BULK_DELETE_TRADES_SUCCESS',
  BULK_DELETE_TRADES_FAILURE: 'BULK_DELETE_TRADES_FAILURE',

  GET_TRADES_BULK_DOWNLOAD: 'GET_TRADES_BULK_DOWNLOAD',
  GET_TRADES_BULK_DOWNLOAD_SUCCESS: 'GET_TRADES_BULK_DOWNLOAD_SUCCESS',
  GET_TRADES_BULK_DOWNLOAD_FAILURE: 'GET_TRADES_BULK_DOWNLOAD_FAILURE',

  SET_ACTIVE_CHANNEL: 'SET_ACTIVE_CHANNEL',

  HANDLE_TRADES_PAGINATION: 'HANDLE_TRADES_PAGINATION',
  HANDLE_TRADES_FILTERS: 'HANDLE_TRADES_FILTERS',

  UPDATE_DOWNLOADABLE_DATA: 'UPDATE_DOWNLOADABLE_DATA',
}
export default actions

export const updateTradeFilters = value => {
  return {
    type: actions.HANDLE_TRADES_FILTERS,
    value,
  }
}

export const getTrades = (tradesData, token) => {
  return {
    type: actions.GET_TRADES,
    value: tradesData,
    token,
  }
}

export const updateTrades = tradesData => ({
  type: actions.UPDATE_TRADES,
  value: tradesData,
})

export const updateTradeList = tradesData => ({
  type: actions.UPDATE_TRADES_SUCCESS,
  tradesData,
})

export const updateDayFrom = dayFrom => ({
  type: actions.UPDATE_DAY_FROM,
  dayFrom,
})

export const updateDayTo = dayTo => ({
  type: actions.UPDATE_DAY_TO,
  dayTo,
})

export const clearDate = () => ({
  type: actions.CLEAR_DATES,
})

export const setActiveChannel = value => {
  return {
    type: actions.SET_ACTIVE_CHANNEL,
    value,
  }
}

// export const insertNewTrade = (trade, changeStramIndex) => ({
//   type: actions.INSERT_CS_NEW_TRADE,
//   payload: { trade, changeStramIndex },
// })

// export const updateCSTrade = (trade, changeStramIndex) => ({
//   type: actions.UPDATE_CS_TRDAE,
//   payload: { trade, changeStramIndex },
// })

export const deleteTrade = (value, token) => {
  return {
    type: actions.DELETE_TRADE,
    value,
    token,
  }
}

export const bulkDeleteTrades = (value, token) => {
  return {
    type: actions.BULK_DELETE_TRADES,
    value,
    token,
  }
}

export const getTradesBulkDownload = (value, token) => {
  return {
    type: actions.GET_TRADES_BULK_DOWNLOAD,
    value,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.HANDLE_TRADES_PAGINATION,
    value,
  }
}

export const updateDownloadableData = value => {
  return {
    type: actions.UPDATE_DOWNLOADABLE_DATA,
    value,
  }
}
