import React, { Component } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Button, Select, Icon, Tooltip } from 'antd'

import { connect } from 'react-redux'

import { updateRouteName } from 'redux/general/actions'

import './style.module.scss'

const { Option } = Select

const EditableContext = React.createContext()

class EditableCell extends Component {
  getOptions = () => {
    const { options } = this.props
    const selectOptions = options.map(option => (
      <Option
        key={option.id}
        value={option.value ? option.value : options[1].value}
        label={option.title}
        title={option.subtitle || ''}
      >
        <h6>{option.title}</h6>
        {option.subtitle && <small>{option.subtitle}</small>}
      </Option>
    ))
    return selectOptions
  }

  isDisbaledCell = value => {
    const { isDisableWithData } = this.props
    if (isDisableWithData && value !== undefined) {
      return true
    }
    return false
  }

  handleChange = value => {
    const { dispatch } = this.props
    if (['swap', 'fx', 'liquidate', 'crypto_wallet', 'otc', 'accounts_only'].includes(value)) {
      dispatch(updateRouteName(value))
    }
  }

  getInput = cellData => {
    const { inputType } = this.props
    switch (inputType) {
      case 'select':
        return (
          <Select
            showSearch
            style={{ minWidth: '150px' }}
            optionFilterProp="children"
            optionLabelProp="label"
            filterOption={(input, option) =>
              option.props.children[0].props.children.toLowerCase().indexOf(input.toLowerCase()) >=
              0
            }
            disabled={this.isDisbaledCell(cellData)}
            onChange={value => this.handleChange(value)}
          >
            {this.getOptions()}
          </Select>
        )
      case 'number':
        return (
          <InputNumber
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        )
      default:
        return <Input style={{ minWidth: '150px' }} />
    }
  }

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please ${inputType === 'select' ? 'Select' : 'Input'} ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput(record[dataIndex]))}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
  }
}

@connect()
@Form.create()
class EditableTable extends Component {
  constructor(props) {
    super(props)
    this.state = { data: props.originData, editingKey: '' }
    const { ondelete } = this.props
    this.editColumn = {
      title: 'operation',
      dataIndex: 'operation',
      fixed: 'right',
      render: (text, record) => {
        const editable = this.isEditing(record)
        const { editingKey } = this.state

        return editable ? (
          <span className="">
            <EditableContext.Consumer>
              {form => (
                <Popconfirm
                  title="Sure to save?"
                  onConfirm={() => {
                    this.save(form, record.id)
                  }}
                >
                  <Tooltip title="Save" placement="bottom">
                    <Button type="link">
                      <Icon type="save" />
                    </Button>
                  </Tooltip>
                </Popconfirm>
              )}
            </EditableContext.Consumer>
            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.id)}>
              <Tooltip title="Cancel" placement="bottom">
                <Button type="link">
                  <Icon type="close" style={{ color: '#ff5d55' }} />
                </Button>
              </Tooltip>
            </Popconfirm>
          </span>
        ) : (
          <span className="">
            <Tooltip title="Edit" placement="bottom">
              <Button type="link" disabled={editingKey !== ''} onClick={() => this.edit(record)}>
                <Icon type="edit" />
              </Button>
            </Tooltip>
            {props.deletable && (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => {
                  if (ondelete) ondelete(record.id)
                }}
              >
                <Tooltip title="delete" placement="bottom">
                  <Button type="link" disabled={editingKey !== ''}>
                    <Icon type="delete" style={{ color: '#ff5d55' }} />
                  </Button>
                </Tooltip>
              </Popconfirm>
            )}
          </span>
        )
      },
    }
    this.columns = [...props.columns, this.editColumn]
  }

  componentDidUpdate(prevProps) {
    const { originData } = this.props
    if (prevProps.originData !== originData) {
      this.addingRowData(originData)
    }
  }

  addingRowData = newData => {
    this.setState({ data: newData })
  }

  isEditing = record => {
    const { editingKey } = this.state
    return record.id === editingKey
  }

  cancel = () => {
    this.setState({ editingKey: '' })
  }

  save(form, id) {
    const { data } = this.state
    const { onsave } = this.props
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      const newData = [...data]
      const index = newData.findIndex(item => id === item.id)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        this.setState({ data: newData, editingKey: '' })
        if (onsave) onsave(newData, index)
      } else {
        newData.push(row)
        this.setState({ data: newData, editingKey: '' })
        if (onsave) onsave(newData, index)
      }
    })
  }

  edit(key) {
    const { dispatch } = this.props
    if (key.routeType !== undefined && key.routeType !== '') {
      dispatch(updateRouteName(key.routeType))
    }
    this.setState({ editingKey: key.id })
  }

  render() {
    const { form, loading, dispatch } = this.props
    const { data } = this.state
    const components = {
      body: {
        cell: EditableCell,
      },
    }

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.inputType,
          options: col.options ? col.options : [],
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          isDisableWithData: col.isDisableWithData,
          dispatch,
        }),
      }
    })

    return (
      <EditableContext.Provider value={form}>
        <Table
          components={components}
          rowKey={record => record.id}
          dataSource={data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel,
          }}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </EditableContext.Provider>
    )
  }
}

export default EditableTable
