// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RentBasisForm from './forms/RentBasisForm';

import type {Attributes} from '../types';

type Props = {
  attributes: Attributes,
}

const RentBasisEdit = ({attributes}: Props) =>
  <ContentContainer>
    <h1>Vuokrausperuste</h1>
    <Divider />
    <GreenBoxEdit>
      <RentBasisForm
        attributes={attributes}
      />
    </GreenBoxEdit>
  </ContentContainer>;

export default RentBasisEdit;
