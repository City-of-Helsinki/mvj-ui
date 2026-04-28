import React from "react";
import { landUseGuaranteeCategoryOptions } from "../../options";
import { CollateralSelectField, CollateralTextField } from "./fields";
import { SharedCollateralFields } from "./SharedCollateralFields";
import type { CollateralFormProps } from "./types";

export const MuuVakuusForm: React.FC<CollateralFormProps> = ({
  namePrefix,
  isEditMode,
}) => (
  <>
    <div className="landuse-grid landuse-grid__bottom-margin">
      <div className="landuse-grid__column-3">
        <CollateralSelectField
          namePrefix={namePrefix}
          fieldName="vakuusasiakirjanLaji"
          label="Vakuusasiakirjan laji"
          idSuffix="vakuusasiakirjan-laji"
          isEditMode={isEditMode}
          options={landUseGuaranteeCategoryOptions}
        />
      </div>

      <div className="landuse-grid__column-3">
        <CollateralTextField
          namePrefix={namePrefix}
          fieldName="antajanNimi"
          label="Vakuuden antajan nimi"
          idSuffix="antajan-nimi"
          isEditMode={isEditMode}
        />
      </div>

      <div className="landuse-grid__column-3">
        <CollateralTextField
          namePrefix={namePrefix}
          fieldName="antajanYTunnus"
          label="Vakuuden antajan Y-tunnus"
          idSuffix="antajan-y-tunnus"
          isEditMode={isEditMode}
        />
      </div>

      <div className="landuse-grid__column-3">
        <CollateralTextField
          namePrefix={namePrefix}
          fieldName="antajanHenkilotunnus"
          label="Vakuuden antajan henkilötunnus"
          idSuffix="antajan-henkilotunnus"
          isEditMode={isEditMode}
        />
      </div>
    </div>

    <div className="landuse-grid">
      <SharedCollateralFields namePrefix={namePrefix} isEditMode={isEditMode} />
    </div>
  </>
);
