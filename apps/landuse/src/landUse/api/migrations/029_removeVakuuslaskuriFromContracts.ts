import type {
  AgreementTabRecord,
  LandUseDbMigration,
} from "@/landUse/api/migrations/types";

type ContractData = {
  vakuuslaskuri?: boolean;
  [key: string]: unknown;
};

type ContractsTabData = {
  contracts?: ContractData[];
  [key: string]: unknown;
};

export const migration029RemoveVakuuslaskuriFromContracts: LandUseDbMigration =
  {
    version: 29,
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
        const hasVakuuslaskuri = contracts.some(
          (contract) => "vakuuslaskuri" in contract,
        );

        if (!hasVakuuslaskuri) {
          cursor.continue();
          return;
        }

        const migratedContracts = contracts.map((contract) => {
          const { vakuuslaskuri: _removed, ...migratedContract } = contract;
          return migratedContract;
        });

        cursor.update({
          ...record,
          data: { ...data, contracts: migratedContracts },
        });
        cursor.continue();
      };
    },
  };
