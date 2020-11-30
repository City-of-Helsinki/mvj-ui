//@flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import Collapse from '$components/collapse/Collapse';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {receiveCollapseStates} from '$src/landUseContract/actions';
import {FormNames, ViewModes} from '$src/enums';
import {formatDate, getLabelOfOption} from '$util/helpers';
import {getCollapseStateByKey} from '$src/landUseContract/selectors';
import Warrants from './Warrants';

type Props = {
  attributes: Object,
  collapseState: boolean,
  contract: Object,
  receiveCollapseStates: Function,
  stateOptions: Array<Object>,
  contractTypeOptions: Array<Object>,
  decisionOptions: Array<Object>,
}

const ContractItem = ({
  attributes,
  collapseState,
  contract,
  receiveCollapseStates,
  stateOptions,
  contractTypeOptions,
  decisionOptions,
}: Props) => {

  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_CONTRACTS]: {
          [contract.id]: val,
        },
      },
    });
  };

  return (
    <Collapse
      defaultOpen={collapseState !== undefined ? collapseState : true}
      headerTitle={`${getLabelOfOption(contractTypeOptions, contract.type) || '-'} ${contract.ed_contract_number}`}
      onToggle={handleCollapseToggle}
    >
      <Row>
        {console.log(contract)}
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Sopimuksen tyyppi'
            text={getLabelOfOption(contractTypeOptions, contract.type) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Sopimuksen vaihe'
            text={getLabelOfOption(stateOptions, contract.state) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Allekirjoituspvm'
            text={formatDate(contract.sign_date) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='ED sopimusnumero'
            text={contract.ed_contract_number || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Aluejärjestelyt'
            text={contract.area_arrengements ? 'Kyllä' : 'Ei'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Päätös'
            text={getLabelOfOption(decisionOptions, contract.decision) || '-'}
          />
        </Column>
      </Row>
      <Warrants
        attributes={attributes}
        collaterals={contract.collaterals}
        decisionId={contract.id}
      />
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.contract.id;

    return {
      collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_CONTRACTS}.${id}`),
    };
  },
  {
    receiveCollapseStates,
  }
)(ContractItem);
