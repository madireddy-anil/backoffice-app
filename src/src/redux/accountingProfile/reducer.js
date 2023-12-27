import actions from './actions'

const initialState = {
  allAccountingProfiles: [],

  selectedAccountingProfile: {},

  addProfileMode: false,
  viewAccountProfileMode: false,
  editProfileMode: false,

  isNewAccoutingProfile: true,

  addEntriesMode: false,
  editEntriesMode: false,
  selectedEntryRecord: {},

  loading: false,
  addEntryLoading: false,
  addloading: false,
}

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    case actions.ADD_NEW_ACCOUNTING_PROFILE_SUCCESS:
      return {
        ...state,
        addProfileMode: false,
        viewAccountProfileMode: true,
        editProfileMode: false,
        selectedAccountingProfile: action.value,
        addloading: true,
      }

    case actions.ADD_NEW_ACCOUNTING_PROFILE:
      return {
        ...state,
        addloading: true,
      }
    case actions.ADD_NEW_ACCOUNTING_PROFILE_FAILURE:
      return {
        ...state,
        addloading: false,
      }

    case actions.UPDATE_ADD_PROFILE_MODE:
      return {
        ...state,
        addProfileMode: action.value,
      }

    case actions.UPDATE_EDIT_PROFILE_MODE:
      return {
        ...state,
        editProfileMode: action.value,
        viewAccountProfileMode: false,
      }

    case actions.UPDATE_ACCOUNTING_PROFILE_SUCCESS:
      return {
        ...state,
        addProfileMode: false,
        viewAccountProfileMode: true,
        editProfileMode: false,
        selectedAccountingProfile: action.value,
        addloading: false,
      }

    case actions.UPDATE_ACCOUNTING_PROFILE:
      return {
        ...state,
        addloading: true,
      }
    case actions.UPDATE_ACCOUNTING_PROFILE_FAILURE:
      return {
        ...state,
        addloading: false,
      }
    case actions.GET_ALL_ACCOUNTING_PROFILES:
      return {
        ...state,
        loading: true,
      }

    case actions.GET_ALL_ACCOUNTING_PROFILES_SUCCESS:
      return {
        ...state,
        allAccountingProfiles: action.value,
        loading: false,
      }

    case actions.GET_ALL_ACCOUNTING_PROFILES_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.IS_NEW_ACCOUTING_PROFILE:
      return {
        ...state,
        isNewAccoutingProfile: action.value,
      }

    case actions.GET_ACCOUNTING_PROFILE_BY_ID:
      return {
        ...state,
        loading: true,
      }

    case actions.GET_ACCOUNTING_PROFILE_BY_ID_SUCCESS:
      return {
        ...state,
        selectedAccountingProfile: action.value,
        viewAccountProfileMode: true,
        editProfileMode: false,
        addProfileMode: false,
        addEntriesMode: false,
        loading: false,
      }

    case actions.GET_ACCOUNTING_PROFILE_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.UPDATE_ADD_ENTRIES_MODE:
      return {
        ...state,
        addEntriesMode: action.value,
      }

    case actions.UPDATE_EDIT_ENTRIES_MODE:
      return {
        ...state,
        editEntriesMode: action.value,
      }

    case actions.ADD_ACCOUNTING_PROFILE_ENTRY:
      return {
        ...state,
        addEntryLoading: true,
      }

    case actions.ADD_ACCOUNTING_PROFILE_ENTRY_SUCCESS:
      return {
        ...state,
        selectedAccountingProfile: action.value,
        editEntriesMode: false,
        addEntriesMode: false,
        addEntryLoading: false,
      }

    case actions.ADD_ACCOUNTING_PROFILE_ENTRY_FAILURE:
      return {
        ...state,
        addEntryLoading: false,
      }

    case actions.EDIT_ACCOUNTING_PROFILE_ENTRY:
      return {
        ...state,

        addEntryLoading: true,
      }

    case actions.EDIT_ACCOUNTING_PROFILE_ENTRY_FAILURE:
      return {
        ...state,

        addEntryLoading: false,
      }

    case actions.EDIT_ACCOUNTING_PROFILE_ENTRY_SUCCESS:
      return {
        ...state,
        selectedAccountingProfile: action.value,
        editEntriesMode: false,
        addEntriesMode: false,
        addEntryLoading: false,
      }

    case actions.DELETE_ACCOUNTING_ENTRY:
      return {
        ...state,
        loading: true,
      }

    case actions.DELETE_ACCOUNTING_ENTRY_SUCCESS:
      return {
        ...state,
        selectedAccountingProfile: action.value,
        loading: false,
      }

    case actions.DELETE_ACCOUNTING_ENTRY_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.UPDATE_SELCTED_ENTRY:
      return {
        ...state,
        selectedEntryRecord: action.value,
      }

    case actions.DELETE_ACCOUNTING_PROFILE:
      return {
        ...state,
        loading: true,
      }

    case actions.DELETE_ACCOUNTING_PROFILE_SUCCESS:
      return {
        ...state,
        selectedAccountingProfile: action.value,
        loading: false,
      }

    case actions.DELETE_ACCOUNTING_PROFILE_FAILURE:
      return {
        ...state,
        loading: false,
      }

    default:
      return state
  }
}
