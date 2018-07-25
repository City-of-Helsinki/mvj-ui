// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {getContentContracts} from '$src/landUseContract/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getAttributes, getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {Attributes, LandUseContract} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  currentLandUseContract: LandUseContract,
}

const Contracts = ({attributes, currentLandUseContract}: Props) => {
  const contracts = getContentContracts(currentLandUseContract),
    stateOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.state');

  const getContractTitle = (contract: ?Object) => {
    if(!contract) {
      return null;
    }
    return `${getLabelOfOption(stateOptions, contract.state) || '-'}`;
  };

  return (
    <div>
      {!contracts.length && <p>Ei sopimuksia</p>}
      {!!contracts.length && contracts.map((contract, index) => {
        return (
          <Collapse
            key={index}
            defaultOpen={true}
            headerTitle={
              <h3 className='collapse__header-title'>{getContractTitle(contract) || '-'}</h3>
            }
          >
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Sopimuksen vaihe</FormFieldLabel>
                <p>{getLabelOfOption(stateOptions, contract.state) || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Päätöspvm</FormFieldLabel>
                <p>{formatDate(contract.decision_date) || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Allekirjoituspvm</FormFieldLabel>
                <p>{formatDate(contract.sign_date) || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>ED sopimusnumero</FormFieldLabel>
                <p>{contract.ed_contract_number || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Diaarinumero</FormFieldLabel>
                {contract.reference_number
                  ? <a target='_blank' href={getReferenceNumberLink(contract.reference_number)}>{contract.reference_number}</a>
                  : <p>-</p>
                }
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Aluejärjestelyt</FormFieldLabel>
                <p>{contract.area_arrengements ? 'Kyllä' : 'Ei'}</p>
              </Column>
            </Row>
          </Collapse>
        );
      })}
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLandUseContract: getCurrentLandUseContract(state),
    };
  }
)(Contracts);
