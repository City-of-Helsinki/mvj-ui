// @flow
import React from 'react';
import flowRight from 'lodash/flowRight';
import {reduxForm, FieldArray} from 'redux-form';

import ContractItemsEdit from './ContractItemsEdit';
import FormSection from '$components/form/FormSection';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  decisionOptions: Array<Object>,
  handleSubmit: Function,
}

const ContractsEdit = ({
  attributes,
  decisionOptions,
  handleSubmit,
}: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormSection>
        <FieldArray
          attributes={attributes}
          component={ContractItemsEdit}
          decisionOptions={decisionOptions}
          name="contracts"
        />
      </FormSection>
    </form>
  );
};

const formName = 'contract-form';

export default flowRight(
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(ContractsEdit);
