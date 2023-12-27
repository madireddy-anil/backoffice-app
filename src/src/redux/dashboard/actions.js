const actions = {
  GET_ALL_DASHBOARD_BALANCES: 'GET_ALL_DASHBOARD_BALANCES',
  GET_ALL_DASHBOARD_BALANCES_SUCCESS: 'GET_ALL_DASHBOARD_BALANCES_SUCCESS',
  GET_ALL_DASHBOARD_BALANCES_FALIURE: 'GET_ALL_DASHBOARD_BALANCES_FALIURE',

  GET_BALANCES_ON_FILTERS: 'GET_BALANCES_ON_FILTERS',
  GET_BALANCES_ON_FILTERS_SUCCESS: 'GET_BALANCES_ON_FILTERS_SUCCESS',
  GET_BALANCES_ON_FILTERS_FAILURE: 'GET_BALANCES_ON_FILTERS_FAILURE',

  UPDATE_SELECTED_ACCOUNT_MID: 'UPDATE_SELECTED_ACCOUNT_MID',
}

export default actions

export const getallDasboardBalances = (datePeriod, token) => {
  return {
    type: actions.GET_ALL_DASHBOARD_BALANCES,
    datePeriod,
    token,
  }
}

export const getBalancesByFilters = (value, token) => {
  return {
    type: actions.GET_BALANCES_ON_FILTERS,
    value,
    token,
  }
}

export const updateSelectedAccoutMIDs = accountMIDs => {
  return {
    type: actions.UPDATE_SELECTED_ACCOUNT_MID,
    accountMIDs,
  }
}
