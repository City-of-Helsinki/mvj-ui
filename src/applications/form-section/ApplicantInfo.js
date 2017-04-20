import React from 'react';
import {Field} from 'redux-form';
import FormField from '../../components/form/FormField';

const ApplicantInfo = () => (
  <Field
    type="text"
    name="applicant"
    placeholder="Applicant"
    component={FormField}
    label='Applicant field'
    hint='Lorem ipsum color.'
  />
);

export default ApplicantInfo;
