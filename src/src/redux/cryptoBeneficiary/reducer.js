import actions from './actions'

const initialState = {
  cryptoBeneficiaryLoading: false,
  isCryptoBeneficiaryFetched: false,
  isCryptoBeneUpdated: false,
  cryptoBeneficiary: {},
  cryptoBeneficiaries: [],
  formatedCryptoBeneficiary: [],
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  allDownloadData: [],
  appliedCryptoBeneficiaryFilters: {},
}

export default function cryptoBeneficiaryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UDPATE_CRYPTO_BENE_STATUS:
      return {
        ...state,
        cryptoBeneficiaryLoading: true,
      }
    case actions.UDPATE_CRYPTO_BENE_STATUS_SUCCESS:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
      }
    case actions.UDPATE_CRYPTO_BENE_STATUS_FAILURE:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
      }
    case actions.HANDLE_CRYPTO_BENEFICIARY_FILTERS:
      return {
        ...state,
        appliedCryptoBeneficiaryFilters: action.value,
      }
    case actions.GET_BULK_DOWNLOAD_FOR_CRYPTO_BENEFICIARY:
      return {
        ...state,
        cryptoBeneficiaryLoading: true,
      }
    case actions.GET_BULK_DOWNLOAD_FOR_CRYPTO_BENEFICIARY_SUCCESS:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
        allDownloadData: action.value,
      }
    case actions.GET_BULK_DOWNLOAD_FOR_CRYPTO_BENEFICIARY_FAILURE:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
      }
    case actions.GET_CRYPTO_BENEFICIARIES:
      return {
        ...state,
        cryptoBeneficiaryLoading: true,
      }
    case actions.GET_CRYPTO_BENEFICIARIES_SUCCESS:
      return {
        ...state,
        cryptoBeneficiaries: action.value.beneficiaries,
        cryptoBeneficiaryLoading: false,
        pagination: {
          ...state.pagination,
          total: action.total,
        },
        allDownloadData: action.value.beneficiaries,
      }
    case actions.GET_CRYPTO_BENEFICIARIES_FAILURE:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
      }
    case actions.GET_CRYPTO_BENEFICIARY_BY_ID:
      return {
        ...state,
        cryptoBeneficiaryLoading: true,
        isCryptoBeneficiaryFetched: false,
        cryptoBeneficiary: {
          clientName: undefined,
          vendorName: undefined,
        },
      }
    case actions.GET_CRYPTO_BENEFICIARY_BY_ID_SUCCESS:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
        cryptoBeneficiary: action.value,
        isCryptoBeneficiaryFetched: true,
      }
    case actions.GET_CRYPTO_BENEFICIARY_BY_ID_FALIURE:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
        isCryptoBeneficiaryFetched: false,
      }
    case actions.GET_FORMATED_CRYPTO_BENEFICIARY:
      return {
        ...state,
        formatedCryptoBeneficiary: action.value,
      }
    case actions.UPDATE_SELECTED_CRYPTO_BENEFICIARY:
      return {
        ...state,
        cryptoBeneficiary: action.value,
      }
    case actions.CREATE_BENEFICIARY:
      return {
        ...state,
        cryptoBeneficiaryLoading: true,
      }
    case actions.CREATE_BENEFICIARY_SUCCESS:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
      }
    case actions.CREATE_BENEFICIARY_FAILURE:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
      }
    case actions.UPDATE_CRYPTO_BENEFICIARY:
      return {
        ...state,
        cryptoBeneficiaryLoading: true,
      }
    case actions.UPDATE_CRYPTO_BENEFICIARY_SUCCESS:
      return {
        ...state,
        isCryptoBeneUpdated: true,
        cryptoBeneficiaryLoading: false,
      }
    case actions.UPDATE_CRYPTO_BENEFICIARY_FAILURE:
      return {
        ...state,
        cryptoBeneficiaryLoading: false,
      }
    case actions.HANDLE_CRYPTO_BENEFICIARIES_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    default:
      return state
  }
}
