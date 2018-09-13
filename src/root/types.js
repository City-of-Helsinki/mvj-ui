// @flow

import type {ApiState} from '../api/types';
import type {AuthState} from '../auth/types';
import type {CollectionCourtDecisionState} from '$src/collectionCourtDecision/types';
import type {CollectionLetterState} from '$src/collectionLetter/types';
import type {CollectionNoteState} from '../collectionNote/types';
import type {PenaltyInterestState} from '$src/penaltyInterest/types';
import type {UserState} from '../role/types';

export type RootState = {
  api: ApiState,
  apiToken: AuthState,
  collectionCourtDecision: CollectionCourtDecisionState,
  collectionLetter: CollectionLetterState,
  collectionNote: CollectionNoteState,
  penaltyInterest: PenaltyInterestState,
  user: UserState,
};
