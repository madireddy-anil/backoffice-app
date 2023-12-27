import React, { Component } from 'react'
import { Card, Button, Select, Form, Input, Tooltip, Timeline, Icon } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import { editUser } from 'redux/users/action'
import { getRolesList, getRoleDataById } from 'redux/roles/actions'
import { getAllCountries } from 'redux/general/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, users, general, roles }) => ({
  token: user.token,
  selectedUserDetails: users.selectedUserDetails,
  roles: roles.roles,
  countries: general.countries,
  editUserLoading: users.editUserLoading,
  selectedRoleData: roles.selectedRoleData,
})

@Form.create()
@connect(mapStateToProps)
class EditUser extends Component {
  state = { selectedRole: '--', isRoleSelected: false }

  componentDidMount = () => {
    const { token, dispatch, selectedUserDetails } = this.props
    const roleId = selectedUserDetails.role && selectedUserDetails.role.id
    dispatch(getRolesList(token))
    dispatch(getRoleDataById(roleId, token))
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
    const { form, dispatch, token, selectedUserDetails } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(editUser(selectedUserDetails.id, values, token))
      }
    })
  }

  setRolePermission = (e, item) => {
    const { dispatch, token } = this.props
    this.setState({ isRoleSelected: true, selectedRole: item.props.label })
    dispatch(getRoleDataById(e, token))
  }

  render() {
    const {
      editUserLoading,
      form,
      selectedUserDetails,
      countries,
      roles,
      selectedRoleData,
    } = this.props
    const { selectedRole, isRoleSelected } = this.state
    const options = countries.map(option => (
      <Option key={option.id} value={option.alpha2Code} label={option.name}>
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
          <div key={option.id} className={styles.subText}>
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
              <span className="font-size-16">Edit User</span>
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
                            initialValue: selectedUserDetails.firstName,
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
                            initialValue: selectedUserDetails.lastName,
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
                        <Tooltip title="Restricted to edit">
                          <Form.Item label="Email" hasFeedback>
                            {form.getFieldDecorator('email', {
                              initialValue: selectedUserDetails.email,
                              rules: [{ required: true, message: 'Please input Email' }],
                            })(
                              <Input
                                className={styles.inputbox}
                                style={{ width: '100%' }}
                                size="default"
                              />,
                            )}
                          </Form.Item>
                        </Tooltip>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <Form.Item label="Country" hasFeedback>
                          {form.getFieldDecorator('country', {
                            initialValue:
                              selectedUserDetails.address !== undefined &&
                              selectedUserDetails.address.countryOfResidence,
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
                            initialValue:
                              selectedUserDetails.role !== undefined
                                ? selectedUserDetails.role.id
                                : '',
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
                      <Button
                        className={styles.btnSAVE}
                        loading={editUserLoading}
                        htmlType="submit"
                      >
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
                      <strong className="font-size-12 mt-1">
                        {isRoleSelected
                          ? selectedRole
                          : selectedUserDetails.role !== undefined && selectedUserDetails.role.name}
                      </strong>
                      <br />
                    </div>
                    <Spacer height="10px" />
                  </Timeline.Item>
                  <Timeline.Item
                    hidden={
                      isRoleSelected
                        ? !selectedRole
                        : selectedUserDetails.role !== undefined && !selectedUserDetails.role.name
                    }
                    dot={SuccessIcon}
                  >
                    <strong className="font-size-15">
                      Permissions for{' '}
                      {isRoleSelected
                        ? selectedRole
                        : selectedUserDetails.role !== undefined && selectedUserDetails.role.name}
                    </strong>
                    {Object.entries(selectedRoleData).length > 0 &&
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

export default EditUser
