import React, { Component } from 'react'
import { Card, Table, Icon, DatePicker, Col, Row, Form, Menu, Dropdown } from 'antd'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import SubMenu from 'antd/lib/menu/SubMenu'
import { disabledFutureDate } from 'utilities/transformer'

const { RangePicker } = DatePicker

@Form.create()
class Delivery extends Component {
  state = {
    visibleFilter: true,
  }

  getFilter = () => {
    const { visibleFilter } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <div hidden={visibleFilter} className="mt-4 pl-4">
        <Form>
          <Row gutter={18}>
            <Col span={10}>
              <Form.Item className="p-2 ml-3">
                {getFieldDecorator('DateAndTime')(
                  <RangePicker
                    disabledDate={disabledFutureDate}
                    style={{ width: '258px !important', margin: '0px' }}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss'),
                      ],
                    }}
                    format="YYYY/MM/DD HH:mm:ss"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

  render() {
    const columns = [
      {
        title: 'Trade number',
        align: 'center',
      },
      {
        title: 'Date of Deposit',
        align: 'center',
      },
      {
        title: 'Customer Name',
        align: 'center',
      },
      {
        title: 'Deposit currency',
        align: 'center',
      },
      {
        title: 'Deposit amount',
        align: 'center',
      },
      {
        title: 'Deposit Amount in USD',
        align: 'center',
      },
      {
        title: 'Settlement currency',
        align: 'center',
      },
      {
        title: 'Settlement Amount',
        align: 'center',
      },
      {
        title: 'PC Margin',
        align: 'center',
      },
      {
        title: 'Trade Status',
        align: 'center',
      },
    ]
    const settingsMenu = (
      <Menu>
        <Menu.Item
          onClick={() =>
            this.setState(prevState => ({
              visibleFilter: !prevState.visibleFilter,
            }))
          }
        >
          <Icon
            type="filter"
            onClick={() =>
              this.setState(prevState => ({
                visibleFilter: !prevState.visibleFilter,
              }))
            }
          />
          Filter
        </Menu.Item>
        <Menu.Item>
          <Icon type="funnel-plot" />
          Advanced Filter
        </Menu.Item>
        <SubMenu
          title={
            <span>
              <Icon type="down-circle" />
              <span> Download </span>
            </span>
          }
        >
          <Menu.Item>
            <Icon type="download" />
            Download Excel
          </Menu.Item>
          <Menu.Item>
            <Icon type="download" />
            Download CSV
          </Menu.Item>
        </SubMenu>
        <Menu.Item>
          <Icon type="file-search" />
          Customised Columns Search
        </Menu.Item>
      </Menu>
    )

    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Delivery Report</span>
          </div>
        }
        bordered
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
        extra={
          <div>
            <Dropdown overlay={settingsMenu}>
              <Icon type="setting" />
            </Dropdown>
          </div>
        }
      >
        {this.getFilter()}
        <Helmet title="Customer" />
        <div className="row">
          <div className="col-xl-12">
            <Table columns={columns} scroll={{ x: 'max-content' }} />
          </div>
        </div>
      </Card>
    )
  }
}
export default Delivery
