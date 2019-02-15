// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import GreenBox from '$components/content/GreenBox';
import RentBasisForm from '$src/rentbasis/components/forms/RentBasisForm';

const RentBasisEdit = () =>
  <ContentContainer>
    <h2>Perustiedot</h2>
    <Divider />
    <GreenBox className='no-margin'>
      <RentBasisForm/>
    </GreenBox>
  </ContentContainer>;

export default RentBasisEdit;
