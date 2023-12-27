import React, { Component } from 'react'
import { Card, Icon, Table, Spin, Skeleton, Form, Button, Tag, Select, Tooltip } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment'
import { capitalize } from 'utilities/transformer'

import { getAllClientManagement, handlePagination } from 'redux/clientManagement/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, clientManagement, general }) => ({
  allClients: general.clients,
  vendors: general.vendors,
  token: user.token,
  loading: clientManagement.loading,
  pagination: clientManagement.pagination,
  clients: clientManagement.clients,
})

@Form.create()
@connect(mapStateToProps)
class ClientManagement extends Component {
  state = {
    visibleSearch: true,
  }

  componentDidMount() {
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
    } = this.props
    const values = {
      page: current,
      limit: pageSize,
    }
    dispatch(getAllClientManagement(values, token))
  }

  navigateToClientManagement = record => {
    const { history } = this.props
    history.push(`/client/${record}`)
  }

  handleTableChange = pagination => {
    const { dispatch, token } = this.props
    dispatch(handlePagination(pagination, token))
    dispatch(
      getAllClientManagement({ page: pagination.current, limit: pagination.pageSize }, token),
    )
  }

  onSubmitSearch = e => {
    const { dispatch, token, form } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
      dispatch({
        type: 'GET_CLIENT_MANAGEMENT_BY_ID',
        id: values.clientId,
        token,
      })
    })
  }

  onClearSearch = () => {
    const {
      token,
      dispatch,
      form,
      pagination: { current, pageSize },
    } = this.props
    const values = {
      page: current,
      limit: pageSize,
    }
    form.setFieldsValue({
      clientId: undefined,
    })
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
    }))
    dispatch(getAllClientManagement(values, token))
  }

  getSearchUI = () => {
    const { visibleSearch } = this.state
    const { form, allClients } = this.props

    const { getFieldDecorator } = form
    const clientOption = allClients.map(option => (
      <Option
        key={option || option.id}
        value={option.id}
        label={option.genericInformation.registeredCompanyName}
      >
        <h6>
          {option.genericInformation.tradingName !== undefined &&
            option.genericInformation.tradingName}
        </h6>
        <small>
          {option.genericInformation.registeredCompanyName !== undefined &&
            option.genericInformation.registeredCompanyName}
        </small>
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className={styles.searchBlock}>
        <Form onSubmit={this.onSubmitSearch}>
          <Form.Item>
            {getFieldDecorator(
              'clientId',
              {},
            )(
              <Select
                showSearch
                className="mt-3"
                style={{ width: 200 }}
                placeholder="Client"
                optionFilterProp="children"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label !== undefined &&
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {clientOption}
              </Select>,
            )}
            <Button
              className="ml-3"
              htmlType="submit"
              type="primary"
              onClick={e => this.onSubmitSearch(e)}
            >
              Search
            </Button>
            <Button className="ml-3" type="primary" ghost onClick={this.onClearSearch}>
              Clear Search
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

  getProgressLogStatus = label => {
    let returnResp
    switch (label) {
      case 'isCompanyRequirementsDone':
        returnResp = 'Company Req'
        break
      case 'isCompanyInformationDone':
        returnResp = 'Company Info'
        break
      case 'isOperationInformationDone':
        returnResp = 'Operational Info'
        break
      case 'isRegulatoryInformationDone':
        returnResp = 'Regulatory Info'
        break
      case 'isDocumentsUploadedDone':
        returnResp = 'All documents uploaded'
        break
      case 'isCompanyStakeholdersAddedDone':
        returnResp = 'Stakeholders IDV info completed'
        break
      default:
        break
    }
    return returnResp
  }

  render() {
    const { loading, pagination, clients } = this.props
    const columns = [
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: text => <a>{moment(text, 'YYY-MM-DD').format('DD-MM-YY HH:MM:SS')}</a>,
      },
      {
        title: 'Client ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: 'Registered Company Name',
        dataIndex: 'genericInformation.registeredCompanyName',
        key: 'registeredCompanyName',
        align: 'center',
        render: text => (text ? <Button type="link">{text}</Button> : ''),
      },
      {
        title: 'Trading Name',
        dataIndex: 'genericInformation.tradingName',
        key: 'genericInformation.tradingName',
        align: 'center',
        render: text => text || '',
      },
      {
        title: 'Company Type',
        dataIndex: 'genericInformation.companyType',
        key: 'companyType',
        align: 'center',
      },
      {
        title: 'Industry',
        dataIndex: 'genericInformation.industries',
        key: 'industries',
        align: 'center',
        render: record => (
          <>
            {record !== undefined &&
              record.length !== undefined &&
              record.length > 0 &&
              record.map(tag => {
                const color = tag.industryType ? 'green' : ''
                return (
                  <Tag color={color} key={tag.industryType}>
                    {tag.industryType.toUpperCase()}
                  </Tag>
                )
              })}
          </>
        ),
      },
      {
        title: 'Application Stage',
        dataIndex: 'progressLogs',
        key: 'progressLogs',
        align: 'center',
        render: record => (
          <>
            {record !== undefined &&
              Object.entries(record).map(([key, value]) => {
                const color = key && value ? 'blue' : 'red'
                return (
                  this.getProgressLogStatus(key) &&
                  key &&
                  value && (
                    <Tag color={color} key={key}>
                      {this.getProgressLogStatus(key)}{' '}
                      <CheckCircleFilled style={{ color: 'green' }} />
                    </Tag>
                  )
                )
              })}
          </>
        ),
      },
      {
        title: 'KYC Status',
        dataIndex: 'kycInformation.kycStatus',
        key: 'kycStatus',
        align: 'center',
        render: record => <div>{record ? capitalize(record) : ''}</div>,
      },
      {
        title: 'Account Status',
        dataIndex: 'companyStatus',
        key: 'companyStatus',
        align: 'center',
        render: record =>
          record === 'active' ? (
            <div style={{ color: '#008000', fontWeight: 'bold' }}>Active</div>
          ) : (
            <div style={{ color: '#FF8482', fontWeight: 'bold' }}>Inactive</div>
          ),
      },
      {
        title: 'Environment',
        dataIndex: 'environment',
        key: 'environment',
        align: 'center',
        render: record =>
          record === 'live' ? (
            <div style={{ color: '#008000', fontWeight: 'bold' }}>Live</div>
          ) : (
            <div style={{ color: '#ffb300', fontWeight: 'bold' }}>Sandbox</div>
          ),
      },
    ]

    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Client Management</span>
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
            </div>
          }
        >
          <Helmet title="Trades" />
          {this.getSearchUI()}
          <div className={styles.block}>
            <div className="row">
              <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
                <Skeleton loading={loading} active>
                  <Spin tip="Loading..." spinning={loading}>
                    <Table
                      columns={columns}
                      rowKey={record => record.id}
                      dataSource={clients}
                      pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '25', '50', '100'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      }}
                      loading={loading}
                      onRow={record => ({
                        onClick: () => {
                          this.navigateToClientManagement(record.id)
                        },
                      })}
                      scroll={{ x: 'max-content' }}
                      onChange={this.handleTableChange}
                    />
                  </Spin>
                </Skeleton>
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default ClientManagement
