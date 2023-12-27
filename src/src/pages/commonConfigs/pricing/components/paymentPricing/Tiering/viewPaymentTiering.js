import React, { Component } from 'react'
import { Form, Button, Tooltip, Icon, Table, Popconfirm } from 'antd'
import {
  updatePaymentTieringAddView,
  updateTieringRecordEdit,
  updatePaymentTieringEditMode,
  deleteSelectedPaymentTiering,
} from 'redux/pricingProfile/action'
import { connect } from 'react-redux'
import lodash from 'lodash'
import EditTieringRecord from './editPaymentTiering'
import styles from './style.module.scss'
import data from '../data.json'

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  clients: general.clients,
  isPaymentTier: pricing.isPaymentTier,
  selectedPaymentTieringMethod: pricing.selectedPaymentTieringMethod,
  selectedPricingProfile: pricing.selectedPricingProfile,
  paymentsTieringEditView: pricing.paymentsTieringEditView,
  selectedPaymentTieringData: pricing.selectedPaymentTieringData,
  paymentTieringLoading: pricing.paymentTieringLoading,
})

@Form.create()
@connect(mapStateToProps)
class viewPaymentTieringData extends Component {
  setColumnsHandler = () => {
    const { selectedPaymentTieringMethod, isPaymentTier } = this.props
    let selcetedMethodColumns
    if (isPaymentTier) {
      switch (selectedPaymentTieringMethod) {
        case 'monthly_value':
          selcetedMethodColumns = data.montlyValue
          return selcetedMethodColumns
        case 'monthly_volume':
          selcetedMethodColumns = data.montlyVolume
          return selcetedMethodColumns
        case 'single_value':
          selcetedMethodColumns = data.singleValue
          return selcetedMethodColumns
        default:
          selcetedMethodColumns = []
          return selcetedMethodColumns
      }
    } else {
      selcetedMethodColumns = data.nonTieringList
    }
    return selcetedMethodColumns
  }

  getColumns = (selcetedMethodColumns, transactionColumns) => {
    const headerData = []
    let header = {}
    selcetedMethodColumns.forEach(headerdata => {
      transactionColumns.forEach(dataItem => {
        if (headerdata === dataItem.dataIndex) {
          header = dataItem
          headerData.push(header)
        }
      })
    })
    return headerData
  }

  addMorePaymentRecord = () => {
    const { dispatch } = this.props
    dispatch(updatePaymentTieringAddView(true))
    // return <AddMoreTieringRecords />
  }

  handleEditPaymentRecord = item => {
    const { dispatch } = this.props
    dispatch(updateTieringRecordEdit(item))
    dispatch(updatePaymentTieringEditMode(true))
  }

  handleDeletePaymentRecord = item => {
    const { dispatch, token } = this.props
    dispatch(updateTieringRecordEdit(item))
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    dispatch(deleteSelectedPaymentTiering(item._id, token))
  }

  render() {
    const {
      selectedPricingProfile,
      paymentsTieringEditView,
      isPaymentTier,
      paymentTieringLoading,
    } = this.props
    const { payments } = selectedPricingProfile
    const popConfirmtext = 'Are you sure to delete this record?'
    const columns = [
      {
        title: 'Is Tiering ',
        dataIndex: 'paymentsTier',
        key: 'paymentsTier',
        align: 'center',
        render: record => (record ? 'Yes' : 'No'),
      },
      {
        title: 'Tiering Method',
        dataIndex: 'paymentsTieringMethod',
        key: 'paymentsTieringMethod',
        align: 'center',
        render: record => lodash.startCase(record),
      },
      {
        title: 'Minimum Value',
        dataIndex: 'monthly.fromValueOfMonthlyPayments',
        key: 'fromValueOfMonthlyPayments',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'monthly.maxValueOfMonthlyPayments',
        key: 'maxValueOfMonthlyPayments',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.monthly.maxValueOfMonthlyPayments,
      },
      {
        title: 'Minimum Value',
        dataIndex: 'monthly.fromNumberOfMonthlyPayments',
        key: 'fromNumberOfMonthlyPayments',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'monthly.maxNumberOfMonthlyPayments',
        key: 'maxNumberOfMonthlyPayments',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.monthly.maxNumberOfMonthlyPayments,
      },
      {
        title: 'Minimum Value',
        dataIndex: 'single.fromValueOfSinglePayment',
        key: 'fromValueOfSinglePayment',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'single.maxValueOfSinglePayment',
        key: 'maxValueOfSinglePayment',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.single.maxValueOfSinglePayment,
      },

      {
        title: 'Lifting Fee Method',
        dataIndex: 'liftingFeeMethod',
        key: 'liftingFeeMethod',
        align: 'center',
        render: record => lodash.startCase(record),
      },
      {
        title: 'Lifting fee Amount :',
        dataIndex: 'liftingFeeAmount',
        key: 'liftingFeeAmount',
        align: 'center',
      },
      {
        title: 'Invoice Fee Method :',
        dataIndex: 'invoiceFeeMethod',
        key: 'invoiceFeeMethod',
        align: 'center',
        render: record => lodash.startCase(record),
      },
      {
        title: 'Invoice Amount ',
        dataIndex: 'invoiceAmount',
        key: 'invoiceAmount',
        align: 'center',
      },
      {
        title: 'Invoice Currency',
        dataIndex: 'invoiceCurrency',
        key: 'invoiceCurrency',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'paymentsTieringActive',
        key: 'paymentsTieringActive',
        align: 'center',
        fixed: 'right',
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
        dataIndex: 'actions',
        key: 'x',
        align: 'center',
        fixed: 'right',
        render: (text, record) => (
          <>
            <Tooltip title="Edit">
              <Button
                onClick={() => this.handleEditPaymentRecord(record)}
                type="link"
                disabled={
                  !selectedPricingProfile.profileActive ||
                  (selectedPricingProfile.payments &&
                    !selectedPricingProfile.payments.paymentsActive) ||
                  (record.paymentsTier && !record.paymentsTieringActive)
                }
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletePaymentRecord(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                disabled={
                  !selectedPricingProfile.profileActive ||
                  (selectedPricingProfile.payments &&
                    !selectedPricingProfile.payments.paymentsActive) ||
                  (record.paymentsTier && !record.paymentsTieringActive) ||
                  !record.paymentsTier
                }
                className={styles.deleteIcon}
              >
                <Icon type="delete" />
              </Button>
            </Popconfirm>

            {record.isFinalTier ? <Button type="link">Final Tier</Button> : ''}
          </>
        ),
      },
    ]
    const filteredColumns = this.setColumnsHandler(payments.tiering, columns)
    const columnsList = this.getColumns(filteredColumns, columns)
    return (
      <div>
        {paymentsTieringEditView ? <EditTieringRecord /> : ''}
        <Table
          columns={columnsList}
          rowKey={record => record.index}
          loading={paymentTieringLoading}
          dataSource={payments.tiering}
          scroll={{ x: 'max-content' }}
          // pagination={pagination}
          // onChange={this.handleTableChange}
        />
        {selectedPricingProfile.payments.paymentsActive && isPaymentTier ? (
          <div className={styles.addNewPaymentData}>
            <Button type="dashed" onClick={this.addMorePaymentRecord} style={{ width: '60%' }}>
              <Icon type="plus" /> Add More Tiering Records
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

export default viewPaymentTieringData
