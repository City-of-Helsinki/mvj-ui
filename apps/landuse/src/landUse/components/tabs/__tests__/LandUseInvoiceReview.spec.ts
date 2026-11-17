import { describe, expect, it } from "vitest";
import { getSchedulesPendingInvoiceReview } from "@/landUse/utils/invoiceReview";
import {
  LAND_USE_INVOICE_STATUSES,
  LAND_USE_PAYMENT_SCHEDULE_STATUSES,
  type LandUseInvoice,
} from "@/landUse/options";
import {
  getMissingPaymentScheduleFieldLabels,
  type LandUsePaymentScheduleEntry,
  validateRequiredInstallmentField,
} from "@/landUse/components/tabs/LandUsePaymentSchedule";

const createInvoice = (
  installmentNumber: string,
  id?: string,
): LandUseInvoice => ({
  id,
  recipientPartyIndex: "0",
  contractIndex: "0",
  installmentNumber,
  installmentTotal: "2",
  signedDate: "2026-01-20",
  asemakaavanLainvoimaisuusPvm: "2026-02-20",
  dueDate: "2026-04-15",
  laskentajaksonAlkupvm: "",
  laskentajaksonLoppupvm: "",
  invoiceNumber: undefined,
  type: "land_use_compensation",
  status: LAND_USE_INVOICE_STATUSES.DRAFT,
  billedAmount: "",
  remainingAmount: "",
  invoiceItems: [],
});

const createSchedule = (): LandUsePaymentScheduleEntry & {
  installments: (NonNullable<
    LandUsePaymentScheduleEntry["installments"]
  >[number] & { id: string })[];
} => ({
  id: "schedule-1",
  recipientPartyIndex: "0",
  contractIndex: "0",
  status: LAND_USE_PAYMENT_SCHEDULE_STATUSES.DRAFT,
  rejectedReason: null,
  signedDate: "2026-01-20",
  korotusProsentti: "",
  korkoPeruskorko: "",
  korkoMarginaali: "",
  daysInYear: "365",
  installments: [
    { ...createInvoice("1"), id: "installment-1", items: [] },
    { ...createInvoice("2"), id: "installment-2", items: [] },
  ],
});

describe("invoice review workflow", () => {
  it("requires a non-empty installment field value", () => {
    expect(validateRequiredInstallmentField("")).toBe("Pakollinen tieto");
    expect(validateRequiredInstallmentField("   ")).toBe("Pakollinen tieto");
    expect(validateRequiredInstallmentField("2026-04-15")).toBeUndefined();
    expect(validateRequiredInstallmentField(0)).toBeUndefined();
  });

  it("lists required party and installment fields missing before invoicing", () => {
    const schedule = createSchedule();

    expect(
      getMissingPaymentScheduleFieldLabels(schedule, {
        name: "",
        streetAddress: "",
        city: "Helsinki", // correct
        postalCode: "",
        ovtCode: "", // not required
        reference: "", // not required
        sapCustomerNumber: "",
        businessId: "",
        isCompany: true, // correct
      }),
    ).toEqual([
      "Nimi",
      "Y-tunnus",
      "Katuosoite",
      "Postinumero",
      "SAP-asiakasnumero",
      "Korotusprosentti %",
      "Korko %",
      "Koron marginaali %",
      "Erä 1: Korotuksen alkupäivä",
      "Erä 1: Korotuksen loppupäivä",
      "Erä 1: Maksurivit",
      "Erä 2: Korotuksen alkupäivä",
      "Erä 2: Korotuksen loppupäivä",
      "Erä 2: Maksurivit",
    ]);
  });

  it("derives review rows only from schedules pending approval", () => {
    const pendingSchedule = {
      ...createSchedule(),
      status: LAND_USE_PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL,
    };
    const draftSchedule = { ...createSchedule(), id: "schedule-2" };

    expect(
      getSchedulesPendingInvoiceReview([pendingSchedule, draftSchedule]),
    ).toEqual([pendingSchedule]);
  });
});
