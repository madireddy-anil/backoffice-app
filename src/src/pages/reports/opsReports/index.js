import React from 'react'
import { Menu, Dropdown, Row, Col, Button, Icon } from 'antd'
import styles from './style.module.scss'
import CustomerSummaryReport from './customerSummaryReport'
import TradeSummaryReport from './tradeSummaryReport'
import VendorReport from './vendorReport'
import VendorSummaryReport from './vendorSummaryReport'
import TatReport from './tatSummaryPortfolio'
import TatSummaryReport from './tatSummaryReport'

class OpsReports extends React.Component {
  state = {
    selectedReport: 'Customer Summary Report',
  }

  handleReport = ({ key }) => {
    this.setState({ selectedReport: key })
  }

  getReportComponent = () => {
    const { selectedReport } = this.state
    switch (selectedReport) {
      case 'Customer Summary Report':
        return <CustomerSummaryReport />
      case 'Trade Summary Report':
        return <TradeSummaryReport />
      case 'Vendor Report':
        return <VendorReport />
      case 'Vendor Summary Report':
        return <VendorSummaryReport />
      case 'TAT Report':
        return <TatReport />
      case 'TAT Summary Report':
        return <TatSummaryReport />
      default:
        return <CustomerSummaryReport />
    }
  }

  render() {
    const { selectedReport } = this.state
    const menu = (
      <Menu style={{ width: 200 }} selectedKeys={[selectedReport]} onClick={this.handleReport}>
        <Menu.Item key="Customer Summary Report">
          <span>Customer Summary Report</span>
        </Menu.Item>
        <Menu.Item key="Trade Summary Report">
          <span>Trade Summary Report</span>
        </Menu.Item>
        <Menu.Item key="Vendor Report">
          <span>Vendor Report</span>
        </Menu.Item>
        <Menu.Item key="Vendor Summary Report">
          <span>Vendor Summary Report</span>
        </Menu.Item>
        <Menu.Item key="TAT Report">
          <span>TAT Report</span>
        </Menu.Item>
        <Menu.Item key="TAT Summary Report">
          <span>TAT Summary Report</span>
        </Menu.Item>
      </Menu>
    )

    return (
      <div>
        <Row className={styles.menuBox}>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
            <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
              <Button className={styles.btnDropDown}>
                {selectedReport} <Icon type="down" />
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

export default OpsReports
