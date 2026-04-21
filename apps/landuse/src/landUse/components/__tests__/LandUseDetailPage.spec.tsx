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
import LandUseDetailPage from "../LandUseDetailPage";
import * as landUseApi from "../../api/landUseApi";
import { LAND_USE_NEGOTIATION_PHASES } from "../../options";

const mockNavigate = vi.fn();
let mockLocationSearch = "";

vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "LU-1" }),
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
  LandUseCompensations: ({
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
        <Field name="compensationsField">
          {({ input }) => (
            <input
              aria-label="compensations-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
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

vi.mock("../tabs/LandUseInvoicing", () => ({
  LandUseInvoicing: ({
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
        <Field name="invoicingField">
          {({ input }) => (
            <input
              aria-label="invoicing-input"
              {...input}
              disabled={!isEditMode}
            />
          )}
        </Field>
      )}
    />
  ),
}));

vi.mock("../tabs/LandUseMap", () => ({
  LandUseMap: ({ form, isEditMode }: { form: any; isEditMode: boolean }) => (
    <Form
      form={form}
      onSubmit={() => {}}
      render={() => (
        <Field name="mapField">
          {({ input }) => (
            <input aria-label="map-input" {...input} disabled={!isEditMode} />
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
  getSummary: vi.fn(),
  getLandUseList: vi.fn(),
  getParties: vi.fn(),
  getCompensations: vi.fn(),
  getMonitoring: vi.fn(),
  getDecisions: vi.fn(),
  getInvoicing: vi.fn(),
  getMap: vi.fn(),
  getCollaterals: vi.fn(),
  updateSummary: vi.fn(),
  updateParties: vi.fn(),
  updateCompensations: vi.fn(),
  updateMonitoring: vi.fn(),
  updateDecisions: vi.fn(),
  updateInvoicing: vi.fn(),
  updateMap: vi.fn(),
  updateCollaterals: vi.fn(),
}));

describe("LandUseDetailPage", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockLocationSearch = "";

    vi.mocked(landUseApi.getSummary).mockResolvedValue({
      tila: LAND_USE_NEGOTIATION_PHASES.IN_PROGRESS,
      summaryField: "initial-summary",
    } as any);
    vi.mocked(landUseApi.getLandUseList).mockResolvedValue([
      { identifier: "LU-1" },
    ] as any);
    vi.mocked(landUseApi.getParties).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getCompensations).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getCollaterals).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getMonitoring).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getDecisions).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getInvoicing).mockResolvedValue({} as any);
    vi.mocked(landUseApi.getMap).mockResolvedValue({} as any);

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
    vi.mocked(landUseApi.updateInvoicing).mockImplementation(
      async (_agreementId, values) => values as any,
    );
    vi.mocked(landUseApi.updateMap).mockImplementation(
      async (_agreementId, values) => values as any,
    );
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
      expect(landUseApi.getSummary).toHaveBeenCalled();
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
      "LU-1",
      expect.objectContaining({ summaryField: "summary-updated" }),
    );

    expect(landUseApi.updateCompensations).toHaveBeenCalledWith(
      "LU-1",
      expect.objectContaining({ compensationsField: "compensations-updated" }),
    );
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
