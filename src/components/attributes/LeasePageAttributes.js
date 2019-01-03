// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchCollectionCourtDecisionAttributes} from '$src/collectionCourtDecision/actions';
import {fetchAttributes as fetchCollectionLetterAttributes} from '$src/collectionLetter/actions';
import {fetchAttributes as fetchCollectionLetterTemplateAttributes} from '$src/collectionLetterTemplate/actions';
import {fetchAttributes as fetchCollectionNoteAttributes} from '$src/collectionNote/actions';
import {fetchAttributes as fetchCommentAttributes} from '$src/comments/actions';
import {fetchAttributes as fetchInvoiceAttributes} from '$src/invoices/actions';
import {fetchAttributes as fetchRelatedLeaseAttributes} from '$src/relatedLease/actions';
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
  getAttributes as getCollectionLetterTemplateAttributes,
  getIsFetchingAttributes as getIsFetchignCollectionLetterTemplateAttributes,
  getMethods as getCollectionLetterTemplateMethods,
} from '$src/collectionLetterTemplate/selectors';
import {
  getAttributes as getCollectionNoteAttributes,
  getIsFetchingAttributes as getIsFetchignCollectionNoteAttributes,
  getMethods as getCollectionNoteMethods,
} from '$src/collectionNote/selectors';
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
  getAttributes as getRelatedLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingRelatedLeaseAttributes,
  getMethods as getRelatedLeaseMethods,
} from '$src/relatedLease/selectors';

import type {Attributes, Methods} from '$src/types';

