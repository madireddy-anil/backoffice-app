import actions from './actions'
import tradeAction from '../trade/actions'

const initialState = {
  allRoutes: [],
  totalRoutes: 0,
  deleteRouteLoading: false,
  selectedListRoutes: {},
  routeEngineData: [],
  loading: false,
  isEditRoutesMode: false,
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
}

export default function routingEngineReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_ON_ROUTE_CHANGE:
      return {
        ...state,
        deleteRouteLoading: true,
      }
    case actions.UPDATE_ROUTE_DETAILS_SUCCESS:
      return {
        ...state,
        deleteRouteLoading: false,
      }
    case actions.GET_ALL_ROUTES:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_ALL_ROUTES_SUCCESS:
      return {
        ...state,
        allRoutes: action.value.tradeRouters,
        totalRoutes: action.value.total,
        pagination: {
          ...state.pagination,
          total: action.value.total,
        },
        loading: false,
      }
    case actions.GET_ALL_ROUTES_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.SELECTED_LIST_ROUTES:
      return {
        ...state,
        selectedListRoutes: action.value,
      }
    case actions.CHANGE_EDIT_ROUTES_MODE:
      return {
        ...state,
        isEditRoutesMode: action.value,
      }
    case actions.DELETE_ROUTE_TRADE_PAGE:
      return {
        ...state,
        loading: true,
      }
    case actions.DELETE_ROUTE_TRADE_PAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.DELETE_ROUTE_TRADE_PAGE_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.HANDLE_ROUTES_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }

    case tradeAction.GET_ROUTE_BY_TRADE_ID_SUCCESS:
      return {
        ...state,
        routeEngineData: action.value,
      }

    default:
      return state
  }
}
