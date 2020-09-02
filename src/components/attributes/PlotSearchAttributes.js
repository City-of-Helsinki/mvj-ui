// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchPlotSearchAttributes} from '$src/plotSearch/actions';
import {
  getAttributes as getPlotSearchAttributes,
  getIsFetchingAttributes as getIsFetchingPlotSearchAttributes,
} from '$src/plotSearch/selectors';

import type {Attributes} from '$src/types';

function PlotSearchAttributes(WrappedComponent: any) {
  type Props = {
    fetchPlotSearchAttributes: Function,
    isFetchingPlotSearchAttributes: boolean,
    plotSearchAttributes: Attributes,
  }

  return class PlotSearchAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchPlotSearchAttributes,
        isFetchingPlotSearchAttributes,
        plotSearchAttributes,
      } = this.props;

      if(!isFetchingPlotSearchAttributes && !plotSearchAttributes) {
        fetchPlotSearchAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withPlotSearchAttributes = flowRight(
  connect(
    (state) => {
      return{
        plotSearchAttributes: getPlotSearchAttributes(state),
        isFetchingPlotSearchAttributes: getIsFetchingPlotSearchAttributes(state),
      };
    },
    {
      fetchPlotSearchAttributes,
    },
  ),
  PlotSearchAttributes,
);

export {withPlotSearchAttributes};
