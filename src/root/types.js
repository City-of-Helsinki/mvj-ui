// @flow
import type {ApiState} from '$src/api/types';
import type {AreaNoteState} from '$src/areaNote/types';
import type {AuditLogState} from '$src/auditLog/types';
import type {AuthState} from '$src/auth/types';
import type {BatchRunState} from '$src/batchrun/types';
import type {BillingPeriodState} from '$src/billingPeriods/types';
import type {CollectionCourtDecisionState} from '$src/collectionCourtDecision/types';
import type {CollectionLetterState} from '$src/collectionLetter/types';
import type {CollectionNoteState} from '$src/collectionNote/types';
import type {CommentState} from '$src/comments/types';
import type {ContractFileState} from '$src/contractFile/types';
import type {ContactState} from '$src/contacts/types';
import type {CreateCollectionLetterState} from '$src/createCollectionLetter/types';
import type {CreditDecisionState} from '$src/creditDecision/types';
import type {DistrictState} from '$src/district/types';
import type {IndexState} from '$src/index/types';
import type {InfillDevelopmentState} from '$src/infillDevelopment/types';
import type {InfillDevelopmentAttachmentState} from '$src/infillDevelopmentAttachment/types';
import type {InvoiceState} from '$src/invoices/types';
import type {InvoiceNoteState} from '$src/invoiceNote/types';
import type {InvoiceSetState} from '$src/invoiceSets/types';
import type {LandUseContractState} from '$src/landUseContract/types';
import type {LeaseState} from '$src/leases/types';
import type {LeaseCreateChargeState} from '$src/leaseCreateCharge/types';
import type {LeaseholdTransferState} from '$src/leaseholdTransfer/types';
import type {LeaseTypeState} from '$src/leaseType/types';
import type {LessorState} from '$src/lessor/types';
import type {PenaltyInterestState} from '$src/penaltyInterest/types';
import type {PreviewInvoicesState} from '$src/previewInvoices/types';
import type {PlotSearchState} from '$src/plotSearch/types';
import type {PlotApplicationsState} from '$src/plotApplications/types';
import type {RentBasisState} from '$src/rentbasis/types';
import type {RentForPeriodState} from '$src/rentForPeriod/types';
import type {SapInvoicesState} from '$src/sapInvoice/types';
import type {ServiceUnitsState} from '$src/serviceUnits/types';
import type {LeaseStatisticReportState} from '$src/leaseStatisticReport/types';
import type {TradeRegisterState} from '$src/tradeRegister/types';
import type {UiDataState} from '$src/uiData/types';
import type {UserState} from '../users/types';
import type {UsersPermissionsState} from '$src/usersPermissions/types';
import type {VatState} from '$src/vat/types';
import type {LandUseInvoicesState} from '$src/landUseInvoices/types';
import type {LandUseAgreementAttachmentState} from '$src/landUseAgreementAttachment/types';

export type RootState = {
  api: ApiState,
  apiToken: AuthState,
  areaNote: AreaNoteState,
  auditLog: AuditLogState,
  batchrun: BatchRunState,
  billingPeriod: BillingPeriodState,
  collectionCourtDecision: CollectionCourtDecisionState,
  collectionLetter: CollectionLetterState,
  collectionNote: CollectionNoteState,
  comment: CommentState,
  contact: ContactState,
  contractFile: ContractFileState,
  createCollectionLetter: CreateCollectionLetterState,
  creditDecision: CreditDecisionState,
  district: DistrictState,
  form: Object,
  index: IndexState,
  infillDevelopment: InfillDevelopmentState,
  infillDevelopmentAttachment: InfillDevelopmentAttachmentState,
  invoice: InvoiceState,
  invoiceNote: InvoiceNoteState,
  invoiceSet: InvoiceSetState,
  landUseContract: LandUseContractState,
  lease: LeaseState,
  leaseCreateCharge: LeaseCreateChargeState,
  leaseholdTransfer: LeaseholdTransferState,
  leaseType: LeaseTypeState,
  lessor: LessorState,
  penaltyInterest: PenaltyInterestState,
  plotSearch: PlotSearchState,
  plotApplications: PlotApplicationsState,
  previewInvoices: PreviewInvoicesState,
  rentBasis: RentBasisState,
  rentForPeriod: RentForPeriodState,
  sapInvoice: SapInvoicesState,
  serviceUnits: ServiceUnitsState,
  leaseStatisticReport: LeaseStatisticReportState,
  tradeRegister: TradeRegisterState,
  uiData: UiDataState,
  user: UserState,
  usersPermissions: UsersPermissionsState,
  vat: VatState,
  landUseInvoice: LandUseInvoicesState,
  landUseAgreementAttachment: LandUseAgreementAttachmentState,
};
