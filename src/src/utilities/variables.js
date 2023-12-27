const timeZoneOptions = [
  {
    code: 'HKT',
    value: 'Asia/Hong_Kong',
  },
  {
    code: 'GMT',
    value: 'Europe/London',
  },
  {
    code: 'IST',
    value: 'Asia/Kolkata',
  },
  {
    code: 'EET',
    value: 'Asia/Nicosia',
  },
]

const currencies = [
  {
    title: 'Vietnamese Dong',
    value: 'VND',
    id: 'a73244aa-b72c-e911-a8a0-002248005556',
  },
  {
    title: 'Chinese Yuan',
    value: 'CNY',
    id: '35d4d0f6-b72c-e911-a8a0-002248005556',
  },
  {
    title: 'Thai Baht',
    value: 'THB',
    id: '9d42b31e-b82c-e911-a8a0-002248005556',
  },
  {
    title: 'Indonesian Rupiah',
    value: 'IDR',
    id: 'a7785251-b82c-e911-a8a0-002248005556',
  },
  {
    title: 'Malaysian Ringgit',
    value: 'MYR',
    id: '17698acf-b82c-e911-a8a0-002248005556',
  },
]

const globalMessages = {
  errorMessage: 'Something went wrong!',
  errorDescription: 'We are currently working on it. Please try again...!',
}

const urls = {
  setUp2faUrl: '/user/setup-twoFactor-authentictaion',
  codeValidatorUrl: '/user/twoFactor-validation',
  personalDetailsUrl: '/user/personal-details',
}

const clients = [
  {
    id: '111',
    clientName: 'MayFly Entertainment',
    clientType: 'MERCHANT',
  },
  {
    id: '112',
    clientName: 'TGP',
    clientType: 'MERCHANT',
  },
  {
    id: '113',
    clientName: 'PayConstruct',
    clientType: 'MERCHANT',
  },
  {
    id: '114',
    clientName: 'Cross Bar FX',
    clientType: 'INTRODUCER',
  },
]

const introducerClients = [
  {
    id: '111',
    clientName: 'MayFly Entertainment',
  },
  {
    id: '112',
    clientName: 'TGP',
  },
  {
    id: '113',
    clientName: 'PayConstruct',
  },
]

const vendors = [
  {
    id: '111',
    vendorName: 'Tobby',
    vendorType: 'SWAP',
  },
  {
    id: '112',
    vendorName: 'KLMC',
    vendorType: 'SWAP',
  },
  {
    id: '113',
    vendorName: 'FIDELIS',
    vendorType: 'FX',
  },
  {
    id: '114',
    vendorName: 'SGM',
    vendorType: 'FX',
  },
]

const tradeActiveStatus = [
  {
    id: '1',
    value: 'completed',
    label: 'COMPLETED',
  },
  {
    id: '2',
    value: 'funds_remitted',
    label: 'FUNDS REMITTED',
  },
  {
    id: '3',
    value: 'quote_confirmed',
    label: 'QUOTE CONFIRMED',
  },
  {
    id: '4',
    value: 'deposits_confirmed',
    label: 'DEPOSITS CONFIRMED',
  },
  {
    id: '5',
    value: 'accounts_provided',
    label: 'ACCOUNTS PROVIDED',
  },
  {
    id: '6',
    value: 'accounts_requested',
    label: 'ACCOUNTS REQUESTED',
  },
  {
    id: '7',
    value: 'new',
    label: 'NEW',
  },
]

const transactionActiveStatus = [
  {
    id: '1',
    value: 'completed',
    label: 'COMPLETED',
  },
  {
    id: '2',
    value: 'accounts_in_progress',
    label: 'ACCOUNTS IN PROGRESS',
  },
  {
    id: '3',
    value: 'quote_confirmed',
    label: 'QUOTE CONFIRMED',
  },
  {
    id: '4',
    value: 'accounts_provided',
    label: 'ACCOUNTS PROVIDED',
  },
  {
    id: '5',
    value: 'accounts_requested',
    label: 'ACCOUNTS REQUESTED',
  },
  {
    id: '6',
    value: 'new',
    label: 'NEW',
  },
]

const spreadType = [
  {
    id: '1',
    value: 'fixed',
    label: 'Fixed',
  },
  {
    id: '2',
    value: 'variable',
    label: 'Variable',
  },
]

const feeCategory = [
  {
    id: '1',
    value: 'percentage',
    label: 'Percentage',
  },
]

const tradingHours = [
  {
    id: '1',
    value: 'overnight_weekend',
    label: 'Overnight/Weekend',
  },
  {
    id: '2',
    value: 'notimingpreference',
    label: 'No Timing Preference',
  },
  {
    id: '3',
    value: 'businesshours',
    label: 'Business Hours',
  },
]

const rateStatus = [
  {
    id: '1',
    value: 'active',
    label: 'ACTIVE',
  },
  {
    id: '2',
    value: 'inactive',
    label: 'INACTIVE',
  },
]

export default {
  timeZoneOptions,
  globalMessages,
  clients,
  introducerClients,
  currencies,
  vendors,
  tradeActiveStatus,
  transactionActiveStatus,
  spreadType,
  feeCategory,
  tradingHours,
  rateStatus,
  urls,
}
