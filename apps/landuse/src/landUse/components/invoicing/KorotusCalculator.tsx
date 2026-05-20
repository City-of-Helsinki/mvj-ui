import React from "react";
import { formatLandUseEuroDisplayValue } from "@/landUse/utils/number";
import { copyNumberToClipboard } from "@/landUse/utils/fieldUtils";
import {
  TextInput,
  NumberInput,
  Button,
  ButtonVariant,
  IconCopy,
} from "hds-react";

const calculateKorotusYhteensa = (
  maara: number,
  korotusprosentti: number,
): number => {
  return maara * (korotusprosentti / 100);
};

/**
 * Calculates the landuse increase based on the increase percentage.
 */
export const KorotusCalculator: React.FC<{}> = () => {
  const [maara, setMaara] = React.useState<number>(0);
  const [korotusprosentti, setKorotusprosentti] = React.useState<number>(0);

  const korotusValue = calculateKorotusYhteensa(maara, korotusprosentti);

  return (
    <div className="landuse-grid">
      <div className="landuse-grid__column-2">
        <NumberInput
          id="landuse-invoicing-korotus-calculator-maara"
          label="Määrä (€)"
          onChange={(e) => setMaara(Number(e.target.value))}
          defaultValue={maara}
        />
      </div>
      <div className="landuse-grid__column-2">
        <NumberInput
          id="landuse-invoicing-korotus-calculator-korotusprosentti"
          defaultValue={korotusprosentti}
          label="Korotusprosentti %"
          onChange={(e) => setKorotusprosentti(Number(e.target.value))}
        />
      </div>

      <div className="landuse-grid__column-2">
        <TextInput
          id="landuse-invoicing-korotus-calculator-korotus"
          label="Korotus"
          value={formatLandUseEuroDisplayValue(korotusValue)}
          readOnly
        />
      </div>
      <div className="landuse-grid__column-2">
        <Button
          variant={ButtonVariant.Supplementary}
          iconStart={<IconCopy />}
          onClick={() => copyNumberToClipboard(korotusValue)}
        >
          Kopioi korotus leikepöydälle
        </Button>
      </div>
    </div>
  );
};
