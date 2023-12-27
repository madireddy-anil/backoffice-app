import React, { Component } from 'react'
import { Row, Col, Popover, Button, Select, Popconfirm } from 'antd'
import { connect } from 'react-redux'

import { updateSelectedVendor } from 'redux/transactions/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, transactions, general }) => ({
  token: user.token,
  vendors: general.newVendors,
  isEditTxnMode: transactions.isEditTxnMode,
  selectedTransaction: transactions.selectedTransaction,
  currentRouteType: transactions.currentRouteType,
  classifiedVendor: general.classifiedVendors,
})

const { Option } = Select

@connect(mapStateToProps)
class Vendors extends Component {
  state = {
    visibleVendors: false,
    updatedVendor: {},
  }

  // getVendorName = vendor => {
  //   const { vendors } = this.props
  //   const vendorObj = vendors.find(el => el.id === vendor)
  //   if (vendorObj) {
  //     return vendorObj.tradingName
  //   }
  //   return false
  // }

  hideClient = () => {
    this.setState({
      visibleVendors: false,
    })
  }

  handleVisibleVendorChange = visibleVendors => {
    this.setState({ visibleVendors })
  }

  onVendorChange = value => {
    const { vendors } = this.props
    // console.log(`selected ${value}`);
    const vendor = vendors.find(el => el.id === value)
    this.setState({
      updatedVendor: vendor,
    })
  }

  onSearch = val => {
    console.log('search:', val)
  }

  getEditVendor = () => {
    const { currentRouteType, classifiedVendor } = this.props
    const vendors = classifiedVendor[currentRouteType]
    const vendorOption = vendors.map(option => (
      <Option key={option.id} label={option.genericInformation?.tradingName}>
        <h6>{option.genericInformation?.tradingName}</h6>
        <span>{option.genericInformation?.registeredCompanyName}</span>
      </Option>
    ))
    return (
      <div>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a Vendor"
          optionFilterProp="children"
          optionLabelProp="label"
          onChange={this.onVendorChange}
          onSearch={this.onSearch}
          filterOption={(input, option) =>
            option.props.children[0].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {vendorOption}
        </Select>
        {/* <Button className="ml-1" type="primary" onClick={this.updateVendor}>
          Update
        </Button> */}
        <Popconfirm
          title="Sure to update?"
          onConfirm={() => {
            this.updateVendor()
          }}
        >
          <Button className="ml-1" type="primary">
            Update
          </Button>
        </Popconfirm>
      </div>
    )
  }

  updateVendor = () => {
    const { updatedVendor } = this.state
    const {
      dispatch,
      selectedTransaction: { id },
      token,
    } = this.props
    const values = {
      updatedVendor,
      id,
    }
    dispatch(updateSelectedVendor(values, token))
    this.hideClient()
  }

  render() {
    const {
      isEditTxnMode,
      selectedTransaction: { vendorName },
    } = this.props
    const { visibleVendors } = this.state
    return (
      <Row>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <div>
            <h6>
              <strong>Vendor:</strong>
            </h6>
            <div>
              {isEditTxnMode ? (
                <Popover
                  content={this.getEditVendor()}
                  title="Update Client / Introducer"
                  trigger="click"
                  placement="topLeft"
                  visible={visibleVendors}
                  onVisibleChange={this.handleVisibleVendorChange}
                  arrowPointAtCenter
                >
                  <span className="font-size-12 edit-mode">{vendorName || '---'}</span>
                </Popover>
              ) : (
                <div className={styles.inputBox}>
                  <span className="font-size-12">{vendorName || '---'}</span>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
export default Vendors
