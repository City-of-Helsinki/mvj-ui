import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import Collapse from "@/components/collapse/Collapse";
import DecisionConditions from "./DecisionConditions";
import ExternalLink from "@/components/links/ExternalLink";
import FormTitleAndText from "@/components/form/FormTitleAndText";
import { receiveCollapseStates } from "@/landUseContract/actions";
import { FormNames, ViewModes } from "@/enums";
import { formatDate, getFieldOptions, getLabelOfOption, getReferenceNumberLink } from "@/util/helpers";
import { getCollapseStateByKey } from "@/landUseContract/selectors";
import type { Attributes } from "types";
type Props = {
  attributes: Attributes;
  collapseState: boolean;
  decision: Record<string, any>;
  receiveCollapseStates: (...args: Array<any>) => any;
};

const DecisionItem = ({
  attributes,
  collapseState,
  decision,
  receiveCollapseStates
}: Props) => {
  const handleCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_DECISIONS]: {
          [decision.id]: {
            decision: val
          }
        }
      }
    });
  };

  const decisionMakerOptions = getFieldOptions(attributes, 'decisions.child.children.decision_maker'),
        typeOptions = getFieldOptions(attributes, 'decisions.child.children.type');
  return <Collapse defaultOpen={collapseState !== undefined ? collapseState : true} headerTitle={getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'} onToggle={handleCollapseToggle}>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Päättäjä' text={getLabelOfOption(decisionMakerOptions, decision.decision_maker) || '-'} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Päätöspvm' text={formatDate(decision.decision_date) || '-'} />
        </Column>
        <Column small={6} medium={4} large={1}>
          <FormTitleAndText title='Pykälä' text={decision.section ? `${decision.section} §` : '-'} />
        </Column>
        <Column small={6} medium={8} large={3}>
          <FormTitleAndText title='Päätöksen tyyppi' text={getLabelOfOption(typeOptions, decision.type) || '-'} />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText title='Diaarinumero' text={decision.reference_number ? <ExternalLink href={getReferenceNumberLink(decision.reference_number)} text={decision.reference_number} /> : '-'} />
        </Column>
        <Column small={12}>
          <FormTitleAndText title='Huomautus' text={decision.description || '-'} />
        </Column>
      </Row>

      <DecisionConditions attributes={attributes} conditions={decision.conditions} decisionId={decision.id} />
    </Collapse>;
};

export default connect((state, props) => {
  const id = props.decision.id;
  return {
    collapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_DECISIONS}.${id}.decision`)
  };
}, {
  receiveCollapseStates
})(DecisionItem);