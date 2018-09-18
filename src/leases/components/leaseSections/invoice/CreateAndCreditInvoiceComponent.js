// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';
import get from 'lodash/get';

import Button from '$components/button/Button';
import CreditInvoiceForm from './forms/CreditInvoiceForm';
import FormSection from '$components/form/FormSection';
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
import {RecipientOptions} from '$src/leases/enums';
import {formatNewChargeForDb, formatCreditInvoiceForDb, formatNewInvoiceForDb} from '$src/invoices/helpers';
import {formatDecimalNumberForDb} from '$util/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {getIsCreateInvoicePanelOpen, getIsCreditInvoicePanelOpen} from '$src/invoices/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  createCharge: Function,
  createInvoice: Function,
  creditInvoice: Function,
  creditInvoiceSet: Function,
  currentLease: Lease,
  enableCreateInvoice: boolean,
  enableCreditInvoice: boolean,
  invoiceToCredit: ?string,
  isCreateInvoicePanelOpen: boolean,
  isCreditInvoicePanelOpen: boolean,
  receiveIsCreateClicked: Function,
  receiveIsCreateInvoicePanelOpen: Function,
  receiveIsCreditClicked: Function,
  receiveIsCreditInvoicePanelOpen: Function,
  ref?: Function,
}

class CreateAndCreditInvoiceComponent extends Component <Props> {
  creditPanel: any
  creditPanelFirstField: any
  createPanel: any
  createPanelFirstField: any

  handleOpenCreateInvoicePanelButtonClick = () => {
    const {receiveIsCreateClicked, receiveIsCreateInvoicePanelOpen} = this.props;
    receiveIsCreateClicked(false);
    receiveIsCreateInvoicePanelOpen(true);

    setTimeout(() => {
      scrollToComponent(this.createPanel, {
        offset: -70,
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
      const rows = get(invoice, 'rows', []);
      let totalAmount = 0;
      rows.forEach((row) => {
        if(row.amount) {
          totalAmount += formatDecimalNumberForDb(row.amount);
        }

      });
      invoice.total_amount = totalAmount;
      invoice.billed_amount = totalAmount;
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
        offset: -70,
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

  handleCreditInvoice = (invoice: Object) => {
    const {currentLease, invoiceToCredit} = this.props,
      parts = invoiceToCredit ? invoiceToCredit.split('_') : [];

    if(parts[0] === 'invoice') {
      const {creditInvoice} = this.props;

      creditInvoice({
        creditData: formatCreditInvoiceForDb(invoice),
        invoiceId: parts[1],
        lease: currentLease.id,
      });
    } else {
      const {creditInvoiceSet} = this.props;

      creditInvoiceSet({
        creditData: formatCreditInvoiceForDb(invoice),
        invoiceSetId: parts[1],
        lease: currentLease.id,
      });
    }
  }

  isInvoiceSet = () => {
    const {invoiceToCredit} = this.props,
      parts = invoiceToCredit ? invoiceToCredit.split('_') : [];

    return parts.length ? parts[0] === 'invoiceset' : false;
  }

  render() {
    const {
      enableCreateInvoice,
      enableCreditInvoice,
      invoiceToCredit,
      isCreateInvoicePanelOpen,
      isCreditInvoicePanelOpen,
    } = this.props;
    const isInvoiceSet = this.isInvoiceSet();

    return (
      <div className='invoice__new-invoice'>
        <FormSection>
          <div>
            {enableCreditInvoice &&
              <Button
                className='button-green no-margin'
                disabled={!invoiceToCredit || isCreditInvoicePanelOpen}
                label='Hyvitä'
                onClick={this.handleOpenCreditInvoicePanelButtonClick}
              />
            }
            {enableCreateInvoice &&
              <Button
                className='button-green'
                disabled={isCreateInvoicePanelOpen}
                label='+ Luo lasku'
                onClick={this.handleOpenCreateInvoicePanelButtonClick}
              />
            }
          </div>
          <div ref={(ref) => this.creditPanel = ref}>
            {(isCreditInvoicePanelOpen && enableCreditInvoice) &&
              <CreditInvoiceForm
                isInvoiceSet={isInvoiceSet}
                onClose={this.handleCloseCreditInvoicePanel}
                onSave={this.handleCreditInvoice}
                setRefForFirstField={this.handleSetRefForCreditPanelFirstField}
              />
            }
          </div>
          <div ref={(ref) => this.createPanel = ref}>
            {(isCreateInvoicePanelOpen && enableCreateInvoice) &&
              <NewInvoiceForm
                onClose={this.handleCloseCreateInvoicePanel}
                onSave={this.handleCreateInvoice}
                setRefForFirstField={this.handleSetRefForCreatePanelFirstField}
              />
            }
          </div>
        </FormSection>
      </div>
    );
  }
}

export default connect(
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
)(CreateAndCreditInvoiceComponent);
