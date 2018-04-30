// @flow
import React from 'react';

import Contracts from './Contracts';
import Decisions from './Decisions';
import Divider from '$components/content/Divider';
import Inspections from './Inspections';

const DecisionsMain = () => {
  return (
    <div>
      <h2>Päätökset</h2>
      <Divider />
      <Decisions />

      <h2>Sopimukset</h2>
      <Divider />
      <Contracts/>

      <h2>Tarkastukset ja huomautukset</h2>
      <Divider />
      <Inspections/>
    </div>
  );
};

export default DecisionsMain;
