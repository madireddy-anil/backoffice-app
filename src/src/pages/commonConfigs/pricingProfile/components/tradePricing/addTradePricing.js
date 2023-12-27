import React, { Component } from 'react'
import { Form, Card, Radio, Select, InputNumber, Checkbox, Button } from 'antd'
import { connect } from 'react-redux'
import {
  updateTradeRecord,
  updateTradeListView,
  updateTradeAddView,
  updateTradeTieringMethodSelected,
  updateIsTradeTieredPricing,
  editSelectedPricingProfile,
} from '../../../../../redux/pricing/action'
import data from '../../data.json'
import styles from '../../style.module.scss'

const { Option } = Select
const maxValue = 999999999999999

const mapStateToProps = ({ user, general, pricingProfiles }) => ({
  token: user.token,
  currencies: general.currencies,
  errorList: pricingProfiles.errorList,
  loading: pricingProfiles.loading,
  clients: general.clients,
  tradesPricingList: pricingProfiles.tradesPricingList,

  trades: pricingProfiles.trades,
  tradesTieringList: pricingProfiles.trades.tiering,
  showtradeAddTiering: pricingProfiles.tradesTieringAddView,
  isTradeTier: pricingProfiles.isTradeTier,
  selectedTradeTieringMethod: pricingProfiles.selectedTradeTieringMethod,

  isNewPricingProfile: pricingProfiles.isNewPricingProfile,
  selectedPricingProfile: pricingProfiles.selectedPricingProfile,
  //   loading: currencies.loading,
})

@Form.create()
@connect(mapStateToProps)
class NewTradePricing extends Component {
  state = {
    showFields: undefined,
    selectedFinalTier: false,
  }

  componentDidMount() {
    const { dispatch, addMoreTradeTiering } = this.props
    if (!addMoreTradeTiering) {
      dispatch(updateIsTradeTieredPricing(undefined))
    }
  }

  onChangeFinalTier = e => {
    this.setState({ selectedFinalTier: e.target.checked })
  }

  onRadioChange = e => {
    const { dispatch } = this.props
    this.setState({ showFields: true })
    dispatch(updateTradeTieringMethodSelected(undefined))
    const selectedValue = e.target.value === 'true' || false
    dispatch(updateIsTradeTieredPricing(selectedValue))
  }

  handleTradeRecordSubmit = event => {
    event.preventDefault()
    const {
      form,
      dispatch,
      // tradesPricingList,
      tradesTieringList,
      isTradeTier,
      selectedTradeTieringMethod,
      isNewPricingProfile,
      selectedPricingProfile,
      token,
      // addMoreTradeTiering,
    } = this.props
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
            tradesTier: isTradeTier,
            tradesTieringMethod: selectedTradeTieringMethod,
            isFinalTier: values.isFinalTier ? values.isFinalTier : false,
            tradesTieringActive: true,
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
            tradesTier: isTradeTier,
            tradesTieringMethod: selectedTradeTieringMethod,
            isFinalTier: values.isFinalTier ? values.isFinalTier : false,
            tradesTieringActive: true,
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
            tradesTier: isTradeTier,
            tradesTieringMethod: selectedTradeTieringMethod,
            isFinalTier: values.isFinalTier ? values.isFinalTier : false,
            tradesTieringActive: true,
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
    const { form } = this.props
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
                rules: [{ required: true, message: 'Please select maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('tradesTieringActive', {
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
    const { form } = this.props
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
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('tradesTieringActive', {
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
    const { form } = this.props
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
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('tradesTieringActive', {
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
    const { form } = this.props
    return (
      <React.Fragment>
        {/* <div className="row"> */}

        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Mark Up" hasFeedback>
            {form.getFieldDecorator('markup', {
              rules: [{ required: true, message: 'Please input markup' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div> */}
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Spread (bps)" hasFeedback>
            {form.getFieldDecorator('spread', {
              rules: [{ required: true, message: 'Please input spread' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  getButtonUI = () => {
    const { tradesTieringList, loading } = this.props
    return (
      <div className="row">
        <div className={styles.btnStyles}>
          <Button
            className={styles.btnCANCEL}
            onClick={this.onCancelHandler}
            disabled={tradesTieringList.length === 0}
          >
            Cancel
          </Button>
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
    const { form, addMoreTradeTiering, isTradeTier, selectedTradeTieringMethod } = this.props
    const { showFields } = this.state
    // const currenciesList = currencies.map(option => (
    //   <Option key={option.value} value={option.value} label={option.title}>
    //     {option.title}
    //   </Option>
    // ))

    const tieringMethods = data.tradeTieringMethods.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const headerBlockStyle = {
      marginBottom: '10px',
      background: '#fafafa',
      borderTopRightRadius: '8px',
      borderTopLeftRadius: '8px',
    }
    return (
      <Form onSubmit={this.handleTradeRecordSubmit}>
        {addMoreTradeTiering ? (
          <Card
            title={
              isTradeTier ? (
                <p> Add more {selectedTradeTieringMethod} Tiering Records </p>
              ) : (
                <p>Add More Non- Tiering Pricing</p>
              )
            }
            headStyle={headerBlockStyle}
            className={styles.activeSelectedBene}
          >
            {this.getLayout()}
          </Card>
        ) : (
          <Card
            title="Add New Trade Pricing Details"
            headStyle={headerBlockStyle}
            className={styles.activeSelectedBene}
          >
            <div className="row">
              <div className="col-md-6 col-lg-12">
                <Form.Item>
                  {form.getFieldDecorator('tradesTier', {
                    // rules: [{ required: true, message: 'Please select profile type' }],
                  })(
                    // <Checkbox onChange={this.handleChangeTiering} checked={isTiering}>
                    //   Tiering Pricing ?
                    // </Checkbox>,
                    <Radio.Group onChange={this.onRadioChange}>
                      <Radio value="true">Tiered Pricing</Radio>
                      <Radio value="false">Non-Tiered Pricing</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </div>
            </div>
            {isTradeTier ? (
              <div className="row">
                <div className="col-md-6 col-lg-4">
                  <Form.Item hasFeedback>
                    {form.getFieldDecorator('tradesTieringMethod', {
                      rules: [{ required: true, message: 'Please select tiering method' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        placeholder="Please select tiering method"
                        showSearch
                        // value={selectedTiering}
                        onChange={this.handleTieringMethod}
                        filterOption={(input, option) =>
                          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {tieringMethods}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
              </div>
            ) : (
              ''
            )}

            {showFields ? this.getLayout() : ''}
          </Card>
        )}
      </Form>
    )
  }
}

export default NewTradePricing
