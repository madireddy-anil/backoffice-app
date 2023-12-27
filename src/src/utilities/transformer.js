import moment from 'moment-timezone'
import * as ExcelJS from 'exceljs/dist/exceljs'
import { saveAs } from 'file-saver'
import lodash from 'lodash'

export function dateRangeResetTheTime(evt) {
  if (evt.length > 0) {
    if (evt[1].diff(evt[0], 'minute') === 0) {
      evt[0] = evt[0].startOf('day')
    }
    if (moment().diff(evt[1], 'day') < 0) {
      evt[1] = moment()
    }
  }
}

export function dateRangeResetAfterReset(evt, appliedDateFilter) {
  if (evt.length > 1) {
    if (appliedDateFilter) {
      if (appliedDateFilter.length > 0) {
        if (
          appliedDateFilter[0].format('HH:mm:ss') === evt[0].format('HH:mm:ss') &&
          appliedDateFilter[1].format('HH:mm:ss') === evt[1].format('HH:mm:ss') &&
          evt[0].format('HH:mm:ss') !== '00:00:00' &&
          evt[1].format('HH:mm:ss') !== '23:59:59'
        ) {
          evt[0] = evt[0].startOf('day')
          evt[1] = evt[1].endOf('day')
        }
      }
    }
  }
}

export const ClearFilterOnComponentUnMount = (path, filterResetDispatchFunc, dispatch) => {
  if (
    ![
      '/trade',
      '/view-account',
      '/edit-account',
      '/beneficiary',
      '/view-cryptoBeneficiary',
      '/edit-cryptoBeneficiary',
      '/fx-base-rate',
    ].includes(path)
  ) {
    dispatch(filterResetDispatchFunc({}))
  }
}

export const restrictDateFor45Days = evt => {
  if (evt) {
    if (evt[1].diff(evt[0], 'days') + 1 <= 45) {
      return true
    }
  }
  return false
}

export const toUKDateFormat = inputFormat => {
  const date = inputFormat.substring(8, 10)
  const month = inputFormat.substring(5, 7)
  const year = inputFormat.substring(0, 4)
  const ukDate = `${date}/${month}/${year}`
  return ukDate
}

export const formatDate = date => {
  const dateTime = date.replace('T', ' ').replace('Z', '')
  const formatedDateTime = dateTime.substring(0, dateTime.length - 1)

  return formatedDateTime
}

export const formatDateAndTime = (date, tz) => {
  const dateTime = moment(date)
  const formatedDateTime = dateTime.tz(tz).format('DD/MM/YYYY')
  return moment(formatedDateTime, 'DD/MM/YYYY')
}

export const formatToZoneDateOnly = (date, tz) => {
  const dateTime = moment(date)
  const formatedDateTime = dateTime.tz(tz).format('DD/MM/YYYY')
  return formatedDateTime
}

export const formatToZoneDate = (date, tz) => {
  const dateTime = moment(date)
  const formatedDateTime = dateTime.tz(tz).format('DD/MM/YYYY HH:mm:ss')
  return formatedDateTime
}

export const formatToZoneDateTZFormat = (date, tz) => {
  const dateTime = moment(date)
  const formatedDateTime = dateTime.tz(tz).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  return formatedDateTime
}

export const formatToZoneTime = (date, tz) => {
  const dateTime = moment(date)
  const formatedHKTTime = dateTime.tz(tz).format('HH:mm:ss')
  return formatedHKTTime
}

export const formatChatLongTime = (date, tz) => {
  const dateTime = moment(date)
  const formatedHKTTime = dateTime.tz(tz).format('DD/MM/YYYY, hh:mm:ss A')
  return formatedHKTTime
}

export const formatChatShortTime = (date, tz) => {
  const dateTime = moment(date)
  const formatedHKTTime = dateTime.tz(tz).format('h:mm A')
  return formatedHKTTime
}

