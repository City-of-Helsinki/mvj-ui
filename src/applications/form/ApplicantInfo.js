import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormField from '../../components/form/FormField';
import GroupTitle from '../../components/form/GroupTitle';


const ApplicantInfo = () => (
  <Row>

    <Column medium={6}>
      <Field
        type="text"
        name="organisation"
        label="Organisaatio"
        placeholder="Organisaatio"
        component={FormField}
      />
    </Column>
    <Column medium={6}>
      <Field
        type="text"
        name="company_code"
        label="Y-tunnus"
        component={FormField}
      />
    </Column>

    <Column medium={6}>
      <Field
        type="text"
        name="organisation_street"
        label="Katuosoite"
        component={FormField}
      />
    </Column>
    <Column medium={6}>
      <Field
        type="number"
        name="zip"
        label="Postinumero"
        component={FormField}
      />
    </Column>

    <Column medium={12}>
      <Field
        type="text"
        name="value"
        label="Liikevaihto €"
        component={FormField}
      />
    </Column>

    <GroupTitle text="Laskutustiedot"/>

    <GroupTitle text="Yhteyshenkilö"/>

    <Column medium={12}>
      <Field
        type="text"
        name="name"
        label="Nimi"
        component={FormField}
      />
    </Column>

    <Column medium={6}>
      <Field
        type="text"
        name="phone"
        label="Puhelinnumero"
        component={FormField}
      />
    </Column>
    <Column medium={6}>
      <Field
        type="email"
        name="email"
        label="Sähköpostiosoite"
        component={FormField}
      />
    </Column>

  </Row>
);

export default ApplicantInfo;
