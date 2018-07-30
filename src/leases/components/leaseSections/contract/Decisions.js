// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import DecisionItem from './DecisionItem';
import {getContentDecisions} from '$src/leases/helpers';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  currentLease: Lease,
}

type State = {
  conditionTypeOptions: Array<Object>,
  decisionMakerOptions: Array<Object>,
  decisions: Array<Object>,
  typeOptions: Array<Object>,
}

class Decisions extends PureComponent<Props, State> {
  state = {
    conditionTypeOptions: [],
    decisionMakerOptions: [],
    decisions: [],
    typeOptions: [],
  }

  componentDidMount() {
    const {attributes, currentLease} = this.props;
    if(!isEmpty(attributes)) {
      this.updateOptions();
    }

    if(!isEmpty(currentLease)) {
      this.updateContent();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.attributes !== this.props.attributes) {
      this.updateOptions();
    }

    if(prevProps.currentLease !== this.props.currentLease) {
      this.updateContent();
    }
  }

  updateContent = () => {
    const {currentLease} = this.props;
    this.setState({
      decisions: getContentDecisions(currentLease),
    });
  }

  updateOptions = () => {
    const {attributes} = this.props;
    this.setState({
      conditionTypeOptions: getAttributeFieldOptions(attributes, 'decisions.child.children.conditions.child.children.type'),
      decisionMakerOptions: getAttributeFieldOptions(attributes, 'decisions.child.children.decision_maker'),
      typeOptions: getAttributeFieldOptions(attributes, 'decisions.child.children.type'),
    });
  }

  render() {
    const {
      conditionTypeOptions,
      decisionMakerOptions,
      decisions,
      typeOptions,
    } = this.state;

    return (
      <div>
        {!decisions || !decisions.length && <p className='no-margin'>Ei päätöksiä</p>}
        {decisions && !!decisions.length && decisions.map((decision) =>
          <DecisionItem
            key={decision.id}
            conditionTypeOptions={conditionTypeOptions}
            decisionMakerOptions={decisionMakerOptions}
            decision={decision}
            typeOptions={typeOptions}
          />
        )}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
    };
  },
)(Decisions);
