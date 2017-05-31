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
  activeCondition: number,
  attributes: Object,
  handleCreate?: Function,
  handleDelete: Function,
  handleEdit?: Function,
  handleSubmit: Function,
  t: Function,
};

const validate = ({conditions}) => {
  const customConditions = {};

  return BaseValidator({
    conditions,
  }, customConditions);
};

const TenantsEdit = ({handleSubmit, handleEdit, handleCreate, handleDelete, t, activeCondition, attributes}: Props) => {
  const isEditing = activeCondition !== null;
  const condition = isEditing ? activeCondition : 'NEW';
  const saveMethod = isEditing ? handleEdit : handleCreate;
  const buttonText = isEditing ? 'save' : 'add';
  const getOptions = (field) => field.map(({value}) => ({value, label: t(`leases:conditions.types.${value}`)}));
  const typeOpts = getOptions(get(attributes, 'conditions.child.children.type.choices'));

  return (
    <form onSubmit={handleSubmit(saveMethod)}>
      <div className="edit-modal__content">

        <Row className="edit-modal__section">
          <Column medium={6}>
            <Field
              label={t('common:type')}
              name={`conditions[${condition}].type`}
              required={true}
              type="select"
              options={typeOpts}
              component={FormField}
            />
          </Column>
          <Column medium={6}>
            <Field
              label={t('common:description')}
              name={`conditions[${condition}].description`}
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
  reduxForm({
    form: 'preparer-form',
    destroyOnUnmount: false,
    validate,
  }),
  translate(['common', 'leases']),
)(TenantsEdit);
