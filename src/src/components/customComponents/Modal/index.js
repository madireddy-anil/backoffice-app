import React from 'react'
import { Modal, Row, Col } from 'antd'

import './style.scss'

const ModalV = props => {
  const { modalView, mask, modalWidth, modalType, modalDescription, className } = props
  return (
    <div>
      <Modal
        title={false}
        width={modalWidth}
        visible={modalView}
        mask={mask}
        footer={null}
        closable={false}
        destroyOnClose
        className="main-modal"
        style={{ borderRadius: '7px', marginTop: '2%' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <Row>
          <Col span={24}>
            <div className={!className ? 'modal-title' : className}>{modalType}</div>
            <div className="modal-desc">{modalDescription}</div>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}
export default ModalV
