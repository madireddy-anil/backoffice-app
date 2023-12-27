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
  Drawer,
  Col,
  Row,
  Form,
  Input,
  Dropdown,
  Menu,
  Radio,
  Tag,
  Modal,
  notification,
} from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import SubMenu from 'antd/lib/menu/SubMenu'
import {
  getBeneficiaries,
  handlePagination,
  getBulkDownloadDataForBeneficiary,
  handleBeneficiaryFilters,
  updateBeneficiaryStatus,
} from 'redux/beneficiary/actions'

import { ClearFilterOnComponentUnMount } from '../../utilities/transformer'

import Excel from '../../components/CleanUIComponents/Excel'

import jsonData from './data.json'

import styles from './style.module.scss'

const { Option } = Select
const { beneficiaryTypes, beneStatus } = jsonData
const { TextArea } = Input

const mapStateToProps = ({ user, beneficiary, general }) => ({
  clients: general.clients,
  vendors: general.newVendors,
  token: user.token,
  currencies: general.currencies,
  loading: beneficiary.beneficiaryLoading,
  pagination: beneficiary.pagination,
  beneficiaryDetails: beneficiary.beneficiaries,
  beneficiaries: general.beneficiaries,
  downloadData: beneficiary.allDownloadData,
  appliedFilters: beneficiary.appliedBeneficiaryFilters,
})

