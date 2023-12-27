import actions from './actions'

// import { depositRateGraph } from '../../utilities/transformer'

const initialState = {
  dashboardLoading: false,
  depositGraph: {},
  dasboardBalances: {
    payoutStatus: {
      successPercentage: '0',
      failPercentage: '0',
      inprogressPercentage: '0',
    },
    depositSuccessTrend: [],
  },
}

export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_ALL_DASHBOARD_BALANCES_SUCCESS:
      // const depositSuccessRate = depositRateGraph(action.value)
      return {
        ...state,
        dasboardBalances: action.value,
        // depositGraph: action.depositGraph,
      }
    case actions.GET_BALANCES_ON_FILTERS:
      return {
        ...state,
        dashboardLoading: true,
      }
    case actions.GET_BALANCES_ON_FILTERS_SUCCESS:
      return {
        ...state,
        dasboardBalances: action.value,
        dashboardLoading: false,
      }
    case actions.GET_BALANCES_ON_FILTERS_FAILURE:
      return {
        ...state,
        dashboardLoading: false,
      }
    default:
      return state
  }
}
