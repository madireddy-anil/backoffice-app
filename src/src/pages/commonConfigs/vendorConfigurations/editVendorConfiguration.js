import React, { Component } from 'react'
import { Card, Tabs, Icon, Spin, Button, Empty } from 'antd'
import Text from 'components/CleanUIComponents/Text'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import { updateVendorConfigViewMode } from 'redux/vendorConfiguration/action'
import ViewVendorData from './components/initialVendorSetUp/viewVendorSetUp'
import VendorPaymentsData from './components/payments'
import VendorForiegnExchangeData from './components/foreignExchange'
import LocalAccounts from './components/localAccounts'
import styles from './style.module.scss'

const { TabPane } = Tabs

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,
  countries: general.countries,
  addressEditMode: vendorConfiguration.addressEditMode,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  loading: vendorConfiguration.loading,
})

@connect(mapStateToProps)
class editVendorConfig extends Component {
  componentDidMount() {
    const { dispatch } = this.props

    dispatch(updateVendorConfigViewMode())
  }

  onClickBack = () => {
    const { history } = this.props
    history.push('/vendor-configuration-list')
  }

  render() {
    const { selectedVendorConfig, loading } = this.props

    return (
      <Spin spinning={loading}>
        {Object.entries(selectedVendorConfig).length > 0 ? (
          <React.Fragment>
            <Card
              title={
                <div className={styles.summaryHeader}>
                  <Text weight="thin" size="xlarge" className="font-size-15">
                    <Button
                      type="link"
                      icon="arrow-left"
                      className={styles.backArrowIcon}
                      onClick={this.onClickBack}
                    />
                    {`${' '} ${'Edit Vendor Configuration'}`}
                  </Text>
                </div>
              }
              bordered
              headStyle={{
                //   border: '1px solid #a8c6fa',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
              bodyStyle={{
                padding: '30px',
                //   border: '1px solid #a8c6fa',
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
              className={styles.mainCard}
            >
              <ViewVendorData />

              {/* create button */}
            </Card>
            <Spacer height="15px" />
            <Card
              headStyle={{
                //   border: '1px solid #a8c6fa',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
              bodyStyle={{
                padding: '30px',
                //   border: '1px solid #a8c6fa',
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
              className={styles.mainCard}
            >
              <div className="onBoardingWrapper">
                <Tabs defaultActiveKey="payments">
                  <TabPane
                    key="payments"
                    tab={
                      <span style={{ fontSize: '16px' }}>
                        <Icon type="wallet" />
                        Payments
                      </span>
                    }
                  >
                    <div className="text-center">
                      <VendorPaymentsData />
                    </div>
                  </TabPane>

                  <TabPane
                    tab={
                      <span style={{ fontSize: '16px' }}>
                        <Icon type="swap" />
                        Foreign Exchange
                      </span>
                    }
                    key="foreignExchange"
                  >
                    <div className="text-center">
                      <VendorForiegnExchangeData />
                    </div>
                  </TabPane>

                  <TabPane
                    tab={
                      <span style={{ fontSize: '16px' }}>
                        <Icon type="user" />
                        Local Accounts
                      </span>
                    }
                    key="localAccounts"
                  >
                    <div className="text-center">
                      <LocalAccounts />
                    </div>
                  </TabPane>
                </Tabs>
              </div>
            </Card>
          </React.Fragment>
        ) : (
          <Card
            title={
              <div className={styles.summaryHeader}>
                <Text weight="thin" size="xlarge" className="font-size-15">
                  <Button
                    type="link"
                    icon="arrow-left"
                    className={styles.backArrowIcon}
                    onClick={this.onClickBack}
                  />
                  {`${' '} ${'Edit Vendor Configuration'}`}
                </Text>
              </div>
            }
            bordered
            headStyle={{
              //   border: '1px solid #a8c6fa',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
            bodyStyle={{
              padding: '30px',
              //   border: '1px solid #a8c6fa',
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
            className={styles.mainCard}
          >
            <Empty />
          </Card>
        )}
      </Spin>
    )
  }
}

export default editVendorConfig
