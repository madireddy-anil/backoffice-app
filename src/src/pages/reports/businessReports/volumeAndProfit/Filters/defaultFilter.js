/**
 *
 *  @function DefaultFilters.
 *
 *  @props
 *    Form : form ( Mandatory prop ),
 *    toggleFilter : boolean,
 *    applyFilters : function : Calls With
 *        @param appliedFilters ( function will trigger when ever these onReset | onSubmit action is called )
 *
 */

import React from 'react'

import { Form, Row, Col, DatePicker, Button } from 'antd'

import moment from 'moment'

import { connect } from 'react-redux'

import {
  disabledFutureDate,
  restrictDateFor45Days,
  dateRangeResetTheTime,
  dateRangeResetAfterReset,
} from 'utilities/transformer'
import AdvanceFilter from './advanceFilter'
import {
  getVoluemAndProfit,
  handlePagination,
  handleVolumeAndProfitReportFilters,
} from '../../../../../redux/reports/volumeAndProfit/actions'

const mapStateToProps = ({ user }) => ({
  token: user.token,
})

const { RangePicker } = DatePicker

function DefaultFilters(props) {
  const {
    form,
    toggleFilter,
    token,
    dispatch,
    applyFilters,
    onFilterChange,
    appliedFilters,
  } = props
  const { getFieldDecorator } = form

  const [toggleAdvFilter, updateStateOfAdvFilter] = React.useState(false)

  const onReset = () => {
    form.setFieldsValue({
      customerName: null,
      status: null,
      tradeReference: null,
      depositCurrency: null,
      settlementCurrency: null,
      depositAmount: null,
      settlementAmount: null,
      DateOfInitiate: null,
      DateOfDeposit: null,
      downloadSelectedType: 'current',
      DateAndTimeForDownload: [],
    })
    dispatch(handleVolumeAndProfitReportFilters({ downloadSelectedType: 'current' }))
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    applyFilters({})
    onFilterChange()
    dispatch(handlePagination(pagination))
    dispatch(getVoluemAndProfit('', token))
  }

  const onSubmitFilter = e => {
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const value = {
          tradeReference: values.tradeReference,
          customerName: values.customerName,
          depositCurrency: values.depositCurrency,
          depositAmount: values.depositAmount,
          settlementCurrency: values.settlementCurrency,
          settlementAmount: values.settlementAmount,
          pcMargin: values.pcMargin,
          DateOfDeposit: values.DateOfDeposit,
          DateOfInitiate: values.DateOfInitiate,
          dateFromOfDeposit: values.DateOfDeposit
            ? values.DateOfDeposit[0]
              ? values.DateOfDeposit[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : 0
            : '',
          dateToOfDeposit: values.DateOfDeposit
            ? values.DateOfDeposit[1]
              ? values.DateOfDeposit[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : 0
            : '',
          dateFromOfInitiate: values.DateOfInitiate
            ? values.DateOfInitiate[0]
              ? values.DateOfInitiate[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : 0
            : '',
          dateToOfInitiate: values.DateOfInitiate
            ? values.DateOfInitiate[1]
              ? values.DateOfInitiate[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : 0
            : '',
          status: values.status,
          downloadSelectedType: 'current',
        }
        form.setFieldsValue({
          downloadSelectedType: 'current',
          DateAndTimeForDownload: restrictDateFor45Days(
            values.DateOfInitiate || values.DateOfDeposit,
          )
            ? values.DateOfInitiate || values.DateOfDeposit
            : undefined,
        })

        dispatch(handleVolumeAndProfitReportFilters(value))

        const pagination = {
          current: 1,
          total: 0,
          pageSize: 10,
        }
        applyFilters(value)
        onFilterChange()
        dispatch(handlePagination(pagination))
        dispatch(getVoluemAndProfit(value, token))
      }
    })
    closeAdvFilter()
  }

  const closeAdvFilter = () => {
    updateStateOfAdvFilter(false)
  }

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

  const defaultFilters = () => {
    return (
      <div hidden={toggleFilter} className="p-4">
        <Row span={24} className="pl-2">
          <Col span={20}>
            <Form layout="inline" onSubmit={onSubmitFilter}>
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
              <Form.Item>
                <Button className="mr-2 ml-2" type="primary" ghost onClick={onReset}>
                  Reset
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  filter
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col
            span={4}
            style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: '5px' }}
          >
            <Button type="link" onClick={() => updateStateOfAdvFilter(true)}>
              Advance filter
            </Button>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <React.Fragment>
      {defaultFilters()}
      <AdvanceFilter
        form={form}
        appliedFilters={appliedFilters}
        closeAdvFilter={closeAdvFilter}
        onReset={onReset}
        onSubmitFilter={onSubmitFilter}
        toggleAdvFilter={toggleAdvFilter}
      />
    </React.Fragment>
  )
}

export default connect(mapStateToProps)(DefaultFilters)
