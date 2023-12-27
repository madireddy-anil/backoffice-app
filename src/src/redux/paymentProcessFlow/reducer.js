import actions from './action'
import { modifyStatusPair } from '../../utilities/transformer'

const initialState = {
  allPaymentProcessFlows: [],
  listloading: false,
  addProcessLoading: false,
  selectedProcessFlow: {
    status: [],
  },
  isAddStatusPair: false,
}

export default function paymentProcessReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_ALL_PAYMENTS_PROCESS_LIST:
      return {
        ...state,
        listloading: true,
      }
    case actions.GET_ALL_PAYMENTS_PROCESS_LIST_SUCCESS:
      return {
        ...state,
        allPaymentProcessFlows: action.value,
        listloading: false,
      }
    case actions.GET_ALL_PAYMENTS_PROCESS_LIST_FAILURE:
      return {
        ...state,
        listloading: false,
      }

    case actions.ADD_NEW_PROCESS_FLOW:
      return {
        ...state,
        addProcessLoading: true,
      }

    case actions.ADD_NEW_PROCESS_FLOW_SUCCESS:
      return {
        ...state,
        addProcessLoading: false,
      }

    case actions.ADD_NEW_PROCESS_FLOW_FAILURE:
      return {
        ...state,
        addProcessLoading: false,
      }

    case actions.EDIT_NEW_PROCESS_FLOW:
      return {
        ...state,
        addProcessLoading: true,
      }

    case actions.EDIT_NEW_PROCESS_FLOW_SUCCESS:
      return {
        ...state,
        addProcessLoading: false,
      }

    case actions.EDIT_NEW_PROCESS_FLOW_FAILURE:
      return {
        ...state,
        addProcessLoading: false,
      }

    case actions.UPDATE_SELECTED_PROCESS_FLOW:
      return {
        ...state,
        selectedProcessFlow: action.value,
      }
    case actions.UPDATE_STATUS_PAIR:
      return {
        ...state,
        selectedProcessFlow: {
          ...state.selectedProcessFlow,
          status: action.value,
        },
      }

    case actions.UPDATE_STATUS_PAIR_AT_INDEX: {
      const { statusPairs, value, index, dataPoint } = action
      return {
        ...state,
        selectedProcessFlow: {
          ...state.selectedProcessFlow,
          status: modifyStatusPair(statusPairs, value, index, dataPoint),
        },
      }
    }

    case actions.UPDATE_ADD_STATUS_PAIR_VIEW:
      return {
        ...state,
        isAddStatusPair: action.value,
      }

    default:
      return state
  }
}
