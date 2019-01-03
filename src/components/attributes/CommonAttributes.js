// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchContactAttributes} from '$src/contacts/actions';
import {fetchAttributes as fetchLeaseAttributes} from '$src/leases/actions';
import {fetchAttributes as fetchRentBasisAttributes} from '$src/rentbasis/actions';
import {
  getAttributes as getContactAttributes,
  getIsFetchingAttributes as getIsFetchingContactAttributes,
  getMethods as getContactMethods,
} from '$src/contacts/selectors';
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseAttributes,
  getMethods as getLeaseMethods,
} from '$src/leases/selectors';
import {
  getAttributes as getRentBasisAttributes,
  getIsFetchingAttributes as getIsFetchingRentBasisAttributes,
  getMethods as getRentBasisMethods,
} from '$src/rentbasis/selectors';

import type {Attributes, Methods} from '$src/types';

function CommonAttributes(WrappedComponent: any) {
  type Props = {
    contactAttributes: Attributes,
    contactMethods: Methods,
    fetchContactAttributes: Function,
    fetchLeaseAttributes: Function,
    fetchRentBasisAttributes: Function,
    isFetchingContactAttributes: boolean,
    isFetchingLeaseAttributes: boolean,
    isFetchingRentBasisAttributes: boolean,
    leaseAttributes: Attributes,
    leaseMethods: Methods,
    rentBasisAttributes: Attributes,
    rentBasisMethods: Methods,
  }

  type State = {
    isFetchingCommonAttributes: boolean,
  }

  return class WindowResizeHandler extends PureComponent<Props, State> {
    state = {
      isFetchingCommonAttributes: false,
    }

    componentDidMount() {
      const {
        contactMethods,
        fetchContactAttributes,
        fetchLeaseAttributes,
        fetchRentBasisAttributes,
        leaseMethods,
        rentBasisMethods,
      } = this.props;

      if(isEmpty(contactMethods)) {
        fetchContactAttributes();
      }

      if(isEmpty(leaseMethods)) {
        fetchLeaseAttributes();
      }

      if(isEmpty(rentBasisMethods)) {
        fetchRentBasisAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingLeaseAttributes !== prevProps.isFetchingLeaseAttributes ||
        this.props.isFetchingContactAttributes !== prevProps.isFetchingContactAttributes ||
        this.props.isFetchingRentBasisAttributes !== prevProps.isFetchingRentBasisAttributes) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingContactAttributes,
        isFetchingLeaseAttributes,
        isFetchingRentBasisAttributes,
      } = this.props;
      const isFetching = isFetchingContactAttributes ||
        isFetchingLeaseAttributes ||
        isFetchingRentBasisAttributes;

      this.setState({isFetchingCommonAttributes: isFetching});
    }

    render() {
      return <WrappedComponent isFetchingCommonAttributes={this.state.isFetchingCommonAttributes} {...this.props} />;
    }
  };
}

const withCommonAttributes = flowRight(
  connect(
    (state) => {
      return{
        contactAttributes: getContactAttributes(state),
        contactMethods: getContactMethods(state),
        isFetchingContactAttributes: getIsFetchingContactAttributes(state),
        isFetchingLeaseAttributes: getIsFetchingLeaseAttributes(state),
        isFetchingRentBasisAttributes: getIsFetchingRentBasisAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        leaseMethods: getLeaseMethods(state),
        rentBasisAttributes: getRentBasisAttributes(state),
        rentBasisMethods: getRentBasisMethods(state),
      };
    },
    {
      fetchContactAttributes,
      fetchLeaseAttributes,
      fetchRentBasisAttributes,
    }
  ),
  CommonAttributes,
);

export {withCommonAttributes};
