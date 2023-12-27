import React, { Component } from 'react'
import {
  Card,
  Table,
  Spin,
  Skeleton,
  Icon,
  Tooltip,
  Button,
  Form,
  Drawer,
  Col,
  Row,
  Select,
  Modal,
  Menu,
  Dropdown,
  Input,
  Radio,
} from 'antd'

import SubMenu from 'antd/lib/menu/SubMenu'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import ViewOrEditFeeConfig from 'pages/manageDeposits/feeConfigs/viewOrEditFeeConfig'

import variables from '../../../utilities/variables'

import {
  getAllFeeConfigs,
  handlePagination,
  getFeeConfigById,
  handleFeeConfigFilter,
} from '../../../redux/feeconfig/actions'
import styles from './style.module.scss'
import Excel from '../../../components/CleanUIComponents/Excel'

const { Option } = Select
const { spreadType, feeCategory, tradingHours } = variables

const mapStateToProps = ({ user, general, settings, feeConfig }) => ({
  clients: general.clients,
  vendors: general.newVendors,
  currencies: general.currencies,
  timeZone: settings.timeZone.value,
  token: user.token,
  loading: feeConfig.loading,
  pagination: feeConfig.pagination,
  allFeeConfigs: feeConfig.allFeeConfigs,
  isFeeConfigUpdated: feeConfig.isFeeConfigUpdated,
  appliedFilters: feeConfig.appliedFeeConfigFilters,
})