export const parseQueryString = str => {
  const objURL = {}
  str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), ($0, $1, $2, $3) => {
    objURL[$1] = $3
  })
  return objURL
}

export const amountFormatter = (amount, precision) => {
  precision = precision || 2
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
  })
  const numberFormatForDisplay = formatter.format(amount)
  return numberFormatForDisplay
}

export const precisionBasedAmountFormatter = (amount = 0) => {
  let precision
  if (Math.floor(amount) !== amount) {
    precision = amount.toString().split('.')[1].length || 0
  }
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
  })
  const numberFormatForDisplay = formatter.format(amount)
  return numberFormatForDisplay
}

export const updateObjInArray = (arr, obj) => {
  const newArr = arr.map(item => (item.id === obj.id ? obj : item))
  return newArr
}

export const getFormattedCurrencyOptions = options => {
  const newOptions = options.map(option => {
    return {
      id: option.id,
      value: option.value,
      title: option.value,
    }
  })
  return newOptions
}

export const getFormattedVendorOptions = options => {
  const newOptions = options?.map(option => {
    return {
      id: option.id,
      value: option.id,
      title: option.genericInformation?.tradingName,
      subtitle: option.genericInformation?.registeredCompanyName,
    }
  })
  return newOptions
}

export const getFormattedClientOptions = options => {
  const newOptions = options.map(option => {
    return {
      id: option.id,
      value: option.id,
      title: option.tradingName,
      subtitle: option.registeredCompanyName,
    }
  })
  return newOptions
}

export const transformBeneKey = (key, beneFieldsList) => {
  const label = beneFieldsList.find(bene => bene.schemaName === key)
  return label === undefined ? '' : label.schemaName
}

export const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const getLocalDepositAccountNames = accounts => {
  const names = []
  accounts.forEach(obj => {
    Object.entries(obj).forEach(([Key, value]) => {
      if (Key === 'accountNumber') {
        names.push(value)
      }
    })
  })
  return names
}

export const getDepositAccPreference = client => {
  if (!client.genericInformation.hasPartnerCompanies) {
    if (client.isPersonalAccount && client.isCorporateAccount) {
      return 'PersonalAccount'
    }
    if (client.isCorporateAccount) {
      return 'CorporateAccount'
    }
    return 'PersonalAccount'
  }
  return ''
}

export const getNextStepNotification = nextStep => {
  switch (nextStep) {
    case 'accounts_requested':
      return 'Please create a route below in the route engine table'

    default:
      return 'Please create a route below in the route engine table'
  }
}

// append multiple values into single params

export const formParamString = (arrayName, array) => {
  let string = ''
  if (array.length > 1) {
    array.forEach(item => {
      const resp = `&${arrayName}[]=${item}`
      string += resp
    })
  } else {
    string = `&${arrayName}=${array[0]}`
  }
  return string
}

export const modifyCurrencyTableData = currencies => {
  const transformData = []
  if (currencies.length > 0) {
    currencies.map(item => {
      item.currencyAccount = item.currencyAccount && getModifiedFieldValue(item.currencyAccount)
      item.payments = item.payments && getModifiedFieldValue(item.payments)
      item.deposits = item.deposits && getModifiedFieldValue(item.deposits)
      item.restrictedDeposits =
        item.restrictedDeposits && getModifiedFieldValue(item.restrictedDeposits)
      return transformData.push(item)
    })
    return transformData
  }
  return transformData
}

export const modifyCurrency = currencies => {
  const modifiedCurrency = []
  for (let i = 0; i < currencies.length; i += 1) {
    modifiedCurrency.push({
      id: currencies[i].id,
      title: currencies[i].name,
      value: currencies[i].code,
      type: currencies[i].type,
    })
  }
  modifiedCurrency.sort((a, b) => {
    return a.value.localeCompare(b.value)
  })
  return modifiedCurrency
}

export const arrangeCurrenciesAlphaOrder = currenciesList => {
  currenciesList.sort((a, b) => {
    return a.code.localeCompare(b.code)
  })

  return currenciesList
}

