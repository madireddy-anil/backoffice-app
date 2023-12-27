import React, { Component } from 'react'
import { Button, Form, InputNumber, Card, Checkbox } from 'antd'
import { connect } from 'react-redux'
import {
  updateTradeTieringMethodSelected,
  editTradeTieringById,
  updateTradeTieringEditMode,
} from 'redux/pricingProfile/action'
// import data from '../data.json'
import styles from './style.module.scss'

// const { Option } = Select
const maxValue = 999999999999999
// const TRUE_VALUE =true
const FALSE_VALUE = false

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  currencies: general.currencies,

  selectedPricingProfile: pricing.selectedPricingProfile,
  isTradeTier: pricing.isTradeTier,
  selectedTradeTieringMethod: pricing.selectedTradeTieringMethod,

  selectedTieringRecord: pricing.selectedPaymentTieringData,
  tradeTieringLoading: pricing.tradeTieringLoading,
})

@Form.create()
@connect(mapStateToProps)
class NewTradeTiering extends Component {
  state = {
    selectedFinalTier: false,
  }

  componentDidMount() {
    const { selectedTieringRecord } = this.props
    this.setState({ selectedFinalTier: selectedTieringRecord.isFinalTier })
  }

  handleTradeRecordSubmit = event => {
    event.preventDefault()
    const {
      form,
      isTradeTier,
      selectedTradeTieringMethod,
      selectedTieringRecord,
      dispatch,
      token,
    } = this.props
    const { selectedFinalTier } = this.state
    form.validateFields((error, values) => {
      let tierPricing = {}

      if (!error) {
        if (!isTradeTier) {
          values.tradesTier = isTradeTier
          tierPricing = values
        }

        if (isTradeTier && selectedTradeTieringMethod === 'monthly_value') {
          tierPricing = {
            // markup: values.markup,
            index: values.index,
            spread: values.spread,
            tradesTier: selectedTieringRecord.tradesTier,
            tradesTieringMethod: selectedTieringRecord.tradesTieringMethod,
            isFinalTier: selectedFinalTier,
            tradesTieringActive: selectedTieringRecord.tradesTieringActive,
            monthly: {
              fromMonthlyBuyAmount: values.fromMonthlyBuyAmount,
              maxMonthlyBuyAmount: values.isFinalTier ? maxValue : values.maxMonthlyBuyAmount,
            },
          }
        }
        if (isTradeTier && selectedTradeTieringMethod === 'monthly_volume') {
          tierPricing = {
            // markup: values.markup,
            index: values.index,
            spread: values.spread,
            tradesTier: selectedTieringRecord.tradesTier,
            tradesTieringMethod: selectedTieringRecord.tradesTieringMethod,
            isFinalTier: selectedFinalTier,
            tradesTieringActive: selectedTieringRecord.tradesTieringActive,
            monthly: {
              fromNumberOfMonthlyTrades: values.fromNumberOfMonthlyTrades,
              maxNumberOfMonthlyTrades: values.isFinalTier
                ? maxValue
                : values.maxNumberOfMonthlyTrades,
            },
          }
        }
        if (isTradeTier && selectedTradeTieringMethod === 'single_value') {
          tierPricing = {
            // markup: values.markup,
            index: values.index,
            spread: values.spread,
            tradesTier: selectedTieringRecord.tradesTier,
            tradesTieringMethod: selectedTieringRecord.tradesTieringMethod,
            isFinalTier: selectedFinalTier,
            tradesTieringActive: selectedTieringRecord.tradesTieringActive,
            single: {
              fromValueOfSingleBuyAmount: values.fromValueOfSingleBuyAmount,
              maxValueOfSingleBuyAmount: values.isFinalTier
                ? maxValue
                : values.maxValueOfSingleBuyAmount,
            },
          }
        }
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        const tradeTieringId = selectedTieringRecord._id
        const value = {
          tiering: [tierPricing],
        }
        dispatch(editTradeTieringById(tradeTieringId, value, token))
      }
    })
  }

  onChangeFinalTier = e => {
    this.setState({ selectedFinalTier: e.target.checked })
  }

  getLayout = () => {
    const { isTradeTier, selectedTradeTieringMethod } = this.props
    if (isTradeTier) {
      return (
        <div>
          <div className="row">{this.getSelectedTieringUI(selectedTradeTieringMethod)}</div>
          {selectedTradeTieringMethod ? this.getButtonUI() : ''}
        </div>
      )
    }
    return (
      <div>
        <div className="row">{this.getCommonFormData()}</div>
        {this.getButtonUI()}
      </div>
    )
  }

  getSelectedTieringUI = method => {
    let returnLayout
    switch (method) {
      case 'monthly_value':
        returnLayout = this.montlyValueLayout()
        return returnLayout
      case 'monthly_volume':
        returnLayout = this.montlyVolumeLayout()
        return returnLayout
      case 'single_value':
        returnLayout = this.singleValueLayout()
        return returnLayout
      default:
        returnLayout = ''
        return returnLayout
    }
  }

