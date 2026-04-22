import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type OldPartyDetails = {
  customerType?: unknown;
  [key: string]: unknown;
};

type OldPartiesData = {
  customer?: {
    details?: OldPartyDetails;
    [key: string]: unknown;
  };
  invoiceRecipient?: {
    details?: OldPartyDetails;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

const migrateDetails = (
  details: OldPartyDetails | undefined,
): Record<string, unknown> | undefined => {
  if (!details) {
    return undefined;
  }

  const { customerType, ...rest } = details;
  return { partyType: customerType, ...rest };
};

export const migration013RenameCustomerToPartyInPartiesTab: LandUseDbMigration =
  {
    version: 13,
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
        if (record.tabKey !== "parties") {
          cursor.continue();
          return;
        }

        const data = (record.data ?? {}) as OldPartiesData;
        const { customer, invoiceRecipient, ...rest } = data;

        const migratedData = {
          ...rest,
          party: customer
            ? {
                ...customer,
                details: migrateDetails(customer.details),
              }
            : undefined,
          invoiceRecipient: invoiceRecipient
            ? {
                ...invoiceRecipient,
                details: migrateDetails(invoiceRecipient.details),
              }
            : undefined,
        };

        cursor.update({ ...record, data: migratedData });
        cursor.continue();
      };
    },
  };