export const modifyCountryTableData = countries => {
  const transformData = []
  if (countries.length > 0) {
    countries.map(item => {
      item.residency = item.residency && getModifiedFieldValue(item.residency)
      item.fiatCurrency = item.fiatCurrency && getModifiedFieldValue(item.fiatCurrency)
      item.payments = item.payments && getModifiedFieldValue(item.payments)
      item.deposits = item.deposits && getModifiedFieldValue(item.deposits)
      item.sanction = item.sanction && getModifiedFieldValue(item.sanction)
      item.mediumRisk = item.mediumRisk && getModifiedFieldValue(item.mediumRisk)
      item.highRisk = item.highRisk && getModifiedFieldValue(item.highRisk)
      return transformData.push(item)
    })
    return transformData
  }
  return transformData
}

export const sortTable = (a, b) => {
  const letterA = a.name && a.name.replace(/\s/g, '')
  const letterB = a.name && b.name.replace(/\s/g, '')

  let comparison = 0
  if (letterA > letterB) {
    comparison = 1
  } else if (letterA < letterB) {
    comparison = -1
  }
  return comparison
}

export const getModifiedFieldValue = value => {
  switch (value) {
    case 'Y':
      return 'Yes'
    case 'N':
      return 'No'
    default:
      return '--'
  }
}

export const maskAccountNumber = accountNumber => {
  const char = '*'
  const maskAccountNum =
    accountNumber.substring(0, 3) + char.repeat(4, 7) + accountNumber.substring(7, 9)
  return maskAccountNum
}

export const transformCA = list => {
  list.map(item => {
    item.hide = true
    item.maskAccountNum = true
    return item
  })
  return list
}

export const getClientName = (clients, list) => {
  list.map(item => {
    clients.map(client => {
      if (item.ownerEntityId === client.id) {
        item.tradingName = client.genericInformation.tradingName
      }
      return item
    })
    return item
  })
  return list
}

export const getVendorName = (vendors, list) => {
  list.map(item => {
    vendors.map(vendor => {
      if (item.ownerEntityId === vendor.id) {
        item.tradingName = vendor.tradingName
      }
      return item
    })
    return item
  })
  return list
}

export const transformCAList = (clients, list) => {
  const caData = list.length > 0 ? getClientName(clients, list) : []
  return caData
}

export const transformVendorCAList = (vendors, list) => {
  const caData = list.length > 0 ? getVendorName(vendors, list) : []
  return caData
}

// export const getClientNameForID = (clients, obj) => {
//   clients.map(client => {
//     if (obj.accountId === client.id) {
//       obj.tradingName = client.tradingName
//     }
//     return obj
//   })
//   return obj
// }

// export const transformCASummary = (clients, obj) => {
//   const caData = Object.entries(obj).length > 0 ? getClientNameForID(clients, obj) : {}
//   return caData
// }

export const transformBalTxn = list => {
  const getSign = item => {
    const credit = `${`+`} ${amountFormatter(item.amount)}`
    const debit = `${`-`} ${amountFormatter(item.amount)}`

    if (
      item?.debitCredit === 'credit' ||
      item?.blockUnblock === 'unblock' ||
      item?.promiseUnpromise === 'promise'
    ) {
      return credit
    }

    return debit
  }

  list.map(item => {
    item.amount = getSign(item)
    item.createdAt = item.createdAt ? formatDate(item.createdAt) : ''
    return item
  })
  return list
}

export const formatNumberDecimal = amount => {
  if (amount) {
    return amount.$numberDecimal ? parseFloat(amount.$numberDecimal) : amount
  }
  return 0
}

export const disabledFutureDate = current => {
  return current > moment().endOf('day')
}

export const cryptoAmountFormatter = (amount, precision) => {
  precision = precision || 4
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
  })
  const numberFormatForDisplay = formatter.format(amount)
  return numberFormatForDisplay
}