  montlyValueLayout = () => {
    const { form, selectedTieringRecord } = this.props
    const { selectedFinalTier } = this.state
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromMonthlyBuyAmount', {
              initialValue: selectedTieringRecord.monthly.fromMonthlyBuyAmount,
              rules: [{ required: true, message: 'Please select minimum value' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
        {selectedFinalTier ? (
          ''
        ) : (
          <div className="col-md-6 col-lg-4">
            <Form.Item label="Maximum value :" hasFeedback>
              {form.getFieldDecorator('maxMonthlyBuyAmount', {
                initialValue:
                  selectedTieringRecord.monthly.maxMonthlyBuyAmount === maxValue
                    ? ''
                    : selectedTieringRecord.monthly.maxMonthlyBuyAmount,
                rules: [{ required: true, message: 'Please select maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              // rules: [{ required: true, message: 'Please enter maximum value' }],
            })(
              <Checkbox
                className={styles.isFinalCheckbox}
                checked={selectedFinalTier}
                onChange={this.onChangeFinalTier}
              >
                <strong> Is Final Tier?</strong>
              </Checkbox>,
            )}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  montlyVolumeLayout = () => {
    const { form, selectedTieringRecord } = this.props
    const { selectedFinalTier } = this.state
    // const statusList = data.status.map(option => (
    //   <Option key={option.value} value={option.value} label={option.label}>
    //     {option.label}
    //   </Option>
    // ))
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromNumberOfMonthlyTrades', {
              initialValue: selectedTieringRecord.monthly.fromNumberOfMonthlyTrades,
              rules: [{ required: true, message: 'Please select minimum value' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
        {selectedFinalTier ? (
          ''
        ) : (
          <div className="col-md-6 col-lg-4">
            <Form.Item label="Maximum value :" hasFeedback>
              {form.getFieldDecorator('maxNumberOfMonthlyTrades', {
                initialValue:
                  selectedTieringRecord.monthly.maxNumberOfMonthlyTrades === maxValue
                    ? ''
                    : selectedTieringRecord.monthly.maxNumberOfMonthlyTrades,
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              // rules: [{ required: true, message: 'Please enter maximum value' }],
            })(
              <Checkbox
                className={styles.isFinalCheckbox}
                checked={selectedFinalTier}
                onChange={this.onChangeFinalTier}
              >
                <strong> Is Final Tier?</strong>
              </Checkbox>,
            )}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  singleValueLayout = () => {
    const { form, selectedTieringRecord } = this.props
    const { selectedFinalTier } = this.state
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromValueOfSingleBuyAmount', {
              initialValue: selectedTieringRecord.single.maxNumberOfMonthlyTrades,
              rules: [{ required: true, message: 'Please select minimum value' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
        {selectedFinalTier ? (
          ''
        ) : (
          <div className="col-md-6 col-lg-4">
            <Form.Item label="Maximum value :" hasFeedback>
              {form.getFieldDecorator('maxValueOfSingleBuyAmount', {
                initialValue:
                  selectedTieringRecord.single.maxValueOfSingleBuyAmount === maxValue
                    ? ''
                    : selectedTieringRecord.single.maxValueOfSingleBuyAmount,
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              // rules: [{ required: true, message: 'Please enter maximum value' }],
            })(
              <Checkbox
                className={styles.isFinalCheckbox}
                checked={selectedFinalTier}
                onChange={this.onChangeFinalTier}
              >
                <strong> Is Final Tier?</strong>
              </Checkbox>,
            )}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  getCommonFormData = () => {
    const { form, selectedTieringRecord } = this.props
    return (
      <React.Fragment>
        {/* <div className="row"> */}

        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Mark Up" hasFeedback>
            {form.getFieldDecorator('markup', {
              initialValue: selectedTieringRecord.markup,
              rules: [{ required: true, message: 'Please input markup' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div> */}
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Spread (bps)" hasFeedback>
            {form.getFieldDecorator('spread', {
              initialValue: selectedTieringRecord.spread,
              rules: [{ required: true, message: 'Please input spread' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  getButtonUI = () => {
    const { tradeTieringLoading } = this.props
    return (
      <div className="row">
        <div className={styles.btnStyles}>
          <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
            Cancel
          </Button>
          <Button className={styles.btnSAVE} htmlType="submit" loading={tradeTieringLoading}>
            Save
          </Button>
        </div>
      </div>
    )
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateTradeTieringEditMode(FALSE_VALUE))
  }

  handleTieringMethod = e => {
    const { dispatch } = this.props
    dispatch(updateTradeTieringMethodSelected(e))
  }

  render() {
    const { isTradeTier, selectedTradeTieringMethod } = this.props
    return (
      <Form onSubmit={this.handleTradeRecordSubmit}>
        <Card
          title={
            isTradeTier ? (
              <p> Edit {selectedTradeTieringMethod} Payment Tiering Details </p>
            ) : (
              <p>Edit Non-Tiering Payment Details</p>
            )
          }
          bordered
          headStyle={{
            //   border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '30px',
            //   border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
        >
          {this.getLayout()}
        </Card>
      </Form>
    )
  }
}

export default NewTradeTiering
