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
  leaseHistoryItemsFrom: Array<Object>,
  leaseHistoryItemsTo: Array<Object>,
  stateOptions: Array<Object>,
}

class LeaseHistory extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    leaseAttributes: null,
    leaseHistoryItemsFrom: [],
    leaseHistoryItemsTo: [],
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
      newState.leaseHistoryItemsFrom = sortRelatedLeasesFrom(getContentRelatedLeasesFrom(props.currentLease));
      newState.leaseHistoryItemsTo = getContentRelatedLeasesTo(props.currentLease);
    }

    return newState;
  }

  render() {
    const {currentLease} = this.props;
    const {
      leaseHistoryItemsFrom,
      leaseHistoryItemsTo,
      stateOptions,
    } = this.state;
    return (
      <div className="summary__related-leases">
        <TitleH3 uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}>
          {LeaseFieldTitles.HISTORY }
        </TitleH3>
        <div className="summary__related-leases_items">
          <div className="summary__related-leases_items_border-left" />
          {!!leaseHistoryItemsTo && !!leaseHistoryItemsTo.length && leaseHistoryItemsTo.map((lease, index) => {
            return (
              <LeaseHistoryItem
                key={index}
                active={false}
                id={lease.id}
                indented
                lease={lease.lease}
                startDate={lease.lease.start_date}
                endDate={lease.lease.end_date}
                stateOptions={stateOptions}
              />
            );
          })}
          {!!currentLease &&
            <LeaseHistoryItem
              active={true}
              lease={currentLease}
              startDate={currentLease.start_date}
              endDate={currentLease.end_date}
              stateOptions={stateOptions}
            />
          }
          {!!leaseHistoryItemsFrom && !!leaseHistoryItemsFrom.length && leaseHistoryItemsFrom.map((lease, index) => {
            const historyItems = []
            if (lease.lease && lease.lease.target_statuses.length) {
              lease.lease.target_statuses.forEach((plotSearch) => {
                historyItems.push({
                  key: plotSearch.plot_search_name,
                  id: plotSearch.plot_search_id,
                  itemTitle: plotSearch.plot_search_name,
                  startDate: plotSearch.start_date,
                  endDate: plotSearch.end_date,
                  // join plotsearch__plotsearchsubtype__plotsearchtype
                  plotSearchType: "Search Type",
                  plotSearchSubtype: "Search Subtype",
                  itemType: "plotsearch",
                  stateOptions: stateOptions,
                })
              })
            }
            historyItems.push({
              key: index,
              id: lease.id,
              lease: lease.lease,
              startDate: lease.lease.start_date,
              endDate: lease.lease.end_date,
              stateOptions: stateOptions
            })
            return historyItems.map((item) => { return <LeaseHistoryItem {...item} />})
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
)(LeaseHistory);
