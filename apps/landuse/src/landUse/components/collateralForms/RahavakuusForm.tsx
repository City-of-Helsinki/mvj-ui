import React from "react";
import {
  CollateralDateField,
  CollateralTextField,
} from "@/landUse/components/collateralForms/fields";
import { SharedCollateralFields } from "@/landUse/components/collateralForms/SharedCollateralFields";
import type { CollateralFormProps } from "@/landUse/components/collateralForms/types";

export const RahavakuusForm: React.FC<CollateralFormProps> = ({
  namePrefix,
  isEditMode,
  partyOptions,
}) => (
  <>
    <div className="landuse-grid landuse-grid__bottom-margin">
      <div className="landuse-grid__column-6">
        <CollateralTextField
          namePrefix={namePrefix}
          fieldName="antajanNimi"
          label="Vakuuden antajan nimi"
          idSuffix="antajan-nimi"
          isEditMode={isEditMode}
        />
      </div>

      <div className="landuse-grid__column-6">
        <CollateralTextField
          namePrefix={namePrefix}
          fieldName="antajanYTunnus"
          label="Vakuuden antajan Y-tunnus"
          idSuffix="antajan-y-tunnus"
          isEditMode={isEditMode}
        />
      </div>

      <div className="landuse-grid__column-6">
        <CollateralTextField
          namePrefix={namePrefix}
          fieldName="antajanHenkilotunnus"
          label="Vakuuden antajan henkilötunnus"
          idSuffix="antajan-henkilotunnus"
          isEditMode={isEditMode}
        />
      </div>

      <div className="landuse-grid__column-6">
        <CollateralTextField
          namePrefix={namePrefix}
          fieldName="tilinumero"
          label="Tilinumero"
          idSuffix="tilinumero"
          isEditMode={isEditMode}
        />
      </div>

      <div className="landuse-grid__column-6">
        <CollateralDateField
          namePrefix={namePrefix}
          fieldName="maksettuPvm"
          label="Maksettu päivämäärällä"
          idSuffix="maksettu-pvm"
          isEditMode={isEditMode}
        />
      </div>
    </div>

    <div className="landuse-grid">
      <SharedCollateralFields
        namePrefix={namePrefix}
        isEditMode={isEditMode}
        partyOptions={partyOptions}
      />
    </div>
  </>
);
