const actions = {
  NP_GET_CHAT_TOKEN: 'NP_GET_CHAT_TOKEN',
  NP_GET_CHAT_TOKEN_SUCCESS: 'NP_GET_CHAT_TOKEN_SUCCESS',
  NP_GET_CHAT_TOKEN_FAILURE: 'NP_GET_CHAT_TOKEN_FAILURE',

  NP_GET_CHAT_USER: 'NP_GET_CHAT_USER',
  NP_GET_CHAT_USER_SUCCESS: 'NP_GET_CHAT_USER_SUCCESS',
  NP_GET_CHAT_USER_FAILURE: 'NP_GET_CHAT_USER_FAILURE',

  NP_CREATE_CHAT_CHANNEL: 'NP_CREATE_CHAT_CHANNEL',
  NP_CREATE_CHAT_CHANNEL_SUCCESS: 'NP_CREATE_CHAT_CHANNEL_SUCCESS',
  NP_CREATE_CHAT_CHANNEL_FAILURE: 'NP_CREATE_CHAT_CHANNEL_FAILURE',

  NP_CREATE_MANUAL_CHAT_CHANNEL: 'NP_CREATE_MANUAL_CHAT_CHANNEL',
  NP_CREATE_MANUAL_CHAT_CHANNEL_SUCCESS: 'NP_CREATE_MANUAL_CHAT_CHANNEL_SUCCESS',
  NP_CREATE_MANUAL_CHAT_CHANNEL_FAILURE: 'NP_CREATE_MANUAL_CHAT_CHANNEL_FAILURE',

  NP_GET_ALL_MESSAGES: 'NP_GET_ALL_MESSAGES',
  NP_GET_ALL_MESSAGES_SUCCESS: 'NP_GET_ALL_MESSAGES_SUCCESS',
  NP_GET_ALL_MESSAGES_FAILURE: 'NP_GET_ALL_MESSAGES_FAILURE',

  NP_GET_CHANNEL_MEMBERS: 'NP_GET_CHANNEL_MEMBERS',
  NP_GET_CHANNEL_MEMBERS_SUCCESS: 'NP_GET_CHANNEL_MEMBERS_SUCCESS',
  NP_GET_CHANNEL_MEMBERS_FAILURE: 'NP_GET_CHANNEL_MEMBERS_FAILURE',

  NP_VISIBLE_MEMBERS: 'NP_VISIBLE_MEMBERS',

  NP_UPDATE_MESSAGE: 'NP_UPDATE_MESSAGE',

  NP_RESET_TOKEN_FETCH: 'NP_RESET_TOKEN_FETCH',

  NP_END_CHANNEL: 'NP_END_CHANNEL',
  NP_END_CHANNEL_SUCCESS: 'NP_END_CHANNEL_SUCCESS',
  NP_END_CHANNEL_FAILURE: 'NP_END_CHANNEL_FAILURE',

  NP_GET_ARCHIVED_MESSAGES: 'NP_GET_ARCHIVED_MESSAGES',
  NP_GET_ARCHIVED_MESSAGES_SUCCESS: 'NP_GET_ARCHIVED_MESSAGES_SUCCESS',
  NP_GET_ARCHIVED_MESSAGES_FAILURE: 'NP_GET_ARCHIVED_MESSAGES_FAILURE',

  NP_SHOW_ADD_MEMBER: 'NP_SHOW_ADD_MEMBER',

  NP_ADD_MEMBER_TO_CHAT: 'NP_ADD_MEMBER_TO_CHAT',
  NP_ADD_MEMBER_TO_CHAT_SUCCESS: 'NP_ADD_MEMBER_TO_CHAT_SUCCESS',
  NP_ADD_MEMBER_TO_CHAT_FAILURE: 'NP_ADD_MEMBER_TO_CHAT_FAILURE',

  NP_REMOVE_MEMBER: 'NP_REMOVE_MEMBER',
  NP_REMOVE_MEMBER_SUCCESS: 'NP_REMOVE_MEMBER_SUCCESS',
  NP_REMOVE_MEMBER_FAILURE: 'NP_REMOVE_MEMBER_FAILURE',

  NP_TRIGGER_AGENT_MESSAGE: 'NP_TRIGGER_AGENT_MESSAGE',
  NP_TRIGGER_AGENT_MESSAGE_SUCCESS: 'NP_TRIGGER_AGENT_MESSAGE_SUCCESS',
  NP_TRIGGER_AGENT_MESSAGE_FAILURE: 'NP_TRIGGER_AGENT_MESSAGE_FAILURE',

  NP_INITIALISE_TWILIO_CHAT_CLIENT: 'NP_INITIALISE_TWILIO_CHAT_CLIENT',
  NP_INITIALISE_TWILIO_CHAT_CLIENT_SUCCESS: 'NP_INITIALISE_TWILIO_CHAT_CLIENT_SUCCESS',
  NP_INITIALISE_TWILIO_CHAT_CLIENT_FAILURE: 'NP_INITIALISE_TWILIO_CHAT_CLIENT_FAILURE',

  // NP_SET_STREAMING_CHANNELS: 'NP_SET_STREAMING_CHANNELS',
  // NP_SET_STREAMING_CHANNELS_SUCCESS: 'NP_SET_STREAMING_CHANNELS_SUCCESS',
  // NP_SET_STREAMING_CHANNELS_FAILURE: 'NP_SET_STREAMING_CHANNELS_FAILURE',

  // NP_GET_STREAMING_CHANNELES: 'NP_GET_STREAMING_CHANNELES',
  // NP_GET_STREAMING_CHANNELES_SUCCESS: 'NP_GET_STREAMING_CHANNELES_SUCCESS',
  // NP_GET_STREAMING_CHANNELES_FAILURE: 'NP_GET_STREAMING_CHANNELES_FAILURE',

  NP_SET_CURRENT_TRADE_CHAT_CHANNEL: 'NP_SET_CURRENT_TRADE_CHAT_CHANNEL',
  NP_SET_CURRENT_TRADE_CHAT_CHANNEL_SUCCESS: 'NP_SET_CURRENT_TRADE_CHAT_CHANNEL_SUCCESS',
  NP_SET_CURRENT_TRADE_CHAT_CHANNEL_FAILURE: 'NP_SET_CURRENT_TRADE_CHAT_CHANNEL_FAILURE',
}
export default actions

