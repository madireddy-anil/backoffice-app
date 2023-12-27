import React, { Component } from 'react'
import {
  Card,
  Table,
  Spin,
  Skeleton,
  Icon,
  Tooltip,
  Button,
  Select,
  Dropdown,
  Radio,
  Drawer,
  Col,
  Row,
  Form,
  Input,
  Menu,
  Tag,
  Modal,
  notification,
} from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  getCryptoBeneficiaries,
  deleteCryptoBeneficiary,
  updateSelectedCryptoBeneficiary,
  handlePagination,
  getBulkDownloadDataForCryptoBeneficiary,
  handleCryptoBeneficiaryFilters,
  updateBeneficiaryStatus,
} from 'redux/cryptoBeneficiary/actions'
import SubMenu from 'antd/lib/menu/SubMenu'
import Excel from '../../components/CleanUIComponents/Excel'
import jsonData from './data.json'

import { ClearFilterOnComponentUnMount } from '../../utilities/transformer'

import styles from './style.module.scss'

const { Option } = Select
const { currencyFields, beneficiaryStatus } = jsonData
const { TextArea } = Input

const mapStateToProps = ({ user, cryptoBeneficiary, general }) => ({
  clients: general.clients,
  vendors: general.newVendors,
  token: user.token,
  currencies: general.currencies,
  loading: cryptoBeneficiary.cryptoBeneficiaryLoading,
  pagination: cryptoBeneficiary.pagination,
  cryptoBeneficiaryDetails: cryptoBeneficiary.cryptoBeneficiaries,
  downloadData: cryptoBeneficiary.allDownloadData,
  appliedFilters: cryptoBeneficiary.appliedCryptoBeneficiaryFilters,
})

@Form.create()
@connect(mapStateToProps)
class CryptoBeneficiary extends Component {
  state = {
    visibleSearch: true,
    visibleFilter: false,
    search: {
      beneReference: '',
    },
    filters: {},
    visibleDownload: true,
    downloadValue: 'current',
    isVendorDisabled: false,
    isClientDisabled: false,
    clientName: '',
    vendorName: '',
    selectedId: '',
    toggleModel: false,
    reasonText: '',
    updatedStatus: '',
  }

