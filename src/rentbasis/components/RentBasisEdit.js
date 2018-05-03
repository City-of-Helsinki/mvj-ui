// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentBasisForm from './forms/RentBasisForm';

const RentBasisEdit = () =>
  <ContentContainer>
    <GreenBoxEdit className='no-margin'>
      <RentBasisForm />
    </GreenBoxEdit>
  </ContentContainer>;

export default RentBasisEdit;
