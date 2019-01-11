// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchAreaNoteAttributes} from '$src/areaNote/actions';
import {fetchAttributes as fetchContactAttributes} from '$src/contacts/actions';
import {fetchAttributes as fetchInfillDevelopmentAttributes} from '$src/infillDevelopment/actions';
import {fetchAttributes as fetchLeaseAttributes} from '$src/leases/actions';
import {fetchAttributes as fetchRentBasisAttributes} from '$src/rentbasis/actions';
import {
  getAttributes as getAreaNoteAttributes,
  getIsFetchingAttributes as getIsFetchingAreaNoteAttributes,
  getMethods as getAreaNoteMethods,
} from '$src/areaNote/selectors';
import {
  getAttributes as getContactAttributes,
  getIsFetchingAttributes as getIsFetchingContactAttributes,
  getMethods as getContactMethods,
} from '$src/contacts/selectors';
import {
  getAttributes as getInfillDevelopmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttributes,
  getMethods as getInfillDevelopmentMethods,
} from '$src/infillDevelopment/selectors';
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
    areaNoteAttributes: Attributes,
    areaNoteMethods: Methods,
    contactAttributes: Attributes,
    contactMethods: Methods,
    fetchAreaNoteAttributes: Function,
    fetchContactAttributes: Function,
    fetchInfillDevelopmentAttributes: Function,
    fetchLeaseAttributes: Function,
    fetchRentBasisAttributes: Function,
    infillDevelopmentAttributes: Attributes,
    infillDevelopmentMethods: Methods,
    isFetchingAreaNoteAttributes: boolean,
    isFetchingContactAttributes: boolean,
    isFetchingInfillDevelopmentAttributes: boolean,
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
        areaNoteMethods,
        contactMethods,
        fetchAreaNoteAttributes,
        fetchContactAttributes,
        fetchInfillDevelopmentAttributes,
        fetchLeaseAttributes,
        fetchRentBasisAttributes,
        infillDevelopmentMethods,
        isFetchingAreaNoteAttributes,
        isFetchingContactAttributes,
        isFetchingInfillDevelopmentAttributes,
        isFetchingLeaseAttributes,
        isFetchingRentBasisAttributes,
        leaseMethods,
        rentBasisMethods,
      } = this.props;

      if(!isFetchingAreaNoteAttributes && isEmpty(areaNoteMethods)) {
        fetchAreaNoteAttributes();
      }

      if(!isFetchingContactAttributes && isEmpty(contactMethods)) {
        fetchContactAttributes();
      }

      if(!isFetchingInfillDevelopmentAttributes && isEmpty(infillDevelopmentMethods)) {
        fetchInfillDevelopmentAttributes();
      }

      if(!isFetchingLeaseAttributes && isEmpty(leaseMethods)) {
        fetchLeaseAttributes();
      }

      if(!isFetchingRentBasisAttributes && isEmpty(rentBasisMethods)) {
        fetchRentBasisAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingAreaNoteAttributes !== prevProps.isFetchingAreaNoteAttributes ||
        this.props.isFetchingContactAttributes !== prevProps.isFetchingContactAttributes ||
        this.props.isFetchingInfillDevelopmentAttributes !== prevProps.isFetchingInfillDevelopmentAttributes ||
        this.props.isFetchingLeaseAttributes !== prevProps.isFetchingLeaseAttributes ||
        this.props.isFetchingRentBasisAttributes !== prevProps.isFetchingRentBasisAttributes) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingAreaNoteAttributes,
        isFetchingContactAttributes,
        isFetchingInfillDevelopmentAttributes,
        isFetchingLeaseAttributes,
        isFetchingRentBasisAttributes,
      } = this.props;
      const isFetching = isFetchingAreaNoteAttributes ||
        isFetchingContactAttributes ||
        isFetchingInfillDevelopmentAttributes ||
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
        areaNoteAttributes: getAreaNoteAttributes(state),
        areaNoteMethods: getAreaNoteMethods(state),
        contactAttributes: getContactAttributes(state),
        contactMethods: getContactMethods(state),
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
        infillDevelopmentMethods: getInfillDevelopmentMethods(state),
        isFetchingAreaNoteAttributes: getIsFetchingAreaNoteAttributes(state),
        isFetchingContactAttributes: getIsFetchingContactAttributes(state),
        isFetchingInfillDevelopmentAttributes: getIsFetchingInfillDevelopmentAttributes(state),
        isFetchingLeaseAttributes: getIsFetchingLeaseAttributes(state),
        isFetchingRentBasisAttributes: getIsFetchingRentBasisAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        leaseMethods: getLeaseMethods(state),
        rentBasisAttributes: getRentBasisAttributes(state),
        rentBasisMethods: getRentBasisMethods(state),
      };
    },
    {
      fetchAreaNoteAttributes,
      fetchContactAttributes,
      fetchInfillDevelopmentAttributes,
      fetchLeaseAttributes,
      fetchRentBasisAttributes,
    }
  ),
  CommonAttributes,
);

export {withCommonAttributes};
