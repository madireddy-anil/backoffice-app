const beneficiaryTypes = ['INDIVIDUAL', 'BUSINESS']
const tradeSubStatus = [
  {
    id: '0001',
    title: 'Completed',
    value: 'completed',
    iconName: 'check-circle',
    iconColor: '#72bb53',
  },
  {
    id: '0002',
    title: 'Funds Awaited',
    value: 'funds_awaited',
    iconName: 'clock-circle',
    iconColor: '#ecb160',
  },
  {
    id: '0003',
    title: 'Funds Received',
    value: 'funds_received',
    iconName: 'clock-circle',
    iconColor: '#ecb160',
  },
  {
    id: '0004',
    title: 'Frozen Funds',
    value: 'frozen_funds',
    iconName: 'clock-circle',
    iconColor: '#ecb160',
  },
  {
    id: '0005',
    title: 'Awaiting For Compliance Approval',
    value: 'awaiting_for_compliance_approval',
    iconName: 'clock-circle',
    iconColor: '#ecb160',
  },
  {
    id: '0006',
    title: 'Swapped',
    value: 'swapped',
    iconName: 'clock-circle',
    iconColor: '#ecb160',
  },
  {
    id: '0007',
    title: 'Liquidated',
    value: 'liquidated',
    iconName: 'clock-circle',
    iconColor: '#ecb160',
  },
  {
    id: '0008',
    title: 'Cancelled',
    value: 'cancelled',
    iconName: 'close-circle',
    iconColor: '#ff4d4f',
  },
]

export default {
  beneficiaryTypes,
  tradeSubStatus,
}
