// import React, { Component } from 'react'
// import { Form, Input, Button, Checkbox, Icon } from 'antd'
// import { Helmet } from 'react-helmet'
// import { Link } from 'react-router-dom'
// import { connect } from 'react-redux'
// import { userlogin } from '../../../redux/user/actions'
// import styles from './style.module.scss'

// const mapStateToProps = ({ user }) => ({
//   userStore: user,
// })

// @Form.create()
// @connect(mapStateToProps)
// class Login extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {}
//   }

//   onSubmit = event => {
//     event.preventDefault()
//     const { form, dispatch } = this.props
//     form.validateFields((error, values) => {
//       if (!error) {
//         dispatch(userlogin(values))
//       }
//     })
//   }

//   render() {
//     const { form, userStore } = this.props
//     return (
//       <div>
//         <Helmet title="Login" />
//         <div className={styles.block}>
//           <div className="row">
//             <div className="col-xl-12">
//               <div className={styles.inner}>
//                 <div className={styles.form}>
//                   <h4 className="text-uppercase">
//                     <strong>Please log in</strong>
//                   </h4>
//                   <br />
//                   <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
//                     <Form.Item label="Email">
//                       {form.getFieldDecorator('email', {
//                         initialValue: '',
//                         rules: [{ required: true, message: 'Please input your e-mail address' }],
//                       })(<Input size="default" />)}
//                     </Form.Item>
//                     <Form.Item label="Password">
//                       {form.getFieldDecorator('password', {
//                         initialValue: '',
//                         rules: [{ required: true, message: 'Please input your password' }],
//                       })(
//                         <Input
//                           size="default"
//                           prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
//                           type="password"
//                         />,
//                       )}
//                     </Form.Item>
//                     <Form.Item>
//                       {form.getFieldDecorator('remember', {
//                         valuePropName: 'checked',
//                         initialValue: true,
//                       })(<Checkbox>Remember me</Checkbox>)}
//                       <Link
//                         to="/user/old-password-reset"
//                         className="utils__link--blue utils__link--underlined pull-right"
//                       >
//                         Forgot password?
//                       </Link>
//                     </Form.Item>
//                     <div className="form-actions">
//                       <Button
//                         type="primary"
//                         className="width-150 mr-4"
//                         htmlType="submit"
//                         loading={userStore.loading}
//                       >
//                         Login
//                       </Button>
//                       {/* <span className="ml-3 register-link">
//                         <a
//                           href="javascript: void(0);"
//                           className="text-primary utils__link--underlined"
//                         >
//                           Register
//                         </a>{' '}
//                         if you don&#39;t have account
//                       </span> */}
//                     </div>
//                     {/* <div className="form-group">
//                       <p>Use another service to Log In</p>
//                       <div className="mt-2">
//                         <a href="javascript: void(0);" className="btn btn-icon mr-2">
//                           <i className="icmn-facebook" />
//                         </a>
//                         <a href="javascript: void(0);" className="btn btn-icon mr-2">
//                           <i className="icmn-google" />
//                         </a>
//                         <a href="javascript: void(0);" className="btn btn-icon mr-2">
//                           <i className="icmn-windows" />
//                         </a>
//                         <a href="javascript: void(0);" className="btn btn-icon mr-2">
//                           <i className="icmn-twitter" />
//                         </a>
//                       </div>
//                     </div> */}
//                   </Form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

// export default Login

import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Icon } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { userLogin } from '../../../redux/user/actions'
import styles from './style.module.scss'

const mapStateToProps = ({ user, general }) => ({
  isCustomerLoading: general.isCustomerLoading,
  userStore: user,
  isAuthDeprecated: user.isAuthDeprecated,
})

@Form.create()
@connect(mapStateToProps)
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, isAuthDeprecated } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(userLogin({ values, isAuthDeprecated }))
      }
    })
  }

  render() {
    const { form, userStore, isAuthDeprecated } = this.props
    // const registerMsg = "Don't have an account?"
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Please log in</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your e-mail address' }],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Password">
                      {form.getFieldDecorator('password', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your password' }],
                      })(
                        <Input
                          size="default"
                          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          type="password"
                        />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {form.getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(<Checkbox>Remember me</Checkbox>)}
                      <Link
                        to={isAuthDeprecated ? '/user/old-password-reset' : '/user/password-reset'}
                        className="font-weight-bold utils__link--blue utils__link--underlined pull-right"
                      >
                        Forgot password?
                      </Link>
                    </Form.Item>
                    <div className="form-actions">
                      <div className="row">
                        <div className="col-lg-4">
                          <Button
                            type="primary"
                            className="width-150 mr-4"
                            htmlType="submit"
                            loading={userStore.loading}
                          >
                            Login
                          </Button>
                        </div>
                        {/* {!isAuthDeprecated ? (
                          <div className="col-lg-8">
                            <div className={styles.registerLink}>
                              {registerMsg}
                              <Link
                                to="/user/register"
                                className="ml-2 font-weight-bold utils__link--blue utils__link--underlined"
                              >
                                Sign Up
                              </Link>
                            </div>
                          </div>
                        ) : (
                          ''
                        )} */}
                      </div>
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

export default Login
