import actions from './actions'
import newActions from '../newTrade/actions'
import tradeActions from '../trade/actions'

import npNewActions from '../restrictedCurrencies/trade/newTrade/actions'
import npTradeActions from '../restrictedCurrencies/trade/tradeProcess/tradeDetails/actions'
import permissionsActions from '../permissions/actions'
import rolesActions from '../roles/actions'
import usersAction from '../users/action'

import {
  modifyCurrency,
  arrangeInAlphaOrder,
  arrangeCurrenciesAlphaOrder,
  arrangeListByRegisteredName,
  getProductsFromBransds,
} from '../../utilities/transformer'

const initialState = {
  introducers: [],
  merchants: [],
  introducerClients: [],
  merchantClients: [],
  clients: [],
  currencies: [],
  newCurrencies: [],
  countries: [],
  sourceCurrencies: [],
  targetCurrencies: [],
  beneficiaries: [],
  bankAccounts: [],
  clientBeneficiaries: [],
  cryptoBeneficiaries: [],
  beneficiariesBasedOnCurrency: [],
  currentTradeClient: {},
  vendors: [],
  selectedRouteType: '',
  allStreamChannels: [],
  allVendors: [],
  vendorsForRouteEngine: [],
  classifiedVendors: {},
  permissions: [],
  roles: [],
  defaultLandingPage: '/trades',
  vendorCurrencyPairs: [],
  newVendors: [],
  companies: [],
  products: [],
  brands: [],
  entities: [],
  KycStatusPassedClients: [],
}

export default function generalReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPDATE_ROUTE_NAME:
      return {
        ...state,
        vendorsForRouteEngine: [],
        selectedRouteType: action.value,
      }
    case actions.UPDATE_VENDOR_FOR_ROUTE_ENGINE:
      return {
        ...state,
        vendorsForRouteEngine: action.value,
      }
    case actions.GET_INTRODUCERS_SUCCESS:
      return {
        ...state,
        introducers: action.value,
      }
    case actions.GET_MERCHANTS_SUCCESS:
      return {
        ...state,
        merchants: action.value,
      }

    case actions.GET_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: arrangeListByRegisteredName(action.value),
        loading: false,
      }
    case actions.GET_CLIENTS_BY_KYC_STATUS_PASS_SUCCESS:
      return {
        ...state,
        KycStatusPassedClients: arrangeListByRegisteredName(action.value),
        loading: false,
      }
    case actions.GET_INTRODUCERS_CLIENTS_SUCCESS:
      return {
        ...state,
        introducerClients: action.value,
      }
    case actions.GET_MERCHANTS_CLIENTS_SUCCESS:
      return {
        ...state,
        merchantClients: action.value,
      }
    case actions.GET_CURRENCIES_SUCCESS:
      return {
        ...state,
        newCurrencies: arrangeCurrenciesAlphaOrder(action.value),
        currencies: modifyCurrency(action.value),
      }
    case actions.GET_COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: arrangeInAlphaOrder(action.value),
      }
    case actions.UPDATE_CURRENCIES:
      return {
        ...state,
        newCurrencies: action.value,
      }
    case actions.GET_CURRENCIES_BY_ACCOUNT_ID_SUCCESS:
      return {
        ...state,
        sourceCurrencies: action.value.sourceCurrency,
        targetCurrencies: action.value.destinationCurrency,
      }
    case newActions.GET_BENEFICIARY_BY_CLIENT_ID_SUCCESS:
      return {
        ...state,
        clientBeneficiaries: action.value,
      }
    case npNewActions.NP_GET_BENEFICIARY_BY_CLIENT_ID_SUCCESS:
      return {
        ...state,
        clientBeneficiaries: action.value,
      }
    case actions.GET_ALL_BENEFICIARIES_SUCCESS:
      return {
        ...state,
        beneficiaries: action.value,
      }
    case tradeActions.GET_TRADE_DETAILS_BY_ID_SUCCESS: {
      const filteredBene = state.beneficiaries.filter(el => el.client === action.value.clientId)
      const filteredClient = state.clients.find(el => el.id === action.value.clientId)
      const filteredIntroducer = state.introducers.find(el => el.id === action.value.clientId)
      return {
        ...state,
        clientBeneficiaries: filteredBene,
        currentTradeClient: filteredClient || filteredIntroducer,
      }
    }
    case npTradeActions.NP_GET_TRADE_DETAILS_BY_ID_SUCCESS: {
      const filteredBene = state.beneficiaries.filter(el => el.client === action.value.clientId)
      const filteredClient = state.clients.find(el => el.id === action.value.clientId)
      return {
        ...state,
        clientBeneficiaries: filteredBene,
        currentTradeClient: filteredClient,
      }
    }
    case actions.GET_BANK_ACCOUNTS:
      return {
        ...state,
      }
    case actions.GET_BANK_ACCOUNTS_FAILURE:
      return {
        ...state,
      }
    case actions.GET_VENDORS:
      return {
        ...state,
      }
    case actions.GET_VENDORS_SUCCESS:
      return {
        ...state,
        classifiedVendors: action.value.classifiedVendors,
        vendors: action.value.vendors,
        allVendors: action.value.vendors,
        vendorsForRouteEngine: action.value.vendors,
      }
    case actions.GET_VENDORS_FAILURE:
      return {
        ...state,
      }
    case actions.UPDATE_BENEFICIARIES_BASED_ON_CURRENCY:
      return {
        ...state,
        beneficiariesBasedOnCurrency: action.value,
      }
    case actions.GET_ALL_STREAM_CHANNELS:
      return {
        ...state,
      }
    case actions.GET_ALL_STREAM_CHANNELS_SUCCESS:
      return {
        ...state,
        allStreamChannels: action.value,
      }
    case actions.GET_ALL_STREAM_CHANNELS_FAILURE:
      return {
        ...state,
      }
    case actions.GET_ALL_CRYPTO_BENEFICIARIES_SUCCESS:
      return {
        ...state,
        cryptoBeneficiaries: action.value,
      }
    case actions.GET_ALL_CRYPTO_BENEFICIARIES_FAILURE:
      return {
        ...state,
      }
    case newActions.GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_SUCCESS:
      return {
        ...state,
        clientBeneficiaries: action.value.beneficiaries,
      }
    case npNewActions.NP_GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_SUCCESS:
      return {
        ...state,
        clientBeneficiaries: action.value.beneficiaries,
      }
    case permissionsActions.GET_PERMISSIONS_SUCCESS:
      return {
        ...state,
        permissions: action.value,
      }
    case rolesActions.GET_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.value,
      }
    case usersAction.GET_ALL_USERS_LIST_SUCCESS:
      return {
        ...state,
        users: action.value,
      }
    case actions.GET_CURRENCY_PAIRS_SUCCESS:
      return {
        ...state,
        vendorCurrencyPairs: action.value,
      }

    case actions.GET_NEW_VENDORS_LIST_SUCCESS:
      return {
        ...state,
        newVendors: action.value,
      }

    case actions.GET_COMPANIES_LIST_SUCCESS:
      return {
        ...state,
        companies: action.value,
      }

    case actions.GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.value,
      }

    case actions.GET_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.value.brands,
        products: getProductsFromBransds(action.value.brands),
      }

    case actions.GET_ALL_ENTITIES_SUCCESS:
      return {
        ...state,
        entities: arrangeListByRegisteredName(action.value),
        loading: false,
      }

    default:
      return state
  }
}
