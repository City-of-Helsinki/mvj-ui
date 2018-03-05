// @flow
import React from 'react';

import ContractsEdit from './ContractsEdit';
import Divider from '../../../../components/content/Divider';
import InspectionsEdit from './InspectionsEdit';
import RuleEdit from './RuleEdit';

type Props = {
  contracts: Array<Object>,
  inspections: Array<Object>,
  rules: Array<Object>,
}
const DecisionsMainEdit = ({
  contracts,
  inspections,
  rules,
}: Props) => {
  return (
    <div>
      <h1>Sopimukset</h1>
      <Divider />
      <ContractsEdit rules={rules} initialValues={{contracts: contracts}} />

      <h1>Päätökset</h1>
      <Divider />
      <RuleEdit initialValues={{rules: rules}} />

      <h1>Tarkastukset ja huomautukset</h1>
      <Divider />
      <InspectionsEdit initialValues={{inspections: inspections}} />
    </div>
  );
};

export default DecisionsMainEdit;
