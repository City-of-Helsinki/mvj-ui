// @flow
import React from 'react';

import Contracts from './Contracts';
import Divider from '$components/content/Divider';
import Inspections from './Inspections';
import Decisions from './Decisions';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contracts: Array<Object>,
  decisions: Array<Object>,
  inspections: Array<Object>,
}

const DecisionsMain = ({
  attributes,
  contracts,
  decisions,
  inspections,
}: Props) => {
  return (
    <div>
      <h1>Päätökset</h1>
      <Divider />
      <Decisions
        attributes={attributes}
        decisions={decisions}
      />

      <h1>Sopimukset</h1>
      <Divider />
      <Contracts contracts={contracts}/>

      <h1>Tarkastukset ja huomautukset</h1>
      <Divider />
      <Inspections inspections={inspections}/>
    </div>
  );
};

export default DecisionsMain;
