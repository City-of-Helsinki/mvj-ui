import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumb,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  ButtonVariant,
  IconCheckCircle,
  IconCross,
  IconPen,
  IconTrash,
  IconAlertCircle,
  IconError,
  IconSize,
} from "hds-react";
import { createForm } from "final-form";
import arrayMutators from "final-form-arrays";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LandUseSummary,
  type LandUseSummaryFormValues,
} from "./tabs/LandUseSummary";
import {
  LandUseParties,
  type LandUsePartiesFormValues,
} from "./tabs/LandUseParties";
import {
  LandUseCompensations,
  type LandUseCompensationsFormValues,
} from "./tabs/LandUseCompensations";
import {
  LandUseCollaterals,
  type LandUseCollateralsFormValues,
} from "./tabs/LandUseCollaterals";
import {
  LandUseMonitoring,
  type LandUseMonitoringFormValues,
} from "./tabs/LandUseMonitoring";
import {
  LandUseDecisions,
  type LandUseDecisionsFormValues,
} from "./tabs/LandUseDecisions";
import {
  LAND_USE_INVOICE_STATUSES,
  LandUseInvoice,
  LandUseInvoiceItem,
  LandUseInvoicing,
  type LandUseInvoicingFormValues,
} from "./tabs/LandUseInvoicing";
import type { KorkoResult } from "./invoicing/KorkoCalculator";
import { LandUseMap, type LandUseMapFormValues } from "./tabs/LandUseMap";
import LandUseNotFoundPage from "../../landUse/components/LandUseNotFoundPage";
import {
  getCompensations,
  getCollaterals,
  getDecisions,
  getInvoicing,
  getLandUseList,
  getMap,
  getMonitoring,
  getParties,
  getSummary,
  updateCompensations,
  updateCollaterals,
  updateDecisions,
  updateInvoicing,
  updateMap,
  updateMonitoring,
  updateParties,
  updateSummary,
} from "../api/landUseApi";
import {
  LAND_USE_INVOICE_ITEM_TYPES,
  LAND_USE_NEGOTIATION_PHASES,
} from "../options";
import { parseLandUseNumericValueOrZero } from "../utils/number";
import { DEFAULT_KOROTUSKERROIN } from "../constants";

interface FormState {
  dirty: boolean;
  valid: boolean;
}

export type FormKey =
  | "summary"
  | "parties"
  | "compensations"
  | "collaterals"
  | "monitoring"
  | "decisions"
  | "invoicing"
  | "map"
  | "history";

interface TabConfig {
  label: string;
  queryKey: FormKey;
  hasForm: boolean;
  formKey?: FormKey;
}

const TABS_CONFIG: TabConfig[] = [
  {
    label: "Perustiedot",
    queryKey: "summary",
    hasForm: true,
    formKey: "summary",
  },
  {
    label: "Osapuolet",
    queryKey: "parties",
    hasForm: true,
    formKey: "parties",
  },
  {
    label: "Korvaukset",
    queryKey: "compensations",
    hasForm: true,
    formKey: "compensations",
  },
  {
    label: "Vakuustarve",
    queryKey: "collaterals",
    hasForm: true,
    formKey: "collaterals",
  },
  {
    label: "Päätökset ja sopimukset",
    queryKey: "decisions",
    hasForm: true,
    formKey: "decisions",
  },
  {
    label: "Valvonta",
    queryKey: "monitoring",
    hasForm: true,
    formKey: "monitoring",
  },
  {
    label: "Laskutus",
    queryKey: "invoicing",
    hasForm: true,
    formKey: "invoicing",
  },
  { label: "Kartta", queryKey: "map", hasForm: true, formKey: "map" },
  { label: "Muutoshistoria", queryKey: "history", hasForm: false },
];

const TAB_QUERY_PARAM = "tab";

const getTabQueryKeyFromIndex = (tabIndex: number): string => {
  return TABS_CONFIG[tabIndex]?.queryKey ?? TABS_CONFIG[0].queryKey;
};

const getTabIndexFromQueryKey = (queryKey: string): number => {
  return TABS_CONFIG.findIndex((tab) => tab.queryKey === queryKey);
};

