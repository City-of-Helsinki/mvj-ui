// @flow
import React from 'react';
import {translate} from 'react-i18next';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FormField from '../../../components/form/FormField';
import GroupTitle from '../../../components/form/GroupTitle';

type Props = {
  attributes: Object,
  isOpenApplication: boolean,
  t: Function,
};

const BasicInfo = (props: Props) => {

  const typeOptions = props.attributes.type.choices.map(choice => ({
    id: choice.value,
    label: props.t(`types.${choice.value}`),
  }));

  return (
    <Row>

      {!props.isOpenApplication &&
      <Column medium={12}>
        <Field
          type="select"
          name="type"
          label="Tyyppi"
          placeholder="Valitse listalta..."
          options={typeOptions}
          component={FormField}
        />
      </Column>
      }

      <Column medium={12}>
        <Field
          type="checkbox"
          name="is_open"
          label="Avoin haku"
          options={[
            true,
          ]}
          component={FormField}
        />
      </Column>

      <Column medium={12}>
        <Field
          type="textarea"
          name="reasons"
          required={false}
          label="Hakemuksen perustelut"
          component={FormField}
        />
      </Column>

      <GroupTitle text="Tontin sijainti"/>

      <Column medium={6}>
        <Field
          type="text"
          required={false}
          name="land_address"
          label="Alue"
          placeholder="Alue"
          component={FormField}
        />
      </Column>

      <Column medium={6}>
        <Field
          type="text"
          required={false}
          name="map_map_link"
          label="Karttalinkki"
          component={FormField}
        />
      </Column>

      <GroupTitle text="Rakennettavat alat"/>

      <Column medium={6}>
        <Field
          type="text"
          name="use"
          label="Käyttötarkoitus"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="number"
          name="area"
          label="Ala (km²)"
          component={FormField}
        />
      </Column>

      <GroupTitle text="Vuokra-aika"/>

      <Column medium={6}>
        <Field
          type="text"
          label="Alkaa"
          required={false}
          placeholder="01.01.2015"
          name="lease_start_date"
          component={FormField}
        />
      </Column>
      <Column medium={6}>
        <Field
          type="text"
          label="loppuu"
          required={false}
          placeholder="01.01.2020"
          name="lease_end_date"
          component={FormField}
        />
      </Column>

    </Row>
  );
};

export default translate(['applications'])(BasicInfo);
