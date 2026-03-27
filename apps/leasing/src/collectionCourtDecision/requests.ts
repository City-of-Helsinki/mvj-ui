import callApi from "@/api/callApi";
import callUploadRequest from "@/api/callUploadRequest";
import createUrl from "@/api/createUrl";
import type {
  CollectionCourtDecisionId,
  UploadCollectionCourtDecisionPayload,
} from "./types";
import type { LeaseId } from "@/leases/types";
export const fetchAttributes = (): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl("collection_court_decision/"), {
      method: "OPTIONS",
    }),
  );
};
export const fetchCollectionCourtDecisionsByLease = (
  lease: LeaseId,
): Generator<any, any, any> => {
  return callApi(
    new Request(
      createUrl(`collection_court_decision/?lease=${lease}&limit=10000`),
    ),
  );
};
export const uploadCollectionCourtDecision = (
  data: UploadCollectionCourtDecisionPayload,
): Generator<any, any, any> => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("data", JSON.stringify(data.data));
  const body = formData;
  return callUploadRequest(
    new Request(createUrl("collection_court_decision/"), {
      method: "POST",
      body,
    }),
  );
};
export const deleteCollectionCourtDecision = (
  id: CollectionCourtDecisionId,
): Generator<any, any, any> => {
  return callApi(
    new Request(createUrl(`collection_court_decision/${id}/`), {
      method: "DELETE",
    }),
  );
};
