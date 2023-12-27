import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import { Tooltip, Dropdown, Icon, Button, Badge, Avatar } from 'antd'

import { updateReadStatus, markAlltoReadStatus } from 'redux/notifications/actions'

import {
  getTradeById,
  updateCurrentChannelDetails,
  // updateCurrentTrade,
  changeChatMode,
} from 'redux/trade/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, notifications }) => ({
  token: user.token,
  email: user.email,
  allNotifications: notifications.allNotifications,
  totalNotificationsCount: notifications.totalNotifications,
})

@withRouter
@connect(mapStateToProps)
class Notifications extends Component {
  state = {
    visible: false,
  }

  handleVisibleChange = flag => {
    this.setState({ visible: flag })
  }

  updateNotificationReadStatus = item => {
    const { dispatch, email, token } = this.props
    const messagesArray = []
    messagesArray.push(item)
    dispatch(updateReadStatus(email, messagesArray, token))
  }

  navigateToTrade = item => {
    const { dispatch, allNotifications, email, token } = this.props
    const { tradeId, channelID, tradeStatus } = item
    const channelData = {
      channelID,
      tradeStatus,
    }
    dispatch(updateCurrentChannelDetails(channelData))
    const currentTradeNotifications = allNotifications.filter(el => {
      const message = JSON.parse(el.message)
      return message.tradeReference === item.tradeReference
    })
    dispatch(updateReadStatus(email, currentTradeNotifications, token))
    dispatch(getTradeById(tradeId, token))
    dispatch(changeChatMode(true))
  }

  getListItem = () => {
    const { allNotifications, totalNotificationsCount } = this.props
    const ItemUI =
      totalNotificationsCount > 0 ? (
        allNotifications.map(item => {
          const NotificationMessage = JSON.parse(item.message)
          return (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemContent}>
                <Avatar>{_.upperCase(NotificationMessage.messageFrom.charAt(0))}</Avatar>
                <div className={`${styles.message} ml-3`}>
                  <span>
                    <strong>{NotificationMessage.messageFrom}</strong>
                  </span>
                  <div>{NotificationMessage.messageBody}</div>
                  <div>
                    <Button
                      className="p-0"
                      type="link"
                      onClick={() => this.navigateToTrade(NotificationMessage)}
                    >
                      <strong>{NotificationMessage.tradeReference}</strong>
                    </Button>
                    <span className="ml-4">{NotificationMessage.clientName}</span>
                  </div>
                </div>
              </div>
              <Tooltip placement="right" title="Mark as Read">
                <Button
                  className={styles.statusBtn}
                  type="primary"
                  style={{ borderColor: '#ebecf0' }}
                  onClick={() => this.updateNotificationReadStatus(item)}
                />
              </Tooltip>
            </div>
          )
        })
      ) : (
        <div className={styles.noItem}>No unread notifications available!</div>
      )
    return ItemUI
  }

  markAllAsRead = notifications => {
    const { dispatch, email, token } = this.props
    dispatch(markAlltoReadStatus(email, notifications, token))
  }

  render() {
    const { visible } = this.state
    const { allNotifications, totalNotificationsCount } = this.props

    const menu = (
      <div className={styles.notifyLayout}>
        <div className={styles.header}>
          <h4>Notifications</h4>
          <Button
            hidden={totalNotificationsCount === 0}
            type="link"
            size="small"
            onClick={() => this.markAllAsRead(allNotifications)}
          >
            Mark all as read
          </Button>
        </div>
        <div className={styles.list}>{this.getListItem()}</div>
      </div>
    )

    return (
      <Tooltip title="Notifications">
        <Dropdown
          overlay={menu}
          trigger={['click']}
          onVisibleChange={this.handleVisibleChange}
          visible={visible}
        >
          <div className={styles.dropdown}>
            <Badge count={totalNotificationsCount}>
              <Icon type="bell" />
            </Badge>
          </div>
        </Dropdown>
      </Tooltip>
    )
  }
}

export default Notifications
