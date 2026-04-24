import type { AgreementTabRecord, LandUseDbMigration } from "./types";

/**
 * Reshapes the Guarantee entries stored under the `decisions` tab to align
 * with the collateral-type driven form fields introduced in the UI.
 *
 * Old shape had a flat structure with fields like `jarjestysnumero`,
 * `vakuusnumero`, `vakuudenMaara`, `huomautus`, `panttikirjanNumero`,
 * `siteUsages`, etc. The new shape keys fields per CSV-defined
 * collateral type contract.
 */

type OldGuarantee = {
  tyyppi?: unknown;
  laji?: unknown;
  panttikirjanNumero?: unknown;
  alkupvm?: unknown;
  loppupvm?: unknown;
  palautettuPvm?: unknown;
  vakuudenMaara?: unknown;
  huomautus?: unknown;
  [key: string]: unknown;
};

type NewGuarantee = {
  tyyppi?: string;
  vakuusasiakirjanLaji?: string;
  panttikirjanNumero?: string;
  alkupvm?: string;
  loppupvm?: string;
  palautettuPvm?: string;
  maara?: string;
  lisatiedot?: string;
};

const VALID_TYYPIT = new Set([
  "Panttikirja",
  "Rahavakuus",
  "Omavelkainen takaus",
  "Tilivarojen panttaus",
  "Muu vakuus",
]);

const asOptionalString = (value: unknown): string | undefined =>
  typeof value === "string" && value.length > 0 ? value : undefined;

const migrateGuarantee = (old: OldGuarantee): NewGuarantee => {
  const rawTyyppi = asOptionalString(old.tyyppi);
  const tyyppi =
    rawTyyppi && VALID_TYYPIT.has(rawTyyppi) ? rawTyyppi : undefined;

  return {
    tyyppi,
    vakuusasiakirjanLaji: asOptionalString(old.laji),
    panttikirjanNumero: asOptionalString(old.panttikirjanNumero),
    alkupvm: asOptionalString(old.alkupvm),
    loppupvm: asOptionalString(old.loppupvm),
    palautettuPvm: asOptionalString(old.palautettuPvm),
    maara: asOptionalString(old.vakuudenMaara),
    lisatiedot: asOptionalString(old.huomautus),
  };
};

type DecisionsTabData = {
  agreements?: Array<{ vakuudet?: OldGuarantee[]; [key: string]: unknown }>;
  [key: string]: unknown;
};

export const migration018ReshapeGuaranteesByType: LandUseDbMigration = {
  version: 18,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const cursorRequest = agreementTabStore.openCursor();

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        return;
      }

      const record = cursor.value as AgreementTabRecord;
      if (record.tabKey !== "decisions") {
        cursor.continue();
        return;
      }

      const data = (record.data ?? {}) as DecisionsTabData;
      if (!Array.isArray(data.agreements)) {
        cursor.continue();
        return;
      }

      const migratedAgreements = data.agreements.map((agreement) => {
        if (!Array.isArray(agreement.vakuudet)) {
          return agreement;
        }
        return {
          ...agreement,
          vakuudet: agreement.vakuudet.map(migrateGuarantee),
        };
      });

      cursor.update({
        ...record,
        data: { ...data, agreements: migratedAgreements },
      });
      cursor.continue();
    };
  },
};
