const actions = {
  FILE_LIST_UPDATE: 'FILE_LIST_UPDATE',

  INITIATE_UPLOAD: 'INITIATE_UPLOAD',
  INITIATE_UPLOAD_SUCCESS: 'INITIATE_UPLOAD_SUCCESS',
  INITIATE_UPLOAD_FAILURE: 'INITIATE_UPLOAD_FAILURE',

  GET_PRE_SIGNED_URL: 'GET_PRE_SIGNED_URL',
  GET_PRE_SIGNED_URL_SUCCESS: 'GET_PRE_SIGNED_URL_SUCCESS',
  GET_PRE_SIGNED_URL_FAILURE: 'GET_PRE_SIGNED_URL_FAILURE',

  CREATE_DEPOSIT_SLIP: 'CREATE_DEPOSIT_SLIP',
  CREATE_DEPOSIT_SLIP_SUCCESS: 'CREATE_DEPOSIT_SLIP_SUCCESS',
  CREATE_DEPOSIT_SLIP_FAILURE: 'CREATE_DEPOSIT_SLIP_FAILURE',

  UPDATE_DEPOSIT_SLIP: 'UPDATE_DEPOSIT_SLIP',
  UPDATE_DEPOSIT_SLIP_SUCCESS: 'UPDATE_DEPOSIT_SLIP_SUCCESS',
  UPDATE_DEPOSIT_SLIP_FAILURE: 'UPDATE_DEPOSIT_SLIP_FAILURE',
}
export default actions

export const fileListUpdate = value => {
  return {
    type: actions.FILE_LIST_UPDATE,
    payload: value.payload,
  }
}

export const initiateUpload = (value, token) => {
  return {
    type: actions.INITIATE_UPLOAD,
    payload: value.payload,
    token,
  }
}

export const createPaySlip = (value, token) => {
  return {
    type: actions.CREATE_DEPOSIT_SLIP,
    value,
    token,
  }
}

export const getPresignedUrl = (value, token) => {
  return {
    type: actions.GET_PRE_SIGNED_URL,
    value,
    token,
  }
}
