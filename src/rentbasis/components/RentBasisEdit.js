// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentBasisForm from './forms/RentBasisForm';

import type {Attributes} from '../types';

type Props = {
  attributes: Attributes,
}

const RentBasisEdit = ({attributes}: Props) =>
  <ContentContainer>
    <GreenBoxEdit className='no-margin'>
      <RentBasisForm
        attributes={attributes}
      />
    </GreenBoxEdit>
  </ContentContainer>;

export default RentBasisEdit;
