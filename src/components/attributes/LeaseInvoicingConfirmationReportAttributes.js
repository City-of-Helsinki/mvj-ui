// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchLeaseInvoicingConfirmationReportAttributes} from '$src/leaseStatisticReport/actions';
import {
  getReportData,
  getIsFetchingReportData,
  getReportType,
} from '$src/leaseStatisticReport/selectors';

function LeaseInvoicingConfirmationReportAttributes(WrappedComponent: any) {
  
  type Props = {
  }

  return class LeaseInvoicingConfirmationReportAttributes extends PureComponent<Props> {
    componentDidMount() {
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withLeaseInvoicingConfirmationReportAttributes = flowRight(
  connect(
    (state) => {
      return{
        reportData: getReportData(state),
        isFetchingReportData: getIsFetchingReportData(state),
        reportType: getReportType(state),
      };
    },
    {
      fetchLeaseInvoicingConfirmationReportAttributes,
    }
  ),
  LeaseInvoicingConfirmationReportAttributes,
);

export {withLeaseInvoicingConfirmationReportAttributes};
