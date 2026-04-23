import React from "react";
import {
  Button,
  ButtonVariant,
  Dialog,
  Fieldset,
  IconArrowBottomRight,
  IconAngleLeft,
  IconAngleRight,
  IconAlertCircle,
  IconCheck,
  IconPen,
  IconPlusCircleFill,
  IconSitemap,
  IconSize,
  NumberInput,
  Select,
  Table,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import type { FormKey } from "../LandUseDetailPage";
import {
  normalizeSelectValue,
  readOnlyTextValue,
} from "../../utils/fieldUtils";
import { landUseCompensationSelectOptions } from "../../options";
import type { LandUseSite } from "./LandUseCompensations";
import {
  formatLandUseEuroDisplayValue,
  formatLandUseEuroValue,
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
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

export interface MonitoringToteumaEntry {
  value: string;
  createdAt: string;
}

interface MonitoringPlotDivision {
  id: string;
  kohteenTunnus: string;
  hallintamuoto: string;
  vaadittuKm2: string;
  yksikkohinta: string;
}

interface MonitoringPlotDivisionFormValues {
  kohteenTunnus: string;
}

export interface LandUseMonitoringFormValues {
  toteumaEntriesBySiteId?: Record<string, MonitoringToteumaEntry[]>;
  toteumaEntriesByPlotDivisionId?: Record<string, MonitoringToteumaEntry[]>;
  toteutunutHallintamuotoBySiteId?: Record<string, string | undefined>;
  plotDivisionsBySiteId?: Record<string, MonitoringPlotDivision[]>;
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
  korotuskerroin?: number;
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

// Temp id generation
const createPlotDivisionId = (): string =>
  `plot-division-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const calculateVakuudenVapauttaminenTarve = (
  vaadittuValue: number | null,
  toteutunutValue: number | null,
  hintaeroValue: number | null,
  kerroinPercent: number | null,
  korotuskerroinValue: number,
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
    korotuskerroinValue,
  );
};

export const LandUseMonitoring: React.FC<LandUseMonitoringProps> = ({
  form,
  isEditMode,
  sites,
  perushinta,
  compensationsRowsBySiteId,
  korotuskerroin,
  maankayttokorvausYhteensa,
  onSetTabDirty,
}) => {
  const [selectedSiteId, setSelectedSiteId] = React.useState<string | null>(
    null,
  );
  const [selectedSiteEditId, setSelectedSiteEditId] = React.useState<
    string | null
  >(null);
  const [selectedPlotDivisionTarget, setSelectedPlotDivisionTarget] =
    React.useState<{ siteId: string; plotDivisionId: string } | null>(null);
  const [plotDivisionFormValues, setPlotDivisionFormValues] =
    React.useState<MonitoringPlotDivisionFormValues>({
      kohteenTunnus: "",
    });
  const [draftPlotDivisions, setDraftPlotDivisions] = React.useState<
    MonitoringPlotDivision[]
  >([]);
  const [newToteutunutKm2, setNewToteutunutKm2] = React.useState("");
  const selectedSite = sites.find((site) => site.id === selectedSiteId);
  const selectedSiteForEdit = sites.find(
    (site) => site.id === selectedSiteEditId,
  );

  const closeMonitoringDialog = React.useCallback(() => {
    setSelectedSiteId(null);
    setSelectedPlotDivisionTarget(null);
    setNewToteutunutKm2("");
  }, []);

  const closeSiteEditDialog = React.useCallback(() => {
    setSelectedSiteEditId(null);
    setPlotDivisionFormValues({
      kohteenTunnus: "",
    });
    setDraftPlotDivisions([]);
  }, []);

  return (
    <Form<LandUseMonitoringFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const toteumaEntriesBySiteId = values.toteumaEntriesBySiteId ?? {};
        const toteumaEntriesByPlotDivisionId =
          values.toteumaEntriesByPlotDivisionId ?? {};
        const toteutunutHallintamuotoBySiteId =
          values.toteutunutHallintamuotoBySiteId ?? {};
        const plotDivisionsBySiteId = values.plotDivisionsBySiteId ?? {};
        const sakkoRows = values.sakkoRows ?? [];
        const korotuskerroinValue =
          parseLandUseNumericValue(korotuskerroin) ?? 1;
        const selectedPlotDivision = selectedPlotDivisionTarget
          ? (
              plotDivisionsBySiteId[selectedPlotDivisionTarget.siteId] ?? []
            ).find(
              (plotDivision) =>
                plotDivision.id === selectedPlotDivisionTarget.plotDivisionId,
            )
          : undefined;
        const selectedEntries = selectedPlotDivisionTarget
          ? (toteumaEntriesByPlotDivisionId[
              selectedPlotDivisionTarget.plotDivisionId
            ] ?? [])
          : selectedSiteId
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
          { key: "yksikkohinta", headerName: "Yksikköhinta" },
          { key: "toiminnot", headerName: "Toiminnot" },
        ];

        const monitoringPerustaulukkoRows = sites.flatMap((site, index) => {
          const toteumaEntries = toteumaEntriesBySiteId[site.id] ?? [];
          const plotDivisions = plotDivisionsBySiteId[site.id] ?? [];
          const isPlotDivisionGroup = plotDivisions.length > 0;
          const latestToteutunutEntry = getLatestEntry(toteumaEntries);
          const latestToteutunutKm2 = latestToteutunutEntry?.value ?? "-";
          const kohteenTunnus = site.kohteenTunnus || "-";
          const hallintamuoto = formatSiteHallintamuoto(site.hallintamuoto);
          const vaadittuKm2 = site.km2 ?? "";
          const vaadittuValue = parseLandUseNumericValue(vaadittuKm2);
          const toteutunutValue = parseLandUseNumericValue(
            latestToteutunutEntry?.value,
          );
          const isMatchingValue =
            vaadittuValue !== null &&
            toteutunutValue !== null &&
            vaadittuValue === toteutunutValue;
          const yksikkohinta =
            compensationsRowsBySiteId[site.id]?.yksikkohinta ?? "";

          const parentRow = {
            id: `perustaulukko-row-${site.id}-${index}`,
            kohteenTunnus: isPlotDivisionGroup ? (
              <span className="landuse-detail__monitoring-plot-division-group-marker">
                {kohteenTunnus}
              </span>
            ) : (
              kohteenTunnus
            ),
            hallintamuoto,
            toteutunutHallintamuoto:
              toteutunutHallintamuotoBySiteId[site.id] ?? hallintamuoto ?? "-",
            vaadittuKm2: vaadittuKm2 || "-",
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
                {plotDivisions.length === 0 && (
                  <Button
                    type="button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPen />}
                    disabled={!isEditMode}
                    onClick={() => {
                      setSelectedPlotDivisionTarget(null);
                      setSelectedSiteId(site.id);
                    }}
                  >
                    Kirjaa toteuma
                  </Button>
                )}
                <Button
                  type="button"
                  variant={ButtonVariant.Supplementary}
                  iconStart={<IconSitemap />}
                  disabled={!isEditMode}
                  onClick={() => {
                    setSelectedSiteEditId(site.id);
                    setDraftPlotDivisions(plotDivisions);
                    setPlotDivisionFormValues({
                      kohteenTunnus: "",
                    });
                  }}
                >
                  Tonttijako
                </Button>
              </div>
            ),
            yksikkohinta: yksikkohinta || "-",
          };

          const childRows = plotDivisions.map((plotDivision, childIndex) => {
            const plotDivisionToteumaEntries =
              toteumaEntriesByPlotDivisionId[plotDivision.id] ?? [];
            const latestPlotDivisionToteutunutEntry = getLatestEntry(
              plotDivisionToteumaEntries,
            );
            const latestPlotDivisionToteutunutKm2 =
              latestPlotDivisionToteutunutEntry?.value ?? "-";
            const isPlotDivisionLocked = plotDivisionToteumaEntries.length > 0;
            const plotDivisionVaadittuValue = parseLandUseNumericValue(
              plotDivision.vaadittuKm2,
            );
            const plotDivisionToteutunutValue = parseLandUseNumericValue(
              latestPlotDivisionToteutunutEntry?.value,
            );
            const isPlotDivisionMatchingValue =
              plotDivisionVaadittuValue !== null &&
              plotDivisionToteutunutValue !== null &&
              plotDivisionVaadittuValue === plotDivisionToteutunutValue;

            return {
              id: `perustaulukko-row-${site.id}-plot-division-${plotDivision.id}-${childIndex}`,
              kohteenTunnus: (
                <span className="landuse-detail__monitoring-child-row-title">
                  <IconArrowBottomRight
                    size={IconSize.Small}
                    aria-hidden="true"
                  />
                  {plotDivision.kohteenTunnus || "-"}
                </span>
              ),
              hallintamuoto: plotDivision.hallintamuoto || "-",
              toteutunutHallintamuoto:
                isEditMode && !isPlotDivisionLocked ? (
                  <Field
                    name={`plotDivisionsBySiteId.${site.id}.${childIndex}.hallintamuoto`}
                  >
                    {({ input }) => (
                      <Select
                        id={`monitoring-plot-division-toteutunut-hallintamuoto-${site.id}-${childIndex}`}
                        options={hallintamuotoOptions}
                        value={normalizeSelectValue(input.value)}
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, input.onChange)
                        }
                        texts={{
                          label: "",
                          placeholder: "Valitse",
                        }}
                      />
                    )}
                  </Field>
                ) : (
                  plotDivision.hallintamuoto || "-"
                ),
              vaadittuKm2:
                isEditMode && !isPlotDivisionLocked ? (
                  <Field
                    name={`plotDivisionsBySiteId.${site.id}.${childIndex}.vaadittuKm2`}
                  >
                    {({ input }) => (
                      <TextInput
                        id={`monitoring-plot-division-vaadittu-km2-${site.id}-${childIndex}`}
                        label=""
                        value={input.value}
                        onChange={input.onChange}
                      />
                    )}
                  </Field>
                ) : (
                  plotDivision.vaadittuKm2 || "-"
                ),
              toteutunutKm2: latestPlotDivisionToteutunutEntry ? (
                <span
                  className={
                    isPlotDivisionMatchingValue
                      ? "landuse-detail__monitoring-km2-value landuse-detail__monitoring-km2-value--match"
                      : "landuse-detail__monitoring-km2-value landuse-detail__monitoring-km2-value--mismatch"
                  }
                >
                  {isPlotDivisionMatchingValue ? (
                    <IconCheck size={IconSize.Small} aria-hidden="true" />
                  ) : (
                    <IconAlertCircle size={IconSize.Small} aria-hidden="true" />
                  )}
                  <span>{latestPlotDivisionToteutunutKm2}</span>
                </span>
              ) : (
                <span>{latestPlotDivisionToteutunutKm2}</span>
              ),
              toiminnot: (
                <Button
                  type="button"
                  variant={ButtonVariant.Supplementary}
                  iconStart={<IconPen />}
                  disabled={!isEditMode}
                  onClick={() => {
                    setSelectedSiteId(null);
                    setSelectedPlotDivisionTarget({
                      siteId: site.id,
                      plotDivisionId: plotDivision.id,
                    });
                  }}
                >
                  Kirjaa toteuma
                </Button>
              ),
              yksikkohinta:
                isEditMode && !isPlotDivisionLocked ? (
                  <Field
                    name={`plotDivisionsBySiteId.${site.id}.${childIndex}.yksikkohinta`}
                  >
                    {({ input }) => (
                      <TextInput
                        id={`monitoring-plot-division-yksikkohinta-${site.id}-${childIndex}`}
                        label=""
                        value={input.value}
                        onChange={input.onChange}
                      />
                    )}
                  </Field>
                ) : (
                  plotDivision.yksikkohinta || "-"
                ),
            };
          });

          return [parentRow, ...childRows];
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

        const monitoringVapauttaminenRows = sites.flatMap((site, index) => {
          const plotDivisions = plotDivisionsBySiteId[site.id] ?? [];

          if (plotDivisions.length > 0) {
            return plotDivisions.map((plotDivision, childIndex) => {
              const plotDivisionToteumaEntries =
                toteumaEntriesByPlotDivisionId[plotDivision.id] ?? [];
              const latestPlotDivisionEntry = getLatestEntry(
                plotDivisionToteumaEntries,
              );
              const vaadittuValue = parseLandUseNumericValue(
                plotDivision.vaadittuKm2,
              );
              const toteutunutValue = parseLandUseNumericValue(
                latestPlotDivisionEntry?.value,
              );
              const yksikkohintaRaw = plotDivision.yksikkohinta ?? "";
              const hintaeroValue = calculateHintaero(
                perushinta,
                yksikkohintaRaw,
              );
              const sopimussakkoValue = calculateSopimussakko(
                hintaeroValue,
                korotuskerroinValue,
              );
              const kerroinPercent =
                hintaeroValue !== null
                  ? getKerroinPercent(hintaeroValue)
                  : null;
              const vakuustarveValue = calculateVakuudenVapauttaminenTarve(
                vaadittuValue,
                toteutunutValue,
                hintaeroValue,
                kerroinPercent,
                korotuskerroinValue,
              );
              const toteuttamattaValue = calculateToteuttamatta(
                vaadittuValue,
                toteutunutValue,
              );

              return {
                id: `vapauttaminen-row-${site.id}-plot-division-${plotDivision.id}-${childIndex}`,
                kohteenTunnus: plotDivision.kohteenTunnus || "-",
                hallintamuoto: plotDivision.hallintamuoto || "-",
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
          }

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
            korotuskerroinValue,
          );
          const kerroinPercent =
            hintaeroValue !== null ? getKerroinPercent(hintaeroValue) : null;
          const vakuustarveValue = calculateVakuudenVapauttaminenTarve(
            vaadittuValue,
            toteutunutValue,
            hintaeroValue,
            kerroinPercent,
            korotuskerroinValue,
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
              {({ input }) =>
                isEditMode ? (
                  <Select
                    id={`monitoring-sakko-hallintamuoto-${index}`}
                    options={hallintamuotoOptions}
                    value={normalizeSelectValue(input.value)}
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, input.onChange)
                    }
                    texts={{
                      label: "",
                      placeholder: "Valitse",
                    }}
                  />
                ) : (
                  <TextInput
                    id={`monitoring-sakko-hallintamuoto-${index}`}
                    label=""
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
            </Field>
          ),
          vaadittuKerrosala: (
            <Field name={`sakkoRows.${index}.vaadittuKerrosala`}>
              {({ input }) =>
                isEditMode ? (
                  <TextInput
                    id={`monitoring-sakko-vaadittu-kerrosala-${index}`}
                    label=""
                    value={input.value}
                    onChange={input.onChange}
                  />
                ) : (
                  <TextInput
                    id={`monitoring-sakko-vaadittu-kerrosala-${index}`}
                    label=""
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
            </Field>
          ),
          toteutunutKerrosala: (
            <Field name={`sakkoRows.${index}.toteutunutKerrosala`}>
              {({ input }) =>
                isEditMode ? (
                  <TextInput
                    id={`monitoring-sakko-toteutunut-kerrosala-${index}`}
                    label=""
                    value={input.value}
                    onChange={input.onChange}
                  />
                ) : (
                  <TextInput
                    id={`monitoring-sakko-toteutunut-kerrosala-${index}`}
                    label=""
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
            </Field>
          ),
          hintaero: (
            <Field name={`sakkoRows.${index}.hintaero`}>
              {({ input }) =>
                isEditMode ? (
                  <TextInput
                    id={`monitoring-sakko-hintaero-${index}`}
                    label=""
                    value={input.value}
                    onChange={input.onChange}
                  />
                ) : (
                  <TextInput
                    id={`monitoring-sakko-hintaero-${index}`}
                    label=""
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
            </Field>
          ),
          korotus: (
            <Field name={`sakkoRows.${index}.korotus`}>
              {({ input }) =>
                isEditMode ? (
                  <TextInput
                    id={`monitoring-sakko-korotus-${index}`}
                    label=""
                    value={input.value}
                    onChange={input.onChange}
                  />
                ) : (
                  <TextInput
                    id={`monitoring-sakko-korotus-${index}`}
                    label=""
                    value={readOnlyTextValue(input.value)}
                    readOnly
                  />
                )
              }
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
                  <div className="landuse-detail__table-wrapper">
                    <Table
                      className="landuse-detail__table landuse-detail__monitoring-table"
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
                  <div className="landuse-detail__collaterals-increase-factor-field">
                    <TextInput
                      id="monitoring-vapauttaminen-perushinta"
                      label="Perushinta"
                      value={formatLandUseEuroDisplayValue(perushinta)}
                      readOnly
                    />
                  </div>

                  <div className="landuse-detail__table-wrapper">
                    <Table
                      className="landuse-detail__table landuse-detail__monitoring-table"
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
                    <TextInput
                      id="monitoring-sopimuksen-mukainen"
                      label="Sopimuksen mukainen"
                      value={formatLandUseEuroValue(sopimuksenMukainenValue)}
                      readOnly
                      style={
                        remainingCollateralSeparatorDirection === "left"
                          ? {
                              border: "4px solid var(--color-success)",
                              padding: "var(--spacing-2-xs)",
                            }
                          : {
                              padding: "var(--spacing-2-xs)",
                            }
                      }
                    />

                    <span
                      className={`landuse-detail__monitoring-collateral-separator landuse-detail__monitoring-collateral-separator--${remainingCollateralSeparatorDirection}`}
                      aria-hidden="true"
                    >
                      {remainingCollateralSeparatorDirection === "right" ? (
                        <IconAngleLeft size={IconSize.ExtraLarge} />
                      ) : (
                        <IconAngleRight size={IconSize.ExtraLarge} />
                      )}
                    </span>

                    <TextInput
                      id="collaterals-saantelyn-mukainen"
                      label="Sääntelyn mukainen"
                      value={formatLandUseEuroValue(saantelynMukainenValue)}
                      readOnly
                      style={
                        remainingCollateralSeparatorDirection === "right"
                          ? {
                              border: "4px solid var(--color-success)",
                              padding: "var(--spacing-2-xs)",
                            }
                          : {
                              padding: "var(--spacing-2-xs)",
                            }
                      }
                    />
                  </div>
                </Fieldset>

                <Fieldset heading="Sakko">
                  <div className="landuse-detail__table-wrapper">
                    <Table
                      className="landuse-detail__table landuse-detail__monitoring-table"
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
              id="landuse-monitoring-site-edit-dialog"
              isOpen={Boolean(selectedSiteForEdit)}
              aria-labelledby="landuse-monitoring-site-edit-dialog-title"
              closeButtonLabelText="Sulje"
              close={closeSiteEditDialog}
            >
              <Dialog.Header
                id="landuse-monitoring-site-edit-dialog-title"
                title="Muutos tonttijakoon tai kaavayksikön olotilaan"
              />
              <Dialog.Content>
                <div className="landuse-detail__monitoring-site-edit-dialog-content">
                  <p className="landuse-detail__monitoring-dialog-site-label">
                    Arkistoitava kohde
                  </p>
                  <p className="landuse-detail__monitoring-dialog-site-value">
                    {selectedSiteForEdit?.kohteenTunnus ?? "-"}
                  </p>

                  <div className="landuse-detail__monitoring-dialog-list">
                    <p className="landuse-detail__monitoring-dialog-site-label">
                      Lisätyt tonttijaot
                    </p>
                    {draftPlotDivisions.length === 0 ? (
                      <p className="landuse-detail__monitoring-dialog-empty">
                        Ei lisättyjä tonttijakoja.
                      </p>
                    ) : (
                      <ul className="landuse-detail__monitoring-dialog-items">
                        {draftPlotDivisions.map((plotDivision) => (
                          <li key={plotDivision.id}>
                            <span>{plotDivision.kohteenTunnus || "-"}</span>
                            <ConfirmDeleteButton
                              id={`monitoring-plot-division-delete-${plotDivision.id}`}
                              buttonVariant={ButtonVariant.Supplementary}
                              disabled={!isEditMode}
                              onConfirm={() => {
                                setDraftPlotDivisions((current) =>
                                  current.filter(
                                    (item) => item.id !== plotDivision.id,
                                  ),
                                );
                              }}
                              dialogTitle="Poista tonttijako"
                              dialogContent={`Haluatko varmasti poistaa tonttijaon ${plotDivision.kohteenTunnus?.trim() ?? ""}?`}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <TextInput
                    id="landuse-monitoring-site-edit-kohteen-tunnus"
                    label="Uusi kohteen tunnus"
                    value={plotDivisionFormValues.kohteenTunnus}
                    onChange={(event) =>
                      setPlotDivisionFormValues({
                        kohteenTunnus: event.target.value,
                      })
                    }
                  />

                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    iconStart={<IconPlusCircleFill />}
                    disabled={
                      !isEditMode ||
                      !plotDivisionFormValues.kohteenTunnus.trim()
                    }
                    onClick={() => {
                      const nextPlotDivision: MonitoringPlotDivision = {
                        id: createPlotDivisionId(),
                        kohteenTunnus:
                          plotDivisionFormValues.kohteenTunnus.trim(),
                        hallintamuoto: "",
                        vaadittuKm2: "",
                        yksikkohinta: "",
                      };

                      setDraftPlotDivisions((current) => [
                        ...current,
                        nextPlotDivision,
                      ]);
                      setPlotDivisionFormValues({
                        kohteenTunnus: "",
                      });
                    }}
                  >
                    Lisää tonttijako
                  </Button>
                </div>
              </Dialog.Content>
              <Dialog.ActionButtons>
                <Button
                  type="button"
                  variant={ButtonVariant.Primary}
                  disabled={!selectedSiteEditId}
                  onClick={() => {
                    if (!selectedSiteEditId) {
                      return;
                    }

                    form.change("plotDivisionsBySiteId", {
                      ...plotDivisionsBySiteId,
                      [selectedSiteEditId]: draftPlotDivisions,
                    });

                    onSetTabDirty?.("monitoring");
                    closeSiteEditDialog();
                  }}
                >
                  Hyväksy tonttijako
                </Button>
                <Button
                  type="button"
                  variant={ButtonVariant.Secondary}
                  onClick={closeSiteEditDialog}
                >
                  Peruuta
                </Button>
              </Dialog.ActionButtons>
            </Dialog>

            <Dialog
              id="landuse-monitoring-toteutunut-dialog"
              isOpen={Boolean(selectedSite || selectedPlotDivisionTarget)}
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
                    {selectedPlotDivision?.kohteenTunnus ??
                      selectedSite?.kohteenTunnus ??
                      "-"}
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
                      /{" "}
                      {selectedPlotDivision?.vaadittuKm2 ??
                        selectedSite?.km2 ??
                        "-"}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    iconStart={<IconPlusCircleFill />}
                    disabled={
                      !newToteutunutKm2.trim() ||
                      (!selectedSiteId && !selectedPlotDivisionTarget)
                    }
                    onClick={() => {
                      if (!selectedSiteId && !selectedPlotDivisionTarget) {
                        return;
                      }

                      const newEntry = {
                        value: newToteutunutKm2.trim(),
                        createdAt: new Date().toISOString(),
                      };

                      if (selectedPlotDivisionTarget) {
                        const previousEntries =
                          toteumaEntriesByPlotDivisionId[
                            selectedPlotDivisionTarget.plotDivisionId
                          ] ?? [];
                        const nextEntries = [...previousEntries, newEntry];

                        form.change("toteumaEntriesByPlotDivisionId", {
                          ...toteumaEntriesByPlotDivisionId,
                          [selectedPlotDivisionTarget.plotDivisionId]:
                            nextEntries,
                        });
                      } else if (selectedSiteId) {
                        const previousEntries =
                          toteumaEntriesBySiteId[selectedSiteId] ?? [];
                        const nextEntries = [...previousEntries, newEntry];

                        form.change("toteumaEntriesBySiteId", {
                          ...toteumaEntriesBySiteId,
                          [selectedSiteId]: nextEntries,
                        });
                      }

                      onSetTabDirty?.("monitoring");

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
