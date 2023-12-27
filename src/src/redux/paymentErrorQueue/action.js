const actions = {
  GET_ALL_ERROR_QUEUE_LIST: 'GET_ALL_ERROR_QUEUE_LIST',
  GET_ALL_ERROR_QUEUE_LIST_SUCCESS: 'GET_ALL_ERROR_QUEUE_LIST_SUCCESS',
  GET_ALL_ERROR_QUEUE_LIST_FAILURE: 'GET_ALL_ERROR_QUEUE_LIST_FAILURE',

  GET_ERROR_QUEUE_LIST_BY_FILTERS: 'GET_ERROR_QUEUE_LIST_BY_FILTERS',
  GET_ERROR_QUEUE_LIST_BY_FILTERS_SUCCESS: 'GET_ERROR_QUEUE_LIST_BY_FILTERS_SUCCESS',
  GET_ERROR_QUEUE_LIST_BY_FILTERS_FAILURE: 'GET_ERROR_QUEUE_LIST_BY_FILTERS_FAILURE',

  GET_PAYMENTS_BY_FILTERS: 'GET_PAYMENTS_BY_FILTERS',
  GET_PAYMENTS_BY_FILTERS_SUCCESS: 'GET_PAYMENTS_BY_FILTERS_SUCCESS',
  GET_PAYMENTS_BY_FILTERS_FAILURE: 'GET_PAYMENTS_BY_FILTERS_FAILURE',

  GET_REJECTED_PAYMENTS_BY_FILTERS: 'GET_REJECTED_PAYMENTS_BY_FILTERS',
  GET_REJECTED_PAYMENTS_BY_FILTERS_SUCCESS: 'GET_REJECTED_PAYMENTS_BY_FILTERS_SUCCESS',
  GET_REJECTED_PAYMENTS_BY_FILTERS_FAILURE: 'GET_REJECTED_PAYMENTS_BY_FILTERS_FAILURE',

  UPDATE_SELECTED_QUEUE_STATUS: 'UPDATE_SELECTED_QUEUE_STATUS',

  UPDATE_SELECTED_FILTERS: 'UPDATE_SELECTED_FILTERS',

  APPROVE_PAYMENT_RECORD: 'APPROVE_PAYMENT_RECORD',
  APPROVE_PAYMENT_RECORD_SUCCESS: 'APPROVE_PAYMENT_RECORD_SUCCESS',
  APPROVE_PAYMENT_RECORD_FAILURE: 'APPROVE_PAYMENT_RECORD_FAILURE',

  REJECT_PAYMENT_RECORD: 'REJECT_PAYMENT_RECORD',
  REJECT_PAYMENT_RECORD_SUCCESS: 'REJECT_PAYMENT_RECORD_SUCCESS',
  REJECT_PAYMENT_RECORD_FAILURE: 'REJECT_PAYMENT_RECORD_FAILURE',
}

export default actions

export const getAllErrorQueueList = (value, token) => {
  return {
    type: actions.GET_ALL_ERROR_QUEUE_LIST,
    value,
    token,
  }
}

export const getQueueListByFilters = (value, token) => {
  return {
    type: actions.GET_ERROR_QUEUE_LIST_BY_FILTERS,
    value,
    token,
  }
}

export const getPaymentsListByFilters = (value, token) => {
  return {
    type: actions.GET_PAYMENTS_BY_FILTERS,
    value,
    token,
  }
}

export const getRejectedPaymentsByFilters = (value, token) => {
  return {
    type: actions.GET_REJECTED_PAYMENTS_BY_FILTERS,
    value,
    token,
  }
}

// export const updateSelectedQueueStatus = value => {
//   return {
//     type: actions.UPDATE_SELECTED_QUEUE_STATUS,
//     value,
//   }
// }

export const updateSelectedFilters = value => {
  return {
    type: actions.UPDATE_SELECTED_FILTERS,
    value,
  }
}

export const approvePaymentRequest = (id, value, token) => {
  return {
    type: actions.APPROVE_PAYMENT_RECORD,
    id,
    value,
    token,
  }
}

export const rejectPaymentRequest = (id, value, token) => {
  return {
    type: actions.REJECT_PAYMENT_RECORD,
    id,
    value,
    token,
  }
}
