import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, Divider, Button, Tag } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import DynamicCollapse from 'components/customComponents/Collapse'
import Text from 'components/customComponents/Text'
import Spacer from 'components/customComponents/Spacer'
import { capitalize, validateDataWithNoErrors } from 'utilities/transformer'

import _ from 'lodash'

import styles from './style.module.scss'

const mapStateToProps = ({ clientManagement, general }) => ({
  riskCategory: clientManagement.riskCategory,
  externalScreeningResults: clientManagement.externalScreeningResults,
  kycStatus: clientManagement.kycStatus,
  regulatoryDetails: clientManagement.regulatoryDetails,
  regulatoryLicense: clientManagement.regulatoryLicense,
  basicCompanyInfo: clientManagement.basicCompanyInfo,
  countries: general.countries,
})

@connect(mapStateToProps)
class RiskInformationGeneral extends Component {
  state = {
    isCollapseActive: false,
    visibleTextFlowOfFunds: true,
    visibleTextReasonOfUsingOurService: true,
    textEmpty: '--',
  }

  panelTitle = (
    <div className={styles.panel__header}>
      <Text size="default">Risk information - General</Text>
    </div>
  )

  handleWrapText = () => {
    this.setState(prevState => ({
      visibleTextFlowOfFunds: !prevState.visibleTextFlowOfFunds,
    }))
  }

  handleWrapTextOurService = () => {
    this.setState(prevState => ({
      visibleTextReasonOfUsingOurService: !prevState.visibleTextReasonOfUsingOurService,
    }))
  }

