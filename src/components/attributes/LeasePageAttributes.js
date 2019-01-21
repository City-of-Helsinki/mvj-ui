// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {fetchAttributes as fetchBillingPeriodAttributes} from '$src/billingPeriods/actions';
import {fetchAttributes as fetchCollectionCourtDecisionAttributes} from '$src/collectionCourtDecision/actions';
import {fetchAttributes as fetchCollectionLetterAttributes} from '$src/collectionLetter/actions';
import {fetchAttributes as fetchCollectionNoteAttributes} from '$src/collectionNote/actions';
import {fetchAttributes as fetchCommentAttributes} from '$src/comments/actions';
import {fetchAttributes as fetchContractFileAttributes} from '$src/contractFile/actions';
import {fetchAttributes as fetchCopyAreasToContractAttributes} from '$src/copyAreasToContract/actions';
import {fetchAttributes as fetchCreateCollectionLetterAttributes} from '$src/createCollectionLetter/actions';
import {fetchAttributes as fetchInvoiceAttributes} from '$src/invoices/actions';
import {fetchAttributes as fetchInvoiceCreditAttributes} from '$src/invoiceCredit/actions';
import {fetchAttributes as fetchInvoiceSetAttributes} from '$src/invoiceSets/actions';
import {fetchAttributes as fetchInvoiceSetCreditAttributes} from '$src/invoiceSetCredit/actions';
import {fetchAttributes as fetchLeaseCreateChargeAttributes} from '$src/leaseCreateCharge/actions';
import {fetchAttributes as fetchPreviewInvoicesAttributes} from '$src/penaltyInterest/actions';
import {fetchAttributes as fetchPenaltyInterestAttributes} from '$src/previewInvoices/actions';
import {fetchAttributes as fetchRelatedLeaseAttributes} from '$src/relatedLease/actions';
import {fetchAttributes as fetchRentForPeriodAttributes} from '$src/rentForPeriod/actions';
import {fetchAttributes as fetchSetInvoicingStateAttributes} from '$src/setInvoicingState/actions';
import {fetchAttributes as fetchSetRentInfoCompletionStateAttributes} from '$src/setRentInfoCompletionState/actions';
import {
  getAttributes as getBillingPeriodAttributes,
  getIsFetchingAttributes as getIsFetchingBillingPeriodAttributes,
  getMethods as getBillingPeriodMethods,
} from '$src/billingPeriods/selectors';
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
  getMethods as getCreateCollectionLetterMethods,
} from '$src/createCollectionLetter/selectors';
import {
  getAttributes as getInvoiceAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceAttributes,
  getMethods as getInvoiceMethods,
} from '$src/invoices/selectors';
import {
  getAttributes as getInvoiceCreditAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceCreditAttributes,
  getMethods as getInvoiceCreditMethods,
} from '$src/invoiceCredit/selectors';
import {
  getAttributes as getInvoiceSetAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceSetAttributes,
  getMethods as getInvoiceSetMethods,
} from '$src/invoiceSets/selectors';
import {
  getAttributes as getInvoiceSetCreditAttributes,
  getIsFetchingAttributes as getIsFetchingInvoiceSetCreditAttributes,
  getMethods as getInvoiceSetCreditMethods,
} from '$src/invoiceSetCredit/selectors';
import {
  getAttributes as getLeaseCreateChargeAttributes,
  getIsFetchingAttributes as getIsFetchingLeaseCreateChargeAttributes,
  getMethods as getLeaseCreateChargeMethods,
} from '$src/leaseCreateCharge/selectors';
import {
  getAttributes as getPenaltyInterestAttributes,
  getIsFetchingAttributes as getIsFetchingPenaltyInterestAttributes,
  getMethods as getPenaltyInterestMethods,
} from '$src/penaltyInterest/selectors';
import {
  getAttributes as getPreviewInvoicesAttributes,
  getIsFetchingAttributes as getIsFetchingPreviewInvoicesAttributes,
  getMethods as getPreviewInvoicesMethods,
} from '$src/previewInvoices/selectors';
import {
  getAttributes as getRelatedLeaseAttributes,
  getIsFetchingAttributes as getIsFetchingRelatedLeaseAttributes,
  getMethods as getRelatedLeaseMethods,
} from '$src/relatedLease/selectors';
import {
  getAttributes as getRentForPeriodAttributes,
  getIsFetchingAttributes as getIsFetchingRentForPeriodAttributes,
  getMethods as getRentForPeriodMethods,
} from '$src/rentForPeriod/selectors';
import {
  getAttributes as getSetInvoicingStateAttributes,
  getIsFetchingAttributes as getIsFetchingSetInvoicingStateAttributes,
  getMethods as getSetInvoicingStateMethods,
} from '$src/setInvoicingState/selectors';
import {
  getAttributes as getSetRentInfoCompletionStateAttributes,
  getIsFetchingAttributes as getIsFetchingSetRentInfoCompletionStateAttributes,
  getMethods as getSetRentInfoCompletionStateMethods,
} from '$src/setRentInfoCompletionState/selectors';

