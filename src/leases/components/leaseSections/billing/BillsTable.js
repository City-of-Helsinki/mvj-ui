// @flow
import React, {Component} from 'react';
import get from 'lodash/get';

import {formatDate,
  formatDateRange,
  formatDecimalNumbers,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import BillModal from './BillModal';

type Props = {
  bills: Array<Object>,
  headers: Array<string>,
}

type State = {
  selectedBill: Object,
  showModal: boolean,
}

class BillsTable extends Component {
  props: Props

  state: State = {
    selectedBill: {},
    showModal: false,
  }

  render () {
    const {bills, headers} = this.props;
    const {selectedBill, showModal} = this.state;

    return (
      <div className="table-fixed-header table-fixed-header-high">
        <BillModal
          bill={selectedBill}
          onClose={() => this.setState({showModal: false})}
          show={showModal}
        />
        <div className="table-fixed-header__container">
          <div className="table-fixed-header__header-border" />
          <table>
            <thead>
              {headers && headers.length > 0 &&
                <tr>
                  {headers.map((header, index) => <th key={index}>{header}<div>{header}</div></th>)}
                </tr>
              }
            </thead>
            {bills && bills.length > 0 &&
              <tbody>
                {bills.map((bill, index) => {
                  return (
                    <tr key={index} onClick={() => this.setState({selectedBill: bill, showModal: true})}>
                      <td>{`${get(bill, 'tenant.lastname')} ${get(bill, 'tenant.firstname')}`}</td>
                      <td>{get(bill, 'tenant.bill_share') ? `${get(bill, 'tenant.bill_share')} %` : '-'}</td>
                      <td>{bill.due_date ? formatDate(bill.due_date) : '-'}</td>
                      <td>{bill.bill_number ? bill.bill_number : '-'}</td>
                      <td>{formatDateRange(bill.billing_period_start_date, bill.billing_period_end_date)}</td>
                      <td>{bill.type ? bill.type : '-'}</td>
                      <td>{bill.status ? bill.status : '-'}</td>
                      <td>{bill.invoiced_amount ? formatNumberWithThousandSeparator(formatDecimalNumbers(bill.invoiced_amount)) : '-'}</td>
                      <td>{bill.unpaid_amount ? formatNumberWithThousandSeparator(formatDecimalNumbers(bill.unpaid_amount)) : '-'}</td>
                      <td>{bill.info ? 'Kyllä' : 'Ei'}</td>
                      <td>{bill.sent_to_SAP_date ? formatDate(bill.sent_to_SAP_date) : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            }
            {!bills || bills.length === 0 && <tbody></tbody>}
          </table>
        </div>
      </div>
    );
  }
}

export default BillsTable;
