import type { AgreementTabRecord, LandUseDbMigration } from "./types";

type LegacyInvoice = {
  recipientPartyIndex?: string;
  contractIndex?: string;
  installmentNumber?: string;
  installmentTotal?: string;
  signedDate?: string;
  status?: string;
  [key: string]: unknown;
};

type LegacyPaymentScheduleData = {
  invoices?: LegacyInvoice[];
  [key: string]: unknown;
};

const getScheduleKey = (invoice: LegacyInvoice): string =>
  [
    invoice.recipientPartyIndex ?? "",
    invoice.contractIndex ?? "",
    invoice.signedDate ?? "",
  ].join("|");

export const migration021GroupInvoicesIntoPaymentSchedules: LandUseDbMigration =
  {
    version: 21,
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
        if (record.tabKey !== "paymentSchedule") {
          cursor.continue();
          return;
        }

        const data = (record.data ?? {}) as LegacyPaymentScheduleData;
        if (!Array.isArray(data.invoices)) {
          cursor.continue();
          return;
        }

        const schedulesByKey = new Map<
          string,
          {
            id: string;
            recipientPartyIndex?: string;
            contractIndex?: string;
            signedDate: string;
            status?: string;
            installments: LegacyInvoice[];
          }
        >();

        data.invoices.forEach((invoice, index) => {
          const key = getScheduleKey(invoice);
          const schedule = schedulesByKey.get(key);

          if (schedule) {
            schedule.installments.push(invoice);
            return;
          }

          schedulesByKey.set(key, {
            id: `migrated-payment-schedule-${index}`,
            recipientPartyIndex: invoice.recipientPartyIndex,
            contractIndex: invoice.contractIndex,
            signedDate: invoice.signedDate ?? "",
            status: invoice.status,
            installments: [invoice],
          });
        });

        const { invoices: _invoices, ...rest } = data;
        cursor.update({
          ...record,
          data: {
            ...rest,
            paymentSchedules: Array.from(schedulesByKey.values()),
          },
        });
        cursor.continue();
      };
    },
  };
