import actions from './actions'

const initialState = {
  reportData: [],
  reportTableColumns: [],
  isLoading: false,
  initialData: [],
  initialDownloadData: [],
  initialColumns: [],
  customizeValue: {},
  appliedVendorSummaryPortfolioReport: {},
  allvendorSummaryReportDownload: [],
}

export default function vendorSummaryReportReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_VENDOR_SUMMARY_PORTFOLIO_REPORT_FILTER:
      return {
        ...state,
        appliedVendorSummaryPortfolioReport: action.value,
      }
    case actions.UPDATE_VENDOR_SUMMARY_REPORT:
      return {
        ...state,
        reportData: action.value.clientWiseClassified,
        allvendorSummaryReportDownload: action.value.dataForDownload,
      }
    case actions.UPDATE_VENDOR_SUMMARY_REPORT_TABLE_COLUMN:
      return {
        ...state,
        reportTableColumns: action.value,
      }
    case actions.GET_VENDOR_SUMMARY_PORTFOLIO_REPORT:
      return {
        ...state,
        isLoading: true,
      }
    case actions.GET_VENDOR_SUMMARY_PORTFOLIO_REPORT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reportData: action.value.reStructuredData,
        reportTableColumns: action.value.tableColumns,
        initialData: action.value.reStructuredData,
        allvendorSummaryReportDownload: action.value.downloadData,
        initialDownloadData: action.value.downloadData,
        initialColumns: action.value.tableColumns,
        customizeValue: action.value.customizeValue,
      }
    case actions.GET_VENDOR_SUMMARY_PORTFOLIO_REPORT_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return {
        ...state,
      }
  }
}
