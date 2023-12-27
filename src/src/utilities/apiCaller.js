import axios from 'axios'
import config from '../config/config'

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'
axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'

const {
  authApi,
  transactionsApi,
  reportsApi,
  chatApi,
  fileUploadApi,
  currencyAccountsApi,
  clientConnectApi,
  gppURL,
  ppBeneficiaryApi,
} = config

// auth
const authPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${authApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const authPrivateGet = (endpoint, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.get(`${authApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

// transactions
const txnPublicGet = endpoint => {
  return axios.get(`${transactionsApi}/${endpoint}`).then(response => {
    return response
  })
}

const txnPublicPost = (endpoint, body) => {
  return axios.post(`${transactionsApi}/${endpoint}`, body).then(response => {
    return response
  })
}

const txnPublicPut = (endpoint, body) => {
  return axios.put(`${transactionsApi}/${endpoint}`, body).then(response => {
    return response
  })
}

const txnPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${transactionsApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const txnPrivateGet = (endpoint, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.get(`${transactionsApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

const txnPrivatePut = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.put(`${transactionsApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const txnPrivateDelete = (endpoint, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.delete(`${transactionsApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

// report
const reportsPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${reportsApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const reportsPrivateGet = (endpoint, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.get(`${reportsApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

// chat
const chatPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${chatApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const chatPrivateGet = (endpoint, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.get(`${chatApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

const chatPrivatePut = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.put(`${chatApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const chatPrivateDelete = (endpoint, token) => {
  return axios
    .delete(`${chatApi}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(response => {
      return response
    })
}

// File upload Lambda

const fileUploadPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${fileUploadApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const fileUploadPrivatePut = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.put(`${fileUploadApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const fileUploadPrivateGet = endpoint => {
  const apiConfig = {
    headers: { 'content-type': 'application/json' },
  }
  return axios.get(`${fileUploadApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

const preSignedURLPut = (preSignedURL, body, type) => {
  const apiConfig = {
    headers: { 'content-type': type },
    reportProgress: true,
  }
  return axios.put(`${preSignedURL}`, body, apiConfig).then(response => {
    return response
  })
}

// currency accounts

const cAPrivateGet = (endpoint, token) => {
  const apiConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`${currencyAccountsApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

const cAPrivatePut = (endpoint, body, token) => {
  const apiConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${currencyAccountsApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const cAPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${currencyAccountsApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const cAPrivateDelete = (endpoint, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.delete(`${currencyAccountsApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

const clientConnectPrivateGet = (endpoint, token) => {
  const apiConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`${clientConnectApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

const clientConnectPrivatePut = (endpoint, body, token) => {
  const apiConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${clientConnectApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const clientConnectPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${clientConnectApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const clientConnectPrivateDelete = (endpoint, token) => {
  return axios
    .delete(`${clientConnectApi}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
    .then(response => {
      return response
    })
}

const documentPrivateGet = (endpoint, body, token) => {
  const apiConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`${clientConnectApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const documentPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${clientConnectApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const documentPrivateDelete = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${clientConnectApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const ccFileUploadPrivatePut = (fileUploadUrl, body) => {
  const apiConfig = {
    headers: { 'content-type': body.type },
  }
  return axios.put(`${fileUploadUrl}`, body, apiConfig).then(response => {
    return response
  })
}

const gppPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${gppURL}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const gppPrivatePut = (endpoint, body, token) => {
  const apiConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.put(`${gppURL}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

const ppBeneficiaryPrivateGet = (endpoint, token) => {
  const apiConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`${ppBeneficiaryApi}/${endpoint}`, apiConfig).then(response => {
    return response
  })
}

const ppBeneficiaryPrivatePost = (endpoint, body, token) => {
  const apiConfig = {
    headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
  }
  return axios.post(`${ppBeneficiaryApi}/${endpoint}`, body, apiConfig).then(response => {
    return response
  })
}

export default {
  authPrivatePost,
  authPrivateGet,
  txnPublicGet,
  txnPublicPost,
  txnPublicPut,
  txnPrivatePost,
  txnPrivateGet,
  txnPrivatePut,
  txnPrivateDelete,
  reportsPrivatePost,
  reportsPrivateGet,
  chatPrivatePost,
  chatPrivateGet,
  chatPrivatePut,
  chatPrivateDelete,
  fileUploadPrivateGet,
  fileUploadPrivatePost,
  preSignedURLPut,
  cAPrivateGet,
  cAPrivatePut,
  cAPrivatePost,
  cAPrivateDelete,
  fileUploadPrivatePut,
  clientConnectPrivateGet,
  clientConnectPrivatePut,
  clientConnectPrivatePost,
  clientConnectPrivateDelete,
  documentPrivateGet,
  documentPrivatePost,
  documentPrivateDelete,

  ccFileUploadPrivatePut,

  gppPrivatePost,
  gppPrivatePut,

  ppBeneficiaryPrivateGet,
  ppBeneficiaryPrivatePost,
}
