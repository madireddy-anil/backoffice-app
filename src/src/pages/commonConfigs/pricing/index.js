import React, { Component } from 'react'
import { Select, Icon, Card, Table, Tooltip, Button, Form } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  getAllPricingProfiles,
  getPricingProfileById,
  deleteSelectedPricingProfile,
  updateIsNewPricingProfile,
  updateIsPaymentTieredPricing,
  updatePaymentTieringMethodSelected,
  showPaymentTieringOptions,
} from 'redux/pricingProfile/action'
import { formatToZoneDate } from 'utilities/transformer'

import { getClientsByKycStatusPass } from 'redux/general/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, pricing, settings, general }) => ({
  token: user.token,
  pricingProfiles: pricing.pricingProfiles,
  loading: pricing.allPricingListLoading,
  timeZone: settings.timeZone.value,
  pagination: pricing.pagination,
  companies: general.companies,
  clients: general.KycStatusPassedClients,
})

const UNDEFINED_VALUE = undefined
const TRUE_VALUE = true
const FALSE_VALUE = false

@Form.create()
@connect(mapStateToProps)
class Currency extends Component {
  state = {
    visibleSearch: false,
    paginationData: {},
    clientId: '',
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    const values = {
      token,
      page: 1,
      pageSize: 10,
    }
    dispatch(updateIsPaymentTieredPricing(UNDEFINED_VALUE))
    dispatch(updatePaymentTieringMethodSelected(UNDEFINED_VALUE))
    dispatch(showPaymentTieringOptions(FALSE_VALUE))
    dispatch(getAllPricingProfiles(values))
    dispatch(getClientsByKycStatusPass(token))
  }

  navigateToEditPricingProfile = record => {
    const { dispatch, history, token } = this.props
    dispatch(getPricingProfileById(record.id, token))
    dispatch(updateIsNewPricingProfile(FALSE_VALUE))
    history.push('/edit-pricing-profile')
  }

  navigateToViewPricingProfile = record => {
    const { dispatch, history, token } = this.props
    history.push('/view-pricing-profile')
    dispatch(getPricingProfileById(record.id, token))
    dispatch(updateIsNewPricingProfile(FALSE_VALUE))
  }

  handleAddPricingProfile = () => {
    const { history, dispatch } = this.props
    dispatch(updateIsNewPricingProfile(TRUE_VALUE))
    history.push('/add-pricing-profile')
  }

  handleDeletedPricingProfile = record => {
    const { dispatch, token } = this.props
    dispatch(deleteSelectedPricingProfile(record.id, token))
  }

  handleTableChange = paginationParam => {
    const { dispatch, token } = this.props

    const { clientId } = this.state

    const values = {
      page: paginationParam.current,
      pageSize: paginationParam.pageSize,
      entityId: clientId.length > 0 ? clientId : undefined,
      token,
    }

    this.setState({
      paginationData: paginationParam,
    })

    dispatch(getAllPricingProfiles(values))
  }

  handleOnClientChange = value => {
    const { dispatch, token } = this.props
    const { paginationData } = this.state

    const values = {
      page: paginationData.current ?? 1,
      pageSize: paginationData.pageSize ?? 10,
      entityId: value,
      token,
    }

    this.setState({
      clientId: value,
    })

    dispatch(getAllPricingProfiles(values))
  }

  onClearFilters = () => {
    const { dispatch, token, form } = this.props

    this.setState({
      clientId: '',
      paginationData: {
        page: 1,
        pageSize: 10,
      },
    })

    form.resetFields()

    const values = {
      page: 1,
      pageSize: 10,
      token,
    }

    dispatch(getAllPricingProfiles(values))
  }

