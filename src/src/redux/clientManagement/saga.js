import { all, put, call, takeEvery, select } from 'redux-saga/effects'
import { notification } from 'antd'
// import {transformDocuments} from 'utilities/transformer'
import DownloadFile from 'components/customComponents/DownloadFile'
import ViewPdfFile from 'components/customComponents/ViewPdfFile'

import axiosMethod from '../../utilities/apiCaller'

import actions from './actions'

const {
  clientConnectPrivateGet,
  clientConnectPrivatePut,
  documentPrivateDelete,
  clientConnectPrivatePost,
  ccFileUploadPrivatePut,
  gppPrivatePut,
  gppPrivatePost,
} = axiosMethod

const getClientManagement = (values, token) => {
  const querySymbol = values.page || values.limit ? '?' : ''
  const page = values.page ? encodeURI(`page=${values.page}`) : ''

  const limit = values.limit ? encodeURI(`&limit=${values.limit}`) : encodeURI(`?limit=0`)
  return clientConnectPrivateGet(`entities/clients${querySymbol}${page}${limit}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getAllClientManagement(values) {
  const { value, token } = values
  try {
    const response = yield call(getClientManagement, value, token)
    yield put({
      type: actions.GET_CLIENT_MANAGEMENT_SUCCESS,
      value: response.entities,
      totalPages: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CLIENT_MANAGEMENT_FAILURE,
      payload: err,
    })
  }
}

const getclientmanagementById = (id, token) => {
  return clientConnectPrivateGet(`entities/clients/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* getClientManagementById(values) {
  const { id, token } = values
  try {
    const response = yield call(getclientmanagementById, id, token)
    yield put({
      type: actions.GET_CLIENT_MANAGEMENT_BY_ID_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_DOCUMENTS_QUESTIONS,
      entityId: id,
      token,
    })
    yield put({
      type: actions.GET_ALL_STAKEHOLDERS_BY_ID,
      entityId: id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CLIENT_MANAGEMENT_BY_ID_FAILURE,
      payload: err,
    })
  }
}

const getPayconstructProducts = values => {
  const { accessToken } = values
  return clientConnectPrivateGet(`brands?limit=0`, accessToken).then(response => {
    return response.data.data
  })
}

export function* GETPAYCONSTRUCTPRODUCTS(values) {
  const { payload } = values
  try {
    const response = yield call(getPayconstructProducts, payload)
    yield put({
      type: actions.GET_PAYCONSTRUCT_PRODUCTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PAYCONSTRUCT_PRODUCTS_FAILURE,
      payload: err,
    })
  }
}

const updateClientManagement = (id, value, token) => {
  return clientConnectPrivatePut(`entities/clients/${id}`, value, token).then(response => {
    return response.data.data
  })
}

export function* updateAllClientManagement(values) {
  const { id, value, token } = values
  try {
    const response = yield call(updateClientManagement, id, value, token)
    yield put({
      type: actions.UPDATE_CLIENT_MANAGEMENT_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CLIENT_MANAGEMENT_BY_ID,
      id,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_CLIENT_MANAGEMENT_FALIURE,
      payload: err,
    })
    notification.error({
      message: 'Error',
      description: 'Failed to update record',
    })
  }
}

const getDocumentsFile = (entityId, token) => {
  return clientConnectPrivateGet(`documents?limit=0&entityId=${entityId}`, token).then(response => {
    return response.data.fileData
  })
}

export function* GETDOCUMENTSFILE(values) {
  const { entityId, token } = values
  try {
    const response = yield call(getDocumentsFile, entityId, token)
    // const test = transformDocuments(response, docList)
    yield put({
      type: actions.GET_DOCUMENTS_FILE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DOCUMENTS_FILE_FAILURE,
      payload: err,
    })
  }
}

const removeDocumentFiles = (values, entityId, token) => {
  return documentPrivateDelete(`file-delete?entityId=${entityId}`, values, token).then(response => {
    return response.data.data
  })
}

export function* REMOVEDOCUMENTFILES(values) {
  const { payload, entityId, token } = values
  try {
    const response = yield call(removeDocumentFiles, payload, entityId, token)
    yield put({
      type: actions.REMOVE_DOCUMENT_FILES_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_DOCUMENTS_FILE,
      entityId,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.REMOVE_DOCUMENT_FILES_FAILURE,
      payload: err,
    })
  }
}

// stakeholders

const getAllStakeholders = (entityId, token) => {
  return clientConnectPrivateGet(`people?entityId=${entityId}`, token).then(response => {
    return response.data.data.people
  })
}

export function* getCompanyStakeholders(values) {
  const { entityId, token } = values
  try {
    const response = yield call(getAllStakeholders, entityId, token)
    yield put({
      type: actions.GET_ALL_STAKEHOLDERS_BY_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_STAKEHOLDERS_BY_ID_FAILURE,
      payload: err,
    })
  }
}

// documents

const uploadDocFile = value => {
  const { data, path } = value
  return ccFileUploadPrivatePut(`${path}`, data).then(response => {
    return response.data.data
  })
}

export function* uploadFile(values) {
  const { payload } = values
  try {
    const response = yield call(uploadDocFile, payload)
    const userState = yield select(state => state.user)
    const clientManagementState = yield select(state => state.clientManagement)
    yield put({
      type: actions.UPLOAD_FILE_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_DOCUMENTS_FILE,
      entityId: clientManagementState.entityId,
      token: userState.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPLOAD_FILE_FAILURE,
      payload: err,
    })
  }
}

const preSignedUrl = value => {
  const { file, entityId, token } = value
  const request = {
    fileName: file.name,
    documentType: file.documentType,
    uid: file.uid,
  }
  return clientConnectPrivatePost(`file-upload?entityId=${entityId}`, request, token).then(
    response => {
      return response.data
    },
  )
}

export function* getPresignedUrl(values) {
  try {
    const response = yield call(preSignedUrl, values)
    yield put({
      type: actions.GET_PRESIGNED_URL_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.UPLOAD_FILE,
      payload: {
        data: values.file,
        path: response.url,
      },
    })
  } catch (err) {
    yield put({
      type: actions.GET_PRESIGNED_URL_FAILURE,
      payload: err,
    })
  }
}

const preSignedUrlDownload = (file, entityId, token, isDownloadable) => {
  const request = {
    fileName: file[0].fileName,
    documentType: file[0].documentType,
    isDownload: isDownloadable,
  }
  return clientConnectPrivatePost(`view-file?entityId=${entityId}`, request, token).then(
    response => {
      return response.data
    },
  )
}

export function* getPresignedUrlForDownload(values) {
  const { file, entityId, token, isDownloadable } = values
  try {
    const response = yield call(preSignedUrlDownload, file, entityId, token, isDownloadable)
    DownloadFile(response.url, file[0].fileName, file[0].type)
    yield put({
      type: actions.GET_PRESIGNED_URL_DOWNLOAD_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PRESIGNED_URL_DOWNLOAD_FAILURE,
      payload: err,
    })
  }
}

const preSignedUrlPreview = (file, entityId, token, isDownloadable) => {
  const request = {
    fileName: file.fileName,
    documentType: file.documentType,
    isDownload: isDownloadable,
  }
  return clientConnectPrivatePost(`view-file?entityId=${entityId}`, request, token).then(
    response => {
      return response.data
    },
  )
}

export function* getPresignedUrlForPreview(values) {
  const { file, entityId, token, isDownloadable } = values
  try {
    const response = yield call(preSignedUrlPreview, file, entityId, token, isDownloadable)
    if (file.type === 'pdf') {
      ViewPdfFile(response.url)
    }
    yield put({
      type: actions.GET_PRESIGNED_URL_PREVIEW_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PRESIGNED_URL_PREVIEW_FAILURE,
      payload: err,
    })
  }
}

const prePeopleSignedUrlPreview = (request, token) => {
  return gppPrivatePost(`peoples/signed-url`, request, token).then(response => {
    return response.data
  })
}

export function* getPeoplePresignedUrlForPreview(values) {
  const { data, token } = values
  try {
    const response = yield call(prePeopleSignedUrlPreview, data, token)
    const fileType = data.fileName.split('.')[1]
    if (fileType === 'pdf') {
      ViewPdfFile(response.signedUrl)
    }
    yield put({
      type: actions.GET_STAKEHOLDER_PRESIGNED_URL_PREVIEW_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_STAKEHOLDER_PRESIGNED_URL_PREVIEW_FAILURE,
      payload: err,
    })
  }
}

const prePeopleSignedUrlDownload = (request, token) => {
  return gppPrivatePost(`peoples/signed-url`, request, token).then(response => {
    return response.data
  })
}

export function* getProplePresignedUrlForDownload(values) {
  const { data, token } = values
  try {
    const response = yield call(prePeopleSignedUrlDownload, data, token)
    DownloadFile(response?.signedUrl, data.fileName, 'file')
    yield put({
      type: actions.GET_STAKEHOLDER_PRESIGNED_URL_DOWNLOAD_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_STAKEHOLDER_PRESIGNED_URL_DOWNLOAD_FAILURE,
      payload: err,
    })
  }
}

const getDocumentsQuestions = (entityId, token) => {
  return clientConnectPrivateGet(`required-documents?entityId=${entityId}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* documentsList(values) {
  const { entityId, token } = values
  try {
    const response = yield call(getDocumentsQuestions, entityId, token)
    yield put({
      type: actions.GET_DOCUMENTS_QUESTIONS_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_DOCUMENTS_FILE,
      entityId,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DOCUMENTS_QUESTIONS_FAILURE,
      payload: err,
    })
  }
}

const documentStatus = (data, file, token) => {
  return clientConnectPrivatePut(`documents/name/${file}`, data, token).then(response => {
    return response.data.data
  })
}

export function* updateDocumentStatus(values) {
  const { data, file, token } = values
  try {
    const response = yield call(documentStatus, data, file, token)
    const clientManagementState = yield select(state => state.clientManagement)
    yield put({
      type: actions.UPDATE_DOCUMENT_STATUS_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_DOCUMENTS_FILE,
      entityId: clientManagementState.entityId,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_DOCUMENT_STATUS_FAILURE,
      payload: err,
    })
  }
}

// overall application status update

const applicationStatusUpdate = (entityId, data, token) => {
  return gppPrivatePut(`kyc-status/${entityId}`, data, token).then(response => {
    return response.data.data
  })
}

export function* updateApplicationStatus(values) {
  const { entityId, value, token } = values
  try {
    const response = yield call(applicationStatusUpdate, entityId, value, token)
    // const clientManagementState = yield select(state => state.clientManagement)
    yield put({
      type: actions.UPDATE_OVERALL_APPLICATION_STATUS_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CLIENT_MANAGEMENT_BY_ID,
      id: entityId,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_OVERALL_APPLICATION_STATUS_FAILURE,
      payload: err,
    })
  }
}

const updateKycRefreshDateCall = (entityId, data, token) => {
  return gppPrivatePut(`kyc-refresh/${entityId}`, data, token).then(response => {
    return response.data.data
  })
}

export function* updateKycRefresh(values) {
  const { entityId, value, token } = values

  try {
    const response = yield call(updateKycRefreshDateCall, entityId, value, token)
    // const clientManagementState = yield select(state => state.clientManagement)
    yield put({
      type: actions.UPDATE_KYC_REFRESH_DATE_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_CLIENT_MANAGEMENT_BY_ID,
      id: entityId,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_KYC_REFRESH_DATE_FAILURE,
      payload: err,
    })
  }
}

const sendComplianceMail = (entityId, token) => {
  return clientConnectPrivatePost(`compliance-review`, { entityId }, token).then(response => {
    return response.data.data
  })
}

export function* sendComplianceReviewMail(values) {
  const { entityId, token } = values
  try {
    const response = yield call(sendComplianceMail, entityId, token)
    yield put({
      type: actions.SEND_COMPLIANCE_REVIEW_MAIL_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.SEND_COMPLIANCE_REVIEW_MAIL_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CLIENT_MANAGEMENT, getAllClientManagement),
    takeEvery(actions.GET_CLIENT_MANAGEMENT_BY_ID, getClientManagementById),
    takeEvery(actions.UPDATE_CLIENT_MANAGEMENT, updateAllClientManagement),
    takeEvery(actions.GET_PAYCONSTRUCT_PRODUCTS, GETPAYCONSTRUCTPRODUCTS),

    // documents
    takeEvery(actions.GET_DOCUMENTS_QUESTIONS, documentsList),
    takeEvery(actions.GET_DOCUMENTS_FILE, GETDOCUMENTSFILE),
    takeEvery(actions.REMOVE_DOCUMENT_FILES, REMOVEDOCUMENTFILES),
    takeEvery(actions.GET_PRESIGNED_URL, getPresignedUrl),
    takeEvery(actions.GET_PRESIGNED_URL_PREVIEW, getPresignedUrlForPreview),
    takeEvery(actions.GET_PRESIGNED_URL_DOWNLOAD, getPresignedUrlForDownload),
    takeEvery(actions.GET_STAKEHOLDER_PRESIGNED_URL_PREVIEW, getPeoplePresignedUrlForPreview),
    takeEvery(actions.GET_STAKEHOLDER_PRESIGNED_URL_DOWNLOAD, getProplePresignedUrlForDownload),
    takeEvery(actions.UPLOAD_FILE, uploadFile),
    takeEvery(actions.UPDATE_DOCUMENT_STATUS, updateDocumentStatus),
    // stakeholders
    takeEvery(actions.GET_ALL_STAKEHOLDERS_BY_ID, getCompanyStakeholders),
    // application status update
    takeEvery(actions.UPDATE_OVERALL_APPLICATION_STATUS, updateApplicationStatus),
    takeEvery(actions.UPDATE_KYC_REFRESH_DATE, updateKycRefresh),

    // Handle Compliance Review Email
    takeEvery(actions.SEND_COMPLIANCE_REVIEW_MAIL, sendComplianceReviewMail),
  ])
}
