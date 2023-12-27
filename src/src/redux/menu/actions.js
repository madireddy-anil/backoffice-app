const actions = {
  SET_LEFT_MENU: 'SET_LEFT_MENU',
}

export default actions

export const setLeftMenu = payload => {
  return {
    type: actions.SET_LEFT_MENU,
    payload,
  }
}
