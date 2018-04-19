// @flow
import React, {Component} from 'react';
import get from 'lodash/get';
import classNames from 'classnames';

import {
  formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator,
} from '$util/helpers';

const MODAL_HEIGHT = 450;

type Props = {
  debts: Array<Object>,
  headers: Array<string>,
}

type State = {
  tableHeight: ?number,
}

class AbnormalDebtsTable extends Component {
  props: Props

  tableElement: any

  state: State = {
    tableHeight: null,
  }

  calculateHeight = () => {
    let {clientHeight} = this.tableElement;

    if(clientHeight > MODAL_HEIGHT) {
      clientHeight = MODAL_HEIGHT;
    }
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
        this.props !== nextProps
    );
  }

  render () {
    const {debts, headers} = this.props;
    const {tableHeight} = this.state;

    return (
      <div className={classNames('table-fixed-header')}>
        <div className="table-fixed-header__container" style={{maxHeight: tableHeight}}>
          <div className="table-fixed-header__header-border" />
          <table ref={(ref) => this.tableElement = ref}>
            <thead>
              {headers && !!headers.length &&
                <tr>
                  {headers.map((header, index) => <th key={index}>{header}<div>{header}</div></th>)}
                </tr>
              }
            </thead>
            {debts && !!debts.length &&
              <tbody>
                {debts.map((debt, index) => {
                  return (
                    <tr
                      key={index}
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
