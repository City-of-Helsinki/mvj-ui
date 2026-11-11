import type { ApiResponse, Attributes, Methods, User } from "types";
import type {
  FormSection,
  SavedApplicationFormSection,
} from "@/application/types";
import type { Lease } from "@/leases/types";
import type { Contact } from "@/contacts/types";

export type AreaSearchState = {
  attributes: Attributes;
  methods: Methods;
  isFetchingAttributes: boolean;
  listAttributes: Attributes;
  listMethods: Methods;
  isFetchingListAttributes: boolean;
  areaSearchList: ApiResponse;
  areaSearchListByBBox: ApiResponse;
  isFetchingAreaSearchList: boolean;
  isFetchingAreaSearchListByBBox: boolean;
  currentAreaSearch: Record<string, any>;
  isFetchingCurrentAreaSearch: boolean;
  isEditMode: boolean;
  isSaveClicked: boolean;
  collapseStates: Record<string, any>;
  isFormValidById: Record<string, any>;
  isBatchEditingAreaSearchInfoChecks: boolean;
  isEditingAreaSearch: boolean;
  lastAreaSearchEditError: any;
  isSubmittingAreaSearchSpecs: boolean;
  isSubmittingAreaSearchApplication: boolean;
  isPerformingFileOperation: boolean;
  lastFileOperationError?: any;
};
export type AreaSearch = {
  id: number;
  address?: string;
  answer: Record<string, any>;
  // TODO: specify
  applicants: Array<string>;
  applicant_names?: Array<string>;
  area_search_attachments: Array<UploadedAreaSearchAttachmentMeta>;
  area_search_status: Record<string, any>;
  // TODO: specify
  description_area?: string;
  description_intended_use?: string;
  district: string;
  end_date?: string;
  form: any;
  // TODO: specify
  geometry: any;
  // TODO: specify
  identifier: string;
  intended_use: number;
  lessor: string;
  plot: Array<string>;
  preparer?: User;
  received_date?: string;
  settled_date?: string;
  service_unit?: number;
  start_date: string;
  state: string;
  lease?: Lease | null;
};
export type AreaSearchId = number;
export type UploadedAreaSearchAttachmentMeta = {
  id: number;
  attachment: string;
  name: string;
  field: number;
  created_at: string;
  user?: User;
  is_user_helsinki_ad?: boolean;
};
export type HandleShowContactModal = (
  contactType: Contact["type"],
  sectionIdentifier: FormSection["identifier"],
  answerSection: SavedApplicationFormSection,
) => void;
export type InfoCheckBatchEditData = {
  areaSearch: Record<string, any>;
  applicant: Array<{
    id: number;
    kind: Record<string, any>;
    data: Record<string, any>;
  }>;
};
export type CreateAreaSearchApplicationPayload = {
  application: Record<string, any>;
  specs: Record<string, any>;
};
export type DeleteAreaSearchAttachmentPayload = {
  id: number;
  callback?: () => void;
};
export type UploadAreaSearchAttachmentPayload = {
  fileData: File;
  callback?: (fileData: UploadedAreaSearchAttachmentMeta) => void;
  areaSearch?: number;
};
