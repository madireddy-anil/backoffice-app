const actions = {
  UPDATE_CUSTOMIZE_VALUE: 'UPDATE_CUSTOMIZE_VALUE',
}

export default actions

export const updateCustomizeValue = value => {
  return {
    type: actions.UPDATE_CUSTOMIZE_VALUE,
    value,
  }
}
