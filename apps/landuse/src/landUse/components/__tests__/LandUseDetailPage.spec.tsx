import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Form, Field } from "react-final-form";
import createDecorator from "final-form-calculate";
import LandUseDetailPage, {
  calculatePaidMaankayttokorvaus,
} from "@/landUse/components/LandUseDetailPage";
import * as landUseApi from "@/landUse/api/landUseApi";
import { LanduseApiError } from "@/landUse/api/fetchClient";
import { LAND_USE_NEGOTIATION_PHASES } from "@/landUse/options";

const mockNavigate = vi.fn();
let mockLocationSearch = "";

it("counts only paid backend-coded compensation items", () => {
  expect(
    calculatePaidMaankayttokorvaus([
      {
        status: "paid",
        invoiceItems: [
          {
            itemType: "land_use_compensation",
            amountExcludingVat: "100.25",
            description: "",
          },
          {
            itemType: "interest",
            amountExcludingVat: "20.00",
            description: "",
          },
          {
            itemType: "increase",
            amountExcludingVat: "30.00",
            description: "",
          },
          { itemType: "penalty", amountExcludingVat: "40.00", description: "" },
        ],
      },
      {
        status: "open",
        invoiceItems: [
          {
            itemType: "land_use_compensation",
            amountExcludingVat: "999",
            description: "",
          },
        ],
      },
      {
        status: "credited",
        invoiceItems: [
          {
            itemType: "land_use_compensation",
            amountExcludingVat: "999",
            description: "",
          },
        ],
      },
      {
        status: "paid",
        invoiceItems: [
          {
            itemType: "land_use_compensation",
            amountExcludingVat: "0.10",
            description: "",
          },
        ],
      },
    ]),
  ).toBeCloseTo(100.35);
});

vi.mock("react-router", () => ({
  useParams: () => ({ id: "1" }),
  useLocation: () => ({ search: mockLocationSearch }),
  useNavigate: () => mockNavigate,
}));

