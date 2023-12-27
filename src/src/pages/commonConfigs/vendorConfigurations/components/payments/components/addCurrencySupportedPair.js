import React, { Component } from 'react'
import { Form, Card, Button, Select, TimePicker, InputNumber, DatePicker, Tag } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  addNewPaymentsCurrencySupported,
  updatePayemntCurrSupportedAddMode,
  updatePayemntCurrSupportedEditMode,
  updatePaymentCurrencySupported,
} from 'redux/vendorConfiguration/action'
import moment from 'moment'
// import { formatToZoneDateOnly } from 'utilities/transformer'
import styles from '../style.module.scss'

import data from './data.json'

const { Option } = Select
const FALSE_VALUE = false

const mapStateToProps = ({ user, general, vendorConfiguration, settings }) => ({
  token: user.token,
  timeZone: settings.timeZone.value,
  clients: general.clients,
  countries: general.countries,
  currencies: general.currencies,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  addressEditMode: vendorConfiguration.addressEditMode,

  selectedPaymentRecordToEdit: vendorConfiguration.selectedRecordToEdit,
  showPaymentsCurreSupprtedEditMode: vendorConfiguration.showPaymentsCurreSupprtedEditMode,
  paymentLoading: vendorConfiguration.paymentLoading,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addVendorCurrencySupported extends Component {
  state = {
    nonAllowedPaymentDates: [],
  }

  componentDidMount() {
    const { showPaymentsCurreSupprtedEditMode, selectedPaymentRecordToEdit } = this.props
    if (showPaymentsCurreSupprtedEditMode) {
      this.setState({
        nonAllowedPaymentDates: selectedPaymentRecordToEdit.nonAllowedPaymentDates,
      })
    }
  }

  // getDates = values => {
  //   const { timeZone } = this.props
  //   const date = []
  //   if (values.length > 0) {
  //     values.map(item => {
  //       date.push(formatToZoneDateOnly(item, timeZone))
  //       return date
  //     })
  //   }
  //   return date
  // }

  // getFormatDates =(dates)=>{
  //   const date = []
  //   if (dates.length > 0) {
  //     dates.map(item => {
  //       date.push(moment(item))
  //       return date
  //     })
  //   }
  //   return date
  // }

  onSubmit = event => {
    event.preventDefault()
    const {
      form,
      dispatch,
      token,
      selectedVendorConfig,
      selectedPaymentRecordToEdit,
      showPaymentsCurreSupprtedEditMode,
    } = this.props
    const { nonAllowedPaymentDates } = this.state

    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          currency: values.paymentCurrency,
          currencySettlementTimeDays: values.currencySettlementTimeDays,
          currencyPaymentTypesSupported: values.currencyPaymentTypesSupported,
          allowedPaymentDays: values.allowedPaymentDays,
          paymentWindowStart: values.currencyPaymentWindowStart.format('HH:mm:ss'),
          currencyCutOff: values.currencyCutOff.format('HH:mm:ss'),
          nonAllowedPaymentDates,
          supportedRoutingChannels: {
            routingChannels: values.routingChannels,
            channelTransactionLimit: values.channelTransactionLimit,
          },
        }

        if (showPaymentsCurreSupprtedEditMode) {
          dispatch(
            updatePaymentCurrencySupported(
              selectedVendorConfig.id,
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              selectedPaymentRecordToEdit._id,
              value,
              token,
            ),
          )
        } else {
          dispatch(addNewPaymentsCurrencySupported(selectedVendorConfig.id, value, token))
        }
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch, showPaymentsCurreSupprtedEditMode } = this.props
    if (showPaymentsCurreSupprtedEditMode) {
      dispatch(updatePayemntCurrSupportedEditMode(FALSE_VALUE))
    } else {
      dispatch(updatePayemntCurrSupportedAddMode(FALSE_VALUE))
    }
  }

  handleDateSelected = (date, dateString) => {
    const { form } = this.props
    const { nonAllowedPaymentDates } = this.state
    if (dateString !== '') {
      this.setState({
        nonAllowedPaymentDates: [...new Set([...nonAllowedPaymentDates, dateString])],
      })
    }
    form.setFieldsValue({ '': null })
  }

  disabledDate = current => {
    // Can not select days before today and today
    return current && current < moment().startOf('day')
  }

  handleRemoveDate = date => {
    const { nonAllowedPaymentDates } = this.state
    const filteredDate =
      nonAllowedPaymentDates.length > 0 ? nonAllowedPaymentDates.filter(item => item !== date) : []
    this.setState({ nonAllowedPaymentDates: filteredDate })
  }

  render() {
    const {
      form,
      currencies,
      //   selectedVendorConfig,
      showPaymentsCurreSupprtedEditMode,
      selectedPaymentRecordToEdit,
      paymentLoading,
    } = this.props
    const { nonAllowedPaymentDates } = this.state
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))
    const currencyPaymentTypesSupported = data.currencyPaymentTypesSupported.map(option => (
      <Option key={option.id} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const daysoptions = data.daysList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const routingChannels = data.routingChannels.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const timeFormat = 'HH:mm:ss'
    const formatDate = 'DD-MM-YYYY'
    // const { payments } = selectedVendorConfig.profile

    return (
      <Form layout="vertical" onSubmit={this.onSubmit}>
        <Card
          title={
            <div>
              <span className="font-size-16">
                {showPaymentsCurreSupprtedEditMode
                  ? 'Edit Payment Currency Details'
                  : 'New Payment Currency Details'}
              </span>
            </div>
          }
          bordered
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '30px',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
        >
          <React.Fragment>
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Payment Currency" hasFeedback>
                  {form.getFieldDecorator('paymentCurrency', {
                    initialValue: showPaymentsCurreSupprtedEditMode
                      ? selectedPaymentRecordToEdit.currency
                      : undefined,
                    rules: [{ required: true, message: 'Please select payment currency' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="please select payment currency"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {currencyOption}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Currency Processing Window Start" hasFeedback>
                  {form.getFieldDecorator('currencyPaymentWindowStart', {
                    initialValue: showPaymentsCurreSupprtedEditMode
                      ? moment(selectedPaymentRecordToEdit.paymentWindowStart, timeFormat)
                      : null,
                    rules: [{ required: true, message: 'Please currency Payment Window Start' }],
                  })(<TimePicker style={{ width: '100%' }} format={timeFormat} />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Currency Cut-off Time" hasFeedback>
                  {form.getFieldDecorator('currencyCutOff', {
                    initialValue: showPaymentsCurreSupprtedEditMode
                      ? moment(selectedPaymentRecordToEdit.currencyCutOff, timeFormat)
                      : null,
                    rules: [{ required: true, message: 'Please currency cutOff' }],
                  })(<TimePicker style={{ width: '100%' }} format={timeFormat} />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Days To Settlement Payments" hasFeedback>
                  {form.getFieldDecorator('currencySettlementTimeDays', {
                    initialValue: showPaymentsCurreSupprtedEditMode
                      ? selectedPaymentRecordToEdit.currencySettlementTimeDays
                      : undefined,
                    rules: [{ required: true, message: 'Please select settlement time days' }],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Please select settlement time days"
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Payment Types Supported" hasFeedback>
                  {form.getFieldDecorator('currencyPaymentTypesSupported', {
                    initialValue: showPaymentsCurreSupprtedEditMode
                      ? selectedPaymentRecordToEdit.currencyPaymentTypesSupported
                      : '',
                    rules: [{ required: true, message: 'Please select payment types supported' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="Please select payment types supported"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {currencyPaymentTypesSupported}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Allowed Payment Days" hasFeedback>
                  {form.getFieldDecorator('allowedPaymentDays', {
                    initialValue: showPaymentsCurreSupprtedEditMode
                      ? selectedPaymentRecordToEdit.allowedPaymentDays
                      : undefined,
                    rules: [{ required: true, message: 'Please select allowed payment days' }],
                  })(
                    <Select
                      showSearch
                      mode="multiple"
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="Please select allowed payment days"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {daysoptions}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="row">
                  <div className={`col-12 col-lg-12 ${styles.datePickerBlock}`}>
                    <Form.Item label="Non-Allowed Payment Dates" hasFeedback>
                      {form.getFieldDecorator('nonAllowedPaymentDates', {
                        // initialValue: showPaymentsCurreSupprtedEditMode
                        //   ? selectedPaymentRecordToEdit.nonAllowedPaymentDays
                        //   : '',
                        // rules: [
                        //   {
                        //     required: nonAllowedPaymentDates.length === 0,
                        //     message: 'Please select non-allowed payment days',
                        //   },
                        // ],
                      })(
                        <DatePicker
                          onChange={this.handleDateSelected}
                          format={formatDate}
                          // showTime={{ format: 'HH:mm' }}
                          disabledDate={this.disabledDate}
                          onFocus={this.handleDatePickerFocus}
                          onBlur={this.handleDatePickerBlur}
                          allowClear={false}
                          style={{ width: '100%' }}
                          // value={null}
                        />,
                      )}
                    </Form.Item>
                  </div>
                  <div className="row">
                    <div className={`col-12 col-lg-12 ${styles.tagBlock}`}>
                      {nonAllowedPaymentDates.length > 0
                        ? nonAllowedPaymentDates.map(item => {
                            return (
                              <Tag
                                closable
                                onClose={() => this.handleRemoveDate(item)}
                                key={item}
                                color="#313343"
                                style={{ marginBottom: '3px' }}
                              >
                                {item}
                              </Tag>
                            )
                          })
                        : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <Form.Item label="Transaction Value Limit" hasFeedback>
                  {form.getFieldDecorator('channelTransactionLimit', {
                    initialValue:
                      showPaymentsCurreSupprtedEditMode &&
                      selectedPaymentRecordToEdit.supportedRoutingChannels
                        ? selectedPaymentRecordToEdit.supportedRoutingChannels
                            .channelTransactionLimit
                        : undefined,
                    //   rules: [{ required: true, message: 'Please select non-allowed payment days' }],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Please select transaction value limit"
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Payment Routing Channels Supported" hasFeedback>
                  {form.getFieldDecorator('routingChannels', {
                    initialValue:
                      showPaymentsCurreSupprtedEditMode &&
                      selectedPaymentRecordToEdit.supportedRoutingChannels
                        ? selectedPaymentRecordToEdit.supportedRoutingChannels.routingChannels
                        : undefined,
                    rules: [{ required: true, message: 'Please select routing channels ' }],
                  })(
                    <Select
                      showSearch
                      mode="multiple"
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="Please select routing channels"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {routingChannels}
                    </Select>,
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className={styles.btnStyles}>
                <Button
                  className={styles.btnCANCEL}
                  onClick={this.onCancelHandler}
                  // disabled={payments.length === 0}
                >
                  Cancel
                </Button>
                <Button className={styles.btnSAVE} loading={paymentLoading} htmlType="submit">
                  {showPaymentsCurreSupprtedEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </React.Fragment>
        </Card>
      </Form>
    )
  }
}

export default addVendorCurrencySupported