function LeasePageAttributes(WrappedComponent: any) {
  type Props = {
    collectionCourtDecisionAttributes: Attributes,
    collectionCourtDecisionMethods: Methods,
    collectionLetterAttributes: Attributes,
    collectionLetterMethods: Methods,
    collectionLetterTemplateAttributes: Attributes,
    collectionLetterTemplateMethods: Methods,
    collectionNoteAttributes: Attributes,
    collectionNoteMethods: Methods,
    commentAttributes: Attributes,
    commentMethods: Methods,
    fetchCollectionCourtDecisionAttributes: Function,
    fetchCollectionLetterAttributes: Function,
    fetchCollectionLetterTemplateAttributes: Function,
    fetchCollectionNoteAttributes: Function,
    fetchCommentAttributes: Function,
    fetchInvoiceAttributes: Function,
    fetchRelatedLeaseAttributes: Function,
    invoiceAttributes: Attributes,
    invoiceMethods: Methods,
    isFetchingCollectionCourtDecisionAttributes: boolean,
    isFetchingCollectionLetterAttributes: boolean,
    isFetchingCollectionLetterTemplateAttributes: boolean,
    isFetchingCollectionNoteAttributes: boolean,
    isFetchingCommentAttributes: boolean,
    isFetchingInvoiceAttributes: boolean,
    isFetchingRelatedLeaseAttributes: boolean,
    relatedLeaseAttributes: Attributes,
    relatedLeaseMethods: Methods,
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
        collectionLetterTemplateMethods,
        collectionNoteMethods,
        commentMethods,
        fetchCollectionCourtDecisionAttributes,
        fetchCollectionLetterAttributes,
        fetchCollectionLetterTemplateAttributes,
        fetchCollectionNoteAttributes,
        fetchCommentAttributes,
        fetchInvoiceAttributes,
        fetchRelatedLeaseAttributes,
        invoiceMethods,
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionLetterTemplateAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCommentAttributes,
        isFetchingInvoiceAttributes,
        isFetchingRelatedLeaseAttributes,
        relatedLeaseMethods,
      } = this.props;

      if(isEmpty(collectionCourtDecisionMethods) && !isFetchingCollectionCourtDecisionAttributes) {
        fetchCollectionCourtDecisionAttributes();
      }

      if(isEmpty(collectionLetterMethods) && !isFetchingCollectionLetterAttributes) {
        fetchCollectionLetterAttributes();
      }

      if(isEmpty(collectionLetterTemplateMethods) && !isFetchingCollectionLetterTemplateAttributes) {
        fetchCollectionLetterTemplateAttributes();
      }

      if(isEmpty(collectionNoteMethods) && !isFetchingCollectionNoteAttributes) {
        fetchCollectionNoteAttributes();
      }

      if(isEmpty(commentMethods) && !isFetchingCommentAttributes) {
        fetchCommentAttributes();
      }

      if(isEmpty(invoiceMethods) && !isFetchingInvoiceAttributes) {
        fetchInvoiceAttributes();
      }

      if(isEmpty(relatedLeaseMethods) && !isFetchingRelatedLeaseAttributes) {
        fetchRelatedLeaseAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingCollectionCourtDecisionAttributes !== prevProps.isFetchingCollectionCourtDecisionAttributes ||
        this.props.isFetchingCollectionLetterAttributes !== prevProps.isFetchingCollectionLetterAttributes ||
        this.props.isFetchingCollectionLetterTemplateAttributes !== prevProps.isFetchingCollectionLetterTemplateAttributes ||
        this.props.isFetchingCollectionNoteAttributes !== prevProps.isFetchingCollectionNoteAttributes ||
        this.props.isFetchingCommentAttributes !== prevProps.isFetchingCommentAttributes ||
        this.props.isFetchingInvoiceAttributes !== prevProps.isFetchingInvoiceAttributes ||
        this.props.isFetchingRelatedLeaseAttributes !== prevProps.isFetchingRelatedLeaseAttributes) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionLetterTemplateAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCommentAttributes,
        isFetchingInvoiceAttributes,
        isFetchingRelatedLeaseAttributes,
      } = this.props;
      const isFetching = isFetchingCollectionCourtDecisionAttributes ||
        isFetchingCollectionLetterAttributes ||
        isFetchingCollectionLetterTemplateAttributes ||
        isFetchingCollectionNoteAttributes ||
        isFetchingCommentAttributes ||
        isFetchingInvoiceAttributes ||
        isFetchingRelatedLeaseAttributes;

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
        collectionLetterTemplateAttributes: getCollectionLetterTemplateAttributes(state),
        collectionLetterTemplateMethods: getCollectionLetterTemplateMethods(state),
        collectionNoteAttributes: getCollectionNoteAttributes(state),
        collectionNoteMethods: getCollectionNoteMethods(state),
        commentAttributes: getCommentAttributes(state),
        commentMethods: getCommentMethods(state),
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceMethods: getInvoiceMethods(state),
        isFetchingCollectionCourtDecisionAttributes: getIsFetchingCollectionCourtDecisionAttributes(state),
        isFetchingCollectionLetterAttributes: getIsFetchignCollectionLetterAttributes(state),
        isFetchingCollectionLetterTemplateAttributes: getIsFetchignCollectionLetterTemplateAttributes(state),
        isFetchingCollectionNoteAttributes: getIsFetchignCollectionNoteAttributes(state),
        isFetchingCommentAttributes: getIsFetchingCommentAttributes(state),
        isFetchingInvoiceAttributes: getIsFetchingInvoiceAttributes(state),
        isFetchingRelatedLeaseAttributes: getIsFetchingRelatedLeaseAttributes(state),
        relatedLeaseAttributes: getRelatedLeaseAttributes(state),
        relatedLeaseMethods: getRelatedLeaseMethods(state),
      };
    },
    {
      fetchCollectionCourtDecisionAttributes,
      fetchCollectionLetterAttributes,
      fetchCollectionLetterTemplateAttributes,
      fetchCollectionNoteAttributes,
      fetchCommentAttributes,
      fetchInvoiceAttributes,
      fetchRelatedLeaseAttributes,
    }
  ),
  LeasePageAttributes,
);

export {withLeasePageAttributes};
