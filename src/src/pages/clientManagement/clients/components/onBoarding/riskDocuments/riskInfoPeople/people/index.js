import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Collapse, Button, Row, Col, Divider, Empty, Modal } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  EnvironmentOutlined,
} from '@ant-design/icons'
import Text from 'components/customComponents/Text'
import Spacer from 'components/customComponents/Spacer'
import DocumentCard from './documentsCard'

import styles from '../style.module.scss'

const { Panel } = Collapse

const mapStateToProps = ({ user, clientManagement }) => ({
  token: user.token,
  entityId: clientManagement.entityId,
  people: clientManagement.people,
  originFileObjForStakeholder: clientManagement.originFileObjForStakeholder,
  previewStakeholderURL: clientManagement.previewStakeholderURL,
})

@connect(mapStateToProps)
class RiskInformationPeople extends Component {
  state = {
    isCollapseActive: false,
    selectedPerson: {},
    noData: '--',
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isPreviewURLFetched) {
      this.previewDocumentImage()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { previewStakeholderURL } = this.props
    const isPropsUpdated = {
      isPreviewURLFetched: prevProps.previewStakeholderURL !== previewStakeholderURL,
    }
    return isPropsUpdated
  }

  previewDocumentImage = () => {
    const { originFileObjForStakeholder, previewStakeholderURL } = this.props
    if (!originFileObjForStakeholder.url || !originFileObjForStakeholder.preview) {
      originFileObjForStakeholder.previewURL = previewStakeholderURL
      this.setState({
        previewImage: originFileObjForStakeholder.previewURL || originFileObjForStakeholder.url,
        previewVisible: true,
        previewTitle: originFileObjForStakeholder.filename,
      })
    }
  }

  panelHeadTitle = person => {
    const memberRoles = person.role !== undefined && person.role !== null ? person.role : []
    return (
      <div className={styles.panel__header_pp}>
        <Row style={{ marginBottom: '15px' }}>
          <Col style={{ display: 'flex' }} lg={{ span: 20 }}>
            <span className={styles.shareHolderName}>
              <Text size="default">{this.fieldValidation('string', person.firstName)}</Text>
              &nbsp; - &nbsp;
              {memberRoles
                .map(role => {
                  return role
                })
                .join(', ')}
            </span>
            {person.percentageOfShares && (
              <span className={styles.shareHolderPercentage}>
                <span className="percentage">
                  {this.fieldValidation('string', person.percentageOfShares)}%
                </span>
              </span>
            )}
          </Col>
        </Row>
        <Row>
          <Col lg={{ span: 24 }}>
            <Text size="default">
              <UserOutlined style={{ marginRight: '10px' }} />
              {this.fieldValidation('string', person.firstName)}{' '}
              {this.fieldValidation('string', person.lastName)} <Divider type="vertical" />
            </Text>

            <Text size="default">
              <MailOutlined style={{ marginRight: '10px', marginLeft: '5px' }} />{' '}
              {this.fieldValidation('string', person.email)} <Divider type="vertical" />
            </Text>

            {person.isIdvScreeningDone ? (
              <Text size="default">
                <CheckCircleFilled
                  style={{ marginRight: '10px', marginLeft: '5px', color: '#54D19D' }}
                />{' '}
                IDV details provided
              </Text>
            ) : (
              <Text size="default">
                <CloseCircleFilled
                  style={{ marginRight: '10px', marginLeft: '5px', color: '#FF5757' }}
                />{' '}
                IDV details provided
              </Text>
            )}
          </Col>
        </Row>
      </div>
    )
  }

  handleonChangeCollapse = e => {
    if (e.length > 0) {
      this.setState({ isCollapseActive: true })
    } else this.setState({ isCollapseActive: false })
  }

