// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchCollectionCourtDecisionAttributes} from '$src/collectionCourtDecision/actions';
import {fetchAttributes as fetchCollectionLetterAttributes} from '$src/collectionLetter/actions';
import {fetchAttributes as fetchCollectionNoteAttributes} from '$src/collectionNote/actions';
import {fetchAttributes as fetchCommentAttributes} from '$src/comments/actions';
import {fetchAttributes as fetchContractFileAttributes} from '$src/contractFile/actions';
import {fetchAttributes as fetchCopyAreasToContractAttributes} from '$src/copyAreasToContract/actions';
import {fetchAttributes as fetchCreateCollectionLetterAttributes} from '$src/createCollectionLetter/actions';
import {fetchAttributes as fetchInvoiceAttributes} from '$src/invoices/actions';
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
  getAttributes as getCommentAttributes,
  getIsFetchingAttributes as getIsFetchingCommentAttributes,
  getMethods as getCommentMethods,
} from '$src/comments/selectors';
import {
  getIsFetchingAttributes as getIsFetchingContractFileAttributes,
  getMethods as getContractFileMethods,
} from '$src/contractFile/selectors';
import {
  getAttributes as getCopyAreasToContractAttributes,
  getIsFetchingAttributes as getIsFetchingCopyAreasToContractAttributes,
  getMethods as getCopyAreasToContractMethods,
} from '$src/copyAreasToContract/selectors';
import {
  getAttributes as getCreateCollectionLetterAttributes,
  getIsFetchingAttributes as getIsFetchignCreateCollectionLetterAttributes,
} from '$src/createCollectionLetter/selectors';
import {
  getAttributes as getInvoiceAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceAttributes,
  getMethods as getInvoiceMethods,
} from '$src/invoices/selectors';
import {
  getAttributes as getLeaseCreateChargeAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseCreateChargeAttributes,
} from '$src/leaseCreateCharge/selectors';

import type {Attributes, Methods} from '$src/types';

