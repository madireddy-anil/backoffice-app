import ntActions from 'redux/newTrade/actions'
import tdActions from 'redux/trade/actions'
import actions from './actions'

const initialState = {
  messages: [],
  token: '',
  loading: false,
  currentChannel: {},
  channelMembers: [],
  lastMsgId: 0,
  isChannelEnded: false,
  chatLoading: false,
  visibleMembers: false,
  visibleAddMember: false,
  isChannelCreated: false,
  chatClient: {},
  activeTradeStreamingChannel: {},
  activeCurrentTradeChatChannel: {},
}

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case ntActions.INITIATE_NEW_TRADE:
      return {
        ...state,
        messages: [],
      }
    case tdActions.GET_TRADE_DETAILS_BY_ID:
      return {
        ...state,
        chatLoading: true,
        messages: [],
      }
    case tdActions.GET_TRADE_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isChannelCreated: action.value.chat.channelId !== '',
      }
    case tdActions.UPDATE_CURRENT_CHANNEL_DETAILS:
      return {
        ...state,
        isChannelEnded: action.value.tradeStatus === 'completed',
      }
    case actions.GET_CHAT_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.value,
      }
    case actions.GET_CHAT_TOKEN_FAILURE:
      return {
        ...state,
        token: '',
      }
    case actions.CREATE_CHAT_CHANNEL_SUCCESS:
      return {
        ...state,
        currentChannel: action.value,
      }
    case actions.GET_CHANNEL_MEMBERS_SUCCESS:
      return {
        ...state,
        channelMembers: action.value,
      }
    case actions.GET_ALL_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.value,
        lastMsgId: action.lastMsgId,
        chatLoading: false,
      }
    case actions.GET_ALL_MESSAGES_FAILURE:
      return {
        ...state,
        messages: [],
        lastMsgId: 0,
        chatLoading: false,
      }
    case actions.GET_ARCHIVED_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.value,
        chatLoading: false,
      }
    case actions.GET_ARCHIVED_MESSAGES_FAILURE:
      return {
        ...state,
        chatLoading: false,
        messages: [],
      }
    case actions.UPDATE_MESSAGE: {
      const duplicateMessage = state.messages.find(message => message.id === action.value.id)
      if (!duplicateMessage) {
        return {
          ...state,
          messages: [...state.messages, action.value],
          lstMsgId: action.value.id,
        }
      }
      return {
        ...state,
      }
    }
    case actions.END_CHANNEL_SUCCESS:
      return {
        ...state,
        isChannelEnded: true,
      }
    case actions.END_CHANNEL_FAILURE:
      return {
        ...state,
        isChannelEnded: false,
      }
    case actions.VISIBLE_MEMBERS:
      return {
        ...state,
        visibleMembers: action.value,
      }
    case actions.SHOW_ADD_MEMBER:
      return {
        ...state,
        visibleAddMember: action.value,
      }
    case actions.INITIALISE_TWILIO_CHAT_CLIENT: {
      return {
        ...state,
      }
    }
    case actions.INITIALISE_TWILIO_CHAT_CLIENT_SUCCESS: {
      const { chatClient } = action.payload
      return {
        ...state,
        chatClient,
      }
    }
    case actions.INITIALISE_TWILIO_CHAT_CLIENT_FAILURE: {
      return {
        ...state,
      }
    }
    // case actions.SET_STREAMING_CHANNELS: {
    //   return {
    //     ...state,
    //   }
    // }
    // case actions.SET_STREAMING_CHANNELS_SUCCESS: {
    //   const { activeTradeStreamingChannel } = action.payload
    //   return {
    //     ...state,
    //     activeTradeStreamingChannel,
    //   }
    // }
    // case actions.SET_STREAMING_CHANNELS_FAILURE: {
    //   return {
    //     ...state,
    //   }
    // }
    case actions.SET_CURRENT_TRADE_CHAT_CHANNEL: {
      return {
        ...state,
      }
    }
    case actions.SET_CURRENT_TRADE_CHAT_CHANNEL_SUCCESS: {
      const { activeCurrentTradeChatChannel } = action.payload
      return {
        ...state,
        activeCurrentTradeChatChannel,
      }
    }
    case actions.SET_CURRENT_TRADE_CHAT_CHANNEL_FAILURE: {
      return {
        ...state,
      }
    }
    default:
      return state
  }
}
