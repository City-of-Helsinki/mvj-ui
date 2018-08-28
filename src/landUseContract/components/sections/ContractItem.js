//@flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import ExternalLink from '$components/links/ExternalLink';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/landUseContract/enums';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';

type Props = {
  collapseState: boolean,
  contract: Object,
  receiveCollapseStates: Function,
  stateOptions: Array<Object>,
}

const ContractItem = ({
  collapseState,
  contract,
  receiveCollapseStates,
  stateOptions,
}: Props) => {

  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.CONTRACTS]: {
          [contract.id]: val,
        },
      },
    });
  };

  return (
    <Collapse
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle={<h3 className='collapse__header-title'>{getLabelOfOption(stateOptions, contract.state) || '-'}</h3>}
      onToggle={handleCollapseToggle}
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
            ? <ExternalLink
              href={getReferenceNumberLink(contract.reference_number)}
              label={contract.reference_number}
            />
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
};

export default connect(
  (state, props) => {
    const id = props.contract.id;

    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRACTS}.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItem);