@Form.create()
@connect(mapStateToProps)
class feeConfig extends Component {
  state = {
    visibleSearch: true,
    viewAccountModal: false,
    visibleFilter: false,
    modalTitle: 'Fee Config Details',
    modalAction: 'view',
    clientName: '',
    isVendorDisabled: false,
    isClientDisabled: false,
    vendorName: '',
    rowItem: {},
    search: {
      clientName: '',
    },
    filters: {},
    visibleDownload: true,
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
    dispatch(getAllFeeConfigs(values, token))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isAccountFetched) {
      this.getFeeConfigList()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isFeeConfigUpdated } = this.props
    const isPropsUpdated = {
      isAccountFetched: prevProps.isFeeConfigUpdated !== isFeeConfigUpdated,
    }
    return isPropsUpdated
  }

  getFeeConfigList = () => {
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
      appliedFilters,
    } = this.props
    const values = {
      ...appliedFilters,
      page: current,
      limit: pageSize,
    }
    this.setState({ viewAccountModal: false })
    dispatch(getAllFeeConfigs(values, token))
  }

  showEditModal = record => {
    const { dispatch, token } = this.props
    dispatch(getFeeConfigById(record.id, token))
    this.setState({
      viewAccountModal: true,
      modalTitle: 'Edit Fee Config',
      modalAction: 'edit',
    })
  }

  showViewModal = record => {
    const { dispatch, token } = this.props
    dispatch(getFeeConfigById(record.id, token))
    this.setState({
      viewAccountModal: true,
      modalTitle: 'Fee Config',
      modalAction: 'view',
    })
  }

  handleCancel = () => {
    this.setState({ viewAccountModal: false })
  }

  navigateToNewFeeConfig = () => {
    const { history } = this.props
    history.push('/create-fee-config')
  }

  navigateToFeeConfig = selectedFeeConfig => {
    const { history, dispatch } = this.props
    Promise.resolve(dispatch(getFeeConfigById(selectedFeeConfig.id))).then(() =>
      history.push('/fee-config'),
    )
  }

  // search
  onClientSearchChange = value => {
    this.setState(prevState => ({
      search: {
        ...prevState.search,
        clientName: value,
      },
    }))
  }

  onClientSearchBlur = () => {
    console.log('blur')
  }

  onClientSearchFocus = () => {
    console.log('focus')
  }

  onClientSearch = val => {
    console.log('search:', val)
  }

  onClearSearch = () => {
    const { form, token, dispatch } = this.props
    form.setFieldsValue({
      clientName: undefined,
    })
    dispatch(getAllFeeConfigs(token))
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
    }))
  }

  onSubmitSearch = e => {
    const { form, dispatch, clients, token } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const client = clients.find(el => el.genericInformation.tradingName === values.clientName)
        const value = {
          clientName: client ? client.genericInformation.tradingName : '',
        }
        dispatch(getAllFeeConfigs(value, token))
      }
    })
  }

  getSearchUI = () => {
    const { visibleSearch } = this.state
    const { form, clients } = this.props
    const { getFieldDecorator } = form
    const clientOption = clients.map(option => (
      <Option key={option.id} value={option.genericInformation.tradingName}>
        {option.genericInformation.tradingName}
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className="mb-2 p-2">
        <Form onSubmit={this.onSubmitSearch}>
          <Form.Item>
            {getFieldDecorator(
              'clientName',
              {},
            )(
              <Select
                showSearch
                className="mt-3"
                style={{ width: 200 }}
                placeholder="Search by ClientName"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {clientOption}
              </Select>,
            )}
            <Button
              className="ml-3"
              htmlType="submit"
              type="primary"
              onClick={e => this.onSubmitSearch(e)}
            >
              Search
            </Button>
            <Button className="ml-3" type="primary" ghost onClick={this.onClearSearch}>
              Clear Search
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
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

  onReset = () => {
    this.setState({ filters: {} })
    const { form, token, dispatch } = this.props
    form.resetFields()
    this.setState({
      isClientDisabled: false,
      isVendorDisabled: false,
      clientName: form.resetFields(),
      vendorName: form.resetFields(),
    })
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    dispatch(handleFeeConfigFilter({}))
    dispatch(handlePagination(pagination))
    dispatch(getAllFeeConfigs('', token))
  }

  onSubmitFilter = e => {
    const { form, dispatch, token } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const pagination = {
          current: 1,
          total: 0,
          pageSize: 10,
        }
        dispatch(handleFeeConfigFilter(values))
        dispatch(handlePagination(pagination))
        dispatch(getAllFeeConfigs(values, token))
        this.setState({ filters: values })
      }
    })
    this.onClose()
  }

  onChangeSelectClient = (id, name) => {
    const { form } = this.props
    this.setState({
      clientName: name.props.label,
      isVendorDisabled: true,
      vendorName: undefined,
    })
    form.setFieldsValue({
      vendorName: undefined,
    })
  }

  onChangeSelectVendor = (id, name) => {
    const { form } = this.props
    this.setState({
      vendorName: name.props.label,
      isClientDisabled: true,
      clientName: undefined,
    })
    form.setFieldsValue({
      clientName: undefined,
    })
  }

  getFilterDrawer = () => {
    const { visibleFilter, clientName, vendorName, isClientDisabled, isVendorDisabled } = this.state
    const { form, clients, vendors, currencies } = this.props
    const { getFieldDecorator } = form
    const clientOption = clients.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        <h5>{option.genericInformation.tradingName}</h5>
        <small>{option.genericInformation.registeredCompanyName}</small>
      </Option>
    ))
    const vendorOption = vendors.map(option => (
      <Option key={option.id} label={option.genericInformation?.tradingName} value={option.id}>
        <h5>{option.genericInformation?.tradingName}</h5>
        <small>{option.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} label={option.value} value={option.value}>
        {option.value}
      </Option>
    ))
    const spreadTypeOption = spreadType.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    const feeCategoryOption = feeCategory.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    const tradingHoursOption = tradingHours.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    return (
      <Drawer
        title="Fee Configs"
        width={600}
        onClose={this.onClose}
        visible={visibleFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Select Client">
                {getFieldDecorator('clientId', { initialValue: clientName })(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    placeholder="Filter by Client Name"
                    disabled={isClientDisabled}
                    onChange={this.onChangeSelectClient}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {clientOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Select Vendor">
                {getFieldDecorator('vendorId', { initialValue: vendorName })(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    disabled={isVendorDisabled}
                    onChange={this.onChangeSelectVendor}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {vendorOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Select Source Currency">
                {getFieldDecorator('depositCurrency')(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    // onChange={this.onChangeSelectClient}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Select Settlement Currency">
                {getFieldDecorator('settlementCurrency')(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    // onChange={this.onChangeSelectVendor}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Fee Config Reference">
                {getFieldDecorator('feeConfigReference')(
                  <Input placeholder="Enter a fee config reference" />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Fee Value">
                {getFieldDecorator('feeValue')(<Input placeholder="Input a fee value" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Spread Type">
                {getFieldDecorator('spreadType')(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    // onChange={this.onChangeSelectClient}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {spreadTypeOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Fee Category">
                {getFieldDecorator('feeCategory')(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    // onChange={this.onChangeSelectVendor}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {feeCategoryOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Trading Hours">
                {getFieldDecorator('tradingHours')(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    // onChange={this.onChangeSelectClient}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {tradingHoursOption}
                  </Select>,
                )}
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

  getDownload = data => {
    const { visibleDownload } = this.state
    const { form, loading } = this.props
    const { getFieldDecorator } = form
    return (
      <div hidden={visibleDownload} className="mt-4 pl-4">
        <Form>
          <Form.Item>
            {getFieldDecorator('radioGroup', { initialValue: 'current' })(
              <Radio.Group onChange={this.onChangeDownload}>
                <Radio value="current" className="pl-2">
                  Download Current Page
                </Radio>
              </Radio.Group>,
            )}
            {
              <Excel
                columns={[
                  'Client Name',
                  'Fee Config Reference',
                  'Source Currency',
                  'Destination Currency',
                  'Spread Type',
                  'Fee Category',
                  'Fee Value',
                ]}
                data={data}
                fileName="Fee Config History"
                isPrimaryButtonVisible
                primaryButtonName="Downlaod"
                isDownloadDisabled={loading}
              />
            }
          </Form.Item>
        </Form>
      </div>
    )
  }

  onSelectRowItem = id => {
    this.setState({ rowItem: id })
  }

  onDeleteFeeConfig = () => {
    console.log('delete')
  }

  onBulkDeleteFeeConfig = () => {
    console.log('bulk delete')
  }

  handleTableChange = pagination => {
    const { dispatch, token, appliedFilters } = this.props
    const { filters } = this.state
    dispatch(handlePagination(pagination))
    filters.page = pagination.current
    filters.limit = pagination.pageSize
    dispatch(
      getAllFeeConfigs(
        { ...appliedFilters, page: pagination.current, limit: pagination.pageSize },
        token,
      ),
    )
  }

  render() {
    const nullSymbol = '---'
    const { loading, clients, allFeeConfigs, pagination, vendors } = this.props
    const { rowItem, viewAccountModal, modalTitle, modalAction } = this.state
    const columns = [
      {
        title: 'Client/Vendor Name',
        dataIndex: 'clientOrVendor',
        key: 'clientName',
        align: 'center',
        render: clientId => {
          const combinedClientsAndVendors = [...clients, ...vendors]
          const obj = combinedClientsAndVendors.find(el => el.id === clientId)
          return obj ? obj.genericInformation?.tradingName : ''
        },
      },
      {
        title: 'Fee Config Reference',
        dataIndex: 'feeConfigReference',
        key: 'feeConfigReference',
        align: 'center',
      },
      {
        title: 'Source Currency',
        dataIndex: 'sourceCurrency',
        key: 'sourceCurrency',
        align: 'center',
      },
      {
        title: 'Destination Currency',
        dataIndex: 'destinationCurrency',
        key: 'destinationCurrency',
        align: 'center',
      },
      {
        title: 'Fee Value',
        dataIndex: 'feeValue',
        key: 'feeValue',
        align: 'center',
      },
      {
        title: 'Spread Type',
        dataIndex: 'spreadType',
        key: 'spreadType',
        align: 'center',
        render: value =>
          value ? spreadType.map(option => option.value === value && option.label) : nullSymbol,
      },
      {
        title: 'Fee Category',
        dataIndex: 'feeCategory',
        key: 'feeCategory',
        align: 'center',
        render: value =>
          value ? feeCategory.map(option => option.value === value && option.label) : nullSymbol,
      },
      {
        title: 'Trading Hours',
        dataIndex: 'tradingHours',
        key: 'tradingHours',
        align: 'center',
        render: value =>
          value ? tradingHours.map(option => option.value === value && option.label) : nullSymbol,
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
              <Button onClick={() => this.showEditModal(record)} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button onClick={() => this.showViewModal(record)} type="link">
                <Icon type="eye" style={{ color: '#008000' }} />
              </Button>
            </Tooltip>
          </>
        ),
      },
    ]
    const data = []

    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item onClick={this.showDrawer}>
          <Icon type="filter" />
          <span className="pr-4"> Filter </span>
        </Menu.Item>
        <SubMenu
          title={
            <span>
              <Icon type="down-circle" />
              <span className="pr-4"> Download </span>
            </span>
          }
        >
          <Menu.Item
            className="mr-3"
            onClick={() =>
              this.setState(prevState => ({
                visibleDownload: !prevState.visibleDownload,
              }))
            }
          >
            <Icon
              type="download"
              className="mr-3"
              onClick={() =>
                this.setState(prevState => ({
                  visibleDownload: !prevState.visibleDownload,
                }))
              }
            />
            Download Excel
          </Menu.Item>
        </SubMenu>
      </Menu>
    )

    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Fee Config History</span>
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
              <Button
                hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length > 1}
                type="primary"
                className="ml-3"
                onClick={this.onDeleteFeeConfig}
              >
                Delete
                <Icon type="close" />
              </Button>
              <Button
                hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length < 2}
                type="primary"
                className="ml-3"
                onClick={this.onBulkDeleteFeeConfig}
              >
                Bulk Delete
                <Icon type="close" />
              </Button>
              <Button type="primary" className="ml-3" onClick={this.navigateToNewFeeConfig}>
                Add Fee Config
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
          <Helmet title="Fee Config" />
          <div className={styles.block}>
            {allFeeConfigs.length > 0 &&
              allFeeConfigs.forEach(feeCon => {
                const feeConfigData = []
                const clientObj = clients.find(el => el.id === feeCon.clientId)
                feeConfigData.push({
                  value: clientObj ? clientObj.genericInformation.tradingName : nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
                feeConfigData.push({
                  value: feeCon.feeConfigReference || nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
                feeConfigData.push({
                  value: feeCon.sourceCurrency || nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
                feeConfigData.push({
                  value: feeCon.destinationCurrency || nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
                feeConfigData.push({
                  value: feeCon.spreadType || nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
                feeConfigData.push({
                  value: feeCon.feeCategory || nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
                feeConfigData.push({
                  value: feeCon.feeValue || nullSymbol,
                  style: { numFmt: '0.00' },
                })
                data.push(feeConfigData)
              })}
            {this.getSearchUI()}
            {this.getFilterDrawer()}
            {this.getDownload(data)}
            <div className="row">
              <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
                <Skeleton loading={loading} active>
                  <Spin tip="Loading..." spinning={loading}>
                    <Table
                      columns={columns}
                      rowKey={record => record.id}
                      // rowSelection={rowSelection}
                      pagination={{
                        ...pagination,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '25', '50', '100'],
                        // locale: { items_per_page: '' },
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      }}
                      dataSource={allFeeConfigs}
                      scroll={{ x: 'max-content' }}
                      onChange={this.handleTableChange}
                    />
                  </Spin>
                </Skeleton>
              </div>
            </div>
          </div>
        </Card>
        <Modal
          title={modalTitle}
          width={600}
          footer={false}
          destroyOnClose={false}
          visible={viewAccountModal}
          className={styles.accountModal}
          onCancel={this.handleCancel}
        >
          <div className={styles.modelBox}>
            <ViewOrEditFeeConfig action={modalAction} />
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

export default feeConfig
