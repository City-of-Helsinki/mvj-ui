import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type ContactPersonLike = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
};

type PartyEntryLike = {
  contactPerson?: ContactPersonLike;
  contactPersons?: ContactPersonLike[];
  [key: string]: unknown;
};

type PartiesTabData = {
  parties?: PartyEntryLike[];
  [key: string]: unknown;
};

const toContactPerson = (
  value: ContactPersonLike | undefined,
): { name: string | undefined; phone: string; email: string } => ({
  name: typeof value?.name === "string" ? value.name : undefined,
  phone: typeof value?.phone === "string" ? value.phone : "",
  email: typeof value?.email === "string" ? value.email : "",
});

const hasContactPersonData = (value: ContactPersonLike | undefined): boolean =>
  Boolean(value?.name || value?.phone || value?.email);

export const migration015MigrateContactPersonToContactPersonsArray: LandUseDbMigration =
  {
    version: 15,
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

        const data = (record.data ?? {}) as PartiesTabData;
        if (!Array.isArray(data.parties)) {
          cursor.continue();
          return;
        }

        const migratedParties = data.parties.map((partyEntry) => {
          if (Array.isArray(partyEntry.contactPersons)) {
            return partyEntry;
          }

          const contactPerson = toContactPerson(partyEntry.contactPerson);
          return {
            ...partyEntry,
            contactPersons: hasContactPersonData(partyEntry.contactPerson)
              ? [contactPerson]
              : [{ name: undefined, phone: "", email: "" }],
          };
        });

        const migratedData = {
          ...data,
          parties: migratedParties,
        };

        cursor.update({ ...record, data: migratedData });
        cursor.continue();
      };
    },
  };
