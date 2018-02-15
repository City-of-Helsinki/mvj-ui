// @flow
import React from 'react';

import Contracts from './Contracts';
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
      <Contracts contracts={contracts}/>
      <h1>Päätökset</h1>
      <Rules rules={rules}/>
      <h1>Tarkastukset ja huomautukset</h1>
      <Inspections inspections={inspections}/>
    </div>
  );
};

export default DecisionsMain;
