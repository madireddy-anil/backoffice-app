import actions from './action'
import generalAction from '../general/actions'
import { transformPricingData } from '../../utilities/transformer'

const initialState = {
  pricingProfiles: [],
  allPricingListLoading: false,

  selectedPricingProfile: {
    products: [],
  },

  // Payments

  paymentloading: false,
  paymentTieringLoading: false,

  isPaymentDataAddView: true,
  isPaymentDataViewMode: false,
  isPaymentDataEditView: false,

  showTieringOptions: false,

  selectedPaymentTieringMethod: undefined,
  isPaymentTier: false,

  paymentsTieringListView: false,
  paymentsTieringAddView: false,
  paymentsTieringEditView: false,

  selectedPaymentTieringData: {},
  isNewPricing: true,

  // Trades

  showTradeTieringOptions: false,

  tradeLoading: false,
  tradeTieringLoading: false,

  isTradeTier: false,
  selectedTradeTieringMethod: undefined,

  isTradeDataAddView: true,
  isTradeDataEditView: false,
  isTradeDataViewMode: false,

  tradesTieringListView: false,
  tradesTieringAddView: false,
  tradesTieringEditView: false,

  pagination: {},
}

export default function currencyReducer(state = initialState, action) {
  const { clients } = state
  switch (action.type) {
    case generalAction.GET_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: action.value,
      }

    case actions.GET_ALL_PRICING_PROFILES_LIST:
      return {
        ...state,
        allPricingListLoading: true,
        pagination: {
          page: action.values.page,
          pageSize: action.values.pageSize,
        },
      }
    case actions.GET_ALL_PRICING_PROFILES_LIST_FAILURE:
      return {
        ...state,
        allPricingListLoading: false,
      }
    case actions.GET_ALL_PRICING_PROFILES_LIST_SUCCESS:
      return {
        ...state,
        allPricingListLoading: false,
        pricingProfiles: transformPricingData(clients, action.value.pricing),
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
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
      return {
        ...state,
        loading: false,
        selectedPricingProfile: action.value,
      }
    }

    case actions.ADD_NEW_PRICING_PROFILE: {
      return {
        ...state,
        loading: true,
      }
    }
    case actions.ADD_NEW_PRICING_PROFILE_FAILURE: {
      return {
        ...state,
        loading: false,
      }
    }

    case actions.ADD_NEW_PRICING_PROFILE_SUCCESS: {
      return {
        ...state,
        loading: false,
        selectedPricingProfile: action.value,
        showTieringOptions: false,
        isPaymentDataAddView: true,
        isPaymentDataViewMode: false,

        paymentsTieringListView: false,
        paymentsTieringAddView: false,
        paymentsTieringEditView: false,

        isTradeDataAddView: true,
        isTradeDataEditView: false,
        isTradeDataViewMode: false,
      }
    }

    case actions.EDIT_PRICING_PROFILE: {
      return {
        ...state,
        loading: true,
      }
    }

    case actions.EDIT_PRICING_PROFILE_FAILURE: {
      return {
        ...state,
        loading: false,
      }
    }

    case actions.EDIT_PRICING_PROFILE_SUCCESS: {
      return {
        ...state,
        loading: false,
        selectedPricingProfile: action.value,
      }
    }

    case actions.ADD_PAYMENT_PRICING_DATA_BY_ID: {
      return {
        ...state,
        paymentloading: true,
      }
    }

    case actions.ADD_PAYMENT_PRICING_DATA_BY_ID_SUCCESS: {
      return {
        ...state,
        paymentloading: false,
        selectedPricingProfile: action.value,
        isPaymentDataAddView: false,
        isPaymentDataViewMode: true,
        showTieringOptions: true,
      }
    }

    case actions.ADD_PAYMENT_PRICING_DATA_BY_ID_FAILURE: {
      return {
        ...state,
        paymentloading: false,
      }
    }

    case actions.EDIT_PAYMENT_PRICING_DATA_BY_ID: {
      return {
        ...state,
        paymentloading: true,
      }
    }

    case actions.EDIT_PAYMENT_PRICING_DATA_BY_ID_SUCCESS: {
      return {
        ...state,
        paymentloading: false,
        selectedPricingProfile: action.value,
        isPaymentDataAddView: false,
        isPaymentDataViewMode: true,
        isPaymentDataEditView: false,
      }
    }

    case actions.EDIT_PAYMENT_PRICING_DATA_BY_ID_FAILURE: {
      return {
        ...state,
        paymentloading: false,
      }
    }

    case actions.UPDATE_PAYMENT_DATA_ADD_VIEW: {
      return {
        ...state,
        isPaymentDataAddView: action.value,
        isPaymentDataEditView: false,
        isPaymentDataViewMode: false,
      }
    }

    case actions.UPDATE_PAYMENT_DATA_EDIT_VIEW: {
      return {
        ...state,
        isPaymentDataEditView: action.value,
        isPaymentDataViewMode: false,
        isPaymentDataAddView: false,
      }
    }

    case actions.UPDATE_PAYMENT_DATA_VIEW_MODE: {
      return {
        ...state,
        isPaymentDataViewMode: action.value,
        isPaymentDataAddView: false,
        isPaymentDataEditView: false,
      }
    }

    case actions.UPDATE_PAYMENT_TIERING_SELECTED: {
      return {
        ...state,
        selectedPaymentTieringMethod: action.value,
      }
    }

    case actions.UPDATE_IS_PAYMENT_TIERING: {
      return {
        ...state,
        isPaymentTier: action.value,
      }
    }

    case actions.ADD_PAYMENTS_TIERING: {
      return {
        ...state,
        paymentTieringLoading: true,
      }
    }

    case actions.ADD_PAYMENTS_TIERING_SUCCESS: {
      return {
        ...state,
        paymentTieringLoading: false,
        paymentsTieringListView: true,
        selectedPricingProfile: action.value,
        paymentsTieringAddView: false,
        showTieringOptions: false,
      }
    }

    case actions.ADD_PAYMENTS_TIERING_FAILURE: {
      return {
        ...state,
        paymentTieringLoading: false,
      }
    }

    case actions.EDIT_PAYMENT_TIERING_DATA_BY_ID: {
      return {
        ...state,
        paymentTieringLoading: true,
      }
    }

    case actions.EDIT_PAYMENT_TIERING_DATA_BY_ID_SUCCESS: {
      return {
        ...state,
        paymentTieringLoading: false,
        paymentsTieringEditView: false,
      }
    }

    case actions.EDIT_PAYMENT_TIERING_DATA_BY_ID_FAILURE: {
      return {
        ...state,
        paymentTieringLoading: false,
      }
    }

    case actions.DELETE_SELECTED_PAYMENT_TIERING: {
      return {
        ...state,
        paymentTieringLoading: true,
      }
    }

    case actions.DELETE_SELECTED_PAYMENT_TIERING_SUCCESS: {
      return {
        ...state,
        paymentTieringLoading: false,
      }
    }

    case actions.DELETE_SELECTED_PAYMENT_TIERING_FAILURE: {
      return {
        ...state,
        paymentTieringLoading: false,
      }
    }

    case actions.UPDATE_PAYMENT_TIERING_ADD_VIEW: {
      return {
        ...state,
        paymentsTieringAddView: action.value,
      }
    }

    case actions.UPDATE_PAYMENT_TIERING_EDIT_VIEW: {
      return {
        ...state,
        paymentsTieringEditView: action.value,
      }
    }

    case actions.UPDATE_PAYMENT_TIERING_VIEW_MODE: {
      return {
        ...state,
        paymentsTieringListView: action.value,
      }
    }

    case actions.UPDATE_SELECTED_PAYMENT_TIERING: {
      return {
        ...state,
        selectedPaymentTieringData: action.value,
      }
    }

    case actions.UPDATE_IS_NEW_PRICING_PROFILE: {
      return {
        ...state,
        isNewPricing: action.value,
      }
    }

    case actions.SHOW_PAYMNET_TIERING_OPTIONS: {
      return {
        ...state,
        showTieringOptions: action.value,
      }
    }

    // Trades

    case actions.UPDATE_TRADE_DATA_ADD_VIEW: {
      return {
        ...state,
        isTradeDataAddView: action.value,
        isTradeDataEditView: false,
        isTradeDataViewMode: false,
      }
    }

    case actions.UPDATE_TRADE_DATA_EDIT_VIEW: {
      return {
        ...state,
        isTradeDataEditView: action.value,
        isTradeDataViewMode: false,
        isTradeDataAddView: false,
      }
    }

    case actions.UPDATE_TRADE_DATA_VIEW_MODE: {
      return {
        ...state,
        isTradeDataViewMode: action.value,
        isTradeDataAddView: false,
        isTradeDataEditView: false,
      }
    }

    case actions.ADD_TRADE_PRICING_DATA_BY_ID: {
      return {
        ...state,
        tradeLoading: true,
      }
    }

    case actions.ADD_TRADE_PRICING_DATA_BY_ID_SUCCESS: {
      return {
        ...state,
        tradeLoading: false,
        selectedPricingProfile: action.value,
        isTradeDataAddView: false,
        isTradeDataViewMode: true,
        showTradeTieringOptions: true,
      }
    }

    case actions.ADD_TRADE_PRICING_DATA_BY_ID_FAILURE: {
      return {
        ...state,
        tradeLoading: false,
      }
    }

    case actions.EDIT_TRADE_PRICING_DATA_BY_ID: {
      return {
        ...state,
        tradeLoading: true,
      }
    }

    case actions.EDIT_TRADE_PRICING_DATA_BY_ID_SUCCESS: {
      return {
        ...state,
        tradeLoading: false,
        selectedPricingProfile: action.value,
        isTradeDataAddView: false,
        isTradeDataViewMode: true,
        isTradeDataEditView: false,
      }
    }

    case actions.EDIT_TRADE_PRICING_DATA_BY_ID_FAILURE: {
      return {
        ...state,
        tradeLoading: false,
      }
    }

    case actions.UPDATE_TRADE_TIERING_SELECTED: {
      return {
        ...state,
        selectedTradeTieringMethod: action.value,
      }
    }

    case actions.UPDATE_IS_TRADE_TIERING: {
      return {
        ...state,
        isTradeTier: action.value,
      }
    }
    case actions.ADD_TRADE_TIERING: {
      return {
        ...state,
        tradeTieringLoading: true,
      }
    }

    case actions.ADD_TRADE_TIERING_SUCCESS: {
      return {
        ...state,
        tradeTieringLoading: false,
        tradesTieringListView: true,
        selectedPricingProfile: action.value,
        tradesTieringAddView: false,
        showTradeTieringOptions: false,
      }
    }

    case actions.ADD_TRADE_TIERING_FAILURE: {
      return {
        ...state,
        tradeTieringLoading: false,
      }
    }

    case actions.EDIT_TRADE_TIERING_DATA_BY_ID: {
      return {
        ...state,
        tradeTieringLoading: true,
      }
    }

    case actions.EDIT_TRADE_TIERING_DATA_BY_ID_SUCCESS: {
      return {
        ...state,
        tradesTieringListView: true,
        tradeTieringLoading: false,
        selectedPricingProfile: action.value,
        tradesTieringEditView: false,
      }
    }

    case actions.EDIT_TRADE_TIERING_DATA_BY_ID_FAILURE: {
      return {
        ...state,
        tradeTieringLoading: false,
      }
    }

    case actions.UPDATE_TRADE_TIERING_ADD_VIEW: {
      return {
        ...state,
        tradesTieringAddView: action.value,
      }
    }

    case actions.UPDATE_TRADE_TIERING_EDIT_VIEW: {
      return {
        ...state,
        tradesTieringEditView: action.value,
      }
    }

    case actions.UPDATE_TRADE_TIERING_VIEW_MODE: {
      return {
        ...state,
        tradesTieringListView: action.value,
      }
    }

    default:
      return state
  }
}