  getSearchUI = () => {
    const { clients, form } = this.props
    const { visibleSearch } = this.state
    const { getFieldDecorator } = form
    const clientsOptions = clients.map(option => (
      <Option
        key={option.id}
        label={option?.genericInformation?.registeredCompanyName}
        value={option?.id}
      >
        <h5>{option?.genericInformation?.tradingName}</h5>
        <small>{option?.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className={`${styles.data} mb-2 p-2`}>
        <div className="row">
          <div className="col-lg-3 ml-3 mt-2">
            <Form>
              <Form.Item>
                {getFieldDecorator(
                  'client',
                  {},
                )(
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    optionLabelProp="label"
                    className={styles.cstmSelectInput}
                    placeholder="Select Client"
                    style={{ width: '100%' }}
                    onChange={value => this.handleOnClientChange(value)}
                  >
                    {clientsOptions}
                  </Select>,
                )}
              </Form.Item>
            </Form>
          </div>
          <div className="col-lg-3">
            <Button
              className={`ml-2 mr-2 mt-3 ${styles.clearBtn}`}
              type="primary"
              ghost
              onClick={this.onClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { loading, pricingProfiles, timeZone, pagination } = this.props
    const { paginationData } = this.state
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Client',
        dataIndex: 'entityId',
        key: 'tradingName',
        align: 'center',
        render: id => {
          const { clients } = this.props

          const client = clients.find(clientId => {
            return clientId.id === id
          })

          return client?.genericInformation?.registeredCompanyName
        },
      },
      {
        title: 'Profile Type',
        dataIndex: 'profileType',
        key: 'profileType',
        align: 'center',
        width: 130,
      },
      {
        title: 'Payments',
        dataIndex: 'payments',
        key: 'payments',
        align: 'payments',
        children: [
          {
            title: 'Currency',
            dataIndex: 'payments.transactionCurrency',
            key: 'transactionCurrency',
            width: 150,
            align: 'center',
          },
          {
            title: 'Direction',
            dataIndex: 'payments.direction',
            key: 'direction',
            width: 150,
            align: 'center',
          },
          {
            title: 'Type',
            dataIndex: 'payments.type',
            key: 'type',
            width: 150,
            align: 'center',
          },
          {
            title: 'Priority',
            dataIndex: 'payments.priority',
            key: 'priority',
            width: 150,
            align: 'center',
          },
        ],
      },
      {
        title: 'Foreign Exchange',
        dataIndex: 'trades',
        key: 'trades',
        align: 'trades',
        children: [
          {
            title: 'Buy Currency',
            dataIndex: 'trades.buyCurrency',
            key: 'buyCurrency',
            width: 150,
            align: 'center',
          },
          {
            title: 'Sell Currency',
            dataIndex: 'trades.sellCurrency',
            key: 'sellCurrency',
            width: 150,
            align: 'center',
          },
        ],
      },
      {
        title: 'Status',
        dataIndex: 'profileActive',
        key: 'profileActive',
        align: 'center',
        fixed: 'right',
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
            <Tooltip title="view">
              <Button onClick={() => this.navigateToEditPricingProfile(record)} type="link">
                View Details
              </Button>
            </Tooltip>
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Pricing Profiles</span>
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
              <Tooltip title="Add New Pricing Profile">
                <Button type="primary" className="mr-3" onClick={this.handleAddPricingProfile}>
                  Add New Pricing Profile
                </Button>
              </Tooltip>
              <Tooltip title="filters">
                <Icon
                  type="filter"
                  onClick={() =>
                    this.setState(prevState => ({
                      visibleSearch: !prevState.visibleSearch,
                    }))
                  }
                />
              </Tooltip>
            </div>
          }
        >
          <Helmet title="Currency" />
          <div className={styles.data}>
            <div className="row">
              <div className="col-xl-12">
                {this.getSearchUI()}
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  loading={loading}
                  dataSource={pricingProfiles}
                  scroll={{ x: 'max-content' }}
                  pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10', '25', '50', '100'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  }}
                  {...paginationData}
                  onChange={this.handleTableChange}
                  bordered
                />
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default Currency
