import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Select, Button } from 'antd'
import Text from 'components/CleanUIComponents/Text'
import BalanceStatementsUploader from './components/balance/balanceStatements'
import TransactionStatementsUploader from './components/transactions/transactionStatements'

import data from './data.json'
import styles from './style.module.scss'

const { Option } = Select

@withRouter
class statementsUploader extends Component {
  state = {
    selectedOption: 'balanceStatements',
  }

  onUploadOption = name => {
    this.setState({ selectedOption: name })
  }

  onClickBack = () => {
    const { history } = this.props
    history.push('/statements-upload-files-list')
  }

  render() {
    const { selectedOption } = this.state
    const uploadOptions = data.uploadOptions.map(option => (
      <Option key={option.id} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    return (
      <div>
        <Card
          bordered
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '0',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
          title={
            <div className="row">
              <div className={`col-lg-2 ${styles.titleBlock}`}>
                <Text weight="thin" size="xlarge" className="font-size-15">
                  <Button
                    type="link"
                    icon="arrow-left"
                    className={styles.backArrowIcon}
                    onClick={this.onClickBack}
                  />
                  {`${' '} ${'Statement Type :'}`}
                </Text>
              </div>

              <div className="col-lg-3">
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Choose Upload Type"
                  className={styles.cstmSelectInput}
                  value={selectedOption}
                  onSelect={(name, id) => this.onUploadOption(name, id)}
                  optionLabelProp="label"
                  onFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children[0].props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {uploadOptions}
                </Select>
              </div>
            </div>
          }
        >
          <div className="row">
            {selectedOption === 'balanceStatements' ? (
              <BalanceStatementsUploader />
            ) : (
              <TransactionStatementsUploader />
            )}
          </div>
        </Card>
      </div>
    )
  }
}

export default statementsUploader
