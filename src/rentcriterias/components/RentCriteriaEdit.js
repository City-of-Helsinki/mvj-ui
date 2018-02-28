// @flow
import React from 'react';

import ContentContainer from '../../components/content/ContentContainer';
import Divider from '../../components/content/Divider';
import EditRentCriteriaForm from './forms/EditRentCriteriaForm';
import GreenBoxEdit from '../../components/content/GreenBoxEdit';

type Props = {
  criteria: Object,
}

const RentCriteriaEdit = ({criteria}: Props) =>
  <ContentContainer>
    <h1>Vuokrausperuste</h1>
    <Divider />
    <GreenBoxEdit>
      <EditRentCriteriaForm
        initialValues={criteria}
      />
    </GreenBoxEdit>
  </ContentContainer>;

export default RentCriteriaEdit;
