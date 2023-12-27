import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import NProgress from 'nprogress'

import { formatToZoneDateTZFormat } from 'utilities/transformer'
import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'
import actions from './actions'
import tradeActions from '../trade/actions'
import transactionActions from '../transactions/actions'
import cryptoTransactionActions from '../cryptoTransactions/actions'

const { txnPrivatePost, preSignedURLPut, fileUploadPrivatePost, txnPrivatePut } = axiosMethod

const { globalMessages } = Variables

const getPresignedURL = (files, token, type) => {
  let optionType = 'download'
  let endpoint = 'download'
  let params

  if (type) optionType = type

  if (optionType === 'upload') {
    endpoint = 'upload'
    params = {
      fileName: files.fileName,
      filePath: files.filePath,
      fileSize: files.fileSize,
      fileType: files.fileType,
    }
  } else {
    const modifiedFiles = files.map(file => {
      return {
        fileName: file.friendlyName,
        filePath: file.filePath,
      }
    })

    if (files.length === 1) {
      params = {
        files: modifiedFiles,
      }
    } else if (files.length > 1) {
      params = {
        rootZipPath: files[0].filePath,
        zipFileName: 'extract.zip',
        files: modifiedFiles,
      }
    }
  }

  return fileUploadPrivatePost(`${endpoint}`, params, token).then(response => {
    return response.data.data.presignedUrl
  })
}

const updatePayslipStatus = (id, status, token) => {
  const values = [{ fileStatus: status }]
  return txnPrivatePut(`tx-service/files/${id}`, values, token).then(response => {
    return response.data.data
  })
}

const startUpload = async (fileList, token) => {
  const fileUploadArray = []

  fileList.forEach(async file => {
    const { name, fileType, fileSize, filePath, id } = file

    const preSignedURLRequestparams = {
      fileName: name,
      fileType,
      fileSize,
      filePath,
    }

    await updatePayslipStatus(id, 'uploading', token)

    const preSignedURLForUpload = await getPresignedURL(preSignedURLRequestparams, token, 'upload')

    const fileUploadResponse = await preSignedURLPut(
      preSignedURLForUpload,
      file.originFileObj,
      fileType,
    )

    NProgress.done()

    await updatePayslipStatus(id, 'uploaded', token)

    const preSignedURLForDownload = await getPresignedURL(
      [preSignedURLRequestparams],
      token,
      'download',
    )

    file.status = fileUploadResponse.status === 200 ? 'done' : 'error'
    file.originFileObj.status = fileUploadResponse.status === 200 ? 'done' : 'error'
    file.etag = fileUploadResponse.headers.etag
    file.url = preSignedURLForDownload

    fileUploadArray.push(file)
  })

  return fileUploadArray
}

