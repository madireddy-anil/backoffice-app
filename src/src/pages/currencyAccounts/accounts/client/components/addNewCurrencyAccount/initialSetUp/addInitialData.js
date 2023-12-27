import React, { Component } from 'react'
import {
  Card,
  Form,
  Select,
  Input,
  Button,
  Divider,
  Spin,
  Alert,
  Typography,
  Icon,
  Switch,
  notification,
} from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import lodash from 'lodash'
import { withRouter } from 'react-router'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  updateSelectedType,
  addNewClientPaymentAccount,
  updateAccountsErrorList,
} from 'redux/currencyAccounts/action'
import { getClients, getCompaniesList, getVendorsList, getIntroducers } from 'redux/general/actions'
import data from './data.json'
import styles from './style.module.scss'

const { Option } = Select
const { Paragraph, Text } = Typography

const mapStateToProps = ({ user, general, currencyAccounts }) => ({
  token: user.token,
  currencies: general.newCurrencies,
  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,
  introducers: general.introducers,

  brands: general.brands,
  // products: general.products,

  companiesListLoading: currencyAccounts.companiesListLoading,
  clientListloading: currencyAccounts.clientListloading,
  vendorListLoading: currencyAccounts.vendorListLoading,
  introducersListLoading: currencyAccounts.introducersListLoading,
  initialCADataEditMode: currencyAccounts.initialCADataEditMode,
  addAccountLoading: currencyAccounts.addAccountLoading,
  allVendorClientVendorPlAccounts: currencyAccounts.allVendorClientVendorPlAccounts,

  countries: general.countries,
  errorList: currencyAccounts.errorList,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addNewCurrencyAccount extends Component {
  state = {
    currencyData: {},
    // selectedProducts: [],
    cACurrencies: [],
    combinedClientsAndIntroducers: [],
    isFormAutoGenerateBank: false,
    // selectedBrand : undefined,
    mainCurrencyData: {},
    mainCurrencies: [],
    isMainCurrency: false,
    isCryptoCurrency: false,
    isVendorAccount: false,
    products: [],
  }

  componentDidMount() {
    const { dispatch, token, currencies } = this.props

    const emptyArray = []

    const cACurrencies = currencies.filter(item => item.currencyAccount === 'Yes')
    const mainCurrencies = currencies.filter(item => item.mainCurrency === true)
    this.setState({ cACurrencies })
    this.setState({ mainCurrencies })
    dispatch(updateAccountsErrorList(emptyArray))
    dispatch(getClients(token))
    dispatch(getVendorsList(token))
    dispatch(getIntroducers(token))
    dispatch(getCompaniesList(token))
    dispatch(updateSelectedType(undefined))
    this.updateToState()
  }

  updateToState = () => {
    const { clients, introducers, brands } = this.props
    const combinedClientsAndIntroducers = [...clients, ...introducers]
    this.setState({ combinedClientsAndIntroducers, products: brands[0]?.products })
  }

  // onChangeBrandSelected = id => {
  //   const { brands, form } = this.props
  //   const selectedBrand = brands.find(brand => brand.id === id)
  //   form.setFieldsValue({
  //     productId: brands[0]?.products?.id,
  //   })
  //   this.setState({ products: brands[0]?.products })
  // }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { currencyData, mainCurrencyData, isFormAutoGenerateBank } = this.state
    form.validateFields((error, values) => {
      if (
        (values.accountNumber !== undefined && values.accountNumber !== '') ||
        (values.IBAN !== undefined && values.IBAN !== '') ||
        isFormAutoGenerateBank
      ) {
        if (!error) {
          const value = {
            ownerEntityId: values.ownerEntityId,
            issuerEntityId: values.issuerEntityId,
            accountName: values.accountName,
            currency: currencyData.code,
            currencyId: currencyData.id,
            mainCurrency: mainCurrencyData.code,
            mainCurrencyId: mainCurrencyData.id,
            currencyType: currencyData.type,
            accountType: values.accountType,
            isBlockedInbound: values.isBlockedInbound === 'yes' || false,
            isBlockedOutbound: values.isBlockedOutbound === 'yes' || false,
            productId: values.productId,
            // productBrandId: values.brandId,
            linkedVendorAccount: values.linkedVendorAccount,
            vendorEntityId: values.vendorEntityId,
            isTreasury: values.isTreasury === 'yes' || false,
            accountIdentification: {},
          }
          const manualForm = {
            accountRegion: values.accountRegion,
            accountNumber: values.accountNumber,
            bankCode: values.bankCode,
            IBAN: values.IBAN,
            BIC: values.BIC,
            autoGenerateFromBank: isFormAutoGenerateBank,
            intermediaryBank: values.intermediaryBank,
          }

          if (values.blockchain) manualForm.blockchain = values.blockchain

          const autoForm = isFormAutoGenerateBank
            ? { autoGenerateFromBank: values.autoGenerateFromBank }
            : manualForm
          Object.assign(value.accountIdentification, autoForm)
          dispatch(addNewClientPaymentAccount(value, token))
        }
      } else {
        notification.error({
          message: 'Enter Account Number or IBAN',
        })
      }
    })
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/payments-accounts-list')
  }

  onChangeCurrencySelected = value => {
    const { cACurrencies } = this.state
    const currencyData = cACurrencies.filter(item => item.code === value)
    this.setState({
      currencyData: currencyData[0],
      // isFormAutoGenerateBank: currencyData.length > 0 && !currencyData[0].type === 'crypto',
    })
    if (currencyData[0].type === 'crypto') {
      this.setState({ isCryptoCurrency: true })
    } else {
      this.setState({ isCryptoCurrency: false })
    }

    if (value === 'USDT' || value === 'USDC') {
      this.setState({ isMainCurrency: true })
    } else {
      this.setState({ isMainCurrency: false })
    }
  }

  onChangeMainCurrencySelected = value => {
    const { mainCurrencies } = this.state
    const mainCurrencyData = mainCurrencies.filter(item => item.code === value)
    this.setState({
      mainCurrencyData: mainCurrencyData[0],
    })
  }

  handleAutoGenFormBank = value => {
    this.setState({ isFormAutoGenerateBank: value })
  }

  handleVendorChange = value => {
    const { form } = this.props
    this.setState({ isVendorAccount: value })
    this.setState({ isFormAutoGenerateBank: value })
    form.setFieldsValue({ autoGenerateFromBank: value })
  }

  render() {
    const {
      form,
      companiesListLoading,
      clientListloading,
      vendorListLoading,
      // brands,
      addAccountLoading,
      countries,
      errorList,
      companies,
      vendors,
      introducersListLoading,
      allVendorClientVendorPlAccounts,
    } = this.props
    const {
      currencyData,
      cACurrencies,
      combinedClientsAndIntroducers,
      isFormAutoGenerateBank,
      products,
      mainCurrencies,
      isMainCurrency,
      isCryptoCurrency,
      isVendorAccount,
    } = this.state
    const vendorClientAccounts = allVendorClientVendorPlAccounts.filter(accounts => {
      return accounts.accountType === 'vendor_client'
    })

    const clientOption = combinedClientsAndIntroducers.map(option => (
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
    const currencyOption = cACurrencies.map(option => (
      <Option key={option.id} value={option.code} label={option.code}>
        {option.code}
      </Option>
    ))
    const boolenList = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const mainCurrencyOption = mainCurrencies.map(option => (
      <Option key={option.id} value={option.code} label={option.name}>
        {option.name}
      </Option>
    ))

    const vendorOption = vendors.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    // const brandsList = brands.map(option => (
    //   <Option
    //     key={option.id}
    //     label={`${lodash.startCase(option.brand)} - ${option.brandCode}`}
    //     value={option.id}
    //   >
    //     {`${lodash.startCase(option.brand)} - ${option.brandCode}`}
    //   </Option>
    // ))

    const productsList = products.map(option => (
      <Option key={option.id} label={option.product} value={option.id}>
        {option.product}
      </Option>
    ))

    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    const vendorClientList = vendorClientAccounts.map(option => (
      <Option
        key={option.id}
        label={`${option.accountName} - ${option.currency}`}
        value={option.id}
      >
        {`${option.accountName} - ${option.currency}`}
      </Option>
    ))

    return (
      <Spin
        spinning={
          companiesListLoading || clientListloading || vendorListLoading || introducersListLoading
        }
      >
        <Card
          title={
            <div>
              <span className="font-size-16">New Client Payment Account</span>
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
                </div>

                <div className="col-md-6 col-lg-3">
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
                </div>

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
                {isMainCurrency ? (
                  <div className="col-md-6 col-lg-3">
                    <Form.Item label="Main Currency" hasFeedback>
                      {form.getFieldDecorator('mainCurrency', {
                        rules: [{ required: true, message: 'Please select MainCurrency' }],
                      })(
                        <Select
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
                          placeholder="Please select MainCurrency"
                          filterOption={(input, option) =>
                            option.props.label
                              ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              : ''
                          }
                          onChange={(value, id) => this.onChangeMainCurrencySelected(value, id)}
                        >
                          {mainCurrencyOption}
                        </Select>,
                      )}
                    </Form.Item>
                  </div>
                ) : (
                  ''
                )}
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

                <React.Fragment>
                  {/* <div className="col-md-6 col-lg-3">
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
                  </div> */}
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
                          // disabled
                        >
                          {productsList}
                        </Select>,
                      )}
                    </Form.Item>
                  </div>

                  {isVendorAccount ? (
                    <div className="col-md-6 col-lg-3">
                      <Form.Item label="Select Vendor" hasFeedback>
                        {form.getFieldDecorator('vendorEntityId', {
                          rules: [{ message: 'Please select associated Vendor' }],
                        })(
                          <Select
                            showSearch
                            optionFilterProp="children"
                            optionLabelProp="label"
                            placeholder="Please select associated Vendor"
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
                    </div>
                  ) : (
                    <div className="col-md-6 col-lg-3">
                      <Form.Item label="Linked Vendor Account" hasFeedback>
                        {form.getFieldDecorator('linkedVendorAccount', {
                          rules: [{ message: 'Please select associated Vendor Client account' }],
                        })(
                          <Select
                            showSearch
                            optionFilterProp="children"
                            optionLabelProp="label"
                            placeholder="please select associated Vendor Client account"
                            filterOption={(input, option) =>
                              option.props.label
                                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                : ''
                            }
                          >
                            {vendorClientList}
                          </Select>,
                        )}
                      </Form.Item>
                    </div>
                  )}
                  <div className="col-md-6 col-lg-3">
                    <Form.Item label="Treasury" hasFeedback>
                      {form.getFieldDecorator('isTreasury', {
                        initialValue: 'no',
                        rules: [{ required: true, message: 'Please select is treasury' }],
                      })(
                        <Select
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
                          placeholder="Please select is treasury"
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
                </React.Fragment>
              </div>
              {isCryptoCurrency ? (
                <Form.Item label="Generate Vendor Account">
                  {form.getFieldDecorator('generateVendorAccount', {
                    rules: [],
                  })(<Switch onChange={this.handleVendorChange} />)}
                </Form.Item>
              ) : (
                ''
              )}
              {currencyData.type ? (
                <React.Fragment>
                  <span className="font-size-18">Account Details:</span>
                  <Divider className={styles.dividerBlock} />
                  <Form.Item label="Auto Generate Account Details">
                    {form.getFieldDecorator('autoGenerateFromBank', {
                      rules: [],
                      valuePropName: 'checked',
                    })(<Switch onChange={this.handleAutoGenFormBank} />)}
                  </Form.Item>
                  <div className="row">
                    <div className="col-md-3 col-lg-3">
                      {!isFormAutoGenerateBank && (
                        <Form.Item
                          label={currencyData.type === 'fiat' ? 'Account Number' : 'Wallet Address'}
                          hasFeedback
                        >
                          {form.getFieldDecorator('accountNumber', {
                            rules: [
                              {
                                // required: true,
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
                      )}
                    </div>
                    <div className="col-md-3 col-lg-3">
                      {!isFormAutoGenerateBank && currencyData.type === 'crypto' && (
                        <Form.Item label="Blockchain" hasFeedback>
                          {form.getFieldDecorator('blockchain', {
                            rules: [
                              {
                                // required: true,
                                message: 'Please enter Blockchain',
                              },
                            ],
                          })(<Input placeholder="Please enter Blockchain" />)}
                        </Form.Item>
                      )}
                    </div>
                    {!isFormAutoGenerateBank && currencyData.type === 'fiat' ? (
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
                              // rules: [{ required: true, message: 'Please enter bank code' }],
                            })(<Input placeholder="Enter bank code" />)}
                          </Form.Item>
                        </div>
                        <div className="col-md-3 col-lg-3">
                          <Form.Item label="IBAN" hasFeedback>
                            {form.getFieldDecorator('IBAN', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: 'Please enter IBAN',
                              //   },
                              // ],
                            })(<Input placeholder="Enter IBAN" />)}
                          </Form.Item>
                        </div>
                        <div className="col-md-3 col-lg-3">
                          <Form.Item label="SWIFT BIC" hasFeedback>
                            {form.getFieldDecorator('BIC', {
                              // rules: [
                              //   {
                              //     required: true,
                              //     message: 'Please enter swift bic',
                              //   },
                              // ],
                            })(<Input placeholder="Enter swift bic" />)}
                          </Form.Item>
                        </div>
                        <div className="col-md-3 col-lg-3">
                          <Form.Item label="Intermediary Bank " hasFeedback>
                            {form.getFieldDecorator(
                              'intermediaryBank',
                              {},
                            )(<Input placeholder="Enter Intermediary Bank" />)}
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
                  <Button
                    className={styles.btnSAVE}
                    htmlType="submit"
                    onClick={this.onSubmitHandler}
                    loading={addAccountLoading}
                  >
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
