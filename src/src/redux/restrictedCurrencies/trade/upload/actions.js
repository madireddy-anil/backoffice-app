const actions = {
  NP_FILE_LIST_UPDATE: 'NP_FILE_LIST_UPDATE',

  NP_INITIATE_UPLOAD: 'NP_INITIATE_UPLOAD',
  NP_INITIATE_UPLOAD_SUCCESS: 'NP_INITIATE_UPLOAD_SUCCESS',
  NP_INITIATE_UPLOAD_FAILURE: 'NP_INITIATE_UPLOAD_FAILURE',

  NP_GET_PRE_SIGNED_URL: 'NP_GET_PRE_SIGNED_URL',
  NP_GET_PRE_SIGNED_URL_SUCCESS: 'NP_GET_PRE_SIGNED_URL_SUCCESS',
  NP_GET_PRE_SIGNED_URL_FAILURE: 'NP_GET_PRE_SIGNED_URL_FAILURE',

  NP_CREATE_DEPOSIT_SLIP: 'NP_CREATE_DEPOSIT_SLIP',
  NP_CREATE_DEPOSIT_SLIP_SUCCESS: 'NP_CREATE_DEPOSIT_SLIP_SUCCESS',
  NP_CREATE_DEPOSIT_SLIP_FAILURE: 'NP_CREATE_DEPOSIT_SLIP_FAILURE',

  NP_UPDATE_DEPOSIT_SLIP: 'NP_UPDATE_DEPOSIT_SLIP',
  NP_UPDATE_DEPOSIT_SLIP_SUCCESS: 'NP_UPDATE_DEPOSIT_SLIP_SUCCESS',
  NP_UPDATE_DEPOSIT_SLIP_FAILURE: 'NP_UPDATE_DEPOSIT_SLIP_FAILURE',
}
export default actions

export const fileListUpdate = value => {
  return {
    type: actions.NP_FILE_LIST_UPDATE,
    payload: value.payload,
  }
}

export const initiateUpload = (value, token) => {
  return {
    type: actions.NP_INITIATE_UPLOAD,
    payload: value.payload,
    token,
  }
}

export const createPaySlip = (value, token) => {
  return {
    type: actions.NP_CREATE_DEPOSIT_SLIP,
    value,
    token,
  }
}

export const getPresignedUrl = (value, token) => {
  return {
    type: actions.NP_GET_PRE_SIGNED_URL,
    value,
    token,
  }
}