const getActiveTabFromSearch = (search: string): number => {
  const tabValue = new URLSearchParams(search).get(TAB_QUERY_PARAM);

  if (!tabValue) {
    return 0;
  }

  const tabIndexFromKey = getTabIndexFromQueryKey(tabValue);
  if (tabIndexFromKey >= 0) {
    return tabIndexFromKey;
  }

  const tabIndex = Number(tabValue);

  if (
    Number.isInteger(tabIndex) &&
    tabIndex >= 0 &&
    tabIndex < TABS_CONFIG.length
  ) {
    return tabIndex;
  }

  return 0;
};

const calculatePaidMaankayttokorvaus = (invoices: LandUseInvoice[]) => {
  const isMaankayttokorvausItem = (item: LandUseInvoiceItem) =>
    item.itemType === LAND_USE_INVOICE_ITEM_TYPES.MAANKAYTTOKORVAUS;

  return invoices
    .filter((invoice) => invoice.status === LAND_USE_INVOICE_STATUSES.PAID)
    .flatMap((invoice) => invoice.invoiceItems ?? [])
    .filter(isMaankayttokorvausItem)
    .reduce(
      (sum, item) =>
        sum + parseLandUseNumericValueOrZero(item.amountExcludingVat),
      0,
    );
};

// Initial form state
const initialFormState: FormState = { dirty: false, valid: true };

