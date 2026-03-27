import type { LandUseDbMigration } from "./types";

export const migration003CreateMonitoringToteutunutStore: LandUseDbMigration = {
  version: 3,
  migrate: ({ db, stores }) => {
    if (!db.objectStoreNames.contains(stores.monitoringToteutunutStore)) {
      db.createObjectStore(stores.monitoringToteutunutStore, {
        keyPath: ["agreementId", "siteId"],
      });
    }
  },
};
