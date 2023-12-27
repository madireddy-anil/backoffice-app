import React, { Component } from 'react'
import { Table, Button, Icon, Popconfirm } from 'antd'
import {
  deletedVendorPLExternalReference,
  updateShowEditExternalReference,
  updateSelectedRecordToEdit,
} from 'redux/currencyAccounts/action'
import { getVendorsName } from 'utilities/transformer'
import { connect } from 'react-redux'

import styles from './style.module.scss'

const mapStateToProps = ({ user, currencyAccounts, general }) => ({
  token: user.token,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,
  addExternalRefLoading: currencyAccounts.addExternalRefLoading,
  vendors: general.newVendors,
  companies: general.companies,
})

@connect(mapStateToProps)
class viewAccountDetails extends Component {
  state = {
    // noData: '--',
    pagination: {
      pageSize: 50,
    },
  }

  handleDeletedExternalReference = externalReferenceId => {
    const { dispatch, selectedCurrencyAccount, token } = this.props
    dispatch(
      deletedVendorPLExternalReference(selectedCurrencyAccount.id, externalReferenceId, token),
    )
  }

  handleEditExternalReference = record => {
    const { dispatch } = this.props
    dispatch(updateSelectedRecordToEdit(record))
    dispatch(updateShowEditExternalReference(true))
  }

  render() {
    const { selectedCurrencyAccount, addExternalRefLoading, vendors } = this.props
    const { pagination } = this.state
    const popConfirmtext = 'Are sure you want to delete this record ?'
    const columns = [
      {
        title: 'Vendor',
        dataIndex: 'issuerEntityId',
        key: 'issuerEntityId',
        align: 'center',
        render: (text, record) => getVendorsName(vendors, record.issuerEntityId),
      },
      {
        title: 'Reference',
        dataIndex: 'reference',
        key: 'reference',
        align: 'center',
      },
      {
        title: 'Reference Description',
        dataIndex: 'referenceDescription',
        key: 'referenceDescription',
        align: 'center',
      },

      {
        title: 'Status',
        dataIndex: 'isActiveExternalReference',
        key: 'isActiveExternalReference',
        align: 'center',
        // fixed: 'right',
        render: record => {
          if (record) {
            return (
              <Button
                type="link"
                icon="check-circle"
                size="small"
                style={{ color: '#3CB371', fontWeight: '600' }}
              >
                Active
              </Button>
            )
          }
          return (
            <Button
              type="link"
              size="small"
              icon="close-circle"
              style={{ color: '#ff6e6e', fontWeight: '600' }}
            >
              Inactive
            </Button>
          )
        },
      },

      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        // fixed: 'right',
        render: record => (
          <>
            <Button
              type="link"
              onClick={() => this.handleEditExternalReference(record)}
              // className={styles.deleteIcon}
              disabled={
                !selectedCurrencyAccount.isActiveAccount || !record.isActiveExternalReference
              }
            >
              <Icon type="edit" />
            </Button>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              onConfirm={() => this.handleDeletedExternalReference(record.id)}
              okText="Yes"
              cancelText="No"
              //   loading={addPaymentLoading}
            >
              <Button
                type="link"
                className={styles.deleteIcon}
                disabled={
                  !selectedCurrencyAccount.isActiveAccount || !record.isActiveExternalReference
                }
              >
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-xl-12">
            <Table
              columns={columns}
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              rowKey={record => record._id}
              loading={addExternalRefLoading}
              dataSource={selectedCurrencyAccount.externalReference}
              scroll={{ x: 'max-content' }}
              pagination={pagination}
              onChange={this.handleTableChange}
              bordered
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default viewAccountDetails
