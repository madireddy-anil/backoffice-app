import React, { Component } from 'react'
import { Form, Input, Button, Icon, Progress, Result } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { updatePassowrdStrength, newUserRegistration, updateEmail } from 'redux/register/actions'
import styles from './style.module.scss'

const mapStateToProps = ({ user, register }) => ({
  userStore: user,
  passwordStrength: register.passwordStrength,
  passwordPercentage: register.passwordPercentage,
  progressLogColor: register.progressLogColor,
  password: register.password,
  loading: register.loading,
  isUserRegistered: register.isUserRegistered,
})

@Form.create()
@connect(mapStateToProps)
class Register extends Component {
  state = {
    isUserRegisterSuccess: false,
    unUsed: '',
    passwordMatch: false,
    passwordNumber: false,
    passwordProgressLog: false,
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isUserInfoUpdated) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isUserRegistered } = this.props
    const isPropsUpdated = {
      isUserInfoUpdated: prevProps.isUserRegistered !== isUserRegistered,
    }
    return isPropsUpdated
  }

  updateState = () => {
    this.setState({ isUserRegisterSuccess: true })
  }

  handleBack = () => {
    const { history } = this.props
    history.push('/user/login')
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { passwordMatch } = this.state
    form.validateFields((error, values) => {
      if (!error && !passwordMatch) {
        dispatch(updateEmail(values.email))
        dispatch(newUserRegistration(values, token))
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

  handlePasswordValidation = e => {
    const { form, dispatch } = this.props
    if (e.target.value) {
      const values = {
        passwordStrength: 'Very Weak',
        progressLogColor: '#d9534f',
        passwordPercentage: 20,
        password: e.target.value,
      }
      form.setFieldsValue({
        password: e.target.value,
      })
      dispatch(updatePassowrdStrength(values))
      Promise.resolve(
        this.setState({
          passwordProgressLog: true,
          password: e.target.value,
        }),
      ).then(() => {
        this.progressLogForPassword()
      })
    } else {
      this.setState({
        passwordProgressLog: false,
        passwordNumber: false,
      })
      const values = {
        passwordStrength: ' ',
        passwordPercentage: 0,
        password: ' ',
      }
      dispatch(updatePassowrdStrength(values))
    }
  }

  progressLogForPassword = () => {
    const { password, passwordNumber } = this.state
    const { dispatch } = this.props
    const capsLetter = /^[A-Z]+$/
    const number = /^[0-9]+$/
    const passRegex =
      '^(?=[ -~]*?[A-Z])(?=[ -~]*?[a-z])(?=[ -~]*?[0-9])(?=[ -~]*?[#?!@$%^&*-])[ -~]{8,16}$'
    const { map } = Array.prototype
    const newName = map.call(password, eachLetter => {
      if (passwordNumber && eachLetter.match(capsLetter)) {
        const values = {
          passwordStrength: 'Weak',
          progressLogColor: '#f0ad4e',
          passwordPercentage: 80,
        }
        dispatch(updatePassowrdStrength(values))
      }
      if (password.length > 3) {
        const values = {
          passwordStrength: 'Weak',
          progressLogColor: '#f0ad4e',
          passwordPercentage: 30,
        }
        dispatch(updatePassowrdStrength(values))
      }
      if (password.length > 5) {
        const values = {
          passwordStrength: 'Medium',
          progressLogColor: '#f0ad4e',
          passwordPercentage: 60,
        }
        dispatch(updatePassowrdStrength(values))
      }
      if (eachLetter.match(number)) {
        this.setState({ passwordNumber: true })
      }
      if (password.match(passRegex)) {
        const values = {
          passwordStrength: 'Strong',
          progressLogColor: '#5cb85c',
          passwordPercentage: 100,
        }
        dispatch(updatePassowrdStrength(values))
      }
      return map
    })
    this.setState({ unUsed: newName })
  }

  registerSuccess = () => {
    return (
      <Result
        status="success"
        title="Registration successful!"
        subTitle="Thank you for registring with us! "
        extra={[
          <Button type="primary" key="console" onClick={this.handleBack}>
            BACK TO LOGIN
          </Button>,
        ]}
      />
    )
  }

  render() {
    const { loading, passwordStrength, progressLogColor, passwordPercentage, form } = this.props
    const { unUsed, unUsedFileds, isUserRegisterSuccess, passwordProgressLog } = this.state
    if (unUsedFileds) {
      console.log(unUsed)
    }
    return (
      <div>
        <Helmet title="Register" />
        {!isUserRegisterSuccess ? (
          <div className={styles.block}>
            <div className="row">
              <div className="col-xl-12">
                <div className={styles.inner}>
                  <div className={styles.form}>
                    <h4 className="text-uppercase">
                      <strong>Create An Account</strong>
                    </h4>
                    <br />
                    <Form layout="vertical" onSubmit={this.onSubmit}>
                      <Form.Item label="Email">
                        {form.getFieldDecorator('email', {
                          initialValue: '',
                          rules: [
                            { required: true, message: 'Please input your e-mail address' },
                            {
                              type: 'email',
                              message: 'The input is not valid E-mail!',
                            },
                          ],
                        })(<Input size="default" />)}
                      </Form.Item>
                      <Form.Item label="Password">
                        {form.getFieldDecorator('password', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: 'Please input your password',
                            },
                            {
                              pattern: new RegExp(
                                '^(?=[ -~]*?[A-Z])(?=[ -~]*?[a-z])(?=[ -~]*?[0-9])(?=[ -~]*?[#?!@$%^&*-])[ -~]{8,16}$',
                              ),
                              message:
                                'A min 8 and max 16 characters combination of at least one uppercase, lowercase, special character and number are required.',
                            },
                          ],
                        })(
                          <Input.Password
                            size="default"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            onChange={this.handlePasswordValidation}
                          />,
                        )}
                        {passwordProgressLog ? (
                          <div style={{ width: '95%' }}>
                            <Progress
                              percent={passwordPercentage}
                              size="small"
                              strokeColor={progressLogColor}
                              format={() => passwordStrength}
                            />
                          </div>
                        ) : (
                          ''
                        )}
                      </Form.Item>
                      <Form.Item label="Confirm Password">
                        {form.getFieldDecorator('confirmPassword', {
                          initialValue: '',
                          rules: [
                            { required: true, message: 'Please input your password' },
                            { validator: this.compareToFirstPassword },
                          ],
                        })(
                          <Input.Password
                            size="default"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                          />,
                        )}
                      </Form.Item>
                      <div className="form-actions">
                        <Button
                          type="primary"
                          className="width-150 mr-4"
                          htmlType="submit"
                          loading={loading}
                        >
                          Confirm
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          this.registerSuccess()
        )}
      </div>
    )
  }
}

export default Register
