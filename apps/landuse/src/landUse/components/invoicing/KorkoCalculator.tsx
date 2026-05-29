import React, { useState, useCallback } from "react";
import {
  TextInput,
  NumberInput,
  DateInput,
  Select,
  Button,
  ButtonVariant,
  ButtonSize,
  IconCopy,
  IconTrash,
  Table,
} from "hds-react";
import {
  formatLandUseEuroDisplayValue,
  formatLandUseNumericValueWithUnit,
} from "@/landUse/utils/number";
import { copyNumberToClipboard } from "@/landUse/utils/fieldUtils";

export interface KorkoResult {
  id: number;
  maara: number;
  korkoPercentage: number;
  dueDate: string;
  paymentDate: string;
  korkoPeriodLengthDays: number;
  daysInYear: number;
  korkoValue: number;
}

interface KorkoCalculatorProps {
  korkoResults: KorkoResult[];
  setKorkoResults: React.Dispatch<React.SetStateAction<KorkoResult[]>>;
}

/**
 * Calculates the interest based on the interest percentage and the number of days from due date to payment date.
 * https://pankkiasiat.fi/englantilainen-vuosikorko
 */
export const KorkoCalculator: React.FC<KorkoCalculatorProps> = ({
  korkoResults,
  setKorkoResults,
}) => {
  const [maara, setMaara] = useState<number>(0);
  const [peruskorko, setPeruskorko] = useState<number>(2.25);
  const [marginaali, setMarginaali] = useState<number>(0.5);
  const [dueDate, setDueDate] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [daysInYear, setDaysInYear] = useState<number>(365);

  const korkoPercentage = peruskorko + marginaali;

  /**
   * Parse HDS DateInput string (DD.MM.YYYY) to ISO format (YYYY-MM-DD).
   */
  const parseFinnishDateStringToISO = (dateStr: string): string | null => {
    const [day, month, year] = dateStr.split(".");
    const dayPadded = day.padStart(2, "0");
    const monthPadded = month.padStart(2, "0");
    return `${year}-${monthPadded}-${dayPadded}`;
  };

  /**
   * @param startDateStr - Start date in DD.MM.YYYY format
   * @param endDateStr - End date in DD.MM.YYYY format
   * @returns Number of days between dates (inclusive), or 0 if invalid
   *
   * @requires Temporal
   */
  const calculateInvoicingPeriodDays = (
    startDateStr: string,
    endDateStr: string,
  ): number => {
    if (!startDateStr.trim() || !endDateStr.trim()) {
      return 0;
    }
    const startISO = parseFinnishDateStringToISO(startDateStr);
    const endISO = parseFinnishDateStringToISO(endDateStr);

    if (!startISO || !endISO) {
      console.error("Invalid date format. Expected DD.MM.YYYY", {
        start: startDateStr,
        end: endDateStr,
      });
      return 0;
    }

    const startDate = Temporal.PlainDate.from(startISO);
    const endDate = Temporal.PlainDate.from(endISO);

    const duration = startDate.until(endDate, { largestUnit: "day" });
    const durationInDaysExclusive = duration.days;

    return durationInDaysExclusive;
  };

  const korkoPeriodLengthDays = calculateInvoicingPeriodDays(
    dueDate,
    paymentDate,
  );

  const korkoValue =
    (maara * (korkoPercentage / 100) * korkoPeriodLengthDays) / daysInYear;

  const handleSaveResult = () => {
    const nextId =
      korkoResults.length > 0
        ? Math.max(...korkoResults.map((r) => r.id)) + 1
        : 1;
    setKorkoResults((prev) => [
      ...prev,
      {
        id: nextId,
        maara,
        korkoPercentage,
        dueDate,
        paymentDate,
        korkoPeriodLengthDays,
        daysInYear,
        korkoValue,
      },
    ]);
  };

  const handleRemoveResult = useCallback(
    (id: number) => {
      setKorkoResults((prev) => prev.filter((r) => r.id !== id));
    },
    [setKorkoResults],
  );

  const resultTableCols = React.useMemo(
    () => [
      {
        key: "id",
        headerName: "Rivi",
        transform: (row: KorkoResult) => `${row.id}.`,
      },
      {
        key: "maara",
        headerName: "Määrä",
        transform: (row: KorkoResult) =>
          formatLandUseEuroDisplayValue(row.maara),
      },
      {
        key: "korkoPercentage",
        headerName: "Korkoprosentti",
        transform: (row: KorkoResult) =>
          formatLandUseNumericValueWithUnit(row.korkoPercentage, "%"),
      },
      {
        key: "dueDate",
        headerName: "Alku",
        transform: (row: KorkoResult) => row.dueDate || "-",
      },
      {
        key: "paymentDate",
        headerName: "Loppu",
        transform: (row: KorkoResult) => row.paymentDate || "-",
      },
      {
        key: "korkoPeriodLengthDays",
        headerName: "Päiviä",
        transform: (row: KorkoResult) =>
          formatLandUseNumericValueWithUnit(
            row.korkoPeriodLengthDays,
            "päivää",
          ),
      },
      { key: "daysInYear", headerName: "Päiviä/vuosi" },
      {
        key: "korkoValue",
        headerName: "Korko",
        transform: (row: KorkoResult) =>
          formatLandUseEuroDisplayValue(row.korkoValue),
      },
      {
        key: "copyAction",
        headerName: "",
        transform: (row: KorkoResult) => (
          <Button
            variant={ButtonVariant.Supplementary}
            size={ButtonSize.Small}
            iconStart={<IconCopy />}
            onClick={() => copyNumberToClipboard(row.korkoValue)}
          >
            Kopioi korko leikepöydälle
          </Button>
        ),
      },
      {
        key: "removeAction",
        headerName: "",
        transform: (row: KorkoResult) => (
          <Button
            variant={ButtonVariant.Supplementary}
            size={ButtonSize.Small}
            iconStart={<IconTrash />}
            onClick={() => handleRemoveResult(row.id)}
            aria-label="Poista tulos"
          >
            Poista
          </Button>
        ),
      },
    ],
    [handleRemoveResult],
  );

  return (
    <>
      {/* Korko percentage calculation */}
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-2">
          <NumberInput
            id="landuse-invoicing-korko-calculator-peruskorko"
            label="Peruskorko %"
            defaultValue={peruskorko}
            onChange={(e) => setPeruskorko(Number(e.target.value))}
          />
        </div>
        <div className="landuse-grid__column-2">
          <NumberInput
            id="landuse-invoicing-korko-calculator-marginaali"
            label="Marginaali %"
            defaultValue={marginaali}
            onChange={(e) => setMarginaali(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Korko period length calculation */}
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-2">
          <DateInput
            id="landuse-invoicing-korko-calculator-interest-start-date"
            label="Korotuksen alkupäivä"
            value={dueDate}
            onChange={(value) => setDueDate(value)}
            placeholder="DD.MM.YYYY"
            language="fi"
          />
        </div>
        <div className="landuse-grid__column-2">
          <DateInput
            id="landuse-invoicing-korko-calculator-interest-end-date"
            label="Korotuksen loppupäivä"
            value={paymentDate}
            onChange={(value) => setPaymentDate(value)}
            placeholder="DD.MM.YYYY"
            language="fi"
          />
        </div>
      </div>

      {/* Korko value calculation */}
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-2">
          <NumberInput
            id="landuse-invoicing-korko-calculator-maara"
            label="Määrä (€)"
            onChange={(e) => setMaara(Number(e.target.value))}
            defaultValue={maara}
          />
        </div>
        <div className="landuse-grid__column-2">
          <TextInput
            id="landuse-invoicing-korko-calculator-korko-percentage"
            label="Korkoprosentti"
            value={formatLandUseNumericValueWithUnit(korkoPercentage, "%")}
            readOnly
          />
        </div>
        <div className="landuse-grid__column-2">
          <TextInput
            id="landuse-invoicing-korko-calculator-interest-period-length"
            label="Korkojakson pituus"
            value={formatLandUseNumericValueWithUnit(
              korkoPeriodLengthDays,
              "päivää",
            )}
            readOnly
          />
        </div>
        <div className="landuse-grid__column-2">
          <Select
            id="landuse-invoicing-korko-calculator-days-in-year"
            options={[
              { label: "365", value: "365" },
              { label: "366", value: "366" },
            ]}
            value={daysInYear.toString()}
            onChange={(selectedOptions) => {
              const selected =
                selectedOptions.length > 0
                  ? selectedOptions[0]
                  : { value: "365" };
              setDaysInYear(Number(selected.value));
            }}
            texts={{
              label: "Päiviä vuodessa",
              placeholder: "Valitse",
            }}
          />
        </div>
        <div className="landuse-grid__column-2">
          <TextInput
            id="landuse-invoicing-korko-calculator-korko"
            label="Korko"
            value={formatLandUseEuroDisplayValue(korkoValue)}
            readOnly
          />
        </div>
        <div className="landuse-grid__column-2">
          <Button variant={ButtonVariant.Primary} onClick={handleSaveResult}>
            Laita muistiin
          </Button>
        </div>
      </div>

      {korkoResults.length > 0 && (
        <Table
          cols={resultTableCols}
          rows={korkoResults}
          indexKey="id"
          renderIndexCol={true}
          variant="light"
        />
      )}
    </>
  );
};
