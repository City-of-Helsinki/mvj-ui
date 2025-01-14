import type { Action, Attributes, Methods } from "types";
export type ApplicationState = {
  attributes: Attributes;
  methods: Record<string, any>;
  isFetchingAttributes: boolean;
  isFetchingApplicantInfoCheckAttributes: boolean;
  applicantInfoCheckAttributes: Attributes;
  isFetchingFormAttributes: boolean;
  formAttributes: Record<string, any>;
  fieldTypeMapping: Record<number, string>;
  attachmentAttributes: Attributes;
  attachmentMethods: Methods;
  isFetchingAttachmentAttributes: boolean;
  isFetchingApplicationAttachments: boolean;
  applicationAttachments: Array<Record<string, any>> | null | undefined;
  pendingUploads: Array<Record<string, any>>;
  isFetchingPendingUploads: boolean;
  isPerformingFileOperation: boolean;
};
export type Form = {
  name: string;
  title: string;
  id: number;
  is_template: boolean;
  sections: Array<FormSection>;
};
export type FormSection = {
  id: number;
  identifier: string;
  title: string;
  title_fi: string;
  title_en: string | null;
  title_sv: string | null;
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
  type: any;
  label: string;
  label_fi: string;
  label_en: string | null;
  label_sv: string | null;
  hint_text: string | null;
  hint_text_fi: string | null;
  hint_text_en: string | null;
  hint_text_sv: string | null;
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
  text_fi: string;
  text_en: string | null;
  text_sv: string | null;
  value: string;
  action?: string | null;
  has_text_input: boolean;
};
export type SectionExtraComponentProps = {
  section: FormSection;
  answer: Record<string, any>;
  identifier: string;
  topLevel: boolean;
};
export type UploadFileData = {
  field: number;
  file: File;
  answer: number | null | undefined;
};
export type UploadAttachmentPayload = {
  fileData: UploadFileData;
  callback?: (path: string, fileData: UploadedFileMeta) => void;
  path: string;
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
  value: PlotApplicationFormValue | null;
  extraValue: string;
};
export type ApplicationFormSection = {
  fields: Record<string, ApplicationFormField>;
  sections: Record<
    string,
    ApplicationFormSection | Array<ApplicationFormSection>
  >;
  metadata?: Record<string, unknown>;
  sectionRestrictions: Record<string, string>;
};
export type SavedApplicationFormField = {
  value: PlotApplicationFormValue | null;
  extra_value: string;
};
export type SavedApplicationFormSection = {
  fields: Record<string, SavedApplicationFormField>;
  sections: Record<
    string,
    SavedApplicationFormSection | Array<SavedApplicationFormSection>
  >;
  metadata?: Record<string, unknown>;
};
export type PlotApplicationFormValue =
  | string
  | Array<string>
  | Array<UploadedFileMeta>
  | boolean;
export type FetchAttributesAction = Action<string, void>;
export type ReceiveAttributesAction = Action<string, Attributes>;
export type ReceiveMethodsAction = Action<string, Methods>;
export type AttributesNotFoundAction = Action<string, void>;
export type FetchApplicantInfoCheckAttributesAction = Action<string, void>;
export type ReceiveApplicantInfoCheckAttributesAction = Action<
  string,
  Attributes
>;
export type ApplicantInfoCheckAttributesNotFoundAction = Action<string, void>;
export type ReceiveUpdatedTargetInfoCheckItemAction = Action<
  string,
  Record<string, any>
>;
export type ReceiveUpdatedApplicantInfoCheckItemAction = Action<
  string,
  Record<string, any>
>;
export type FetchFormAttributesAction = Action<string, Record<string, any>>;
export type FormAttributesNotFoundAction = Action<string, void>;
export type ReceiveFormAttributesAction = Action<string, Attributes>;
export type FetchAttachmentAttributesAction = Action<string, void>;
export type ReceiveAttachmentAttributesAction = Action<string, Attributes>;
export type ReceiveAttachmentMethodsAction = Action<string, Methods>;
export type AttachmentAttributesNotFoundAction = Action<string, void>;
export type FetchApplicationRelatedAttachmentsAction = Action<string, void>;
export type ReceiveApplicationRelatedAttachmentsAction = Action<
  string,
  Record<string, any>
>;
export type ApplicationRelatedAttachmentsNotFoundAction = Action<string, void>;
export type DeleteUploadAction = Action<string, Record<string, any>>;
export type UploadFileAction = Action<string, UploadAttachmentPayload>;
export type FetchPendingUploadsAction = Action<string, void>;
export type ReceivePendingUploadsAction = Action<string, Record<string, any>>;
export type PendingUploadsNotFoundAction = Action<string, void>;
export type ReceiveFileOperationFinishedAction = Action<string, void>;
