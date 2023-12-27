import React from 'react'
import { connect } from 'react-redux'
import { Form, Select, Drawer, Row, Col, Button, Input } from 'antd'
import { getVendors } from 'redux/general/actions'
import {
  getAllBankAccounts,
  handlePagination,
  handleBankAccountFilters,
} from 'redux/bankAccounts/actions'
import jsonData from '../data.json'

const { Option } = Select

const { accountStatus, accountType, localAccountTypesOptions } = jsonData

const mapStateToProps = ({ bankAccount, general, user }) => ({
  bankAccounts: bankAccount.allBankAccounts,
  currencies: general.currencies,
  token: user.token,
  vendors: general.newVendors,
  beneficiaries: general.beneficiaries,
  appliedFilters: bankAccount.appliedBankAccountFilters,
})

@Form.create()
@connect(mapStateToProps)
class FilterComponent extends React.Component {
  componentDidMount() {
    const { token, dispatch, form, appliedFilters } = this.props
    form.setFieldsValue(appliedFilters)
    dispatch(getVendors(token))
  }

  onSubmitFilter = () => {
    const { form, token, dispatch, onClose, setFilters } = this.props
    const { validateFields } = form
    validateFields((err, values) => {
      if (!err) {
        setFilters(values)
        dispatch(handleBankAccountFilters(values))
        values.page = 1
        Promise.resolve(dispatch(getAllBankAccounts(values, token))).then(() => onClose())
      }
    })
    const pagination = {
      current: 1,
      limit: 10,
    }
    dispatch(handlePagination(pagination))
  }

  onReset = () => {
    const { form, token, dispatch, onReset } = this.props
    const values = {
      page: 1,
      limit: 10,
    }
    const pagination = {
      current: 1,
      limit: 10,
    }
    dispatch(handlePagination(pagination))
    onReset()
    form.resetFields()
    dispatch(handleBankAccountFilters({}))
    dispatch(getAllBankAccounts(values, token))
  }

  render() {
    const { vendors, onClose, visibleFilter, form, currencies, filters } = this.props
    const { getFieldDecorator } = form
    const vendorOption = vendors.map(option => (
      <Option key={option.id} value={option.id} label={option.genericInformation?.tradingName}>
        <h5>{option.genericInformation?.tradingName}</h5>
        <small>{option.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    const accountStatusOption = accountStatus.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    const accountTypeOption = accountType.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    const localAccountTypeOption = localAccountTypesOptions.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    return (
      <Drawer
        title="Bank Accounts"
        width={600}
        onClose={onClose}
        visible={visibleFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Select By Vendor">
                {getFieldDecorator('vendorId', { initialValue: filters.vendorId })(
                  <Select
                    showSearch
                    onFilterProp="children"
                    optionLabelProp="label"
                    placeholder="Select a vendor"
                    // onChange={this.onRateProviderChange}
                    filterOption={(input, option) =>
                      option.props.children[0].props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {vendorOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Name On Account">
                {getFieldDecorator('nameOnAccount', { initialValue: filters.nameOnAccount })(
                  <Input placeholder="Enter the Name On Account" />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Select By Account Currency">
                {getFieldDecorator('accountCurrency', { initialValue: filters.accountCurrency })(
                  <Select showSearch placeholder="Select an account currency">
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Account Number">
                {getFieldDecorator('accountNumber', { initialValue: filters.accountNumber })(
                  <Input placeholder="Enter the account number" />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Bank Name">
                {getFieldDecorator('bankName', { initialValue: filters.bankName })(
                  <Input placeholder="Enter the bank name" />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Account Status">
                {getFieldDecorator('accountStatus', { initialValue: filters.accountStatus })(
                  <Select showSearch placeholder="Select the account status">
                    {accountStatusOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Account Type">
                {getFieldDecorator('accountType', { initialValue: filters.accountType })(
                  <Select showSearch placeholder="Select the account type">
                    {accountTypeOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Local Account Type">
                {getFieldDecorator('localAccountType', { initialValue: filters.localAccountType })(
                  <Select showSearch placeholder="Select the local account type">
                    {localAccountTypeOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button style={{ marginRight: 8 }} onClick={onClose}>
              Cancel
            </Button>
            <Button className="mr-2" type="primary" ghost onClick={this.onReset}>
              Reset
            </Button>
            <Button htmlType="submit" type="primary">
              Filter
            </Button>
          </div>
        </Form>
      </Drawer>
    )
  }
}

export default FilterComponent