import type {Attributes, Methods} from '$src/types';

function LeasePageAttributes(WrappedComponent: any) {
  type Props = {
    billingPeriodAttributes: Attributes,
    billingPeriodMethods: Methods,
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
    createCollectionLetterMethods: Methods,
    fetchBillingPeriodAttributes: Function,
    fetchCollectionCourtDecisionAttributes: Function,
    fetchCollectionLetterAttributes: Function,
    fetchCollectionNoteAttributes: Function,
    fetchCommentAttributes: Function,
    fetchContractFileAttributes: Function,
    fetchCopyAreasToContractAttributes: Function,
    fetchCreateCollectionLetterAttributes: Function,
    fetchInvoiceAttributes: Function,
    fetchInvoiceCreditAttributes: Function,
    fetchInvoiceSetAttributes: Function,
    fetchInvoiceSetCreditAttributes: Function,
    fetchLeaseCreateChargeAttributes: Function,
    fetchPenaltyInterestAttributes: Function,
    fetchPreviewInvoicesAttributes: Function,
    fetchRelatedLeaseAttributes: Function,
    fetchRentForPeriodAttributes: Function,
    fetchSetInvoicingStateAttributes: Function,
    fetchSetRentInfoCompletionStateAttributes: Function,
    invoiceAttributes: Attributes,
    invoiceMethods: Methods,
    invoiceCreditAttributes: Attributes,
    invoiceCreditMethods: Methods,
    invoiceSetAttributes: Attributes,
    invoiceSetMethods: Methods,
    invoiceSetCreditAttributes: Attributes,
    invoiceSetCreditMethods: Methods,
    isFetchingBillingPeriodAttributes: boolean,
    isFetchingCollectionCourtDecisionAttributes: boolean,
    isFetchingCollectionLetterAttributes: boolean,
    isFetchingCollectionNoteAttributes: boolean,
    isFetchingCommentAttributes: boolean,
    isFetchingContractFileAttributes: boolean,
    isFetchingCopyAreasToContractAttributes: boolean,
    isFetchingCreateCollectionLetterAttributes: boolean,
    isFetchingInvoiceAttributes: boolean,
    isFetchingInvoiceCreditAttributes: boolean,
    isFetchingInvoiceSetAttributes: boolean,
    isFetchingInvoiceSetCreditAttributes: boolean,
    isFetchingLeaseCreateChargeAttributes: boolean,
    isFetchingPenaltyInterestAttributes: boolean,
    isFetchingPreviewInvoicesAttributes: boolean,
    isFetchingRelatedLeaseAttributes: boolean,
    isFetchingRentForPeriodAttributes: boolean,
    isFetchingSetInvoicingStateAttributes: boolean,
    isFetchingSetRentInfoCompletionStateAttributes: boolean,
    leaseCreateChargeAttributes: Attributes,
    leaseCreateChargeMethods: Methods,
    penaltyInterestAttributes: Attributes,
    penaltyInterestMethods: Methods,
    previewInvoicesAttributes: Attributes,
    previewInvoicesMethods: Methods,
    relatedLeaseAttributes: Attributes,
    relatedLeaseMethods: Methods,
    rentForPeriodAttributes: Attributes,
    rentForPeriodMethods: Methods,
    setInvoicingStateAttributes: Attributes,
    setInvoicingStateMethods: Methods,
    setRentInfoCompletionStateAttributes: Attributes,
    setRentInfoCompletionStateMethods: Methods,
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
        billingPeriodMethods,
        collectionCourtDecisionMethods,
        collectionLetterMethods,
        collectionNoteMethods,
        commentMethods,
        contractFileMethods,
        copyAreasToContractMethods,
        createCollectionLetterMethods,
        fetchBillingPeriodAttributes,
        fetchCollectionCourtDecisionAttributes,
        fetchCollectionLetterAttributes,
        fetchCollectionNoteAttributes,
        fetchCommentAttributes,
        fetchContractFileAttributes,
        fetchCopyAreasToContractAttributes,
        fetchCreateCollectionLetterAttributes,
        fetchInvoiceAttributes,
        fetchInvoiceCreditAttributes,
        fetchInvoiceSetAttributes,
        fetchInvoiceSetCreditAttributes,
        fetchLeaseCreateChargeAttributes,
        fetchPenaltyInterestAttributes,
        fetchPreviewInvoicesAttributes,
        fetchRelatedLeaseAttributes,
        fetchRentForPeriodAttributes,
        fetchSetInvoicingStateAttributes,
        fetchSetRentInfoCompletionStateAttributes,
        invoiceMethods,
        invoiceCreditMethods,
        invoiceSetMethods,
        invoiceSetCreditMethods,
        isFetchingBillingPeriodAttributes,
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCommentAttributes,
        isFetchingContractFileAttributes,
        isFetchingCopyAreasToContractAttributes,
        isFetchingCreateCollectionLetterAttributes,
        isFetchingInvoiceAttributes,
        isFetchingInvoiceCreditAttributes,
        isFetchingInvoiceSetAttributes,
        isFetchingInvoiceSetCreditAttributes,
        isFetchingLeaseCreateChargeAttributes,
        isFetchingPenaltyInterestAttributes,
        isFetchingPreviewInvoicesAttributes,
        isFetchingRelatedLeaseAttributes,
        isFetchingRentForPeriodAttributes,
        isFetchingSetInvoicingStateAttributes,
        isFetchingSetRentInfoCompletionStateAttributes,
        leaseCreateChargeMethods,
        penaltyInterestMethods,
        previewInvoicesMethods,
        relatedLeaseMethods,
        rentForPeriodMethods,
        setInvoicingStateMethods,
        setRentInfoCompletionStateMethods,
      } = this.props;

      if(isEmpty(billingPeriodMethods) && !isFetchingBillingPeriodAttributes) {
        fetchBillingPeriodAttributes();
      }

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

      if(isEmpty(createCollectionLetterMethods) && !isFetchingCreateCollectionLetterAttributes) {
        fetchCreateCollectionLetterAttributes();
      }

      if(isEmpty(invoiceMethods) && !isFetchingInvoiceAttributes) {
        fetchInvoiceAttributes();
      }

      if(isEmpty(invoiceCreditMethods) && !isFetchingInvoiceCreditAttributes) {
        fetchInvoiceCreditAttributes();
      }

      if(isEmpty(invoiceSetMethods) && !isFetchingInvoiceSetAttributes) {
        fetchInvoiceSetAttributes();
      }

      if(isEmpty(invoiceSetCreditMethods) && !isFetchingInvoiceSetCreditAttributes) {
        fetchInvoiceSetCreditAttributes();
      }

      if(isEmpty(leaseCreateChargeMethods) && !isFetchingLeaseCreateChargeAttributes) {
        fetchLeaseCreateChargeAttributes();
      }

      if(isEmpty(penaltyInterestMethods) && !isFetchingPenaltyInterestAttributes) {
        fetchPenaltyInterestAttributes();
      }

      if(isEmpty(previewInvoicesMethods) && !isFetchingPreviewInvoicesAttributes) {
        fetchPreviewInvoicesAttributes();
      }

      if(isEmpty(relatedLeaseMethods) && !isFetchingRelatedLeaseAttributes) {
        fetchRelatedLeaseAttributes();
      }

      if(isEmpty(rentForPeriodMethods) && !isFetchingRentForPeriodAttributes) {
        fetchRentForPeriodAttributes();
      }

      if(isEmpty(setInvoicingStateMethods) && !isFetchingSetInvoicingStateAttributes) {
        fetchSetInvoicingStateAttributes();
      }

      if(isEmpty(setRentInfoCompletionStateMethods) && !isFetchingSetRentInfoCompletionStateAttributes) {
        fetchSetRentInfoCompletionStateAttributes();
      }
    }

    componentDidUpdate(prevProps: Props) {
      if(this.props.isFetchingBillingPeriodAttributes !== prevProps.isFetchingBillingPeriodAttributes ||
        this.props.isFetchingCollectionCourtDecisionAttributes !== prevProps.isFetchingCollectionCourtDecisionAttributes ||
        this.props.isFetchingCollectionLetterAttributes !== prevProps.isFetchingCollectionLetterAttributes ||
        this.props.isFetchingCollectionNoteAttributes !== prevProps.isFetchingCollectionNoteAttributes ||
        this.props.isFetchingCommentAttributes !== prevProps.isFetchingCommentAttributes ||
        this.props.isFetchingContractFileAttributes !== prevProps.isFetchingContractFileAttributes ||
        this.props.isFetchingCopyAreasToContractAttributes !== prevProps.isFetchingCopyAreasToContractAttributes ||
        this.props.isFetchingCreateCollectionLetterAttributes !== prevProps.isFetchingCreateCollectionLetterAttributes ||
        this.props.isFetchingInvoiceAttributes !== prevProps.isFetchingInvoiceAttributes ||
        this.props.isFetchingInvoiceCreditAttributes !== prevProps.isFetchingInvoiceCreditAttributes ||
        this.props.isFetchingInvoiceSetAttributes !== prevProps.isFetchingInvoiceSetAttributes ||
        this.props.isFetchingInvoiceSetCreditAttributes !== prevProps.isFetchingInvoiceSetCreditAttributes ||
        this.props.isFetchingLeaseCreateChargeAttributes !== prevProps.isFetchingLeaseCreateChargeAttributes ||
        this.props.isFetchingPenaltyInterestAttributes !== prevProps.isFetchingPenaltyInterestAttributes ||
        this.props.isFetchingPreviewInvoicesAttributes !== prevProps.isFetchingPreviewInvoicesAttributes ||
        this.props.isFetchingRelatedLeaseAttributes !== prevProps.isFetchingRelatedLeaseAttributes ||
        this.props.isFetchingRentForPeriodAttributes !== prevProps.isFetchingRentForPeriodAttributes ||
        this.props.isFetchingSetInvoicingStateAttributes !== prevProps.isFetchingSetInvoicingStateAttributes ||
        this.props.isFetchingSetRentInfoCompletionStateAttributes !== prevProps.isFetchingSetRentInfoCompletionStateAttributes) {
        this.setIsFetchingCommonAttributes();
      }
    }

    setIsFetchingCommonAttributes = () => {
      const {
        isFetchingBillingPeriodAttributes,
        isFetchingCollectionCourtDecisionAttributes,
        isFetchingCollectionLetterAttributes,
        isFetchingCollectionNoteAttributes,
        isFetchingCommentAttributes,
        isFetchingContractFileAttributes,
        isFetchingCopyAreasToContractAttributes,
        isFetchingCreateCollectionLetterAttributes,
        isFetchingInvoiceAttributes,
        isFetchingInvoiceCreditAttributes,
        isFetchingInvoiceSetAttributes,
        isFetchingInvoiceSetCreditAttributes,
        isFetchingLeaseCreateChargeAttributes,
        isFetchingPenaltyInterestAttributes,
        isFetchingPreviewInvoicesAttributes,
        isFetchingRelatedLeaseAttributes,
        isFetchingRentForPeriodAttributes,
        isFetchingSetInvoicingStateAttributes,
        isFetchingSetRentInfoCompletionStateAttributes,
      } = this.props;
      const isFetching = isFetchingBillingPeriodAttributes ||
        isFetchingCollectionCourtDecisionAttributes ||
        isFetchingCollectionLetterAttributes ||
        isFetchingCollectionNoteAttributes ||
        isFetchingCommentAttributes ||
        isFetchingContractFileAttributes ||
        isFetchingCopyAreasToContractAttributes ||
        isFetchingCreateCollectionLetterAttributes ||
        isFetchingInvoiceAttributes ||
        isFetchingInvoiceCreditAttributes ||
        isFetchingInvoiceSetAttributes ||
        isFetchingInvoiceSetCreditAttributes ||
        isFetchingLeaseCreateChargeAttributes ||
        isFetchingPenaltyInterestAttributes ||
        isFetchingPreviewInvoicesAttributes ||
        isFetchingRelatedLeaseAttributes ||
        isFetchingRentForPeriodAttributes ||
        isFetchingSetInvoicingStateAttributes ||
        isFetchingSetRentInfoCompletionStateAttributes;

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
        billingPeriodAttributes: getBillingPeriodAttributes(state),
        billingPeriodMethods: getBillingPeriodMethods(state),
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
        createCollectionLetterMethods: getCreateCollectionLetterMethods(state),
        invoiceAttributes: getInvoiceAttributes(state),
        invoiceMethods: getInvoiceMethods(state),
        invoiceCreditAttributes: getInvoiceCreditAttributes(state),
        invoiceCreditMethods: getInvoiceCreditMethods(state),
        invoiceSetAttributes: getInvoiceSetAttributes(state),
        invoiceSetMethods: getInvoiceSetMethods(state),
        invoiceSetCreditAttributes: getInvoiceSetCreditAttributes(state),
        invoiceSetCreditMethods: getInvoiceSetCreditMethods(state),
        isFetchingBillingPeriodAttributes: getIsFetchingBillingPeriodAttributes(state),
        isFetchingCollectionCourtDecisionAttributes: getIsFetchingCollectionCourtDecisionAttributes(state),
        isFetchingCollectionLetterAttributes: getIsFetchignCollectionLetterAttributes(state),
        isFetchingCollectionNoteAttributes: getIsFetchingCollectionNoteAttributes(state),
        isFetchingCommentAttributes: getIsFetchingCommentAttributes(state),
        isFetchingContractFileAttributes: getIsFetchingContractFileAttributes(state),
        isFetchingCopyAreasToContractAttributes: getIsFetchingCopyAreasToContractAttributes(state),
        isFetchingCreateCollectionLetterAttributes: getIsFetchignCreateCollectionLetterAttributes(state),
        isFetchingInvoiceAttributes: getIsFetchingInvoiceAttributes(state),
        isFetchingInvoiceCreditAttributes: getIsFetchingInvoiceCreditAttributes(state),
        isFetchingInvoiceSetAttributes: getIsFetchingInvoiceSetAttributes(state),
        isFetchingInvoiceSetCreditAttributes: getIsFetchingInvoiceSetCreditAttributes(state),
        isFetchingLeaseCreateChargeAttributes: getIsFetchingLeaseCreateChargeAttributes(state),
        isFetchingPenaltyInterestAttributes: getIsFetchingPenaltyInterestAttributes(state),
        isFetchingPreviewInvoicesAttributes: getIsFetchingPreviewInvoicesAttributes(state),
        isFetchingRelatedLeaseAttributes: getIsFetchingRelatedLeaseAttributes(state),
        isFetchingRentForPeriodAttributes: getIsFetchingRentForPeriodAttributes(state),
        isFetchingSetInvoicingStateAttributes: getIsFetchingSetInvoicingStateAttributes(state),
        isFetchingSetRentInfoCompletionStateAttributes: getIsFetchingSetRentInfoCompletionStateAttributes(state),
        leaseCreateChargeAttributes: getLeaseCreateChargeAttributes(state),
        leaseCreateChargeMethods: getLeaseCreateChargeMethods(state),
        penaltyInterestAttributes: getPenaltyInterestAttributes(state),
        penaltyInterestMethods: getPenaltyInterestMethods(state),
        previewInvoicesAttributes: getPreviewInvoicesAttributes(state),
        previewInvoicesMethods: getPreviewInvoicesMethods(state),
        relatedLeaseAttributes: getRelatedLeaseAttributes(state),
        relatedLeaseMethods: getRelatedLeaseMethods(state),
        rentForPeriodAttributes: getRentForPeriodAttributes(state),
        rentForPeriodMethods: getRentForPeriodMethods(state),
        setInvoicingStateAttributes: getSetInvoicingStateAttributes(state),
        setInvoicingStateMethods: getSetInvoicingStateMethods(state),
        setRentInfoCompletionStateAttributes: getSetRentInfoCompletionStateAttributes(state),
        setRentInfoCompletionStateMethods: getSetRentInfoCompletionStateMethods(state),
      };
    },
    {
      fetchBillingPeriodAttributes,
      fetchCollectionCourtDecisionAttributes,
      fetchCollectionLetterAttributes,
      fetchCollectionNoteAttributes,
      fetchCommentAttributes,
      fetchContractFileAttributes,
      fetchCopyAreasToContractAttributes,
      fetchCreateCollectionLetterAttributes,
      fetchInvoiceAttributes,
      fetchInvoiceCreditAttributes,
      fetchInvoiceSetAttributes,
      fetchInvoiceSetCreditAttributes,
      fetchLeaseCreateChargeAttributes,
      fetchPenaltyInterestAttributes,
      fetchPreviewInvoicesAttributes,
      fetchRelatedLeaseAttributes,
      fetchRentForPeriodAttributes,
      fetchSetInvoicingStateAttributes,
      fetchSetRentInfoCompletionStateAttributes,
    }
  ),
  LeasePageAttributes,
);

export {withLeasePageAttributes};
