// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import {formatDate, formatDateRange, formatDecimalNumbers, formatNumberWithThousandSeparator} from '../../../../util/helpers';
import {} from '../../../../util/helpers';
import TableFixedHeader from '../../../../components/TableFixedHeader';

type Props = {
  billing: Object,
}

const getTableBody = (bills: Array<Object>, onRowClick: Function) => {
  if(!bills || bills.length === 0) {
    return (
      <tbody></tbody>
    );
  }

  return (
    <tbody>
      {bills.map((bill, index) => {
        return (
          <tr key={index} onClick={() => onRowClick(bill)}>
            <td>{`${get(bill, 'tenant.lastname')} ${get(bill, 'tenant.firstname')}`}</td>
            <td>{get(bill, 'tenant.bill_share') ? `${get(bill, 'tenant.bill_share')} %` : '-'}</td>
            <td>{bill.due_date ? formatDate(bill.due_date) : '-'}</td>
            <td>{bill.bill_number ? bill.bill_number : '-'}</td>
            <td>{formatDateRange(bill.billing_period_start_date, bill.billing_period_end_date)}</td>
            <td>{bill.type ? bill.type : '-'}</td>
            <td>{bill.status ? bill.status : '-'}</td>
            <td>{bill.invoiced_amount ? formatNumberWithThousandSeparator(formatDecimalNumbers(bill.invoiced_amount)) : '-'}</td>
            <td>{bill.unpaid_amount ? formatNumberWithThousandSeparator(formatDecimalNumbers(bill.unpaid_amount)) : '-'}</td>
            <td>{bill.informed ? 'Kyllä' : 'Ei'}</td>
            <td>{bill.sent_to_SAP_date ? formatDate(bill.sent_to_SAP_date) : '-'}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

const Billing = ({billing}: Props) => {
  console.log(billing);
  return (
    <div className="lease-section billing-section">
      <Row>
        <Column medium={9}><h1>Laskutus</h1></Column>
        <Column medium={3}>
          {billing.billing_started
            ? (<p className="success">Laskutus käynnissä<i /></p>)
            : (<p className="alert">Laskutus ei käynnissä<i /></p>)
          }
        </Column>
      </Row>
      <Row><Column><div className="separator-line"></div></Column></Row>
      <Row><Column><h2>Laskut</h2></Column></Row>
      <Row>
        <Column>
          <TableFixedHeader
            headers={[
              'Vuokraaja',
              'Osuus',
              'Eräpäivä',
              'Laskun numero',
              'Laskutuskausi',
              'Saamislaji',
              'Laskun tila',
              'Laskutettu',
              'Maksamatta',
              'Tiedote',
              'Läh. SAP:iin',
            ]}
            body={getTableBody(
              get(billing, 'bills', []),
              (bill) => {console.log(bill);}
            )}
          />
        </Column>
      </Row>
    </div>
  );
};

export default Billing;
