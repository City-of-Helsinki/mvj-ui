import callApi from "@/api/callApi";
import createUrl from "@/api/createUrl";
import type { Contact, ContactId } from "./types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`contact/`), {
    method: 'OPTIONS'
  }));
};
export const createContact = (contact: Contact): Generator<any, any, any> => {
  const body = JSON.stringify(contact);
  return callApi(new Request(createUrl(`contact/`), {
    method: 'POST',
    body
  }));
};
export const editContact = (contact: Contact): Generator<any, any, any> => {
  const {
    id
  } = contact;
  const body = JSON.stringify(contact);
  return callApi(new Request(createUrl(`contact/${id}/`), {
    method: 'PUT',
    body
  }));
};
export const fetchContacts = (params: Record<string, any>): Generator<any, any, any> => {
  return callApi(new Request(createUrl('contact/', params)));
};
export const fetchSingleContact = (id: ContactId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`contact/${id}/`)));
};