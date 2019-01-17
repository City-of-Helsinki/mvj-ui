//@flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import FormField from '$components/form/FormField';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FieldTypes} from '$components/enums';
import {FormNames} from '$src/landUseContract/enums';
import {getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  collapseState: boolean,
  contract: Object,
  contractsData: Array<Object>,
  contractId: number,
  errors: ?Object,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  receiveCollapseStates: Function,
  stateOptions: Array<Object>,
}

const ContractItemEdit = ({
  attributes,
  collapseState,
  contractsData,
  contractId,
  errors,
  field,
  isSaveClicked,
  onRemove,
  receiveCollapseStates,
  stateOptions,
}: Props) => {
  const handleCollapseChange = (val: boolean) => {
    if(!contractId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.CONTRACTS]: {
          [contractId]: val,
        },
      },
    });
  };

  const getContractById = (id: number) => {
    if(!id) {return {};}
    return contractsData.find((decision) => decision.id === id);
  };

  const getCollapseTitle = (contract: ?Object) => {
    if(!contract) {return '-';}
    return getLabelOfOption(stateOptions, contract.state) || '-';
  };

  const contractErrors = get(errors, field),
    savedContract = getContractById(contractId);

  return(
    <Collapse
      defaultOpen={collapseState !== undefined ? collapseState : true}
      hasErrors={isSaveClicked && !isEmpty(contractErrors)}
      headerTitle={<CollapseHeaderTitle>{getCollapseTitle(savedContract)}</CollapseHeaderTitle>}
      onRemove={onRemove}
      onToggle={handleCollapseChange}
    >
      <BoxContentWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.state')}
              name={`${field}.state`}
              overrideValues={{
                label: 'Sopimuksen vaihe',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.decision_date')}
              name={`${field}.decision_date`}
              overrideValues={{
                label: 'Päätöspvm',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.sign_date')}
              name={`${field}.sign_date`}
              overrideValues={{
                label: 'Allekirjoituspvm',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.ed_contract_number')}
              name={`${field}.ed_contract_number`}
              overrideValues={{
                label: 'ED sopimusnumero',
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.reference_number')}
              name={`${field}.reference_number`}
              validate={referenceNumber}
              overrideValues={{
                label: 'Diaarinumero',
                fieldType: FieldTypes.REFERENCE_NUMBER,
              }}
            />
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'contracts.child.children.area_arrengements')}
              name={`${field}.area_arrengements`}
              overrideValues={{
                label: 'Aluejärjestelyt',
              }}
            />
          </Column>
        </Row>
      </BoxContentWrapper>
    </Collapse>
  );
};

const formName = FormNames.CONTRACTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);

    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.${id}`),
      contractId: id,
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItemEdit);
