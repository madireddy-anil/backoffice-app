import React, { Component } from 'react'
import { Card, Table, Tooltip, Button, Form, Row, Col, Pagination } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  getAllVendorConfigurations,
  getVendorConfigurationByFilters,
  getVendorConfigurationById,
} from 'redux/vendorConfiguration/action'
import lodash from 'lodash'
import { formatToZoneDate, formateArrayData } from '../../../utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ user, vendorConfiguration, settings, general }) => ({
  token: user.token,
  users: general.users,
  allVendorConfiguration: vendorConfiguration.allVendorConfiguration,
  timeZone: settings.timeZone.value,
  loading: vendorConfiguration.loading,
  totalPages: vendorConfiguration.totalPages,
})

// const TRUE_VALUE = true
// const FALSE_VALUE = false

@Form.create()
@connect(mapStateToProps)
class AllVendorConfigurations extends Component {
  state = {
    fromNumber: 1,
    toNumber: 50,
    // pageSize: 10,
    activePage: 1,
    limit: 50,
    defaultCurrent: 1,
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    const { limit, activePage } = this.state
    const value = {
      limit,
      activePage,
    }
    dispatch(getAllVendorConfigurations(value, token))
  }

  //   navigateToEditPricingProfile = record => {
  //     const { dispatch, history, token } = this.props
  //     // dispatch(getPricingProfileById(record.id, token))
  //     dispatch(updateIsNewPricingProfile(FALSE_VALUE))
  //     history.push('/edit-pricing-profile')
  //   }

  navigateToViewVendorConfig = record => {
    const { dispatch, history, token } = this.props
    history.push('/edit-vendor-configuration')
    dispatch(getVendorConfigurationById(record.id, token))
  }

  handleAddVendorConfiguration = () => {
    const { history } = this.props
    // dispatch(updateIsNewPricingProfile(TRUE_VALUE))
    history.push('/new-vendor-configuration')
  }

  handleTableChange = currentPage => {
    const { dispatch, token } = this.props
    const { limit } = this.state
    this.setState({
      activePage: currentPage,
    })
    const value = {
      limit,
      activePage: currentPage,
    }
    dispatch(getVendorConfigurationByFilters(value, token))
    this.arrayPaginationCount(limit, currentPage)
  }

  arrayPaginationCount = (limit, activePage) => {
    const skip = (activePage - 1) * limit
    const fromNumb = skip + 1
    const toNumb = skip + limit
    this.setState({
      fromNumber: fromNumb,
      toNumber: toNumb,
    })
  }

  handlePageSizeChange = (current, pageSize) => {
    Promise.resolve(
      this.setState({
        limit: pageSize,
        activePage: 1,
        fromNumber: current,
        toNumber: pageSize,
      }),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  fetchTransactions = () => {
    const { dispatch, token } = this.props
    const { limit, activePage } = this.state
    const value = {
      limit,
      activePage,
    }
    dispatch(getVendorConfigurationByFilters(value, token))
  }

  getUserName = userId => {
    const { users } = this.props
    const userData = users !== undefined && users?.filter(user => user?.id === userId)
    return userData !== undefined && userData?.length > 0
      ? `${userData[0]?.firstName} ${` `} ${userData[0]?.lastName}`
      : ''
  }

  render() {
    const { loading, allVendorConfiguration, timeZone, totalPages } = this.props
    const { fromNumber, toNumber, defaultCurrent } = this.state
    // const popConfirmtext = 'Are you sure to delete this record?'
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Vendor Trading Name',
        dataIndex: 'genericInformation.tradingName',
        key: 'tradingName',
        align: 'center',
      },
      {
        title: 'Vendor Legal Name',
        dataIndex: 'genericInformation.registeredCompanyName',
        key: 'registeredCompanyName',
        align: 'center',
      },
      // {
      //   title: 'Services Offered',
      //   dataIndex: 'profile.servicesOffering',
      //   key: 'profile.servicesOffering',
      //   align: 'center',
      //   render: record => (
      //     <>
      //       {record.length !== undefined &&
      //         record.length > 0 &&
      //         record.map(tag => {
      //           const color = 'green'
      //           return (
      //             <Tag color={color} key={tag}>
      //               {tag.toUpperCase()}
      //             </Tag>
      //           )
      //         })}
      //     </>
      //   ),
      // },

      {
        title: 'Compliance Information',
        dataIndex: 'complianceInformation',
        key: 'complianceInformation',
        align: 'center',
        children: [
          {
            title: 'KYC Status',
            dataIndex: 'complianceInformation.kycStatus',
            key: 'kysStatus',
            align: 'center',
            render: text => (text ? lodash.startCase(text) : ''),
          },
          {
            title: 'Disallowed Industries',
            dataIndex: 'complianceInformation.disallowedIndustries',
            key: 'disallowedIndustries',
            align: 'center',
            render: text => formateArrayData(text) || '',
          },
        ],
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        align: 'center',
        render: text => (text ? this.getUserName(text) : ''),
      },
      {
        title: 'Updated By',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        align: 'center',
        render: text => (text ? this.getUserName(text) : ''),
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
              <Button onClick={() => this.navigateToViewVendorConfig(record)} type="link">
                View Details
              </Button>
            </Tooltip>
            {/* <Tooltip title="View">
              <Button onClick={() => this.navigateToViewPricingProfile(record)} type="link">
                <Icon type="eye" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedPricingProfile(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" style={{ color: 'red' }}>
                <Icon type="delete" />
              </Button>
            </Popconfirm> */}
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Vendor Configurations</span>
            </div>
          }
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
              {/* <Tooltip title="Serach">
                <Icon
                  type="search"
                  className="mr-3"
                  onClick={() =>
                    this.setState(prevState => ({
                      visibleSearch: !prevState.visibleSearch,
                    }))
                  }
                />
              </Tooltip> */}
              <Tooltip title="Add New Vendor Configuration">
                <Button type="primary" className="mr-3" onClick={this.handleAddVendorConfiguration}>
                  Add New Vendor Configuration
                </Button>
              </Tooltip>
            </div>
          }
        >
          <Helmet title="Currency" />
          <div className={styles.data}>
            {/* {this.getSearchUI()} */}
            <div className="row">
              <div className="col-xl-12">
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  loading={loading}
                  dataSource={allVendorConfiguration}
                  scroll={{ x: 'max-content' }}
                  pagination={false}
                  // onChange={this.handlePa}
                  bordered
                  // onRow={record => ({
                  //   onClick: () => {
                  //     this.navigateToEditPricingProfile(record)
                  //   },
                  // })}
                />
              </div>

              <div className="col-xl-12">
                <Row>
                  <Col
                    xs={{ span: 12 }}
                    md={{ span: 5 }}
                    lg={{ span: 4 }}
                    className={styles.totalPageBlock}
                  >
                    <span className={styles.entriesBlock}>
                      Show {fromNumber} to <b>{toNumber}</b> of <b>{totalPages}</b> entries
                    </span>
                  </Col>
                  <Col xs={{ span: 12 }} md={{ span: 19 }} lg={{ span: 20 }}>
                    <Pagination
                      className={styles.paginationTab}
                      onChange={this.handleTableChange}
                      showSizeChanger
                      defaultCurrent={defaultCurrent}
                      defaultPageSize={50}
                      pageSizeOptions={['10', '50', '100']}
                      onShowSizeChange={this.handlePageSizeChange}
                      total={totalPages}
                      // loading={CAlistLoading}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default AllVendorConfigurations
