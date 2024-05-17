import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchLeaseAttributes } from "src/leases/actions";
import { getAttributes as getLeaseAttributes, getIsFetchingAttributes as getIsFetchingLeaseAttributes, getMethods as getLeaseMethods } from "src/leases/selectors";
import type { Attributes, Methods } from "src/types";

function LeaseAttributes(WrappedComponent: any) {
  type Props = {
    fetchLeaseAttributes: (...args: Array<any>) => any;
    isFetchingLeaseAttributes: boolean;
    leaseAttributes: Attributes;
    leaseMethods: Methods;
  };
  return class LeaseAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchLeaseAttributes,
        isFetchingLeaseAttributes,
        leaseAttributes,
        leaseMethods
      } = this.props;

      if (!isFetchingLeaseAttributes && !leaseAttributes && !leaseMethods) {
        fetchLeaseAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

const withLeaseAttributes = flowRight(connect(state => {
  return {
    isFetchingLeaseAttributes: getIsFetchingLeaseAttributes(state),
    leaseAttributes: getLeaseAttributes(state),
    leaseMethods: getLeaseMethods(state)
  };
}, {
  fetchLeaseAttributes
}), LeaseAttributes);
export { withLeaseAttributes };