import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
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
import { mockLandUseStore, MockLandUseData } from "../mocks/landUseMockData";
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
  LandUseMonitoring,
  type LandUseMonitoringFormValues,
} from "./tabs/LandUseMonitoring";
import {
  LandUseDecisions,
  type LandUseDecisionsFormValues,
} from "./tabs/LandUseDecisions";
import {
  LandUseInvoicing,
  type LandUseInvoicingFormValues,
} from "./tabs/LandUseInvoicing";
import { LandUseMap, type LandUseMapFormValues } from "./tabs/LandUseMap";

// Form state type for tracking dirty and valid states
interface FormState {
  dirty: boolean;
  valid: boolean;
}

// Tab configuration with form mapping
interface TabConfig {
  label: string;
  hasForm: boolean;
  formKey?: keyof typeof TAB_FORM_KEYS;
}

const TAB_FORM_KEYS = {
  summary: 0,
  parties: 1,
  compensations: 2,
  monitoring: 3,
  decisions: 4,
  invoicing: 5,
  map: 6,
} as const;

const TABS_CONFIG: TabConfig[] = [
  { label: "Perustiedot", hasForm: true, formKey: "summary" },
  { label: "Osapuolet", hasForm: true, formKey: "parties" },
  { label: "Korvaukset", hasForm: true, formKey: "compensations" },
  { label: "Valvonta", hasForm: true, formKey: "monitoring" },
  { label: "Päätökset ja sopimukset", hasForm: true, formKey: "decisions" },
  { label: "Laskutus", hasForm: true, formKey: "invoicing" },
  { label: "Kartta", hasForm: true, formKey: "map" },
  { label: "Muutoshistoria", hasForm: false },
];

// Initial form state
const initialFormState: FormState = { dirty: false, valid: true };

const transformMockDataToFormValues = (
  mockData: MockLandUseData | null,
): LandUseSummaryFormValues => {
  if (!mockData) {
    return {
      kohteet: [
        {
          kohteenTunnus: "",
          maankayttosopimusType: "",
          edistamisalue: "",
          tila: "",
        },
      ],
      valmistelijat: [{ value: "" }],
      osoitteet: [{ katuosoite: "", postinumero: "", kaupunki: "" }],
      arvioituEsittelyvuosi: "",
      arvioituMaksuvuosi: "",
      toimivaltainenPaattaja: "",
      sisaltaaAmVelvoitteita: "kyllä",
      velvoitteidenMaaraika: "",
      asemakaavanNumero: "",
      asemakaavanKasittelyvaihe: "",
      kasittelyvaiheenViimeisinPvm: "",
      asemakaavanHyvaksyjä: "",
      asemakaavanDiaarinumero: "",
    };
  }

  return {
    kohteet: mockData.kohteet.map((kohde) => ({
      kohteenTunnus: kohde.kohteenTunnus,
      maankayttosopimusType: kohde.maankayttosopimusType,
      edistamisalue: kohde.edistamisalue,
      tila: kohde.tila,
    })),
    valmistelijat: mockData.valmistelijat.map((valmistelija) => ({
      value: `${valmistelija.firstName} ${valmistelija.lastName}`.trim(),
    })),
    osoitteet: mockData.osoitteet.map((osoite) => ({
      katuosoite: osoite.katuosoite,
      postinumero: osoite.postinumero,
      kaupunki: osoite.kaupunki,
    })),
    arvioituEsittelyvuosi: mockData.arvioituEsittelyvuosi,
    arvioituMaksuvuosi: mockData.arvioituMaksuvuosi,
    toimivaltainenPaattaja: mockData.toimivaltainenPaattaja,
    sisaltaaAmVelvoitteita: mockData.sisaltaaAmVelvoitteita,
    velvoitteidenMaaraika: mockData.velvotteidenMaaraAika,
    asemakaavanNumero: mockData.asemakaavanNumero,
    asemakaavanKasittelyvaihe: mockData.asemakaavanKayttotarkoitusyhmä,
    kasittelyvaiheenViimeisinPvm: mockData.kasittelyvaiheenViimeisinPvm,
    asemakaavanHyvaksyjä: mockData.asemakaavanHyvaksyjä,
    asemakaavanDiaarinumero: mockData.asemakaavanDiaarinumero,
  };
};

const LandUseDetailPage: React.FC = () => {
  const { id: identifier } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaveClicked, setIsSaveClicked] = useState(false);

  // Form state tracking for each tab
  const [formStates, setFormStates] = useState<Record<string, FormState>>({
    summary: { ...initialFormState },
    parties: { ...initialFormState },
    compensations: { ...initialFormState },
    monitoring: { ...initialFormState },
    decisions: { ...initialFormState },
    invoicing: { ...initialFormState },
    map: { ...initialFormState },
  });

  // Get mock data for this ID, or use defaults
  const mockData = identifier ? mockLandUseStore[identifier] : null;

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
      monitoring: monitoringFormApi,
      decisions: decisionsFormApi,
      invoicing: invoicingFormApi,
      map: mapFormApi,
    }),
    [
      summaryFormApi,
      partiesFormApi,
      compensationsFormApi,
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
            [key]: { dirty: state.dirty, valid: state.valid },
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

  // Initialize form with mock data
  useEffect(() => {
    const formValues = transformMockDataToFormValues(mockData);
    summaryFormApi.initialize(formValues);
    // Initialize other forms with empty objects (placeholder forms)
    partiesFormApi.initialize({});
    compensationsFormApi.initialize({});
    monitoringFormApi.initialize({});
    decisionsFormApi.initialize({});
    invoicingFormApi.initialize({});
    mapFormApi.initialize({});
  }, [
    mockData,
    summaryFormApi,
    partiesFormApi,
    compensationsFormApi,
    monitoringFormApi,
    decisionsFormApi,
    invoicingFormApi,
    mapFormApi,
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

  const handleSaveClick = () => {
    setIsSaveClicked(true);

    // Check if all forms are valid
    if (!areAllFormsValid()) {
      console.log("Some forms have validation errors");
      return;
    }

    // Collect values only from dirty forms
    const payload: Record<string, unknown> = {};

    Object.entries(formApis).forEach(([key, formApi]) => {
      const state = formApi.getState();
      if (state.dirty) {
        payload[key] = state.values;
      }
    });

    // TODO: Implement actual API call to save data
    console.log("Saving changed forms:", payload);

    // Reset states after successful save
    setIsSaveClicked(false);
    setIsEditMode(false);
  };

  const handleDiscardClick = () => {
    // Reset all forms to their initial values
    Object.values(formApis).forEach((formApi) => {
      formApi.reset();
    });

    setIsSaveClicked(false);
    setIsEditMode(false);
  };

  const handleDeleteClick = () => {
    // TODO: Implement confirmation modal and actual API call to delete
    if (window.confirm("Oletko varma, että haluat poistaa tämän sopimuksen?")) {
      console.log("Deleting agreement...");
      // Navigate back to list
    }
  };

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
          { title: "Uusi sopimus", path: "" },
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
                variant={ButtonVariant.Danger}
                onClick={handleDeleteClick}
                iconStart={<IconTrash />}
              >
                Poista
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
            <Tab key={tabConfig.label} onClick={() => setActiveTab(index)}>
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
          <LandUseMonitoring form={monitoringFormApi} isEditMode={isEditMode} />
        </TabPanel>

        <TabPanel>
          <LandUseDecisions form={decisionsFormApi} isEditMode={isEditMode} />
        </TabPanel>

        <TabPanel>
          <LandUseInvoicing form={invoicingFormApi} isEditMode={isEditMode} />
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
