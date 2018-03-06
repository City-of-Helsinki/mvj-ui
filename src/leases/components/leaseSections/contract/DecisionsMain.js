// @flow
import React from 'react';

import Contracts from './Contracts';
import Divider from '$components/content/Divider';
import Inspections from './Inspections';
import Rules from './Rules';

type Props = {
  contracts: Array<Object>,
  inspections: Array<Object>,
  rules: Array<Object>,
}

const DecisionsMain = ({
  contracts,
  inspections,
  rules,
}: Props) => {
  return (
    <div>
      <h1>Sopimukset</h1>
      <Divider />
      <Contracts contracts={contracts}/>

      <h1>Päätökset</h1>
      <Divider />
      <Rules rules={rules}/>

      <h1>Tarkastukset ja huomautukset</h1>
      <Divider />
      <Inspections inspections={inspections}/>
    </div>
  );
};

export default DecisionsMain;
