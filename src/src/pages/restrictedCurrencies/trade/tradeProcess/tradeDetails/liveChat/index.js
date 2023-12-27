import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Spin, Avatar, Tooltip, Button, Icon, Drawer, List, Skeleton } from 'antd'
// import Chat from 'twilio-chat'

import { formatChatLongTime, formatChatShortTime } from 'utilities/transformer'
import {
  getAllMessages,
  getChannelMembers,
  updateNewMessage,
  getArchivedMessages,
  visibleChannelMembers,
  showAddMember,
  addChannelMember,
  removeChannelMember,
} from 'redux/restrictedCurrencies/trade/tradeProcess/chat/actions'
import { getOpsUsers, getClientUsers } from 'redux/user/actions'

import styles from './style.module.scss'

const Message = chat => {
  const { chatOwner, chatOwnerName, timeZone } = chat
  const { message, author, timestamp } = chat.message
  let messageOwnerName
  if (author === 'service') {
    messageOwnerName = 'Customer Support Team'
  } else if (author === chatOwner) {
    messageOwnerName = chatOwnerName
  } else {
    const nameFromMailId = author.split('@')
    const [otherMemberName] = nameFromMailId
    messageOwnerName = otherMemberName
  }

  return (
    <div
      className={`clearfix ${styles.item} ${
        chatOwnerName === messageOwnerName ? styles.itemRight : styles.itemLeft
      }`}
    >
      <div className={styles.itemAvatar}>
        <Avatar
          src={`resources/images/avatars/${
            chatOwnerName === messageOwnerName ? 'client' : 'agent'
          }.png`}
          size="50"
          border="false"
        />
      </div>
      <div className={styles.itemContent}>
        <div className="flex">
          <strong>{messageOwnerName}</strong>
          <Tooltip placement="top" title={formatChatLongTime(timestamp, timeZone)}>
            <small>{formatChatShortTime(timestamp, timeZone)}</small>
          </Tooltip>
        </div>
        <div>
          <pre className={styles.chatMessages} dangerouslySetInnerHTML={{ __html: message }} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ user, npTrade, npChat, settings }) => ({
  token: user.token,
  email: user.email,
  name: user.name,
  agentUsers: user.agentUsers,
  clientUsers: user.clientUsers,
  channelId: npTrade.chat.channelId,
  channelStatus: npTrade.chat.channelStatus,
  clientId: npTrade.clientId,
  isChannelEnded: npChat.isChannelEnded,
  chatToken: npChat.token,
  messages: npChat.messages,
  channelMembers: npChat.channelMembers,
  lastMsgId: npChat.lastMsgId,
  chatLoading: npChat.chatLoading,
  visibleMembers: npChat.visibleMembers,
  visibleAddMember: npChat.visibleAddMember,
  timeZone: settings.timeZone.value,
  activeCurrentTradeChatChannel: npChat.activeCurrentTradeChatChannel,
  chatClient: npChat.chatClient,
})

@connect(mapStateToProps)
class LiveChat extends Component {
  state = {
    // chatClient: {},
    message: '',
  }

  componentDidMount() {
    this.chatSetup()
    this.messageHandler()
    this.mounted = true
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { messages } = this.props
    const element = document.getElementById('message-list').lastChild
    if (element !== null && messages !== prevProps.messages) {
      element.scrollIntoView({ behavior: 'smooth' })
    }

    if (snapshot.updateRequired) {
      this.chatSetup()
      this.messageHandler()
    }
  }

  componentWillUnmount() {
    const { chatToken, channelId, chatClient } = this.props
    if (chatToken && channelId) {
      if (Object.entries(chatClient).length !== 0) {
        chatClient.shutdown()
      }
    }
    this.mounted = false
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { channelId } = this.props
    return { updateRequired: prevProps.channelId !== channelId }
  }

  chatSetup = () => {
    const { dispatch, chatToken, channelId, channelStatus, email, clientId } = this.props
    if (channelId) {
      if (channelStatus === 'archived') {
        const values = {
          channelId,
          clientEmail: email,
        }
        dispatch(getArchivedMessages(values, chatToken))
      } else {
        dispatch(getAllMessages(channelId, chatToken))
        dispatch(getChannelMembers(channelId, chatToken))
        dispatch(getOpsUsers())
        dispatch(getClientUsers(clientId))
      }
    }
  }

