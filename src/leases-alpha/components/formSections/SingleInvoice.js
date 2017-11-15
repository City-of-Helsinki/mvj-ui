import React from 'react';
import {Column, Row} from 'react-foundation';

const SingleInvoice = () => (
  <Row>
    <Column medium={12}>
      <h1 className="tab__content--title">Lasku 512748</h1>
    </Column>

    <Column medium={12}>
      <section className="tenants">

        <div className="tenant">
          <div className="tenant__section">
            <h4>Vuokraustunnus</h4>
            <p className="tenant__section--primary">A1-1-43-123</p>
          </div>

          <div className="tenant__section">
            <h4>Laskunsaaja</h4>
            <p className="tenant__section--primary">97698 Yritys Oy</p>
          </div>

          <div className="tenant__section">
            <h4>Viite</h4>
            <p className="tenant__section--primary">91152 76678 12345</p>
          </div>
        </div>

        <div className="tenant">
          <div className="tenant__section">
            <h4>Eräpäivä</h4>
            <p className="tenant__section--primary">A1-1-43-123</p>
          </div>

          <div className="tenant__section">
            <h4>Tila</h4>
            <p className="tenant__section--primary">97698 Yritys Oy</p>
          </div>

          <div className="tenant__section">
            <h4>Laskutuslaji</h4>
            <p className="tenant__section--primary">91152 76678 12345</p>
          </div>
        </div>

        <div className="tenant">
          <div className="tenant__section">
            <h4>Laskutuskausi</h4>
            <p className="tenant__section--primary">A1-1-43-123</p>
          </div>

          <div className="tenant__section">
            <h4>Lykkäyslaji</h4>
            <p className="tenant__section--primary">97698 Yritys Oy</p>
          </div>

        </div>
        <h3 className="tenant__title">...</h3>
      </section>
    </Column>
  </Row>
);

export default SingleInvoice;
