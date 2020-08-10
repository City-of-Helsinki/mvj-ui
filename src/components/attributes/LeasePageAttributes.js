// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchCommentAttributes} from '$src/comments/actions';
import {fetchAttributes as fetchInvoiceAttributes} from '$src/invoices/actions';
import {fetchAttributes as fetchLeaseAttributes} from '$src/leases/actions';
import {
  getAttributes as getCommentAttributes,
  getIsFetchingAttributes as getIsFetchingCommentAttributes,
  getMethods as getCommentMethods,
} from '$src/comments/selectors';
import {
  getAttributes as getInvoiceAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceAttributes,
  getMethods as getInvoiceMethods,
} from '$src/invoices/selectors';
import {
  getAttributes as getLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseAttributes,
  getMethods as getLeaseMethods,
} from '$src/leases/selectors';
import {
  getIsFetching as getIsFetchingUsersPermissions,
  getUsersPermissions,
} from '$src/usersPermissions/selectors';

import type {Attributes, Methods} from '$src/types';
import type {UsersPermissions} from '$src/usersPermissions/types';

function LeasePageAttributes(WrappedComponent: any) {
  type Props = {
    commentAttributes: Attributes,
    commentMethods: Methods,
    fetchCommentAttributes: Function,
    fetchInvoiceAttributes: Function,
    fetchLeaseAttributes: Function,
    invoiceAttributes: Attributes,
    invoiceMethods: Methods,
    isFetchingCommentAttributes: boolean,
    isFetchingInvoiceAttributes: boolean,
    isFetchingLeaseAttributes: boolean,
    isFetchingUsersPermissions: boolean,
    leaseAttributes: Attributes,
    leaseMethods: Methods,
    usersPermissions: UsersPermissions,
  }

  type State = {
    isFetchingLeasePageAttributes: boolean,
  }

  return class LeasePageAttributes extends PureComponent<Props, State> {
    state = {
      isFetchingLeasePageAttributes: false,
    }

    componentDidMount() {
      const {
        commentAttributes,
        commentMethods,
        fetchCommentAttributes,
        fetchInvoiceAttributes,
        fetchLeaseAttributes,
        invoiceAttributes,
        invoiceMethods,
        isFetchingCommentAttributes,
        isFetchingInvoiceAttributes,
        isFetchingLeaseAttributes,
        leaseAttributes,
        leaseMethods,
      } = this.props;

      if(!isFetchingCommentAttributes && !commentAttributes && !commentMethods) {
        fetchCommentAttributes();
      }

      if(!isFetchingInvoiceAttributes && !invoiceAttributes && !invoiceMethods) {
        fetchInvoiceAttributes();
      }

      if(!isFetchingLeaseAttributes && !leaseAttributes && !leaseMethods) {
        fetchLeaseAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingCommentAttributes !== prevProps.isFetchingCommentAttributes ||
        this.props.isFetchingInvoiceAttributes !== prevProps.isFetchingInvoiceAttributes ||
        this.props.isFetchingLeaseAttributes !== prevProps.isFetchingLeaseAttributes ||
        this.props.isFetchingUsersPermissions !== prevProps.isFetchingUsersPermissions) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingCommentAttributes,
        isFetchingInvoiceAttributes,
        isFetchingLeaseAttributes,
        isFetchingUsersPermissions,
      } = this.props;
      const isFetching = isFetchingCommentAttributes ||
        isFetchingInvoiceAttributes ||
        isFetchingLeaseAttributes ||
        isFetchingUsersPermissions;

      this.setState({isFetchingLeasePageAttributes: isFetching});
    }

    render() {
      return <WrappedComponent isFetchingLeasePageAttributes={this.state.isFetchingLeasePageAttributes} {...this.props} />;
    }
  };
}

const withLeasePageAttributes = flowRight(
  connect(
    (state) => {
      return{
        commentAttributes: getCommentAttributes(state),
        commentMethods: getCommentMethods(state),
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceMethods: getInvoiceMethods(state),
        isFetchingCommentAttributes: getIsFetchingCommentAttributes(state),
        isFetchingInvoiceAttributes: getIsFetchingInvoiceAttributes(state),
        isFetchingLeaseAttributes: getIsFetchingLeaseAttributes(state),
        isFetchingUsersPermissions: getIsFetchingUsersPermissions(state),
        leaseAttributes: getLeaseAttributes(state),
        leaseMethods: getLeaseMethods(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      fetchCommentAttributes,
      fetchInvoiceAttributes,
      fetchLeaseAttributes,
    },
  ),
  LeasePageAttributes,
);

export {withLeasePageAttributes};
