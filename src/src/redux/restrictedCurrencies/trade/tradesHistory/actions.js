const actions = {
  NP_GET_TRADES: 'NP_GET_TRADES',
  NP_GET_TRADES_SUCCESS: 'NP_GET_TRADES_SUCCESS',
  NP_GET_TRADES_FAILURE: 'NP_GET_TRADES_FAILURE',
  NP_UPDATE_TRADES: 'NP_UPDATE_TRADES',
  NP_UPDATE_TRADES_SUCCESS: 'NP_UPDATE_TRADES_SUCCESS',
  NP_UPDATE_TRADES_FAILURE: 'NP_UPDATE_TRADES_FAILURE',
  NP_UPDATE_DAY_FROM: 'NP_UPDATE_DAY_FROM',
  NP_UPDATE_DAY_TO: 'NP_UPDATE_DAY_TO',
  NP_CLEAR_DATES: 'NP_CLEAR_DATES',

  // CS - Change Straem
  // NP_INSERT_CS_NEW_TRADE: 'NP_INSERT_CS_NEW_TRADE',
  // NP_UPDATE_CS_TRDAE: 'NP_UPDATE_CS_TRDAE',

  NP_DELETE_TRADE: 'NP_DELETE_TRADE',
  NP_DELETE_TRADE_SUCCESS: 'NP_DELETE_TRADE_SUCCESS',
  NP_DELETE_TRADE_FAILURE: 'NP_DELETE_TRADE_FAILURE',

  NP_BULK_DELETE_TRADES: 'NP_BULK_DELETE_TRADES',
  NP_BULK_DELETE_TRADES_SUCCESS: 'NP_BULK_DELETE_TRADES_SUCCESS',
  NP_BULK_DELETE_TRADES_FAILURE: 'NP_BULK_DELETE_TRADES_FAILURE',

  NP_GET_TRADES_BULK_DOWNLOAD: 'NP_GET_TRADES_BULK_DOWNLOAD',
  NP_GET_TRADES_BULK_DOWNLOAD_SUCCESS: 'NP_GET_TRADES_BULK_DOWNLOAD_SUCCESS',
  NP_GET_TRADES_BULK_DOWNLOAD_FAILURE: 'NP_GET_TRADES_BULK_DOWNLOAD_FAILURE',

  NP_SET_ACTIVE_CHANNEL: 'NP_SET_ACTIVE_CHANNEL',

  NP_HANDLE_TRADES_PAGINATION: 'NP_HANDLE_TRADES_PAGINATION',
  NP_HANDLE_TRADES_FILTERS: 'NP_HANDLE_TRADES_FILTERS',

  NP_UPDATE_DOWNLOADABLE_DATA: 'NP_UPDATE_DOWNLOADABLE_DATA',
}
export default actions

export const updateTradeFilters = value => {
  return {
    type: actions.NP_HANDLE_TRADES_FILTERS,
    value,
  }
}

export const getTrades = (tradesData, token) => {
  return {
    type: actions.NP_GET_TRADES,
    value: tradesData,
    token,
  }
}

export const updateTrades = tradesData => ({
  type: actions.NP_UPDATE_TRADES,
  value: tradesData,
})

export const updateTradeList = tradesData => ({
  type: actions.NP_UPDATE_TRADES_SUCCESS,
  tradesData,
})

export const updateDayFrom = dayFrom => ({
  type: actions.NP_UPDATE_DAY_FROM,
  dayFrom,
})

export const updateDayTo = dayTo => ({
  type: actions.NP_UPDATE_DAY_TO,
  dayTo,
})

export const clearDate = () => ({
  type: actions.NP_CLEAR_DATES,
})

export const setActiveChannel = value => {
  return {
    type: actions.NP_SET_ACTIVE_CHANNEL,
    value,
  }
}

// export const insertNewTrade = (trade, changeStramIndex) => ({
//   type: actions.NP_INSERT_CS_NEW_TRADE,
//   payload: { trade, changeStramIndex },
// })

// export const updateCSTrade = (trade, changeStramIndex) => ({
//   type: actions.NP_UPDATE_CS_TRDAE,
//   payload: { trade, changeStramIndex },
// })

export const deleteTrade = (value, token) => {
  return {
    type: actions.NP_DELETE_TRADE,
    value,
    token,
  }
}

export const bulkDeleteTrades = (value, token) => {
  return {
    type: actions.NP_BULK_DELETE_TRADES,
    value,
    token,
  }
}

export const getTradesBulkDownload = (value, token) => {
  return {
    type: actions.NP_GET_TRADES_BULK_DOWNLOAD,
    value,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.NP_HANDLE_TRADES_PAGINATION,
    value,
  }
}

export const updateDownloadableData = value => {
  return {
    type: actions.NP_UPDATE_DOWNLOADABLE_DATA,
    value,
  }
}
