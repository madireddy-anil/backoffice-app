import ntActions from 'redux/restrictedCurrencies/trade/newTrade/actions'
import tdActions from 'redux/restrictedCurrencies/trade/tradeProcess/tradeDetails/actions'
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
    case ntActions.NP_INITIATE_NEW_TRADE:
      return {
        ...state,
        messages: [],
      }
    case tdActions.NP_GET_TRADE_DETAILS_BY_ID:
      return {
        ...state,
        chatLoading: true,
        messages: [],
      }
    case tdActions.NP_GET_TRADE_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isChannelCreated: action.value.chat.channelId !== '',
      }
    case tdActions.NP_UPDATE_CURRENT_CHANNEL_DETAILS:
      return {
        ...state,
        isChannelEnded: action.value.tradeStatus === 'completed',
      }
    case actions.NP_GET_CHAT_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.value,
      }
    case actions.NP_GET_CHAT_TOKEN_FAILURE:
      return {
        ...state,
        token: '',
      }
    case actions.NP_CREATE_CHAT_CHANNEL_SUCCESS:
      return {
        ...state,
        currentChannel: action.value,
      }
    case actions.NP_GET_CHANNEL_MEMBERS_SUCCESS:
      return {
        ...state,
        channelMembers: action.value,
      }
    case actions.NP_GET_ALL_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.value,
        lastMsgId: action.lastMsgId,
        chatLoading: false,
      }
    case actions.NP_GET_ALL_MESSAGES_FAILURE:
      return {
        ...state,
        messages: [],
        lastMsgId: 0,
        chatLoading: false,
      }
    case actions.NP_GET_ARCHIVED_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.value,
        chatLoading: false,
      }
    case actions.NP_GET_ARCHIVED_MESSAGES_FAILURE:
      return {
        ...state,
        chatLoading: false,
        messages: [],
      }
    case actions.NP_UPDATE_MESSAGE: {
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
    case actions.NP_END_CHANNEL_SUCCESS:
      return {
        ...state,
        isChannelEnded: true,
      }
    case actions.NP_END_CHANNEL_FAILURE:
      return {
        ...state,
        isChannelEnded: false,
      }
    case actions.NP_VISIBLE_MEMBERS:
      return {
        ...state,
        visibleMembers: action.value,
      }
    case actions.NP_SHOW_ADD_MEMBER:
      return {
        ...state,
        visibleAddMember: action.value,
      }
    case actions.NP_INITIALISE_TWILIO_CHAT_CLIENT: {
      return {
        ...state,
      }
    }
    case actions.NP_INITIALISE_TWILIO_CHAT_CLIENT_SUCCESS: {
      const { chatClient } = action.payload
      return {
        ...state,
        chatClient,
      }
    }
    case actions.NP_INITIALISE_TWILIO_CHAT_CLIENT_FAILURE: {
      return {
        ...state,
      }
    }
    // case actions.NP_SET_STREAMING_CHANNELS: {
    //   return {
    //     ...state,
    //   }
    // }
    // case actions.NP_SET_STREAMING_CHANNELS_SUCCESS: {
    //   const { activeTradeStreamingChannel } = action.payload
    //   return {
    //     ...state,
    //     activeTradeStreamingChannel,
    //   }
    // }
    // case actions.NP_SET_STREAMING_CHANNELS_FAILURE: {
    //   return {
    //     ...state,
    //   }
    // }
    case actions.NP_SET_CURRENT_TRADE_CHAT_CHANNEL: {
      return {
        ...state,
      }
    }
    case actions.NP_SET_CURRENT_TRADE_CHAT_CHANNEL_SUCCESS: {
      const { activeCurrentTradeChatChannel } = action.payload
      return {
        ...state,
        activeCurrentTradeChatChannel,
      }
    }
    case actions.NP_SET_CURRENT_TRADE_CHAT_CHANNEL_FAILURE: {
      return {
        ...state,
      }
    }
    default:
      return state
  }
}
