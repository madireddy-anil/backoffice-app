import actions from './action'

const initialState = {
  selectedUserDetails: {},
  usersList: [],
  userListLoading: false,
  addUserLoading: false,
  editUserLoading: false,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPDATE_SELECTED_USER:
      return {
        ...state,
        selectedUserDetails: action.value,
      }
    case actions.UPDATE_PASSWORD_STRENGTH:
      return {
        ...state,
        passwordStrength: action.value.passwordStrength,
        passwordPercentage: action.value.passwordPercentage,
        progressLogColor: action.value.progressLogColor,
        password: action.value.password,
      }
    case actions.GET_ALL_USERS_LIST:
      return {
        ...state,

        userListLoading: true,
      }
    case actions.GET_ALL_USERS_LIST_SUCCESS:
      return {
        ...state,
        userListLoading: false,
        usersList: action.value,
      }
    case actions.GET_ALL_USERS_LIST_FAILURE:
      return {
        ...state,
        userListLoading: false,
      }
    case actions.ADD_NEW_USER:
      return {
        ...state,

        addUserLoading: true,
      }
    case actions.ADD_NEW_USER_SUCCESS:
      return {
        ...state,
        addUserLoading: false,
      }
    case actions.ADD_NEW_USER_FAILURE:
      return {
        ...state,
        addUserLoading: false,
      }
    case actions.EDIT_USER:
      return {
        ...state,

        editUserLoading: true,
      }
    case actions.EDIT_USER_SUCCESS:
      return {
        ...state,
        editUserLoading: false,
      }
    case actions.EDIT_USER_FAILURE:
      return {
        ...state,
        editUserLoading: false,
      }

    case actions.UPDATE_SEARCH_USERS:
      return {
        ...state,
        usersList: action.value,
      }
    default:
      return state
  }
}
