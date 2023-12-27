import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Form, Button, Icon, Popconfirm, Table, Tooltip, Spin } from 'antd'
import {
  updateEditProfileMode,
  updateAddEntriesMode,
  updateSelectedEntry,
  updateEditEntriesMode,
  deleteAccountingProfile,
  deleteSelectedProfileEntry,
} from 'redux/accountingProfile/actions'
import Spacer from 'components/CleanUIComponents/Spacer'
import lodash from 'lodash'
import AddAccountingProfile from './addAccountingProfile'
import AddProfileEntry from './accountingEntries/addEntries'
// import { capitalize } from '../../../../utilities/transformer'
import styles from './style.module.scss'

const TRUE_VALUE = true

const mapStateToProps = ({ user, accountingProfile }) => ({
  token: user.token,
  selectedAccountingProfile: accountingProfile.selectedAccountingProfile,
  viewAccountProfileMode: accountingProfile.viewAccountProfileMode,
  editProfileMode: accountingProfile.editProfileMode,
  isNewAccoutingProfile: accountingProfile.isNewAccoutingProfile,

  addEntriesMode: accountingProfile.addEntriesMode,
  editEntriesMode: accountingProfile.editEntriesMode,
  loading: accountingProfile.loading,
  addEntryLoading: accountingProfile.addEntryLoading,
})

@Form.create()
@connect(mapStateToProps)
class editAccountingProfile extends Component {
  state = {
    noData: '--',
    settlementChannel: undefined,
    pagination: {
      pageSize: 50,
    },
  }

  componentDidMount() {
    this.updateSelectedChannelToState()
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isSettlementChannel) {
      this.updateSelectedChannelToState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { selectedAccountingProfile } = this.props
    const isPropsUpdated = {
      isSettlementChannel: prevProps.selectedAccountingProfile !== selectedAccountingProfile,
    }
    return isPropsUpdated
  }

  updateSelectedChannelToState = () => {
    const { selectedAccountingProfile } = this.props
    this.setState({ settlementChannel: selectedAccountingProfile.settlementChannel })
  }

  handleEditProfile = () => {
    const { dispatch } = this.props
    dispatch(updateEditProfileMode(TRUE_VALUE))
  }

  handleAddEntries = () => {
    const { dispatch } = this.props
    dispatch(updateAddEntriesMode(TRUE_VALUE))
  }

  handleEditProfileEntry = record => {
    const { dispatch } = this.props
    dispatch(updateSelectedEntry(record))
    dispatch(updateEditEntriesMode(TRUE_VALUE))
  }

  handleEntryDelete = record => {
    const { dispatch, token, selectedAccountingProfile } = this.props
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    dispatch(deleteSelectedProfileEntry(record._id, selectedAccountingProfile.id, token))
  }

  handleDeletedAccountingProfile = () => {
    const { selectedAccountingProfile, token, dispatch } = this.props
    dispatch(deleteAccountingProfile(selectedAccountingProfile.id, token))
  }

  handleBack = () => {
    const { history } = this.props
    history.push('/accounting-profile-list')
  }

