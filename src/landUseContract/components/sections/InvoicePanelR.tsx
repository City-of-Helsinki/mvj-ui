import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { getFormValues, isValid } from "redux-form";
import isEmpty from "lodash/isEmpty";
import Authorization from "/src/components/authorization/Authorization";
import Button from "/src/components/button/Button";
import EditInvoiceForm from "./forms/EditInvoiceForm";
import InvoiceTemplateR from "./InvoiceTemplateR";
import TablePanelContainer from "/src/components/table/TablePanelContainer";
import { receiveIsEditClicked } from "/src/invoices/actions";
import { FormNames, Methods } from "enums";
import { ButtonColors } from "/src/components/enums";
import { isMethodAllowed } from "util/helpers";
import { getInvoicesByLandUseContractId, getIsEditClicked, getMethods as getInvoiceMethods } from "landUseInvoices/selectors";
import { getCurrentLandUseContract } from "landUseContract/selectors";
import type { Methods as MethodsType } from "types";
import type { Invoice, InvoiceList } from "/src/invoices/types";
type Props = {
  formValues: Record<string, any>;
  invoice: Invoice | null | undefined;
  invoices: InvoiceList;
  invoiceMethods: MethodsType;
  isEditClicked: boolean;
  onClose: (...args: Array<any>) => any;
  onInvoiceLinkClick: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
  receiveIsEditClicked: (...args: Array<any>) => any;
  valid: boolean;
};
type State = {
  creditedInvoice: Record<string, any> | null | undefined;
  interestInvoiceFor: Record<string, any> | null | undefined;
  invoice: Record<string, any> | null | undefined;
};

class InvoicePanelR extends PureComponent<Props, State> {
  component: any;
  state = {
    creditedInvoice: null,
    interestInvoiceFor: null,
    invoice: {}
  };
  setComponentRef = (el: any) => {
    this.component = el;
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.invoice !== state.invoice) {
      const invoice = props.invoice;
      const invoices = props.invoices;
      newState.invoice = invoice;
      newState.creditedInvoice = invoice && invoice.credited_invoice && !isEmpty(invoices) ? invoices.find(item => item.id === invoice.credited_invoice) : null;
      newState.interestInvoiceFor = invoice && invoice.interest_invoice_for && !isEmpty(invoices) ? invoices.find(item => item.id === invoice.interest_invoice_for) : null;
    }

    return !isEmpty(newState) ? newState : null;
  }

  handleSave = () => {
    const {
      formValues,
      onSave,
      receiveIsEditClicked,
      valid
    } = this.props;
    receiveIsEditClicked(true);

    if (valid) {
      onSave(formValues);
    }
  };

  render() {
    const {
      invoice,
      invoiceMethods,
      isEditClicked,
      onClose,
      onInvoiceLinkClick,
      valid
    } = this.props;
    const {
      creditedInvoice,
      interestInvoiceFor
    } = this.state;
    return <TablePanelContainer innerRef={this.setComponentRef} footer={invoice && !invoice.sap_id && <Authorization allow={isMethodAllowed(invoiceMethods, Methods.PATCH)}>
            <Button className={ButtonColors.SECONDARY} onClick={onClose} text='Peruuta' />
            <Button className={ButtonColors.SUCCESS} disabled={isEditClicked || !valid} onClick={this.handleSave} text='Tallenna' />
          </Authorization>} onClose={onClose} title='Laskun tiedot'>
        {isMethodAllowed(invoiceMethods, Methods.PATCH) && (!invoice || !invoice.sap_id) ? <EditInvoiceForm creditedInvoice={creditedInvoice} interestInvoiceFor={interestInvoiceFor} invoice={invoice} initialValues={{ ...invoice
      }} onInvoiceLinkClick={onInvoiceLinkClick} relativeTo={this.component} /> : <InvoiceTemplateR creditedInvoice={creditedInvoice} interestInvoiceFor={interestInvoiceFor} invoice={invoice} onInvoiceLinkClick={onInvoiceLinkClick} relativeTo={this.component} />}
      </TablePanelContainer>;
  }

}

const formName = FormNames.LAND_USE_CONTRACT_INVOICE_EDIT;
export default connect(state => {
  const currentLandUseContract = getCurrentLandUseContract(state);
  return {
    formValues: getFormValues(formName)(state),
    invoiceMethods: getInvoiceMethods(state),
    invoices: getInvoicesByLandUseContractId(state, currentLandUseContract.id),
    isEditClicked: getIsEditClicked(state),
    valid: isValid(formName)(state)
  };
}, {
  receiveIsEditClicked
}, null, {
  forwardRef: true
})(InvoicePanelR);