import React, { useState, useEffect, useMemo } from "react";
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
} from "hds-react";
import { createForm } from "final-form";
import arrayMutators from "final-form-arrays";
import { mockLandUseStore, MockLandUseData } from "../mocks/landUseMockData";
import LandUseSummary, { LandUseSummaryFormValues } from "./LandUseSummary";

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

  // Get mock data for this ID, or use defaults
  const mockData = identifier ? mockLandUseStore[identifier] : null;

  // Create form API using useMemo to ensure stable reference
  const summaryFormApi = useMemo(
    () =>
      createForm<LandUseSummaryFormValues>({
        onSubmit: (values) => {
          console.log("Form submitted:", values);
        },
        mutators: { ...arrayMutators },
      }),
    [],
  );

  // Initialize form with mock data
  useEffect(() => {
    const formValues = transformMockDataToFormValues(mockData);
    summaryFormApi.initialize(formValues);
  }, [mockData, summaryFormApi]);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    // TODO: Implement actual API call to save data
    console.log("Saving data...");
    setIsEditMode(false);
  };

  const handleDiscardClick = () => {
    setIsEditMode(false);
  };

  const handleDeleteClick = () => {
    // TODO: Implement confirmation modal and actual API call to delete
    if (window.confirm("Oletko varma, että haluat poistaa tämän sopimuksen?")) {
      console.log("Deleting agreement...");
      // Navigate back to list
    }
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
          <Tab onClick={() => setActiveTab(0)}>Perustiedot</Tab>
          <Tab onClick={() => setActiveTab(1)}>Osapuolet</Tab>
          <Tab onClick={() => setActiveTab(2)}>Korvaukset</Tab>
          <Tab onClick={() => setActiveTab(3)}>Valvonta</Tab>
          <Tab onClick={() => setActiveTab(4)}>Päätökset ja sopimukset</Tab>
          <Tab onClick={() => setActiveTab(5)}>Laskutus</Tab>
          <Tab onClick={() => setActiveTab(6)}>Kartta</Tab>
          <Tab onClick={() => setActiveTab(7)}>Muutoshistoria</Tab>
        </TabList>

        <TabPanel>
          <LandUseSummary form={summaryFormApi} isEditMode={isEditMode} />
        </TabPanel>

        <TabPanel>
          <div className="landuse-detail__content">
            <p>Osapuolet</p>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="landuse-detail__content">
            <p>Korvaukset</p>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="landuse-detail__content">
            <p>Valvonta</p>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="landuse-detail__content">
            <p>Päätökset ja sopimukset</p>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="landuse-detail__content">
            <p>Laskutus</p>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="landuse-detail__content">
            <p>Kartta</p>
          </div>
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
