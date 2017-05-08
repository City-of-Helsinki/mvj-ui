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
        required={false}
        name="organization_name"
        label="Organisaatio"
        component={FormField}
      />
    </Column>
    <Column medium={6}>
      <Field
        type="text"
        required={false}
        name="organization_id"
        label="Y-tunnus"
        component={FormField}
      />
    </Column>

    <Column medium={12}>
      <Field
        type="textarea"
        required={false}
        name="contact_address"
        label="Katuosoite"
        component={FormField}
      />
    </Column>

    <Column medium={12}>
      <Field
        type="text"
        required={false}
        name="organization_revenue"
        label="Liikevaihto €"
        component={FormField}
      />
    </Column>

    <GroupTitle text="Laskutustiedot"/>

    <Column medium={12}>
      <Field
        type="textarea"
        required={false}
        name="contact_billing_address"
        label="Laskutusosoite"
        component={FormField}
      />
    </Column>
    <Column medium={12}>
      <Field
        type="text"
        required={false}
        name="contact_electronic_billing"
        label="Sähköinen laskutusosoite"
        component={FormField}
      />
    </Column>

    <GroupTitle text="Yhteyshenkilö"/>

    <Column medium={12}>
      <Field
        type="text"
        name="contact_name"
        label="Nimi"
        component={FormField}
      />
    </Column>

    <Column medium={6}>
      <Field
        type="text"
        name="contact_phone"
        label="Puhelinnumero"
        component={FormField}
      />
    </Column>
    <Column medium={6}>
      <Field
        type="email"
        name="contact_email"
        label="Sähköpostiosoite"
        component={FormField}
      />
    </Column>

  </Row>
);

export default ApplicantInfo;
