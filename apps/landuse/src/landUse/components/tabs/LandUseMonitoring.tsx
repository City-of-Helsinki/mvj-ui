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
import { normalizeSelectValue } from "../../utils/fieldUtils";
import { landUseCompensationSelectOptions } from "../../options";
import type { LandUseSite } from "./LandUseCompensations";
import { INITIAL_SAKKOKERROIN } from "../../constants";
import {
  formatLandUseEuroDisplayValue,
  formatLandUseEuroValue,
  formatLandUseNumericValueWithUnit,
  parseLandUseNumericValue,
  parseNumber,
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
  vaadittuKem2: string;
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
  sakkoKerroinBySiteId?: Record<string, string>;
  sakkoKerroinByPlotDivisionId?: Record<string, string>;
}

interface MonitoringSakkoRow {
  kohteenTunnus: string;
  hallintamuoto?: string;
  vaadittuKerrosala: string;
  toteutunutKerrosala: string;
  hintaero: string;
  korotus: string;
}

interface SakkoRowData {
  id: string;
  kohteenTunnus: string;
  hallintamuoto: string;
  vaadittuValue: number | null;
  toteutunutValue: number;
  sopimussakkoValue: number | null;
  sakkokerroinFieldName: string;
  sakkokerroinInputId: string;
  sakkokerroinValue: string;
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
  const [newToteutunutKem2, setNewToteutunutKem2] = React.useState("");
  const selectedSite = sites.find((site) => site.id === selectedSiteId);
  const selectedSiteForEdit = sites.find(
    (site) => site.id === selectedSiteEditId,
  );

