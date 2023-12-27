import React from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'
import jwt from 'jsonwebtoken'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'
import { userLogOut } from './redux/user/actions'

import ErrorBoundry from './services/errorBoundry'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  // System Pages
  {
    path: '/user/old-login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/user/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/user/old-password-reset',
    component: loadable(() => import('pages/user/forgot')),
    // exact: true,
  },

  {
    path: '/user/password-reset',
    component: loadable(() => import('pages/user/newForgot')),
    // exact: true,
  },

  // manage auth0
  {
    path: '/user/setup-twoFactor-authentictaion',
    component: loadable(() => import('pages/user/auth0/setUp2FA')),
    exact: true,
  },
  {
    path: '/user/twoFactor-validation',
    component: loadable(() => import('pages/user/auth0/codeValidation')),
    exact: true,
  },

  // Dashboards
  {
    path: '/dashboard',
    component: loadable(() => import('pages/dashboard')),
  },

  // Pages
  {
    path: '/trades',
    component: loadable(() => import('pages/manageDeposits/trades')),
  },
  {
    path: '/np-trades',
    component: loadable(() => import('pages/restrictedCurrencies/trade/tradesHistory')),
  },
  {
    path: '/new-trade',
    component: loadable(() => import('pages/manageDeposits/newTrade')),
  },
  {
    path: '/np-new-trade',
    component: loadable(() => import('pages/restrictedCurrencies/trade/newTrade')),
  },
  {
    path: '/trade',
    component: loadable(() => import('pages/manageDeposits/trade')),
  },
  {
    path: '/np-trade',
    component: loadable(() => import('pages/restrictedCurrencies/trade/tradeProcess')),
  },
  // {
  //   path: '/routing-engine',
  //   component: loadable(() => import('pages/manageDeposits/routingEngine')),
  // },
  // {
  //   path: '/transactions',
  //   component: loadable(() => import('pages/manageDeposits/transactions')),
  // },
  {
    path: '/new-transaction',
    component: loadable(() => import('pages/manageDeposits/transactions/newTransaction')),
  },
  {
    path: '/fee-configs',
    component: loadable(() => import('pages/manageDeposits/feeConfigs')),
  },
  {
    path: '/fee-config',
    component: loadable(() => import('pages/manageDeposits/feeConfigs/viewfeecon')),
  },
  {
    path: '/create-fee-config',
    component: loadable(() => import('pages/manageDeposits/feeConfigs/createFeeConfig')),
  },
  {
    path: '/fx-base-rates',
    component: loadable(() => import('pages/manageDeposits/fxBaseRate')),
  },
  {
    path: '/fx-base-rate',
    component: loadable(() => import('pages/manageDeposits/fxBaseRate/viewFxBaseRate')),
  },
  {
    path: '/create-fx-base-rate',
    component: loadable(() => import('pages/manageDeposits/fxBaseRate/createFxBaseRate')),
  },
  // ClientManagement
  {
    path: '/clients',
    component: loadable(() => import('pages/clientManagement/clients')),
  },
  {
    path: '/client/:id',
    component: loadable(() => import('pages/clientManagement/clients/components')),
  },
  // beneficiaries
  {
    path: '/beneficiaries',
    component: loadable(() => import('pages/benefeciaries')),
  },

  // CryptoBeneficiaries
  {
    path: '/cryptoBeneficiaries',
    component: loadable(() => import('pages/cryptoBenefeciaries')),
  },
  {
    path: '/add-new-cryptoBeneficiary',
    component: loadable(() => import('pages/cryptoBenefeciaries/addCryptoBeneficiary')),
  },
  {
    path: '/view-cryptoBeneficiary/:id',
    component: loadable(() => import('pages/cryptoBenefeciaries/viewCryptoBeneficiary')),
  },
  {
    path: '/edit-cryptoBeneficiary/:id',
    component: loadable(() => import('pages/cryptoBenefeciaries/editCryptoBeneficiary')),
  },
  // * local Bank Accounts

  {
    path: '/add-bank-account',
    component: loadable(() => import('pages/localBankAccounts/addAccounts')),
  },
  {
    path: '/bank-accounts',
    component: loadable(() => import('pages/localBankAccounts')),
  },
  {
    path: '/view-account/:id',
    component: loadable(() => import('pages/localBankAccounts/ViewBankAccount')),
  },
  {
    path: '/edit-account/:id',
    component: loadable(() => import('pages/localBankAccounts/EditBankAccount')),
  },

  // * beneficiaries
  {
    path: '/add-new-beneficiary',
    component: loadable(() => import('pages/benefeciaries/addBeneficiary')),
  },
  {
    path: '/beneficiary/:id',
    component: loadable(() => import('pages/benefeciaries/editOrViewBeneficiary')),
  },
  // Business Reports
  {
    path: '/business-reports',
    component: loadable(() => import('pages/reports/businessReports')),
  },

  // {
  //   path: '/customer-report',
  //   component: loadable(() => import('pages/reports/businessReports/customer')),
  // },
  // {
  //   path: '/margin-report',
  //   component: loadable(() => import('pages/reports/businessReports/margin')),
  // },
  // {
  //   path: '/vendor-report',
  //   component: loadable(() => import('pages/reports/businessReports/vendor')),
  // },
  // {
  //   path: '/delivery-report',
  //   component: loadable(() => import('pages/reports/businessReports/delivery')),
  // },
  // {
  //   path: '/volume-and-profit-report',
  //   component: loadable(() => import('pages/reports/businessReports/volumeAndProfit')),
  // },
  // Ops Reports

  {
    path: '/ops-reports',
    component: loadable(() => import('pages/reports/opsReports')),
  },
  // Country and Currency Configs
  {
    path: '/fin-ops-reports',
    component: loadable(() => import('pages/reports/finOpsReport')),
  },
  {
    path: '/countries',
    component: loadable(() => import('pages/commonConfigs/country')),
  },
  {
    path: '/edit-country',
    component: loadable(() => import('pages/commonConfigs/country/components/editCountry')),
  },
  {
    path: '/view-country',
    component: loadable(() => import('pages/commonConfigs/country/components/viewCountry')),
  },
  {
    path: '/currencies',
    component: loadable(() => import('pages/commonConfigs/currency')),
  },
  {
    path: '/edit-currency',
    component: loadable(() => import('pages/commonConfigs/currency/components/editCurrency')),
  },
  {
    path: '/view-currency',
    component: loadable(() => import('pages/commonConfigs/currency/components/viewCurrency')),
  },
  {
    path: '/currency-pair',
    component: loadable(() => import('pages/commonConfigs/currencyPair')),
  },
  {
    path: '/new-currency-pair',
    component: loadable(() =>
      import('pages/commonConfigs/currencyPair/components/addCurrecnyPair'),
    ),
  },
  {
    path: '/edit-currency-pair',
    component: loadable(() =>
      import('pages/commonConfigs/currencyPair/components/editCurrencyPair'),
    ),
  },
  {
    path: '/view-currency-pair',
    component: loadable(() =>
      import('pages/commonConfigs//currencyPair/components/viewCurrencyPair'),
    ),
  },
  {
    path: '/pricing-profiles',
    component: loadable(() => import('pages/commonConfigs/pricingProfile')),
  },
  {
    path: '/new-pricing-profile',
    component: loadable(() => import('pages/commonConfigs/pricingProfile/components/addPricing')),
  },
  {
    path: '/pricing-profile-list',
    component: loadable(() => import('pages/commonConfigs/pricing/index')),
  },
  {
    path: '/add-pricing-profile',
    component: loadable(() => import('pages/commonConfigs/pricing/newPricingProfile')),
  },
  {
    path: '/edit-pricing-profile',
    component: loadable(() => import('pages/commonConfigs/pricing/editPricingProfile')),
  },
  // Payment Order
  {
    path: '/payment-order-list',
    component: loadable(() => import('pages/commonConfigs/paymentProcessFlow')),
  },
  {
    path: '/new-process-flow',
    component: loadable(() =>
      import('pages/commonConfigs/paymentProcessFlow/components/addPaymentFlow'),
    ),
  },

  {
    path: '/edit-payment-process-flow',
    component: loadable(() =>
      import('pages/commonConfigs/paymentProcessFlow/components/editPaymentFlow'),
    ),
  },
  {
    path: '/view-payment-process-flow',
    component: loadable(() =>
      import('pages/commonConfigs/paymentProcessFlow/components/viewPaymentFlow'),
    ),
  },
  // Account Profile
  {
    path: '/accounting-profile-list',
    component: loadable(() => import('pages/commonConfigs/accountingProfile')),
  },

  {
    path: '/new-accounting-pprofile',
    component: loadable(() =>
      import('pages/commonConfigs/accountingProfile/components/addAccountingProfile'),
    ),
  },
  {
    path: '/vendor-configuration-list',
    component: loadable(() => import('pages/commonConfigs/vendorConfigurations')),
  },
  {
    path: '/new-vendor-configuration',
    component: loadable(() =>
      import('pages/commonConfigs/vendorConfigurations/addNewVendorConfiguration'),
    ),
  },

  {
    path: '/edit-vendor-configuration',
    component: loadable(() =>
      import('pages/commonConfigs/vendorConfigurations/editVendorConfiguration'),
    ),
  },

  // Vendor Congigurations
  {
    path: '/edit-accounting-pprofile',
    component: loadable(() =>
      import('pages/commonConfigs/accountingProfile/components/editAccountingProfile'),
    ),
  },

  // Error Queu

  {
    path: '/error-queue-list',
    component: loadable(() => import('pages/paymentErrorQueue')),
  },

  {
    path: '/error-approval-request',
    component: loadable(() => import('pages/paymentErrorQueue/components/approvalSummaryPage')),
  },

  // currency accounts

  //

  {
    path: '/add-new-client-payment-account',
    component: loadable(() =>
      import(
        'pages/currencyAccounts/accounts/client/components/addNewCurrencyAccount/initialSetUp/addInitialData'
      ),
    ),
  },

  {
    path: '/edit-client-payment-account/:id',
    component: loadable(() =>
      import('pages/currencyAccounts/accounts/client/components/editCurrencyAccount'),
    ),
  },

  {
    path: '/add-new-pl-payment-account',
    component: loadable(() =>
      import(
        'pages/currencyAccounts/accounts/pl/components/addNewCurrencyAccount/initialSetUp/addInitialData'
      ),
    ),
  },

  {
    path: '/edit-pl-payment-account/:id',
    component: loadable(() =>
      import('pages/currencyAccounts/accounts/pl/components/editCurrencyAccount'),
    ),
  },

  {
    path: '/add-new-vendor-client-payment-account',
    component: loadable(() =>
      import(
        'pages/currencyAccounts/accounts/vendorClient/components/addNewCurrencyAccount/initialSetUp/addInitialData'
      ),
    ),
  },

  {
    path: '/edit-vendor-client-payment-account/:id',
    component: loadable(() =>
      import('pages/currencyAccounts/accounts/vendorClient/components/editCurrencyAccount'),
    ),
  },

  {
    path: '/add-new-vendor-pl-payment-account',
    component: loadable(() =>
      import(
        'pages/currencyAccounts/accounts/vendorPL/components/addNewCurrencyAccount/initialSetUp/addInitialData'
      ),
    ),
  },

  {
    path: '/edit-vendor-pl-payment-account/:id',
    component: loadable(() =>
      import('pages/currencyAccounts/accounts/vendorPL/components/editCurrencyAccount'),
    ),
  },

  {
    path: '/add-new-suspense-payment-account',
    component: loadable(() =>
      import(
        'pages/currencyAccounts/accounts/suspense/components/addNewCurrencyAccount/initialSetUp/addInitialData'
      ),
    ),
  },

  {
    path: '/edit-suspense-payment-account/:id',
    component: loadable(() =>
      import('pages/currencyAccounts/accounts/suspense/components/editCurrencyAccount'),
    ),
  },

  {
    path: '/add-new-currency-account',
    component: loadable(() =>
      import('pages/currencyAccounts/components/addNewCurrencyAccount/initialSetUp/addInitialData'),
    ),
  },
  {
    path: '/payments-accounts-list',
    component: loadable(() => import('pages/currencyAccounts/accounts')),
  },
  // {
  //   path: '/edit-currency-account',
  //   component: loadable(() => import('pages/currencyAccounts/components/editCurrencyAccount')),
  // },
  {
    path: '/edit-currency-account/:id',
    component: loadable(() => import('pages/currencyAccounts/components/editCurrencyAccount')),
  },

  // {
  //   path: '/account-balances',
  //   component: loadable(() => import('pages/currencyAccounts/clientBalances')),
  // },
  {
    path: '/account-balance/transactions-account-details/:id',
    component: loadable(() => import('pages/currencyAccounts/accountBalances/transactions')),
  },

  {
    path: '/payment-transaction-summary/:id',
    component: loadable(() =>
      import('pages/currencyAccounts/accountBalances/transactions/transactionSummary'),
    ),
  },
  // {
  //   path: '/p&l-balances',
  //   component: loadable(() => import('pages/currencyAccounts/p&lBalances')),
  // },
  {
    path: '/p&l-balance/transactions-account-details/:id',
    component: loadable(() => import('pages/currencyAccounts/p&lBalances/transactions')),
  },
  // {
  //   path: '/vendor-balances',
  //   component: loadable(() => import('pages/currencyAccounts/vendorBalances')),
  // },
  {
    path: '/vendor-balance/transactions-account-details/:id',
    component: loadable(() => import('pages/currencyAccounts/vendorBalances/transactions')),
  },
  // {
  //   path: '/vendor-client-balances',
  //   component: loadable(() => import('pages/currencyAccounts/vendorClientBalances')),
  // },
  {
    path: '/vendor-client-balance/transactions-account-details/:id',
    component: loadable(() => import('pages/currencyAccounts/vendorClientBalances/transactions')),
  },
  // {
  //   path: '/vendor-pl-balances',
  //   component: loadable(() => import('pages/currencyAccounts/vendorPLBalances')),
  // },
  {
    path: '/vendor-pl-balance/transactions-account-details/:id',
    component: loadable(() => import('pages/currencyAccounts/vendorPLBalances/transactions')),
  },
  // digital Payment
  {
    path: '/new-payment',
    component: loadable(() => import('pages/digitalPayment/index')),
  },
  {
    path: '/new-payment-success',
    component: loadable(() => import('pages/digitalPayment/successPage')),
  },

  {
    path: '/statements-upload-files-list',
    component: loadable(() => import('pages/statementsUploader/statementList')),
  },

  {
    path: '/statements-uploader',
    component: loadable(() => import('pages/statementsUploader')),
  },

  // security
  {
    path: '/permissions',
    component: loadable(() => import('pages/security/permissions')),
  },
  {
    path: '/roles',
    component: loadable(() => import('pages/security/roles')),
  },
  {
    path: '/users',
    component: loadable(() => import('pages/security/users')),
  },
  {
    path: '/add-user',
    component: loadable(() => import('pages/security/users/components/addUser')),
  },
  {
    path: '/edit-user',
    component: loadable(() => import('pages/security/users/components/editUser')),
  },
  {
    path: '/view-user',
    component: loadable(() => import('pages/security/users/components/viewUser')),
  },
]

const mapStateToProps = ({ user }) => ({
  token: user.token,
})

@connect(mapStateToProps)
class Router extends React.Component {
  componentDidMount() {
    const { token } = this.props
    if (token) {
      this.logoutOnTokenExpire(token)
    }
  }

  logoutOnTokenExpire = token => {
    const { dispatch } = this.props
    if (token) {
      const decodeToken = jwt.decode(token)
      const tokenExpireAt = decodeToken.exp
      const currentTime = (new Date().getTime() + 1) / 1000
      if (currentTime >= tokenExpireAt) {
        dispatch(userLogOut())
      } else {
        const setTime = (tokenExpireAt - currentTime) * 1000
        setTimeout(() => {
          dispatch(userLogOut())
        }, setTime)
      }
    }
  }

  render() {
    const { history } = this.props
    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/trades" />} />
            <ErrorBoundry>
              {routes.map(route => (
                <Route
                  path={route.path}
                  component={route.component}
                  key={route.path}
                  exact={route.exact}
                />
              ))}
            </ErrorBoundry>
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default Router
