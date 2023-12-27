import actions from './actions'
import customizeValueActions from '../customizeValue/actions'

const initialState = {
  reportColumnHeaders: [],
  reportData: [],
  customerSummaryReport: [],
  allCustomerSummaryReportDownload: [],
  tableColumns: [],
  loading: false,
  isDownloadDisabled: false,
  customizeColumnData: {},
  appliedCustomerSummaryReportFilters: {},
}

export default function CustomerSummaryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_CUSTOMER_SUMMARY_REPORT_FILTERS:
      return {
        ...state,
        appliedCustomerSummaryReportFilters: action.value,
      }
    case customizeValueActions.UPDATE_CUSTOMIZE_VALUE:
      return {
        ...state,
        customizeColumnData: action.value,
      }
    case actions.UPDATE_CUSTOMER_SUMMARY_REPORT_TABLE_COLUMN:
      return {
        ...state,
        tableColumns: action.value,
      }
    case actions.UPDATE_CUSTOMER_SUMMARY_REPORT:
      return {
        ...state,
        customerSummaryReport: action.value.clientWiseClassified,
        allCustomerSummaryReportDownload: action.value.dataForDownload,
      }
    case actions.GET_CUSTOMER_SUMMARY_REPORT:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_CUSTOMER_SUMMARY_REPORT_SUCCESS:
      return {
        ...state,
        customerSummaryReport: action.value.response,
        tableColumns: action.value.tableColumns,
        allCustomerSummaryReportDownload: action.value.reportDownload,
        customizeColumnData: action.value.customizeValue,
        reportData: action.value.response,
        reportColumnHeaders: action.value.tableColumns,
        loading: false,
      }
    case actions.GET_CUSTOMER_SUMMARY_REPORT_FAILURE:
      return {
        ...state,
        CustomerSummaryReport: [],
        loading: false,
      }
    default:
      return state
  }
}
