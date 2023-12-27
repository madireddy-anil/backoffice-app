import actions from './actions'

const initialState = {
  marginReport: [],
  loading: false,
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  isDownloadDisabled: false,
  appliedMarginReportFilters: {},
  reportDownloadData: [],
}

export default function marginReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_MARGIN_REPORT_FILTERS:
      return {
        ...state,
        appliedMarginReportFilters: action.value,
      }
    case actions.GET_MARGIN_REPORT:
      return {
        ...state,
        loading: true,
        isDownloadDisabled: true,
      }
    case actions.GET_MARGIN_REPORT_SUCCESS:
      return {
        ...state,
        marginReport: action.value.marginReport,
        reportDownloadData: action.value.marginReport,
        loading: false,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          current: state.pagination.current,
          total: action.value.total,
        },
      }
    case actions.GET_MARGIN_REPORT_FAILURE:
      return {
        ...state,
        marginReport: [],
        loading: false,
        isDownloadDisabled: false,
      }
    case actions.GET_MARGIN_REPORT_BULK_DOWNLOAD:
      return {
        ...state,
        isDownloadDisabled: true,
        loading: true,
      }
    case actions.GET_MARGIN_REPORT_BULK_DOWNLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        marginReport: action.value.marginReport,
        reportDownloadData: action.value.marginReport,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          current: state.pagination.current,
          total: action.value.total,
        },
      }
    case actions.GET_MARGIN_REPORT_BULK_DOWNLOAD_FAILURE:
      return {
        ...state,
        loading: false,
        isDownloadDisabled: false,
      }
    case actions.HANDLE_MARGIN_REPORT_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    default:
      return state
  }
}
