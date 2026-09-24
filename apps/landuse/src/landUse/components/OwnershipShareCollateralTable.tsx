import { Notification, Table } from "hds-react";
import React from "react";
import type { PartyEntry } from "@/landUse/components/tabs/LandUseParties";
import {
  formatLandUseDecimalValue,
  formatLandUseEuroValue,
} from "@/landUse/utils/number";

interface OwnershipShareRow {
  id: string;
  name: string;
  numerator: number | string;
  denominator: number | string;
  share: number | null;
  percentage: string;
  vakuustarve: string;
}

interface OwnershipShareCollateralTableProps {
  parties: PartyEntry[];
  totalCollateral: number;
}

const parseOwnershipShare = (
  numerator: string | number | undefined,
  denominator: string | number | undefined,
): number | null => {
  const parsedNumerator = Number(numerator);
  const parsedDenominator = Number(denominator);

  if (
    !Number.isFinite(parsedNumerator) ||
    !Number.isFinite(parsedDenominator) ||
    parsedDenominator <= 0
  ) {
    return null;
  }

  return parsedNumerator / parsedDenominator;
};

const getOwnershipShareRows = (
  parties: PartyEntry[],
  totalCollateral: number,
): OwnershipShareRow[] =>
  parties
    .filter((party) => party.party.details.partyRole === "maanomistaja")
    .map((party, index) => {
      const numerator = party.party.details.ownershipShare?.numerator;
      const denominator = party.party.details.ownershipShare?.denominator;
      const share = parseOwnershipShare(numerator, denominator);

      return {
        id: `ownership-share-${index}`,
        name: party.party.details.name || "-",
        numerator: numerator ?? "-",
        denominator: denominator ?? "-",
        share,
        percentage:
          share !== null ? `${formatLandUseDecimalValue(share * 100)} %` : "-",
        vakuustarve:
          share !== null
            ? formatLandUseEuroValue(totalCollateral * share)
            : "-",
      };
    });

const getOwnershipShareTotalRow = (
  rows: OwnershipShareRow[],
  totalCollateral: number,
): OwnershipShareRow => {
  const denominators = rows.map((row) => row.denominator);
  const commonDenominator = denominators[0];
  const totalShare = rows.reduce((sum, row) => sum + (row.share ?? 0), 0);

  return {
    id: "ownership-share-total",
    name: "Yhteensä",
    numerator: rows.reduce((sum, row) => sum + (Number(row.numerator) || 0), 0),
    denominator:
      rows.length > 0 &&
      denominators.every(
        (denominator) => Number(denominator) === Number(commonDenominator),
      )
        ? commonDenominator
        : "?",
    share: totalShare,
    percentage: `${formatLandUseDecimalValue(totalShare * 100)} %`,
    vakuustarve: formatLandUseEuroValue(totalCollateral * totalShare),
  };
};

const ownershipSharesSumToOne = (rows: OwnershipShareRow[]): boolean =>
  rows.length > 0 &&
  rows.every((row) => row.share !== null) &&
  Math.abs(rows.reduce((sum, row) => sum + (row.share ?? 0), 0) - 1) < 1e-10;

const ownershipShareColumns = [
  { key: "name", headerName: "Osapuoli" },
  { key: "numerator", headerName: "Osoittaja" },
  { key: "denominator", headerName: "Nimittäjä" },
  { key: "percentage", headerName: "Prosenttiosuus" },
  { key: "vakuustarve", headerName: "Vakuustarve" },
];

export const OwnershipShareCollateralTable: React.FC<
  OwnershipShareCollateralTableProps
> = ({ parties, totalCollateral }) => {
  const ownershipShareRows = getOwnershipShareRows(parties, totalCollateral);
  const tableRows = [
    ...ownershipShareRows,
    getOwnershipShareTotalRow(ownershipShareRows, totalCollateral),
  ];

  return (
    <>
      <div className="landuse-detail__table-wrapper">
        <Table
          className="landuse-detail__table landuse-detail__ownership-share-table"
          cols={ownershipShareColumns}
          indexKey="id"
          renderIndexCol={false}
          rows={tableRows}
          variant="light"
          caption={
            <span>
              <strong>Osapuolten vakuustarpeet</strong>
            </span>
          }
        />
      </div>
      {!ownershipSharesSumToOne(ownershipShareRows) && (
        <Notification type="error" label="Omistusosuudet eivät täsmää">
          Maanomistajien omistusosuuksien summan tulee olla 100 %.
        </Notification>
      )}
    </>
  );
};
