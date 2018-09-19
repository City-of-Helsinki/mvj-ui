// @flow

import callApi from '../api/callApi';
import createUrl from '../api/createUrl';

import {getSearchQuery} from '$src/util/helpers';
import type {PreviewInvoicesFetchPayload} from './types';

export const fetchPreviewInvoices = ({lease, year}: PreviewInvoicesFetchPayload): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`lease/${lease}/preview_invoices_for_year/${getSearchQuery({year: year})}`)));
};
