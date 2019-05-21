// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchRentBasisAttributes} from '$src/rentbasis/actions';
import {
  getAttributes as getRentBasisAttributes,
  getIsFetchingAttributes as getIsFetchingRentBasisAttributes,
  getMethods as getRentBasisMethods,
} from '$src/rentbasis/selectors';
import type {Attributes, Methods} from '$src/types';

function RentBasisAttributes(WrappedComponent: any) {
  type Props = {
    fetchRentBasisAttributes: Function,
    isFetchingRentBasisAttributes: boolean,
    rentBasisAttributes: Attributes,
    rentBasisMethods: Methods,
  }

  return class RentBasisAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchRentBasisAttributes,
        isFetchingRentBasisAttributes,
        rentBasisAttributes,
        rentBasisMethods,
      } = this.props;

      if(!isFetchingRentBasisAttributes && !rentBasisAttributes && !rentBasisMethods) {
        fetchRentBasisAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withRentBasisAttributes = flowRight(
  connect(
    (state) => {
      return{
        isFetchingRentBasisAttributes: getIsFetchingRentBasisAttributes(state),
        rentBasisAttributes: getRentBasisAttributes(state),
        rentBasisMethods: getRentBasisMethods(state),
      };
    },
    {
      fetchRentBasisAttributes,
    }
  ),
  RentBasisAttributes,
);

export {withRentBasisAttributes};
