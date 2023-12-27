import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Form, Select, Button } from 'antd'
import { addNewAccountingProfile, updateAccountingProfile } from 'redux/accountingProfile/actions'
import styles from './style.module.scss'
import data from './data.json'

const { Option } = Select
const TRUE_VALUE = true

const mapStateToProps = ({ user, accountingProfile }) => ({
  token: user.token,
  editProfileMode: accountingProfile.editProfileMode,
  selectedAccountingProfile: accountingProfile.selectedAccountingProfile,
  isNewAccoutingProfile: accountingProfile.isNewAccoutingProfile,
  addloading: accountingProfile.addloading,
})

@Form.create()
@connect(mapStateToProps)
class NewAccountingProfile extends Component {
  state = {
    selectedChannel: undefined,
    accountTypeList: [],
  }

  componentDidMount() {
    const { selectedAccountingProfile, isNewAccoutingProfile } = this.props
    if (!isNewAccoutingProfile) {
      this.getDropdownList(selectedAccountingProfile.settlementChannel)
      this.updateToState()
    }
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isSettlementChannel) {
      this.getDropdownList(prevProps.selectedAccountingProfile.settlementChannel)
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { selectedAccountingProfile } = this.props
    const isPropsUpdated = {
      isSettlementChannel: prevProps.selectedAccountingProfile !== selectedAccountingProfile,
    }
    return isPropsUpdated
  }

  updateToState = () => {
    const { selectedAccountingProfile } = this.props
    this.setState({ selectedChannel: selectedAccountingProfile.settlementChannel })
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, editProfileMode, selectedAccountingProfile } = this.props
    const { selectedChannel } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        if (selectedChannel === 'ABN_AMRO') {
          values.isLiftingFee = values.isLiftingFee === 'yes' || false
        }
        if (editProfileMode) {
          dispatch(updateAccountingProfile(selectedAccountingProfile.id, values, token))
        } else {
          values.profileActive = TRUE_VALUE
          dispatch(addNewAccountingProfile(values, token))
        }
      }
    })
  }

  handleSelectedChannnel = e => {
    this.setState({ selectedChannel: e })
    this.getDropdownList(e)
  }

  getDropdownList = e => {
    let list = []
    switch (e) {
      case 'ABN_AMRO':
        list = data.amaroAccountType
        this.setState({ accountTypeList: list })
        break
      case 'clearBank':
        list = data.clearBankAccountType
        this.setState({ accountTypeList: list })
        break
      case 'NA':
        list = data.nAAccountType
        this.setState({ accountTypeList: list })
        break
      default:
        break
    }
    return list
  }

  getData = dataItem => {
    if (dataItem) {
      return 'Yes'
    }
    return 'No'
  }

  render() {
    const { form, editProfileMode, selectedAccountingProfile, addloading } = this.props
    const { selectedChannel, accountTypeList } = this.state
    const processFlowList = data.processFlow.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const settlementChannelList = data.settlementChannel.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const debitorAccountType = accountTypeList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const creditorAccountType = accountTypeList.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const liftingFeeAmount = data.liftingAmount.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    return (
      <React.Fragment>
        <Form layout="vertical" onSubmit={this.onSubmit}>
          <Card
            title={
              editProfileMode ? (
                <div>
                  <span className="font-size-16">Edit Accounting Profile</span>
                </div>
              ) : (
                <div>
                  <span className="font-size-16">New Accounting Profile</span>
                </div>
              )
            }
            bordered
            headStyle={{
              //   border: '1px solid #a8c6fa',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
            bodyStyle={{
              padding: '30px',
              //   border: '1px solid #a8c6fa',
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
            className={styles.mainCard}
            // extra={
            //   <div className={styles.btnStyles}>
            //     <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
            //       Cancel
            //     </Button>
            //     <Button className={styles.btnSAVE} htmlType="submit">
            //       Submit
            //     </Button>
            //   </div>
            // }
          >
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Process Flow :" hasFeedback>
                  {form.getFieldDecorator('processFlow', {
                    initialValue: editProfileMode ? selectedAccountingProfile.processFlow : '',
                    rules: [{ required: true, message: 'Please input process flow' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {processFlowList}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Settlement Channel :" hasFeedback>
                  {form.getFieldDecorator('settlementChannel', {
                    initialValue: editProfileMode
                      ? selectedAccountingProfile.settlementChannel
                      : '',
                    rules: [{ required: true, message: 'Please input call function' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                      onChange={e => this.handleSelectedChannnel(e)}
                    >
                      {settlementChannelList}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Debtor Account Type :" hasFeedback>
                  {form.getFieldDecorator('debtorAccountType', {
                    initialValue: editProfileMode
                      ? selectedAccountingProfile.debtorAccountType
                      : '',
                    rules: [{ required: true, message: 'Please input call function' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {debitorAccountType}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-4">
                <Form.Item label="Creditor Account Type :" hasFeedback>
                  {form.getFieldDecorator('creditorAccountType', {
                    initialValue: editProfileMode
                      ? selectedAccountingProfile.creditorAccountType
                      : '',
                    rules: [{ required: true, message: 'Please input creditor account type' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                      showSearch
                    >
                      {creditorAccountType}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              {selectedChannel === 'ABN_AMRO' ? (
                <div className="col-md-6 col-lg-4">
                  <Form.Item label="Lifting Fee Amount :" hasFeedback>
                    {form.getFieldDecorator('isLiftingFee', {
                      initialValue: editProfileMode
                        ? this.getData(selectedAccountingProfile.creditorAccountType)
                        : '',
                      rules: [{ required: true, message: 'Please input creditor account type' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        showSearch
                      >
                        {liftingFeeAmount}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
              ) : (
                ''
              )}
              <div className={styles.btnStyles}>
                <Button className={styles.btnSAVE} htmlType="submit" loading={addloading}>
                  {editProfileMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </Card>
        </Form>
      </React.Fragment>
    )
  }
}

export default NewAccountingProfile
