import React from 'react'
import { Button, Form, Input, Descriptions } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  addPermission,
  addClosePermissionModal,
  getPermissionsList,
} from 'redux/permissions/actions'
import InfoCard from 'components/customComponents/InfoCard'

import styles from './style.module.scss'

const mapStateToProps = ({ user, permissions }) => ({
  token: user.token,
  role: user.role,
  loading: permissions.loading,
  isPermissionAdded: permissions.isPermissionAdded,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class AddPermission extends React.Component {
  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isNewPermissionAdded) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isPermissionAdded } = this.props
    const isPropsUpdated = {
      isNewPermissionAdded: prevProps.isPermissionAdded !== isPermissionAdded,
    }
    return isPropsUpdated
  }

  updateState = () => {
    const { dispatch, token } = this.props
    dispatch(addClosePermissionModal(false))
    dispatch(getPermissionsList(token))
  }

  handleCancel = () => {
    const { dispatch } = this.props
    dispatch(addClosePermissionModal(false))
  }

  onSubmit = event => {
    event.preventDefault()
    const { dispatch, form, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(addPermission(values, token))
      }
    })
  }

  render() {
    const { loading, form } = this.props
    const getErrorMsg = () => {
      return (
        <div>
          <p>Invalid format!</p>
          <Descriptions className={styles.textDesc}>
            <Descriptions.Item label="Sample formats">
              all:dashboard, edit:dashboard, delete:dashboard, read:dashboard
            </Descriptions.Item>
          </Descriptions>
        </div>
      )
    }
    return (
      <div>
        <div className={styles.modalHeader}>
          <InfoCard
            minHeight="70px"
            imgHeight="100px"
            imgTop="35%"
            header="Add New Permission"
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
                  rules: [
                    {
                      required: true,
                      message: 'Please input name',
                    },
                    {
                      pattern: new RegExp('([a-zA-Z]:[a-zA-Z])'),
                      message: getErrorMsg(),
                    },
                  ],
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
          </div>
          <div className={styles.formActions}>
            <div className="form-actions">
              <Button className={styles.btnAddPermission} htmlType="submit" loading={loading}>
                ADD PERMISSION
              </Button>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

export default AddPermission
