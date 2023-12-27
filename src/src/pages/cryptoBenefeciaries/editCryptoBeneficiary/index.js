import React, { Component } from 'react'
import { Form, Card, Button, Row, Col, Select, Input, Divider, Modal, notification } from 'antd'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import {
  updateCryptoBeneficiary,
  getCryptoBeneficiaryById,
} from '../../../redux/cryptoBeneficiary/actions'
import styles from '../style.module.scss'

const { confirm } = Modal
const { Option } = Select
const { TextArea } = Input

const mapStateToProps = ({ general, cryptoBeneficiary, user }) => ({
  vendors: general.newVendors,
  clients: general.clients,
  cryptoBeneficiary: cryptoBeneficiary.cryptoBeneficiary,
  formatedCryptoBeneficiary: cryptoBeneficiary.formatedCryptoBeneficiary,
  token: user.token,
  appliedFilters: cryptoBeneficiary.appliedCryptoBeneficiaryFilters,
})

@Form.create()
@connect(mapStateToProps)
class EditCryptoBeneficiary extends Component {
  state = {
    beneStatus: '',
    comments: '',
  }

  componentDidMount = () => {
    const { location, dispatch, token, appliedFilters } = this.props
    const splitRes = location.pathname.split('/')
    const id = splitRes[2]
    dispatch(getCryptoBeneficiaryById(id, token))
    this.setState({
      beneStatus: appliedFilters.selectedRecordBeneStatus,
      comments: appliedFilters.selectedRecordComment,
    })
  }

