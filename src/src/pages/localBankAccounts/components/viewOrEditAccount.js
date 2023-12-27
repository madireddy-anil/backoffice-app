import React, { Component } from 'react'
import { Form, Input, Button, Spin, Divider } from 'antd'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import { updateBankAccount } from 'redux/bankAccounts/actions'
import jsondata from '../data.json'

import styles from '../style.module.scss'

const mapStateToProps = ({ general, bankAccount, user }) => ({
  vendors: general.newVendors,
  account: bankAccount.bankAccountDetail,
  token: user.token,
  loading: bankAccount.bankAccountLoading,
})

@Form.create()
@connect(mapStateToProps)
class ViewOrEditLocalAccount extends Component {
  state = {
    selectedAccount: {},
    vendorInfo: {
      tradingName: '',
      registeredCompanyName: '',
      vendorType: '',
    },
    formatedBankAccount: [],
    empty: '--',
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isAccountFetched) {
      this.localAccountSummary()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { account } = this.props
    const isPropsUpdated = {
      isAccountFetched: prevProps.account !== account,
    }
    return isPropsUpdated
  }

  localAccountSummary = () => {
    const { account, vendors } = this.props
    const formatedData = []
    const vendorObj = vendors.find(el => el.id === account.vendorId)
    jsondata.localBankAccountMapper.forEach(item => {
      Object.entries(account).map(([key, value]) => {
        if (item.fieldName === key) {
          const formatData = {
            fieldName: item.labelName,
            schemaName: key,
            value,
          }
          formatedData.push(formatData)
        }
        return formatedData
      })
    })
    this.setState({
      selectedAccount: account,
      formatedBankAccount: formatedData,
      vendorInfo: vendorObj !== undefined && vendorObj,
    })
  }

  handleUpdateAccount = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { vendorInfo, selectedAccount } = this.state
    const accId = selectedAccount.id
    const vendorId = vendorInfo.id
    const vendorid = { vendorId }
    form.validateFields((error, values) => {
      if (!error) {
        Object.assign(values, vendorid)
        dispatch(updateBankAccount(values, accId, token))
      }
    })
  }

  ViewAccount = () => {
    const { empty, vendorInfo, formatedBankAccount } = this.state
    return (
      <div className={styles.modalCardScroll}>
        <strong className="font-size-15">Vendor</strong>
        <div className="pb-3 mt-1">
          <span className="font-size-12">Selected Vendor</span>
        </div>
        <div className={`${styles.modalistCard}`}>
          <h6>{Object.entries(vendorInfo).length > 0 ? vendorInfo.tradingName : empty}</h6>
          <div>
            <small>
              {Object.entries(vendorInfo).length > 0 ? vendorInfo.registeredCompanyName : empty}
            </small>
          </div>
          <div>
            <small>{Object.entries(vendorInfo).length > 0 ? vendorInfo.vendorType : empty}</small>
          </div>
        </div>
        <div className={styles.formModalBox}>
          <div className="row">
            {formatedBankAccount.length > 0 &&
              formatedBankAccount.map(item => {
                return (
                  <div key={item.schemaName} className="col-lg-6 mt-4">
                    <strong className="font-size-15">{item.fieldName}</strong>
                    <div className="pb-3 mt-1">
                      <span className="font-size-12">Selected {item.fieldName}</span>
                    </div>
                    <div className={`${styles.inputBox}`}>
                      <div className="p-3">{item.value ? item.value : empty}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    )
  }

  editAccount = () => {
    const { empty, vendorInfo, formatedBankAccount } = this.state
    const { form } = this.props
    return (
      <div>
        <div className={styles.modalCardScroll}>
          <strong className="font-size-15">Vendor</strong>
          <div className="pb-3 mt-1">
            <span className="font-size-12">Selected Vendor</span>
          </div>
          <div className={`${styles.modalistCard}`}>
            <h6>{Object.entries(vendorInfo).length > 0 ? vendorInfo.tradingName : empty}</h6>
            <div>
              <small>
                {Object.entries(vendorInfo).length > 0 ? vendorInfo.registeredCompanyName : empty}
              </small>
            </div>
            <div>
              <small>{Object.entries(vendorInfo).length > 0 ? vendorInfo.vendorType : empty}</small>
            </div>
          </div>
          <Spacer height="20px" />
          <Form className={styles.formModalBox} onSubmit={this.handleUpdateAccount}>
            <div className="row">
              {formatedBankAccount.length > 0 &&
                formatedBankAccount.map(item => {
                  return (
                    <div key={item.schemaName} className="col-sm-6 col-lg-6">
                      <strong className="font-size-15">{item.fieldName}</strong>
                      <Spacer height="14px" />
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
                    </div>
                  )
                })}
            </div>
          </Form>
        </div>
        <Divider />
        <div className={styles.checkoutBtns}>
          <Button className={styles.btnSAVE} htmlType="submit">
            SAVE
          </Button>
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
              {action === 'view' && <div>{this.ViewAccount()}</div>}
              {action === 'edit' && <div>{this.editAccount()}</div>}
            </div>
          </div>
        </div>
      </Spin>
    )
  }
}

export default ViewOrEditLocalAccount
