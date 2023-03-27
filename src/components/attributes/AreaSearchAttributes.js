// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {
  getAttributes,
  getIsFetchingAttributes,
  getMethods,
} from '$src/areaSearch/selectors';

import type {Attributes, Methods} from '$src/types';
import {fetchAttributes} from '$src/areaSearch/actions';
import type {RootState} from '$src/root/types';

function AreaSearchAttributes(WrappedComponent: React$ComponentType<any>) {
  type Props = {
    fetchAttributes: Function,
    areaSearchAttributes: Attributes,
    areaSearchMethods: Methods,
    isFetchingAttributes: boolean,
  }

  return class PlotSearchAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchAttributes,
        areaSearchAttributes,
        isFetchingAttributes,
      } = this.props;

      if (!isFetchingAttributes && !areaSearchAttributes) {
        fetchAttributes();
      }
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withAreaSearchAttributes = (flowRight(
  connect(
    (state: RootState) => {
      return {
        areaSearchAttributes: getAttributes(state),
        isFetchingAttributes: getIsFetchingAttributes(state),
        areaSearchMethods: getMethods(state),
      };
    },
    {
      fetchAttributes,
    },
  ),
  AreaSearchAttributes,
): (React$ComponentType<any>) => React$ComponentType<any>);

export {withAreaSearchAttributes};
