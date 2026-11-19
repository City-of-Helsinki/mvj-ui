import React from "react";
import { createForm } from "final-form";
import arrayMutators from "final-form-arrays";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LandUsePaymentSchedule,
  type LandUsePaymentScheduleFormValues,
  type PaymentScheduleEntry,
} from "@/landUse/components/tabs/LandUsePaymentSchedule";
import {
  INVOICE_ITEM_TYPES,
  INVOICE_STATUSES,
  INVOICE_TYPES,
  PAYMENT_SCHEDULE_STATUSES,
  type PaymentScheduleInstallment,
} from "@/landUse/options";

vi.mock("@/landUse/api/useLandUseMetadata", () => ({
  useLandUseMetadata: () => ({ data: {} }),
}));

vi.mock("@/landUse/hooks/useTableOfContents", () => ({
  useTocEntries: vi.fn(),
}));

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const createInstallment = (number: number): PaymentScheduleInstallment => ({
  recipientPartyIndex: "party-1",
  contractIndex: "contract-1",
  installmentNumber: String(number),
  installmentTotal: "3",
  signedDate: "1.1.2026",
  asemakaavanLainvoimaisuusPvm: "2.1.2026",
  dueDate: "3.1.2026",
  laskentajaksonAlkupvm: "1.1.2026",
  laskentajaksonLoppupvm: "2.1.2026",
  type: INVOICE_TYPES.MAANKAYTTOKORVAUS,
  items: [
    {
      itemType: INVOICE_ITEM_TYPES.MAANKAYTTOKORVAUS,
      description: "Base",
      amountExcludingVat: "100",
    },
    {
      itemType:
        number === 1 ? INVOICE_ITEM_TYPES.KOROTUS : INVOICE_ITEM_TYPES.KORKO,
      description: "Interest",
      amountExcludingVat: "5",
    },
  ],
});

const renderSchedule = ({
  isEditMode = true,
  id = "123456" as string | undefined,
  canSubmitSchedules = false,
  status = PAYMENT_SCHEDULE_STATUSES.DRAFT as PaymentScheduleEntry["status"],
  installments = [
    createInstallment(1),
    createInstallment(2),
    createInstallment(3),
  ],
} = {}) => {
  const schedule: PaymentScheduleEntry = {
    id,
    clientKey: "draft-1",
    recipientPartyIndex: "party-1",
    contractIndex: "contract-1",
    status,
    rejectedReason: null,
    signedDate: "1.1.2026",
    korotusProsentti: "2",
    korkoPeruskorko: "3",
    korkoMarginaali: "1",
    daysInYear: "365",
    installments,
  };
  const form = createForm<LandUsePaymentScheduleFormValues>({
    onSubmit: () => {},
    initialValues: { paymentSchedules: [schedule] },
    mutators: { ...arrayMutators },
  });
  render(
    <LandUsePaymentSchedule
      form={form}
      isEditMode={isEditMode}
      canSubmitSchedules={canSubmitSchedules}
      parties={[{ id: "party-1" }]}
      contracts={[]}
      asemakaavanNumero="12345"
      asemakaavanLainvoimaisuusPvm="2.1.2026"
      agreementIdentifier="MU-1"
      onSendToInvoicing={vi.fn()}
    />,
  );
  return () => form.getState().values.paymentSchedules![0].installments;
};

const deleteInstallment = (index: number) => {
  fireEvent.click(screen.getAllByRole("button", { name: "Poista erä" })[index]);
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Poista" }),
  );
};

