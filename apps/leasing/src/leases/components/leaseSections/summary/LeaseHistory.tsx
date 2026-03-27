import React, { PureComponent } from "react";
import { connect } from "react-redux";
import LeaseHistoryItem from "./LeaseHistoryItem";
import TitleH3 from "@/components/content/TitleH3";
import {
  LeaseFieldPaths,
  LeaseFieldTitles,
  LeaseHistoryContentTypes,
  LeaseHistoryItemTypes,
} from "@/leases/enums";
import {
  getContentRelatedLeasesFrom,
  getContentRelatedLeasesTo,
  sortRelatedLeasesFrom,
} from "@/leases/helpers";
import { getFieldOptions } from "@/util/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import type { Attributes } from "types";
import type { Lease } from "@/leases/types";
import { restructureLease, sortRelatedHistoryItems } from "@/leases/helpers";
type Props = {
  currentLease: Lease;
  leaseAttributes: Attributes;
};
type State = {
  currentLease: Partial<Lease>;
  leaseAttributes: Attributes;
  relatedLeasesFrom: Array<Record<string, any>>;
  relatedLeasesTo: Array<Record<string, any>>;
  stateOptions: Array<Record<string, any>>;
};

class LeaseHistory extends PureComponent<Props, State> {
  state = {
    currentLease: {},
    leaseAttributes: null,
    relatedLeasesFrom: [],
    relatedLeasesTo: [],
    stateOptions: [],
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.stateOptions = getFieldOptions(
        props.leaseAttributes,
        LeaseFieldPaths.STATE,
      );
    }

    if (props.currentLease !== state.currentLease) {
      newState.currentLease = props.currentLease;
      newState.relatedLeasesFrom = sortRelatedLeasesFrom(
        getContentRelatedLeasesFrom(props.currentLease),
      );
      newState.relatedLeasesTo = getContentRelatedLeasesTo(props.currentLease);
    }

    return newState;
  }

  render() {
    const { currentLease } = this.props;
    const { relatedLeasesFrom, relatedLeasesTo, stateOptions } = this.state;

    const renderLeaseWithPlotSearchesAndApplications = (lease, active) => {
      const historyItems = [];

      if (lease.plot_searches?.length) {
        lease.plot_searches.forEach((plotSearch) => {
          historyItems.push({
            key: `plot-search_lease${lease.id}-plotsearch${plotSearch.id}`,
            id: plotSearch.id,
            itemTitle: plotSearch.name,
            startDate: plotSearch.begin_at,
            endDate: plotSearch.end_at,
            plotSearchType: plotSearch.type,
            plotSearchSubtype: plotSearch.subtype,
            itemType: LeaseHistoryItemTypes.PLOTSEARCH,
          });
        });
      }

      if (lease.target_statuses?.length) {
        lease.target_statuses.forEach((plotApplication) => {
          historyItems.push({
            key: `plot-application_lease${lease.id}-plotapplication${plotApplication.id}`,
            id: plotApplication.id,
            itemTitle: plotApplication.application_identifier,
            receivedAt: plotApplication.received_at,
            itemType: LeaseHistoryItemTypes.PLOT_APPLICATION,
          });
        });
      }

      if (lease.area_searches?.length) {
        lease.area_searches.forEach((areaSearch) => {
          historyItems.push({
            key: `area-search_lease${lease.id}-areasearch${areaSearch.id}`,
            id: areaSearch.id,
            itemTitle: areaSearch.identifier,
            receivedAt: areaSearch.received_date,
            applicantName: `${areaSearch.applicant_names.join(" ")}`,
            itemType: LeaseHistoryItemTypes.AREA_SEARCH,
          });
        });
      }

      if (lease.related_plot_applications?.length) {
        lease.related_plot_applications.forEach((relatedPlotApplication) => {
          if (
            relatedPlotApplication.content_type?.model ===
            LeaseHistoryContentTypes.PLOTSEARCH
          ) {
            const { content_object } = relatedPlotApplication;
            historyItems.push({
              key: `related-plot-application-plotsearch_lease${lease.id}-contentobject${content_object.id}`,
              id: content_object.id,
              itemTitle: content_object.name,
              startDate: content_object.begin_at,
              endDate: content_object.end_at,
              plotSearchType: content_object.type,
              plotSearchSubtype: content_object.subtype,
              itemType: LeaseHistoryItemTypes.PLOTSEARCH,
            });
          }

          if (
            relatedPlotApplication.content_type?.model ===
            LeaseHistoryContentTypes.TARGET_STATUS
          ) {
            const { content_object } = relatedPlotApplication;
            historyItems.push({
              key: `related-plot-application-targetstatus-${lease.id}-${content_object.id}`,
              id: content_object.id,
              itemTitle: content_object.application_identifier,
              receivedAt: content_object.received_at,
              itemType: LeaseHistoryItemTypes.PLOT_APPLICATION,
            });
          } else if (
            relatedPlotApplication.content_type?.model ===
            LeaseHistoryContentTypes.AREA_SEARCH
          ) {
            const { content_object } = relatedPlotApplication;
            historyItems.push({
              key: `related-plot-application-areasearch-${lease.id}-${content_object.id}`,
              id: content_object.id,
              itemTitle: content_object.identifier,
              applicantName: `${content_object.applicant_names.join(" ")}`,
              receivedAt: content_object.received_date,
              itemType: LeaseHistoryItemTypes.AREA_SEARCH,
            });
          }
        });
      }

      let leaseProps: {
        key: string;
        id: Lease["id"];
        lease: Partial<Lease>;
        startDate: Lease["start_date"];
        endDate: Lease["end_date"];
        active?: boolean;
      } = {
        key: `lease-${lease.id}`,
        id: lease.id,
        lease: lease,
        startDate: lease.start_date,
        endDate: lease.end_date,
      };

      // used for highlighting the current lease
      if (typeof active === "boolean") {
        leaseProps.active = active;
      }

      historyItems.push(leaseProps);
      historyItems.sort(sortRelatedHistoryItems);
      return historyItems.map((item) => {
        return (
          <LeaseHistoryItem
            {...item}
            key={item.key}
            stateOptions={this.state.stateOptions}
          />
        );
      });
    };

    return (
      <div className="summary__related-leases">
        <TitleH3 uiDataKey={getUiDataLeaseKey(LeaseFieldPaths.HISTORY)}>
          {LeaseFieldTitles.HISTORY}
        </TitleH3>
        <div className="summary__related-leases_items">
          <div className="summary__related-leases_items_border-left" />
          {!!relatedLeasesTo &&
            !!relatedLeasesTo.length &&
            relatedLeasesTo
              .map(restructureLease)
              .map(renderLeaseWithPlotSearchesAndApplications)}

          {!!currentLease &&
            renderLeaseWithPlotSearchesAndApplications(currentLease, true)}

          {!!relatedLeasesFrom &&
            !!relatedLeasesFrom.length &&
            relatedLeasesFrom
              .map(restructureLease)
              .map(renderLeaseWithPlotSearchesAndApplications)}
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return {
    currentLease: getCurrentLease(state),
    leaseAttributes: getLeaseAttributes(state),
  };
})(LeaseHistory);
