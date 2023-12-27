import { transformErrorData } from 'utilities/transformer'
import actions from './actions'

const initialState = {
  loading: false,
  errorList: [],
}

export default function caBalanceAdjustments(state = initialState, action) {
  switch (action.type) {
    case actions.INITIATE_MANUAL_CREDIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_MANUAL_CREDIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_MANUAL_CREDIT_FAILURE:
      return {
        ...state,
        loading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }
    case actions.INITIATE_MANUAL_DEBIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_MANUAL_DEBIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_MANUAL_DEBIT_FAILURE:
      return {
        ...state,
        loading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    // Vendor Balance Adjustments(remove)

    case actions.INITIATE_VENDOR_MANUAL_CREDIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_VENDOR_MANUAL_CREDIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_MANUAL_CREDIT_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_MANUAL_DEBIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_VENDOR_MANUAL_DEBIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_MANUAL_DEBIT_FAILURE:
      return {
        ...state,
        loading: false,
      }
    // P and L
    case actions.INITIATE_PL_MANUAL_CREDIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_PL_MANUAL_CREDIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_PL_MANUAL_CREDIT_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_PL_MANUAL_DEBIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_PL_MANUAL_DEBIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_PL_MANUAL_DEBIT_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_CRYPTO_PAYMENT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_CRYPTO_PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_CRYPTO_PAYMENT_FAILURE:
      return {
        ...state,
        loading: false,
      }

    // vendor Client
    case actions.INITIATE_VENDOR_CLIENT_MANUAL_CREDIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_VENDOR_CLIENT_MANUAL_CREDIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_CLIENT_MANUAL_CREDIT_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_CLIENT_MANUAL_DEBIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_VENDOR_CLIENT_MANUAL_DEBIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_CLIENT_MANUAL_DEBIT_FAILURE:
      return {
        ...state,
        loading: false,
      }
    // vendor PL
    case actions.INITIATE_VENDOR_PL_MANUAL_CREDIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_VENDOR_PL_MANUAL_CREDIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_PL_MANUAL_CREDIT_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_PL_MANUAL_DEBIT:
      return {
        ...state,
        loading: true,
      }
    case actions.INITIATE_VENDOR_PL_MANUAL_DEBIT_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.INITIATE_VENDOR_PL_MANUAL_DEBIT_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.UPDATE_ADJUSTMENT_ERROR_LIST:
      return {
        ...state,
        errorList: action.value,
      }
    default:
      return state
  }
}
