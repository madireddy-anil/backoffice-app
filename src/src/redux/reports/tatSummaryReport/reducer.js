import actions from './actions'

const initialState = {
  allTatReport: [],
  loading: false,
  isDownloadDisabled: false,
  downloadColumnHeaders: [],
  allTatReportDownload: [],
  reportTableColumn: [],
  reportColumnHeaders: [],
  appliedTatReportFilters: {},
  customizeValue: {},
}

export default function tatReportReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_TAT_REPORT_FILTER:
      return {
        ...state,
        appliedTatReportFilters: action.value,
      }
    case actions.GET_TAT_REPORT:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_TAT_REPORT_SUCCESS:
      return {
        ...state,
        allTatReport: action.value.tatReport,
        allTatReportDownload: action.value.tatReport,
        reportTableColumn: action.value.tableColumns,
        reportColumnHeaders: action.value.tableColumns,
        reportData: action.value.tatReport,
        customizeValue: action.value.customizeValue,
        loading: false,
      }
    case actions.GET_TAT_REPORT_FAILURE:
      return {
        ...state,
        allTatReport: [],
        loading: false,
      }
    case actions.UPDATE_TAT_SUMMARY_REPORT_TABLE_COLUMN:
      return {
        ...state,
        reportTableColumn: action.value,
        downloadColumnHeaders: action.value.map(item => item.title),
      }
    case actions.UPDATE_TAT_SUMMARY_REPORT:
      return {
        ...state,
        allTatReport: action.value.clientWiseClassified,
        allTatReportDownload: action.value.dataForDownload,
      }
    default:
      return state
  }
}
