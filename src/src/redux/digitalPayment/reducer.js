import actions from './action'
import { transformErrorData } from '../../utilities/transformer'

import generalActions from '../general/actions'

const initialState = {
  // client balances
  beneficiaries: [],
  errorMsg: '',
  loading: false,
  rateDetails: {},
  newPayment: {
    clientOrCompanyId: undefined,
    debitAmount: undefined,
    creditAmount: undefined,
    selectedCurrencyAccount: {},
    beneficiaryData: {},
    clientOrCompanyIdAsBeneficiary: undefined,
  },
  isRateFetched: true,
  rateLoading: false,
  errorList: [],
  paymentLoading: false,
  paymentInformationLoading: false,
  paymentInformation: {},
  paymentInformationError: '',
  paymentDetails: {},
  beneFieldsList: [],
  beneListLoading: false,
  isFetchBeneFields: true,
  fees: {},
}

export default function digitalPaymentReducer(state = initialState, action) {
  switch (action.type) {
    case generalActions.GET_CLIENTS_BY_KYC_STATUS_PASS_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case generalActions.GET_CLIENTS_BY_KYC_STATUS_PASS_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case generalActions.GET_CLIENTS_BY_KYC_STATUS_PASS:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_LIFTING_FEE_SUCCESS:
      return {
        ...state,
        fees: action.value,
      }
    case actions.UPDATE_SELECTED_COMPANY:
      return {
        ...state,
        newPayment: {
          ...state.newPayment,
          clientOrCompanyId: action.value,
          debitAmount: undefined,
          creditAmount: undefined,
          selectedCurrencyAccount: {},
          beneficiaryData: {},
        },
      }
    case actions.UPDATE_SELECED_CLIENT:
      return {
        ...state,
        newPayment: {
          ...state.newPayment,
          clientOrCompanyId: action.value,
          debitAmount: undefined,
          creditAmount: undefined,
          selectedCurrencyAccount: {},
          beneficiaryData: {},
        },
      }
    case actions.UPDATE_CLIENT_OR_COMPANY_AS_BENEFICIARY: {
      return {
        ...state,
        newPayment: {
          ...state.newPayment,
          clientOrCompanyIdAsBeneficiary: action.value,
        },
      }
    }
    case actions.SET_TO_INITIAL_VALUES:
      return {
        ...state,
        errorMsg: '',
        errorList: [],
        newPayment: initialState.newPayment,
        beneFieldsList: [],
        paymentInformation: {},
        paymentLoading: false,
        paymentInformationLoading: false,
        paymentInformationError: '',
      }
    case actions.UPDATE_SELECED_CA:
      return {
        ...state,
        errorList: [],
        newPayment: {
          ...state.newPayment,
          debitAmount: undefined,
          creditAmount: undefined,
          selectedCurrencyAccount: action.value,
        },
      }
    case actions.REMOVE_SELECED_CA_FROM_NEW_PAYMENT:
      return {
        ...state,
        errorMsg: '',
        errorList: [],
        newPayment: {
          ...state.newPayment,
          debitAmount: undefined,
          creditAmount: undefined,
          selectedCurrencyAccount: {},
          beneficiaryData: {},
        },
      }
    case actions.UPDATE_NEW_BENEFICIARY_DATA:
      return {
        ...state,
        errorList: [],
        newPayment: {
          ...state.newPayment,
          beneficiaryData: {
            ...state.newPayment.beneficiaryData,
            ...action.value,
          },
          debitAmount: undefined,
          creditAmount: undefined,
        },
      }
    case actions.REMOVE_SELECED_BENEFICIARY_DATA:
      return {
        ...state,
        errorList: [],
        newPayment: {
          ...state.newPayment,
          beneficiaryData: {},
          debitAmount: undefined,
          creditAmount: undefined,
        },
        beneFieldsList: [],
        paymentInformation: {},
        paymentInformationError: '',
      }
    case actions.GET_BENEFICIARY_LIST_ID:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_BENEFICIARY_LIST_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        beneficiaries: action.value,
      }
    case actions.GET_BENEFICIARY_LIST_ID_FAILURE:
      return {
        ...state,
        beneficiaries: [],
        loading: false,
      }
    case actions.UPDATE_ERROR_MESSAGE:
      return {
        ...state,
        errorMsg: action.value,
      }
    case actions.UPDATE_DEBIT_AMOUNT:
      return {
        ...state,
        newPayment: {
          ...state.newPayment,
          debitAmount: action.value,
        },
      }
    case actions.UPDATE_CREDIT_AMOUNT:
      return {
        ...state,
        newPayment: {
          ...state.newPayment,
          creditAmount: action.value,
        },
      }
    case actions.RESET_CREDIT_DEBIT_AMOUNT:
      return {
        ...state,
        newPayment: {
          ...state.newPayment,
          creditAmount: undefined,
          debitAmount: undefined,
        },
      }
    case actions.GET_QUOTE:
      return {
        ...state,
        rateLoading: true,
      }

    case actions.GET_QUOTE_SUCCESS:
      return {
        ...state,
        isRateFetched: true,
        rateDetails: action.value,
        rateLoading: false,
      }
    case actions.GET_QUOTE_FAILURE:
      return {
        ...state,
        isRateFetched: false,
        rateLoading: false,
      }
    case actions.GET_DIGITAL_PAYMENT_DEATILS:
      return {
        ...state,
        // paymentInformationError: "",
        paymentInformationLoading: true,
      }
    case actions.GET_DIGITAL_PAYMENT_DEATILS_SUCCESS:
      return {
        ...state,
        paymentInformation: action.value,
        paymentInformationError: '',
        paymentInformationLoading: false,
      }
    case actions.GET_DIGITAL_PAYMENT_DEATILS_FAILURE:
      return {
        ...state,
        paymentInformationError: action.payload.message,
        paymentInformationLoading: false,
      }

    case actions.REMOVE_PAYMENT_INFORMATION:
      return {
        ...state,
        paymentInformation: {},
        paymentInformationError: '',
      }

    case actions.INITIATE_DIGITAL_PAYMENT:
      return {
        ...state,
        paymentLoading: true,
      }
    case actions.INITIATE_DIGITAL_PAYMENT_SUCCESS:
      return {
        ...state,
        paymentLoading: false,
        paymentDetails: action.value,
      }
    case actions.INITIATE_DIGITAL_PAYMENT_FAILURE:
      // eslint-disable-next-line no-case-declarations
      let errorList = []
      console.log(action?.payload)
      if (action?.payload) {
        if (action?.payload['invalid-params']) {
          errorList = transformErrorData(action?.payload['invalid-params'])
        }
      }
      return {
        ...state,
        paymentLoading: false,
        errorList,
      }
    case actions.GET_BENEFICIARY_FIELDS_LIST:
      return {
        ...state,
        beneListLoading: true,
        isFetchBeneFields: false,
      }
    case actions.GET_BENEFICIARY_FIELDS_LIST_SUCCESS:
      return {
        ...state,
        isFetchBeneFields: true,
        beneListLoading: false,
        beneFieldsList: action.value.beneficiaryValidation.fields,
      }
    case actions.GET_BENEFICIARY_FIELDS_LIST_FAILURE:
      return {
        ...state,
        beneListLoading: false,
        isFetchBeneFields: false,
        beneFieldsList: [],
      }

    case actions.UPDATE_BENEFICIARY_FIELDS_LIST:
      return {
        ...state,
        beneFieldsList: action.value,
      }

    default:
      return state
  }
}
