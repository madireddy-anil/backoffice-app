import React, { Component } from 'react'
import { Form, Input, Button, Spin, Divider, Select, Modal } from 'antd'
import { connect } from 'react-redux'
// import _ from 'lodash';
import Spacer from 'components/CleanUIComponents/Spacer'
import { updatedFeeConfig } from 'redux/feeconfig/actions'
import variables from 'utilities/variables'
import jsondata from './data.json'

import styles from './style.module.scss'

const { Option } = Select
const { confirm } = Modal
// const { spreadType, feeCategory, tradingHours } = variables

const mapStateToProps = ({ general, bankAccount, user, feeConfig }) => ({
  vendors: general.newVendors,
  clients: general.clients,
  account: bankAccount.bankAccountDetail,
  token: user.token,
  selectedFeeConfig: feeConfig.selectedFeeConfig,
  loading: feeConfig.loading,
  currencies: general.currencies,
})

@Form.create()
@connect(mapStateToProps)
class ViewOrEditFeeConfig extends Component {
  state = {
    selectedFeeConfigDetails: {},
    formatedViewFeeConfig: [],
    formatedEditFeeConfig: [],
    vendorOrClientDetails: {
      tradingName: '',
      registeredCompanyName: '',
      vendorType: '',
      clientType: '',
    },
    empty: '--',
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isAccountFetched) {
      this.feeConfigSummary()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { selectedFeeConfig } = this.props
    const isPropsUpdated = {
      isAccountFetched: prevProps.selectedFeeConfig !== selectedFeeConfig,
    }
    return isPropsUpdated
  }

  feeConfigSummary = () => {
    const { clients, vendors, selectedFeeConfig } = this.props
    const editFormatedData = []
    const viewFormatedData = []
    // const vendorObj = vendors.find(el => el.id === account.vendorId)
    jsondata.viewFeeConfig.forEach(item => {
      Object.entries(selectedFeeConfig).map(([key, value]) => {
        if (item.fieldName === key) {
          const formatData = {
            fieldName: item.labelName,
            schemaName: key,
            value,
          }
          viewFormatedData.push(formatData)
        }
        return viewFormatedData
      })
    })
    jsondata.editFeeConfig.forEach(item => {
      Object.entries(selectedFeeConfig).map(([key, value]) => {
        if (item.fieldName === key) {
          const formatData = {
            fieldName: item.labelName,
            schemaName: key,
            inputType: item.inputType,
            value,
          }
          editFormatedData.push(formatData)
        }
        return editFormatedData
      })
    })
    if (selectedFeeConfig !== undefined && selectedFeeConfig.clientId) {
      const clientObj = clients.find(el => el.id === selectedFeeConfig.clientId)
      if (clientObj !== undefined) {
        this.setState({ vendorOrClientDetails: clientObj })
      }
    }
    if (selectedFeeConfig !== undefined && selectedFeeConfig.vendorId) {
      const vendorObj = vendors.find(el => el.id === selectedFeeConfig.vendorId)
      if (vendorObj !== undefined) {
        this.setState({ vendorOrClientDetails: vendorObj })
      }
    }
    this.setState({
      selectedFeeConfigDetails: selectedFeeConfig,
      formatedViewFeeConfig: viewFormatedData,
      formatedEditFeeConfig: editFormatedData,
      // vendorInfo: vendorObj !== undefined && vendorObj,
    })
  }

