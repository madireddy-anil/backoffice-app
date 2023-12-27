import React from 'react'

/**
 *
 * @function KeyCapture
 *
 * @props actionTriggerer : function : Calls whenever a valid key is pressed
 *          @param type : string defines which type of thing to be toggled,
 *                 action : boolean : To perform appropriate actions.
 *
 *          isFilterClosedWithoutEsc : boolean : To change the state
 *  Note :
 *      * Here Drawer Based filter considered as advance filter, so if the particular component doesn't have a default filter, drawer treated as advanced... soo key code a || A should be used...
 *      * If Parent Component Has A Advance filter, close on Esc Key is need to be disabled, to disable use keyboard={false} in Drawer component...
 *
 */

export default props => {
  const { actionTriggerer, isFilterClosedWithoutEsc } = props

  const [isDefaultFitlerToggled, updateDefaultFilterToggled] = React.useState(false)

  const [isAdvanceFilterToggled, updateAdvanceFilterToggled] = React.useState(false)

  const [isDownloadToggled, updateDownloadToggled] = React.useState(false)

  /**
   *
   * If user clicks on cancel, reset, summit on filter, here also needed to be toggled.
   *
   */

  React.useEffect(() => {
    if (!isFilterClosedWithoutEsc) {
      updateAdvanceFilterToggled(false)
    }
  }, [isFilterClosedWithoutEsc])

  /**
   *
   * @function handleKeyDown
   *
   * @param evt
   *
   *  Called Whenever Key Pressing Happened..
   *
   * @returns null
   *
   */

  const handleKeyDown = evt => {
    if (!isAdvanceFilterToggled || evt.keyCode === 27) {
      switch (evt.keyCode) {
        // Key Code f || F
        case 70:
          actionTriggerer('Default Filter', !isDefaultFitlerToggled)
          updateDefaultFilterToggled(!isDefaultFitlerToggled)
          break
        // Key Code d || D
        case 68:
          actionTriggerer('Download', !isDownloadToggled)
          updateDownloadToggled(!isDownloadToggled)
          break
        // Key Code a || A
        case 65:
          actionTriggerer('Advance Filter', !isAdvanceFilterToggled)
          updateAdvanceFilterToggled(!isAdvanceFilterToggled)
          break
        // Key Code Esc || Escape Key
        case 27:
          actionTriggerer('Advance Filter', false)
          updateAdvanceFilterToggled(false)
          break
        // Key Code r || R
        case 82:
          actionTriggerer('Reset Filter')
          break
        // Key Code n || N
        case 78:
          actionTriggerer('New Trade')
          break
        default:
          break
      }
    }
  }

  /**
   *
   * Adding Key Listerer
   *
   */

  React.useEffect(() => {
    // Adding Listener On Mount..
    document.addEventListener('keydown', handleKeyDown, false)
    // Cleaning Up Fn, When Component Unmonut..
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false)
    }
  })

  return <></>
}

/* 

  handleShortcutCapture = (type, action) => {
    switch (type) {
      case 'Advance Filter':
        // eslint-disable-next-line no-unused-expressions
        action ? this.showDrawer() : this.onClose()
        break
      case 'Reset Filter':
        this.onReset()
        break
      case 'Download':
        this.setState({ visibleDownload: !action })
        break
      case 'New Trade':
        this.navigateToNewTrade()
        break
      default:
        break
    }
  }

*/
