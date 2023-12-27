import gactions from 'redux/general/actions'
import actions from './actions'

const initialState = {
  allBankAccounts: [],
  bankAccountLoading: false,
  isBankAccountUpdated: false,
  isBankAccountFetched: false,
  requiredFieldsMesg: [],
  formatedBankAccount: [],
  bankAccountDetail: {},
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  appliedBankAccountFilters: {},
}

export default function bankAccountReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_BANK_ACCOUNTS_FILTERS:
      return {
        ...state,
        appliedBankAccountFilters: action.value,
      }
    case actions.HANDLE_BANK_ACCOUNTS_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    case actions.GET_BANK_ACCOUNTS:
      return {
        ...state,
        bankAccountLoading: true,
      }
    case actions.GET_BANK_ACCOUNTS_SUCCESS:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
        requiredFieldsMesg: [],
        bankAccountLoading: false,
        allBankAccounts: action.value.bankAccount,
      }
    case actions.GET_BANK_ACCOUNTS_FAILURE:
      return {
        ...state,
        bankAccountLoading: false,
      }
    case actions.GET_FORMATED_BANK_ACCOUNTS:
      return {
        ...state,
        formatedBankAccount: action.value,
      }
    case actions.GET_BANK_ACCOUNT_BY_ID:
      return {
        ...state,
        bankAccountLoading: true,
        isBankAccountFetched: false,
      }
    case actions.GET_BANK_ACCOUNT_BY_ID_SUCCESS:
      return {
        ...state,
        bankAccountLoading: false,
        isBankAccountFetched: true,
        bankAccountDetail: action.value,
      }
    case actions.GET_BANK_ACCOUNT_BY_ID_FAILURE:
      return {
        ...state,
        bankAccountLoading: false,
        isBankAccountFetched: false,
      }
    case actions.DELETE_BANK_ACCOUNT:
      return {
        ...state,
        bankAccountLoading: true,
      }
    case actions.DELETE_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        bankAccountLoading: false,
        selectedVendor: '',
        bankAccountDetail: {},
        bankAccounts: {},
      }
    case actions.DELETE_BANK_ACCOUNT_FAILURE:
      return {
        ...state,
        bankAccountLoading: false,
      }
    case actions.CREATE_BANK_ACCOUNT:
      return {
        ...state,
        bankAccountLoading: true,
      }
    case actions.CREATE_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        bankAccountLoading: false,
      }
    case actions.CREATE_BANK_ACCOUNT_FAILURE:
      return {
        ...state,
        bankAccountLoading: false,
      }
    case actions.UPDATE_BANK_ACCOUNT:
      return {
        ...state,
        isBankAccountUpdated: false,
        bankAccountLoading: true,
      }
    case actions.UPDATE_BANK_ACCOUNT_SUCCESS:
      return {
        ...state,
        isBankAccountUpdated: true,
        bankAccountLoading: false,
      }
    case actions.UPDATE_BANK_ACCOUNT_FAILURE:
      return {
        ...state,
        bankAccountLoading: false,
      }
    case gactions.GET_BANK_ACCOUNTS_SUCCESS:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
        allBankAccounts: action.value.bankAccount,
      }
    case actions.UPDATE_REQUIRED_FIELDS:
      return {
        ...state,
        requiredFieldsMesg: action.value,
      }
    default:
      return state
  }
}
