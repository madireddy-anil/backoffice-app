import React, { Component } from 'react'
import { Icon, Button, Popconfirm, Divider } from 'antd'
import lodash from 'lodash'
import {
  updateCAInitialDataEditMode,
  deleteSuspensePaymentAccount,
} from 'redux/currencyAccounts/action'
import { getCompanyName, formatToZoneDate } from 'utilities/transformer'
import { connect } from 'react-redux'
import styles from './style.module.scss'

const mapStateToProps = ({ user, general, currencies, currencyAccounts, settings }) => ({
  token: user.token,
  currencies: general.currencies,
  mainCurrencies: general.newCurrencies,
  loading: currencies.loading,
  countries: general.countries,
  timeZone: settings.timeZone.value,

  selectedType: currencyAccounts.selectedType,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,
  showAddAccountDetails: currencyAccounts.showAddAccountDetails,
  allVendorClientVendorPlAccounts: currencyAccounts.allVendorClientVendorPlAccounts,

  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,

  brands: general.brands,
  products: general.products,
})

@connect(mapStateToProps)
class viewCAInitialData extends Component {
  handleCAInitialDataEdit = () => {
    const { dispatch } = this.props
    dispatch(updateCAInitialDataEditMode(true))
  }

  handleDeleteAccount = accountId => {
    const { dispatch, token } = this.props
    dispatch(deleteSuspensePaymentAccount(accountId, token))
  }

  getLinkedAccountName = linkedVendorAccountId => {
    const { allVendorClientVendorPlAccounts } = this.props
    const linkedVendorAccount = allVendorClientVendorPlAccounts.filter(
      accounts => accounts.id === linkedVendorAccountId,
    )
    return `${linkedVendorAccount[0]?.accountName} - ${linkedVendorAccount[0]?.currency}`
  }

  getCountryLabel = alpha2code => {
    const { countries } = this.props
    let label = ''

    countries.map(country => {
      if (alpha2code === country.alpha2Code) {
        label = country.name
      }
      return label
    })

    return label
  }

  getMainCurrency = value => {
    const { mainCurrencies } = this.props
    let mainCurrencyData = ''
    mainCurrencies.map(item => {
      if (item.code === value && item.mainCurrency === true) {
        mainCurrencyData = item.name
      }
      return mainCurrencyData
    })

    return mainCurrencyData
  }

  render() {
    const { selectedCurrencyAccount, companies, timeZone } = this.props
    const popConfirmtext = 'Are you sure to delete this record?'
    return (
      <React.Fragment>
        <div className="row">
          {selectedCurrencyAccount.isActiveAccount ? (
            <div className="col-md-12 col-lg-12">
              <div className={`${styles.actionBtns}`}>
                <Button type="link" onClick={this.handleCAInitialDataEdit}>
                  <Icon type="edit" size="large" className={styles.editIcon} />
                </Button>
                <Popconfirm
                  placement="topLeft"
                  title={popConfirmtext}
                  onConfirm={() => this.handleDeleteAccount(selectedCurrencyAccount.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link">
                    <Icon type="delete" size="large" className={styles.deleteIcon} />
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Created Date</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.createdAt
                  ? formatToZoneDate(selectedCurrencyAccount.createdAt, timeZone)
                  : '--'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Name</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.accountName ? selectedCurrencyAccount.accountName : '--'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Type</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.accountType
                  ? lodash.startCase(selectedCurrencyAccount.accountType)
                  : '--'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Owner</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.ownerEntityId
                  ? getCompanyName(companies, selectedCurrencyAccount.ownerEntityId)
                  : '--'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Issuer</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.issuerEntityId
                  ? getCompanyName(companies, selectedCurrencyAccount.issuerEntityId)
                  : '--'}
              </span>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Currency</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.currency ? selectedCurrencyAccount.currency : '--'}
              </span>
            </div>
          </div>
          {(selectedCurrencyAccount?.currency === 'USDC' ||
            selectedCurrencyAccount?.currency === 'USDT') && (
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Main Currency</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {this.getMainCurrency(selectedCurrencyAccount.mainCurrency)}
                </span>
              </div>
            </div>
          )}
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Blocked Inbound</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.isBlockedInbound ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Blocked Outbound</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.isBlockedOutbound ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Linked Vendor Account</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.linkedVendorAccount
                  ? this.getLinkedAccountName(selectedCurrencyAccount.linkedVendorAccount)
                  : '--'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Treasury</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.isTreasury ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Status</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.isActiveAccount ? (
                  <p style={{ color: 'green' }}>Active</p>
                ) : (
                  <p style={{ color: 'red' }}>Inactive</p>
                )}
              </span>
            </div>
          </div>
        </div>
        <span className="font-size-18">Account Details:</span>
        <Divider className={styles.dividerBlock} />
        <div className="row">
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">
              {selectedCurrencyAccount.currencyType === 'fiat'
                ? 'Account Number'
                : 'Wallet Address'}
            </strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.accountIdentification.accountNumber
                  ? selectedCurrencyAccount.accountIdentification.accountNumber
                  : '--'}
              </span>
            </div>
          </div>
          {selectedCurrencyAccount.currencyType === 'crypto' && (
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Blockchain</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCurrencyAccount.accountIdentification.blockchain
                    ? selectedCurrencyAccount.accountIdentification.blockchain
                    : '--'}
                </span>
              </div>
            </div>
          )}
          {selectedCurrencyAccount.currencyType === 'fiat' ? (
            <React.Fragment>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Account Region</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyAccount.accountIdentification.accountRegion
                      ? this.getCountryLabel(
                          selectedCurrencyAccount.accountIdentification.accountRegion,
                        )
                      : '--'}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Bank Code</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyAccount.accountIdentification.bankCode
                      ? selectedCurrencyAccount.accountIdentification.bankCode
                      : '--'}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">IBAN</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyAccount.accountIdentification.IBAN
                      ? selectedCurrencyAccount.accountIdentification.IBAN
                      : '--'}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">SWIFT BIC</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyAccount.accountIdentification.BIC
                      ? selectedCurrencyAccount.accountIdentification.BIC
                      : '--'}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Intermediary Bank</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyAccount.accountIdentification.intermediaryBank
                      ? selectedCurrencyAccount.accountIdentification.intermediaryBank
                      : '--'}
                  </span>
                </div>
              </div>
            </React.Fragment>
          ) : (
            ''
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default viewCAInitialData
