import React from 'react'
import { withRouter } from 'react-router-dom'
// import Text from 'components/CleanUIComponents/Text'
import Spacer from 'components/CleanUIComponents/Spacer'
import { connect } from 'react-redux'
import { Row, Col, Card, Button, List, Form, Icon, Popconfirm, Tooltip, Modal, Input } from 'antd'
import {
  addViewPermissionModal,
  addClosePermissionModal,
  editViewPermissionModal,
  editClosePermissionModal,
  getPermissionsList,
  updateSelectedRecord,
  deletePermission,
  updatedPermissions,
} from 'redux/permissions/actions'
import AddPermission from './components/addPermission'
import EditPermission from './components/editPermission'

import styles from './style.module.scss'

const { Search } = Input

const mapStateToProps = ({ user, permissions, general }) => ({
  token: user.token,
  loading: permissions.loading,
  permissionsList: permissions.permissionsList,
  addPermissionVisible: permissions.addPermissionModal,
  editPermissionVisible: permissions.editPermissionModal,
  isPermissionDeleted: permissions.isPermissionDeleted,
  gPermissions: general.permissions,
})

@withRouter
@Form.create()
@connect(mapStateToProps)
class Permissions extends React.Component {
  state = {
    visibleSearch: true,
    searchValue: undefined,
    allPermissions: [],
  }

  componentDidMount() {
    const { dispatch, token } = this.props
    dispatch(getPermissionsList(token))
    dispatch(addClosePermissionModal(false))
    dispatch(editClosePermissionModal(false))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isPermissionDeleted) {
      this.updateState()
    }
    if (snapShot.allPermissions) {
      this.updateLocalState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isPermissionDeleted, permissionsList } = this.props
    const isPropsUpdated = {
      isPermissionDeleted: prevProps.isPermissionDeleted !== isPermissionDeleted,
      allPermissions: prevProps.permissionsList !== permissionsList,
    }
    return isPropsUpdated
  }

  updateState = () => {
    const { dispatch, token } = this.props
    dispatch(getPermissionsList(token))
  }

  updateLocalState = () => {
    const { permissionsList } = this.props
    this.setState({ allPermissions: permissionsList })
  }

  onClickBack = () => {
    const { history } = this.props
    history.push(`/accountBalances`)
  }

  handleAddPermission = () => {
    const { dispatch } = this.props
    dispatch(addViewPermissionModal(true))
  }

  handleEditPermission = record => {
    const { dispatch } = this.props
    dispatch(editViewPermissionModal(true))
    dispatch(updateSelectedRecord(record))
  }

  handleDeletePermission = record => {
    const { dispatch, token } = this.props
    dispatch(deletePermission(record.id, token))
  }

  cancelModal = () => {
    const { dispatch } = this.props
    dispatch(addClosePermissionModal(false))
  }

  onClearSearch = () => {
    const { token, dispatch } = this.props
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
      searchValue: undefined,
    }))
    dispatch(getPermissionsList(token))
  }

  searchFromPermissions = e => {
    const { value } = e.target
    const { dispatch, gPermissions } = this.props
    if (!value) {
      this.setState({ searchValue: undefined })
      dispatch(updatedPermissions(gPermissions))
    } else {
      this.setState({ searchValue: value })
      this.searchPermissions(value)
    }
  }

  searchPermissions = value => {
    const { dispatch } = this.props
    const { allPermissions } = this.state
    let searchDescription
    const searchNames = allPermissions.filter(
      item => item.name && item.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
    )
    if (searchNames.length === 0) {
      searchDescription = allPermissions.filter(
        item =>
          item.description && item.description.toLowerCase().indexOf(value.toLowerCase()) > -1,
      )
      dispatch(updatedPermissions(searchDescription))
    } else {
      dispatch(updatedPermissions(searchNames))
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
          onChange={this.searchFromPermissions}
          style={{ width: 250 }}
        />
        <Button className="mt-4 mb-3 mr-4" type="primary" ghost onClick={this.onClearSearch}>
          Clear Search
        </Button>
      </div>
    )
  }

  render() {
    const { loading, addPermissionVisible, editPermissionVisible, permissionsList } = this.props
    return (
      <div>
        <Modal
          title={false}
          width={750}
          visible={addPermissionVisible}
          footer={null}
          closable={false}
          destroyOnClose
        >
          <AddPermission />
        </Modal>
        <Modal
          title={false}
          width={750}
          visible={editPermissionVisible}
          footer={null}
          closable={false}
          destroyOnClose
        >
          <EditPermission />
        </Modal>
        {/* <div className={styles.permissionHeader}>
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
          title={<div className="font-size-18 font-weight-bold">Permissions</div>}
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
              <Button disabled={loading} type="primary" onClick={this.handleAddPermission}>
                Add Permission
                <Icon type="plus" />
              </Button>
            </div>
          }
        >
          <div>
            {/* <div className={styles.tableHeader}>
              <Row>
                <Col span={12} className="font-size-18 font-weight-bold mt-2">
                  Permissions
                </Col>
                <Col span={12} className="text-right">
                  <Tooltip title="Search">
                    <Icon
                      type="search"
                      className="mr-3"
                      onClick={() =>
                        this.setState(prevState => ({
                          visibleSearch: !prevState.visibleSearch,
                        }))}
                    />
                  </Tooltip>
                  <Button disabled={loading} type="primary" onClick={this.handleAddPermission}>
                    Add Permission
                    <Icon type="plus" />
                  </Button>
                </Col>
              </Row>
            </div> */}
            {this.getSearchUI()}
            {/* <Divider /> */}
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
              dataSource={permissionsList}
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
                            <Col span={10}>
                              <Tooltip title="Edit">
                                <Icon
                                  type="edit"
                                  theme="filled"
                                  style={{ color: '#1890FF' }}
                                  onClick={() => this.handleEditPermission(item)}
                                />
                              </Tooltip>
                            </Col>
                            <Col span={5}>
                              <Popconfirm
                                title={`Are you sure you want to delete ${item.name} permission ?`}
                                // onCancel={this.cancel}
                                onConfirm={() => this.handleDeletePermission(item)}
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

export default Permissions
