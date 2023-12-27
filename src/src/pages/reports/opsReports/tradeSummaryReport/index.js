import React, { Component } from 'react'
import {
  Card,
  Table,
  Col,
  Row,
  Icon,
  Form,
  Menu,
  Dropdown,
  Select,
  Spin,
  Skeleton,
  Button,
  Tooltip,
  DatePicker,
} from 'antd'

import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import SubMenu from 'antd/lib/menu/SubMenu'

import {
  handleTradeSummaryReport,
  handleTradeSummaryReportFilter,
} from '../../../../redux/reports/tradeSummaryReport/actions'

import {
  ClearFilterOnComponentUnMount,
  dateRangeResetTheTime,
  dateRangeResetAfterReset,
} from '../../../../utilities/transformer'

import CustomizeValue from '../../customizeValue/index'

import DownloadUI from '../../downloadComponents/downloadUI'

const mapStateToProps = ({ general, user, tradeSummaryReport }) => ({
  currencies: general.currencies,
  token: user.token,
  tradeSummaryReportData: tradeSummaryReport.data,
  loading: tradeSummaryReport.isLoading,
  tableColumns: tradeSummaryReport.tableColumns,
  allTradeSummaryReportDownload: tradeSummaryReport.allTradeSummaryReportDownload,
  downloadColumnHeaders: tradeSummaryReport.downloadColumnHeaders,
  reportDataValue: tradeSummaryReport.reportData,
  reportTableColumn: tradeSummaryReport.reportTableColumn,
  customizeValueData: tradeSummaryReport.customizeValue,
  appliedFilters: tradeSummaryReport.appliedTradeSummaryReportFilters,
})

const { Option } = Select
const { RangePicker } = DatePicker

@connect(mapStateToProps)
@Form.create()
class TradeSummaryReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleFilter: false,
      visibleDownload: false,
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
    dispatch(handleTradeSummaryReport(value))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    ClearFilterOnComponentUnMount('', handleTradeSummaryReportFilter, dispatch)
  }

  handleFilterOnClear = () => {
    const { form, dispatch, token } = this.props
    form.setFieldsValue({
      period: ['yearly', 'monthly'],
      dateAndTime: undefined,
      currency: undefined,
    })
    const value = {
      token,
    }
    dispatch(handleTradeSummaryReportFilter({}))
    dispatch(handleTradeSummaryReport(value))
  }

  disabledDate = current => {
    return current < moment().subtract(4, 'months') || current > moment().endOf('day')
  }

  getFilter = () => {
    const { visibleFilter } = this.state
    const { form, currencies, appliedFilters } = this.props
    const { getFieldDecorator } = form
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <div hidden={!visibleFilter} className="m-4 pl-2">
        <Form layout="inline" onSubmit={this.handleFilterSubmit} wrapperCol={{ span: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Form.Item label="Select Currency: " style={{ width: '100%' }}>
                {getFieldDecorator('currency', {
                  initialValue: appliedFilters.currency || undefined,
                })(
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Search by Currency"
                    optionFilterProp="children"
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
                    style={{ width: '258px !important', margin: '0px' }}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    onCalendarChange={evt =>
                      dateRangeResetAfterReset(evt, appliedFilters.dateAndTime)
                    }
                    onChange={dateRangeResetTheTime}
                    disabledDate={this.disabledDate}
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
                  onClick={() => this.handleFilterOnClear()}
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

  handleFilterSubmit = e => {
    e.preventDefault()
    const { form, dispatch, token } = this.props
    form.validateFields((err, value) => {
      if (!err) {
        const values = {
          period: this.getPeriod(value.period),
          currency: value.currency,
          dateAndTime: value.dateAndTime,
          dateFrom: value.dateAndTime
            ? value.dateAndTime[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
            : '',
          dateTo: value.dateAndTime
            ? value.dateAndTime[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
            : '',
          token,
        }

        form.setFieldsValue({
          period: this.getPeriod(value.period),
        })

        dispatch(handleTradeSummaryReportFilter(values))
        dispatch(handleTradeSummaryReport(values))
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

  getColumnHeadersForDownload = columns => {
    const cols = []

    for (let i = 0; i < columns.length; i += 1) {
      if (columns[i].children) {
        for (let j = 1; j < columns[i].children.length; j += 1) {
          cols.push(columns[i].children[j].title)
        }
      } else {
        cols.push(columns[i].title)
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
    const {
      tradeSummaryReportData,
      loading,
      tableColumns,
      allTradeSummaryReportDownload,
      reportDataValue,
      reportTableColumn,
      customizeValueData,
      form,
      dispatch,
    } = this.props
    const { visibleFilter, visibleDownload, toggleCustomizeValue, customizeValueState } = this.state
    const nullSymbol = 0
    const data = []
    const settingsMenu = (
      <Menu>
        <Menu.Item
          onClick={() =>
            this.setState(prevState => ({
              visibleFilter: !prevState.visibleFilter,
            }))
          }
        >
          <Icon
            type="filter"
            onClick={() =>
              this.setState(prevState => ({
                visibleFilter: !prevState.visibleFilter,
              }))
            }
          />
          Filter
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
              toggleCustomizeValue: !prevState.toggleCustomizeValue,
            }))
          }
        >
          <Icon
            type="table"
            className="mr-3"
            onClick={() =>
              this.setState(prevState => ({
                toggleCustomizeValue: !prevState.toggleCustomizeValue,
              }))
            }
          />
          Customize Value
        </Menu.Item>
      </Menu>
    )

    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Trade Summary Report</span>
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
            <Dropdown overlay={settingsMenu} trigger={['click']}>
              <Icon type="setting" />
            </Dropdown>
          </div>
        }
      >
        {allTradeSummaryReportDownload.forEach(report => {
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
          {(visibleFilter || visibleDownload || toggleCustomizeValue) && (
            <div className="d-flex justify-content-end" style={{ padding: '10px 25px 0 0' }}>
              <Tooltip title="close">
                <Icon
                  type="close"
                  onClick={() =>
                    this.setState({
                      visibleFilter: false,
                      visibleDownload: false,
                      toggleCustomizeValue: false,
                    })
                  }
                />
              </Tooltip>
            </div>
          )}
          {this.getFilter()}
          <CustomizeValue
            type="Trade Summary Report"
            reportData={reportDataValue}
            reportTableColumn={reportTableColumn}
            customizeValueData={customizeValueState}
            staticCustomizeValue={customizeValueData}
            toggleCustomizeValue={toggleCustomizeValue}
            isClientServiceNeeded={false}
            filteredData={this.onFilter}
            dispatch={dispatch}
          />
          <DownloadUI
            titleForDownload="Trade Summary"
            reportType="Ops report"
            toggleDownload={!visibleDownload}
            isDownloadDisabled={false}
            downloadData={data}
            downloadColumnHeaders={this.getColumnHeadersForDownload(tableColumns)}
            currentValue="current"
            form={form}
          />
        </div>
        <Helmet title="Customer" />
        <div className="row">
          <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
            <Skeleton loading={loading} active>
              <Spin tip="Loading..." spinning={loading}>
                <Table
                  columns={tableColumns}
                  dataSource={tradeSummaryReportData}
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
      </Card>
    )
  }
}
export default TradeSummaryReport
