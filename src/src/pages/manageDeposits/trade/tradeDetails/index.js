import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Card, Dropdown, Icon, Menu, Row, Col, Switch, Tooltip, Modal, Button } from 'antd'
import { withRouter } from 'react-router'
import _ from 'lodash'

import {
  getTradeById,
  changeEditMode,
  changeChatMode,
  updateTradeDetails,
} from 'redux/trade/actions'

import Constants from 'utilities/constants'

import { visibleChannelMembers, createManualChatChannel, endChannel } from 'redux/chat/actions'
import { deleteTrade } from 'redux/trades/actions'

import TradeProgress from './tradeProgress'
import LiveChat from './liveChat'
import TradeSummary from './tradeSummary'

import RouteEngineTable from '../routeTable'
import RatesTable from './tradeRatesTable'
import FeesTable from './tradeFeesTable'
import CommentBox from '../comments'

import styles from './style.module.scss'

const { confirm } = Modal
const { tradeSubStatus } = Constants

const mapStateToProps = ({ settings, general, trade, chat, user }) => ({
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  routeEngineData: trade.routeEngineData,
  tradeReference: trade.tradeReference,
  tradeStatus: trade.tradeStatus,
  isChatSelected: trade.isChatSelected,
  isChannelCreated: chat.isChannelCreated,
  isEditMode: trade.isEditMode,
  tradeId: trade.tradeId,
  isChannelEnded: chat.isChannelEnded,
  clients: general.clients,
  clientId: trade.clientId,
  email: user.email,
  token: user.token,
  depositCurrency: trade.depositCurrency,
  beneficiary: trade.beneficiary,
  totalDepositAmount: trade.totalDepositAmount,
  channelId: trade.chat.channelId,
  comments: trade.comments,
  subStatus: trade.subStatus,
  tradeValuesUpdateLoader: trade.tradeValuesUpdateLoader,
})

@withRouter
@connect(mapStateToProps)
class TradeDetails extends Component {
  editTrade = () => {
    const { isEditMode, dispatch } = this.props
    dispatch(changeEditMode(isEditMode))
  }

  showMembers = () => {
    const { dispatch } = this.props
    dispatch(visibleChannelMembers(true))
  }

  manualEndChatChannel = () => {
    const { dispatch, token, email, channelId } = this.props
    const value = { email, channelId }
    dispatch(endChannel(value, token))
  }

  createChannel = () => {
    const {
      depositCurrency,
      beneficiary,
      totalDepositAmount,
      email,
      token,
      dispatch,
      clients,
      clientId,
    } = this.props

    const clientObj = clients.find(el => el.id === clientId)

    const value = {
      sourceCurrency: depositCurrency,
      selectedBeneficiary: beneficiary,
      sourceAmount: totalDepositAmount,
      email,
      selectedClient: clientObj,
    }
    dispatch(createManualChatChannel({ value }, token))
  }

  onChangeSwitch = checked => {
    const { dispatch } = this.props
    dispatch(changeChatMode(checked))
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props
    dispatch(changeEditMode(true))
    dispatch(changeChatMode(false))
  }

