import React, { Component } from 'react'
import { Card, Table, Tooltip, Button, Form, Icon, Popconfirm, Tag } from 'antd'
import {
  updateVendorPaymentAddMode,
  updateSelectedRecordToEdit,
  updatePayemntCurrSupportedEditMode,
  updatePayemntCurrSupportedAddMode,
  deleteCurrencySupportedRecord,
  updateVendorPaymentEditMode,
} from 'redux/vendorConfiguration/action'
// import moment from 'moment'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import lodash from 'lodash'
import AddVendorPaymentData from './components/addVendorPayment'
import {
  formateArrayData,
  formatToZoneDate,
  getCountryLabel,
} from '../../../../../utilities/transformer'
import AddCurrencySupportedPair from './components/addCurrencySupportedPair'

import styles from './style.module.scss'

const mapStateToProps = ({ user, vendorConfiguration, settings, general }) => ({
  token: user.token,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  timeZone: settings.timeZone.value,

  showPaymentData: vendorConfiguration.showPaymentData,
  showEditPaymentData: vendorConfiguration.showEditPaymentData,

  showPaymentsCurreSupprtedAddMode: vendorConfiguration.showPaymentsCurreSupprtedAddMode,
  showPaymentsCurreSupprtedEditMode: vendorConfiguration.showPaymentsCurreSupprtedEditMode,

  addPaymentLoading: vendorConfiguration.paymentLoading,
  countries: general.countries,
})

@Form.create()
@connect(mapStateToProps)
class vendorPaymentList extends Component {
  state = {
    noData: '--',
    pagination: {
      pageSize: 50,
    },
  }

  handleAddCurrenciesSupported = () => {
    const { dispatch } = this.props

    dispatch(updatePayemntCurrSupportedAddMode(true))
  }

  handleAddPaymentData = () => {
    const { dispatch } = this.props
    dispatch(updateVendorPaymentAddMode(true))
  }

  handleVendorPaymentData = () => {
    const { dispatch } = this.props
    dispatch(updateVendorPaymentEditMode(true))
  }

  handleEditCurrencySupported = record => {
    const { dispatch } = this.props
    dispatch(updateSelectedRecordToEdit(record))
    dispatch(updatePayemntCurrSupportedEditMode(true))
  }

  handleDeletedCurrencySupported = record => {
    const { dispatch, token, selectedVendorConfig } = this.props
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    dispatch(deleteCurrencySupportedRecord(selectedVendorConfig.id, record._id, token))
  }

  getPaymentDates = dates => {
    const test = dates.map(item => {
      return (
        <Tag closable key={item} color="#313343" style={{ marginBottom: '3px' }}>
          {item}
        </Tag>
      )
    })
    return test
  }

