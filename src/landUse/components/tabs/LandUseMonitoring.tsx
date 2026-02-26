import React from "react";
import {
  Button,
  ButtonVariant,
  Dialog,
  Fieldset,
  IconAlertCircle,
  IconCheck,
  IconCopy,
  IconSize,
  IconPlusCircleFill,
  IconPen,
  Select,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import { normalizeSelectValue } from "../../fieldUtils";
import { landUseCompensationSelectOptions } from "../../mocks/landUseMockData";
import type { LandUseSiteTreeNode } from "./LandUseSites";
import { collectLeafNodes } from "../../utils/siteTree";
import { addMonitoringToteutunutEntry } from "../../api/landUseApi";
import { parseLandUseNumericValue } from "../../utils/number";

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

export interface MonitoringToteutunutEntry {
  value: string;
  createdAt: string;
}

export interface LandUseMonitoringFormValues {
  toteutunutBySiteId?: Record<string, string>;
  toteutunutKm2EntriesBySiteId?: Record<string, MonitoringToteutunutEntry[]>;
  vakuuslaskuriRows?: MonitoringVakuuslaskuriRow[];
  sakkoRows?: MonitoringSakkoRow[];
  sopimuksenMukainen?: string;
  rahakorvaus?: string;
}

interface MonitoringVakuuslaskuriRow {
  kohteenTunnus: string;
  hallintamuoto?: string;
  km2: string;
  hintaero: string;
  kerroin?: string;
  vakuustarve: string;
  vakuudet: string;
}

interface MonitoringSakkoRow {
  kohteenTunnus: string;
  hallintamuoto?: string;
  vaadittuKerrosala: string;
  toteutunutKerrosala: string;
  hintaero: string;
  korotus: string;
}

interface LandUseMonitoringProps {
  agreementId: string;
  form: FormApi<LandUseMonitoringFormValues>;
  isEditMode: boolean;
  sites: LandUseSiteTreeNode[];
  compensationsRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
}

const handleSelectChange = (
  selectedOptions: { label: string; value: string }[],
  callback: (value: string | undefined) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions[0].value);
  } else {
    callback(undefined);
  }
};

const hallintamuotoOptions = landUseCompensationSelectOptions.hallintamuoto.map(
  (value) => ({ label: value, value }),
);

const vakuusKerroinOptions = ["100 %", "80 %", "70 %", "60 %"].map((value) => ({
  label: value,
  value,
}));

const defaultVakuuslaskuriRows: MonitoringVakuuslaskuriRow[] = [
  {
    kohteenTunnus: "91-38-52-1",
    hallintamuoto: "Vapaarahoitteinen omistus",
    km2: "1000",
    hintaero: "1000",
    kerroin: "100 %",
    vakuustarve: "0",
    vakuudet: "3",
  },
  {
    kohteenTunnus: "91-38-52-8",
    hallintamuoto: "ARA-Vuokra",
    km2: "250",
    hintaero: "500",
    kerroin: "80 %",
    vakuustarve: "100 000",
    vakuudet: "0",
  },
  {
    kohteenTunnus: "91-38-52-2",
    hallintamuoto: "ASO",
    km2: "1000",
    hintaero: "500",
    kerroin: "80 %",
    vakuustarve: "0",
    vakuudet: "0",
  },
];

const defaultSakkoRows: MonitoringSakkoRow[] = [
  {
    kohteenTunnus: "91-38-52-1",
    hallintamuoto: "Vapaarahoitteinen omistus",
    vaadittuKerrosala: "1000",
    toteutunutKerrosala: "-",
    hintaero: "0",
    korotus: "10 %",
  },
  {
    kohteenTunnus: "91-38-52-2",
    hallintamuoto: "ARA-Vuokra",
    vaadittuKerrosala: "500",
    toteutunutKerrosala: "-",
    hintaero: "300",
    korotus: "10 %",
  },
  {
    kohteenTunnus: "91-38-52-6",
    hallintamuoto: "ASO",
    vaadittuKerrosala: "1500",
    toteutunutKerrosala: "-",
    hintaero: "500",
    korotus: "10 %",
  },
];

