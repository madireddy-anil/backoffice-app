import React, { Component } from 'react'
import { Card, Button, Select, Form, Input, Tooltip } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { getAllCurrencies } from 'redux/general/actions'
import { editSelectedCurrency } from 'redux/currencies/actions'

import styles from '../style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, currencies }) => ({
  token: user.token,
  loading: currencies.loading,
  selectedCurrency: currencies.selectedCurrency,
  updateCurrency: currencies.updateCurrency,
})

@Form.create()
@connect(mapStateToProps)
class EditCurrency extends Component {
  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.iscurrencyUpdated) {
      this.callApi()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { updateCurrency } = this.props
    const isPropsUpdated = {
      iscurrencyUpdated: prevProps.updateCurrency !== updateCurrency,
    }
    return isPropsUpdated
  }

  callApi = () => {
    const { token, dispatch, history } = this.props
    dispatch(getAllCurrencies(token))
    history.push('/currencies')
  }

  navigateToViewCurrency = () => {
    const { history } = this.props
    history.push('/view-currency')
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/currencies')
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/currencies')
  }

  onSubmit = event => {
    event.preventDefault()
    const { dispatch, token, form, selectedCurrency } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(editSelectedCurrency(selectedCurrency.id, values, token))
      }
    })
  }

  modifyData = value => {
    switch (value) {
      case 'Yes':
        return 'Y'
      case 'No':
        return 'N'
      default:
        return '--'
    }
  }

  render() {
    const { loading, form, selectedCurrency } = this.props
    const data = [
      {
        id: 0,
        label: 'Yes',
        value: 'Y',
      },
      {
        id: 1,
        label: 'No',
        value: 'N',
      },
    ]
    const options = data.map(option => (
      <Option key={option.id} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Edit Currency Details</span>
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
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
          extra={
            <>
              <Button type="link" className="pr-3" onClick={() => this.navigateToViewCurrency()}>
                View
              </Button>
              <Button type="link" onClick={this.onBackButtonHandler}>
                Back
              </Button>
            </>
          }
        >
          <Helmet title="Country" />
          <Form layout="vertical" onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <Tooltip title="Restricted to edit">
                  <Form.Item label="Currency Code" hasFeedback>
                    {form.getFieldDecorator('code', {
                      initialValue: selectedCurrency.code,
                      rules: [{ required: true, message: 'Please input currency code' }],
                    })(
                      <Input
                        className={styles.inputbox}
                        style={{ width: '100%', pointerEvents: 'none' }}
                        size="default"
                      />,
                    )}
                  </Form.Item>
                </Tooltip>
              </div>
              <div className="col-md-6 col-lg-3">
                <Tooltip title="Restricted to edit">
                  <Form.Item label="Currency Name" hasFeedback>
                    {form.getFieldDecorator('name', {
                      initialValue: selectedCurrency.name,
                      rules: [{ required: true, message: 'Please input currency name' }],
                    })(
                      <Input
                        className={styles.inputbox}
                        style={{ width: '100%', pointerEvents: 'none' }}
                        size="default"
                      />,
                    )}
                  </Form.Item>
                </Tooltip>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Currency Account" hasFeedback>
                  {form.getFieldDecorator('currencyAccount', {
                    initialValue: this.modifyData(selectedCurrency.currencyAccount),
                    rules: [{ required: true, message: 'Please input currency account' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                    >
                      {options}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Deposits" hasFeedback>
                  {form.getFieldDecorator('deposits', {
                    initialValue: this.modifyData(selectedCurrency.deposits),
                    rules: [{ required: true, message: 'Please input deposits' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                    >
                      {options}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Payments" hasFeedback>
                  {form.getFieldDecorator('payments', {
                    initialValue: this.modifyData(selectedCurrency.payments),
                    rules: [{ required: true, message: 'Please input payments' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                    >
                      {options}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Restricted Deposits" hasFeedback>
                  {form.getFieldDecorator('restrictedDeposits', {
                    initialValue: this.modifyData(selectedCurrency.restrictedDeposits),
                    rules: [{ required: true, message: 'Please input restricted deposits' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                    >
                      {options}
                    </Select>,
                  )}
                </Form.Item>
              </div>
            </div>
            <div className={styles.btnStyles}>
              <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
                Cancel
              </Button>
              <Button className={styles.btnSAVE} loading={loading} htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </Card>
      </React.Fragment>
    )
  }
}

export default EditCurrency
