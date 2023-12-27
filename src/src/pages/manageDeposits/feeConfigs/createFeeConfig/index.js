import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Form, Select, Card, Row, Col, Icon, Timeline, Input, Button, Radio } from 'antd'

import {
  initiateNewFeeConfig,
  updateClient,
  removeClient,
  updateSourceCurrency,
  updateDestinationCurrency,
  createFeeConfig,
  // createFeeConfig,
  updateTradingHours,
  updateSpreadType,
  updateFeeValue,
  // updateFeeConfigClientOrVendorPreference,
  updateVendor,
  removeSelectedVendor,
  clearFeeConfigData,
} from 'redux/feeconfig/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ settings, user, general, feeConfig }) => ({
  timeZone: settings.timeZone.value,
  clients: general.clients,
  token: user.token,
  vendors: general.newVendors,
  currencies: general.currencies,
  newFeeConfig: feeConfig.newFeeConfig,
  sourceCurrency: feeConfig.newFeeConfig.sourceCurrency,
  destinationCurrency: feeConfig.newFeeConfig.destinationCurrency,
  feeValue: feeConfig.newFeeConfig.feeValue,
  isFeeConfigCreated: feeConfig.newFeeConfig.isFeeConfigCreated,
  createLoading: feeConfig.newFeeConfig.createLoading,
  tradingHours: feeConfig.newFeeConfig.tradingHours,
  spreadType: feeConfig.newFeeConfig.spreadType,
  selectedClientOrVendor: feeConfig.newFeeConfig.selectVendorOrClient,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class CreateFeeConfig extends Component {
  state = {
    clientOrVendor: '',
    clientName: '',
    vendorName: '',
    clientid: '',
    vendorid: '',
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(initiateNewFeeConfig())
  }

  onChangeClientOrVendor = e => {
    const { dispatch } = this.props
    this.setState({
      clientOrVendor: e.target.value,
      clientName: undefined,
      vendorName: undefined,
      clientid: undefined,
      vendorid: undefined,
    })
    dispatch(clearFeeConfigData())
  }

  handlClientChange = (id, value) => {
    const { dispatch } = this.props
    this.setState({
      clientName: value.props.label,
      clientid: value.props.label,
      vendorName: undefined,
    })
    dispatch(updateClient(id))
  }

  removeClient = () => {
    const { form, dispatch } = this.props
    form.setFieldsValue({
      client: undefined,
    })
    dispatch(removeClient())
  }

  handleSourceCurrencyChange = value => {
    const { dispatch } = this.props
    dispatch(updateSourceCurrency(value))
  }

  handleDestinationCurrencyChange = value => {
    const { dispatch } = this.props
    dispatch(updateDestinationCurrency(value))
  }

  handleTradingHoursChange = value => {
    const { dispatch } = this.props
    dispatch(updateTradingHours(value))
  }

  handleSpreadTypeChange = value => {
    const { dispatch } = this.props
    dispatch(updateSpreadType(value))
  }

  handleFeeValueChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(updateFeeValue(value ? parseFloat(value) : null))
  }

  handlVendorChange = (id, value) => {
    const { dispatch } = this.props
    this.setState({
      vendorName: value.props.label,
      vendorid: value.props.label,
      clientName: undefined,
    })
    dispatch(updateVendor(id))
  }

  removeVendor = () => {
    const { form, dispatch } = this.props
    form.setFieldsValue({
      vendor: undefined,
    })
    dispatch(removeSelectedVendor())
  }

  handleConfirmFeeConfig = () => {
    const { dispatch, newFeeConfig, token } = this.props
    delete newFeeConfig.createLoading
    delete newFeeConfig.isFeeConfigCreated
    delete newFeeConfig.selectedClientOrVendor
    const value = newFeeConfig
    dispatch(createFeeConfig(value, token))
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/fee-configs')
  }

  render() {
    const {
      form,
      clients,
      vendors,
      currencies,
      sourceCurrency,
      destinationCurrency,
      createLoading,
      tradingHours,
      spreadType,
      feeValue,
    } = this.props

    const { clientOrVendor, clientName, vendorName, vendorid, clientid } = this.state

    const clientOption = clients.map(option => (
      <Option key={option.id} label={option.genericInformation.registeredCompanyName}>
        <h5>{option.genericInformation.tradingName}</h5>
        <small>{option.genericInformation.registeredCompanyName}</small>
      </Option>
    ))
    const vendorOption = vendors.map(option => (
      <Option key={option.id} label={option.genericInformation?.tradingName}>
        <h5>{option.genericInformation?.tradingName}</h5>
        <small>{option.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))

    const currencyOption = currencies.map(currency => {
      return (
        <Option key={currency.id} value={currency.value}>
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
          title="New Fee Config"
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
                    <Timeline.Item dot={clientOrVendor !== '' ? SuccessIcon : ''}>
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Add Fee Config Preferrence:</strong>
                        <div className={styles.prgressContent}>
                          <div>
                            <Radio.Group
                              value={clientOrVendor}
                              onChange={this.onChangeClientOrVendor}
                            >
                              <Radio value="client">Client</Radio>
                              <Radio value="vendor">Vendor</Radio>
                            </Radio.Group>
                          </div>
                        </div>
                      </div>
                      {clientOrVendor ? (
                        <div>
                          <strong className="font-size-15">
                            {clientOrVendor === 'client' ? 'Select Client' : 'Select Vendor'}
                          </strong>
                          <div className="pb-3 mt-3">
                            <div className={styles.beneTypeBlock}>
                              {clientOrVendor === 'client' ? (
                                <Select
                                  showSearch
                                  style={{ width: '60%' }}
                                  onSelect={this.handlClientChange}
                                  value={clientName}
                                  optionFilterProp="label"
                                  optionLabelProp="label"
                                  filterOption={(input, option) =>
                                    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >=
                                    0
                                  }
                                >
                                  {clientOption}
                                </Select>
                              ) : (
                                <Select
                                  showSearch
                                  style={{ width: '60%' }}
                                  onSelect={this.handlVendorChange}
                                  value={vendorName}
                                  optionFilterProp="children"
                                  optionLabelProp="label"
                                  filterOption={(input, option) =>
                                    option.props.children[0].props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                >
                                  {vendorOption}
                                </Select>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                    </Timeline.Item>
                    <Timeline.Item
                      hidden={!vendorid && !clientid}
                      dot={sourceCurrency ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Source Currency:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select Source Currency</span>
                          </div>
                          <div>
                            <Select
                              className={styles.singleInput}
                              onChange={this.handleSourceCurrencyChange}
                              showSearch
                              value={sourceCurrency}
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                0
                              }
                            >
                              {currencyOption}
                            </Select>
                            ,
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
                                  className={styles.singleInput}
                                  onChange={this.handleDestinationCurrencyChange}
                                  optionFilterProp="children"
                                  showSearch
                                  filterOption={(input, option) =>
                                    option.props.children
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
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
                      dot={tradingHours ? SuccessIcon : ''}
                    >
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Trading Hours:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select the preferred trading hour</span>
                          </div>
                          <div>
                            <Form.Item label="">
                              {form.getFieldDecorator('tradingHours', {
                                initialValue: '',
                              })(
                                <Select
                                  className={styles.singleInput}
                                  onChange={this.handleTradingHoursChange}
                                >
                                  <Option value="businesshours">Business Hours</Option>
                                  <Option value="notimingpreference">No Timing Preference</Option>
                                  <Option value="overnight_weekend">Overnight/Weekend</Option>
                                </Select>,
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item hidden={tradingHours === ''} dot={spreadType ? SuccessIcon : ''}>
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Spread Type:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Select type of spread</span>
                          </div>
                          <div>
                            <Form.Item label="">
                              {form.getFieldDecorator('spreadType', {
                                initialValue: '',
                              })(
                                <Select
                                  className={styles.singleInput}
                                  onChange={this.handleSpreadTypeChange}
                                >
                                  <Option value="fixed">Fixed</Option>
                                  <Option value="variable">Variable</Option>
                                </Select>,
                              )}
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </Timeline.Item>
                    <Timeline.Item hidden={spreadType === ''} dot={feeValue ? SuccessIcon : ''}>
                      <div className={styles.processSection}>
                        <strong className="font-size-15">Fee Value:</strong>
                        <div className={styles.prgressContent}>
                          <div className="pb-3">
                            <span className="font-size-12">Enter the fee value</span>
                          </div>
                          <div>
                            <Form.Item label="">
                              {form.getFieldDecorator('feeValue', {
                                initialValue: '',
                              })(
                                <Input
                                  className={styles.singleInput}
                                  onChange={this.handleFeeValueChange}
                                />,
                              )}
                            </Form.Item>
                            <div className="mt-3">
                              <Button
                                type="deafult"
                                className="mb-3 mr-3"
                                onClick={this.onCancelHandler}
                              >
                                Cancel
                              </Button>
                              <Button
                                loading={createLoading}
                                type="primary"
                                className="mb-3"
                                onClick={this.handleConfirmFeeConfig}
                              >
                                Confirm Add Fee Config
                              </Button>
                            </div>
                          </div>
                        </div>
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
export default CreateFeeConfig
