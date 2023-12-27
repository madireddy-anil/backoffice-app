import actions from './action'
// import {addDefaultServices} from '../../utilities/transformer'

const initialState = {
  allVendorConfiguration: [],

  loading: false,
  totalPages: 10,

  selectedVendorConfig: {},

  showVendorAddMode: true,
  showVendorDataViewMode: false,
  showVendorDataEditMode: false,
  vendorBlockLoading: false,
  addvendorLoading: false,

  showAddAddress: false,
  showAddressDataViewMode: false,
  showAddressDataEditMode: false,
  editAddressLoading: false,

  showComplianceInfo: false,
  showComplianceInfoViewMode: false,
  showComplianceInfoEditMode: false,
  editComplianceLoading: false,

  showPaymentData: false,
  showEditPaymentData: false,
  showPaymentsCurreSupprtedAddMode: false,
  showPaymentsCurreSupprtedEditMode: false,
  selectedRecordToEdit: {},
  paymentLoading: false,

  showVendorFXAddMode: false,
  showEditFXData: false,
  showFXCurrPairAddMode: false,
  showFXCurrPairEditMode: false,
  fxLoading: false,

  showVendorFeeAddMode: false,
  showEditLocalAccountsData: false,
  showVendorFeeEditMode: false,
  showVendorLocalAccountAddMode: false,
  localAccountsLoading: false,
}

