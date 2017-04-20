import React from 'react';
import {Field} from 'redux-form';
import FormField from '../../components/form/FormField';

const BasicInfo = () => (
  <div>
    <Field
      type="select"
      name="select"
      placeholder="Jotain"
      component={FormField}
      label='Test field'
      hint='Lorem ipsum color.'
      options={[
        {id: 1, label: 'Eka'},
        {id: 2, label: 'Toka'},
        {id: 3, label: 'Kolmas'},
      ]}
    />

    <Field
      type="checkbox"
      name="checkbox"
      component={FormField}
      label='Test field'
      hint='Lorem ipsum color.'
      options={[
        'Eka',
        'Toka',
        'Kolmas',
      ]}
    />

    <Field
      type="radio"
      name="radio"
      component={FormField}
      label='Test field'
      hint='Lorem ipsum color.'
      options={[
        'Eka',
        'Toka',
        'Kolmas',
      ]}
    />

    <Field
      type="text"
      name="basic"
      placeholder="Test placeholder"
      component={FormField}
      label='Test field'
      hint='Lorem ipsum color.'
    />
  </div>
);

export default BasicInfo;
