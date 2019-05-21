// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchJobAttributes as fetchBatchrunJobAttributes} from '$src/batchrun/actions';
import {
  getJobAttributes as getBatchrunJobAttributes,
  getIsFetchingJobAttributes as getIsFetchingBatchrunJobAttributes,
  getJobMethods as getBatchrunJobMethods,
} from '$src/batchrun/selectors';

import type {Attributes, Methods} from '$src/types';

function BatchrunJobTabAttributes(WrappedComponent: any) {
  type Props = {
    batchrunJobAttributes: Attributes,
    batchrunJobMethods: Methods,
    fetchBatchrunJobAttributes: Function,
    isFetchingBatchrunJobAttributes: boolean,
  }

  return class BatchrunJobTabAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        batchrunJobAttributes,
        batchrunJobMethods,
        fetchBatchrunJobAttributes,
        isFetchingBatchrunJobAttributes,
      } = this.props;

      if(!isFetchingBatchrunJobAttributes && !batchrunJobAttributes && !batchrunJobMethods) {
        fetchBatchrunJobAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withBatchrunJobTabAttributes = flowRight(
  connect(
    (state) => {
      return{
        batchrunJobAttributes: getBatchrunJobAttributes(state),
        batchrunJobMethods: getBatchrunJobMethods(state),
        isFetchingBatchrunJobAttributes: getIsFetchingBatchrunJobAttributes(state),
      };
    },
    {
      fetchBatchrunJobAttributes,
    }
  ),
  BatchrunJobTabAttributes,
);

export {withBatchrunJobTabAttributes};
