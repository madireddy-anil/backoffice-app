import React, { Component } from 'react'
import { Modal, Form, InputNumber, Button, Select } from 'antd'
import { updateShowAddAccountLimits, addNewAccountThresholds } from 'redux/currencyAccounts/action'
import InfoCard from 'components/customComponents/InfoCard'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import styles from './style.module.scss'
import data from './data.json'

const { Option } = Select

const mapStateToProps = ({ user, currencyAccounts }) => ({
  token: user.token,

  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,

  showAddAccountLimits: currencyAccounts.showAddAccountLimits,
  addThresholdsLoading: currencyAccounts.addThresholdsLoading,
})

@Form.create()
@connect(mapStateToProps)
class addAccountLimits extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        this.checkIfRecordAlreadyExist(values)
      }
    })
  }

  checkIfRecordAlreadyExist = values => {
    let isError = false
    const { selectedCurrencyAccount, dispatch, token } = this.props
    if (selectedCurrencyAccount.accountThresholds.length > 0) {
      const duplicateRecord = selectedCurrencyAccount.accountThresholds.filter(
        currencyAccount =>
          currencyAccount.type === values.type &&
          currencyAccount.period === values.period &&
          currencyAccount.isActiveAccountThreshold,
      )
      if (duplicateRecord.length > 0) {
        isError = true
      }
    }
    if (isError) {
      Modal.error({
        title: <p style={{ color: 'red' }}>Account limit already exists</p>,
        content:
          'An active account limit already exists for the Type and Period entered. Please enter an account limit with different Type and Period, or to change the details of the active limit, delete it and then enter the new details',
      })
    } else {
      dispatch(addNewAccountThresholds(selectedCurrencyAccount.id, values, token))
    }
  }

  handleAddReferenceCancel = () => {
    const { dispatch } = this.props
    dispatch(updateShowAddAccountLimits(false))
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateShowAddAccountLimits(false))
  }

  render() {
    const { form, showAddAccountLimits, addThresholdsLoading } = this.props
    const typeOption = data.types.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const days = data.days.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    return (
      <React.Fragment>
        <Modal
          visible={showAddAccountLimits}
          title={
            <div className={styles.modalHeader}>
              <InfoCard
                minHeight="80px"
                imgHeight="100px"
                imgTop="43%"
                header="Add Account Limits"
                closeButton={this.handleAddReferenceCancel}
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
                  <Form.Item label="Type" hasFeedback>
                    {form.getFieldDecorator('type', {
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
                        {typeOption}
                      </Select>,
                    )}
                  </Form.Item>
                </div>

                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Value" hasFeedback>
                    {form.getFieldDecorator('value', {
                      rules: [{ required: true, message: 'Please enter value' }],
                    })(
                      <InputNumber
                        placeholder="Enter value"
                        style={{ width: '100%' }}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        size="large"
                      />,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Period" hasFeedback>
                    {form.getFieldDecorator('period', {
                      rules: [{ required: true, message: 'Please select period' }],
                    })(
                      <Select
                        // showArrow={false}
                        className={styles.selectDropDown}
                        style={{ width: '100%', borderRadius: '9px' }}
                        showSearch
                        placeholder="Choose period"
                        optionLabelProp="label"
                        filterOption={(input, option) =>
                          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {days}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
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
                    loading={addThresholdsLoading}
                  >
                    Submit
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

export default addAccountLimits