  onPopUpMessage = evt => {
    evt.preventDefault()
    const insidethis = this
    confirm({
      title: 'Are you sure Save?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        insidethis.handleUpdateCryptoBeneficiary(evt)
      },
      onCancel() {},
    })
  }

  handleUpdateCryptoBeneficiary = event => {
    event.preventDefault()
    const { form, dispatch, cryptoBeneficiary, appliedFilters, token } = this.props
    const { id } = cryptoBeneficiary
    const Id = { id }

    const { beneStatus, comments } = this.state

    form.validateFields((error, values) => {
      if (!error) {
        Object.assign(values, Id)
        if (beneStatus === 'in_active' && comments.trim() === '') {
          notification.warning({
            message: 'Enter a valid reason!',
          })
        } else if (comments.trim() === '' && appliedFilters.selectedRecordComment !== '') {
          notification.warning({
            message: 'Enter a valid reason!',
          })
        } else {
          dispatch(updateCryptoBeneficiary({ ...values, beneStatus, comments }, token))
        }
      }
    })
  }

  editCryptoBeneficiary = () => {
    const { form, cryptoBeneficiary, clients, vendors } = this.props
    const { clientName } = cryptoBeneficiary
    const { vendorName } = cryptoBeneficiary
    const { beneReference } = cryptoBeneficiary
    const { beneStatus } = cryptoBeneficiary
    let currencyOption

    if (clientName !== undefined && clientName !== '') {
      const client = clients.find(el => el.genericInformation.tradingName === clientName)
      currencyOption = client?.profile?.cryptoCurrencyPreferences?.settlementCurrencies?.map(
        settlementCurrency => (
          <Option key={settlementCurrency} label={settlementCurrency}>
            {settlementCurrency}
          </Option>
        ),
      )
    } else if (vendorName !== undefined && vendorName !== '') {
      const vendor = vendors.find(el => el.genericInformation?.tradingName === vendorName)
      currencyOption = vendor?.profile?.cryptoCurrencyPreferences?.settlementCurrencies?.map(
        settlementCurrency => (
          <Option key={settlementCurrency} label={settlementCurrency}>
            {settlementCurrency}
          </Option>
        ),
      )
    }

    return (
      <div>
        <div className={styles.modalCardScroll}>
          <Spacer height="20px" />
          <Form className={styles.formModalBox} onSubmit={this.onPopUpMessage}>
            <div className="row">
              <div className="col-sm-4 col-lg-4">
                <strong className="font-size-15">Beneficiary Reference</strong>
                <Spacer height="14px" />
                <span className="font-size-13">{beneReference}</span>
                <Spacer height="14px" />
              </div>
              <div className="col-sm-4 col-lg-4">
                <strong className="font-size-15">Beneficiary Status</strong>
                <Spacer height="14px" />
                <span className="font-size-13">{beneStatus}</span>
                <Spacer height="14px" />
              </div>
              {clientName !== undefined ? (
                <div className="col-sm-4 col-lg-4">
                  <strong className="font-size-15">Client Name</strong>
                  <Spacer height="14px" />
                  <span className="font-size-13">{clientName}</span>
                  <Spacer height="14px" />
                </div>
              ) : (
                <div className="col-sm-4 col-lg-4">
                  <strong className="font-size-15">Vendor Name</strong>
                  <Spacer height="14px" />
                  <span className="font-size-13">{vendorName}</span>
                  <Spacer height="14px" />
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-sm-4 col-lg-4">
                <strong className="font-size-15">Crypto Currency</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('cryptoCurrency', {
                    initialValue: cryptoBeneficiary.cryptoCurrency,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Account Currency`,
                      },
                    ],
                  })(
                    <Select style={{ width: '100%' }} className={styles.cstmSelectInput}>
                      {currencyOption}
                    </Select>,
                  )}
                </Form.Item>
              </div>

              <div className="col-sm-4 col-lg-4">
                <strong className="font-size-15">Crypto Wallet Address</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('cryptoWalletAddress', {
                    initialValue: cryptoBeneficiary.cryptoWalletAddress,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Crypto Wallet Address`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
              <div className="col-sm-4 col-lg-4">
                <strong className="font-size-15">Alias Name</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {form.getFieldDecorator('aliasName', {
                    initialValue: cryptoBeneficiary.aliasName,
                    rules: [
                      {
                        required: false,
                        message: `Please enter Alias Name`,
                      },
                    ],
                  })(<Input style={{ width: '100%' }} size="large" className={styles.inputbox} />)}
                </Form.Item>
              </div>
              <div className="col-sm-4 col-lg-4">{this.getBeneStatus()}</div>
            </div>
            <Divider />
            <Button type="primary" className={styles.btnCheckoutSAVE} htmlType="submit">
              SAVE
            </Button>
          </Form>
        </div>
      </div>
    )
  }

  getBeneStatus = () => {
    const { beneStatus } = this.state

    const { appliedFilters } = this.props

    return (
      <>
        <p className={styles.beneTitle}>Status : </p>
        <Select
          value={beneStatus}
          style={{ width: '100%', marginBottom: '30px' }}
          onChange={evt => {
            this.setState({ beneStatus: evt })
          }}
          showSearch
          placeholder="Select Beneficiary Status"
        >
          <Option value="active" key="Active">
            Active
          </Option>
          <Option value="in_active" key="Inactive">
            Inactive
          </Option>
        </Select>
        {(appliedFilters.selectedRecordComment !== '' || beneStatus === 'in_active') && (
          <>
            <h5>
              Reason<span style={{ color: 'red', fontSize: '1.5rem' }}>*</span> :{' '}
            </h5>
            <TextArea
              defaultValue={appliedFilters.selectedRecordComment}
              onChange={evt => {
                this.setState({ comments: evt.target.value })
              }}
            />
          </>
        )}
      </>
    )
  }

  navigateToViewCryptoBneficiary = record => {
    const { id } = record
    const { history } = this.props
    history.push(`/view-cryptoBeneficiary/${id}`)
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/cryptoBeneficiaries')
  }

  render() {
    const { cryptoBeneficiary } = this.props

    return (
      <Card
        title="Edit Crypto Beneficiary"
        bordered={false}
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
        extra={
          <>
            <Button
              type="link"
              className="pr-3"
              onClick={() => this.navigateToViewCryptoBneficiary(cryptoBeneficiary)}
            >
              View
            </Button>
            <Button type="link" onClick={this.onBackButtonHandler}>
              Back
            </Button>
          </>
        }
      >
        <Row>
          <Col className="p-2">{this.editCryptoBeneficiary()}</Col>
        </Row>
      </Card>
    )
  }
}

export default EditCryptoBeneficiary
