// @flow
import React from 'react';
import flowRight from 'lodash/flowRight';
import {Field, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {translate} from 'react-i18next';
import GroupTitle from '../../../components/form/GroupTitle';
import FormField from '../../../components/form/FormField';
import {BaseValidator} from '../../../components/form/validation';

type Props = {
  handleSubmit: Function,
  handleSave: Function,
  t: Function,
};

const validate = ({organization, organization_id, name, email, phone, contact_name, contact_email, contact_phone}) => {

  const customConditions = {};

  return BaseValidator({
    organization, organization_id, name, email, phone, contact_name, contact_email, contact_phone,
  }, customConditions);
};


const fields = {
  organization: [
    {name: 'organization', label: 'Organisaatio', required: true},
    {name: 'organization_id', label: 'Y-tunnus', required: true},
    {name: 'value', label: 'Liikevaihto', required: false},
    {name: 'address', label: 'Osoite', required: false},
    {name: 'city', label: 'Paikkakunta', required: false},
    {name: 'zip', label: 'Postinumero', required: false},
  ],
  billing: [
    {name: 'name', label: 'Nimi', required: true},
    {name: 'email', label: 'Sähköpostiosoite', required: true},
    {name: 'phone', label: 'Puhelinnumero', required: true},
  ],
  contact: [
    {name: 'contact_name', label: 'Nimi', required: true},
    {name: 'contact_email', label: 'Sähköpostiosoite', required: true},
    {name: 'contact_phone', label: 'Puhelinnumero', required: true},
  ],
};

const TenantsEdit = ({handleSubmit, handleSave, t}: Props) => {
  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <div className="edit-modal__content">
        <h1>Korporaatio Yritys Oy</h1>

        <Row className="edit-modal__section">
          <GroupTitle text="Organisaatio"/>
          {fields.organization.map(({name, label, required}, i) => (
            <Column key={i} medium={4}>
              <Field
                label={label}
                name={name}
                required={required}
                type="text"
                component={FormField}
              />
            </Column>
          ))}
        </Row>

        <Row className="edit-modal__section">
          <GroupTitle text="Laskutustiedot"/>
          {fields.billing.map(({name, label, required}, i) => (
            <Column key={i} medium={4}>
              <Field
                label={label}
                name={name}
                required={required}
                type="text"
                component={FormField}
              />
            </Column>
          ))}
        </Row>

        <Row className="edit-modal__section">
          <GroupTitle text="Yhteystiedot"/>
          {fields.contact.map(({name, label, required}, i) => (
            <Column key={i} medium={4}>
              <Field
                label={label}
                name={name}
                required={required}
                type="text"
                component={FormField}
              />
            </Column>
          ))}
        </Row>

        <Row className="edit-modal__section edit-modal__actions">
          <button className="edit-modal__save">{t('save')}</button>
        </Row>
      </div>
    </form>
  );
};

export default flowRight(
  reduxForm({
    form: 'tenants-edit-form',
    validate,
  }),
  translate(['common']),
)(TenantsEdit);
