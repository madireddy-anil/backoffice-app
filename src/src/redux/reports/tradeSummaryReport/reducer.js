import actions from './actions'
import customizeValueActions from '../customizeValue/actions'

const initialState = {
  data: [],
  isLoading: false,
  tableColumns: [],
  allTradeSummaryReportDownload: [],
  downloadColumnHeaders: [],
  reportData: [],
  reportTableColumn: [],
  customizeValue: {},
  // pagination: {
  //   pageSize: 10,
  //   current: 1,
  //   total: 0,
  // },
  appliedTradeSummaryReportFilters: {},
}

export default function tradeSummaryReport(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_TRADE_SUMMARY_REPORT_FILTER:
      return {
        ...state,
        appliedTradeSummaryReportFilters: action.value,
      }
    case customizeValueActions.UPDATE_CUSTOMIZE_VALUE:
      return {
        ...state,
        customizeValue: action.value,
      }
    case actions.HANDLE_TRADE_SUMMARY_REPORT_DATA:
      return {
        ...state,
        isLoading: true,
      }
    case actions.UPDATE_TRADE_SUMMARY_REPORT_DATA:
      return {
        ...state,
        data: action.value.clientWiseClassified,
        allTradeSummaryReportDownload: action.value.dataForDownload,
      }
    case actions.UPDATE_TRADE_SUMMARY_REPORT_COLUMN:
      return {
        ...state,
        tableColumns: action.value,
        downloadColumnHeaders: action.value.map(item => item.title),
      }
    case actions.HANDLE_TRADE_SUMMARY_REPORT_DATA_SUCCESS:
      return {
        ...state,
        data: action.value.response,
        tableColumns: action.value.tableColumns,
        downloadColumnHeaders: action.value.downloadColumnHeaders,
        allTradeSummaryReportDownload: action.value.reportDownload,
        isLoading: false,
        reportData: action.value.response,
        reportTableColumn: action.value.tableColumns,
        customizeValue: action.value.customizeValue,
        // pagination: {
        //   ...state.pagination,
        //   current: state.pagination.current,
        //   total: action.value.total,
        // },
      }
    case actions.HANDLE_TRADE_SUMMARY_REPORT_DATA_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    // case actions.HANDLE_TRADE_SUMMARY_REPORT_PAGINATION:
    //   return {
    //     ...state,
    //     pagination: action.value,
    //   }
    default:
      return state
  }
}
