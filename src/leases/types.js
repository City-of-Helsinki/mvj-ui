// @flow

import type {Action} from '../types';

export type LeaseState = Object;

export type Comment = Object;
export type CommentId = number;

export type Lease = Object;
export type LeaseId = number;
export type Attributes = Object;
export type Lessors = Array<any>;

export type LeasesList = Array<any>;
export type Invoices = Array<any>;
export type Areas = Array<any>;

export type FetchAttributesAction = Action<'mvj/leases/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leases/RECEIVE_ATTRIBUTES', Attributes>;

export type FetchLessorsAction = Action<'mvj/leases/FETCH_LESSORS', void>;
export type ReceiveLessorsAction = Action<'mvj/leases/RECEIVE_LESSORS', Lessors>;

export type FetchInvoicesAction = Action<'mvj/leases/FETCH_INVOICES', LeaseId>;
export type ReceiveInvoicesAction = Action<'mvj/leases/RECEIVE_INVOICES', Invoices>;

export type FetchAreasAction = Action<'mvj/leases/FETCH_AREAS', void>;
export type ReceiveAreasAction = Action<'mvj/leases/RECEIVE_AREAS', Areas>;

export type FetchLeasesAction = Action<'mvj/leases/FETCH_ALL', string>;
export type ReceiveLeasesAction = Action<'mvj/leases/RECEIVE_ALL', LeasesList>;

export type FetchSingleLeaseAction = Action<'mvj/leases/FETCH_SINGLE', LeaseId>;
export type ReceiveSingleLeaseAction = Action<'mvj/leases/RECEIVE_SINGLE', Lease>;

export type CreateLeaseAction = Action<'mvj/leases/CREATE', Lease>;
export type EditLeaseAction = Action<'mvj/leases/EDIT', Lease>;
export type PatchLeaseAction = Action<'mvj/leases/PATCH', Lease>;

export type LeaseNotFoundAction = Action<'mvj/leases/NOT_FOUND', void>;

export type HideEditModeAction = Action<'mvj/leases/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/leases/SHOW_EDIT', void>;

export type CreateCommentAction = Action<'mvj/leases/CREATE_COMMENT', Comment>;
export type DeleteCommentAction = Action<'mvj/leases/DELETE_COMMENT', Comment>;
export type EditCommentAction = Action<'mvj/leases/EDIT_COMMENT', Comment>;
export type ArchiveCommentAction = Action<'mvj/leases/ARCHIVE_COMMENT', Comment>;
export type UnarchiveCommentAction = Action<'mvj/leases/UNARCHIVE_COMMENT', Comment>;
export type ReceiveCommentAction = Action<'mvj/leases/RECEIVE_COMMENT', Comment>;
export type ReceiveEditedCommentAction = Action<'mvj/leases/RECEIVE_EDITED_COMMENT', Comment>;
export type ReceiveDeletedCommentAction = Action<'mvj/leases/RECEIVE_DELETED_COMMENT', Comment>;

export type ClearFormValidityFlagsAction = Action<'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS', void>
export type ReceiveLeaseInfoFormValidAction = Action<'mvj/leases/RECEIVE_LEASE_INFO_VALID', boolean>;
export type ReceiveSummaryFormValidAction = Action<'mvj/leases/RECEIVE_SUMMARY_VALID', boolean>;
export type ReceiveLeaseAreasFormValidAction = Action<'mvj/leases/RECEIVE_LEASE_AREAS_VALID', boolean>;
