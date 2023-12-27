import actions from './actions'
import generalAction from '../general/actions'
import {
  // transformCASummary,
  transformBalTxn,
  transformCryptoBalTxn,
} from '../../utilities/transformer'

const initialState = {
  paymentType: '',
  selectedAccountDetails: {},
  selectedAccountBalSummary: [],
  summaryLoading: '',
  totalBalTxns: 0,
  balTxnLoading: false,
  clients: [],
  selectedTransactionDetail: {},
  loading: false,
  txnSummaryLoading: false,
  selectedTransactionRecordId: {},
  selectedTransactionSummaries: [],
}

export default function caTransactions(state = initialState, action) {
  // const { clients } = state
  switch (action.type) {
    case actions.GET_TRANSACTION_SUMMARY_DETAILS:
      return {
        ...state,
        txnSummaryLoading: true,
      }
    case actions.GET_TRANSACTION_SUMMARY_DETAILS_SUCCESS:
      return {
        ...state,
        selectedTransactionSummaries: action.value,
        txnSummaryLoading: false,
      }
    case actions.GET_TRANSACTION_SUMMARY_DETAILS_FAILURE:
      return {
        ...state,
        txnSummaryLoading: false,
        selectedTransactionSummaries: [],
      }
    case actions.UPDATE_SELECTED_TRANSACTION_RECORD_ID:
      return {
        ...state,
        selectedTransactionRecordId: action.value,
      }
    case generalAction.GET_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: action.value,
      }
    case actions.UPDATE_SELECED_PAYMENT_TYPE:
      return {
        ...state,
        paymentType: action.value,
      }

    case actions.GET_ACCOUNT_DETAILS_BY_ID:
      return {
        ...state,
        summaryLoading: true,
        selectedAccountDetails: {},
      }
    case actions.GET_ACCOUNT_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        selectedAccountDetails: action.value,
        summaryLoading: false,
      }
    case actions.GET_ACCOUNT_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        summaryLoading: false,
      }
    case actions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID:
      return {
        ...state,
        balTxnLoading: true,
      }
    case actions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID_SUCCESS:
      return {
        ...state,
        selectedAccountBalSummary: transformBalTxn(action.value.transactions),
        totalBalTxns: action.value.total,
        balTxnLoading: false,
      }
    case actions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID_FAILURE:
      return {
        ...state,
        balTxnLoading: false,
        selectedAccountBalSummary: [],
      }
    case actions.GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID:
      return {
        ...state,
        balTxnLoading: true,
      }
    case actions.GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID_SUCCESS:
      return {
        ...state,
        selectedAccountBalSummary: transformCryptoBalTxn(action.value.transactions),
        totalBalTxns: action.value.total,
        balTxnLoading: false,
      }
    case actions.GET_CRYPTO_BALANCE_TRANSACTIONS_BY_ID_FAILURE:
      return {
        ...state,
        balTxnLoading: false,
        selectedAccountBalSummary: [],
      }

    case actions.GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE:
      return {
        ...state,
        loading: true,
      }

    case actions.GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedTransactionDetail: action.value[0],
        loading: false,
      }
    case actions.GET_PAYMENT_TRANSACTION_DETAILS_BY_REFERENCE_FAILURE:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}
