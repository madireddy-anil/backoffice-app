import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import {
  Table,
  Card,
  Tooltip,
  Icon,
  Button,
  Row,
  Col,
  Drawer,
  Form,
  Spin,
  Skeleton,
  Select,
  Input,
  Menu,
  Dropdown,
} from 'antd'

import {
  getAllFxBaseRates,
  handlePagination,
  updateCurrentFxBaseRateId,
  handleFxBaseRateFilter,
} from 'redux/fxBaseRate/actions'

import {
  formatToZoneDate,
  formatToZoneDateOnly,
  ClearFilterOnComponentUnMount,
} from '../../../utilities/transformer'

// const { RangePicker } = DatePicker
const { Option } = Select

const mapStateToProps = ({ general, user, fxBaseRate, settings }) => ({
  vendors: general.newVendors,
  currencies: general.currencies,
  token: user.token,
  fxBaseRates: fxBaseRate.fxBaseRates,
  pagination: fxBaseRate.pagination,
  loading: fxBaseRate.loading,
  timeZone: settings.timeZone.value,
  appliedFilters: fxBaseRate.appliedFxBaseRateFilters,
})

@Form.create()
@connect(mapStateToProps)
class FxBaseRate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // rowItem: '',
      visibleFilter: false,
      filter: {
        baseRateProviderName: '',
        sourceCurrency: '',
        destinationCurrency: '',
      },
      filters: {},
      sortBy: 'desc',
      orderBy: 'createdAt',
    }
  }

  componentDidMount() {
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
      appliedFilters,
      form,
    } = this.props
    const values = {
      ...appliedFilters,
      page: current,
      limit: pageSize,
    }
    form.setFieldsValue(appliedFilters)
    dispatch(getAllFxBaseRates(values, token))
  }

  componentWillUnmount() {
    this.mounted = false
    const { history, dispatch } = this.props
    ClearFilterOnComponentUnMount(history.location.pathname, handleFxBaseRateFilter, dispatch)
  }

  navigateToCreateFxBaserate = () => {
    const { history } = this.props
    history.push('/create-fx-base-rate')
  }

  navigateToFxBaseRate = record => {
    const { dispatch, history } = this.props
    const { id } = record
    Promise.resolve(dispatch(updateCurrentFxBaseRateId(id))).then(() =>
      history.push('/fx-base-rate'),
    )
  }

  // onSelectRowItem = id => {
  //   this.setState({ rowItem: id })
  // }

  onRateProviderChange = value => {
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        baseRateProviderName: value,
      },
    }))
  }

  handleSourceCurrencyChange = value => {
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        sourceCurrency: value,
      },
    }))
  }

  handleSourceCurrencyChange = value => {
    this.setState(prevState => ({
      filter: {
        ...prevState.filter,
        destinationCurrency: value,
      },
    }))
  }

  getFilterDrawer = () => {
    const { visibleFilter } = this.state
    const {
      form: { getFieldDecorator },
      vendors,
      currencies,
    } = this.props
    const vendorOption = vendors.map(option => (
      <Option key={option.id} label={option.genericInformation?.tradingName}>
        <h5>{option.genericInformation?.tradingName}</h5>
        <small>{option.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))
    const srcOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <Drawer
        title="Filter Fx Rates"
        width={600}
        onClose={this.onClose}
        visible={visibleFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Base Provider Name">
                {getFieldDecorator(
                  'vendorId',
                  {},
                )(
                  <Select
                    showSearch
                    placeholder="Filter by Rate Provider"
                    optionLabelProp="label"
                    onFilterProp="children"
                    onChange={this.onRateProviderChange}
                    filterOption={(input, option) =>
                      option.props.children[0].props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {vendorOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Source Currency">
                {getFieldDecorator('sourceCurrency', {
                  initialValue: '',
                })(
                  <Select
                    showSearch
                    placeholder="Filter by Source Currency"
                    optionFilterProp="children"
                    onChange={this.handleSourceCurrencyChange}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {srcOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Target Currency">
                {getFieldDecorator('destinationCurrency', {
                  initialValue: '',
                })(
                  <Select
                    showSearch
                    placeholder="Filter by Destination Currency"
                    optionFilterProp="children"
                    onChange={this.handleDestinationCurrencyChange}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {srcOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Rate Status">
                {getFieldDecorator('rateStatus', {
                  initialValue: '',
                })(
                  <Select
                    showSearch
                    placeholder="Filter by Rate Status"
                    optionFilterProp="children"
                    // onChange={this.handleDestinationCurrencyChange}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="active">ACTIVE</Option>
                    <Option value="inactive">INACTIVE</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Fx Reference">
                {getFieldDecorator('fxBaseRateReference', {
                  initialValue: '',
                })(<Input placeholder="Input the rate reference" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Base Amount">
                {getFieldDecorator('baseAmount', {
                  initialValue: '',
                })(<Input placeholder="Input the base amount" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Base Rate">
                {getFieldDecorator('targetAmount', {
                  initialValue: '',
                })(<Input placeholder="Input the base rate" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Inverse Base Rate">
                {getFieldDecorator('inverseAmount', {
                  initialValue: '',
                })(<Input placeholder="Input the inverse amount" />)}
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button className="mr-2" type="primary" ghost onClick={this.onReset}>
              Reset
            </Button>
            <Button htmlType="submit" type="primary">
              Filter
            </Button>
          </div>
        </Form>
      </Drawer>
    )
  }

  onReset = () => {
    this.setState({ filters: {} })
    const { form, token, dispatch } = this.props
    form.setFieldsValue({
      vendorId: undefined,
      sourceCurrency: undefined,
      destinationCurrency: undefined,
      rateStatus: undefined,
      fxBaseRateReference: undefined,
      targetAmount: undefined,
      inverseAmount: undefined,
      baseAmount: undefined,
    })
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    dispatch(handleFxBaseRateFilter({}))
    dispatch(handlePagination(pagination))
    dispatch(getAllFxBaseRates('', token))
  }

  onSubmitFilter = e => {
    const { form, dispatch, vendors, token } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const vendor = vendors.find(el => el.id === values.vendorId)
        const pagination = {
          current: 1,
          total: 0,
          pageSize: 10,
        }
        dispatch(handlePagination(pagination))
        values.vendor = vendor ? vendor.id : ''
        this.setState({ filters: values })
        dispatch(handleFxBaseRateFilter(values))
        dispatch(getAllFxBaseRates(values, token))
      }
    })
    this.onClose()
  }

  showDrawer = () => {
    this.setState({
      visibleFilter: true,
    })
  }

  onClose = () => {
    this.setState({
      visibleFilter: false,
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch, token, appliedFilters } = this.props
    const { sortBy, orderBy } = this.state
    pagination.sortBy = sortBy

    if (sorter.column)
      this.setState({
        orderBy: sorter.column.dataIndex,
      })
    dispatch(handlePagination(pagination))
    dispatch(
      getAllFxBaseRates(
        {
          ...appliedFilters,
          page: pagination.current,
          limit: pagination.pageSize,
          sortBy: pagination.sortBy,
          orderBy: sorter.column ? sorter.column.dataIndex : orderBy,
        },
        token,
      ),
    )
  }

  setNewToOldSort = () => {
    const { dispatch, token, appliedFilters } = this.props
    const { filters } = this.state
    filters.page = 1
    filters.limit = 10
    filters.sortBy = 'desc'
    dispatch(getAllFxBaseRates({ ...appliedFilters, page: 1, limit: 10, sortBy: 'desc' }, token))
    this.setState({
      sortBy: 'desc',
    })
  }

  setOldToNewSort = () => {
    const { dispatch, token, appliedFilters } = this.props
    const { filters } = this.state
    filters.page = 1
    filters.limit = 10
    filters.sortBy = 'asc'
    dispatch(getAllFxBaseRates({ ...appliedFilters, page: 1, limit: 10, sortBy: 'asc' }, token))
    this.setState({
      sortBy: 'asc',
    })
  }

  render() {
    const { fxBaseRates, pagination, loading, timeZone } = this.props
    // const { rowItem } = this.state
    const nullSymbol = '---'
    const columns = [
      {
        title: 'Created Date',
        dataIndex: 'createdAt',
        align: 'center',
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        render: date => (
          <Tooltip title={date ? formatToZoneDate(date, timeZone) : nullSymbol}>
            <span>{date ? formatToZoneDateOnly(date, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Rate Applied Date',
        dataIndex: 'rateAppliedAt',
        align: 'center',
        sorter: (a, b) => new Date(a.rateAppliedAt) - new Date(b.rateAppliedAt),
        render: date => (
          <Tooltip title={date ? formatToZoneDate(date, timeZone) : nullSymbol}>
            <span>{date ? formatToZoneDateOnly(date, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Rate Provider Name',
        dataIndex: 'baseProviderName',
        align: 'center',
      },
      {
        title: 'Fx Reference',
        dataIndex: 'fxBaseRateReference',
        align: 'center',
      },
      {
        title: 'Source Currency',
        dataIndex: 'baseCurrency',
        align: 'center',
      },
      {
        title: 'Target Currency',
        dataIndex: 'targetCurrency',
        align: 'center',
      },
      {
        title: 'Base Amount',
        dataIndex: 'baseAmount',
        align: 'center',
      },
      {
        title: 'Base Rate',
        dataIndex: 'targetAmount',
        align: 'center',
      },
      {
        title: 'Inverse Base Rate',
        dataIndex: 'inverseAmount',
        align: 'center',
      },
      {
        title: 'Rate Status',
        dataIndex: 'rateStatus',
        align: 'center',
        render: rateStatus => _.upperCase(rateStatus),
      },
    ]
    // const rowSelection = {
    //   onChange: selectedRowKeys => {
    //     if (selectedRowKeys) this.onSelectRowItem(selectedRowKeys)
    //     selectedRowKeys = []
    //   },
    //   onSelect: (record, selected, selectedRows) => {
    //     console.log(record, selected, selectedRows)
    //   },
    //   onSelectAll: (selected, selectedRows, changeRows) => {
    //     console.log(selected, selectedRows, changeRows)
    //   },
    // }

    const sortOptions = (
      <Menu>
        <Menu.Item key="0" onClick={this.setNewToOldSort}>
          New to Old
        </Menu.Item>
        <Menu.Item key="1" onClick={this.setOldToNewSort}>
          Old to New
        </Menu.Item>
      </Menu>
    )

    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item onClick={this.showDrawer}>
          <Icon type="filter" />
          <span className="pr-4"> Filter </span>
        </Menu.Item>
      </Menu>
    )

    return (
      <div>
        <Card
          title={
            <div>
              <span className="font-size-16">Fx Base Rates</span>
              <Dropdown overlay={sortOptions} trigger={['click']}>
                <Icon className="font-size-10 ml-2" type="down" />
              </Dropdown>
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
          extra={
            <div>
              {/* <Button
                hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length > 1}
                type="primary"
                className="ml-3"
                onClick={this.onDeleteFxBaseRate}
              >
                Delete
                <Icon type="close" />
              </Button>
              <Button
                hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length < 2}
                type="primary"
                className="ml-3"
                onClick={this.onBulkDeleteFxBaseRates}
              >
                Bulk Delete
                <Icon type="close" />
              </Button> */}
              <Button type="primary" className="ml-3" onClick={this.navigateToCreateFxBaserate}>
                New Fx Base Rate
                <Icon type="plus" />
              </Button>
              <Tooltip title="settings">
                <Dropdown overlay={settingsMenu} trigger={['click']}>
                  <Icon type="setting" className="m-3" />
                </Dropdown>
              </Tooltip>
            </div>
          }
        >
          {this.getFilterDrawer()}
          <div className="row">
            <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
              <Skeleton loading={loading} active>
                <Spin tip="Loading..." spinning={loading}>
                  <Table
                    columns={columns}
                    rowKey={record => record.id}
                    onRow={record => ({
                      onClick: () => {
                        this.navigateToFxBaseRate(record)
                      },
                    })}
                    // rowSelection={rowSelection}
                    pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ['10', '25', '50', '100'],
                      // locale: { items_per_page: '' },
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    dataSource={fxBaseRates}
                    scroll={{ x: 'max-content' }}
                    onChange={this.handleTableChange}
                  />
                </Spin>
              </Skeleton>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default FxBaseRate
