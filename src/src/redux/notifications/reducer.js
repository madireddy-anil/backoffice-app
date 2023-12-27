import actions from './actions'

const initialState = {
  allNotifications: [],
  totalNotifications: 0,
}

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPDATE_NOTIFICATION_ITEM: {
      const duplicateMessage = state.allNotifications.find(
        notification => notification.id === action.value.id,
      )
      if (!duplicateMessage) {
        return {
          ...state,
          allNotifications: [action.value, ...state.allNotifications],
          totalNotifications: state.allNotifications.length + 1,
        }
      }
      return {
        ...state,
      }
    }
    case actions.GET_ALL_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        allNotifications: action.value.notifications,
        totalNotifications: action.value.total,
      }
    case actions.UPDATE_READ_STATUS_SUCCESS:
      return {
        ...state,
        allNotifications: action.value.notificationResponse,
        totalNotifications: action.value.total,
      }
    case actions.MARK_ALL_TO_READ_STATUS_SUCCESS:
      return {
        ...state,
        allNotifications: action.value.notificationResponse,
        totalNotifications: action.value.total,
      }
    default:
      return state
  }
}
