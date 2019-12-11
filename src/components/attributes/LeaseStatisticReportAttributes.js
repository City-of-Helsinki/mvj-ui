// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchLeaseStatisticReportAttributes} from '$src/leaseStatisticReport/actions';
import {
  getAttributes as getLeaseStatisticReportAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseStatisticReportAttributes,
} from '$src/leaseStatisticReport/selectors';

import type {Attributes, Methods} from '$src/types';

function LeaseStatisticReportTabAttributes(WrappedComponent: any) {
  type Props = {
    LeaseStatisticReportAttributes: Attributes,
    LeaseStatisticReportMethods: Methods,
    fetchLeaseStatisticReportAttributes: Function,
    isFetchingLeaseStatisticReportAttributes: boolean,
  }

  return class LeaseStatisticReportTabAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        LeaseStatisticReportAttributes,
        LeaseStatisticReportMethods,
        fetchLeaseStatisticReportAttributes,
        isFetchingLeaseStatisticReportAttributes,
      } = this.props;

      if(!isFetchingLeaseStatisticReportAttributes && !LeaseStatisticReportAttributes && !LeaseStatisticReportMethods) {
        fetchLeaseStatisticReportAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withLeaseStatisticReportAttributes = flowRight(
  connect(
    (state) => {
      return{
        LeaseStatisticReportAttributes: getLeaseStatisticReportAttributes(state),
        isFetchingLeaseStatisticReportAttributes: getIsFetchingLeaseStatisticReportAttributes(state),
      };
    },
    {
      fetchLeaseStatisticReportAttributes,
    }
  ),
  LeaseStatisticReportTabAttributes,
);

export {withLeaseStatisticReportAttributes};
