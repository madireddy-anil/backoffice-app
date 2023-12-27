import React from 'react'
import { Menu, Dropdown, Row, Col, Button } from 'antd'
import styles from './style.module.scss'
import VolumeAndProfit from './volumeAndProfit'
import CustomerReport from './customer'
import VendorReport from './vendor'
import MarginReport from './margin'
import DeliveryReport from './delivery'

class BusinessReports extends React.Component {
  state = {
    selectedReport: 'Volume And Profit Report',
  }

  handleReport = ({ key }) => {
    this.setState({ selectedReport: key })
  }

  getReportComponent = () => {
    const { selectedReport } = this.state
    switch (selectedReport) {
      case 'Volume And Profit Report':
        return <VolumeAndProfit />
      case 'Customer Report':
        return <CustomerReport />
      case 'Margin Report':
        return <MarginReport />
      case 'Vendor Report':
        return <VendorReport />
      case 'Delivery Report':
        return <DeliveryReport />
      default:
        return <VolumeAndProfit />
    }
  }

  render() {
    const { selectedReport } = this.state
    const menu = (
      <Menu style={{ width: 256 }} selectedKeys={[selectedReport]} onClick={this.handleReport}>
        <Menu.Item key="Volume And Profit Report">
          <span>Volume And Profit Report</span>
        </Menu.Item>
        <Menu.Item key="Customer Report">
          <span>Customer Report</span>
        </Menu.Item>
        <Menu.Item key="Margin Report">
          <span>Margin Report</span>
        </Menu.Item>
        <Menu.Item key="Vendor Report">
          <span>Vendor Report</span>
        </Menu.Item>
        {/* <Menu.Item key="Delivery Report">
          <span>Delivery Report</span>
        </Menu.Item> */}
      </Menu>
    )

    return (
      <div>
        <Row className={styles.menuBox}>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
            <Dropdown overlay={menu} placement="bottomLeft">
              <Button className={styles.btnDropDown}>
                <div className={styles.dropdown}>
                  <span>{selectedReport}</span>
                </div>
              </Button>
            </Dropdown>
            <br />
            <br />
          </Col>
        </Row>
        <div>{this.getReportComponent()}</div>
      </div>
    )
  }
}

export default BusinessReports
