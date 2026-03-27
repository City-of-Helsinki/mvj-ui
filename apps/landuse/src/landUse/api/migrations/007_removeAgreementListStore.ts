import type { LandUseDbMigration } from "./types";

const AGREEMENT_LIST_STORE = "agreementList";

export const migration007RemoveAgreementListStore: LandUseDbMigration = {
  version: 7,
  migrate: ({ db }) => {
    // Deleting the store removes all legacy agreementList records.
    if (db.objectStoreNames.contains(AGREEMENT_LIST_STORE)) {
      db.deleteObjectStore(AGREEMENT_LIST_STORE);
    }
  },
};
