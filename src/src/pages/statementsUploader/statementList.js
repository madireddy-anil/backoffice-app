import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Table, Form, Icon, Tooltip, Button, Popconfirm } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  getAllVendorStatements,
  getVendorStatementsByFilename,
} from 'redux/vendorStatements/action'
import { formatToZoneDate } from '../../utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ user, vendorStatements, settings }) => ({
  token: user.token,
  timeZone: settings.timeZone.value,
  vendorStatementsFileList: vendorStatements.vendorStatementsFileList,
  totalPages: vendorStatements.totalPages,
  listLoading: vendorStatements.listLoading,
  downloading: vendorStatements.downloading,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class errorQueueList extends Component {
  componentDidMount() {
    const { dispatch, token } = this.props

    dispatch(getAllVendorStatements(token))
  }

  handleDownloadFile = record => {
    const { dispatch, token } = this.props
    dispatch(getVendorStatementsByFilename(record.Key, token))
  }

  handleUploadStatements = () => {
    const { history } = this.props
    history.push('/statements-uploader')
  }

  render() {
    const { vendorStatementsFileList, timeZone, listLoading, downloading } = this.props
    const columns = [
      {
        title: 'Uploaded Date',
        dataIndex: 'LastModified',
        key: 'LastModified',
        align: 'center',
        defaultSortOrder: 'descend',
        sorter: (a, b) => new Date(a.LastModified) - new Date(b.LastModified),
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'File Name',
        dataIndex: 'Key',
        key: 'Key',
        align: 'center',
      },
      {
        title: 'Download File',
        dataIndex: 'ETAG',
        key: 'ETAG',
        align: 'center',
        render: (text, record) => (
          <Popconfirm
            title="Are sure to download?"
            loading={downloading}
            onConfirm={() => this.handleDownloadFile(record)}
          >
            <Icon type="download" style={{ color: '#0190fe' }} />
          </Popconfirm>
        ),
      },
    ]
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Vendor Statements</span>
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
              <Tooltip title="Upload Statements">
                <Button type="primary" className="mr-3" onClick={this.handleUploadStatements}>
                  Upload Statements
                </Button>
              </Tooltip>
            </div>
          }
        >
          <Helmet title="Currency" />
          <div>
            {/* {this.getSearchUI()} */}
            <div className="row">
              <div className="col-xl-12">
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  dataSource={vendorStatementsFileList}
                  scroll={{ x: 'max-content' }}
                  pagination
                  onChange={this.handleTableSorted}
                  bordered
                  loading={listLoading}
                />
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default errorQueueList
