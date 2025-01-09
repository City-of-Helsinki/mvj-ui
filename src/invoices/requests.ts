import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import type { Invoice, InvoiceId } from "./types";
export const fetchAttributes = () => {
  return callApi(
    new Request(createUrl("invoice/"), {
      method: "OPTIONS",
    }),
  );
};
export const fetchInvoices = (
  params: Record<string, any> | null | undefined,
): Generator<any, any, any> => {
  return callApi(new Request(createUrl("invoice/", params)));
};
export const createInvoice = (invoice: Invoice): Generator<any, any, any> => {
  const body = JSON.stringify(invoice);
  return callApi(
    new Request(createUrl(`invoice/`), {
      method: "POST",
      body,
    }),
  );
};
export const creditInvoice = (
  payload: Record<string, any>,
): Generator<any, any, any> => {
  const { creditData, invoiceId } = payload;
  const body = JSON.stringify(creditData);
  return callApi(
    new Request(createUrl(`invoice_credit/?invoice=${invoiceId}`), {
      method: "POST",
      body,
    }),
  );
};
export const patchInvoice = (invoice: Invoice): Generator<any, any, any> => {
  const { id } = invoice;
  delete invoice.id;
  const body = JSON.stringify(invoice);
  return callApi(
    new Request(createUrl(`invoice/${id}/`), {
      method: "PATCH",
      body,
    }),
  );
};
export const exportInvoiceToLaske = (
  id: InvoiceId,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`invoice_export_to_laske/?invoice=${id}`), {
      method: "POST",
    }),
  );
};
export const deleteInvoice = (id: InvoiceId): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`invoice/${id}/`), {
      method: "DELETE",
    }),
  );
};
