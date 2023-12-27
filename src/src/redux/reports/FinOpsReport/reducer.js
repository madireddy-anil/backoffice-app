import actions from './actions'

const initialState = {
  reportData: [],
  excelData: [],
  excelColumnHeaders: [],
  loading: false,
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  isDownloadDisabled: false,
  appliedFinOpsReportFilters: {},
  reportDownloadData: [],
  reportDownloadColumnHeaders: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_FIN_OPS_REPORT_FILTERS:
      return {
        ...state,
        appliedFinOpsReportFilters: action.value,
      }
    case actions.HANDLE_FIN_OPS_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    case actions.GET_FIN_OPS_REPORT:
      return {
        ...state,
        loading: true,
        isDownloadDisabled: true,
      }
    case actions.GET_FIN_OPS_REPORT_SUCCESS:
      return {
        ...state,
        reportData: action.value.newResponse,
        reportDownloadData: action.value.ForExcel.downloadData,
        reportDownloadColumnHeaders: action.value.ForExcel.downloadColumn,
        loading: false,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
      }
    case actions.GET_FIN_OPS_REPORT_FAILURE:
      return {
        ...state,
        loading: false,
        isDownloadDisabled: false,
      }
    case actions.GET_FIN_OPS_REPORT_BULK_DOWNLOAD:
      return {
        ...state,
        loading: true,
        isDownloadDisabled: true,
      }
    case actions.GET_FIN_OPS_REPORT_BULK_DOWNLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        reportData: action.value.newResponse,
        reportDownloadData: action.value.ForExcel.downloadData,
        reportDownloadColumnHeaders: action.value.ForExcel.downloadColumn,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
      }
    case actions.GET_FIN_OPS_REPORT_BULK_DOWNLOAD_FAILURE:
      return {
        ...state,
        loading: false,
        isDownloadDisabled: false,
      }
    default:
      return state
  }
}
