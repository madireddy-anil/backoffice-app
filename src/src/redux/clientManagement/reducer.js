import { validateDataWithNoErrors } from 'utilities/transformer'
import actions from './actions'

const initialState = {
  loading: false,
  pagination: {
    current: 1,
    pageSize: 20,
    total: 0,
  },
  clients: [],
  entityId: '',
  selectedAccountDetails: {},
  basicCompanyInfo: {
    registeredCompanyName: '',
    tradingName: '',
    companyNumber: '',
    tier: '',
    companyIncorporation: [],
    industry: [],
  },
  companyWebsites: [],
  productInformation: [],
  riskCategory: '',
  kycStatus: '',
  externalScreeningResults: '',
  isClientManagementUpdated: true,
  isClientManagementFetched: true,
  isDocumentsUpdated: true,
  payconstructProducts: {},
  selectedPayconstructProducts: [],
  isProductsFetched: false,

  selectedIndustryInfo: {},

  // operational Information
  operationalInformation: {},
  ecommercePayment: {
    deposits_payins: [],
    payouts: [],
  },
  exoticFX: [],
  foreignExchange: [],
  globalAccounts: {
    inbound: [],
    outbound: [],
  },

  rcMarkets: [],
  rcBeneficiaries: [],

  isExternalClient: false,

  // documents
  loaderDelete: false,
  isUploadFileProgressBarEnabled: false,
  uploadFilLoader: false,
  uploadFilePercent: 10,
  selectedDocumentFiles: [],
  requiredDocumentsList: [
    {
      label: 'Regulatory License',
      maxLimit: 1,
      minLimit: 1,
      name: 'regulatory_license',
      toolTip: 'Registred company licence',
    },
  ],

  // stakeholders
  people: [],

  // regulatory information
  regulatoryLicense: [],
  regulatoryDetails: {},

  // terms of service
  termsOfService: {},

  // Preview URL and File Object
  originFileObj: {},
  previewURL: '',
  originFileObjForStakeholder: {},
  previewStakeholderURL: '',
}

