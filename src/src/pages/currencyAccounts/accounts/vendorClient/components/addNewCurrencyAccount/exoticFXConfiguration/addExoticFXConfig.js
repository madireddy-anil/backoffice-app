import React, { Component } from 'react'
import { Modal, Form, Input, Button, Select, TimePicker } from 'antd'
import {
  updateShowAddExoticFXConfig,
  addNewVendorClientExoticFXConfig,
  updateShowEditExoticFX,
  editVendorClientExoticFXConfig,
} from 'redux/currencyAccounts/action'
import moment from 'moment'
import InfoCard from 'components/customComponents/InfoCard'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import styles from './style.module.scss'
import data from './data.json'

const { Option } = Select

const mapStateToProps = ({ user, currencyAccounts }) => ({
  token: user.token,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,

  showAddExoticFXConfig: currencyAccounts.showAddExoticFXConfig,
  addExoticConfigLoading: currencyAccounts.addExoticConfigLoading,

  showEditExoticFX: currencyAccounts.showEditExoticFX,
  selectedRecordToEdit: currencyAccounts.selectedRecordToEdit,
})

@Form.create()
@connect(mapStateToProps)
class addExoticFXConfig extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, selectedCurrencyAccount, token, dispatch, showEditExoticFX } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          exoticForeignExchange: {
            depositAccountType: values.depositAccountType,
            depositWindowStart: values.depositWindowStart.format('HH:mm:ss'),
            depositWindowEnd: values.depositWindowEnd.format('HH:mm:ss'),
            accountUsage: values.accountUsage,
            additionalNotes: values.additionalNotes,
          },
        }
        if (showEditExoticFX) {
          dispatch(editVendorClientExoticFXConfig(selectedCurrencyAccount.id, value, token))
        } else {
          dispatch(addNewVendorClientExoticFXConfig(selectedCurrencyAccount.id, value, token))
        }
      }
    })
  }

  handleExoticFXCancel = () => {
    const { dispatch, showEditExoticFX } = this.props
    if (showEditExoticFX) {
      dispatch(updateShowEditExoticFX(false))
    } else {
      dispatch(updateShowAddExoticFXConfig(false))
    }
  }

  render() {
    const {
      form,
      showAddExoticFXConfig,
      addExoticConfigLoading,
      showEditExoticFX,
      selectedRecordToEdit,
    } = this.props
    const timeFormat = 'HH:mm:ss'

    const depositAccountType = data.depositAccountType.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const accountUsage = data.accountUsage.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    return (
      <React.Fragment>
        <Modal
          visible={showAddExoticFXConfig || showEditExoticFX}
          title={
            <div className={styles.modalHeader}>
              <InfoCard
                minHeight="80px"
                imgHeight="100px"
                imgTop="43%"
                header={
                  showAddExoticFXConfig
                    ? 'Add Exotic FX Configuration'
                    : 'Edit Exotic FX Configuration'
                }
                closeButton={this.handleExoticFXCancel}
              />
            </div>
          }
          footer={null}
          className={styles.modalBlock}
          closable={false}
          destroyOnClose
        >
          <Helmet title="Currency" />
          <div>
            <Form layout="vertical" onSubmit={this.onSubmit}>
              <div className="row">
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Deposit Account Type" hasFeedback>
                    {form.getFieldDecorator('depositAccountType', {
                      initialValue: showEditExoticFX
                        ? selectedRecordToEdit.depositAccountType
                        : undefined,
                      rules: [{ required: true, message: 'Please select type' }],
                    })(
                      <Select
                        // showArrow={false}
                        className={styles.selectDropDown}
                        style={{ width: '100%', borderRadius: '9px' }}
                        showSearch
                        placeholder="Choose type"
                        optionLabelProp="label"
                        filterOption={(input, option) =>
                          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {depositAccountType}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Deposit Window Start" hasFeedback>
                    {form.getFieldDecorator('depositWindowStart', {
                      initialValue: showEditExoticFX
                        ? moment(selectedRecordToEdit.depositWindowStart, timeFormat)
                        : null,
                      rules: [{ required: true, message: 'Please select deposit window start' }],
                    })(<TimePicker style={{ width: '100%' }} format={timeFormat} />)}
                  </Form.Item>
                </div>
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Deposit Window End" hasFeedback>
                    {form.getFieldDecorator('depositWindowEnd', {
                      initialValue: showEditExoticFX
                        ? moment(selectedRecordToEdit.depositWindowEnd, timeFormat)
                        : null,
                      rules: [{ required: true, message: 'Please select deposit window end' }],
                    })(<TimePicker style={{ width: '100%' }} format={timeFormat} />)}
                  </Form.Item>
                </div>
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Account Usage" hasFeedback>
                    {form.getFieldDecorator('accountUsage', {
                      initialValue: showEditExoticFX
                        ? selectedRecordToEdit.accountUsage
                        : undefined,
                      rules: [{ required: true, message: 'Please select account usage' }],
                    })(
                      <Select
                        // showArrow={false}
                        className={styles.selectDropDown}
                        style={{ width: '100%', borderRadius: '9px' }}
                        showSearch
                        placeholder="Please select account usage"
                        optionLabelProp="label"
                        filterOption={(input, option) =>
                          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {accountUsage}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Notes" hasFeedback>
                    {form.getFieldDecorator('additionalNotes', {
                      initialValue: showEditExoticFX ? selectedRecordToEdit.additionalNotes : '',
                      // rules: [{ required: true, message: 'Please enter notes' }],
                    })(<Input placeholder="Enter notes" />)}
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className={styles.btnStyles}>
                  <Button
                    className={styles.btnCANCEL}
                    onClick={this.handleExoticFXCancel}
                    // disabled={payments.length === 0}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={styles.btnSAVE}
                    htmlType="submit"
                    loading={addExoticConfigLoading}
                  >
                    {showAddExoticFXConfig ? `Submit` : 'Update'}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

export default addExoticFXConfig
