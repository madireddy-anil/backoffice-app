import React, { Component } from 'react'
import { Card, Table, Icon, Tooltip, Button, Form, Popconfirm } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import lodash from 'lodash'
import {
  getAllPaymentProcessList,
  updateSelectedProcessFlow,
  deleteSelectedProcessFlow,
  updateAddStatusPairView,
} from 'redux/paymentProcessFlow/action'
import { capitalize, formatToZoneDate } from '../../../utilities/transformer'

import styles from './style.module.scss'

// const { Option } = Select
const FALSE_VALUE = false
const mapStateToProps = ({ user, paymentProcessFlow, settings }) => ({
  token: user.token,
  allPaymentProcessFlows: paymentProcessFlow.allPaymentProcessFlows,
  listloading: paymentProcessFlow.listloading,
  timeZone: settings.timeZone.value,
})

@Form.create()
@connect(mapStateToProps)
class Currency extends Component {
  state = {
    pagination: {
      pageSize: 50,
    },
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    dispatch(getAllPaymentProcessList(token))
    dispatch(updateAddStatusPairView(FALSE_VALUE))
  }

  navigateToEditProcessFlow = record => {
    const { dispatch, history } = this.props
    history.push('/edit-payment-process-flow')
    dispatch(updateSelectedProcessFlow(record))
  }

  navigateToViewProcessFlow = record => {
    const { dispatch, history } = this.props
    history.push('/view-payment-process-flow')
    dispatch(updateSelectedProcessFlow(record))
  }

  handleAddProcessFlow = () => {
    const { history } = this.props
    history.push('/new-process-flow')
  }

  handleDeletedProcessFlow = record => {
    const { dispatch, token } = this.props
    dispatch(deleteSelectedProcessFlow(record.id, token))
  }

  render() {
    const { listloading, allPaymentProcessFlows, timeZone } = this.props
    const { pagination } = this.state
    const popConfirmtext = 'Are you sure to delete this record?'
    const expandedRowRender = record => {
      const columns = [
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
          align: 'center',
          render: text => capitalize(text),
          width: '10%',
        },
        {
          title: 'Next Exit Status Code',
          dataIndex: 'nextExitStatusCode',
          key: 'nextExitStatusCode',
          align: 'center',
          width: '20%',
        },
      ]
      return (
        <Table
          columns={columns}
          dataSource={record.status}
          pagination={false}
          rowKey={record.type}
        />
      )
    }

    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Process Flow',
        dataIndex: 'processFlow',
        key: 'processFlow',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Call Function',
        dataIndex: 'callFunction',
        key: 'callFunction',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Exit Status Code',
        dataIndex: 'exitStatusCode',
        key: 'exitStatusCode',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'active',
        key: 'active',
        align: 'center',
        render: record =>
          record === true ? (
            <div style={{ color: 'green', fontWeight: 'bold' }}>Active</div>
          ) : (
            <div style={{ color: 'red', fontWeight: 'bold' }}>Inactive</div>
          ),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        // fixed: 'right',
        render: record => (
          <>
            <Tooltip title="Edit">
              <Button
                onClick={() => this.navigateToEditProcessFlow(record)}
                type="link"
                disabled={!record.active}
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button onClick={() => this.navigateToViewProcessFlow(record)} type="link">
                <Icon type="eye" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedProcessFlow(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" disabled={!record.active}>
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Payment Process Flows</span>
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
          className={styles.mainCard}
          extra={
            <div>
              <Tooltip title="Add New  Process Flow">
                <Button type="primary" className="mr-3" onClick={this.handleAddProcessFlow}>
                  {' '}
                  Add New Process Flow{' '}
                </Button>
              </Tooltip>
            </div>
          }
        >
          <Helmet title="Currency" />
          <div className={styles.data}>
            <div className="row">
              <div className="col-xl-12">
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  loading={listloading}
                  dataSource={allPaymentProcessFlows}
                  scroll={{ x: 'max-content' }}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                  expandedRowRender={record => expandedRowRender(record)}
                />
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default Currency
