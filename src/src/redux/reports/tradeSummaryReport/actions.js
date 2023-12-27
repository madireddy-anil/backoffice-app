const actions = {
  HANDLE_TRADE_SUMMARY_REPORT_DATA: 'HANDLE_TRADE_SUMMARY_REPORT_DATA',
  HANDLE_TRADE_SUMMARY_REPORT_DATA_SUCCESS: 'HANDLE_TRADE_SUMMARY_REPORT_DATA_SUCCESS',
  HANDLE_TRADE_SUMMARY_REPORT_DATA_FAILURE: 'HANDLE_TRADE_SUMMARY_REPORT_DATA_FAILURE',

  UPDATE_TRADE_SUMMARY_REPORT_DATA: 'UPDATE_TRADE_SUMMARY_REPORT_DATA',
  UPDATE_TRADE_SUMMARY_REPORT_COLUMN: 'UPDATE_TRADE_SUMMARY_REPORT_COLUMN',

  // HANDLE_TRADE_SUMMARY_REPORT_PAGINATION: 'HANDLE_TRADE_SUMMARY_REPORT_PAGINATION',

  HANDLE_TRADE_SUMMARY_REPORT_FILTER: 'HANDLE_TRADE_SUMMARY_REPORT_FILTER',
}

export default actions

export const handleTradeSummaryReportFilter = value => {
  return {
    type: actions.HANDLE_TRADE_SUMMARY_REPORT_FILTER,
    value,
  }
}

export const updateTradeSummaryReport = value => {
  return {
    type: actions.UPDATE_TRADE_SUMMARY_REPORT_DATA,
    value,
  }
}

export const updateTradeSummaryReportColumn = value => {
  return {
    type: actions.UPDATE_TRADE_SUMMARY_REPORT_COLUMN,
    value,
  }
}

export const handleTradeSummaryReport = (value, token) => {
  return {
    type: actions.HANDLE_TRADE_SUMMARY_REPORT_DATA,
    value,
    token,
  }
}

// export const handlePagination = value => {
//   return {
//     type: actions.HANDLE_TRADE_SUMMARY_REPORT_PAGINATION,
//     value,
//   }
// }
