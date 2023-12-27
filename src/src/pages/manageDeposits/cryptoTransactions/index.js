import React from 'react'
import { connect } from 'react-redux'
import { Card, Menu, Tooltip, Icon, Dropdown, Row, Col } from 'antd'
import {
  modeChange,
  updateTransactionValues,
  getCryptoTransactionById,
} from 'redux/cryptoTransactions/actions'
import CryptoOTCProgress from './Components/cryptoOTCProgress'
import CryptoLequidateProgress from './Components/cryptoLequidateProgress'
import CryptoWalletProgress from './Components/cryptoWalletProgress'
import TxnRatesTable from './Components/txnRatesTable'
import TxnFeesTable from './Components/txnFeesTable'
import CryptoSummary from './Components/cryptoSummary'
import RouteTable from '../trade/routeTable'
import CommentBox from '../trade/comments'
// import actionsMenu from './variables'

import styles from './style.module.scss'

const mapStateToProps = ({ cryptoTransaction, user }) => ({
  token: user.token,
  currentRouteType: cryptoTransaction.currentRouteType,
  isEditCryptoTxnMode: cryptoTransaction.isEditCryptoTxnMode,
  txnValuesUpdateLoader: cryptoTransaction.txnValuesUpdateLoader,
  vendorId: cryptoTransaction.selectedTransaction.vendorId,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  comments: cryptoTransaction.selectedTransaction.comments,
})

@connect(mapStateToProps)
export default class CryptoTransactions extends React.Component {
  // componentDidMount = () => {
  //   const { dispatch, token, vendorId } = this.props
  //   dispatch(getBankAccountByVendorId(vendorId, token))
  // }

  changeModeOfOperation = option => {
    const { dispatch } = this.props
    dispatch(modeChange(option))
  }

  editTransaction = () => {
    const { isEditCryptoTxnMode, dispatch } = this.props
    dispatch(modeChange(isEditCryptoTxnMode))
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props
    dispatch(modeChange(true))
  }

  addTxnComment = value => {
    const { dispatch, selectedTransaction, comments, token } = this.props
    const txnValues = {
      comments: [...comments, value],
    }
    dispatch(updateTransactionValues(txnValues, selectedTransaction.id, token))
  }

  refreshCryptoTxn = () => {
    const { dispatch, selectedTransaction, token } = this.props
    dispatch(getCryptoTransactionById(selectedTransaction.id, token))
  }

  render() {
    const {
      isEditCryptoTxnMode,
      currentRouteType,
      selectedTransaction,
      comments,
      txnValuesUpdateLoader,
    } = this.props
    // console.log(type)
    // const actionMenu = (
    //   <Menu>
    //     {actionsMenu.map(option => (
    //       <Menu.Item onClick={() => this.changeModeOfOperation(option)}>{option}</Menu.Item>
    //     ))}
    //   </Menu>
    // )
    const actionMenu = (
      <Menu>
        <Menu.Item hidden={isEditCryptoTxnMode} onClick={this.editTransaction}>
          <Icon type="edit" />
          Edit Transaction
        </Menu.Item>
        <Menu.Item hidden={!isEditCryptoTxnMode} onClick={this.editTransaction}>
          <Icon type="eye" />
          View Transaction
        </Menu.Item>
      </Menu>
    )

    const getCryptoComponent = () => {
      switch (currentRouteType) {
        case 'otc':
          return <CryptoOTCProgress />
        case 'liquidate':
          return <CryptoLequidateProgress />
        case 'crypto_wallet':
          return <CryptoWalletProgress />
        default:
          return <CryptoOTCProgress />
      }
    }

    return (
      <React.Fragment>
        <Card
          title={
            selectedTransaction
              ? selectedTransaction.cryptoTransactionReference
              : 'Crypto Transaction Id'
          }
          bordered={false}
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '2px',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          extra={
            <React.Fragment>
              <Tooltip title="Refresh">
                <Icon className="mr-3" type="sync" onClick={this.refreshCryptoTxn} />
              </Tooltip>
              <Dropdown overlay={actionMenu} trigger={['click']}>
                <Icon type="setting" />
              </Dropdown>
            </React.Fragment>
          }
        >
          <Row>
            <Col xs={{ span: 24 }} lg={{ span: 13 }}>
              <div className={styles.timelineCard}>{getCryptoComponent()}</div>
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 11 }}>
              {/* <div className={styles.timelineCard}> */}
              <CryptoSummary />
              {/* </div> */}
            </Col>
          </Row>
        </Card>
        <RouteTable />
        <TxnRatesTable />
        <TxnFeesTable />
        <CommentBox
          loading={txnValuesUpdateLoader}
          data={comments}
          addComment={value => this.addTxnComment(value)}
        />
      </React.Fragment>
    )
  }
}