  render() {
    const {
      selectedAccountingProfile,
      viewAccountProfileMode,
      editProfileMode,
      addEntriesMode,
      editEntriesMode,
      loading,
      addEntryLoading,
    } = this.props
    const { noData, settlementChannel, pagination } = this.state
    const popConfirmEntrytext = 'Are you sure you want to delete this entry ?'
    const columns = [
      {
        title: 'Account Number',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Balance Id',
        dataIndex: 'balanceId',
        key: 'balanceId',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Debit / Credit',
        dataIndex: 'debitCredit',
        key: 'debitCredit',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'entryActive',
        key: 'entryActive',
        align: 'center',
        render: record => {
          if (record) {
            return (
              <Button
                type="link"
                icon="check-circle"
                size="small"
                style={{ color: '#3CB371', fontWeight: '600' }}
              >
                Active
              </Button>
            )
          }
          return (
            <Button
              type="link"
              size="small"
              icon="close-circle"
              style={{ color: '#ff6e6e', fontWeight: '600' }}
            >
              Inactive
            </Button>
          )
        },
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        fixed: 'right',
        render: record => (
          <>
            <Tooltip title="Edit">
              <Button
                onClick={() => this.handleEditProfileEntry(record)}
                type="link"
                disabled={!record.entryActive || !selectedAccountingProfile.profileActive}
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmEntrytext}
              onConfirm={() => this.handleEntryDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                disabled={!record.entryActive || !selectedAccountingProfile.profileActive}
              >
                <Icon
                  type="delete"
                  size="large"
                  className={
                    record.entryActive || !selectedAccountingProfile.profileActive
                      ? styles.deleteIcon
                      : ''
                  }
                />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]
    const popConfirmtext = 'Are you sure to delete this accounting profile?'
    return (
      <Spin spinning={loading}>
        <React.Fragment>
          {viewAccountProfileMode ? (
            <Card
              title={
                <div>
                  <span className="font-size-16">Edit Accounting Profile</span>
                </div>
              }
              bordered
              headStyle={{
                //   border: '1px solid #a8c6fa',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
              bodyStyle={{
                padding: '30px',
                //   border: '1px solid #a8c6fa',
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
              className={styles.mainCard}
              extra={
                <Button type="primary" onClick={this.handleBack}>
                  Back
                </Button>
              }
            >
              <div className="row">
                <React.Fragment>
                  {selectedAccountingProfile.profileActive ? (
                    <div className={`col-md-6 col-lg-12 ${styles.actionBtns}`}>
                      <Button
                        type="link"
                        onClick={this.handleEditProfile}
                        disabled={!selectedAccountingProfile.profileActive}
                      >
                        <Icon type="edit" size="large" className={styles.editIcon} />
                      </Button>
                      <Popconfirm
                        placement="topLeft"
                        title={popConfirmtext}
                        onConfirm={this.handleDeletedAccountingProfile}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="link">
                          <Icon type="delete" size="large" className={styles.deleteIcon} />
                        </Button>
                      </Popconfirm>
                    </div>
                  ) : (
                    ''
                  )}

                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Process Flow</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {selectedAccountingProfile.processFlow
                          ? lodash.startCase(selectedAccountingProfile.processFlow)
                          : noData}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Settlement Channel</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {selectedAccountingProfile.settlementChannel
                          ? lodash.startCase(selectedAccountingProfile.settlementChannel)
                          : noData}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Creditor Account Type</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {selectedAccountingProfile.creditorAccountType
                          ? lodash.startCase(selectedAccountingProfile.creditorAccountType)
                          : noData}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Debitor Account Type</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {selectedAccountingProfile.debtorAccountType
                          ? lodash.startCase(selectedAccountingProfile.debtorAccountType)
                          : noData}
                      </span>
                    </div>
                  </div>
                  {settlementChannel === 'ABN_AMRO' ? (
                    <div className="col-md-6 col-lg-3">
                      <strong className="font-size-15">Is Lifting Amount ?</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {selectedAccountingProfile.isLiftingFee ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Status</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {selectedAccountingProfile.profileActive ? (
                          <p style={{ color: 'green' }}>Active</p>
                        ) : (
                          <p style={{ color: 'red' }}>Inactive</p>
                        )}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              </div>
            </Card>
          ) : (
            ''
          )}
          {editProfileMode ? <AddAccountingProfile /> : ''}
          <Spacer height="13px" />
          <Card
            title={
              <Button type="primary" onClick={this.handleAddEntries}>
                Add entries
              </Button>
            }
            bordered
            headStyle={{
              //   border: '1px solid #a8c6fa',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
            bodyStyle={{
              padding: '30px',
              //   border: '1px solid #a8c6fa',
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
            className={styles.mainCard}
          >
            {addEntriesMode || editEntriesMode ? <AddProfileEntry /> : ''}
            <Spacer height="15px" />
            <Table
              columns={columns}
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              rowKey={record => record._id}
              loading={addEntryLoading}
              dataSource={selectedAccountingProfile.entries}
              scroll={{ x: 'max-content' }}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </Card>
        </React.Fragment>
      </Spin>
    )
  }
}

export default editAccountingProfile
