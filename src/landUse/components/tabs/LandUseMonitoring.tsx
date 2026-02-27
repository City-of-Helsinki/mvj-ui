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
  Table,
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
  toteutunutKm2EntriesBySiteId?: Record<string, MonitoringToteutunutEntry[]>;
  sakkoRows?: MonitoringSakkoRow[];
  sopimuksenMukainen?: string;
  rahakorvaus?: string;
}

interface MonitoringVakuuslaskuriRow {
  kohteenTunnus: string;
  hallintamuoto?: string;
  km2: string;
  hintaero: string;
  kerroin: string;
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

const formatEuroValue = (value: number): string =>
  `${value.toLocaleString("fi-FI", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} €`;

const formatNumericValue = (value: number): string =>
  value.toLocaleString("fi-FI", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const getKerroinPercent = (hintaero: number): number => {
  if (hintaero <= 500) {
    return 100;
  }

  if (hintaero <= 1000) {
    return 80;
  }

  if (hintaero <= 1500) {
    return 70;
  }

  return 60;
};

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
        const vakuuslaskuriRows: MonitoringVakuuslaskuriRow[] = leafSites.map(
          (site) => {
            const kohteenTunnus = site.kohteenTunnus || "-";
            const vaadittuValue = parseLandUseNumericValue(site.km2);
            const latestToteutunutValue = parseLandUseNumericValue(
              toteutunutKm2EntriesBySiteId[site.id]?.[
                (toteutunutKm2EntriesBySiteId[site.id]?.length ?? 1) - 1
              ]?.value,
            );
            const toteutunutValue = latestToteutunutValue ?? 0;
            const hintaeroValue = parseLandUseNumericValue(
              compensationsRowsBySiteId[site.id]?.yksikkohinta,
            );
            const kerroinPercent =
              hintaeroValue !== null ? getKerroinPercent(hintaeroValue) : null;

            const vakuustarveValue =
              vaadittuValue !== null &&
              hintaeroValue !== null &&
              kerroinPercent !== null
                ? Math.max(0, vaadittuValue - toteutunutValue) *
                  hintaeroValue *
                  (kerroinPercent / 100)
                : null;

            return {
              kohteenTunnus,
              hallintamuoto: site.hallintamuoto || "-",
              km2: site.km2 || "-",
              hintaero:
                hintaeroValue !== null
                  ? formatNumericValue(hintaeroValue)
                  : "-",
              kerroin: kerroinPercent !== null ? `${kerroinPercent} %` : "-",
              vakuustarve:
                vakuustarveValue !== null
                  ? formatEuroValue(vakuustarveValue)
                  : "-",
              vakuudet: "-",
            };
          },
        );
        const sakkoRows = values.sakkoRows ?? defaultSakkoRows;
        const selectedEntries = selectedSiteId
          ? (toteutunutKm2EntriesBySiteId[selectedSiteId] ?? [])
          : [];

        const monitoringPerustaulukkoCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "vaadittuKm2", headerName: "Vaadittu k-m²" },
          { key: "toteutunutKm2", headerName: "Toteutunut k-m²" },
          { key: "toiminnot", headerName: "Toiminnot" },
          { key: "yksikkohinta", headerName: "Yksikköhinta" },
          { key: "muutos", headerName: "Muutos" },
        ];

        const monitoringPerustaulukkoRows = leafSites.map((site, index) => {
          const toteutunutEntries = toteutunutKm2EntriesBySiteId[site.id] ?? [];
          const latestToteutunutEntry =
            toteutunutEntries[toteutunutEntries.length - 1];
          const latestToteutunutKm2 = latestToteutunutEntry?.value ?? "-";
          const isToteutunut = toteutunutEntries.length > 0;
          const vaadittuValue = parseLandUseNumericValue(site.km2);
          const toteutunutValue = parseLandUseNumericValue(
            latestToteutunutEntry?.value,
          );
          const isMatchingValue =
            vaadittuValue !== null &&
            toteutunutValue !== null &&
            vaadittuValue === toteutunutValue;
          const yksikkohinta =
            compensationsRowsBySiteId[site.id]?.yksikkohinta ?? "-";

          return {
            id: `perustaulukko-row-${site.id}-${index}`,
            kohteenTunnus: site.kohteenTunnus || "-",
            hallintamuoto: site.hallintamuoto || "-",
            vaadittuKm2: site.km2 || "-",
            toteutunutKm2: latestToteutunutEntry ? (
              <span
                className={
                  isMatchingValue
                    ? "landuse-detail__monitoring-km2-value landuse-detail__monitoring-km2-value--match"
                    : "landuse-detail__monitoring-km2-value landuse-detail__monitoring-km2-value--mismatch"
                }
              >
                {isMatchingValue ? (
                  <IconCheck size={IconSize.Small} aria-hidden="true" />
                ) : (
                  <IconAlertCircle size={IconSize.Small} aria-hidden="true" />
                )}
                <span>{latestToteutunutKm2}</span>
              </span>
            ) : (
              <span>{latestToteutunutKm2}</span>
            ),
            toiminnot: (
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
            ),
            yksikkohinta,
            muutos: isToteutunut ? "" : "Muutos",
          };
        });

        const monitoringVakuuslaskuriCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "km2", headerName: "k-m²" },
          { key: "hintaero", headerName: "Hintaero" },
          { key: "kerroin", headerName: "Kerroin" },
          { key: "vakuustarve", headerName: "Vakuustarve" },
          { key: "vakuudet", headerName: "Vakuudet" },
        ];

        const monitoringVakuuslaskuriTableRows = vakuuslaskuriRows.map(
          (row, index) => ({
            id: `vakuuslaskuri-row-${row.kohteenTunnus}-${index}`,
            kohteenTunnus: row.kohteenTunnus,
            hallintamuoto: row.hallintamuoto || "-",
            km2: row.km2 || "-",
            hintaero: row.hintaero,
            kerroin: row.kerroin,
            vakuustarve: row.vakuustarve,
            vakuudet: row.vakuudet,
          }),
        );

        const monitoringInfoCols = [
          { key: "hintaero", headerName: "Hintaero" },
          { key: "vakuustarvekerroin", headerName: "Vakuustarvekerroin" },
        ];

        const monitoringInfoRows = [
          {
            id: "info-1",
            hintaero: "0 € / k-m² - 500 € / k-m²",
            vakuustarvekerroin: "100 %",
          },
          {
            id: "info-2",
            hintaero: "501 € / k-m² - 1000 € / k-m²",
            vakuustarvekerroin: "80 %",
          },
          {
            id: "info-3",
            hintaero: "1001 € / k-m² - 1500 € / k-m²",
            vakuustarvekerroin: "70 %",
          },
          {
            id: "info-4",
            hintaero: "1501 € / k-m² -",
            vakuustarvekerroin: "60 %",
          },
        ];

        const monitoringSakkoCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "vaadittuKerrosala", headerName: "Vaadittu kerrosala" },
          { key: "toteutunutKerrosala", headerName: "Toteutunut kerrosala" },
          { key: "hintaero", headerName: "Hintaero" },
          { key: "korotus", headerName: "Korotus" },
        ];

        const monitoringSakkoTableRows = sakkoRows.map((row, index) => ({
          id: `sakko-row-${row.kohteenTunnus}-${index}`,
          kohteenTunnus: row.kohteenTunnus,
          hallintamuoto: (
            <Field name={`sakkoRows.${index}.hallintamuoto`}>
              {({ input }) => (
                <Select
                  id={`monitoring-sakko-hallintamuoto-${index}`}
                  options={hallintamuotoOptions}
                  value={normalizeSelectValue(input.value ?? row.hallintamuoto)}
                  onChange={(selectedOptions) =>
                    handleSelectChange(selectedOptions, input.onChange)
                  }
                  disabled={!isEditMode}
                  texts={{
                    label: "",
                    placeholder: "Valitse",
                  }}
                />
              )}
            </Field>
          ),
          vaadittuKerrosala: (
            <Field name={`sakkoRows.${index}.vaadittuKerrosala`}>
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
          ),
          toteutunutKerrosala: (
            <Field name={`sakkoRows.${index}.toteutunutKerrosala`}>
              {({ input }) => (
                <TextInput
                  id={`monitoring-sakko-toteutunut-kerrosala-${index}`}
                  label=""
                  value={input.value ?? row.toteutunutKerrosala}
                  onChange={input.onChange}
                  disabled={!isEditMode}
                />
              )}
            </Field>
          ),
          hintaero: (
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
          ),
          korotus: (
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
          ),
        }));

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
                    <Table
                      className="landuse-detail__sites-table landuse-detail__monitoring-table"
                      cols={monitoringPerustaulukkoCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={monitoringPerustaulukkoRows}
                      variant="light"
                    />
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
                    <Table
                      className="landuse-detail__sites-table landuse-detail__monitoring-table"
                      cols={monitoringVakuuslaskuriCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={monitoringVakuuslaskuriTableRows}
                      variant="light"
                    />
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

                    <Table
                      className="landuse-detail__sites-table landuse-detail__monitoring-info-table"
                      cols={monitoringInfoCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={monitoringInfoRows}
                      variant="light"
                    />
                  </div>
                </Fieldset>

                <Fieldset heading="Sakko">
                  <div className="landuse-detail__sites-table-wrapper">
                    <Table
                      className="landuse-detail__sites-table landuse-detail__monitoring-table"
                      cols={monitoringSakkoCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={monitoringSakkoTableRows}
                      variant="light"
                    />
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
