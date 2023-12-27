import actions from './actions'

const initialState = {
  reportData: [],
  reportTableColumns: [],
  isLoading: false,
  initialData: [],
  initialTableColumn: [],
  initialDownloadData: [],
  customizeValues: {},
  allvendorSummaryReportDownload: [],
  appliedVendorSummarySplitReportFilters: {},
}

export default function vendorSummaryReportReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_VENDOR_SUMMARY_SPLIT_REPORT_FILTER:
      return {
        ...state,
        appliedVendorSummarySplitReportFilters: action.value,
      }
    case actions.UPDATE_VENDOR_SUMMARY_SPLIT_REPORT:
      return {
        ...state,
        reportData: action.value.clientWiseClassified,
        allvendorSummaryReportDownload: action.value.dataForDownload,
      }
    case actions.UPDATE_VENDOR_SUMMARY_SPLIT_REPORT_TABLE_COLUMN:
      return {
        ...state,
        reportTableColumns: action.value,
      }
    case actions.GET_VENDOR_SUMMARY_REPORT:
      return {
        ...state,
        isLoading: true,
      }
    case actions.GET_VENDOR_SUMMARY_REPORT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reportData: action.value.reStructuredData,
        reportTableColumns: action.value.tableColumns,
        customizeValues: action.value.customizeValue,
        initialData: action.value.reStructuredData,
        allvendorSummaryReportDownload: action.value.downloadData,
        initialDownloadData: action.value.downloadData,
        initialTableColumn: action.value.tableColumns,
      }
    case actions.GET_VENDOR_SUMMARY_REPORT_FAILURE:
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
