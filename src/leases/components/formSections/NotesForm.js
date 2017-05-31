// @flow
import React from 'react';
import {Field, reduxForm, reset} from 'redux-form';
import FormField from '../../../components/form/FormField';
import flowRight from 'lodash/flowRight';
import {translate} from 'react-i18next';

type Props = {
  handleSubmit: Function,
  invalid: boolean,
  onSubmit: Function,
  pristine: boolean,
  t: Function,
};

const NotesForm = ({t, handleSubmit, onSubmit, pristine, invalid}: Props) => {

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>{t('notes.new')}</label>
      <Field
        name="text"
        required={true}
        type="textarea"
        placeholder={t('notes.single')}
        component={FormField}
      />
      <button className="button" disabled={pristine || invalid}>{t('save')}</button>
    </form>
  );
};

export default flowRight(
  reduxForm({
    form: 'notes-form',
    onSubmitSuccess: (result, dispatch) => dispatch(reset('notes-form')),
  }),
  translate(['common', 'leases'])
)(NotesForm);
