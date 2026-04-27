import React from "react";
import {
  landUseGuaranteeCategoryOptions,
  landUseGuaranteeVierasvelkapanttausOptions,
} from "../../options";
import {
  CollateralDateField,
  CollateralEuroField,
  CollateralRadioField,
  CollateralSelectField,
  CollateralTextArea,
  CollateralTextField,
} from "./fields";
import type { CollateralFormProps } from "./types";

export const MuuVakuusForm: React.FC<CollateralFormProps> = ({
  namePrefix,
  isEditMode,
}) => (
  <div className="landuse-grid landuse-detail__decisions-grid">
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
  </div>
);
