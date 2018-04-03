// @flow

import type {Action} from '../types';
import type {Contact} from '$src/contacts/types';

export type LeaseState = Object;

export type Comment = Object;
export type CommentId = number;

export type ContactModalSettings = Object | null;

export type Lease = Object;
export type LeaseId = number;
export type Attributes = Object;
export type Lessors = Array<any>;
export type Decisions = Array<any>;

export type LeasesList = Array<any>;

export type FetchAttributesAction = Action<'mvj/leases/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/leases/RECEIVE_ATTRIBUTES', Attributes>;

export type FetchLessorsAction = Action<'mvj/leases/FETCH_LESSORS', void>;
export type ReceiveLessorsAction = Action<'mvj/leases/RECEIVE_LESSORS', Lessors>;

export type FetchDecisionsAction = Action<'mvj/leases/FETCH_DECISIONS', string>;
export type ReceiveDecisionsAction = Action<'mvj/leases/RECEIVE_DECISIONS', Decisions>;

export type FetchLeasesAction = Action<'mvj/leases/FETCH_ALL', string>;
export type ReceiveLeasesAction = Action<'mvj/leases/RECEIVE_ALL', LeasesList>;

export type FetchSingleLeaseAction = Action<'mvj/leases/FETCH_SINGLE', LeaseId>;
export type ReceiveSingleLeaseAction = Action<'mvj/leases/RECEIVE_SINGLE', Lease>;

export type CreateLeaseAction = Action<'mvj/leases/CREATE', Lease>;
export type EditLeaseAction = Action<'mvj/leases/EDIT', Lease>;
export type PatchLeaseAction = Action<'mvj/leases/PATCH', Lease>;

export type LeaseNotFoundAction = Action<'mvj/leases/NOT_FOUND', void>;

export type HideContactModalAction = Action<'mvj/leases/HIDE_CONTACT_MODAL', void>;
export type ShowContactModalAction = Action<'mvj/leases/SHOW_CONTACT_MODAL', void>;
export type ReceiveContactModalSettingsAction = Action<'mvj/leases/RECEIVE_CONTACT_SETTINGS', ContactModalSettings>;
export type CreateContactAction = Action<'mvj/leases/CREATE_CONTACT', Contact>;
export type EditContactAction = Action<'mvj/leases/EDIT_CONTACT', Contact>;

export type HideEditModeAction = Action<'mvj/leases/HIDE_EDIT', void>;
export type ShowEditModeAction = Action<'mvj/leases/SHOW_EDIT', void>;

export type FetchCommentAttributesAction = Action<'mvj/leases/FETCH_COMMENT_ATTRIBUTES', void>;
export type ReceiveCommentAttributesAction = Action<'mvj/leases/RECEIVE_COMMENT_ATTRIBUTES', Attributes>;
export type FetchCommentsAction = Action<'mvj/leases/FETCH_COMMENTS', LeaseId>;
export type ReceiveCommentsAction = Action<'mvj/leases/RECEIVE_COMMENTS', Array<Comment>>;
export type CreateCommentAction = Action<'mvj/leases/CREATE_COMMENT', Comment>;
export type ReceiveCreatedCommentAction = Action<'mvj/leases/RECEIVE_CREATED_COMMENT', Comment>;
export type EditCommentAction = Action<'mvj/leases/EDIT_COMMENT', Comment>;
export type ReceiveEditedCommentAction = Action<'mvj/leases/RECEIVE_EDITED_COMMENT', Comment>;

export type ClearFormValidityFlagsAction = Action<'mvj/leases/CLEAR_FORM_VALIDITY_FLAGS', void>
export type ReceiveConstructabilityFormValidAction = Action<'mvj/leases/RECEIVE_CONSTRUCTABILITY_FORM_VALID', boolean>;
export type ReceiveContractsFormValidAction = Action<'mvj/leases/RECEIVE_CONTRACTS_FORM_VALID', boolean>;
export type ReceiveDecisionsFormValidAction = Action<'mvj/leases/RECEIVE_DECISIONS_FORM_VALID', boolean>;
export type ReceiveInspectionsFormValidAction = Action<'mvj/leases/RECEIVE_INSPECTIONS_FORM_VALID', boolean>;
export type ReceiveLeaseAreasFormValidAction = Action<'mvj/leases/RECEIVE_LEASE_AREAS_FORM_VALID', boolean>;
export type ReceiveLeaseInfoFormValidAction = Action<'mvj/leases/RECEIVE_LEASE_INFO_FORM_VALID', boolean>;
export type ReceiveSummaryFormValidAction = Action<'mvj/leases/RECEIVE_SUMMARY_FORM_VALID', boolean>;
export type ReceiveTenantsFormValidAction = Action<'mvj/leases/RECEIVE_TENANTS_FORM_VALID', boolean>;
