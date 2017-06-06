// @flow
import React from 'react';
import flowRight from 'lodash/flowRight';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {translate} from 'react-i18next';
import GroupTitle from '../../../components/form/GroupTitle';
import FormField from '../../../components/form/FormField';
import {BaseValidator} from '../../../components/form/validation';

type Props = {
  activeTenant: number,
  handleEdit?: Function,
  handleCreate?: Function,
  handleSubmit: Function,
  handleDelete: Function,
  t: Function,
};

const validate = ({tenants}) => {
  const customConditions = {};

  return BaseValidator({
    tenants,
  }, customConditions);
};

const TenantsEdit = ({handleSubmit, handleEdit, handleCreate, handleDelete, t, activeTenant}: Props) => {
  const isEditing = activeTenant !== null;
  const saveMethod = isEditing ? handleEdit : handleCreate;
  const buttonText = isEditing ? 'save' : 'add';

  return (
    <form onSubmit={handleSubmit(saveMethod)}>
      <div className="edit-modal__content">

        <Row className="edit-modal__section">
          <GroupTitle text="Organisaatio"/>
          <Column medium={6}>
            <Field
              label="Yrityksen nimi"
              name="contact.organization_name"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={6}>
            <Field
              label="Y-tunnus"
              name="contact.organization_id"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={6}>
            <Field
              label="Liikevaihto (€)"
              name="contact.organization_revenue"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={6}>
            <Field
              label="Osoite"
              name="contact.organization_address"
              required={true}
              type="textarea"
              component={FormField}
            />
          </Column>
        </Row>

        <Row>
          <GroupTitle text="Yhteyshenkilö"/>
          <Column medium={4}>
            <Field
              label="Nimi"
              name="contact.name"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={4}>
            <Field
              label="Sähköposti"
              name="contact.email"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={4}>
            <Field
              label="Puhelinnumero"
              name="contact.phone"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
        </Row>

        <Row>
          <GroupTitle text="Laskutustiedot"/>
          <Column medium={4}>
            <Field
              label="Yhteyshenkilö"
              name="billing_contact.name"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={4}>
            <Field
              label="Laskutusosoite"
              name="billing_contact.billing_address"
              required={true}
              type="textarea"
              component={FormField}
            />
          </Column>
          <Column medium={4}>
            <Field
              label="Sähköinen laskutusosoite"
              name="billing_contact.electronic_billing_details"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
        </Row>

        <Row className="edit-modal__section edit-modal__actions">
          {isEditing &&
          <a className="edit-modal__delete" onClick={handleDelete}>{t('remove')}</a>
          }
          <button className="edit-modal__save">{t(buttonText)}</button>
        </Row>
      </div>
    </form>
  );
};

export default flowRight(
  connect(
    (state, {activeTenant}) => ({
      initialValues: activeTenant,
    })
  ),
  reduxForm({
    form: 'tenantsEditForm',
    validate,
  }),
  translate(['common']),
)(TenantsEdit);
