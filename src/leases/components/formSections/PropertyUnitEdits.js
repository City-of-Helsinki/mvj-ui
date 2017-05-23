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
  const realPropertyUnit = isEditing ? activePropertyUnit : 'NEW';
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
              name={`real_property_units[${realPropertyUnit}].identification_number`}
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={4}>
            <Field
              label="Nimi"
              name={`real_property_units[${realPropertyUnit}].name`}
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={4}>
            <Field
              label="Pinta-ala"
              name={`real_property_units[${realPropertyUnit}].area`}
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
  reduxForm({
    form: 'preparer-form',
    destroyOnUnmount: false,
    validate,
  }),
  translate(['common']),
)(PropertyUnitEdit);
