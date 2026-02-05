import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Breadcrumb,
  TextInput,
  RadioButton,
  SelectionGroup,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Select,
  Button,
  ButtonVariant,
  IconPlusCircleFill,
  IconTrash,
  Fieldset,
  DateInput,
  SearchInput,
  IconCheckCircle,
  IconCross,
  IconPen,
} from "hds-react";
import { mockLandUseStore, MockLandUseData } from "../mocks/landUseMockData";

interface KohdeEntry {
  id: number;
  kohteenTunnus: string;
  maankayttosopimusType: string;
  edistamisalue: string;
  tila: string;
}

interface ValmistelijaEntry {
  id: number;
  value: string;
}

interface OsoiteEntry {
  id: number;
  katuosoite: string;
  postinumero: string;
  kaupunki: string;
}

const handleSelectChange = (
  selectedOptions: { label: string; value: string }[],
  callback: (value: string) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions[0].value);
  }
};

const LandUseDetailPage: React.FC = () => {
  const { id: identifier } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  // Get mock data for this ID, or use defaults
  const mockData: MockLandUseData | null = identifier
    ? mockLandUseStore[identifier]
    : null;

  // Form state
  const [kohdeEntries, setKohdeEntries] = useState<KohdeEntry[]>([
    {
      id: 1,
      kohteenTunnus: "",
      maankayttosopimusType: "",
      edistamisalue: "",
      tila: "",
    },
  ]);
  const [nextKohdeId, setNextKohdeId] = useState(2);
  const [valmistelijaEntries, setValmistelijaEntries] = useState<
    ValmistelijaEntry[]
  >([{ id: 1, value: "" }]);
  const [nextValmistelijaId, setNextValmistelijaId] = useState(2);
  const [osoiteEntries, setOsoiteEntries] = useState<OsoiteEntry[]>([
    { id: 1, katuosoite: "", postinumero: "", kaupunki: "" },
  ]);
  const [nextOsoiteId, setNextOsoiteId] = useState(2);
  const [arvioituEsittelyvuosi, setArvioituEsittelyvuosi] = useState("");
  const [arvioituMaksuvuosi, setArvioituMaksuvuosi] = useState("");
  const [toimivaltainenPaattaja, setToimivaltainenPaattaja] = useState("");
  const [sisaltaaAmVelvoitteita, setSisaltaaAmVelvoitteita] = useState("kyllä");
  const [velvoitteidenMaaraika, setVelvoitteidenMaaraika] = useState("");
  const [asemakaavanNumero, setAsemakaavanNumero] = useState("");
  const [asemakaavanKasittelyvaihe, setAsemakaavanKasittelyvaihe] =
    useState("");
  const [kasittelyvaiheenViimeisinPvm, setKasittelyvaiheenViimeisinPvm] =
    useState("");
  const [asemakaavanHyvaksyjä, setAsemakaavanHyvaksyjä] = useState("");
  const [asemakaavanDiaarinumero, setAsemakaavanDiaarinumero] = useState("");

  // Add new kohde entry
  const addKohdeEntry = () => {
    setKohdeEntries([
      ...kohdeEntries,
      {
        id: nextKohdeId,
        kohteenTunnus: "",
        maankayttosopimusType: "",
        edistamisalue: "",
        tila: "",
      },
    ]);
    setNextKohdeId(nextKohdeId + 1);
  };

  // Update kohde entry
  const updateKohdeEntry = (
    id: number,
    field: keyof KohdeEntry,
    value: string,
  ) => {
    setKohdeEntries(
      kohdeEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };
  // Delete kohde entry
  const deleteKohdeEntry = (id: number) => {
    if (kohdeEntries.length > 1) {
      setKohdeEntries(kohdeEntries.filter((entry) => entry.id !== id));
    }
  };
  // Add new valmistelija entry
  const addValmistelijaEntry = () => {
    setValmistelijaEntries([
      ...valmistelijaEntries,
      { id: nextValmistelijaId, value: "" },
    ]);
    setNextValmistelijaId(nextValmistelijaId + 1);
  };

  // Update valmistelija entry
  const updateValmistelijaEntry = (id: number, value: string) => {
    setValmistelijaEntries(
      valmistelijaEntries.map((entry) =>
        entry.id === id ? { ...entry, value } : entry,
      ),
    );
  };

  // Delete valmistelija entry
  const deleteValmistelijaEntry = (id: number) => {
    if (valmistelijaEntries.length > 1) {
      setValmistelijaEntries(
        valmistelijaEntries.filter((entry) => entry.id !== id),
      );
    }
  };

  // Add new osoite entry
  const addOsoiteEntry = () => {
    setOsoiteEntries([
      ...osoiteEntries,
      { id: nextOsoiteId, katuosoite: "", postinumero: "", kaupunki: "" },
    ]);
    setNextOsoiteId(nextOsoiteId + 1);
  };

  // Update osoite entry
  const updateOsoiteEntry = (
    id: number,
    field: keyof Omit<OsoiteEntry, "id">,
    value: string,
  ) => {
    setOsoiteEntries(
      osoiteEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  // Delete osoite entry
  const deleteOsoiteEntry = (id: number) => {
    setOsoiteEntries(osoiteEntries.filter((entry) => entry.id !== id));
  };

  // Load mock data when ID changes
  useEffect(() => {
    if (mockData) {
      setKohdeEntries(
        mockData.kohteet.map((kohde, index) => ({
          id: index + 1,
          kohteenTunnus: kohde.kohteenTunnus,
          maankayttosopimusType: kohde.maankayttosopimusType,
          edistamisalue: kohde.edistamisalue,
          tila: kohde.tila,
        })),
      );
      setValmistelijaEntries([
        ...mockData.valmistelijat.map((valmistelija, index) => ({
          id: index + 1,
          value: `${valmistelija.firstName} ${valmistelija.lastName}`.trim(),
        })),
      ]);
      setOsoiteEntries(
        mockData.osoitteet.map((osoite, index) => ({
          id: index + 1,
          katuosoite: osoite.katuosoite,
          postinumero: osoite.postinumero,
          kaupunki: osoite.kaupunki,
        })),
      );
      setArvioituEsittelyvuosi(mockData.arvioituEsittelyvuosi);
      setArvioituMaksuvuosi(mockData.arvioituMaksuvuosi);
      setToimivaltainenPaattaja(mockData.toimivaltainenPaattaja);
      setSisaltaaAmVelvoitteita(mockData.sisaltaaAmVelvoitteita);
      setVelvoitteidenMaaraika(mockData.velvotteidenMaaraAika);
      setAsemakaavanNumero(mockData.asemakaavanNumero);
      setAsemakaavanKasittelyvaihe(mockData.asemakaavanKayttotarkoitusyhmä);
      setKasittelyvaiheenViimeisinPvm(mockData.kasittelyvaiheenViimeisinPvm);
      setAsemakaavanHyvaksyjä(mockData.asemakaavanHyvaksyjä);
      setAsemakaavanDiaarinumero(mockData.asemakaavanDiaarinumero);
    }
  }, [identifier, mockData]);

  // Handle edit mode toggle
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  // Handle save - reloads from mock data to simulate save
  const handleSaveClick = () => {
    // TODO: Implement actual API call to save data
    console.log("Saving data...", {
      kohdeEntries,
      valmistelijaEntries,
      osoiteEntries,
      arvioituEsittelyvuosi,
      arvioituMaksuvuosi,
      toimivaltainenPaattaja,
      sisaltaaAmVelvoitteita,
      velvoitteidenMaaraika,
      asemakaavanNumero,
      asemakaavanKasittelyvaihe,
      kasittelyvaiheenViimeisinPvm,
      asemakaavanHyvaksyjä,
      asemakaavanDiaarinumero,
    });
    setIsEditMode(false);
  };

  // Handle discard changes
  const handleDiscardClick = () => {
    // Reload from mock data to discard changes
    if (mockData) {
      setKohdeEntries(
        mockData.kohteet.map((kohde, index) => ({
          id: index + 1,
          kohteenTunnus: kohde.kohteenTunnus,
          maankayttosopimusType: kohde.maankayttosopimusType,
          edistamisalue: kohde.edistamisalue,
          tila: kohde.tila,
        })),
      );
      setValmistelijaEntries([
        ...mockData.valmistelijat.map((valmistelija, index) => ({
          id: index + 1,
          value: `${valmistelija.firstName} ${valmistelija.lastName}`.trim(),
        })),
      ]);
      setOsoiteEntries(
        mockData.osoitteet.map((osoite, index) => ({
          id: index + 1,
          katuosoite: osoite.katuosoite,
          postinumero: osoite.postinumero,
          kaupunki: osoite.kaupunki,
        })),
      );
      setArvioituEsittelyvuosi(mockData.arvioituEsittelyvuosi);
      setArvioituMaksuvuosi(mockData.arvioituMaksuvuosi);
      setToimivaltainenPaattaja(mockData.toimivaltainenPaattaja);
      setSisaltaaAmVelvoitteita(mockData.sisaltaaAmVelvoitteita);
      setVelvoitteidenMaaraika(mockData.velvotteidenMaaraAika);
      setAsemakaavanNumero(mockData.asemakaavanNumero);
      setAsemakaavanKasittelyvaihe(mockData.asemakaavanKayttotarkoitusyhmä);
      setKasittelyvaiheenViimeisinPvm(mockData.kasittelyvaiheenViimeisinPvm);
      setAsemakaavanHyvaksyjä(mockData.asemakaavanHyvaksyjä);
      setAsemakaavanDiaarinumero(mockData.asemakaavanDiaarinumero);
    }
    setIsEditMode(false);
  };

  // Handle delete
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
          <div className="landuse-detail__content">
            <h2 className="landuse-detail__section-title">PERUSTIEDOT</h2>

            {/* Kohde Section */}
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
            >
              <div className="landuse-detail__grid landuse-detail__grid--with-delete">
                {/* Kohde entries - dynamically rendered */}
                {kohdeEntries.map((entry) => (
                  <React.Fragment key={entry.id}>
                    <div className="landuse-detail__column">
                      <TextInput
                        id={`kohteen-tunnus-${entry.id}`}
                        label="Kohteen tunnus"
                        required
                        value={entry.kohteenTunnus}
                        onChange={(e) =>
                          updateKohdeEntry(
                            entry.id,
                            "kohteenTunnus",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="landuse-detail__column">
                      <Select
                        id={`maankayttosopimus-type-${entry.id}`}
                        options={[
                          {
                            label: "Maankäyttösopimus",
                            value: "Maankäyttösopimus",
                          },
                        ]}
                        value={entry.maankayttosopimusType}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, (value) =>
                            updateKohdeEntry(
                              entry.id,
                              "maankayttosopimusType",
                              value,
                            ),
                          )
                        }
                        texts={{
                          label: "Maankäyttösopimuksen tyyppi",
                          placeholder: "Valitse",
                        }}
                      />
                    </div>

                    <div className="landuse-detail__column">
                      <Select
                        id={`edistamisalue-${entry.id}`}
                        options={[{ label: "Placeholder", value: "" }]}
                        value={entry.edistamisalue}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, (value) =>
                            updateKohdeEntry(entry.id, "edistamisalue", value),
                          )
                        }
                        texts={{
                          label: "Edistämisalue",
                          placeholder: "Valitse",
                        }}
                      />
                    </div>

                    <div className="landuse-detail__column">
                      <Select
                        id={`tila-${entry.id}`}
                        options={[{ label: "Vireillä", value: "Vireillä" }]}
                        value={entry.tila}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, (value) =>
                            updateKohdeEntry(entry.id, "tila", value),
                          )
                        }
                        texts={{
                          label: "Maankäyttösopimuksen tila",
                          placeholder: "Valitse",
                        }}
                      />
                    </div>

                    {
                      <div
                        className="landuse-detail__column"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <Button
                          variant={ButtonVariant.Supplementary}
                          iconStart={<IconTrash />}
                          onClick={() => deleteKohdeEntry(entry.id)}
                          disabled={kohdeEntries.length === 1}
                          style={{ width: "fit-content" }}
                        >
                          Poista
                        </Button>
                      </div>
                    }
                  </React.Fragment>
                ))}

                {/* Add kohde button */}
                <div className="landuse-detail__column">
                  <Button
                    className="landuse-detail__add-button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={addKohdeEntry}
                  >
                    Lisää kohde
                  </Button>
                </div>
              </div>
            </Fieldset>
            {/* Valmistelija Section */}
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
            >
              <div className="landuse-detail__grid">
                {/* Row 2 - Valmistelija fields */}
                {valmistelijaEntries.map((entry) => (
                  <React.Fragment key={entry.id}>
                    <div className="landuse-detail__column">
                      <Select
                        id={`valmistelija-${entry.id}`}
                        options={[
                          { label: "Valmistelija 1", value: "valmistelija1" },
                          { label: "Valmistelija 2", value: "valmistelija2" },
                          { label: "Valmistelija 3", value: "valmistelija3" },
                        ]}
                        value={entry.value}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, (value) =>
                            updateValmistelijaEntry(entry.id, value),
                          )
                        }
                        texts={{
                          label: "Valmistelija",
                          placeholder: "Valitse",
                        }}
                      />
                    </div>

                    <div
                      className="landuse-detail__column"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <Button
                        variant={ButtonVariant.Supplementary}
                        iconStart={<IconTrash />}
                        onClick={() => deleteValmistelijaEntry(entry.id)}
                        disabled={valmistelijaEntries.length === 1}
                        style={{ width: "fit-content" }}
                      >
                        Poista
                      </Button>
                    </div>
                  </React.Fragment>
                ))}

                {/* Add valmistelija button */}
                <div
                  className="landuse-detail__column"
                  style={{ justifyContent: "flex-end" }}
                >
                  <Button
                    className="landuse-detail__add-button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={addValmistelijaEntry}
                  >
                    Lisää valmistelija
                  </Button>
                </div>
              </div>
            </Fieldset>

            {/* Additional Fields Section */}
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading landuse-detail__fieldset--with-margin"
            >
              <div className="landuse-detail__grid">
                {/* Row 1 - Arvioitu esittelyvuosi and maksuvuosi */}
                <div className="landuse-detail__column">
                  <TextInput
                    id="arvioitu-esittelyvuosi"
                    label="Arvioitu esittelyvuosi"
                    value={arvioituEsittelyvuosi}
                    onChange={(e) => setArvioituEsittelyvuosi(e.target.value)}
                  />
                </div>

                <div className="landuse-detail__column">
                  <TextInput
                    id="arvioitu-maksuvuosi"
                    label="Arvioitu maksuvuosi"
                    value={arvioituMaksuvuosi}
                    onChange={(e) => setArvioituMaksuvuosi(e.target.value)}
                  />
                </div>

                {/* Row 1 (cont.) - Sisältää AM-velvoitteita */}
                <div className="landuse-detail__column">
                  <div className="landuse-detail__field-group">
                    <SelectionGroup label="Sisältää AM-velvoitteita">
                      <RadioButton
                        id="am-velvoitteet-kylla"
                        label="Kyllä"
                        checked={sisaltaaAmVelvoitteita === "kyllä"}
                        onChange={() => setSisaltaaAmVelvoitteita("kyllä")}
                      />
                      <RadioButton
                        id="am-velvoitteet-ei"
                        label="Ei"
                        checked={sisaltaaAmVelvoitteita === "ei"}
                        onChange={() => setSisaltaaAmVelvoitteita("ei")}
                      />
                    </SelectionGroup>
                  </div>
                </div>

                {/* Row 1 (cont.) - Velvoitteiden määräaika */}
                <div className="landuse-detail__column">
                  <DateInput
                    id="velvoitteiden-maaraika"
                    label="Velvoitteiden määräaika"
                    value={velvoitteidenMaaraika}
                    onChange={setVelvoitteidenMaaraika}
                    placeholder="DD.MM.YYYY"
                  />
                </div>

                {/* Row 2 - Toimivaltainen päättäjä */}
                <div className="landuse-detail__column">
                  <TextInput
                    id="toimivaltainen-paattaja"
                    label="Toimivaltainen päättäjä"
                    value={toimivaltainenPaattaja}
                    onChange={(e) => setToimivaltainenPaattaja(e.target.value)}
                  />
                </div>
              </div>
            </Fieldset>

            {/* Osoitteet Section */}
            <h3 className="landuse-detail__section-title">Osoitteet</h3>
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading"
            >
              <div className="landuse-detail__grid">
                {/* Osoite entries - dynamically rendered */}
                {osoiteEntries.map((entry) => (
                  <React.Fragment key={entry.id}>
                    <div className="landuse-detail__column">
                      <TextInput
                        id={`katuosoite-${entry.id}`}
                        label="Katuosoite"
                        value={entry.katuosoite}
                        onChange={(e) =>
                          updateOsoiteEntry(
                            entry.id,
                            "katuosoite",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="landuse-detail__column">
                      <TextInput
                        id={`postinumero-${entry.id}`}
                        label="Postinumero"
                        value={entry.postinumero}
                        onChange={(e) =>
                          updateOsoiteEntry(
                            entry.id,
                            "postinumero",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="landuse-detail__column">
                      <TextInput
                        id={`kaupunki-${entry.id}`}
                        label="Kaupunki"
                        value={entry.kaupunki}
                        onChange={(e) =>
                          updateOsoiteEntry(
                            entry.id,
                            "kaupunki",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div
                      className="landuse-detail__column"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <Button
                        variant={ButtonVariant.Supplementary}
                        iconStart={<IconTrash />}
                        onClick={() => deleteOsoiteEntry(entry.id)}
                        style={{ width: "fit-content" }}
                      >
                        Poista
                      </Button>
                    </div>
                  </React.Fragment>
                ))}

                {/* Add osoite button */}
                <div className="landuse-detail__column">
                  <Button
                    className="landuse-detail__add-button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={addOsoiteEntry}
                  >
                    Lisää osoite
                  </Button>
                </div>
              </div>
            </Fieldset>

            {/* Asemakaavat Section */}
            <h3 className="landuse-detail__section-title">Asemakaavatiedot</h3>
            <Fieldset
              heading=""
              className="landuse-detail__fieldset--no-heading"
            >
              <div className="landuse-detail__grid">
                <div className="landuse-detail__column">
                  <SearchInput
                    id="asemakaavan-numero"
                    label="Asemakaavan numero"
                    value={asemakaavanNumero}
                    onChange={setAsemakaavanNumero}
                    onSubmit={(value) =>
                      console.log("Search submitted:", value)
                    }
                    placeholder="Hae asemakaavaa"
                  />
                </div>

                <div className="landuse-detail__column">
                  <TextInput
                    id="asemakaavan-kasittelyvaihe"
                    label="Asemakaavan käsittelyvaihe"
                    value={asemakaavanKasittelyvaihe}
                    onChange={(e) =>
                      setAsemakaavanKasittelyvaihe(e.target.value)
                    }
                    disabled
                  />
                </div>

                <div className="landuse-detail__column">
                  <TextInput
                    id="kasittelyvaiheen-viimeisin-pvm"
                    label="Käsittelyvaiheen viimeisin pvm"
                    value={kasittelyvaiheenViimeisinPvm}
                    onChange={(e) =>
                      setKasittelyvaiheenViimeisinPvm(e.target.value)
                    }
                    disabled
                  />
                </div>

                <div className="landuse-detail__column">
                  <TextInput
                    id="asemakaavan-hyvaksyja"
                    label="Asemakaavan hyväksyjä"
                    value={asemakaavanHyvaksyjä}
                    onChange={(e) => setAsemakaavanHyvaksyjä(e.target.value)}
                    disabled
                  />
                </div>

                <div className="landuse-detail__column">
                  <TextInput
                    id="asemakaavan-diaarinumero"
                    label="Asemakaavan diaarinumero"
                    value={asemakaavanDiaarinumero}
                    onChange={(e) => setAsemakaavanDiaarinumero(e.target.value)}
                    disabled
                  />
                </div>
              </div>
            </Fieldset>
          </div>
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
