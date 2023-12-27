import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {
  Form,
  Select,
  Card,
  Row,
  Col,
  Icon,
  Timeline,
  InputNumber,
  DatePicker,
  Result,
  Button,
} from 'antd'

import {
  initiateFxBaseRate,
  updateVendor,
  removeSelectedVendor,
  updateSourceCurrency,
  updateDistinationCurrency,
  updateEnteredRate,
  selectRateAppliedDate,
  getAnalysedRate,
  setAnalyseRateAgain,
  createFxBaseRate,
} from 'redux/fxBaseRate/actions'

import { disabledFutureDate } from 'utilities/transformer'

// import _ from "lodash"

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ settings, user, general, fxBaseRate }) => ({
  timeZone: settings.timeZone.value,
  token: user.token,
  vendors: general.newVendors,
  currencies: general.currencies,
  selectedVendor: fxBaseRate.newFxBaseRate.selectedVendor,
  sourceCurrency: fxBaseRate.newFxBaseRate.sourceCurrency,
  destinationCurrency: fxBaseRate.newFxBaseRate.destinationCurrency,
  rate: fxBaseRate.newFxBaseRate.rate,
  rateAppliedAt: fxBaseRate.newFxBaseRate.rateAppliedAt,
  analysedRate: fxBaseRate.newFxBaseRate.analysedRate,
  analyseLoading: fxBaseRate.newFxBaseRate.analyseLoading,
  isRateAnalysed: fxBaseRate.newFxBaseRate.isRateAnalysed,
  isFxBaseRateCreated: fxBaseRate.newFxBaseRate.isFxBaseRateCreated,
  createLoading: fxBaseRate.newFxBaseRate.createLoading,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class CreateFxBaseRate extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(initiateFxBaseRate())
  }

  componentDidUpdate() {
    const { history, isFxBaseRateCreated } = this.props
    if (isFxBaseRateCreated) {
      history.push('/fx-base-rate')
    }
  }

  handlVendorChange = value => {
    const { vendors, dispatch } = this.props
    const vendorSelected = vendors.find(item => item.id === value)
    dispatch(updateVendor(vendorSelected))
  }

  removeVendor = () => {
    const { form, dispatch } = this.props
    form.resetFields()
    dispatch(removeSelectedVendor())
  }

  handleSourceCurrencyChange = value => {
    const { dispatch } = this.props
    dispatch(updateSourceCurrency(value))
  }

  handleDestinationCurrencyChange = value => {
    const { dispatch } = this.props
    dispatch(updateDistinationCurrency(value))
  }

  enteredRate = value => {
    const { dispatch } = this.props
    dispatch(updateEnteredRate(value))
  }

  handleRateAppliedDateChange = value => {
    const { dispatch } = this.props
    let stringDate
    if (value) {
      const newDate = new Date(value)
      stringDate = newDate.toISOString()
    } else {
      stringDate = null
    }

    dispatch(selectRateAppliedDate(stringDate))
  }

  onRateAppliedDateOk = value => {
    const { dispatch } = this.props
    const newDate = new Date(value)
    const stringDate = newDate.toISOString()
    dispatch(selectRateAppliedDate(stringDate))
  }

  onAnalyseClickHandler = () => {
    const {
      dispatch,
      token,
      selectedVendor,
      sourceCurrency,
      destinationCurrency,
      rate,
      rateAppliedAt,
    } = this.props
    const values = {
      IsInverse: true,
      accountId: selectedVendor.id,
      vendorName: selectedVendor.genericInformation?.tradingName,
      vendorRate: rate,
      rateType: 'BUYRATE',
      fxRateDateAndTime: rateAppliedAt,
      tradeCurrency: sourceCurrency,
      targetCurrency: destinationCurrency,
    }
    dispatch(getAnalysedRate(values, token))
  }

  onClickAnalyseAgainHandler = () => {
    const { dispatch } = this.props
    dispatch(setAnalyseRateAgain())
  }

  onConfirmHandler = () => {
    const {
      dispatch,
      token,
      selectedVendor,
      sourceCurrency,
      destinationCurrency,
      rate,
      rateAppliedAt,
    } = this.props

    const vendorFxvalues = {
      rateAppliedAt,
      baseProviderName: selectedVendor.genericInformation?.tradingName || '',
      vendor: selectedVendor.id,
      baseCurrency: sourceCurrency,
      baseAmount: 1,
      targetCurrency: destinationCurrency,
      inverseAmount: rate,
    }
    dispatch(createFxBaseRate(vendorFxvalues, token))
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/fx-base-rates')
  }

  render() {
    const {
      form,
      vendors,
      currencies,
      selectedVendor,
      sourceCurrency,
      destinationCurrency,
      rate,
      rateAppliedAt,
      analysedRate,
      analyseLoading,
      isRateAnalysed,
      createLoading,
    } = this.props

    const nullSymbol = '---'

    const vendorOption = vendors.map(option => {
      return (
        <Option key={option.id} label={option.genericInformation?.tradingName}>
          <div className="list-card">
            <h5>{option.genericInformation?.tradingName}</h5>
            <span className="font-size-12">{option.genericInformation?.registeredCompanyName}</span>
          </div>
        </Option>
      )
    })

    const currencyOption = currencies.map(currency => {
      return (
        <Option key={currency.id} label={currency.value} value={currency.value}>
          {currency.value}
        </Option>
      )
    })

    const SuccessIcon = (
      <Icon type="check-circle" style={{ fontSize: '16px', color: '#4c7a34' }} theme="filled" />
    )

    return (
      <Fragment>
        <Card
          title="New Fx Base Rate"
          bordered={false}
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
        >
          <Row>
            <Col>
              <div className={styles.timelineCard}>
                <Form>
                  <Timeline>
                    <Timeline.Item
                      dot={Object.entries(selectedVendor).length !== 0 ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Rate Provider Name:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Rate Provider</span>
                          </div>
                          <div>
                            {Object.entries(selectedVendor).length === 0 &&
                            selectedVendor.constructor === Object ? (
                              <Form.Item label="">
                                {form.getFieldDecorator('vendor', {
                                  initialValue: '',
                                })(
                                  <Select
                                    showSearch
                                    className={styles.singleInput}
                                    onChange={this.handlVendorChange}
                                    optionLabelProp="label"
                                    filterOption={(input, option) =>
                                      option.props.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                    }
                                  >
                                    {vendorOption}
                                  </Select>,
                                )}
                              </Form.Item>
                            ) : (
                              <div
                                className={`${styles.flexSpaceBetween} ${styles.listCard} ${styles.singleInput}`}
                              >
                                <div>
                                  <h6>
                                    {selectedVendor
                                      ? selectedVendor.genericInformation?.tradingName
                                      : nullSymbol}
                                  </h6>
                                  <div>
                                    <small>
                                      {selectedVendor
                                        ? selectedVendor.genericInformation?.vendorName
                                        : ''}
                                    </small>
                                  </div>
                                  <div>
                                    <small>
                                      Registered Company Name :{' '}
                                      {selectedVendor
                                        ? selectedVendor.genericInformation?.registeredCompanyName
                                        : ''}
                                    </small>
                                  </div>
                                  <div className={styles.flexSpaceBetween}>
                                    {selectedVendor.profile?.servicesOffering ? (
                                      <small>
                                        {' '}
                                        Type :{' '}
                                        {selectedVendor.profile?.servicesOffering?.join(', ')}
                                      </small>
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                </div>
                                <div style={{ alignItems: 'center', cursor: 'pointer' }}>
                                  <Icon onClick={this.removeVendor} type="close" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={Object.entries(selectedVendor).length === 0}
                      dot={sourceCurrency ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Source Currency:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Source Currency</span>
                          </div>
                          <div>
                            <Form.Item label="">
                              {form.getFieldDecorator('sourceCurrency', {
                                initialValue: '',
                              })(
                                <Select
                                  showSearch
                                  className={styles.singleInput}
                                  onChange={this.handleSourceCurrencyChange}
                                  optionLabelProp="label"
                                  filterOption={(input, option) =>
                                    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                  }
                                >
                                  {currencyOption}
                                </Select>,
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={sourceCurrency === ''}
                      dot={destinationCurrency ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Destination Currency:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Destination Currency</span>
                          </div>
                          <div>
                            <Form.Item label="">
                              {form.getFieldDecorator('destinationCurrency', {
                                initialValue: '',
                              })(
                                <Select
                                  showSearch
                                  className={styles.singleInput}
                                  onChange={this.handleDestinationCurrencyChange}
                                  optionLabelProp="label"
                                  filterOption={(input, option) =>
                                    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                  }
                                >
                                  {currencyOption}
                                </Select>,
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={destinationCurrency === ''}
                      dot={rate ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Rate:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Enter Rate</span>
                          </div>
                          <div>
                            <Form.Item label="">
                              {form.getFieldDecorator('rate', {
                                initialValue: '',
                              })(
                                <InputNumber
                                  className={styles.singleInput}
                                  onChange={this.enteredRate}
                                />,
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item hidden={rate === null} dot={rateAppliedAt ? SuccessIcon : ''}>
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Rate Applied At:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Rate applied Date</span>
                          </div>
                          <div>
                            <Form.Item className={`${styles.mt1}`} label="">
                              {form.getFieldDecorator(
                                'rateAppliedAt',
                                {},
                              )(
                                <DatePicker
                                  disabledDate={disabledFutureDate}
                                  showTime={{ format: 'HH:mm:ss' }}
                                  placeholder="Select Rate Applied Date"
                                  format="DD/MM/YYYY HH:mm:ss"
                                  onChange={this.handleRateAppliedDateChange}
                                  onOk={this.onRateAppliedDateOk}
                                />,
                              )}
                            </Form.Item>
                          </div>
                        </div>
                        {!isRateAnalysed && (
                          <div className={styles.prgressContent}>
                            <div>
                              <Button
                                hidden={rateAppliedAt === ''}
                                loading={analyseLoading}
                                type="primary"
                                onClick={this.onAnalyseClickHandler}
                              >
                                Analyse Rate
                              </Button>
                            </div>
                          </div>
                        )}
                        {isRateAnalysed && (
                          <>
                            <div className={styles.prgressContent}>
                              <div className={`${styles.listCard}`}>
                                <Result
                                  status={analysedRate.spreadDifference <= 0 ? 'success' : 'error'}
                                  title={
                                    <>
                                      {selectedVendor.genericInformation?.tradingName} Rate{' '}
                                      {analysedRate.actualRate} is{' '}
                                      <strong>{analysedRate.spreadDifference}%</strong> Over{' '}
                                      {analysedRate.fxProvider} {analysedRate.baseProviderName} Rate{' '}
                                      {analysedRate.fxRate}
                                    </>
                                  }
                                  // subTitle=""
                                  extra={[
                                    <Button
                                      type="primary"
                                      key="confirm"
                                      loading={createLoading}
                                      onClick={this.onConfirmHandler}
                                    >
                                      Confirm Rate
                                    </Button>,
                                    <Button key="cancel" onClick={this.onCancelHandler}>
                                      Cancel
                                    </Button>,
                                    <Button
                                      key="analyseAgain"
                                      type="link"
                                      onClick={this.onClickAnalyseAgainHandler}
                                    >
                                      Analyse Again
                                    </Button>,
                                  ]}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </Timeline.Item>
                  </Timeline>
                </Form>
              </div>
            </Col>
          </Row>
        </Card>
      </Fragment>
    )
  }
}
export default CreateFxBaseRate
