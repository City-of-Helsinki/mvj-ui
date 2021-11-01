// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchInfillDevelopmentAttributes} from '$src/infillDevelopment/actions';
import {fetchAttributes as fetchInfillDevelopmentAttachmentAttributes} from '$src/infillDevelopmentAttachment/actions';
import {fetchAttributes as fetchLeaseAttributes} from '$src/leases/actions';
import {
  getAttributes as getInfillDevelopmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttributes,
  getMethods as getInfillDevelopmentMethods,
} from '$src/infillDevelopment/selectors';
import {
  getAttributes as getInfillDevelopmentAttachmentAttributes,
  getIsFetchingAttributes as getIsFetchingInfillDevelopmentAttachmentAttributes,
  getMethods as getInfillDevelopmentAttachmentMethods,
} from '$src/infillDevelopmentAttachment/selectors';
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseAttributes,
  getMethods as getLeaseMethods,
} from '$src/leases/selectors';

import type {Attributes, Methods} from '$src/types';

function InfillDevelopmentPageAttributes(WrappedComponent: any) {
  type Props = {
    fetchInfillDevelopmentAttributes: Function,
    fetchInfillDevelopmentAttachmentAttributes: Function,
    fetchLeaseAttributes: Function,
    infillDevelopmentAttributes: Attributes,
    infillDevelopmentMethods: Methods,
    infillDevelopmentAttachmentAttributes: Attributes,
    infillDevelopmentAttachmentMethods: Methods,
    isFetchingInfillDevelopmentAttributes: boolean,
    isFetchingInfillDevelopmentAttachmentAttributes: boolean,
    isFetchingLeaseAttributes: boolean,
    leaseAttributes: Attributes,
    leaseMethods: Methods,
  }

  type State = {
    isFetchingInfillDevelopmentPageAttributes: boolean,
  }

  return class InfillDevelopmentPageAttributes extends PureComponent<Props, State> {
    state = {
      isFetchingInfillDevelopmentPageAttributes: false,
    }

    componentDidMount() {
      const {
        fetchInfillDevelopmentAttributes,
        fetchInfillDevelopmentAttachmentAttributes,
        fetchLeaseAttributes,
        infillDevelopmentAttributes,
        infillDevelopmentMethods,
        infillDevelopmentAttachmentAttributes,
        infillDevelopmentAttachmentMethods,
        isFetchingInfillDevelopmentAttributes,
        isFetchingInfillDevelopmentAttachmentAttributes,
        isFetchingLeaseAttributes,
        leaseAttributes,
        leaseMethods,
      } = this.props;

      if(!isFetchingInfillDevelopmentAttributes && !infillDevelopmentAttributes && !infillDevelopmentMethods) {
        fetchInfillDevelopmentAttributes();
      }

      if(!isFetchingInfillDevelopmentAttachmentAttributes && !infillDevelopmentAttachmentAttributes && !infillDevelopmentAttachmentMethods) {
        fetchInfillDevelopmentAttachmentAttributes();
      }

      if(!isFetchingLeaseAttributes && !leaseAttributes && !leaseMethods) {
        fetchLeaseAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingInfillDevelopmentAttributes !== prevProps.isFetchingInfillDevelopmentAttributes ||
        this.props.isFetchingInfillDevelopmentAttachmentAttributes !== prevProps.isFetchingInfillDevelopmentAttachmentAttributes ||
        this.props.isFetchingLeaseAttributes !== prevProps.isFetchingLeaseAttributes) {
        this.setIsFetchingAttributes();
      }
    }

    setIsFetchingAttributes = () => {
      const {
        isFetchingInfillDevelopmentAttributes,
        isFetchingInfillDevelopmentAttachmentAttributes,
        isFetchingLeaseAttributes,
      } = this.props;
      const isFetching = isFetchingInfillDevelopmentAttributes ||
        isFetchingInfillDevelopmentAttachmentAttributes ||
        isFetchingLeaseAttributes;

      this.setState({isFetchingInfillDevelopmentPageAttributes: isFetching});
    }

    render() {
      return <WrappedComponent isFetchingInfillDevelopmentPageAttributes={this.state.isFetchingInfillDevelopmentPageAttributes} {...this.props} />;
    }
  };
}

// $FlowFixMe
const withInfillDevelopmentPageAttributes = flowRight(
  connect(
    (state) => {
      return{
        infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
        infillDevelopmentMethods: getInfillDevelopmentMethods(state),
        infillDevelopmentAttachmentAttributes: getInfillDevelopmentAttachmentAttributes(state),
        infillDevelopmentAttachmentMethods: getInfillDevelopmentAttachmentMethods(state),
        isFetchingInfillDevelopmentAttributes: getIsFetchingInfillDevelopmentAttributes(state),
        isFetchingInfillDevelopmentAttachmentAttributes: getIsFetchingInfillDevelopmentAttachmentAttributes(state),
        isFetchingLeaseAttributes: getIsFetchingLeaseAttributes(state),
        leaseAttributes: getLeaseAttributes(state),
        leaseMethods: getLeaseMethods(state),
      };
    },
    {
      fetchInfillDevelopmentAttributes,
      fetchInfillDevelopmentAttachmentAttributes,
      fetchLeaseAttributes,
    }
  ),
  InfillDevelopmentPageAttributes,
);

export {withInfillDevelopmentPageAttributes};
