import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Collapse from "/src/components/collapse/Collapse";
import FormTitleAndText from "/src/components/form/FormTitleAndText";
import { receiveCollapseStates } from "/src/landUseContract/actions";
import { FormNames, ViewModes } from "enums";
import { formatDate, getLabelOfOption } from "/src/util/helpers";
import { getCollapseStateByKey } from "/src/landUseContract/selectors";
import Warrants from "./Warrants";
import Changes from "./Changes";
import type { LandUseContract } from "/src/landUseContract/types";
type Props = {
  attributes: Record<string, any>;
  collapseState: boolean;
  contract: Record<string, any>;
  receiveCollapseStates: (...args: Array<any>) => any;
  stateOptions: Array<Record<string, any>>;
  contractTypeOptions: Array<Record<string, any>>;
  decisionOptions: Array<Record<string, any>>;
  currentLandUseContract: LandUseContract;
};

const ContractItem = ({
  attributes,
  collapseState,
  contract,
  receiveCollapseStates,
  stateOptions,
  contractTypeOptions,
  decisionOptions,
  currentLandUseContract
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_CONTRACTS]: {
          [contract.id]: val
        }
      }
    });
  };

  return <Collapse defaultOpen={collapseState !== undefined ? collapseState : true} headerTitle={`${getLabelOfOption(contractTypeOptions, contract.type) || '-'} ${contract.contract_number || '-'}`} onToggle={handleCollapseToggle}>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Sopimuksen tyyppi' text={getLabelOfOption(contractTypeOptions, contract.type) || '-'} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Sopimuksen vaihe' text={getLabelOfOption(stateOptions, contract.state) || '-'} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Allekirjoituspvm' text={formatDate(contract.signing_date) || '-'} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='ED sopimusnumero' text={contract.contract_number || '-'} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Aluejärjestelyt' text={contract.area_arrengements ? 'Kyllä' : 'Ei'} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Päätös' text={getLabelOfOption(decisionOptions, contract.decision) || '-'} />
        </Column>
      </Row>
      <Changes attributes={attributes} changes={contract.contract_changes} decisionId={contract.id} currentLandUseContract={currentLandUseContract} />
      <Warrants attributes={attributes} collaterals={contract.collaterals} decisionId={contract.id} />
    </Collapse>;
};

export default connect((state, props) => {
  const id = props.contract.id;
  return {
    collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_CONTRACTS}.${id}`)
  };
}, {
  receiveCollapseStates
})(ContractItem);