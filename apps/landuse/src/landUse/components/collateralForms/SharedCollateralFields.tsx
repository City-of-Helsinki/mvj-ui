import React from "react";
import { landUseGuaranteeVierasvelkapanttausOptions } from "../../options";
import {
  CollateralDateField,
  CollateralEuroField,
  CollateralRadioField,
  CollateralTextArea,
} from "./fields";
import type { CollateralFormProps } from "./types";

/**
 * Fields shared across all collateral form types.
 * Renders grid columns that are meant to be composed inside a parent grid
 * container (e.g. `landuse-grid landuse-grid__bottom-margin`).
 */
export const SharedCollateralFields: React.FC<CollateralFormProps> = ({
  namePrefix,
  isEditMode,
}) => (
  <>
    <div className="landuse-grid__column-3">
      <CollateralRadioField
        namePrefix={namePrefix}
        fieldName="vierasvelkapanttaus"
        label="Vierasvelkapanttaus"
        idSuffix="vierasvelkapanttaus"
        isEditMode={isEditMode}
        options={landUseGuaranteeVierasvelkapanttausOptions}
      />
    </div>

    <div className="landuse-grid__column-3">
      <CollateralDateField
        namePrefix={namePrefix}
        fieldName="alkupvm"
        label="Alkupäivämäärä"
        idSuffix="alkupvm"
        isEditMode={isEditMode}
      />
    </div>

    <div className="landuse-grid__column-3">
      <CollateralDateField
        namePrefix={namePrefix}
        fieldName="loppupvm"
        label="Päättymispäivämäärä"
        idSuffix="loppupvm"
        isEditMode={isEditMode}
      />
    </div>

    <div className="landuse-grid__column-3">
      <CollateralEuroField
        namePrefix={namePrefix}
        fieldName="maara"
        label="Määrä (euroa)"
        idSuffix="maara"
        isEditMode={isEditMode}
      />
    </div>

    <div className="landuse-grid__column-3">
      <CollateralDateField
        namePrefix={namePrefix}
        fieldName="palautettuPvm"
        label="Palautettu päivämäärällä"
        idSuffix="palautettu-pvm"
        isEditMode={isEditMode}
      />
    </div>

    <div className="landuse-grid__column-9">
      <CollateralTextArea
        namePrefix={namePrefix}
        fieldName="lisatiedot"
        label="Lisätiedot"
        idSuffix="lisatiedot"
        isEditMode={isEditMode}
      />
    </div>
  </>
);
