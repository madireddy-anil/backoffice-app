import React, { Component } from 'react'
import { Card, Table, Tooltip, Button, Form, Icon, Popconfirm } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import lodash from 'lodash'
import {
  updateVendorFeeEditMode,
  updateVendorFeeAddMode,
  updateVendorLocalAccountAddMode,
  updateSelectedRecordToEdit,
  deleteFeeRecord,
  updateVendorLocalAccountsEditMode,
} from 'redux/vendorConfiguration/action'
import { formatToZoneDate } from '../../../../../utilities/transformer'
import AddNewFeeDetails from './components/addFeeDetails'
import AddVendorLocalAccounts from './components/addLocalAccountData'
import styles from './style.module.scss'

const mapStateToProps = ({ user, vendorConfiguration, settings }) => ({
  token: user.token,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  showVendorFeeAddMode: vendorConfiguration.showVendorFeeAddMode,
  showVendorFeeEditMode: vendorConfiguration.showVendorFeeEditMode,

  showVendorLocalAccountAddMode: vendorConfiguration.showVendorLocalAccountAddMode,
  showEditLocalAccountsData: vendorConfiguration.showEditLocalAccountsData,

  timeZone: settings.timeZone.value,
  localAccountsLoading: vendorConfiguration.localAccountsLoading,
})

@Form.create()
@connect(mapStateToProps)
class localAcountsList extends Component {
  state = {
    pagination: {
      pageSize: 50,
    },
    localAccountsObject: {
      supportedCurrencies: [],
      fees: [],
    },
  }

  componentDidMount() {
    this.addLocalToState()
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isLocalAccountsFetched) {
      this.addLocalToState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { selectedVendorConfig } = this.props
    const isPropsUpdated = {
      isLocalAccountsFetched: prevProps.selectedVendorConfig !== selectedVendorConfig,
    }
    return isPropsUpdated
  }

  handleEditVendorLocalAccountData = () => {
    const { dispatch } = this.props
    dispatch(updateVendorLocalAccountsEditMode(true))
  }

  addLocalToState = () => {
    const { selectedVendorConfig } = this.props
    const { localAccounts } = selectedVendorConfig.serviceOffered
    if (localAccounts) {
      this.setState({
        localAccountsObject: {
          supportedCurrencies: localAccounts.supportedCurrencies,
          fees: localAccounts.fees,
        },
      })
    }
  }

  handleAddFeePair = () => {
    const { dispatch } = this.props

    dispatch(updateVendorFeeAddMode(true))
  }

  handleAddLocalAccountData = () => {
    const { dispatch } = this.props
    dispatch(updateVendorLocalAccountAddMode(true))
  }

  navigateToEditFee = record => {
    const { dispatch } = this.props
    dispatch(updateSelectedRecordToEdit(record))
    dispatch(updateVendorFeeEditMode(true))
  }

  handleDeletedFee = record => {
    const { dispatch, token, selectedVendorConfig } = this.props
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    dispatch(deleteFeeRecord(selectedVendorConfig.id, record._id, token))
  }

  render() {
    const {
      selectedVendorConfig,
      showVendorFeeAddMode,
      showVendorFeeEditMode,
      showVendorLocalAccountAddMode,
      timeZone,
      localAccountsLoading,
      showEditLocalAccountsData,
    } = this.props
    // const { localAccounts } = selectedVendorConfig.serviceOffered
    const { pagination, localAccountsObject } = this.state
    const popConfirmtext = 'Are you sure to delete this record?'
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Fee Currency',
        dataIndex: 'feeCurrency',
        key: 'feeCurrency',
        align: 'center',
      },
      {
        title: 'Fee Description',
        dataIndex: 'feeDescription',
        key: 'feeDescription',
        align: 'center',
      },
      {
        title: 'Fee Type',
        dataIndex: 'feeType',
        key: 'feeType',
        align: 'center',
        render: text => (text ? lodash.startCase(text) : ''),
      },
      {
        title: 'Fee Amount',
        dataIndex: 'feeAmount',
        key: 'feeAmount',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'isDeleted',
        key: 'isDeleted',
        align: 'center',
        // fixed: 'right',
        render: record => {
          if (!record) {
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
        // fixed: 'right',
        render: record => (
          <>
            <Tooltip title="view">
              <Button
                onClick={() => this.navigateToEditFee(record)}
                type="link"
                disabled={!selectedVendorConfig.status || record.isDeleted}
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedFee(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                className={styles.deleteIcon}
                disabled={!selectedVendorConfig.status || record.isDeleted}
              >
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        {showVendorLocalAccountAddMode || showEditLocalAccountsData ? (
          <AddVendorLocalAccounts record={showEditLocalAccountsData ? localAccountsObject : ''} />
        ) : (
          ''
        )}
        {showVendorFeeAddMode || showVendorFeeEditMode ? <AddNewFeeDetails /> : ''}
        <Spacer height="15px" />
        {localAccountsObject.supportedCurrencies &&
        localAccountsObject.supportedCurrencies.length > 0 ? (
          <Card
            bordered
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
            className={styles.mainCard}
            extra={
              <div>
                <Tooltip title="Add Local Account Details">
                  <Button
                    type="primary"
                    className="mr-3"
                    onClick={this.handleAddFeePair}
                    disabled={showVendorFeeEditMode}
                  >
                    {`Add Local Account Fee Details`}
                  </Button>
                </Tooltip>
              </div>
            }
          >
            <Helmet title="Currency" />
            <div className={styles.data}>
              {/* {this.getSearchUI()} */}
              {localAccountsObject.supportedCurrencies &&
              localAccountsObject.supportedCurrencies.length > 0 ? (
                <div className="row">
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-13 font-weight-500">Currencies Supported</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {localAccountsObject.supportedCurrencies.join(',')}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Time Zone</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {selectedVendorConfig.timeZone ? selectedVendorConfig.timeZone.label : '--'}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-3 col-lg-3">
                    {/* <div className={`${styles.actionBtns}`}> */}
                    <Button type="link" onClick={this.handleEditVendorLocalAccountData}>
                      <Icon type="edit" size="large" className={styles.editIcon} />
                    </Button>
                    {/* </div> */}
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className="row">
                <div className="col-xl-12">
                  <Table
                    columns={columns}
                    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
                    rowKey={record => record._id}
                    loading={localAccountsLoading}
                    dataSource={localAccountsObject.fees}
                    scroll={{ x: 'max-content' }}
                    pagination={pagination}
                    onChange={this.handleTableChange}
                    bordered
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className={styles.addButtonBlock}>
            <Button type="dashed" onClick={this.handleAddLocalAccountData} style={{ width: '60%' }}>
              <Icon type="plus" /> Add Local Account data
            </Button>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default localAcountsList