@Form.create()
@connect(mapStateToProps)
class Beneficiary extends Component {
  state = {
    visibleSearch: true,
    visibleFilter: false,
    rowItem: {},
    downloadValue: 'current',
    search: {
      beneReference: '',
    },
    filters: {},
    visibleDownload: false,
    isClientDisabled: false,
    isVendorDisabled: false,
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
      appliedFilters,
      form,
    } = this.props
    const values = {
      ...appliedFilters,
      page: current,
      limit: pageSize,
      token,
    }
    form.setFieldsValue(appliedFilters)
    // dispatch(getBulkDownloadDataForBeneficiary(values))
    dispatch(getBeneficiaries(values, token))
  }

  componentWillUnmount() {
    this.mounted = false
    const { history, dispatch } = this.props
    ClearFilterOnComponentUnMount(
      history.location.pathname.slice(0, 12) === '/beneficiary'
        ? history.location.pathname.slice(0, 12)
        : history.location.pathname,
      handleBeneficiaryFilters,
      dispatch,
    )
  }

  navigateToNewBeneficiary = () => {
    const { history } = this.props
    history.push('/add-new-beneficiary')
  }

  navigateToBeneficiary = (record, value) => {
    const { history, appliedFilters, dispatch } = this.props
    history.push(`/beneficiary/${record.id}`)
    dispatch(
      handleBeneficiaryFilters({
        ...appliedFilters,
        viewOrEdit: value,
        selectedRecordBeneStatus: record.beneStatus,
        selectedRecordComment: record.comments.join(' '),
      }),
    )
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
      handleBeneficiaryFilters({
        ...appliedFilters,
        values,
        beneficiaryId: undefined,
        beneReference: undefined,
      }),
    )
    dispatch(
      getBeneficiaries(
        {
          ...values,
          beneficiaryId: undefined,
          beneReference: undefined,
        },
        token,
      ),
    )
  }

  onSubmitSearch = e => {
    const { form, dispatch, beneficiaryDetails, token, appliedFilters } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const bene = beneficiaryDetails.find(el => el.beneReference === values.beneReference)
        const value = {
          page: 1,
          limit: 10,
          beneficiaryId: bene ? bene.id : '',
          beneReference: values.beneReference,
        }
        dispatch(
          handleBeneficiaryFilters({
            ...appliedFilters,
            ...values,
            beneficiaryId: bene ? bene.id : '',
            beneReference: values.beneReference,
          }),
        )
        dispatch(getBeneficiaries(value, token))
      }
    })
  }

  getSearchUI = () => {
    const { visibleSearch } = this.state
    const { form, beneficiaryDetails } = this.props
    const { getFieldDecorator } = form
    const clientOption = beneficiaryDetails.map(option => (
      <Option key={option.id} label={option.beneReference} value={option.beneReference}>
        <h5>{option.beneReference}</h5>
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className="mb-2 mt-4 pl-4">
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
    const value = {
      page: 1,
      limit: 10,
    }
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    dispatch(handleBeneficiaryFilters({}))
    dispatch(handlePagination(pagination))
    this.setState({ filters: {}, isVendorDisabled: false, isClientDisabled: false })
    dispatch(getBeneficiaries(value, token))
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
        dispatch(handleBeneficiaryFilters(values))
        dispatch(handlePagination(pagination))
        values.page = 1
        values.limit = 10
        dispatch(getBeneficiaries(values, token))
        this.setState({ filters: values })
      }
    })
    this.onClose()
  }

  onChangeSelectClient = () => {
    this.setState({
      isVendorDisabled: true,
    })
  }

  onChangeSelectVendor = () => {
    this.setState({
      isClientDisabled: true,
    })
  }

  getFilterDrawer = () => {
    const { visibleFilter, isClientDisabled, isVendorDisabled } = this.state
    const { form, beneficiaries, currencies, clients, vendors } = this.props
    const { getFieldDecorator } = form
    const clientsOption = clients.map(option => (
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
    const beneficiaryOption = beneficiaries.map(option => (
      <Option key={option.id} label={option.bankAccountDetails.nameOnAccount} value={option.id}>
        <h5>{option.bankAccountDetails.nameOnAccount}</h5>
        <small>{option.bankAccountDetails.bankAccountCurrency}</small>
      </Option>
    ))
    const beneTypeOption = beneficiaryTypes.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    const beneStatusOption = beneStatus.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    return (
      <Drawer
        title="Beneficiary"
        width={600}
        onClose={this.onClose}
        visible={visibleFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Client Name">
                {getFieldDecorator('clientId', { initialValue: undefined })(
                  <Select
                    showSearch
                    placeholder="Search by Client Name"
                    optionLabelProp="label"
                    disabled={isClientDisabled}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={() => this.setState({ isVendorDisabled: true })}
                  >
                    {clientsOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Vendor Name">
                {getFieldDecorator('vendorId', { initialValue: undefined })(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    placeholder="Search by Vendor Name"
                    disabled={isVendorDisabled}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={() => this.setState({ isClientDisabled: true })}
                  >
                    {vendorOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Beneficiary Name">
                {getFieldDecorator(
                  'nameOnAccount',
                  {},
                )(
                  <Select
                    showSearch
                    placeholder="Search by Beneficiary Name"
                    optionFilterProp="label"
                    optionLabelProp="label"
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {beneficiaryOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Beneficiary Reference">
                {getFieldDecorator(
                  'beneReference',
                  {},
                )(<Input placeholder="Enter Beneficiary reference" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Beneficiary Type">
                {getFieldDecorator(
                  'beneficiaryType',
                  {},
                )(
                  <Select showSearch placeholder="Select Beneficiary Type">
                    {beneTypeOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Bank Account Currency">
                {getFieldDecorator(
                  'bankAccountCurrency',
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
              <Form.Item label="Account Number">
                {getFieldDecorator(
                  'accountNumber',
                  {},
                )(<Input placeholder="Enter the account number" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Bic/Swift">
                {getFieldDecorator('bicswift', {})(<Input placeholder="Enter bic/swift" />)}
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

  onSelectRowItem = id => {
    this.setState({ rowItem: id })
  }

  handleTableChange = pagination => {
    const { dispatch, token, appliedFilters } = this.props
    dispatch(handlePagination(pagination))
    dispatch(
      getBeneficiaries(
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
      dispatch(getBulkDownloadDataForBeneficiary(values))
    } else {
      filters.page = current
      filters.limit = pageSize
      filters.token = token
      dispatch(getBulkDownloadDataForBeneficiary(filters))
    }
  }

  getDownload = data => {
    const { visibleDownload, downloadValue } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <div hidden={!visibleDownload} className="mt-4 pl-4">
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
                  'Client / Vendor Name',
                  'Name On Account',
                  'Beneficiary Type',
                  'Beneficiary Currency',
                  'Bank Account Number',
                  'Bic/Swift',
                  'Status',
                ]}
                data={data}
                fileName="Beneficiaries"
                isPrimaryButtonVisible
                primaryButtonName="Download"
              />
            }
          </Form.Item>
        </Form>
      </div>
    )
  }

  handleOnStatusChange = () => {
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
        updatedStatus: '',
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
        onOk={() => this.handleOnStatusChange()}
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
    const { loading, beneficiaryDetails, pagination, downloadData } = this.props
    const { rowItem } = this.state
    const columns = [
      {
        title: 'Beneficiary Reference',
        dataIndex: 'beneReference',
        key: 'beneReference',
        align: 'center',
      },
      {
        title: 'Client/Vendor Name',
        dataIndex: 'clientOrVendor',
        key: 'clientName',
        align: 'center',
      },
      {
        title: 'Name on Account',
        dataIndex: 'bankAccountDetails.nameOnAccount',
        key: 'nameOnAccount',
        align: 'center',
        width: 150,
        ellipsis: true,
      },
      {
        title: 'Beneficiary Type',
        dataIndex: 'beneficiaryDetails.beneficiaryType',
        key: 'beneficiaryType',
        align: 'center',
        render: value => beneficiaryTypes.map(res => res.value === value && res.label),
      },
      {
        title: 'Beneficiary Currency',
        dataIndex: 'bankAccountDetails.bankAccountCurrency',
        key: 'bankAccountCurrency',
        align: 'center',
      },
      {
        title: 'Bank Account Number',
        dataIndex: 'bankAccountDetails.accountNumber',
        key: 'accountNumber',
        align: 'center',
      },
      {
        title: 'Bic/Swift',
        dataIndex: 'bankAccountDetails.bicswift',
        key: 'bicswift',
        align: 'center',
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
              <Button onClick={() => this.navigateToBeneficiary(record, 'Edit')} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button onClick={() => this.navigateToBeneficiary(record, 'View')} type="link">
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
        <Menu.Item
          onClick={() =>
            this.setState(prevState => ({
              visibleSearch: !prevState.visibleSearch,
            }))
          }
        >
          <Icon type="search" />
          <span className="pr-4"> Search </span>
        </Menu.Item>
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
              <span className="font-size-16">Beneficiary List</span>
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
                onClick={this.onDeleteBeneficiary}
              >
                Delete
                <Icon type="close" />
              </Button>
              <Button
                hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length < 2}
                type="primary"
                className="ml-3"
                onClick={this.onBulkDeleteBeneficiaries}
              >
                Bulk Delete
                <Icon type="close" />
              </Button>
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
            {downloadData.forEach(beneficiary => {
              const beneficiaryData = []
              beneficiaryData.push({
                value: beneficiary.beneReference ? beneficiary.beneReference : nullSymbol,
              })
              beneficiaryData.push({
                value: beneficiary.clientOrVendor ? beneficiary.clientOrVendor : nullSymbol,
              })
              beneficiaryData.push({
                value:
                  beneficiary.bankAccountDetails &&
                  beneficiary.bankAccountDetails.nameOnAccount !== undefined
                    ? beneficiary.bankAccountDetails.nameOnAccount
                    : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              beneficiaryData.push({
                value:
                  beneficiary.beneficiaryDetails &&
                  beneficiary.beneficiaryDetails.beneficiaryType !== undefined
                    ? beneficiary.beneficiaryDetails.beneficiaryType
                    : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              beneficiaryData.push({
                value:
                  beneficiary.bankAccountDetails &&
                  beneficiary.bankAccountDetails.bankAccountCurrency !== undefined
                    ? beneficiary.bankAccountDetails.bankAccountCurrency
                    : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              beneficiaryData.push({
                value:
                  beneficiary.bankAccountDetails &&
                  beneficiary.bankAccountDetails.accountNumber !== undefined
                    ? beneficiary.bankAccountDetails.accountNumber
                    : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              beneficiaryData.push({
                value:
                  beneficiary.bankAccountDetails &&
                  beneficiary.bankAccountDetails.bicswift !== undefined
                    ? beneficiary.bankAccountDetails.bicswift
                    : nullSymbol,
                style: { numFmt: '0,0.00' },
              })
              beneficiaryData.push({
                value:
                  beneficiary.beneStatus && beneficiary.beneStatus !== undefined
                    ? beneficiary.beneStatus
                    : nullSymbol,
                style: { alignment: { horizontal: 'center' } },
              })
              data.push(beneficiaryData)
            })}
            {this.getSearchUI()}
            {this.getFilterDrawer()}
            {this.getDownload(data)}
            {this.statusModel()}
            <div className="row">
              <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
                <Skeleton loading={loading} active>
                  <Spin tip="loading..." spinning={loading}>
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
                      dataSource={beneficiaryDetails}
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

export default Beneficiary
