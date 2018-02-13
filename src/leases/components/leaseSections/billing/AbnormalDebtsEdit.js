// @flow
import React from 'react';
import get from 'lodash/get';
import classNames from 'classnames';

import {formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';

type Props = {
  abnormalDebts: Array<Object>,
  onDeleteClick: Function,
  selectedDebtIndex: ?number,
}

const AbnormalDebtsEdit = ({abnormalDebts, onDeleteClick, selectedDebtIndex}: Props) => {
  return (
    <table className="abnormal-debts-table">
      <thead>
        <tr>
          <th>Vuokraaja</th>
          <th>Hallintaosuus</th>
          <th>Eräpäivä</th>
          <th>Määrä</th>
          <th>Aikaväli</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {abnormalDebts && abnormalDebts.length
          ? (abnormalDebts.map((debt, index) => {
            return (
              <tr
                className={classNames({'selected': selectedDebtIndex === index})}
                key={index}>
                <td>{`${get(debt, 'tenant.lastname')} ${get(debt, 'tenant.firstname')}`}</td>
                <td>{get(debt, 'tenant.bill_share') ? `${get(debt, 'tenant.bill_share')} %` : '-'}</td>
                <td>{debt.due_date ? formatDate(debt.due_date) : '-'}</td>
                <td>{debt.capital_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(debt.capital_amount))} €` : '-'}</td>
                <td>{formatDateRange(debt.billing_period_start_date, debt.billing_period_end_date)}</td>
                <td className="action-buttons">
                  <button className='action-button button-edit' />
                  <button
                    className='action-button button-delete'
                    onClick={() => {
                      onDeleteClick(index);
                    }}
                    type='button'
                  />
                </td>
              </tr>
            );
          }))
          : (<tr className="no-data"><td colSpan={6}>Ei poikkeavia perintöjä</td></tr>)
        }
      </tbody>
    </table>
  );
};

export default AbnormalDebtsEdit;
