import type { Persister } from "@tanstack/query-persist-client-core";
import {
  getPersistedClient,
  removePersistedClient,
  setPersistedClient,
} from "./landUseDb";

export const createLandUsePersister = (): Persister => ({
  persistClient: async (client) => {
    await setPersistedClient(client);
  },
  restoreClient: async () => getPersistedClient(),
  removeClient: async () => {
    await removePersistedClient();
  },
});
