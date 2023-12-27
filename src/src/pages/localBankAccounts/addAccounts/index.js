import React, { Component } from 'react'
import { Card, Form, Select, Steps, Input, Button, Alert } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import _ from 'lodash'
import { createBankAccount, updateRequiredFields } from 'redux/bankAccounts/actions'
import { getVendors } from 'redux/general/actions'
import LocalAccountsSummary from '../localAccountsSummary'
import jsondata from '../data.json'

import styles from '../style.module.scss'

const { Option } = Select
const { Step } = Steps

const mapStateToProps = ({ general, user, bankAccount }) => ({
  vendors: general.newVendors,
  token: user.token,
  loading: bankAccount.bankAccountLoading,
  requiredFieldsMesg: bankAccount.requiredFieldsMesg,
})

@Form.create()
@connect(mapStateToProps)
class AddLocalAccounts extends Component {
  state = {
    step: 0,
    vendorId: '',
    vendorDetails: {},
    localDepositAccounts: [],
    isErrorExist: true,
    textAreaValue: '',
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    const values = {
      limit: 0,
    }
    dispatch(getVendors(values, token))
  }

  handleCancel = () => {
    const { history } = this.props
    history.push('/bank-accounts')
  }

  handleAddAccounts = () => {
    const { localDepositAccounts, vendorId } = this.state
    const { dispatch, token } = this.props
    const data = []
    localDepositAccounts.forEach(accounts => {
      const newObj = {}
      accounts.forEach(obj => {
        newObj[obj.fieldName] = obj.value
        newObj.vendorId = vendorId
      })
      data.push(newObj)
    })
    dispatch(createBankAccount(data, token))
  }

  onChangeSelectVendor = (name, vendor) => {
    this.setState({ step: 1, vendorId: vendor.key, vendorDetails: vendor.props.obj })
  }

  deleteAccount = (e, account, index) => {
    const { localDepositAccounts } = this.state
    localDepositAccounts.splice(index, 1)
    this.setState({ localDepositAccounts })
    if (localDepositAccounts.length === 0) {
      this.setState({ textAreaValue: this.clearFilter(), isErrorExist: true })
    }
  }

  clearFilter = () => {
    const { form } = this.props
    form.resetFields()
  }

  onChangeAccounts = e => {
    const { dispatch } = this.props
    const plainText = e.target.value
    const localAccounts = this.localBankAccountsFormat(plainText)
    const { bankAccounts, mandatoryFields } = this.validateLocalaccounts(
      localAccounts,
      jsondata.localBankAccountMapper,
    )
    this.setState({ localDepositAccounts: bankAccounts })
    if (bankAccounts.length > 0) {
      bankAccounts.forEach(item => {
        item.forEach(obj => {
          if (obj.isError === false) {
            this.setState({ isErrorExist: false })
          } else {
            this.setState({ isErrorExist: true })
          }
        })
      })
    }
    const requiredFields = []
    if (mandatoryFields.length > 0) {
      mandatoryFields.forEach(el => {
        const combinedArrays = [].concat(el)
        if (combinedArrays.length > 0) {
          el.forEach(item => {
            if (el.length === 0) {
              console.log(item, 'unused')
            } else {
              requiredFields.push(item)
              Promise.resolve(dispatch(updateRequiredFields(requiredFields)))
            }
          })
        } else {
          const emptyArray = []
          dispatch(updateRequiredFields(emptyArray))
        }
      })
    } else {
      const emptyArray = []
      dispatch(updateRequiredFields(emptyArray))
    }
  }

  localBankAccountsFormat = plainText => {
    const localAccountsPlainText = _.split(plainText, ',')
    const localAccounts = []
    localAccountsPlainText.map(localaccount => {
      const localBankaccountObject = {}
      const fields = _.split(localaccount, /\n/g)
      fields.map(field => {
        if (!_.isEmpty(field)) {
          const [key, value] = _.split(field, ':')
          localBankaccountObject[key] = _.trim(value)
        }
        return localBankaccountObject
      })
      localAccounts.push(localBankaccountObject)
      return fields
    })
    return localAccounts
  }

  validateLocalaccounts = (localAccounts, localAccountMapper) => {
    const bankAccounts = []

    localAccounts.forEach(localaccount => {
      const localAccountArray = []
      Object.entries(localaccount).forEach(([key, value]) => {
        let object = {}
        const found = _.find(localAccountMapper, ['fieldName', key])

        if (!found) {
          object.error = `${key} format error`
          object = {
            fieldName: key,
            errorMessage: `${key}: ${value} formart error`,
            value,
            isError: true,
          }
        } else {
          const { fieldName, labelName } = found
          object = {
            fieldName,
            labelName,
            value,
            isError: false,
          }
        }
        localAccountArray.push(object)
        return localAccountArray
      })
      bankAccounts.push(localAccountArray)
      return localaccount
    })

    const mandatoryFields = this.requiredFielsdValidation(bankAccounts, localAccountMapper)

    return { bankAccounts, mandatoryFields }
  }

