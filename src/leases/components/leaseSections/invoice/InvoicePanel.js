// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {getFormValues, isValid} from 'redux-form';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import EditInvoiceForm from './forms/EditInvoiceForm';
import InvoiceTemplate from './InvoiceTemplate';
import TablePanelContainer from '$components/table/TablePanelContainer';
import {receiveIsEditClicked} from '$src/invoices/actions';
import {FormNames, Methods} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {isMethodAllowed} from '$util/helpers';
import {
  getInvoicesByLease,
  getIsEditClicked,
  getMethods as getInvoiceMethods,
} from '$src/invoices/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {Methods as MethodsType} from '$src/types';
import type {Invoice, InvoiceList} from '$src/invoices/types';

type Props = {
  formValues: Object,
  invoice: ?Invoice,
  invoices: InvoiceList,
  invoiceMethods: MethodsType,
  isEditClicked: boolean,
  onClose: Function,
  onInvoiceLinkClick: Function,
  onSave: Function,
  receiveIsEditClicked: Function,
  valid: boolean,
}

type State = {
  creditedInvoice: ?Object,
  interestInvoiceFor: ?Object,
  invoice: ?Object,
}

class InvoicePanel extends PureComponent<Props, State> {
  component: any

  state = {
    creditedInvoice: null,
    interestInvoiceFor: null,
    invoice: null,
  }

  setComponentRef = (el: any) => {
    this.component = el;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.invoice !== state.invoice) {
      const invoice = props.invoice;
      const invoices = props.invoices;

      newState.invoice = invoice;
      newState.creditedInvoice = invoice && invoice.credited_invoice && !isEmpty(invoices)
        ? invoices.find((item) => item.id === (invoice.credited_invoice))
        : null;
      newState.interestInvoiceFor = invoice && invoice.interest_invoice_for && !isEmpty(invoices)
        ? invoices.find((item) => item.id === (invoice.interest_invoice_for))
        : null;
    }

    return !isEmpty(newState) ? newState : null;
  }

  handleSave = () => {
    const {formValues, onSave, receiveIsEditClicked, valid} = this.props;

    receiveIsEditClicked(true);

    if(valid) {
      onSave(formValues);
    }
  }

  render() {
    const {
      invoice,
      invoiceMethods,
      isEditClicked,
      onClose,
      onInvoiceLinkClick,
      valid,
    } = this.props;
    const {
      creditedInvoice,
      interestInvoiceFor,
    } = this.state;

    return(
      <TablePanelContainer
        innerRef={this.setComponentRef}
        footer={invoice && !invoice.sap_id &&
          <Authorization allow={isMethodAllowed(invoiceMethods, Methods.PATCH)}>
            <Button
              className={ButtonColors.SECONDARY}
              onClick={onClose}
              text='Peruuta'
            />
            <Button
              className={ButtonColors.SUCCESS}
              disabled={isEditClicked || !valid}
              onClick={this.handleSave}
              text='Tallenna'
            />
          </Authorization>
        }
        onClose={onClose}
        title='Laskun tiedot'
      >
        {isMethodAllowed(invoiceMethods, Methods.PATCH) && (!invoice || !invoice.sap_id)
          ? <EditInvoiceForm
            creditedInvoice={creditedInvoice}
            interestInvoiceFor={interestInvoiceFor}
            invoice={invoice}
            initialValues={{...invoice}}
            onInvoiceLinkClick={onInvoiceLinkClick}
            relativeTo={this.component}
          />
          : <InvoiceTemplate
            creditedInvoice={creditedInvoice}
            interestInvoiceFor={interestInvoiceFor}
            invoice={invoice}
            onInvoiceLinkClick={onInvoiceLinkClick}
            relativeTo={this.component}
          />
        }
      </TablePanelContainer>

    );
  }
}

const formName = FormNames.LEASE_INVOICE_EDIT;
export default connect(
  (state) => {
    const currentLease = getCurrentLease(state);

    return {
      formValues: getFormValues(formName)(state),
      invoiceMethods: getInvoiceMethods(state),
      invoices: getInvoicesByLease(state, currentLease.id),
      isEditClicked: getIsEditClicked(state),
      valid: isValid(formName)(state),
    };
  },
  {
    receiveIsEditClicked,
  },
  null,
  {
    forwardRef: true,
  },
)(InvoicePanel);
