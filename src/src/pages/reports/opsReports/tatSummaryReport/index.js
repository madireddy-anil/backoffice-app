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
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import moment from 'moment'
import SubMenu from 'antd/lib/menu/SubMenu'
import { getTatReport, handleTatReportFilters } from 'redux/reports/tatSummaryReport/actions'
import CustomizeValue from '../../customizeValue/index'
import {
  disabledFutureDate,
  ClearFilterOnComponentUnMount,
  dateRangeResetTheTime,
  dateRangeResetAfterReset,
} from '../../../../utilities/transformer'

import styles from './style.module.scss'
import jsondata from './data.json'

import DownloadUI from '../../downloadComponents/downloadUI'

const mapStateToProps = ({ user, tatSummaryReport, general }) => ({
  token: user.token,
  allTatReport: tatSummaryReport.allTatReport,
  loading: tatSummaryReport.loading,
  clients: general.clients,
  vendors: general.newVendors,
  currencies: general.currencies,
  beneficiaries: general.beneficiaries,
  allTatReportDownload: tatSummaryReport.allTatReportDownload,
  isDownloadDisabled: tatSummaryReport.isDownloadDisabled,
  appliedFilters: tatSummaryReport.appliedTatReportFilters,
  reportDataValue: tatSummaryReport.reportData,
  customizeValueData: tatSummaryReport.customizeValue,
  reportColumnHeaders: tatSummaryReport.reportColumnHeaders,
  tableColumns: tatSummaryReport.reportTableColumn,
})

const { Option } = Select
const { RangePicker } = DatePicker

@Form.create()
@connect(mapStateToProps)
class TatSummaryReport extends Component {
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
      page: 1,
      limit: 10,
      token,
    }
    let filterDates
    if (appliedFilters.DateOfDeposit) {
      filterDates = appliedFilters.DateOfDeposit
      filterDates[0] = moment(filterDates[0], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
      filterDates[1] = moment(filterDates[1], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
    }
    form.setFieldsValue({ ...appliedFilters, filterDates })
    dispatch(getTatReport(value, token))
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    ClearFilterOnComponentUnMount('', handleTatReportFilters, dispatch)
  }

  setDefaultCheckedList = () => {
    const { initialColumns } = jsondata
    return initialColumns.map(column => {
      return column.value
    })
  }

  // Default Filters

  showDrawer = () => {
    this.setState({
      visibleFilter: true,
    })
  }

  onReset = () => {
    const { form, token, dispatch } = this.props
    form.setFieldsValue({
      clientId: undefined,
      depositCurrency: undefined,
      period: ['yearly', 'monthly'],
      dateAndTime: undefined,
    })
    const values = {
      token,
    }

    dispatch(handleTatReportFilters({}))
    dispatch(getTatReport(values, token))
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
          clientId: values.clientId,
          depositCurrency: values.depositCurrency,
          period: this.getPeriod(values.period),
          dateFrom: values.dateAndTime
            ? values.dateAndTime[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
            : '',
          dateTo: values.dateAndTime
            ? values.dateAndTime[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
            : '',
          token,
        }

        form.setFieldsValue({
          period: value.period,
        })

        dispatch(handleTatReportFilters(value))
        dispatch(getTatReport(value, token))
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
    const { form, currencies, clients, appliedFilters } = this.props
    const { visibleFilter } = this.state
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
      <div hidden={!visibleFilter} className="p-4">
        <Form layout="inline" onSubmit={this.onSubmitFilter} wrapperCol={{ span: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 8 }} lg={{ span: 6 }}>
              <Form.Item label="Select Customer Name:" style={{ width: '100%' }}>
                {getFieldDecorator('clientId', {
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
              <Form.Item label="Select Date Range :" style={{ width: '100%' }}>
                {getFieldDecorator('dateAndTime', {
                  initialValue: appliedFilters.dateAndTime,
                })(
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

  onFilter = value => {
    this.setState({
      customizeValueState: value,
    })
  }

  render() {
    const nullSymbol = '---'

    const {
      allTatReport,
      loading,
      allTatReportDownload,
      reportDataValue,
      customizeValueData,
      reportColumnHeaders,
      tableColumns,
      dispatch,
      form,
    } = this.props
    const { visibleFilter, visibleDownload, toggleCustomizeValue, customizeValueState } = this.state

    const data = []

    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item
          onClick={() =>
            this.setState(prevState => ({
              visibleFilter: !prevState.visibleFilter,
            }))
          }
        >
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
            <span className="font-size-16">TAT Summary Report (Grouped by Clients)</span>
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
        <Helmet title="TAT Summary Report (Grouped by Clients)" />
        <div className={styles.block}>
          {allTatReportDownload.forEach(report => {
            const reportData = []
            for (let i = 0; i < tableColumns.length; i += 1) {
              let isFilled = false
              Object.entries(report).forEach(([key, value]) => {
                if (tableColumns[i].dataIndex === key) {
                  isFilled = true
                  if (key === 'clientId') {
                    // Do Nothing.....
                  } else if (typeof value === 'string') {
                    if (key === 'tatPercentage') {
                      reportData.push({
                        value: parseFloat(value) || nullSymbol,
                        style: { alignment: { horizontal: 'center' }, numFmt: '0,0.00\\%' },
                      })
                    } else {
                      reportData.push({
                        value: value || nullSymbol,
                        style: { alignment: { horizontal: 'center' } },
                      })
                    }
                  } else if (key === 'week' || key === 'year' || key === 'numberOfTrades') {
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
                }
              })
              if (!isFilled) {
                reportData.push({
                  value: nullSymbol,
                  style: { alignment: { horizontal: 'center' } },
                })
              }
            }
            data.push(reportData)
          })}
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
          {this.defaultFilters()}
          <CustomizeValue
            type="TAT Summary Report"
            reportData={reportDataValue}
            reportTableColumn={reportColumnHeaders}
            staticCustomizeValue={customizeValueData}
            customizeValueData={customizeValueState}
            toggleCustomizeValue={toggleCustomizeValue}
            filteredData={this.onFilter}
            isClientServiceNeeded
            dispatch={dispatch}
          />
          <DownloadUI
            titleForDownload="Tat Summary (Grouped by Clients)"
            reportType="Ops report"
            toggleDownload={!visibleDownload}
            isDownloadDisabled={false}
            downloadData={data}
            downloadColumnHeaders={tableColumns}
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
                    dataSource={allTatReport}
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

export default TatSummaryReport