export default function currencyReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_CLIENT_MANAGEMENT_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    case actions.GET_CLIENT_MANAGEMENT:
      return {
        ...state,
        loading: true,
        pagination: {
          ...state.pagination,
          current: action.value.page,
        },
      }

    case actions.GET_CLIENT_MANAGEMENT_SUCCESS:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          total: action.totalPages,
        },
        loading: false,
        clients: action.value,
      }

    case actions.GET_CLIENT_MANAGEMENT_FAILURE:
      return {
        ...state,
        loading: false,
      }
    case actions.GET_CLIENT_MANAGEMENT_BY_ID:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_CLIENT_MANAGEMENT_BY_ID_SUCCESS: {
      const { genericInformation } = action.value
      const companyInfo = action.value
      const selectedProducts = []
      if (action.value.requiredProduct !== undefined && action.value.requiredProduct.length > 0) {
        action.value.requiredProduct.map(item => {
          selectedProducts.push(item.productCode)
          return selectedProducts
        })
      }
      return {
        ...state,
        loading: false,

        isClientManagementFetched: !state.isClientManagementFetched,

        selectedIndustryInfo: {
          industryName:
            validateDataWithNoErrors(genericInformation.industries, 'array').length > 0 &&
            genericInformation.industries[0].industryType,
          industrySubTypes:
            validateDataWithNoErrors(genericInformation.industries, 'array').length > 0 &&
            genericInformation.industries[0].subType,
          isIndustryOther:
            validateDataWithNoErrors(genericInformation.industries, 'array').length > 0 &&
            genericInformation.industries[0].industryType === 'other',
        },

        clients: [action.value],
        selectedAccountDetails: action.value,
        entityId: companyInfo.id,
        basicCompanyInfo: {
          registeredCompanyName: validateDataWithNoErrors(
            genericInformation.registeredCompanyName,
            'string',
          ),
          tradingName: validateDataWithNoErrors(genericInformation.tradingName, 'string'),
          companyNumber: validateDataWithNoErrors(genericInformation.companyNumber, 'string'),
          companyIncorporation: validateDataWithNoErrors(genericInformation.addresses, 'array'),
          industry: validateDataWithNoErrors(genericInformation.industries, 'array'),
          tier: validateDataWithNoErrors(genericInformation.tier, 'string'),
        },
        companyWebsites: validateDataWithNoErrors(genericInformation.websiteAddress, 'array'),
        productInformation: validateDataWithNoErrors(action.value.requiredProduct, 'array'),
        riskCategory: validateDataWithNoErrors(companyInfo.riskCategory, 'string'),
        externalScreeningResults: companyInfo.externalScreeningResult,
        selectedPayconstructProducts: selectedProducts,
        operationalInformation: validateDataWithNoErrors(companyInfo.operationsDetails, 'object'),
        kycStatus: validateDataWithNoErrors(companyInfo.kycInformation.kycStatus, 'string'),
        rcMarkets: validateDataWithNoErrors(
          companyInfo.operationsDetails.restrictedCurrency.restrictedCurrencyMarkets,
          'array',
        ),
        rcBeneficiaries: validateDataWithNoErrors(
          companyInfo.operationsDetails.restrictedCurrency.beneficiaries,
          'array',
        ),
        regulatoryLicense: validateDataWithNoErrors(
          companyInfo.regulatoryDetails.licenses,
          'array',
        ),
        regulatoryDetails: validateDataWithNoErrors(companyInfo.regulatoryDetails, 'object'),

        // terms of Service
        termsOfService: validateDataWithNoErrors(companyInfo.termsOfService, 'object'),

        // e commerce
        ecommercePayment: {
          deposits_payins: validateDataWithNoErrors(
            action.value?.operationsDetails?.ecommercePayments?.deposits_payins,
            'array',
          ),
          payouts: validateDataWithNoErrors(
            action.value?.operationsDetails?.ecommercePayments?.payouts,
            'array',
          ),
        },

        // exotic fx
        exoticFX: validateDataWithNoErrors(
          action.value?.operationsDetails?.exoticFx?.exoticFxCurrencyPairs,
          'array',
        ),

        // foreign exchange
        foreignExchange: validateDataWithNoErrors(
          action.value?.operationsDetails?.fx?.fxCurrencyPairs,
          'array',
        ),

        // global accounst
        globalAccounts: {
          inbound: validateDataWithNoErrors(
            action.value?.operationsDetails?.globalAccounts?.inbound,
            'array',
          ),
          outbound: validateDataWithNoErrors(
            action.value?.operationsDetails?.globalAccounts?.outbound,
            'array',
          ),
        },
      }
    }
    case actions.UPDATE_SELECTED_INDUSTRY_INFORMATION:
      return {
        ...state,
        selectedIndustryInfo: action.value,
      }

    case actions.GET_CLIENT_MANAGEMENT_BY_ID_FALIURE:
      return {
        ...state,
        loading: false,
      }
    case actions.UPDATE_CLIENT_MANAGEMENT:
      return {
        ...state,
        loading: true,
      }
    case actions.UPDATE_CLIENT_MANAGEMENT_SUCCESS:
      return {
        ...state,
        productInformation: validateDataWithNoErrors(action.value, 'array'),
        loading: false,
        isClientManagementUpdated: !state.isClientManagementUpdated,
      }
    case actions.UPDATE_CLIENT_MANAGEMENT_FALIURE:
      return {
        ...state,
        loading: false,
      }
    case actions.GET_PAYCONSTRUCT_PRODUCTS:
      return {
        ...state,
        loading: true,
      }
    case actions.GET_PAYCONSTRUCT_PRODUCTS_SUCCESS: {
      const filterProducts = (action.value?.brands || []).filter(products =>
        state.isExternalClient === false
          ? products?.clientBrands?.brand === 'payperform'
          : products?.clientBrands?.brand === 'paymero',
      )
      return {
        ...state,
        loading: false,
        payconstructProducts: filterProducts,
        isProductsFetched: !state.isProductsFetched,
      }
    }

    case actions.GET_PAYCONSTRUCT_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
      }

    // documents

    case actions.GET_PRESIGNED_URL: {
      return {
        ...state,
        isUploadFileProgressBarEnabled: true,
        uploadFilePercent: 15,
      }
    }
    case actions.GET_PRESIGNED_URL_SUCCESS: {
      return {
        ...state,
        uploadFilePercent: 25,
      }
    }
    case actions.GET_PRESIGNED_URL_FAILURE: {
      return {
        ...state,
        isUploadFileProgressBarEnabled: false,
      }
    }
    case actions.UPLOAD_FILE: {
      return {
        ...state,
        uploadFilePercent: 50,
        uploadFilLoader: true,
      }
    }
    case actions.UPLOAD_FILE_SUCCESS: {
      return {
        ...state,
        uploadFilePercent: 100,
        uploadFilLoader: false,
      }
    }
    case actions.UPLOAD_FILE_FAILURE: {
      return {
        ...state,
        uploadFilLoader: false,
      }
    }
    case actions.GET_DOCUMENTS_QUESTIONS_SUCCESS: {
      const regulatoryLicence = [
        {
          label: 'Regulatory Licence',
          maxLimit: 1,
          minLimit: 1,
          name: 'regulatory_license',
          toolTip: 'Registred company licence',
        },
      ]
      const requiredDocs = regulatoryLicence.concat(action.value)
      return {
        ...state,
        requiredDocumentsList: requiredDocs,
      }
    }
    case actions.GET_DOCUMENTS_FILE: {
      return {
        ...state,
        uploadFilLoader: true,
      }
    }
    case actions.GET_DOCUMENTS_FILE_SUCCESS: {
      const allFiles =
        action.value !== undefined && action.value !== null && action.value.length > 0
          ? action.value.filter(file => file !== null)
          : []
      allFiles.forEach(file => {
        Object.assign(file, { name: file.friendlyName, url: file.url })
      })
      return {
        ...state,
        selectedDocumentFiles: allFiles,
        isDocumentsUpdated: !state.isDocumentsUpdated,
        isUploadFileProgressBarEnabled: false,
        uploadFilLoader: false,
      }
    }
    case actions.GET_DOCUMENTS_FILE_FAILURE: {
      return {
        ...state,
        isUploadFileProgressBarEnabled: false,
        uploadFilLoader: false,
      }
    }
    case actions.REMOVE_DOCUMENT_FILES: {
      const filterData = state.selectedDocumentFiles.filter(item => item.uid !== action.payload.uid)
      return {
        ...state,
        selectedDocumentFiles: filterData,
        loaderDelete: true,
      }
    }
    case actions.REMOVE_DOCUMENT_FILES_SUCCESS: {
      return {
        ...state,
        loaderDelete: false,
      }
    }
    case actions.REMOVE_DOCUMENT_FILES_FAILURE: {
      return {
        ...state,
        loaderDelete: false,
      }
    }
    case actions.UPDATE_DOCUMENT_STATUS: {
      return {
        ...state,
        loading: true,
      }
    }
    case actions.UPDATE_DOCUMENT_STATUS_SUCCESS: {
      return {
        ...state,
        loading: false,
      }
    }
    case actions.UPDATE_DOCUMENT_STATUS_FAILURE: {
      return {
        ...state,
        loading: false,
      }
    }

    // stakeholders

    case actions.GET_ALL_STAKEHOLDERS_BY_ID_SUCCESS: {
      return {
        ...state,
        loading: false,
        people: action.value,
      }
    }

    case actions.UPDATE_OVERALL_APPLICATION_STATUS: {
      return {
        ...state,
        loading: true,
      }
    }
    case actions.UPDATE_OVERALL_APPLICATION_STATUS_SUCCESS: {
      return {
        ...state,
        loading: false,
      }
    }
    case actions.UPDATE_OVERALL_APPLICATION_STATUS_FAILURE: {
      return {
        ...state,
        loading: false,
      }
    }

    case actions.GET_PRESIGNED_URL_PREVIEW: {
      return {
        ...state,
        loading: true,
        previewURL: '',
        originFileObj: action.file,
      }
    }

    case actions.GET_PRESIGNED_URL_PREVIEW_SUCCESS: {
      const { url } = action.value
      return {
        ...state,
        loading: false,
        previewURL: url,
      }
    }

    case actions.GET_STAKEHOLDER_PRESIGNED_URL_PREVIEW_FAILURE: {
      return {
        ...state,
        loading: false,
      }
    }

    case actions.GET_STAKEHOLDER_PRESIGNED_URL_PREVIEW: {
      return {
        ...state,
        previewURL: '',
        originFileObjForStakeholder: action.data,
      }
    }

    case actions.GET_STAKEHOLDER_PRESIGNED_URL_PREVIEW_SUCCESS: {
      const { signedUrl } = action.value
      return {
        ...state,
        previewStakeholderURL: signedUrl,
      }
    }

    default:
      return state
  }
}
