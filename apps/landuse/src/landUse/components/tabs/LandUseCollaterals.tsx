import React from "react";
import {
  Button,
  ButtonVariant,
  Dialog,
  Fieldset,
  IconAngleLeft,
  IconAngleRight,
  IconPen,
  IconPlusCircleFill,
  IconTrash,
  NumberInput,
  Notification,
  Select,
  Table,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import type { LandUseSite } from "./LandUseCompensations";
import {
  formatLandUseEuroDisplayValue,
  formatLandUseEuroValue,
  formatLandUseNumericValue,
  formatLandUseNumericValueWithUnit,
  parseLandUseNumericValue,
} from "../../utils/number";
import {
  calculateHintaero,
  calculateSaantelynMukainenOriginalValue,
  calculateSopimussakko,
  calculateVakuustarve,
  getKerroinPercent,
} from "../../utils/vakuustarve";
import {
  calculateGuaranteeBalances,
  getGuaranteesFromAgreements,
  type CollateralAgreementValue,
  type CollateralGuaranteeBalance,
} from "../../utils/collateralGuarantees";

export interface LandUseCollateralsFormValues {
  vertailunPeruskerroin?: number;
  vakuusValinnatBySiteId?: Record<string, CollateralSelectedGuarantee[]>;
}

interface CollateralSelectedGuarantee {
  guaranteeId: string;
  sopimusnumero: string;
  jarjestysnumero: string;
  vakuuttaJaljella?: string;
  kaytettavaMaara: string;
}

interface PerustietotaulukkoRowValues {
  yksikkohinta: string;
}

interface CollateralsVakuuslaskuriRow {
  kohteenTunnus: string;
  hallintamuoto?: string;
  km2: string;
  hintaero: string;
  sopimussakko: string;
  kerroin: string;
  vakuustarve: React.ReactNode;
  vakuudet: React.ReactNode;
}

interface LandUseCollateralsProps {
  form: FormApi<LandUseCollateralsFormValues>;
  isEditMode: boolean;
  sites: LandUseSite[];
  perushinta?: string;
  compensationsRowsBySiteId: Record<string, PerustietotaulukkoRowValues>;
  agreements: CollateralAgreementValue[];
  maankayttokorvausYhteensa?: number;
}

const formatSiteHallintamuoto = (
  hallintamuoto: string[] | undefined,
): string => {
  if (!hallintamuoto || hallintamuoto.length === 0) {
    return "-";
  }

  return hallintamuoto.join(", ");
};

const formatGuaranteeOptionLabel = (
  sopimusnumero: string,
  jarjestysnumero: string,
): string => `${sopimusnumero || "-"} / ${jarjestysnumero || "-"}`;

const calculateRemainingVakuustarve = (
  vaadittuValue: number | null,
  hintaeroValue: number | null,
  kerroinPercent: number | null,
  vertailunPeruskerroin: number | null,
  selectedGuaranteesForSite: CollateralSelectedGuarantee[],
): Array<number | null> => {
  if (
    vaadittuValue === null ||
    hintaeroValue === null ||
    kerroinPercent === null ||
    vertailunPeruskerroin === null
  ) {
    return [null, null];
  }

  const vakuustarveTotalValue = calculateVakuustarve(
    vaadittuValue,
    hintaeroValue,
    kerroinPercent,
    vertailunPeruskerroin,
  );
  if (vakuustarveTotalValue === null) {
    return [null, null];
  }

  const selectedGuaranteesTotal = selectedGuaranteesForSite.reduce(
    (sum, guarantee) => {
      const amount = parseLandUseNumericValue(guarantee.kaytettavaMaara);
      return sum + (amount ?? 0);
    },
    0,
  );
  const remainingVakuustarve = vakuustarveTotalValue - selectedGuaranteesTotal;

  return [remainingVakuustarve, vakuustarveTotalValue];
};

export const LandUseCollaterals: React.FC<LandUseCollateralsProps> = ({
  form,
  isEditMode,
  sites,
  perushinta,
  compensationsRowsBySiteId,
  agreements,
  maankayttokorvausYhteensa,
}) => {
  const [selectedSiteId, setSelectedSiteId] = React.useState<string | null>(
    null,
  );
  const [selectedGuaranteeId, setSelectedGuaranteeId] = React.useState("");
  const [kaytettavaMaara, setKaytettavaMaara] = React.useState("");
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const guarantees = React.useMemo(
    () => getGuaranteesFromAgreements(agreements),
    [agreements],
  );

  const closeGuaranteeDialog = React.useCallback(() => {
    setSelectedSiteId(null);
    setSelectedGuaranteeId("");
    setKaytettavaMaara("");
    setDraggedIndex(null);
  }, []);

  return (
    <Form<LandUseCollateralsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const vertailunPeruskerroin =
          parseLandUseNumericValue(values.vertailunPeruskerroin) ?? 1;

        const guaranteeBalances = calculateGuaranteeBalances(
          guarantees,
          values.vakuusValinnatBySiteId,
        );
        const guaranteeBalanceById = guaranteeBalances.reduce<
          Record<string, CollateralGuaranteeBalance>
        >(
          (accumulator, guaranteeBalance) => ({
            ...accumulator,
            [guaranteeBalance.id]: guaranteeBalance,
          }),
          {},
        );

        const selectedSite = sites.find((site) => site.id === selectedSiteId);
        const selectedGuarantee = selectedGuaranteeId
          ? guaranteeBalanceById[selectedGuaranteeId]
          : undefined;
        const selectedSiteGuarantees = selectedSiteId
          ? (values.vakuusValinnatBySiteId?.[selectedSiteId] ?? [])
          : [];

        const guaranteeOptions = guaranteeBalances.map((guarantee) => ({
          label: formatGuaranteeOptionLabel(
            guarantee.sopimusnumero,
            guarantee.jarjestysnumero,
          ),
          value: guarantee.id,
        }));

        const selectedGuaranteeRemaining =
          selectedGuarantee?.jaljellaMaara ?? 0;
        const kaytettavaMaaraValue = parseLandUseNumericValue(kaytettavaMaara);
        const hasKaytettavaMaaraInput = kaytettavaMaara.trim().length > 0;
        const isKaytettavaMaaraOverRemaining =
          hasKaytettavaMaaraInput &&
          kaytettavaMaaraValue !== null &&
          kaytettavaMaaraValue > selectedGuaranteeRemaining;
        const isKaytettavaMaaraInvalidForSubmit =
          hasKaytettavaMaaraInput &&
          (kaytettavaMaaraValue === null ||
            kaytettavaMaaraValue < 0 ||
            isKaytettavaMaaraOverRemaining);

        const vakuuslaskuriRows: CollateralsVakuuslaskuriRow[] = sites.map(
          (site) => {
            const kohteenTunnus = site.kohteenTunnus || "-";
            const vaadittuValue = parseLandUseNumericValue(site.km2);
            const hintaeroValue = calculateHintaero(
              perushinta,
              compensationsRowsBySiteId[site.id]?.yksikkohinta,
            );
            const sopimussakkoValue = calculateSopimussakko(
              hintaeroValue,
              vertailunPeruskerroin,
            );
            const kerroinPercent =
              hintaeroValue !== null ? getKerroinPercent(hintaeroValue) : null;

            const selectedGuaranteesForSite =
              values.vakuusValinnatBySiteId?.[site.id] ?? [];

            const [remainingVakuustarveValue, totalVakuustarveValue] =
              calculateRemainingVakuustarve(
                vaadittuValue,
                hintaeroValue,
                kerroinPercent,
                vertailunPeruskerroin,
                selectedGuaranteesForSite,
              );

            return {
              kohteenTunnus,
              hallintamuoto: formatSiteHallintamuoto(site.hallintamuoto),
              km2: site.km2 || "-",
              hintaero:
                hintaeroValue !== null
                  ? formatLandUseNumericValue(hintaeroValue)
                  : "-",
              sopimussakko: formatLandUseNumericValueWithUnit(
                sopimussakkoValue,
                "€/kem²",
              ),
              kerroin: kerroinPercent !== null ? `${kerroinPercent} %` : "-",
              vakuustarve:
                remainingVakuustarveValue !== null &&
                totalVakuustarveValue !== null ? (
                  <span>
                    {formatLandUseEuroValue(remainingVakuustarveValue)}
                    <br />/ {formatLandUseEuroValue(totalVakuustarveValue)}
                  </span>
                ) : (
                  "-"
                ),
              vakuudet:
                selectedGuaranteesForSite.length > 0 ? (
                  <ul className="landuse-detail__monitoring-dialog-items">
                    {selectedGuaranteesForSite.map((item, itemIndex) => (
                      <li key={`${site.id}-${item.guaranteeId}-${itemIndex}`}>
                        <span>
                          {itemIndex + 1}. {item.sopimusnumero} /{" "}
                          {item.jarjestysnumero}
                        </span>
                        <span>
                          {formatLandUseEuroDisplayValue(item.kaytettavaMaara)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "-"
                ),
            };
          },
        );

        const collateralsVakuuslaskuriCols = [
          { key: "kohteenTunnus", headerName: "Kohteen tunnus" },
          { key: "hallintamuoto", headerName: "Hallintamuoto" },
          { key: "km2", headerName: "k-m²" },
          { key: "hintaero", headerName: "Hintaero" },
          { key: "sopimussakko", headerName: "Sopimussakko" },
          { key: "kerroin", headerName: "Kerroin" },
          { key: "vakuustarve", headerName: "Vakuustarve" },
          { key: "vakuudet", headerName: "Vakuudet" },
          { key: "toiminnot", headerName: "Toiminnot" },
        ];

        const collateralsVakuuslaskuriTableRows = vakuuslaskuriRows.map(
          (row, index) => ({
            id: `vakuuslaskuri-row-${row.kohteenTunnus}-${index}`,
            kohteenTunnus: row.kohteenTunnus,
            hallintamuoto: row.hallintamuoto || "-",
            km2: row.km2 || "-",
            hintaero: row.hintaero,
            sopimussakko: row.sopimussakko,
            kerroin: row.kerroin,
            vakuustarve: row.vakuustarve,
            vakuudet: row.vakuudet,
            toiminnot: (
              <div className="landuse-detail__monitoring-actions-cell">
                <Button
                  type="button"
                  variant={ButtonVariant.Supplementary}
                  iconStart={<IconPen />}
                  disabled={!isEditMode}
                  onClick={() => {
                    setSelectedSiteId(sites[index]?.id ?? null);
                    setSelectedGuaranteeId("");
                    setKaytettavaMaara("");
                  }}
                >
                  Kohdista vakuuksia
                </Button>
              </div>
            ),
          }),
        );

        const sopimuksenMukainenValue = maankayttokorvausYhteensa ?? 0;

        const saantelynMukainenValue = calculateSaantelynMukainenOriginalValue(
          sites,
          compensationsRowsBySiteId,
          perushinta,
          vertailunPeruskerroin,
        );

        const totalCollateralSeparatorDirection =
          sopimuksenMukainenValue > saantelynMukainenValue
            ? "left"
            : saantelynMukainenValue > sopimuksenMukainenValue
              ? "right"
              : "equal";

        const collateralsInfoCols = [
          { key: "sopimussakko", headerName: "Sopimussakko" },
          { key: "vakuustarvekerroin", headerName: "Vakuustarvekerroin" },
        ];

        const collateralsInfoRows = [
          {
            id: "info-1",
            sopimussakko: "0 € / k-m² - 500 € / k-m²",
            vakuustarvekerroin: "100 %",
          },
          {
            id: "info-2",
            sopimussakko: "501 € / k-m² - 1000 € / k-m²",
            vakuustarvekerroin: "80 %",
          },
          {
            id: "info-3",
            sopimussakko: "1001 € / k-m² - 1500 € / k-m²",
            vakuustarvekerroin: "70 %",
          },
          {
            id: "info-4",
            sopimussakko: "1501 € / k-m² -",
            vakuustarvekerroin: "60 %",
          },
        ];

        return (
          <>
            <form onSubmit={handleSubmit}>
              <div className="landuse-detail__content">
                <Field name="vakuusValinnatBySiteId">{() => null}</Field>

                <h2 className="landuse-detail__section-title">VAKUUSTARVE</h2>

                <Fieldset
                  heading="Vakuuslaskuri"
                  className="landuse-detail__fieldset--with-margin"
                >
                  <Field name="vertailunPeruskerroin">
                    {({ input }) => (
                      <div className="landuse-detail__collaterals-base-coefficient-field">
                        <NumberInput
                          id="collaterals-vertailun-peruskerroin"
                          label="Vertailun peruskerroin"
                          min={1}
                          max={2}
                          step={0.05}
                          value={input.value}
                          onChange={input.onChange}
                          disabled={!isEditMode}
                        />
                      </div>
                    )}
                  </Field>

                  <div className="landuse-detail__sites-table-wrapper">
                    <Table
                      className="landuse-detail__sites-table landuse-detail__monitoring-table"
                      cols={collateralsVakuuslaskuriCols}
                      indexKey="id"
                      renderIndexCol={false}
                      rows={collateralsVakuuslaskuriTableRows}
                      variant="light"
                    />
                  </div>
                </Fieldset>

                <Fieldset
                  heading="Kokonaisvakuustarve"
                  className="landuse-detail__fieldset--with-margin"
                >
                  <div className="landuse-detail__grid landuse-detail__monitoring-collateral-grid">
                    <div
                      className={`landuse-detail__monitoring-collateral-field${
                        totalCollateralSeparatorDirection === "left"
                          ? " landuse-detail__monitoring-collateral-field--highlight"
                          : ""
                      }`}
                    >
                      <NumberInput
                        id="collaterals-sopimuksen-mukainen"
                        label="Sopimuksen mukainen"
                        value={sopimuksenMukainenValue}
                        unit="€"
                        disabled
                      />
                    </div>

                    <span
                      className={`landuse-detail__monitoring-collateral-separator landuse-detail__monitoring-collateral-separator--${totalCollateralSeparatorDirection}`}
                      aria-hidden="true"
                    >
                      {totalCollateralSeparatorDirection === "right" ? (
                        <IconAngleLeft />
                      ) : (
                        <IconAngleRight />
                      )}
                    </span>

                    <div
                      className={`landuse-detail__monitoring-collateral-field${
                        totalCollateralSeparatorDirection === "right"
                          ? " landuse-detail__monitoring-collateral-field--highlight"
                          : ""
                      }`}
                    >
                      <NumberInput
                        id="collaterals-saantelyn-mukainen"
                        label="Sääntelyn mukainen"
                        value={saantelynMukainenValue}
                        unit="€"
                        disabled
                      />
                    </div>
                  </div>
                  <Notification
                    type="info"
                    position="inline"
                    label="Vakuustarvekertoimen määräytyminen"
                  >
                    <div className="landuse-detail__monitoring-info-layout">
                      <p>
                        Korotettu vakuustarve määräytyy sopimussakon mukaisesti
                        alla olevien rajojen mukaan.
                      </p>
                      <Table
                        className="landuse-detail__sites-table landuse-detail__monitoring-info-table"
                        cols={collateralsInfoCols}
                        indexKey="id"
                        renderIndexCol={false}
                        rows={collateralsInfoRows}
                        variant="light"
                      />
                    </div>
                  </Notification>
                </Fieldset>
              </div>
            </form>

            <Dialog
              id="landuse-collaterals-vakuus-dialog"
              isOpen={Boolean(selectedSiteId)}
              aria-labelledby="landuse-collaterals-vakuus-dialog-title"
              closeButtonLabelText="Sulje"
              close={closeGuaranteeDialog}
            >
              <Dialog.Header
                id="landuse-collaterals-vakuus-dialog-title"
                title="Valitse vakuus"
              />
              <Dialog.Content>
                <div className="landuse-detail__monitoring-dialog-content">
                  <p className="landuse-detail__monitoring-dialog-site-label">
                    Kohteen tunnus
                  </p>
                  <p className="landuse-detail__monitoring-dialog-site-value">
                    {selectedSite?.kohteenTunnus ?? "-"}
                  </p>

                  <Select
                    id="landuse-collaterals-vakuus-select"
                    options={guaranteeOptions}
                    value={
                      selectedGuaranteeId
                        ? guaranteeOptions.filter(
                            (option) => option.value === selectedGuaranteeId,
                          )
                        : []
                    }
                    onChange={(selectedOptions) => {
                      const selectedValue = selectedOptions[0]?.value ?? "";
                      setSelectedGuaranteeId(selectedValue);
                    }}
                    disabled={!isEditMode}
                    texts={{
                      label: "Vakuus",
                      placeholder: "Valitse vakuus",
                    }}
                  />

                  <TextInput
                    id="landuse-collaterals-vakuus-jaljella"
                    label="Vakuutta jäljellä"
                    value={
                      selectedGuarantee
                        ? formatLandUseEuroValue(
                            selectedGuarantee.jaljellaMaara,
                          )
                        : "-"
                    }
                    disabled
                  />

                  <TextInput
                    id="landuse-collaterals-vakuus-kaytettava-maara"
                    label="Käytettävä määrä"
                    value={kaytettavaMaara}
                    onChange={(event) => setKaytettavaMaara(event.target.value)}
                    disabled={!isEditMode || !selectedGuaranteeId}
                    invalid={isKaytettavaMaaraOverRemaining}
                    errorText={
                      isKaytettavaMaaraOverRemaining
                        ? "Määrä ei voi ylittää vakuutta jäljellä"
                        : undefined
                    }
                  />

                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    iconStart={<IconPlusCircleFill />}
                    disabled={
                      !isEditMode ||
                      !selectedSiteId ||
                      !selectedGuarantee ||
                      !kaytettavaMaara.trim() ||
                      isKaytettavaMaaraInvalidForSubmit
                    }
                    onClick={() => {
                      if (
                        !selectedSiteId ||
                        !selectedGuarantee ||
                        !kaytettavaMaara.trim() ||
                        isKaytettavaMaaraInvalidForSubmit
                      ) {
                        return;
                      }

                      const previousSelections =
                        values.vakuusValinnatBySiteId?.[selectedSiteId] ?? [];
                      const nextSelections = [
                        ...previousSelections,
                        {
                          guaranteeId: selectedGuarantee.id,
                          sopimusnumero: selectedGuarantee.sopimusnumero,
                          jarjestysnumero: selectedGuarantee.jarjestysnumero,
                          kaytettavaMaara: kaytettavaMaara.trim(),
                        },
                      ];

                      form.change("vakuusValinnatBySiteId", {
                        ...(values.vakuusValinnatBySiteId ?? {}),
                        [selectedSiteId]: nextSelections,
                      });

                      setSelectedGuaranteeId("");
                      setKaytettavaMaara("");
                    }}
                  >
                    Lisää vakuus
                  </Button>

                  <div className="landuse-detail__monitoring-dialog-list">
                    <p className="landuse-detail__monitoring-dialog-site-label">
                      Valitut vakuudet
                    </p>
                    <p className="landuse-detail__collaterals-drag-hint">
                      Vedä rivejä kahvasta järjestääksesi vakuudet.
                    </p>
                    {selectedSiteGuarantees.length === 0 ? (
                      <p className="landuse-detail__monitoring-dialog-empty">
                        Ei lisättyjä vakuuksia.
                      </p>
                    ) : (
                      <ul className="landuse-detail__monitoring-dialog-items">
                        {selectedSiteGuarantees.map((item, index) => (
                          <li
                            key={`${item.guaranteeId}-${index}`}
                            draggable={isEditMode}
                            className={`landuse-detail__collaterals-draggable-item${
                              draggedIndex === index
                                ? " landuse-detail__collaterals-draggable-item--dragging"
                                : ""
                            }`}
                            onDragStart={(event) => {
                              setDraggedIndex(index);
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData(
                                "text/plain",
                                String(index),
                              );
                            }}
                            onDragEnd={() => {
                              setDraggedIndex(null);
                            }}
                            onDragOver={(event) => {
                              event.preventDefault();
                              event.dataTransfer.dropEffect = "move";
                            }}
                            onDrop={() => {
                              if (
                                !selectedSiteId ||
                                draggedIndex === null ||
                                draggedIndex === index
                              ) {
                                setDraggedIndex(null);
                                return;
                              }

                              const reordered = [...selectedSiteGuarantees];
                              const [draggedItem] = reordered.splice(
                                draggedIndex,
                                1,
                              );
                              reordered.splice(index, 0, draggedItem);

                              form.change("vakuusValinnatBySiteId", {
                                ...(values.vakuusValinnatBySiteId ?? {}),
                                [selectedSiteId]: reordered,
                              });
                              setDraggedIndex(null);
                            }}
                          >
                            <span>
                              <span
                                className="landuse-detail__collaterals-drag-handle"
                                aria-label="Vedä järjestääksesi"
                                title="Vedä järjestääksesi"
                              >
                                ⠿
                              </span>{" "}
                              {index + 1}. {item.sopimusnumero} /{" "}
                              {item.jarjestysnumero}
                            </span>
                            <span>
                              Käytettävä määrä:{" "}
                              {formatLandUseEuroDisplayValue(
                                item.kaytettavaMaara,
                              )}
                              <Button
                                type="button"
                                variant={ButtonVariant.Supplementary}
                                iconStart={<IconTrash />}
                                disabled={!isEditMode}
                                aria-label="Poista valittu vakuus"
                                onClick={() => {
                                  if (!selectedSiteId) {
                                    return;
                                  }

                                  form.change("vakuusValinnatBySiteId", {
                                    ...(values.vakuusValinnatBySiteId ?? {}),
                                    [selectedSiteId]:
                                      selectedSiteGuarantees.filter(
                                        (_, itemIndex) => itemIndex !== index,
                                      ),
                                  });
                                }}
                              >
                                Poista
                              </Button>
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
                  onClick={closeGuaranteeDialog}
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
