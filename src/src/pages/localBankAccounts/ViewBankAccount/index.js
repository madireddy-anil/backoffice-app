import React, { Component } from 'react'
import { Form, Spin, Card, Button, Row, Col } from 'antd'
import { connect } from 'react-redux'
import { getBankAccountById, getFormatedBankAccounts } from 'redux/bankAccounts/actions'

import jsondata from '../data.json'

import styles from '../style.module.scss'

const mapStateToProps = ({ general, bankAccount, user }) => ({
  vendors: general.newVendors,
  account: bankAccount.bankAccountDetail,
  formatedBankAccount: bankAccount.formatedBankAccount,
  token: user.token,
  loading: bankAccount.bankAccountLoading,
  isBankAccountFetched: bankAccount.isBankAccountFetched,
})

@Form.create()
@connect(mapStateToProps)
class ViewLocalAccount extends Component {
  componentDidMount = () => {
    const { location, dispatch, token } = this.props
    const splitRes = location.pathname.split('/')
    const id = splitRes[2]
    dispatch(getBankAccountById(id, token))
  }

  componentDidUpdate(prevProps) {
    // const { account } = this.props
    const { isBankAccountFetched } = this.props
    // if (JSON.stringify(prevProps.account) !== JSON.stringify(account)) {
    if (prevProps.isBankAccountFetched !== isBankAccountFetched && isBankAccountFetched !== false) {
      this.localAccountSummary()
    }
  }

  localAccountSummary = () => {
    const { account, dispatch } = this.props
    const formatedData = []
    jsondata.localBankAccountMapper.forEach(item => {
      Object.entries(account).map(([key, value]) => {
        if (item.fieldName === key) {
          const formatData = {
            fieldName: item.labelName,
            schemaName: key,
            input: item.inputType,
            value,
          }
          formatedData.push(formatData)
        }
        return formatedData
      })
    })
    dispatch(getFormatedBankAccounts(formatedData))
  }

  ViewAccount = () => {
    const { formatedBankAccount, account, vendors } = this.props

    const empty = '---'
    const vendorObj = vendors.find(el => el.id === account.vendorId)
    const vendorInfo = vendorObj !== undefined && vendorObj

    return (
      <div className={styles.modalCardScroll}>
        <strong className="font-size-15">Vendor</strong>
        <div className="pb-3 mt-1">
          <span className="font-size-12">Selected Vendor</span>
        </div>
        <div className={`${styles.modalistCard}`}>
          <h6>
            {Object.entries(vendorInfo).length > 0
              ? vendorInfo.genericInformation?.tradingName
              : empty}
          </h6>
          <div>
            <small>
              {Object.entries(vendorInfo).length > 0
                ? vendorInfo.genericInformation?.registeredCompanyName
                : empty}
            </small>
          </div>
          <div>
            <small>
              {Object.entries(vendorInfo).length > 0
                ? vendorInfo.genericInformation?.vendorType
                : empty}
            </small>
          </div>
        </div>
        <div className={styles.formModalBox}>
          <div className="row">
            {formatedBankAccount.length > 0 &&
              formatedBankAccount.map(item => {
                return (
                  <div key={item.schemaName} className="col-lg-6 mt-4">
                    <strong className="font-size-15">{item.fieldName}</strong>
                    {/* <div className="pb-3 mt-1">
                      <span className="font-size-12">Selected {item.fieldName}</span>
                    </div> */}
                    <div className={`${styles.inputBox} mt-4`}>
                      <div className={`${styles.fontSize15} p-2`}>
                        {item.value ? item.value : empty}
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

  navigateToEditAccount = record => {
    const { id } = record
    const { history } = this.props
    history.push(`/edit-account/${id}`)
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/bank-accounts')
  }

  render() {
    const { account, loading } = this.props
    return (
      <Card
        title="View Bank Account"
        bordered={false}
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          padding: '2px',
          border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
        extra={
          <>
            <Button
              type="link"
              className="pr-3"
              onClick={() => this.navigateToEditAccount(account)}
            >
              Edit
            </Button>
            <Button type="link" onClick={this.onBackButtonHandler}>
              Back
            </Button>
          </>
        }
      >
        <Row>
          <Col className="p-2">
            <Spin className={styles.darkSpinnerOverlayBg} spinning={loading} tip="Loading . . .">
              {this.ViewAccount()}
            </Spin>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default ViewLocalAccount
