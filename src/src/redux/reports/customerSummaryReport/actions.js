const actions = {
  GET_CUSTOMER_SUMMARY_REPORT: 'GET_CUSTOMER_SUMMARY_REPORT',
  GET_CUSTOMER_SUMMARY_REPORT_SUCCESS: 'GET_CUSTOMER_SUMMARY_REPORT_SUCCESS',
  GET_CUSTOMER_SUMMARY_REPORT_FAILURE: 'GET_CUSTOMER_SUMMARY_REPORT_FAILURE',

  UPDATE_CUSTOMER_SUMMARY_REPORT: 'UPDATE_CUSTOMER_SUMMARY_REPORT',
  UPDATE_CUSTOMER_SUMMARY_REPORT_TABLE_COLUMN: 'UPDATE_CUSTOMER_SUMMARY_REPORT_TABLE_COLUMN',

  HANDLE_CUSTOMER_SUMMARY_REPORT_FILTERS: 'HANDLE_CUSTOMER_SUMMARY_REPORT_FILTERS',
}
export default actions

export const handleCustomerSummaryReportFilters = value => {
  return {
    type: actions.HANDLE_CUSTOMER_SUMMARY_REPORT_FILTERS,
    value,
  }
}

export const updateTableColumns = value => {
  return {
    type: actions.UPDATE_CUSTOMER_SUMMARY_REPORT_TABLE_COLUMN,
    value,
  }
}

export const updateCustomerSummaryReportData = value => {
  return {
    type: actions.UPDATE_CUSTOMER_SUMMARY_REPORT,
    value,
  }
}

export const getCustomerSummaryReport = value => {
  return {
    type: actions.GET_CUSTOMER_SUMMARY_REPORT,
    value,
  }
}
