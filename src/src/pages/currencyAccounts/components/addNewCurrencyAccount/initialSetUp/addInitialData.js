import React, { Component } from 'react'
import { Card, Form, Select, Input, Button, Divider, Spin, Alert, Typography, Icon } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
import lodash from 'lodash'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  updateSelectedType,
  addNewPaymentAccount,
  updateAccountsErrorList,
} from 'redux/currencyAccounts/action'
import { getClients, getVendorsList, getCompaniesList } from 'redux/general/actions'
import data from './data.json'
import styles from './style.module.scss'

const { Option } = Select
const { Paragraph, Text } = Typography

const mapStateToProps = ({ user, general, currencyAccounts }) => ({
  token: user.token,
  currencies: general.currencies,

  selectedType: currencyAccounts.selectedType,
  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,

  brands: general.brands,

  companiesListLoading: currencyAccounts.companiesListLoading,
  clientListloading: currencyAccounts.clientListloading,
  vendorListLoading: currencyAccounts.vendorListLoading,
  initialCADataEditMode: currencyAccounts.initialCADataEditMode,
  addAccountLoading: currencyAccounts.addAccountLoading,

  countries: general.countries,
  errorList: currencyAccounts.errorList,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addNewCurrencyAccount extends Component {
  state = {
    currencyData: {},
    selectedProducts: [],
    // selectedBrand : undefined
  }

  componentDidMount() {
    const { dispatch, token } = this.props
    const emptyArray = []
    dispatch(updateAccountsErrorList(emptyArray))
    dispatch(getClients(token))
    dispatch(getVendorsList(token))
    dispatch(getCompaniesList(token))
    dispatch(updateSelectedType(undefined))
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

  onChangeBrandSelected = id => {
    const { brands } = this.props
    //  this.setState({selectedBrand : id })
    const products = brands.filter(brand => brand.id === id)
    this.setState({ selectedProducts: products[0].products })
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { currencyData } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          ownerEntityId: values.ownerEntityId,
          issuerEntityId: values.issuerEntityId,
          accountName: values.accountName,
          currency: currencyData.value,
          currencyId: currencyData.id,
          currencyType: currencyData.type,
          accountType: values.accountType,
          isBlockedInbound: values.isBlockedInbound === 'yes' || false,
          isBlockedOutbound: values.isBlockedOutbound === 'yes' || false,
          productId: values.productId,
          productBrandId: values.brandId,
          accountIdentification: [
            {
              accountRegion: values.accountRegion,
              accountNumber: values.accountNumber,
              bankCode: values.bankCode,
              IBAN: values.IBAN,
              BIC: values.BIC,
            },
          ],
        }
        dispatch(addNewPaymentAccount(value, token))
      }
    })
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/payments-accounts-list')
  }

  onChangeCurrencySelected = value => {
    const { currencies } = this.props
    const currencyData = currencies.filter(item => item.value === value)
    this.setState({ currencyData: currencyData[0] })
  }

  getOwnerEntityDropDown = type => {
    const { form, clients, companies } = this.props
    const clientOption = clients.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    const companiesList = companies.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    switch (type) {
      case 'client':
        return (
          <Form.Item label="Account Owner" hasFeedback>
            {form.getFieldDecorator('ownerEntityId', {
              rules: [{ required: true, message: 'Please select account owner' }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                optionLabelProp="label"
                placeholder="Please select account owner"
                //   value={selectedType}
                filterOption={(input, option) =>
                  option.props.label
                    ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : ''
                }
              >
                {clientOption}
              </Select>,
            )}
          </Form.Item>
        )
      case 'pl':
        return (
          <Form.Item label="Account Owner" hasFeedback>
            {form.getFieldDecorator('ownerEntityId', {
              rules: [{ required: true, message: 'Please select account owner' }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                optionLabelProp="label"
                placeholder="Please select account owner"
                //   value={selectedType}
                filterOption={(input, option) =>
                  option.props.label
                    ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : ''
                }
              >
                {companiesList}
              </Select>,
            )}
          </Form.Item>
        )
      case 'vendor_client':
        return (
          <Form.Item label="Account Owner" hasFeedback>
            {form.getFieldDecorator('ownerEntityId', {
              rules: [{ required: true, message: 'Please select account owner' }],
            })(
              <Select
                // showArrow={false}
                // className={styles.selectDropDown}
                style={{ width: '100%', borderRadius: '9px' }}
                showSearch
                placeholder="Please select account owner"
                optionLabelProp="label"
                onClick={() => this.handleSelectClick}
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {companiesList}
              </Select>,
            )}
          </Form.Item>
        )
      case 'vendor_pl':
        return (
          <Form.Item label="Account Owner" hasFeedback>
            {form.getFieldDecorator('ownerEntityId', {
              rules: [{ required: true, message: 'Please select account owner' }],
            })(
              <Select
                // showArrow={false}
                // className={styles.selectDropDown}
                style={{ width: '100%', borderRadius: '9px' }}
                showSearch
                placeholder="Please select account owner"
                optionLabelProp="label"
                onClick={() => this.handleSelectClick}
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {companiesList}
              </Select>,
            )}
          </Form.Item>
        )
      default:
        return ''
    }
  }

  getIssuerEntityDropDown = type => {
    const { form, vendors, companies } = this.props
    const vendorOption = vendors.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    const companiesList = companies.map(option => (
      <Option
        key={option.id}
        label={
          option.genericInformation
            ? option.genericInformation.registeredCompanyName
            : 'dummy record'
        }
        value={option.id}
      >
        {option.genericInformation
          ? option.genericInformation.registeredCompanyName
          : 'dummy record'}
      </Option>
    ))
    switch (type) {
      case 'client':
        return (
          <Form.Item label="Account Issuer" hasFeedback>
            {form.getFieldDecorator('issuerEntityId', {
              rules: [{ required: true, message: 'Please select account issuer' }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                optionLabelProp="label"
                placeholder="Please select account issuer"
                //   value={selectedType}
                filterOption={(input, option) =>
                  option.props.label
                    ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : ''
                }
              >
                {companiesList}
              </Select>,
            )}
          </Form.Item>
        )
      case 'pl':
        return (
          <Form.Item label="Account Issuer" hasFeedback>
            {form.getFieldDecorator('issuerEntityId', {
              rules: [{ required: true, message: 'Please select account issuer' }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                optionLabelProp="label"
                placeholder="Please select account issuer"
                //   value={selectedType}
                filterOption={(input, option) =>
                  option.props.label
                    ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : ''
                }
              >
                {companiesList}
              </Select>,
            )}
          </Form.Item>
        )
      case 'vendor_client':
        return (
          <Form.Item label="Account Issuer" hasFeedback>
            {form.getFieldDecorator('issuerEntityId', {
              rules: [{ required: true, message: 'Please select account issuer' }],
            })(
              <Select
                // showArrow={false}
                // className={styles.selectDropDown}
                style={{ width: '100%', borderRadius: '9px' }}
                showSearch
                placeholder="Please select account issuer"
                optionLabelProp="label"
                onClick={() => this.handleSelectClick}
                filterOption={(input, option) =>
                  option.props.label
                    ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : ''
                }
              >
                {vendorOption}
              </Select>,
            )}
          </Form.Item>
        )
      case 'vendor_pl':
        return (
          <Form.Item label="Account Issuer" hasFeedback>
            {form.getFieldDecorator('issuerEntityId', {
              rules: [{ required: true, message: 'Please select account issuer' }],
            })(
              <Select
                // showArrow={false}
                // className={styles.selectDropDown}
                style={{ width: '100%', borderRadius: '9px' }}
                showSearch
                placeholder="Please select account issuer"
                optionLabelProp="label"
                onClick={() => this.handleSelectClick}
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {vendorOption}
              </Select>,
            )}
          </Form.Item>
        )
      default:
        return ''
    }
  }

  render() {
    const {
      selectedType,
      form,
      currencies,
      companiesListLoading,
      clientListloading,
      vendorListLoading,
      brands,
      addAccountLoading,
      countries,
      errorList,
    } = this.props
    const { currencyData, selectedProducts } = this.state
    const accountTypes = data.accountTypes.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))
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

    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    return (
      <Spin spinning={companiesListLoading || clientListloading || vendorListLoading}>
        <Card
          title={
            <div>
              <span className="font-size-16">New Currency Account</span>
            </div>
          }
          bordered
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '30px',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
        >
          <Helmet title="Currency" />
          <React.Fragment>
            {errorList.length > 0 ? (
              <div>
                <div className={styles.errorBlock}>
                  <Alert
                    // showIcon
                    type="error"
                    message={
                      <div className="desc">
                        <Paragraph>
                          <Text
                            strong
                            style={{
                              fontSize: 14,
                            }}
                          >
                            The content you submitted has the following errors:
                          </Text>
                        </Paragraph>
                        {errorList.map(item => {
                          return (
                            <Paragraph>
                              <Icon style={{ color: 'red' }} type="close-circle" /> {item}
                            </Paragraph>
                          )
                        })}
                      </div>
                    }
                  />
                </div>
                <Spacer height="25px" />
              </div>
            ) : (
              ''
            )}
            <Form layout="vertical" onSubmit={this.onSubmit}>
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Account Name" hasFeedback>
                    {form.getFieldDecorator('accountName', {
                      // rules: [{ required: true, message: 'Please enter account name' }],
                    })(<Input placeholder="Enter account name" />)}
                  </Form.Item>
                </div>
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Account Type" hasFeedback>
                    {form.getFieldDecorator('accountType', {
                      rules: [{ required: true, message: 'Please select account type' }],
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        optionLabelProp="label"
                        placeholder="Please select account type"
                        //   value={selectedType}
                        filterOption={(input, option) =>
                          option.props.label
                            ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : ''
                        }
                        onChange={(value, id) => this.onChangeAccountType(value, id)}
                      >
                        {accountTypes}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
                {selectedType ? (
                  <div className="col-md-6 col-lg-3">
                    {this.getOwnerEntityDropDown(selectedType)}
                  </div>
                ) : (
                  ''
                )}

                {selectedType ? (
                  <div className="col-md-6 col-lg-3">
                    {this.getIssuerEntityDropDown(selectedType)}
                  </div>
                ) : (
                  ''
                )}

                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Currency" hasFeedback>
                    {form.getFieldDecorator('currency', {
                      rules: [{ required: true, message: 'Please select currency' }],
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        optionLabelProp="label"
                        placeholder="please select payment currency"
                        filterOption={(input, option) =>
                          option.props.label
                            ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : ''
                        }
                        onChange={(value, id) => this.onChangeCurrencySelected(value, id)}
                      >
                        {currencyOption}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Blocked Inbound" hasFeedback>
                    {form.getFieldDecorator('isBlockedInbound', {
                      initialValue: 'no',
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
                      initialValue: 'no',
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
                {selectedType === 'client' ? (
                  <React.Fragment>
                    <div className="col-md-6 col-lg-3">
                      <Form.Item label="Associated Brands" hasFeedback>
                        {form.getFieldDecorator('brandId', {
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
              {currencyData.type ? (
                <React.Fragment>
                  <span className="font-size-18">Account Details:</span>
                  <Divider className={styles.dividerBlock} />
                  <div className="row">
                    <div className="col-md-3 col-lg-3">
                      <Form.Item
                        label={currencyData.type === 'fiat' ? 'Account Number' : 'Wallet Address'}
                        hasFeedback
                      >
                        {form.getFieldDecorator('accountNumber', {
                          rules: [
                            {
                              required: true,
                              message:
                                currencyData.type === 'fiat'
                                  ? 'Please enter account Number'
                                  : 'wallet address',
                            },
                          ],
                        })(
                          <Input
                            placeholder={
                              currencyData.type === 'fiat'
                                ? 'Please enter account Number'
                                : 'wallet address'
                            }
                          />,
                        )}
                      </Form.Item>
                    </div>
                    {currencyData.type === 'fiat' ? (
                      <React.Fragment>
                        <div className="col-md-3 col-lg-3">
                          <Form.Item label="Account Region" hasFeedback>
                            {form.getFieldDecorator('accountRegion', {
                              rules: [
                                {
                                  required: true,
                                  message: 'Please enter account region',
                                },
                              ],
                            })(
                              <Select
                                showSearch
                                optionFilterProp="children"
                                optionLabelProp="label"
                                placeholder="search country"
                                filterOption={(input, option) =>
                                  option.props.label
                                    ? option.props.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    : ''
                                }
                              >
                                {countriesOptions}
                              </Select>,
                            )}
                          </Form.Item>
                        </div>
                        <div className="col-md-3 col-lg-3">
                          <Form.Item label="Bank Code" hasFeedback>
                            {form.getFieldDecorator('bankCode', {
                              rules: [{ required: true, message: 'Please enter bank code' }],
                            })(<Input placeholder="Enter bank code" />)}
                          </Form.Item>
                        </div>
                        <div className="col-md-3 col-lg-3">
                          <Form.Item label="IBAN" hasFeedback>
                            {form.getFieldDecorator('IBAN', {
                              rules: [
                                {
                                  required: selectedType === 'client' || selectedType === 'pl',
                                  message: 'Please enter IBAN',
                                },
                              ],
                            })(<Input placeholder="Enter IBAN" />)}
                          </Form.Item>
                        </div>
                        <div className="col-md-3 col-lg-3">
                          <Form.Item label="SWIFT BIC" hasFeedback>
                            {form.getFieldDecorator('BIC', {
                              rules: [
                                {
                                  required: selectedType === 'client' || selectedType === 'pl',
                                  message: 'Please enter swift bic',
                                },
                              ],
                            })(<Input placeholder="Enter swift bic" />)}
                          </Form.Item>
                        </div>
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </div>
                </React.Fragment>
              ) : (
                ''
              )}
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
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </React.Fragment>
        </Card>
      </Spin>
    )
  }
}

export default addNewCurrencyAccount
