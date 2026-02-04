import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { getFormValues, isValid } from "redux-form";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import EditInvoiceForm from "./forms/EditInvoiceForm";
import InvoiceTemplate from "./InvoiceTemplate";
import TablePanelContainer from "@/components/table/TablePanelContainer";
import { receiveIsEditClicked } from "@/invoices/actions";
import { FormNames, Methods } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { isMethodAllowed } from "@/util/helpers";
import {
  getInvoicesByLease,
  getIsEditClicked,
  getMethods as getInvoiceMethods,
} from "@/invoices/selectors";
import { getCurrentLease } from "@/leases/selectors";
import type { Methods as MethodsType } from "types";
import type { Invoice } from "@/invoices/types";

type Props = {
  invoice: Invoice | null | undefined;
  onClose: (...args: Array<any>) => any;
  onInvoiceLinkClick: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
};

const InvoicePanel = forwardRef<any, Props>(
  ({ invoice, onClose, onInvoiceLinkClick, onSave }, ref) => {
    const currentLease = useSelector(getCurrentLease);
    const formValues: Record<string, any> = useSelector(
      getFormValues(formName),
    );
    const invoiceMethods: MethodsType = useSelector(getInvoiceMethods);
    const invoices = useSelector((state) =>
      getInvoicesByLease(state, currentLease.id),
    );
    const isEditClicked = useSelector(getIsEditClicked);
    const valid = useSelector((state) => isValid(formName)(state));

    const component = useRef<any>(null);

    const [creditedInvoice, setCreditedInvoice] = useState<Record<
      string,
      any
    > | null>(null);
    const [interestInvoiceFor, setInterestInvoiceFor] = useState<Record<
      string,
      any
    > | null>(null);

    const dispatch = useDispatch();

    const setComponentRef = (el: any) => {
      component.current = el;
    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (component.current) {
          component.current.focus();
        }
      },
    }));

    useEffect(() => {
      if (invoice) {
        if (invoice.credited_invoice && !isEmpty(invoices)) {
          const credited = invoices.find(
            (item) => item.id === invoice.credited_invoice,
          );
          setCreditedInvoice(credited || null);
        } else {
          setCreditedInvoice(null);
        }

        if (invoice.interest_invoice_for && !isEmpty(invoices)) {
          const interestFor = invoices.find(
            (item) => item.id === invoice.interest_invoice_for,
          );
          setInterestInvoiceFor(interestFor || null);
        } else {
          setInterestInvoiceFor(null);
        }
      }
    }, [invoice, invoices]);

    const handleSave = () => {
      dispatch(receiveIsEditClicked(true));

      if (valid) {
        onSave(formValues);
      }
    };

    return (
      <TablePanelContainer
        innerRef={setComponentRef}
        footer={
          invoice &&
          !invoice.sap_id && (
            <Authorization
              allow={isMethodAllowed(invoiceMethods, Methods.PATCH)}
            >
              <>
                <Button
                  className={ButtonColors.SECONDARY}
                  onClick={onClose}
                  text="Peruuta"
                />
                <Button
                  className={ButtonColors.SUCCESS}
                  disabled={isEditClicked || !valid}
                  onClick={handleSave}
                  text="Tallenna"
                />
              </>
            </Authorization>
          )
        }
        onClose={onClose}
        title="Laskun tiedot"
      >
        {isMethodAllowed(invoiceMethods, Methods.PATCH) &&
        (!invoice || !invoice.sap_id) ? (
          <EditInvoiceForm
            creditedInvoice={creditedInvoice}
            interestInvoiceFor={interestInvoiceFor}
            invoice={invoice}
            initialValues={{ ...invoice }}
            onInvoiceLinkClick={onInvoiceLinkClick}
            relativeTo={component.current}
          />
        ) : (
          <InvoiceTemplate
            creditedInvoice={creditedInvoice}
            interestInvoiceFor={interestInvoiceFor}
            invoice={invoice}
            onInvoiceLinkClick={onInvoiceLinkClick}
            relativeTo={component.current}
          />
        )}
      </TablePanelContainer>
    );
  },
);

// Forwardref needs a display name
InvoicePanel.displayName = "InvoicePanel";

const formName = FormNames.LEASE_INVOICE_EDIT;
export default InvoicePanel;
