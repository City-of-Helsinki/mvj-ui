import type {
  AgreementTabRecord,
  LandUseDbMigration,
} from "@/landUse/api/migrations/types";

type LegacyInstallment = {
  korotuksenAlkupvm?: unknown;
  korotuksenLoppupvm?: unknown;
  laskentajaksonAlkupvm?: unknown;
  laskentajaksonLoppupvm?: unknown;
  [key: string]: unknown;
};

type LegacyPaymentSchedule = {
  korotusPeruskorko?: unknown;
  korotusProsentti?: unknown;
  korotusMarginaali?: unknown;
  installments?: LegacyInstallment[];
  [key: string]: unknown;
};

type PaymentScheduleData = {
  paymentSchedules?: LegacyPaymentSchedule[];
  [key: string]: unknown;
};

export const migratePaymentScheduleInstallment = (
  installment: LegacyInstallment,
): LegacyInstallment => {
  const {
    korotuksenAlkupvm,
    korotuksenLoppupvm,
    laskentajaksonAlkupvm,
    laskentajaksonLoppupvm,
    ...rest
  } = installment;

  return {
    ...rest,
    laskentajaksonAlkupvm: laskentajaksonAlkupvm ?? korotuksenAlkupvm ?? "",
    laskentajaksonLoppupvm: laskentajaksonLoppupvm ?? korotuksenLoppupvm ?? "",
  };
};

export const migratePaymentSchedule = (
  schedule: LegacyPaymentSchedule,
): LegacyPaymentSchedule => {
  const {
    korotusPeruskorko,
    korotusProsentti,
    korotusMarginaali: _korotusMarginaali,
    installments,
    ...rest
  } = schedule;

  return {
    ...rest,
    korotusProsentti: korotusProsentti ?? korotusPeruskorko ?? "",
    installments: Array.isArray(installments)
      ? installments.map(migratePaymentScheduleInstallment)
      : [],
  };
};

export const migration023AlignPaymentScheduleCalculationFields: LandUseDbMigration =
  {
    version: 23,
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

        const data = (record.data ?? {}) as PaymentScheduleData;
        if (!Array.isArray(data.paymentSchedules)) {
          cursor.continue();
          return;
        }

        cursor.update({
          ...record,
          data: {
            ...data,
            paymentSchedules: data.paymentSchedules.map(migratePaymentSchedule),
          },
        });
        cursor.continue();
      };

      if (transaction.db.objectStoreNames.contains(stores.reactQueryStore)) {
        transaction.objectStore(stores.reactQueryStore).clear();
      }
    },
  };
