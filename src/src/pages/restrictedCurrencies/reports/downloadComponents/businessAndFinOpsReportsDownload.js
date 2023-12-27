/* *
 *
 * @function Download Component
 *
 *  @props
 *
 *      titleForDownload : string : Title or Heading to the download file.
 *
 *      toggleDownload : boolean : Toggle of the component.
 *
 *      isDownloadDisabled : boolean : Disables the download btn when the Data is being fetched from server.
 *
 *      downloadData : array : List of Data required for Download.
 *
 *      onChangeDownload : function (e) : Called whenever the download radio btn changed btw current and all.
 *
 *      currentValue : string : Form Field Value.
 *
 *      jsonData : json : The Table Column Headers.
 *
 *      getInitialData: function (data) => returns array of new data : This function changes the raw Data to downloadable data.
 *
 *      checkedListOfCustomizeColumn : array : Customize Column CheckedList,
 *
 *      defaultDownloadColumnHeaders : array : Initial Headers.
 *
 *      additionColumnHeaders: array : some reports like fin ops and volume and profit report, has extra columns than usual, soo that columns need to treated specially with some extra logic.
 *
 *      appliedFilters: object : For Manipulating Date for download with date range, If user pre select date in filter.
 *
 *      form : Form : Form instance of parent component.
 *
 */

import React from 'react'

import _ from 'lodash'

import DownloadUI from './downloadUI'

export default props => {
  const {
    jsonData,
    defaultDownloadColumnHeaders,
    getInitialData,
    checkedListOfCustomizeColumn,
    downloadData,
    titleForDownload,
    additionColumnHeaders,
  } = props

  const { allColumns, initialColumns } = jsonData

  let reportDownloadData = []
  let reportDownloadColumnHeaders = []

  /* *
   *  @function getMissingHeaderIndices
   *
   *  @params : array : current aka currently selected customize column headers.
   *
   *  @returns : array : indices of the unselected customize column headers.
   *
   */

  const getMissingHeaderIndices = current => {
    const difference = current
      ? /*  compare with default headers and extracting the unselected. */

        _.differenceWith(defaultDownloadColumnHeaders, current, _.isEqual)
      : /* fallback, if args came as undefined */
        initialColumns.map(obj => {
          return obj.label
        })
    const indices = []
    /* extracting the index */
    for (let i = 0; i < difference.length; i += 1) {
      indices.push(defaultDownloadColumnHeaders.indexOf(difference[i]))
    }
    return indices
  }

  /* *
   *
   *  @function prepareReportDownloadData
   *
   *  classify data for download based on the selected columns.
   *
   *  @params value : array : unclassified data aka table data, checkedList : array : currently selected customize column headers,
   *
   *  @returns null
   */

  const prepareReportDownloadData = (value, checkedList) => {
    /* classifing the data for download */
    const initialDownloadData =
      titleForDownload === 'Fin Ops' || titleForDownload === 'Volume And Profit'
        ? value
        : getInitialData(value)
    const data = []
    /* getting the unselected columns indices */
    const missingIndices = getMissingHeaderIndices(checkedList)
    /* iterate over the classified data */
    for (let i = 0; i < initialDownloadData.length; i += 1) {
      const newObj = []
      let difference = 0
      /* iterate over the object */
      for (let j = 0; j < initialDownloadData[i].length; j += 1) {
        const current = initialDownloadData[i]
        /* checking whether the object value matches the unselected */
        if (!missingIndices.includes(j)) {
          newObj[j - difference] = current[j]
        } else {
          difference += 1
        }
      }
      data.push(newObj)
    }

    reportDownloadData = checkedList.length > 0 ? data : []
    reportDownloadColumnHeaders = checkedList.length > 0 ? checkedList : []

    /* If the data is from fin ops or volume and profit report, we need to extract the listed columns and compare with the checked list */

    if (titleForDownload === 'Fin Ops' && checkedList.length > 0) {
      reportDownloadColumnHeaders = [
        ..._.intersection(
          additionColumnHeaders.slice(0, defaultDownloadColumnHeaders.length),
          checkedList,
        ),
        ...additionColumnHeaders.slice(
          defaultDownloadColumnHeaders.length,
          additionColumnHeaders.length,
        ),
      ]
    }

    if (titleForDownload === 'Volume And Profit' && checkedList.length > 0) {
      reportDownloadColumnHeaders = [
        ..._.intersection(
          additionColumnHeaders.slice(0, defaultDownloadColumnHeaders.length),
          checkedList,
        ),
        ...additionColumnHeaders.slice(
          defaultDownloadColumnHeaders.length,
          additionColumnHeaders.length,
        ),
      ]
    }
  }

  /* *
   *
   *  @function
   *
   *  Called Whenever donwload data updates ( current, bulk )
   *
   *  @params data : array : raw data fetched from server.
   *
   *  @returns null
   *
   */

  const list = []

  /* Due to usage of value in checked list ( Customize Column ), extracting label by checked value */
  for (let i = 0; i < allColumns.length; i += 1) {
    for (let j = 0; j < checkedListOfCustomizeColumn.length; j += 1) {
      if (allColumns[i].value === checkedListOfCustomizeColumn[j]) {
        list.push(allColumns[i].label)
      }
    }
  }

  prepareReportDownloadData(downloadData, list)

  return (
    <DownloadUI
      {...props}
      reportType="Business report"
      downloadData={reportDownloadData}
      downloadColumnHeaders={reportDownloadColumnHeaders}
    />
  )
}
