import React, { Component } from 'react'
import Spacer from 'components/CleanUIComponents/Spacer'
import { Card, Row, Col, Icon } from 'antd'

import styles from './style.module.scss'

class InfoCard extends Component {
  render() {
    const {
      minHeight,
      imgHeight,
      imgTop,
      closeButton,
      header,
      subHeader,
      list1,
      list2,
      list3,
    } = this.props
    return (
      <Card
        className={styles.activeCard}
        bordered
        style={{ borderRadius: 'none' }}
        bodyStyle={{ height: minHeight }}
      >
        <Row>
          <Col span={20}>
            <div className={styles.headerBlock}>{header}</div>
            <Spacer height="14px" />
            <div className={styles.subHeaderBlock}>{subHeader}</div>
          </Col>
          <Col span={2}>
            <div className={styles.listBlock}>{list1}</div>
            <div className={styles.listBlock}>{list2}</div>
            <div className={styles.listBlock}>{list3}</div>
          </Col>
          <Col span={2}>
            <Icon type="close" className={styles.closeBtn} onClick={closeButton} />
          </Col>
        </Row>
        <div>
          <img
            src="resources/images/logo_square-mobile.svg"
            alt=""
            className={styles.imageBlock}
            style={{
              position: 'absolute',
              top: imgTop,
              right: -20,
              opacity: '25%',
              height: imgHeight,
              width: '120px',
            }}
          />
        </div>
      </Card>
    )
  }
}
export default InfoCard
