import React from 'react'
import { Row, Card, Col, Divider } from 'antd'
import Text from 'components/customComponents/Text'

const CardList = ({ contentList }) => {
  return (contentList || []).map(record => {
    return (
      <Card style={{ borderRadius: '7px', marginBottom: '15px' }}>
        <Row className="mt-3 mb-1">
          {record.content.map((element, idx) => {
            const index = idx
            return (
              <Col key={index}>
                <Col lg={{ span: 7 }}>
                  <Text>{element.label}</Text>
                  <div style={{ marginBottom: '15px' }}>
                    <Text size="xsmall-bold">{element.value}</Text>
                  </div>
                </Col>
                {!(idx === record?.content?.length - 1) && (
                  <Col lg={{ span: 1 }}>
                    <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
                  </Col>
                )}
              </Col>
            )
          })}
        </Row>
      </Card>
    )
  })
}

export default CardList
