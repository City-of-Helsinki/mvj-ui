// @flow
import React from 'react';
// import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

// import FormField from '../../components/form/FormField';
// import GroupTitle from '../../components/form/GroupTitle';
import TenantsEdit from './TenantsEdit';

type Props = Object;

const Tenants = (props: Props) => {

  return (
    <Row className={props.className}>
      <Column medium={12}>
        <h2 className="tab__content--title">Vuokralaiset</h2>
      </Column>

      <Column medium={12}>
        <section className="tenants">
          <div className="tenant">
            <h3 className="tenant__title">Korporaatio Oy</h3>

            <div className="tenant__section">
              <h4>Hakija</h4>
              <p className="tenant__section--primary">Korporaation Yritys Oy</p>
              <p>12345678-9</p>
              <p>
                Mannerheimintie 12 <br/>
                00100 Helsinki <br/>
              </p>
              <p>1 000 000 €</p>
            </div>

            <div className="tenant__section">
              <h4>Laskutustiedot</h4>
              <p className="tenant__section--primary">John Doe</p>
              <p>
                Mannerheimintie 12 <br/>
                00100 Helsinki <br/>
              </p>
              <p>Basware</p>
            </div>

            <div className="tenant__section">
              <h4>Yhteyshenkilö</h4>
              <p className="tenant__section--primary">{props.contact_name}</p>
              <p>{props.contact_email}</p>
              <p>{props.contact_phone}</p>
            </div>

            <a onClick={() => props.onEdit(TenantsEdit)} className="tenant__edit">Muokkaa vuokralaisen tietoja</a>
          </div>
        </section>
      </Column>

      <Column medium={12} className="section__controls">
        <button className="add-new-button" onClick={() => props.onEdit(TenantsEdit)}>Lisää Vuokralainen</button>
      </Column>
    </Row>
  );
};

export default Tenants;