describe("payment schedule installments", () => {
  it.each(["", "123"])(
    "only enables sending schedules with a canonical ID: %s",
    (id) => {
      renderSchedule({ id, canSubmitSchedules: true });
      const button = screen.getByRole("button", {
        name: "Siirrä laskutukseen",
      }) as HTMLButtonElement;
      expect(button.disabled).toBe(!id);
      expect(
        screen.queryByTitle(
          "Tallentamattomia suunnitelmia ei voi lähettää laskutukseen",
        ) !== null,
      ).toBe(!id);
      expect(screen.queryByText("Pakollinen tieto")).toBeNull();
    },
  );

  it("appends an empty korko installment and updates editable totals and descriptions", () => {
    const getInstallments = renderSchedule();
    fireEvent.click(screen.getByRole("button", { name: "Lisää erä" }));
    expect(
      getInstallments().map(({ installmentNumber, installmentTotal }) => [
        installmentNumber,
        installmentTotal,
      ]),
    ).toEqual([
      ["1", "4"],
      ["2", "4"],
      ["3", "4"],
      ["4", "4"],
    ]);
    expect(getInstallments()[0].items?.[1].description).toContain("1/4");
    expect(getInstallments()[3]).toMatchObject({
      recipientPartyIndex: "party-1",
      contractIndex: "contract-1",
      signedDate: "1.1.2026",
      dueDate: "",
      laskentajaksonAlkupvm: "",
      laskentajaksonLoppupvm: "",
      items: [
        {
          itemType: INVOICE_ITEM_TYPES.MAANKAYTTOKORVAUS,
          amountExcludingVat: "",
        },
        { itemType: INVOICE_ITEM_TYPES.KORKO, amountExcludingVat: "" },
      ],
    });
    expect(getInstallments()[3].items?.[1].description).toContain("4/4");
  });

  it("renumbers editable installments after deleting an earlier installment without changing their types", () => {
    const getInstallments = renderSchedule();
    deleteInstallment(0);
    expect(
      getInstallments().map(({ installmentNumber, installmentTotal }) => [
        installmentNumber,
        installmentTotal,
      ]),
    ).toEqual([
      ["1", "2"],
      ["2", "2"],
    ]);
    expect(getInstallments()[0].items?.[1].itemType).toBe(
      INVOICE_ITEM_TYPES.KORKO,
    );
    expect(getInstallments()[0].items?.[1].description).toContain("1/2");
  });

  it("leaves SAP-sent installments unchanged on both add and delete", () => {
    const sentInstallment = {
      ...createInstallment(1),
      invoice: {
        installmentNumber: "1",
        installmentTotal: "3",
        recipientPartyIndex: "party-1",
        dueDate: "3.1.2026",
        type: INVOICE_TYPES.MAANKAYTTOKORVAUS,
        status: INVOICE_STATUSES.OPEN,
        sentAt: "2026-01-03T00:00:00Z",
        billedAmount: "105",
        remainingAmount: "105",
        invoiceNumber: 123,
      },
    };
    const getInstallments = renderSchedule({
      installments: [
        sentInstallment,
        createInstallment(2),
        createInstallment(3),
      ],
    });
    expect(screen.getAllByRole("button", { name: "Poista erä" })).toHaveLength(
      2,
    );
    fireEvent.click(screen.getByRole("button", { name: "Lisää erä" }));
    expect(getInstallments()[0]).toEqual(sentInstallment);
    deleteInstallment(0);
    expect(getInstallments()[0]).toEqual(sentInstallment);
    expect(getInstallments()[1].installmentNumber).toBe("2");
    expect(getInstallments()[1].items?.[1].description).toContain("2/3");
  });

  it("adds korotus to an emptied schedule and korko for following installments", () => {
    const getInstallments = renderSchedule({
      installments: [createInstallment(1)],
    });
    deleteInstallment(0);
    fireEvent.click(screen.getByRole("button", { name: "Lisää erä" }));
    expect(getInstallments()[0].items?.[1].itemType).toBe(
      INVOICE_ITEM_TYPES.KOROTUS,
    );
    expect(getInstallments()[0].items?.[1].description).toContain("Korotus");
    fireEvent.click(screen.getByRole("button", { name: "Lisää erä" }));
    expect(getInstallments()[1].items?.[1].itemType).toBe(
      INVOICE_ITEM_TYPES.KORKO,
    );
    expect(getInstallments()[1].items?.[1].description).toContain("Korko");
  });

  it.each([
    { isEditMode: false },
    { status: PAYMENT_SCHEDULE_STATUSES.APPROVED },
    { status: PAYMENT_SCHEDULE_STATUSES.PENDING_APPROVAL },
  ])("hides installment actions when editing is unavailable: %j", (options) => {
    renderSchedule(options);
    expect(screen.queryByRole("button", { name: "Lisää erä" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Poista erä" })).toBeNull();
  });
});
