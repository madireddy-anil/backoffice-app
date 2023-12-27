import React, { Component } from 'react'
import { Button, Icon } from 'antd'
import { updateSelectedRecordToEdit, updateShowEditExoticFX } from 'redux/currencyAccounts/action'
import { connect } from 'react-redux'
import lodash from 'lodash'
import styles from './style.module.scss'

const mapStateToProps = ({ user, currencyAccounts }) => ({
  token: user.token,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,
  addExoticConfigLoading: currencyAccounts.addExoticConfigLoading,
})

@connect(mapStateToProps)
class viewExoticFX extends Component {
  handleEditExoticFX = record => {
    const { dispatch } = this.props
    dispatch(updateSelectedRecordToEdit(record))
    dispatch(updateShowEditExoticFX(true))
  }

  render() {
    const { selectedCurrencyAccount } = this.props
    const { exoticForeignExchange } = selectedCurrencyAccount
    return (
      <React.Fragment>
        <div className="row">
          {selectedCurrencyAccount.isActiveAccount ? (
            <div className="col-md-12 col-lg-12">
              <div className={`${styles.actionBtns}`}>
                <Button type="link" onClick={() => this.handleEditExoticFX(exoticForeignExchange)}>
                  <Icon type="edit" size="large" className={styles.editIcon} />
                </Button>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Deposit Account Type</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {exoticForeignExchange.depositAccountType
                  ? lodash.capitalize(exoticForeignExchange.depositAccountType)
                  : '--'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Deposit Window Start</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {exoticForeignExchange.depositWindowStart
                  ? exoticForeignExchange.depositWindowStart
                  : '--'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Deposit Window End</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {exoticForeignExchange.depositWindowEnd
                  ? exoticForeignExchange.depositWindowEnd
                  : '--'}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Usage</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {exoticForeignExchange.accountUsage
                  ? lodash.capitalize(exoticForeignExchange.accountUsage)
                  : '--'}
              </span>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Notes</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {exoticForeignExchange.additionalNotes
                  ? exoticForeignExchange.additionalNotes
                  : '--'}
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default viewExoticFX
