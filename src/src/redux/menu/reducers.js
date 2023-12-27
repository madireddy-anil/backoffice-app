// import actions from './actions'
import { getLeftMenuData } from 'services/menu'
import actionType from '../user/actions'

const initialState = {
  menuLeftData: [],
  menuTopData: [],
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actionType.GET_USER_DATA_SUCCESS_DEPRECATED: {
      return { ...state, menuLeftData: getLeftMenuData }
    }
    case actionType.GET_USER_DATA_SUCCESS: {
      return { ...state, menuLeftData: getLeftMenuData }
    }
    default:
      return state
  }
}
