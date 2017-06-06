// @flow
import React from 'react';
import {Field} from 'redux-form';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';

import FormField from '../../../components/form/FormField';
import {formatDateObj, getTenantsYearlyShare} from '../../../util/helpers';
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
            </Column>
          </Row>
        </section>

        <section className="summary__body">
          <Row>
            <Column medium={6}>
              <h2>Yhteenveto</h2>
              <div className="cards">
                <div className="cards__title">Vuokralaiset</div>
                {props.tenants && props.tenants.map((tenant, i) =>
                  <div key={i} className="cards__item">
                    <span className="cards__item--main">
                      {get(tenant, 'contact.organization_name') || get(tenant, 'contact.name')}
                    </span>
                    {get(tenant, 'contact.organization_id')}
                  </div>
                )}

                <div className="cards__title">Kohteet</div>
                {props.real_property_units && props.real_property_units.map((unit, i) =>
                  <div key={i} className="cards__item">
                    <span className="cards__item--main">
                      {get(unit, 'identification_number')}
                    </span>
                    {get(unit, 'name')}
                  </div>
                )}

                <div className="cards__title">Vuokrat</div>
                {props.rents && props.rents.map((rent, i) =>
                  <div key={i} className="cards__item">
                    <span className="cards__item--main">
                      {get(rent, 'use')}
                    </span>
                    {get(rent, 'amount')}€/v
                  </div>
                )}

                <div className="cards__title">Laskutus</div>
                {props.tenants && props.tenants.map((tenant, i) =>
                  <div key={i} className="cards__item">
                    <span className="cards__item--main">
                      {get(tenant, 'contact.organization_name') || get(tenant, 'contact.name')}
                    </span>
                    {getTenantsYearlyShare(tenant, props.rents)}€/v
                  </div>
                )}

              </div>
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
