import actions from './actions'

const initialState = {
  roles: [],
  loading: false,
  viewRolemodal: false,
  addRoleModal: false,
  editRoleModal: false,
  selectedRoleRecord: {},
  isRoleCreated: true,
  isRoleUpdated: true,
  isRoleDeleted: true,
  selectedRoleData: {},
}

export default function roles(state = initialState, action) {
  switch (action.type) {
    case actions.VIEW_ROLE_MODAL:
      return {
        ...state,
        viewRolemodal: action.value,
      }
    case actions.VIEW_CLOSE_ROLE_MODAL:
      return {
        ...state,
        viewRolemodal: action.value,
      }
    case actions.ADD_VIEW_ROLE_MODAL:
      return {
        ...state,
        addRoleModal: action.value,
      }
    case actions.ADD_CLOSE_ROLE_MODAL:
      return {
        ...state,
        addRoleModal: action.value,
      }
    case actions.EDIT_VIEW_ROLE_MODAL:
      return {
        ...state,
        editRoleModal: action.value,
      }
    case actions.EDIT_CLOSE_ROLE_MODAL:
      return {
        ...state,
        editRoleModal: action.value,
      }
    case actions.UPDATE_SELECTED_ROLE_RECORD:
      return {
        ...state,
        selectedRoleRecord: action.value,
      }
    case actions.GET_ROLES:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: action.value,
      }
    case actions.GET_ROLES_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.ADD_NEW_ROLE:
      return {
        ...state,
        loading: true,
      }
    case actions.ADD_NEW_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        isRoleCreated: !state.isRoleCreated,
      }
    case actions.ADD_NEW_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.EDIT_ROLE:
      return {
        ...state,
        loading: true,
      }
    case actions.EDIT_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        isRoleUpdated: !state.isRoleUpdated,
      }
    case actions.EDIT_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.DELETE_ROLE:
      return {
        ...state,
        loading: true,
      }
    case actions.DELETE_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        isRoleDeleted: !state.isRoleDeleted,
      }
    case actions.DELETE_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.UPDATE_SEARCH_ROLES:
      return {
        ...state,
        roles: action.value,
      }
    case actions.GET_ROLE_DATA_BY_ID_SUCCESS:
      return {
        ...state,
        selectedRoleData: action.value,
      }
    default:
      return state
  }
}
