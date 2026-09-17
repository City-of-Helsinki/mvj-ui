import type {
  AgreementTabRecord,
  LandUseDbMigration,
} from "@/landUse/api/migrations/types";
import {
  LAND_USE_INVOICE_STATUSES,
  type LandUseInvoiceStatus,
} from "@/landUse/options";

type LegacyInvoice = {
  status?: unknown;
  [key: string]: unknown;
};

type LegacyPaymentSchedule = {
  installments?: LegacyInvoice[];
  [key: string]: unknown;
};

type BillingData = {
  invoices?: LegacyInvoice[];
  [key: string]: unknown;
};

type PaymentScheduleData = {
  paymentSchedules?: LegacyPaymentSchedule[];
  [key: string]: unknown;
};

export const migrateInvoiceStatus = (status: unknown): LandUseInvoiceStatus => {
  if (
    status === LAND_USE_INVOICE_STATUSES.OPEN ||
    status === LAND_USE_INVOICE_STATUSES.PAID ||
    status === LAND_USE_INVOICE_STATUSES.CREDITED
  ) {
    return status;
  }

  return LAND_USE_INVOICE_STATUSES.DRAFT;
};

const migrateInvoice = (invoice: LegacyInvoice): LegacyInvoice => ({
  ...invoice,
  status: migrateInvoiceStatus(invoice.status),
});

export const migration025NormalizeInvoiceStatuses: LandUseDbMigration = {
  version: 25,
  migrate: ({ transaction, stores }) => {
    const agreementTabStore = transaction.objectStore(stores.agreementTabStore);
    const cursorRequest = agreementTabStore.openCursor();

    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result;
      if (!cursor) {
        return;
      }

      const record = cursor.value as AgreementTabRecord;
      if (record.tabKey === "billing") {
        const data = (record.data ?? {}) as BillingData;
        if (Array.isArray(data.invoices)) {
          cursor.update({
            ...record,
            data: {
              ...data,
              invoices: data.invoices.map(migrateInvoice),
            },
          });
        }
      } else if (record.tabKey === "paymentSchedule") {
        const data = (record.data ?? {}) as PaymentScheduleData;
        if (Array.isArray(data.paymentSchedules)) {
          cursor.update({
            ...record,
            data: {
              ...data,
              paymentSchedules: data.paymentSchedules.map((schedule) => ({
                ...schedule,
                installments: Array.isArray(schedule.installments)
                  ? schedule.installments.map(migrateInvoice)
                  : [],
              })),
            },
          });
        }
      }

      cursor.continue();
    };

    if (transaction.db.objectStoreNames.contains(stores.reactQueryStore)) {
      transaction.objectStore(stores.reactQueryStore).clear();
    }
  },
};
