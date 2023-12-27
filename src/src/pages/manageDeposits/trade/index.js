import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Steps } from 'antd'
import _ from 'lodash'

import { getTradeById } from 'redux/trade/actions'
import { getChatToken, initialiseTwilioChatClient } from 'redux/chat/actions'
import { getTransactionById } from 'redux/transactions/actions'
import { changeRouteType, getCryptoTransactionById } from 'redux/cryptoTransactions/actions'
// import { updateBeneficiariesBasedOnCurrency } from 'redux/general/actions'

// import NextStepNotification from "./components/nextStepNotification";

import TradeDetails from './tradeDetails'
import SwapDetails from './swapDetails'
import FxDetails from './fxDetails'
import RentalAccountDetails from './RentalAccountDetails'
import styles from './style.module.scss'
import OtcComponent from '../cryptoTransactions/OtcComponent'
import LiquidateComponent from '../cryptoTransactions/LiquidateComponent'
import CryptoWallet from '../cryptoTransactions/CryptoWallet'

const { Step } = Steps

const mapStateToProps = ({ general, user, chat, trade, trades }) => ({
  beneficiaries: general.beneficiaries,
  token: user.token,
  tradeId: trade.tradeId,
  routeEngineData: trade.routeEngineData,
  tradeStatus: trade.tradeStatus,
  activeChannel: trades.activeChannel,
  totalDepositAmount: trade.totalDepositAmount,
  depositCurrency: trade.depositCurrency,
  settlementCurrency: trade.settlementCurrency,
  tradeRequestedAt: trade.progressLogs.tradeRequestedAt,
  depositConfirmedByClientAt: trade.progressLogs.depositConfirmedByClientAt,
  isRatesConfirmed: trade.isRatesConfirmed,
  isInverseRate: trade.isInverseRate,
  isNewCalculation: trade.isNewCalculation,
  chatClient: chat.chatClient,
  channelId: trade.chat.channelId,
  chatAccessToken: chat.token,
  activeTradeStreamingChannel: chat.activeTradeStreamingChannel,
  streamingChannels: general.allStreamChannels,
})

@connect(mapStateToProps)
class Trade extends Component {
  constructor(props) {
    super(props)
    const { tradeStatus } = this.props
    this.state = {
      current: 0,
      steps: [
        {
          id: 0,
          title: 'TRADE',
          status: 'process',
          content: 'trade',
          description: tradeStatus || '',
          isCancelled: false,
        },
      ],
    }
  }

  componentDidMount() {
    const { chatAccessToken, dispatch, streamingChannels, channelId } = this.props
    // const { dispatch, tradeId, token, activeChannel } = this.props

    this.updateNewSteps()
    // dispatch(getTradeById(tradeId, token))

    if (chatAccessToken && channelId) {
      Promise.resolve(
        dispatch(initialiseTwilioChatClient(chatAccessToken, streamingChannels, channelId)),
      )
    }
    // this.messageHandler()
  }

  componentDidUpdate(prevProps) {
    // const {routeEngineData} = this.props
    const {
      channelId,
      dispatch,
      chatAccessToken,
      streamingChannels,
      email,
      userType,
      token,
      routeEngineData,
      tradeStatus,
    } = this.props

    const updateRequired =
      prevProps.chatAccessToken !== chatAccessToken || prevProps.channelId !== channelId
    if (updateRequired) {
      if (channelId && chatAccessToken) {
        Promise.resolve(
          dispatch(initialiseTwilioChatClient(chatAccessToken, streamingChannels, channelId)),
        )
      }
      if (!chatAccessToken) {
        const chatValues = {
          clientEmail: email,
          userType,
          token,
        }
        dispatch(getChatToken(chatValues))
      }
    }
    // this.messageHandler()

    if (prevProps.routeEngineData !== routeEngineData || prevProps.tradeStatus !== tradeStatus) {
      this.updateSteps()
    }
  }

  // messageHandler = () => {
  //   const { dispatch, activeTradeStreamingChannel, tradeId } = this.props

