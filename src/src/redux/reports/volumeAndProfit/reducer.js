import actions from './actions'

const initialState = {
  totalVolumeAndProfit: [],
  loading: false,
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  isDownloadDisabled: false,
  allVolumeAndProfitReportDownload: [],
  appliedVolumeAndProfitReportFilters: {},
  reportDownloadData: [],
  reportDownloadColumnHeaders: [],
}

export default function volumeAndProfitReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_VOLUME_AND_PROFIT_REPORT_FILTERS:
      return {
        ...state,
        appliedVolumeAndProfitReportFilters: action.value,
      }
    case actions.GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD:
      return {
        ...state,
        isDownloadDisabled: true,
        loading: true,
      }
    case actions.GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        totalVolumeAndProfit: action.value.tradeSummary,
        reportDownloadData: action.value.forExcel.newData,
        reportDownloadColumnHeaders: action.value.forExcel.excelCol,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          current: state.pagination.current,
          total: action.value.total,
        },
      }
    case actions.GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD_FAILURE:
      return {
        ...state,
        loading: false,
        isDownloadDisabled: false,
      }
    case actions.GET_VOLUMEANDPROFIT:
      return {
        ...state,
        loading: true,
        isDownloadDisabled: true,
      }
    case actions.GET_VOLUMEANDPROFIT_SUCCESS:
      return {
        ...state,
        totalVolumeAndProfit: action.value.tradeSummary,
        reportDownloadData: action.value.forExcel.newData,
        reportDownloadColumnHeaders: action.value.forExcel.excelCol,
        loading: false,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          current: state.pagination.current,
          total: action.value.total,
        },
      }

    case actions.GET_VOLUMEANDPROFIT_FAILURE:
      return {
        ...state,
        totalVolumeAndProfit: [],
        loading: false,
        isDownloadDisabled: false,
      }
    case actions.HANDLE_VOLUMEANDPROFIT_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    default:
      return state
  }
}
