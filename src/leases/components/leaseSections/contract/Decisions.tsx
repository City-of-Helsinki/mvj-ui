import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import DecisionItem from "./DecisionItem";
import FormText from "/src/components/form/FormText";
import { LeaseDecisionConditionsFieldPaths, LeaseDecisionsFieldPaths } from "/src/leases/enums";
import { getContentDecisions } from "/src/leases/helpers";
import { getFieldOptions } from "util/helpers";
import { getAttributes, getCurrentLease } from "/src/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "/src/leases/types";
type Props = {
  attributes: Attributes;
  currentLease: Lease;
};
type State = {
  attributes: Attributes;
  conditionTypeOptions: Array<Record<string, any>>;
  currentLease: Lease;
  decisionMakerOptions: Array<Record<string, any>>;
  decisions: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
};

class Decisions extends PureComponent<Props, State> {
  state = {
    attributes: null,
    conditionTypeOptions: [],
    currentLease: {},
    decisionMakerOptions: [],
    decisions: [],
    typeOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.conditionTypeOptions = getFieldOptions(props.attributes, LeaseDecisionConditionsFieldPaths.TYPE);
      newState.decisionMakerOptions = getFieldOptions(props.attributes, LeaseDecisionsFieldPaths.DECISION_MAKER);
      newState.typeOptions = getFieldOptions(props.attributes, LeaseDecisionsFieldPaths.TYPE);
    }

    if (props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.decisions = getContentDecisions(props.currentLease);
    }

    return newState;
  }

  render() {
    const {
      conditionTypeOptions,
      decisionMakerOptions,
      decisions,
      typeOptions
    } = this.state;
    return <Fragment>
        {!decisions || !decisions.length && <FormText className='no-margin'>Ei päätöksiä</FormText>}
        {decisions && !!decisions.length && decisions.map(decision => <DecisionItem key={decision.id} conditionTypeOptions={conditionTypeOptions} decisionMakerOptions={decisionMakerOptions} decision={decision} typeOptions={typeOptions} />)}
      </Fragment>;
  }

}

export default connect(state => {
  return {
    attributes: getAttributes(state),
    currentLease: getCurrentLease(state)
  };
})(Decisions);