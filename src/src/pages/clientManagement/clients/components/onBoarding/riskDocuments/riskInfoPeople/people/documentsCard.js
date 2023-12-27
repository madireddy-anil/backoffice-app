import React, { Component } from 'react'
import { Card, Row, Col, Icon } from 'antd'
import Text from 'components/customComponents/Text'
import Spacer from 'components/customComponents/Spacer'

class DocumentCard extends Component {
  render() {
    const { title, fileName, handleFileDownload, handleFilePreview } = this.props
    return (
      <React.Fragment>
        <div style={{ marginTop: '10px', marginBottom: '25px' }}>
          <Text size="xxsmall-Bold ">{title}</Text>
          <Spacer height="10px" />
          <Card style={{ borderRadius: '7px' }}>
            <Row>
              <Col span={1}>
                <Icon type="file" onClick={handleFilePreview} />
              </Col>
              <Col style={{ marginLeft: '-10px' }} span={22}>
                {fileName}
              </Col>
              <Col style={{ textAlign: 'right' }} span={1}>
                <Icon type="download" onClick={handleFileDownload} />
              </Col>
            </Row>
          </Card>
        </div>
      </React.Fragment>
    )
  }
}

export default DocumentCard
