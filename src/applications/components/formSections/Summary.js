// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormField from '../../../components/form/FormField';
import {formatDateObj} from '../../../util/helpers';
type Props = Object;

const getOptions = (field) => field.map(({value, display_name}) => ({value, label: display_name}));

const Summary = (props: Props) => {

  return (
    <Row className={props.className}>
      <Column medium={12}>
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
                  name="identifier_type"
                  placeholder="Tyyppi"
                  required={false}
                  type="select"
                  options={getOptions(props.type)}
                  component={FormField}
                />
                <Field
                  name="identifier_municipality"
                  placeholder="Kunta"
                  required={false}
                  type="select"
                  options={getOptions(props.municipality)}
                  component={FormField}
                />
                <Field
                  name="identifier_district"
                  placeholder="Alue"
                  required={false}
                  type="select"
                  options={getOptions(props.district)}
                  component={FormField}
                />
                {/*<Field*/}
                  {/*type="text"*/}
                  {/*required={false}*/}
                  {/*name="identifier_code"*/}
                  {/*component={FormField}*/}
                {/*/>*/}
              </div>

              <button className="button expanded">Tallenna hakemus valmisteltavaksi</button>
            </Column>
          </Row>
        </section>

        <section className="summary__body">
          <Row>
            <Column medium={6}>
              <h2>Yhteenveto</h2>
              <strong>Vuokralaiset</strong>
              <strong>Kohde</strong>
              <strong>Vuokra</strong>
              <strong>Laskutus</strong>
            </Column>

            <Column medium={6}>
              <strong>Hakemuksen tila</strong>

              <ul className="application__state">
                <li className="active">
                  <span>Hakemus vastaanotettu <span>{formatDateObj(props.created_at)}</span></span></li>
                <li><span>Vuokrauksen valmistelu</span></li>
                <li><span>Vuokrausehdotus</span></li>
                <li><span>Vuokrauspäätös</span></li>
              </ul>
            </Column>
          </Row>
        </section>

      </Column>
    </Row>
  );
};

export default Summary;
