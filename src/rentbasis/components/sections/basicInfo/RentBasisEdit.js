// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentBasisForm from '$src/rentbasis/components/forms/RentBasisForm';

const RentBasisEdit = () =>
  <ContentContainer>
    <h2>Perustiedot</h2>
    <Divider />
    <GreenBoxEdit className='no-margin'>
      <RentBasisForm/>
    </GreenBoxEdit>
  </ContentContainer>;

export default RentBasisEdit;
