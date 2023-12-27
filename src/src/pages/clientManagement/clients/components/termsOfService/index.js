import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Row, Col, Empty, Tag } from 'antd'
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons'
import Text from 'components/customComponents/Text'
import './style.scss'
import moment from 'moment'

const mapStateToProps = ({ clientManagement }) => ({
  termsOfService: clientManagement.termsOfService,
  people: clientManagement.people,
})

@connect(mapStateToProps)
class TermsOfService extends Component {
  state = {
    noData: '--',
  }

  fieldValidation = (type, value) => {
    const { noData } = this.state
    let returnResp
    if (type === 'string' && value !== undefined) {
      returnResp = value
    } else {
      returnResp = noData
    }
    return returnResp
  }

  cardListContent = authorizedPerson => {
    return (
      <Card style={{ marginTop: '30px', borderRadius: '12px' }}>
        <Row style={{ marginBottom: '15px' }}>
          <Col lg={{ span: 1 }} md={{ span: 3 }} xs={{ span: 4 }}>
            {authorizedPerson.firstName && (
              <span className="terms__authorized__person">
                <Text size="default">
                  {this.fieldValidation('string', authorizedPerson.firstName)}
                </Text>
              </span>
            )}
          </Col>
          <Col lg={{ span: 1 }} md={{ span: 3 }} xs={{ span: 4 }}>
            {authorizedPerson.percentageOfShares && (
              <span>
                <span className="terms__percentage">
                  {this.fieldValidation('string', authorizedPerson.percentageOfShares)}%
                </span>
              </span>
            )}
          </Col>
        </Row>
        <Row style={{ marginBottom: '15px' }}>
          <Col lg={{ span: 24 }}>
            <div className="terms__header">
              <span>
                <Text size="default">{`UBO, Director / ${authorizedPerson.email}`}</Text>
              </span>
              <span>
                <Tag color="green">
                  <CheckCircleFilled style={{ color: 'green' }} /> IDV details Provided
                </Tag>
              </span>
            </div>
          </Col>
        </Row>
        <Row style={{ marginBottom: '15px' }}>
          <Col lg={{ span: 24 }}>
            {authorizedPerson.isAuthorisedToAcceptTerms && (
              <div className="terms__header">
                <span>
                  <Tag color="#ecf8f3" className="terms__authorized__service">
                    <CheckCircleOutlined style={{ color: 'green' }} />{' '}
                    <span>Authorized to accept terms of service </span>
                  </Tag>
                </span>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    )
  }

  render() {
    const { termsOfService, people } = this.props
    const authorizedPerson = (people || []).find(
      person => person.id === termsOfService.authorizedPersonId,
    )
    console.log('authorizedPerson', authorizedPerson)
    return (
      <React.Fragment>
        <Card>
          {authorizedPerson !== undefined && Object.entries(authorizedPerson.length > 0) ? (
            <div className="termsofservice__wrapper">
              <Row style={{ marginBottom: '15px' }}>
                <Col lg={{ span: 24 }}>
                  <div className="terms__header">
                    <span className="terms__versionId">
                      <Text size="xsmall-bold">{termsOfService.versionId}</Text>
                      <Text size="default">Version ID</Text>
                    </span>
                    <span>
                      <Tag color="green">
                        <CheckCircleFilled style={{ color: 'green' }} /> Status: Accepted
                      </Tag>
                    </span>
                    <span>
                      <Tag color="green">
                        <CheckCircleFilled style={{ color: 'green' }} /> User: Accepted
                      </Tag>
                    </span>
                  </div>
                </Col>
              </Row>
              {this.cardListContent(authorizedPerson)}
              <Row style={{ marginTop: '30px' }}>
                <Col lg={{ span: 24 }}>
                  <span>
                    Date/Time: {moment(authorizedPerson.createdAt).format('DD/MM/YY')},&nbsp;&nbsp;
                    {moment(authorizedPerson.createdAt).format('h:mm')}
                  </span>
                </Col>
              </Row>
            </div>
          ) : (
            <div style={{ height: '150px' }}>
              <Empty style={{ height: '20px' }} description="No available Terms Of Service!" />
            </div>
          )}
        </Card>
      </React.Fragment>
    )
  }
}

export default TermsOfService
