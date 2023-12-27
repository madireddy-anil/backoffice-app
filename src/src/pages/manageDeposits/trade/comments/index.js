import React, { Component } from 'react'
import { List, Card, Dropdown, Icon, Menu, Input, Button } from 'antd'

const { TextArea } = Input

class Comments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAddUIDisplay: false,
      comment: '',
    }
  }

  addCommentUI = () => {
    this.setState({ isAddUIDisplay: true })
  }

  closeCommentUI = () => {
    this.setState({ isAddUIDisplay: false })
  }

  addCommentRow = addComment => {
    const { comment } = this.state
    if (addComment) addComment(comment)
    this.setState({ comment: '' })
  }

  commentHandler = e => {
    this.setState({ comment: e.target.value })
  }

  render() {
    const { data, addComment, loading } = this.props
    const { isAddUIDisplay, comment } = this.state

    const commentMenu = (
      <Menu>
        <Menu.Item hidden={isAddUIDisplay} onClick={() => this.addCommentUI()}>
          <Icon type="plus" />
          Add Comment
        </Menu.Item>
        <Menu.Item hidden={!isAddUIDisplay} onClick={() => this.closeCommentUI()}>
          <Icon type="close" />
          Close
        </Menu.Item>
      </Menu>
    )

    return (
      <Card
        className="mt-3"
        title="Comments"
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
        extra={
          <Dropdown overlay={commentMenu} trigger={['click']}>
            <Icon type="setting" />
          </Dropdown>
        }
      >
        <List hidden={!isAddUIDisplay} style={{ borderBottom: '1px solid #a8c6fa' }}>
          <List.Item className="m-2">
            <TextArea
              onChange={this.commentHandler}
              value={comment}
              placeholder="Type your comments here..."
              autoSize
            />
            <Button
              className="ml-2"
              type="primary"
              onClick={() => this.addCommentRow(addComment)}
              loading={loading}
            >
              Add
            </Button>
          </List.Item>
        </List>
        <List
          style={{ borderTopLeftRadius: '0', borderTopRightRadius: '0' }}
          bordered
          dataSource={data}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </Card>
    )
  }
}

export default Comments
