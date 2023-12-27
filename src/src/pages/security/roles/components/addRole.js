import React from 'react'
import { Button, Form, Input, Select } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getRolesList, addCloseRoleModal, addRole } from 'redux/roles/actions'
import InfoCard from 'components/customComponents/InfoCard'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, permissions, roles }) => ({
  token: user.token,
  role: user.role,
  loading: roles.loading,
  permissionsList: permissions.permissionsList,
  isRoleCreated: roles.isRoleCreated,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class AddRole extends React.Component {
  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isNewRoleAdded) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isRoleCreated } = this.props
    const isPropsUpdated = {
      isNewRoleAdded: prevProps.isRoleCreated !== isRoleCreated,
    }
    return isPropsUpdated
  }

  updateState = () => {
    const { dispatch, token } = this.props
    dispatch(addCloseRoleModal(false))
    dispatch(getRolesList(token))
  }

  handleCancel = () => {
    const { dispatch } = this.props
    dispatch(addCloseRoleModal(false))
  }

  onSubmit = event => {
    event.preventDefault()
    const { dispatch, form, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(addRole(values, token))
      }
    })
  }

  render() {
    const { loading, form, permissionsList } = this.props
    const options = permissionsList.map(option => (
      <Option key={option.id} value={option.id} label={option.name}>
        <h5>{option.name}</h5>
        <small>{option.description}</small>
      </Option>
    ))
    return (
      <div>
        <div className={styles.modalHeader}>
          <InfoCard
            minHeight="70px"
            imgHeight="100px"
            imgTop="35%"
            header="Add New Role"
            closeButton={this.handleCancel}
          />
        </div>
        <Form
          hideRequiredMark={false}
          layout="vertical"
          className={styles.formBlock}
          onSubmit={this.onSubmit}
        >
          <div className="row">
            <div className="col-md-6 col-lg-6">
              <Form.Item label="Name" hasFeedback>
                {form.getFieldDecorator('name', {
                  initialValue: '',
                  rules: [{ required: true, message: 'Please input name' }],
                })(<Input className={styles.inputbox} style={{ width: '100%' }} size="default" />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-6">
              <Form.Item label="Description" hasFeedback>
                {form.getFieldDecorator('description', {
                  initialValue: '',
                  rules: [{ required: true, message: 'Please input description' }],
                })(<Input className={styles.inputbox} style={{ width: '100%' }} size="default" />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-6">
              <Form.Item label="Add Permissions" hasFeedback>
                {form.getFieldDecorator('permissions', {
                  // initialValue: '',
                  rules: [{ required: true, message: 'Please input permissions' }],
                })(
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    mode="multiple"
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
          </div>
          <div className={styles.formActions}>
            <div className="form-actions">
              <Button block className={styles.btnAddPermission} htmlType="submit" loading={loading}>
                ADD ROLE
              </Button>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

export default AddRole
