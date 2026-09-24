import type {
  AgreementTabRecord,
  LandUseDbMigration,
} from "@/landUse/api/migrations/types";

type GuaranteeData = {
  vierasvelkapanttaus?: unknown;
  [key: string]: unknown;
};

type ContractsTabData = {
  contracts?: Array<{
    vakuudet?: GuaranteeData[];
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

const convertToBoolean = (value: unknown): boolean =>
  value === true || value === "Kyllä";

export const migration030ConvertVierasvelkapanttausToBoolean: LandUseDbMigration =
  {
    version: 30,
    migrate: ({ transaction, stores }) => {
      const agreementTabStore = transaction.objectStore(
        stores.agreementTabStore,
      );
      const cursorRequest = agreementTabStore.openCursor();

      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (!cursor) {
          return;
        }

        const record = cursor.value as AgreementTabRecord;
        if (record.tabKey !== "contracts") {
          cursor.continue();
          return;
        }

        const data = (record.data ?? {}) as ContractsTabData;
        const contracts = data.contracts ?? [];
        const hasLegacyValue = contracts.some((contract) =>
          contract.vakuudet?.some(
            (guarantee) => typeof guarantee.vierasvelkapanttaus === "string",
          ),
        );

        if (!hasLegacyValue) {
          cursor.continue();
          return;
        }

        const migratedContracts = contracts.map((contract) => ({
          ...contract,
          vakuudet: contract.vakuudet?.map((guarantee) =>
            typeof guarantee.vierasvelkapanttaus === "string"
              ? {
                  ...guarantee,
                  vierasvelkapanttaus: convertToBoolean(
                    guarantee.vierasvelkapanttaus,
                  ),
                }
              : guarantee,
          ),
        }));

        cursor.update({
          ...record,
          data: { ...data, contracts: migratedContracts },
        });
        cursor.continue();
      };
    },
  };
