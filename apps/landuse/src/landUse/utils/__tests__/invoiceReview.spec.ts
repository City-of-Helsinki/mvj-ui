import { describe, expect, it } from "vitest";
import {
  createAcceptedBillingInvoices,
  getSchedulesPendingInvoiceReview,
  setPaymentScheduleStatus,
} from "@/landUse/utils/invoiceReview";
import {
  LAND_USE_INVOICE_STATUSES,
  type LandUseInvoice,
} from "@/landUse/options";
import {
  isInvoiceContentEditableInBilling,
  type LandUseBillingInvoice,
} from "@/landUse/components/tabs/LandUseBilling";
import type { LandUsePaymentScheduleEntry } from "@/landUse/components/tabs/LandUsePaymentSchedule";

const createInvoice = (installmentNumber: string): LandUseInvoice => ({
  recipientPartyIndex: "0",
  contractIndex: "0",
  installmentNumber,
  installmentTotal: "2",
  signedDate: "2026-01-20",
  asemakaavanLainvoimaisuusPvm: "2026-02-20",
  dueDate: "2026-04-15",
  korotuksenAlkupvm: "",
  korotuksenLoppupvm: "",
  invoiceNumber: "",
  type: "Maankäyttökorvaus",
  status: LAND_USE_INVOICE_STATUSES.DRAFT,
  billedAmount: "",
  remainingAmount: "",
  invoiceItems: [],
});

const createSchedule = (): LandUsePaymentScheduleEntry => ({
  id: "schedule-1",
  recipientPartyIndex: "0",
  contractIndex: "0",
  status: LAND_USE_INVOICE_STATUSES.DRAFT,
  signedDate: "2026-01-20",
  korotusPeruskorko: "",
  korotusMarginaali: "",
  korkoPeruskorko: "",
  korkoMarginaali: "",
  daysInYear: "365",
  installments: [createInvoice("1"), createInvoice("2")],
});

describe("invoice review workflow", () => {
  it("creates one open billing invoice per accepted schedule installment", () => {
    const result = createAcceptedBillingInvoices(createSchedule(), []);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      status: LAND_USE_INVOICE_STATUSES.OPEN,
      sourcePaymentScheduleId: "schedule-1",
      sourceInstallmentIndex: 0,
    });
    expect(result[0].sentAt).toBeTruthy();
    expect(result[0].invoiceNumber).toBeTruthy();
    expect(result[1].sourceInstallmentIndex).toBe(1);
  });

  it("does not duplicate installments already represented in billing", () => {
    const existingInvoice: LandUseBillingInvoice = {
      ...createInvoice("1"),
      sourcePaymentScheduleId: "schedule-1",
      sourceInstallmentIndex: 0,
    };

    const result = createAcceptedBillingInvoices(createSchedule(), [
      existingInvoice,
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].sourceInstallmentIndex).toBe(1);
  });

  it("derives review rows only from schedules pending approval", () => {
    const pendingSchedule = {
      ...createSchedule(),
      status: LAND_USE_INVOICE_STATUSES.PENDING_APPROVAL,
    };
    const draftSchedule = { ...createSchedule(), id: "schedule-2" };

    expect(
      getSchedulesPendingInvoiceReview([pendingSchedule, draftSchedule]),
    ).toEqual([pendingSchedule]);
  });

  it("unlocks only the matching payment schedule", () => {
    const schedule = createSchedule();
    const otherSchedule = { ...createSchedule(), id: "schedule-2" };

    const result = setPaymentScheduleStatus(
      [schedule, otherSchedule],
      schedule.id,
      LAND_USE_INVOICE_STATUSES.DRAFT,
    );

    expect(result[0].status).toBe(LAND_USE_INVOICE_STATUSES.DRAFT);
    expect(result[1]).toBe(otherSchedule);
  });

  it("keeps schedule-derived review invoices read-only in billing", () => {
    const reviewInvoice = createAcceptedBillingInvoices(
      createSchedule(),
      [],
    )[0];

    expect(isInvoiceContentEditableInBilling(reviewInvoice)).toBe(false);
    expect(
      isInvoiceContentEditableInBilling({
        ...reviewInvoice,
        status: LAND_USE_INVOICE_STATUSES.OPEN,
      }),
    ).toBe(false);
  });

  it("allows manual draft invoices to be edited but locks them when open", () => {
    const manualInvoice = createInvoice("1");

    expect(isInvoiceContentEditableInBilling(manualInvoice)).toBe(true);
    expect(
      isInvoiceContentEditableInBilling({
        ...manualInvoice,
        status: LAND_USE_INVOICE_STATUSES.OPEN,
      }),
    ).toBe(false);
  });
});
