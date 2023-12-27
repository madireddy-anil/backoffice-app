export const getCurrencyName = code => {
  let returnResp
  switch (code) {
    case 'BTC':
      returnResp = 'Bitcoin'
      break
    case 'ETH':
      returnResp = 'Ethereum'
      break
    case 'BCH':
      returnResp = 'Bitcoin Cash'
      break
    case 'USDT':
      returnResp = 'Tether'
      break
    case 'LTC':
      returnResp = 'Litecoin'
      break
    case 'GBP':
      returnResp = 'United Kingdom'
      break
    case 'USD':
      returnResp = 'United States'
      break
    case 'EUR':
      returnResp = 'Europe'
      break
    case 'CNY':
      returnResp = 'China'
      break
    case 'MYR':
      returnResp = 'Malaysia'
      break
    case 'THB':
      returnResp = 'Thailand'
      break
    case 'VND':
      returnResp = 'Vietnam'
      break
    case 'INR':
      returnResp = 'India'
      break
    case 'JPY':
      returnResp = 'Japan'
      break
    case 'PHP':
      returnResp = 'Philippines'
      break
    case 'TWD':
      returnResp = 'Taiwan'
      break
    case 'SGD':
      returnResp = 'Singapore'
      break
    case 'AOA':
      returnResp = 'Angola'
      break
    case 'SEK':
      returnResp = 'Sweden'
      break
    case 'ZAR':
      returnResp = 'South Africa'
      break
    default:
      break
  }
  return returnResp
}

export const getSplitCurrencies = currencies => {
  const splitCurrencies = currencies ? currencies?.split('/') : []
  return [splitCurrencies[0], splitCurrencies[1]]
}

export const getCountriesList = currencies => {
  const textEmpty = ''
  return currencies
    .map(country => {
      const returnResp = !country ? textEmpty : country
      return returnResp
    })
    .join('/')
}
