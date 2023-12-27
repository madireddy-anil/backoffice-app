import React, { Component } from 'react'
import { Form, Spin, Card, Button, Row, Col, Select, Input, Divider, Modal } from 'antd'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import { updateBankAccount, getBankAccountById } from 'redux/bankAccounts/actions'

import jsondata from '../data.json'

import styles from '../style.module.scss'

const { Option } = Select
const { confirm } = Modal

const mapStateToProps = ({ general, bankAccount, user }) => ({
  vendors: general.newVendors,
  account: bankAccount.bankAccountDetail,
  formatedBankAccount: bankAccount.formatedBankAccount,
  token: user.token,
  loading: bankAccount.bankAccountLoading,
})

@Form.create()
@connect(mapStateToProps)
class EditLocalAccount extends Component {
  componentDidMount = () => {
    const { location, dispatch, token } = this.props
    const splitRes = location.pathname.split('/')
    const id = splitRes[2]
    dispatch(getBankAccountById(id, token))
  }

  onPopUpMessage = e => {
    e.preventDefault()
    const insidethis = this
    confirm({
      title: 'Are you sure Save?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        insidethis.handleUpdateAccount(e)
      },
      onCancel() {},
    })
  }

  handleUpdateAccount = event => {
    event.preventDefault()
    const { form, dispatch, account, vendors, token } = this.props

    const vendorObj = vendors.find(el => el.id === account.vendorId)
    const vendorInfo = vendorObj !== undefined && vendorObj

    const accId = account.id
    const vendorId = vendorInfo.id
    const vendorid = { vendorId }
    form.validateFields((error, values) => {
      if (!error) {
        Object.assign(values, vendorid)
        dispatch(updateBankAccount(values, accId, token))
      }
    })
  }

  editAccount = () => {
    const { vendors, account } = this.props
    const { form } = this.props
    const empty = '---'
    const vendorObj = vendors.find(el => el.id === account.vendorId)
    const vendorInfo = vendorObj !== undefined && vendorObj

    const currencyOption = jsondata.countryCurrencyFields.map(option => (
      <Option key={option.id} value={option.currency}>
        {option.currency}
      </Option>
    ))
    const countryOption = jsondata.countryCurrencyFields.map(option => (
      <Option key={option.id} value={option.country}>
        {option.country}
      </Option>
    ))
    const localAccTypesOption = jsondata.localAccountTypesOptions.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    const accTypesOption = jsondata.accountType.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    const accountStatusOption = jsondata.accountStatus.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    const getFieldOptions = label => {
      let returnResp
      switch (label) {
        case 'accountCurrency':
          returnResp = currencyOption
          break
        case 'bankCountry':
          returnResp = countryOption
          break
        case 'localAccountType':
          returnResp = localAccTypesOption
          break
        case 'accountType':
          returnResp = accTypesOption
          break
        case 'accountStatus':
          returnResp = accountStatusOption
          break
        default:
          break
      }
      return returnResp
    }
    return (
      <div>
        <div className={styles.modalCardScroll}>
          <strong className="font-size-15">Vendor</strong>
          <div className="pb-3 mt-1">
            <span className="font-size-12">Selected Vendor</span>
          </div>
          <div className={styles.modalistCard}>
            <h6>{Object.entries(vendorInfo).length > 0 ? vendorInfo.tradingName : empty}</h6>
            <div>
              <small>
                {Object.entries(vendorInfo).length > 0 ? vendorInfo.registeredCompanyName : empty}
              </small>
            </div>
            <div>
              <small>{Object.entries(vendorInfo).length > 0 ? vendorInfo.vendorType : empty}</small>
            </div>
          </div>
          <Spacer height="20px" />
          <Form className={styles.formModalBox} onSubmit={this.onPopUpMessage}>
            <div className="row">
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Name On Account</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('nameOnAccount', {
                    initialValue: account.nameOnAccount,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Name On Account`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Account Number</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('accountNumber', {
                    initialValue: account.accountNumber,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Account Number`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Account Currency</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('accountCurrency', {
                    initialValue: account.accountCurrency,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Account Currency`,
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} className={styles.cstmSelectInput}>
                      {getFieldOptions('accountCurrency')}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Bank Name</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('bankName', {
                    initialValue: account.bankName,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Bank Name`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Bank Code</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('bankCode', {
                    initialValue: account.bankCode,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Bank Code`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Bank City</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('bankCity', {
                    initialValue: account.bankCity,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Bank City`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Bank Province</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('bankProvince', {
                    initialValue: account.bankProvince,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Bank Province`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Bank Country</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('bankCountry', {
                    initialValue: account.bankCountry,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Bank Country`,
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} className={styles.cstmSelectInput}>
                      {getFieldOptions('bankCountry')}
                    </Select>,
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Bank Address</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('bankAddress', {
                    initialValue: account.bankAddress,
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Maximum Amount</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('maxAmount', {
                    initialValue: account.maxAmount,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Maximum Amount`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Min Amount</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('minAmount', {
                    initialValue: account.minAmount,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Min Amount`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Balance Amount</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('balanceAmount', {
                    initialValue: account.balanceAmount,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Balance Amount`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Local Account Type</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('localAccountType', {
                    initialValue: account.localAccountType,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Local Account Type`,
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} className={styles.cstmSelectInput}>
                      {getFieldOptions('localAccountType')}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Account Type</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('accountType', {
                    initialValue: account.accountType,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Account Type`,
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} className={styles.cstmSelectInput}>
                      {getFieldOptions('accountType')}
                    </Select>,
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-lg-6">
                <strong className="font-size-15">Account Status</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('accountStatus', {
                    initialValue: account.accountStatus,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Account Status`,
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} className={styles.cstmSelectInput}>
                      {getFieldOptions('accountStatus')}
                    </Select>,
                  )}
                </Form.Item>
              </div>
            </div>
            <Divider />
            <Button className={styles.btnCheckoutSAVE} htmlType="submit">
              SAVE
            </Button>
          </Form>
        </div>
      </div>
    )
  }

  navigateToViewAccount = record => {
    const { id } = record
    const { history } = this.props
    history.push(`/view-account/${id}`)
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/bank-accounts')
  }

  render() {
    const { loading, account } = this.props
    return (
      <Card
        title="Edit Bank Account"
        bordered={false}
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          padding: '2px',
          border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
        extra={
          <>
            <Button
              type="link"
              className="pr-3"
              onClick={() => this.navigateToViewAccount(account)}
            >
              View
            </Button>
            <Button type="link" onClick={this.onBackButtonHandler}>
              Back
            </Button>
          </>
        }
      >
        <Row>
          <Col className="p-2">
            <Spin className={styles.darkSpinnerOverlayBg} spinning={loading} tip="Loading . . .">
              {this.editAccount()}
            </Spin>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default EditLocalAccount
