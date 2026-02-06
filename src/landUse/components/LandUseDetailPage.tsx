import React, { useState } from "react";
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
import { mockLandUseStore } from "../mocks/landUseMockData";
import LandUseSummary from "./LandUseSummary";

const LandUseDetailPage: React.FC = () => {
  const { id: identifier } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  // Get mock data for this ID, or use defaults
  const mockData = identifier ? mockLandUseStore[identifier] : null;

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
          <Tab onClick={() => setActiveTab(3)}>Vahvonta</Tab>
          <Tab onClick={() => setActiveTab(4)}>Päätökset ja...</Tab>
          <Tab onClick={() => setActiveTab(5)}>Laskutus</Tab>
          <Tab onClick={() => setActiveTab(6)}>Kartta</Tab>
          <Tab onClick={() => setActiveTab(7)}>Muutoshistoria</Tab>
        </TabList>

        <TabPanel>
          <LandUseSummary mockData={mockData} isEditMode={isEditMode} />
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
            <p>Vahvonta</p>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="landuse-detail__content">
            <p>Päätökset ja...</p>
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