function LeasePageAttributes(WrappedComponent: any) {
  type Props = {
    collectionCourtDecisionAttributes: Attributes,
    collectionCourtDecisionMethods: Methods,
    collectionLetterAttributes: Attributes,
    collectionLetterMethods: Methods,
    collectionNoteAttributes: Attributes,
    collectionNoteMethods: Methods,
    commentAttributes: Attributes,
    commentMethods: Methods,
    contractFileMethods: Methods,
    copyAreasToContractAttributes: Attributes,
    copyAreasToContractMethods: Methods,
    createCollectionLetterAttributes: Attributes,
    fetchCollectionCourtDecisionAttributes: Function,
    fetchCollectionLetterAttributes: Function,
    fetchCollectionNoteAttributes: Function,
    fetchCommentAttributes: Function,
    fetchContractFileAttributes: Function,
    fetchCopyAreasToContractAttributes: Function,
    fetchCreateCollectionLetterAttributes: Function,
    fetchInvoiceAttributes: Function,
    fetchLeaseCreateChargeAttributes: Function,
    invoiceAttributes: Attributes,
    invoiceMethods: Methods,
    isFetchingCollectionCourtDecisionAttributes: boolean,
    isFetchingCollectionLetterAttributes: boolean,
    isFetchingCollectionNoteAttributes: boolean,
    isFetchingCommentAttributes: boolean,
    isFetchingContractFileAttributes: boolean,
    isFetchingCopyAreasToContractAttributes: boolean,
    isFetchingCreateCollectionLetterAttributes: boolean,
    isFetchingInvoiceAttributes: boolean,
    isFetchingLeaseCreateChargeAttributes: boolean,
    leaseCreateChargeAttributes: Attributes,
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
        collectionCourtDecisionMethods,
        collectionLetterMethods,
        collectionNoteMethods,
        commentMethods,
        contractFileMethods,
        copyAreasToContractMethods,
        createCollectionLetterAttributes,
        fetchCollectionCourtDecisionAttributes,
        fetchCollectionLetterAttributes,
        fetchCollectionNoteAttributes,
        fetchCommentAttributes,
        fetchContractFileAttributes,
        fetchCopyAreasToContractAttributes,
        fetchCreateCollectionLetterAttributes,
        fetchInvoiceAttributes,
        fetchLeaseCreateChargeAttributes,
        invoiceMethods,
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCommentAttributes,
        isFetchingContractFileAttributes,
        isFetchingCopyAreasToContractAttributes,
        isFetchingCreateCollectionLetterAttributes,
        isFetchingInvoiceAttributes,
        isFetchingLeaseCreateChargeAttributes,
        leaseCreateChargeAttributes,
      } = this.props;

      if(isEmpty(collectionCourtDecisionMethods) && !isFetchingCollectionCourtDecisionAttributes) {
        fetchCollectionCourtDecisionAttributes();
      }

      if(isEmpty(collectionLetterMethods) && !isFetchingCollectionLetterAttributes) {
        fetchCollectionLetterAttributes();
      }

      if(isEmpty(collectionNoteMethods) && !isFetchingCollectionNoteAttributes) {
        fetchCollectionNoteAttributes();
      }

      if(isEmpty(commentMethods) && !isFetchingCommentAttributes) {
        fetchCommentAttributes();
      }

      if(isEmpty(contractFileMethods) && !isFetchingContractFileAttributes) {
        fetchContractFileAttributes();
      }

      if(isEmpty(copyAreasToContractMethods) && !isFetchingCopyAreasToContractAttributes) {
        fetchCopyAreasToContractAttributes();
      }

      if(isEmpty(createCollectionLetterAttributes) && !isFetchingCreateCollectionLetterAttributes) {
        fetchCreateCollectionLetterAttributes();
      }

      if(isEmpty(invoiceMethods) && !isFetchingInvoiceAttributes) {
        fetchInvoiceAttributes();
      }

      if(isEmpty(leaseCreateChargeAttributes) && !isFetchingLeaseCreateChargeAttributes) {
        fetchLeaseCreateChargeAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingCollectionCourtDecisionAttributes !== prevProps.isFetchingCollectionCourtDecisionAttributes ||
        this.props.isFetchingCollectionLetterAttributes !== prevProps.isFetchingCollectionLetterAttributes ||
        this.props.isFetchingCollectionNoteAttributes !== prevProps.isFetchingCollectionNoteAttributes ||
        this.props.isFetchingCommentAttributes !== prevProps.isFetchingCommentAttributes ||
        this.props.isFetchingContractFileAttributes !== prevProps.isFetchingContractFileAttributes ||
        this.props.isFetchingCopyAreasToContractAttributes !== prevProps.isFetchingCopyAreasToContractAttributes ||
        this.props.isFetchingCreateCollectionLetterAttributes !== prevProps.isFetchingCreateCollectionLetterAttributes ||
        this.props.isFetchingInvoiceAttributes !== prevProps.isFetchingInvoiceAttributes ||
        this.props.isFetchingLeaseCreateChargeAttributes !== prevProps.isFetchingLeaseCreateChargeAttributes) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCommentAttributes,
        isFetchingContractFileAttributes,
        isFetchingCopyAreasToContractAttributes,
        isFetchingCreateCollectionLetterAttributes,
        isFetchingInvoiceAttributes,
        isFetchingLeaseCreateChargeAttributes,
      } = this.props;
      const isFetching = isFetchingCollectionCourtDecisionAttributes ||
        isFetchingCollectionLetterAttributes ||
        isFetchingCollectionNoteAttributes ||
        isFetchingCommentAttributes ||
        isFetchingContractFileAttributes ||
        isFetchingCopyAreasToContractAttributes ||
        isFetchingCreateCollectionLetterAttributes ||
        isFetchingInvoiceAttributes ||
        isFetchingLeaseCreateChargeAttributes;

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
        collectionCourtDecisionAttributes: getCollectionCourtDecisionAttributes(state),
        collectionCourtDecisionMethods: getCollectionCourtDecisionMethods(state),
        collectionLetterAttributes: getCollectionLetterAttributes(state),
        collectionLetterMethods: getCollectionLetterMethods(state),
        collectionNoteAttributes: getCollectionNoteAttributes(state),
        collectionNoteMethods: getCollectionNoteMethods(state),
        commentAttributes: getCommentAttributes(state),
        commentMethods: getCommentMethods(state),
        contractFileMethods: getContractFileMethods(state),
        copyAreasToContractAttributes: getCopyAreasToContractAttributes(state),
        copyAreasToContractMethods: getCopyAreasToContractMethods(state),
        createCollectionLetterAttributes: getCreateCollectionLetterAttributes(state),
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceMethods: getInvoiceMethods(state),
        isFetchingCollectionCourtDecisionAttributes: getIsFetchingCollectionCourtDecisionAttributes(state),
        isFetchingCollectionLetterAttributes: getIsFetchignCollectionLetterAttributes(state),
        isFetchingCollectionNoteAttributes: getIsFetchingCollectionNoteAttributes(state),
        isFetchingCommentAttributes: getIsFetchingCommentAttributes(state),
        isFetchingContractFileAttributes: getIsFetchingContractFileAttributes(state),
        isFetchingCopyAreasToContractAttributes: getIsFetchingCopyAreasToContractAttributes(state),
        isFetchingCreateCollectionLetterAttributes: getIsFetchignCreateCollectionLetterAttributes(state),
        isFetchingInvoiceAttributes: getIsFetchingInvoiceAttributes(state),
        isFetchingLeaseCreateChargeAttributes: getIsFetchingLeaseCreateChargeAttributes(state),
        leaseCreateChargeAttributes: getLeaseCreateChargeAttributes(state),
      };
    },
    {
      fetchCollectionCourtDecisionAttributes,
      fetchCollectionLetterAttributes,
      fetchCollectionNoteAttributes,
      fetchCommentAttributes,
      fetchContractFileAttributes,
      fetchCopyAreasToContractAttributes,
      fetchCreateCollectionLetterAttributes,
      fetchInvoiceAttributes,
      fetchLeaseCreateChargeAttributes,
    }
  ),
  LeasePageAttributes,
);

export {withLeasePageAttributes};
