import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createForm } from "final-form";
import arrayMutators from "final-form-arrays";
import { Breadcrumb } from "hds-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import LandUseNotFoundPage from "@/landUse/components/LandUseNotFoundPage";
import {
  approvePaymentSchedule,
  getBilling,
  getCollaterals,
  getCompensations,
  getContracts,
  getDecisions,
  getMonitoring,
  getParties,
  getPaymentSchedule,
  getSummary,
  rejectPaymentSchedule,
  submitPaymentSchedule,
  updateCompensations,
  updateCollaterals,
  updateDecisions,
  updateParties,
  updateSummary,
} from "@/landUse/api/landUseApi";
import { DEFAULT_KOROTUSKERROIN } from "@/landUse/constants";
import { useCalculateActivePageSection } from "@/landUse/hooks/useCalculateActivePageSection";
import {
  getTocScrollTarget,
  TableOfContentsProvider,
} from "@/landUse/hooks/useTableOfContents";
import {
  LAND_USE_INVOICE_ITEM_TYPES,
  LAND_USE_INVOICE_STATUSES,
  type LandUseInvoice,
  type LandUseInvoiceItem,
} from "@/landUse/options";
import { parseLandUseNumericValueOrZero } from "@/landUse/utils/number";
import type {
  SectionEntry,
  SideNavigationTab,
} from "@/landUse/components/SideNavigation";
import { SideNavigation } from "@/landUse/components/SideNavigation";
import {
  LandUseCollaterals,
  type LandUseCollateralsFormValues,
} from "@/landUse/components/tabs/LandUseCollaterals";
import {
  calculateMaankayttokorvausYhteensa,
  LandUseCompensations,
  type LandUseCompensationsFormValues,
} from "@/landUse/components/tabs/LandUseCompensations";
import {
  LandUseContracts,
  type LandUseContractsFormValues,
} from "@/landUse/components/tabs/LandUseContracts";
import {
  LandUseDecisions,
  type LandUseDecisionsFormValues,
} from "@/landUse/components/tabs/LandUseDecisions";
import {
  LandUseBilling,
  type LandUseBillingFormValues,
  type LandUseBillingParty,
  type LandUseBillingSchedule,
} from "@/landUse/components/tabs/LandUseBilling";
import {
  LandUsePaymentSchedule,
  type LandUsePaymentScheduleEntry,
  type LandUsePaymentScheduleFormValues,
} from "@/landUse/components/tabs/LandUsePaymentSchedule";
import {
  LandUseMonitoring,
  type LandUseMonitoringFormValues,
} from "@/landUse/components/tabs/LandUseMonitoring";
import {
  LandUseParties,
  type LandUsePartiesFormValues,
} from "@/landUse/components/tabs/LandUseParties";
import {
  LandUseSummary,
  type LandUseSummaryFormValues,
} from "@/landUse/components/tabs/LandUseSummary";

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
  | "contracts"
  | "paymentSchedule"
  | "billing";

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
    label: "Päätökset",
    queryKey: "decisions",
    hasForm: true,
    formKey: "decisions",
  },
  {
    label: "Sopimukset ja vakuudet",
    queryKey: "contracts",
    hasForm: true,
    formKey: "contracts",
  },
  {
    label: "Maksusuunnitelmat",
    queryKey: "paymentSchedule",
    hasForm: true,
    formKey: "paymentSchedule",
  },
  {
    label: "Laskutus ja reskontra",
    queryKey: "billing",
    hasForm: true,
    formKey: "billing",
  },
  {
    label: "Valvonta",
    queryKey: "monitoring",
    hasForm: true,
    formKey: "monitoring",
  },
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

