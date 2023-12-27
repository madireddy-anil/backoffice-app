/* *
 *
 *  @function downloadUI
 *
 *  @props
 *
 *    titleForDownload : string : title or heading for downloading.
 *
 *    reportType : string : To justify the type of the report.
 *
 *    toggleDownload : boolean : Toggle of the component.
 *
 *    isDownloadDisabled : boolean : Disables the download btn when the Data is being fetched from server.
 *
 *    downloadData : array : List of Data required for Download.
 *
 *    downloadColumnHeaders : array : List Headers For Download.
 *
 *    onChangeDownload : function (e) : Called whenever the download radio btn changed btw current and all.
 *
 *    appliedFilters: object : For Manipulating Date for download with date range, If user pre select date in filter.
 *
 *    currentValue : string : Form Field Value.
 *
 *    form : Form : Form instance of parent component.
 *
 */

import React from 'react'

import { Form, Radio, Popover, DatePicker, Button, notification } from 'antd'

import moment from 'moment'

import Excel from '../../../components/CleanUIComponents/Excel'

import {
  disabledFutureDate,
  dateRangeResetTheTime,
  dateRangeResetAfterReset,
} from '../../../utilities/transformer'

const { RangePicker } = DatePicker

const DownloadUI = props => {
  const {
    titleForDownload,
    reportType,
    toggleDownload,
    isDownloadDisabled,
    downloadData,
    downloadColumnHeaders,
    onChangeDownload,
    currentValue,
    form,
    appliedFilters,
  } = props

  const { getFieldDecorator } = form

  const [toggleDownloadBtn, updateDownloadBtnState] = React.useState(false)

  const [toggleVisible, updateVisiblity] = React.useState(false)

  const [isValuePresent, updateValue] = React.useState(false)

  React.useEffect(() => {
    if (currentValue === 'current') {
      updateDownloadBtnState(false)
      updateValue(false)
      form.setFieldsValue({ DateAndTimeForDownload: [] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue])

  const getDateRange = () => {
    return (
      <div className="p-1 d-flex">
        <Form>
          {getFieldDecorator('DateAndTimeForDownload')(
            <RangePicker
              className="mt-md-2 mt-sm-0"
              disabledDate={disabledFutureDate}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
              onCalendarChange={evt =>
                dateRangeResetAfterReset(evt, appliedFilters.DateAndTimeForDownload)
              }
              onChange={evt => restrictDate(evt)}
              format="YYYY-MM-DD HH:mm:ss"
              onOk={handleOnOkayClicked}
            />,
          )}
        </Form>
        <Button className="ml-md-3 ml-sm-0 mt-sm-2" type="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    )
  }

  const restrictDate = evt => {
    if (evt && reportType !== 'Ops report') {
      if (evt.length !== 0) {
        if (evt[1].diff(evt[0], 'days') + 1 > 45) {
          notification.error({
            message: 'Exceeded The Date Range',
            description: 'Please Select Date Range Between 45 days.',
          })
          updateDownloadBtnState(true)
          return true
        }
      }
    }
    dateRangeResetTheTime(evt)
    return false
  }

  const handleOnOkayClicked = evt => {
    if (evt[1].diff(evt[0], 'days') + 1 <= 45) {
      updateDownloadBtnState(false)
      updateVisiblity(false)
      updateValue(true)
      onChangeDownload(
        'all',
        evt[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z'),
        evt[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z'),
        evt,
      )
    }
  }

  const handleCancel = () => {
    form.setFieldsValue({ downloadSelectedType: 'current', DateAndTimeForDownload: [] })
    updateDownloadBtnState(false)
    updateValue(false)
    updateVisiblity(false)
    onChangeDownload('current')
  }

  const onChange = e => {
    if (e.target.value === 'current') {
      onChangeDownload('current')
      form.setFieldsValue({ DateAndTimeForDownload: [] })
      updateVisiblity(false)
      updateValue(false)
    } else {
      updateDownloadBtnState(true && !isValuePresent)
    }
  }

  return (
    <div hidden={toggleDownload} className="mt-4 pl-4">
      <Form>
        <Form.Item>
          {getFieldDecorator('downloadSelectedType', {
            initialValue: currentValue,
          })(
            <Radio.Group onChange={onChange}>
              <Radio value="current" className="pl-2">
                {reportType !== 'Ops report' ? 'Download Current Page' : 'Download All Data'}
              </Radio>
              {reportType !== 'Ops report' && (
                <Popover
                  content={getDateRange()}
                  title="Pick A Range"
                  trigger="click"
                  visible={toggleVisible}
                  onVisibleChange={evt => updateVisiblity(evt)}
                >
                  <Radio value="all" className="pl-2" onClick={onChange}>
                    Download All By Date Range
                  </Radio>
                </Popover>
              )}
            </Radio.Group>,
          )}
          {
            <Excel
              columns={downloadColumnHeaders}
              data={downloadData}
              fileName={`${titleForDownload} Report`}
              isPrimaryButtonVisible
              primaryButtonName="Download"
              isDownloadDisabled={isDownloadDisabled || toggleDownloadBtn}
            />
          }
        </Form.Item>
      </Form>
    </div>
  )
}

export default DownloadUI
