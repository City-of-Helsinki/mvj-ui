import React from "react";
import { Button, ButtonVariant, IconPlusCircleFill } from "hds-react";
import { Field, useField } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  landUseGuaranteeCategoryOptions,
  landUseGuaranteeTargetOptions,
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
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { getFieldTextValue } from "../../utils/fieldUtils";
import { TextInput } from "hds-react";
import type { CollateralFormProps } from "./types";

/**
 * Panttikirja (kiinteistökiinnitys) form.
 * Uses a Kiinteistö/Laitos radio that toggles between a list of
 * kiinteistötunnukset and a single laitostunnus.
 */
export const PanttikirjaForm: React.FC<CollateralFormProps> = ({
  namePrefix,
  isEditMode,
}) => {
  const targetField = useField<string>(`${namePrefix}.kiinteistoVaiLaitos`, {
    subscription: { value: true },
  });
  const target = targetField.input.value;

  return (
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
          fieldName="kiinteistoVaiLaitos"
          label="Kiinteistö vai laitos?"
          idSuffix="kiinteisto-vai-laitos"
          isEditMode={isEditMode}
          options={landUseGuaranteeTargetOptions}
        />
      </div>

      {target === "Kiinteistö" && (
        <div className="landuse-grid__column-9">
          <FieldArray<string> name={`${namePrefix}.kiinteistotunnukset`}>
            {({ fields }) => (
              <>
                {(fields.length ?? 0) === 0 && isEditMode && (
                  <Button
                    type="button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={() => fields.push("")}
                  >
                    Lisää kiinteistötunnus
                  </Button>
                )}
                {fields.map((fieldName, index) => (
                  <div
                    key={fieldName}
                    className="landuse-detail__collateral-repeat-row"
                  >
                    <Field name={fieldName}>
                      {({ input }) => (
                        <TextInput
                          id={`${namePrefix.replace(/\./g, "-")}-kiinteistotunnus-${index}`}
                          label={
                            index === 0
                              ? "Kiinteistötunnus"
                              : `Kiinteistötunnus ${index + 1}`
                          }
                          value={getFieldTextValue(isEditMode, input.value)}
                          onChange={input.onChange}
                          readOnly={!isEditMode}
                        />
                      )}
                    </Field>
                    {isEditMode && (
                      <ConfirmDeleteButton
                        id={`${namePrefix.replace(/\./g, "-")}-kiinteistotunnus-delete-${index}`}
                        buttonLabel="Poista"
                        buttonVariant={ButtonVariant.Supplementary}
                        onConfirm={() => fields.remove(index)}
                        dialogTitle="Poista kiinteistötunnus"
                        dialogContent="Haluatko varmasti poistaa kiinteistötunnuksen?"
                      />
                    )}
                  </div>
                ))}
                {isEditMode && (fields.length ?? 0) > 0 && (
                  <Button
                    type="button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={() => fields.push("")}
                  >
                    Lisää kiinteistötunnus
                  </Button>
                )}
              </>
            )}
          </FieldArray>
        </div>
      )}

      {target === "Laitos" && (
        <div className="landuse-grid__column-3">
          <CollateralTextField
            namePrefix={namePrefix}
            fieldName="laitostunnus"
            label="Laitostunnus"
            idSuffix="laitostunnus"
            isEditMode={isEditMode}
          />
        </div>
      )}

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
          fieldName="panttikirjanNumero"
          label="Panttikirjan numero"
          idSuffix="panttikirjan-numero"
          isEditMode={isEditMode}
        />
      </div>

      <div className="landuse-grid__column-3">
        <CollateralDateField
          namePrefix={namePrefix}
          fieldName="panttikirjanPaivays"
          label="Panttikirjan päiväys"
          idSuffix="panttikirjan-paivays"
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
};
