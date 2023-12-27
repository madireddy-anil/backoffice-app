const actions = {
  TWO_FA_AUTHORIZATION_MODAL: 'TWO_FA_AUTHORIZATION_MODAL',
}
export default actions

export const twoFAauthorizationModal = value => {
  return {
    type: actions.TWO_FA_AUTHORIZATION_MODAL,
    value,
  }
}
