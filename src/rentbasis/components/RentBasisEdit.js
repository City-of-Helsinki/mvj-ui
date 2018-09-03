// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentBasisForm from './forms/RentBasisForm';

type Props = {
  onOpenDeleteModal: Function,
}

const RentBasisEdit = ({onOpenDeleteModal}: Props) =>
  <ContentContainer>
    <GreenBoxEdit className='no-margin'>
      <RentBasisForm onOpenDeleteModal={onOpenDeleteModal}/>
    </GreenBoxEdit>
  </ContentContainer>;

export default RentBasisEdit;
