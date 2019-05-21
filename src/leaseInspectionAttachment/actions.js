// @flow
import {createAction} from 'redux-actions';

import type {
  CreateLeaseInspectionAttachmentAction,
  CreateLeaseInspectionAttachmentPayload,
  DeleteLeaseInspectionAttachmentAction,
  DeleteLeaseInspectionAttachmentPayload,
} from './types';

export const createLeaseInspectionAttachment = (payload: CreateLeaseInspectionAttachmentPayload): CreateLeaseInspectionAttachmentAction =>
  createAction('mvj/leaseInspectionAttachment/CREATE')(payload);

export const deleteLeaseInspectionAttachment = (payload: DeleteLeaseInspectionAttachmentPayload): DeleteLeaseInspectionAttachmentAction =>
  createAction('mvj/leaseInspectionAttachment/DELETE')(payload);
