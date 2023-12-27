import React, { Component } from 'react'
import { Form, Select, Input, Button, Tooltip } from 'antd'
import { getName, getCompanyName, getVendorsName } from 'utilities/transformer'
import lodash from 'lodash'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  updateSelectedType,
  updateCAInitialDataEditMode,
  editPaymentAccount,
} from 'redux/currencyAccounts/action'
import data from './data.json'
import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, general, currencyAccounts }) => ({
  token: user.token,
  currencies: general.currencies,

  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,

  addAccountLoading: currencyAccounts.addAccountLoading,
  brands: general.brands,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addNewCurrencyAccount extends Component {
  state = {
    selectedBrand: undefined,
    selectedProducts: [],
  }

  componentDidMount() {
    const { dispatch, record } = this.props
    dispatch(updateSelectedType(undefined))
    if (record.accountType === 'client') {
      this.onChangeBrandSelected(record.productBrandId)
    }
  }

  onChangeAccountType = value => {
    const { dispatch, form } = this.props
    dispatch(updateSelectedType(value))
    form.setFieldsValue({
      accountType: value,
      ownerEntityId: undefined,
      issuerEntityId: undefined,
    })
  }

  onChangeAccountType = value => {
    const { dispatch, form } = this.props
    dispatch(updateSelectedType(value))
    form.setFieldsValue({
      accountType: value,
    })
  }

  onChangeBrandSelected = id => {
    const { brands } = this.props
    this.setState({ selectedBrand: id })
    const products = brands.filter(brand => brand.id === id)
    this.setState({ selectedProducts: products[0].products })
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, record, dispatch, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          isBlockedInbound: values.isBlockedInbound === 'yes' || false,
          isBlockedOutbound: values.isBlockedOutbound === 'yes' || false,
          productId: values.productId,
          productBrandId: values.brandId,
          accountName: values.accountName,
        }
        dispatch(editPaymentAccount(record.id, value, token))
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateCAInitialDataEditMode(false))
  }

  getOwnerEntityDropDown = type => {
    const { form, record } = this.props
    return (
      <Tooltip title="Restricted to edit">
        <Form.Item label="Account Owner" hasFeedback>
          {form.getFieldDecorator('ownerEntityId', {
            initialValue: record.ownerEntityId ? this.getOwner(type, record.ownerEntityId) : '',
            rules: [{ required: true, message: 'Please select client' }],
          })(<Input placeholder="Enter account type" style={{ pointerEvents: 'none' }} />)}
        </Form.Item>
      </Tooltip>
    )
  }

  getIssuerEntityDropDown = type => {
    const { form, record } = this.props
    return (
      <Tooltip title="Restricted to edit">
        <Form.Item label="Account Issuer" hasFeedback>
          {form.getFieldDecorator('issuerEntityId', {
            initialValue: record.issuerEntityId ? this.getIssuer(type, record.issuerEntityId) : '',
            rules: [{ required: true, message: 'Please select client' }],
          })(<Input placeholder="Enter account type" style={{ pointerEvents: 'none' }} />)}
        </Form.Item>
      </Tooltip>
    )
  }

  getOwner = (type, ownerEntityId) => {
    const { clients, companies } = this.props
    switch (type) {
      case 'client':
        return getName(clients, ownerEntityId)
      case 'pl':
        return getCompanyName(companies, ownerEntityId)
      case 'vendor_client':
        return getCompanyName(companies, ownerEntityId)
      case 'vendor_pl':
        return getCompanyName(companies, ownerEntityId)
      default:
        return ''
    }
  }

  getIssuer = (type, issuerEntityId) => {
    const { companies, vendors } = this.props
    switch (type) {
      case 'client':
        return getCompanyName(companies, issuerEntityId)
      case 'pl':
        return getCompanyName(companies, issuerEntityId)
      case 'vendor_client':
        return getVendorsName(vendors, issuerEntityId)
      case 'vendor_pl':
        return getVendorsName(vendors, issuerEntityId)
      default:
        return ''
    }
  }

  render() {
    const { form, record, addAccountLoading, brands } = this.props
    const { selectedBrand, selectedProducts } = this.state

    // const currencyOption = currencies.map(option => (
    //   <Option key={option.id} value={option.value} label={option.value}>
    //     {option.value}
    //   </Option>
    // ))
    const boolenList = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const productsList = selectedProducts.map(option => (
      <Option key={option.id} label={option.product} value={option.id}>
        {option.product}
      </Option>
    ))

    const brandsList = brands.map(option => (
      <Option key={option.id} label={lodash.startCase(option.brand)} value={option.id}>
        {lodash.startCase(option.brand)}
      </Option>
    ))

    return (
      <React.Fragment>
        <Form layout="vertical" onSubmit={this.onSubmit}>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Account Name" hasFeedback>
                {form.getFieldDecorator('accountName', {
                  initialValue: record.accountName,
                  // rules: [{ required: true, message: 'Please enter account name' }],
                })(<Input placeholder="Enter account name" />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Tooltip title="Restricted to edit">
                <Form.Item label="Account Type" hasFeedback>
                  {form.getFieldDecorator('accountType', {
                    initialValue: record.accountType,
                    rules: [{ required: true, message: 'Please select account type' }],
                  })(<Input placeholder="Enter account type" style={{ pointerEvents: 'none' }} />)}
                </Form.Item>
              </Tooltip>
            </div>
            {record.accountType ? (
              <div className="col-md-6 col-lg-3">
                {this.getOwnerEntityDropDown(record.accountType)}
              </div>
            ) : (
              ''
            )}
            {record.accountType ? (
              <div className="col-md-6 col-lg-3">
                {this.getIssuerEntityDropDown(record.accountType)}
              </div>
            ) : (
              ''
            )}
            <Tooltip title="Restricted to edit">
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Currency" hasFeedback>
                  {form.getFieldDecorator('currency', {
                    initialValue: record.currency,
                    rules: [{ required: true, message: 'Please select currency' }],
                  })(<Input placeholder="Enter account type" style={{ pointerEvents: 'none' }} />)}
                </Form.Item>
              </div>
            </Tooltip>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Blocked Inbound" hasFeedback>
                {form.getFieldDecorator('isBlockedInbound', {
                  initialValue: record.isBlockedInbound ? 'yes' : 'no',
                  rules: [{ required: true, message: 'Please select is blocked inbound' }],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    optionLabelProp="label"
                    placeholder="Please select is blocked inbound"
                    filterOption={(input, option) =>
                      option.props.label
                        ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        : ''
                    }
                  >
                    {boolenList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Blocked Outbound" hasFeedback>
                {form.getFieldDecorator('isBlockedOutbound', {
                  initialValue: record.isBlockedOutbound ? 'yes' : 'no',
                  rules: [{ required: true, message: 'Please select is blocked outbound' }],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    optionLabelProp="label"
                    placeholder="Please select is blocked outbound"
                    filterOption={(input, option) =>
                      option.props.label
                        ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        : ''
                    }
                  >
                    {boolenList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            {record.accountType === 'client' ? (
              <React.Fragment>
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Associated Brands" hasFeedback>
                    {form.getFieldDecorator('brandId', {
                      initialValue: selectedBrand,
                      rules: [{ required: true, message: 'Please select associated brand' }],
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        optionLabelProp="label"
                        placeholder="please select associated brand"
                        filterOption={(input, option) =>
                          option.props.label
                            ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : ''
                        }
                        onChange={(value, id) => this.onChangeBrandSelected(value, id)}
                      >
                        {brandsList}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Associated Products" hasFeedback>
                    {form.getFieldDecorator('productId', {
                      initialValue: record.productId,
                      rules: [{ required: true, message: 'Please select associated product' }],
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        optionLabelProp="label"
                        placeholder="please select associated product"
                        filterOption={(input, option) =>
                          option.props.label
                            ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : ''
                        }
                      >
                        {productsList}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
              </React.Fragment>
            ) : (
              ''
            )}
          </div>

          <div className="row">
            <div className={styles.btnStyles}>
              <Button
                className={styles.btnCANCEL}
                onClick={this.onCancelHandler}
                // disabled={payments.length === 0}
              >
                Cancel
              </Button>
              <Button className={styles.btnSAVE} htmlType="submit" loading={addAccountLoading}>
                Update
              </Button>
            </div>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}

export default addNewCurrencyAccount
