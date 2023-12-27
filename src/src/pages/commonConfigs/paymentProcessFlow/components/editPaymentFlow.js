import React, { Component } from 'react'
import { Card, Button, Form, Select, Icon, Alert, Typography, Modal, Tooltip } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  updateStatusPair,
  editPaymentProcessFlow,
  updateAddStatusPairView,
} from 'redux/paymentProcessFlow/action'
import EditStatusPair from './statusPair/editStatusPair'
import { updateErrorList } from '../../../../redux/currencyPairs/action'
import data from '../data.json'
import styles from '../style.module.scss'
import AddStatusPair from './statusPair/addStatusPair'

const { Paragraph, Text } = Typography
const { Option } = Select
const TRUE_VALUE = true

const mapStateToProps = ({ user, currencyPairs, paymentProcessFlow }) => ({
  token: user.token,
  errorList: currencyPairs.errorList,
  editProcessLoading: paymentProcessFlow.addProcessLoading,
  selectedProcessFlow: paymentProcessFlow.selectedProcessFlow,
  isAddStatusPair: paymentProcessFlow.isAddStatusPair,
})

@Form.create()
@connect(mapStateToProps)
class NewPaymentProcessFlow extends Component {
  state = {
    payemntprocessFlow: {
      status: [],
    },
  }

  componentDidMount() {
    const { dispatch } = this.props
    this.updateSelectedDetailsToState()
    const emptyArray = []
    dispatch(updateErrorList(emptyArray))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isFlowFetched) {
      this.updateSelectedDetailsToState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { selectedProcessFlow } = this.props
    const isPropsUpdated = {
      isFlowFetched: prevProps.selectedProcessFlow !== selectedProcessFlow,
    }
    return isPropsUpdated
  }

  updateSelectedDetailsToState = () => {
    const { selectedProcessFlow } = this.props
    this.setState({ payemntprocessFlow: selectedProcessFlow })
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { payemntprocessFlow } = this.state

    form.validateFields((error, values) => {
      if (!error) {
        payemntprocessFlow.callFunction = values.callFunction
        payemntprocessFlow.processFlow = values.processFlow
        payemntprocessFlow.exitStatusCode = values.exitStatusCode
        const hasDuplicateStatus = this.checkIfDuplicateExists(payemntprocessFlow.status)
        if (!hasDuplicateStatus) {
          dispatch(editPaymentProcessFlow(payemntprocessFlow.id, payemntprocessFlow, token))
        } else {
          Modal.error({
            title: <p style={{ color: 'red' }}>Please select unique status types</p>,
            content: 'Cannot have duplicate status pairs... !',
          })
        }
      }
    })
  }

  checkIfDuplicateExists = typeList => {
    const uniqueValues = new Set(typeList.map(item => item.type))
    return uniqueValues.size < typeList.length || false
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/payment-order-list')
  }

  handleCancelStatusPair = index => {
    const { payemntprocessFlow } = this.state
    const { dispatch } = this.props
    const { status } = payemntprocessFlow
    status.splice(index, 1)
    dispatch(updateStatusPair(payemntprocessFlow.status))
    this.setState({ payemntprocessFlow })
  }

  addMoreStatusPair = () => {
    const { dispatch } = this.props
    dispatch(updateAddStatusPairView(TRUE_VALUE))
  }

  render() {
    const { editProcessLoading, form, errorList, selectedProcessFlow, isAddStatusPair } = this.props
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
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Edit Payments Process FLow Details</span>
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
                <Tooltip title="Restricted to edit">
                  <Form.Item label="Process Flow :" hasFeedback>
                    {form.getFieldDecorator('processFlow', {
                      initialValue: selectedProcessFlow.processFlow,
                      rules: [{ required: true, message: 'Please input process flow' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        showSearch
                        pointerEvents="none"
                        disabled
                      >
                        {processFlowList}
                      </Select>,
                    )}
                  </Form.Item>
                </Tooltip>
              </div>
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Call Function :" hasFeedback>
                  {form.getFieldDecorator('callFunction', {
                    initialValue: selectedProcessFlow.callFunction,
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
                <Tooltip title="Restricted to edit">
                  <Form.Item label="Exit Status Code :" hasFeedback>
                    {form.getFieldDecorator('exitStatusCode', {
                      initialValue: selectedProcessFlow.exitStatusCode,
                      rules: [{ required: true, message: 'Please input exit status code' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        showSearch
                        disabled
                      >
                        {statusCode}
                      </Select>,
                    )}
                  </Form.Item>
                </Tooltip>
              </div>

              <div className="col-md-6 col-lg-12">
                {selectedProcessFlow.status.map((item, index) => {
                  return (
                    <React.Fragment key={item.type}>
                      <EditStatusPair
                        item={item}
                        index={index}
                        onCancel={() => this.handleCancelStatusPair(index)}
                      />
                      <Spacer height="15px" />
                    </React.Fragment>
                  )
                })}
              </div>
              <div className="col-md-6 col-lg-12">
                {isAddStatusPair ? (
                  <AddStatusPair />
                ) : (
                  <Button
                    type="dashed"
                    onClick={this.addMoreStatusPair}
                    style={{ width: '65%', marginTop: '26px' }}
                  >
                    <Icon type="plus" /> Add Another Status Pair
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.btnStyles}>
              <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
                Cancel
              </Button>
              <Button
                className={styles.btnSAVE}
                loading={editProcessLoading}
                htmlType="submit"
                disabled={isAddStatusPair}
              >
                Update
              </Button>
            </div>
          </Form>
        </Card>
      </React.Fragment>
    )
  }
}
export default NewPaymentProcessFlow
