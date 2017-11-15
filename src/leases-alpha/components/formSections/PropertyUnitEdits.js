// @flow
import React from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {Field, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {translate} from 'react-i18next';
import GroupTitle from '../../../components-alpha/form/GroupTitle';
import FormField from '../../../components-alpha/form/FormField';
import {BaseValidator} from '../../../components-alpha/form/validation';

type Props = {
  activePropertyUnit: number,
  handleCreate: Function,
  handleSubmit: Function,
  handleEdit: Function,
  handleDelete: Function,
  t: Function,
};

const validate = ({tenants}) => {
  const customConditions = {};

  return BaseValidator({
    tenants,
  }, customConditions);
};

const PropertyUnitEdit = ({handleSubmit, handleEdit, handleCreate, handleDelete, t, activePropertyUnit}: Props) => {
  const isEditing = activePropertyUnit !== null;
  const saveMethod = isEditing ? handleEdit : handleCreate;
  const buttonText = isEditing ? 'save' : 'add';

  return (
    <form onSubmit={handleSubmit(saveMethod)}>
      <div className="edit-modal__content">

        <Row className="edit-modal__section">
          <GroupTitle text="Kiinteistö"/>
          <Column medium={4}>
            <Field
              label="Kiinteistötunnus"
              name="identification_number"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={4}>
            <Field
              label="Nimi"
              name="name"
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={4}>
            <Field
              label="Pinta-ala"
              name="area"
              required={true}
              type="number"
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
    (state, {activePropertyUnit}) => ({
      initialValues: activePropertyUnit,
    })
  ),
  reduxForm({
    form: 'propertyUnitsEditForm',
    validate,
  }),
  translate(['common']),
)(PropertyUnitEdit);
