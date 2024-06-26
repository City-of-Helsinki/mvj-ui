import React from "react";
import { Row, Column } from "react-foundation";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import FormTextTitle from "/src/components/form/FormTextTitle";
import BoxItemContainer from "/src/components/content/BoxItemContainer";
import Collapse from "/src/components/collapse/Collapse";
import FormText from "/src/components/form/FormText";
import { receiveCollapseStates } from "landUseContract/actions";
import { FormNames, ViewModes } from "enums";
import { formatDate } from "util/helpers";
import { getCollapseStateByKey } from "landUseContract/selectors";
import { withWindowResize } from "/src/components/resize/WindowResizeHandler";
import { getDecisionById, getDecisionOptions } from "landUseContract/helpers";
import type { LandUseContract } from "landUseContract/types";
import DecisionLink from "/src/components/links/DecisionLink";
import type { Attributes } from "types";
type Props = {
  attributes: Attributes;
  collapseState: boolean;
  changes: Array<Record<string, any>>;
  contractId: number;
  largeScreen: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  currentLandUseContract: LandUseContract;
};

const Changes = ({
  collapseState,
  changes,
  contractId,
  receiveCollapseStates,
  currentLandUseContract
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_DECISIONS]: {
          [contractId]: {
            changes: val
          }
        }
      }
    });
  };

  return <Collapse className='collapse__secondary' defaultOpen={collapseState !== undefined ? collapseState : true} headerTitle='sopimuksen muutos' onToggle={handleCollapseToggle}>
      <BoxItemContainer>
        {changes && changes.map((change, index) => {
        const decisionOptions = getDecisionOptions(currentLandUseContract);
        const decision = getDecisionById(currentLandUseContract, change.decision);
        return <Row key={index}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Allekirjoituspvm' />
                <FormText>{formatDate(change.signing_date) || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Allekirjoitettava mennessä' />
                <FormText>{formatDate(change.sign_by_date) || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='1. kutsu lähetetty' />
                <FormText>{formatDate(change.first_call_sent) || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='2. kutsu lähetetty' />
                <FormText>{formatDate(change.second_call_sent) || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={4}>
                <FormTextTitle title='3. kutsu lähetetty' />
                <FormText>{formatDate(change.third_call_sent) || '–'}</FormText>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Päätös' />
                <DecisionLink decision={decision} decisionOptions={decisionOptions} />
              </Column>
              <Column small={12} medium={12} large={10}>
                <FormTextTitle title='Huomautus' />
                <FormText>{change.description || '–'}</FormText>
              </Column>
            </Row>;
      })}
      </BoxItemContainer>
    </Collapse>;
};

export default flowRight(withWindowResize, connect((state, props) => {
  const id = props.contractId;
  return {
    collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_CONTRACTS}.${id}.changes`)
  };
}, {
  receiveCollapseStates
}))(Changes);