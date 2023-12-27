import React from 'react'
import { Row, Col, Form, Input, Tooltip, Card } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { viewCloseRoleModal } from 'redux/roles/actions'
import InfoCard from 'components/customComponents/InfoCard'

import styles from './style.module.scss'

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
class ViewRole extends React.Component {
  handleCancel = () => {
    const { dispatch } = this.props
    dispatch(viewCloseRoleModal(false))
  }

  render() {
    const { form, selectedRoleRecord } = this.props
    const getPermissionsList = () => {
      return selectedRoleRecord.permissions.map(option => {
        return (
          <Col key={option.id} span={6}>
            <div className={styles.badge}>
              <Card
                color="#8D8D8D"
                bodyStyle={{ padding: '0px', textAlign: 'center' }}
                style={{
                  padding: '4px',
                  backgroundColor: '#8D8D8D',
                  color: '#fff',
                  borderRadius: '7px',
                }}
              >
                {option.name}
              </Card>
            </div>
          </Col>
        )
      })
    }
    return (
      <div>
        <div className={styles.modalHeader}>
          <InfoCard
            minHeight="70px"
            imgHeight="100px"
            imgTop="35%"
            header="Role"
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
                })(
                  <Input
                    className={styles.inputbox}
                    style={{ width: '100%', pointerEvents: 'none' }}
                    size="default"
                  />,
                )}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-6">
              <Tooltip title={selectedRoleRecord.description}>
                <Form.Item label="Description" hasFeedback>
                  {form.getFieldDecorator('description', {
                    initialValue: selectedRoleRecord.description,
                    rules: [{ required: true, message: 'Please input description' }],
                  })(
                    <Input
                      className={styles.inputbox}
                      style={{ width: '100%', pointerEvents: 'none' }}
                      size="default"
                    />,
                  )}
                </Form.Item>
              </Tooltip>
            </div>
            <div className="col-md-12 col-lg-12">
              <Form.Item label="Permissions" hasFeedback>
                {form.getFieldDecorator('permissions', {
                  rules: [{ required: true, message: 'Please input permissions' }],
                })(
                  <div className={`${styles.listCard}`}>
                    <Row>
                      {Object.entries(selectedRoleRecord).length > 0 &&
                      selectedRoleRecord.permissions.length > 0 ? (
                        getPermissionsList()
                      ) : (
                        <div className="text-center">
                          <Col>No Data</Col>
                        </div>
                      )}
                    </Row>
                  </div>,
                )}
              </Form.Item>
            </div>
          </div>
          {/* <div className={styles.formActions}>
            <div className="form-actions">
              <Button block className={styles.btnAddPermission} htmlType="submit" loading={loading}>
                EDIT ROLE
              </Button>
            </div>
          </div> */}
        </Form>
      </div>
    )
  }
}

export default ViewRole
