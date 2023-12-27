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
  getCustomerSummaryReport,
  handleCustomerSummaryReportFilters,
} from '../../../../redux/reports/customerSummaryReport/actions'
import styles from './style.module.scss'

import CustomizeValue from '../../customizeValue/index'

import DownloadUI from '../../downloadComponents/downloadUI'

import {
  ClearFilterOnComponentUnMount,
  dateRangeResetTheTime,
  dateRangeResetAfterReset,
} from '../../../../utilities/transformer'

const mapStateToProps = ({ user, customerSummaryReport, settings, general }) => ({
  timeZone: settings.timeZone.value,
  token: user.token,
  customerSummaryReport: customerSummaryReport.customerSummaryReport,
  dynamicTableColumns: customerSummaryReport.tableColumns,
  loading: customerSummaryReport.loading,
  clients: general.clients,
  currencies: general.currencies,
  allCustomerSummaryReportDownload: customerSummaryReport.allCustomerSummaryReportDownload,
  isDownloadDisabled: customerSummaryReport.isDownloadDisabled,
  customizeValuePropsData: customerSummaryReport.customizeColumnData,
  initialReportData: customerSummaryReport.reportData,
  reportColumnHeaders: customerSummaryReport.reportColumnHeaders,
  appliedFilters: customerSummaryReport.appliedCustomerSummaryReportFilters,
})

const { Option } = Select
const { RangePicker } = DatePicker

