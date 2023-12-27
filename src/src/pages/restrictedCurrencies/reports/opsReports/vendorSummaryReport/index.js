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
  Dropdown,
  Menu,
  Row,
  Col,
  Select,
  DatePicker,
} from 'antd'

import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import SubMenu from 'antd/lib/menu/SubMenu'
import {
  getVendorSummaryReport,
  handleVendorSummarySplitReportFilter,
} from '../../../../redux/reports/vendorSummaryReport/actions'
import styles from './style.module.scss'
import { disabledFutureDate } from '../../../../utilities/transformer'

import DownloadUI from '../../downloadComponents/downloadUI'
import CustomizeValue from '../../customizeValue/index'

const mapStateToProps = ({ user, vendorSummaryReport, settings, general }) => ({
  timeZone: settings.timeZone.value,
  token: user.token,
  vendorSummaryReport: vendorSummaryReport.reportData,
  tableColumns: vendorSummaryReport.reportTableColumns,
  downloadColumnHeaders: vendorSummaryReport.downloadColumnHeaders,
  loading: vendorSummaryReport.isLoading,
  vendors: general.newVendors,
  currencies: general.currencies,
  allvendorSummaryReportDownload: vendorSummaryReport.allvendorSummaryReportDownload,
  staticDownloadData: vendorSummaryReport.initialDownloadData,
  isDownloadDisabled: vendorSummaryReport.isDownloadDisabled,
  customizeValueData: vendorSummaryReport.customizeValues,
  initialReportData: vendorSummaryReport.initialData,
  initialTableColumn: vendorSummaryReport.initialTableColumn,
  appliedFilters: vendorSummaryReport.appliedVendorSummarySplitReportFilters,
})

// const { RangePicker } = DatePicker
const { Option } = Select
const { RangePicker } = DatePicker