export const transformCryptoBalTxn = list => {
  list.map(item => {
    item.amount =
      item.debitCredit === 'credit'
        ? `${`+`} ${cryptoAmountFormatter(item.amount)}`
        : `${`-`} ${cryptoAmountFormatter(item.amount)}`

    return item
  })
  return list
}

export const flattenObject = obj => {
  const flattened = {}

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flattened, flattenObject(obj[key]))
    } else {
      flattened[key] = obj[key]
    }
  })

  return flattened
}

export const transformErrorData = errorData => {
  const errorDataList = []
  Object.entries(errorData).map(([, value]) => {
    return errorDataList.push(value[0])
  })
  return errorDataList
}

export const getProductName = (products, productName) => {
  const productObj = products.find(product => product.value === productName)
  return productObj.title
}

export const transformPricingData = (clients, pricingprofiles) => {
  const transformData = []
  if (pricingprofiles.length > 0) {
    pricingprofiles.map(item => {
      // item.createdAt = item.createdAt ? formatDate(item.createdAt) : ''
      item.tradingName = item.entityId ? getName(clients, item.entityId) : ''
      item.profileType = item.profileType ? capitalize(item.profileType) : ''
      if (item.payments !== undefined) {
        item.payments.direction = item.payments.direction ? capitalize(item.payments.direction) : ''
        item.payments.type = item.payments.type ? capitalize(item.payments.type) : ''
        item.payments.priority = item.payments.type ? capitalize(item.payments.priority) : ''
      }

      if (item.trades !== undefined) {
        item.trades.maxBuyAmount = item.trades.maxBuyAmount
          ? amountFormatter(item.trades.maxBuyAmount)
          : ''
      }

      // item.payments.type = item.payments.type ? capitalize(item.payments.type) : ''
      // item.payments.priority = item.payments.priority ? capitalize(item.payments.priority) : ''
      // if(item.payments.tiering!== undefined){
      //   item.hasPaymentTiers = true
      //   ? amountFormatter(item.payments.invoiceAmount)
      //   : ''
      // item.payments.tiering.liftingFeeAmount = item.payments.liftingFeeAmount
      //   ? amountFormatter(item.payments.liftingFeeAmount)
      //   : ''
      // if (item.payments.single !== undefined) {
      //   item.payments.single.fromValueOfSinglePayment = item.payments.single
      //     .fromValueOfSinglePayment
      //     ? amountFormatter(item.payments.single.fromValueOfSinglePayment)
      //     : ''
      //   item.payments.single.maxValueOfSinglePayment = item.payments.single.maxValueOfSinglePayment
      //     ? amountFormatter(item.payments.single.maxValueOfSinglePayment)
      //     : ''
      // }
      // if (item.payments.monthly !== undefined) {
      //   item.payments.monthly.fromNumber = item.payments.monthly.fromNumber
      //     ? item.payments.monthly.fromNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      //     : ''
      //   item.payments.monthly.maxNumber = item.payments.monthly.maxNumber
      //     ? item.payments.monthly.maxNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      //     : ''
      // }

      // item.trades.maxBuyAmount = item.trades.maxBuyAmount
      //   ? amountFormatter(item.trades.maxBuyAmount)
      //   : ''
      // item.trades.fromNumberOfTrades = item.trades.fromNumberOfTrades
      //   ? item.trades.fromNumberOfTrades.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      //   : ''
      // item.trades.maxNumberOfTrades = item.trades.maxNumberOfTrades
      //   ? item.trades.maxNumberOfTrades.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      //   : ''

      return transformData.push(item)
    })
    return transformData
  }
  return transformData
}

export const getName = (entities, entityId) => {
  const test = entities?.filter(entity => entity?.id === entityId)
  return test?.length > 0 ? test[0]?.genericInformation?.registeredCompanyName : ''
}

