const actions = {
  GET_VENDOR_SUMMARY_PORTFOLIO_REPORT: 'GET_VENDOR_SUMMARY_PORTFOLIO_REPORT',
  GET_VENDOR_SUMMARY_PORTFOLIO_REPORT_SUCCESS: 'GET_VENDOR_SUMMARY_PORTFOLIO_REPORT_SUCCESS',
  GET_VENDOR_SUMMARY_PORTFOLIO_REPORT_FAILURE: 'GET_VENDOR_SUMMARY_PORTFOLIO_REPORT_FAILURE',

  UPDATE_VENDOR_SUMMARY_REPORT: 'UPDATE_VENDOR_SUMMARY_REPORT',
  UPDATE_VENDOR_SUMMARY_REPORT_TABLE_COLUMN: 'UPDATE_VENDOR_SUMMARY_REPORT_TABLE_COLUMN',

  HANDLE_VENDOR_SUMMARY_PORTFOLIO_REPORT_FILTER: 'HANDLE_VENDOR_SUMMARY_PORTFOLIO_REPORT_FILTER',
}
export default actions

export const handleVendorSummaryPortfolioFilter = value => {
  return {
    type: actions.HANDLE_VENDOR_SUMMARY_PORTFOLIO_REPORT_FILTER,
    value,
  }
}

export const updateVendorSummaryReport = value => {
  return {
    type: actions.UPDATE_VENDOR_SUMMARY_REPORT,
    value,
  }
}

export const updateVendorSummaryReportTableColumn = value => {
  return {
    type: actions.UPDATE_VENDOR_SUMMARY_REPORT_TABLE_COLUMN,
    value,
  }
}

export const getVendorSummaryPortfolioReport = value => {
  return {
    type: actions.GET_VENDOR_SUMMARY_PORTFOLIO_REPORT,
    value,
  }
}
