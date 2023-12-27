import React, { Component } from 'react'
import { Button, Form, InputNumber, Card, Checkbox } from 'antd'
import { connect } from 'react-redux'
import {
  updateTradeRecord,
  updateTradeListView,
  updateTradeAddView,
  updateTradeEditView,
  updateTradeTieringMethodSelected,
  editSelectedPricingProfile,
} from '../../../../../redux/pricing/action'
// import data from '../../data.json'
import styles from '../../style.module.scss'

// const { Option } = Select
const maxValue = 999999999999999

const mapStateToProps = ({ user, general, pricingProfiles }) => ({
  token: user.token,
  currencies: general.currencies,
  errorList: pricingProfiles.errorList,
  loading: pricingProfiles.loading,
  clients: general.clients,
  // tradesPricingList: pricingProfiles.tradesPricingList,
  //   loading: currencies.loading,

  tradesTieringList: pricingProfiles.trades.tiering,
  selectedTradeTieringMethod: pricingProfiles.selectedTradeTieringMethod,
  isTradeTier: pricingProfiles.isTradeTier,
  isNewPricingProfile: pricingProfiles.isNewPricingProfile,
  selectedPricingProfile: pricingProfiles.selectedPricingProfile,
})

@Form.create()
@connect(mapStateToProps)
class editTradePricing extends Component {
  state = {
    selectedFinalTier: false,
    tradesTieringActive: undefined,
  }

  componentDidMount() {
    const { recordData } = this.props
    this.setState({
      selectedFinalTier: recordData.isFinalTier,
      tradesTieringActive: recordData.tradesTieringActive
        ? recordData.tradesTieringActive
        : undefined,
    })
  }

  onChangeFinalTier = e => {
    this.setState({ selectedFinalTier: e.target.checked })
  }

