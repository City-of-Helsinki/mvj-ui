// @flow
import React from 'react';

import ContractsEdit from './ContractsEdit';
import DecisionsEdit from './DecisionsEdit';
import Divider from '$components/content/Divider';
import InspectionsEdit from './InspectionsEdit';

const DecisionsMainEdit = () => {
  return(
    <div>
      <h2>Päätökset</h2>
      <Divider />
      <DecisionsEdit />

      <h2>Sopimukset</h2>
      <Divider />
      <ContractsEdit/>

      <h2>Tarkastukset ja huomautukset</h2>
      <Divider />
      <InspectionsEdit />
    </div>
  );
};

export default DecisionsMainEdit;
