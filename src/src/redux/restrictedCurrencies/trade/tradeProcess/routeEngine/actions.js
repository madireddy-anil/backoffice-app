const actions = {
  NP_GET_ALL_ROUTES: 'NP_GET_ALL_ROUTES',
  NP_GET_ALL_ROUTES_SUCCESS: 'NP_GET_ALL_ROUTES_SUCCESS',
  NP_GET_ALL_ROUTES_FAILURE: 'NP_GET_ALL_ROUTES_FAILURE',

  NP_SELECTED_LIST_ROUTES: 'NP_SELECTED_LIST_ROUTES',

  NP_CHANGE_EDIT_ROUTES_MODE: 'NP_CHANGE_EDIT_ROUTES_MODE',

  NP_UPDATE_ROUTES: 'NP_UPDATE_ROUTES',
  NP_UPDATE_ROUTES_SUCCESS: 'NP_UPDATE_ROUTES_SUCCESS',
  NP_UPDATE_ROUTES_FAILURE: 'NP_UPDATE_ROUTES_FAILURE',

  NP_UPDATE_ROUTE_DETAILS: 'NP_UPDATE_ROUTE_DETAILS',
  NP_UPDATE_ROUTE_DETAILS_SUCCESS: 'NP_UPDATE_ROUTE_DETAILS_SUCCESS',
  NP_UPDATE_ROUTE_DETAILS_FAILURE: 'NP_UPDATE_ROUTE_DETAILS_FAILURE',

  NP_DELETE_ROUTES: 'NP_DELETE_ROUTES',
  NP_DELETE_ROUTES_SUCCESS: 'NP_DELETE_ROUTES_SUCCESS',
  NP_DELETE_ROUTES_FAILURE: 'NP_DELETE_ROUTES_FAILURE',

  NP_DELETE_ROUTE_TRADE_PAGE: 'NP_DELETE_ROUTE_TRADE_PAGE_',
  NP_DELETE_ROUTE_TRADE_PAGE_SUCCESS: 'NP_DELETE_ROUTE_TRADE_PAGE_SUCCESS',
  NP_DELETE_ROUTE_TRADE_PAGE_FAILURE: 'NP_DELETE_ROUTE_TRADE_PAGE_FAILURE',

  NP_BULK_DELETE_ROUTES: 'NP_BULK_DELETE_ROUTES',
  NP_BULK_DELETE_ROUTES_SUCCESS: 'NP_BULK_DELETE_ROUTES_SUCCESS',
  NP_BULK_DELETE_ROUTES_FAILURE: 'NP_BULK_DELETE_ROUTES_FAILURE',

  NP_CANCEL_ROUTE: 'NP_CANCEL_ROUTE',
  NP_CANCEL_ROUTE_SUCCESS: 'NP_CANCEL_ROUTE_SUCCESS',
  NP_CANCEL_ROUTE_FAILURE: 'NP_CANCEL_ROUTE_FAILURE',

  NP_HANDLE_ROUTES_PAGINATION: 'NP_HANDLE_ROUTES_PAGINATION',

  NP_HANDLE_ON_ROUTE_CHANGE: 'NP_HANDLE_ON_ROUTE_CHANGE',
}
export default actions

export const onRouteChange = (values, token) => {
  return {
    type: actions.NP_HANDLE_ON_ROUTE_CHANGE,
    values,
    token,
  }
}

export const getAllRoutes = (value, token) => {
  return {
    type: actions.NP_GET_ALL_ROUTES,
    value,
    token,
  }
}

export const updateRoutes = (value, routeId, token) => {
  return {
    type: actions.NP_UPDATE_ROUTE_DETAILS,
    routeId,
    value,
    token,
  }
}

export const deleteRoutes = (value, token) => {
  return {
    type: actions.NP_DELETE_ROUTES,
    value,
    token,
  }
}

export const onDeleteRoutes = (value, tradeId, token) => {
  return {
    type: actions.NP_DELETE_ROUTE_TRADE_PAGE,
    value,
    tradeId,
    token,
  }
}

export const selectedRoutes = value => {
  return {
    type: actions.NP_SELECTED_LIST_ROUTES,
    value,
  }
}

export const changeEditMode = value => {
  return {
    type: actions.NP_CHANGE_EDIT_ROUTES_MODE,
    value,
  }
}

export const bulkDeleteRoutes = (value, token) => {
  return {
    type: actions.NP_BULK_DELETE_ROUTES,
    value,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.NP_HANDLE_ROUTES_PAGINATION,
    value,
  }
}