  handleTradeRecordSubmit = event => {
    event.preventDefault()
    const { selectedFinalTier, tradesTieringActive } = this.state
    const {
      form,
      dispatch,
      tradesTieringList,
      isTradeTier,
      selectedTradeTieringMethod,
      // addMoreTradeTiering,
      isNewPricingProfile,
      selectedPricingProfile,
      token,
    } = this.props
    form.validateFields((error, values) => {
      let tierPricing = {}
      if (!error) {
        if (!isTradeTier) {
          values.tradesTier = isTradeTier
          tierPricing = values
        }
        if (selectedTradeTieringMethod === 'monthly_value') {
          tierPricing = {
            // markup: values.markup,
            index: values.index,
            spread: values.spread,
            tradesTier: isTradeTier,
            tradesTieringMethod: selectedTradeTieringMethod,
            isFinalTier: selectedFinalTier,
            tradesTieringActive,
            monthly: {
              fromMonthlyBuyAmount: values.fromMonthlyBuyAmount,
              maxMonthlyBuyAmount: values.isFinalTier ? maxValue : values.maxMonthlyBuyAmount,
            },
          }
        }
        if (selectedTradeTieringMethod === 'monthly_volume') {
          tierPricing = {
            // markup: values.markup,
            index: values.index,
            spread: values.spread,
            tradesTier: isTradeTier,
            tradesTieringMethod: selectedTradeTieringMethod,
            isFinalTier: selectedFinalTier,
            tradesTieringActive,
            monthly: {
              fromNumberOfMonthlyTrades: values.fromNumberOfMonthlyTrades,
              maxNumberOfMonthlyTrades: values.isFinalTier
                ? maxValue
                : values.maxNumberOfMonthlyTrades,
            },
          }
        }
        if (selectedTradeTieringMethod === 'single_value') {
          tierPricing = {
            // markup: values.markup,
            index: values.index,
            spread: values.spread,
            tradesTier: isTradeTier,
            tradesTieringMethod: selectedTradeTieringMethod,
            isFinalTier: selectedFinalTier,
            tradesTieringActive,
            single: {
              fromValueOfSingleBuyAmount: values.fromValueOfSingleBuyAmount,
              maxValueOfSingleBuyAmount: values.isFinalTier
                ? maxValue
                : values.maxValueOfSingleBuyAmount,
            },
          }
        }
        if (isNewPricingProfile) {
          const tradesList = [...tradesTieringList, tierPricing]
          dispatch(updateTradeRecord(tradesList))
        } else {
          selectedPricingProfile.trades.tiering = [
            ...selectedPricingProfile.trades.tiering,
            tierPricing,
          ]
          dispatch(
            editSelectedPricingProfile(selectedPricingProfile.id, selectedPricingProfile, token),
          )
        }
        dispatch(updateTradeListView(true))
        dispatch(updateTradeAddView(false))
        dispatch(updateTradeEditView(false))
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateTradeAddView(false))
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
    const { form, recordData } = this.props
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
            {form.getFieldDecorator('fromMonthlyBuyAmount', {
              initialValue: recordData.monthly.fromMonthlyBuyAmount,
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
                  recordData.monthly.maxMonthlyBuyAmount === maxValue
                    ? ''
                    : recordData.monthly.maxMonthlyBuyAmount,
                rules: [{ required: true, message: 'Please select maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('tradesTieringActive', {
              initialValue: recordData.tradesTieringActive.toString(),
              rules: [{ required: true, message: 'Please select status' }],
            })(
              <Select
                style={{ width: '100%' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select iering Status"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList}
              </Select>,
            )}
          </Form.Item>
        </div> */}
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
    const { form, recordData } = this.props
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
              initialValue: recordData.monthly.fromNumberOfMonthlyTrades,
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
                  recordData.monthly.maxNumberOfMonthlyTrades === maxValue
                    ? ''
                    : recordData.monthly.maxNumberOfMonthlyTrades,
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('tradesTieringActive', {
              initialValue: recordData.tradesTieringActive.toString(),
              rules: [{ required: true, message: 'Please select status' }],
            })(
              <Select
                style={{ width: '100%' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select iering Status"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList}
              </Select>,
            )}
          </Form.Item>
        </div> */}
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
    const { form, recordData } = this.props
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
            {form.getFieldDecorator('fromValueOfSingleBuyAmount', {
              initialValue: recordData.single.fromValueOfSingleBuyAmount,
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
                  recordData.single.maxValueOfSingleBuyAmount === maxValue
                    ? ''
                    : recordData.single.maxValueOfSingleBuyAmount === maxValue,
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('tradesTieringActive', {
              initialValue: recordData.tradesTieringActive.toString(),
              rules: [{ required: true, message: 'Please select status' }],
            })(
              <Select
                style={{ width: '100%' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select iering Status"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList}
              </Select>,
            )}
          </Form.Item>
        </div> */}
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
    const { form, recordData } = this.props
    return (
      <React.Fragment>
        {/* <div className="row"> */}

        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Mark Up" hasFeedback>
            {form.getFieldDecorator('markup', {
              initialValue: recordData.markup,
              rules: [{ required: true, message: 'Please input mark up' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div> */}
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Spread (bps)" hasFeedback>
            {form.getFieldDecorator('spread', {
              initialValue: recordData.spread,
              rules: [{ required: true, message: 'Please input spread' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  getButtonUI = () => {
    const { loading } = this.props
    return (
      <div className="row">
        <div className={styles.btnStyles}>
          {/* <Button
            className={styles.btnCANCEL}
            onClick={this.onCancelHandler}
            disabled={tradesTieringList.length === 0}
          >
            Cancel
          </Button> */}
          <Button className={styles.btnSAVE} loading={loading} htmlType="submit">
            Save
          </Button>
        </div>
      </div>
    )
  }

  handleTieringMethod = e => {
    const { dispatch } = this.props
    // form.setFieldsValue({
    //   tradeTieringMethod: e,
    // })
    dispatch(updateTradeTieringMethodSelected(e))
  }

  render() {
    // const { form, currencies, loading, recordData } = this.props
    // const currenciesList = currencies.map(option => (
    //   <Option key={option.value} value={option.value} label={option.title}>
    //     {option.title}
    //   </Option>
    // ))
    const headerBlockStyle = {
      marginBottom: '10px',
      background: '#fafafa',
      borderTopRightRadius: '8px',
      borderTopLeftRadius: '8px',
    }
    return (
      <Card
        title="Edit Trade Pricing Details"
        headStyle={headerBlockStyle}
        className={styles.activeSelectedBene}
      >
        <Form onSubmit={this.handleTradeRecordSubmit}>{this.getLayout()}</Form>
      </Card>
    )
  }
}

export default editTradePricing