export const LandUseMonitoring: React.FC<LandUseMonitoringProps> = ({
  agreementId,
  form,
  isEditMode,
  sites,
  compensationsRowsBySiteId,
}) => {
  const [selectedSiteId, setSelectedSiteId] = React.useState<string | null>(
    null,
  );
  const [newToteutunutKm2, setNewToteutunutKm2] = React.useState("");
  const leafSites = collectLeafNodes(sites);
  const selectedSite = leafSites.find((site) => site.id === selectedSiteId);

  const closeMonitoringDialog = React.useCallback(() => {
    setSelectedSiteId(null);
    setNewToteutunutKm2("");
  }, []);

  return (
    <Form<LandUseMonitoringFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const toteutunutKm2EntriesBySiteId =
          values.toteutunutKm2EntriesBySiteId ?? {};
        const vakuuslaskuriRows =
          values.vakuuslaskuriRows ?? defaultVakuuslaskuriRows;
        const sakkoRows = values.sakkoRows ?? defaultSakkoRows;
        const selectedEntries = selectedSiteId
          ? (toteutunutKm2EntriesBySiteId[selectedSiteId] ?? [])
          : [];

        return (
          <>
            <form onSubmit={handleSubmit}>
              <div className="landuse-detail__content">
                <h2 className="landuse-detail__section-title">VALVONTA</h2>

                <Fieldset
                  heading="Valvonnan perustaulukko VE1"
                  className="landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__monitoring-table-toolbar">
                    <Button
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconCopy />}
                      disabled={!isEditMode}
                    >
                      Hae taulukon tiedot
                    </Button>
                    <Button
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconCopy />}
                      disabled={!isEditMode}
                    >
                      Kopioi taulukon tiedot
                    </Button>
                  </div>

                  <div className="landuse-detail__sites-table-wrapper">
                    <table className="landuse-detail__sites-table landuse-detail__monitoring-table">
                      <thead>
                        <tr>
                          <th>Kohteen tunnus</th>
                          <th>Hallintamuoto</th>
                          <th>Vaadittu k-m²</th>
                          <th>Toteutunut k-m²</th>
                          <th>Toiminnot</th>
                          <th>Yksikköhinta</th>
                          <th>Muutos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leafSites.map((site, index) => {
                          const toteutunutEntries =
                            toteutunutKm2EntriesBySiteId[site.id] ?? [];
                          const latestToteutunutEntry =
                            toteutunutEntries[toteutunutEntries.length - 1];
                          const latestToteutunutKm2 =
                            latestToteutunutEntry?.value ?? "-";
                          const isToteutunut = toteutunutEntries.length > 0;
                          const vaadittuValue = parseLandUseNumericValue(
                            site.km2,
                          );
                          const toteutunutValue = parseLandUseNumericValue(
                            latestToteutunutEntry?.value,
                          );
                          const isMatchingValue =
                            vaadittuValue !== null &&
                            toteutunutValue !== null &&
                            vaadittuValue === toteutunutValue;
                          const yksikkohinta =
                            compensationsRowsBySiteId[site.id]?.yksikkohinta ??
                            "-";

                          return (
                            <tr key={`perustaulukko-row-${site.id}-${index}`}>
                              <td>{site.kohteenTunnus || "-"}</td>
                              <td>{site.hallintamuoto || "-"}</td>
                              <td>{site.km2 || "-"}</td>
                              <td>
                                {latestToteutunutEntry ? (
                                  <span
                                    className={
                                      isMatchingValue
                                        ? "landuse-detail__monitoring-km2-value landuse-detail__monitoring-km2-value--match"
                                        : "landuse-detail__monitoring-km2-value landuse-detail__monitoring-km2-value--mismatch"
                                    }
                                  >
                                    {isMatchingValue ? (
                                      <IconCheck
                                        size={IconSize.Small}
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <IconAlertCircle
                                        size={IconSize.Small}
                                        aria-hidden="true"
                                      />
                                    )}
                                    <span>{latestToteutunutKm2}</span>
                                  </span>
                                ) : (
                                  <span>{latestToteutunutKm2}</span>
                                )}
                              </td>
                              <td>
                                <div className="landuse-detail__monitoring-actions-cell">
                                  <Button
                                    type="button"
                                    variant={ButtonVariant.Supplementary}
                                    iconStart={<IconPen />}
                                    disabled={!isEditMode}
                                    onClick={() => {
                                      setSelectedSiteId(site.id);
                                    }}
                                  >
                                    Kirjaa toteuma
                                  </Button>
                                </div>
                              </td>
                              <td>{yksikkohinta}</td>
                              <td>{isToteutunut ? "" : "Muutos"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Fieldset>

                <Fieldset
                  heading="Vakuuslaskuri"
                  className="landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__monitoring-table-toolbar">
                    <Button
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconCopy />}
                      disabled={!isEditMode}
                    >
                      Hae taulukon tiedot
                    </Button>
                    <Button
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconCopy />}
                      disabled={!isEditMode}
                    >
                      Kopioi taulukon tiedot
                    </Button>
                  </div>

                  <div className="landuse-detail__sites-table-wrapper">
                    <table className="landuse-detail__sites-table landuse-detail__monitoring-table">
                      <thead>
                        <tr>
                          <th>Kohteen tunnus</th>
                          <th>Hallintamuoto</th>
                          <th>k-m²</th>
                          <th>Hintaero</th>
                          <th>Kerroin</th>
                          <th>Vakuustarve</th>
                          <th>Vakuudet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vakuuslaskuriRows.map((row, index) => (
                          <tr
                            key={`vakuuslaskuri-row-${row.kohteenTunnus}-${index}`}
                          >
                            <td>{row.kohteenTunnus}</td>
                            <td>
                              <Field
                                name={`vakuuslaskuriRows.${index}.hallintamuoto`}
                              >
                                {({ input }) => (
                                  <Select
                                    id={`monitoring-vakuuslaskuri-hallintamuoto-${index}`}
                                    options={hallintamuotoOptions}
                                    value={normalizeSelectValue(
                                      input.value ?? row.hallintamuoto,
                                    )}
                                    onChange={(selectedOptions) =>
                                      handleSelectChange(
                                        selectedOptions,
                                        input.onChange,
                                      )
                                    }
                                    disabled={!isEditMode}
                                    texts={{
                                      label: "",
                                      placeholder: "Valitse",
                                    }}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field name={`vakuuslaskuriRows.${index}.km2`}>
                                {({ input }) => (
                                  <TextInput
                                    id={`monitoring-vakuuslaskuri-km2-${index}`}
                                    label=""
                                    value={input.value ?? row.km2}
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field
                                name={`vakuuslaskuriRows.${index}.hintaero`}
                              >
                                {({ input }) => (
                                  <TextInput
                                    id={`monitoring-vakuuslaskuri-hintaero-${index}`}
                                    label=""
                                    value={input.value ?? row.hintaero}
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field
                                name={`vakuuslaskuriRows.${index}.kerroin`}
                              >
                                {({ input }) => (
                                  <Select
                                    id={`monitoring-vakuuslaskuri-kerroin-${index}`}
                                    options={vakuusKerroinOptions}
                                    value={normalizeSelectValue(
                                      input.value ?? row.kerroin,
                                    )}
                                    onChange={(selectedOptions) =>
                                      handleSelectChange(
                                        selectedOptions,
                                        input.onChange,
                                      )
                                    }
                                    disabled={!isEditMode}
                                    texts={{
                                      label: "",
                                      placeholder: "Valitse",
                                    }}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field
                                name={`vakuuslaskuriRows.${index}.vakuustarve`}
                              >
                                {({ input }) => (
                                  <TextInput
                                    id={`monitoring-vakuuslaskuri-vakuustarve-${index}`}
                                    label=""
                                    value={input.value ?? row.vakuustarve}
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field
                                name={`vakuuslaskuriRows.${index}.vakuudet`}
                              >
                                {({ input }) => (
                                  <TextInput
                                    id={`monitoring-vakuuslaskuri-vakuudet-${index}`}
                                    label=""
                                    value={input.value ?? row.vakuudet}
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Fieldset>

                <Fieldset
                  heading="Jäljellä oleva vakuustarve"
                  className="landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__grid landuse-detail__monitoring-remaining-grid">
                    <Field name="sopimuksenMukainen">
                      {({ input }) => (
                        <TextInput
                          id="monitoring-sopimuksen-mukainen"
                          label="Sopimuksen mukainen"
                          value={input.value ?? "0 €"}
                          onChange={input.onChange}
                          disabled={!isEditMode}
                        />
                      )}
                    </Field>

                    <Field name="rahakorvaus">
                      {({ input }) => (
                        <TextInput
                          id="monitoring-raha-korvaus"
                          label="Rahakorvaus"
                          value={input.value ?? "10 000 €"}
                          onChange={input.onChange}
                          disabled={!isEditMode}
                        />
                      )}
                    </Field>
                  </div>

                  <div className="landuse-detail__monitoring-info-box">
                    <div className="landuse-detail__monitoring-info-content">
                      <p className="landuse-detail__monitoring-info-title">
                        Lorem ipsum
                      </p>
                      <p>
                        Korotettu vakuustarve määräytyy hintaeron mukaisesti
                        alla olevien rajojen mukaan.
                      </p>
                    </div>

                    <table className="landuse-detail__sites-table landuse-detail__monitoring-info-table">
                      <thead>
                        <tr>
                          <th>Hintaero</th>
                          <th>Vakuustarvekerroin</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>0 € / k-m² - 500 € / k-m²</td>
                          <td>100 %</td>
                        </tr>
                        <tr>
                          <td>501 € / k-m² - 1000 € / k-m²</td>
                          <td>80 %</td>
                        </tr>
                        <tr>
                          <td>1001 € / k-m² - 1500 € / k-m²</td>
                          <td>70 %</td>
                        </tr>
                        <tr>
                          <td>1501 € / k-m² -</td>
                          <td>60 %</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Fieldset>

                <Fieldset heading="Sakko">
                  <div className="landuse-detail__sites-table-wrapper">
                    <table className="landuse-detail__sites-table landuse-detail__monitoring-table">
                      <thead>
                        <tr>
                          <th>Kohteen tunnus</th>
                          <th>Hallintamuoto</th>
                          <th>Vaadittu kerrosala</th>
                          <th>Toteutunut kerrosala</th>
                          <th>Hintaero</th>
                          <th>Korotus</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sakkoRows.map((row, index) => (
                          <tr key={`sakko-row-${row.kohteenTunnus}-${index}`}>
                            <td>{row.kohteenTunnus}</td>
                            <td>
                              <Field name={`sakkoRows.${index}.hallintamuoto`}>
                                {({ input }) => (
                                  <Select
                                    id={`monitoring-sakko-hallintamuoto-${index}`}
                                    options={hallintamuotoOptions}
                                    value={normalizeSelectValue(
                                      input.value ?? row.hallintamuoto,
                                    )}
                                    onChange={(selectedOptions) =>
                                      handleSelectChange(
                                        selectedOptions,
                                        input.onChange,
                                      )
                                    }
                                    disabled={!isEditMode}
                                    texts={{
                                      label: "",
                                      placeholder: "Valitse",
                                    }}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field
                                name={`sakkoRows.${index}.vaadittuKerrosala`}
                              >
                                {({ input }) => (
                                  <TextInput
                                    id={`monitoring-sakko-vaadittu-kerrosala-${index}`}
                                    label=""
                                    value={input.value ?? row.vaadittuKerrosala}
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field
                                name={`sakkoRows.${index}.toteutunutKerrosala`}
                              >
                                {({ input }) => (
                                  <TextInput
                                    id={`monitoring-sakko-toteutunut-kerrosala-${index}`}
                                    label=""
                                    value={
                                      input.value ?? row.toteutunutKerrosala
                                    }
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field name={`sakkoRows.${index}.hintaero`}>
                                {({ input }) => (
                                  <TextInput
                                    id={`monitoring-sakko-hintaero-${index}`}
                                    label=""
                                    value={input.value ?? row.hintaero}
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </td>
                            <td>
                              <Field name={`sakkoRows.${index}.korotus`}>
                                {({ input }) => (
                                  <TextInput
                                    id={`monitoring-sakko-korotus-${index}`}
                                    label=""
                                    value={input.value ?? row.korotus}
                                    onChange={input.onChange}
                                    disabled={!isEditMode}
                                  />
                                )}
                              </Field>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="landuse-detail__monitoring-table-toolbar landuse-detail__monitoring-table-toolbar--start">
                    <Button
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconPlusCircleFill />}
                      disabled={!isEditMode}
                    >
                      Lisää yksikköhinta
                    </Button>
                  </div>
                </Fieldset>
              </div>
            </form>

            <Dialog
              id="landuse-monitoring-toteutunut-dialog"
              isOpen={Boolean(selectedSite)}
              aria-labelledby="landuse-monitoring-toteutunut-dialog-title"
              closeButtonLabelText="Sulje"
              close={closeMonitoringDialog}
            >
              <Dialog.Header
                id="landuse-monitoring-toteutunut-dialog-title"
                title="Toteutunut"
              />
              <Dialog.Content>
                <div className="landuse-detail__monitoring-dialog-content">
                  <p className="landuse-detail__monitoring-dialog-site-label">
                    Kohteen tunnus
                  </p>
                  <p className="landuse-detail__monitoring-dialog-site-value">
                    {selectedSite?.kohteenTunnus ?? "-"}
                  </p>

                  <div className="landuse-detail__monitoring-dialog-km2-row">
                    <TextInput
                      id="landuse-monitoring-toteutunut-km2"
                      label="Toteutunut k-m²"
                      value={newToteutunutKm2}
                      onChange={(event) =>
                        setNewToteutunutKm2(event.target.value)
                      }
                    />
                    <span className="landuse-detail__monitoring-dialog-km2-target">
                      / {selectedSite?.km2 ?? "-"}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    iconStart={<IconPlusCircleFill />}
                    disabled={!newToteutunutKm2.trim() || !selectedSiteId}
                    onClick={() => {
                      if (!selectedSiteId) {
                        return;
                      }

                      const previousEntries =
                        toteutunutKm2EntriesBySiteId[selectedSiteId] ?? [];
                      const newEntry = {
                        value: newToteutunutKm2.trim(),
                        createdAt: new Date().toISOString(),
                      };
                      const nextEntries = [...previousEntries, newEntry];

                      form.change("toteutunutKm2EntriesBySiteId", {
                        ...toteutunutKm2EntriesBySiteId,
                        [selectedSiteId]: nextEntries,
                      });

                      if (agreementId) {
                        void addMonitoringToteutunutEntry(
                          agreementId,
                          selectedSiteId,
                          newEntry,
                        );
                      }

                      setNewToteutunutKm2("");
                    }}
                  >
                    Kirjaa toteuma
                  </Button>

                  <div className="landuse-detail__monitoring-dialog-list">
                    <p className="landuse-detail__monitoring-dialog-site-label">
                      Toteumat
                    </p>
                    {selectedEntries.length === 0 ? (
                      <p className="landuse-detail__monitoring-dialog-empty">
                        Ei lisättyjä toteumia.
                      </p>
                    ) : (
                      <ul className="landuse-detail__monitoring-dialog-items">
                        {[...selectedEntries].reverse().map((entry, index) => (
                          <li key={`${entry.createdAt}-${index}`}>
                            <span>{entry.value}</span>
                            <span>
                              {new Date(entry.createdAt).toLocaleString(
                                "fi-FI",
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Dialog.Content>
              <Dialog.ActionButtons>
                <Button
                  type="button"
                  variant={ButtonVariant.Primary}
                  onClick={closeMonitoringDialog}
                >
                  Sulje
                </Button>
              </Dialog.ActionButtons>
            </Dialog>
          </>
        );
      }}
    />
  );
};