  handleCollapse = person => {
    this.setState({ selectedPerson: person })
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

  documentName = licenseLabel => {
    let returnResp
    switch (licenseLabel) {
      case 'id':
        returnResp = 'ID Card'
        break
      case 'Driving Licence':
        returnResp = 'Full licence'
        break
      case 'Passport':
        returnResp = 'passport'
        break
      default:
        returnResp = 'ID'
        break
    }
    return returnResp
  }

  handleFileDownload = (person, type) => {
    const { dispatch, token } = this.props
    let documentType
    const isDownload = true
    if (type === 'frontPage' || type === 'backPage') {
      if (type === 'frontPage') documentType = person?.frontPageOfDocument
      if (type === 'backPage') documentType = person?.backPageOfDocument
    } else {
      if (type === 'passport') {
        documentType = person?.frontPageOfDocument
      }
      if (type === 'selfie') {
        documentType = person?.selfie
      }
    }
    dispatch({
      type: 'GET_STAKEHOLDER_PRESIGNED_URL_DOWNLOAD',
      token,
      data: {
        entityId: person.entityId,
        fileName: documentType,
        isDownload,
      },
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handleFilePreview = (person, type) => {
    const { dispatch, token } = this.props
    let fileName
    const isDownloadable = false
    if (type === 'frontPage' || type === 'backPage') {
      if (type === 'frontPage') fileName = person?.frontPageOfDocument
      if (type === 'backPage') fileName = person?.backPageOfDocument
    } else {
      if (type === 'passport') {
        fileName = person?.frontPageOfDocument
      }
      if (type === 'selfie') {
        fileName = person?.selfie
      }
    }
    dispatch({
      type: 'GET_STAKEHOLDER_PRESIGNED_URL_PREVIEW',
      data: {
        fileName,
        isDownloadable,
        entityId: person.entityId,
      },
      token,
    })
  }

  // genExtra = () => <Button type="link">See more</Button>

  render() {
    const {
      isCollapseActive,
      selectedPerson,
      previewImage,
      previewVisible,
      previewTitle,
    } = this.state
    const { people } = this.props
    return (
      <div>
        {people !== undefined && people.length > 0 ? (
          people.map(person => {
            const docType = this.documentName(person?.documentType)
            return (
              <Collapse
                key={person.email}
                expandIcon={() => (
                  <Button
                    type="link"
                    className={styles.btn_show_hide_txt}
                    onClick={() => this.handleCollapse(person)}
                  >
                    {isCollapseActive && selectedPerson.email === person.email
                      ? 'See less'
                      : 'See more'}
                  </Button>
                )}
                expandIconPosition="right"
                onChange={e => this.handleonChangeCollapse(e)}
                className="mb-4"
              >
                <Panel
                  header={this.panelHeadTitle(person)}
                  className="test-cace"
                  // extra={this.genExtra()}
                >
                  {person.registeredAddress !== undefined && person.registeredAddress && (
                    <Row>
                      <Col lg={{ span: 24 }}>
                        <EnvironmentOutlined style={{ marginRight: '10px' }} />
                        {this.fieldValidation('string', person.registeredAddress.buildingNumber)},
                        &nbsp;
                        {this.fieldValidation('string', person.registeredAddress.buildingName)}
                        ,&nbsp;
                        {this.fieldValidation('string', person.registeredAddress.floor)},&nbsp;
                        {this.fieldValidation('string', person.registeredAddress.room)},&nbsp;
                        {this.fieldValidation('string', person.registeredAddress.street)},&nbsp;
                        {this.fieldValidation('string', person.registeredAddress.city)},&nbsp;
                        {this.fieldValidation('string', person.registeredAddress.postCode)},&nbsp;
                        {this.fieldValidation('string', person.registeredAddress.postBox)}
                        ,&nbsp;
                        {this.fieldValidation('string', person.registeredAddress.country)}{' '}
                        <Divider type="vertical" />
                        {this.fieldValidation('string', person.dateOfBirth)}
                      </Col>
                    </Row>
                  )}
                  {person?.documentType && (
                    <div style={{ marginTop: '20px' }}>
                      <Text size="large-bold">IDV Screening Documents</Text>
                      <Spacer height="8px" />
                      {person?.frontPageOfDocument && person?.documentType === 'passport' && (
                        <DocumentCard
                          title="Passport"
                          fileName={person?.frontPageOfDocument}
                          handleFileDownload={() => this.handleFileDownload(person, 'passport')}
                          handleFilePreview={() => this.handleFilePreview(person, 'passport')}
                        />
                      )}
                      {person?.frontPageOfDocument && (
                        <DocumentCard
                          title={`Front Page Of ${docType}`}
                          fileName={person?.frontPageOfDocument}
                          handleFileDownload={() => this.handleFileDownload(person, 'frontPage')}
                          handleFilePreview={() => this.handleFilePreview(person, 'frontPage')}
                        />
                      )}
                      {person?.backPageOfDocument && (
                        <DocumentCard
                          title={`Back Page Of ${docType}`}
                          fileName={person?.backPageOfDocument}
                          handleFileDownload={() => this.handleFileDownload(person, 'backPage')}
                          handleFilePreview={() => this.handleFilePreview(person, 'backPage')}
                        />
                      )}
                      {person?.selfie && (
                        <DocumentCard
                          title="Selfie"
                          fileName={person?.selfie}
                          handleFileDownload={() => this.handleFileDownload(person, 'selfie')}
                          handleFilePreview={() => this.handleFilePreview(person, 'selfie')}
                        />
                      )}
                    </div>
                  )}
                </Panel>
              </Collapse>
            )
          })
        ) : (
          <div style={{ height: '100px' }}>
            <Empty style={{ height: '20px' }} description="No available records!" />
          </div>
        )}
        <Modal
          width={900}
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          {previewImage && <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />}
        </Modal>
      </div>
    )
  }
}

export default RiskInformationPeople
