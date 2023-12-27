import React, { Component } from 'react'
import { Card, Button, Select, Tooltip, Form, Input } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { getAllCountries } from 'redux/general/actions'
import { editSelectedCountry } from 'redux/currencies/actions'

import styles from '../style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, currencies }) => ({
  token: user.token,
  selectedCountry: currencies.selectedCountry,
  updateCountry: currencies.updateCountry,
  loading: currencies.loading,
})

@Form.create()
@connect(mapStateToProps)
class EditCountry extends Component {
  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isCountryUpdated) {
      this.callApi()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { updateCountry } = this.props
    const isPropsUpdated = {
      isCountryUpdated: prevProps.updateCountry !== updateCountry,
    }
    return isPropsUpdated
  }

  callApi = () => {
    const { token, dispatch, history } = this.props
    dispatch(getAllCountries(token))
    history.push('/countries')
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/countries')
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/countries')
  }

  navigateToViewCountry = () => {
    const { history } = this.props
    history.push('/view-country')
  }

  onSubmit = event => {
    event.preventDefault()
    const { dispatch, token, form, selectedCountry } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(editSelectedCountry(selectedCountry.id, values, token))
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
    const { loading, form, selectedCountry } = this.props
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
    const riskCategories = [
      {
        id: 0,
        label: 'High',
        value: 'high',
      },
      {
        id: 1,
        label: 'Medium',
        value: 'medium',
      },
      {
        id: 2,
        label: 'Low',
        value: 'low',
      },
      {
        id: 3,
        label: 'prohibited',
        value: 'Prohibited',
      },
    ]
    const riskCategoriesOptions = riskCategories.map(option => (
      <Option key={option.id} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
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
              <span className="font-size-16">Edit Country Details</span>
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
              <Button type="link" className="pr-3" onClick={() => this.navigateToViewCountry()}>
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
                  <Form.Item label="Country" hasFeedback>
                    {form.getFieldDecorator('name', {
                      initialValue: selectedCountry.name,
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
                <Tooltip title="Restricted to edit">
                  <Form.Item label="Alpha-2 Code" hasFeedback>
                    {form.getFieldDecorator('alpha2Code', {
                      initialValue: selectedCountry.alpha2Code,
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
                  <Form.Item label="Alpha-3 Code" hasFeedback>
                    {form.getFieldDecorator('alpha3Code', {
                      initialValue: selectedCountry.alpha3Code,
                      rules: [{ required: true, message: 'Please input code' }],
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
                  <Form.Item label="Numeric Code" hasFeedback>
                    {form.getFieldDecorator('numericCode', {
                      initialValue: selectedCountry.numericCode,
                      rules: [{ required: true, message: 'Please input numeric code' }],
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
                  <Form.Item label="Telephone Prefix" hasFeedback>
                    {form.getFieldDecorator('telephonePrefix', {
                      initialValue: selectedCountry.telephonePrefix,
                      rules: [{ required: true, message: 'Please input account prefix' }],
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
                <Form.Item label="Deposits" hasFeedback>
                  {form.getFieldDecorator('deposits', {
                    initialValue: this.modifyData(selectedCountry.deposits),
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
                <Form.Item label="Fiat Currency" hasFeedback>
                  {form.getFieldDecorator('fiatCurrency', {
                    initialValue: this.modifyData(selectedCountry.fiatCurrency),
                    rules: [{ required: true, message: 'Please input fiat currency' }],
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
                    initialValue: this.modifyData(selectedCountry.payments),
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
                <Form.Item label="Risk Categories" hasFeedback>
                  {form.getFieldDecorator('riskCategory', {
                    initialValue: selectedCountry.riskCategory,
                    rules: [{ required: true, message: 'Please input risk categories' }],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                      className={styles.cstmSelectInput}
                    >
                      {riskCategoriesOptions}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Residency" hasFeedback>
                  {form.getFieldDecorator('residency', {
                    initialValue: this.modifyData(selectedCountry.residency),
                    rules: [{ required: true, message: 'Please input residency' }],
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

export default EditCountry
