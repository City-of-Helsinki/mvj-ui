import React from "react";
import { Select, TextInput } from "hds-react";
import { Field } from "react-final-form";
import { landUseGuaranteeVierasvelkapanttausOptions } from "../../options";
import {
  CollateralDateField,
  CollateralEuroField,
  CollateralRadioField,
  CollateralTextArea,
} from "./fields";
import {
  normalizeMultiSelectValue,
  type SelectOption,
} from "../../utils/fieldUtils";
import type { CollateralFormProps } from "./types";

const handleMultiSelectChange = (
  selectedOptions: SelectOption[],
  callback: (value: string[] | undefined) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions.map((o) => o.value));
  } else {
    callback(undefined);
  }
};

/**
 * Fields shared across all collateral form types.
 * Renders grid columns that are meant to be composed inside a parent grid
 * container (e.g. `landuse-grid landuse-grid__bottom-margin`).
 */
export const SharedCollateralFields: React.FC<CollateralFormProps> = ({
  namePrefix,
  isEditMode,
  partyOptions,
}) => (
  <>
    <div className="landuse-grid__column-3">
      <Field name={`${namePrefix}.osapuolet`}>
        {({ input }) =>
          isEditMode ? (
            <Select
              id={`${namePrefix.replace(/\./g, "-")}-osapuolet`}
              texts={{ label: "Osapuolet", placeholder: "Valitse" }}
              options={partyOptions}
              value={normalizeMultiSelectValue(input.value)}
              onChange={(selected) =>
                handleMultiSelectChange(selected, input.onChange)
              }
              multiSelect
              required
            />
          ) : (
            <TextInput
              id={`${namePrefix.replace(/\./g, "-")}-osapuolet`}
              label="Osapuolet"
              value={
                Array.isArray(input.value) && input.value.length > 0
                  ? input.value.join(", ")
                  : "-"
              }
              readOnly
            />
          )
        }
      </Field>
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

    <div className="landuse-grid__column-6">
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
