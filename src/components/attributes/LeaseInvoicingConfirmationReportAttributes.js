// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchLeaseInvoicingConfirmationReportAttributes} from '$src/leaseStatisticReport/actions';
import {
  getLeaseInvoicingConfirmationReportAttributes,
  getIsFetchingLeaseInvoicingConfirmationReportAttributes,
} from '$src/leaseStatisticReport/selectors';

import type {Attributes} from '$src/types';

function LeaseInvoicingConfirmationReportAttributes(WrappedComponent: any) {
  type Props = {
    leaseInvoicingConfirmationReportAttributes: Attributes,
    fetchLeaseInvoicingConfirmationReportAttributes: Function,
    isFetchingLeaseInvoicingConfirmationReportAttributes: boolean,
  }

  return class LeaseInvoicingConfirmationReportAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        isFetchingLeaseInvoicingConfirmationReportAttributes,
        leaseInvoicingConfirmationReportAttributes,
        fetchLeaseInvoicingConfirmationReportAttributes,
      } = this.props;
      if(!isFetchingLeaseInvoicingConfirmationReportAttributes && !leaseInvoicingConfirmationReportAttributes) {
        fetchLeaseInvoicingConfirmationReportAttributes();
      }
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
        leaseInvoicingConfirmationReportAttributes: getLeaseInvoicingConfirmationReportAttributes(state),
        isFetchingLeaseInvoicingConfirmationReportAttributes: getIsFetchingLeaseInvoicingConfirmationReportAttributes(state),
      };
    },
    {
      fetchLeaseInvoicingConfirmationReportAttributes,
    }
  ),
  LeaseInvoicingConfirmationReportAttributes,
);

export {withLeaseInvoicingConfirmationReportAttributes};
