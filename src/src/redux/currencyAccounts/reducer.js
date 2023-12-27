import actions from './action'
import generalAction from '../general/actions'
import {
  transformCAList,
  transformVendorCAList,
  transformErrorData,
} from '../../utilities/transformer'

const initialState = {
  // client balances
  clientAccounts: [],
  selectedAccount: {},
  companyAccounts: [],
  // p&l balances
  plAccounts: [],

  // vendor balances
  vendorAccounts: [],

  allVendorClientVendorPlAccounts: [],
  // common
  vendors: [],
  clients: [],
  totalPages: 0,
  totalAccountList: 0,
  CAlistLoading: false,
  modalVisible: false,
  addCALoading: false,
  selectedCurrencyData: undefined,

  // filters
  accountsFilters: {
    selectedAccountType: undefined,
    selectedCurrency: undefined,
    selectedOnwerEntityId: undefined,
    selectedIssuerEntityId: undefined,
  },

  selectedType: '',

  // New Version 2
  showAddAccountDetails: false,
  showAddExternalReference: false,
  showEditExternalReference: false,
  showAddAccountLimits: false,
  showEditAccountLimits: false,
  showAddExoticFXConfig: false,
  showEditExoticFX: false,

  selectedRecordToEdit: {},

  initialCADataEditMode: false,
  allPaymentsAccountsList: [],
  listLoading: false,

  selectedCurrencyAccount: {},
  addAccountLoading: false,

  addAccountIdentifierLoading: false,
  addExternalRefLoading: false,
  addExoticConfigLoading: false,
  addThresholdsLoading: false,

  clientListloading: false,
  vendorListLoading: false,
  companiesListLoading: false,
  introducersListLoading: false,

  errorList: [],

  filtersSelected: {
    limit: 0,
    activePage: 1,
    selectedAccountType: undefined,
    selectedCurrency: undefined,
    selectedOnwerEntityId: undefined,
    selectedIssuerEntityId: undefined,
  },
}

