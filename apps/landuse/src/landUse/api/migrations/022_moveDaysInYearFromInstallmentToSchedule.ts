import type { AgreementTabRecord, LandUseDbMigration } from "./types";
import { INTEREST_CALCULATION_DAYS_IN_YEAR } from "../../options";

type LegacyInstallment = {
  daysInYear?: string;
  [key: string]: unknown;
};

type LegacyPaymentSchedule = {
  daysInYear?: string;
  installments?: LegacyInstallment[];
  [key: string]: unknown;
};

type PaymentScheduleData = {
  paymentSchedules?: LegacyPaymentSchedule[];
  [key: string]: unknown;
};

const DEFAULT_DAYS_IN_YEAR = INTEREST_CALCULATION_DAYS_IN_YEAR.DAYS_365;

const pickScheduleDaysInYear = (schedule: LegacyPaymentSchedule): string => {
  if (schedule.daysInYear) {
    return schedule.daysInYear;
  }
  const firstInstallmentValue = schedule.installments?.find(
    (installment) =>
      typeof installment.daysInYear === "string" && installment.daysInYear,
  )?.daysInYear;
  return firstInstallmentValue ?? DEFAULT_DAYS_IN_YEAR;
};

const stripDaysInYear = (
  installment: LegacyInstallment,
): Omit<LegacyInstallment, "daysInYear"> => {
  const { daysInYear: _daysInYear, ...rest } = installment;
  return rest;
};

export const migration022MoveDaysInYearFromInstallmentToSchedule: LandUseDbMigration =
  {
    version: 22,
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

        const updatedSchedules = data.paymentSchedules.map((schedule) => ({
          ...schedule,
          daysInYear: pickScheduleDaysInYear(schedule),
          installments: (schedule.installments ?? []).map(stripDaysInYear),
        }));

        cursor.update({
          ...record,
          data: {
            ...data,
            paymentSchedules: updatedSchedules,
          },
        });
        cursor.continue();
      };
    },
  };
