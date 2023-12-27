import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import NProgress from 'nprogress'
import Chat from 'twilio-chat'

import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'

import actions from './actions'
import tradeActions from '../newTrade/actions'

const { chatPrivatePost, chatPrivateGet, chatPrivateDelete } = axiosMethod
const { globalMessages } = Variables

const getChatToken = values => {
  const { clientEmail } = values
  return chatPrivatePost(`chat-service/access-token`, { clientEmail }, values.token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getChatAccessToken({ values }) {
  try {
    const response = yield call(getChatToken, values)
    yield put({
      type: actions.GET_CHAT_TOKEN_SUCCESS,
      value: response,
    })
    yield call(getChatUser, values, response)
  } catch (err) {
    yield put({
      type: actions.GET_CHAT_TOKEN_FAILURE,
      payload: err,
    })
    // notification.error({
    //   message: globalMessages.errorMessage,
    //   description: globalMessages.errorDescription,
    // })
  }
}

const getUser = (value, token) => {
  const body = {
    clientEmail: value.clientEmail,
    userType: value.userType,
  }
  return chatPrivatePost(`chat-service/users`, body, token).then(response => {
    console.log(response)
  })
}

export function* getChatUser(values, token) {
  try {
    const response = yield call(getUser, values, token)
    yield put({
      type: actions.GET_CHAT_USER_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CHAT_USER_FAILURE,
      payload: err,
    })
  }
}

const createChannel = (values, token) => {
  let currency
  if (values.value.selectedBeneficiary.bankAccountDetails) {
    currency = values.value.selectedBeneficiary.bankAccountDetails.bankAccountCurrency
  } else {
    currency = values.value.selectedBeneficiary.cryptoCurrency
  }
  const body = {
    chatType: 'trade',
    baseCurrency: values.value.sourceCurrency,
    targetCurrency: currency,
    tradeAmount: values.value.sourceAmount,
    clientName: values.value.clientName,
    clientEmail: values.value.email,
    clientId: values.value.clientId,
  }
  return chatPrivatePost(`chat-service/channel/create-channel`, body, token).then(response => {
    return response.data.data
  })
}

export function* createChatChannel(values) {
  try {
    const response = yield call(createChannel, values.value, values.token)
    yield put({
      type: actions.CREATE_CHAT_CHANNEL_SUCCESS,
      value: response,
    })

    const tradeData = {
      tradeId: values.value.tradeId,
      tradeStatus: 'accounts_requested',
      chat: {
        channelId: response.sid,
        channelStatus: 'created',
      },
    }
    yield put({
      type: tradeActions.UPDATE_TRADE_STATUS,
      value: tradeData,
      token: values.value.token,
    })

    const triggerData = {
      channelId: response.sid,
      token: values.value.token,
      body: `Thank you, we have received your trade request reference ${values.value.tradeReference}. We will provide you with local currency accounts ASAP`,
    }
    yield put({
      type: actions.TRIGGER_AGENT_MESSAGE,
      value: triggerData,
    })

    values.value.channelId = response.sid
    // yield call(addMemberToChannel, values)

    // yield put({
    //   type: actions.GET_ALL_MESSAGES,
    //   sid: response.sid,
    //   token: values.token
    // })
  } catch (err) {
    yield put({
      type: actions.CREATE_CHAT_CHANNEL_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const createManualChannel = (values, token) => {
  const body = {
    chatType: 'trade',
    baseCurrency: values.value.sourceCurrency,
    targetCurrency: values.value.selectedBeneficiary.bankAccountDetails.bankAccountCurrency,
    tradeAmount: values.value.sourceAmount,
    clientName: values.value.selectedClient.tradingName,
    clientEmail: values.value.email,
    clientId: values.value.selectedClient.id,
  }
  return chatPrivatePost(`chat-service/channel/create-channel`, body, token).then(response => {
    return response.data.data
  })
}

export function* createManualChatChannel(values) {
  try {
    const response = yield call(createManualChannel, values.value, values.token)
    yield put({
      type: actions.CREATE_MANUAL_CHAT_CHANNEL_SUCCESS,
      value: response,
    })

    const triggerData = {
      channelId: response.sid,
      token: values.value.token,
      body: `Thank you, we have created chat channel manually`,
    }
    yield put({
      type: actions.TRIGGER_AGENT_MESSAGE,
      value: triggerData,
    })

    values.value.channelId = response.sid
    // yield call(addMemberToChannel, values)

    // yield put({
    //   type: actions.GET_ALL_MESSAGES,
    //   sid: response.sid,
    //   token: values.token
    // })
  } catch (err) {
    yield put({
      type: actions.CREATE_MANUAL_CHAT_CHANNEL_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

// get all messages
const getAllMessages = (sid, token) => {
  return chatPrivateGet(`chat-service/messages/channel-messages/${sid}`, token).then(response => {
    const allChatMessages = response.data.data
    const messages = allChatMessages.map(message => {
      return {
        id: message.index,
        author: message.from,
        message: message.body,
        timestamp: message.dateCreated,
      }
    })
    return messages
  })
}

export function* allMessages(values) {
  try {
    const response = yield call(getAllMessages, values.sid, values.token)
    const copyResponse = [...response]
    const lastMsg = response.length > 0 ? copyResponse.pop() : 0
    yield put({
      type: actions.GET_ALL_MESSAGES_SUCCESS,
      value: response,
      lastMsgId: lastMsg.id,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_MESSAGES_FAILURE,
      value: err.response,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

// get Channel Member
const getChannelMessages = (channelId, token) => {
  return chatPrivateGet(`chat-service/channel/${channelId}/channel-members`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getallChannelMembers(values) {
  try {
    const response = yield call(getChannelMessages, values.channelId, values.token)
    yield put({
      type: actions.GET_CHANNEL_MEMBERS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CHANNEL_MEMBERS_FAILURE,
      value: err.response,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const endChannel = (value, token) => {
  return chatPrivateDelete(
    `chat-service/channel/end-channel/${value.channelId}?clientEmail=${value.clientEmail}`,
    token,
  ).then(response => {
    return response.data.data
  })
}

export function* endTradeChannel(values) {
  try {
    const response = yield call(endChannel, values.value, values.token)
    yield put({
      type: actions.END_CHANNEL_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.END_CHANNEL_FAILURE,
      value: err.response,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const archivedMessages = (value, token) => {
  return chatPrivateGet(
    `chat-service/messages/archived-messages/${value.channelId}?clientEmail=${value.clientEmail}`,
    token,
  ).then(response => {
    const archivedChatMessages = response.data.data
    const messages = archivedChatMessages.map(message => {
      return {
        id: message.index,
        author: message.from,
        message: message.body,
        timestamp: message.dateCreated,
      }
    })
    return messages
  })
}

export function* getArchivedMessages(values) {
  try {
    const response = yield call(archivedMessages, values.value, values.token)
    yield put({
      type: actions.GET_ARCHIVED_MESSAGES_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ARCHIVED_MESSAGES_FAILURE,
      value: err.response,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const triggerMessages = values => {
  const body = {
    from: 'service',
    body: values.body,
  }
  return chatPrivatePost(
    `chat-service/messages/send-notification/${values.channelId}`,
    body,
    values.token,
  ).then(response => {
    return response.data.data
  })
}

export function* triggerAgentMessages(values) {
  try {
    const response = yield call(triggerMessages, values.value)
    yield put({
      type: actions.TRIGGER_AGENT_MESSAGE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.TRIGGER_AGENT_MESSAGE_FAILURE,
      value: err.response,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

// Add as a member for the group chat
const addMemberToChat = values => {
  const { channelId, email, clientId } = values.value
  return chatPrivatePost(
    `chat-service/channel/${channelId}/addmember/${email}`,
    { clientId },
    values.token,
  ).then(response => {
    NProgress.done()
    return response.data.data
  })
}

export function* addMemberToChannel(values) {
  try {
    NProgress.start()
    const response = yield call(addMemberToChat, values)
    yield put({
      type: actions.ADD_MEMBER_TO_CHAT_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CHANNEL_MEMBERS,
      channelId: values.value.channelId,
      token: values.token,
    })
    notification.success({
      message: 'Member Added to the Channel.',
      description: `${values.value.firstName} ${values.value.lastName} added successfully!`,
    })
  } catch (err) {
    yield put({
      type: actions.ADD_MEMBER_TO_CHAT_FAILURE,
      value: err.response,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const removeMember = values => {
  const { channelId, email, clientId } = values.value
  return chatPrivatePost(
    `chat-service/channel/${channelId}/removemember/${email}`,
    { clientId },
    values.token,
  ).then(response => {
    NProgress.done()
    return response.data.data
  })
}

export function* removeMemberFromChannel(values) {
  try {
    NProgress.start()
    const response = yield call(removeMember, values)
    yield put({
      type: actions.REMOVE_MEMBER_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CHANNEL_MEMBERS,
      channelId: values.value.channelId,
      token: values.token,
    })
    notification.success({
      message: 'Member Removed from the Channel.',
      description: `${values.value.firstName} ${values.value.lastName} removed from this chat successfully!`,
    })
  } catch (err) {
    yield put({
      type: actions.REMOVE_MEMBER_FAILURE,
      value: err.response,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const initiateChat = chatAccessToken => {
  return Chat.create(chatAccessToken).then(chatClient => {
    return chatClient
  })
}

export function* initialiseTwilioChatClient(values) {
  const { chatAccessToken, currenTradeChatChannelId } = values.payload

  try {
    const chatClient = yield call(initiateChat, chatAccessToken)

    yield put({
      type: actions.INITIALISE_TWILIO_CHAT_CLIENT_SUCCESS,
      payload: { chatClient },
    })

    // const payload = { streamingChannels, chatClient }

    // yield put({
    //   type: actions.SET_STREAMING_CHANNELS,
    //   payload,
    // })
    if (currenTradeChatChannelId) {
      yield put({
        type: actions.SET_CURRENT_TRADE_CHAT_CHANNEL,
        payload: { chatClient, currenTradeChatChannelId },
      })
    }
  } catch (err) {
    yield put({
      type: actions.INITIALISE_TWILIO_CHAT_CLIENT_FAILURE,
      payload: err,
    })
  }
}

// const setStreamChannels = (streamingChannels, chatClient) => {
//   const tradeStreamchannel = streamingChannels.find(el => el.collectionName === 'trades')
//   const streamChannelId = tradeStreamchannel.channelID

//   return chatClient.getChannelBySid(streamChannelId).then(activeTradeStreamChannel => {
//     return activeTradeStreamChannel
//   })
// }

// export function* setStreamingChannels(values) {
//   const { streamingChannels, chatClient } = values.payload

//   try {
//     const activeTradeStreamingChannel = yield call(setStreamChannels, streamingChannels, chatClient)

//     yield put({
//       type: actions.SET_STREAMING_CHANNELS_SUCCESS,
//       payload: { activeTradeStreamingChannel },
//     })
//   } catch (err) {
//     yield put({
//       type: actions.SET_STREAMING_CHANNELS_FAILURE,
//       payload: err,
//     })
//   }
// }

const setCurrentTradeActiveChannel = (chatClient, currenTradeChatChannelId) => {
  return chatClient.getChannelBySid(currenTradeChatChannelId).then(activeTradeChatChannel => {
    return activeTradeChatChannel
  })
}

export function* setCurrentTradeChatChannel(values) {
  const { chatClient, currenTradeChatChannelId } = values.payload
  try {
    const activeCurrentTradeChatChannel = yield call(
      setCurrentTradeActiveChannel,
      chatClient,
      currenTradeChatChannelId,
    )

    yield put({
      type: actions.SET_CURRENT_TRADE_CHAT_CHANNEL_SUCCESS,
      payload: { activeCurrentTradeChatChannel },
    })
  } catch (err) {
    yield put({
      type: actions.SET_CURRENT_TRADE_CHAT_CHANNEL_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_CHAT_TOKEN, getChatAccessToken),
    takeLatest(actions.GET_CHAT_USER, getChatUser),
    takeLatest(actions.GET_ALL_MESSAGES, allMessages),
    takeLatest(actions.GET_CHANNEL_MEMBERS, getallChannelMembers),
    takeLatest(actions.END_CHANNEL, endTradeChannel),
    takeLatest(actions.GET_ARCHIVED_MESSAGES, getArchivedMessages),
    takeLatest(actions.TRIGGER_AGENT_MESSAGE, triggerAgentMessages),
    takeLatest(actions.ADD_MEMBER_TO_CHAT, addMemberToChannel),
    takeLatest(actions.REMOVE_MEMBER, removeMemberFromChannel),
    takeLatest(actions.CREATE_CHAT_CHANNEL, createChatChannel),
    takeLatest(actions.CREATE_MANUAL_CHAT_CHANNEL, createManualChatChannel),
    takeLatest(actions.INITIALISE_TWILIO_CHAT_CLIENT, initialiseTwilioChatClient),
    // takeLatest(actions.SET_STREAMING_CHANNELS, setStreamingChannels),
    takeLatest(actions.SET_CURRENT_TRADE_CHAT_CHANNEL, setCurrentTradeChatChannel),
  ])
}
