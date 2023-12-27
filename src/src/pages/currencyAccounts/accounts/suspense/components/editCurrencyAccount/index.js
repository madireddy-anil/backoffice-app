import React, { Component } from 'react'
import { Button, Card, Collapse, Icon, Spin, Empty } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  updateShowAccountDetails,
  updateShowAddExternalReference,
  updateShowAddAccountLimits,
  updateShowAddExoticFXConfig,
  getAccountDetailsById,
  updateCAInitialDataEditMode,
} from 'redux/currencyAccounts/action'
import { getClients } from 'redux/general/actions'
import Spacer from 'components/CleanUIComponents/Spacer'
// import AddAccountDetails from '../addNewCurrencyAccount/accountIndetification/addNewAccountDetails'
import EditInitialCAData from '../addNewCurrencyAccount/initialSetUp/editInitialData'
import ViewInitialCAData from '../addNewCurrencyAccount/initialSetUp/viewInitialSetup'

import styles from './style.module.scss'
// import ViewAccountDetails from '../addNewCurrencyAccount/accountIndetification/viewAccountDetails'
import AddExternalReferences from '../addNewCurrencyAccount/externalReferences/addExternalReference'
import ViewExternalReferences from '../addNewCurrencyAccount/externalReferences/viewExternalReference'

const { Panel } = Collapse

const mapStateToProps = ({ user, general, currencyAccounts }) => ({
  token: user.token,
  currencies: general.currencies,
  loading: currencyAccounts.loading,

  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,
  showAddAccountDetails: currencyAccounts.showAddAccountDetails,
  showAddExternalReference: currencyAccounts.showAddExternalReference,
  showEditExternalReference: currencyAccounts.showEditExternalReference,
  showAddAccountLimits: currencyAccounts.showAddAccountLimits,
  showEditAccountLimits: currencyAccounts.showEditAccountLimits,
  showAddExoticFXConfig: currencyAccounts.showAddExoticFXConfig,
  initialCADataEditMode: currencyAccounts.initialCADataEditMode,

  clientListloading: currencyAccounts.clientListloading,
})

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
}

@connect(mapStateToProps)
class editCurrencyAccount extends Component {
  componentDidMount() {
    this.getParamId()

    const { dispatch, token } = this.props
    dispatch(getClients(token))
    dispatch(updateCAInitialDataEditMode(false))
    dispatch(updateShowAccountDetails(false))
    dispatch(updateShowAddExternalReference(false))
    dispatch(updateShowAddAccountLimits(false))
    dispatch(updateShowAddExoticFXConfig(false))
  }

  getParamId = () => {
    const { dispatch, token, match } = this.props
    const ID = match.params.id
    dispatch(getAccountDetailsById(ID, token))
  }

  handleAddAccountDetails = () => {
    const { dispatch } = this.props
    dispatch(updateShowAccountDetails(true))
  }

  handleAddExternalReferences = () => {
    const { dispatch } = this.props
    dispatch(updateShowAddExternalReference(true))
  }

  handleAddAccountLimits = () => {
    const { dispatch } = this.props
    dispatch(updateShowAddAccountLimits(true))
  }

  handleAddExoticFXConfig = () => {
    const { dispatch } = this.props
    dispatch(updateShowAddExoticFXConfig(true))
  }

  onClickBack = () => {
    const { history } = this.props
    history.push(`/payments-accounts-list`)
  }

  render() {
    const {
      selectedCurrencyAccount,
      showEditExternalReference,
      showAddExternalReference,
      initialCADataEditMode,
      loading,
      clientListloading,
    } = this.props

    return (
      <Spin spinning={loading || clientListloading}>
        {Object.entries(selectedCurrencyAccount).length > 0 ? (
          <React.Fragment>
            <Card
              title={
                <div>
                  <Button
                    type="link"
                    icon="arrow-left"
                    className={styles.backArrowIcon}
                    onClick={this.onClickBack}
                  />
                  <span className="font-size-16">Edit Suspense Currency Account</span>
                </div>
              }
              bordered
              headStyle={{
                border: '1px solid #a8c6fa',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
              bodyStyle={{
                padding: '30px',
                border: '1px solid #a8c6fa',
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
              className={styles.mainCard}
            >
              <Helmet title="Currency" />
              <React.Fragment>
                {initialCADataEditMode ? (
                  <EditInitialCAData record={selectedCurrencyAccount} />
                ) : (
                  <ViewInitialCAData />
                )}
              </React.Fragment>
            </Card>
            <Spacer height="5px" />
            <Card
              bordered
              headStyle={{
                border: '1px solid #a8c6fa',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
              bodyStyle={{
                padding: '30px',
                border: '1px solid #a8c6fa',
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
              className={styles.mainCard}
            >
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel header="External Account References" key="1" style={customPanelStyle}>
                  <div className={styles.addButtonBlock}>
                    <Button
                      type="dashed"
                      onClick={this.handleAddExternalReferences}
                      style={{ width: '60%' }}
                    >
                      <Icon type="plus" /> Add External Account References
                    </Button>
                  </div>
                  {showAddExternalReference || showEditExternalReference ? (
                    <AddExternalReferences />
                  ) : (
                    ''
                  )}
                  {selectedCurrencyAccount.externalReference.length > 0 ? (
                    <ViewExternalReferences />
                  ) : (
                    ''
                  )}
                </Panel>
                {/* <Panel header="Account Limits" key="2" style={customPanelStyle}>
                  <div className={styles.addButtonBlock}>
                    <Button
                      type="dashed"
                      onClick={this.handleAddAccountLimits}
                      style={{ width: '60%' }}
                    >
                      <Icon type="plus" /> Add Account Limits
                    </Button>
                  </div>
                  {showAddAccountLimits  || showEditAccountLimits? <AddAccountLimits /> : ''}
                  {selectedCurrencyAccount.accountThresholds.length > 0 ? (
                    <ViewAccountLimits />
                  ) : (
                    ''
                  )}
                </Panel> */}
              </Collapse>
            </Card>
          </React.Fragment>
        ) : (
          <Empty />
        )}
      </Spin>
    )
  }
}

export default editCurrencyAccount
