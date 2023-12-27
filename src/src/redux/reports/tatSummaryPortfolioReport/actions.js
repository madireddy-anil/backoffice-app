const actions = {
  GET_TAT_PORTFOLIO_REPORT: 'GET_TAT_PORTFOLIO_REPORT',
  GET_TAT_PORTFOLIO_REPORT_SUCCESS: 'GET_TAT_PORTFOLIO_REPORT_SUCCESS',
  GET_TAT_PORTFOLIO_REPORT_FAILURE: 'GET_TAT_PORTFOLIO_REPORT_FAILURE',

  HANDLE_TAT_PORTFOLIO_REPORT_PAGINATION: 'HANDLE_TAT_PORTFOLIO_REPORT_PAGINATION',

  HANDLE_TAT_PORTFOLIO_REPORT_FILTER: 'HANDLE_TAT_PORTFOLIO_REPORT_FILTER',

  UPDATE_TAT_PORTFOLIO_SUMMARY_REPORT: 'UPDATE_TAT_PORTFOLIO_SUMMARY_REPORT',
  UPDATE_TAT_PORTFOLIO_SUMMARY_REPORT_TABLE_COLUMN:
    'UPDATE_TAT_PORTFOLIO_SUMMARY_REPORT_TABLE_COLUMN',
}
export default actions

export const getTatPortfolioReport = (value, token) => {
  return {
    type: actions.GET_TAT_PORTFOLIO_REPORT,
    value,
    token,
  }
}

export const handleTatPortfolioReportFilters = value => {
  return {
    type: actions.HANDLE_TAT_PORTFOLIO_REPORT_FILTER,
    value,
  }
}

export const handleTatPortfolioReportPagination = value => {
  return {
    type: actions.HANDLE_TAT_PORTFOLIO_REPORT_PAGINATION,
    value,
  }
}

export const updateTATPortfolioReportTableColumns = value => {
  return {
    type: actions.UPDATE_TAT_PORTFOLIO_SUMMARY_REPORT_TABLE_COLUMN,
    value,
  }
}

export const updateTATPortfolioSummaryReportData = value => {
  return {
    type: actions.UPDATE_TAT_PORTFOLIO_SUMMARY_REPORT,
    value,
  }
}
