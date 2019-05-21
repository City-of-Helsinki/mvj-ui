// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchLeaseholdTransferAttributes} from '$src/leaseholdTransfer/actions';
import {
  getAttributes as getLeaseholdTransferAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseholdTransferAttributes,
  getMethods as getLeaseholdTransferMethods,
} from '$src/leaseholdTransfer/selectors';

import type {Attributes, Methods} from '$src/types';

function LeaseholdTransferAttributes(WrappedComponent: any) {
  type Props = {
    fetchLeaseholdTransferAttributes: Function,
    isFetchingLeaseholdTransferAttributes: boolean,
    leaseholdTransferAttributes: Attributes,
    leaseholdTransferMethods: Methods,
  }

  return class LeaseholdTransferAttributes extends PureComponent<Props> {
    componentDidMount() {
      const {
        fetchLeaseholdTransferAttributes,
        isFetchingLeaseholdTransferAttributes,
        leaseholdTransferAttributes,
        leaseholdTransferMethods,
      } = this.props;

      if(!isFetchingLeaseholdTransferAttributes && !leaseholdTransferAttributes && !leaseholdTransferMethods) {
        fetchLeaseholdTransferAttributes();
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

// $FlowFixMe
const withLeaseholdTransferAttributes = flowRight(
  connect(
    (state) => {
      return{
        isFetchingLeaseholdTransferAttributes: getIsFetchingLeaseholdTransferAttributes(state),
        leaseholdTransferAttributes: getLeaseholdTransferAttributes(state),
        leaseholdTransferMethods: getLeaseholdTransferMethods(state),
      };
    },
    {
      fetchLeaseholdTransferAttributes,
    }
  ),
  LeaseholdTransferAttributes,
);

export {withLeaseholdTransferAttributes};
