// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import RelatedLeaseItem from './RelatedLeaseItem';
import TitleH3 from '$components/content/TitleH3';
import {LeaseFieldPaths, LeaseFieldTitles} from '$src/leases/enums';
import {getContentRelatedLeasesFrom, getContentRelatedLeasesTo, sortRelatedLeasesFrom} from '$src/leases/helpers';
import {getFieldOptions} from '$src/util/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
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
    leaseAttributes: null,
    relatedLeasesFrom: [],
    relatedLeasesTo: [],
    stateOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.stateOptions = getFieldOptions(props.leaseAttributes, LeaseFieldPaths.STATE);
    }

    if(props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.relatedLeasesFrom = sortRelatedLeasesFrom(getContentRelatedLeasesFrom(props.currentLease));
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
        <TitleH3 uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}>
          {LeaseFieldTitles.HISTORY }
        </TitleH3>
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
            const tmpArray = [] 
            lease.lease && lease.lease.target_statuses.length && lease.lease.target_statuses.forEach((plotSearch) => {
              tmpArray.push(<RelatedLeaseItem
              key={plotSearch.plot_search_name}
              active={false}
              id={plotSearch.plot_search_id}
              lease={plotSearch.plot_search_name}
              stateOptions={stateOptions}
              start_date={new Date()}
              end_date={new Date()}
              state={plotSearch.state}
            />)
              })
            tmpArray.push(<RelatedLeaseItem
              key={index}
              active={false}
              id={lease.id}
              lease={lease.lease}
              stateOptions={stateOptions}
            />)
            console.log(tmpArray)
            return tmpArray.map((item) => { return item })
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
