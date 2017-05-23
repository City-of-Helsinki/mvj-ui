// @flow
import React from 'react';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {Field, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {translate} from 'react-i18next';
import FormField from '../../../components/form/FormField';
import {BaseValidator} from '../../../components/form/validation';

type Props = {
  activeRent: number,
  attributes: Object,
  handleCreate?: Function,
  handleDelete: Function,
  handleEdit?: Function,
  handleSubmit: Function,
  t: Function,
};

const validate = ({rents}) => {
  const customConditions = {};

  return BaseValidator({
    rents,
  }, customConditions);
};

const TenantsEdit = ({handleSubmit, handleEdit, handleCreate, handleDelete, t, activeRent, attributes}: Props) => {
  const isEditing = activeRent !== null;
  const rent = isEditing ? activeRent : 'NEW';
  const saveMethod = isEditing ? handleEdit : handleCreate;
  const buttonText = isEditing ? 'save' : 'add';
  const getOptions = (field) => field.map(({value}) => ({value, label: t(`leases.types.${value}`)}));
  const typeOpts = getOptions(get(attributes, 'rents.child.children.type.choices'));

  return (
    <form onSubmit={handleSubmit(saveMethod)}>
      <div className="edit-modal__content">

        <Row className="edit-modal__section">
          <Column medium={6}>
            <Field
              label="Tyyppi"
              name={`rents[${rent}].type`}
              required={true}
              type="select"
              options={typeOpts}
              component={FormField}
            />
          </Column>
          <Column medium={6}>
            <Field
              label="Käyttötarkoitus"
              name={`rents[${rent}].use`}
              required={true}
              type="text"
              component={FormField}
            />
          </Column>
          <Column medium={12}>
            <Field
              label="Summa"
              name={`rents[${rent}].amount`}
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
  translate(['common', 'leases']),
)(TenantsEdit);
