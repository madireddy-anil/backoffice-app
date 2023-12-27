import React, { Component } from 'react'
import { Card, Table, Tooltip, Button, Icon, Popconfirm, Tag, Input } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  updateSelectedUser,
  getAllUsers,
  deleteUser,
  updatedUsers,
} from '../../../redux/users/action'
import styles from './style.module.scss'

const { Search } = Input

const mapStateToProps = ({ user, users, general }) => ({
  token: user.token,
  usersList: users.usersList,
  userListLoading: users.userListLoading,
  gUsers: general.users,
})

@connect(mapStateToProps)
class users extends Component {
  state = {
    visibleSearch: true,
    searchValue: undefined,
    allUsers: [],
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    dispatch(getAllUsers(token))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.allUserList) {
      this.updateLocalState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { usersList } = this.props
    const isPropsUpdated = {
      allUserList: prevProps.usersList !== usersList,
    }
    return isPropsUpdated
  }

  updateLocalState = () => {
    const { gUsers } = this.props
    this.setState({ allUsers: gUsers })
  }

  handleNewUser = () => {
    const { history } = this.props
    history.push('/add-user')
  }

  navigateToEditUser = record => {
    const { history, dispatch } = this.props
    history.push('/edit-user')
    dispatch(updateSelectedUser(record))
  }

  navigateToViewUser = record => {
    const { history, dispatch } = this.props
    history.push('/view-user')
    dispatch(updateSelectedUser(record))
  }

  handleDelete = record => {
    const { dispatch, token } = this.props
    dispatch(deleteUser(record.id, token))
  }

  getSearchUI = () => {
    const { visibleSearch, searchValue } = this.state
    return (
      <div hidden={visibleSearch} className={styles.searchBlock}>
        <Search
          placeholder="Search..."
          className="ml-4 mt-4 mb-3 mr-4"
          value={searchValue}
          onChange={this.searchFromUsers}
          style={{ width: 250 }}
        />
        <Button className="mt-4 mb-3 mr-4" type="primary" ghost onClick={this.onClearSearch}>
          Clear Search
        </Button>
      </div>
    )
  }

  onClearSearch = () => {
    const { dispatch, token } = this.props
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
      searchValue: undefined,
    }))
    dispatch(getAllUsers(token))
  }

  searchFromUsers = e => {
    const { value } = e.target
    const { dispatch, gUsers } = this.props
    if (!value) {
      this.setState({ searchValue: undefined })
      dispatch(updatedUsers(gUsers))
    } else {
      this.setState({ searchValue: value })
      this.searchUsers(value)
    }
  }

  searchUsers = value => {
    const { dispatch } = this.props
    const { allUsers } = this.state
    let searchEmail
    const searchNames = allUsers.filter(
      item => item.firstName && item.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1,
    )
    if (searchNames.length === 0) {
      searchEmail = allUsers.filter(
        item => item.lastName && item.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1,
      )
      if (searchEmail.length === 0) {
        searchEmail = allUsers.filter(
          item => item.email && item.email.toLowerCase().indexOf(value.toLowerCase()) > -1,
        )
      }
      if (searchEmail.length === 0) {
        searchEmail = allUsers.filter(
          item =>
            item.address.countryOfResidence &&
            item.address.countryOfResidence.toLowerCase().indexOf(value.toLowerCase()) > -1,
        )

        if (searchEmail.length === 0) {
          searchEmail = allUsers.filter(
            item =>
              item.role.name && item.role.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
          )
        }
      }
      dispatch(updatedUsers(searchEmail))
    } else {
      dispatch(updatedUsers(searchNames))
    }
  }

  render() {
    const { usersList, userListLoading } = this.props
    // const { pagination } = this.state
    const columns = [
      {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstname',
        align: 'center',
      },
      {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastname',
        align: 'center',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        align: 'center',
      },
      {
        title: 'Country',
        dataIndex: 'address.countryOfResidence',
        key: 'address.countryOfResidence',
        align: 'country',
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        align: 'center',
        render: text => (
          <Tag color="gray">
            {text !== undefined && text !== null && text.name ? text.name : ' '}
          </Tag>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'active',
        key: 'active',
        align: 'center',
        render: record =>
          record === true ? (
            <div style={{ color: 'green', fontWeight: 'bold' }}>Active</div>
          ) : (
            <div style={{ color: 'red', fontWeight: 'bold' }}>Inactive</div>
          ),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        // fixed: 'right',
        render: record => (
          <>
            <Tooltip title="Edit">
              <Button
                type="link"
                disabled={!record.active}
                onClick={() => this.navigateToEditUser(record)}
              >
                <Icon
                  theme="filled"
                  type="edit"
                  style={{ color: !record.active ? '#aeababcc' : '#1890FF' }}
                />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Icon
                theme="filled"
                type="eye"
                style={{ color: '#1890FF', marginLeft: '2px', marginRight: '2px' }}
                onClick={() => this.navigateToViewUser(record)}
              />
            </Tooltip>
            <Popconfirm
              disabled={!record.active}
              placement="topLeft"
              title="Are you sure to delete this record?"
              onConfirm={() => this.handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" disabled={!record.active}>
                <Icon
                  theme="filled"
                  type="delete"
                  style={{ color: !record.active ? '#aeababcc' : '#FF4D4F' }}
                />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Users List</span>
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
          extra={
            <div>
              <Tooltip title="Search">
                <Icon
                  type="search"
                  className="mr-3"
                  onClick={() =>
                    this.setState(prevState => ({
                      visibleSearch: !prevState.visibleSearch,
                    }))
                  }
                />
              </Tooltip>
              <Button type="primary" icon="plus" onClick={this.handleNewUser}>
                Add New User
              </Button>
            </div>
          }
          className={styles.mainCard}
        >
          <Helmet title="Currency" />

          <div className="row">
            {this.getSearchUI()}
            <div className="col-xl-12">
              <Table
                columns={columns}
                rowKey={record => record.id}
                loading={userListLoading}
                dataSource={usersList}
                scroll={{ x: 'max-content' }}
                pagination
                onChange={this.handleTableChange}
              />
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default users
