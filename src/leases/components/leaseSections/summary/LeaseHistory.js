// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import LeaseHistoryItem from './LeaseHistoryItem';
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

class LeaseHistory extends PureComponent<Props, State> {
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
    console.log({currentLease})
    const {
      relatedLeasesFrom,
      relatedLeasesTo,
      stateOptions,
    } = this.state;

    const renderLeaseWithPlotSearchesAndApplications = (lease, active) => {
      const historyItems = []
      console.log(lease)
      if (lease && lease.target_statuses.length) {
        lease.target_statuses.forEach((plotApplication) => {
          console.log({plotApplication})
          historyItems.push({
            key: plotApplication.application_identifier,
            id: plotApplication.id,
            itemTitle: plotApplication.application_identifier,
            receivedAt: plotApplication.received_at,
            itemType: "Hakemus",
          })
        })
      }
      if (lease && lease.plot_search_target) {
        const { plot_search_target: plotSearch } = lease
        historyItems.push({
          key: plotSearch.plot_search_name,
          id: plotSearch.plot_search_id,
          itemTitle: "A title that might be too long to display in full",
          // itemTitle: plotSearch.plot_search_name,
          startDate: plotSearch.begin_at,
          endDate: plotSearch.end_at,
          plotSearchType: plotSearch.plot_search_type,
          plotSearchSubtype: plotSearch.plot_search_subtype,
          itemType: "Haku",
        })
      }
      let leaseProps: any = {
        key: lease.id,
        id: lease.id,
        lease: lease,
        startDate: lease.start_date,
        endDate: lease.end_date,
      }
      // active will be a number when used in a map function
      if (typeof active === "boolean") {
        leaseProps.active = active
      }
      historyItems.push(leaseProps)
      return historyItems.map((item) => { return <LeaseHistoryItem {...item} stateOptions={this.state.stateOptions} />})
    }
    const restructureLease = (lease) => {
      let destructuredLease = lease.lease
      return {
        id: lease.id,
        ...destructuredLease
      }
    }
    return (
      <div className="summary__related-leases">
        <TitleH3 uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}>
          {LeaseFieldTitles.HISTORY }
        </TitleH3>
        <div className="summary__related-leases_items">
          <div className="summary__related-leases_items_border-left" />
          {!!relatedLeasesTo && !!relatedLeasesTo.length && 
            relatedLeasesTo
              .map(restructureLease)
              .map(renderLeaseWithPlotSearchesAndApplications)}

          {!!currentLease && renderLeaseWithPlotSearchesAndApplications(currentLease, true)}

          {!!relatedLeasesFrom && !!relatedLeasesFrom.length && 
            relatedLeasesFrom
              .map(restructureLease)
              .map(renderLeaseWithPlotSearchesAndApplications)}
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
)(LeaseHistory);