  onPopUpMessage = () => {
    const { dispatch, token, tradeId, history } = this.props
    confirm({
      title: 'Are you sure delete this trade?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        Promise.resolve(dispatch(deleteTrade(tradeId, token))).then(() => {
          history.push('/trades')
        })
      },
      onCancel() {},
    })
  }

  onPopUpMessageForCancel = () => {
    const { dispatch, token, tradeId, history } = this.props
    confirm({
      title: 'Are you sure cancel this trade?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        Promise.resolve(
          dispatch(updateTradeDetails({ tradeStatus: 'cancelled' }, tradeId, token)),
        ).then(() => {
          history.push('/trades')
        })
      },
      onCancel() {},
    })
  }

  // onDeleteTrade = () => {
  //   console.log('on delete hitting')
  //   const { dispatch, token, tradeId, history } = this.props
  //   Promise.resolve(dispatch(deleteTrade(tradeId, token))).then(() => {
  //     history.push('/trades')
  //   })
  // }

  refreshTrade = () => {
    const { dispatch, tradeId, token } = this.props
    dispatch(getTradeById(tradeId, token))
  }

  handleSubStatus = value => {
    const { dispatch, tradeId, token } = this.props
    const tradeValues = {
      subStatus: value,
    }
    dispatch(updateTradeDetails(tradeValues, tradeId, token))
  }

  addTradeComment = value => {
    const { dispatch, tradeId, comments, token } = this.props
    const tradeValues = {
      comments: [...comments, value],
    }
    dispatch(updateTradeDetails(tradeValues, tradeId, token))
  }

  getSubStatusActionMenu = () =>
    tradeSubStatus.map(subStatusObj => {
      return (
        <Menu.Item onClick={() => this.handleSubStatus(subStatusObj.value)}>
          <Icon type={subStatusObj.iconName} style={{ color: subStatusObj.iconColor }} />
          {subStatusObj.title}
        </Menu.Item>
      )
    })

  render() {
    const {
      tradeReference,
      isChatSelected,
      isEditMode,
      isChannelEnded,
      isChannelCreated,
      comments,
      tradeValuesUpdateLoader,
      subStatus,
    } = this.props

    const tradeActionMenu = (
      <Menu>
        <Menu.Item hidden={isEditMode} onClick={this.editTrade}>
          <Icon type="edit" />
          Edit Trade
        </Menu.Item>
        <Menu.Item hidden={isEditMode} onClick={this.onPopUpMessageForCancel}>
          <Icon type="close" />
          Cancel Trade
        </Menu.Item>
        <Menu.Item hidden={isEditMode} onClick={this.onPopUpMessage}>
          <Icon type="delete" />
          Delete Trade
        </Menu.Item>
        <Menu.Item hidden={!isEditMode} onClick={this.editTrade}>
          <Icon type="eye" />
          View Trade
        </Menu.Item>
        <Menu.Item hidden={!isChatSelected || isChannelEnded} onClick={this.showMembers}>
          <Icon type="eye" />
          Show Channel Members
        </Menu.Item>
        <Menu.Item hidden={!isChatSelected || isChannelCreated} onClick={this.createChannel}>
          <Icon type="plus" />
          Create Channel
        </Menu.Item>
        <Menu.Item hidden={!isChatSelected || isChannelEnded} onClick={this.manualEndChatChannel}>
          <Icon type="close" />
          End Channel
        </Menu.Item>
      </Menu>
    )

    const subStatusActionMenu = <Menu>{this.getSubStatusActionMenu()}</Menu>

    const getIcon = () => {
      if (subStatus === 'completed') {
        return <Icon type="check-circle" style={{ color: '#72bb53' }} />
      }
      return <Icon type="clock-circle" style={{ color: '#ecb160' }} />
    }

    return (
      <Fragment>
        <Card
          title={tradeReference || 'Trade Id'}
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
              <Dropdown overlay={subStatusActionMenu} trigger={['click']}>
                <Button
                  loading={tradeValuesUpdateLoader}
                  className="mr-3 mb-3"
                  type="default"
                  onClick={e => e.preventDefault()}
                >
                  {subStatus !== undefined ? getIcon() : ''}{' '}
                  {_.startCase(_.camelCase(subStatus)) || 'Sub Status'} <Icon type="down" />
                </Button>
              </Dropdown>
              Chat :{' '}
              <Switch
                className="mr-3"
                checked={isChatSelected}
                size="small"
                onChange={this.onChangeSwitch}
              />
              <Tooltip title="Refresh">
                <Icon className="mr-3" type="sync" onClick={this.refreshTrade} />
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
                <TradeProgress />
              </div>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 11 }}>
              <div>{isChatSelected ? <LiveChat /> : <TradeSummary />}</div>
            </Col>
          </Row>
        </Card>
        <RouteEngineTable />
        <RatesTable />
        <FeesTable />
        <CommentBox
          loading={tradeValuesUpdateLoader}
          data={comments}
          addComment={value => this.addTradeComment(value)}
        />
      </Fragment>
    )
  }
}
export default TradeDetails
