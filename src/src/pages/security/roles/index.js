import React from 'react'
import { withRouter } from 'react-router-dom'
// import Text from 'components/CleanUIComponents/Text'
import Spacer from 'components/CleanUIComponents/Spacer'
import { connect } from 'react-redux'
import { Row, Col, Card, Button, List, Form, Icon, Popconfirm, Tooltip, Modal, Input } from 'antd'
import {
  addViewRoleModal,
  addCloseRoleModal,
  editViewRoleModal,
  editCloseRoleModal,
  viewRoleModal,
  viewCloseRoleModal,
  updateSelectedRoleRecord,
  getRolesList,
  deleteRole,
  updateRoles,
} from 'redux/roles/actions'
import { getPermissionsList } from 'redux/permissions/actions'
import AddRole from './components/addRole'
import EditRole from './components/editRole'
import ViewRole from './components/viewRole'

import styles from './style.module.scss'

const { Search } = Input

const mapStateToProps = ({ user, roles, general }) => ({
  token: user.token,
  roles: roles.roles,
  addRoleVisible: roles.addRoleModal,
  editRoleVisible: roles.editRoleModal,
  isRoleDeleted: roles.isRoleDeleted,
  viewRolemodal: roles.viewRolemodal,
  loading: roles.loading,
  gRoles: general.roles,
})

@withRouter
@Form.create()
@connect(mapStateToProps)
class Roles extends React.Component {
  state = {
    visibleSearch: true,
    searchValue: undefined,
    allRoles: [],
  }

