// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import {formatDate,
  formatDateRange,
  formatDecimalNumbers,
  formatNumberWithThousandSeparator} from '../../../../util/helpers';
import BillsTable from './BillsTable';

type Props = {
  billing: Object,
}

class Billing extends Component {
  props: Props

  render() {
    const {billing} = this.props;

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
            <BillsTable
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
              bills={get(billing, 'bills')}
            />
          </Column>
        </Row>
        <Row><Column><h2>Poikkeavat perinnät</h2></Column></Row>
        <Row>
          <Column>
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
                {get(billing, 'abnormal_debts') && billing.abnormal_debts
                  ? (billing.abnormal_debts.map((debt, index) => {
                    return (
                      <tr key={index}>
                        <td>{`${get(debt, 'tenant.lastname')} ${get(debt, 'tenant.firstname')}`}</td>
                        <td>{get(debt, 'tenant.bill_share') ? `${get(debt, 'tenant.bill_share')} %` : '-'}</td>
                        <td>{debt.due_date ? formatDate(debt.due_date) : '-'}</td>
                        <td>{debt.amount ? `${formatNumberWithThousandSeparator(formatDecimalNumbers(debt.amount))} €` : '-'}</td>
                        <td>{formatDateRange(debt.start_date, debt.end_date)}</td>
                      </tr>
                    );
                  }))
                  : (<tr className="no-data"><td colSpan={5}>Ei poikkeavia perintöjä</td></tr>)
                }
              </tbody>
            </table>

          </Column>
        </Row>
      </div>
    );
  }
}

export default Billing;
