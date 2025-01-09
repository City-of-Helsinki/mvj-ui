import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchLeaseInvoicingConfirmationReportAttributes } from "@/leaseStatisticReport/actions";
import {
  getReportData,
  getIsFetchingReportData,
  getReportOptions,
  getReports,
} from "@/leaseStatisticReport/selectors";

function LeaseInvoicingConfirmationReportAttributes(WrappedComponent: any) {
  type Props = {};
  return class LeaseInvoicingConfirmationReportAttributes extends PureComponent<Props> {
    componentDidMount() {}

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withLeaseInvoicingConfirmationReportAttributes = flowRight(
  connect(
    (state) => {
      return {
        reportData: getReportData(state),
        isFetchingReportData: getIsFetchingReportData(state),
        reportOptions: getReportOptions(state),
        reports: getReports(state),
      };
    },
    {
      fetchLeaseInvoicingConfirmationReportAttributes,
    },
  ),
  LeaseInvoicingConfirmationReportAttributes,
);
export { withLeaseInvoicingConfirmationReportAttributes };
