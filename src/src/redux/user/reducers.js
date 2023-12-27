import { createHashHistory } from 'history'
import config from 'config/config'
import actions from './actions'
import dashboardAction from '../dashboard/actions'
import { parseQueryString } from '../../utilities/transformer'

const { websocketURL } = config

const history = createHashHistory()

const initialState = {
  id: '',
  name: '',
  role: '',
  email: '',
  avatar: '',
  token: '',
  authorized: false,
  isLoggedIn: false,
  loading: false,
  userInformation: {},
  isEmailSent: false,
  isPasswordReset: false,
  passwordResetToken: '',
  passwordResetPath: '',
  userData: [],
  agentUsers: [],
  clientUsers: [],
  ws: {},
  loginUrl: '/user/login',
  barcode: '',
  barCodeSecretKey: '',
  mfaToken: '',
  isUserPasswordUpdated: true,
  userProfile: {},
  isAuthDeprecated: true,
}

export default function userReducer(state = initialState, action) {
  const { location } = history

  if (action.type === '@@router/LOCATION_CHANGE') {
    if (action.payload.location.pathname === '/user/login') {
      return {
        ...state,
        isAuthDeprecated: false,
        loginUrl: '/user/login',
      }
    }
    if (action.payload.location.pathname === '/user/old-login') {
      return {
        ...state,
        isAuthDeprecated: true,
        loginUrl: '/user/old-login',
      }
    }
  }

  const token = parseQueryString(location.search).token
    ? encodeURIComponent(parseQueryString(location.search).token)
    : undefined

  if (token !== undefined && action.type === '@@router/LOCATION_CHANGE') {
    const { pathname, search } = location

    return {
      ...state,
      passwordResetToken: token,
      passwordResetPath: `${pathname}${search}`,
    }
  }

  if (state.authorized) {
    if (state.ws) {
      if (state.ws.readyState === undefined) {
        const ws = new WebSocket(`${websocketURL}?user=${state.email}`)
        return {
          ...state,
          ws,
        }
      }
    }
  }

  switch (action.type) {
    case actions.RESET_USER_STATE: {
      location.search = ''
      location.pathname = ''
      return {
        ...initialState,
      }
    }

    case actions.LOGIN: {
      const { values } = action.payload
      return {
        ...state,
        loading: true,
        email: values.email,
      }
    }

    case actions.LOGIN_SUCCESS_DEPRECATED: {
      return {
        ...state,
        role: action.value.access.toLowerCase(),
        loading: false,
        isLoggedIn: true,
        authorized: true,
        token: action.value.token,
      }
    }
    case actions.LOGIN_FAILURE_DEPRECATED:
      return {
        ...state,
        loading: false,
        email: '',
      }

    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        mfaToken: action.value ? action.value.mfa_token : '',
        isMFAset: action.value ? action.value.isMFAset : '',
      }
    case actions.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        email: '',
      }
    // case actions.LOG_OUT:
    //   return {
    //     ...state,
    //     email: ''
    //   }

    case actions.SET_TOKEN:
      return {
        ...state,
        passwordResetToken: action.token,
      }

    case actions.GET_USER_DATA_DEPRECATED:
      return {
        ...state,
        loading: true,
        isLoggedIn: false,
      }
    case actions.GET_USER_DATA_SUCCESS_DEPRECATED:
      return {
        ...state,
        ...action.value,
        name: `${action.value.firstName} ${action.value.lastName}`,
        authorized: true,
        isLoggedIn: true,
        loading: false,
      }
    case actions.GET_USER_DATA_FAILURE_DEPRECATED:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
      }
    case actions.GET_USER_DATA:
      return {
        ...state,
        loading: true,
        isLoggedIn: false,
      }
    case actions.GET_USER_DATA_SUCCESS:
      return {
        ...state,
        ...action.value,
        name: `${action.value.firstName} ${action.value.lastName}`,
        authorized: true,
        isLoggedIn: true,
        loading: false,
      }
    case actions.GET_USER_DATA_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
      }
    case actions.GET_OPS_USERS_SUCCESS:
      return {
        ...state,
        agentUsers: action.value.user,
      }
    case actions.GET_USERS_BY_CLIENT_SUCCESS:
      return {
        ...state,
        clientUsers: action.value.user,
      }
    case actions.SEND_RESET_EMAIL:
      return {
        ...state,
        isEmailSent: true,
      }
    case actions.SEND_RESET_EMAIL_SUCCESS:
      return {
        ...state,
        isEmailSent: false,
      }
    case actions.SEND_RESET_EMAIL_FALIURE:
      return {
        ...state,
        isEmailSent: false,
      }
    case actions.SEND_RESET_EMAIL_DEPRECATED:
      return {
        ...state,
        isEmailSent: true,
      }
    case actions.SEND_RESET_EMAIL_SUCCESS_DEPRECATED:
      return {
        ...state,
        isEmailSent: false,
      }
    case actions.SEND_RESET_EMAIL_FALIURE_DEPRECATED:
      return {
        ...state,
        isEmailSent: false,
      }
    case actions.RESET_PASSWORD_DEPRECATED:
      return {
        ...state,
        isPasswordReset: true,
      }
    case actions.RESET_PASSWORD_SUCCESS_DEPRECATED: {
      location.search = ''
      location.pathname = ''
      return {
        ...initialState,
        isPasswordReset: false,
      }
    }
    case actions.RESET_PASSWORD_FALIURE_DEPRECATED:
      return {
        ...state,
        isPasswordReset: false,
      }
    case actions.RESET_PASSWORD:
      return {
        ...state,
        isPasswordReset: true,
      }
    case actions.RESET_PASSWORD_SUCCESS:
      location.search = ''
      location.pathname = ''

      return {
        ...initialState,
        isPasswordReset: false,
        passwordResetToken: '',
      }
    case actions.RESET_PASSWORD_FALIURE:
      return {
        ...state,
        isPasswordReset: false,
      }
    case dashboardAction.UPDATE_SELECTED_ACCOUNT_MID:
      return {
        ...state,
        selectedAccountMids: action.accountMIDs,
      }
    case actions.AUTHORIZE_CODE_2FA:
      return {
        ...state,
        loading: true,
      }
    case actions.AUTHORIZE_CODE_2FA_SUCCESS:
      return {
        ...state,
        loading: false,
        token: action.value.access_token,
      }
    case actions.AUTHORIZE_CODE_2FA_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.SETUP_MFA_AUTHENTICATOR:
      return {
        ...state,
        loading: true,
      }
    case actions.SETUP_MFA_AUTHENTICATOR_SUCCESS:
      return {
        ...state,
        loading: false,
        barcode: action.value.barcodeUri,
        barCodeSecretKey: action.value.secret,
      }
    case actions.SETUP_MFA_AUTHENTICATOR_FAILURE:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}
