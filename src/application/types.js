// @flow

import type {Action, Attributes, Methods} from '$src/types';

export type ApplicationState = {
  attributes: Attributes,
  methods: Object,
  isFetchingAttributes: boolean,
  isFetchingApplicantInfoCheckAttributes: boolean,
  applicantInfoCheckAttributes: Attributes,
  isFetchingFormAttributes: boolean,
  formAttributes: Object,
  fieldTypeMapping: { [id: number]: string },
  attachmentAttributes: Attributes,
  attachmentMethods: Methods,
  isFetchingAttachmentAttributes: boolean,
  isFetchingApplicationAttachments: boolean,
  applicationAttachments: ?Array<Object>,
  pendingUploads: Array<Object>,
  isFetchingPendingUploads: boolean,
  isPerformingFileOperation: boolean,
};

export type Form = {
  name: string,
  title: string,
  id: number,
  is_template: boolean,
  sections: Array<FormSection>
};

export type FormSection = {
  id: number;
  identifier: string;
  title: string;
  visible: boolean;
  sort_order: number;
  add_new_allowed: boolean;
  add_new_text?: string;
  subsections: Array<FormSection>;
  fields: Array<FormField>;
  form_id: number;
  parent_id: number | null;
  show_duplication_check: boolean;
  applicant_type: string;
};

export type FormField = {
  id: number;
  identifier: string;
  type: number;
  label: string;
  hint_text?: string;
  enabled: boolean;
  required: boolean;
  validation?: string | null;
  action?: string | null;
  sort_order: number;
  choices: Array<FormFieldChoice>;
  section_id: number;
  default_value: string | boolean;
};

export type FormFieldChoice = {
  id: number;
  text: string;
  value: string;
  action?: string | null;
  has_text_input: boolean;
};
export type SectionExtraComponentProps = {
  section: FormSection,
  answer: Object,
  identifier: string,
  topLevel: boolean,
};

export type UploadedFileMeta = {
  id: number;
  attachment: string;
  name: string;
  field: number;
  created_at: string;
  answer: number | null;
  path: string | null;
};
export type ApplicationFormField = {
  value: PlotApplicationFormValue | null,
  extraValue: string
}

export type ApplicationFormSection = {
  fields: { [identifier: string]: ApplicationFormField },
  sections: { [identifier: string]: ApplicationFormSection | Array<ApplicationFormSection> },
  metadata?: { [key: string]: mixed },
  sectionRestrictions: { [identifier: string]: string }
}

export type SavedApplicationFormField = {
  value: PlotApplicationFormValue | null,
  extra_value: string
}

export type SavedApplicationFormSection = {
  fields: { [identifier: string]: SavedApplicationFormField },
  sections: { [identifier: string]: SavedApplicationFormSection | Array<SavedApplicationFormSection> },
  metadata?: { [key: string]: mixed },
}

export type PlotApplicationFormValue = string | Array<string> | Array<UploadedFileMeta> | boolean;

export type FetchAttributesAction = Action<'mvj/application/FETCH_ATTRIBUTES', void>;
export type ReceiveAttributesAction = Action<'mvj/application/RECEIVE_ATTRIBUTES', Attributes>;
export type ReceiveMethodsAction = Action<'mvj/application/RECEIVE_METHODS', Methods>;
export type AttributesNotFoundAction = Action<'mvj/application/ATTRIBUTES_NOT_FOUND', void>;

export type FetchApplicantInfoCheckAttributesAction = Action<'mvj/application/FETCH_APPLICANT_INFO_CHECK_ATTRIBUTES', void>;
export type ReceiveApplicantInfoCheckAttributesAction = Action<'mvj/application/RECEIVE_APPLICANT_INFO_CHECK_ATTRIBUTES', Attributes>;
export type ApplicantInfoCheckAttributesNotFoundAction = Action<'mvj/application/APPLICANT_INFO_CHECK_ATTRIBUTES_NOT_FOUND', void>;

export type ReceiveUpdatedTargetInfoCheckItemAction = Action<'mvj/application/RECEIVE_UPDATED_TARGET_INFO_CHECK_ITEM', Object>;
export type ReceiveUpdatedApplicantInfoCheckItemAction = Action<'mvj/application/RECEIVE_UPDATED_APPLICANT_INFO_CHECK_ITEM', Object>;

export type FetchFormAttributesAction = Action<'mvj/application/FETCH_FORM_ATTRIBUTES', Object>;
export type FormAttributesNotFoundAction = Action<'mvj/application/FORM_ATTRIBUTES_NOT_FOUND', void>;
export type ReceiveFormAttributesAction = Action<'mvj/application/RECEIVE_FORM_ATTRIBUTES', Attributes>;

export type FetchAttachmentAttributesAction = Action<'mvj/application/FETCH_ATTACHMENT_ATTRIBUTES', void>;
export type ReceiveAttachmentAttributesAction = Action<'mvj/application/RECEIVE_ATTACHMENT_ATTRIBUTES', Attributes>;
export type ReceiveAttachmentMethodsAction = Action<'mvj/application/RECEIVE_ATTACHMENT_METHODS', Methods>;
export type AttachmentAttributesNotFoundAction = Action<'mvj/application/ATTACHMENT_ATTRIBUTES_NOT_FOUND', void>;

export type FetchApplicationRelatedAttachmentsAction = Action<'mvj/application/FETCH_ATTACHMENTS', void>;
export type ReceiveApplicationRelatedAttachmentsAction = Action<'mvj/application/RECEIVE_ATTACHMENTS', Object>;
export type ApplicationRelatedAttachmentsNotFoundAction = Action<'mvj/application/ATTACHMENTS_NOT_FOUND', void>;

export type DeleteUploadAction = Action<'mvj/application/DELETE_UPLOAD', Object>;
export type UploadFileAction = Action<'mvj/application/UPLOAD_FILE', {
  fileData: Object,
  callback?: (path: string, fileData: UploadedFileMeta) => void,
  path: string
}>;

export type FetchPendingUploadsAction = Action<'mvj/application/FETCH_PENDING_UPLOADS', void>;
export type ReceivePendingUploadsAction = Action<'mvj/application/RECEIVE_PENDING_UPLOADS', Object>;
export type PendingUploadsNotFoundAction = Action<'mvj/application/PENDING_UPLOADS_NOT_FOUND', void>;
export type ReceiveFileOperationFinishedAction = Action<'mvj/application/RECEIVE_FILE_OPERATION_FINISHED', void>;
