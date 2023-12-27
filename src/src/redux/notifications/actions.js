const actions = {
  UPDATE_NOTIFICATION_ITEM: 'UPDATE_NOTIFICATION_ITEM',

  GET_ALL_NOTIFICATIONS: 'GET_ALL_NOTIFICATIONS',
  GET_ALL_NOTIFICATIONS_SUCCESS: 'GET_ALL_NOTIFICATIONS_SUCCESS',
  GET_ALL_NOTIFICATIONS_FAILURE: 'GET_ALL_NOTIFICATIONS_FAILURE',

  UPDATE_READ_STATUS: 'UPDATE_READ_STATUS',
  UPDATE_READ_STATUS_SUCCESS: 'UPDATE_READ_STATUS_SUCCESS',
  UPDATE_READ_STATUS_FAILURE: 'UPDATE_READ_STATUS_FAILURE',

  MARK_ALL_TO_READ_STATUS: 'MARK_ALL_TO_READ_STATUS',
  MARK_ALL_TO_READ_STATUS_SUCCESS: 'MARK_ALL_TO_READ_STATUS_SUCCESS',
  MARK_ALL_TO_READ_STATUS_FAILURE: 'MARK_ALL_TO_READ_STATUS_FAILURE',
}
export default actions

export const updateNotificationItem = value => {
  return {
    type: actions.UPDATE_NOTIFICATION_ITEM,
    value,
  }
}

export const getAllNotifications = (email, token) => {
  return {
    type: actions.GET_ALL_NOTIFICATIONS,
    email,
    token,
  }
}

export const updateReadStatus = (email, value, token) => {
  return {
    type: actions.UPDATE_READ_STATUS,
    email,
    value,
    token,
  }
}

export const markAlltoReadStatus = (email, value, token) => {
  return {
    type: actions.MARK_ALL_TO_READ_STATUS,
    email,
    value,
    token,
  }
}
