// @flow
import React, {Component} from 'react';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AbnormalDebts from './AbnormalDebts';
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
            <AbnormalDebts
              abnormalDebts={get(billing, 'abnormal_debts', [])}
            />
          </Column>
        </Row>
      </div>
    );
  }
}

export default Billing;
