// @flow
import React from 'react';

import ContractsEdit from './ContractsEdit';
import Divider from '$components/content/Divider';
import InspectionsEdit from './InspectionsEdit';
import DecisionsEdit from './DecisionsEdit';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contracts: Array<Object>,
  decisions: Array<Object>,
  inspections: Array<Object>,

}
const DecisionsMainEdit = ({
  attributes,
  contracts,
  decisions,
  inspections,
}: Props) => {
  return (
    <div>
      <h1>Päätökset</h1>
      <Divider />
      <DecisionsEdit
        attributes={attributes}
        initialValues={{decisions: decisions}}
      />

      <h1>Sopimukset</h1>
      <Divider />
      <ContractsEdit rules={decisions} initialValues={{contracts: contracts}} />

      <h1>Tarkastukset ja huomautukset</h1>
      <Divider />
      <InspectionsEdit initialValues={{inspections: inspections}} />
    </div>
  );
};

export default DecisionsMainEdit;