vi.mock("../tabs/LandUseSummary", () => ({
  LandUseSummary: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="summaryField">
          {({ input }) => (
            <input
              aria-label="summary-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("../tabs/LandUseCompensations", () => ({
  calculateMaankayttokorvausYhteensa: (values: Record<string, string>) =>
    (
      Number(values.rahakorvaus ?? 0) +
      Number(values.maakorvaus ?? 0) +
      Number(values.muuKorvaus ?? 0)
    ).toString(),
  LandUseCompensations: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => {
    const decorator = createDecorator({
      field: /^(rahakorvaus|maakorvaus|muuKorvaus)$/,
      updates: {
        maankayttokorvausYhteensa: (_value, allValues) =>
          (
            Number(allValues.rahakorvaus ?? 0) +
            Number(allValues.maakorvaus ?? 0) +
            Number(allValues.muuKorvaus ?? 0)
          ).toString(),
      },
    });

    return (
      <Form
        form={form}
        onSubmit={() => {}}
        decorators={[decorator]}
        render={() => (
          <>
            <Field name="compensationsField">
              {({ input }) => (
                <input
                  aria-label="compensations-input"
                  {...input}
                  disabled={!isEditMode}
                />
              )}
            </Field>
            <Field name="rahakorvaus" component="input" type="hidden" />
            <Field name="maakorvaus" component="input" type="hidden" />
            <Field name="muuKorvaus" component="input" type="hidden" />
            <Field
              name="maankayttokorvausYhteensa"
              component="input"
              type="hidden"
            />
          </>
        )}
      />
    );
  },
}));

vi.mock("../tabs/LandUseParties", () => ({
  LandUseParties: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="partiesField">
          {({ input }) => (
            <input
              aria-label="parties-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("../tabs/LandUseCollaterals", () => ({
  LandUseCollaterals: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="korotuskerroin">
          {({ input }) => (
            <input
              aria-label="collaterals-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("../tabs/LandUseMonitoring", () => ({
  LandUseMonitoring: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="monitoringField">
          {({ input }) => (
            <input
              aria-label="monitoring-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("../tabs/LandUseContracts", () => ({
  LandUseContracts: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="contractsField">
          {({ input }) => (
            <input
              aria-label="contracts-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("../tabs/LandUseDecisions", () => ({
  LandUseDecisions: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="decisionsField">
          {({ input }) => (
            <input
              aria-label="decisions-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("../tabs/LandUsePaymentSchedule", () => ({
  LandUsePaymentSchedule: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="paymentScheduleField">
          {({ input }) => (
            <input
              aria-label="payment-schedule-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("../tabs/LandUseBilling", () => ({
  LandUseBilling: ({
    form,
    isEditMode,
  }: {
    form: any;
    isEditMode: boolean;
  }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="billingField">
          {({ input }) => (
            <input
              aria-label="billing-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("hds-react", async (importOriginal) => {
  const ReactLib = await import("react");
  const TabsContext = ReactLib.createContext<{
    activeTab: number;
    setActiveTab: (index: number) => void;
  }>({ activeTab: 0, setActiveTab: () => null });

  const Tabs: React.FC<
    React.PropsWithChildren<{ initiallyActiveTab?: number }>
  > = ({ children, initiallyActiveTab = 0 }) => {
    const [activeTab, setActiveTab] = ReactLib.useState(initiallyActiveTab);

    let panelIndex = 0;
    const normalizedChildren = ReactLib.Children.map(children, (child) => {
      if (!ReactLib.isValidElement(child)) {
        return child;
      }

      if (child.type === TabPanel) {
        const element = child as React.ReactElement<{ index?: number }>;
        const cloned = ReactLib.cloneElement(element, { index: panelIndex });
        panelIndex += 1;
        return cloned;
      }

      return child;
    });

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div>{normalizedChildren}</div>
      </TabsContext.Provider>
    );
  };

  const TabList: React.FC<React.PropsWithChildren> = ({ children }) => {
    let tabIndex = 0;
    return (
      <div role="tablist">
        {ReactLib.Children.map(children, (child) => {
          if (!ReactLib.isValidElement(child)) {
            return child;
          }

          const element = child as React.ReactElement<{ index?: number }>;
          const cloned = ReactLib.cloneElement(element, { index: tabIndex });
          tabIndex += 1;
          return cloned;
        })}
      </div>
    );
  };

  const Tab: React.FC<
    React.PropsWithChildren<{ onClick?: () => void; index?: number }>
  > = ({ children, onClick, index = 0 }) => {
    const { setActiveTab } = ReactLib.useContext(TabsContext);

    return (
      <button
        type="button"
        role="tab"
        onClick={() => {
          onClick?.();
          setActiveTab(index);
        }}
      >
        {children}
      </button>
    );
  };

  const TabPanel: React.FC<React.PropsWithChildren<{ index?: number }>> = ({
    children,
    index = 0,
  }) => {
    const { activeTab } = ReactLib.useContext(TabsContext);

    if (activeTab !== index) {
      return null;
    }

    return <div role="tabpanel">{children}</div>;
  };

  const Button: React.FC<
    React.PropsWithChildren<{
      onClick?: () => void;
      type?: "button" | "submit" | "reset";
      disabled?: boolean;
    }>
  > = ({ children, onClick, type = "button", disabled }) => (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );

  const Breadcrumb: React.FC = () => <nav aria-label="Breadcrumb" />;

  const IconStub: React.FC = () => <span />;

  return {
    ...(await importOriginal<object>()),
    Breadcrumb,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Button,
    ButtonVariant: {
      Primary: "Primary",
      Secondary: "Secondary",
      Danger: "Danger",
    },
    IconSize: { Small: "Small" },
    IconCheckCircle: IconStub,
    IconCross: IconStub,
    IconPen: IconStub,
    IconTrash: IconStub,
    IconAlertCircle: IconStub,
    IconError: IconStub,
  };
});

vi.mock("../../api/landUseApi", () => ({
  getUserPermissions: vi.fn(),
  getSummary: vi.fn(),
  getCollaterals: vi.fn(),
  getLandUseList: vi.fn(),
  getParties: vi.fn(),
  getCompensations: vi.fn(),
  getMonitoring: vi.fn(),
  getDecisions: vi.fn(),
  getContracts: vi.fn(),
  getPaymentSchedule: vi.fn(),
  getBilling: vi.fn(),
  updateSummary: vi.fn(),
  updateParties: vi.fn(),
  updateCompensations: vi.fn(),
  updateMonitoring: vi.fn(),
  updateDecisions: vi.fn(),
  updateContracts: vi.fn(),
  updatePaymentSchedule: vi.fn(),
  updateBilling: vi.fn(),
  updateCollaterals: vi.fn(),
}));

describe("LandUseDetailPage", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockLocationSearch = "";

    vi.mocked(landUseApi.getUserPermissions).mockResolvedValue({
      permissions: [
        "landuseagreement",
        "tab_parties",
        "tab_compensation",
        "tab_sites",
        "tab_decisions",
        "tab_contracts",
        "tab_payment_schedules",
        "tab_invoices",
      ].flatMap((resource) =>
        ["view", "change", "add", "delete"].map((verb) => ({
          app: "landuse",
          name: resource,
          codename: `${verb}_${resource}`,
        })),
      ),
    });

    vi.mocked(landUseApi.getSummary).mockResolvedValue({
      tila: LAND_USE_NEGOTIATION_PHASES.IN_PROGRESS,
      summaryField: "initial-summary",
    } as any);
    vi.mocked(landUseApi.getCollaterals).mockResolvedValue({
      korotuskerroin: "1.25",
    });
    vi.mocked(landUseApi.getLandUseList).mockResolvedValue([
      { id: 1, identifier: "LU-1" },
    ] as any);
    vi.mocked(landUseApi.getParties).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getCompensations).mockResolvedValue({
      rahakorvaus: "100",
      maakorvaus: "200",
      muuKorvaus: "300",
      maankayttokorvausYhteensa: "stale-value",
    } as any);
    vi.mocked(landUseApi.getMonitoring).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getDecisions).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getContracts).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getPaymentSchedule).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getBilling).mockResolvedValue({} as any);

    vi.mocked(landUseApi.updateSummary).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updateParties).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updateCompensations).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updateCollaterals).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updateMonitoring).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updateDecisions).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updateContracts).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updatePaymentSchedule).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updateBilling).mockImplementation(
      async (_agreementId, values) => values as any,
    );
  });

  it("keeps edit disabled for a viewer and restricted tabs visible", async () => {
    vi.mocked(landUseApi.getUserPermissions).mockResolvedValue({
      permissions: ["view_landuseagreement", "view_tab_parties"].map(
        (codename) => ({
          app: "landuse",
          name: codename,
          codename,
        }),
      ),
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );
    const edit = await screen.findByRole("button", { name: "Muokkaa" });
    expect((edit as HTMLButtonElement).disabled).toBe(true);
    expect(
      (screen.getByRole("tab", { name: "Osapuolet" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    expect(
      (screen.getByRole("tab", { name: "Korvaukset" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    expect(landUseApi.getCompensations).not.toHaveBeenCalled();
    expect(landUseApi.getBilling).not.toHaveBeenCalled();
  });

  it("keeps a view-only tab read-only while another tab is editable", async () => {
    vi.mocked(landUseApi.getUserPermissions).mockResolvedValue({
      permissions: [
        "view_landuseagreement",
        "change_landuseagreement",
        "view_tab_parties",
      ].map((codename) => ({
        app: "landuse",
        name: codename,
        codename,
      })),
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );
    fireEvent.click(await screen.findByRole("button", { name: "Muokkaa" }));
    expect(
      (screen.getByLabelText("summary-input") as HTMLInputElement).disabled,
    ).toBe(false);
    fireEvent.click(screen.getByRole("tab", { name: "Osapuolet" }));
    expect(
      ((await screen.findByLabelText("parties-input")) as HTMLInputElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Tallenna" }));
    await screen.findByRole("button", { name: "Muokkaa" });
    expect(landUseApi.updateParties).not.toHaveBeenCalled();
  });

  it("does not render a forbidden tab opened through its URL", async () => {
    mockLocationSearch = "?tab=contracts";
    vi.mocked(landUseApi.getUserPermissions).mockResolvedValue({
      permissions: [
        {
          app: "landuse",
          name: "View agreement",
          codename: "view_landuseagreement",
        },
      ],
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );
    await screen.findByRole("button", { name: "Muokkaa" });
    expect(screen.queryByLabelText("contracts-input")).toBeNull();
    expect(landUseApi.getContracts).not.toHaveBeenCalled();
  });

  it("does not load agreement data while permissions are pending", () => {
    vi.mocked(landUseApi.getUserPermissions).mockReturnValue(
      new Promise(() => {}),
    );
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );
    expect(screen.getByText("Ladataan...")).toBeDefined();
    expect(landUseApi.getSummary).not.toHaveBeenCalled();
  });

  it("shows a permissions failure without enabling edits or fetching agreement data", async () => {
    vi.mocked(landUseApi.getUserPermissions).mockRejectedValue(
      new LanduseApiError(403, { detail: "Permission lookup denied" }),
    );
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );
    expect((await screen.findByRole("alert")).textContent).toBe(
      "Permission lookup denied",
    );
    expect(screen.queryByRole("button", { name: "Muokkaa" })).toBeNull();
    expect(landUseApi.getSummary).not.toHaveBeenCalled();
  });

  it("renders a loading state until the agreement resolves", () => {
    vi.mocked(landUseApi.getSummary).mockReturnValue(new Promise(() => {}));

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Ladataan...")).toBeDefined();
    expect(screen.queryByRole("button", { name: "Muokkaa" })).toBeNull();
  });

  it("saves changes made in multiple tabs when save is clicked from another tab", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Muokkaa" })).toBeDefined();
    });

    // Wait for initial data load to complete before editing
    await waitFor(() => {
      expect(landUseApi.getSummary).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "Muokkaa" }));

    await waitFor(() => {
      expect(screen.getByLabelText("summary-input")).toBeDefined();
      expect(
        (screen.getByLabelText("summary-input") as HTMLInputElement).value,
      ).toBe("initial-summary");
    });

    fireEvent.change(screen.getByLabelText("summary-input"), {
      target: { value: "summary-updated" },
    });

    fireEvent.click(screen.getByRole("tab", { name: /Korvaukset/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("compensations-input")).toBeDefined();
    });

    fireEvent.change(screen.getByLabelText("compensations-input"), {
      target: { value: "compensations-updated" },
    });

    fireEvent.click(screen.getByRole("tab", { name: /Valvonta/i }));
    fireEvent.click(screen.getByRole("button", { name: "Tallenna" }));

    await waitFor(() => {
      expect(landUseApi.updateSummary).toHaveBeenCalledTimes(1);
      expect(landUseApi.updateCompensations).toHaveBeenCalledTimes(1);
    });

    expect(landUseApi.updateSummary).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ summaryField: "summary-updated" }),
    );

    expect(landUseApi.updateCompensations).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ compensationsField: "compensations-updated" }),
    );
  });

  it("preserves unsaved collateral edits while saving the summary", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Muokkaa" }));
    fireEvent.change(await screen.findByLabelText("summary-input"), {
      target: { value: "summary-updated" },
    });
    fireEvent.click(screen.getByRole("tab", { name: /Vakuustarve/i }));
    const collateralInput = await screen.findByLabelText("collaterals-input");
    expect((collateralInput as HTMLInputElement).value).toBe("1.25");
    fireEvent.change(collateralInput, {
      target: { value: "1.50" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Tallenna" }));

    await waitFor(() => {
      expect(landUseApi.updateCollaterals).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({ korotuskerroin: "1.50" }),
      );
    });
    expect(landUseApi.updateSummary).toHaveBeenCalledTimes(1);
    expect(landUseApi.getCollaterals).toHaveBeenCalledTimes(1);
  });

  it("does not dirty compensations when its calculated total initializes", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(landUseApi.getCompensations).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByRole("tab", { name: /Korvaukset/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("compensations-input")).toBeDefined();
    });

    fireEvent.click(screen.getByRole("tab", { name: /Perustiedot/i }));
    fireEvent.click(screen.getByRole("button", { name: "Muokkaa" }));
    fireEvent.click(screen.getByRole("button", { name: "Tallenna" }));

    await waitFor(() => {
      expect(landUseApi.updateCompensations).not.toHaveBeenCalled();
    });
  });

  it("opens the tab from query parameter on initial render", async () => {
    mockLocationSearch = "?tab=parties";

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("parties-input")).toBeDefined();
    });

    expect(screen.queryByLabelText("summary-input")).toBeNull();
  });

  it("writes summary query parameter when first tab is selected", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LandUseDetailPage />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /Perustiedot/i })).toBeDefined();
    });

    fireEvent.click(screen.getByRole("tab", { name: /Korvaukset/i }));
    fireEvent.click(screen.getByRole("tab", { name: /Perustiedot/i }));

    expect(mockNavigate).toHaveBeenCalledWith(
      { search: "?tab=summary" },
      { replace: true },
    );
  });
});
