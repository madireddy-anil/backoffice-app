import React, { Component } from 'react'
import { Card, Table, Tooltip, Button, Form, Icon, Popconfirm, Tag } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
// import moment from 'moment'
import lodash from 'lodash'
import {
  updateVendorFXDataAddMode,
  updateFXCurrPairEditMode,
  updateSelectedRecordToEdit,
  updateFXCurrPairAddMode,
  deleteVendorCurrencyPair,
  updateVendorFXEditMode,
} from 'redux/vendorConfiguration/action'
import {
  formatToZoneDate,
  formateArrayData,
  getCountryLabel,
} from '../../../../../utilities/transformer'
import AddFXCurrencySupported from './components/addCurrencyPair'
import AddVendorFXData from './components/addVendorFXData'

import styles from './style.module.scss'

const mapStateToProps = ({ user, vendorConfiguration, settings, general }) => ({
  token: user.token,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,

  showVendorFXAddMode: vendorConfiguration.showVendorFXAddMode,
  showEditFXData: vendorConfiguration.showEditFXData,
  showFXCurrPairAddMode: vendorConfiguration.showFXCurrPairAddMode,
  showFXCurrPairEditMode: vendorConfiguration.showFXCurrPairEditMode,

  timeZone: settings.timeZone.value,
  fxLoading: vendorConfiguration.fxLoading,
  countries: general.countries,
})

@Form.create()
@connect(mapStateToProps)
class Currency extends Component {
  state = {
    pagination: {
      pageSize: 50,
    },
    noData: '--',
  }

  handleAddCurrenciesPair = () => {
    const { dispatch } = this.props

    dispatch(updateFXCurrPairAddMode(true))
  }

  handleAddForeignExchangeData = () => {
    const { dispatch } = this.props
    dispatch(updateVendorFXDataAddMode(true))
  }

  navigateToEditCurrencyPair = record => {
    const { dispatch } = this.props
    dispatch(updateSelectedRecordToEdit(record))
    dispatch(updateFXCurrPairEditMode(true))
  }

  handleDeletedCurrencyPair = record => {
    const { dispatch, token, selectedVendorConfig } = this.props
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    dispatch(deleteVendorCurrencyPair(selectedVendorConfig.id, record._id, token))
  }

  handleEditVendorFXData = () => {
    const { dispatch } = this.props
    dispatch(updateVendorFXEditMode(true))
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
      showFXCurrPairAddMode,
      showFXCurrPairEditMode,
      timeZone,
      showVendorFXAddMode,
      fxLoading,
      showEditFXData,
      countries,
    } = this.props

