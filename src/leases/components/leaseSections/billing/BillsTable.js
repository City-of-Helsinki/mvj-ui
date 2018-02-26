// @flow
import React, {Component} from 'react';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';

import {formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import BillModal from './BillModal';
import {getLabelOfOption} from '../../../../util/helpers';
import {billingStatusOptions, billingTypeOptions} from '../constants';

type Props = {
  bills: Array<Object>,
  headers: Array<string>,
}

type State = {
  selectedBill: Object,
  showModal: boolean,
  tableHeight: ?number,
}

class BillsTable extends Component {
  props: Props

  tableElement: any

  state: State = {
    selectedBill: {},
    showModal: false,
    tableHeight: null,
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;
    const {showModal} = this.state;

    if(showModal) {clientHeight = 480;}
    if(clientHeight > 480) {clientHeight = 480;}

    this.setState({tableHeight: clientHeight});
  }

  componentDidMount() {
    this.calculateHeight();
  }

  componentDidUpdate() {
    this.calculateHeight();
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return (
      this.state.tableHeight !== nextState.tableHeight ||
      this.state.selectedBill !== nextState.selectedBill ||
      this.state.showModal !== nextState.showModal
    );
  }

  render () {
    const {bills, headers} = this.props;
    const {selectedBill, showModal, tableHeight} = this.state;

    return (
      <div className={classNames('table-fixed-header', 'billing__bill-table', {'is-open': showModal})}>
        <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
          <BillModal
            bill={selectedBill}
            containerHeight={isNumber(tableHeight) ? tableHeight + 31 : null}
            onClose={() => this.setState({selectedBill: {}, showModal: false})}
            show={showModal}
          />
          <div className="table-fixed-header__header-border" />
          <table ref={(ref) => this.tableElement = ref}>
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
                    <tr
                      className={classNames({'selected': selectedBill === bill})}
                      key={index}
                      onClick={() => this.setState({selectedBill: bill, showModal: true})}
                      >
                      <td>{`${get(bill, 'tenant.lastname')} ${get(bill, 'tenant.firstname')}`}</td>
                      <td>{get(bill, 'tenant.bill_share') ? `${get(bill, 'tenant.bill_share')} %` : '-'}</td>
                      <td>{bill.due_date ? formatDate(bill.due_date) : '-'}</td>
                      <td>{bill.bill_number ? bill.bill_number : '-'}</td>
                      <td>{formatDateRange(bill.billing_period_start_date, bill.billing_period_end_date)}</td>
                      <td>{bill.type ? getLabelOfOption(billingTypeOptions, bill.type) : '-'}</td>
                      <td>{bill.status ? getLabelOfOption(billingStatusOptions, bill.status) : '-'}</td>
                      <td>{bill.invoiced_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.invoiced_amount))} €` : '-'}</td>
                      <td>{bill.unpaid_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(bill.unpaid_amount))} €` : '-'}</td>
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
