import React, { Component } from 'react'
import {
  Form,
  Select,
  Input,
  Button,
  Tooltip,
  Divider,
  Alert,
  Typography,
  Icon,
  notification,
} from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
import { getCompanyName } from 'utilities/transformer'
// import lodash from 'lodash'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  updateCAInitialDataEditMode,
  editSuspensePaymentAccount,
  updateAccountsErrorList,
} from 'redux/currencyAccounts/action'
import data from './data.json'
import styles from './style.module.scss'

const { Option } = Select
const { Paragraph, Text } = Typography

const mapStateToProps = ({ user, general, currencyAccounts }) => ({
  token: user.token,
  currencies: general.newCurrencies,
  // mainCurrencies: general.newCurrencies,
  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,

  addAccountLoading: currencyAccounts.addAccountLoading,
  allVendorClientVendorPlAccounts: currencyAccounts.allVendorClientVendorPlAccounts,
  brands: general.brands,
  countries: general.countries,

  errorList: currencyAccounts.errorList,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class editCurrencyAccount extends Component {
  state = {
    // currencyData: { type: '' },
    // mainCurrencyData: {},
    cACurrencies: [],
    mainCurrencies: [],
    isMainCurrency: false,
  }

  componentDidMount() {
    const { dispatch, currencies } = this.props
    const cACurrencies = currencies.filter(item => item.currencyAccount === 'Yes')
    const mainCurrencies = currencies.filter(item => item.mainCurrency === true)
    this.setState({
      cACurrencies,
      mainCurrencies,
      // currencyData: {
      //   type: record.currencyType,
      // },
    })
    const emptyArray = []
    dispatch(updateAccountsErrorList(emptyArray))
    // this.onChangeCurrencySelected(record.currency)
    // this.onChangeMainCurrencySelected(record.mainCurrency)
  }

  // onChangeCurrencySelected = value => {
  //   const { currencies } = this.props
  //   const currencyData = currencies.filter(item => item.value === value)
  //   this.setState({ currencyData: currencyData[0] })
  // }

  // onChangeMainCurrencySelected = value => {
  //   const { mainCurrencies } = this.props
  //   const mainCurrencyData = mainCurrencies.filter(item => item.code === value)
  //   this.setState({ mainCurrencyData: mainCurrencyData[0] })
  // }

  // onChangeCurrencySelected = value => {
  //   const { cACurrencies } = this.state
  //   const currencyData = cACurrencies.filter(item => item.code === value)
  //   this.setState({
  //     currencyData: currencyData[0],
  //     // isFormAutoGenerateBank: currencyData.length > 0 && !currencyData[0].type === 'crypto',
  //   })
  //   if (value === 'USDT' || value === 'USDC') {
  //     this.setState({ isMainCurrency: true })
  //   } else {
  //     this.setState({ isMainCurrency: false })
  //   }
  // }

  // onChangeMainCurrencySelected = value => {
  //   const { mainCurrencies } = this.state
  //   const mainCurrencyData = mainCurrencies.filter(item => item.code === value)
  //   this.setState({
  //     mainCurrencyData: mainCurrencyData[0],
  //   })
  // }

  onSubmit = event => {
    event.preventDefault()
    const { form, record, dispatch, token } = this.props
    const { cACurrencies } = this.state
    const selectedCurrencyData = cACurrencies.find(currency => currency.code === record.currency)
    form.validateFields((error, values) => {
      if (
        (values.accountNumber !== undefined && values.accountNumber !== '') ||
        (values.IBAN !== undefined && values.IBAN !== '') ||
        selectedCurrencyData?.type === 'crypto'
      ) {
        if (!error) {
          const value = {
            isBlockedInbound: values.isBlockedInbound === 'yes' || false,
            isBlockedOutbound: values.isBlockedOutbound === 'yes' || false,
            accountName: values.accountName,
            mainCurrency: values.mainCurrency,
            linkedVendorAccount: values.linkedVendorAccount,
            isTreasury: values.isTreasury === 'yes' || false,
            accountIdentification: {
              accountRegion: values.accountRegion,
              accountNumber: values.accountNumber,
              bankCode: values.bankCode,
              IBAN: values.IBAN,
              BIC: values.BIC,
              intermediaryBank: values.intermediaryBank,
            },
          }
          if (selectedCurrencyData?.type === 'crypto')
            value.accountIdentification.blockchain = values.blockchain
          dispatch(editSuspensePaymentAccount(record.id, value, token))
        }
      } else {
        notification.error({
          message: 'Enter Account Number or IBAN',
        })
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateCAInitialDataEditMode(false))
  }

  render() {
    const {
      form,
      record,
      addAccountLoading,
      companies,
      countries,
      errorList,
      allVendorClientVendorPlAccounts,
    } = this.props
    const { isMainCurrency, mainCurrencies } = this.state

    // const currencyOption = currencies.map(option => (
    //   <Option key={option.id} value={option.value} label={option.value}>
    //     {option.value}
    //   </Option>
    // ))

    // console.log(mainCurrencyData, 'mainCurrencyData')
    // console.log(mainCurrencies, 'mainCurrencies')

    const mainCurrencyOption = mainCurrencies?.map(option => (
      <Option key={option.id} value={option.code} label={option.name}>
        {option.name}
      </Option>
    ))

    const boolenList = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    const vendorAccountsList = allVendorClientVendorPlAccounts.map(option => (
      <Option
        key={option.id}
        label={`${option.accountName} - ${option.currency}`}
        value={option.id}
      >
        {`${option.accountName} - ${option.currency}`}
      </Option>
    ))

    return (
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
                <Tooltip title="Restricted to edit">
                  <Form.Item label="Account Owner" hasFeedback>
                    {form.getFieldDecorator('ownerEntityId', {
                      initialValue: record.ownerEntityId
                        ? getCompanyName(companies, record.ownerEntityId)
                        : '',
                      rules: [{ required: true, message: 'Please select client' }],
                    })(
                      <Input placeholder="Enter account type" style={{ pointerEvents: 'none' }} />,
                    )}
                  </Form.Item>
                </Tooltip>
              </div>
            ) : (
              ''
            )}

            <div className="col-md-6 col-lg-3">
              <Tooltip title="Restricted to edit">
                <Form.Item label="Account Issuer" hasFeedback>
                  {form.getFieldDecorator('issuerEntityId', {
                    initialValue: record.issuerEntityId
                      ? getCompanyName(companies, record.issuerEntityId)
                      : '',
                    rules: [{ required: true, message: 'Please select client' }],
                  })(<Input placeholder="Enter account type" style={{ pointerEvents: 'none' }} />)}
                </Form.Item>
              </Tooltip>
            </div>

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
            {/* <Tooltip title="Restricted to edit">
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Main Currency" hasFeedback>
                  {form.getFieldDecorator('mainCurrency', {
                    initialValue: mainCurrencyData?.name,
                    rules: [{ required: true, message: 'Please select MainCurrency' }],
                  })(<Input placeholder="Please select MainCurrency" style={{ pointerEvents: 'none' }} />)}
                </Form.Item>
              </div>
            </Tooltip> */}

            {(isMainCurrency || record.currency === 'USDT' || record.currency === 'USDC') && (
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Main Currency" hasFeedback>
                  {form.getFieldDecorator('mainCurrency', {
                    initialValue: record.mainCurrency,
                    rules: [{ required: true, message: 'Please select Main Currency' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="label"
                      optionLabelProp="label"
                      placeholder="Please select Main Currency"
                    >
                      {mainCurrencyOption}
                    </Select>,
                  )}
                </Form.Item>
              </div>
            )}
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
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Linked Vendor Account" hasFeedback>
                {form.getFieldDecorator('linkedVendorAccount', {
                  initialValue: record.linkedVendorAccount,
                  rules: [{ message: 'Please select associated Vendor account' }],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    optionLabelProp="label"
                    placeholder="Please select associated Vendor account"
                    filterOption={(input, option) =>
                      option.props.label
                        ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        : ''
                    }
                  >
                    {vendorAccountsList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Treasury" hasFeedback>
                {form.getFieldDecorator('isTreasury', {
                  initialValue: record.isTreasury ? 'yes' : 'no',
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
          </div>
          {/* {console.log(currencyData, 'currencyDataref')} */}
          {record?.currencyType ? (
            <React.Fragment>
              <span className="font-size-18">Account Details:</span>
              <Divider className={styles.dividerBlock} />
              <div className="row">
                <div className="col-md-3 col-lg-3">
                  <Form.Item
                    label={record?.currencyType === 'fiat' ? 'Account Number' : 'Wallet Address'}
                    hasFeedback
                  >
                    {form.getFieldDecorator('accountNumber', {
                      initialValue: record.accountIdentification.accountNumber,
                      rules: [
                        {
                          // required: true,
                          message:
                            record?.currencyType === 'fiat'
                              ? 'Please enter account Number'
                              : 'wallet address',
                        },
                      ],
                    })(
                      <Input
                        placeholder={
                          record?.currencyType === 'fiat'
                            ? 'Please enter account Number'
                            : 'wallet address'
                        }
                      />,
                    )}
                  </Form.Item>
                </div>
                {record?.currencyType === 'crypto' && (
                  <div className="col-md-3 col-lg-3">
                    <Form.Item label="Blockchain" hasFeedback>
                      {form.getFieldDecorator('blockchain', {
                        initialValue: record.accountIdentification.blockchain,
                        rules: [
                          {
                            // required: true,
                            message: 'Please enter Blockchain',
                          },
                        ],
                      })(<Input placeholder="Please enter Blockchain" />)}
                    </Form.Item>
                  </div>
                )}
                {record?.currencyType === 'fiat' ? (
                  <React.Fragment>
                    <div className="col-md-3 col-lg-3">
                      <Form.Item label="Account Region" hasFeedback>
                        {form.getFieldDecorator('accountRegion', {
                          initialValue: record.accountIdentification.accountRegion,
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
                                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                          initialValue: record.accountIdentification.bankCode,
                          // rules: [{ required: true, message: 'Please enter bank code' }],
                        })(<Input placeholder="Enter bank code" />)}
                      </Form.Item>
                    </div>
                    <div className="col-md-3 col-lg-3">
                      <Form.Item label="IBAN" hasFeedback>
                        {form.getFieldDecorator('IBAN', {
                          initialValue: record.accountIdentification.IBAN,
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
                          initialValue: record.accountIdentification.BIC,
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
                        {form.getFieldDecorator('intermediaryBank', {
                          initialValue: record.accountIdentification.intermediaryBank,
                        })(<Input placeholder="Enter Intermediary Bank" />)}
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
                Update
              </Button>
            </div>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}

export default editCurrencyAccount
