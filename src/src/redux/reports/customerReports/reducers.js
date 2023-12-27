import actions from './actions'

const initialState = {
  customerReport: [],
  loading: false,
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  isDownloadDisabled: false,
  appliedCustomerReportFilters: {},
  reportDownloadData: [],
}

export default function customerReportReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_CUSTOMER_REPORT_FILTERS:
      return {
        ...state,
        appliedCustomerReportFilters: action.values,
      }
    case actions.GET_CUSTOMER_REPORT:
      return {
        ...state,
        loading: true,
        isDownloadDisabled: true,
      }
    case actions.GET_CUSTOMER_REPORT_SUCCESS:
      return {
        ...state,
        customerReport: action.value.tradeSummary,
        reportDownloadData: action.value.tradeSummary,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
        loading: false,
      }
    case actions.GET_CUSTOMER_REPORT_FAILURE:
      return {
        ...state,
        isDownloadDisabled: false,
        loading: false,
      }
    case actions.GET_CUSTOMER_REPORT_BULK_DOWNLOAD:
      return {
        ...state,
        isDownloadDisabled: true,
        loading: true,
      }
    case actions.GET_CUSTOMER_REPORT_BULK_DOWNLOAD_SUCCESS:
      return {
        ...state,
        customerReport: action.value.tradeSummary,
        reportDownloadData: action.value.tradeSummary,
        isDownloadDisabled: false,
        loading: false,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
      }
    case actions.GET_CUSTOMER_REPORT_BULK_DOWNLOAD_FAILURE:
      return {
        ...state,
        isDownloadDisabled: false,
      }
    case actions.HANDLE_CUSTOMER_REPORTS_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    default:
      return state
  }
}