  // setChatClient = client => {
  //   this.setState({ chatClient: client }, this.setActiveChannel)
  // }

  // setActiveChannel = () => {
  //   const { channelId } = this.props
  //   const { chatClient } = this.state

  //   if (channelId) {
  //     chatClient.getChannelBySid(channelId).then(activeChannel => {
  //       this.setState({ activeChannel }, this.messageHandler)
  //     })
  //   }
  // }

  // authorRename = (author) => {
  //   let identity = '';
  //   if (author === 'service') {
  //     return 'Customer Support Team'
  //   }
  //   identity = author.split('@');
  //   return identity[0]
  // }

  messageHandler = () => {
    const { messages, activeCurrentTradeChatChannel } = this.props
    if (Object.entries(activeCurrentTradeChatChannel).length !== 0) {
      activeCurrentTradeChatChannel.on('messageAdded', result => {
        const newMessage = {
          id: result.index,
          author: result.author,
          message: result.body,
          timestamp: result.timestamp,
        }
        if (result.index !== messages.length - 1) {
          this.updateNewMessage(newMessage)
        }
      })
    }
  }

  updateNewMessage = newMessage => {
    const { dispatch } = this.props
    dispatch(updateNewMessage(newMessage))
  }

  inputChangeHandler = e => {
    this.setState({ message: e.target.value })
  }

  onKeyPress = e => {
    if (!e.shiftKey && e.keyCode === 13) {
      e.preventDefault()
      this.onSubmitHandler(e)
    }
    if (e.shiftKey && e.keyCode === 13) {
      e.preventDefault()
      this.setState(prevState => ({ message: `${prevState.message}\n` }))
    }
  }

  onSubmitHandler = event => {
    event.preventDefault()
    const { message } = this.state
    const { channelId, chatClient } = this.props
    chatClient.getChannelBySid(channelId).then(channel => {
      if (message !== '') {
        channel.sendMessage(message)
      }
    })
    this.setState({ message: '' })
  }

  showDrawer = () => {
    const { dispatch } = this.props
    dispatch(visibleChannelMembers(true))
  }

  onClose = () => {
    const { dispatch } = this.props
    dispatch(visibleChannelMembers(false))
  }

  showAddMemberToChat = () => {
    const { dispatch } = this.props
    dispatch(showAddMember(true))
  }

  hideAddMemberToChat = () => {
    const { dispatch } = this.props
    dispatch(showAddMember(false))
  }

  onAddChannelMember = member => {
    const { dispatch, chatToken, channelId, clientId } = this.props
    member.channelId = channelId
    member.clientId = clientId
    dispatch(addChannelMember(member, chatToken))
    dispatch(showAddMember(false))
  }

  onRemoveChannelMember = member => {
    const { dispatch, chatToken, channelId, clientId } = this.props
    member.channelId = channelId
    member.clientId = clientId
    dispatch(removeChannelMember(member, chatToken))
  }

