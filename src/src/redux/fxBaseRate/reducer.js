import actions from './actions'

const initialState = {
  fxBaseRates: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  loading: false,
  newFxBaseRate: {
    selectedVendor: {},
    sourceCurrency: '',
    destinationCurrency: '',
    rate: null,
    rateAppliedAt: '',
    isRateAnalysed: false,
    analyseLoading: false,
    analysedRate: {},
    createLoading: false,
    isFxBaseRateCreated: false,
  },
  currentFxBaseRate: {
    id: '',
    currentFxBaseRateLoading: false,
  },
  appliedFxBaseRateFilters: {},
}

export default function fxBaseRatesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_FX_BASE_RATE_FILTER:
      return {
        ...state,
        appliedFxBaseRateFilters: action.value,
      }
    case actions.GET_FX_BASE_RATES:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_FX_BASE_RATES_SUCCESS:
      return {
        ...state,
        fxBaseRates: action.value.fxBaseRates,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
        loading: false,
      }
    case actions.GET_FX_BASE_RATES_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.HANDLE_FX_BASE_RATES_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    case actions.UPDATE_CURRENT_FX_BASE_RATE_ID:
      return {
        ...state,
        currentFxBaseRate: {
          ...state.currentFxBaseRate,
          id: action.value,
        },
      }
    case actions.GET_FX_BASE_RATE_BY_ID:
      return {
        ...state,
        currentFxBaseRate: {
          ...state.currentFxBaseRate,
          ...action.value,
          currentFxBaseRateLoading: true,
        },
      }
    case actions.GET_FX_BASE_RATE_BY_ID_SUCCESS:
      return {
        ...state,
        currentFxBaseRate: {
          ...state.currentFxBaseRate,
          ...action.value,
          currentFxBaseRateLoading: false,
        },
      }
    case actions.GET_FX_BASE_RATE_BY_ID_FAILURE:
      return {
        ...state,
        currentFxBaseRate: {
          ...state.currentFxBaseRate,
          ...action.value,
          currentFxBaseRateLoading: false,
        },
      }
    case actions.INITIATE_NEW_FX_BASE_RATE:
      return {
        ...state,
        newFxBaseRate: initialState.newFxBaseRate,
      }
    case actions.UPDATE_SELECTED_VENDOR_FOR_FX_RATE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          selectedVendor: action.value,
        },
      }
    case actions.REMOVE_SELECTED_VENDOR_FROM_FX_RATE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          selectedVendor: {},
          sourceCurrency: '',
          destinationCurrency: '',
          rate: null,
          rateAppliedAt: '',
        },
      }
    case actions.UPDATE_SELECTED_SOURCE_CURRENCY_FOR_FX_RATE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          sourceCurrency: action.value,
        },
      }
    case actions.UPDATE_SELECTED_DESTINATION_CURRENCY_FOR_FX_RATE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          destinationCurrency: action.value,
        },
      }
    case actions.UPDATE_RATE_FOR_FX_RATE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          rate: action.value,
        },
      }
    case actions.UPDATE_RATE_APPLIED_DATE_FOR_FX_RATE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          rateAppliedAt: action.value,
        },
      }
    case actions.GET_ANALYSED_RATE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          analyseLoading: true,
        },
      }
    case actions.GET_ANALYSED_RATE_SUCCESS:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          analysedRate: action.value,
          isRateAnalysed: true,
          analyseLoading: false,
        },
      }
    case actions.GET_ANALYSED_RATE_FAILURE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          isRateAnalysed: false,
          analyseLoading: false,
        },
      }
    case actions.SET_ANALYSE_RATE_AGAIN:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          isRateAnalysed: false,
        },
      }
    case actions.CREATE_FX_BASE_RATE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          createLoading: true,
        },
      }
    case actions.CREATE_FX_BASE_RATE_SUCCESS:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          createLoading: false,
          isFxBaseRateCreated: true,
        },
        currentFxBaseRate: {
          ...state.currentFxBaseRate,
          ...action.value,
        },
      }
    case actions.CREATE_FX_BASE_RATE_FAILURE:
      return {
        ...state,
        newFxBaseRate: {
          ...state.newFxBaseRate,
          createLoading: false,
          isFxBaseRateCreated: false,
        },
      }

    default:
      return state
  }
}
