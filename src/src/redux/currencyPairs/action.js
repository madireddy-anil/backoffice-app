const actions = {
  EDIT_SELECTED_CURRENCY_PAIR: 'EDIT_SELECTED_CURRENCY_PAIR',
  EDIT_SELECTED_CURRENCY_PAIR_SUCCESS: 'EDIT_SELECTED_CURRENCY_PAIR_SUCCESS',
  EDIT_SELECTED_CURRENCY_PAIR_FAILURE: 'EDIT_SELECTED_CURRENCY_PAIR_FAILURE',

  UPDATE_SELECTED_CURRENCY_PAIR: 'UPDATE_SELECTED_CURRENCY_PAIR',

  ADD_NEW_CURRENCIES_PAIR: 'ADD_NEW_CURRENCIES_PAIR',
  ADD_NEW_CURRENCIES_PAIR_SUCCESS: 'ADD_NEW_CURRENCIES_PAIR_SUCCESS',
  ADD_NEW_CURRENCIES_PAIR_FAILURE: 'ADD_NEW_CURRENCIES_PAIR_FAILURE',

  DELETE_SELECTED_CURRENCY_PAIR: 'DELETE_SELECTED_CURRENCY_PAIR',
  DELETE_SELECTED_CURRENCY_PAIR_SUCCESS: 'DELETE_SELECTED_CURRENCY_PAIR_SUCCESS',
  DELETE_SELECTED_CURRENCY_PAIR_FAILURE: 'DELETE_SELECTED_CURRENCY_PAIR_FAILURE',

  UPDATE_ERROR_LIST: 'UPDATE_ERROR_LIST',
}
export default actions

export const updatedCurrencyPair = value => {
  return {
    type: actions.UPDATE_CURRENCIES_PAIR,
    value,
  }
}

export const updateSelectedCurrencyPair = value => {
  return {
    type: actions.UPDATE_SELECTED_CURRENCY_PAIR,
    value,
  }
}

export const editSelectedCurrencyPair = (id, value, token) => {
  return {
    type: actions.EDIT_SELECTED_CURRENCY_PAIR,
    id,
    value,
    token,
  }
}

export const addNewCurrenyPair = (value, token) => {
  return {
    type: actions.ADD_NEW_CURRENCIES_PAIR,
    value,
    token,
  }
}

export const updateErrorList = (value, token) => {
  return {
    type: actions.UPDATE_ERROR_LIST,
    value,
    token,
  }
}

export const deleteSelectedCurrencyPair = (id, token) => {
  return {
    type: actions.DELETE_SELECTED_CURRENCY_PAIR,
    id,
    token,
  }
}
