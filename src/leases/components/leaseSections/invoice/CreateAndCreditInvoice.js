// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import flowRight from 'lodash/flowRight';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import CreditInvoiceForm from './forms/CreditInvoiceForm';
import NewInvoiceForm from './forms/NewInvoiceForm';
import {createCharge} from '$src/leases/actions';
import {
  createInvoice,
  creditInvoice,
  receiveIsCreateClicked,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreditClicked,
  receiveIsCreditInvoicePanelOpen,
} from '$src/invoices/actions';
import {creditInvoiceSet} from '$src/invoiceSets/actions';
import {ButtonColors} from '$components/enums';
import {RecipientOptions} from '$src/leases/enums';
import {formatNewChargeForDb, formatCreditInvoiceForDb, formatNewInvoiceForDb} from '$src/invoices/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {getIsCreateInvoicePanelOpen, getIsCreditInvoicePanelOpen} from '$src/invoices/selectors';
import {withLeasePageAttributes} from '$components/attributes/LeasePageAttributes';

import type {Methods} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  createCharge: Function,
  createInvoice: Function,
  creditInvoice: Function,
  creditInvoiceSet: Function,
  currentLease: Lease,
  invoiceMethods: Methods, // Get vie withLeasePageAttributes HOC
  invoiceToCredit: ?Object,
  isCreateInvoicePanelOpen: boolean,
  isCreditInvoicePanelOpen: boolean,
  receiveIsCreateClicked: Function,
  receiveIsCreateInvoicePanelOpen: Function,
  receiveIsCreditClicked: Function,
  receiveIsCreditInvoicePanelOpen: Function,
  ref?: Function,
}

class CreateAndCreditInvoice extends Component <Props> {
  creditPanel: any
  creditPanelFirstField: any
  createPanel: any
  createPanelFirstField: any

  setCreatePanelRef = (el: any) => {
    this.createPanel = el;
  }

  setCreditPanelRef = (el: any) => {
    this.creditPanel = el;
  }

  handleOpenCreateInvoicePanelButtonClick = () => {
    const {receiveIsCreateClicked, receiveIsCreateInvoicePanelOpen} = this.props;
    receiveIsCreateClicked(false);
    receiveIsCreateInvoicePanelOpen(true);

    setTimeout(() => {
      scrollToComponent(this.createPanel, {
        offset: -130,
        align: 'top',
        duration: 450,
      });
      this.setFocusOnCreatePanel();
    }, 50);
  }

  handleSetRefForCreatePanelFirstField = (element: any) => {
    this.createPanelFirstField = element;
  }

  setFocusOnCreatePanel = () => {
    if(this.createPanelFirstField) {
      this.createPanelFirstField.focus();
    }
  }

  handleCloseCreateInvoicePanel = () => {
    const {receiveIsCreateInvoicePanelOpen} = this.props;
    receiveIsCreateInvoicePanelOpen(false);
  }

  handleCreateInvoice = (invoice: Object) => {
    const {
      createCharge,
      createInvoice,
      currentLease,
    } = this.props;

    if(invoice.recipient === RecipientOptions.ALL) {
      createCharge({
        leaseId: currentLease.id,
        data: formatNewChargeForDb(invoice),
      });
    } else {
      invoice.lease = currentLease.id;
      createInvoice(formatNewInvoiceForDb(invoice));
    }
  }

  handleOpenCreditInvoicePanelButtonClick = () => {
    const {receiveIsCreditClicked, receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreditClicked(false);
    receiveIsCreditInvoicePanelOpen(true);

    setTimeout(() => {
      scrollToComponent(this.creditPanel, {
        offset: -130,
        align: 'top',
        duration: 450,
      });
      this.setFocusOnCreditPanel();
    }, 50);
  }

  handleSetRefForCreditPanelFirstField = (element: any) => {
    this.creditPanelFirstField = element;
  }

  setFocusOnCreditPanel = () => {
    if(this.creditPanelFirstField) {
      this.creditPanelFirstField.focus();
    }
  }

  handleCloseCreditInvoicePanel = () => {
    const {receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreditInvoicePanelOpen(false);
  }

  handleCreditInvoice = (creditInvoiceData: Object) => {
    const {currentLease, invoiceToCredit} = this.props,
      isInvoiceSet = this.isInvoiceSet();

    if(isInvoiceSet) {
      const {creditInvoiceSet} = this.props;

      creditInvoiceSet({
        creditData: formatCreditInvoiceForDb(creditInvoiceData),
        invoiceSetId: invoiceToCredit && invoiceToCredit.id,
        lease: currentLease.id,
      });
    } else {
      const {creditInvoice} = this.props;

      creditInvoice({
        creditData: formatCreditInvoiceForDb(creditInvoiceData),
        invoiceId: invoiceToCredit && invoiceToCredit.id,
        lease: currentLease.id,
      });
    }
  }

  isInvoiceSet = () => {
    const {invoiceToCredit} = this.props;

    return (invoiceToCredit && invoiceToCredit.tableGroupName) ? true : false;
  }

  render() {
    const {
      invoiceMethods,
      invoiceToCredit,
      isCreateInvoicePanelOpen,
      isCreditInvoicePanelOpen,
    } = this.props;
    const isInvoiceSet = this.isInvoiceSet();

    return (
      <div className='invoice__new-invoice'>
        <Authorization allow={invoiceMethods.POST}>
          <Button
            className={`${ButtonColors.NEUTRAL} no-margin`}
            disabled={!invoiceToCredit || isCreditInvoicePanelOpen}
            onClick={this.handleOpenCreditInvoicePanelButtonClick}
            text='Hyvitä lasku'
          />
        </Authorization>

        <Authorization allow={invoiceMethods.POST}>
          <AddButtonSecondary
            disabled={isCreateInvoicePanelOpen}
            label='Luo lasku'
            onClick={this.handleOpenCreateInvoicePanelButtonClick}
          />
        </Authorization>

        <Authorization allow={invoiceMethods.POST}>
          <div ref={this.setCreditPanelRef}>
            {isCreditInvoicePanelOpen &&
              <CreditInvoiceForm
                isInvoiceSet={isInvoiceSet}
                onClose={this.handleCloseCreditInvoicePanel}
                onSave={this.handleCreditInvoice}
                setRefForFirstField={this.handleSetRefForCreditPanelFirstField}
              />
            }
          </div>
        </Authorization>

        <Authorization allow={invoiceMethods.POST}>
          <div ref={this.setCreatePanelRef}>
            {isCreateInvoicePanelOpen &&
              <NewInvoiceForm
                onClose={this.handleCloseCreateInvoicePanel}
                onSave={this.handleCreateInvoice}
                setRefForFirstField={this.handleSetRefForCreatePanelFirstField}
              />
            }
          </div>
        </Authorization>
      </div>
    );
  }
}

export default flowRight(
  withLeasePageAttributes,
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        isCreateInvoicePanelOpen: getIsCreateInvoicePanelOpen(state),
        isCreditInvoicePanelOpen: getIsCreditInvoicePanelOpen(state),
      };
    },
    {
      createCharge,
      createInvoice,
      creditInvoice,
      creditInvoiceSet,
      receiveIsCreateInvoicePanelOpen,
      receiveIsCreateClicked,
      receiveIsCreditClicked,
      receiveIsCreditInvoicePanelOpen,
    },
  ),
)(CreateAndCreditInvoice);
