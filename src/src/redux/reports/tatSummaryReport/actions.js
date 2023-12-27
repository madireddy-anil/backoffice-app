const actions = {
  GET_TAT_REPORT: 'GET_TAT_REPORT',
  GET_TAT_REPORT_SUCCESS: 'GET_TAT_REPORT_SUCCESS',
  GET_TAT_REPORT_FAILURE: 'GET_TAT_REPORT_FAILURE',

  HANDLE_TAT_REPORT_PAGINATION: 'HANDLE_TAT_REPORT_PAGINATION',

  HANDLE_TAT_REPORT_FILTER: 'HANDLE_TAT_REPORT_FILTER',

  UPDATE_TAT_SUMMARY_REPORT: 'UPDATE_TAT_SUMMARY_REPORT',
  UPDATE_TAT_SUMMARY_REPORT_TABLE_COLUMN: 'UPDATE_TAT_SUMMARY_REPORT_TABLE_COLUMN',
}
export default actions

export const getTatReport = (value, token) => {
  return {
    type: actions.GET_TAT_REPORT,
    value,
    token,
  }
}

export const handleTatReportFilters = value => {
  return {
    type: actions.HANDLE_TAT_REPORT_FILTER,
    value,
  }
}

export const handleTatReportPagination = value => {
  return {
    type: actions.HANDLE_TAT_REPORT_PAGINATION,
    value,
  }
}

export const updateTATReportTableColumns = value => {
  return {
    type: actions.UPDATE_TAT_SUMMARY_REPORT_TABLE_COLUMN,
    value,
  }
}

export const updateTATSummaryReportData = value => {
  return {
    type: actions.UPDATE_TAT_SUMMARY_REPORT,
    value,
  }
}
