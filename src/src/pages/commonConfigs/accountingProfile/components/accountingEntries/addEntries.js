import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Form, Select, Button } from 'antd'
import {
  addAccountingProfileEntry,
  editAccountingProfileEntry,
  updateEditEntriesMode,
  updateAddEntriesMode,
} from 'redux/accountingProfile/actions'
import styles from './style.module.scss'
import data from './data.json'

const { Option } = Select
const FALSE_VALUE = false
const TRUE_VALUE = true

const mapStateToProps = ({ user, accountingProfile, general }) => ({
  token: user.token,
  editProfileMode: accountingProfile.editProfileMode,
  selectedAccountingProfile: accountingProfile.selectedAccountingProfile,
  currencies: general.currencies,
  editEntriesMode: accountingProfile.editEntriesMode,
  selectedEntryRecord: accountingProfile.selectedEntryRecord,
  addEntryLoading: accountingProfile.addEntryLoading,
})

@Form.create()
@connect(mapStateToProps)
class addProfileEntry extends Component {
  onSubmit = event => {
    event.preventDefault()
    const {
      form,
      dispatch,
      token,
      editEntriesMode,
      selectedAccountingProfile,
      selectedEntryRecord,
    } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        values.entryActive = TRUE_VALUE
        const value = {
          accountingProfileId: selectedAccountingProfile.id,
          entries: [values],
        }
        if (editEntriesMode) {
          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          dispatch(editAccountingProfileEntry(selectedEntryRecord._id, value, token))
        } else {
          dispatch(addAccountingProfileEntry(value, token))
        }
      }
    })
  }

  onCancelHandler = () => {
    const { editEntriesMode, dispatch } = this.props
    if (editEntriesMode) {
      dispatch(updateEditEntriesMode(FALSE_VALUE))
    }

    dispatch(updateAddEntriesMode(FALSE_VALUE))
  }

  render() {
    const {
      form,
      selectedEntryRecord,
      editEntriesMode,
      selectedAccountingProfile,
      addEntryLoading,
    } = this.props

    const debitCreditList = data.debitCredit.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const accountNumberList = data.accountNumber.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const amountList = data.amountList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const currencyList = data.currencyList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const balanceIdList = data.balanceIdList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const referenceList = data.referenceList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    return (
      <React.Fragment>
        <Form layout="vertical" onSubmit={this.onSubmit}>
          <Card
            title={
              <div>
                <span className="font-size-16">Add New Entry</span>
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
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
              border: '1px solid #a8c6fa',
            }}
            className={styles.mainCard}
          >
            <div className="row">
              {selectedAccountingProfile.settlementChannel === 'clearBank' ? (
                <div className="col-md-6 col-lg-4">
                  <Form.Item label="Account Number :" hasFeedback>
                    {form.getFieldDecorator('accountNumber', {
                      initialValue: editEntriesMode ? selectedEntryRecord.accountNumber : '',
                      rules: [{ required: true, message: 'Please input account number' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        showSearch
                      >
                        {accountNumberList}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
              ) : (
                ''
              )}
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Balance Id :" hasFeedback>
                  {form.getFieldDecorator('balanceId', {
                    initialValue: editEntriesMode ? selectedEntryRecord.balanceId : '',
                    rules: [{ required: true, message: 'Please input account number' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {balanceIdList}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Debit / Credit :" hasFeedback>
                  {form.getFieldDecorator('debitCredit', {
                    initialValue: editEntriesMode ? selectedEntryRecord.debitCredit : '',
                    rules: [{ required: true, message: 'Select input debit or credit' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {debitCreditList}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Amount :" hasFeedback>
                  {form.getFieldDecorator('amount', {
                    initialValue: editEntriesMode ? selectedEntryRecord.amount : '',
                    rules: [{ required: true, message: 'Please input amount' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {amountList}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              {selectedAccountingProfile.settlementChannel === 'clearBank' ? (
                <div className="col-md-6 col-lg-4">
                  <Form.Item label="Currency :" hasFeedback>
                    {form.getFieldDecorator('currency', {
                      initialValue: editEntriesMode ? selectedEntryRecord.currency : '',
                      rules: [{ required: true, message: 'Select currency' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        showSearch
                      >
                        {currencyList}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
              ) : (
                ''
              )}
              {selectedAccountingProfile.settlementChannel === 'clearBank' ? (
                ''
              ) : (
                <div className="col-md-6 col-lg-4">
                  <Form.Item label="Reference :" hasFeedback>
                    {form.getFieldDecorator('reference', {
                      initialValue: editEntriesMode ? selectedEntryRecord.reference : '',
                      // rules: [{ required: true, message: 'Please input reference' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        showSearch
                      >
                        {referenceList}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
              )}
            </div>
            <div>
              <div className={styles.btnStyles}>
                <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
                  Cancel
                </Button>
                <Button className={styles.btnSAVE} htmlType="submit" loading={addEntryLoading}>
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </Form>
      </React.Fragment>
    )
  }
}

export default addProfileEntry