  render() {
    const {
      agentUsers,
      clientUsers,
      messages,
      channelMembers,
      email,
      name,
      isChannelEnded,
      chatLoading,
      visibleMembers,
      visibleAddMember,
      timeZone,
    } = this.props
    const { message } = this.state
    const messagesData = messages
    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Spin spinning={chatLoading}>
          <div>
            <div className={`card mb-0 ${styles.messaging}`}>
              <div className={styles.content}>
                <div className={`${styles.contentWrapper} site-drawer-render-in-current-wrapper`}>
                  <div id="message-list" className={`${styles.chat}`}>
                    {messagesData.map(msg => (
                      <Message
                        message={msg}
                        key={Math.random()}
                        chatOwner={email}
                        chatOwnerName={name}
                        timeZone={timeZone}
                      />
                    ))}
                  </div>
                  <form onSubmit={this.onSubmitHandler} className="form-group mt-4 mb-3">
                    <textarea
                      className="form-control adjustable-textarea"
                      placeholder="Type message..."
                      onChange={this.inputChangeHandler}
                      disabled={isChannelEnded}
                      value={message}
                      onKeyDown={this.onKeyPress}
                    />
                    <div className="mt-3">
                      {/* <button
                      type="submit"
                      className="btn btn-primary width-200"
                      disabled={isChannelEnded}
                    >
                      <i className="fa fa-send mr-2" />
                      Send
                    </button> */}
                      <Button type="primary" htmlType="submit" disabled={isChannelEnded}>
                        Send
                        <Icon type="right" />
                      </Button>
                    </div>
                  </form>
                  <Drawer
                    title={
                      <div className="flex">
                        <span>{visibleAddMember ? 'Add Members' : 'Channel Members'}</span>
                        <Tooltip title="Add Member">
                          <Button
                            type="link"
                            hidden={visibleAddMember}
                            onClick={this.showAddMemberToChat}
                          >
                            <Icon type="plus" />
                          </Button>
                        </Tooltip>
                        <Button
                          type="link"
                          hidden={!visibleAddMember}
                          onClick={this.hideAddMemberToChat}
                        >
                          <Icon type="close" />
                        </Button>
                      </div>
                    }
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={visibleMembers}
                    getContainer={false}
                    style={{ position: 'absolute' }}
                  >
                    {visibleAddMember ? (
                      <div>
                        <div className="mt-1 mb-3">
                          <strong>OPS Users:</strong>
                        </div>
                        <List
                          size="small"
                          className="demo-loadmore-list"
                          itemLayout="horizontal"
                          dataSource={agentUsers}
                          renderItem={item => (
                            <div className={styles.memberList}>
                              <List.Item
                                actions={[
                                  <Tooltip title="Add to this chat">
                                    <Button
                                      type="link"
                                      shape="circle"
                                      onClick={() => this.onAddChannelMember(item)}
                                    >
                                      <Icon type="plus" />
                                    </Button>
                                  </Tooltip>,
                                ]}
                              >
                                <Skeleton avatar title={false} loading={item.loading} active>
                                  <List.Item.Meta
                                    // avatar={
                                    //   <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    // }
                                    title={
                                      <span>
                                        <span className="font-size-14">{`${item.firstName} ${item.lastName}`}</span>
                                      </span>
                                    }
                                    // description={item.userType}
                                  />
                                </Skeleton>
                              </List.Item>
                            </div>
                          )}
                        />
                        <div className="mt-3 mb-3">
                          <strong>Client Users:</strong>
                        </div>
                        <List
                          size="small"
                          className="demo-loadmore-list"
                          itemLayout="horizontal"
                          dataSource={clientUsers}
                          renderItem={item => (
                            <div className={styles.memberList}>
                              <List.Item
                                actions={[
                                  <Tooltip title="Add to this chat">
                                    <Button
                                      type="link"
                                      shape="circle"
                                      onClick={() => this.onAddChannelMember(item)}
                                    >
                                      <Icon type="plus" />
                                    </Button>
                                  </Tooltip>,
                                ]}
                              >
                                <Skeleton avatar title={false} loading={item.loading} active>
                                  <List.Item.Meta
                                    // avatar={
                                    //   <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    // }
                                    title={
                                      <span>
                                        <span className="font-size-14">{`${item.firstName} ${item.lastName}`}</span>
                                      </span>
                                    }
                                    // description={item.userType}
                                  />
                                </Skeleton>
                              </List.Item>
                            </div>
                          )}
                        />
                      </div>
                    ) : (
                      <div>
                        <List
                          size="small"
                          className="demo-loadmore-list"
                          // loading={initLoading}
                          itemLayout="horizontal"
                          dataSource={channelMembers}
                          renderItem={item => (
                            <div className={styles.memberList}>
                              <List.Item
                                actions={[
                                  <Tooltip title="Remove">
                                    <Button
                                      type="link"
                                      onClick={() => this.onRemoveChannelMember(item)}
                                    >
                                      <Icon type="close" />
                                    </Button>
                                  </Tooltip>,
                                ]}
                              >
                                <Skeleton avatar title={false} loading={item.loading} active>
                                  <List.Item.Meta
                                    // avatar={
                                    //   <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                                    // }
                                    title={
                                      <span>
                                        <span className="font-size-14">{`${item.firstName} ${item.lastName}`}</span>
                                        <div>
                                          <small>{item.userType}</small>
                                        </div>
                                      </span>
                                    }
                                    // description={item.userType}
                                  />
                                </Skeleton>
                              </List.Item>
                            </div>
                          )}
                        />
                      </div>
                    )}
                  </Drawer>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </Card>
    )
  }
}
export default LiveChat
