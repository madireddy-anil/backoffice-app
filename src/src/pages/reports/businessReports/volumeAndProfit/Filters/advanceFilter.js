/**
 *
 * @function AdvanceFilters ( requires default filters as parent component undirectly )
 *
 * @props
 *    form : form ( Mandatory prop ),
 *    toggleAdvFilter : boolean
 *    closeAdvFilter  : boolean,
 *    onReset  : function,
 *    onSubmit : function,
 *
 */
import React from 'react'

import { Form, Row, Col, DatePicker, Button, Drawer, Select, Input } from 'antd'

import { connect } from 'react-redux'

import moment from 'moment'

import { disabledFutureDate } from 'utilities/transformer'

import {
  dateRangeResetTheTime,
  dateRangeResetAfterReset,
} from '../../../../../utilities/transformer'

const { RangePicker } = DatePicker
const { Option } = Select

const mapStateToProps = ({ general }) => ({
  clients: general.clients,
  currencies: general.currencies,
})

function AdvanceFilters(props) {
  const {
    form,
    currencies,
    toggleAdvFilter,
    closeAdvFilter,
    onReset,
    onSubmitFilter,
    clients,
    appliedFilters,
  } = props

  const depositDateHandler = evt => {
    form.setFieldsValue({
      DateOfInitiate: null,
    })
    dateRangeResetTheTime(evt)
  }

  const initiateDateHandler = evt => {
    form.setFieldsValue({
      DateOfDeposit: null,
    })
    dateRangeResetTheTime(evt)
  }

  const getFilterDrawer = () => {
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
      <Drawer
        title="Filter Trades"
        width={600}
        onClose={closeAdvFilter}
        visible={toggleAdvFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <div className="p-1">
          <Form layout="vertical" onSubmit={onSubmitFilter}>
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item label="Trade Id">
                  {getFieldDecorator('tradeReference', {
                    initialValue: undefined,
                  })(<Input placeholder="Filter by Trade Id" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Initiation Date Time">
                  {getFieldDecorator('DateOfInitiate')(
                    <RangePicker
                      disabledDate={disabledFutureDate}
                      style={{ width: '258px !important', margin: '0px' }}
                      ranges={{
                        Today: [moment(), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                      }}
                      showTime={{
                        defaultValue: [
                          moment('00:00:00', 'HH:mm:ss'),
                          moment('23:59:59', 'HH:mm:ss'),
                        ],
                      }}
                      onCalendarChange={evt =>
                        dateRangeResetAfterReset(evt, appliedFilters.DateOfInitiate)
                      }
                      onChange={initiateDateHandler}
                      format="YYYY/MM/DD HH:mm:ss"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item label="Deposit Date Time">
                  {getFieldDecorator('DateOfDeposit')(
                    <RangePicker
                      disabledDate={disabledFutureDate}
                      style={{ width: '258px !important', margin: '0px' }}
                      ranges={{
                        Today: [moment(), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                      }}
                      showTime={{
                        defaultValue: [
                          moment('00:00:00', 'HH:mm:ss'),
                          moment('23:59:59', 'HH:mm:ss'),
                        ],
                      }}
                      onCalendarChange={evt =>
                        dateRangeResetAfterReset(evt, appliedFilters.DateOfDeposit)
                      }
                      onChange={depositDateHandler}
                      format="YYYY/MM/DD HH:mm:ss"
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Customer Name">
                  {getFieldDecorator('customerName', {
                    initialValue: undefined,
                  })(
                    <Select
                      showSearch
                      placeholder="Filter by Customer Name"
                      optionLabelProp="label"
                      filterOption={(input, option) =>
                        option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {clientOption}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item label="Deposit Currency">
                  {getFieldDecorator('depositCurrency', {
                    initialValue: undefined,
                  })(
                    <Select
                      showSearch
                      placeholder="Search by deposit Currency"
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
              <Col span={12}>
                <Form.Item label="Deposit Amount">
                  {getFieldDecorator('depositAmount', {
                    initialValue: undefined,
                  })(<Input placeholder="Filter by Local Currency Amount" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item label="Settlement Currency">
                  {getFieldDecorator('settlementCurrency', {
                    initialValue: undefined,
                  })(
                    <Select
                      showSearch
                      placeholder="Search by Settlement Currency"
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
              <Col span={12}>
                <Form.Item label="Settlement Amount">
                  {getFieldDecorator('settlementAmount', {
                    initialValue: undefined,
                  })(<Input placeholder="Filter by Settlement Amount" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col span={12}>
                <Form.Item label="Status">
                  {getFieldDecorator('status', {
                    initialValue: undefined,
                  })(
                    <Select showSearch placeholder="Please choose the status">
                      <Option value="completed">COMPLETED</Option>
                      <Option value="funds_remitted">FUNDS REMITTED</Option>
                      <Option value="quote_confirmed">QUOTE CONFIRMED</Option>
                      <Option value="deposits_confirmed">DEPOSITS CONFIRMED</Option>
                      <Option value="accounts_provided">ACCOUNTS PROVIDED</Option>
                      <Option value="accounts_requested">ACCOUNTS REQUESTED</Option>
                      <Option value="new">NEW</Option>
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
              <Button onClick={closeAdvFilter} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button className="mr-2" type="primary" ghost onClick={onReset}>
                Reset
              </Button>
              <Button htmlType="submit" type="primary" onClick={onSubmitFilter}>
                Filter
              </Button>
            </div>
          </Form>
        </div>
      </Drawer>
    )
  }

  return <React.Fragment>{getFilterDrawer()}</React.Fragment>
}

export default connect(mapStateToProps)(AdvanceFilters)
