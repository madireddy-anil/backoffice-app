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
} from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { addNewCurrenyPair, updateErrorList } from '../../../../redux/currencyPairs/action'
import data from '../data.json'
import styles from '../style.module.scss'

const { Paragraph, Text } = Typography
const { Option } = Select

let id = 1

const mapStateToProps = ({ user, general, currencyPairs }) => ({
  token: user.token,
  currencies: general.currencies,
  vendorCurrencyPairs: general.vendorCurrencyPairs,
  currencyPairs: currencyPairs.vendorCurrencyPairs,
  errorList: currencyPairs.errorList,
  loading: currencyPairs.loading,
  //   loading: currencies.loading,
})

@Form.create()
@connect(mapStateToProps)
class NewCurrencyPair extends Component {
  state = {
    nonAllowedTradingDates: [],
  }

  componentDidMount() {
    const { dispatch } = this.props
    const emptyArray = []
    dispatch(updateErrorList(emptyArray))
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { nonAllowedTradingDates } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        const { keys, buyCurrency, sellCurrency } = values
        const buyCurrencies = keys.map(key => buyCurrency[key])
        const sellCurries = keys.map(key => sellCurrency[key])
        const currencyPairs = buyCurrencies.map((item, index) => {
          return {
            buyCurrency: item,
            buyCurrencyId: this.getCurrencyId(item),
            sellCurrencyId: this.getCurrencyId(sellCurries[index]),
            sellCurrency: sellCurries[index],
          }
        })
        const value = {
          vendor: values.vendor,
          currencyPairs,
          allowedTradingDays: values.allowedTradingDays,
          nonAllowedTradingDays: nonAllowedTradingDates,
          allowedTradingTimes: {
            start: values.start.format('HH:mm:ss'),
            end: values.end.format('HH:mm:ss'),
          },
        }
        dispatch(addNewCurrenyPair(value, token))
      }
    })
  }

  getCurrencyId = currency => {
    const { currencies } = this.props
    const currencydata = currencies.filter(item1 => item1.value === currency)
    return currencydata[0].id
  }

  remove = k => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  add = () => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat((id += 1))
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  removeDates = k => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) {
      return
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  handleDateSelected = (date, dateString) => {
    const { form } = this.props
    const { nonAllowedTradingDates } = this.state
    this.setState({
      nonAllowedTradingDates: [...new Set([...nonAllowedTradingDates, dateString])],
    }) // const emptyDate = {null}
    form.setFieldsValue({ '': null })
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

  render() {
    const { loading, form, currencies, errorList } = this.props
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
    const { getFieldDecorator, getFieldValue } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
      },
    }
    getFieldDecorator('keys', { initialValue: [0] })
    const keys = getFieldValue('keys')
    let formItems = []

    formItems = keys.map((k, index) => (
      <div className="row">
        <div className="col-lg-4">
          <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            // label={index === 0 ? 'Passengers' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`buyCurrency[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input buy currency',
                },
              ],
            })(
              <Select
                style={{ width: '100%', marginTop: '26px' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select Buy Currency"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {currenciesList}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="col-lg-4">
          <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            // label={index === 0 ? 'Passengers' : ''}
            required={false}
          >
            {getFieldDecorator(`sellCurrency[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input sell currency.',
                },
              ],
            })(
              <Select
                style={{ width: '100%', marginTop: '26px' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select Sell Currency"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                // mode="multiple"
              >
                {currenciesList}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="col-lg-1">
          {keys.length > 0 ? (
            <Icon
              className={`dynamic-delete-button ${styles.minusIcon}`}
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </div>
      </div>
    ))

    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Add Currency Pair Details</span>
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
          // extra={
          //   <>
          //     <Button type="link" className="pr-3" onClick={() => this.navigateToViewCurrency()}>
          //       View
          //     </Button>
          //     <Button type="link" onClick={this.onBackButtonHandler}>
          //       Back
          //     </Button>
          //   </>
          // }
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
                <Form.Item label="Allowed Trading Start Time :" hasFeedback>
                  {form.getFieldDecorator('start', {
                    rules: [{ required: true, message: 'Please input allowed trading start time' }],
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
                    <Form.Item label="Non-Allowed Trading Days  :" hasFeedback>
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
                <Spacer height="7px" />
              </div>
              <div className="col-md-6 col-lg-9">
                {formItems}

                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button
                    type="dashed"
                    onClick={this.add}
                    style={{ width: '60%', marginTop: '26px' }}
                  >
                    <Icon type="plus" /> Add Currency Pair
                  </Button>
                </Form.Item>
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
