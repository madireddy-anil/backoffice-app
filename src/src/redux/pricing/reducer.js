import actions from './action'
import generalAction from '../general/actions'
import {
  transformPricingData,
  addIndexingElement,
  addIndexToTieringList,
} from '../../utilities/transformer'

const initialState = {
  pricingProfiles: [],
  allPricingListLoading: false,
  errorList: [],

  loading: false,

  isNewPricingProfile: true,

  payment: {
    direction: undefined,
    priority: undefined,
    type: undefined,
    transactionCurrency: undefined,
    tiering: [],
  },
  paymentsListView: false,
  paymentsEditView: false,
  paymentsTieringAddView: false,
  selectedPaymentTieringMethod: undefined,
  isPaymentTier: false,

  trades: {
    buyCurrency: undefined,
    sellCurrency: undefined,
    tiering: [],
  },

  tradesListView: false,
  tradeEditView: false,
  tradesTieringAddView: false,
  selectedTradeTieringMethod: undefined,
  isTradeTier: false,

  selectedPricingProfile: {},
}

export default function currencyReducer(state = initialState, action) {
  const { clients } = state
  switch (action.type) {
    case generalAction.GET_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: action.value,
      }

    case actions.GET_ALL_PRICING_PROFILES:
      return {
        ...state,
        allPricingListLoading: true,
      }
    case actions.GET_ALL_PRICING_PROFILES_FAILURE:
      return {
        ...state,
        allPricingListLoading: false,
      }
    case actions.GET_ALL_PRICING_PROFILES_SUCCESS:
      return {
        ...state,
        allPricingListLoading: false,
        pricingProfiles: transformPricingData(clients, action.value),
      }

    case actions.ADD_NEW_PRICING_PROFILE: {
      return {
        ...state,
        loading: true,
      }
    }
    case actions.ADD_NEW_PRICING_PROFILE_SUCCESS:
      return {
        ...state,
        errorList: [],
        loading: false,
      }
    case actions.ADD_NEW_PRICING_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
        // errorList: transformErrorData(action.payload['invalid-params']),
      }
    case actions.UPDATE_ERROR_LIST:
      return {
        ...state,
        errorList: [],
      }
    case actions.UPDATE_PAYMENT_LIST:
      return {
        ...state,
        // payments: action.value,
        payment: {
          ...state.payment,
          tiering: addIndexingElement(action.value),
        },
        // selectedPricingProfile : {
        //   ...state.selectedPricingProfile,
        //   payment :{
        //     ...state.payment,
        //     tiering: addIndexingElement(action.value),
        //   }

        // }
      }
    case actions.UPDATE_PAYMENT_LIST_VIEW:
      return {
        ...state,
        paymentsListView: action.value,
      }
    case actions.UPDATE_PAYMENT_ADD_VIEW:
      return {
        ...state,
        paymentsTieringAddView: action.value,
      }
    case actions.UPDATE_PAYMENT_PRICING_DATA:
      return {
        ...state,
        payment: {
          ...state.payment,
          ...action.value,
        },
      }
    case actions.UPDATE_PAYMENT_EDIT_VIEW:
      return {
        ...state,
        paymentsEditView: action.value,
      }
    case actions.UPDATE_TRADE_LIST:
      return {
        ...state,
        // tradesPricingList: action.value,
        trades: {
          ...state.trades,
          tiering: addIndexingElement(action.value),
        },
      }
    case actions.UPDATE_TRADE_LIST_VIEW:
      return {
        ...state,
        tradesListView: action.value,
      }
    case actions.UPDATE_TRADE_ADD_VIEW:
      return {
        ...state,
        tradesTieringAddView: action.value,
      }
    case actions.UPDATE_TRADE_EDIT_VIEW:
      return {
        ...state,
        tradeEditView: action.value,
      }

    case actions.SET_TO_INITIAL_VALUES:
      return {
        ...state,
        ...initialState,
      }
    case actions.GET_PRICING_PROFILE_BY_ID:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_PRICING_PROFILE_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.GET_PRICING_PROFILE_BY_ID_SUCCESS: {
      const modifiedData = addIndexToTieringList(action.value)
      return {
        ...state,
        loading: false,
        // selectedPricingProfile: test(action.value),

        selectedPricingProfile: modifiedData,
        payment: modifiedData.payments,
        trades: modifiedData.trades,
      }
    }

    case actions.UPDATE_PAYMENT_TIERING_SELECTED:
      return {
        ...state,
        selectedPaymentTieringMethod: action.value,
      }
    case actions.UPDATE_IS_PAYMENT_TIERING:
      return {
        ...state,
        isPaymentTier: action.value,
      }

    case actions.UPDATE_TRADE_TIERING_SELECTED:
      return {
        ...state,
        selectedTradeTieringMethod: action.value,
      }
    case actions.UPDATE_IS_TRADE_TIERING:
      return {
        ...state,
        isTradeTier: action.value,
      }

    case actions.UPDATE_TRADE_PRICING_DATA:
      return {
        ...state,
        trades: {
          ...state.trades,
          ...action.value,
        },
      }

    case actions.UPDATE_SELECTED_PRICING_PROFILE: {
      return {
        ...state,
        selectedPricingProfile: addIndexToTieringList(action.value),
      }
    }

    case actions.GET_PAYMENT_TIERING_LIST_BY_ID_SUCCESS: {
      return {
        ...state,
        payment: {
          ...state.payment,
          tiering: addIndexingElement(action.value),
        },
      }
    }

    case actions.UPDATE_IS_NEW_PRICING_PROFILE: {
      return {
        ...state,
        isNewPricingProfile: action.value,
      }
    }

    default:
      return state
  }
}
