// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import scrollToComponent from 'react-scroll-to-component';

import Button from '$components/button/Button';
import CreditInvoiceForm from './forms/CreditInvoiceForm';
import FormSection from '$components/form/FormSection';
import NewInvoiceForm from './forms/NewInvoiceForm';
import {createInvoice, creditInvoice, receiveIsCreateInvoicePanelOpen, receiveIsCreditInvoicePanelOpen} from '$src/invoices/actions';
import {creditInvoiceSet} from '$src/invoiceSets/actions';
import {getCreditInvoiceForDb, getNewInvoiceForDb} from '$src/invoices/helpers';
import {getCurrentLease} from '$src/leases/selectors';
import {getIsCreateInvoicePanelOpen, getIsCreditInvoicePanelOpen} from '$src/invoices/selectors';

import type {Lease} from '$src/leases/types';

type Props = {
  createInvoice: Function,
  creditInvoice: Function,
  creditInvoiceSet: Function,
  currentLease: Lease,
  enableCreateInvoice: boolean,
  enableCreditInvoice: boolean,
  isCreateInvoicePanelOpen: boolean,
  isCreditInvoicePanelOpen: boolean,
  receiveIsCreateInvoicePanelOpen: Function,
  receiveIsCreditInvoicePanelOpen: Function,
  ref?: Function,
  selectedCreditInvoice: ?string,
}

class CreateAndCreditInvoiceComponent extends Component <Props> {
  creditPanel: any
  panel: any

  handleOpenCreateInvoicePanelButtonClick = () => {
    const {receiveIsCreateInvoicePanelOpen} = this.props;
    receiveIsCreateInvoicePanelOpen(true);

    setTimeout(() => {
      scrollToComponent(this.panel, {
        offset: -70,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  handleCloseCreateInvoicePanel = () => {
    const {receiveIsCreateInvoicePanelOpen} = this.props;
    receiveIsCreateInvoicePanelOpen(false);
  }

  handleCreateInvoice = (invoice: Object) => {
    const {
      createInvoice,
      currentLease,
    } = this.props;

    invoice.lease = currentLease.id;
    invoice.billed_amount = invoice.total_amount;
    // invoice.state = InvoiceState.OPEN;

    createInvoice(getNewInvoiceForDb(invoice));
  }

  handleOpenCreditInvoicePanelButtonClick = () => {
    const {receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreditInvoicePanelOpen(true);

    setTimeout(() => {
      scrollToComponent(this.creditPanel, {
        offset: -70,
        align: 'top',
        duration: 450,
      });
    }, 50);
  }

  handleCloseCreditInvoicePanel = () => {
    const {receiveIsCreditInvoicePanelOpen} = this.props;
    receiveIsCreditInvoicePanelOpen(false);
  }

  handleCreditInvoice = (invoice: Object) => {
    const {currentLease, selectedCreditInvoice} = this.props,
      parts = selectedCreditInvoice ? selectedCreditInvoice.split('_') : [];

    if(parts[0] === 'invoice') {
      const {creditInvoice} = this.props;

      creditInvoice({
        creditData: getCreditInvoiceForDb(invoice),
        invoiceId: parts[1],
        lease: currentLease.id,
      });
    } else {
      const {creditInvoiceSet} = this.props;

      creditInvoiceSet({
        creditData: getCreditInvoiceForDb(invoice),
        invoiceSetId: parts[1],
        lease: currentLease.id,
      });
    }
  }

  render() {
    const {
      enableCreateInvoice,
      enableCreditInvoice,
      isCreateInvoicePanelOpen,
      isCreditInvoicePanelOpen,
      selectedCreditInvoice,
    } = this.props;

    return (
      <div className='invoice__add-invoice'>
        <FormSection>
          <div>
            {enableCreditInvoice &&
              <Button
                className='button-green no-margin'
                disabled={!selectedCreditInvoice}
                label='Hyvitä'
                onClick={this.handleOpenCreditInvoicePanelButtonClick}
                title='Hyvitä'
              />
            }
            {enableCreateInvoice &&
              <Button
                className='button-green'
                disabled={isCreateInvoicePanelOpen}
                label='+ Luo lasku'
                onClick={this.handleOpenCreateInvoicePanelButtonClick}
                title='Luo lasku'
              />
            }
          </div>
          <div ref={(ref) => this.creditPanel = ref}>
            {(isCreditInvoicePanelOpen && enableCreditInvoice) &&
              <CreditInvoiceForm
                onClose={this.handleCloseCreditInvoicePanel}
                onSave={this.handleCreditInvoice}
              />
            }
          </div>
          <div ref={(ref) => this.panel = ref}>
            {(isCreateInvoicePanelOpen && enableCreateInvoice) &&
              <NewInvoiceForm
                onClose={this.handleCloseCreateInvoicePanel}
                onSave={this.handleCreateInvoice}
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
    createInvoice,
    creditInvoice,
    creditInvoiceSet,
    receiveIsCreateInvoicePanelOpen,
    receiveIsCreditInvoicePanelOpen,
  },
)(CreateAndCreditInvoiceComponent);
