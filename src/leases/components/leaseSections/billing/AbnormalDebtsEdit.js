// @flow
import React from 'react';
import get from 'lodash/get';

import {formatDate,
  formatDateRange,
  formatDecimalNumbers,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';

type Props = {
  abnormalDebts: Array<Object>,
  onDeleteClick: Function,
}

const AbnormalDebtsEdit = ({abnormalDebts, onDeleteClick}: Props) => {
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
        {abnormalDebts && abnormalDebts
          ? (abnormalDebts.map((debt, index) => {
            return (
              <tr key={index}>
                <td>{`${get(debt, 'tenant.lastname')} ${get(debt, 'tenant.firstname')}`}</td>
                <td>{get(debt, 'tenant.bill_share') ? `${get(debt, 'tenant.bill_share')} %` : '-'}</td>
                <td>{debt.due_date ? formatDate(debt.due_date) : '-'}</td>
                <td>{debt.amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(debt.amount))} €` : '-'}</td>
                <td>{formatDateRange(debt.start_date, debt.end_date)}</td>
                <td className="action-buttons">
                  <button className='action-button button-edit' />
                  <button
                    className='action-button button-delete'
                    onClick={() => {
                      onDeleteClick();
                    }}
                  />
                </td>
              </tr>
            );
          }))
          : (<tr className="no-data"><td colSpan={5}>Ei poikkeavia perintöjä</td></tr>)
        }
      </tbody>
    </table>
  );
};

export default AbnormalDebtsEdit;