const calculatePaidMaankayttokorvaus = (
  invoices: Pick<LandUseInvoice, "status" | "invoiceItems">[],
) => {
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
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const agreementId = id ?? "";
  const [activeTab, setActiveTab] = useState(() =>
    getActiveTabFromSearch(location.search),
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [sectionEntries, setSectionEntries] = useState<SectionEntry[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useCalculateActivePageSection(
    contentRef,
    sectionEntries.map((entry) => entry.id),
    setActiveSectionId,
  );

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
    contracts: { ...initialFormState },
    paymentSchedule: { ...initialFormState },
    billing: { ...initialFormState },
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

  const summaryQuery = useQuery({
    queryKey: ["land-use", agreementId, "summary"],
    queryFn: () => getSummary(agreementId),
    enabled: Boolean(agreementId),
    refetchOnWindowFocus: false,
  });

  const canLoadAgreementData = Boolean(agreementId) && summaryQuery.isSuccess;

  const isAgreementMissing =
    summaryQuery.isError &&
    (summaryQuery.error as { status?: number }).status === 404;

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

  const contractsQuery = useQuery({
    queryKey: ["land-use", agreementId, "contracts"],
    queryFn: () => getContracts(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const paymentScheduleQuery = useQuery({
    queryKey: ["land-use", agreementId, "paymentSchedule"],
    queryFn: () => getPaymentSchedule(agreementId),
    enabled: canLoadAgreementData,
    refetchOnWindowFocus: false,
  });

  const billingQuery = useQuery({
    queryKey: ["land-use", agreementId, "billing"],
    queryFn: () => getBilling(agreementId),
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

  const contractsFormApi = useMemo(
    () =>
      createForm<LandUseContractsFormValues>({
        onSubmit: (values) => {
          console.log("Contracts form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const paymentScheduleFormApi = useMemo(
    () =>
      createForm<LandUsePaymentScheduleFormValues>({
        onSubmit: (values) => {
          console.log("Payment schedule form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  const billingFormApi = useMemo(
    () =>
      createForm<LandUseBillingFormValues>({
        onSubmit: (values) => {
          console.log("Billing form submitted:", values);
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
      contracts: contractsFormApi,
      paymentSchedule: paymentScheduleFormApi,
      billing: billingFormApi,
    }),
    [
      summaryFormApi,
      partiesFormApi,
      compensationsFormApi,
      collateralsFormApi,
      monitoringFormApi,
      decisionsFormApi,
      contractsFormApi,
      paymentScheduleFormApi,
      billingFormApi,
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
      compensationsFormApi.initialize({
        ...compensationsQuery.data,
        // Initializing the calculated value here is necessary to avoid
        // dirtying the initial form state.
        maankayttokorvausYhteensa: calculateMaankayttokorvausYhteensa(
          compensationsQuery.data,
        ),
      });
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
    if (contractsQuery.data) {
      contractsFormApi.initialize(contractsQuery.data);
    }
  }, [
    contractsFormApi,
    contractsQuery.data,
    contractsQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (paymentScheduleQuery.data) {
      paymentScheduleFormApi.initialize(paymentScheduleQuery.data);
    }
  }, [
    paymentScheduleFormApi,
    paymentScheduleQuery.data,
    paymentScheduleQuery.dataUpdatedAt,
    agreementId,
  ]);

  useEffect(() => {
    if (billingQuery.data) {
      billingFormApi.initialize(billingQuery.data);
    }
  }, [
    billingFormApi,
    billingQuery.data,
    billingQuery.dataUpdatedAt,
    agreementId,
  ]);

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

  const decisionsMutation = useMutation({
    mutationFn: (values: LandUseDecisionsFormValues) =>
      updateDecisions(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "decisions"], data);
    },
  });

  const collateralsMutation = useMutation({
    mutationFn: (values: LandUseCollateralsFormValues) =>
      updateCollaterals(agreementId, values),
    onSuccess: (data) => {
      queryClient.setQueryData(["land-use", agreementId, "collaterals"], data);
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

    try {
      if (formStates.summary?.dirty) {
        await summaryMutation.mutateAsync(
          summaryFormApi.getState().values as LandUseSummaryFormValues,
        );
      }
      if (formStates.parties?.dirty) {
        await partiesMutation.mutateAsync(
          partiesFormApi.getState().values as LandUsePartiesFormValues,
        );
      }
      if (formStates.compensations?.dirty) {
        await compensationsMutation.mutateAsync(
          compensationsFormApi.getState()
            .values as LandUseCompensationsFormValues,
        );
      }
      if (formStates.decisions?.dirty) {
        await decisionsMutation.mutateAsync(
          decisionsFormApi.getState().values as LandUseDecisionsFormValues,
        );
      }
      if (formStates.collaterals?.dirty) {
        await collateralsMutation.mutateAsync(
          collateralsFormApi.getState().values as LandUseCollateralsFormValues,
        );
      }
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
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  // Reset the active section highlight whenever the mounted tab changes.
  // Tabs publish their own entries through the table-of-contents context.
  useEffect(() => {
    setActiveSectionId(null);
  }, [activeTab]);

  const handleTocClick = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (target) {
      getTocScrollTarget(target).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveSectionId(id);
    }
  }, []);

  const sideNavigationTabs: SideNavigationTab[] = TABS_CONFIG.map(
    (tabConfig) => {
      const formState = tabConfig.formKey
        ? formStates[tabConfig.formKey]
        : null;
      return {
        label: tabConfig.label,
        isDirty: formState?.dirty ?? false,
        hasError: isSaveClicked && formState ? !formState.valid : false,
      };
    },
  );

  if (isAgreementMissing) {
    return (
      <LandUseNotFoundPage
        agreementId={agreementId}
        onBackToList={() => navigate("/")}
      />
    );
  }

  if (summaryQuery.isPending) {
    return (
      <div className="landuse-detail">
        <div className="landuse-detail__content">Ladataan...</div>
      </div>
    );
  }

  const sitesWithAmVelvoite = (compensationsQuery.data?.sites ?? []).filter(
    (site) => site.amVelvoite === true,
  );

  const activeParties =
    ((partiesFormApi.getState().values as LandUsePartiesFormValues)?.parties ??
      partiesQuery.data?.parties) ||
    [];

  const billingParties: LandUseBillingParty[] = activeParties.map((party) => ({
    party: {
      details: {
        name: party.party.details?.name,
        partyType: party.party.details?.partyType,
        streetAddress: party.party.details?.streetAddress,
        city: party.party.details?.city,
        postalCode: party.party.details?.postalCode,
        ...(party.party.details?.partyType === "yritys" &&
        "businessId" in party.party.details
          ? { businessId: party.party.details?.businessId }
          : {}),
      },
    },
    billingDetails: {
      ovtCode: party.billingDetails?.ovtCode,
      reference: party.billingDetails?.reference,
      sapCustomerNumber: party.billingDetails?.sapCustomerNumber,
    },
    ...(party.invoiceRecipient
      ? {
          invoiceRecipient: {
            details: {
              name: party.invoiceRecipient?.details?.name,
              partyType: party.invoiceRecipient?.details?.partyType,
              streetAddress: party.invoiceRecipient?.details?.streetAddress,
              city: party.invoiceRecipient?.details?.city,
              postalCode: party.invoiceRecipient?.details?.postalCode,
              ...(party.invoiceRecipient?.details?.partyType === "yritys" &&
              "businessId" in party.invoiceRecipient.details
                ? { businessId: party.invoiceRecipient?.details?.businessId }
                : {}),
            },
          },
        }
      : {}),
  }));

  const billingPaymentSchedules: LandUseBillingSchedule[] =
    (
      paymentScheduleFormApi.getState()
        .values as LandUsePaymentScheduleFormValues
    ).paymentSchedules ??
    paymentScheduleQuery.data?.paymentSchedules ??
    [];

  const handleSendToInvoicing = async (
    schedule: LandUsePaymentScheduleEntry,
  ) => {
    await submitPaymentSchedule(schedule.id);
    await queryClient.invalidateQueries({
      queryKey: ["land-use", agreementId, "paymentSchedule"],
    });
  };

  const handleDeclineSchedule = async (
    schedule: LandUsePaymentScheduleEntry,
    rejectedReason: string,
  ) => {
    await rejectPaymentSchedule(schedule.id, rejectedReason);
    await queryClient.invalidateQueries({
      queryKey: ["land-use", agreementId, "paymentSchedule"],
    });
  };

  const handleAcceptSchedule = async (
    schedule: LandUsePaymentScheduleEntry,
  ) => {
    await approvePaymentSchedule(schedule.id);
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["land-use", agreementId, "paymentSchedule"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["land-use", agreementId, "billing"],
      }),
    ]);
  };

  const renderActiveTabPanel = () => {
    const activeTabKey = TABS_CONFIG[activeTab]?.queryKey;
    const isCurrentTabEditable =
      isEditMode &&
      (activeTabKey === "summary" ||
        activeTabKey === "parties" ||
        activeTabKey === "compensations" ||
        activeTabKey === "decisions" ||
        activeTabKey === "collaterals");
    switch (activeTabKey) {
      case "summary":
        return (
          <LandUseSummary
            form={summaryFormApi}
            isEditMode={isCurrentTabEditable}
          />
        );
      case "parties":
        return (
          <LandUseParties
            form={partiesFormApi}
            isEditMode={isCurrentTabEditable}
          />
        );
      case "compensations":
        return (
          <LandUseCompensations
            form={compensationsFormApi}
            isEditMode={isCurrentTabEditable}
            onSetTabDirty={handleSetTabDirty}
          />
        );
      case "collaterals":
        return (
          <LandUseCollaterals
            form={collateralsFormApi}
            isEditMode={isCurrentTabEditable}
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
        );
      case "decisions":
        return (
          <LandUseDecisions
            form={decisionsFormApi}
            isEditMode={isCurrentTabEditable}
            parties={activeParties}
          />
        );
      case "contracts":
        return (
          <LandUseContracts
            form={contractsFormApi}
            isEditMode={false}
            parties={activeParties}
          />
        );
      case "monitoring":
        return (
          <LandUseMonitoring
            form={monitoringFormApi}
            isEditMode={false}
            sites={sitesWithAmVelvoite}
            perushinta={compensationsQuery.data?.perushinta}
            compensationsRowsBySiteId={
              compensationsQuery.data?.perustietotaulukkoRowsBySiteId ?? {}
            }
            korotuskerroin={
              collateralsQuery.data?.korotuskerroin != null
                ? parseLandUseNumericValueOrZero(
                    collateralsQuery.data.korotuskerroin,
                  )
                : DEFAULT_KOROTUSKERROIN
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
              calculatePaidMaankayttokorvaus(billingQuery.data?.invoices ?? [])
            }
            onSetTabDirty={handleSetTabDirty}
          />
        );
      case "paymentSchedule":
        return (
          <LandUsePaymentSchedule
            form={paymentScheduleFormApi}
            isEditMode={false}
            canSubmitSchedules={isEditMode}
            parties={activeParties}
            contracts={
              (contractsFormApi.getState().values as LandUseContractsFormValues)
                ?.contracts ??
              contractsQuery.data?.contracts ??
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
            onSendToInvoicing={handleSendToInvoicing}
          />
        );
      case "billing":
        return (
          <LandUseBilling
            form={billingFormApi}
            isEditMode={false}
            canReviewSchedules={isEditMode}
            parties={billingParties}
            paymentSchedules={billingPaymentSchedules.map((schedule) => ({
              id: schedule.id,
              recipientPartyIndex: schedule.recipientPartyIndex,
              status: schedule.status,
              installments: schedule.installments.map((installment) => ({
                recipientPartyIndex: installment.recipientPartyIndex,
                installmentNumber: installment.installmentNumber,
                installmentTotal: installment.installmentTotal,
                dueDate: installment.dueDate,
                type: installment.type,
                invoiceItems: installment.invoiceItems,
              })),
            }))}
            onAcceptSchedule={handleAcceptSchedule}
            onDeclineSchedule={handleDeclineSchedule}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="landuse-detail">
      <div className="landuse-detail__body">
        <SideNavigation
          title={summaryQuery?.data?.identifier}
          tabs={sideNavigationTabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          tocEntries={sectionEntries}
          activeTocId={activeSectionId}
          onTocClick={handleTocClick}
          isEditMode={isEditMode}
          onEditClick={handleEditClick}
          onSaveClick={handleSaveClick}
          onDiscardClick={handleDiscardClick}
        />

        <div className="landuse-detail__main">
          <Breadcrumb
            aria-label="Breadcrumb"
            list={[
              { title: "Maanvuokrausjärjestelmä", path: "/" },
              { title: "Maankäyttösopimukset", path: "/maankayttosopimukset" },
              { title: summaryQuery?.data?.identifier, path: "" },
            ]}
          />
          <TableOfContentsProvider setEntries={setSectionEntries}>
            <div ref={contentRef}>{renderActiveTabPanel()}</div>
          </TableOfContentsProvider>
        </div>
      </div>
    </div>
  );
};

export default LandUseDetailPage;
