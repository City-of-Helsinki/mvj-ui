// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchLeaseAttributes} from '$src/leases/actions';
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseAttributes,
  getMethods as getLeaseMethods,
} from '$src/leases/selectors';

import type {Attributes, Methods} from '$src/types';

function LeaseListPageAttributes(WrappedComponent: any) {
  type Props = {
    fetchLeaseAttributes: Function,
    isFetchingLeaseAttributes: boolean,
    leaseAttributes: Attributes,
    leaseMethods: Methods,
  }

  return class CommonAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchLeaseAttributes,
        isFetchingLeaseAttributes,
        leaseAttributes,
        leaseMethods,
      } = this.props;

      if(!isFetchingLeaseAttributes && !leaseAttributes && !leaseMethods) {
        fetchLeaseAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withLeaseListPageAttributes = flowRight(
  connect(
    (state) => {
      return{
        isFetchingLeaseAttributes: getIsFetchingLeaseAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        leaseMethods: getLeaseMethods(state),
      };
    },
    {
      fetchLeaseAttributes,
    }
  ),
  LeaseListPageAttributes,
);

export {withLeaseListPageAttributes};
