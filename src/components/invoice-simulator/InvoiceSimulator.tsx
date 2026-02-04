import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { formValueSelector, isValid as isFormValid } from "redux-form";
import { Row, Column } from "react-foundation";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import Button from "@/components/button/Button";
import FormText from "@/components/form/FormText";
import InvoiceSimulatorBillingPeriod from "./InvoiceSimulatorBillingPeriods";
import InvoiceSimulatorForm from "./InvoiceSimulatorForm";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import { fetchPreviewInvoices } from "@/previewInvoices/actions";
import { FormNames, PermissionMissingTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { InvoiceFieldPaths, InvoiceRowsFieldPaths } from "@/invoices/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentPreviewInvoiceBillingPeriods } from "@/components/helpers";
import { getFieldOptions, hasPermissions } from "@/util/helpers";
import { getAttributes as getInvoiceAttributes } from "@/invoices/selectors";
import { getCurrentLease } from "@/leases/selectors";
import { getIsFetching, getPreviewInvoices } from "@/previewInvoices/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";

const InvoiceSimulator: React.FC = () => {
  const currentLease = useSelector(getCurrentLease);
  const invoiceAttributes: Attributes = useSelector(getInvoiceAttributes);
  const isFetching = useSelector(getIsFetching);
  const previewInvoices = useSelector(getPreviewInvoices);
  const usersPermissions = useSelector(getUsersPermissions);
  const isValid = useSelector((state) => isFormValid(formName)(state));
  const year = useSelector((state) =>
    selector(state, "invoice_simulator_year"),
  );

  const [billingPeriods, setBillingPeriods] = useState<Array<
    Record<string, any>
  > | null>(null);
  const [invoiceReceivableTypeOptions, setInvoiceReceivableTypeOptions] =
    useState<Array<Record<string, any>>>([]);
  const [invoiceTypeOptions, setInvoiceTypeOptions] = useState<
    Array<Record<string, any>>
  >([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (invoiceAttributes) {
      setInvoiceReceivableTypeOptions(
        getFieldOptions(
          invoiceAttributes,
          InvoiceRowsFieldPaths.RECEIVABLE_TYPE,
          false,
        ),
      );
      setInvoiceTypeOptions(
        getFieldOptions(invoiceAttributes, InvoiceFieldPaths.TYPE, false),
      );
    }
  }, [invoiceAttributes]);

  useEffect(() => {
    if (previewInvoices) {
      setBillingPeriods(
        getContentPreviewInvoiceBillingPeriods(previewInvoices),
      );
    }
  }, [previewInvoices]);

  const handleCreatePreviewInvoices = () => {
    dispatch(
      fetchPreviewInvoices({
        lease: currentLease.id,
        year: year,
      }),
    );
  };

  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) {
    return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
  }

  return (
    <div className="invoice-simulator">
      <Row>
        <Column small={6} medium={3} large={2}>
          <InvoiceSimulatorForm onSubmit={handleCreatePreviewInvoices} />
        </Column>
        <Column small={6} medium={9} large={10}>
          <Button
            className={`${ButtonColors.SUCCESS} no-margin`}
            disabled={isFetching || !isValid}
            onClick={handleCreatePreviewInvoices}
            text="Näytä laskut"
          />
        </Column>
      </Row>
      {billingPeriods && !billingPeriods.length && !isFetching && (
        <FormText>Ei laskuja valittuna vuonna</FormText>
      )}
      {((billingPeriods && !!billingPeriods.length) || isFetching) && (
        <div
          className={classNames("invoice-simulator__container", {
            "is-loading":
              isFetching && (!billingPeriods || !billingPeriods.length),
          })}
        >
          {isFetching && (
            <LoaderWrapper className="relative-overlay-wrapper">
              <Loader isLoading={isFetching} />
            </LoaderWrapper>
          )}
          {billingPeriods &&
            !!billingPeriods.length &&
            billingPeriods.map((billingPeriod, index) => {
              return (
                <InvoiceSimulatorBillingPeriod
                  key={index}
                  dueDate={billingPeriod.dueDate}
                  endDate={billingPeriod.endDate}
                  explanations={billingPeriod.explanations}
                  invoices={billingPeriod.invoices}
                  invoiceReceivableTypeOptions={invoiceReceivableTypeOptions}
                  invoiceTypeOptions={invoiceTypeOptions}
                  startDate={billingPeriod.startDate}
                  totalAmount={billingPeriod.totalAmount}
                />
              );
            })}
        </div>
      )}
    </div>
  );
};

const formName = FormNames.INVOICE_SIMULATOR;
const selector = formValueSelector(formName);
export default InvoiceSimulator;
