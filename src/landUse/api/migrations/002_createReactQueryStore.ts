import type { LandUseDbMigration } from "./types";

export const migration002CreateReactQueryStore: LandUseDbMigration = {
  version: 2,
  migrate: ({ db, stores }) => {
    if (!db.objectStoreNames.contains(stores.reactQueryStore)) {
      db.createObjectStore(stores.reactQueryStore, { keyPath: "key" });
    }
  },
};
