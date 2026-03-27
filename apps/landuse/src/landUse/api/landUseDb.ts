import type { PersistedClient } from "@tanstack/query-persist-client-core";
import type { LandUseTabKey } from "./landUseTypes";
import { applyLandUseMigrations, LAND_USE_DB_VERSION } from "./migrations";

const LAND_USE_DB_NAME = "landUseDb";
const AGREEMENT_TAB_STORE = "agreementTabs";
const REACT_QUERY_STORE = "reactQueryCache";
const REACT_QUERY_KEY = "landUseQueryClient";

type AgreementTabRecord<T> = {
  agreementId: string;
  tabKey: LandUseTabKey;
  data: T;
  updatedAt: string;
};

type ReactQueryRecord = {
  key: string;
  client: PersistedClient;
  updatedAt: string;
};

const openLandUseDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(LAND_USE_DB_NAME, LAND_USE_DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const transaction = request.transaction;

      if (!transaction) {
        reject(new Error("Database migration transaction is not available"));
        return;
      }

      applyLandUseMigrations(event.oldVersion, {
        db,
        transaction,
        stores: {
          agreementTabStore: AGREEMENT_TAB_STORE,
          reactQueryStore: REACT_QUERY_STORE,
          monitoringToteutunutStore: "monitoringToteutunut",
        },
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const getStore = async (
  storeName: string,
  mode: IDBTransactionMode,
): Promise<{ db: IDBDatabase; store: IDBObjectStore; tx: IDBTransaction }> => {
  const db = await openLandUseDb();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  return { db, store, tx };
};

export const getAgreementTab = async <T>(
  agreementId: string,
  tabKey: LandUseTabKey,
): Promise<T | null> => {
  const { db, store, tx } = await getStore(AGREEMENT_TAB_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.get([agreementId, tabKey]);

    request.onsuccess = () => {
      const result = request.result as AgreementTabRecord<T> | undefined;
      resolve(result?.data ?? null);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const setAgreementTab = async <T>(
  agreementId: string,
  tabKey: LandUseTabKey,
  data: T,
): Promise<void> => {
  const { db, store, tx } = await getStore(AGREEMENT_TAB_STORE, "readwrite");

  return new Promise((resolve, reject) => {
    const record: AgreementTabRecord<T> = {
      agreementId,
      tabKey,
      data,
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const hasAgreementTab = async (
  agreementId: string,
  tabKey: LandUseTabKey,
): Promise<boolean> => {
  const { db, store, tx } = await getStore(AGREEMENT_TAB_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.getKey([agreementId, tabKey]);
    request.onsuccess = () => resolve(Boolean(request.result));
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const getAgreementIds = async (): Promise<string[]> => {
  const { db, store, tx } = await getStore(AGREEMENT_TAB_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.getAllKeys();

    request.onsuccess = () => {
      const keys = request.result as IDBValidKey[];
      const ids = new Set<string>();

      keys.forEach((key) => {
        if (Array.isArray(key) && typeof key[0] === "string") {
          ids.add(key[0]);
        }
      });

      resolve(Array.from(ids));
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const getPersistedClient = async (): Promise<PersistedClient | null> => {
  const { db, store, tx } = await getStore(REACT_QUERY_STORE, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.get(REACT_QUERY_KEY);
    request.onsuccess = () => {
      const result = request.result as ReactQueryRecord | undefined;
      resolve(result?.client ?? null);
    };
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const setPersistedClient = async (
  client: PersistedClient,
): Promise<void> => {
  const { db, store, tx } = await getStore(REACT_QUERY_STORE, "readwrite");

  return new Promise((resolve, reject) => {
    const record: ReactQueryRecord = {
      key: REACT_QUERY_KEY,
      client,
      updatedAt: new Date().toISOString(),
    };

    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};

export const removePersistedClient = async (): Promise<void> => {
  const { db, store, tx } = await getStore(REACT_QUERY_STORE, "readwrite");

  return new Promise((resolve, reject) => {
    const request = store.delete(REACT_QUERY_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
};