@Form.create()
@connect(mapStateToProps)
class CustomerSummaryReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleDownload: false,
      toggleDefaultFilter: false,
      toggleCustomizeColumn: false,
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
    dispatch(getCustomerSummaryReport(value))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    ClearFilterOnComponentUnMount('', handleCustomerSummaryReportFilters, dispatch)
  }

  onReset = () => {
    const { form, token, dispatch } = this.props
    form.setFieldsValue({
      customerName: undefined,
      depositCurrency: undefined,
      period: ['yearly', 'monthly'],
      dateAndTime: undefined,
    })
    const value = {
      token,
    }
    dispatch(handleCustomerSummaryReportFilters({}))
    dispatch(getCustomerSummaryReport(value))
  }

  onSubmitFilter = e => {
    e.preventDefault()
    const { form, dispatch, token } = this.props
    form.setFieldsValue({
      radioGroup: 'current',
    })
    form.validateFields((err, values) => {
      if (!err) {
        const value = {
          clientId: values.customerName ? values.customerName : '',
          depositCurrency: values.depositCurrency ? values.depositCurrency : '',
          dateAndTime: values.dateAndTime,
          dateFrom: values.dateAndTime
            ? values.dateAndTime[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
            : '',
          dateTo: values.dateAndTime
            ? values.dateAndTime[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
            : '',
          period: this.getPeriod(values.period),
          token,
        }

        form.setFieldsValue({
          period: this.getPeriod(values.period),
        })

        dispatch(handleCustomerSummaryReportFilters(value))
        dispatch(getCustomerSummaryReport(value))
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

  disabledDate = current => {
    return current < moment().subtract(4, 'months') || current > moment().endOf('day')
  }

  defaultFilters = () => {
    const { form, currencies, clients, appliedFilters } = this.props
    const { toggleDefaultFilter } = this.state
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
              <Form.Item label="Select Customer Name:" style={{ width: '100%' }}>
                {getFieldDecorator('customerName', {
                  initialValue: appliedFilters.clientId || undefined,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Filter by Customer Name"
                    optionLabelProp="label"
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {clientOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Form.Item label="Select Currency:" style={{ width: '100%' }}>
                {getFieldDecorator('depositCurrency', {
                  initialValue: appliedFilters.depositCurrency || undefined,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Filter by Currency"
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
                  initialValue: appliedFilters.period || ['yearly', 'monthly'],
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
                    disabledDate={this.disabledDate}
                    onCalendarChange={evt =>
                      dateRangeResetAfterReset(evt, appliedFilters.dateAndTime)
                    }
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss'),
                      ],
                    }}
                    onChange={dateRangeResetTheTime}
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
                <Button style={{ width: '100%' }} type="primary" ghost onClick={this.onReset}>
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  getColumnHeadersForDownload = columns => {
    const cols = []

    for (let column = 0; column < columns.length; column += 1) {
      if (columns[column].children) {
        for (
          let childrenColumns = 1;
          childrenColumns < columns[column].children.length;
          childrenColumns += 1
        ) {
          cols.push(columns[column].children[childrenColumns].title)
        }
      } else {
        cols.push(columns[column].title)
      }
    }

    return cols
  }

  onFilter = value => {
    this.setState({
      customizeValueState: value,
    })
  }

  render() {
    const nullSymbol = 0

    const {
      customerSummaryReport,
      allCustomerSummaryReportDownload,
      dynamicTableColumns,
      loading,
      initialReportData,
      reportColumnHeaders,
      customizeValuePropsData,
      form,
      dispatch,
    } = this.props
    const {
      toggleDefaultFilter,
      visibleDownload,
      toggleCustomizeColumn,
      customizeValueState,
    } = this.state

    const data = []
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
        <Menu.Item
          className="mr-3"
          onClick={() =>
            this.setState(prevState => ({
              toggleCustomizeColumn: !prevState.toggleCustomizeColumn,
            }))
          }
        >
          <Icon type="table" className="mr-3" />
          Customize Value
        </Menu.Item>
      </Menu>
    )

    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Customer Summary Report</span>
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
        <Helmet title="Customer Summary Report" />
        <div className={styles.block}>
          {allCustomerSummaryReportDownload.forEach(report => {
            const reportData = []
            Object.entries(report).forEach(([key, value]) => {
              if (typeof value === 'string') {
                reportData.push({
                  value: value || nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
              } else if (
                key === 'year' ||
                key === 'grandNoOfTrades' ||
                key === 'week' ||
                key === 'numberOfTrades'
              ) {
                reportData.push({
                  value: value || nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
              } else {
                reportData.push({
                  value: value || nullSymbol,
                  style: { alignment: { horizontal: 'center' }, numFmt: '0,0.00' },
                })
              }
            })
            data.push(reportData)
          })}
          <div>
            {(toggleDefaultFilter || visibleDownload || toggleCustomizeColumn) && (
              <div className={`d-flex ${styles.closeBtn}`}>
                <Tooltip title="close">
                  <Icon
                    type="close"
                    onClick={() =>
                      this.setState({
                        toggleDefaultFilter: false,
                        visibleDownload: false,
                        toggleCustomizeColumn: false,
                      })
                    }
                  />
                </Tooltip>
              </div>
            )}
            {this.defaultFilters()}
            <CustomizeValue
              type="Customer Summary Report"
              reportData={initialReportData}
              reportTableColumn={reportColumnHeaders}
              staticCustomizeValue={customizeValuePropsData}
              customizeValueData={customizeValueState}
              toggleCustomizeValue={toggleCustomizeColumn}
              filteredData={this.onFilter}
              isClientServiceNeeded
              dispatch={dispatch}
            />
            <DownloadUI
              titleForDownload="Customer Summary"
              reportType="Ops report"
              toggleDownload={!visibleDownload}
              isDownloadDisabled={false}
              downloadData={data}
              downloadColumnHeaders={this.getColumnHeadersForDownload(dynamicTableColumns)}
              currentValue="current"
              form={form}
            />
          </div>
          <div className="row">
            <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
              <Skeleton loading={loading} active>
                <Spin tip="Loading..." spinning={loading}>
                  <Table
                    className={styles.reportTable}
                    columns={dynamicTableColumns}
                    rowKey={record => record.id}
                    dataSource={customerSummaryReport}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ['10', '25', '50', '100'],
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
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

export default CustomerSummaryReport