export const initialiseTwilioChatClient = (
  chatAccessToken,
  streamingChannels,
  currenTradeChatChannelId,
) => {
  return {
    type: actions.NP_INITIALISE_TWILIO_CHAT_CLIENT,
    payload: { chatAccessToken, streamingChannels, currenTradeChatChannelId },
  }
}

export const setCurrentTradeChatChannel = (chatClient, currenTradeChatChannel) => {
  return {
    type: actions.NP_SET_CURRENT_TRADE_CHAT_CHANNEL,
    payload: { chatClient, currenTradeChatChannel },
  }
}

// export const getStreamingChannels = token => {
//   return {
//     type: actions.NP_GET_STREAMING_CHANNELES,
//     token,
//   }
// }

// export const setTradeStreamingChannels = (streamingChannels, chatClient) => {
//   return {
//     type: actions.NP_SET_STREAMING_CHANNELS,
//     payload: { streamingChannels, chatClient },
//   }
// }

export const getChatToken = values => {
  return {
    type: actions.NP_GET_CHAT_TOKEN,
    values,
  }
}

// const chatToken='';
export const getChatUser = (value, token) => {
  return {
    type: actions.NP_GET_CHAT_USER,
    value,
    token,
  }
}

export const createChatChannel = (value, token) => {
  return {
    type: actions.NP_CREATE_CHAT_CHANNEL,
    value,
    token,
  }
}

export const createManualChatChannel = (value, token) => {
  return {
    type: actions.NP_CREATE_MANUAL_CHAT_CHANNEL,
    value,
    token,
  }
}

export const getAllMessages = (sid, token) => {
  return {
    type: actions.NP_GET_ALL_MESSAGES,
    sid,
    token,
  }
}

export const getChannelMembers = (channelId, token) => {
  return {
    type: actions.NP_GET_CHANNEL_MEMBERS,
    channelId,
    token,
  }
}

export const updateNewMessage = value => {
  return {
    type: actions.NP_UPDATE_MESSAGE,
    value,
  }
}

export const endChannel = (value, token) => {
  return {
    type: actions.NP_END_CHANNEL,
    value,
    token,
  }
}

export const getArchivedMessages = (value, token) => {
  return {
    type: actions.NP_GET_ARCHIVED_MESSAGES,
    value,
    token,
  }
}

export const triggerAgentMessage = (value, token) => {
  return {
    type: actions.NP_TRIGGER_AGENT_MESSAGE,
    value,
    token,
  }
}

export const visibleChannelMembers = value => {
  return {
    type: actions.NP_VISIBLE_MEMBERS,
    value,
  }
}

export const removeChannelMember = (value, token) => {
  return {
    type: actions.NP_REMOVE_MEMBER,
    value,
    token,
  }
}

export const addChannelMember = (value, token) => {
  return {
    type: actions.NP_ADD_MEMBER_TO_CHAT,
    value,
    token,
  }
}

export const showAddMember = value => {
  return {
    type: actions.NP_SHOW_ADD_MEMBER,
    value,
  }
}
