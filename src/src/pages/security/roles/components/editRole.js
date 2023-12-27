import React from 'react'
import { Button, Form, Input, Select, Tooltip } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { editCloseRoleModal, getRolesList, editRole } from 'redux/roles/actions'
import InfoCard from 'components/customComponents/InfoCard'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, permissions, roles }) => ({
  token: user.token,
  role: user.role,
  loading: roles.loading,
  permissionsList: permissions.permissionsList,
  selectedRoleRecord: roles.selectedRoleRecord,
  isRoleUpdated: roles.isRoleUpdated,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class EditRole extends React.Component {
  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isRoleUpdated) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isRoleUpdated } = this.props
    const isPropsUpdated = {
      isRoleUpdated: prevProps.isRoleUpdated !== isRoleUpdated,
    }
    return isPropsUpdated
  }

  updateState = () => {
    const { dispatch, token } = this.props
    dispatch(editCloseRoleModal(false))
    dispatch(getRolesList(token))
  }

  handleCancel = () => {
    const { dispatch } = this.props
    dispatch(editCloseRoleModal(false))
  }

  getSelectedPermissions = permissions => {
    const noData = []
    if (permissions.length > 0) {
      const returnResp = permissions.map(item => {
        return item.id
      })
      return returnResp
    }
    return noData
  }

  onSubmit = event => {
    event.preventDefault()
    const { selectedRoleRecord, dispatch, form, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(editRole(selectedRoleRecord.id, values, token))
      }
    })
  }

  render() {
    const { loading, form, permissionsList, selectedRoleRecord } = this.props
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
            header="Edit Role"
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
                  initialValue: selectedRoleRecord.name,
                  rules: [{ required: true, message: 'Please input name' }],
                })(<Input className={styles.inputbox} style={{ width: '100%' }} size="default" />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-6">
              <Tooltip title={selectedRoleRecord.description}>
                <Form.Item label="Description" hasFeedback>
                  {form.getFieldDecorator('description', {
                    initialValue: selectedRoleRecord.description,
                    rules: [{ required: true, message: 'Please input description' }],
                  })(
                    <Input className={styles.inputbox} style={{ width: '100%' }} size="default" />,
                  )}
                </Form.Item>
              </Tooltip>
            </div>
            <div className="col-md-6 col-lg-6">
              <Form.Item label="Permissions" hasFeedback>
                {form.getFieldDecorator('permissions', {
                  initialValue: this.getSelectedPermissions(selectedRoleRecord.permissions),
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
                SAVE
              </Button>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

export default EditRole
