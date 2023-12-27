import actions from './actions'

const initialState = {
  beneficiaryLoading: false,
  beneficiary: {},
  beneficiaries: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  allDownloadData: [],
  appliedBeneficiaryFilters: {},
}

export default function beneficiaryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPDATE_BENE_STATUS:
      return {
        ...state,
        beneficiaryLoading: true,
      }
    case actions.UPDATE_BENE_STATUS_SUCCESS:
      return {
        ...state,
        beneficiaryLoading: false,
      }
    case actions.UPDATE_BENE_STATUS_FAILURE:
      return {
        ...state,
        beneficiaryLoading: false,
      }
    case actions.HANDLE_BENEFICIARY_FILTERS:
      return {
        ...state,
        appliedBeneficiaryFilters: action.value,
      }
    case actions.GET_BENEFICIARIES:
      return {
        ...state,
        beneficiaryLoading: true,
      }
    case actions.GET_BULK_DOWNLOAD_FOR_BENEFICIARY:
      return {
        ...state,
        beneficiaryLoading: true,
      }
    case actions.GET_BULK_DOWNLOAD_FOR_BENEFICIARY_SUCCESS:
      return {
        ...state,
        beneficiaryLoading: false,
        allDownloadData: action.value,
      }
    case actions.GET_BULK_DOWNLOAD_FOR_BENEFICIARY_FAILURE:
      return {
        ...state,
        beneficiaryLoading: false,
      }
    case actions.GET_BENEFICIARIES_SUCCESS:
      return {
        ...state,
        beneficiaries: action.value,
        beneficiaryLoading: false,
        pagination: {
          ...state.pagination,
          total: action.total,
        },
        allDownloadData: action.value,
      }
    case actions.GET_BENEFICIARIES_FAILURE:
      return {
        ...state,
        beneficiaryLoading: false,
      }
    case actions.GET_BENEFICIARY_BY_ID:
      return {
        ...state,
        beneficiaryLoading: true,
      }
    case actions.GET_BENEFICIARY_BY_ID_SUCCESS:
      return {
        ...state,
        beneficiaryLoading: false,
        beneficiary: action.value,
      }
    case actions.GET_BENEFICIARY_BY_ID_FALIURE:
      return {
        ...state,
        beneficiaryLoading: false,
      }
    case actions.CREATE_BENEFICIARY:
      return {
        ...state,
        beneficiaryLoading: true,
      }
    case actions.CREATE_BENEFICIARY_SUCCESS:
      return {
        ...state,
        beneficiaryLoading: false,
      }
    case actions.CREATE_BENEFICIARY_FAILURE:
      return {
        ...state,
        beneficiaryLoading: false,
      }
    case actions.UPDATE_BENEFICIARY:
      return {
        ...state,
        beneficiaryLoading: true,
      }
    case actions.UPDATE_BENEFICIARY_SUCCESS:
      return {
        ...state,
        isBeneUpdated: true,
        beneficiaryLoading: false,
      }
    case actions.UPDATE_BENEFICIARY_FAILURE:
      return {
        ...state,
        beneficiaryLoading: false,
      }
    case actions.HANDLE_BENEFICIARIES_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    default:
      return state
  }
}
