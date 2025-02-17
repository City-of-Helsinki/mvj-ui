import { createAction } from "redux-actions";
import type {
  CreateRelatedLeasePayload,
  CreateRelatedLeaseAction,
  DeleteRelatedLeasePayload,
  DeleteRelatedLeaseAction,
  CreateRelatedPlotApplicationAction,
  DeleteRelatedPlotApplicationAction,
  CreateRelatedPlotApplicationPayload,
  DeleteRelatedPlotApplicationPayload,
} from "./types";
export const createReleatedLease = (
  payload: CreateRelatedLeasePayload,
): CreateRelatedLeaseAction => createAction("mvj/relatedLease/CREATE")(payload);
export const deleteReleatedLease = (
  payload: DeleteRelatedLeasePayload,
): DeleteRelatedLeaseAction => createAction("mvj/relatedLease/DELETE")(payload);
export const createRelatedPlotApplication = (
  payload: CreateRelatedPlotApplicationPayload,
): CreateRelatedPlotApplicationAction =>
  createAction("mvj/relatedLease/CREATE_PLOT_APPLICATION")(payload);
export const deleteRelatedPlotApplication = (
  payload: DeleteRelatedPlotApplicationPayload,
): DeleteRelatedPlotApplicationAction =>
  createAction("mvj/relatedLease/DELETE_PLOT_APPLICATION")(payload);
