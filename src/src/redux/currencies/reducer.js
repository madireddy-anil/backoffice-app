import { modifyCurrencyTableData, modifyCountryTableData } from 'utilities/transformer'

import actions from './actions'
import genralActions from '../general/actions'

const initialState = {
  updateCurrency: true,
  updateCountry: true,
  loading: false,
  currencies: [],
  countries: [],
  selectedCurrency: {},
  selectedCountry: {},
}

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    // currency config

    case genralActions.GET_CURRENCIES:
      return {
        ...state,
        loading: true,
      }
    case genralActions.GET_CURRENCIES_SUCCESS: {
      const returnResp = modifyCurrencyTableData(action.value)
      return {
        ...state,
        loading: false,
        currencies: returnResp,
      }
    }
    case genralActions.GET_CURRENCIES_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.UPDATE_CURRENCIES:
      return {
        ...state,
        currencies: action.value,
      }
    case actions.UPDATE_SELECTED_CURRENCY:
      return {
        ...state,
        selectedCurrency: action.value,
      }
    case actions.EDIT_SELECTED_CURRENCY:
      return {
        ...state,
        loading: true,
      }
    case actions.EDIT_SELECTED_CURRENCY_SUCCESS:
      return {
        ...state,
        updateCurrency: !state.updateCurrency,
        loading: false,
      }
    case actions.EDIT_SELECTED_CURRENCY_FAILURE:
      return {
        ...state,
        loading: false,
      }

    // country config

    case genralActions.GET_COUNTRIES:
      return {
        ...state,
        loading: true,
      }
    case genralActions.GET_COUNTRIES_SUCCESS: {
      const returnResp = modifyCountryTableData(action.value)
      return {
        ...state,
        loading: false,
        countries: returnResp,
      }
    }
    case genralActions.GET_COUNTRIES_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.UPDATE_COUNTRIES:
      return {
        ...state,
        countries: action.value,
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
    default:
      return state
  }
}
