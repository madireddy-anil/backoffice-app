import React, { Component } from 'react'
import { Form, Input, Button, Icon, Alert } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
// import { parseQueryString } from '../../../utilities/transformer'
import { sendEmailToResetPassword } from 'redux/user/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user }) => ({
  loading: user.loading,
  user: user.passwordResetPath,
})

@Form.create()
@connect(mapStateToProps)
@withRouter
class Forgot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPasswordMatchedError: false,
      errorMessage: '',
    }
  }

  // setAccessToken = () => {
  //   const { location, dispatch } = this.props
  //   const token = parseQueryString(location.search).token
  //     ? encodeURIComponent(parseQueryString(location.search).token)
  //     : undefined

  //   dispatch(setToken(token))
  // }

  handleSendEmail = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(sendEmailToResetPassword(values))
      }
    })
  }

  //   handleUpdatePassword = e => {
  //     e.preventDefault()
  //     const { form, dispatch, user } = this.props
  //     form.validateFields((err, values) => {
  //       if (!err) {
  //         const validationValues = validate('PASSWORD_REPEAT', values)
  //         const { isValid } = validationValues
  //         if (isValid) {
  //           const value = {
  //             token: user.passwordResetToken,
  //             password: values.password,
  //           }
  //           dispatch(resetPassword(value))
  //         } else {
  //           this.setState({
  //             isPasswordMatchedError: true,
  //             errorMessage: 'Password doesn’t match, please try again',
  //           })
  //         }
  //       }
  //     })
  //   }

  //   handleResetUserState = () => {
  //     const { dispatch } = this.props
  //     dispatch(resetUserState())
  //   }

  render() {
    const { form, user, loading } = this.props
    const { isPasswordMatchedError, errorMessage } = this.state
    if (user.passwordResetPath) {
      return (
        <div>
          <Helmet title="Forgot" />
          <div className={styles.block}>
            <div className="row">
              <div className="col-xl-12">
                <div className={styles.inner}>
                  <div className={styles.form}>
                    <h4 className="text-uppercase">
                      <strong>Password Reset</strong>
                    </h4>
                    <br />
                    <Form layout="vertical" hideRequiredMark onSubmit={this.handleUpdatePassword}>
                      <Form.Item label="New Password">
                        {form.getFieldDecorator('password', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please input password' }],
                        })(
                          <Input
                            size="default"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                          />,
                        )}
                      </Form.Item>
                      <Form.Item label="Confirm Password">
                        {form.getFieldDecorator('confirmPassword', {
                          initialValue: '',
                          rules: [{ required: true, message: 'Please input confirm password' }],
                        })(
                          <Input
                            size="default"
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                          />,
                        )}
                      </Form.Item>

                      {isPasswordMatchedError ? (
                        <Alert message={errorMessage} type="error" showIcon />
                      ) : (
                        ''
                      )}
                      <div className="mb-2">
                        <Link
                          to="/user/login"
                          className="font-weight-bold utils__link--blue utils__link--underlined"
                          // onClick={this.handleResetUserState}
                        >
                          Back to login
                        </Link>
                      </div>
                      <div className="form-actions">
                        <Button
                          type="primary"
                          className="width-200 mr-5"
                          htmlType="submit"
                          loading={user.isPasswordReset}
                        >
                          UPDATE PASSWORD
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
    return (
      <div>
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Password Reset</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" onSubmit={this.handleSendEmail}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your e-mail address' }],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <div className="mb-2">
                      <Link
                        to="/user/login"
                        className="font-weight-bold utils__link--blue utils__link--underlined"
                      >
                        Back to login
                      </Link>
                    </div>
                    <div className="form-actions">
                      <Button
                        type="primary"
                        className="width-150 mr-4"
                        htmlType="submit"
                        loading={loading}
                      >
                        SEND EMAIL
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

export default Forgot
