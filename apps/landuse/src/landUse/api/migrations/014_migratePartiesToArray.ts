import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type OldPartiesData = {
  party?: unknown;
  contactPerson?: unknown;
  billingDetails?: unknown;
  invoiceRecipient?: unknown;
  negotiators?: unknown;
  signatories?: unknown;
  parties?: unknown[];
  [key: string]: unknown;
};

export const migration014MigratePartiesToArray: LandUseDbMigration = {
  version: 14,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const cursorRequest = agreementTabStore.openCursor();

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        return;
      }

      const record = cursor.value as AgreementTabRecord;
      if (record.tabKey !== "parties") {
        cursor.continue();
        return;
      }

      const data = (record.data ?? {}) as OldPartiesData;

      if (Array.isArray(data.parties)) {
        cursor.continue();
        return;
      }

      const {
        party,
        contactPerson,
        billingDetails,
        invoiceRecipient,
        negotiators,
        signatories,
        ...rest
      } = data;

      const partyEntry = {
        party: party ?? { details: {} },
        contactPerson: contactPerson ?? {
          name: undefined,
          phone: "",
          email: "",
        },
        billingDetails: billingDetails ?? {
          partnerCode: "",
          ovtCode: "",
          customerNumber: "",
          sapCustomerNumber: "",
          reference: "",
        },
        invoiceRecipient: invoiceRecipient ?? { details: {} },
      };

      const migratedData = {
        ...rest,
        parties: [partyEntry],
        negotiators: negotiators ?? [{ name: undefined }],
        signatories: signatories ?? [{ name: undefined }],
      };

      cursor.update({ ...record, data: migratedData });
      cursor.continue();
    };
  },
};
