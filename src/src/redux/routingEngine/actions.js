const actions = {
  GET_ALL_ROUTES: 'GET_ALL_ROUTES',
  GET_ALL_ROUTES_SUCCESS: 'GET_ALL_ROUTES_SUCCESS',
  GET_ALL_ROUTES_FAILURE: 'GET_ALL_ROUTES_FAILURE',

  SELECTED_LIST_ROUTES: 'SELECTED_LIST_ROUTES',

  CHANGE_EDIT_ROUTES_MODE: 'CHANGE_EDIT_ROUTES_MODE',

  UPDATE_ROUTES: 'UPDATE_ROUTES',
  UPDATE_ROUTES_SUCCESS: 'UPDATE_ROUTES_SUCCESS',
  UPDATE_ROUTES_FAILURE: 'UPDATE_ROUTES_FAILURE',

  UPDATE_ROUTE_DETAILS: 'UPDATE_ROUTE_DETAILS',
  UPDATE_ROUTE_DETAILS_SUCCESS: 'UPDATE_ROUTE_DETAILS_SUCCESS',
  UPDATE_ROUTE_DETAILS_FAILURE: 'UPDATE_ROUTE_DETAILS_FAILURE',

  DELETE_ROUTES: 'DELETE_ROUTES',
  DELETE_ROUTES_SUCCESS: 'DELETE_ROUTES_SUCCESS',
  DELETE_ROUTES_FAILURE: 'DELETE_ROUTES_FAILURE',

  DELETE_ROUTE_TRADE_PAGE: 'DELETE_ROUTE_TRADE_PAGE_',
  DELETE_ROUTE_TRADE_PAGE_SUCCESS: 'DELETE_ROUTE_TRADE_PAGE_SUCCESS',
  DELETE_ROUTE_TRADE_PAGE_FAILURE: 'DELETE_ROUTE_TRADE_PAGE_FAILURE',

  BULK_DELETE_ROUTES: 'BULK_DELETE_ROUTES',
  BULK_DELETE_ROUTES_SUCCESS: 'BULK_DELETE_ROUTES_SUCCESS',
  BULK_DELETE_ROUTES_FAILURE: 'BULK_DELETE_ROUTES_FAILURE',

  CANCEL_ROUTE: 'CANCEL_ROUTE',
  CANCEL_ROUTE_SUCCESS: 'CANCEL_ROUTE_SUCCESS',
  CANCEL_ROUTE_FAILURE: 'CANCEL_ROUTE_FAILURE',

  HANDLE_ROUTES_PAGINATION: 'HANDLE_ROUTES_PAGINATION',

  HANDLE_ON_ROUTE_CHANGE: 'HANDLE_ON_ROUTE_CHANGE',
}
export default actions

export const onRouteChange = (values, token) => {
  return {
    type: actions.HANDLE_ON_ROUTE_CHANGE,
    values,
    token,
  }
}

export const getAllRoutes = (value, token) => {
  return {
    type: actions.GET_ALL_ROUTES,
    value,
    token,
  }
}

export const updateRoutes = (value, routeId, token) => {
  return {
    type: actions.UPDATE_ROUTE_DETAILS,
    routeId,
    value,
    token,
  }
}

export const deleteRoutes = (value, token) => {
  return {
    type: actions.DELETE_ROUTES,
    value,
    token,
  }
}

export const onDeleteRoutes = (value, tradeId, token) => {
  return {
    type: actions.DELETE_ROUTE_TRADE_PAGE,
    value,
    tradeId,
    token,
  }
}

export const selectedRoutes = value => {
  return {
    type: actions.SELECTED_LIST_ROUTES,
    value,
  }
}

export const changeEditMode = value => {
  return {
    type: actions.CHANGE_EDIT_ROUTES_MODE,
    value,
  }
}

export const bulkDeleteRoutes = (value, token) => {
  return {
    type: actions.BULK_DELETE_ROUTES,
    value,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.HANDLE_ROUTES_PAGINATION,
    value,
  }
}
