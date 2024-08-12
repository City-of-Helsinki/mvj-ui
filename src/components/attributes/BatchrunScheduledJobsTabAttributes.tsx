import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchScheduledJobAttributes as fetchBatchrunScheduledJobAttributes } from "@/batchrun/actions";
import { getScheduledJobAttributes as getBatchrunScheduledJobAttributes, getIsFetchingScheduledJobAttributes as getIsFetchingBatchrunScheduledJobAttributes, getScheduledJobMethods as getBatchrunScheduledJobMethods } from "@/batchrun/selectors";
import type { Attributes, Methods } from "types";

function BatchrunScheduledJobTabAttributes(WrappedComponent: any) {
  type Props = {
    batchrunScheduledJobAttributes: Attributes;
    batchrunScheduledJobMethods: Methods;
    fetchBatchrunScheduledJobAttributes: (...args: Array<any>) => any;
    isFetchingBatchrunScheduledJobAttributes: boolean;
  };
  return class BatchrunScheduledJobTabAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        batchrunScheduledJobAttributes,
        batchrunScheduledJobMethods,
        fetchBatchrunScheduledJobAttributes,
        isFetchingBatchrunScheduledJobAttributes
      } = this.props;

      if (!isFetchingBatchrunScheduledJobAttributes && !batchrunScheduledJobAttributes && !batchrunScheduledJobMethods) {
        fetchBatchrunScheduledJobAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }

  };
}

const withBatchrunScheduledJobTabAttributes = flowRight(connect(state => {
  return {
    batchrunScheduledJobAttributes: getBatchrunScheduledJobAttributes(state),
    batchrunScheduledJobMethods: getBatchrunScheduledJobMethods(state),
    isFetchingBatchrunScheduledJobAttributes: getIsFetchingBatchrunScheduledJobAttributes(state)
  };
}, {
  fetchBatchrunScheduledJobAttributes
}), BatchrunScheduledJobTabAttributes);
export { withBatchrunScheduledJobTabAttributes };