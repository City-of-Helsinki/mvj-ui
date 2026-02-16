import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import AuthorizationError from "@/components/authorization/AuthorizationError";
import FormText from "@/components/form/FormText";
import InvoiceSimulatorBillingPeriod from "./InvoiceSimulatorBillingPeriods";
import InvoiceSimulatorForm from "./InvoiceSimulatorForm";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import { fetchPreviewInvoices } from "@/previewInvoices/actions";
import { PermissionMissingTexts } from "@/enums";
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
  }, [invoiceAttributes]);

  useEffect(() => {
    setBillingPeriods(getContentPreviewInvoiceBillingPeriods(previewInvoices));
  }, [previewInvoices]);

  const handleCreatePreviewInvoices = (values: {
    invoice_simulator_year: number;
  }) => {
    dispatch(
      fetchPreviewInvoices({
        lease: currentLease.id,
        year: values.invoice_simulator_year,
      }),
    );
  };

  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) {
    return <AuthorizationError text={PermissionMissingTexts.GENERAL} />;
  }

  return (
    <div className="invoice-simulator">
      <InvoiceSimulatorForm
        onSubmit={handleCreatePreviewInvoices}
        isFetching={isFetching}
      />
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

export default InvoiceSimulator;
