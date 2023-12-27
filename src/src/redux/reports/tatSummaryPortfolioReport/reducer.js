import actions from './actions'

const initialState = {
  allTatPortfolioReport: [],
  loading: false,
  isDownloadDisabled: false,
  allTatPortfolioReportDownload: [],
  appliedTatPortfolioReportFilters: {},
  downloadColumnHeaders: [],
  reportTableColumn: [],
  reportColumnHeaders: [],
  customizeValue: {},
}

export default function tatPortfolioReportReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_TAT_PORTFOLIO_REPORT_FILTER:
      return {
        ...state,
        appliedTatPortfolioReportFilters: action.value,
      }
    case actions.GET_TAT_PORTFOLIO_REPORT:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_TAT_PORTFOLIO_REPORT_SUCCESS:
      return {
        ...state,
        allTatPortfolioReport: action.value.tatReport,
        allTatPortfolioReportDownload: action.value.tatReport,
        reportTableColumn: action.value.tableColumns,
        reportColumnHeaders: action.value.tableColumns,
        reportData: action.value.tatReport,
        downloadColumnHeaders: action.value.tableColumns,
        customizeValue: action.value.customizeValue,
        loading: false,
      }
    case actions.GET_TAT_PORTFOLIO_REPORT_FAILURE:
      return {
        ...state,
        allTatPortfolioReport: [],
        loading: false,
      }
    case actions.UPDATE_TAT_PORTFOLIO_SUMMARY_REPORT_TABLE_COLUMN:
      return {
        ...state,
        reportTableColumn: action.value,
        downloadColumnHeaders: action.value.map(item => item.title),
      }
    case actions.UPDATE_TAT_PORTFOLIO_SUMMARY_REPORT:
      return {
        ...state,
        allTatPortfolioReport: action.value.clientWiseClassified,
        allTatPortfolioReportDownload: action.value.dataForDownload,
      }
    default:
      return state
  }
}