    const { foreignExchange } = selectedVendorConfig.serviceOffered
    const { pagination, noData } = this.state
    const popConfirmtext = 'Are you sure to delete this record?'
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Sell Currency',
        dataIndex: 'sellCurrency',
        key: 'sellCurrency',
        align: 'center',
      },
      {
        title: 'Buy Currency',
        dataIndex: 'buyCurrency',
        key: 'buyCurrency',
        align: 'center',
      },
      // {
      //   title: 'Quote Method',
      //   dataIndex: 'quoteMethod',
      //   key: 'quoteMethod',
      //   align: 'center',
      //   render: text => (text ? lodash.startCase(text) : ''),
      // },
      {
        title: 'Vendor Index',
        dataIndex: 'vendorIndex',
        key: 'vendorIndex',
        align: 'center',
      },
      {
        title: 'Vendor Spread',
        dataIndex: 'vendorSpread',
        key: 'vendorSpread',
        align: 'center',
      },
      {
        title: 'Rate Type',
        dataIndex: 'rateType',
        key: 'rateType',
        align: 'center',
        render: text => (text ? lodash.startCase(text) : ''),
      },

      {
        title: 'Tenors',
        dataIndex: 'tenors',
        key: 'tenors',
        align: 'center',
        render: text => (text ? formateArrayData(text) : ''),
      },
      {
        title: 'Trading Times Start',
        dataIndex: 'currencyAllowedTradingTimesStart',
        key: 'currencyAllowedTradingTimesStart',
        align: 'center',
        render: text => <span>{text}</span>,
      },
      {
        title: 'Cut-off Time',
        dataIndex: 'currencyCutOff',
        key: 'currencyCutOff',
        align: 'center',
        render: text => (
          // <div className={styles.cutOffBlock}>
          <span>{text}</span>
          //   <span className={styles.timeZoneBlock}>{selectedVendorConfig.profile.timeZone}</span>
          // </div>
        ),
      },
      {
        title: 'Credit Offered ',
        dataIndex: 'creditOffered',
        key: 'creditOffered',
        align: 'center',
        render: text => <span>{text ? 'Yes' : 'No'}</span>,
      },
      {
        title: 'Credit Offered Value',
        dataIndex: 'creditOfferedValue',
        key: 'creditOfferedValue',
        align: 'center',
      },
      {
        title: 'Allowed Trading Days',
        dataIndex: 'currencyAllowedTradingDays',
        key: 'currencyAllowedTradingDays',
        align: 'center',
        render: text => formateArrayData(text),
      },
      {
        title: 'Non-Allowed Trading Dates',
        dataIndex: 'currencyNonAllowedTradingDates',
        key: 'currencyNonAllowedTradingDates',
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
                onClick={() => this.navigateToEditCurrencyPair(record)}
                type="link"
                disabled={!selectedVendorConfig.status || record.isDeleted}
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedCurrencyPair(record)}
              okText="Yes"
              cancelText="No"
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
        {showVendorFXAddMode || showEditFXData ? (
          <AddVendorFXData record={showEditFXData ? foreignExchange : undefined} />
        ) : (
          ''
        )}
        {showFXCurrPairAddMode || showFXCurrPairEditMode ? <AddFXCurrencySupported /> : ''}
        <Spacer height="15px" />
        {foreignExchange.remittanceInformationAllowed !== undefined &&
        foreignExchange.enhancedScreeningRequired !== undefined ? (
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
                <Tooltip title="Add New Currency Pair">
                  <Button
                    type="primary"
                    className="mr-3"
                    onClick={this.handleAddCurrenciesPair}
                    disabled={showFXCurrPairEditMode}
                  >
                    {'Add Currency Pair'}
                  </Button>
                </Tooltip>
              </div>
            }
          >
            <Helmet title="Currency" />
            <div className={styles.data}>
              {/* {this.getSearchUI()} */}
              <div className="row">
                {foreignExchange.remittanceInformationAllowed !== undefined &&
                foreignExchange.enhancedScreeningRequired !== undefined ? (
                  <React.Fragment>
                    <div className="col-md-12 col-lg-12">
                      <div className={`${styles.actionBtns}`}>
                        <Button type="link" onClick={this.handleEditVendorFXData}>
                          <Icon type="edit" size="large" className={styles.editIcon} />
                        </Button>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                      <strong className="font-size-13 font-weight-500">
                        Is Remittance Information Allowed ?
                      </strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {foreignExchange.remittanceInformationAllowed ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <strong className="font-size-13 font-weight-500">
                        Enhanced Screening Required ?
                      </strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {foreignExchange.enhancedScreeningRequired ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-3">
                      <strong className="font-size-13 font-weight-500">Disallowed Countries</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {foreignExchange.disallowedCountries.length > 0
                            ? getCountryLabel(foreignExchange.disallowedCountries, countries)
                            : '--'}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  ''
                )}

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
              </div>
              <div className="row">
                <div className="col-xl-12">
                  <Table
                    columns={columns}
                    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
                    rowKey={record => record._id}
                    loading={fxLoading}
                    dataSource={foreignExchange.currencyPairs}
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
            <Button
              type="dashed"
              onClick={this.handleAddForeignExchangeData}
              style={{ width: '60%' }}
            >
              <Icon type="plus" /> Add Foreign Exchange
            </Button>
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default Currency
