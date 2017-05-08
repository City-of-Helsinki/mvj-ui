// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormField from '../../components/form/FormField';
// type Props = {};

const Summary = () => {

  return (
    <div>

      <section className="summary__header">
        <Row>
          <Column medium={6}>
            <h2>Tallenna hakemus valmisteltavaksi</h2>
            <p>Tarkista hakijan tiedot ja määritä hakijalle sopiva kohde. Luo vuokraustunnus ja tallenna hakemus
              valmisteltavaksi.</p>
          </Column>

          <Column medium={6} className="lease">
            <label>Vuokraustunnus</label>
            <div className="lease__code">
              <Field
                type="text"
                required={false}
                name="a1"
                placeholder="A1"
                component={FormField}
              />
              <Field
                type="text"
                required={false}
                name="b1"
                placeholder="B1"
                component={FormField}
              />
              <Field
                type="text"
                required={false}
                name="c1"
                placeholder="C1"
                component={FormField}
              />
              <Field
                type="text"
                required={false}
                name="d1"
                placeholder="D1"
                component={FormField}
              />
            </div>

            <button className="button expanded">Tallenna hakemus valmisteltavaksi</button>
          </Column>
        </Row>
      </section>

    </div>
  );
};

export default Summary;
