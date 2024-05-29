import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchAttributes as fetchLeaseholdTransferAttributes } from "leaseholdTransfer/actions";
import { getAttributes as getLeaseholdTransferAttributes, getIsFetchingAttributes as getIsFetchingLeaseholdTransferAttributes, getMethods as getLeaseholdTransferMethods } from "leaseholdTransfer/selectors";
import type { Attributes, Methods } from "types";

function LeaseholdTransferAttributes(WrappedComponent: any) {
  type Props = {
    fetchLeaseholdTransferAttributes: (...args: Array<any>) => any;
    isFetchingLeaseholdTransferAttributes: boolean;
    leaseholdTransferAttributes: Attributes;
    leaseholdTransferMethods: Methods;
  };
  return class LeaseholdTransferAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchLeaseholdTransferAttributes,
        isFetchingLeaseholdTransferAttributes,
        leaseholdTransferAttributes,
        leaseholdTransferMethods
      } = this.props;

      if (!isFetchingLeaseholdTransferAttributes && !leaseholdTransferAttributes && !leaseholdTransferMethods) {
        fetchLeaseholdTransferAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

const withLeaseholdTransferAttributes = flowRight(connect(state => {
  return {
    isFetchingLeaseholdTransferAttributes: getIsFetchingLeaseholdTransferAttributes(state),
    leaseholdTransferAttributes: getLeaseholdTransferAttributes(state),
    leaseholdTransferMethods: getLeaseholdTransferMethods(state)
  };
}, {
  fetchLeaseholdTransferAttributes
}), LeaseholdTransferAttributes);
export { withLeaseholdTransferAttributes };