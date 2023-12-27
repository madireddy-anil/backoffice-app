import React, { Component } from 'react'
import { Modal, Form, Input, Button, Alert, Typography, Icon, Select } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
import {
  updateShowAccountDetails,
  addAccountIdentificationDetails,
} from 'redux/currencyAccounts/action'
import InfoCard from 'components/customComponents/InfoCard'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import styles from './style.module.scss'

const { Option } = Select

const { Paragraph, Text } = Typography

const mapStateToProps = ({ user, general, currencies, currencyAccounts }) => ({
  token: user.token,
  currencies: general.currencies,
  loading: currencies.loading,

  selectedType: currencyAccounts.selectedType,
  clients: general.clients,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,

  showAddAccountDetails: currencyAccounts.showAddAccountDetails,
  addAccountIdentifierLoading: currencyAccounts.addAccountIdentifierLoading,
  errorList: currencyAccounts.errorList,

  countries: general.countries,
})

@Form.create()
@connect(mapStateToProps)
class addNewAccountDetails extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedCurrencyAccount } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(addAccountIdentificationDetails(selectedCurrencyAccount.id, values, token))
      }
    })
  }

  handleAddAccountCancel = () => {
    const { dispatch } = this.props
    dispatch(updateShowAccountDetails(false))
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateShowAccountDetails(false))
  }

  render() {
    const {
      form,
      selectedCurrencyAccount,
      showAddAccountDetails,
      addAccountIdentifierLoading,
      errorList,
      countries,
    } = this.props

    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    return (
      <React.Fragment>
        <Modal
          visible={showAddAccountDetails}
          title={
            <div className={styles.modalHeader}>
              <InfoCard
                minHeight="80px"
                imgHeight="100px"
                imgTop="43%"
                header="Add Account Details"
                closeButton={this.handleAddAccountCancel}
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
                {errorList.length > 0 ? (
                  <div className="col-md-12 col-lg-12">
                    <div className={styles.errorBlock}>
                      <Alert
                        // showIcon
                        type="error"
                        message={
                          <div className="desc">
                            <Paragraph>
                              <Text
                                strong
                                style={{
                                  fontSize: 14,
                                }}
                              >
                                The content you submitted has the following errors:
                              </Text>
                            </Paragraph>
                            {errorList.map(item => {
                              return (
                                <Paragraph>
                                  <Icon style={{ color: 'red' }} type="close-circle" /> {item}
                                </Paragraph>
                              )
                            })}
                          </div>
                        }
                      />
                    </div>
                    <Spacer height="25px" />
                  </div>
                ) : (
                  ''
                )}

                <div className="col-md-12 col-lg-12">
                  <Form.Item
                    label={
                      selectedCurrencyAccount.currencyType === 'fiat'
                        ? 'Account Number'
                        : 'Wallet Address'
                    }
                    hasFeedback
                  >
                    {form.getFieldDecorator('accountNumber', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter account number',
                        },
                      ],
                    })(<Input placeholder="Enter account number" style={{ width: '100%' }} />)}
                  </Form.Item>
                </div>
                {selectedCurrencyAccount.currencyType === 'fiat' ? (
                  <React.Fragment>
                    <div className="col-md-12 col-lg-12">
                      <Form.Item label="Account Region" hasFeedback>
                        {form.getFieldDecorator('accountRegion', {
                          rules: [
                            {
                              required: true,
                              message: 'Please enter account region',
                            },
                          ],
                        })(
                          <Select
                            showSearch
                            optionFilterProp="children"
                            optionLabelProp="label"
                            placeholder="search country"
                            filterOption={(input, option) =>
                              option.props.label
                                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                : ''
                            }
                          >
                            {countriesOptions}
                          </Select>,
                        )}
                      </Form.Item>
                    </div>
                    <div className="col-md-12 col-lg-12">
                      <Form.Item label="Bank Code" hasFeedback>
                        {form.getFieldDecorator('bankCode', {
                          rules: [{ required: true, message: 'Please enter bank code' }],
                        })(<Input placeholder="Enter bank code" />)}
                      </Form.Item>
                    </div>
                    <div className="col-md-12 col-lg-12">
                      <Form.Item label="IBAN" hasFeedback>
                        {form.getFieldDecorator('IBAN', {
                          rules: [
                            {
                              required:
                                selectedCurrencyAccount.accountType === 'client' ||
                                selectedCurrencyAccount.accountType === 'pl',
                              message: 'Please enter IBAN',
                            },
                          ],
                        })(<Input placeholder="Enter IBAN" />)}
                      </Form.Item>
                    </div>
                    <div className="col-md-12 col-lg-12">
                      <Form.Item label="SWIFT BIC" hasFeedback>
                        {form.getFieldDecorator('BIC', {
                          rules: [
                            {
                              required:
                                selectedCurrencyAccount.accountType === 'client' ||
                                selectedCurrencyAccount.accountType === 'pl',
                              message: 'Please enter swift bic',
                            },
                          ],
                        })(<Input placeholder="Enter swift bic" />)}
                      </Form.Item>
                    </div>
                  </React.Fragment>
                ) : (
                  ''
                )}
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
                    loading={addAccountIdentifierLoading}
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

export default addNewAccountDetails
