export const getLeftMenuData = [
  // {
  //   title: 'Dashboard',
  //   key: 'dashboard',
  //   url: '/dashboard',
  //   icon: 'icmn icmn-home',
  //   roles: ['admin', 'user'],
  // },

  {
    heading: 'Manage Deposits',
    icon: 'icmn icmn-stack',
    disabled: true,
  },
  {
    divider: true,
  },
  {
    title: 'Trades',
    key: 'trades',
    url: '/trades',
    icon: 'fa fa-exchange',
    roles: ['user'],
  },

  /* New Trade Process */
  // {
  //   title: 'New Process Trades',
  //   key: 'newProcessTrades',
  //   url: '/np-trades',
  //   icon: 'fa fa-exchange',
  //   pro: true,
  //   roles: ['user'],
  // },
  /* New Trade Process */

  // {
  //   title: 'Routing Engine',
  //   key: 'routingEngine',
  //   url: '/routing-engine',
  //   icon: 'icmn icmn-opt',
  //   roles: ['user'],
  // },
  // {
  //   title: 'Transactions',
  //   key: 'transactions',
  //   url: '/transactions',
  //   icon: 'fa fa-bank',
  //   roles: ['admin', 'user'],
  // },
  {
    title: 'Local Bank Accounts',
    key: 'bankAccounts',
    icon: 'fa fa-bank',
    url: '/bank-accounts',
  },
  {
    divider: true,
  },
  {
    divider: true,
  },
  {
    title: 'Beneficiaries',
    key: 'baneficiaries',
    icon: 'fa fa-bank',
    url: '/beneficiaries',
  },
  {
    title: 'Crypto Beneficiaries',
    key: 'cryptoBaneficiaries',
    icon: 'fa fa-bank',
    url: '/cryptoBeneficiaries',
  },
  {
    divider: true,
  },
  {
    divider: true,
  },
  {
    title: 'Fee Config',
    key: 'feeConfig',
    url: '/fee-configs',
    icon: 'fa fa-sliders',
    roles: ['user'],
  },
  {
    title: 'Fx Base Rate',
    key: 'fxBaseRate',
    icon: 'fa fa-line-chart',
    url: '/fx-base-rates',
  },
  {
    divider: true,
  },
  {
    heading: 'Reports',
    key: 'reports',
    icon: 'icmn icmn-stack',
    disabled: true,
  },
  {
    divider: true,
  },

  {
    title: 'Ops Reports',
    key: 'opsReports',
    icon: 'icmn icmn-table',
    url: '/ops-reports',
  },
  {
    title: 'Business Reports',
    key: 'businessReports',
    icon: 'icmn icmn-table',
    url: '/business-reports',
  },
  {
    title: 'Fin Ops Reports',
    key: 'finOpsReport',
    icon: 'icmn icmn-table',
    url: '/fin-ops-reports',
  },
  {
    divider: true,
  },
  {
    heading: 'Configuration',
    key: 'configuration',
    icon: 'icmn icmn-stack',
    disabled: true,
  },
  {
    divider: true,
  },
  {
    title: 'Countries',
    key: 'countries',
    icon: 'icmn icmn-flag',
    url: '/countries',
  },
  {
    title: 'Currencies',
    key: 'currencies',
    icon: 'icmn icmn-flag',
    url: '/currencies',
  },
  // {
  //   title: 'Currency Pair',
  //   key: 'currency-pair',
  //   icon: 'icmn icmn-credit-card',
  //   url: '/currency-pair',
  // },
  // {
  //   title: 'Pricing Profile',
  //   key: 'pricing-profiles',
  //   icon: 'icmn icmn-flag',
  //   url: '/pricing-profiles',
  // },
  {
    title: 'Pricing Profile',
    key: 'pricing-profile',
    icon: 'icmn icmn-credit-card',
    url: '/pricing-profile-list',
  },
  // {
  //   title: 'Payment Order Manager',
  //   key: 'payment-order',
  //   icon: 'icmn icmn-credit-card',
  //   url: '/payment-order-list',
  // },
  // {
  //   title: 'Accounting Profile',
  //   key: 'accounting-profile',
  //   icon: 'icmn icmn-credit-card',
  //   url: '/accounting-profile-list',
  // },
  {
    title: 'Vendor Configuration',
    key: 'vendor-configuration',
    icon: 'icmn icmn-credit-card',
    // url: '/new-vendor-configuration',
    url: '/vendor-configuration-list',
  },

  {
    heading: 'Currency Accounts',
    icon: 'icmn icmn-library',
    disabled: true,
  },
  {
    divider: true,
  },
  // {
  //   title: 'Add New Account',
  //   key: 'addNewCurrencyAccount',
  //   url: '/add-new-currency-account',
  //   icon: 'icmn icmn-credit-card',
  //   roles: ['user'],
  // },
  {
    title: 'Accounts',
    key: 'accounts-list',
    url: '/payments-accounts-list',
    icon: 'icmn icmn-credit-card',
    roles: ['user'],
  },
  // {
  //   title: 'Client Accounts',
  //   key: 'clientBalances',
  //   url: '/account-balances',
  //   icon: 'icmn icmn-credit-card',
  //   roles: ['user'],
  // },
  // {
  //   title: 'P&L Accounts',
  //   key: 'p&lBalances',
  //   url: '/p&l-balances',
  //   icon: 'icmn icmn-credit-card',
  //   roles: ['user'],
  // },
  // {
  //   title: 'Vendor Accounts',
  //   key: 'vendorBalances',
  //   url: '/vendor-balances',
  //   icon: 'icmn icmn-credit-card',
  //   roles: ['user'],
  // },
  // {
  //   title: 'Vendor Client Accounts',
  //   key: 'vendorClientBalances',
  //   url: '/vendor-client-balances',
  //   icon: 'icmn icmn-credit-card',
  //   roles: ['user'],
  // },
  // {
  //   title: 'Vendor P&L Accounts',
  //   key: 'vendorPLBalances',
  //   url: '/vendor-pl-balances',
  //   icon: 'icmn icmn-credit-card',
  //   roles: ['user'],
  // },
  // {
  //   title: 'New Payment',
  //   key: 'newDigitalPayment',
  //   url: '/new-payment',
  //   icon: 'fa fa-exchange',
  // },
  // {
  //   title: 'Payment Operation Queue',
  //   key: 'errorQueueList',
  //   icon: 'icmn icmn-credit-card',
  //   url: '/error-queue-list',
  // },
  // {
  //   title: 'Vendor Statements Upload',
  //   key: 'statementsUploader',
  //   icon: 'icmn icmn-credit-card',
  //   // url: '/statements-uploader',
  //   url: '/statements-upload-files-list',
  // },
  {
    heading: 'Security',
    icon: 'icmn icmn-lock',
    disabled: true,
  },
  {
    divider: true,
  },
  {
    title: 'Permissions',
    key: 'permissions',
    url: '/permissions',
    icon: 'icmn icmn-shield',
    roles: ['user'],
  },
  {
    title: 'Roles',
    key: 'roles',
    url: '/roles',
    icon: 'icmn icmn-IcoMoon',
    roles: ['user'],
  },
  {
    title: 'Users',
    key: 'users',
    url: '/users',
    icon: 'icmn icmn-users',
    roles: ['user'],
  },
  {
    heading: 'Client Management',
    icon: 'icmn icmn-users',
    disabled: true,
  },
  {
    divider: true,
  },
  {
    title: 'Clients',
    key: 'clients',
    icon: 'fa fa-bank',
    url: '/clients',
    roles: ['user'],
  },
]

export default getLeftMenuData
