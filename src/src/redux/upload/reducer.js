import actions from './actions'

const initialState = {
  fileList: [],
  file: {},
  loading: false,
  preSignedURL: '',
}

export default function fileUploadReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FILE_LIST_UPDATE:
      return {
        ...state,
        fileList: [...state.fileList, action.payload],
      }
    case actions.INITIATE_UPLOAD:
      return {
        ...state,
        ...initialState,
      }
    case actions.INITIATE_UPLOAD_SUCCESS:
      return {
        ...state,
        fileList: action.value,
      }
    case actions.INITIATE_UPLOAD_FAILURE:
      return {
        ...state,
      }
    case actions.GET_PRE_SIGNED_URL:
      return {
        ...state,
        preSignedURL: '',
      }
    case actions.GET_PRE_SIGNED_URL_SUCCESS:
      return {
        ...state,
        preSignedURL: action.value,
      }
    case actions.GET_PRE_SIGNED_URL_FAILURE:
      return {
        ...state,
        preSignedURL: '',
      }
    default:
      return state
  }
}
