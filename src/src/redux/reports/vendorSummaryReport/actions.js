const actions = {
  GET_VENDOR_SUMMARY_REPORT: 'GET_VENDOR_SUMMARY_REPORT',
  GET_VENDOR_SUMMARY_REPORT_SUCCESS: 'GET_VENDOR_SUMMARY_REPORT_SUCCESS',
  GET_VENDOR_SUMMARY_REPORT_FAILURE: 'GET_VENDOR_SUMMARY_REPORT_FAILURE',

  UPDATE_VENDOR_SUMMARY_SPLIT_REPORT: 'UPDATE_VENDOR_SUMMARY_SPLIT_REPORT',
  UPDATE_VENDOR_SUMMARY_SPLIT_REPORT_TABLE_COLUMN:
    'UPDATE_VENDOR_SUMMARY_SPLIT_REPORT_TABLE_COLUMN',

  HANDLE_VENDOR_SUMMARY_SPLIT_REPORT_FILTER: 'HANDLE_VENDOR_SUMMARY_SPLIT_REPORT_FILTER',
}

export default actions

export const handleVendorSummarySplitReportFilter = value => {
  return {
    type: actions.HANDLE_VENDOR_SUMMARY_SPLIT_REPORT_FILTER,
    value,
  }
}

export const updateReportData = value => {
  return {
    type: actions.UPDATE_VENDOR_SUMMARY_SPLIT_REPORT,
    value,
  }
}

export const updateReportTableColumn = value => {
  return {
    type: actions.UPDATE_VENDOR_SUMMARY_SPLIT_REPORT_TABLE_COLUMN,
    value,
  }
}

export const getVendorSummaryReport = value => {
  return {
    type: actions.GET_VENDOR_SUMMARY_REPORT,
    value,
  }
}
