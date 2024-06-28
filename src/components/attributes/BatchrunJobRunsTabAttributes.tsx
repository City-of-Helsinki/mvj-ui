import React, { PureComponent } from "react";
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import { fetchJobRunAttributes as fetchBatchrunJobRunAttributes, fetchJobRunLogEntryAttributes as fetchBatchrunJobRunLogEntryAttributes } from "/src/batchrun/actions";
import { getIsFetchingJobRunAttributes as getIsFetchingBatchrunJobRunAttributes, getIsFetchingJobRunLogEntryAttributes as getIsFetchingBatchrunJobRunLogEntryAttributes, getJobRunAttributes as getBatchrunJobRunAttributes, getJobRunMethods as getBatchrunJobRunMethods, getJobRunLogEntryAttributes as getBatchrunJobRunLogEntryAttributes, getJobRunLogEntryMethods as getBatchrunJobRunLogEntryMethods } from "/src/batchrun/selectors";
import type { Attributes, Methods } from "types";

function BatchrunJobRunTabAttributes(WrappedComponent: any) {
  type Props = {
    batchrunJobRunAttributes: Attributes;
    batchrunJobRunMethods: Methods;
    batchrunJobRunLogEntryAttributes: Attributes;
    batchrunJobRunLogEntryMethods: Methods;
    fetchBatchrunJobRunAttributes: (...args: Array<any>) => any;
    fetchBatchrunJobRunLogEntryAttributes: (...args: Array<any>) => any;
    isFetchingBatchrunJobRunAttributes: boolean;
    isFetchingBatchrunJobRunLogEntryAttributes: boolean;
  };
  type State = {
    isFetchingAttributes: boolean;
  };
  return class BatchrunJobRunTabAttributes extends PureComponent<Props, State> {
    state = {
      isFetchingAttributes: false
    };

    componentDidMount() {
      const {
        batchrunJobRunAttributes,
        batchrunJobRunMethods,
        batchrunJobRunLogEntryAttributes,
        batchrunJobRunLogEntryMethods,
        fetchBatchrunJobRunAttributes,
        fetchBatchrunJobRunLogEntryAttributes,
        isFetchingBatchrunJobRunAttributes,
        isFetchingBatchrunJobRunLogEntryAttributes
      } = this.props;

      if (!isFetchingBatchrunJobRunAttributes && !batchrunJobRunAttributes && !batchrunJobRunMethods) {
        fetchBatchrunJobRunAttributes();
      }

      if (!isFetchingBatchrunJobRunLogEntryAttributes && !batchrunJobRunLogEntryAttributes && !batchrunJobRunLogEntryMethods) {
        fetchBatchrunJobRunLogEntryAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if (this.props.isFetchingBatchrunJobRunAttributes !== prevProps.isFetchingBatchrunJobRunAttributes || this.props.isFetchingBatchrunJobRunLogEntryAttributes !== prevProps.isFetchingBatchrunJobRunLogEntryAttributes) {
        this.setIsFetchingAttributes();
      }
    }

    setIsFetchingAttributes = () => {
      const {
        isFetchingBatchrunJobRunAttributes,
        isFetchingBatchrunJobRunLogEntryAttributes
      } = this.props;
      const isFetching = isFetchingBatchrunJobRunAttributes || isFetchingBatchrunJobRunLogEntryAttributes;
      this.setState({
        isFetchingAttributes: isFetching
      });
    };

    render() {
      return <WrappedComponent isFetchingBatchrunJobRunsTabAttributes={this.state.isFetchingAttributes} {...this.props} />;
    }

  };
}

const withBatchrunJobRunTabAttributes = flowRight(connect(state => {
  return {
    batchrunJobRunAttributes: getBatchrunJobRunAttributes(state),
    batchrunJobRunMethods: getBatchrunJobRunMethods(state),
    batchrunJobRunLogEntryAttributes: getBatchrunJobRunLogEntryAttributes(state),
    batchrunJobRunLogEntryMethods: getBatchrunJobRunLogEntryMethods(state),
    isFetchingBatchrunJobRunAttributes: getIsFetchingBatchrunJobRunAttributes(state),
    isFetchingBatchrunJobRunLogEntryAttributes: getIsFetchingBatchrunJobRunLogEntryAttributes(state)
  };
}, {
  fetchBatchrunJobRunAttributes,
  fetchBatchrunJobRunLogEntryAttributes
}), BatchrunJobRunTabAttributes);
export { withBatchrunJobRunTabAttributes };