@Form.create()
@connect(mapStateToProps)
class VendorSummaryReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleDownload: false,
      toggleDefaultFilter: false,
      toggleCustomizeValue: false,
      customizeValueState: {},
    }
  }

  componentDidMount() {
    const { dispatch, token, appliedFilters, form } = this.props
    const value = {
      ...appliedFilters,
      token,
    }
    let filterDates
    if (appliedFilters.dateAndTime) {
      filterDates = appliedFilters.dateAndTime
      filterDates[0] = moment(filterDates[0], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
      filterDates[1] = moment(filterDates[1], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
    }
    form.setFieldsValue({ ...appliedFilters, dateAndTime: filterDates })
    dispatch(getVendorSummaryReport(value))
  }

  onReset = () => {
    const { form, token, dispatch } = this.props

    form.setFieldsValue({
      vendorName: undefined,
      depositCurrency: undefined,
      dateOfDeposit: undefined,
    })
    const values = {
      token,
    }
    dispatch(getVendorSummaryReport(values))
  }

  onSubmitFilter = e => {
    e.preventDefault()
    const { form, dispatch, token } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const value = {
          vendorId: values.vendorName ? values.vendorName : '',
          depositCurrency: values.depositCurrency ? values.depositCurrency : '',
          period: this.getPeriod(values.period),
          dateAndTime: values.dateAndTime,
          dateFrom: values.dateAndTime
            ? values.dateAndTime[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
            : '',
          dateTo: values.dateAndTime
            ? values.dateAndTime[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
            : '',
          token,
        }
        form.setFieldsValue({
          radioGroup: 'current',
          period: this.getPeriod(values.period),
        })
        dispatch(handleVendorSummarySplitReportFilter(values))
        dispatch(getVendorSummaryReport(value))
      }
    })
  }

  getPeriod = value => {
    if (value.includes('weekly')) {
      return ['yearly', 'monthly', 'weekly']
    }

    if (value.includes('monthly')) {
      return ['yearly', 'monthly']
    }

    if (value.includes('yearly')) {
      return ['yearly']
    }

    return ['yearly', 'monthly']
  }

  defaultFilters = () => {
    const { form, currencies, vendors, appliedFilters } = this.props
    const { toggleDefaultFilter } = this.state
    const { getFieldDecorator } = form

    const vendorOption = vendors.map(option => (
      <Option key={option.id} label={option.genericInformation?.tradingName} value={option.id}>
        <h5>{option.genericInformation?.tradingName}</h5>
        <small>{option.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))

    return (
      <div hidden={!toggleDefaultFilter} className="p-4">
        <Form layout="inline" onSubmit={this.onSubmitFilter} wrapperCol={{ span: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Form.Item label="Select Vendor Name:" style={{ width: '100%' }}>
                {getFieldDecorator('vendorName', {
                  initialValue: appliedFilters.vendorId || undefined,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Filter by vendor Name"
                    optionLabelProp="label"
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {vendorOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Form.Item label="Deposit Currency:" style={{ width: '100%' }}>
                {getFieldDecorator('depositCurrency', {
                  initialValue: appliedFilters.depositCurrency || undefined,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Filter by Deposit Currency"
                    optionFilterProp="children"
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Form.Item label="Select Period:" style={{ width: '100%' }}>
                {getFieldDecorator('period', {
                  initialValue: ['yearly', 'monthly'],
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Search by Period"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option key="0" value="yearly">
                      Yearly
                    </Option>
                    <Option key="1" value="monthly">
                      Monthly
                    </Option>
                    <Option key="2" value="weekly">
                      Weekly
                    </Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Form.Item label="Select Date Range :" style={{ width: '100%', marginTop: '3px' }}>
                {getFieldDecorator('dateAndTime')(
                  <RangePicker
                    style={{ width: '258px !important' }}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    disabledDate={disabledFutureDate}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss'),
                      ],
                    }}
                    format="YYYY/MM/DD HH:mm:ss"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 3 }}>
              <Form.Item style={{ width: '100%' }}>
                <Button style={{ width: '100%' }} type="primary" htmlType="submit">
                  filter
                </Button>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 3 }}>
              <Form.Item style={{ width: '100%' }}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  ghost
                  onClick={() => this.handleFilterOnReset()}
                >
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  handleFilterOnReset = () => {
    const { form, dispatch, token } = this.props
    form.setFieldsValue({
      period: ['yearly', 'monthly'],
      dateAndTime: undefined,
      depositCurrency: undefined,
      vendorName: undefined,
    })
    dispatch(handleVendorSummarySplitReportFilter({}))
    dispatch(getVendorSummaryReport({ token }))
  }

  onFilter = value => {
    this.setState({
      customizeValueState: value,
    })
  }

  getColumnHeadersForDownload = columns => {
    const cols = []

    for (let column = 0; column < columns.length; column += 1) {
      if (columns[column].children) {
        for (
          let childrenColumns = 0;
          childrenColumns < columns[column].children.length;
          childrenColumns += 1
        ) {
          cols.push(columns[column].children[childrenColumns].dataIndex)
        }
      } else {
        cols.push(columns[column].title)
      }
    }

    return cols
  }

  render() {
    const {
      vendorSummaryReport,
      tableColumns,
      loading,
      dispatch,
      initialReportData,
      initialTableColumn,
      customizeValueData,
      allvendorSummaryReportDownload,
      staticDownloadData,
      form,
    } = this.props

    const {
      toggleDefaultFilter,
      visibleDownload,
      toggleCustomizeValue,
      customizeValueState,
    } = this.state

    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item onClick={() => this.setState({ toggleDefaultFilter: !toggleDefaultFilter })}>
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
        <Menu.Item onClick={() => this.setState({ toggleCustomizeValue: !toggleCustomizeValue })}>
          <Icon type="table" />
          <span className="pr-4"> Customize Value </span>
        </Menu.Item>
      </Menu>
    )

    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Vendor Report (Grouped by vendor)</span>
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
            <Tooltip title="settings">
              <Dropdown overlay={settingsMenu} trigger={['click']}>
                <Icon type="setting" />
              </Dropdown>
            </Tooltip>
          </div>
        }
      >
        <Helmet title="Vendor Summary Report" />
        <div className={styles.block}>
          <div>
            {(toggleDefaultFilter || visibleDownload || toggleCustomizeValue) && (
              <div className={`d-flex ${styles.closeBtn}`}>
                <Tooltip title="close">
                  <Icon
                    type="close"
                    onClick={() =>
                      this.setState({
                        toggleDefaultFilter: false,
                        visibleDownload: false,
                        toggleCustomizeValue: false,
                      })
                    }
                  />
                </Tooltip>
              </div>
            )}
            {this.defaultFilters()}
          </div>
          <CustomizeValue
            type="Vendor Summary Report"
            reportData={initialReportData}
            reportTableColumn={initialTableColumn}
            staticCustomizeValue={customizeValueData}
            staticDownloadData={staticDownloadData}
            customizeValueData={customizeValueState}
            toggleCustomizeValue={toggleCustomizeValue}
            isClientServiceNeeded
            filteredData={this.onFilter}
            dispatch={dispatch}
          />
          <DownloadUI
            titleForDownload="Vendor Summary Report (Grouped by vendor)"
            reportType="Ops report"
            toggleDownload={!visibleDownload}
            isDownloadDisabled={false}
            downloadData={allvendorSummaryReportDownload}
            downloadColumnHeaders={this.getColumnHeadersForDownload(tableColumns)}
            currentValue="current"
            form={form}
          />
          <div className="row">
            <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
              <Skeleton loading={loading} active>
                <Spin tip="Loading..." spinning={loading}>
                  <Table
                    className={styles.reportTable}
                    columns={tableColumns}
                    rowKey={record => record.id}
                    dataSource={vendorSummaryReport}
                    scroll={{ x: 'max-content' }}
                    onChange={this.handleTableChange}
                    pagination={{
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ['10', '25', '50', '100'],
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    bordered
                  />
                </Spin>
              </Skeleton>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

export default VendorSummaryReport
