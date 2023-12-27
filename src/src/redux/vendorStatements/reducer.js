import { transformDataToDownload, transformExcelErrorData } from 'utilities/transformer'
import actions from './action'

const initialState = {
  vendorBalanceStatements: [],
  vendorStatementsFileList: [],
  listLoading: false,

  totalPages: 10,
  downloading: false,
  errorList: [],

  uploading: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPLOAD_VENDOR_BALANCE_STATEMENTS:
      return {
        ...state,
        uploading: true,
      }
    case actions.UPLOAD_VENDOR_BALANCE_STATEMENTS_SUCCESS:
      return {
        ...state,
        uploading: false,
        vendorBalanceStatements: action.value,
      }

    case actions.UPLOAD_VENDOR_BALANCE_STATEMENTS_FAILURE:
      return {
        ...state,
        uploading: false,
        errorList: transformExcelErrorData(action.payload),
      }

    case actions.UPLOAD_VENDOR_TRANSACTIONS_STATEMENTS:
      return {
        ...state,
        uploading: true,
      }
    case actions.UPLOAD_VENDOR_TRANSACTIONS_STATEMENTS_SUCCESS:
      return {
        ...state,
        uploading: false,
        vendorBalanceStatements: action.value,
      }

    case actions.UPLOAD_VENDOR_TRANSACTIONS_STATEMENTS_FAILURE:
      return {
        ...state,
        uploading: false,
        errorList: transformExcelErrorData(action.payload),
      }

    case actions.GET_ALL_VENDOR_STATEMENTS_SUCCESS:
      return {
        ...state,
        vendorStatementsFileList: action.value,
        totalPages: action.total,
        listLoading: false,
      }

    case actions.GET_ALL_VENDOR_STATEMENTS:
      return {
        ...state,
        listLoading: true,
      }

    case actions.GET_ALL_VENDOR_STATEMENTS_FAILURE:
      return {
        ...state,
        vendorStatementsFileList: [],
        listLoading: false,
      }

    case actions.GET_VENDOR_STATEMENTS_BY_FILENAME:
      return {
        ...state,
        downloading: true,
      }

    case actions.GET_VENDOR_STATEMENTS_BY_FILENAME_SUCCESS:
      return {
        ...state,
        downloading: false,
        downloadFileData: transformDataToDownload(action.value),
      }

    case actions.GET_VENDOR_STATEMENTS_BY_FILENAME_FAILURE:
      return {
        ...state,
        downloading: false,
      }

    case actions.UPDATE_ERROR_LIST_DATA:
      return {
        ...state,
        errorList: action.value,
      }
    default:
      return state
  }
}