export default function vendorConfig(state = initialState, action) {
  switch (action.type) {
    case actions.GET_ALL_VENDOR_CONFIGURATION:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_ALL_VENDOR_CONFIGURATION_SUCCESS:
      return {
        ...state,
        allVendorConfiguration: action.value,
        loading: false,
        totalPages: action.total,
      }

    case actions.GET_ALL_VENDOR_CONFIGURATION_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.GET_VENDOR_CONFIGURATION_BY_FILTERS:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_VENDOR_CONFIGURATION_BY_FILTERS_SUCCESS:
      return {
        ...state,
        allVendorConfiguration: action.value,
        loading: false,
        totalPages: action.total,
      }

    case actions.GET_VENDOR_CONFIGURATION_BY_FILTERS_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID:
      return {
        ...state,
        loading: true,
      }

    case actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID_SUCCESS:
      return {
        ...state,
        selectedVendorConfig: action.value,
        loading: false,
      }
    case actions.GET_VENDOR_CONFIGURATION_DATA_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.ADD_NEW_VENDOR_CONFIGURATION:
      return {
        ...state,
        addvendorLoading: true,
      }

    case actions.ADD_NEW_VENDOR_CONFIGURATION_SUCCESS:
      return {
        ...state,
        selectedVendorConfig: action.value,
        showComplianceInfoViewMode: true,
        addvendorLoading: false,
      }

    case actions.ADD_NEW_VENDOR_CONFIGURATION_FAILURE:
      return {
        ...state,
        addvendorLoading: false,
      }

    case actions.UPDATE_VENDOR_DATA:
      return {
        ...state,
        vendorBlockLoading: true,
      }

    case actions.UPDATE_VENDOR_DATA_SUCCESS:
      return {
        ...state,
        selectedVendorConfig: action.value,
        showVendorAddMode: false,
        showVendorDataEditMode: false,
        showVendorDataViewMode: true,
        vendorBlockLoading: false,
      }

    case actions.UPDATE_VENDOR_DATA_FAILURE:
      return {
        ...state,
        vendorBlockLoading: false,
      }

    case actions.UPDATE_VENDOR_DATA_EDIT_MODE:
      return {
        ...state,
        showVendorAddMode: false,
        showVendorDataEditMode: action.value,
        showVendorDataViewMode: false,
      }

    case actions.UPDATE_VENDOR_ADDRESS:
      return {
        ...state,
        editAddressLoading: true,
      }

    case actions.UPDATE_VENDOR_ADDRESS_SUCCESS:
      return {
        ...state,
        selectedVendorConfig: action.value,
        showComplianceInfo: true,
        showAddressDataViewMode: true,
        showAddressDataEditMode: false,
        showAddAddress: false,
        editAddressLoading: false,
      }

    case actions.UPDATE_VENDOR_ADDRESS_FAILURE:
      return {
        ...state,
        editAddressLoading: false,
      }

    case actions.UPDATE_VENDOR_COMPLIANANCE_INFO:
      return {
        ...state,
        editComplianceLoading: true,
      }

    case actions.UPDATE_VENDOR_COMPLIANANCE_INFO_SUCCESS:
      return {
        ...state,
        selectedVendorConfig: action.value,
        showComplianceInfoEditMode: false,
        showComplianceInfoViewMode: true,
        editComplianceLoading: false,
      }

    case actions.UPDATE_VENDOR_COMPLIANANCE_INFO_FAILURE:
      return {
        ...state,
        editComplianceLoading: false,
      }

    case actions.UPDATE_ADDRESS_ADD_MODE:
      return {
        ...state,

        showAddressDataViewMode: false,
        showAddressDataEditMode: false,
        showAddAddress: action.value,
      }

    case actions.UPDATE_ADDRESS_EDIT_MODE:
      return {
        ...state,
        showAddressDataEditMode: action.value,
      }

    case actions.UPDATE_COMPLIANCE_EDIT_MODE:
      return {
        ...state,
        showComplianceInfoViewMode: false,
        showComplianceInfoEditMode: action.value,
      }
    case actions.DELETE_VENDOR_CONFIGURATION:
      return {
        ...state,
        loading: true,
      }

    case actions.DELETE_VENDOR_CONFIGURATION_SUCCESS:
      return {
        ...state,
        // selectedVendorConfig: action.value,
        loading: false,
      }

    case actions.DELETE_VENDOR_CONFIGURATION_FAILURE:
      return {
        ...state,
        loading: false,
      }

    // Payments

    case actions.UPDATE_VENDOR_PAYMNET_ADD_MODE:
      return {
        ...state,
        showPaymentData: action.value,
      }

    case actions.UPDATE_VENDOR_PAYMENT_EDIT_MODE:
      return {
        ...state,
        showEditPaymentData: action.value,
      }

    case actions.UPDATE_ADD_PAYMNET_CURRENCY_SUPP_ADD_MODE:
      return {
        ...state,
        showPaymentsCurreSupprtedAddMode: action.value,
      }

    case actions.ADD_VENDOR_PAYMENTS_DATA:
      return {
        ...state,
        paymentLoading: true,
      }

    case actions.ADD_VENDOR_PAYMENTS_DATA_SUCCESS:
      return {
        ...state,
        showPaymentData: false,
        selectedVendorConfig: action.value,
        paymentLoading: false,
      }

    case actions.ADD_VENDOR_PAYMENTS_DATA_FAILURE:
      return {
        ...state,
        paymentLoading: false,
      }

    case actions.EDIT_VENDOR_PAYMENTS_DATA:
      return {
        ...state,
        paymentLoading: true,
      }

    case actions.EDIT_VENDOR_PAYMENTS_DATA_SUCCESS:
      return {
        ...state,
        showEditPaymentData: false,
        selectedVendorConfig: action.value,
        paymentLoading: false,
      }

    case actions.EDIT_VENDOR_PAYMENTS_DATA_FAILURE:
      return {
        ...state,
        paymentLoading: false,
      }

    case actions.ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED:
      return {
        ...state,
        paymentLoading: true,
      }

    case actions.ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED_SUCCESS:
      return {
        ...state,
        showPaymentsCurreSupprtedAddMode: false,
        showPaymentsCurreSupprtedEditMode: false,
        selectedVendorConfig: action.value,
        paymentLoading: false,
      }

    case actions.ADD_NEW_PAYMENTS_CURRENCIES_SUPPORTED_FAILURE:
      return {
        ...state,
        paymentLoading: false,
      }

    case actions.UPDATE_PAYMNET_CURRENCY_SUPP_EDIT_MODE:
      return {
        ...state,
        showPaymentsCurreSupprtedEditMode: action.value,
      }

    case actions.UPDATE_VENDOR_CONFIG_VIEW_PAGE:
      return {
        ...state,
        showVendorDataViewMode: true,
        showVendorDataEditMode: false,

        showAddressDataViewMode: true,
        showAddressDataEditMode: false,
        showComplianceInfoEditMode: false,
        showComplianceInfoViewMode: true,
        showPaymentsCurreSupprtedAddMode: false,
        showPaymentsCurreSupprtedEditMode: false,
        showFXCurrPairAddMode: false,
        showFXCurrPairEditMode: false,
        showVendorFeeEditMode: false,
        showVendorFeeAddMode: false,
        showPaymentData: false,
        showVendorFXAddMode: false,
        showVendorLocalAccountAddMode: false,
      }

    case actions.UPDATE_SELECTED_RECORD_TO_EDIT:
      return {
        ...state,
        selectedRecordToEdit: action.value,
      }

    case actions.EDIT_PAYMENTS_CURRENCIES_SUPPORTED:
      return {
        ...state,
        paymentLoading: true,
      }

    case actions.EDIT_PAYMENTS_CURRENCIES_SUPPORTED_SUCCESS:
      return {
        ...state,
        selectedVendorConfig: action.value,
        showPaymentsCurreSupprtedEditMode: false,
        paymentLoading: false,
      }
    case actions.EDIT_PAYMENTS_CURRENCIES_SUPPORTED_FAILURE:
      return {
        ...state,
        paymentLoading: true,
      }

    case actions.DELETE_P_CURRENCY_SUPPORTED:
      return {
        ...state,
        paymentLoading: true,
      }

    case actions.DELETE_P_CURRENCY_SUPPORTED_SUCCESS:
      return {
        ...state,
        // selectedVendorConfig: action.value,
        paymentLoading: false,
      }

    case actions.DELETE_P_CURRENCY_SUPPORTED_FAILURE:
      return {
        ...state,
        paymentLoading: false,
      }
    // Fx
    case actions.UPDATE_VENDOR_FX_DATA_ADD_MODE:
      return {
        ...state,
        showVendorFXAddMode: action.value,
      }
    case actions.UPDATE_ADD_FX_CURRENCY_PAIR_EDIT_MODE:
      return {
        ...state,
        showFXCurrPairEditMode: action.value,
        showFXCurrPairAddMode: false,
      }

    case actions.UPDATE_ADD_FX_CURRENCY_PAIR_ADD_MODE:
      return {
        ...state,
        showFXCurrPairAddMode: action.value,
        showFXCurrPairEditMode: false,
      }

    case actions.ADD_VENDOR_FX_DATA:
      return {
        ...state,
        fxLoading: true,
      }
    case actions.ADD_VENDOR_FX_DATA_SUCCESS:
      return {
        ...state,
        showVendorFXAddMode: false,
        selectedVendorConfig: action.value,
        fxLoading: false,
      }
    case actions.ADD_VENDOR_FX_DATA_FAILURE:
      return {
        ...state,
        fxLoading: false,
      }

    case actions.EDIT_VENDOR_FX_DATA:
      return {
        ...state,
        fxLoading: true,
      }
    case actions.EDIT_VENDOR_FX_DATA_SUCCESS:
      return {
        ...state,
        showEditFXData: false,
        selectedVendorConfig: action.value,
        fxLoading: false,
      }
    case actions.EDIT_VENDOR_FX_DATA_FAILURE:
      return {
        ...state,
        fxLoading: false,
      }

    case actions.ADD_NEW_FX_CURRENCY_PAIR:
      return {
        ...state,
        fxLoading: true,
      }

    case actions.ADD_NEW_FX_CURRENCY_PAIR_SUCCESS:
      return {
        ...state,
        showFXCurrPairAddMode: false,
        selectedVendorConfig: action.value,
        fxLoading: false,
      }
    case actions.ADD_NEW_FX_CURRENCY_PAIR_FAILURE:
      return {
        ...state,
        fxLoading: false,
      }

    case actions.EDIT_FX_CURRENCY_PAIR:
      return {
        ...state,
        fxLoading: true,
      }
    case actions.EDIT_FX_CURRENCY_PAIR_SUCCESS:
      return {
        ...state,
        showFXCurrPairEditMode: false,
        selectedVendorConfig: action.value,
        fxLoading: false,
      }
    case actions.EDIT_FX_CURRENCY_PAIR_FAILURE:
      return {
        ...state,
        fxLoading: false,
      }

    case actions.DELETE_SELECTED_VENDOR_CURRENCY_PAIR:
      return {
        ...state,
        fxLoading: true,
      }

    case actions.DELETE_SELECTED_VENDOR_CURRENCY_PAIR_SUCCESS:
      return {
        ...state,
        // selectedVendorConfig: action.value,
        fxLoading: false,
      }

    case actions.DELETE_SELECTED_VENDOR_CURRENCY_PAIR_FAILURE:
      return {
        ...state,
        fxLoading: false,
      }

    // Local Accounts

    case actions.UPDATE_ADD_FEE_EDIT_MODE:
      return {
        ...state,
        showVendorFeeEditMode: action.value,
        showVendorFeeAddMode: false,
      }

    case actions.UPDATE_ADD_FEE_ADD_MODE:
      return {
        ...state,
        showVendorFeeEditMode: false,
        showVendorFeeAddMode: action.value,
      }

    case actions.UPDATE_VENDOR_LOCAL_ACCOUNT_ADD_MODE:
      return {
        ...state,
        showVendorLocalAccountAddMode: action.value,
      }

    case actions.ADD_VENDOR_LOCAL_ACCOUNT_DATA:
      return {
        ...state,
        localAccountsLoading: true,
      }

    case actions.ADD_VENDOR_LOCAL_ACCOUNT_DATA_SUCCESS:
      return {
        ...state,
        showVendorLocalAccountAddMode: false,
        selectedVendorConfig: action.value,
        localAccountsLoading: false,
      }
    case actions.ADD_VENDOR_LOCAL_ACCOUNT_DATA_FAILURE:
      return {
        ...state,
        localAccountsLoading: false,
      }

    case actions.EDIT_VENDOR_LOCAL_ACCOUNT_DATA:
      return {
        ...state,
        localAccountsLoading: true,
      }

    case actions.EDIT_VENDOR_LOCAL_ACCOUNT_DATA_SUCCESS:
      return {
        ...state,
        showEditLocalAccountsData: false,
        selectedVendorConfig: action.value,
        localAccountsLoading: false,
      }
    case actions.EDIT_VENDOR_LOCAL_ACCOUNT_DATA_FAILURE:
      return {
        ...state,
        localAccountsLoading: false,
      }

    case actions.ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR:
      return {
        ...state,
        localAccountsLoading: true,
      }
    case actions.ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR_SUCCESS:
      return {
        ...state,
        showVendorFeeAddMode: false,
        selectedVendorConfig: action.value,
        localAccountsLoading: false,
      }
    case actions.ADD_NEW_LOCAL_ACCOUNT_FEE_PAIR_FAILURE:
      return {
        ...state,
        localAccountsLoading: false,
      }
    case actions.EDIT_LOCAL_ACCOUNT_FEE_PAIR:
      return {
        ...state,
        localAccountsLoading: true,
      }
    case actions.EDIT_LOCAL_ACCOUNT_FEE_PAIR_SUCCESS:
      return {
        ...state,
        showVendorFeeEditMode: false,
        selectedVendorConfig: action.value,
        localAccountsLoading: false,
      }
    case actions.EDIT_LOCAL_ACCOUNT_FEE_PAIR_FAILURE:
      return {
        ...state,
        localAccountsLoading: false,
      }

    case actions.DELETE_SELECTED_FEE_RECORD:
      return {
        ...state,
        localAccountsLoading: true,
      }
    case actions.DELETE_SELECTED_FEE_RECORD_SUCCESS:
      return {
        ...state,
        // selectedVendorConfig: action.value,
        localAccountsLoading: false,
      }

    case actions.DELETE_SELECTED_FEE_RECORD_FAILURE:
      return {
        ...state,
        localAccountsLoading: false,
      }

    case actions.UPDATE_VENDOR_FX_EDIT_MODE:
      return {
        ...state,
        showEditFXData: action.value,
      }

    case actions.UPDATE_VENDOR_LOCAL_ACCOUNT_EDIT_MODE:
      return {
        ...state,
        showEditLocalAccountsData: action.value,
      }

    default:
      return state
  }
}
