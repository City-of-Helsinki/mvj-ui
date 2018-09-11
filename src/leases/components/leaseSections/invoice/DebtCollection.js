// @flow
import React from 'react';

import DebtCollectionForm from './forms/DebtCollectionForm';
import GreenBox from '$components/content/GreenBox';

const DebtCollection = () => {
  return(
    <GreenBox className='with-bottom-margin'>
      <DebtCollectionForm/>
    </GreenBox>
  );
};

export default DebtCollection;