export const modifyPricingRecord = (key, value) => {
  let newValue
  if (key === 'direction') {
    newValue = value ? capitalize(value) : '--'
    return newValue
  }
  if (key === 'priority') {
    newValue = value ? capitalize(value) : '--'
    return newValue
  }
  if (key === 'paymentType') {
    newValue = value ? capitalize(value) : '--'
    return newValue
  }
  if (key === 'fromNumber') {
    newValue = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'
    return newValue
  }
  if (key === 'maxNumber') {
    newValue = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '--'
    return newValue
  }
  if (key === 'fromValueOfSinglePayment') {
    newValue = value ? amountFormatter(value) : ''
    return newValue
  }
  if (key === 'maxValueOfSinglePayment') {
    newValue = value ? amountFormatter(value) : '-'
    return newValue
  }
  if (key === 'invoiceAmount') {
    newValue = value ? amountFormatter(value) : '--'
    return newValue
  }
  if (key === 'liftingFeeAmount') {
    newValue = value ? amountFormatter(value) : '--'
    return newValue
  }
  if (key === 'fromBuyAmount') {
    newValue = value ? amountFormatter(value) : '--'
    return newValue
  }
  if (key === 'maxBuyAmount') {
    newValue = value ? amountFormatter(value) : '--'
    return newValue
  }
  if (key === 'fromNumberOfTrades') {
    newValue = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '--'
    return newValue
  }
  if (key === 'maxNumberOfTrades') {
    newValue = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '--'
    return newValue
  }
  if (key === 'markup') {
    newValue = value ? amountFormatter(value) : '--'
    return newValue
  }
  if (key === 'spread') {
    newValue = value ? amountFormatter(value) : '--'
    return newValue
  }
  if (key === 'paymentsTier') {
    newValue = value ? 'Yes' : 'No'
    return newValue
  }
  return value
}

export const getLabelName = (data, key) => {
  const label = data.find(bene => bene.fieldName === key)
  return label === undefined ? undefined : label.labelName
}

export const addIndexingElement = list => {
  if (list.length > 0) {
    list.map((dataItem, index) => {
      dataItem.index = index
      return dataItem
    })
  }

  return list.length > 0 ? list : []
}

export const addIndexToTieringList = objectData => {
  if (objectData.payments) {
    addIndexingElement(objectData.payments.tiering)
  }
  if (objectData.trades) {
    addIndexingElement(objectData.trades.tiering)
  }
  return objectData
}

export const test = object => {
  const products = []
  const payments = 'payments'
  const trades = 'trades'
  if (object.payments && object.payments.tiering.length > 0) {
    products.push(payments)
  }
  if (object.trades && object.trades.tiering.length > 0) {
    products.push(trades)
  }
  object.products = products

  return object
}

export const modifyStatusPair = (statusPair, value, index, type) => {
  switch (type) {
    case 'type':
      statusPair[index].type = value
      return statusPair

    case 'nextExitStatusCode':
      statusPair[index].nextExitStatusCode = value
      return statusPair

    default:
      return ''
  }
}

export const transformQueueData = list => {
  list.creditorDetails = {}

  return list
}

export const validateDataWithNoErrors = (data, label) => {
  let returnResp
  if (label === 'array') {
    returnResp = data !== undefined && data !== null && data.length > 0 ? data : []
  }
  if (label === 'string') {
    returnResp = data !== undefined && data !== null && data
  }
  if (label === 'object') {
    returnResp = data !== undefined && data !== null && Object.entries(data).length > 0 ? data : {}
  }
  return returnResp
}

export const formateArrayData = dataElement => {
  return dataElement.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(',')
}

export const transformDocuments = (selectedDocuments, allDocuments) => {
  console.log(selectedDocuments, allDocuments)
  // allDocuments.documentList.forEach(allDocs=>{
  //   selectedDocuments.forEach(selectDoc=>{

  //   })
  // })
}

