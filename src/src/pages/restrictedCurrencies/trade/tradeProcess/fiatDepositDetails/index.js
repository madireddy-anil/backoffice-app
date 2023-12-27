import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Card, Dropdown, Icon, Menu, Row, Col, Tooltip, Modal } from 'antd'

import {
  getTransactionById,
  changeEditTxnMode,
  deleteTransaction,
  cancelTransaction,
  updateTransactionValues,
} from 'redux/restrictedCurrencies/trade/tradeProcess/transactions/actions'

import RentalAccountProgress from './fiatDepositProgess'
import RentalAccountSummary from './fiatDepositSummary'

// import RouteEngineTable from '../routeTable'
// import FeesTable from './txnFeesTable'
// import CommentBox from '../comments'

import styles from './style.module.scss'

const { confirm } = Modal

const mapStateToProps = ({ user, settings, general, npTrade, npTransactions, npChat }) => ({
  token: user.token,
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  routeEngineData: npTrade.routeEngineData,
  tradeReference: npTrade.tradeReference,
  tradeId: npTrade.tradeId,
  depositCurrency: npTrade.depositCurrency,
  isChannelEnded: npChat.isChannelEnded,
  isEditTxnMode: npTransactions.isEditTxnMode,
  selectedTransaction: npTransactions.selectedTransaction,
  comments: npTransactions.selectedTransaction.comments,
  txnValuesUpdateLoader: npTransactions.txnValuesUpdateLoader,
})

@connect(mapStateToProps)
class FiatDepositDetails extends Component {
  editTransaction = () => {
    const { isEditTxnMode, dispatch } = this.props
    dispatch(changeEditTxnMode(isEditTxnMode))
  }

  onPopUpMessage = () => {
    const { token, selectedTransaction, dispatch } = this.props
    const values = {
      id: selectedTransaction.id,
      tradeRouterId: selectedTransaction.tradeRouterId,
      tradeId: selectedTransaction.tradeId,
    }
    confirm({
      title: 'Are you sure delete this transaction?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(deleteTransaction(values, token))
      },
      onCancel() {},
    })
  }

  onPopUpCancelMessage = () => {
    const { token, selectedTransaction, dispatch } = this.props
    const values = {
      id: selectedTransaction.id,
      tradeRouterId: selectedTransaction.tradeRouterId,
      tradeId: selectedTransaction.tradeId,
    }
    confirm({
      title: 'Are you sure cancel this transaction?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(cancelTransaction(values, token))
      },
      onCancel() {},
    })
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props
    dispatch(changeEditTxnMode(true))
  }

  refreshTransaction = () => {
    const { dispatch, selectedTransaction, token } = this.props
    dispatch(getTransactionById(selectedTransaction.id, token))
  }

  addTxnComment = value => {
    const { dispatch, selectedTransaction, comments, token } = this.props
    const txnValues = {
      comments: [...comments, value],
    }
    dispatch(updateTransactionValues(txnValues, selectedTransaction.id, token))
  }

  render() {
    const { isEditTxnMode, selectedTransaction } = this.props

    const tradeActionMenu = (
      <Menu>
        <Menu.Item hidden={isEditTxnMode} onClick={this.editTransaction}>
          <Icon type="edit" />
          Edit Transaction
        </Menu.Item>
        <Menu.Item hidden={!isEditTxnMode} onClick={this.editTransaction}>
          <Icon type="eye" />
          View Transaction
        </Menu.Item>
        <Menu.Item onClick={this.onPopUpMessage}>
          <Icon type="delete" />
          Delete Transaction
        </Menu.Item>
        {/* <Menu.Item onClick={this.deleteTransaction}>
          <Icon type="delete" />
          Delete Transaction
        </Menu.Item> */}
        <Menu.Item onClick={this.onPopUpCancelMessage}>
          <Icon type="close" />
          Cancel Transaction
        </Menu.Item>
      </Menu>
    )

    return (
      <Fragment>
        <Card
          title={selectedTransaction ? selectedTransaction.transactionReference : 'Transaction Id'}
          bordered={false}
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '2px',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          extra={
            <>
              <Tooltip title="Refresh">
                <Icon className="mr-3" type="sync" onClick={this.refreshTransaction} />
              </Tooltip>
              <Dropdown overlay={tradeActionMenu} trigger={['click']}>
                <Icon type="setting" />
              </Dropdown>
            </>
          }
        >
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 13 }}>
              <div className={styles.timelineCard}>
                <RentalAccountProgress />
              </div>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 11 }}>
              <RentalAccountSummary />
            </Col>
          </Row>
        </Card>
        {/* <RouteEngineTable /> */}
        {/* <FeesTable /> */}
        {/* <CommentBox
          loading={txnValuesUpdateLoader}
          data={comments}
          addComment={value => this.addTxnComment(value)}
        /> */}
      </Fragment>
    )
  }
}
export default FiatDepositDetails
