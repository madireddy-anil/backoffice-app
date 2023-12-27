import React from 'react'
import { Button, Form, Input, Tooltip, Descriptions } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  getPermissionsList,
  editClosePermissionModal,
  editPermission,
} from 'redux/permissions/actions'
import InfoCard from 'components/customComponents/InfoCard'

import styles from './style.module.scss'

const mapStateToProps = ({ user, permissions }) => ({
  token: user.token,
  loading: permissions.loading,
  selectedRecord: permissions.selectedRecord,
  isPermissionupdated: permissions.isPermissionupdated,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class EditPermission extends React.Component {
  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isPermissionUpdated) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isPermissionupdated } = this.props
    const isPropsUpdated = {
      isPermissionUpdated: prevProps.isPermissionupdated !== isPermissionupdated,
    }
    return isPropsUpdated
  }

  updateState = () => {
    const { dispatch, token } = this.props
    dispatch(editClosePermissionModal(false))
    dispatch(getPermissionsList(token))
  }

  handleCancel = () => {
    const { dispatch } = this.props
    dispatch(editClosePermissionModal(false))
  }

  onSubmit = event => {
    event.preventDefault()
    const { selectedRecord, dispatch, form, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(editPermission(selectedRecord.id, values, token))
      }
    })
  }

  render() {
    const { loading, form, selectedRecord } = this.props
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
            header="Edit Permission"
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
                  initialValue: selectedRecord.name,
                  rules: [
                    {
                      required: true,
                      message: 'Please input name',
                    },
                    {
                      pattern: new RegExp('([a-zA-Z]:[a-zA-Z]+)'),
                      message: getErrorMsg(),
                    },
                  ],
                })(<Input className={styles.inputbox} style={{ width: '100%' }} size="default" />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-6">
              <Tooltip title={selectedRecord.description}>
                <Form.Item label="Description" hasFeedback>
                  {form.getFieldDecorator('description', {
                    initialValue: selectedRecord.description,
                    rules: [{ required: true, message: 'Please input description' }],
                  })(
                    <Input className={styles.inputbox} style={{ width: '100%' }} size="default" />,
                  )}
                </Form.Item>
              </Tooltip>
            </div>
          </div>
          <div className={styles.formActions}>
            <div className="form-actions">
              <Button className={styles.btnAddPermission} htmlType="submit" loading={loading}>
                SAVE
              </Button>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

export default EditPermission
