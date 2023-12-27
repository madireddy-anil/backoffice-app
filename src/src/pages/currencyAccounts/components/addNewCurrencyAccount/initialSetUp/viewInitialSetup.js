import React, { Component } from 'react'
import { Icon, Button, Popconfirm } from 'antd'
import lodash from 'lodash'
import { updateCAInitialDataEditMode, deletePaymentAccount } from 'redux/currencyAccounts/action'
import { getName, getCompanyName, getVendorsName } from 'utilities/transformer'
import { connect } from 'react-redux'
import styles from './style.module.scss'

const mapStateToProps = ({ user, general, currencies, currencyAccounts }) => ({
  token: user.token,
  currencies: general.currencies,
  loading: currencies.loading,

  selectedType: currencyAccounts.selectedType,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,
  showAddAccountDetails: currencyAccounts.showAddAccountDetails,

  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,

  brands: general.brands,
  products: general.products,
})

@connect(mapStateToProps)
class viewCAInitialData extends Component {
  getOwner = type => {
    const { selectedCurrencyAccount, clients, companies } = this.props
    switch (type) {
      case 'client':
        return (
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Owner</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.ownerEntityId
                  ? getName(clients, selectedCurrencyAccount.ownerEntityId)
                  : '--'}
              </span>
            </div>
          </div>
        )
      case 'pl':
        return (
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
        )
      case 'vendor_client':
        return (
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
        )
      case 'vendor_pl':
        return (
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
        )
      default:
        return ''
    }
  }

  getIssuer = type => {
    const { selectedCurrencyAccount, companies, vendors } = this.props
    switch (type) {
      case 'client':
        return (
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
        )
      case 'pl':
        return (
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
        )
      case 'vendor_client':
        return (
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Issuer</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.issuerEntityId
                  ? getVendorsName(vendors, selectedCurrencyAccount.issuerEntityId)
                  : '--'}
              </span>
            </div>
          </div>
        )
      case 'vendor_pl':
        return (
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Issuer</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedCurrencyAccount.issuerEntityId
                  ? getVendorsName(vendors, selectedCurrencyAccount.issuerEntityId)
                  : '--'}
              </span>
            </div>
          </div>
        )
      default:
        return ''
    }
  }

  handleCAInitialDataEdit = () => {
    const { dispatch } = this.props
    dispatch(updateCAInitialDataEditMode(true))
  }

  getBrandName = brandId => {
    const { brands } = this.props
    const selectedBrand = brands.filter(brand => brand.id === brandId)
    return selectedBrand[0].brand
  }

  getProductName = prodId => {
    const { products } = this.props
    const selectedProduct = products.filter(product => product.id === prodId)
    return selectedProduct[0].product
  }

  handleDeleteAccount = accountId => {
    const { dispatch, token } = this.props
    dispatch(deletePaymentAccount(accountId, token))
  }

  render() {
    const { selectedCurrencyAccount } = this.props
    const popConfirmtext = 'Are you sure to delete this record?'
    return (
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
        {this.getOwner(selectedCurrencyAccount.accountType)}
        {this.getIssuer(selectedCurrencyAccount.accountType)}

        <div className="col-md-6 col-lg-3">
          <strong className="font-size-15">Currency</strong>
          <div className="pb-4 mt-1">
            <span className="font-size-13">
              {selectedCurrencyAccount.currency ? selectedCurrencyAccount.currency : '--'}
            </span>
          </div>
        </div>
        {selectedCurrencyAccount.accountType === 'client' ? (
          <React.Fragment>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Associated Products</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCurrencyAccount.productId
                    ? this.getProductName(selectedCurrencyAccount.productId)
                    : '--'}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Associated Brands</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCurrencyAccount.productBrandId
                    ? this.getBrandName(selectedCurrencyAccount.productBrandId)
                    : '--'}
                </span>
              </div>
            </div>
          </React.Fragment>
        ) : (
          ''
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
    )
  }
}

export default viewCAInitialData
