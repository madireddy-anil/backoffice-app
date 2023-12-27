import React, { Component } from 'react'
import { Form, Card, Button, Select, InputNumber, TimePicker, Tag, DatePicker } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  addNewFXCurrencyPair,
  updateFXCurrPairEditMode,
  updateFXCurrPairAddMode,
  updateFXCurrencyPair,
} from 'redux/vendorConfiguration/action'
import moment from 'moment'

import styles from '../style.module.scss'

import data from './data.json'

const { Option } = Select
const FALSE_VALUE = false

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,
  countries: general.countries,
  currencies: general.currencies,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  addressEditMode: vendorConfiguration.addressEditMode,

  showFXCurrPairAddMode: vendorConfiguration.showFXCurrPairAddMode,
  showFXCurrPairEditMode: vendorConfiguration.showFXCurrPairEditMode,
  selectedRecordToEdit: vendorConfiguration.selectedRecordToEdit,
  fxLoading: vendorConfiguration.fxLoading,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addFXCurrencyPair extends Component {
  state = {
    nonAllowedTradingDates: [],
    creditOffered: undefined,
    buyCurrencyList: [],
  }

  componentDidMount() {
    const { showFXCurrPairEditMode, selectedRecordToEdit, currencies } = this.props
    if (showFXCurrPairEditMode) {
      this.setState({
        nonAllowedTradingDates: selectedRecordToEdit.currencyNonAllowedTradingDates,
        creditOffered: selectedRecordToEdit.creditOffered ? 'yes' : 'no',
        buyCurrencyList: currencies.filter(
          item => item.value !== selectedRecordToEdit.sellCurrency,
        ),
      })
    }
  }

  onSubmit = event => {
    event.preventDefault()
    const {
      form,
      dispatch,
      token,
      selectedVendorConfig,
      selectedRecordToEdit,
      showFXCurrPairEditMode,
    } = this.props
    const { nonAllowedTradingDates, creditOffered } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          sellCurrency: values.sellCurrency,
          buyCurrency: values.buyCurrency,
          // quoteMethod: values.quoteMethod,
          vendorIndex: values.vendorIndex,
          vendorSpread: values.vendorSpread,
          rateType: values.rateType,
          currencyCutOff: values.currencyCutOff.format('HH:mm:ss'),
          currencyAllowedTradingDays: values.currencyAllowedTradingDays,
          currencyAllowedTradingTimesStart: values.currencyAllowedTradingTimesStart.format(
            'HH:mm:ss',
          ),
          tenors: values.tenors,
          creditOffered: creditOffered === 'yes' || false,
          creditOfferedValue: creditOffered === 'yes' ? values.creditOfferedValue : undefined,
          currencyNonAllowedTradingDates: nonAllowedTradingDates,
          nonAllowedTradingDates,
        }
        if (showFXCurrPairEditMode) {
          dispatch(
            // eslint-disable-next-line no-param-reassign, no-underscore-dangle
            updateFXCurrencyPair(selectedVendorConfig.id, selectedRecordToEdit._id, value, token),
          )
        } else {
          dispatch(addNewFXCurrencyPair(selectedVendorConfig.id, value, token))
        }
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch, showPaymentsCurreSupprtedEditMode } = this.props
    if (showPaymentsCurreSupprtedEditMode) {
      dispatch(updateFXCurrPairEditMode(FALSE_VALUE))
    } else {
      dispatch(updateFXCurrPairAddMode(FALSE_VALUE))
    }
  }

  handleDateSelected = (date, dateString) => {
    const { form } = this.props
    const { nonAllowedTradingDates } = this.state
    if (dateString !== '') {
      this.setState({
        nonAllowedTradingDates: [...new Set([...nonAllowedTradingDates, dateString])],
      })
    }
    form.setFieldsValue({ '': null })
  }

  handleRemoveDate = date => {
    const { nonAllowedTradingDates } = this.state
    const filteredDate =
      nonAllowedTradingDates.length > 0 ? nonAllowedTradingDates.filter(item => item !== date) : []

    this.setState({ nonAllowedTradingDates: filteredDate })
  }

  handleCreditOffered = value => {
    this.setState({ creditOffered: value })
  }

  getValue = isAllowed => {
    return isAllowed ? 'yes' : 'no'
  }

  handleSellCurrencyChange = value => {
    const { currencies, form } = this.props
    const buyCurrencyList = currencies.filter(item => item.value !== value)
    this.setState({ buyCurrencyList })
    form.setFieldsValue({ buyCurrency: undefined })
  }

  render() {
    const {
      form,
      currencies,
      selectedVendorConfig,
      showFXCurrPairEditMode,
      selectedRecordToEdit,
      fxLoading,
    } = this.props
    const { nonAllowedTradingDates, creditOffered, buyCurrencyList } = this.state

    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))

    const buyCurrency = buyCurrencyList.map(option => (
      <Option key={option.id} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))

    const daysoptions = data.daysList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const tenorsoptions = data.tenorsList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const remintanceInfo = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const enhancedScreeningRequired = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    // const quoteMethod = data.quoteMethod.map(option => (
    //   <Option key={option.id} label={option.label} value={option.value}>
    //     {option.label}
    //   </Option>
    // ))

    const rateType = data.rateType.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    const vendorIndexList = data.vendorIndexList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const formatDate = 'DD-MM-YYYY'

    const timeFormat = 'HH:mm:ss'
    const { foreignExchange } = selectedVendorConfig.serviceOffered
    return (
      <Form layout="vertical" onSubmit={this.onSubmit}>
        <Card
          title={
            <div>
              <span className="font-size-16">
                {showFXCurrPairEditMode
                  ? 'Edit Foreign Exchange Currency Pair Details'
                  : 'New Foreign Exchange Currency Pair Details'}
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
              {foreignExchange.enhancedScreeningRequired !== undefined &&
              foreignExchange.remittanceInformationAllowed !== undefined ? (
                ''
              ) : (
                <React.Fragment>
                  <div className="col-md-6 col-lg-3">
                    <Form.Item label="Remittance Information Allowed" hasFeedback>
                      {form.getFieldDecorator('remittanceInformationAllowed', {
                        rules: [
                          { required: true, message: 'Please select remittance information' },
                        ],
                      })(
                        <Select
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
                          placeholder="please select remittance information"
                          filterOption={(input, option) =>
                            option.props.label
                              ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              : ''
                          }
                        >
                          {remintanceInfo}
                        </Select>,
                      )}
                    </Form.Item>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <Form.Item label="Enhanced Screening Required" hasFeedback>
                      {form.getFieldDecorator('enhancedScreeningRequired', {
                        rules: [
                          { required: true, message: 'Please select enhanced screening required' },
                        ],
                      })(
                        <Select
                          showSearch
                          optionFilterProp="children"
                          optionLabelProp="label"
                          placeholder="please select enhanced screening required"
                          filterOption={(input, option) =>
                            option.props.label
                              ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              : ''
                          }
                        >
                          {enhancedScreeningRequired}
                        </Select>,
                      )}
                    </Form.Item>
                  </div>
                </React.Fragment>
              )}

              <div className="col-md-6 col-lg-3">
                <Form.Item label="Sell Currency" hasFeedback>
                  {form.getFieldDecorator('sellCurrency', {
                    initialValue: showFXCurrPairEditMode
                      ? selectedRecordToEdit.sellCurrency
                      : undefined,
                    rules: [{ required: true, message: 'Please select sell currency' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="please select sell currency"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                      onChange={(value, id) => this.handleSellCurrencyChange(value, id)}
                    >
                      {currencyOption}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Buy Currency" hasFeedback>
                  {form.getFieldDecorator('buyCurrency', {
                    initialValue: showFXCurrPairEditMode
                      ? selectedRecordToEdit.buyCurrency
                      : undefined,
                    rules: [{ required: true, message: 'Please select buy currency' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="please select buy currency"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }

                      // onChange={(value,id)=>this.handleBuyCurrencyChange(value,id)}
                    >
                      {buyCurrency}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              {/* <div className="col-md-6 col-lg-3">
                <Form.Item label="Quote Method" hasFeedback>
                  {form.getFieldDecorator('quoteMethod', {
                    initialValue: showFXCurrPairEditMode ? selectedRecordToEdit.quoteMethod : '',
                    rules: [{ required: true, message: 'Please select quote method' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="please select quote method"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {quoteMethod}
                    </Select>,
                  )}
                </Form.Item>
              </div> */}
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Vendor Spread" hasFeedback>
                  {form.getFieldDecorator('vendorSpread', {
                    initialValue: showFXCurrPairEditMode
                      ? selectedRecordToEdit.vendorSpread
                      : undefined,
                    // rules: [{ required: true, message: 'Please vendor spread' }],
                  })(
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="please enter vendor spread"
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Vendor Index" hasFeedback>
                  {form.getFieldDecorator('vendorIndex', {
                    initialValue: showFXCurrPairEditMode
                      ? selectedRecordToEdit.vendorIndex
                      : undefined,
                    // rules: [{ required: true, message: 'Please select vendor index' }],
                  })(
                    <Select
                      showSearch
                      // mode="multiple"
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="Please select vendor index"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {vendorIndexList}
                    </Select>,
                  )}
                </Form.Item>
              </div>

              <div className="col-md-6 col-lg-3">
                <Form.Item label="Rate Type" hasFeedback>
                  {form.getFieldDecorator('rateType', {
                    initialValue: showFXCurrPairEditMode
                      ? selectedRecordToEdit.rateType
                      : undefined,
                    rules: [{ required: true, message: 'Please select rate type' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="please select  rate type"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {rateType}
                    </Select>,
                  )}
                </Form.Item>
              </div>

              <div className="col-md-6 col-lg-3">
                <Form.Item label="Tenors" hasFeedback>
                  {form.getFieldDecorator('tenors', {
                    initialValue: showFXCurrPairEditMode ? selectedRecordToEdit.tenors : undefined,
                    rules: [{ required: true, message: 'Please select tenors' }],
                  })(
                    <Select
                      showSearch
                      mode="multiple"
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="Please select tenors"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {tenorsoptions}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Trading Time Start" hasFeedback>
                  {form.getFieldDecorator('currencyAllowedTradingTimesStart', {
                    initialValue: showFXCurrPairEditMode
                      ? moment(selectedRecordToEdit.currencyAllowedTradingTimesStart, timeFormat)
                      : null,
                    rules: [{ required: true, message: 'Please trading time start' }],
                  })(<TimePicker style={{ width: '100%' }} format={timeFormat} />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Cut-off Time" hasFeedback>
                  {form.getFieldDecorator('currencyCutOff', {
                    initialValue: showFXCurrPairEditMode
                      ? moment(selectedRecordToEdit.currencyCutOff, timeFormat)
                      : null,
                    rules: [{ required: true, message: 'Please currency cutOff' }],
                  })(<TimePicker style={{ width: '100%' }} format={timeFormat} />)}
                </Form.Item>
              </div>
              {/* <div className="col-md-6 col-lg-3">
                <Form.Item label="Trading Time End" hasFeedback>
                  {form.getFieldDecorator('currencyAllowedTradingTimesEnd', {
                    initialValue: showFXCurrPairEditMode
                      ? moment(selectedRecordToEdit.currencyAllowedTradingTimesEnd, timeFormat)
                      : undefined,
                    rules: [{ required: true, message: 'Please trading time end' }],
                  })(<TimePicker style={{ width: '100%' }} format={timeFormat} />)}
                </Form.Item>
              </div> */}

              <div className="col-md-6 col-lg-3">
                <Form.Item label="Credit Offered" hasFeedback>
                  {form.getFieldDecorator('creditOffered', {
                    initialValue: showFXCurrPairEditMode
                      ? this.getValue(selectedRecordToEdit.creditOffered)
                      : undefined,
                    rules: [{ required: true, message: 'Please select credit offered' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      onChange={item => this.handleCreditOffered(item)}
                      placeholder="please select credit offered'"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {remintanceInfo}
                    </Select>,
                  )}
                </Form.Item>
              </div>

              {creditOffered === 'yes' ? (
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Value of Credit Offered" hasFeedback>
                    {form.getFieldDecorator('creditOfferedValue', {
                      initialValue: showFXCurrPairEditMode
                        ? selectedRecordToEdit.creditOfferedValue
                        : undefined,
                      rules: [{ required: true, message: 'Please select credit offered value' }],
                    })(
                      <InputNumber
                        style={{ width: '100%' }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        placeholder="Please select credit offered value"
                      />,
                    )}
                  </Form.Item>
                </div>
              ) : (
                ''
              )}
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Allowed Payment Days" hasFeedback>
                  {form.getFieldDecorator('currencyAllowedTradingDays', {
                    initialValue: showFXCurrPairEditMode
                      ? selectedRecordToEdit.currencyAllowedTradingDays
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
                    <Form.Item label="Non-Allowed Trading Dates" hasFeedback>
                      {form.getFieldDecorator('currencyNonAllowedTradingDates', {
                        // initialValue: showPaymentsCurreSupprtedEditMode
                        //   ? selectedPaymentRecordToEdit.nonAllowedPaymentDays
                        //   : '',
                        // rules: [
                        //   {
                        //     required: nonAllowedTradingDates.length === 0,
                        //     message: 'Please select non-allowed payment days',
                        //   },
                        // ],
                      })(
                        <DatePicker
                          onChange={this.handleDateSelected}
                          format={formatDate}
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
                      {nonAllowedTradingDates.length > 0
                        ? nonAllowedTradingDates.map(item => {
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
                <Button className={styles.btnSAVE} loading={fxLoading} htmlType="submit">
                  {showFXCurrPairEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </React.Fragment>
        </Card>
      </Form>
    )
  }
}

export default addFXCurrencyPair