export default function balancesReducer(state = initialState, action) {
  const { clients, vendors } = state
  switch (action.type) {
    case generalAction.GET_CLIENTS: {
      return {
        ...state,
        clientListloading: true,
      }
    }

    case generalAction.GET_CLIENTS_FAILURE: {
      return {
        ...state,
        clientListloading: false,
      }
    }

    case generalAction.GET_CLIENTS_SUCCESS: {
      return {
        ...state,
        clients: action.value,
        clientListloading: false,
      }
    }

    case generalAction.GET_VENDORS_SUCCESS:
      return {
        ...state,
        vendors: action.value.vendors,
      }

    // filters
    case actions.SET_ACCOUNTS_FILTERS:
      return {
        ...state,
        accountsFilters: {
          ...state.accountsFilters,
          ...action.value,
        },
      }

    case actions.GET_CLIENT_ACCOUNTS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_CLIENT_ACCOUNTS_SUCCESS:
      return {
        ...state,
        clientAccounts: transformCAList(clients, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_CLIENT_ACCOUNTS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
        clientAccounts: [],
      }

    case actions.GET_P_AND_L_ACCOUNTS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_P_AND_L_ACCOUNTS_SUCCESS:
      return {
        ...state,
        plAccounts: transformCAList(clients, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_P_AND_L_ACCOUNTS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
        plAccounts: [],
      }

    // remove

    case actions.GET_VENDOR_ACCOUNTS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_VENDOR_ACCOUNTS_SUCCESS:
      return {
        ...state,
        vendorAccounts: transformVendorCAList(vendors, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_VENDOR_ACCOUNTS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
        vendorAccounts: [],
      }

    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_BY_FILTERS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_BY_FILTERS_SUCCESS:
      return {
        ...state,
        vendorAccounts: transformVendorCAList(vendors, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_BY_FILTERS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
      }

    // new
    case actions.GET_ALL_VENDOR_CLIENT_ACCOUNTS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_ALL_VENDOR_CLIENT_ACCOUNTS_SUCCESS:
      return {
        ...state,
        vendorAccounts: transformVendorCAList(vendors, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_ALL_VENDOR_CLIENT_ACCOUNTS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
        vendorAccounts: [],
      }

    case actions.GET_ALL_VENDOR_CLIENT_VENDOR_PL_ACCOUNTS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_ALL_VENDOR_CLIENT_VENDOR_PL_ACCOUNTS_SUCCESS:
      return {
        ...state,
        allVendorClientVendorPlAccounts: action.value.vendorAccounts,
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_ALL_VENDOR_CLIENT_VENDOR_PL_ACCOUNTS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
        allVendorClientVendorPlAccounts: [],
      }

    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_CLIENT_BY_FILTERS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_CLIENT_BY_FILTERS_SUCCESS:
      return {
        ...state,
        vendorAccounts: transformVendorCAList(vendors, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_CLIENT_BY_FILTERS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
      }

    // venodr PL

    case actions.GET_ALL_VENDOR_PL_ACCOUNTS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_ALL_VENDOR_PL_ACCOUNTS_SUCCESS:
      return {
        ...state,
        vendorAccounts: transformVendorCAList(vendors, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_ALL_VENDOR_PL_ACCOUNTS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
        vendorAccounts: [],
      }

    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_PL_BY_FILTERS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_PL_BY_FILTERS_SUCCESS:
      return {
        ...state,
        vendorAccounts: transformVendorCAList(vendors, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_CURRENCY_ACCOUNTS_OF_VENDOR_PL_BY_FILTERS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
      }

    case actions.UPDATE_SELECED_ACCOUNT:
      return {
        ...state,
        selectedAccount: action.value,
      }
    case actions.GET_CURRENCY_ACCOUNTS_OF_CLIENT_BY_FILTERS:
      return {
        ...state,
        CAlistLoading: true,
      }

    case actions.GET_CURRENCY_ACCOUNTS_OF_CLIENT_BY_FILTERS_SUCCESS:
      return {
        ...state,
        clientAccounts: transformCAList(clients, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_CURRENCY_ACCOUNTS_OF_CLIENT_BY_FILTERS_FAILURE:
      return {
        ...state,
        clientAccounts: [],
        CAlistLoading: false,
      }
    case actions.SHOW_CURRENCY_LIST_MODAL:
      return {
        ...state,
        modalVisible: true,
      }
    case actions.CLOSE_CURRENCY_LIST_MODAL:
      return {
        ...state,
        modalVisible: false,
      }
    case actions.ADD_ACCOUNT_BY_CURRENCY:
      return {
        ...state,
        addCALoading: true,
      }

    case actions.ADD_ACCOUNT_BY_CURRENCY_SUCCESS:
      return {
        ...state,
        addCALoading: false,
      }
    case actions.ADD_ACCOUNT_BY_CURRENCY_FAILURE:
      return {
        ...state,

        addCALoading: false,
      }

    // Vendor CA

    case actions.ADD_VENDOR_CA_BY_CURRENCY:
      return {
        ...state,
        addCALoading: true,
      }

    case actions.ADD_VENDOR_CA_BY_CURRENCY_SUCCESS:
      return {
        ...state,
        addCALoading: false,
      }
    case actions.ADD_VENDOR_CA_BY_CURRENCY_FAILURE:
      return {
        ...state,

        addCALoading: false,
      }
    // Vendor Client CA
    case actions.ADD_VENDOR_CLIENT_CA_BY_CURRENCY:
      return {
        ...state,
        addCALoading: true,
      }

    case actions.ADD_VENDOR_CLIENT_CA_BY_CURRENCY_SUCCESS:
      return {
        ...state,
        addCALoading: false,
      }
    case actions.ADD_VENDOR_CLIENT_CA_BY_CURRENCY_FAILURE:
      return {
        ...state,

        addCALoading: false,
      }
    // vendor PL CA
    case actions.ADD_VENDOR__PL_CA_BY_CURRENCY:
      return {
        ...state,
        addCALoading: true,
      }

    case actions.ADD_VENDOR__PL_CA_BY_CURRENCY_SUCCESS:
      return {
        ...state,
        addCALoading: false,
      }
    case actions.ADD_VENDOR__PL_CA_BY_CURRENCY_FAILURE:
      return {
        ...state,
        addCALoading: false,
      }

    // P & L CA

    case actions.ADD_PL_CA_BY_CURRENCY:
      return {
        ...state,
        addCALoading: true,
      }

    case actions.ADD_PL_CA_BY_CURRENCY_SUCCESS:
      return {
        ...state,
        addCALoading: false,
      }
    case actions.ADD_PL_CA_BY_CURRENCY_FAILURE:
      return {
        ...state,

        addCALoading: false,
      }

    case actions.GET_P_AND_L_ACCOUNTS_BY_FILTERS:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_P_AND_L_ACCOUNTS_BY_FILTERS_SUCCESS:
      return {
        ...state,
        plAccounts: transformCAList(clients, action.value.currencyAccounts),
        totalPages: action.value.total,
        CAlistLoading: false,
      }
    case actions.GET_P_AND_L_ACCOUNTS_BY_FILTERS_FAILURE:
      return {
        ...state,
        CAlistLoading: false,
      }

    case actions.UPDATE_SELECED_TYPE:
      return {
        ...state,
        selectedType: action.value,
      }

    case actions.UPDATE_SELECTED_CURRENCY_DATA:
      return {
        ...state,
        selectedCurrencyData: action.value,
      }
    case actions.GET_CLIENT_CA_BY_ID:
      return {
        ...state,
        CAlistLoading: true,
      }

    case actions.GET_CLIENT_CA_BY_ID_SUCCESS:
      return {
        ...state,
        clientAccounts: action.value.clientAccounts,
        CAlistLoading: false,
      }
    case actions.GET_CLIENT_CA_BY_ID_FAILURE:
      return {
        ...state,
        clientAccounts: [],
        CAlistLoading: false,
      }

    case actions.GET_PL_CA_BY_ID:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_PL_CA_BY_ID_SUCCESS:
      return {
        ...state,
        companyAccounts: action.value.plAccounts,
        CAlistLoading: false,
      }
    case actions.GET_PL_CA_BY_ID_FAILURE:
      return {
        ...state,
        companyAccounts: [],
        CAlistLoading: false,
      }

    case actions.GET_SUSPENSE_CA_BY_ID:
      return {
        ...state,
        CAlistLoading: true,
      }
    case actions.GET_SUSPENSE_CA_BY_ID_SUCCESS:
      return {
        ...state,
        companyAccounts: action.value.suspenseAccounts,
        CAlistLoading: false,
      }
    case actions.GET_SUSPENSE_CA_BY_ID_FAILURE:
      return {
        ...state,
        companyAccounts: [],
        CAlistLoading: false,
      }

    // nEw version

    case actions.ADD_ACCOUNT_DETAILS_VISIBLE:
      return {
        ...state,
        showAddAccountDetails: action.value,
        errorList: [],
      }

    case actions.ADD_EXTERNAL_REFERENCES_VISIBLE:
      return {
        ...state,
        showAddExternalReference: action.value,
      }

    case actions.ADD_ACCOUNT_LIMITS_VISIBLE:
      return {
        ...state,
        showAddAccountLimits: action.value,
      }

    case actions.EDIT_ACCOUNT_LIMITS_VISIBLE:
      return {
        ...state,
        showEditAccountLimits: action.value,
      }

    case actions.ADD_EXOTIC_FX_CONFIG_VISIBLE:
      return {
        ...state,
        showAddExoticFXConfig: action.value,
      }

    case actions.CA_INITIAL_DATA_EDIT_MODE:
      return {
        ...state,
        initialCADataEditMode: action.value,
      }

    case actions.GET_ALL_PAYMENT_ACCOUNTS:
      return {
        ...state,
        listLoading: true,
      }

    case actions.GET_ALL_PAYMENT_ACCOUNTS_SUCCESS:
      return {
        ...state,
        allPaymentsAccountsList: action.value,
        totalPages: action.total,
        totalAccountList: action.total,
        listLoading: false,
      }

    case actions.GET_ALL_PAYMENT_ACCOUNTS_FAILURE:
      return {
        ...state,
        listLoading: false,
      }

    case actions.GET_PAYMENT_ACCOUNTS_BY_FILTERS:
      return {
        ...state,
        listLoading: true,
      }

    case actions.GET_PAYMENT_ACCOUNTS_BY_FILTERS_SUCCESS:
      return {
        ...state,
        allPaymentsAccountsList: action.value,
        totalPages: action.total,
        totalAccountList: action.total,
        listLoading: false,
      }

    case actions.GET_PAYMENT_ACCOUNTS_BY_FILTERS_FAILURE:
      return {
        ...state,
        listLoading: false,
      }
    // add new account

    case actions.ADD_NEW_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.ADD_NEW_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.ADD_NEW_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.EDIT_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.EDIT_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
        initialCADataEditMode: false,
      }
    case actions.EDIT_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
      }

    case actions.DELETE_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.DELETE_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.DELETE_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
      }

    // Account Identification

    case actions.ADD_NEW_ACCOUNT_IDENTIFICATION:
      return {
        ...state,
        addAccountIdentifierLoading: true,
      }

    case actions.ADD_NEW_ACCOUNT_IDENTIFICATION_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountIdentifierLoading: false,
        showAddAccountDetails: false,
      }
    case actions.ADD_NEW_ACCOUNT_IDENTIFICATION_FAILURE:
      return {
        ...state,
        addAccountIdentifierLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.DELETE_ACCOUNT_IDENTIFICATION:
      return {
        ...state,
        addAccountIdentifierLoading: true,
      }

    case actions.DELETE_ACCOUNT_IDENTIFICATION_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountIdentifierLoading: false,
      }
    case actions.DELETE_ACCOUNT_IDENTIFICATION_FAILURE:
      return {
        ...state,
        addAccountIdentifierLoading: false,
      }

    // Account Threshold

    case actions.ADD_NEW_ACCOUNT_THRESHOLD:
      return {
        ...state,
        addThresholdsLoading: true,
      }
    case actions.ADD_NEW_ACCOUNT_THRESHOLD_SUCCESS:
      return {
        ...state,
        addThresholdsLoading: false,
        selectedCurrencyAccount: action.value,
        showAddAccountLimits: false,
      }

    case actions.ADD_NEW_ACCOUNT_THRESHOLD_FAILURE:
      return {
        ...state,
        addThresholdsLoading: false,
      }

    case actions.DELETE_ACCOUNT_THRESHOLD_BY_ID:
      return {
        ...state,
        addThresholdsLoading: true,
      }

    case actions.DELETE_ACCOUNT_THRESHOLD_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addThresholdsLoading: false,
      }
    case actions.DELETE_ACCOUNT_THRESHOLD_BY_ID_FAILURE:
      return {
        ...state,

        addThresholdsLoading: false,
      }

    // exotic FX config

    case actions.ADD_NEW_EXOTIC_FX_CONFIG:
      return {
        ...state,

        addExoticConfigLoading: true,
      }
    case actions.ADD_NEW_EXOTIC_FX_CONFIG_SUCCESS:
      return {
        ...state,
        addExoticConfigLoading: false,
        selectedCurrencyAccount: action.value,
        showAddExoticFXConfig: false,
      }

    case actions.ADD_NEW_EXOTIC_FX_CONFIG_FAILURE:
      return {
        ...state,
        addExoticConfigLoading: false,
      }

    case actions.DELETE_EXOTIC_FX_CONFIG_BY_ID:
      return {
        ...state,
        addExoticConfigLoading: true,
      }
    case actions.DELETE_EXOTIC_FX_CONFIG_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExoticConfigLoading: false,
      }

    case actions.DELETE_EXOTIC_FX_CONFIG_BY_ID_FAILURE:
      return {
        ...state,
        addExoticConfigLoading: false,
      }
    // External Reference

    case actions.ADD_NEW_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.ADD_NEW_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showAddExternalReference: false,
      }

    case actions.ADD_NEW_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.DELETE_ACCOUNT_REFERENCE_BY_ID:
      return {
        ...state,
        addExternalRefLoading: true,
      }

    case actions.DELETE_ACCOUNT_REFERENCE_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
      }
    case actions.DELETE_ACCOUNT_REFERENCE_BY_ID_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    //

    case generalAction.GET_NEW_VENDORS_LIST: {
      return {
        ...state,
        vendorListLoading: true,
      }
    }

    case generalAction.GET_NEW_VENDORS_LIST_SUCCESS: {
      return {
        ...state,
        vendorListLoading: false,
      }
    }

    case generalAction.GET_NEW_VENDORS_LIST_FAILURE: {
      return {
        ...state,
        vendorListLoading: false,
      }
    }

    case generalAction.GET_COMPANIES_LIST: {
      return {
        ...state,
        companiesListLoading: true,
      }
    }

    case generalAction.GET_COMPANIES_LIST_SUCCESS: {
      return {
        ...state,
        companiesListLoading: false,
      }
    }

    case generalAction.GET_COMPANIES_LIST_FAILURE: {
      return {
        ...state,
        companiesListLoading: false,
      }
    }

    case actions.GET_PAYMENT_ACCOUNT_DETAILS_BY_ID: {
      return {
        ...state,
        loading: true,
      }
    }

    case actions.GET_PAYMENT_ACCOUNT_DETAILS_BY_ID_SUCCESS: {
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        loading: false,
      }
    }

    case actions.GET_PAYMENT_ACCOUNT_DETAILS_BY_ID_FAILURE: {
      return {
        ...state,
        loading: false,
      }
    }

    case actions.UPDATE_ACCOUNT_ERROR_LIST:
      return {
        ...state,
        errorList: action.value,
      }

    case actions.UPDATE_FILTERS_SELECTED:
      return {
        ...state,
        filtersSelected: action.value,
      }

    // Version 3

    case actions.EDIT_EXTERNAL_REFERENCES_VISIBLE:
      return {
        ...state,
        addExternalRefLoading: false,
        showEditExternalReference: action.value,
      }
    // Client Accounts
    case actions.ADD_NEW_CLIENT_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.ADD_NEW_CLIENT_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.ADD_NEW_CLIENT_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.EDIT_CLIENT_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.EDIT_CLIENT_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
        initialCADataEditMode: false,
      }
    case actions.EDIT_CLIENT_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.DELETE_CLIENT_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.DELETE_CLIENT_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.DELETE_CLIENT_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
      }

    // client External Reference

    case actions.ADD_NEW_CLIENT_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.ADD_NEW_CLIENT_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showAddExternalReference: false,
      }

    case actions.ADD_NEW_CLIENT_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.EDIT_CLIENT_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.EDIT_CLIENT_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showEditExternalReference: false,
      }

    case actions.EDIT_CLIENT_EXTERNAL_REFERENCE_SUCCESS_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.DELETE_CLIENT_EXTERNAL_REFERENCE_BY_ID:
      return {
        ...state,
        addExternalRefLoading: true,
      }

    case actions.DELETE_CLIENT_EXTERNAL_REFERENCE_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
      }
    case actions.DELETE_CLIENT_EXTERNAL_REFERENCE_BY_ID_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.ADD_NEW_CLIENT_ACCOUNT_THRESHOLD:
      return {
        ...state,
        addThresholdsLoading: true,
      }
    case actions.ADD_NEW_CLIENT_ACCOUNT_THRESHOLD_SUCCESS:
      return {
        ...state,
        addThresholdsLoading: false,
        selectedCurrencyAccount: action.value,
        showAddAccountLimits: false,
      }

    case actions.ADD_NEW_CLIENT_ACCOUNT_THRESHOLD_FAILURE:
      return {
        ...state,
        addThresholdsLoading: false,
      }

    case actions.EDIT_CLIENT_ACCOUNT_THRESHOLD:
      return {
        ...state,
        addThresholdsLoading: true,
      }
    case actions.EDIT_CLIENT_ACCOUNT_THRESHOLD_SUCCESS:
      return {
        ...state,
        addThresholdsLoading: false,
        selectedCurrencyAccount: action.value,
        showEditAccountLimits: false,
      }

    case actions.EDIT_CLIENT_ACCOUNT_THRESHOLD_FAILURE:
      return {
        ...state,
        addThresholdsLoading: false,
      }

    case actions.DELETE_CLIENT_ACCOUNT_THRESHOLD_BY_ID:
      return {
        ...state,
        addThresholdsLoading: true,
      }

    case actions.DELETE_CLIENT_ACCOUNT_THRESHOLD_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addThresholdsLoading: false,
      }
    case actions.DELETE_CLIENT_ACCOUNT_THRESHOLD_BY_ID_FAILURE:
      return {
        ...state,

        addThresholdsLoading: false,
      }

    case actions.UPDATE_ACCOUNT_SELECTED_RECORD_TO_EDIT:
      return {
        ...state,
        selectedRecordToEdit: action.value,
      }

    // PL Accounts

    case actions.ADD_NEW_PL_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.ADD_NEW_PL_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.ADD_NEW_PL_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.EDIT_PL_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.EDIT_PL_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
        initialCADataEditMode: false,
      }
    case actions.EDIT_PL_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.DELETE_PL_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.DELETE_PL_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.DELETE_PL_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
      }

    case actions.ADD_NEW_PL_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.ADD_NEW_PL_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showAddExternalReference: false,
      }

    case actions.ADD_NEW_PL_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.EDIT_PL_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.EDIT_PL_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showEditExternalReference: false,
      }

    case actions.EDIT_PL_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.DELETE_PL_EXTERNAL_REFERENCE_BY_ID:
      return {
        ...state,
        addExternalRefLoading: true,
      }

    case actions.DELETE_PL_EXTERNAL_REFERENCE_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
      }
    case actions.DELETE_PL_EXTERNAL_REFERENCE_BY_ID_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    // Vendor Client
    case actions.ADD_NEW_VENDOR_CLIENT_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.ADD_NEW_VENDOR_CLIENT_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.ADD_NEW_VENDOR_CLIENT_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.EDIT_VENDOR_CLIENT_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.EDIT_VENDOR_CLIENT_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
        initialCADataEditMode: false,
      }
    case actions.EDIT_VENDOR_CLIENT_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.DELETE_VENDOR_CLIENT_PAYMENT_ACCOUNT:
      return {
        ...state,
        addExternalRefLoading: true,
      }

    case actions.DELETE_VENDOR_CLIENT_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
      }
    case actions.DELETE_VENDOR_CLIENT_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    // Vendor client extrenal refernce

    case actions.ADD_NEW_VENDOR_CLIENT_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.ADD_NEW_VENDOR_CLIENT_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showAddExternalReference: false,
      }

    case actions.ADD_NEW_VENDOR_CLIENT_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.EDIT_VENDOR_CLIENT_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.EDIT_VENDOR_CLIENT_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showEditExternalReference: false,
      }

    case actions.EDIT_VENDOR_CLIENT_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.DELETE_VENDOR_CLIENT_EXTERNAL_REFERENCE_BY_ID:
      return {
        ...state,
        addExternalRefLoading: true,
      }

    case actions.DELETE_VENDOR_CLIENT_EXTERNAL_REFERENCE_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
      }
    case actions.DELETE_VENDOR_CLIENT_EXTERNAL_REFERENCE_BY_ID_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.ADD_NEW_VENDOR_CLIENT_ACCOUNT_THRESHOLD:
      return {
        ...state,
        addThresholdsLoading: true,
      }
    case actions.ADD_NEW_VENDOR_CLIENT_ACCOUNT_THRESHOLD_SUCCESS:
      return {
        ...state,
        addThresholdsLoading: false,
        selectedCurrencyAccount: action.value,
        showAddAccountLimits: false,
      }

    case actions.ADD_NEW_VENDOR_CLIENT_ACCOUNT_THRESHOLD_FAILURE:
      return {
        ...state,
        addThresholdsLoading: false,
      }

    case actions.EDIT_VENDOR_CLIENT_ACCOUNT_THRESHOLD:
      return {
        ...state,
        addThresholdsLoading: true,
      }
    case actions.EDIT_VENDOR_CLIENT_ACCOUNT_THRESHOLD_SUCCESS:
      return {
        ...state,
        addThresholdsLoading: false,
        selectedCurrencyAccount: action.value,
        showEditAccountLimits: false,
      }

    case actions.EDIT_VENDOR_CLIENT_ACCOUNT_THRESHOLD_FAILURE:
      return {
        ...state,
        addThresholdsLoading: false,
      }

    case actions.DELETE_VENDOR_CLIENT_ACCOUNT_THRESHOLD_BY_ID:
      return {
        ...state,
        addThresholdsLoading: true,
      }

    case actions.DELETE_VENDOR_CLIENT_ACCOUNT_THRESHOLD_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addThresholdsLoading: false,
      }
    case actions.DELETE_VENDOR_CLIENT_ACCOUNT_THRESHOLD_BY_ID_FAILURE:
      return {
        ...state,

        addThresholdsLoading: false,
      }

    case actions.ADD_NEW_VENDOR_CLIENT_EXOTIC_FX_CONFIG:
      return {
        ...state,

        addExoticConfigLoading: true,
      }
    case actions.ADD_NEW_VENDOR_CLIENT_EXOTIC_FX_CONFIG_SUCCESS:
      return {
        ...state,
        addExoticConfigLoading: false,
        selectedCurrencyAccount: action.value,
        showAddExoticFXConfig: false,
      }

    case actions.ADD_NEW_VENDOR_CLIENT_EXOTIC_FX_CONFIG_FAILURE:
      return {
        ...state,
        addExoticConfigLoading: false,
      }

    case actions.EDIT_VENDOR_CLIENT_EXOTIC_FX_CONFIG:
      return {
        ...state,

        addExoticConfigLoading: true,
      }
    case actions.EDIT_VENDOR_CLIENT_EXOTIC_FX_CONFIG_SUCCESS:
      return {
        ...state,
        addExoticConfigLoading: false,
        selectedCurrencyAccount: action.value,
        showEditExoticFX: false,
      }

    case actions.EDIT_VENDOR_CLIENT_EXOTIC_FX_CONFIG_FAILURE:
      return {
        ...state,
        addExoticConfigLoading: false,
      }

    case actions.EDIT_EXOTIC_FX_CONFIG_VISIBLE:
      return {
        ...state,
        showEditExoticFX: action.value,
      }

    // Vendor PL

    case actions.ADD_NEW_VENDOR_PL_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.ADD_NEW_VENDOR_PL_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.ADD_NEW_VENDOR_PL_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.EDIT_VENDOR_PL_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.EDIT_VENDOR_PL_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
        initialCADataEditMode: false,
      }
    case actions.EDIT_VENDOR_PL_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    // vendor Pl external ref

    case actions.ADD_NEW_VENDOR_PL_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.ADD_NEW_VENDOR_PL_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showAddExternalReference: false,
      }

    case actions.ADD_NEW_VENDOR_PL_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.EDIT_VENDOR_PL_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.EDIT_VENDOR_PL_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showEditExternalReference: false,
      }

    case actions.EDIT_VENDOR_PL_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.DELETE_VENDOR_PL_EXTERNAL_REFERENCE_BY_ID:
      return {
        ...state,
        addExternalRefLoading: true,
      }

    case actions.DELETE_VENDOR_PL_EXTERNAL_REFERENCE_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
      }
    case actions.DELETE_VENDOR_PL_EXTERNAL_REFERENCE_BY_ID_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.ADD_NEW_VENDOR_PL_ACCOUNT_THRESHOLD:
      return {
        ...state,
        addThresholdsLoading: true,
      }
    case actions.ADD_NEW_VENDOR_PL_ACCOUNT_THRESHOLD_SUCCESS:
      return {
        ...state,
        addThresholdsLoading: false,
        selectedCurrencyAccount: action.value,
        showAddAccountLimits: false,
      }

    case actions.ADD_NEW_VENDOR_PL_ACCOUNT_THRESHOLD_FAILURE:
      return {
        ...state,
        addThresholdsLoading: false,
      }

    case actions.EDIT_VENDOR_PL_ACCOUNT_THRESHOLD:
      return {
        ...state,
        addThresholdsLoading: true,
      }
    case actions.EDIT_VENDOR_PL_ACCOUNT_THRESHOLD_SUCCESS:
      return {
        ...state,
        addThresholdsLoading: false,
        selectedCurrencyAccount: action.value,
        showEditAccountLimits: false,
      }

    case actions.EDIT_VENDOR_PL_ACCOUNT_THRESHOLD_FAILURE:
      return {
        ...state,
        addThresholdsLoading: false,
      }

    case actions.DELETE_VENDOR_PL_ACCOUNT_THRESHOLD_BY_ID:
      return {
        ...state,
        addThresholdsLoading: true,
      }

    case actions.DELETE_VENDOR_PL_ACCOUNT_THRESHOLD_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addThresholdsLoading: false,
      }
    case actions.DELETE_VENDOR_PL_ACCOUNT_THRESHOLD_BY_ID_FAILURE:
      return {
        ...state,

        addThresholdsLoading: false,
      }

    case actions.ADD_NEW_VENDOR_PL_EXOTIC_FX_CONFIG:
      return {
        ...state,

        addExoticConfigLoading: true,
      }
    case actions.ADD_NEW_VENDOR_PL_EXOTIC_FX_CONFIG_SUCCESS:
      return {
        ...state,
        addExoticConfigLoading: false,
        selectedCurrencyAccount: action.value,
        showAddExoticFXConfig: false,
      }

    case actions.ADD_NEW_VENDOR_PL_EXOTIC_FX_CONFIG_FAILURE:
      return {
        ...state,
        addExoticConfigLoading: false,
      }

    case actions.EDIT_VENDOR_PL_EXOTIC_FX_CONFIG:
      return {
        ...state,

        addExoticConfigLoading: true,
      }
    case actions.EDIT_VENDOR_PL_EXOTIC_FX_CONFIG_SUCCESS:
      return {
        ...state,
        addExoticConfigLoading: false,
        selectedCurrencyAccount: action.value,
        showEditExoticFX: false,
      }

    case actions.EDIT_VENDOR_PL_EXOTIC_FX_CONFIG_FAILURE:
      return {
        ...state,
        addExoticConfigLoading: false,
      }

    // Suspense Accounts

    case actions.ADD_NEW_SUSPENSE_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.ADD_NEW_SUSPENSE_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.ADD_NEW_SUSPENSE_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.EDIT_SUSPENSE_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.EDIT_SUSPENSE_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
        initialCADataEditMode: false,
      }
    case actions.EDIT_SUSPENSE_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
        errorList: transformErrorData(action.payload['invalid-params']),
      }

    case actions.DELETE_SUSPENSE_PAYMENT_ACCOUNT:
      return {
        ...state,
        addAccountLoading: true,
      }

    case actions.DELETE_SUSPENSE_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addAccountLoading: false,
      }
    case actions.DELETE_SUSPENSE_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        addAccountLoading: false,
      }

    case actions.ADD_NEW_SUSPENSE_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.ADD_NEW_SUSPENSE_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showAddExternalReference: false,
      }

    case actions.ADD_NEW_SUSPENSE_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.EDIT_SUSPENSE_EXTERNAL_REFERENCE:
      return {
        ...state,
        addExternalRefLoading: true,
      }
    case actions.EDIT_SUSPENSE_EXTERNAL_REFERENCE_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
        showEditExternalReference: false,
      }

    case actions.EDIT_SUSPENSE_EXTERNAL_REFERENCE_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.DELETE_SUSPENSE_EXTERNAL_REFERENCE_BY_ID:
      return {
        ...state,
        addExternalRefLoading: true,
      }

    case actions.DELETE_SUSPENSE_EXTERNAL_REFERENCE_BY_ID_SUCCESS:
      return {
        ...state,
        selectedCurrencyAccount: action.value,
        addExternalRefLoading: false,
      }
    case actions.DELETE_SUSPENSE_EXTERNAL_REFERENCE_BY_ID_FAILURE:
      return {
        ...state,
        addExternalRefLoading: false,
      }

    case actions.UPDATE_ACCOUNTS_ERROR_LIST:
      return {
        ...state,
        errorList: action.value,
      }

    case generalAction.GET_INTRODUCERS: {
      return {
        ...state,
        introducersListLoading: true,
      }
    }

    case generalAction.GET_INTRODUCERS_SUCCESS: {
      return {
        ...state,
        introducersListLoading: false,
      }
    }

    case generalAction.GET_INTRODUCERS_FAILURE: {
      return {
        ...state,
        introducersListLoading: false,
      }
    }

    default:
      return state
  }
}
