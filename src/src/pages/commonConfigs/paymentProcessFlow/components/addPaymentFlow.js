import React, { Component } from 'react'
import { Card, Button, Form, Select, Icon, Alert, Typography, Modal } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { addNewPaymentProcessFlow } from 'redux/paymentProcessFlow/action'
import { updateErrorList } from '../../../../redux/currencyPairs/action'
import data from '../data.json'
import styles from '../style.module.scss'

const { Paragraph, Text } = Typography
const { Option } = Select

let id = 1

const mapStateToProps = ({ user, currencyPairs, paymentProcessFlow }) => ({
  token: user.token,
  errorList: currencyPairs.errorList,
  addProcessLoading: paymentProcessFlow.addProcessLoading,
  statusPair: paymentProcessFlow.selectedProcessFlow.status,
})

@Form.create()
@connect(mapStateToProps)
class NewPaymentProcessFlow extends Component {
  state = {
    filteredStatus: [],
    selectedType: [],
  }

  componentDidMount() {
    const { dispatch } = this.props
    const emptyArray = []
    dispatch(updateErrorList(emptyArray))
    this.setState({ filteredStatus: data.statusType })
  }

  checkIfDuplicateExists = typeList => {
    return new Set(typeList).size !== typeList.length
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const { keys, nextExitStatusCode, type } = values
        const nextExitStatusCodeList = keys.map(key => nextExitStatusCode[key])
        const typeList = keys.map(key => type[key])
        const status = nextExitStatusCodeList.map((item, index) => {
          return {
            type: typeList[index],
            nextExitStatusCode: item,
          }
        })
        const hasDuplicateStatus = this.checkIfDuplicateExists(typeList)
        if (!hasDuplicateStatus) {
          const value = {
            processFlow: values.processFlow,
            callFunction: values.callFunction,
            status,
            exitStatusCode: values.exitStatusCode,
          }
          dispatch(addNewPaymentProcessFlow(value, token))
        } else {
          Modal.error({
            title: <p style={{ color: 'red' }}>Please select unique status types</p>,
            content: 'Cannot have duplicate status pairs... !',
          })
        }
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

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/payment-order-list')
  }

  handleSelectedType = e => {
    Promise.resolve(
      this.setState(prevState => ({
        selectedType: [...prevState.selectedType, e],
      })),
    ).then(() => {
      this.filterStatusList()
    })
  }

  filterStatusList = () => {
    const list = []
    const { selectedType } = this.state
    data.statusType.map(item => {
      selectedType.map(type => {
        if (type !== item.value) {
          list.push(item)
        }
        return list
      })
      return list
    })
  }

  render() {
    const { addProcessLoading, form, errorList } = this.props
    const { filteredStatus } = this.state
    const statusCode = data.nextExitStatusCode.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const processFlowList = data.processFlow.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const callFunctionList = data.callFunction.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const statusTypeList = filteredStatus.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
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
      <div className="row" key={k}>
        <div className="col-lg-4">
          <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            required={false}
            key={k}
          >
            {getFieldDecorator(`type[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please select status type',
                },
              ],
            })(
              <Select
                style={{ width: '100%', marginTop: '26px' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select Status type"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.handleSelectedType}
              >
                {statusTypeList}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="col-lg-4">
          <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            required={false}
          >
            {getFieldDecorator(`nextExitStatusCode[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input next exit status code',
                },
              ],
            })(
              <Select
                style={{ width: '100%', marginTop: '26px' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select next status code"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                // mode="multiple"
              >
                {statusCode}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="col-lg-1">
          {keys.length > 0 ? (
            <Icon className={styles.minusIcon} type="delete" onClick={() => this.remove(k)} />
          ) : null}
        </div>
      </div>
    ))
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Add Payments Process FLow Details</span>
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
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Process Flow :" hasFeedback>
                  {form.getFieldDecorator('processFlow', {
                    rules: [{ required: true, message: 'Please input process flow' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {processFlowList}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Call Function :" hasFeedback>
                  {form.getFieldDecorator('callFunction', {
                    rules: [{ required: true, message: 'Please input call function' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {callFunctionList}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Exit Status Code :" hasFeedback>
                  {form.getFieldDecorator('exitStatusCode', {
                    rules: [{ required: true, message: 'Please input exit status code' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {statusCode}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-12">
                {formItems}

                <Form.Item {...formItemLayoutWithOutLabel}>
                  <Button
                    type="dashed"
                    onClick={this.add}
                    style={{ width: '65%', marginTop: '26px' }}
                  >
                    <Icon type="plus" /> Add Another Status Pair
                  </Button>
                </Form.Item>
              </div>
            </div>
            <div className={styles.btnStyles}>
              <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
                Cancel
              </Button>
              <Button className={styles.btnSAVE} loading={addProcessLoading} htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </Card>
      </React.Fragment>
    )
  }
}
export default NewPaymentProcessFlow
