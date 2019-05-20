// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';

import {fetchAttributes as fetchCollectionCourtDecisionAttributes} from '$src/collectionCourtDecision/actions';
import {fetchAttributes as fetchCollectionLetterAttributes} from '$src/collectionLetter/actions';
import {fetchAttributes as fetchCollectionNoteAttributes} from '$src/collectionNote/actions';
import {fetchAttributes as fetchCreateCollectionLetterAttributes} from '$src/createCollectionLetter/actions';
import {fetchAttributes as fetchInvoiceNoteAttributes} from '$src/invoiceNote/actions';
import {fetchAttributes as fetchLeaseCreateChargeAttributes} from '$src/leaseCreateCharge/actions';
import {
  getAttributes as getCollectionCourtDecisionAttributes,
  getIsFetchingAttributes as getIsFetchingCollectionCourtDecisionAttributes,
  getMethods as getCollectionCourtDecisionMethods,
} from '$src/collectionCourtDecision/selectors';
import {
  getAttributes as getCollectionLetterAttributes,
  getIsFetchingAttributes as getIsFetchignCollectionLetterAttributes,
  getMethods as getCollectionLetterMethods,
} from '$src/collectionLetter/selectors';
import {
  getAttributes as getCollectionNoteAttributes,
  getIsFetchingAttributes as getIsFetchingCollectionNoteAttributes,
  getMethods as getCollectionNoteMethods,
} from '$src/collectionNote/selectors';
import {
  getAttributes as getCreateCollectionLetterAttributes,
  getIsFetchingAttributes as getIsFetchignCreateCollectionLetterAttributes,
} from '$src/createCollectionLetter/selectors';
import {
  getAttributes as getInvoiceNoteAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceNoteAttributes,
  getMethods as getInvoiceNoteMethods,
} from '$src/invoiceNote/selectors';
import {
  getAttributes as getLeaseCreateChargeAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseCreateChargeAttributes,
} from '$src/leaseCreateCharge/selectors';

import type {Attributes, Methods} from '$src/types';

