// @flow
import React from 'react';
import get from 'lodash/get';

import {formatDate,
  formatDateRange,
  formatDecimalNumber,
  formatNumberWithThousandSeparator} from '$util/helpers';

type Props = {
  abnormalDebts: Array<Object>
}

const AbnormalDebts = ({abnormalDebts}: Props) => {
  return (
    <table className="abnormal-debts-table">
      <thead>
        <tr>
          <th>Vuokraaja</th>
          <th>Hallintaosuus</th>
          <th>Eräpäivä</th>
          <th>Määrä</th>
          <th>Aikaväli</th>
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
                <td>{debt.capital_amount ? `${formatNumberWithThousandSeparator(formatDecimalNumber(debt.capital_amount))} €` : '-'}</td>
                <td>{formatDateRange(debt.billing_period_start_date, debt.billing_period_end_date)}</td>
              </tr>
            );
          }))
          : (<tr className="no-data"><td colSpan={5}>Ei poikkeavia perintöjä</td></tr>)
        }
      </tbody>
    </table>
  );
};

export default AbnormalDebts;
