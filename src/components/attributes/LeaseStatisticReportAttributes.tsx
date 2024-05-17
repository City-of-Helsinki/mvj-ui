import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchLeaseStatisticReportAttributes } from "src/leaseStatisticReport/actions";
import { fetchReports } from "src/leaseStatisticReport/actions";
import { getAttributes as getLeaseStatisticReportAttributes, getIsFetchingAttributes as getIsFetchingLeaseStatisticReportAttributes, getReports, getIsFetchingReports, getIsFetchingReportData, getIsSendingMail } from "src/leaseStatisticReport/selectors";
import type { Attributes, Methods, Reports } from "src/types";

function LeaseStatisticReportTabAttributes(WrappedComponent: any) {
  type Props = {
    LeaseStatisticReportAttributes: Attributes;
    LeaseStatisticReportMethods: Methods;
    fetchLeaseStatisticReportAttributes: (...args: Array<any>) => any;
    isFetchingLeaseStatisticReportAttributes: boolean;
    reports: Reports;
    fetchReports: (...args: Array<any>) => any;
    isFetchingReports: boolean;
    isFetchingReportData: boolean;
    isSendingMail: boolean;
  };
  return class LeaseStatisticReportTabAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        LeaseStatisticReportAttributes,
        LeaseStatisticReportMethods,
        fetchLeaseStatisticReportAttributes,
        isFetchingLeaseStatisticReportAttributes,
        reports,
        fetchReports,
        isFetchingReports
      } = this.props;

      if (!isFetchingLeaseStatisticReportAttributes && !LeaseStatisticReportAttributes && !LeaseStatisticReportMethods) {
        fetchLeaseStatisticReportAttributes();
      }

      if (!isFetchingReports && !reports) {
        fetchReports();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

const withLeaseStatisticReportAttributes = flowRight(connect(state => {
  return {
    LeaseStatisticReportAttributes: getLeaseStatisticReportAttributes(state),
    isFetchingLeaseStatisticReportAttributes: getIsFetchingLeaseStatisticReportAttributes(state),
    reports: getReports(state),
    isFetchingReports: getIsFetchingReports(state),
    isFetchingReportData: getIsFetchingReportData(state),
    isSendingMail: getIsSendingMail(state)
  };
}, {
  fetchLeaseStatisticReportAttributes,
  fetchReports
}), LeaseStatisticReportTabAttributes);
export { withLeaseStatisticReportAttributes };