import React from 'react'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Row, Col, Icon, Progress } from 'antd'
import { connect } from 'react-redux'
import { updatePassowrdStrength, closeChangePasswordModal } from 'redux/register/actions'
import { changePassword } from 'redux/user/actions'
import styles from './style.module.scss'

const FormItem = Form.Item

const mapStateToProps = ({ user, register }) => ({
  token: user.token,
  isUserPasswordUpdated: user.isUserPasswordUpdated,
  passwordStrength: register.passwordStrength,
  passwordPercentage: register.passwordPercentage,
  progressLogColor: register.progressLogColor,
  password: register.password,
  loading: user.loading,
  isUserRegistered: register.isUserRegistered,
})
@Form.create()
@withRouter
@connect(mapStateToProps)
class ChangePassword extends React.Component {
  state = {
    unUsed: '',
    passwordMatch: false,
    passwordNumber: false,
    passwordProgressLog: false,
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isUserPassUpdated) {
      this.updateProps()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isUserPasswordUpdated } = this.props
    const isPropsUpdated = {
      isUserPassUpdated: prevProps.isUserPasswordUpdated !== isUserPasswordUpdated,
    }
    return isPropsUpdated
  }

  updateProps = () => {
    const { dispatch } = this.props
    dispatch(closeChangePasswordModal())
  }

  onSubmit = event => {
    event.preventDefault()
    const { dispatch, form, token } = this.props
    const { passwordMatch } = this.state
    form.validateFields((error, values) => {
      if (!error && !passwordMatch) {
        values.token = token
        dispatch(changePassword(values))
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('newPassword')) {
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

  render() {
    const { loading, passwordStrength, progressLogColor, passwordPercentage, form } = this.props
    const { unUsed, unUsedFileds, passwordProgressLog } = this.state
    if (unUsedFileds) {
      console.log(unUsed)
    }
    return (
      <div className={styles.form}>
        <p className={styles.formTitle}>PLease Change Password</p>
        <Form onSubmit={this.onSubmit}>
          <FormItem label="Current Password">
            {form.getFieldDecorator('currentPassword', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: 'Please input your current password',
                },
              ],
            })(
              <Input.Password
                autoComplete="false"
                type="password"
                placeholder="Current Password"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />,
            )}
          </FormItem>
          <Form.Item label="New Password">
            {form.getFieldDecorator('newPassword', {
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
            <Row>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="width-150 mr-4"
                  loading={loading}
                >
                  Save
                </Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    )
  }
}

export default ChangePassword