const LandUseDetailPage: React.FC = () => {
  const { id: identifier } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const agreementId = identifier ?? "";
  const [activeTab, setActiveTab] = useState(() =>
    getActiveTabFromSearch(location.search),
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [korkoResults, setKorkoResults] = useState<KorkoResult[]>([]);
  const queryClient = useQueryClient();

  /** Form state tracking for each tab.
   * Is necessary, because react-final-form's FormApi's dirty state is unreliable:
   * Whenever user navigates to a different tab, the form fields are unregistered,
   * and final-form's dirty state resets to false.
   * Apparently final-form requires all the fields to be registered at the same
   * time for dirty state to work, which is not possible with our tabbed UI.
   */
  const [formStates, setFormStates] = useState<Record<string, FormState>>({
    summary: { ...initialFormState },
    parties: { ...initialFormState },
    compensations: { ...initialFormState },
    collaterals: { ...initialFormState },
    monitoring: { ...initialFormState },
    decisions: { ...initialFormState },
    invoicing: { ...initialFormState },
    map: { ...initialFormState },
  });

  const resetFormStates = () => {
    setFormStates((prev) => {
      const newState: Record<string, FormState> = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = initialFormState;
      });
      return newState;
    });
  };

  const landUseListQuery = useQuery({
    queryKey: ["land-use", "list"],
    queryFn: getLandUseList,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    enabled: Boolean(agreementId),
    refetchOnWindowFocus: false,
  });

  const agreementExists =
    Boolean(agreementId) &&
    (landUseListQuery.data ?? []).some(
      (item) => item.identifier === agreementId,
    );

  const isAgreementMissing =
    Boolean(agreementId) && landUseListQuery.isSuccess && !agreementExists;

  const canLoadAgreementData =
    Boolean(agreementId) && (agreementExists || landUseListQuery.isError);

  const summaryQuery = useQuery({
    queryKey: ["land-use", agreementId, "summary"],
    queryFn: () => getSummary(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const partiesQuery = useQuery({
    queryKey: ["land-use", agreementId, "parties"],
    queryFn: () => getParties(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const compensationsQuery = useQuery({
    queryKey: ["land-use", agreementId, "compensations"],
    queryFn: () => getCompensations(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const collateralsQuery = useQuery({
    queryKey: ["land-use", agreementId, "collaterals"],
    queryFn: () => getCollaterals(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const monitoringQuery = useQuery({
    queryKey: ["land-use", agreementId, "monitoring"],
    queryFn: () => getMonitoring(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const decisionsQuery = useQuery({
    queryKey: ["land-use", agreementId, "decisions"],
    queryFn: () => getDecisions(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const invoicingQuery = useQuery({
    queryKey: ["land-use", agreementId, "invoicing"],
    queryFn: () => getInvoicing(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const mapQuery = useQuery({
    queryKey: ["land-use", agreementId, "map"],
    queryFn: () => getMap(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  // Create form APIs using useMemo to ensure stable references
  const summaryFormApi = useMemo(
    () =>
      createForm<LandUseSummaryFormValues>({
        onSubmit: (values) => {
          console.log("Summary form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const partiesFormApi = useMemo(
    () =>
      createForm<LandUsePartiesFormValues>({
        onSubmit: (values) => {
          console.log("Parties form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const compensationsFormApi = useMemo(
    () =>
      createForm<LandUseCompensationsFormValues>({
        onSubmit: (values) => {
          console.log("Compensations form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const collateralsFormApi = useMemo(
    () =>
      createForm<LandUseCollateralsFormValues>({
        onSubmit: (values) => {
          console.log("Collaterals form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const monitoringFormApi = useMemo(
    () =>
      createForm<LandUseMonitoringFormValues>({
        onSubmit: (values) => {
          console.log("Monitoring form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const decisionsFormApi = useMemo(
    () =>
      createForm<LandUseDecisionsFormValues>({
        onSubmit: (values) => {
          console.log("Decisions form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const invoicingFormApi = useMemo(
    () =>
      createForm<LandUseInvoicingFormValues>({
        onSubmit: (values) => {
          console.log("Invoicing form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const mapFormApi = useMemo(
    () =>
      createForm<LandUseMapFormValues>({
        onSubmit: (values) => {
          console.log("Map form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  // Collection of all form APIs for easy iteration
  const formApis = useMemo(
    () => ({
      summary: summaryFormApi,
      parties: partiesFormApi,
      compensations: compensationsFormApi,
      collaterals: collateralsFormApi,
      monitoring: monitoringFormApi,
      decisions: decisionsFormApi,
      invoicing: invoicingFormApi,
      map: mapFormApi,
    }),
    [
      summaryFormApi,
      partiesFormApi,
      compensationsFormApi,
      collateralsFormApi,
      monitoringFormApi,
      decisionsFormApi,
      invoicingFormApi,
      mapFormApi,
    ],
  );

  // Subscribe to form state changes
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    Object.entries(formApis).forEach(([key, formApi]) => {
      const unsubscribe = formApi.subscribe(
        (state) => {
          setFormStates((prev) => ({
            ...prev,
            [key]: {
              dirty: (prev[key]?.dirty ?? false) || state.dirty,
              valid: state.valid,
            },
          }));
        },
        { dirty: true, valid: true },
      );
      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [formApis]);

  useEffect(() => {
    if (summaryQuery.data) {
      summaryFormApi.initialize(summaryQuery.data);
    }
  }, [
    summaryFormApi,
    summaryQuery.data,
    summaryQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (partiesQuery.data) {
      partiesFormApi.initialize(partiesQuery.data);
    }
  }, [
    partiesFormApi,
    partiesQuery.data,
    partiesQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (compensationsQuery.data) {
      compensationsFormApi.initialize(compensationsQuery.data);
    }
  }, [
    compensationsFormApi,
    compensationsQuery.data,
    compensationsQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (collateralsQuery.data) {
      collateralsFormApi.initialize(collateralsQuery.data);
    }
  }, [
    collateralsFormApi,
    collateralsQuery.data,
    collateralsQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (monitoringQuery.data) {
      monitoringFormApi.initialize(monitoringQuery.data);
    }
  }, [
    monitoringFormApi,
    monitoringQuery.data,
    monitoringQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (decisionsQuery.data) {
      decisionsFormApi.initialize(decisionsQuery.data);
    }
  }, [
    decisionsFormApi,
    decisionsQuery.data,
    decisionsQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (invoicingQuery.data) {
      invoicingFormApi.initialize(invoicingQuery.data);
    }
  }, [
    invoicingFormApi,
    invoicingQuery.data,
    invoicingQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (mapQuery.data) {
      mapFormApi.initialize(mapQuery.data);
    }
  }, [mapFormApi, mapQuery.data, mapQuery.dataUpdatedAt, agreementId]);

  // Check if any form is dirty
  const isAnyFormDirty = useCallback(() => {
    return Object.values(formStates).some((state) => state.dirty);
  }, [formStates]);

  // Check if all forms are valid
  const areAllFormsValid = useCallback(() => {
    return Object.values(formStates).every((state) => state.valid);
  }, [formStates]);

  // Unsaved changes warning on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAnyFormDirty()) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAnyFormDirty]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSetTabDirty = useCallback((formKey: FormKey) => {
    setFormStates((prev) => ({
      ...prev,
      [formKey]: {
        dirty: true,
        valid: prev[formKey]?.valid ?? true,
      },
    }));
  }, []);

  const summaryMutation = useMutation({
    mutationFn: (values: LandUseSummaryFormValues) =>
      updateSummary(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "summary"], data);
      queryClient.invalidateQueries({ queryKey: ["land-use", "list"] });
    },
  });

  const partiesMutation = useMutation({
    mutationFn: (values: LandUsePartiesFormValues) =>
      updateParties(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "parties"], data);
      queryClient.invalidateQueries({ queryKey: ["land-use", "list"] });
    },
  });

  const compensationsMutation = useMutation({
    mutationFn: (values: LandUseCompensationsFormValues) =>
      updateCompensations(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["land-use", agreementId, "compensations"],
        data,
      );
    },
  });

  const monitoringMutation = useMutation({
    mutationFn: (values: LandUseMonitoringFormValues) =>
      updateMonitoring(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "monitoring"], data);
    },
  });

  const collateralsMutation = useMutation({
    mutationFn: (values: LandUseCollateralsFormValues) =>
      updateCollaterals(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "collaterals"], data);
    },
  });

  const decisionsMutation = useMutation({
    mutationFn: (values: LandUseDecisionsFormValues) =>
      updateDecisions(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "decisions"], data);
    },
  });

  const invoicingMutation = useMutation({
    mutationFn: (values: LandUseInvoicingFormValues) =>
      updateInvoicing(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "invoicing"], data);
    },
  });

  const mapMutation = useMutation({
    mutationFn: (values: LandUseMapFormValues) =>
      updateMap(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "map"], data);
    },
  });

  const handleSaveClick = async () => {
    setIsSaveClicked(true);

    if (!agreementId) {
      return;
    }

    // Check if all forms are valid
    if (!areAllFormsValid()) {
      console.log("Some forms have validation errors");
      return;
    }

    const mutations: Array<Promise<unknown>> = [];

    Object.entries(formApis).forEach(([key, formApi]) => {
      const state = formApi.getState();

      // We must read dirty state from our custom formStates, because
      // final-form's dirty state is unreliable in our tabbed UI.
      if (!formStates[key]?.dirty) {
        return;
      }

      switch (key) {
        case "summary":
          mutations.push(
            summaryMutation.mutateAsync(
              state.values as LandUseSummaryFormValues,
            ),
          );
          break;
        case "parties":
          mutations.push(
            partiesMutation.mutateAsync(
              state.values as LandUsePartiesFormValues,
            ),
          );
          break;
        case "compensations":
          mutations.push(
            compensationsMutation.mutateAsync(
              state.values as LandUseCompensationsFormValues,
            ),
          );
          break;
        case "collaterals":
          mutations.push(
            collateralsMutation.mutateAsync(
              state.values as LandUseCollateralsFormValues,
            ),
          );
          break;
        case "monitoring":
          mutations.push(
            monitoringMutation.mutateAsync(
              state.values as LandUseMonitoringFormValues,
            ),
          );
          break;
        case "decisions":
          mutations.push(
            decisionsMutation.mutateAsync(
              state.values as LandUseDecisionsFormValues,
            ),
          );
          break;
        case "invoicing": {
          // Mark invoices paid when remaining amount is zero or less
          // TODO: In the future API should handle this
          const invoicesValues = (state.values as LandUseInvoicingFormValues)
            .invoices;
          for (const invoice of invoicesValues) {
            if (
              invoice.remainingAmount === "0" ||
              invoice.remainingAmount === "0.00" ||
              invoice.remainingAmount === "0,00"
            ) {
              invoice.status = LAND_USE_INVOICE_STATUSES.PAID;
            }
          }
          mutations.push(
            invoicingMutation.mutateAsync({
              ...state.values,
              invoices: invoicesValues,
            } as LandUseInvoicingFormValues),
          );
          break;
        }
        case "map":
          mutations.push(
            mapMutation.mutateAsync(state.values as LandUseMapFormValues),
          );
          break;
        default:
          break;
      }
    });

    try {
      await Promise.all(mutations);
      setIsSaveClicked(false);
      setIsEditMode(false);
      resetFormStates();
    } catch (error) {
      console.error("Failed to save agreement data", error);
    }
  };

  const handleDiscardClick = () => {
    // Reset all forms to their initial values
    Object.values(formApis).forEach((formApi) => {
      formApi.reset();
    });

    setIsSaveClicked(false);
    setIsEditMode(false);
    resetFormStates();
  };

  useEffect(() => {
    const tabFromSearch = getActiveTabFromSearch(location.search);
    setActiveTab((prevActiveTab) =>
      prevActiveTab === tabFromSearch ? prevActiveTab : tabFromSearch,
    );
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get(TAB_QUERY_PARAM);
    const activeTabQueryKey = getTabQueryKeyFromIndex(activeTab);

    if (tabFromUrl === activeTabQueryKey) {
      return;
    }

    searchParams.set(TAB_QUERY_PARAM, activeTabQueryKey);
    const search = searchParams.toString();
    navigate({ search: search ? `?${search}` : "" }, { replace: true });
  }, [activeTab, location.search, navigate]);

  const handleTabClick = useCallback((tabIndex: number) => {
    setActiveTab(tabIndex);
  }, []);

  if (isAgreementMissing) {
    return (
      <LandUseNotFoundPage
        agreementId={agreementId}
        onBackToList={() => navigate("/")}
      />
    );
  }

  const sitesWithAmVelvoite = (compensationsQuery.data?.sites ?? []).filter(
    (site) => site.amVelvoite === true,
  );

  // Render tab label with status icons
  const renderTabLabel = (tabConfig: TabConfig, tabIndex: number) => {
    const formKey = tabConfig.formKey;
    const formState = formKey ? formStates[formKey] : null;

    return (
      <span className="landuse-detail__tab-label">
        {tabConfig.label}
        {formState?.dirty && (
          <IconAlertCircle
            size={IconSize.Small}
            className="landuse-detail__tab-icon landuse-detail__tab-icon--dirty"
            aria-label="Tallentamattomia muutoksia"
          />
        )}
        {isSaveClicked && formState && !formState.valid && (
          <IconError
            size={IconSize.Small}
            className="landuse-detail__tab-icon landuse-detail__tab-icon--error"
            aria-label="Lomakkeessa on virheitä"
          />
        )}
      </span>
    );
  };

  return (
    <div className="landuse-detail">
      <Breadcrumb
        aria-label="Breadcrumb"
        list={[
          { title: "Maanvuokrausjärjestelmä", path: "/" },
          { title: "Maankäyttösopimukset", path: "/maankayttosopimukset" },
          { title: agreementId, path: "" },
        ]}
      />

      <div className="landuse-detail__header">
        <h1 className="landuse-detail__title">{identifier}</h1>
        <div className="landuse-detail__actions">
          {isEditMode ? (
            <>
              <Button
                variant={ButtonVariant.Secondary}
                onClick={handleDiscardClick}
                iconStart={<IconCross />}
              >
                Hylkää muutokset
              </Button>
              <Button
                variant={ButtonVariant.Primary}
                onClick={handleSaveClick}
                iconStart={<IconCheckCircle />}
              >
                Tallenna
              </Button>
            </>
          ) : (
            <Button
              variant={ButtonVariant.Primary}
              onClick={handleEditClick}
              iconStart={<IconPen />}
            >
              Muokkaa
            </Button>
          )}
        </div>
      </div>

      <Tabs initiallyActiveTab={activeTab}>
        <TabList>
          {TABS_CONFIG.map((tabConfig, index) => (
            <Tab key={tabConfig.label} onClick={() => handleTabClick(index)}>
              {renderTabLabel(tabConfig, index)}
            </Tab>
          ))}
        </TabList>

        <TabPanel>
          <LandUseSummary form={summaryFormApi} isEditMode={isEditMode} />
        </TabPanel>

        <TabPanel>
          <LandUseParties form={partiesFormApi} isEditMode={isEditMode} />
        </TabPanel>

        <TabPanel>
          <LandUseCompensations
            form={compensationsFormApi}
            isEditMode={isEditMode}
          />
        </TabPanel>

        <TabPanel>
          <LandUseCollaterals
            form={collateralsFormApi}
            isEditMode={isEditMode}
            sites={sitesWithAmVelvoite}
            perushinta={compensationsQuery.data?.perushinta}
            compensationsRowsBySiteId={
              compensationsQuery.data?.perustietotaulukkoRowsBySiteId ?? {}
            }
            maankayttokorvausYhteensa={
              parseLandUseNumericValueOrZero(
                compensationsQuery.data?.rahakorvaus,
              ) +
              parseLandUseNumericValueOrZero(
                compensationsQuery.data?.maakorvaus,
              ) +
              parseLandUseNumericValueOrZero(
                compensationsQuery.data?.muuKorvaus,
              )
            }
          />
        </TabPanel>

        <TabPanel>
          <LandUseDecisions
            form={decisionsFormApi}
            isEditMode={isEditMode}
            parties={
              ((partiesFormApi.getState().values as LandUsePartiesFormValues)
                ?.parties ??
                partiesQuery.data?.parties) ||
              []
            }
          />
        </TabPanel>

        <TabPanel>
          <LandUseMonitoring
            form={monitoringFormApi}
            isEditMode={isEditMode}
            sites={sitesWithAmVelvoite}
            perushinta={compensationsQuery.data?.perushinta}
            compensationsRowsBySiteId={
              compensationsQuery.data?.perustietotaulukkoRowsBySiteId ?? {}
            }
            korotuskerroin={
              collateralsQuery.data?.korotuskerroin ?? DEFAULT_KOROTUSKERROIN
            }
            maankayttokorvausYhteensa={
              parseLandUseNumericValueOrZero(
                compensationsQuery.data?.rahakorvaus,
              ) +
              parseLandUseNumericValueOrZero(
                compensationsQuery.data?.maakorvaus,
              ) +
              parseLandUseNumericValueOrZero(
                compensationsQuery.data?.muuKorvaus,
              ) -
              calculatePaidMaankayttokorvaus(
                invoicingQuery.data?.invoices ?? [],
              )
            }
            onSetTabDirty={handleSetTabDirty}
          />
        </TabPanel>

        <TabPanel>
          <LandUseInvoicing
            form={invoicingFormApi}
            isEditMode={isEditMode}
            parties={
              ((partiesFormApi.getState().values as LandUsePartiesFormValues)
                ?.parties ??
                partiesQuery.data?.parties) ||
              []
            }
            agreements={
              ((
                decisionsFormApi.getState().values as LandUseDecisionsFormValues
              )?.agreements ??
                decisionsQuery.data?.agreements) ||
              []
            }
            asemakaavanNumero={
              ((summaryFormApi.getState().values as LandUseSummaryFormValues)
                ?.asemakaavanNumero ??
                summaryQuery.data?.asemakaavanNumero) ||
              ""
            }
            asemakaavanLainvoimaisuusPvm={
              ((summaryFormApi.getState().values as LandUseSummaryFormValues)
                ?.asemakaavanLainvoimaisuusPvm ??
                summaryQuery.data?.asemakaavanLainvoimaisuusPvm) ||
              ""
            }
            agreementIdentifier={agreementId}
            korkoResults={korkoResults}
            setKorkoResults={setKorkoResults}
          />
        </TabPanel>

        <TabPanel>
          <LandUseMap form={mapFormApi} isEditMode={isEditMode} />
        </TabPanel>

        <TabPanel>
          <div className="landuse-detail__content">
            <p>Muutoshistoria</p>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default LandUseDetailPage;
