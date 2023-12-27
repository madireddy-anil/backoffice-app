import actions from './actions'

const initialState = {
  loading: false,
  modalVisible: false,
  isUserInfoUpdated: true,
  isUserRegistered: true,
  email: '',
  mfaToken: '',
  passwordStrength: '',
  progressLogColor: '',
  password: '',
  passwordPercentage: 0,
}

export default function registerReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPDATE_PASSWORD_STRENGTH:
      return {
        ...state,
        passwordStrength: action.value.passwordStrength,
        passwordPercentage: action.value.passwordPercentage,
        progressLogColor: action.value.progressLogColor,
        password: action.value.password,
      }
    case actions.NEW_REGISTRATION:
      return {
        ...state,
        loading: true,
      }
    case actions.NEW_REGISTRATION_SUCCESS:
      return {
        ...state,
        loading: false,
        isUserRegistered: !state.isUserRegistered,
        mfaToken: action.value,
      }
    case actions.NEW_REGISTRATION_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.ADD_USER_INFORMATION:
      return {
        ...state,
        loading: true,
      }
    case actions.ADD_USER_INFORMATION_SUCCESS:
      return {
        ...state,
        loading: false,
        isUserInfoUpdated: !state.isUserInfoUpdated,
      }
    case actions.ADD_USER_INFORMATION_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.UPDATE_EMAIL:
      return {
        ...state,
        email: action.value,
      }
    case actions.SHOW_CHANGE_PASSWORD_MODAL:
      return {
        ...state,
        modalVisible: true,
      }
    case actions.CLOSE_CHANGE_PASSWORD_MODAL:
      return {
        ...state,
        modalVisible: false,
      }
    default:
      return state
  }
}
