import React, { Component } from 'react'
import { Form, Modal } from 'antd'
import { connect } from 'react-redux'

import { updateClientManagement } from 'redux/clientManagement/actions'

import DynamicForm from 'components/customComponents/Form'
import { sortTable } from 'utilities/transformer'

import jsondata from './data.json'

const { confirm } = Modal

const mapStateToProps = ({ user, general, clientManagement }) => ({
  token: user.token,
  loading: clientManagement.loading,
  id: clientManagement.entityId,
  countries: general.countries,
  basicCompanyInfo: clientManagement.basicCompanyInfo,
  isClientInformationFetched: clientManagement.isClientInformationFetched,
  selectedIndustryInfo: clientManagement.selectedIndustryInfo,
})
@Form.create()
@connect(mapStateToProps)
class EditCompanyInfo extends Component {
  state = {
    viewForm: true,
  }

  getCountriesList = () => {
    const { countries } = this.props
    const countriesNames = []
    countries.map(country => {
      const transformData = {
        id: country.id,
        label: country.name,
        value: country.name,
      }
      countriesNames.push(transformData)
      return countriesNames
    })
    countriesNames.sort(sortTable)
    return countriesNames
  }

  onPopUpMessage = e => {
    e.preventDefault()
    const insidethis = this
    confirm({
      title: 'Are you sure Save?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        insidethis.handleUpdateCompanyInfo(e)
      },
      onCancel() {},
    })
  }

  handleUpdateCompanyInfo = event => {
    event.preventDefault()
    const {
      form,
      dispatch,
      id,
      token,
      basicCompanyInfo: { companyIncorporation },
    } = this.props

    // conflicts
    const filterAddress =
      companyIncorporation.length > 0 &&
      companyIncorporation.find(addreesType => addreesType.type === 'registered')

    form.validateFields((error, values) => {
      if (!error) {
        const allIndustries = []
        const addresses = []
        if (values.industry === 'forex') {
          const forexIndstry = {
            industryType: 'forex',
            subType: values.subType,
            comment: values.otherForex && values.otherForex,
          }
          allIndustries.push(forexIndstry)
        }
        if (values.industry === 'gambling') {
          const gamingIndstry = {
            industryType: 'gambling',
            subType: values.subType,
            comment: values.otherGaming && values.otherGaming,
          }
          allIndustries.push(gamingIndstry)
        }
        if (values.industry === 'other') {
          const otherIndstry = {
            industryType: 'other',
            comment: values.otherIndustry && values.otherIndustry,
          }
          allIndustries.push(otherIndstry)
        }
        if (filterAddress !== undefined) {
          if (!filterAddress) {
            addresses.push({ country: values.country, type: 'registered' })
          } else {
            filterAddress.country = values.country
            addresses.push(filterAddress)
          }
        }
        const genericInformation = {
          companyNumber: values.companyNumber,
          tradingName: values.tradingName,
          industries: allIndustries,
          tier: values.tier,
          addresses,
        }
        dispatch(updateClientManagement(id, { genericInformation }, token))
      }
    })
  }

  handleSelectedIndustry = data => {
    const { form, dispatch, selectedIndustryInfo } = this.props
    if (data === 'forex' || data === 'gambling') {
      dispatch({
        type: 'UPDATE_SELECTED_INDUSTRY_INFORMATION',
        value: {
          industryName: data,
          industrySubTypes: [],
          isIndustryOther: false,
        },
      })
    }
    if (data === 'other') {
      dispatch({
        type: 'UPDATE_SELECTED_INDUSTRY_INFORMATION',
        value: {
          industryName: data,
          industrySubTypes: selectedIndustryInfo.industrySubTypes,
          isIndustryOther: true,
        },
      })
    }
    form.setFieldsValue({
      subType: undefined,
    })
  }

  handleSelectedOtherSubType = data => {
    const { dispatch, selectedIndustryInfo } = this.props
    dispatch({
      type: 'UPDATE_SELECTED_INDUSTRY_INFORMATION',
      value: {
        industryName: selectedIndustryInfo.industryName,
        industrySubTypes: data,
        isIndustryOther: selectedIndustryInfo.isIndustryOther,
      },
    })
  }

  render() {
    const { viewForm } = this.state
    const {
      form,
      basicCompanyInfo: { tradingName, companyNumber, companyIncorporation, industry, tier },
      closeModalPopup,
      loading,
      selectedIndustryInfo: { industryName, industrySubTypes, isIndustryOther },
    } = this.props
    const { industryType, forexList, gamingList, tierList } = jsondata
    const industrySelected = industry !== undefined && industry.length > 0 && industry[0]
    return (
      <React.Fragment>
        <DynamicForm
          formData={[
            {
              id: 0,
              label: 'Trading Name',
              fieldName: 'tradingName',
              inputType: 'input',
              required: true,
              initialValue: !tradingName ? '' : tradingName,
            },
            {
              id: 1,
              label: 'Company Number',
              fieldName: 'companyNumber',
              inputType: 'input',
              required: true,
              initialValue: !companyNumber ? '' : companyNumber,
            },
            {
              id: 2,
              label: 'Company Incorporation',
              fieldName: 'country',
              inputType: 'select',
              required: true,
              data: this.getCountriesList(),
              initialValue:
                companyIncorporation.length > 0 && companyIncorporation !== undefined
                  ? companyIncorporation[0].country
                  : '',
            },
            {
              id: 3,
              label: 'Industry',
              fieldName: 'industry',
              inputType: 'select',
              required: true,
              initialValue: industrySelected ? industrySelected.industryType : '',
              data: industryType,
              selectOnChange: this.handleSelectedIndustry,
            },
            !isIndustryOther
              ? {
                  id: 4,
                  label: 'Industry SubType',
                  fieldName: 'subType',
                  inputType: 'select',
                  mode: 'multiple',
                  required: true,
                  initialValue: industrySelected && industrySelected.subType,
                  data: industryName === 'forex' ? forexList : gamingList,
                  selectOnChange: this.handleSelectedOtherSubType,
                }
              : { id: 4 },

            isIndustryOther
              ? {
                  id: 5,
                  label: 'Other Industry',
                  fieldName: 'otherIndustry',
                  inputType: 'input',
                  required: true,
                  initialValue:
                    industrySelected.comment !== undefined ? industrySelected.comment : '',
                }
              : { id: 5 },
            industrySubTypes !== undefined &&
            industrySubTypes &&
            industryName === 'other' &&
            industrySubTypes.includes('other')
              ? {
                  id: 6,
                  label: 'Other',
                  fieldName: 'otherIndustry',
                  inputType: 'input',
                  required: true,
                  initialValue: industrySelected.comment,
                }
              : { id: 6 },
            industrySubTypes !== undefined &&
            industrySubTypes &&
            industrySubTypes.includes('other') &&
            industryName === 'forex'
              ? {
                  id: 7,
                  label: 'Other',
                  fieldName: 'otherForex',
                  inputType: 'input',
                  required: true,
                  initialValue: industrySelected.comment,
                }
              : { id: 7 },
            industrySubTypes !== undefined &&
            industrySubTypes &&
            industrySubTypes.includes('other') &&
            industryName === 'gambling'
              ? {
                  id: 8,
                  label: 'Other',
                  fieldName: 'otherGaming',
                  inputType: 'input',
                  required: true,
                  initialValue: industrySelected.comment,
                }
              : { id: 8 },
            {
              id: 9,
              label: 'Tier',
              fieldName: 'tier',
              inputType: 'select',
              required: true,
              data: tierList,
              initialValue: !tier ? '' : tier,
            },
          ]}
          formProps={form}
          viewForm={viewForm}
          mainLoader={false}
          loader={loading}
          handelCancel={closeModalPopup}
          onSubmitForm={this.onPopUpMessage}
        />
      </React.Fragment>
    )
  }
}

export default EditCompanyInfo
