const actions = {
  GET_VENDOR_REPORT: 'GET_VENDOR_REPORT',
  GET_VENDOR_REPORT_SUCCESS: 'GET_VENDOR_REPORT_SUCCESS',
  GET_VENDOR_REPORT_FAILURE: 'GET_VENDOR_REPORT_FAILURE',

  GET_VENDOR_REPORT_BULK_DOWNLOAD: 'GET_VENDOR_REPORT_BULK_DOWNLOAD',
  GET_VENDOR_REPORT_BULK_DOWNLOAD_SUCCESS: 'GET_VENDOR_REPORT_BULK_DOWNLOAD_SUCCESS',
  GET_VENDOR_REPORT_BULK_DOWNLOAD_FAILURE: 'GET_VENDOR_REPORT_BULK_DOWNLOAD_FAILURE',

  HANDLE_VENDOR_REPORT_PAGINATION: 'HANDLE_VENDOR_REPORT_PAGINATION',

  HANDLE_VENDOR_REPORT_FILTER: 'HANDLE_VENDOR_REPORT_FILTER',
}
export default actions

export const handleVendorReportFilters = value => {
  return {
    type: actions.HANDLE_VENDOR_REPORT_FILTER,
    value,
  }
}

export const getVendorReport = (value, token) => {
  return {
    type: actions.GET_VENDOR_REPORT,
    value,
    token,
  }
}

export const getVendorReportBulkDownload = (value, token) => {
  return {
    type: actions.GET_VENDOR_REPORT_BULK_DOWNLOAD,
    value,
    token,
  }
}

export const handleVendorReportPagination = value => {
  return {
    type: actions.HANDLE_VENDOR_REPORT_PAGINATION,
    value,
  }
}
