import actions from './actions'

const initialState = {
  permissionsList: [],
  loading: false,
  selectedRecord: {},
  isPermissionAdded: true,
  isPermissionupdated: true,
  isPermissionDeleted: true,
  addPermissionModal: false,
  editPermissionModal: false,
}

export default function permissions(state = initialState, action) {
  switch (action.type) {
    // currency config

    case actions.ADD_VIEW_PERMISSION_MODAL:
      return {
        ...state,
        addPermissionModal: action.value,
      }
    case actions.ADD_CLOSE_PERMISSION_MODAL:
      return {
        ...state,
        addPermissionModal: action.value,
      }
    case actions.EDIT_VIEW_PERMISSION_MODAL:
      return {
        ...state,
        editPermissionModal: action.value,
      }
    case actions.EDIT_CLOSE_PERMISSION_MODAL:
      return {
        ...state,
        editPermissionModal: action.value,
      }
    case actions.GET_PERMISSIONS:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        permissionsList: action.value,
      }
    case actions.GET_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        permissionsList: action.value,
      }
    case actions.ADD_NEW_PERMISSION:
      return {
        ...state,
        loading: true,
      }
    case actions.ADD_NEW_PERMISSION_SUCCESS:
      return {
        ...state,
        loading: false,
        isPermissionAdded: !state.isPermissionAdded,
      }
    case actions.ADD_NEW_PERMISSION_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.UPDATE_SELECTED_RECORD:
      return {
        ...state,
        selectedRecord: action.value,
      }
    case actions.EDIT_PERMISSION:
      return {
        ...state,
        loading: true,
      }
    case actions.EDIT_PERMISSION_SUCCESS:
      return {
        ...state,
        loading: false,
        isPermissionupdated: !state.isPermissionupdated,
      }
    case actions.EDIT_PERMISSION_FAILURE:
      return {
        ...state,
        loading: false,
        selectedRecord: action.value,
      }
    case actions.DELETE_PERMISSION:
      return {
        ...state,
        loading: true,
      }
    case actions.DELETE_PERMISSION_SUCCESS:
      return {
        ...state,
        loading: false,
        isPermissionDeleted: !state.isPermissionDeleted,
      }
    case actions.DELETE_PERMISSION_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.UPDATE_SEARCH_PERMISSIONS:
      return {
        ...state,
        permissionsList: action.value,
      }
    default:
      return state
  }
}
