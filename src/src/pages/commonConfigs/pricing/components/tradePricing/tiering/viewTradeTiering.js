import React, { Component } from 'react'
import { Form, Button, Tooltip, Icon, Table, Popconfirm } from 'antd'
import {
  updateTieringRecordEdit,
  updateTradeTieringEditMode,
  deleteSelectedTradeTiering,
  updateTradeTieringAddView,
} from 'redux/pricingProfile/action'
import { connect } from 'react-redux'
import lodash from 'lodash'
import EditTieringRecord from './editTradeTiering'
import styles from './style.module.scss'
import data from '../data.json'

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  clients: general.clients,

  tradesTieringEditView: pricing.tradesTieringEditView,
  selectedPaymentTieringData: pricing.selectedPaymentTieringData,

  selectedPricingProfile: pricing.selectedPricingProfile,
  isTradeTier: pricing.isTradeTier,
  selectedTradeTieringMethod: pricing.selectedTradeTieringMethod,

  tradeTieringLoading: pricing.tradeTieringLoading,
})

@Form.create()
@connect(mapStateToProps)
class viewPaymentTieringData extends Component {
  setTradesColumnsHandler = () => {
    const { selectedTradeTieringMethod, isTradeTier } = this.props
    let selcetedMethodColumns
    if (isTradeTier) {
      switch (selectedTradeTieringMethod) {
        case 'monthly_value':
          selcetedMethodColumns = data.tradeMontlyValue
          return selcetedMethodColumns
        case 'monthly_volume':
          selcetedMethodColumns = data.tradeMontlyVolume
          return selcetedMethodColumns
        case 'single_value':
          selcetedMethodColumns = data.tradeSingleValue
          return selcetedMethodColumns
        default:
          selcetedMethodColumns = []
          return selcetedMethodColumns
      }
    } else {
      selcetedMethodColumns = data.nonTieringTradeList
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

  addMoreTradeRecord = () => {
    const { dispatch } = this.props
    dispatch(updateTradeTieringAddView(true))
    // return <AddMoreTieringRecords />
  }

  handleEditTradeRecord = item => {
    const { dispatch } = this.props
    dispatch(updateTieringRecordEdit(item))
    dispatch(updateTradeTieringEditMode(true))
  }

  handleDeleteTradeRecord = item => {
    const { dispatch, token } = this.props
    dispatch(updateTieringRecordEdit(item))
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    dispatch(deleteSelectedTradeTiering(item._id, token))
  }

  render() {
    const {
      selectedPricingProfile,
      tradesTieringEditView,
      isTradeTier,
      tradeTieringLoading,
    } = this.props
    const { trades } = selectedPricingProfile
    const popConfirmtext = 'Are you sure to delete this record?'
    const columns = [
      { title: 'Is Tiering ', dataIndex: 'tradesTier', key: 'tradesTier', align: 'center' },
      {
        title: 'Tiering Method',
        dataIndex: 'tradesTieringMethod',
        key: 'tradesTieringMethod',
        align: 'center',
        render: record => lodash.startCase(record),
      },
      {
        title: 'Minimum Value',
        dataIndex: 'monthly.fromNumberOfMonthlyTrades',
        key: 'fromNumberOfMonthlyTrades',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'monthly.maxNumberOfMonthlyTrades',
        key: 'maxNumberOfMonthlyTrades',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.monthly.maxNumberOfMonthlyTrades,
      },
      {
        title: 'Minimum Value',
        dataIndex: 'single.fromValueOfSingleBuyAmount',
        key: 'fromValueOfSingleBuyAmount',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'single.maxValueOfSingleBuyAmount',
        key: 'maxValueOfSingleBuyAmount',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.single.maxValueOfSingleBuyAmount,
      },
      {
        title: 'Minimum Value',
        dataIndex: 'monthly.fromMonthlyBuyAmount',
        key: 'fromMonthlyBuyAmount',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'monthly.maxMonthlyBuyAmount',
        key: 'maxMonthlyBuyAmount',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.monthly.maxMonthlyBuyAmount,
      },

      {
        title: 'Mark Up',
        dataIndex: 'markup',
        key: 'markup',
        align: 'center',
      },
      {
        title: 'Spread',
        dataIndex: 'spread',
        key: 'spread',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'tradesTieringActive',
        key: 'tradesTieringActive',
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
                onClick={() => this.handleEditTradeRecord(record)}
                type="link"
                disabled={
                  !selectedPricingProfile.profileActive ||
                  (selectedPricingProfile.trades && !selectedPricingProfile.trades.tradesActive) ||
                  (record.tradesTier && !record.tradesTieringActive)
                }
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>

            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeleteTradeRecord(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                disabled={
                  !selectedPricingProfile.profileActive ||
                  (selectedPricingProfile.trades && !selectedPricingProfile.trades.tradesActive) ||
                  (record.tradesTier && !record.tradesTieringActive) ||
                  !record.tradesTier
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
    const filteredColumns = this.setTradesColumnsHandler()
    const columnsList = this.getColumns(filteredColumns, columns)
    return (
      <div>
        {tradesTieringEditView ? <EditTieringRecord /> : ''}
        <Table
          columns={columnsList}
          rowKey={record => record.index}
          loading={tradeTieringLoading}
          dataSource={trades.tiering}
          scroll={{ x: 'max-content' }}
          // pagination={pagination}
          // onChange={this.handleTableChange}
        />
        {selectedPricingProfile.trades.tradesActive && isTradeTier ? (
          <div className={styles.addNewPaymentData}>
            <Button type="dashed" onClick={this.addMoreTradeRecord} style={{ width: '60%' }}>
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
