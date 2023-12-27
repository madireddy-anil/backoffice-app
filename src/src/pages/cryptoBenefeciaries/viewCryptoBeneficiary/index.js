import React, { Component } from 'react'
import { Form, Card, Button, Row, Col } from 'antd'
import { connect } from 'react-redux'
import {
  getCryptoBeneficiaryById,
  getFormatedCryptoBeneficiary,
} from '../../../redux/cryptoBeneficiary/actions'

import jsondata from '../data.json'

import styles from '../style.module.scss'

const mapStateToProps = ({ cryptoBeneficiary, user }) => ({
  cryptoBeneficiary: cryptoBeneficiary.cryptoBeneficiary,
  formatedCryptoBeneficiary: cryptoBeneficiary.formatedCryptoBeneficiary,
  token: user.token,
  isCryptoBeneficiaryFetched: cryptoBeneficiary.isCryptoBeneficiaryFetched,
  appliedFilters: cryptoBeneficiary.appliedCryptoBeneficiaryFilters,
})

@Form.create()
@connect(mapStateToProps)
class ViewCryptoBeneficiary extends Component {
  componentDidMount = () => {
    const { location, dispatch, token } = this.props
    const splitRes = location.pathname.split('/')
    const id = splitRes[2]
    dispatch(getCryptoBeneficiaryById(id, token))
  }

  componentDidUpdate(prevProps) {
    const { isCryptoBeneficiaryFetched } = this.props
    if (
      prevProps.isCryptoBeneficiaryFetched !== isCryptoBeneficiaryFetched &&
      isCryptoBeneficiaryFetched !== false
    ) {
      this.localCryptoBeneficiarySummary()
    }
  }

  localCryptoBeneficiarySummary = () => {
    const { cryptoBeneficiary, dispatch, appliedFilters } = this.props
    const formatedData = []
    jsondata.localCryptoBneficiaryMapper.forEach(item => {
      Object.entries(cryptoBeneficiary).map(([key, value]) => {
        if (item.fieldName === key) {
          if (item.fieldName === 'comments') {
            if (appliedFilters.selectedRecordComment !== '') {
              const formatData = {
                fieldName: item.labelName,
                schemaName: key,
                input: item.inputType,
                value,
              }
              formatedData.push(formatData)
            }
          } else {
            let recordValue = value
            if (item.fieldName === 'beneStatus') {
              recordValue = value === 'active' ? 'Active' : 'Inactive'
            }
            const formatData = {
              fieldName: item.labelName,
              schemaName: key,
              input: item.inputType,
              value: recordValue,
            }
            formatedData.push(formatData)
          }
        }
        return formatedData
      })
    })
    dispatch(getFormatedCryptoBeneficiary(formatedData))
  }

  ViewCryptoBeneficiary = () => {
    const { formatedCryptoBeneficiary } = this.props

    const empty = '---'

    return (
      <div className={styles.modalCardScroll}>
        <div className={styles.formModalBox}>
          <div className="row">
            {formatedCryptoBeneficiary.length > 0 &&
              formatedCryptoBeneficiary.map(item => {
                return (
                  <div key={item.schemaName} className="col-lg-4 mt-4">
                    <strong className="font-size-15">{item.fieldName}</strong>
                    <div className={`${styles.inputBox}`}>
                      <div className={`${styles.fontSize15}`}>
                        {item.value ? item.value : empty}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    )
  }

  navigateToEditCryptoBeneficiary = record => {
    const { id } = record
    const { history } = this.props
    history.push(`/edit-cryptoBeneficiary/${id}`)
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/cryptoBeneficiaries')
  }

  render() {
    const { cryptoBeneficiary } = this.props
    return (
      <Card
        title="View Crypto Beneficiary"
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
              onClick={() => this.navigateToEditCryptoBeneficiary(cryptoBeneficiary)}
            >
              Edit
            </Button>
            <Button type="link" onClick={this.onBackButtonHandler}>
              Back
            </Button>
          </>
        }
      >
        <Row>
          <Col className="p-2">{this.ViewCryptoBeneficiary()}</Col>
        </Row>
      </Card>
    )
  }
}

export default ViewCryptoBeneficiary