  componentDidMount() {
    const { dispatch, token } = this.props
    dispatch(getPermissionsList(token))
    dispatch(getRolesList(token))
    dispatch(viewCloseRoleModal(false))
    dispatch(addCloseRoleModal(false))
    dispatch(editCloseRoleModal(false))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isPermissionDeleted) {
      this.updateState()
    }
    if (snapShot.allRoles) {
      this.updateLocalState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isRoleDeleted, roles } = this.props
    const isPropsUpdated = {
      isPermissionDeleted: prevProps.isRoleDeleted !== isRoleDeleted,
      allRoles: prevProps.roles !== roles,
    }
    return isPropsUpdated
  }

  updateState = () => {
    const { dispatch, token } = this.props
    dispatch(getRolesList(token))
  }

  updateLocalState = () => {
    const { roles } = this.props
    this.setState({ allRoles: roles })
  }

  onClickBack = () => {
    const { history } = this.props
    history.push(`/accountBalances`)
  }

  handleAddRole = () => {
    const { dispatch } = this.props
    dispatch(addViewRoleModal(true))
  }

  handleEditRole = record => {
    const { dispatch } = this.props
    dispatch(editViewRoleModal(true))
    dispatch(updateSelectedRoleRecord(record))
  }

  handleViewRole = record => {
    const { dispatch } = this.props
    dispatch(viewRoleModal(true))
    dispatch(updateSelectedRoleRecord(record))
  }

  handleDeleteRole = record => {
    const { dispatch, token } = this.props
    dispatch(deleteRole(record.id, token))
  }

  onClearSearch = () => {
    const { dispatch, token } = this.props
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
      searchValue: undefined,
    }))
    dispatch(getRolesList(token))
  }

  searchRoles = e => {
    const { value } = e.target
    const { dispatch, gRoles } = this.props
    if (!value) {
      this.setState({ searchValue: undefined })
      dispatch(updateRoles(gRoles))
    } else {
      this.setState({ searchValue: value })
      this.searchRolesList(value)
    }
  }

  searchRolesList = value => {
    const { dispatch } = this.props
    const { allRoles } = this.state
    let searchDescription
    const searchNames = allRoles.filter(
      item => item.name && item.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
    )
    if (searchNames.length === 0) {
      searchDescription = allRoles.filter(
        item =>
          item.description && item.description.toLowerCase().indexOf(value.toLowerCase()) > -1,
      )
      dispatch(updateRoles(searchDescription))
    } else {
      dispatch(updateRoles(searchNames))
    }
  }

  getSearchUI = () => {
    const { searchValue, visibleSearch } = this.state
    return (
      <div hidden={visibleSearch} className={styles.searchBlock}>
        <Search
          placeholder="Search..."
          className="ml-4 mt-4 mb-3 mr-4"
          value={searchValue}
          onChange={this.searchRoles}
          style={{ width: 250 }}
        />
        <Button className="mt-4 mb-3 mr-4" type="primary" ghost onClick={this.onClearSearch}>
          Clear Search
        </Button>
      </div>
    )
  }

  render() {
    const { loading, addRoleVisible, editRoleVisible, viewRolemodal, roles } = this.props
    return (
      <div>
        <Modal
          title={false}
          width={750}
          visible={viewRolemodal}
          footer={null}
          closable={false}
          destroyOnClose
        >
          <ViewRole />
        </Modal>
        <Modal
          title={false}
          width={750}
          visible={addRoleVisible}
          footer={null}
          closable={false}
          destroyOnClose
        >
          <AddRole />
        </Modal>
        <Modal
          title={false}
          width={750}
          visible={editRoleVisible}
          footer={null}
          closable={false}
          destroyOnClose
        >
          <EditRole />
        </Modal>
        {/* <div className={styles.roleHeader}>
          <Text weight="thin" size="xlarge" className="font-size-15 bold">
            <Button
              type="link"
              icon="arrow-left"
              className={styles.backArrowIcon}
              onClick={this.onClickBack}
            />
            {`${' '} ${'Back To Accounts'}`}
          </Text>
        </div> */}

        <Spacer height="10px" />
        <Card
          bodyStyle={{
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
            // borderTopLeftRadius: '10px',
            // borderTopRightRadius: '10px',
          }}
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          className={styles.mainCard}
          loading={loading}
          title={<div className="font-size-18 font-weight-bold">Roles</div>}
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
              <Button disabled={loading} type="primary" onClick={this.handleAddRole}>
                Add New Role
                <Icon type="plus" />
              </Button>
            </div>
          }
        >
          <div>
            {/* <div className={styles.tableHeader}>
              <div className="row">
                <div className="font-size-18 font-weight-bold col-sm-2 col-md-2 col-lg-2 mt-2">
                  Roles
                </div>
                <div className="text-right col-sm-10 col-md-10 col-lg-10">
                  <Button type="primary" onClick={this.handleAddRole}>
                    Add New Role
                    <Icon type="plus" />
                  </Button>
                </div>
              </div>
            </div>
            <Divider /> */}
            {this.getSearchUI()}
            <List
              header={
                <Row className={styles.listHeaderRow}>
                  <Col span={5}>
                    <span className={styles.listHeader}>Name</span>
                  </Col>
                  <Col span={16}>
                    <span className={styles.listHeader}>Description</span>
                  </Col>
                  <Col span={3}>
                    <div className={`text-center ${styles.listHeader}`}>Actions</div>
                  </Col>
                </Row>
              }
              pagination={{
                onChange: page => {
                  console.log(page)
                },
                pageSize: 10,
              }}
              itemLayout="horizontal"
              dataSource={roles}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    description={
                      <Row>
                        <Col span={5}>
                          <div className={styles.listName}>{item.name}</div>
                        </Col>
                        <Col span={16}>
                          <div className={styles.listDescrption}>{item.description}</div>
                        </Col>
                        <Col span={3} className={styles.actionBlock}>
                          <Row>
                            <Col span={8}>
                              <Tooltip title="View">
                                <Icon
                                  type="eye"
                                  theme="filled"
                                  style={{ color: '#1890FF' }}
                                  onClick={() => this.handleViewRole(item)}
                                />
                              </Tooltip>
                            </Col>
                            <Col span={5}>
                              <Tooltip title="Edit">
                                <Icon
                                  type="edit"
                                  theme="filled"
                                  style={{ color: '#1890FF' }}
                                  onClick={() => this.handleEditRole(item)}
                                />
                              </Tooltip>
                            </Col>
                            <Col span={5}>
                              <Popconfirm
                                title={`Are you sure you want to delete ${item.name} role ?`}
                                onConfirm={() => this.handleDeleteRole(item)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Tooltip title="Delete">
                                  <Icon type="delete" theme="filled" style={{ color: '#FF4D4F' }} />
                                </Tooltip>
                              </Popconfirm>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Card>
      </div>
    )
  }
}

export default Roles
