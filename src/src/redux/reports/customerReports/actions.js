const actions = {
  GET_CUSTOMER_REPORT: 'GET_CUSTOMER_REPORT',
  GET_CUSTOMER_REPORT_SUCCESS: 'GET_CUSTOMER_REPORT_SUCCESS',
  GET_CUSTOMER_REPORT_FAILURE: 'GET_CUSTOMER_REPORT_FAILURE',

  GET_CUSTOMER_REPORT_BULK_DOWNLOAD: 'GET_CUSTOMER_REPORT_BULK_DOWNLOAD',
  GET_CUSTOMER_REPORT_BULK_DOWNLOAD_SUCCESS: 'GET_CUSTOMER_REPORT_BULK_DOWNLOAD_SUCCESS',
  GET_CUSTOMER_REPORT_BULK_DOWNLOAD_FAILURE: 'GET_CUSTOMER_REPORT_BULK_DOWNLOAD_FAILURE',

  HANDLE_CUSTOMER_REPORTS_PAGINATION: 'HANDLE_CUSTOMER_REPORTS_PAGINATION',

  HANDLE_CUSTOMER_REPORT_FILTERS: 'HANDLE_CUSTOMER_REPORT_FILTERS',
}

export default actions

export const handleCustomerReportFilters = values => {
  return {
    type: actions.HANDLE_CUSTOMER_REPORT_FILTERS,
    values,
  }
}

export const getcustomerReport = values => {
  return {
    type: actions.GET_CUSTOMER_REPORT,
    values,
  }
}

export const getcustomerReportBulkDownload = values => {
  return {
    type: actions.GET_CUSTOMER_REPORT_BULK_DOWNLOAD,
    values,
  }
}

export const handleCustomerReportsPagination = value => {
  return {
    type: actions.HANDLE_CUSTOMER_REPORTS_PAGINATION,
    value,
  }
}
