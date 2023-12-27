import actions from './actions'

const initialState = {
  twoFAauthModal: false,
}

export default function auth0(state = initialState, action) {
  switch (action.type) {
    case actions.TWO_FA_AUTHORIZATION_MODAL:
      return {
        ...state,
        twoFAauthModal: action.value,
      }
    default:
      return state
  }
}
