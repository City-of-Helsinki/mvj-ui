import React from "react";
import {
  Button,
  ButtonVariant,
  Dialog,
  Fieldset,
  IconAngleLeft,
  IconAngleRight,
  IconAlertCircle,
  IconCheck,
  IconSize,
  IconPlusCircleFill,
  IconPen,
  NumberInput,
  Select,
  Table,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import type { FormKey } from "../LandUseDetailPage";
import { normalizeSelectValue } from "../../fieldUtils";
import { landUseCompensationSelectOptions } from "../../options";
import type { LandUseSite } from "./LandUseCompensations";
import {
  formatLandUseEuroDisplayValue,
  formatLandUseNumericValueWithUnit,
  parseLandUseNumericValue,
} from "../../utils/number";
import {
  calculateHintaero,
  calculateSopimussakko,
  calculateToteuttamatta,
  calculateVakuustarve,
  getKerroinPercent,
} from "../../utils/vakuustarve";

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

export interface MonitoringToteumaEntry {
  value: string;
  createdAt: string;
}

export interface LandUseMonitoringFormValues {
  toteumaEntriesBySiteId?: Record<string, MonitoringToteumaEntry[]>;
  toteutunutHallintamuotoBySiteId?: Record<string, string | undefined>;
  sakkoRows?: MonitoringSakkoRow[];
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
  form: FormApi<LandUseMonitoringFormValues>;
  isEditMode: boolean;
  sites: LandUseSite[];
  perushinta?: string;
  compensationsRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
  vertailunPeruskerroin?: number;
  maankayttokorvausYhteensa?: number;
  onSetTabDirty?: (formKey: FormKey) => void;
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

const formatSiteHallintamuoto = (
  hallintamuoto: string[] | undefined,
): string => {
  if (!hallintamuoto || hallintamuoto.length === 0) {
    return "-";
  }

  return hallintamuoto.join(", ");
};

const getEntryTime = (entry: MonitoringToteumaEntry): number => {
  const parsed = Date.parse(entry.createdAt);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getLatestEntry = (
  entries: MonitoringToteumaEntry[],
): MonitoringToteumaEntry | undefined =>
  entries.reduce<MonitoringToteumaEntry | undefined>((latest, entry) => {
    if (!latest) {
      return entry;
    }

    return getEntryTime(entry) >= getEntryTime(latest) ? entry : latest;
  }, undefined);

const calculateVakuudenVapauttaminenTarve = (
  vaadittuValue: number | null,
  toteutunutValue: number | null,
  hintaeroValue: number | null,
  kerroinPercent: number | null,
  vertailunPeruskerroinValue: number,
): number | null => {
  if (
    vaadittuValue === null ||
    toteutunutValue === null ||
    hintaeroValue === null ||
    kerroinPercent === null
  ) {
    return null;
  }

  return calculateVakuustarve(
    vaadittuValue - toteutunutValue,
    hintaeroValue,
    kerroinPercent,
    vertailunPeruskerroinValue,
  );
};

export const LandUseMonitoring: React.FC<LandUseMonitoringProps> = ({
  form,
  isEditMode,
  sites,
  perushinta,
  compensationsRowsBySiteId,
  vertailunPeruskerroin,
  maankayttokorvausYhteensa,
  onSetTabDirty,
}) => {
  const [selectedSiteId, setSelectedSiteId] = React.useState<string | null>(
    null,
  );
  const [newToteutunutKm2, setNewToteutunutKm2] = React.useState("");
  const selectedSite = sites.find((site) => site.id === selectedSiteId);

  const closeMonitoringDialog = React.useCallback(() => {
    setSelectedSiteId(null);
    setNewToteutunutKm2("");
  }, []);

  return (
    <Form<LandUseMonitoringFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const toteumaEntriesBySiteId = values.toteumaEntriesBySiteId ?? {};
        const toteutunutHallintamuotoBySiteId =
          values.toteutunutHallintamuotoBySiteId ?? {};
        const sakkoRows = values.sakkoRows ?? [];
        const vertailunPeruskerroinValue =
          parseLandUseNumericValue(vertailunPeruskerroin) ?? 1;
        const selectedEntries = selectedSiteId
          ? (toteumaEntriesBySiteId[selectedSiteId] ?? [])
          : [];

        const monitoringPerustaulukkoCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          {
            key: "toteutunutHallintamuoto",
            headerName: "Toteutunut hallintamuoto",
          },
          { key: "vaadittuKm2", headerName: "Vaadittu k-m²" },
          { key: "toteutunutKm2", headerName: "Toteutunut k-m²" },
          { key: "toiminnot", headerName: "Toiminnot" },
          { key: "yksikkohinta", headerName: "Yksikköhinta" },
        ];

        const monitoringPerustaulukkoRows = sites.map((site, index) => {
          const toteumaEntries = toteumaEntriesBySiteId[site.id] ?? [];
          const latestToteutunutEntry = getLatestEntry(toteumaEntries);
          const latestToteutunutKm2 = latestToteutunutEntry?.value ?? "-";
          const vaadittuValue = parseLandUseNumericValue(site.km2);
          const toteutunutValue = parseLandUseNumericValue(
            latestToteutunutEntry?.value,
          );
          const isMatchingValue =
            vaadittuValue !== null &&
            toteutunutValue !== null &&
            vaadittuValue === toteutunutValue;
          const rowHallintamuotoOptions = (site.hallintamuoto ?? []).map(
            (value) => ({
              label: value,
              value,
            }),
          );
          const yksikkohinta =
            compensationsRowsBySiteId[site.id]?.yksikkohinta ?? "-";

          return {
            id: `perustaulukko-row-${site.id}-${index}`,
            kohteenTunnus: site.kohteenTunnus || "-",
            hallintamuoto: formatSiteHallintamuoto(site.hallintamuoto),
            toteutunutHallintamuoto: isEditMode ? (
              <Field name={`toteutunutHallintamuotoBySiteId.${site.id}`}>
                {({ input }) => (
                  <Select
                    id={`monitoring-perustaulukko-toteutunut-hallintamuoto-${site.id}`}
                    options={rowHallintamuotoOptions}
                    value={normalizeSelectValue(
                      input.value ??
                        toteutunutHallintamuotoBySiteId[site.id] ??
                        undefined,
                    )}
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, input.onChange)
                    }
                    disabled={rowHallintamuotoOptions.length === 0}
                    texts={{
                      label: "",
                      placeholder: "Valitse",
                    }}
                  />
                )}
              </Field>
            ) : (
              (toteutunutHallintamuotoBySiteId[site.id] ?? "-")
            ),
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
          };
        });

        const monitoringSakkoCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "vaadittuKerrosala", headerName: "Vaadittu kerrosala" },
          { key: "toteutunutKerrosala", headerName: "Toteutunut kerrosala" },
          { key: "hintaero", headerName: "Hintaero" },
          { key: "korotus", headerName: "Korotus" },
        ];

        const monitoringVapauttaminenCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "toteuttamatta", headerName: "Toteuttamatta" },
          { key: "sopimussakko", headerName: "Sopimussakko" },
          { key: "kerroin", headerName: "Kerroin" },
          { key: "vakuustarve", headerName: "Vakuustarve" },
        ];

        const monitoringVapauttaminenRows = sites.map((site, index) => {
          const latestToteutunutEntry = getLatestEntry(
            toteumaEntriesBySiteId[site.id] ?? [],
          );
          const vaadittuValue = parseLandUseNumericValue(site.km2);
          const toteutunutValue = parseLandUseNumericValue(
            latestToteutunutEntry?.value,
          );
          const yksikkohintaRaw =
            compensationsRowsBySiteId[site.id]?.yksikkohinta ?? "";
          const hintaeroValue = calculateHintaero(perushinta, yksikkohintaRaw);
          const sopimussakkoValue = calculateSopimussakko(
            hintaeroValue,
            vertailunPeruskerroinValue,
          );
          const kerroinPercent =
            hintaeroValue !== null ? getKerroinPercent(hintaeroValue) : null;
          const vakuustarveValue = calculateVakuudenVapauttaminenTarve(
            vaadittuValue,
            toteutunutValue,
            hintaeroValue,
            kerroinPercent,
            vertailunPeruskerroinValue,
          );

          const toteuttamattaValue = calculateToteuttamatta(
            vaadittuValue,
            toteutunutValue,
          );

          return {
            id: `vapauttaminen-row-${site.id}-${index}`,
            kohteenTunnus: site.kohteenTunnus || "-",
            hallintamuoto: formatSiteHallintamuoto(site.hallintamuoto),
            toteuttamatta: formatLandUseNumericValueWithUnit(
              toteuttamattaValue,
              "kem²",
            ),
            sopimussakko: formatLandUseNumericValueWithUnit(
              sopimussakkoValue,
              "€/kem²",
            ),
            kerroin: kerroinPercent !== null ? `${kerroinPercent} %` : "-",
            vakuustarve: formatLandUseNumericValueWithUnit(
              vakuustarveValue,
              "€",
            ),
          };
        });

        const sopimuksenMukainenValue = maankayttokorvausYhteensa ?? 0;

        const saantelynMukainenValue = monitoringVapauttaminenRows.reduce(
          (sum, row) => {
            const vakuustarveValue = parseLandUseNumericValue(row.vakuustarve);
            return sum + (vakuustarveValue ?? 0);
          },
          0,
        );

        const remainingCollateralSeparatorDirection =
          sopimuksenMukainenValue > saantelynMukainenValue
            ? "left"
            : saantelynMukainenValue > sopimuksenMukainenValue
              ? "right"
              : "equal";

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
                  heading="Vakuuden vapauttaminen"
                  className="landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__collaterals-base-coefficient-field">
                    <TextInput
                      id="monitoring-vapauttaminen-perushinta"
                      label="Perushinta"
                      value={formatLandUseEuroDisplayValue(perushinta)}
                      disabled
                    />
                  </div>

                  <div className="landuse-detail__sites-table-wrapper">
                    <Table
                      className="landuse-detail__sites-table landuse-detail__monitoring-table"
                      cols={monitoringVapauttaminenCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={monitoringVapauttaminenRows}
                      variant="light"
                    />
                  </div>
                </Fieldset>

                <Fieldset
                  heading="Jäljellä oleva vakuustarve"
                  className="landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__grid landuse-detail__monitoring-collateral-grid">
                    <div
                      className={`landuse-detail__monitoring-collateral-field${
                        remainingCollateralSeparatorDirection === "left"
                          ? " landuse-detail__monitoring-collateral-field--highlight"
                          : ""
                      }`}
                    >
                      <NumberInput
                        id="monitoring-sopimuksen-mukainen"
                        label="Sopimuksen mukainen"
                        value={sopimuksenMukainenValue}
                        unit="€"
                        disabled
                      />
                    </div>

                    <span
                      className={`landuse-detail__monitoring-collateral-separator landuse-detail__monitoring-collateral-separator--${remainingCollateralSeparatorDirection}`}
                      aria-hidden="true"
                    >
                      {remainingCollateralSeparatorDirection === "right" ? (
                        <IconAngleLeft />
                      ) : (
                        <IconAngleRight />
                      )}
                    </span>

                    <div
                      className={`landuse-detail__monitoring-collateral-field${
                        remainingCollateralSeparatorDirection === "right"
                          ? " landuse-detail__monitoring-collateral-field--highlight"
                          : ""
                      }`}
                    >
                      <NumberInput
                        id="monitoring-raha-korvaus"
                        label="Sääntelyn mukainen"
                        value={saantelynMukainenValue}
                        unit="€"
                        disabled
                      />
                    </div>
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
                        toteumaEntriesBySiteId[selectedSiteId] ?? [];
                      const newEntry = {
                        value: newToteutunutKm2.trim(),
                        createdAt: new Date().toISOString(),
                      };
                      const nextEntries = [...previousEntries, newEntry];

                      form.change("toteumaEntriesBySiteId", {
                        ...toteumaEntriesBySiteId,
                        [selectedSiteId]: nextEntries,
                      });
                      onSetTabDirty("monitoring");

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
                        {[...selectedEntries]
                          .sort((a, b) => getEntryTime(b) - getEntryTime(a))
                          .map((entry, index) => (
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
