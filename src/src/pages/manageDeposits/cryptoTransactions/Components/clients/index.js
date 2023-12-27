import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { connect } from 'react-redux'

import { capitalize } from 'utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ user, trade, general }) => ({
  token: user.token,
  clients: general.clients,
  introducers: general.introducers,
  merchants: general.merchants,
  introducerClients: general.introducerClients,
  merchantClients: general.merchantClients,
  isEditMode: trade.isEditMode,
  clientId: trade.clientId,
  parentId: trade.parentId,
  tradeId: trade.tradeId,
})

@connect(mapStateToProps)
class Client extends Component {
  getClientName = clientId => {
    const { clients } = this.props
    const clientObj = clients.find(el => el.id === clientId)
    if (clientObj) {
      return clientObj.genericInformation.tradingName
    }
    return false
  }

  getParentUI = (clientObj, merchantOrIntroducerObj) => {
    return (
      clientObj.genericInformation.parentId !== '' && (
        <Col className="mt-2" xs={{ span: 24 }} lg={{ span: 12 }}>
          <div>
            <h6>
              <strong>
                {merchantOrIntroducerObj
                  ? capitalize(merchantOrIntroducerObj.entityType)
                  : 'Parent'}
                :
              </strong>
            </h6>
            <div>
              <div className={styles.inputBox}>
                <span className="font-size-12">
                  {merchantOrIntroducerObj
                    ? merchantOrIntroducerObj.genericInformation.tradingName
                    : '---'}
                </span>
              </div>
            </div>
          </div>
        </Col>
      )
    )
  }

  render() {
    const { clientId, parentId, clients } = this.props
    const clientObj = clients.find(el => el.id === clientId)
    const merchantOrIntroducerObj = clients.find(el => el.id === parentId)
    const getName = () => {
      if (clientObj) {
        if (clientObj.genericInformation.parentId) {
          return `Partner ${capitalize(clientObj.entityType)}`
        }
        return capitalize(clientObj.entityType)
      }
      return 'Client'
    }

    return (
      <Row>
        {clientObj && this.getParentUI(clientObj, merchantOrIntroducerObj)}
        <Col className="mt-2" xs={{ span: 24 }} lg={{ span: 12 }}>
          <div>
            <h6>
              <strong>{getName()}:</strong>
            </h6>
            <div>
              <div className={styles.inputBox}>
                <span className="font-size-12">
                  {clientId ? this.getClientName(clientId) : '---'}
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
export default Client
