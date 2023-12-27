const actions = {
  GET_ALL_PAYMENTS_PROCESS_LIST: 'GET_ALL_PAYMENTS_PROCESS_LIST',
  GET_ALL_PAYMENTS_PROCESS_LIST_SUCCESS: 'GET_ALL_PAYMENTS_PROCESS_LIST_SUCCESS',
  GET_ALL_PAYMENTS_PROCESS_LIST_FAILURE: 'GET_ALL_PAYMENTS_PROCESS_LIST_FAILURE',

  UPDATE_SELECTED_PROCESS_FLOW: 'UPDATE_SELECTED_PROCESS_FLOW',
  UPDATE_STATUS_PAIR: 'UPDATE_STATUS_PAIR',

  UPDATE_STATUS_PAIR_AT_INDEX: 'UPDATE_STATUS_PAIR_AT_INDEX',

  ADD_NEW_PROCESS_FLOW: 'ADD_NEW_PROCESS_FLOW',
  ADD_NEW_PROCESS_FLOW_SUCCESS: 'ADD_NEW_PROCESS_FLOW_SUCCESS',
  ADD_NEW_PROCESS_FLOW_FAILURE: 'ADD_NEW_PROCESS_FLOW_FAILURE',

  EDIT_NEW_PROCESS_FLOW: 'EDIT_NEW_PROCESS_FLOW',
  EDIT_NEW_PROCESS_FLOW_SUCCESS: 'EDIT_NEW_PROCESS_FLOW_SUCCESS',
  EDIT_NEW_PROCESS_FLOW_FAILURE: 'EDIT_NEW_PROCESS_FLOW_FAILURE',

  DELETE_PROCESS_FLOW: 'DELETE_PROCESS_FLOW',
  DELETE_PROCESS_FLOW_SUCCESS: 'DELETE_PROCESS_FLOW_SUCCESS',
  DELETE_PROCESS_FLOW_FAILURE: 'DELETE_PROCESS_FLOW_FAILURE',

  UPDATE_ADD_STATUS_PAIR_VIEW: 'UPDATE_ADD_STATUS_PAIR_VIEW',
}

export default actions

export const getAllPaymentProcessList = token => {
  return {
    type: actions.GET_ALL_PAYMENTS_PROCESS_LIST,
    token,
  }
}

export const addNewPaymentProcessFlow = (value, token) => {
  return {
    type: actions.ADD_NEW_PROCESS_FLOW,
    value,
    token,
  }
}

export const updateSelectedProcessFlow = value => {
  return {
    type: actions.UPDATE_SELECTED_PROCESS_FLOW,
    value,
  }
}

export const updateStatusPair = value => {
  return {
    type: actions.UPDATE_STATUS_PAIR,
    value,
  }
}

export const editPaymentProcessFlow = (id, value, token) => {
  return {
    type: actions.EDIT_NEW_PROCESS_FLOW,
    id,
    value,
    token,
  }
}

export const deleteSelectedProcessFlow = (id, token) => {
  return {
    type: actions.DELETE_PROCESS_FLOW,
    id,
    token,
  }
}

export const updateStatusPairAtIndex = (statusPairs, value, index, dataPoint) => {
  return {
    type: actions.UPDATE_STATUS_PAIR_AT_INDEX,
    statusPairs,
    value,
    index,
    dataPoint,
  }
}

export const updateAddStatusPairView = value => {
  return {
    type: actions.UPDATE_ADD_STATUS_PAIR_VIEW,
    value,
  }
}