  getLicenseLabelNames = licenseLabel => {
    let returnResp
    switch (licenseLabel) {
      case 'We don’t hold a license':
        returnResp = 'No licence'
        break
      case 'We hold a full license':
        returnResp = 'Full licence'
        break
      case 'We have a license application pending':
        returnResp = 'Application pending'
        break
      case 'We hold a sub-license(s) or an agent license(s)':
        returnResp = 'Sub / Agent licence'
        break
      case 'sub_license':
        returnResp = 'Sub / Agent licence'
        break
      case 'full':
        returnResp = 'Full license'
        break
      case 'pending':
        returnResp = 'Application pending'
        break
      case 'no_licence':
        returnResp = 'No licence'
        break
      default:
        break
    }
    return returnResp
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

  getRegistredAddress = () => {
    const {
      basicCompanyInfo: { companyIncorporation },
    } = this.props
    return (
      <div className="ml-4 mt-3">
        <Text size="xsmall-bold">Registred address</Text>
        {companyIncorporation !== undefined && companyIncorporation.length > 0 && (
          <Row className="mt-3">
            <Col lg={{ span: 24 }}>
              <EnvironmentOutlined style={{ marginRight: '10px' }} />
              {this.fieldValidation('string', companyIncorporation[0].buildingNumber)},&nbsp;
              {this.fieldValidation('string', companyIncorporation[0].street)},&nbsp;
              {this.fieldValidation('string', companyIncorporation[0].floor)},&nbsp;
              {this.fieldValidation('string', companyIncorporation[0].room)},&nbsp;
              {this.fieldValidation('string', companyIncorporation[0].postBox)},&nbsp;
              {this.fieldValidation('string', companyIncorporation[0].postCode)},&nbsp;
              {this.fieldValidation('string', companyIncorporation[0].city)},&nbsp;
              {this.fieldValidation('string', companyIncorporation[0].country)}
            </Col>
          </Row>
        )}
      </div>
    )
  }

  getRegulatoryReasonForUsingOurService = () => {
    const { regulatoryDetails } = this.props
    const { visibleTextReasonOfUsingOurService } = this.state
    return (
      <Row>
        <Col lg={{ span: 24 }}>
          {validateDataWithNoErrors(regulatoryDetails.reasonForUsingOurServices, 'string') ? (
            <Text size="xsmall-bold">
              <div className="d-flex flex-row">
                <div
                  className={visibleTextReasonOfUsingOurService ? styles.text_wrap_text_less : ''}
                >
                  {validateDataWithNoErrors(regulatoryDetails.reasonForUsingOurServices, 'string')}
                </div>
                <Button
                  type="link"
                  style={{ fontWeight: 600, marginTop: '-6px' }}
                  onClick={this.handleWrapTextOurService}
                >
                  {visibleTextReasonOfUsingOurService ? 'See more' : 'See less'}
                </Button>
              </div>
            </Text>
          ) : (
            <Text size="xsmall-bold">No content available</Text>
          )}
        </Col>
      </Row>
    )
  }

  getRegulatoryFlowOfFunds = () => {
    const { regulatoryDetails } = this.props
    const { visibleTextFlowOfFunds } = this.state
    return (
      <div>
        <Row className="mt-3">
          <Col lg={{ span: 24 }}>
            <Text>Additional flow of funds information</Text>
            <br />

            {validateDataWithNoErrors(regulatoryDetails.flowOfFundsComment, 'string') ? (
              <Text size="xsmall-bold">
                <div className="d-flex flex-row">
                  <div className={visibleTextFlowOfFunds ? styles.text_wrap_text_less : ''}>
                    {validateDataWithNoErrors(regulatoryDetails.flowOfFundsComment, 'string')}
                  </div>
                  <Button
                    type="link"
                    style={{ fontWeight: 600, marginTop: '-6px' }}
                    onClick={this.handleWrapText}
                  >
                    {visibleTextFlowOfFunds ? 'See more' : 'See less'}
                  </Button>
                </div>
              </Text>
            ) : (
              <Text size="xsmall-bold">No content available</Text>
            )}
          </Col>
        </Row>
      </div>
    )
  }

  getRegulatoryQuesDetails = () => {
    const { regulatoryDetails } = this.props

    const {
      licenses,
      flowOfFundsComment,
      isOperatingInRiskCountries,
      majorityClientBase,
      majorityClientJurisdiction,
      reasonForUsingOurServices,
      transactionMonitor,
    } = regulatoryDetails

    if (licenses === undefined && licenses === null && licenses.length === 0) {
      return <>No Data</>
    }

    if (licenses === undefined && licenses === null && licenses[0]?.licenseType === 'no_licence') {
      return <>No License</>
    }

    return (
      <>
        <div className="row mt-2 mb-2 ">
          <div className="col-6">
            <Text size="xsmall-bold">Is Operating In Risk Countries</Text>
          </div>
          <div className="col-6 d-flex justify-content-end pr-3">
            {isOperatingInRiskCountries ? 'Yes' : 'No'}
          </div>
        </div>
        <div className="row mt-2 mb-2 ">
          <div className="col-6">
            <Text size="xsmall-bold">Transaction Monitor</Text>
          </div>
          <div className="col-6 d-flex justify-content-end pr-3">
            {transactionMonitor ? 'Yes' : 'No'}
          </div>
        </div>
        <div className="row mt-2 mb-2 ">
          <div className="col-6">
            <Text size="xsmall-bold">Flow Of Funds Comment</Text>
          </div>
          <div className="col-6 d-flex justify-content-end pr-3">{flowOfFundsComment ?? '---'}</div>
        </div>
        <div className="row mt-2 mb-2 ">
          <div className="col-6">
            <Text size="xsmall-bold">Reason For Using Our Services</Text>
          </div>
          <div className="col-6 d-flex justify-content-end pr-3">
            {reasonForUsingOurServices ?? '---'}
          </div>
        </div>
        <div className="row mt-2 mb-2 ">
          <div className="col-6">
            <Text size="xsmall-bold">Majority Client Base</Text>
          </div>
          <div className="col-6 d-flex justify-content-end" style={{ paddingRight: 0 }}>
            {majorityClientBase ? this.getLabels(majorityClientBase) : '---'}
          </div>
        </div>
        <div className="row mt-2 mb-2 ">
          <div className="col-6">
            <Text size="xsmall-bold">Majority Client Jurisdiction</Text>
          </div>
          <div className="col-6 d-flex justify-content-end" style={{ paddingRight: 0 }}>
            {majorityClientJurisdiction ? this.getLabels(majorityClientJurisdiction) : '---'}
          </div>
        </div>
      </>
    )
  }

  getLabels = list => {
    return list.map(item => {
      return <Tag color="blue">{_.upperFirst(item)}</Tag>
    })
  }

  getRegulatoryLicenseTypes = () => {
    const { textEmpty } = this.state
    const {
      regulatoryLicense,
      basicCompanyInfo: { industry },
      countries,
    } = this.props

    return regulatoryLicense.map(item => {
      const regulatedCountry = countries.find(
        el => item.regulatedCountry !== undefined && item.regulatedCountry === el.alpha2Code,
      )
      return (
        <Card
          key={item.id}
          style={{ padding: '10px', borderRadius: '7px', marginBottom: '10px', marginTop: '10px' }}
        >
          <Row className="mt-3 mb-3">
            <Col lg={{ span: 4 }}>
              <Text>License Holder</Text>
              <br />
              <Text size="xsmall-bold">
                {validateDataWithNoErrors(item.licenseHolderName, 'string')
                  ? item.licenseHolderName
                  : textEmpty}
              </Text>
            </Col>
            <Col lg={{ span: 1 }}>
              <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
            </Col>
            <Col lg={{ span: 4 }}>
              <Text>Industry</Text>
              <br />
              <Text size="xsmall-bold">
                {industry.length > 0 ? capitalize(industry[0].industryType) : textEmpty}
              </Text>
            </Col>
            <Col lg={{ span: 1 }}>
              <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
            </Col>
            <Col lg={{ span: 4 }}>
              <Text>Industry Sub-Type</Text>
              <br />
              <Text size="xsmall-bold">
                {industry.length > 0 &&
                  validateDataWithNoErrors(industry[0].subType, 'array')
                    .map(subType => {
                      const returnResp = !subType ? textEmpty : subType
                      return returnResp
                    })
                    .join('/')}
              </Text>
            </Col>
            <Col lg={{ span: 1 }}>
              <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
            </Col>
            <Col lg={{ span: 4 }}>
              <Text>License Type</Text>
              <br />
              <Text size="xsmall-bold">{this.getLicenseLabelNames(item.licenseType)}</Text>
            </Col>
            <Col lg={{ span: 1 }}>
              <Divider style={{ height: '32px', marginTop: '5px' }} type="vertical" />
            </Col>
            <Col lg={{ span: 4 }}>
              <Text>License Location</Text>
              <br />
              <Text size="xsmall-bold">
                {regulatedCountry !== undefined ? regulatedCountry.name : textEmpty}
              </Text>
            </Col>
          </Row>
        </Card>
      )
    })
  }

  getStatusRiskCategory = status => {
    let returnResp
    switch (status) {
      case 'low':
        returnResp = 'High Risk One'
        break
      case 'high_risk_one':
        returnResp = 'High Risk One'
        break
      case 'medium':
        returnResp = 'High Risk Two'
        break
      case 'high_risk_two':
        returnResp = 'High Risk Two'
        break
      case 'high_risk_three':
        returnResp = 'High Risk Three'
        break
      default:
        break
    }
    return returnResp
  }

  getStatusForExternalStatus = status => {
    let returnResp
    switch (status) {
      case 'in_progress':
        returnResp = 'In Progress'
        break
      case 'pending':
        returnResp = 'pending'
        break
      case 'declined':
        returnResp = 'Declined'
        break
      case 'approved':
        returnResp = 'Approved'
        break
      default:
        break
    }
    return returnResp
  }

  generalQualificationQuestions = () => {
    const { riskCategory, externalScreeningResults, kycStatus } = this.props
    return (
      <div style={{ padding: '30px' }}>
        <Row className="mb-4">
          <Col lg={{ span: 8 }}>
            Risk Category :&nbsp;
            <span className={styles.statusHeader}>{this.getStatusRiskCategory(riskCategory)}</span>
          </Col>
          <Col lg={{ span: 10 }}>
            External Screening Results :&nbsp;
            <span className={styles.statusHeader}>
              {this.getStatusForExternalStatus(externalScreeningResults)}
            </span>
          </Col>
          <Col lg={{ span: 6 }}>
            KYC Status :&nbsp;
            <span className={styles.statusHeader}>{capitalize(kycStatus)}</span>
          </Col>
        </Row>

        {this.getRegulatoryLicenseTypes()}
        {/* {this.getRegulatoryQuesDetails()} */}

        <Card
          style={{ padding: '20px', borderRadius: '7px', marginBottom: '10px', marginTop: '10px' }}
        >
          <Text size="xsmall-bold">General Questions</Text>
          <Spacer height="10px" />
          {this.getRegulatoryQuesDetails()}
        </Card>
        <Card
          style={{ padding: '20px', borderRadius: '7px', marginBottom: '10px', marginTop: '10px' }}
        >
          <Text size="xsmall-bold">The flow of funds</Text>
          <Spacer height="10px" />
          {this.getRegulatoryFlowOfFunds()}
        </Card>
        <Card
          style={{ padding: '20px', borderRadius: '7px', marginBottom: '10px', marginTop: '10px' }}
        >
          <Text size="xsmall-bold">Reason for using our services</Text>
          <Spacer height="10px" />
          {this.getRegulatoryReasonForUsingOurService()}
        </Card>
        {this.getRegistredAddress()}
      </div>
    )
  }

  handleonChangeCollapse = () => {
    // console.log(e)
  }

  render() {
    const { isCollapseActive } = this.state
    return (
      <React.Fragment>
        <div
          className={
            isCollapseActive ? 'collapse__block__active mt-2' : 'collapse__block_inactive mt-2'
          }
        >
          <DynamicCollapse
            panelHeadTitle={this.panelTitle}
            panelData={this.generalQualificationQuestions()}
            handleonChangeCollapse={this.handleonChangeCollapse()}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default RiskInformationGeneral
