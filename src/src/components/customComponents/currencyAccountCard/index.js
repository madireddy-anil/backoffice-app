import React, { Component } from 'react'
import Spacer from 'components/CleanUIComponents/Spacer'
import { Card, Row, Col, Icon } from 'antd'
import { amountFormatter, maskAccountNumber } from '../../../utilities/transformer'

import styles from './style.module.scss'

class CurrencyAccountCard extends Component {
  render() {
    const { handleCardClick, data, isActiveCard, handleViewClick, handleHideClick } = this.props
    return (
      <Card
        className={isActiveCard ? styles.activeCard : styles.cardBlock}
        onClick={handleCardClick}
        bordered
      >
        <Row>
          <Col span={10}>
            <div className={styles.cuurencyBlock}>{data.currency.code}</div>
          </Col>
          {data.hide ? (
            <Col span={14}>
              <div>
                <Icon type="eye" onClick={handleViewClick} className={styles.viewBtn} />
                {/* <Button type="link" className={styles.viewBtn} onClick={handleViewClick}>
                  View
                </Button> */}
              </div>
            </Col>
          ) : (
            <Col span={14}>
              <div>
                <Icon type="eye-invisible" className={styles.viewBtn} onClick={handleHideClick} />
                {/* <Button type="link" className={styles.viewBtn} onClick={handleHideClick}>
                  Hide
                </Button> */}
              </div>
            </Col>
          )}
        </Row>
        <Spacer height="14px" />
        <Row>
          <Col span={24}>
            <div className={styles.accountNumber}>
              {data.maskAccountNum
                ? maskAccountNumber(data.accountNumber)
                : data.accountNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            </div>
          </Col>
        </Row>

        <Spacer height="18px" />
        <Row>
          <Col span={24}>
            <div className={styles.balanceBlock}>
              {data.balance ? amountFormatter(data.balance) : ''}
            </div>
          </Col>
        </Row>

        <div>
          <img
            src="resources/images/logo_square-mobile.svg"
            alt=""
            className={styles.imageBlock}
            style={{
              position: 'absolute',
              top: 71,
              right: -20,
              opacity: '25%',
              height: '120px',
              width: '120px',
            }}
          />
        </div>
      </Card>
    )
  }
}
export default CurrencyAccountCard
