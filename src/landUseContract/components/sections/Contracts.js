// @flow
import React from 'react';
import {connect} from 'react-redux';

import ContractItem from './ContractItem';
import FormText from '$components/form/FormText';
import {getContentContracts} from '$src/landUseContract/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes, getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/types';
import type {LandUseContract} from '$src/landUseContract/types';

type Props = {
  attributes: Attributes,
  currentLandUseContract: LandUseContract,
}

const Contracts = ({attributes, currentLandUseContract}: Props) => {
  const contracts = getContentContracts(currentLandUseContract),
    stateOptions = getAttributeFieldOptions(attributes, 'contracts.child.children.state');

  return (
    <div>
      {!contracts.length && <FormText className='no-margin'>Ei sopimuksia</FormText>}
      {!!contracts.length && contracts.map((contract, index) => {
        return (
          <ContractItem
            key={index}
            contract={contract}
            stateOptions={stateOptions}
          />
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
