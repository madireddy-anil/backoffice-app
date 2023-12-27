import React from 'react'
import { Button, Table } from 'antd'
import { Helmet } from 'react-helmet'

import PaymentCard from 'components/CleanUIComponents/PaymentCard'
import PaymentAccount from 'components/CleanUIComponents/PaymentAccount'
import ChartCard from 'components/CleanUIComponents/ChartCard'
import Authorize from 'components/LayoutComponents/Authorize'

import { tableData } from './data.json'

class DashboardAlpha extends React.Component {
  render() {
    const tableColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Office',
        dataIndex: 'office',
        key: 'office',
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      },
      {
        title: 'Salary',
        dataIndex: 'salary',
        key: 'salary',
        sorter: (a, b) => a.salary - b.salary,
      },
    ]

    return (
      <Authorize roles={['admin']} redirect to="/dashboard/beta">
        <Helmet title="Dashboard Alpha" />
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Last Week Statistics</strong>
        </div>
        <div className="row">
          <div className="col-xl-4">
            <ChartCard
              title="Transactions"
              amount="1240"
              chartProps={{
                width: 120,
                height: 107,
                lines: [
                  {
                    values: [2, 11, 8, 14, 18, 20, 26],
                    colors: {
                      area: 'rgba(199, 228, 255, 0.5)',
                      line: '#004585',
                    },
                  },
                ],
              }}
            />
          </div>
          <div className="col-xl-4">
            <ChartCard
              title="Income"
              amount="$1,240.00"
              chartProps={{
                width: 120,
                height: 107,
                lines: [
                  {
                    values: [20, 80, 67, 120, 132, 66, 97],
                    colors: {
                      area: 'rgba(199, 228, 255, 0.5)',
                      line: '#004585',
                    },
                  },
                ],
              }}
            />
          </div>
          <div className="col-xl-4">
            <ChartCard
              title="Outcome"
              amount="$240.56"
              chartProps={{
                width: 120,
                height: 107,
                lines: [
                  {
                    values: [42, 40, 80, 67, 84, 20, 97],
                    colors: {
                      area: 'rgba(199, 228, 255, 0.5)',
                      line: '#004585',
                    },
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>Recently Referrals</strong>
                </div>
                <div className="utils__titleDescription">
                  Block with important Recently Referrals information
                </div>
              </div>
              <div className="card-body">
                <Table
                  className="utils__scrollTable"
                  scroll={{ x: '100%' }}
                  columns={tableColumns}
                  dataSource={tableData}
                  pagination={false}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Your Cards (3)</strong>
          <Button className="ml-3">View All</Button>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <PaymentCard
              icon="lnr lnr-bookmark"
              name="Matt Daemon"
              number="4512-XXXX-1678-7528"
              type="VISA"
              footer="Expires at 02/20"
              sum="$2,156.78"
            />
          </div>
          <div className="col-lg-4">
            <PaymentCard
              icon="lnr lnr-bookmark"
              name="David Beckham"
              number="8748-XXXX-1678-5416"
              type="MASTERCARD"
              footer="Expires at 03/22"
              sum="$560,245.35"
            />
          </div>
          <div className="col-lg-4">
            <PaymentCard
              icon="lnr lnr-hourglass"
              name="Mrs. Angelina Jolie"
              number="6546-XXXX-1678-1579"
              type="VISA"
              footer="Locked Temporary"
              sum="$1,467,98"
            />
          </div>
        </div>
        <div className="utils__title utils__title--flat mb-3">
          <strong className="text-uppercase font-size-16">Your Accounts (6)</strong>
          <Button className="ml-3">View All</Button>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <PaymentAccount
              icon="lnr lnr-inbox"
              number="US 4658-1678-7528"
              footer="Current month charged: $10,200.00"
              sum="$2,156.78"
            />
          </div>
          <div className="col-lg-6">
            <PaymentAccount
              icon="lnr lnr-inbox"
              number="IBAN 445646-8748-4664-1678-5416"
              footer="Current month charged: $1,276.00"
              sum="$560,245.35"
            />
          </div>
          <div>
            <Button>
              <a
                href="https://payslipsfromclients.s3.amazonaws.com/BetVictor/Trade-123455/file?AWSAccessKeyId=AKIAVZ5U4YF4OIALT4PC&Content-Type=image%2Fjpeg&Expires=1584124124&Signature=uAl%2Fo7wGoMFGl9aeD%2Fw%2F9dcbAkI%3D"
                download
                rel="noopener noreferrer"
                target="_blank"
              >
                Download
              </a>
            </Button>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default DashboardAlpha
