// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchScheduledJobAttributes as fetchBatchrunScheduledJobAttributes} from '$src/batchrun/actions';
import {
  getScheduledJobAttributes as getBatchrunScheduledJobAttributes,
  getIsFetchingScheduledJobAttributes as getIsFetchingBatchrunScheduledJobAttributes,
  getScheduledJobMethods as getBatchrunScheduledJobMethods,
} from '$src/batchrun/selectors';

import type {Attributes, Methods} from '$src/types';

function BatchrunScheduledJobTabAttributes(WrappedComponent: any) {
  type Props = {
    batchrunScheduledJobAttributes: Attributes,
    batchrunScheduledJobMethods: Methods,
    fetchBatchrunScheduledJobAttributes: Function,
    isFetchingBatchrunScheduledJobAttributes: boolean,
  }

  return class BatchrunScheduledJobTabAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        batchrunScheduledJobAttributes,
        batchrunScheduledJobMethods,
        fetchBatchrunScheduledJobAttributes,
        isFetchingBatchrunScheduledJobAttributes,
      } = this.props;

      if(!isFetchingBatchrunScheduledJobAttributes && !batchrunScheduledJobAttributes && !batchrunScheduledJobMethods) {
        fetchBatchrunScheduledJobAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withBatchrunScheduledJobTabAttributes = flowRight(
  connect(
    (state) => {
      return{
        batchrunScheduledJobAttributes: getBatchrunScheduledJobAttributes(state),
        batchrunScheduledJobMethods: getBatchrunScheduledJobMethods(state),
        isFetchingBatchrunScheduledJobAttributes: getIsFetchingBatchrunScheduledJobAttributes(state),
      };
    },
    {
      fetchBatchrunScheduledJobAttributes,
    }
  ),
  BatchrunScheduledJobTabAttributes,
);

export {withBatchrunScheduledJobTabAttributes};
