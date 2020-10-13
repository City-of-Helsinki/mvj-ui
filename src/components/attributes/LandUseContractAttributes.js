// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchLandUseContractAttributes} from '$src/landUseContract/actions';
import {
  getAttributes as getLandUseContractAttributes,
  getIsFetchingAttributes as getIsFetchingLandUseContractAttributes,
  getMethods as getLandUseContractMethods,
} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/types';

function LandUseContractAttributes(WrappedComponent: any) {
  type Props = {
    fetchLandUseContractAttributes: Function,
    isFetchingLandUseContractAttributes: boolean,
    landUseContractAttributes: Attributes,
  }

  return class LandUseContractAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchLandUseContractAttributes,
        isFetchingLandUseContractAttributes,
        landUseContractAttributes,
      } = this.props;

      if(!isFetchingLandUseContractAttributes && !landUseContractAttributes) {
        fetchLandUseContractAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

const withLandUseContractAttributes = flowRight(
  connect(
    (state) => {
      return{
        landUseContractAttributes: getLandUseContractAttributes(state),
        isFetchingLandUseContractAttributes: getIsFetchingLandUseContractAttributes(state),
        landUseContractMethods: getLandUseContractMethods(state),
      };
    },
    {
      fetchLandUseContractAttributes,
    },
  ),
  LandUseContractAttributes,
);

export {withLandUseContractAttributes};