function LeaseInvoiceTabAttributes(WrappedComponent: any) {
  type Props = {
    collectionCourtDecisionAttributes: Attributes,
    collectionCourtDecisionMethods: Methods,
    collectionLetterAttributes: Attributes,
    collectionLetterMethods: Methods,
    collectionNoteAttributes: Attributes,
    collectionNoteMethods: Methods,
    createCollectionLetterAttributes: Attributes,
    fetchCollectionCourtDecisionAttributes: Function,
    fetchCollectionLetterAttributes: Function,
    fetchCollectionNoteAttributes: Function,
    fetchCreateCollectionLetterAttributes: Function,
    fetchInvoiceNoteAttributes: Function,
    fetchLeaseCreateChargeAttributes: Function,
    invoiceNoteAttributes: Attributes,
    invoiceNoteMethods: Methods,
    isFetchingCollectionCourtDecisionAttributes: boolean,
    isFetchingCollectionLetterAttributes: boolean,
    isFetchingCollectionNoteAttributes: boolean,
    isFetchingCreateCollectionLetterAttributes: boolean,
    isFetchingInvoiceNoteAttributes: boolean,
    isFetchingLeaseCreateChargeAttributes: boolean,
    leaseCreateChargeAttributes: Attributes,
  }

  type State = {
    isFetchingLeaseInvoiceTabAttributes: boolean,
  }

  return class LeaseInvoiceTabAttributes extends PureComponent<Props, State> {
    state = {
      isFetchingLeaseInvoiceTabAttributes: false,
    }

    componentDidMount() {
      const {
        collectionCourtDecisionAttributes,
        collectionCourtDecisionMethods,
        collectionLetterAttributes,
        collectionLetterMethods,
        collectionNoteAttributes,
        collectionNoteMethods,
        createCollectionLetterAttributes,
        fetchCollectionCourtDecisionAttributes,
        fetchCollectionLetterAttributes,
        fetchCollectionNoteAttributes,
        fetchCreateCollectionLetterAttributes,
        fetchInvoiceNoteAttributes,
        fetchLeaseCreateChargeAttributes,
        invoiceNoteAttributes,
        invoiceNoteMethods,
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCreateCollectionLetterAttributes,
        isFetchingInvoiceNoteAttributes,
        isFetchingLeaseCreateChargeAttributes,
        leaseCreateChargeAttributes,
      } = this.props;

      if(!isFetchingCollectionCourtDecisionAttributes && !collectionCourtDecisionAttributes && !collectionCourtDecisionMethods) {
        fetchCollectionCourtDecisionAttributes();
      }

      if(!isFetchingCollectionLetterAttributes && !collectionLetterAttributes && !collectionLetterMethods) {
        fetchCollectionLetterAttributes();
      }

      if(!isFetchingCollectionNoteAttributes && !collectionNoteAttributes && !collectionNoteMethods) {
        fetchCollectionNoteAttributes();
      }

      if(!isFetchingCreateCollectionLetterAttributes && !createCollectionLetterAttributes) {
        fetchCreateCollectionLetterAttributes();
      }

      if(!isFetchingInvoiceNoteAttributes && !invoiceNoteMethods && !invoiceNoteAttributes) {
        fetchInvoiceNoteAttributes();
      }

      if(!isFetchingLeaseCreateChargeAttributes && !leaseCreateChargeAttributes) {
        fetchLeaseCreateChargeAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingCollectionCourtDecisionAttributes !== prevProps.isFetchingCollectionCourtDecisionAttributes ||
        this.props.isFetchingCollectionLetterAttributes !== prevProps.isFetchingCollectionLetterAttributes ||
        this.props.isFetchingCollectionNoteAttributes !== prevProps.isFetchingCollectionNoteAttributes ||
        this.props.isFetchingCreateCollectionLetterAttributes !== prevProps.isFetchingCreateCollectionLetterAttributes ||
        this.props.isFetchingInvoiceNoteAttributes !== prevProps.isFetchingInvoiceNoteAttributes ||
        this.props.isFetchingLeaseCreateChargeAttributes !== prevProps.isFetchingLeaseCreateChargeAttributes) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCreateCollectionLetterAttributes,
        isFetchingInvoiceNoteAttributes,
        isFetchingLeaseCreateChargeAttributes,
      } = this.props;
      const isFetching = isFetchingCollectionCourtDecisionAttributes ||
        isFetchingCollectionLetterAttributes ||
        isFetchingCollectionNoteAttributes ||
        isFetchingCreateCollectionLetterAttributes ||
        isFetchingInvoiceNoteAttributes ||
        isFetchingLeaseCreateChargeAttributes;

      this.setState({isFetchingLeaseInvoiceTabAttributes: isFetching});
    }

    render() {
      return <WrappedComponent isFetchingLeaseInvoiceTabAttributes={this.state.isFetchingLeaseInvoiceTabAttributes} {...this.props} />;
    }
  };
}

// $FlowFixMe
const withLeaseInvoiceTabAttributes = flowRight(
  connect(
    (state) => {
      return{
        collectionCourtDecisionAttributes: getCollectionCourtDecisionAttributes(state),
        collectionCourtDecisionMethods: getCollectionCourtDecisionMethods(state),
        collectionLetterAttributes: getCollectionLetterAttributes(state),
        collectionLetterMethods: getCollectionLetterMethods(state),
        collectionNoteAttributes: getCollectionNoteAttributes(state),
        collectionNoteMethods: getCollectionNoteMethods(state),
        createCollectionLetterAttributes: getCreateCollectionLetterAttributes(state),
        invoiceNoteAttributes: getInvoiceNoteAttributes(state),
        invoiceNoteMethods: getInvoiceNoteMethods(state),
        isFetchingCollectionCourtDecisionAttributes: getIsFetchingCollectionCourtDecisionAttributes(state),
        isFetchingCollectionLetterAttributes: getIsFetchignCollectionLetterAttributes(state),
        isFetchingCollectionNoteAttributes: getIsFetchingCollectionNoteAttributes(state),
        isFetchingCreateCollectionLetterAttributes: getIsFetchignCreateCollectionLetterAttributes(state),
        isFetchingInvoiceNoteAttributes: getIsFetchingInvoiceNoteAttributes(state),
        isFetchingLeaseCreateChargeAttributes: getIsFetchingLeaseCreateChargeAttributes(state),
        leaseCreateChargeAttributes: getLeaseCreateChargeAttributes(state),
      };
    },
    {
      fetchCollectionCourtDecisionAttributes,
      fetchCollectionLetterAttributes,
      fetchCollectionNoteAttributes,
      fetchCreateCollectionLetterAttributes,
      fetchInvoiceNoteAttributes,
      fetchLeaseCreateChargeAttributes,
    }
  ),
  LeaseInvoiceTabAttributes,
);

export {withLeaseInvoiceTabAttributes};
