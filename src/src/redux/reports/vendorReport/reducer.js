import actions from './actions'

const initialState = {
  vendorReport: [],
  loading: false,
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  isDownloadDisabled: false,
  allVendorReportDownload: [],
  appliedVendorReportFilters: {},
  reportDownloadData: [],
}

export default function vendorReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_VENDOR_REPORT_FILTER:
      return {
        ...state,
        appliedVendorReportFilters: action.value,
      }
    case actions.GET_VENDOR_REPORT:
      return {
        ...state,
        loading: true,
        isDownloadDisabled: true,
      }
    case actions.GET_VENDOR_REPORT_SUCCESS:
      return {
        ...state,
        vendorReport: action.value.vendorSummaryReport,
        reportDownloadData: action.value.vendorSummaryReport,
        loading: false,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          current: state.pagination.current,
          total: action.value.total,
        },
      }
    case actions.GET_VENDOR_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        isDownloadDisabled: false,
      }
    case actions.GET_VENDOR_REPORT_BULK_DOWNLOAD:
      return {
        ...state,
        isDownloadDisabled: true,
        loading: true,
      }
    case actions.GET_VENDOR_REPORT_BULK_DOWNLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        vendorReport: action.value.vendorSummaryReport,
        reportDownloadData: action.value.vendorSummaryReport,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          current: state.pagination.current,
          total: action.value.total,
        },
      }
    case actions.GET_VENDOR_REPORT_BULK_DOWNLOAD_FAILURE:
      return {
        ...state,
        loading: false,
        isDownloadDisabled: false,
      }
    case actions.HANDLE_VENDOR_REPORT_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    default:
      return state
  }
}
