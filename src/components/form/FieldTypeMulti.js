// @flow
import React from 'react';
import {translate} from 'react-i18next';
import classnames from 'classnames';
import FormField from './FormField';
import {Field} from 'redux-form';

type Props = {
  className?: String,
  fields: Object,
  fieldValues: Array<any>,
  t: Function,
}

const FieldTypeMulti = ({className, fields, fieldValues, t}: Props) => {
  return (
    <div className={classnames('multi-container', className)}>
      {fields.map((row, index) => {
        return (
          <div key={index} className="multi-container__row">
            {fieldValues.map(({name, type, label, required, ...rest}, i) => (
              <Field
                component={FormField}
                key={i}
                label={label}
                name={`${row}.${name}`}
                required={required}
                type={type}
              />
            ))}
            <button
              className="multi-container__remove"
              type="button"
              onClick={() => fields.remove(index)}>
              <i className="material-icons">delete_forever</i>
            </button>
          </div>
        );
      })}
      <button className="multi-container__add" type="button" onClick={() => fields.push()}>{t('add')}</button>
    </div>
  );
};

export default translate(['common'])(FieldTypeMulti);