  render() {
    const {
      selectedVendorConfig,
      showPaymentsCurreSupprtedAddMode,
      timeZone,
      showPaymentData,
      addPaymentLoading,
      showPaymentsCurreSupprtedEditMode,
      showEditPaymentData,
      countries,
    } = this.props
    const { payments } = selectedVendorConfig.serviceOffered
    const popConfirmtext = 'Are sure you want to delete this record ?'
    const { pagination, noData } = this.state
    // const popConfirmtext = 'Are you sure to delete this record?'
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Payment Currency',
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
      },
      {
        title: 'Payment Routing Channels Supported',
        dataIndex: 'supportedRoutingChannels',
        key: 'supportedRoutingChannels',
        align: 'center',
        children: [
          {
            title: 'Routing Channels',
            dataIndex: 'supportedRoutingChannels.routingChannels',
            key: 'supportedRoutingChannels.routingChannels',
            width: 150,
            align: 'center',
            render: text => text.join(','),
          },
          {
            title: 'Transaction Value Limit',
            dataIndex: 'supportedRoutingChannels.channelTransactionLimit',
            key: 'supportedRoutingChannels.channelTransactionLimit',
            width: 150,
            align: 'center',
          },
        ],
      },
      {
        title: 'Currency Processing Window Start',
        dataIndex: 'paymentWindowStart',
        key: 'paymentWindowStart',
        align: 'center',
        render: text => <span>{text}</span>,
      },
      {
        title: 'Cut-off Time',
        dataIndex: 'currencyCutOff',
        key: 'currencyCutOff',
        align: 'center',
        render: text => <span>{text}</span>,
      },
      {
        title: 'Days To Settlement Payments',
        dataIndex: 'currencySettlementTimeDays',
        key: 'currencySettlementTimeDays',
        align: 'center',
      },
      {
        title: 'Payment Types Supported',
        dataIndex: 'currencyPaymentTypesSupported',
        key: 'currencyPaymentTypesSupported',
        align: 'center',
        render: text => <a>{text ? lodash.startCase(text) : ''}</a>,
      },
      {
        title: 'Allowed Payment Days',
        dataIndex: 'allowedPaymentDays',
        key: 'allowedPaymentDays',
        align: 'center',
        render: text => <a>{text.length > 0 ? formateArrayData(text) : ''}</a>,
      },
      {
        title: 'Non-Allowed Payment Dates',
        dataIndex: 'nonAllowedPaymentDates',
        key: 'nonAllowedPaymentDates',
        align: 'center',
        render: text => <a>{text.length > 0 ? this.getPaymentDates(text) : ''}</a>,
      },
      {
        title: 'Status',
        dataIndex: 'isDeleted',
        key: 'isDeleted',
        align: 'center',
        fixed: 'right',
        render: record => {
          if (!record) {
            return (
              <Button
                type="link"
                icon="check-circle"
                size="small"
                style={{ color: '#3CB371', fontWeight: '600' }}
              >
                Active
              </Button>
            )
          }
          return (
            <Button
              type="link"
              size="small"
              icon="close-circle"
              style={{ color: '#ff6e6e', fontWeight: '600' }}
            >
              Inactive
            </Button>
          )
        },
      },

      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        fixed: 'right',
        render: record => (
          <>
            <Tooltip title="view">
              <Button
                onClick={() => this.handleEditCurrencySupported(record)}
                type="link"
                disabled={!selectedVendorConfig.status || record.isDeleted}
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedCurrencySupported(record)}
              okText="Yes"
              cancelText="No"
              loading={addPaymentLoading}
            >
              <Button
                type="link"
                className={styles.deleteIcon}
                disabled={!selectedVendorConfig.status || record.isDeleted}
              >
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]

    return (
      <React.Fragment>
        {showPaymentData || showEditPaymentData ? (
          <AddVendorPaymentData record={showPaymentData ? undefined : payments} />
        ) : (
          ''
        )}
        {showPaymentsCurreSupprtedAddMode || showPaymentsCurreSupprtedEditMode ? (
          <AddCurrencySupportedPair />
        ) : (
          ''
        )}
        <Spacer height="15px" />
        {payments.remittanceInformationAllowed !== undefined ? (
          <Card
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
            className={styles.mainCard}
            extra={
              <div>
                <Tooltip title="Add New Supported Currencies">
                  <Button
                    type="primary"
                    className="mr-3"
                    onClick={this.handleAddCurrenciesSupported}
                    disabled={showPaymentsCurreSupprtedEditMode}
                  >
                    {'Add Supported Currencies'}
                  </Button>
                </Tooltip>
              </div>
            }
          >
            <Helmet title="Currency" />

            <div className={styles.data}>
              <div className="row">
                {Object.entries(selectedVendorConfig.timeZone).length >= 0 ? (
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Time Zone</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {selectedVendorConfig.timeZone
                          ? selectedVendorConfig.timeZone.label
                          : noData}
                      </span>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {payments.remittanceInformationAllowed !== undefined ? (
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-13 font-weight-500">
                      Is Remittance Information Allowed ?
                    </strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {payments.remittanceInformationAllowed ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                ) : (
                  ''
                )}

                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-13 font-weight-500">Disallowed Countries</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {payments.disallowedCountries.length > 0
                        ? getCountryLabel(payments.disallowedCountries, countries)
                        : '--'}
                    </span>
                  </div>
                </div>

                <div className="col-md-3 col-lg-3">
                  {/* <div className={`${styles.actionBtns}`}> */}
                  <Button type="link" onClick={this.handleVendorPaymentData}>
                    <Icon type="edit" size="large" className={styles.editIcon} />
                  </Button>
                  {/* </div> */}
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <Table
                    columns={columns}
                    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
                    rowKey={record => record._id}
                    loading={addPaymentLoading}
                    dataSource={payments.supportedCurrencies}
                    scroll={{ x: 'max-content' }}
                    pagination={pagination}
                    onChange={this.handleTableChange}
                    bordered
                  />
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className={styles.addButtonBlock}>
            <Button type="dashed" onClick={this.handleAddPaymentData} style={{ width: '60%' }}>
              <Icon type="plus" /> Add Payment data
            </Button>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default vendorPaymentList
