import React, { Component } from 'react'
import {
  Card,
  Button,
  Form,
  Select,
  TimePicker,
  DatePicker,
  Icon,
  Tag,
  Alert,
  Typography,
  Tooltip,
} from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { updateErrorList, editSelectedCurrencyPair } from '../../../../redux/currencyPairs/action'
import data from '../data.json'
import styles from '../style.module.scss'

const { Paragraph, Text } = Typography
const { Option } = Select

// let id = 1

const mapStateToProps = ({ user, general, currencyPairs }) => ({
  token: user.token,
  currencies: general.currencies,
  vendorCurrencyPairs: general.vendorCurrencyPairs,
  currencyPairs: currencyPairs.vendorCurrencyPairs,
  errorList: currencyPairs.errorList,
  loading: currencyPairs.loading,
  selectedCurrencyPair: currencyPairs.selectedCurrencyPair,
  //   loading: currencies.loading,
})

@Form.create()
@connect(mapStateToProps)
class NewCurrencyPair extends Component {
  state = {
    nonAllowedTradingDates: [],
  }

  componentDidMount() {
    const { dispatch, selectedCurrencyPair, form } = this.props
    const emptyArray = []
    dispatch(updateErrorList(emptyArray))
    this.setState({ nonAllowedTradingDates: selectedCurrencyPair.nonAllowedTradingDays })
    if (Object.entries(selectedCurrencyPair.allowedTradingTimes).length > 0) {
      form.setFieldsValue({
        start: moment(selectedCurrencyPair.allowedTradingTimes.start, 'HH:mm:ss'),
      })
      form.setFieldsValue({ end: moment(selectedCurrencyPair.allowedTradingTimes.end, 'HH:mm:ss') })
    }
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, selectedCurrencyPair, token, dispatch } = this.props
    const { nonAllowedTradingDates } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          allowedTradingDays: values.allowedTradingDays,
          nonAllowedTradingDays: nonAllowedTradingDates,
          allowedTradingTimes: {
            start: values.start.format('HH:mm:ss'),
            end: values.end.format('HH:mm:ss'),
          },
        }
        dispatch(editSelectedCurrencyPair(selectedCurrencyPair.id, value, token))
      }
    })
  }

  getCurrencyId = currency => {
    const { currencies } = this.props
    const currencydata = currencies.filter(item1 => item1.value === currency)
    return currencydata[0].id
  }

  handleDateSelected = (date, dateString) => {
    const { form } = this.props
    const { nonAllowedTradingDates } = this.state
    this.setState({
      nonAllowedTradingDates: [...new Set([...nonAllowedTradingDates, dateString])],
    })
    form.setFieldsValue({ nonAllowedTradingDates: null })
  }

  handleRemoveDate = date => {
    const { nonAllowedTradingDates } = this.state
    const filteredDate =
      nonAllowedTradingDates.length > 0 ? nonAllowedTradingDates.filter(item => item !== date) : []

    this.setState({ nonAllowedTradingDates: filteredDate })
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/currency-pair')
  }

  navigateToViewCurrencyPair = () => {
    const { history } = this.props
    history.push('/view-currency-pair')
  }

  render() {
    const { loading, form, currencies, errorList, selectedCurrencyPair } = this.props
    const { nonAllowedTradingDates } = this.state
    const timeFormat = 'HH:mm:ss'
    const options = data.vendorList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const daysoptions = data.daysList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const currenciesList = currencies.map(option => (
      <Option key={option.value} value={option.value} label={option.title}>
        {option.title}
      </Option>
    ))
    const formatDate = 'DD-MM-YYYY'

    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Edit Currency Pair Details</span>
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
          extra={
            <>
              <Button
                type="link"
                className="pr-3"
                onClick={() => this.navigateToViewCurrencyPair()}
              >
                View
              </Button>
              <Button type="link" onClick={this.onCancelHandler}>
                Back
              </Button>
            </>
          }
        >
          <Helmet title="Country" />
          <Form layout="vertical" onSubmit={this.onSubmit}>
            {errorList.length > 0 ? (
              <div>
                <div className={styles.errorBlock}>
                  <Alert
                    // showIcon
                    type="error"
                    message={
                      <div className="desc">
                        <Paragraph>
                          <Text
                            strong
                            style={{
                              fontSize: 14,
                            }}
                          >
                            The content you submitted has the following errors:
                          </Text>
                        </Paragraph>
                        {errorList.map(item => {
                          return (
                            <Paragraph>
                              <Icon style={{ color: 'red' }} type="close-circle" /> {item}
                            </Paragraph>
                          )
                        })}
                      </div>
                    }
                  />
                </div>
                <Spacer height="25px" />
              </div>
            ) : (
              ''
            )}

            <div className="row">
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Vendor Name :" hasFeedback>
                  {form.getFieldDecorator('vendor', {
                    initialValue: selectedCurrencyPair.vendor || '',
                    rules: [{ required: true, message: 'Please input vendor name' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {options}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Tooltip title="Restricted to edit">
                  <Form.Item label="Buy Currency" hasFeedback>
                    {form.getFieldDecorator('buyCurrency', {
                      initialValue: selectedCurrencyPair.buyCurrency || '',
                      rules: [{ required: true, message: 'Please input buyCurrency' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        placeholder="Select Buy Currency"
                        // pointerEvents="none"
                        disabled
                        // mode="multiple"
                        showSearch
                        filterOption={(input, option) =>
                          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {currenciesList}
                      </Select>,
                    )}
                  </Form.Item>
                </Tooltip>
              </div>
              <div className="col-md-6 col-lg-3">
                <Tooltip title="Restricted to edit">
                  <Form.Item label="Sell Currency" hasFeedback>
                    {form.getFieldDecorator('sellCurrency', {
                      initialValue: selectedCurrencyPair.sellCurrency || '',
                      rules: [{ required: true, message: 'Please input  sell Currency' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        placeholder="Select Sell Currency"
                        // mode="multiple"
                        showSearch
                        disabled
                        filterOption={(input, option) =>
                          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {currenciesList}
                      </Select>,
                    )}
                  </Form.Item>
                </Tooltip>
              </div>

              <div className="col-md-6 col-lg-3">
                <Form.Item label="Allowed Trading Start Time :" hasFeedback>
                  {form.getFieldDecorator('start', {
                    rules: [
                      {
                        // initialValue : moment('12:08:23', 'HH:mm:ss') || '',
                        required: true,
                        message: 'Please input allowed trading start time',
                      },
                    ],
                  })(<TimePicker style={{ width: '100%' }} format={timeFormat} />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Allowed Trading End Time :" hasFeedback>
                  {form.getFieldDecorator('end', {
                    rules: [{ required: true, message: 'Please input allowed trading end time' }],
                  })(<TimePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Allowed Trading Days :" hasFeedback>
                  {form.getFieldDecorator('allowedTradingDays', {
                    initialValue: selectedCurrencyPair.allowedTradingDays || '',
                    rules: [{ required: true, message: 'Please input allowed trading days' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      mode="multiple"
                    >
                      {daysoptions}
                    </Select>,
                  )}
                </Form.Item>
              </div>

              <div className="col-md-6 col-lg-3">
                <div className="row">
                  <div className={`col-12 col-lg-12 ${styles.datePickerBlock}`}>
                    <Form.Item label="Non-Allowed Trading Days :" hasFeedback>
                      {form.getFieldDecorator('nonAllowedTradingDates', {
                        rules: [
                          {
                            required: nonAllowedTradingDates.length === 0,
                            message: 'Please input non allowed tarding dates',
                          },
                        ],
                      })(
                        <DatePicker
                          onChange={this.handleDateSelected}
                          format={formatDate}
                          // open={openDatePicker}
                          // onClick={this.handleDatePickerFocus}
                          onFocus={this.handleDatePickerFocus}
                          onBlur={this.handleDatePickerBlur}
                          allowClear={false}
                          style={{ width: '100%' }}
                          // value={null}
                        />,
                      )}
                    </Form.Item>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-lg-12">
                    {selectedCurrencyPair.nonAllowedTradingDays.length > 0
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
                <Spacer height="7px" />
              </div>
            </div>
            <div className={styles.btnStyles}>
              <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
                Cancel
              </Button>
              <Button className={styles.btnSAVE} loading={loading} htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </Card>
      </React.Fragment>
    )
  }
}
export default NewCurrencyPair
