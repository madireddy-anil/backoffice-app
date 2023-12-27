import React, { Component } from 'react'
import { Card, Button, Select, Form, Input, Icon, Progress, Timeline } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import { addNewUser, updatePassowrdStrength } from 'redux/users/action'
import { getRolesList, getRoleDataById } from 'redux/roles/actions'
import { getAllCountries } from 'redux/general/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, general, roles, users }) => ({
  token: user.token,
  roles: roles.roles,
  selectedRoleData: roles.selectedRoleData,
  addUserLoading: users.addUserLoading,
  //   selectedUserDetails: users.selectedUserDetails,
  countries: general.countries,
  passwordStrength: users.passwordStrength,
  passwordPercentage: users.passwordPercentage,
  progressLogColor: users.progressLogColor,
})

@Form.create()
@connect(mapStateToProps)
class addUser extends Component {
  state = {
    passwordNumber: false,
    passwordProgressLog: false,
    showPermission: false,
    selectedRole: '--',
  }

  componentDidMount = () => {
    const { token, dispatch } = this.props
    dispatch(getRolesList(token))
    dispatch(getAllCountries(token))
  }

  navigateToViewCurrency = () => {
    const { history } = this.props
    history.push('/view-user')
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/users')
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/users')
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(addNewUser(values, token))
      }
    })
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

  setRolePermission = (e, item) => {
    const { dispatch, token } = this.props
    this.setState({ showPermission: true, selectedRole: item.props.label })
    dispatch(getRoleDataById(e, token))
  }

  render() {
    const {
      addUserLoading,
      form,
      countries,
      roles,
      passwordStrength,
      passwordPercentage,
      progressLogColor,
      selectedRoleData,
      // selectedRoleRecord
    } = this.props
    const { passwordProgressLog, unUsed, showPermission, selectedRole } = this.state
    if (unUsed) {
      console.log(unUsed)
    }
    const options = countries.map(option => (
      <Option key={option.id} value={option.name} label={option.name}>
        {option.name}
      </Option>
    ))
    const roleoptions = roles.map(option => (
      <Option key={option.id} value={option.id} label={option.name}>
        {option.name}
      </Option>
    ))
    const getPermissionsList = () => {
      return selectedRoleData.permissions.map(option => {
        return (
          <div className={styles.subText}>
            <strong className="font-size-12 mt-1">{option.name}</strong>
            <br />
          </div>
        )
      })
    }

    const SuccessIcon = (
      <Icon style={{ fontSize: '16px', color: '#4c7a34' }} type="check-circle" theme="filled" />
    )
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Add User</span>
            </div>
          }
          extra={
            <>
              <Button type="link" onClick={this.onBackButtonHandler}>
                Back
              </Button>
            </>
          }
          bordered={false}
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '0',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
        >
          <Helmet title="Add Beneficiary" />
          <div className="row">
            <div className="col-lg-7">
              <div className={styles.timelineCard}>
                <strong className="font-size-15">User Information</strong>
                <div className="pb-3 mt-3">
                  <Form layout="vertical" onSubmit={this.onSubmit}>
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <Form.Item label="First Name" hasFeedback>
                          {form.getFieldDecorator('firstName', {
                            rules: [{ required: true, message: 'Please input First Name' }],
                          })(
                            <Input
                              className={styles.inputbox}
                              style={{ width: '100%' }}
                              size="default"
                            />,
                          )}
                        </Form.Item>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <Form.Item label="Last Name" hasFeedback>
                          {form.getFieldDecorator('lastName', {
                            rules: [{ required: true, message: 'Please input Last Name' }],
                          })(
                            <Input
                              className={styles.inputbox}
                              style={{ width: '100%' }}
                              size="default"
                            />,
                          )}
                        </Form.Item>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <Form.Item label="Email" hasFeedback>
                          {form.getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Please input Email' }],
                          })(
                            <Input
                              className={styles.inputbox}
                              style={{ width: '100%' }}
                              size="default"
                            />,
                          )}
                        </Form.Item>
                      </div>
                      <div className="col-md-6 col-lg-6">
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
                              autoComplete="false"
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
                      </div>

                      <div className="col-md-6 col-lg-6">
                        <Form.Item label="Country" hasFeedback>
                          {form.getFieldDecorator('country', {
                            rules: [{ required: true, message: 'Please input country' }],
                          })(
                            <Select
                              showSearch
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {options}
                            </Select>,
                          )}
                        </Form.Item>
                      </div>
                      <Spacer height="2px" />
                      <strong className="font-size-15 ml-4">Roles</strong>
                      <div className="col-md-6 col-lg-12 pb-3 mt-3">
                        <Form.Item label="Role" hasFeedback>
                          {form.getFieldDecorator('role', {
                            rules: [{ required: true, message: 'Please input role' }],
                          })(
                            <Select
                              showSearch
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              onChange={(e, item) => this.setRolePermission(e, item)}
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {roleoptions}
                            </Select>,
                          )}
                        </Form.Item>
                      </div>
                    </div>
                    <div className={styles.btnStyles}>
                      <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
                        Cancel
                      </Button>
                      <Button className={styles.btnSAVE} loading={addUserLoading} htmlType="submit">
                        Save
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <Card bordered={false}>
                <Timeline>
                  <Timeline.Item dot={SuccessIcon}>
                    <strong className="font-size-15">Role Type</strong>
                    <div className={styles.subText}>
                      <strong className="font-size-12 mt-1">{selectedRole}</strong>
                      <br />
                    </div>
                    <Spacer height="10px" />
                  </Timeline.Item>
                  <Timeline.Item hidden={!showPermission} dot={SuccessIcon}>
                    <strong className="font-size-15">Permissions for {selectedRole}</strong>
                    {showPermission &&
                      Object.entries(selectedRoleData).length > 0 &&
                      selectedRoleData.permissions.length > 0 &&
                      getPermissionsList()}
                    <Spacer height="10px" />
                  </Timeline.Item>
                </Timeline>
              </Card>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default addUser
