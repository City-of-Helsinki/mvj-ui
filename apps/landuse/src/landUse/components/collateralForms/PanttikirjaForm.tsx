import React from "react";
import { Button, ButtonVariant, IconPlusCircleFill } from "hds-react";
import { Field, useField } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import {
  landUseGuaranteeCategoryOptions,
  landUseGuaranteeTargetOptions,
} from "../../options";
import {
  CollateralDateField,
  CollateralRadioField,
  CollateralSelectField,
  CollateralTextField,
} from "./fields";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import { SharedCollateralFields } from "./SharedCollateralFields";
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
    <>
      <div className="landuse-grid landuse-grid__bottom-margin">
        <div className="landuse-grid__column-12">
          <CollateralRadioField
            namePrefix={namePrefix}
            fieldName="kiinteistoVaiLaitos"
            label="Kiinteistö vai laitos?"
            idSuffix="kiinteisto-vai-laitos"
            isEditMode={isEditMode}
            options={landUseGuaranteeTargetOptions}
          />
        </div>
      </div>

      <div className="landuse-grid landuse-grid__bottom-margin">
        {target === "Kiinteistö" && (
          // <div className="landuse-grid__column-3">
          <FieldArray<string> name={`${namePrefix}.kiinteistotunnukset`}>
            {({ fields }) => (
              <>
                {fields.map((fieldName, index) => (
                  <React.Fragment key={fieldName}>
                    <div className="landuse-grid__column-3">
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
                    </div>
                    <div className="landuse-grid__column-9">
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
                  </React.Fragment>
                ))}
                {isEditMode && (
                  <div className="landuse-grid__column-12">
                    <Button
                      type="button"
                      variant={ButtonVariant.Supplementary}
                      iconStart={<IconPlusCircleFill />}
                      onClick={() => fields.push("")}
                    >
                      Lisää kiinteistötunnus
                    </Button>
                  </div>
                )}
              </>
            )}
          </FieldArray>
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
      </div>

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
      </div>

      <div className="landuse-grid">
        <SharedCollateralFields
          namePrefix={namePrefix}
          isEditMode={isEditMode}
        />
      </div>
    </>
  );
};