  //   if (Object.entries(activeTradeStreamingChannel).length !== 0) {
  //     activeTradeStreamingChannel.on('messageAdded', result => {
  //       const data = result.body ? JSON.parse(result.body) : {}

  //       data.document.beneficiary =
  //         Object.entries(data.document.cryptoBeneficiary).length !== 0
  //           ? data.document.cryptoBeneficiary
  //           : data.document.beneficiary

  //       if (data.operationType === 'update') {
  //         if (tradeId === data.document.id) {
  //           dispatch(updateCurrentTrade(data.document, result.index))
  //         }
  //       }
  //     })
  //   }
  // }

  changeRouteType = route => {
    return route === 'accounts_only' ? 'RENTAL_ACCOUNT' : route.toUpperCase()
  }

  updateSteps = () => {
    const { routeEngineData, tradeStatus } = this.props
    let updatedSteps = []
    updatedSteps = routeEngineData.map(route => {
      const updatedStep = {
        id: route.id,
        title: route.routeType ? this.changeRouteType(route.routeType) : 'Route',
        content: route.routeType,
        status: 'wait',
        description: route.transactionStatus || '',
        isCancelled: route.routeStatus === 'cancelled',
        disabled: route.routeType === undefined,
      }
      return updatedStep
    })
    const firstElement = {
      id: 0,
      title: 'TRADE',
      status: 'process',
      content: 'trade',
      description: tradeStatus || '',
      isCancelled: false,
    }
    updatedSteps.unshift(firstElement)
    this.setState({
      steps: updatedSteps,
    })
  }

  updateNewSteps = () => {
    const { routeEngineData } = this.props
    routeEngineData.map(route => {
      const newStep = {
        id: route.id,
        title: route.routeType ? route.routeType.toUpperCase() : 'Route',
        content: route.routeType,
        status: 'wait',
        description: route.transactionStatus || '',
        isCancelled: route.routeStatus === 'CANCELLED',
      }
      this.setState(prevState => ({
        steps: [...prevState.steps, newStep],
      }))
      return false
    })
  }

  onStepChange = current => {
    const { routeEngineData, dispatch, tradeId, token } = this.props
    if (current === 0) {
      dispatch(getTradeById(tradeId, token))
    }
    const currentRouteEngineIndex = current - 1
    if (currentRouteEngineIndex > -1) {
      const currentTxnId = routeEngineData[currentRouteEngineIndex].transactionId
      switch (routeEngineData[currentRouteEngineIndex].routeType) {
        case 'swap':
        case 'accounts_only':
        case 'fx':
          dispatch(getTransactionById(currentTxnId, token))
          break
        case 'otc':
        case 'liquidate':
        case 'crypto_wallet':
          dispatch(getCryptoTransactionById(currentTxnId, token))
          break
        default:
          break
      }
    }
    this.setState({ current })
  }

  getContent = content => {
    const { dispatch } = this.props
    dispatch(changeRouteType(content))
    switch (content) {
      case 'swap':
        return <SwapDetails />
      case 'fx':
        return <FxDetails />
      case 'accounts_only':
        return <RentalAccountDetails />
      case 'otc':
        return <OtcComponent />
      case 'liquidate':
        return <LiquidateComponent />
      case 'crypto_wallet':
        return <CryptoWallet />
      default:
        return <TradeDetails />
    }
  }

  render() {
    const { current, steps } = this.state

    return (
      <div>
        <Steps
          // type="navigation"
          current={current}
          onChange={this.onStepChange}
          className={styles.stepStyle}
        >
          {steps.map(tradeStep => {
            if (!tradeStep.isCancelled) {
              return (
                <Step
                  key={tradeStep.id}
                  title={tradeStep.title}
                  description={_.upperCase(tradeStep.description)}
                  disabled={tradeStep.disabled}
                />
              )
            }
            return false
          })}
        </Steps>
        {/* <NextStepNotification /> */}
        <div className="steps-content card-layout mt-3">
          {this.getContent(steps[current].content)}
        </div>
      </div>
    )
  }
}
export default Trade
