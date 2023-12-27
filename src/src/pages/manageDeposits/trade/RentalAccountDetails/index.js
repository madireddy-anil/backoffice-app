import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Card, Dropdown, Icon, Menu, Row, Col, Tooltip, Modal } from 'antd'

import { changeChatMode } from 'redux/trade/actions'

import {
  getTransactionById,
  changeEditTxnMode,
  deleteTransaction,
  cancelTransaction,
  updateTransactionValues,
} from 'redux/transactions/actions'

import { visibleChannelMembers } from 'redux/chat/actions'

import RentalAccountProgress from './rentalAccountProgess'
import RentalAccountChat from './rentalAccountChat'
import RentalAccountSummary from './rentalAccountSummary'

import RouteEngineTable from '../routeTable'
import FeesTable from './txnFeesTable'
import CommentBox from '../comments'

import styles from './style.module.scss'

const { confirm } = Modal

const mapStateToProps = ({ user, settings, general, trade, transactions, chat }) => ({
  token: user.token,
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  routeEngineData: trade.routeEngineData,
  tradeReference: trade.tradeReference,
  isChatSelected: trade.isChatSelected,
  tradeId: trade.tradeId,
  depositCurrency: trade.depositCurrency,
  isChannelEnded: chat.isChannelEnded,
  isEditTxnMode: transactions.isEditTxnMode,
  selectedTransaction: transactions.selectedTransaction,
  comments: transactions.selectedTransaction.comments,
  txnValuesUpdateLoader: transactions.txnValuesUpdateLoader,
})

@connect(mapStateToProps)
class RentalAccountDetails extends Component {
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

  // deleteTransaction = () => {
  //   const { token, selectedTransaction, dispatch } = this.props
  //   const values = {
  //     id: selectedTransaction.id,
  //     tradeRouterId: selectedTransaction.tradeRouterId,
  //     tradeId: selectedTransaction.tradeId,
  //   }
  //   dispatch(deleteTransaction(values, token))
  // }

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

  // cancelTransaction = () => {
  //   const { token, selectedTransaction, dispatch } = this.props
  //   const values = {
  //     id: selectedTransaction.id,
  //     tradeRouterId: selectedTransaction.tradeRouterId,
  //     tradeId: selectedTransaction.tradeId,
  //   }
  //   dispatch(cancelTransaction(values, token))
  // }

  showMembers = () => {
    const { dispatch } = this.props
    dispatch(visibleChannelMembers(true))
  }

  onChangeSwitch = checked => {
    const { dispatch } = this.props
    dispatch(changeChatMode(checked))
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
    const {
      isChatSelected,
      isEditTxnMode,
      isChannelEnded,
      selectedTransaction,
      comments,
      txnValuesUpdateLoader,
    } = this.props

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
        <Menu.Item hidden={!isChatSelected || isChannelEnded} onClick={this.showMembers}>
          <Icon type="eye" />
          Show Channel Members
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
              {/* Chat :{' '}
              <Switch
                className="mr-3"
                defaultChecked={isChatSelected}
                size="small"
                onChange={this.onChangeSwitch}
              /> */}
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
              <div>{isChatSelected ? <RentalAccountChat /> : <RentalAccountSummary />}</div>
            </Col>
          </Row>
        </Card>
        <RouteEngineTable />
        <FeesTable />
        <CommentBox
          loading={txnValuesUpdateLoader}
          data={comments}
          addComment={value => this.addTxnComment(value)}
        />
      </Fragment>
    )
  }
}
export default RentalAccountDetails
