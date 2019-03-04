// @flow
import {createAction} from 'redux-actions';

import type {
  CreateLeaseAreaAttachmentAction,
  CreateLeaseAreaAttachmentPayload,
  DeleteLeaseAreaAttachmentAction,
  DeleteLeaseAreaAttachmentPayload,
} from './types';

export const createLeaseAreaAttachment = (payload: CreateLeaseAreaAttachmentPayload): CreateLeaseAreaAttachmentAction =>
  createAction('mvj/leaseAreaAttachment/CREATE')(payload);

export const deleteLeaseAreaAttachment = (payload: DeleteLeaseAreaAttachmentPayload): DeleteLeaseAreaAttachmentAction =>
  createAction('mvj/leaseAreaAttachment/DELETE')(payload);
