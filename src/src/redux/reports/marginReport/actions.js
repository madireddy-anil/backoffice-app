const actions = {
  GET_MARGIN_REPORT: 'GET_MARGIN_REPORT',
  GET_MARGIN_REPORT_SUCCESS: 'GET_MARGIN_REPORT_SUCCESS',
  GET_MARGIN_REPORT_FAILURE: 'GET_MARGIN_REPORT_FAILURE',

  GET_MARGIN_REPORT_BULK_DOWNLOAD: 'GET_MARGIN_REPORT_BULK_DOWNLOAD',
  GET_MARGIN_REPORT_BULK_DOWNLOAD_SUCCESS: 'GET_MARGIN_REPORT_BULK_DOWNLOAD_SUCCESS',
  GET_MARGIN_REPORT_BULK_DOWNLOAD_FAILURE: 'GET_MARGIN_REPORT_BULK_DOWNLOAD_FAILURE',

  HANDLE_MARGIN_REPORT_PAGINATION: 'HANDLE_MARGIN_REPORT_PAGINATION',

  HANDLE_MARGIN_REPORT_FILTERS: 'HANDLE_MARGIN_REPORT_FILTERS',
}

export default actions

export const handleMarginReportFitlers = value => {
  return {
    type: actions.HANDLE_MARGIN_REPORT_FILTERS,
    value,
  }
}

export const getMarginReport = (value, token) => {
  return {
    type: actions.GET_MARGIN_REPORT,
    value,
    token,
  }
}

export const getMarginReportBulkDownload = (value, token) => {
  return {
    type: actions.GET_MARGIN_REPORT_BULK_DOWNLOAD,
    value,
    token,
  }
}

export const handleMarginReportPagination = value => {
  return {
    type: actions.HANDLE_MARGIN_REPORT_PAGINATION,
    value,
  }
}
