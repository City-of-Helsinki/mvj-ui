// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import RelatedLeaseItem from './RelatedLeaseItem';
import {LeaseFieldPaths} from '$src/leases/enums';
import {getContentRelatedLeasesFrom, getContentRelatedLeasesTo} from '$src/leases/helpers';
import {getFieldAttributes, getFieldOptions} from '$src/util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  currentLease: Lease,
  leaseAttributes: Attributes,
}

type State = {
  currentLease: Lease,
  leaseAttributes: Attributes,
  relatedLeasesFrom: Array<Object>,
  relatedLeasesTo: Array<Object>,
  stateOptions: Array<Object>,
}

class RelatedLeases extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    leaseAttributes: {},
    relatedLeasesFrom: [],
    relatedLeasesTo: [],
    stateOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.stateOptions = getFieldOptions(getFieldAttributes(props.leaseAttributes, LeaseFieldPaths.STATE));
    }

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.relatedLeasesFrom = getContentRelatedLeasesFrom(props.currentLease);
      newState.relatedLeasesTo = getContentRelatedLeasesTo(props.currentLease);
    }

    return newState;
  }

  render() {
    const {currentLease} = this.props;
    const {
      relatedLeasesFrom,
      relatedLeasesTo,
      stateOptions,
    } = this.state;
    return (
      <div className="summary__related-leases">
        <h3>Historia</h3>
        <div className="summary__related-leases_items">
          <div className="summary__related-leases_items_border-left" />
          {!!relatedLeasesTo && !!relatedLeasesTo.length && relatedLeasesTo.map((lease, index) => {
            return (
              <RelatedLeaseItem
                key={index}
                active={false}
                id={lease.id}
                indented
                lease={lease.lease}
                stateOptions={stateOptions}
              />
            );
          })}
          {!!currentLease &&
            <RelatedLeaseItem
              active={true}
              lease={currentLease}
              stateOptions={stateOptions}
            />
          }
          {!!relatedLeasesFrom && !!relatedLeasesFrom.length && relatedLeasesFrom.map((lease, index) => {
            return (
              <RelatedLeaseItem
                key={index}
                active={false}
                id={lease.id}
                lease={lease.lease}
                stateOptions={stateOptions}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      currentLease: getCurrentLease(state),
      leaseAttributes: getLeaseAttributes(state),
    };
  }
)(RelatedLeases);
