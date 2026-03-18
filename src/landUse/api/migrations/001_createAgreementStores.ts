import type { LandUseDbMigration } from "./types";

export const migration001CreateAgreementStores: LandUseDbMigration = {
  version: 1,
  migrate: ({ db, stores }) => {
    if (!db.objectStoreNames.contains(stores.agreementTabStore)) {
      db.createObjectStore(stores.agreementTabStore, {
        keyPath: ["agreementId", "tabKey"],
      });
    }

    if (!db.objectStoreNames.contains(stores.agreementListStore)) {
      db.createObjectStore(stores.agreementListStore, {
        keyPath: "identifier",
      });
    }
  },
};
