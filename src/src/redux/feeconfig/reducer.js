import actions from './actions'

const initialState = {
  allFeeConfigs: [],
  selectedFeeConfig: {},
  totalFeeConfigs: 0,
  loading: false,
  isFeeConfigUpdated: false,
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  newFeeConfig: {
    sourceCurrency: '',
    destinationCurrency: '',
    selectedClientOrVendor: '',
    feeValue: '',
    tradingHours: '',
    spreadType: '',
    createLoading: false,
    isFeeConfigCreated: false,
  },
  appliedFeeConfigFilters: {},
}

export default function feeConfigReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_FEE_CONFIG_FILTERS:
      return {
        ...state,
        appliedFeeConfigFilters: action.value,
      }
    case actions.GET_FEE_CONFIGS:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_FEE_CONFIGS_SUCCESS:
      return {
        ...state,
        allFeeConfigs: action.value.feeConfig,
        totalFeeConfigs: action.value.total,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
        loading: false,
      }
    case actions.GET_FEE_CONFIG_BY_ID:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_FEE_CONFIG_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedFeeConfig: action.value,
      }
    case actions.GET_FEE_CONFIG_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.UPDATE_FEE_CONFIG:
      return {
        ...state,
        isFeeConfigUpdated: false,
        loading: true,
      }
    case actions.UPDATE_FEE_CONFIG_SUCCESS:
      return {
        ...state,
        isFeeConfigUpdated: true,
        loading: false,
      }
    case actions.UPDATE_FEE_CONFIG_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.HANDLE_FEE_CONFIGS_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }

    case actions.INITIATE_NEW_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: initialState.newFeeConfig,
      }
    case actions.UPDATE_CLIENT_FROM_FEE_CONFIG: {
      state.newFeeConfig.clientId = action.value
      delete state.newFeeConfig.vendorId
      return {
        ...state,
      }
    }
    case actions.UPDATE_SELECTED_VENDOR_FOR_FEE_CONFIG:
      state.newFeeConfig.vendorId = action.value
      delete state.newFeeConfig.clientId
      return {
        ...state,
      }
    case actions.REMOVE_CLIENT_FROM_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          selectedClient: {},
          sourceCurrency: '',
          destinationCurrency: '',
          feeValue: '',
          tradingHours: '',
        },
      }
    case actions.UPDATE_SELECTED_SOURCE_CURRENCY_FOR_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          sourceCurrency: action.value,
        },
      }
    case actions.UPDATE_SELECTED_DESTINATION_CURRENCY_FOR_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          destinationCurrency: action.value,
        },
      }
    case actions.UPDATE_SELECTED_TRADING_HOURS_FOR_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          tradingHours: action.value,
        },
      }
    case actions.UPDATE_SELECTED_SPREAD_TYPE_FOR_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          spreadType: action.value,
        },
      }
    case actions.UPDATE_FEE_VALUE_FOR_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          feeValue: action.value,
        },
      }
    case actions.UPDATE_FEE_CONFIG_CLIENTORVENDOR_PREFERENCE_FOR_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          selectedClientOrVendor: action.value,
        },
      }
    case actions.CREATE_FEE_CONFIG:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          createLoading: true,
        },
      }
    case actions.CREATE_FEE_CONFIG_SUCCESS:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          createLoading: false,
          isFeeConfigCreated: true,
        },
      }
    case actions.CREATE_FEE_CONFIG_FAILURE:
      return {
        ...state,
        newFeeConfig: {
          ...state.newFeeConfig,
          createLoading: false,
          isFeeConfigCreated: false,
        },
      }
    case actions.CLEAR_FEE_CONFIG_DATA:
      return {
        ...state,
        newFeeConfig: {
          sourceCurrency: '',
          destinationCurrency: '',
          selectedClientOrVendor: '',
          feeValue: '',
          tradingHours: '',
          spreadType: '',
          createLoading: false,
          isFeeConfigCreated: false,
        },
      }

    default:
      return state
  }
}
