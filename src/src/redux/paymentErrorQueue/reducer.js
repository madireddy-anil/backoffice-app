import actions from './action'
// import { transformQueueData } from '../../utilities/transformer'

const initialState = {
  allErrorQueueList: [],
  loading: false,
  selectedPaymentsList: [],
  selectedApprovalRequest: {},
  totalPages: 10,
  // selectedQueueStatus: 'awaitingReview',

  selectedFilters: {
    activePage: 1,
    limit: 50,
    selectedOwnerEntityId: undefined,
    selectedCurrency: undefined,
    selectedExitStatusCode: undefined,
    selectedDays: undefined,
    selectedQueueStatus: 'awaitingReview',
    sortBy: 'desc',
  },
}

export default function errorQueueReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_ALL_ERROR_QUEUE_LIST:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_ALL_ERROR_QUEUE_LIST_SUCCESS:
      return {
        ...state,
        allErrorQueueList: action.value,
        totalPages: action.total,
        loading: false,
      }
    case actions.GET_ALL_ERROR_QUEUE_LIST_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.GET_ERROR_QUEUE_LIST_BY_FILTERS:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_ERROR_QUEUE_LIST_BY_FILTERS_SUCCESS:
      return {
        ...state,
        allErrorQueueList: action.value,
        totalPages: action.total,
        loading: false,
      }
    case actions.GET_ERROR_QUEUE_LIST_BY_FILTERS_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.GET_REJECTED_PAYMENTS_BY_FILTERS:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_REJECTED_PAYMENTS_BY_FILTERS_SUCCESS:
      return {
        ...state,
        allErrorQueueList: action.value,
        totalPages: action.total,
        loading: false,
      }
    case actions.GET_REJECTED_PAYMENTS_BY_FILTERS_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.GET_PAYMENTS_BY_FILTERS_SUCCESS:
      return {
        ...state,
        selectedPaymentsList: action.matchedPayments,
        selectedApprovalRequest: action.values,
        loading: false,
      }

    case actions.GET_PAYMENTS_BY_FILTERS:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_PAYMENTS_BY_FILTERS_FAILURE:
      return {
        ...state,
        loading: false,
      }

    // case actions.UPDATE_SELECTED_QUEUE_STATUS:
    //  return {
    //     ...state,
    //     selectedFilters: {
    //       ...state.selectedFilters,
    //       selectedQueueStatus: action.value,
    //     },
    //   }
    case actions.UPDATE_SELECTED_FILTERS:
      return {
        ...state,

        selectedFilters: action.value,
      }

    case actions.APPROVE_PAYMENT_RECORD:
      return {
        ...state,
        loading: true,
      }
    case actions.APPROVE_PAYMENT_RECORD_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.APPROVE_PAYMENT_RECORD_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.REJECT_PAYMENT_RECORD:
      return {
        ...state,
        loading: true,
      }
    case actions.REJECT_PAYMENT_RECORD_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case actions.REJECT_PAYMENT_RECORD_FAILURE:
      return {
        ...state,
        loading: false,
      }

    default:
      return state
  }
}
