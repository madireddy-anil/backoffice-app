import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Row, Col, Form, Select, DatePicker, Input } from 'antd'
import DynamicCollapse from 'components/customComponents/Collapse'
import Text from 'components/customComponents/Text'
import Modal from 'components/customComponents/Modal'
import moment from 'moment'
import _ from 'lodash'
import styles from './style.module.scss'

const mapStateToProps = ({ user, clientManagement }) => ({
  token: user.token,
  id: clientManagement.entityId,
  loading: clientManagement.loading,
  isClientManagementFetched: clientManagement.isClientManagementFetched,
  currentKycStatus: clientManagement.kycStatus,
})

const { Option } = Select
const { TextArea } = Input

@Form.create()
@connect(mapStateToProps)
class ApplicationApproval extends Component {
  state = {
    isCollapseActive: false,
    viewModal: false,
    modalContext: '',
    selectedKycStatus: '',
    didDateSelected: false,
  }

  panelTitle = (
    <div className={styles.panel__header}>
      <Text size="default">Application Approval / Rejection</Text>
    </div>
  )

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isClientFetched) {
      this.getClientManagementList()
    }
  }

  getClientManagementList = () => {
    this.setState({ viewModal: false })
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isClientManagementFetched } = this.props
    const isPropsUpdated = {
      isClientFetched: prevProps.isClientManagementFetched !== isClientManagementFetched,
    }
    return isPropsUpdated
  }

  handleApplicationRejection = () => {
    const { dispatch, id, token } = this.props
    const status = { kycStatus: 'fail' }
    dispatch({
      type: 'UPDATE_OVERALL_APPLICATION_STATUS',
      entityId: id,
      value: status,
      token,
    })
  }

  handleShowModal = () => {
    this.setState({
      viewModal: true,
    })
  }

  handleRejectApplication = () => {
    this.setState({
      viewModal: true,
    })
  }

  handleCloseModal = () => {
    this.setState({
      viewModal: false,
    })
  }

  getModalContext = () => {
    const { modalContext } = this.state

    if (modalContext === 'updateKycStatus') {
      return this.getUpdateKycStatus()
    }
    if (modalContext === 'KycRefreshDate') {
      return this.getKycRefreshDate()
    }
    return this.getKycRefreshDate()
  }

  getKycRefreshDate = () => {
    const { form } = this.props

    const { selectedKycStatus } = this.state

    const kycStatus = ['pass', 'fail'].map(item => (
      <Option key={item} value={item} label={_.startCase(_.camelCase(item))}>
        <h5 key={item}>{_.startCase(_.camelCase(item))}</h5>
      </Option>
    ))

    const booleanOptions = ['true', 'false'].map(item => (
      <Option key={item} value={item} label={_.startCase(_.camelCase(item))}>
        <h5 key={item}>{_.startCase(_.camelCase(item))}</h5>
      </Option>
    ))

    return (
      <Form onSubmit={this.handleKycRefreshDateSubmit}>
        <div
          className="row d-flex justify-content-between ml-2 mr-3"
          style={{
            marginTop: '20px',
          }}
        >
          <Form.Item label="Kyc Status" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('kycRefreshResult', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Select Kyc Status"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
                onChange={evt => {
                  this.setState({
                    selectedKycStatus: evt,
                  })
                }}
              >
                {kycStatus}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Kyc Refresh Comments" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('kycRefreshComments', {
              rules: [
                {
                  required: true,
                  message: `Please Enter Kyc Refresh Comments`,
                },
              ],
            })(
              <TextArea
                allowClear
                placeholder="Enter Kyc Refresh Comments"
                style={{
                  width: '250px',
                  minHeight: '30px',
                }}
                autoSize={{ minRows: 1 }}
              />,
            )}
          </Form.Item>
        </div>
        <div className="row d-flex justify-content-between ml-2 mr-3 mb-2">
          <Form.Item label="Is Expected Changes In Comment" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('isExpectedChangesInComment', {
              rules: [
                {
                  required: true,
                  message: `Please Enter Is Expected Changes In Comment `,
                },
              ],
            })(
              <TextArea
                allowClear
                placeholder="Expected Changes In Comment"
                style={{
                  width: '250px',
                  minHeight: '30px',
                }}
                autoSize={{ minRows: 1 }}
              />,
            )}
          </Form.Item>
          <Form.Item label="Is Change Of Name" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('isChangeOfName', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Is Change Of Name"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="row d-flex justify-content-between ml-2 mr-3 mb-3">
          <Form.Item label="Is Change To Directorship" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('isChangeToDirectorship', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Is Change To Directorship"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Is Change To Shareholders" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('isChangeToShareholders', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Is Change To Shareholders"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="row d-flex justify-content-between ml-2 mr-3 mb-3">
          <Form.Item
            label="Is Change To Registered Address"
            className={styles.clear__bottom_margin}
          >
            {form.getFieldDecorator('isChangeToRegisteredAddress', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Is Change To Registered Address"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Is Under Investigation" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('isUnderInvestigation', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Is Under Investigation"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="row d-flex justify-content-between ml-2 mr-3">
          <Form.Item label="Regulatory Licenses Comment" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('regulatoryLicensesComment', {
              rules: [
                {
                  required: true,
                  message: `Please Enter Regulatory Licenses Comment`,
                },
              ],
            })(
              <TextArea
                allowClear
                placeholder="Enter Regulatory Licenses Comment"
                style={{
                  width: '250px',
                  minHeight: '30px',
                }}
                autoSize={{ minRows: 1 }}
              />,
            )}
          </Form.Item>
          <Form.Item
            label="Overview Of Business Model Comment"
            className={styles.clear__bottom_margin}
          >
            {form.getFieldDecorator('overviewOfBusinessModelComment', {
              rules: [
                {
                  required: true,
                  message: `Please Enter Overview Of Business Model Comment`,
                },
              ],
            })(
              <TextArea
                allowClear
                placeholder="Enter Overview Of Business Model Comment"
                style={{
                  width: '250px',
                  minHeight: '30px',
                }}
                autoSize={{ minRows: 1 }}
              />,
            )}
          </Form.Item>
        </div>
        <div className="row d-flex justify-content-between ml-2 mr-3">
          <Form.Item label="Target Clients Comment" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('targetClientsComment', {
              rules: [
                {
                  required: true,
                  message: `Please Enter Target Clients Comment`,
                },
              ],
            })(
              <TextArea
                allowClear
                placeholder="Enter Target Clients Comment"
                style={{
                  width: '250px',
                  minHeight: '30px',
                }}
                autoSize={{ minRows: 1 }}
              />,
            )}
          </Form.Item>
          <Form.Item label="Trading Brands Comment" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('tradingBrandsComment', {
              rules: [
                {
                  required: true,
                  message: `Please Enter Trading Brands Comment  `,
                },
              ],
            })(
              <TextArea
                allowClear
                placeholder="Enter Trading Brands Comment"
                style={{
                  width: '250px',
                  minHeight: '30px',
                }}
                autoSize={{ minRows: 1 }}
              />,
            )}
          </Form.Item>
        </div>
        <div className="row d-flex justify-content-between ml-2 mr-3 mb-3">
          <Form.Item label="Is Change In Policies" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('isChangeInPolicies', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Is Change In Policies"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Has Filled Out Report" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('hasFilledOutReport', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Has Filled Out Report"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="row d-flex justify-content-between ml-2 mr-3 mb-3">
          <Form.Item label="Has Been Audited" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('hasBeenAudited', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Has Been Audited"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Is Expected Changes" className={styles.clear__bottom_margin}>
            {form.getFieldDecorator('isExpectedChanges', {
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Is Expected Changes"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
              >
                {booleanOptions}
              </Select>,
            )}
          </Form.Item>
        </div>
        <div className="row d-flex justify-content-between ml-2 mr-3 mb-3">
          {selectedKycStatus === 'pass' && (
            <Form.Item label="Next Kyc Refresh Date">
              {form.getFieldDecorator('nextKycRefreshDate', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: `Please pick a date`,
                  },
                ],
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{
                    width: '250px',
                  }}
                  disabledDate={current => {
                    return current && current.valueOf() < moment().add(-1, 'days')
                  }}
                />,
              )}
            </Form.Item>
          )}
        </div>
        <div>
          <Button
            type="ghost"
            onClick={() => {
              this.setState({
                viewModal: false,
                modalContext: '',
              })
            }}
            className="ml-2"
          >
            Cancel
          </Button>
          <Button htmlType="submit" type="primary" className="ml-3">
            Submit
          </Button>
        </div>
      </Form>
    )
  }

  getUpdateKycStatus = () => {
    const { form } = this.props

    const { selectedKycStatus, didDateSelected } = this.state

    const kycStatus = ['fail', 'new', 'pass', 'pending', 'review_required'].map(item => (
      <Option key={item} value={item} label={_.startCase(_.camelCase(item))}>
        <h5 key={item}>{_.startCase(_.camelCase(item))}</h5>
      </Option>
    ))

    return (
      <Form onSubmit={this.handleUpdateKycStatusSubmit}>
        <div
          className="row d-flex justify-content-between ml-2 mr-3"
          style={{
            marginTop: '20px',
          }}
        >
          <Form.Item label="Kyc Status">
            {form.getFieldDecorator('kycStatus', {
              initialValue: undefined,
              rules: [
                {
                  required: true,
                  message: `Please select a value from dropdown`,
                },
              ],
            })(
              <Select
                showSearch
                placeholder="Select Kyc Status"
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{
                  width: '250px',
                }}
                onChange={evt => {
                  this.setState({
                    selectedKycStatus: evt,
                    didDateSelected: evt !== 'pass',
                  })
                }}
              >
                {kycStatus}
              </Select>,
            )}
          </Form.Item>
          {selectedKycStatus === 'pass' && (
            <Form.Item label="Next Kyc Refresh Date">
              {form.getFieldDecorator('nextKycRefreshDate', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: `Please pick a date`,
                  },
                ],
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{
                    width: '250px',
                  }}
                  disabledDate={current => {
                    return current && current.valueOf() < moment().add(-1, 'days')
                  }}
                  onChange={evt => {
                    this.setState({
                      didDateSelected: !!evt,
                    })
                  }}
                />,
              )}
            </Form.Item>
          )}
        </div>
        <div>
          <Button
            type="ghost"
            onClick={() => {
              this.setState({
                viewModal: false,
                modalContext: '',
              })
            }}
            className="ml-2"
          >
            Cancel
          </Button>
          <Button htmlType="submit" disabled={!didDateSelected} type="primary" className="ml-3">
            Submit
          </Button>
        </div>
      </Form>
    )
  }

  toggleModal = modalContextName => {
    this.setState({
      viewModal: true,
      modalContext: modalContextName,
    })
  }

  handleKycRefreshDateSubmit = event => {
    event.preventDefault()

    const { form, id, token, dispatch } = this.props

    form.validateFields((err, value) => {
      if (!err) {
        const values = {
          ...value,
          hasBeenAudited: value.hasBeenAudited === 'true',
          hasFilledOutReport: value.hasFilledOutReport === 'true',
          isChangeInPolicies: value.isChangeInPolicies === 'true',
          isChangeOfName: value.isChangeOfName === 'true',
          isChangeToDirectorship: value.isChangeToDirectorship === 'true',
          isChangeToRegisteredAddress: value.isChangeToRegisteredAddress === 'true',
          isChangeToShareholders: value.isChangeToShareholders === 'true',
          isExpectedChanges: value.isExpectedChanges === 'true',
          isUnderInvestigation: value.isUnderInvestigation === 'true',
          nextKycRefreshDate: value?.nextKycRefreshDate?.format('YYYY-MM-DD'),
        }
        dispatch({
          type: 'UPDATE_KYC_REFRESH_DATE',
          entityId: id,
          value: values,
          token,
        })
      }
      this.setState({
        viewModal: false,
        modalContext: '',
        selectedKycStatus: '',
        didDateSelected: false,
      })
    })
  }

  handleUpdateKycStatusSubmit = event => {
    event.preventDefault()
    const { form, id, token, dispatch } = this.props
    const { selectedKycStatus } = this.state
    form.validateFields((error, value) => {
      if (value.kycStatus && (selectedKycStatus === 'pass' ? value.nextKycRefreshDate : true)) {
        dispatch({
          type: 'UPDATE_OVERALL_APPLICATION_STATUS',
          entityId: id,
          value: {
            kycStatus: value.kycStatus,
            nextKycRefreshDate: value?.nextKycRefreshDate?.format('YYYY-MM-DD'),
          },
          token,
        })
      }
      this.setState({
        viewModal: false,
        modalContext: '',
        selectedKycStatus: '',
      })
      form.resetFields()
    })
  }

  panelSection = () => {
    const { viewModal } = this.state
    const { loading, currentKycStatus } = this.props
    return (
      <>
        <React.Fragment>
          <Modal
            modalType={<div className="ml-2">Application decision</div>}
            modalView={viewModal}
            modalWidth={600}
            modalDescription={this.getModalContext()}
            className="rejectDocModule"
          />
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginTop: '40px', marginBottom: '30px' }}>
              <Button
                loading={loading}
                shape="round"
                className="cc-btn-save"
                htmlType="submit"
                onClick={() => this.toggleModal('updateKycStatus')}
              >
                <span className="btnSubmit">Update Kyc Status</span>
              </Button>
              <Button
                loading={loading}
                shape="round"
                className="cc-btn-save ml-4"
                htmlType="submit"
                onClick={() => this.toggleModal('KycRefreshDate')}
                disabled={currentKycStatus !== 'review_required'}
              >
                <span className="btnSubmit">Kyc Refresh Date</span>
              </Button>
            </Col>
          </Row>
        </React.Fragment>
      </>
    )
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
            panelData={this.panelSection()}
            openKey="0"
          />
        </div>
      </React.Fragment>
    )
  }
}

export default ApplicationApproval
