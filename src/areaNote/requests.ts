import callApi from "../api/callApi";
import createUrl from "../api/createUrl";
import type { AreaNote, AreaNoteId } from "areaNote/types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`area_note/`), {
    method: 'OPTIONS'
  }));
};
export const fetchAreaNotes = (params: any | null | undefined): Generator<any, any, any> => {
  return callApi(new Request(createUrl('area_note/', params)));
};
export const createAreaNote = (areaNote: AreaNote): Generator<any, any, any> => {
  const body = JSON.stringify(areaNote);
  return callApi(new Request(createUrl(`area_note/`), {
    method: 'POST',
    body
  }));
};
export const editAreaNote = (areaNote: AreaNote): Generator<any, any, any> => {
  const {
    id
  } = areaNote;
  const body = JSON.stringify(areaNote);
  return callApi(new Request(createUrl(`area_note/${id}/`), {
    method: 'PUT',
    body
  }));
};
export const deleteAreaNote = (id: AreaNoteId): Generator<any, any, any> => {
  return callApi(new Request(createUrl(`area_note/${id}/`), {
    method: 'DELETE'
  }));
};