export function* initiateUpload(files) {
  const { payload, token } = files
  const { fileList } = payload
  try {
    NProgress.start()
    const response = yield call(startUpload, fileList, token)
    yield put({
      type: actions.NP_INITIATE_UPLOAD_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.NP_INITIATE_UPLOAD_FAILURE,
    })
    NProgress.done()
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const createDepositFile = (values, token) => {
  return txnPrivatePost(`tx-service/files`, values, token).then(response => {
    return response.data.data
  })
}

export function* createDepositFileInTrade(values) {
  const { value, token } = values
  const {
    fileList,
    tradeOrTranId,
    category,
    clientOrVendorName,
    documentType,
    progressLogs,
    timeZone,
  } = value
  try {
    const createFileData = fileList.map(file => {
      const { uid, name, type, size, status } = file
      const fileDetails = {
        uid,
        fileName: name,
        fileType: type,
        fileSize: size,
        filePath: `${clientOrVendorName}/${documentType}/${tradeOrTranId}`,
        status,
      }

      if (category === 'merchant' || category === 'introducer' || category === 'indvidual') {
        fileDetails.tradeId = tradeOrTranId
      }
      // else if (category === 'otc' || category === 'liquidate' || category === 'crypto_wallet') {
      //   fileDetails.cryptoTransactionId = tradeOrTranId
      // }
      else {
        fileDetails.transactionId = tradeOrTranId
      }

      return fileDetails
    })

    const response = yield call(createDepositFile, createFileData, token)
    if (category === 'merchant' || category === 'introducer' || category === 'indvidual') {
      yield put({
        type: actions.NP_CREATE_DEPOSIT_SLIP_SUCCESS,
        value: response,
      })
      const progressData = {
        progressLogs: {
          ...progressLogs,
          depositSlipsSharedByClientAt: formatToZoneDateTZFormat(new Date(), timeZone),
        },
      }
      yield put({
        type: tradeActions.UPDATE_TRADE_DETAILS,
        value: progressData,
        tradeId: tradeOrTranId,
        token,
      })
    }
    if (category === 'IsAccountOnly') {
      yield put({
        type: transactionActions.CREATE_REMITTANCE_SLIP_SUCCESS_ACCOUNTS_ONLY,
        value: response,
      })
      const progressData = {
        progressLogs: {
          ...progressLogs,
          paymentSlipSharedByVendorAt: formatToZoneDateTZFormat(new Date(), timeZone),
        },
      }
      yield put({
        type: transactionActions.UPDATE_TRANSACTION_VALUES,
        value: progressData,
        txnId: tradeOrTranId,
        token,
      })
    }
    if (category === 'Swap') {
      yield put({
        type: transactionActions.CREATE_REMITTANCE_SLIP_SUCCESS_SWAP,
        value: response,
      })
      const progressData = {
        progressLogs: {
          ...progressLogs,
          paymentSlipSharedByVendorAt: formatToZoneDateTZFormat(new Date(), timeZone),
        },
      }
      yield put({
        type: transactionActions.UPDATE_TRANSACTION_VALUES,
        value: progressData,
        txnId: tradeOrTranId,
        token,
      })
    }
    if (category === 'Fx') {
      yield put({
        type: transactionActions.CREATE_REMITTANCE_SLIP_SUCCESS_FX,
        value: response,
      })
      const progressData = {
        progressLogs: {
          ...progressLogs,
          paymentSlipSharedByVendorAt: formatToZoneDateTZFormat(new Date(), timeZone),
        },
      }
      yield put({
        type: transactionActions.UPDATE_TRANSACTION_VALUES,
        value: progressData,
        txnId: tradeOrTranId,
        token,
      })
    }
    if (category === 'otc') {
      yield put({
        type: cryptoTransactionActions.CREATE_REMITTANCE_SLIP_SUCCESS_OTC,
        value: response,
      })
    }
    if (category === 'liquidate') {
      yield put({
        type: cryptoTransactionActions.CREATE_REMITTANCE_SLIP_SUCCESS_LIQUIDATE,
        value: response,
      })
    }
    if (category === 'crypto_wallet') {
      yield put({
        type: cryptoTransactionActions.CREATE_REMITTANCE_SLIP_SUCCESS_CWALLET,
        value: response,
      })
    }

    const newFileList = fileList.map(file => {
      const obj = response.find(el => el.uid === file.uid)
      if (obj) {
        return { ...file, ...obj }
      }
      return file
    })

    const uploadPayload = {
      fileList: newFileList,
      tradeOrTranId,
      clientOrVendorName,
      documentType,
    }

    yield put({
      type: actions.NP_INITIATE_UPLOAD,
      payload: uploadPayload,
      token,
    })
  } catch (err) {
    yield put({
      type: actions.NP_CREATE_DEPOSIT_SLIP_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export function* getPreSignedUrl(values) {
  const { value, token } = values
  const { files } = value
  try {
    NProgress.start()
    const response = yield call(getPresignedURL, files, token, 'download')
    yield put({
      type: actions.NP_GET_PRE_SIGNED_URL_SUCCESS,
      value: response,
    })
    NProgress.done()
  } catch (err) {
    yield put({
      type: actions.NP_GET_PRE_SIGNED_URL_FAILURE,
      value: err,
    })
    NProgress.done()
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.NP_INITIATE_UPLOAD, initiateUpload),
    takeLatest(actions.NP_CREATE_DEPOSIT_SLIP, createDepositFileInTrade),
    takeLatest(actions.NP_GET_PRE_SIGNED_URL, getPreSignedUrl),
  ])
}