export const getParamByProcessFlow = (processFlow, selectedCurrency) => {
  let value
  const debitCurrency = `&debitCurrency=${selectedCurrency}`
  const creditCurrency = `&creditCurrency=${selectedCurrency}`
  switch (processFlow) {
    case 'manual_credit_adjustment':
      value = creditCurrency
      return value
    case 'manual_debit_adjustment':
      value = debitCurrency
      return value
    case 'inbound_credit_transfer_client_internal':
      value = debitCurrency
      return value
    case 'inbound_credit_transfer_client_external':
      value = debitCurrency
      return value
    case 'outbound_credit_transfer_client_internal':
      value = creditCurrency
      return value
    case 'outbound_credit_transfer_client_external':
      value = creditCurrency
      return value
    case 'outbound_return_payment':
      value = creditCurrency
      return value
    default:
      return ''
  }
}

export const arrangeInAlphaOrder = countries => {
  countries.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })
  return countries
}

export const arrangeListByRegisteredName = clients => {
  clients.sort((a, b) => {
    return a.genericInformation && a.genericInformation.registeredCompanyName
      ? a.genericInformation.registeredCompanyName.localeCompare(
          b.genericInformation.registeredCompanyName,
        )
      : ''
  })
  return clients
}

export const getCompanyName = (companies, entityId) => {
  const companySelected = companies.filter(company => company.id === entityId)
  return companySelected.length > 0
    ? companySelected[0].genericInformation.registeredCompanyName
    : ''
}

export const getVendorsName = (vendors, entityId) => {
  const vendorSelected = vendors.filter(vendor => vendor.id === entityId)

  return vendorSelected.length > 0 ? vendorSelected[0].genericInformation.registeredCompanyName : ''
}

export const transformDataToDownload = async data => {
  const downloadData = []
  const workbook = new ExcelJS.Workbook()
  workbook.created = new Date(1985, 8, 30)
  workbook.modified = new Date()
  workbook.addWorksheet('Sheet 1', {
    pageSetup: { paperSize: 9, orientation: 'landscape' },
  })
  const worksheet = workbook.getWorksheet(1)
  const headerData = []
  if (Object.entries(data[0]).length > 0) {
    Object.entries(data[0]).map(([key]) => {
      const headerColumn = {
        header: key,
        key,
        width: 30,
      }
      headerData.push(headerColumn)
      return headerData
    })
  }
  worksheet.columns = headerData
  worksheet.addRows(data)
  const buffer = await workbook.csv.writeBuffer()
  const fileType = 'text.csv'
  const fileExtension = '.csv'
  const blob = new Blob([buffer], { type: fileType })
  saveAs(blob, `Balance Statements${fileExtension}`)
  return downloadData
}

export const transformExcelErrorData = errorData => {
  const errorDataList = []
  errorData.map(item => {
    return errorDataList.push(item.message)
  })
  return errorDataList
}

export const getCountryLabel = (list, countries) => {
  const labelList = []

  list.map(item => {
    countries.map(country => {
      if (item === country.alpha2Code) {
        labelList.push(country.name)
      }
      return labelList
    })
    return labelList
  })
  return labelList.join(',')
}

export const transformFormEditFields = (editFormData, accountFormData) => {
  const transformedFormData = []
  Object.entries(editFormData).forEach(([key, value]) => {
    accountFormData.forEach(account => {
      if (key === account.schemaName) {
        const formatData = {
          labelName: account.labelName,
          schemaName: key,
          regEx: account.regEx,
          message: account.message,
          required: account.isRequired,
          type: account.type,
          value,
        }
        transformedFormData.push(formatData)
      }
      return transformedFormData
    })
  })
  return transformedFormData
}

export const getProductsFromBransds = brands => {
  const products = []
  brands.map(brand => products.push(brand.products))
  return products
}

export const getExceptionMessage = data => {
  switch (data.exitStatusCode) {
    case 'C1':
      return 'Screening Rejected'
    case 'P100':
      return 'Manual Review'
    default:
      return lodash.startCase(data.messageValidationResult)
  }
}
