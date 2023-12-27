const actions = {
  GET_CHAT_TOKEN: 'GET_CHAT_TOKEN',
  GET_CHAT_TOKEN_SUCCESS: 'GET_CHAT_TOKEN_SUCCESS',
  GET_CHAT_TOKEN_FAILURE: 'GET_CHAT_TOKEN_FAILURE',

  GET_CHAT_USER: 'GET_CHAT_USER',
  GET_CHAT_USER_SUCCESS: 'GET_CHAT_USER_SUCCESS',
  GET_CHAT_USER_FAILURE: 'GET_CHAT_USER_FAILURE',

  CREATE_CHAT_CHANNEL: 'CREATE_CHAT_CHANNEL',
  CREATE_CHAT_CHANNEL_SUCCESS: 'CREATE_CHAT_CHANNEL_SUCCESS',
  CREATE_CHAT_CHANNEL_FAILURE: 'CREATE_CHAT_CHANNEL_FAILURE',

  CREATE_MANUAL_CHAT_CHANNEL: 'CREATE_MANUAL_CHAT_CHANNEL',
  CREATE_MANUAL_CHAT_CHANNEL_SUCCESS: 'CREATE_MANUAL_CHAT_CHANNEL_SUCCESS',
  CREATE_MANUAL_CHAT_CHANNEL_FAILURE: 'CREATE_MANUAL_CHAT_CHANNEL_FAILURE',

  GET_ALL_MESSAGES: 'GET_ALL_MESSAGES',
  GET_ALL_MESSAGES_SUCCESS: 'GET_ALL_MESSAGES_SUCCESS',
  GET_ALL_MESSAGES_FAILURE: 'GET_ALL_MESSAGES_FAILURE',

  GET_CHANNEL_MEMBERS: 'GET_CHANNEL_MEMBERS',
  GET_CHANNEL_MEMBERS_SUCCESS: 'GET_CHANNEL_MEMBERS_SUCCESS',
  GET_CHANNEL_MEMBERS_FAILURE: 'GET_CHANNEL_MEMBERS_FAILURE',

  VISIBLE_MEMBERS: 'VISIBLE_MEMBERS',

  UPDATE_MESSAGE: 'UPDATE_MESSAGE',

  RESET_TOKEN_FETCH: 'RESET_TOKEN_FETCH',

  END_CHANNEL: 'END_CHANNEL',
  END_CHANNEL_SUCCESS: 'END_CHANNEL_SUCCESS',
  END_CHANNEL_FAILURE: 'END_CHANNEL_FAILURE',

  GET_ARCHIVED_MESSAGES: 'GET_ARCHIVED_MESSAGES',
  GET_ARCHIVED_MESSAGES_SUCCESS: 'GET_ARCHIVED_MESSAGES_SUCCESS',
  GET_ARCHIVED_MESSAGES_FAILURE: 'GET_ARCHIVED_MESSAGES_FAILURE',

  SHOW_ADD_MEMBER: 'SHOW_ADD_MEMBER',

  ADD_MEMBER_TO_CHAT: 'ADD_MEMBER_TO_CHAT',
  ADD_MEMBER_TO_CHAT_SUCCESS: 'ADD_MEMBER_TO_CHAT_SUCCESS',
  ADD_MEMBER_TO_CHAT_FAILURE: 'ADD_MEMBER_TO_CHAT_FAILURE',

  REMOVE_MEMBER: 'REMOVE_MEMBER',
  REMOVE_MEMBER_SUCCESS: 'REMOVE_MEMBER_SUCCESS',
  REMOVE_MEMBER_FAILURE: 'REMOVE_MEMBER_FAILURE',

  TRIGGER_AGENT_MESSAGE: 'TRIGGER_AGENT_MESSAGE',
  TRIGGER_AGENT_MESSAGE_SUCCESS: 'TRIGGER_AGENT_MESSAGE_SUCCESS',
  TRIGGER_AGENT_MESSAGE_FAILURE: 'TRIGGER_AGENT_MESSAGE_FAILURE',

  INITIALISE_TWILIO_CHAT_CLIENT: 'INITIALISE_TWILIO_CHAT_CLIENT',
  INITIALISE_TWILIO_CHAT_CLIENT_SUCCESS: 'INITIALISE_TWILIO_CHAT_CLIENT_SUCCESS',
  INITIALISE_TWILIO_CHAT_CLIENT_FAILURE: 'INITIALISE_TWILIO_CHAT_CLIENT_FAILURE',

  // SET_STREAMING_CHANNELS: 'SET_STREAMING_CHANNELS',
  // SET_STREAMING_CHANNELS_SUCCESS: 'SET_STREAMING_CHANNELS_SUCCESS',
  // SET_STREAMING_CHANNELS_FAILURE: 'SET_STREAMING_CHANNELS_FAILURE',

  // GET_STREAMING_CHANNELES: 'GET_STREAMING_CHANNELES',
  // GET_STREAMING_CHANNELES_SUCCESS: 'GET_STREAMING_CHANNELES_SUCCESS',
  // GET_STREAMING_CHANNELES_FAILURE: 'GET_STREAMING_CHANNELES_FAILURE',

  SET_CURRENT_TRADE_CHAT_CHANNEL: 'SET_CURRENT_TRADE_CHAT_CHANNEL',
  SET_CURRENT_TRADE_CHAT_CHANNEL_SUCCESS: 'SET_CURRENT_TRADE_CHAT_CHANNEL_SUCCESS',
  SET_CURRENT_TRADE_CHAT_CHANNEL_FAILURE: 'SET_CURRENT_TRADE_CHAT_CHANNEL_FAILURE',
}
export default actions

