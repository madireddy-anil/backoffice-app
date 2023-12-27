import genralActions from '../general/actions'
import { transformErrorData } from '../../utilities/transformer'
import actions from './action'

const initialState = {
  updateCurrency: true,
  loading: false,
  vendorCurrencyPairs: [],
  countries: [],
  selectedCurrencyPair: {},
  selectedCountry: {},
  errorList: [],
}

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    // currency config
    case genralActions.GET_CURRENCY_PAIRS:
      return {
        ...state,
        loading: true,
      }
    case genralActions.GET_CURRENCY_PAIRS_SUCCESS: {
      return {
        ...state,
        loading: false,
        vendorCurrencyPairs: action.value,
      }
    }
    case genralActions.GET_CURRENCY_PAIRS_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.UPDATE_CURRENCIES_PAIR:
      return {
        ...state,
        vendorCurrencyPairs: action.value,
      }
    case actions.UPDATE_SELECTED_CURRENCY_PAIR:
      return {
        ...state,
        selectedCurrencyPair: action.value,
      }
    case actions.EDIT_SELECTED_CURRENCY_PAIR:
      return {
        ...state,
        loading: true,
      }
    case actions.EDIT_SELECTED_CURRENCY_PAIR_SUCCESS:
      return {
        ...state,
        updateCurrency: !state.updateCurrency,
        loading: false,
      }
    case actions.EDIT_SELECTED_CURRENCY_PAIR_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.UPDATE_SELECTED_COUNTRY:
      return {
        ...state,
        selectedCountry: action.value,
      }
    case actions.EDIT_SELECTED_COUNTRY:
      return {
        ...state,
        loading: true,
      }
    case actions.EDIT_SELECTED_COUNTRY_SUCCESS:
      return {
        ...state,
        loading: false,
        updateCountry: !state.updateCountry,
      }
    case actions.EDIT_SELECTED_COUNTRY_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.ADD_NEW_CURRENCIES:
      return {
        ...state,
        loading: true,
      }
    case actions.ADD_NEW_CURRENCIES_PAIR: {
      return {
        ...state,
        loading: true,
      }
    }
    case actions.ADD_NEW_CURRENCIES_PAIR_SUCCESS:
      return {
        ...state,
        errorList: [],
        loading: false,
      }
    case actions.ADD_NEW_CURRENCIES_PAIR_FAILURE:
      return {
        ...state,
        loading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.UPDATE_ERROR_LIST:
      return {
        ...state,
        errorList: action.value,
      }
    default:
      return state
  }
}