  const closeMonitoringDialog = React.useCallback(() => {
    setSelectedSiteId(null);
    setSelectedPlotDivisionTarget(null);
    setNewToteutunutKem2("");
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
        const sakkoKerroinBySiteId = values.sakkoKerroinBySiteId ?? {};
        const sakkoKerroinByPlotDivisionId =
          values.sakkoKerroinByPlotDivisionId ?? {};
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
          { key: "vaadittuKem2", headerName: "Vaadittu kerrosala" },
          { key: "toteutunutKem2", headerName: "Toteutunut kerrosala" },
          { key: "yksikkohinta", headerName: "Yksikköhinta" },
          { key: "toiminnot", headerName: "Toiminnot" },
        ];

        const monitoringPerustaulukkoRows = sites.flatMap((site, index) => {
          const toteumaEntries = toteumaEntriesBySiteId[site.id] ?? [];
          const plotDivisions = plotDivisionsBySiteId[site.id] ?? [];
          const isPlotDivisionGroup = plotDivisions.length > 0;
          const latestToteutunutEntry = getLatestEntry(toteumaEntries);
          const latestToteutunutKem2 = latestToteutunutEntry?.value ?? "-";
          const kohteenTunnus = site.kohteenTunnus || "-";
          const hallintamuoto = formatSiteHallintamuoto(site.hallintamuoto);
          const vaadittuKem2 = site.kem2 ?? "";
          const vaadittuValue = parseLandUseNumericValue(vaadittuKem2);

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
              isEditMode && !isPlotDivisionGroup ? (
                <Field name={`toteutunutHallintamuotoBySiteId.${site.id}`}>
                  {({ input }) => (
                    <Select
                      id={`monitoring-parent-toteutunut-hallintamuoto-${site.id}`}
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
                (toteutunutHallintamuotoBySiteId[site.id] ??
                hallintamuoto ??
                "-")
              ),
            vaadittuKem2: formatLandUseNumericValueWithUnit(
              vaadittuValue,
              "kem²",
            ),
            toteutunutKem2: latestToteutunutEntry ? (
              <span
                className={
                  isMatchingValue
                    ? "landuse-detail__monitoring-kem2-value landuse-detail__monitoring-kem2-value--match"
                    : "landuse-detail__monitoring-kem2-value landuse-detail__monitoring-kem2-value--mismatch"
                }
              >
                {isMatchingValue ? (
                  <IconCheck size={IconSize.Small} aria-hidden="true" />
                ) : (
                  <IconAlertCircle size={IconSize.Small} aria-hidden="true" />
                )}
                <span>{latestToteutunutKem2}</span>
              </span>
            ) : (
              <span>{latestToteutunutKem2}</span>
            ),
            yksikkohinta: formatLandUseNumericValueWithUnit(
              parseNumber(yksikkohinta),
              "€/kem²",
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
          };

          const childRows = plotDivisions.map((plotDivision, childIndex) => {
            const plotDivisionToteumaEntries =
              toteumaEntriesByPlotDivisionId[plotDivision.id] ?? [];
            const latestPlotDivisionToteutunutEntry = getLatestEntry(
              plotDivisionToteumaEntries,
            );
            const latestPlotDivisionToteutunutKem2 =
              latestPlotDivisionToteutunutEntry?.value ?? "-";
            const isPlotDivisionLocked = plotDivisionToteumaEntries.length > 0;
            const plotDivisionVaadittuKem2 = plotDivision.vaadittuKem2 ?? "";
            const plotDivisionVaadittuValue = parseLandUseNumericValue(
              plotDivisionVaadittuKem2,
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
              vaadittuKem2:
                isEditMode && !isPlotDivisionLocked ? (
                  <Field
                    name={`plotDivisionsBySiteId.${site.id}.${childIndex}.vaadittuKem2`}
                  >
                    {({ input }) => (
                      <TextInput
                        id={`monitoring-plot-division-vaadittu-kem2-${site.id}-${childIndex}`}
                        label=""
                        value={input.value}
                        onChange={input.onChange}
                      />
                    )}
                  </Field>
                ) : (
                  formatLandUseNumericValueWithUnit(
                    parseNumber(plotDivisionVaadittuKem2),
                    "kem²",
                  )
                ),
              toteutunutKem2: latestPlotDivisionToteutunutEntry ? (
                <span
                  className={
                    isPlotDivisionMatchingValue
                      ? "landuse-detail__monitoring-kem2-value landuse-detail__monitoring-kem2-value--match"
                      : "landuse-detail__monitoring-kem2-value landuse-detail__monitoring-kem2-value--mismatch"
                  }
                >
                  {isPlotDivisionMatchingValue ? (
                    <IconCheck size={IconSize.Small} aria-hidden="true" />
                  ) : (
                    <IconAlertCircle size={IconSize.Small} aria-hidden="true" />
                  )}
                  <span>{latestPlotDivisionToteutunutKem2}</span>
                </span>
              ) : (
                <span>{latestPlotDivisionToteutunutKem2}</span>
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
                  formatLandUseNumericValueWithUnit(
                    parseNumber(plotDivision.yksikkohinta),
                    "€/kem²",
                  )
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
            };
          });

          return [parentRow, ...childRows];
        });

        const monitoringVapauttaminenCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "toteuttamatta", headerName: "Toteuttamatta" },
          { key: "hintaero", headerName: "Hintaero" },
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
              const plotDivisionVaadittuKem2 = plotDivision.vaadittuKem2 ?? "";
              const vaadittuValue = parseLandUseNumericValue(
                plotDivisionVaadittuKem2,
              );
              const toteutunutValue =
                parseLandUseNumericValue(latestPlotDivisionEntry?.value) ?? 0;
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
                hintaero: formatLandUseNumericValueWithUnit(
                  hintaeroValue,
                  "€/kem²",
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
          const vaadittuValue = parseLandUseNumericValue(site.kem2);
          const toteutunutValue =
            parseLandUseNumericValue(latestToteutunutEntry?.value) ?? 0;
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
            hintaero: formatLandUseNumericValueWithUnit(
              hintaeroValue,
              "€/kem²",
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

        const monitoringSakkoCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "vaadittuKerrosala", headerName: "Vaadittu kerrosala" },
          { key: "toteutunutKerrosala", headerName: "Toteutunut kerrosala" },
          { key: "sopimussakko", headerName: "Sopimussakko" },
          { key: "korotus", headerName: "Sakkokerroin" },
          { key: "sakonMaara", headerName: "Sakon määrä" },
        ];

        const sakkoRowDataList: SakkoRowData[] = sites.flatMap(
          (site, index) => {
            const plotDivisions = plotDivisionsBySiteId[site.id] ?? [];

            if (plotDivisions.length > 0) {
              return plotDivisions.map(
                (plotDivision, childIndex): SakkoRowData => {
                  const plotDivisionToteumaEntries =
                    toteumaEntriesByPlotDivisionId[plotDivision.id] ?? [];
                  const latestEntry = getLatestEntry(
                    plotDivisionToteumaEntries,
                  );
                  const vaadittuValue = parseLandUseNumericValue(
                    plotDivision.vaadittuKem2 ?? "",
                  );
                  const toteutunutValue =
                    parseLandUseNumericValue(latestEntry?.value) ?? 0;
                  const hintaeroValue = calculateHintaero(
                    perushinta,
                    plotDivision.yksikkohinta ?? "",
                  );
                  const sopimussakkoValue = calculateSopimussakko(
                    hintaeroValue,
                    korotuskerroinValue,
                  );
                  return {
                    id: `sakko-row-${site.id}-plot-division-${plotDivision.id}-${childIndex}`,
                    kohteenTunnus: plotDivision.kohteenTunnus || "-",
                    hallintamuoto: plotDivision.hallintamuoto || "-",
                    vaadittuValue,
                    toteutunutValue,
                    sopimussakkoValue,
                    sakkokerroinFieldName: `sakkoKerroinByPlotDivisionId.${plotDivision.id}`,
                    sakkokerroinInputId: `sakko-kerroin-plot-division-${plotDivision.id}`,
                    sakkokerroinValue:
                      sakkoKerroinByPlotDivisionId[plotDivision.id] ?? "",
                  };
                },
              );
            }

            const latestEntry = getLatestEntry(
              toteumaEntriesBySiteId[site.id] ?? [],
            );
            const vaadittuValue = parseLandUseNumericValue(site.kem2);
            const toteutunutValue =
              parseLandUseNumericValue(latestEntry?.value) ?? 0;
            const yksikkohintaRaw =
              compensationsRowsBySiteId[site.id]?.yksikkohinta ?? "";
            const hintaeroValue = calculateHintaero(
              perushinta,
              yksikkohintaRaw,
            );
            const sopimussakkoValue = calculateSopimussakko(
              hintaeroValue,
              korotuskerroinValue,
            );
            return [
              {
                id: `sakko-row-${site.id}-${index}`,
                kohteenTunnus: site.kohteenTunnus || "-",
                hallintamuoto: formatSiteHallintamuoto(site.hallintamuoto),
                vaadittuValue,
                toteutunutValue,
                sopimussakkoValue,
                sakkokerroinFieldName: `sakkoKerroinBySiteId.${site.id}`,
                sakkokerroinInputId: `sakko-kerroin-site-${site.id}`,
                sakkokerroinValue: sakkoKerroinBySiteId[site.id] ?? "",
              },
            ];
          },
        );

        const monitoringSakkoTableRows = sakkoRowDataList.map((rowData) => ({
          id: rowData.id,
          kohteenTunnus: rowData.kohteenTunnus,
          hallintamuoto: rowData.hallintamuoto,
          vaadittuKerrosala: formatLandUseNumericValueWithUnit(
            rowData.vaadittuValue,
            "kem²",
          ),
          toteutunutKerrosala: formatLandUseNumericValueWithUnit(
            rowData.toteutunutValue,
            "kem²",
          ),
          sopimussakko: formatLandUseNumericValueWithUnit(
            rowData.sopimussakkoValue,
            "€/kem²",
          ),
          korotus: (
            <Field name={rowData.sakkokerroinFieldName}>
              {({ input }) =>
                isEditMode ? (
                  <NumberInput
                    id={rowData.sakkokerroinInputId}
                    label=""
                    value={
                      input.value !== ""
                        ? Number(input.value)
                        : INITIAL_SAKKOKERROIN
                    }
                    onChange={input.onChange}
                    step={0.5}
                  />
                ) : (
                  <TextInput
                    id={`${rowData.sakkokerroinInputId}-readonly`}
                    label=""
                    value={input.value || String(INITIAL_SAKKOKERROIN)}
                    readOnly
                  />
                )
              }
            </Field>
          ),
          sakonMaara: (() => {
            const k =
              parseLandUseNumericValue(rowData.sakkokerroinValue) ??
              INITIAL_SAKKOKERROIN;
            const { vaadittuValue, sopimussakkoValue } = rowData;
            const computed =
              vaadittuValue !== null && sopimussakkoValue !== null && k !== null
                ? vaadittuValue * sopimussakkoValue * k
                : null;
            return formatLandUseNumericValueWithUnit(computed, "€");
          })(),
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
                      label="Maankäyttökorvaus"
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
                      label="Asumismuotoehdot"
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
                        vaadittuKem2: "",
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

                  <div className="landuse-detail__monitoring-dialog-kem2-row">
                    <TextInput
                      id="landuse-monitoring-toteutunut-kem2"
                      label="Toteutunut kerrosala"
                      value={newToteutunutKem2}
                      onChange={(event) =>
                        setNewToteutunutKem2(event.target.value)
                      }
                    />
                    <span className="landuse-detail__monitoring-dialog-kem2-target">
                      /{" "}
                      {selectedPlotDivision?.vaadittuKem2 ??
                        selectedSite?.kem2 ??
                        "-"}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    iconStart={<IconPlusCircleFill />}
                    disabled={
                      !newToteutunutKem2.trim() ||
                      (!selectedSiteId && !selectedPlotDivisionTarget)
                    }
                    onClick={() => {
                      if (!selectedSiteId && !selectedPlotDivisionTarget) {
                        return;
                      }

                      const newEntry = {
                        value: newToteutunutKem2.trim(),
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

                      setNewToteutunutKem2("");
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