  componentDidMount() {
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
      form,
      appliedFilters,
    } = this.props
    const values = {
      ...appliedFilters,
      page: current,
      limit: pageSize,
    }
    form.setFieldsValue(appliedFilters)
    dispatch(getCryptoBeneficiaries(values, token))
  }

  componentWillUnmount() {
    this.mounted = false
    const { history, dispatch } = this.props
    ClearFilterOnComponentUnMount(
      ['/view-cryptoBeneficiary', '/edit-cryptoBeneficiary'].includes(
        history.location.pathname.slice(0, 23),
      )
        ? history.location.pathname.slice(0, 23)
        : history.location.pathname,
      handleCryptoBeneficiaryFilters,
      dispatch,
    )
  }

  navigateToNewBeneficiary = () => {
    const { history } = this.props
    history.push('/add-new-cryptoBeneficiary')
  }

  navigateToViewCryptoBeneficiary = record => {
    const { id } = record
    const { history, appliedFilters, dispatch } = this.props
    history.push(`/view-cryptoBeneficiary/${id}`)
    dispatch(
      handleCryptoBeneficiaryFilters({
        ...appliedFilters,
        selectedRecordBeneStatus: record.beneStatus,
        selectedRecordComment: record.comments.join(' '),
      }),
    )
  }

  navigateToEditCryptoBeneficiary = record => {
    const { id } = record
    const { history, appliedFilters, dispatch } = this.props
    Promise.resolve(dispatch(updateSelectedCryptoBeneficiary(record))).then(() =>
      history.push(`/edit-cryptoBeneficiary/${id}`),
    )
    dispatch(
      handleCryptoBeneficiaryFilters({
        ...appliedFilters,
        selectedRecordBeneStatus: record.beneStatus,
        selectedRecordComment: record.comments.join(' '),
      }),
    )
  }

  onDeleteCryptoBeneficiary = record => {
    const { dispatch, token } = this.props
    const { id } = record

    dispatch(deleteCryptoBeneficiary(id, token))
  }

  // search
  onClientSearchChange = value => {
    this.setState(prevState => ({
      search: {
        ...prevState.search,
        beneReference: value,
      },
    }))
  }

  onClearSearch = () => {
    const { form, token, dispatch, appliedFilters } = this.props
    form.setFieldsValue({
      beneReference: undefined,
    })
    const values = { ...appliedFilters, page: 1, limit: 10 }
    dispatch(
      handleCryptoBeneficiaryFilters({
        ...appliedFilters,
        values,
        cryptoBeneficiaryId: undefined,
        cryptoBeneficiaryReference: undefined,
        beneReference: undefined,
      }),
    )
    dispatch(getCryptoBeneficiaries(values, token))
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
    }))
  }

  onSubmitSearch = e => {
    const { form, dispatch, cryptoBeneficiaryDetails, token, appliedFilters } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const bene = cryptoBeneficiaryDetails.find(el => el.beneReference === values.beneReference)
        const value = {
          page: 1,
          limit: 10,
          cryptoBeneficiaryId: bene ? bene.id : '',
          cryptoBeneficiaryReference: values.beneReference,
        }
        dispatch(
          handleCryptoBeneficiaryFilters({
            ...appliedFilters,
            ...values,
            cryptoBeneficiaryId: bene ? bene.id : '',
            cryptoBeneficiaryReference: values.beneReference,
          }),
        )
        dispatch(getCryptoBeneficiaries(value, token))
      }
    })
  }

  getSearchUI = () => {
    const { visibleSearch } = this.state
    const { form, cryptoBeneficiaryDetails } = this.props
    const { getFieldDecorator } = form
    const clientOption = cryptoBeneficiaryDetails.map(option => (
      <Option key={option.id} label={option.beneReference} value={option.beneReference}>
        <h5>{option.beneReference}</h5>
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className="mb-2 p-2">
        <Form onSubmit={this.onSubmitSearch}>
          <Form.Item>
            {getFieldDecorator(
              'beneReference',
              {},
            )(
              <Select
                showSearch
                className="mt-3"
                style={{ width: 200 }}
                placeholder="Search by Beneficiary Reference"
                optionFilterProp="children"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
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

  // Filter
  onClientFilterChange = value => {
    this.setState(prevState => ({
      search: {
        ...prevState.search,
        beneReference: value,
      },
    }))
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
    const { form, token, dispatch } = this.props
    form.resetFields()
    this.setState({
      isClientDisabled: false,
      isVendorDisabled: false,
      clientName: form.resetFields(),
      vendorName: form.resetFields(),
    })
    const value = {
      page: 1,
      limit: 10,
    }
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    dispatch(handleCryptoBeneficiaryFilters({}))
    dispatch(handlePagination(pagination))
    this.setState({ filters: {} })
    dispatch(getCryptoBeneficiaries(value, token))
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
        dispatch(handleCryptoBeneficiaryFilters(values))
        dispatch(handlePagination(pagination))
        values.page = 1
        values.limit = 10
        dispatch(getCryptoBeneficiaries(values, token))
        this.setState({ filters: values })
      }
    })
    this.onClose()
  }

  onChangeSelectClient = (id, name) => {
    this.setState({
      clientName: name.props.label,
      isVendorDisabled: true,
      vendorName: undefined,
    })
  }

  onChangeSelectVendor = (id, name) => {
    this.setState({
      vendorName: name.props.label,
      isClientDisabled: true,
      clientName: undefined,
    })
  }

  getFilterDrawer = () => {
    const { visibleFilter, clientName, vendorName, isClientDisabled, isVendorDisabled } = this.state
    const { form, clients, vendors } = this.props
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
    const currencyOption = currencyFields.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    const beneStatusOption = beneficiaryStatus.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    return (
      <Drawer
        title="Crypto Beneficiary"
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
                    placeholder="Search by Client Name"
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
                    placeholder="Search by Vendor Name"
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
              <Form.Item label="Alias Name">
                {getFieldDecorator('aliasName', {})(<Input placeholder="Enter Alias Name" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Crypto Currency">
                {getFieldDecorator(
                  'cryptoCurrency',
                  {},
                )(
                  <Select showSearch placeholder="Select Currency Type">
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Beneficiary Status">
                {getFieldDecorator(
                  'beneStatus',
                  {},
                )(
                  <Select showSearch placeholder="Select Beneficiary Status">
                    {beneStatusOption}
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

  handleTableChange = pagination => {
    const { dispatch, token, appliedFilters } = this.props
    dispatch(handlePagination(pagination))
    dispatch(
      getCryptoBeneficiaries(
        { ...appliedFilters, page: pagination.current, limit: pagination.pageSize },
        token,
      ),
    )
  }

  onChangeDownload = e => {
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
    } = this.props
    const { filters } = this.state
    this.setState({
      downloadValue: e.target.value,
    })
    if (e.target.value === 'all') {
      const values = {}
      values.limit = 0
      values.token = token
      dispatch(getBulkDownloadDataForCryptoBeneficiary(values))
    } else {
      filters.page = current
      filters.limit = pageSize
      filters.token = token
      dispatch(getBulkDownloadDataForCryptoBeneficiary(filters))
    }
  }

  getDownload = data => {
    const { visibleDownload, downloadValue } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <div hidden={visibleDownload} className="mt-4 pl-4">
        <Form>
          <Form.Item>
            {getFieldDecorator('radioGroup', { initialValue: downloadValue })(
              <Radio.Group onChange={this.onChangeDownload}>
                <Radio value="current" className="pl-2">
                  Download current
                </Radio>
                <Radio value="all" className="pl-2">
                  Download All
                </Radio>
              </Radio.Group>,
            )}
            {
              <Excel
                columns={[
                  'Beneficiary Reference',
                  'Client or Vendor Name',
                  'Alias Name',
                  'Crypto Currency',
                  'Crypto Wallet Address',
                  'Status',
                ]}
                data={data}
                fileName="Crypto Beneficiaries"
                isPrimaryButtonVisible
                primaryButtonName="Download"
              />
            }
          </Form.Item>
        </Form>
      </div>
    )
  }

  handleStatusOnChange = () => {
    const { reasonText, selectedId, updatedStatus } = this.state
    const { appliedFilters, pagination, token, dispatch } = this.props

    const filters = {
      page: pagination.page,
      limit: pagination.pageSize,
      ...appliedFilters,
    }

    if (reasonText.trim() !== '') {
      dispatch(
        updateBeneficiaryStatus(
          { id: selectedId, beneStatus: updatedStatus, comments: reasonText.split(' '), filters },
          token,
        ),
      )

      this.setState({
        selectedId: '',
        reasonText: '',
        toggleModel: false,
      })
    } else {
      notification.warning({
        message: 'Enter a valid reason!',
      })
    }
  }

  statusModel = () => {
    const { toggleModel, reasonText, updatedStatus } = this.state
    return (
      <Modal
        title={`Are you sure want to ${
          updatedStatus === 'active' ? 'Active' : 'Inactive'
        } this beneficiary ?`}
        centered
        onOk={() => this.handleStatusOnChange()}
        visible={toggleModel}
        onCancel={() => this.setState({ selectedId: '', reasonText: '', toggleModel: false })}
        maskClosable={false}
      >
        <h5>
          Reason<span style={{ color: 'red', fontSize: '1.5rem' }}>*</span> :{' '}
        </h5>
        <TextArea
          rows={4}
          value={reasonText}
          onChange={evt => this.setState({ reasonText: evt.target.value })}
        />
      </Modal>
    )
  }

  handleBeneStatus = (id, currentStatus) => {
    this.setState({
      selectedId: id,
      toggleModel: true,
      updatedStatus: currentStatus,
    })
  }

  render() {
    const nullSymbol = '---'
    const { loading, cryptoBeneficiaryDetails, pagination, downloadData } = this.props

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
    const columns = [
      {
        title: 'Beneficiary Reference',
        dataIndex: 'beneReference',
        key: 'beneReference',
        align: 'center',
        render: beneReference => beneReference || nullSymbol,
      },
      {
        title: 'Client or Vendor Name',
        dataIndex: 'clientOrVendor',
        key: 'clientOrVendor',
        align: 'center',
        render: clientOrVendor => clientOrVendor || nullSymbol,
      },
      {
        title: 'Alias Name',
        dataIndex: 'aliasName',
        key: 'aliasName',
        align: 'center',
        render: aliasName => aliasName || nullSymbol,
      },
      {
        title: 'Crypto Currency',
        dataIndex: 'cryptoCurrency',
        key: 'cryptoCurrency',
        align: 'center',
        render: cryptoCurrency => cryptoCurrency || nullSymbol,
      },
      {
        title: 'Crypto Wallet Address',
        dataIndex: 'cryptoWalletAddress',
        key: 'cryptoWalletAddress',
        align: 'center',
        render: cryptoWalletAddress => cryptoWalletAddress || nullSymbol,
      },
      {
        title: 'Status',
        dataIndex: '',
        key: 'beneStatus',
        align: 'center',
        render: record => {
          return (
            <>
              <Tooltip
                placement="topLeft"
                title={record.beneStatus === 'active' ? 'Click to Inactive' : 'Click to Active'}
              >
                {
                  <Tag
                    color={record.beneStatus === 'active' ? 'green' : 'red'}
                    onClick={() =>
                      this.handleBeneStatus(
                        record.id,
                        record.beneStatus === 'active' ? 'in_active' : 'active',
                      )
                    }
                  >
                    {record.beneStatus === 'active' ? 'Active' : 'Inactive'}
                  </Tag>
                }
              </Tooltip>
            </>
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
              <Button onClick={() => this.navigateToEditCryptoBeneficiary(record)} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button onClick={() => this.navigateToViewCryptoBeneficiary(record)} type="link">
                <Icon type="eye" style={{ color: '#008000' }} />
              </Button>
            </Tooltip>
            {/* <Popconfirm
              title="Sure to delete?"
              onConfirm={() => {
                this.onDeleteCryptoBeneficiary(record)
              }}
            >
              <Tooltip title="delete">
                <Button type="link">
                  <Icon type="delete" style={{ color: '#FF6347' }} />
                </Button>
              </Tooltip>
            </Popconfirm> */}
          </>
        ),
      },
    ]
    const data = []
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Crypto Beneficiary List</span>
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
              <Button type="primary" className="ml-3" onClick={this.navigateToNewBeneficiary}>
                Add Beneficiary
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
          <Helmet title="Trades" />
          <div className={styles.block}>
            {downloadData.forEach(cryptoBeneficiary => {
              const cryptoBeneficiaryData = []
              cryptoBeneficiaryData.push({
                value: cryptoBeneficiary.beneReference
                  ? cryptoBeneficiary.beneReference
                  : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              cryptoBeneficiaryData.push({
                value: cryptoBeneficiary.clientOrVendor
                  ? cryptoBeneficiary.clientOrVendor
                  : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              cryptoBeneficiaryData.push({
                value: cryptoBeneficiary.aliasName ? cryptoBeneficiary.aliasName : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              cryptoBeneficiaryData.push({
                value: cryptoBeneficiary.cryptoCurrency
                  ? cryptoBeneficiary.cryptoCurrency
                  : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              cryptoBeneficiaryData.push({
                value: cryptoBeneficiary.cryptoWalletAddress
                  ? cryptoBeneficiary.cryptoWalletAddress
                  : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              cryptoBeneficiaryData.push({
                value: cryptoBeneficiary.beneStatus ? cryptoBeneficiary.beneStatus : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              data.push(cryptoBeneficiaryData)
            })}
            {this.getSearchUI()}
            {this.getFilterDrawer()}
            {this.getDownload(data)}
            {this.statusModel()}
            <div className="row">
              <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
                <Skeleton loading={loading} active>
                  <Spin tip="Loading..." spinning={loading}>
                    <Table
                      columns={columns}
                      rowKey={record => record.id}
                      pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '25', '50', '100'],
                        // locale: { items_per_page: '' },
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      }}
                      dataSource={cryptoBeneficiaryDetails}
                      scroll={{ x: 'max-content' }}
                      onChange={this.handleTableChange}
                    />
                  </Spin>
                </Skeleton>
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default CryptoBeneficiary
