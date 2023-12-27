const actions = {
  EDIT_SELECTED_CURRENCY: 'EDIT_SELECTED_CURRENCY',
  EDIT_SELECTED_CURRENCY_SUCCESS: 'EDIT_SELECTED_CURRENCY_SUCCESS',
  EDIT_SELECTED_CURRENCY_FAILURE: 'EDIT_SELECTED_CURRENCY_FAILURE',

  EDIT_SELECTED_COUNTRY: 'EDIT_SELECTED_COUNTRY',
  EDIT_SELECTED_COUNTRY_SUCCESS: 'EDIT_SELECTED_COUNTRY_SUCCESS',
  EDIT_SELECTED_COUNTRY_FAILURE: 'EDIT_SELECTED_COUNTRY_FAILURE',

  UPDATE_CURRENCIES: 'UPDATE_CURRENCIES',
  UPDATE_COUNTRIES: 'UPDATE_COUNTRIES',
  UPDATE_SELECTED_CURRENCY: 'UPDATE_SELECTED_CURRENCY',
  UPDATE_SELECTED_COUNTRY: 'UPDATE_SELECTED_COUNTRY',
}
export default actions

export const updatedCurrencies = value => {
  return {
    type: actions.UPDATE_CURRENCIES,
    value,
  }
}

export const updateSelectedCurrency = value => {
  return {
    type: actions.UPDATE_SELECTED_CURRENCY,
    value,
  }
}

export const editSelectedCurrency = (id, value, token) => {
  return {
    type: actions.EDIT_SELECTED_CURRENCY,
    id,
    value,
    token,
  }
}

export const updatedCountries = value => {
  return {
    type: actions.UPDATE_COUNTRIES,
    value,
  }
}

export const updateSelectedCountry = value => {
  return {
    type: actions.UPDATE_SELECTED_COUNTRY,
    value,
  }
}

export const editSelectedCountry = (id, value, token) => {
  return {
    type: actions.EDIT_SELECTED_COUNTRY,
    id,
    value,
    token,
  }
}
