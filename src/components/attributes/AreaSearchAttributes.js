// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {
  getAttributes,
  getIsFetchingAttributes, getIsFetchingListAttributes, getListAttributes, getListMethods,
  getMethods,
} from '$src/areaSearch/selectors';

import type {Attributes, Methods} from '$src/types';
import {fetchAttributes, fetchListAttributes} from '$src/areaSearch/actions';
import type {RootState} from '$src/root/types';

function AreaSearchAttributes(WrappedComponent: React$ComponentType<any>) {
  type Props = {
    fetchAttributes: Function,
    fetchListAttributes: Function,
    areaSearchAttributes: Attributes,
    areaSearchMethods: Methods,
    isFetchingAttributes: boolean,
  }

  return class PlotSearchAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchAttributes,
        fetchListAttributes,
        areaSearchAttributes,
        isFetchingAttributes,
      } = this.props;

      if (!isFetchingAttributes && !areaSearchAttributes) {
        fetchAttributes();
        fetchListAttributes();
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
        areaSearchListAttributes: getListAttributes(state),
        isFetchingAttributes: getIsFetchingAttributes(state),
        isFetchingListAttributes: getIsFetchingListAttributes(state),
        areaSearchMethods: getMethods(state),
        areaSearchListMethods: getListMethods(state),
      };
    },
    {
      fetchAttributes,
      fetchListAttributes,
    },
  ),
  AreaSearchAttributes,
): (React$ComponentType<any>) => React$ComponentType<any>);

export {withAreaSearchAttributes};
