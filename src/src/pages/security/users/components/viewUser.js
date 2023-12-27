import React, { Component } from 'react'
import { Card, Button, Timeline, Form, Icon } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { getRoleDataById } from '../../../../redux/roles/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, users, roles }) => ({
  token: user.token,
  selectedUserDetails: users.selectedUserDetails,
  selectedRoleData: roles.selectedRoleData,
})

@Form.create()
@connect(mapStateToProps)
class ViewCurrency extends Component {
  state = {
    noData: '--',
  }

  componentDidMount = () => {
    const { token, dispatch, selectedUserDetails } = this.props
    dispatch(getRoleDataById(selectedUserDetails.role.id, token))
  }

  navigateToUserCurrency = () => {
    const { history } = this.props
    history.push('/edit-user')
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/users')
  }

  render() {
    const { selectedUserDetails, selectedRoleData } = this.props
    const { noData } = this.state
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
              <span className="font-size-16">User Details</span>
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
                <div className="pb-3 mt-3">
                  <div className="row">
                    <div className="col-md-6 col-lg-6">
                      <strong className="font-size-15">First Name</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {selectedUserDetails.firstName ? selectedUserDetails.firstName : noData}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <strong className="font-size-15">Last Name</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {selectedUserDetails.lastName ? selectedUserDetails.lastName : noData}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <strong className="font-size-15">Email</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {selectedUserDetails.email ? selectedUserDetails.email : noData}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <strong className="font-size-15">Country</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {selectedUserDetails.address !== undefined
                            ? selectedUserDetails.address.countryOfResidence
                            : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <Card bordered={false}>
                <Timeline className="mt-3">
                  <Timeline.Item dot={SuccessIcon}>
                    <strong className="font-size-15">Role Type</strong>
                    <div className={styles.subText}>
                      <strong className="font-size-12 mt-1">
                        {' '}
                        {selectedUserDetails.role !== undefined
                          ? selectedUserDetails.role.name
                          : '--'}
                      </strong>
                      <br />
                    </div>
                    <Spacer height="10px" />
                  </Timeline.Item>
                  <Timeline.Item hidden={!selectedUserDetails.role} dot={SuccessIcon}>
                    <strong className="font-size-15">
                      Permissions for{' '}
                      {selectedUserDetails.role !== undefined
                        ? selectedUserDetails.role.name
                        : '--'}
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

export default ViewCurrency