  onPopUpMessage = e => {
    e.preventDefault()
    const insidethis = this
    confirm({
      title: 'Are you sure Save?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        insidethis.handleUpdateFeeConfig(e)
      },
      onCancel() {},
    })
  }

  handleUpdateFeeConfig = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { selectedFeeConfigDetails } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(updatedFeeConfig(selectedFeeConfigDetails.id, values, token))
      }
    })
  }

  feeConfigView = () => {
    const { empty, formatedViewFeeConfig, vendorOrClientDetails } = this.state
    const displayValue = (label, value) => {
      if (label === 'Spreed Type') {
        return variables.spreadType.map(option => option.value === value && option.label)
      }
      if (label === 'Trading Hours') {
        return variables.tradingHours.map(option => option.value === value && option.label)
      }
      if (label === 'Fee Category') {
        return variables.feeCategory.map(option => option.value === value && option.label)
      }
      return value
    }
    return (
      <div className={styles.modalCardScroll}>
        <strong className="font-size-15">Vendor</strong>
        <div className="pb-3 mt-1">
          <span className="font-size-12">Selected Vendor</span>
        </div>
        <div className={`${styles.modalistCard}`}>
          <h6>
            {Object.entries(vendorOrClientDetails).length > 0
              ? vendorOrClientDetails.genericInformation?.tradingName
              : empty}
          </h6>
          <div>
            <small>
              {Object.entries(vendorOrClientDetails).length > 0
                ? vendorOrClientDetails.genericInformation?.registeredCompanyName
                : empty}
            </small>
          </div>
          <div>
            <small>
              {Object.entries(vendorOrClientDetails).length > 0
                ? vendorOrClientDetails.genericInformation?.vendorType
                : empty}
            </small>
          </div>
        </div>
        <div className={styles.formModalBox}>
          <div className="row">
            {formatedViewFeeConfig.length > 0 &&
              formatedViewFeeConfig.map(item => {
                return (
                  <div key={item.schemaName} className="col-lg-6 mt-4">
                    <strong className="font-size-15">{item.fieldName}</strong>
                    <div className="pb-3 mt-1">
                      <span className="font-size-12">Selected {item.fieldName}</span>
                    </div>
                    <div className={`${styles.inputBox}`}>
                      <div className="p-3">
                        {item.value ? displayValue(item.fieldName, item.value) : empty}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    )
  }

  feeConfigEdit = () => {
    const { empty, formatedEditFeeConfig, vendorOrClientDetails } = this.state
    const { form, currencies } = this.props
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))
    const tradingHours = jsondata.tradingHours.map(option => (
      <Option key={option.labelName} value={option.labelName} label={option.labelName}>
        {option.fieldName}
      </Option>
    ))
    const spreadOptions = jsondata.spreadTypes.map(option => (
      <Option key={option.labelName} value={option.labelName} label={option.labelName}>
        {option.fieldName}
      </Option>
    ))

    const getFieldOptions = label => {
      let returnResp
      switch (label) {
        case 'tradingHours':
          returnResp = tradingHours
          break
        case 'spreadType':
          returnResp = spreadOptions
          break
        case 'destinationCurrency':
          returnResp = currencyOption
          break
        case 'sourceCurrency':
          returnResp = currencyOption
          break
        default:
          break
      }
      return returnResp
    }
    return (
      <div>
        <div className={styles.modalCardScroll}>
          <strong className="font-size-15">Vendor</strong>
          <strong className="font-size-15">Vendor</strong>
          <div className="pb-3 mt-1">
            <span className="font-size-12">Selected Vendor</span>
          </div>
          <div className={`${styles.modalistCard}`}>
            <h6>
              {Object.entries(vendorOrClientDetails).length > 0
                ? vendorOrClientDetails.genericInformation?.tradingName
                : empty}
            </h6>
            <div>
              <small>
                {Object.entries(vendorOrClientDetails).length > 0
                  ? vendorOrClientDetails.genericInformation?.registeredCompanyName
                  : empty}
              </small>
            </div>
            <div>
              <small>
                {Object.entries(vendorOrClientDetails).length > 0
                  ? vendorOrClientDetails.genericInformation?.vendorType
                  : empty}
              </small>
            </div>
          </div>
          <Spacer height="20px" />
          <Form className={styles.formModalBox} onSubmit={this.onPopUpMessage}>
            <div className="row">
              {formatedEditFeeConfig.length > 0 &&
                formatedEditFeeConfig.map(item => {
                  return (
                    <div key={item.schemaName} className="col-sm-6 col-lg-6">
                      <strong className="font-size-15">{item.fieldName}</strong>
                      <Spacer height="14px" />
                      {item.inputType === 'select' && (
                        <Form.Item>
                          {form.getFieldDecorator(item.schemaName, {
                            initialValue: item.value,
                            rules: [
                              {
                                required: false,
                                message: `Please enter ${item.fieldName}`,
                              },
                            ],
                          })(
                            <Select
                              showSearch
                              style={{ width: '100%' }}
                              // bordered
                              className={styles.cstmSelectInput}
                              optionLabelProp="label"
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {getFieldOptions(item.schemaName)}
                            </Select>,
                          )}
                        </Form.Item>
                      )}
                      {item.inputType === 'input' && (
                        <Form.Item>
                          {form.getFieldDecorator(item.schemaName, {
                            initialValue: item.value,
                            rules: [
                              {
                                required: false,
                                message: `Please enter ${item.fieldName}`,
                              },
                            ],
                          })(
                            <Input
                              style={{ width: '100%' }}
                              size="large"
                              className={styles.inputbox}
                            />,
                          )}
                        </Form.Item>
                      )}
                    </div>
                  )
                })}
            </div>
            <Divider />
            <Button className={styles.btnCheckoutSAVE} htmlType="submit">
              SAVE
            </Button>
          </Form>
        </div>
      </div>
    )
  }

  render() {
    const { action, loading } = this.props
    return (
      <Spin spinning={loading}>
        <div className="row">
          <div className="col-lg-12">
            <div>
              {action === 'view' && <div>{this.feeConfigView()}</div>}
              {action === 'edit' && <div>{this.feeConfigEdit()}</div>}
            </div>
          </div>
        </div>
      </Spin>
    )
  }
}

export default ViewOrEditFeeConfig
