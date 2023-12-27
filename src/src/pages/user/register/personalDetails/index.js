import React, { Component } from 'react'
// import moment from 'moment'
import { Form, Input, Button, DatePicker, Select } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { addUserInformation } from 'redux/register/actions'
import { getUserData } from 'redux/user/actions'
import styles from '../style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, register, general }) => ({
  userStore: user,
  loading: register.loading,
  token: user.token,
  isUserInfoUpdated: register.isUserInfoUpdated,
  email: user.email,
  countries: general.countries,
})

@Form.create()
@connect(mapStateToProps)
class PersonalDetails extends Component {
  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isUserInfoUpdated) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isUserInfoUpdated } = this.props
    const isPropsUpdated = {
      isUserInfoUpdated: prevProps.isUserInfoUpdated !== isUserInfoUpdated,
    }
    return isPropsUpdated
  }

  updateState = () => {
    const { dispatch, token } = this.props
    dispatch(getUserData(token))
  }

  onSubmit = event => {
    event.preventDefault()
    const { dispatch, form, token, email } = this.props
    const address = {}
    form.validateFields((error, fieldsValue) => {
      if (!error) {
        const dob = fieldsValue['date-of-Birth'].format('YYYY/MM/DD')
        address.addressLine1 = fieldsValue.addressLine1
        address.addressLine2 = fieldsValue.addressLine2
        address.city = fieldsValue.city
        address.postCode = fieldsValue.postCode
        address.countryOfResidence = fieldsValue.countryOfResidence
        fieldsValue.dateOfBirth = dob
        fieldsValue.address = address
        fieldsValue.mobilePhone = fieldsValue.prefix + fieldsValue.mobilePhone
        fieldsValue.email = email

        delete fieldsValue.prefix
        delete fieldsValue.addressLine1
        delete fieldsValue.addressLine2
        delete fieldsValue.city
        delete fieldsValue.postCode
        delete fieldsValue.countryOfResidence
        delete fieldsValue['date-of-Birth']
        dispatch(addUserInformation(fieldsValue, token))
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  handleBack = () => {
    const { history } = this.props
    history.push('/user/login')
  }

  render() {
    const { loading, form, countries } = this.props
    const telephonePrefixOptions = countries.map(option => (
      <Option key={option.id} label={option.telephonePrefix} value={option.telephonePrefix}>
        <span>{option.telephonePrefix}</span>
      </Option>
    ))
    const prefixSelector = form.getFieldDecorator('prefix', {
      initialValue: '+44',
    })(<Select style={{ width: 70 }}>{telephonePrefixOptions}</Select>)
    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.name}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    return (
      <div>
        <Helmet title="Register" />
        {/* {this.registerSuccess()} */}
        {/* {this.registerFail()} */}
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Personal Details</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" onSubmit={this.onSubmit}>
                    <Form.Item label="First Name">
                      {form.getFieldDecorator('firstName', {
                        initialValue: '',
                        rules: [
                          { required: true, message: 'Please input your first name' },
                          {
                            pattern: new RegExp('^[A-Za-z]+(?:[ -][A-Za-z]+)*$'),
                            message: `Invalid Input first name`,
                          },
                        ],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Last Name">
                      {form.getFieldDecorator('lastName', {
                        initialValue: '',
                        rules: [
                          { required: true, message: 'Please input your last name' },
                          {
                            pattern: new RegExp('^[A-Za-z]+(?:[ -][A-Za-z]+)*$'),
                            message: `Invalid Input last name`,
                          },
                        ],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Date of Birth (DD/MM/YYYY)">
                      {form.getFieldDecorator('date-of-Birth', {
                        rules: [{ required: true, message: 'Please input your date of birth' }],
                      })(<DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item label="Phone Number">
                      {form.getFieldDecorator('mobilePhone', {
                        initialValue: '',
                        rules: [
                          {
                            min: 7,
                            max: 15,
                            message: 'Invalid Number',
                          },
                          { message: 'Please input your phone Number' },
                        ],
                      })(<Input addonBefore={prefixSelector} type="number" />)}
                    </Form.Item>
                    <Form.Item label="Home Address Line 1">
                      {form.getFieldDecorator('addressLine1', {
                        initialValue: '',
                        rules: [{ message: 'Please input your address' }],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Home Address Line 2">
                      {form.getFieldDecorator('addressLine2', {
                        initialValue: '',
                        rules: [{ message: 'Please input your address' }],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Home Address City">
                      {form.getFieldDecorator('city', {
                        initialValue: '',
                        rules: [{ message: 'Please input your city' }],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Home Address Postcode">
                      {form.getFieldDecorator('postCode', {
                        initialValue: '',
                        rules: [{ message: 'Please input your postcode' }],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="Home Address Country">
                      {form.getFieldDecorator('countryOfResidence', {
                        initialValue: '',
                        rules: [{ message: 'Please input your country' }],
                      })(
                        <Select
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
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
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        htmlType="submit"
                        loading={loading}
                      >
                        CREATE
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PersonalDetails
