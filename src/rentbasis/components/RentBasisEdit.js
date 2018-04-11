// @flow
import React from 'react';

import ContentContainer from '$components/content/ContentContainer';
import Divider from '$components/content/Divider';
import RentBasisForm from './forms/RentBasisForm';
import GreenBoxEdit from '$components/content/GreenBoxEdit';

import type {Attributes} from '../types';

type Props = {
  attributes: Attributes,
  rentBasis: Object,
}

const RentBasisEdit = ({attributes, rentBasis}: Props) =>
  <ContentContainer>
    <h1>Vuokrausperuste</h1>
    <Divider />
    <GreenBoxEdit>
      <RentBasisForm
        attributes={attributes}
        initialValues={rentBasis}
      />
    </GreenBoxEdit>
  </ContentContainer>;

export default RentBasisEdit;