  requiredFielsdValidation = (localBankAccounts, mapper) => {
    const requiredFields = mapper.filter(el => el.required === true)

    const mask = []
    let cnt = localBankAccounts.length

    while (cnt !== 0) {
      const aa = []
      requiredFields.forEach((fields, index) => {
        aa[index] = 0
      })
      mask.push(aa)
      cnt -= 1
    }

    localBankAccounts.forEach((accounts, index) => {
      accounts.forEach(account => {
        const found = _.find(requiredFields, { fieldName: account.fieldName })
        if (found) {
          const ind = _.findIndex(requiredFields, { fieldName: found.fieldName })
          mask[index][ind] = 1
        }
      })
    })

    const mandatoryFields = []
    mask.forEach(maskArray => {
      const fieldsNotAvailable = []
      maskArray.forEach((maskValue, index1) => {
        if (maskValue === 0) {
          const required = requiredFields[index1]
          fieldsNotAvailable.push(required)
        }
      })
      mandatoryFields.push(fieldsNotAvailable)
    })
    return mandatoryFields
  }

  render() {
    const {
      step,
      vendorId,
      localDepositAccounts,
      vendorDetails,
      isErrorExist,
      textAreaValue,
    } = this.state
    const { form, vendors, loading, requiredFieldsMesg } = this.props
    const vendorOption = vendors.map(option => (
      <Option label={option.genericInformation?.tradingName} key={option.id} obj={option}>
        <h6>{option.genericInformation?.tradingName}</h6>
        <small>{option.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))
    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Local Accounts</span>
          </div>
        }
        bordered={false}
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          padding: '0',
          border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
      >
        <Helmet title="Add Beneficiary" />
        <div className="row">
          <div className="col-lg-6">
            <div className={styles.timelineCard}>
              <Steps size="small" current={step} direction="vertical">
                <Step
                  title={<strong className="font-size-15">Select Vendor</strong>}
                  description={
                    <div className="pb-3 mt-3">
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        className={styles.cstmSelectInput}
                        onSelect={(name, id, obj) => this.onChangeSelectVendor(name, id, obj)}
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
                    </div>
                  }
                />
                {vendorId && (
                  <Step
                    title={<strong className="font-size-15">Add Local Bank Accounts</strong>}
                    description={
                      <div className="pb-3 mt-3">
                        <Card
                          title={
                            <div>
                              <span className="font-size-16">Local Accounts</span>
                            </div>
                          }
                          // extra={
                          //   <Upload>
                          //     <Tooltip placement="top" title="Upload only .txt file">
                          //       <Icon type="upload" style={{ cursor: 'pointer' }} />
                          //     </Tooltip>
                          //   </Upload>
                          // }
                          headStyle={{
                            border: '0',
                          }}
                          bodyStyle={{
                            padding: '0',
                            marginBottom: '-29px',
                            borderButtom: '0',
                          }}
                          className={styles.cardBlockAddAccount}
                        >
                          <Form.Item>
                            {form.getFieldDecorator('accounts', {
                              initialValue: textAreaValue,
                              rules: [
                                {
                                  required: true,
                                  message: `Please enter input`,
                                },
                              ],
                            })(
                              <Input.TextArea
                                style={{ width: '100%', height: '350px', fontWeight: 'bold' }}
                                size="large"
                                placeholder="Start type or paste here..."
                                className={styles.cstmInputTextArea}
                                onChange={this.onChangeAccounts}
                              />,
                            )}
                          </Form.Item>
                        </Card>
                        {requiredFieldsMesg.length > 0 && (
                          <div className="pb-3 mt-4">
                            <Alert
                              type="warning"
                              showIcon
                              description={requiredFieldsMesg.map(item => {
                                return (
                                  <div item={item.fieldName}>
                                    <span>{item.fieldName} field is required</span>
                                    <br />
                                  </div>
                                )
                              })}
                            />
                          </div>
                        )}
                        {!isErrorExist && requiredFieldsMesg.length === 0 && (
                          <div className={styles.flexSpaceBetween}>
                            <div>
                              <Button className={styles.btnCANCEL} onClick={this.handleCancel}>
                                CANCEL
                              </Button>
                            </div>
                            <div>
                              <Button
                                loading={loading}
                                className={styles.btnSAVE}
                                htmlType="submit"
                                onClick={this.handleAddAccounts}
                              >
                                SAVE
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  />
                )}
              </Steps>
            </div>
          </div>
          <div className="col-lg-6">
            <LocalAccountsSummary
              vendor={vendorDetails}
              summaryViewDetails={localDepositAccounts}
              handleDelete={(e, item, index) => this.deleteAccount(e, item, index)}
            />
          </div>
        </div>
      </Card>
    )
  }
}

export default AddLocalAccounts
