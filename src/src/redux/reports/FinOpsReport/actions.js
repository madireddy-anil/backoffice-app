const actions = {
  GET_FIN_OPS_REPORT: 'GET_FIN_OPS_REPORT',
  GET_FIN_OPS_REPORT_SUCCESS: 'GET_FIN_OPS_REPORT_SUCCESS',
  GET_FIN_OPS_REPORT_FAILURE: 'GET_FIN_OPS_REPORT_FAILURE',

  HANDLE_FIN_OPS_PAGINATION: 'HANDLE_FIN_OPS_PAGINATION',

  GET_FIN_OPS_REPORT_BULK_DOWNLOAD: 'GET_FIN_OPS_REPORT_BULK_DOWNLOAD',
  GET_FIN_OPS_REPORT_BULK_DOWNLOAD_SUCCESS: 'GET_FIN_OPS_REPORT_BULK_DOWNLOAD_SUCCESS',
  GET_FIN_OPS_REPORT_BULK_DOWNLOAD_FAILURE: 'GET_FIN_OPS_REPORT_BULK_DOWNLOAD_FAILURE',

  HANDLE_FIN_OPS_REPORT_FILTERS: 'HANDLE_FIN_OPS_REPORT_FILTERS',
}

export default actions

export const handleFinOpsReportFilters = value => {
  return {
    type: actions.HANDLE_FIN_OPS_REPORT_FILTERS,
    value,
  }
}

export const getFinOpsReports = value => {
  return {
    type: actions.GET_FIN_OPS_REPORT,
    value,
  }
}

export const handleFinOpsPagination = value => {
  return {
    type: actions.HANDLE_FIN_OPS_PAGINATION,
    value,
  }
}

export const getDownloadData = value => {
  return {
    type: actions.GET_FIN_OPS_REPORT_BULK_DOWNLOAD,
    value,
  }
}
