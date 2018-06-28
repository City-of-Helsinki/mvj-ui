// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {getContentLandUseContractContracts} from '$src/landUseContract/helpers';
import {formatDate} from '$util/helpers';
import {getCurrentLandUseContract} from '$src/landUseContract/selectors';

import type {LandUseContract} from '$src/landUseContract/types';

type Props = {
  currentLandUseContract: LandUseContract,
}

const Contracts = ({currentLandUseContract}: Props) => {
  const contracts = getContentLandUseContractContracts(currentLandUseContract);
  return (
    <div>
      {!contracts.length && <p>Ei sopimuksia</p>}
      {!!contracts.length && contracts.map((contract, index) => {
        return (
          <Collapse
            key={index}
            defaultOpen={true}
            headerTitle={
              <h3 className='collapse__header-title'>{contract.state || '-'}</h3>
            }
          >
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Sopimuksen vaihe</FormFieldLabel>
                <p>{contract.state || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Päätöspvm</FormFieldLabel>
                <p>{formatDate(contract.decision_date) || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Allekirjoitettu</FormFieldLabel>
                <p>{formatDate(contract.sign_date) || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>ED sopimusnumero</FormFieldLabel>
                <p>{contract.ed_contract_number || '-'}</p>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel>Diaarinumero</FormFieldLabel>
                <p>{contract.reference_number || '-'}</p>
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
      currentLandUseContract: getCurrentLandUseContract(state),
    };
  }
)(Contracts);
