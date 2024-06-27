import React, { Component } from "react";
import { connect } from "react-redux";
import scrollToComponent from "react-scroll-to-component";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import AddButton from "/src/components/form/AddButton";
import Authorization from "/src/components/authorization/Authorization";
import Button from "/src/components/button/Button";
import CreditInvoiceForm from "./forms/CreditInvoiceForm";
import NewInvoiceForm from "./forms/NewInvoiceForm";
import { createCharge } from "/src/leases/actions";
import { createInvoice, creditInvoice, deleteInvoice, receiveIsCreateClicked, receiveIsCreateInvoicePanelOpen, receiveIsCreditClicked, receiveIsCreditInvoicePanelOpen } from "/src/invoices/actions";
import { creditInvoiceSet } from "/src/invoiceSets/actions";
import { ButtonColors } from "/src/components/enums";
import { UsersPermissions } from "/src/usersPermissions/enums";
import { RecipientOptions } from "/src/leases/enums";
import { getPayloadCreateInvoice, getPayloadCreditInvoice } from "/src/invoices/helpers";
import { getCreditInvoiceSetPayload } from "/src/invoiceSets/helpers";
import { getPayloadLeaseCreateCharge } from "/src/leaseCreateCharge/helpers";
import { hasPermissions } from "util/helpers";
import { getCurrentLease } from "/src/leases/selectors";
import { getIsCreateInvoicePanelOpen, getIsCreditInvoicePanelOpen } from "/src/invoices/selectors";
import { getUsersPermissions } from "/src/usersPermissions/selectors";
import { AppConsumer, ActionTypes } from "/src/app/AppContext";
import { ConfirmationModalTexts } from "enums";
import type { Lease } from "/src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "/src/usersPermissions/types";
type Props = {
  createCharge: (...args: Array<any>) => any;
  createInvoice: (...args: Array<any>) => any;
  creditInvoice: (...args: Array<any>) => any;
  creditInvoiceSet: (...args: Array<any>) => any;
  currentLease: Lease;
  deleteInvoice: (...args: Array<any>) => any;
  invoiceToCredit: Record<string, any> | null | undefined;
  isCreateInvoicePanelOpen: boolean;
  isCreditInvoicePanelOpen: boolean;
  isInvoicingEnabled: boolean;
  receiveIsCreateClicked: (...args: Array<any>) => any;
  receiveIsCreateInvoicePanelOpen: (...args: Array<any>) => any;
  receiveIsCreditClicked: (...args: Array<any>) => any;
  receiveIsCreditInvoicePanelOpen: (...args: Array<any>) => any;
  ref?: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

class CreateAndCreditInvoice extends Component<Props> {
  creditPanel: any;
  creditPanelFirstField: any;
  createPanel: any;
  createPanelFirstField: any;
  setCreatePanelRef = (el: any) => {
    this.createPanel = el;
  };
  setCreditPanelRef = (el: any) => {
    this.creditPanel = el;
  };
  handleOpenCreateInvoicePanelButtonClick = () => {
    const {
      receiveIsCreateClicked,
      receiveIsCreateInvoicePanelOpen
    } = this.props;
    receiveIsCreateClicked(false);
    receiveIsCreateInvoicePanelOpen(true);
    setTimeout(() => {
      scrollToComponent(this.createPanel, {
        offset: -200,
        align: 'top',
        duration: 450
      });
      this.setFocusOnCreatePanel();
    }, 50);
  };
  handleSetRefForCreatePanelFirstField = (element: any) => {
    this.createPanelFirstField = element;
  };
  setFocusOnCreatePanel = () => {
    if (this.createPanelFirstField) {
      this.createPanelFirstField.focus();
    }
  };
  handleCloseCreateInvoicePanel = () => {
    const {
      receiveIsCreateInvoicePanelOpen
    } = this.props;
    receiveIsCreateInvoicePanelOpen(false);
  };
  handleCreateInvoice = (invoice: Record<string, any>) => {
    const {
      createCharge,
      createInvoice,
      currentLease
    } = this.props;
    invoice.lease = currentLease.id;

    if (invoice.tenant === RecipientOptions.ALL) {
      createCharge({
        leaseId: currentLease.id,
        data: getPayloadLeaseCreateCharge(invoice)
      });
    } else {
      // eslint-disable-next-line 
      const {
        recipient,
        ...getInvoiceTenant
      } = invoice;
      createInvoice(getPayloadCreateInvoice(getInvoiceTenant));
    }
  };
  handleOpenCreditInvoicePanelButtonClick = () => {
    const {
      receiveIsCreditClicked,
      receiveIsCreditInvoicePanelOpen
    } = this.props;
    receiveIsCreditClicked(false);
    receiveIsCreditInvoicePanelOpen(true);
    setTimeout(() => {
      scrollToComponent(this.creditPanel, {
        offset: -200,
        align: 'top',
        duration: 450
      });
      this.setFocusOnCreditPanel();
    }, 50);
  };
  handleDeleteInvoicePanelButtonClick = () => {
    const {
      invoiceToCredit,
      deleteInvoice,
      currentLease
    } = this.props;
    deleteInvoice({ ...invoiceToCredit,
      lease: currentLease.id
    });
  };
  handleSetRefForCreditPanelFirstField = (element: any) => {
    this.creditPanelFirstField = element;
  };
  setFocusOnCreditPanel = () => {
    if (this.creditPanelFirstField) {
      this.creditPanelFirstField.focus();
    }
  };
  handleCloseCreditInvoicePanel = () => {
    const {
      receiveIsCreditInvoicePanelOpen
    } = this.props;
    receiveIsCreditInvoicePanelOpen(false);
  };
  handleCreditInvoice = (creditInvoiceData: Record<string, any>) => {
    const {
      currentLease,
      invoiceToCredit
    } = this.props,
          isInvoiceSet = this.isInvoiceSet();

    if (isInvoiceSet) {
      const {
        creditInvoiceSet
      } = this.props;
      creditInvoiceSet({
        creditData: getCreditInvoiceSetPayload(creditInvoiceData),
        invoiceSetId: invoiceToCredit && invoiceToCredit.id,
        lease: currentLease.id
      });
    } else {
      const {
        creditInvoice
      } = this.props;
      creditInvoice({
        creditData: getPayloadCreditInvoice(creditInvoiceData),
        invoiceId: invoiceToCredit && invoiceToCredit.id,
        lease: currentLease.id
      });
    }
  };
  isInvoiceSet = () => {
    const {
      invoiceToCredit
    } = this.props;
    return invoiceToCredit && invoiceToCredit.tableGroupName ? true : false;
  };

  render() {
    const {
      invoiceToCredit,
      isCreateInvoicePanelOpen,
      isCreditInvoicePanelOpen,
      isInvoicingEnabled,
      usersPermissions
    } = this.props;
    const isInvoiceSet = this.isInvoiceSet();
    return <div className='invoice__new-invoice'>
        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}>
          <Button className={`${ButtonColors.NEUTRAL} no-margin`} disabled={!invoiceToCredit || isCreditInvoicePanelOpen} onClick={this.handleOpenCreditInvoicePanelButtonClick} text='Hyvitä lasku' />
        </Authorization>

        <AppConsumer>
          {({
          dispatch
        }) => {
          const handleDelete = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                this.handleDeleteInvoicePanelButtonClick();
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_INVOICE.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_INVOICE.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_INVOICE.TITLE
            });
          };

          return <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_INVOICE)}>
                <Button className={ButtonColors.ALERT} disabled={!invoiceToCredit || isCreditInvoicePanelOpen || invoiceToCredit.number} onClick={handleDelete} text='Poista lasku' />
              </Authorization>;
        }}
        </AppConsumer>

        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}>
          <div ref={this.setCreditPanelRef}>
            {isCreditInvoicePanelOpen && <CreditInvoiceForm invoiceToCredit={invoiceToCredit} isInvoiceSet={isInvoiceSet} onClose={this.handleCloseCreditInvoicePanel} onSave={this.handleCreditInvoice} setRefForFirstField={this.handleSetRefForCreditPanelFirstField} />}
          </div>
        </Authorization>

        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}>
          <Row>
            <Column>
              <AddButton disabled={isCreateInvoicePanelOpen || !isInvoicingEnabled} label='Luo lasku' onClick={this.handleOpenCreateInvoicePanelButtonClick} style={{
              marginTop: 15
            }} />
            </Column>
          </Row>
        </Authorization>

        <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE)}>
          <div ref={this.setCreatePanelRef}>
            {isCreateInvoicePanelOpen && <NewInvoiceForm initialValues={{
            recipient: hasPermissions(usersPermissions, UsersPermissions.ADD_INVOICE) ? RecipientOptions.ALL : undefined,
            rows: [{}]
          }} onClose={this.handleCloseCreateInvoicePanel} onSave={this.handleCreateInvoice} setRefForFirstField={this.handleSetRefForCreatePanelFirstField} />}
          </div>
        </Authorization>
      </div>;
  }

}

export default flowRight(connect(state => {
  const currentLease = getCurrentLease(state);
  return {
    currentLease: currentLease,
    isCreateInvoicePanelOpen: getIsCreateInvoicePanelOpen(state),
    isCreditInvoicePanelOpen: getIsCreditInvoicePanelOpen(state),
    isInvoicingEnabled: currentLease ? currentLease.is_invoicing_enabled : null,
    usersPermissions: getUsersPermissions(state)
  };
}, {
  createCharge,
  createInvoice,
  creditInvoice,
  creditInvoiceSet,
  receiveIsCreateInvoicePanelOpen,
  receiveIsCreateClicked,
  receiveIsCreditClicked,
  receiveIsCreditInvoicePanelOpen,
  deleteInvoice
}))(CreateAndCreditInvoice);