import callApi from "api/callApi";
import createUrl from "api/createUrl";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('invoice_note/'), {
    method: 'OPTIONS'
  }));
};
export const fetchInvoiceNotes = (params: Record<string, any> | null | undefined): Generator<any, any, any> => {
  return callApi(new Request(createUrl('invoice_note/', params)));
};
export const createInvoiceNote = (data: Record<string, any>): Generator<any, any, any> => {
  const body = JSON.stringify(data);
  return callApi(new Request(createUrl(`invoice_note/`), {
    method: 'POST',
    body
  }));
};