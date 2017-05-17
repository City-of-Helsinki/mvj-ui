// @flow
import React from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import {translate} from 'react-i18next';

type Props = {
  className: String,
  disabled: Boolean,
  displayError: Boolean,
  input: Object,
  options: ?Array<any>,
  placeholder: String,
  t: Function,
}

const FieldTypeSelect = ({input, displayError, disabled, options, placeholder, t}: Props) => {
  const {name, onChange, value} = input;

  return (
    <Select
      autoBlur={true}
      className={classNames('form-field__select', {'has-error': displayError})}
      clearable={false}
      disabled={disabled}
      id={input.name}
      noResultsText={t('noResultsFound')}
      options={options}
      placeholder={placeholder}
      valueKey="id"
      {...input}
      onChange={({id}) => onChange(id)}
    />
  );
};

export default translate(['validation'])(FieldTypeSelect);
