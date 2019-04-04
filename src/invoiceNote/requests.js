// @flow
import callApi from '$src/api/callApi';
import createUrl from '$src/api/createUrl';

export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl('invoice_note/'), {method: 'OPTIONS'}));
};

export const fetchInvoiceNotes = (params: ?Object): Generator<any, any, any> => {
  return callApi(new Request(createUrl('invoice_note/', params)));
};

export const createInvoiceNote = (data: Object): Generator<any, any, any> => {
  const body = JSON.stringify(data);

  return callApi(new Request(createUrl(`invoice_note/`), {
    method: 'POST',
    body,
  }));
};
