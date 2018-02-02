// @flow
import React from 'react';

import ContractEdit from './ContractEdit';
import InspectionEdit from './InspectionEdit';
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
      <div>
        <ContractEdit rules={rules} initialValues={{contracts: contracts}}/>
      </div>
      <h1>Päätökset</h1>
      <div>
        <RuleEdit initialValues={{rules: rules}}/>
      </div>
      <h1>Tarkastukset ja huomautukset</h1>
      <div>
        <InspectionEdit initialValues={{inspections: inspections}}/>
      </div>
    </div>
  );
};

export default DecisionsMainEdit;
