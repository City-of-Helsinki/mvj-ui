// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormField from '../../components/form/FormField';
import GroupTitle from '../../components/form/GroupTitle';

type Props = {
  isOpenApplication: boolean,
};

const TYPES = [
  {id: 1, label: 'Tyyppi 1'},
  {id: 2, label: 'Tyyppi 2'},
  {id: 3, label: 'Tyyppi 3'},
];

const BasicInfo = (props: Props) => {
  return (
    <Row>

      {!props.isOpenApplication &&
      <Column medium={12}>
        <Field
          type="select"
          name="type"
          label="Tyyppi"
          placeholder="Valitse listalta..."
          options={TYPES}
          component={FormField}
        />
      </Column>
      }

      <Column medium={12}>
        <Field
          type="checkbox"
          name="open_application"
          options={[
            'Avoin haku',
          ]}
          component={FormField}
        />
      </Column>

      <Column medium={12}>
        <Field
          type="textarea"
          name="arguments"
          label="Hakemuksen perustelut"
          component={FormField}
        />
      </Column>

      <GroupTitle text="Tontin sijainti"/>

      <Column medium={12}>
        <Field
          type="text"
          name="location"
          label="Alue"
          placeholder="Alue"
          component={FormField}
        />
      </Column>

      <Column medium={6}>
        <Field
          type="text"
          name="address"
          label="Osoite"
          placeholder="Osoite"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="text"
          name="map_link"
          label="Karttalinkki"
          component={FormField}
        />
      </Column>

      <GroupTitle text="Rakennettavat alat"/>

      <Column medium={6}>
        <Field
          type="text"
          name="usage"
          label="Käyttötarkoitus"
          placeholder="Käyttötarkoitus"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="text"
          name="area"
          label="Ala (km²)"
          component={FormField}
        />
      </Column>

      <GroupTitle text="Vuokra-aika"/>

      <Column medium={6}>
        <Field
          type="text"
          name="start"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="text"
          name="stop"
          component={FormField}
        />
      </Column>

    </Row>
  );
};

export default BasicInfo;
