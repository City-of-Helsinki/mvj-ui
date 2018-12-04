// @flow

import type {ApiState} from '$src/api/types';
import type {AuthState} from '$src/auth/types';
import type {CollectionCourtDecisionState} from '$src/collectionCourtDecision/types';
import type {CollectionLetterState} from '$src/collectionLetter/types';
import type {CollectionNoteState} from '$src/collectionNote/types';
import type {CommentState} from '$src/comments/types';
import type {LeaseState} from '$src/leases/types';
import type {LeaseTypeState} from '$src/leaseType/types';
import type {PenaltyInterestState} from '$src/penaltyInterest/types';
import type {PreviewInvoicesState} from '$src/previewInvoices/types';
import type {RentForPeriodState} from '$src/rentForPeriod/types';
import type {UserState} from '$src/role/types';
import type {VatState} from '$src/vat/types';

export type RootState = {
  api: ApiState,
  apiToken: AuthState,
  collectionCourtDecision: CollectionCourtDecisionState,
  collectionLetter: CollectionLetterState,
  collectionNote: CollectionNoteState,
  comment: CommentState,
  lease: LeaseState,
  leaseType: LeaseTypeState,
  penaltyInterest: PenaltyInterestState,
  previewInvoices: PreviewInvoicesState,
  rentForPeriod: RentForPeriodState,
  user: UserState,
  vat: VatState,
};
