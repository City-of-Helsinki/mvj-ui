// @flow
import React, {Component} from 'react';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import classNames from 'classnames';

import {formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import AbnormalDebtModal from './AbnormalDebtModal';

type Props = {
  debts: Array<Object>,
  headers: Array<string>,
}

type State = {
  selectedDebt: Object,
  showModal: boolean,
  tableHeight: ?number,
}

class AbnormalDebtsTable extends Component {
  props: Props

  tableElement: any

  state: State = {
    selectedDebt: {},
    showModal: false,
    tableHeight: null,
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;
    const {showModal} = this.state;

    if(showModal) {clientHeight = 450;}
    if(clientHeight > 450) {clientHeight = 450;}

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
    const {debts, headers} = this.props;
    const {selectedDebt, showModal, tableHeight} = this.state;

    return (
      <div className={classNames('table-fixed-header', 'billing__bill-table', {'is-open': showModal})}>
        <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
          <AbnormalDebtModal
            containerHeight={isNumber(tableHeight) ? tableHeight + 31 : null}
            debt={selectedDebt}
            onClose={() => this.setState({selectedDebt: {}, showModal: false})}
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
            {debts && debts.length > 0 &&
              <tbody>
                {debts.map((debt, index) => {
                  return (
                    <tr
                      className={classNames({'selected': selectedDebt === debt})}
                      key={index}
                      onClick={() => this.setState({selectedDebt: debt, showModal: true})}
                      >
                      <td>{`${get(debt, 'tenant.lastname')} ${get(debt, 'tenant.firstname')}`}</td>
                      <td>{get(debt, 'tenant.bill_share') ? `${get(debt, 'tenant.bill_share')} %` : '-'}</td>
                      <td>{debt.due_date ? formatDate(debt.due_date) : '-'}</td>
                      <td>{debt.capital_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(debt.capital_amount))} €` : '-'}</td>
                      <td>{formatDateRange(debt.billing_period_start_date, debt.billing_period_end_date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            }
            {!debts || debts.length === 0 && <tbody><tr><td colSpan={5} className='no-data'>Ei poikkeavia perintöjä</td></tr></tbody>}
          </table>
        </div>
      </div>
    );
  }
}

export default AbnormalDebtsTable;
