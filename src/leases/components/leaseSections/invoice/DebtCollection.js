// @flow
import React from 'react';

import Collapse from '$components/collapse/Collapse';
import DebtCollectionForm from './forms/DebtCollectionForm';

const DebtCollection = () => {
  return(
    <Collapse
      defaultOpen={true}
      headerTitle={<h3 className='collapse__header-title'>Perintä</h3>}
    >
      <DebtCollectionForm
      />
    </Collapse>
  );
};

export default DebtCollection;