export const initialiseTwilioChatClient = (
  chatAccessToken,
  streamingChannels,
  currenTradeChatChannelId,
) => {
  return {
    type: actions.INITIALISE_TWILIO_CHAT_CLIENT,
    payload: { chatAccessToken, streamingChannels, currenTradeChatChannelId },
  }
}

export const setCurrentTradeChatChannel = (chatClient, currenTradeChatChannel) => {
  return {
    type: actions.SET_CURRENT_TRADE_CHAT_CHANNEL,
    payload: { chatClient, currenTradeChatChannel },
  }
}

// export const getStreamingChannels = token => {
//   return {
//     type: actions.GET_STREAMING_CHANNELES,
//     token,
//   }
// }

// export const setTradeStreamingChannels = (streamingChannels, chatClient) => {
//   return {
//     type: actions.SET_STREAMING_CHANNELS,
//     payload: { streamingChannels, chatClient },
//   }
// }

export const getChatToken = values => {
  return {
    type: actions.GET_CHAT_TOKEN,
    values,
  }
}

// const chatToken='';
export const getChatUser = (value, token) => {
  return {
    type: actions.GET_CHAT_USER,
    value,
    token,
  }
}

export const createChatChannel = (value, token) => {
  return {
    type: actions.CREATE_CHAT_CHANNEL,
    value,
    token,
  }
}

export const createManualChatChannel = (value, token) => {
  return {
    type: actions.CREATE_MANUAL_CHAT_CHANNEL,
    value,
    token,
  }
}

export const getAllMessages = (sid, token) => {
  return {
    type: actions.GET_ALL_MESSAGES,
    sid,
    token,
  }
}

export const getChannelMembers = (channelId, token) => {
  return {
    type: actions.GET_CHANNEL_MEMBERS,
    channelId,
    token,
  }
}

export const updateNewMessage = value => {
  return {
    type: actions.UPDATE_MESSAGE,
    value,
  }
}

export const endChannel = (value, token) => {
  return {
    type: actions.END_CHANNEL,
    value,
    token,
  }
}

export const getArchivedMessages = (value, token) => {
  return {
    type: actions.GET_ARCHIVED_MESSAGES,
    value,
    token,
  }
}

export const triggerAgentMessage = (value, token) => {
  return {
    type: actions.TRIGGER_AGENT_MESSAGE,
    value,
    token,
  }
}

export const visibleChannelMembers = value => {
  return {
    type: actions.VISIBLE_MEMBERS,
    value,
  }
}

export const removeChannelMember = (value, token) => {
  return {
    type: actions.REMOVE_MEMBER,
    value,
    token,
  }
}

export const addChannelMember = (value, token) => {
  return {
    type: actions.ADD_MEMBER_TO_CHAT,
    value,
    token,
  }
}

export const showAddMember = value => {
  return {
    type: actions.SHOW_ADD_MEMBER,
    value,
  }
}
