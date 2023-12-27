import React, { Component } from 'react'
import { Form, Button, Select, Modal } from 'antd'
import InfoCard from 'components/customComponents/InfoCard'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  addVendorLocalAccount,
  updateVendorLocalAccountAddMode,
  editVendorLocalAccount,
  updateVendorLocalAccountsEditMode,
} from 'redux/vendorConfiguration/action'

import styles from '../style.module.scss'

const { Option } = Select
const FALSE_VALUE = false

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,
  countries: general.countries,
  currencies: general.currencies,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  addressEditMode: vendorConfiguration.addressEditMode,

  showVendorFeeAddMode: vendorConfiguration.showVendorFeeAddMode,
  showVendorFeeEditMode: vendorConfiguration.showVendorFeeEditMode,
  selectedRecordToEdit: vendorConfiguration.selectedRecordToEdit,

  localAccountsLoading: vendorConfiguration.localAccountsLoading,

  showVendorLocalAccountAddMode: vendorConfiguration.showVendorLocalAccountAddMode,
  showEditLocalAccountsData: vendorConfiguration.showEditLocalAccountsData,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addVendorLocalAccounts extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedVendorConfig, showEditLocalAccountsData } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          supportedCurrencies: values.currenciesSupported,
        }
        if (showEditLocalAccountsData) {
          dispatch(editVendorLocalAccount(selectedVendorConfig.id, value, token))
        } else {
          dispatch(addVendorLocalAccount(selectedVendorConfig.id, value, token))
        }
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch, showEditLocalAccountsData } = this.props
    if (showEditLocalAccountsData) {
      dispatch(updateVendorLocalAccountsEditMode(false))
    } else {
      dispatch(updateVendorLocalAccountAddMode(FALSE_VALUE))
    }
  }

  render() {
    const {
      form,
      currencies,
      showVendorLocalAccountAddMode,
      localAccountsLoading,
      showEditLocalAccountsData,
      record,
    } = this.props
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))

    return (
      <Modal
        visible={showVendorLocalAccountAddMode || showEditLocalAccountsData}
        title={
          <div className={styles.modalHeader}>
            <InfoCard
              minHeight="80px"
              imgHeight="100px"
              imgTop="43%"
              header={
                showEditLocalAccountsData
                  ? 'Edit Local Account Details'
                  : 'Add Local Account Details'
              }
              closeButton={this.onCancelHandler}
            />
          </div>
        }
        footer={null}
        className={styles.modalBlock}
        closable={false}
        destroyOnClose
      >
        <div>
          <Form layout="vertical" onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col-md-12 col-lg-12">
                <Form.Item label="Currencies Supported" hasFeedback>
                  {form.getFieldDecorator('currenciesSupported', {
                    initialValue: record ? record.supportedCurrencies : undefined,
                    rules: [{ required: true, message: 'Please select currencies supported' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      mode="multiple"
                      optionLabelProp="label"
                      placeholder="please select currencies supported"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {currencyOption}
                    </Select>,
                  )}
                </Form.Item>
              </div>

              <div className="row">
                <div className={styles.btnStyles}>
                  <Button
                    className={styles.btnCANCEL}
                    onClick={this.onCancelHandler}
                    // disabled={payments.length === 0}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={styles.btnSAVE}
                    htmlType="submit"
                    loading={localAccountsLoading}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    )
  }
}

export default addVendorLocalAccounts
