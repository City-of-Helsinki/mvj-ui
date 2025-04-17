import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { Column, Row } from "react-foundation";
import get from "lodash/get";
import { change, FieldArray, formValueSelector } from "redux-form";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import InfoIcon from "@/components/icons/InfoIcon";
import Tooltip from "@/components/tooltip/Tooltip";
import { FieldTypes, FormNames } from "@/enums";
import TooltipToggleButton from "@/components/tooltip/TooltipToggleButton";
import TooltipWrapper from "@/components/tooltip/TooltipWrapper";
import {
  getFieldTypeMapping,
  getFormAttributes,
} from "@/application/selectors";
import SubTitle from "@/components/content/SubTitle";
import { generateFieldIdentifierFromName } from "@/plotSearch/helpers";
import {
  FIELD_TYPE_FEATURES_BY_FIELD_TYPE_NAME,
  FieldTypeFeatures,
  FieldTypeLabels,
} from "@/plotSearch/constants";
import IconButton from "@/components/button/IconButton";
import TrashIcon from "@/components/icons/TrashIcon";
import AddIcon from "@/components/icons/AddIcon";
import EditIcon from "@/components/icons/EditIcon";
import MoveUpIcon from "@/components/icons/MoveUpIcon";
import MoveDownIcon from "@/components/icons/MoveDownIcon";
import type { Attributes } from "types";
type ChoiceProps = {
  attributes: Attributes;
  disabled: boolean;
  field: string;
  fields: any;
  change: (...args: Array<any>) => any;
  onChoiceValuesChanged: (...args: Array<any>) => any;
  onChoiceDeleted: (...args: Array<any>) => any;
  autoFillValues: boolean;
  protectedValues: Array<string>;
};

const EditPlotApplicationSectionFieldChoice = ({
  fields,
  attributes,
  disabled,
  change,
  onChoiceValuesChanged,
  autoFillValues,
  protectedValues,
}: ChoiceProps): JSX.Element => {
  const choiceRefs = useRef({});

  const getDataMapBase = (): Record<string, any> =>
    fields
      .getAll()
      .reduce((acc, item) => ({ ...acc, [item.value]: item.value }), {});

  useEffect(() => {
    if (autoFillValues) {
      const dataMap = getDataMapBase();
      fields.forEach((choiceField, choiceIndex) => {
        const autoValue = (choiceIndex + 1).toString();
        const currentValue = fields.get(choiceIndex).value;

        if (currentValue !== autoValue) {
          dataMap[currentValue] = autoValue;
          change(
            FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
            `${choiceField}.value`,
            autoValue,
          );
        }
      });
      onChoiceValuesChanged(dataMap);
    }
  }, [autoFillValues]);

  const setOtherChoicesTextInputOff = (changedField: string): void => {
    fields.forEach((choiceField) => {
      if (choiceField !== changedField) {
        change(
          FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
          `${choiceField}.has_text_input`,
          false,
        );
      }
    });
  };

  const handleRemove = (index: number) => {
    if (autoFillValues) {
      const dataMap = getDataMapBase();
      const deletedValue = fields.get(index).value;
      dataMap[deletedValue] = null;
      fields.forEach((choiceField, choiceIndex) => {
        if (index >= choiceIndex) {
          return;
        }

        const autoValue = choiceIndex.toString();
        const currentValue = fields.get(choiceIndex).value;

        if (currentValue !== autoValue) {
          change(
            FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
            `${choiceField}.value`,
            autoValue,
          );
          dataMap[currentValue] = autoValue;
        }
      });
      onChoiceValuesChanged(dataMap);
    }

    fields.remove(index);
  };

  const handleAdd = () => {
    const dataMap = getDataMapBase();
    const initialValue = autoFillValues ? String(fields.length + 1) : "";
    fields.push({
      text: "",
      text_fi: "",
      text_en: "",
      text_sv: "",
      value: initialValue,
      has_text_input: false,
      protected_values: [],
    });
    dataMap[initialValue] = initialValue;
    onChoiceValuesChanged(dataMap);
  };

  const handleMoveUp = (index: number) => {
    if (autoFillValues) {
      handleSwapAutoValues(index, index - 1);
    }

    fields.move(index, index - 1);
    setImmediate(() => {
      if (index - 1 !== 0) {
        choiceRefs.current[
          `SectionEditorMoveUpButton_Choice_${index - 1}`
        ]?.focus();
      } else {
        choiceRefs.current[
          `SectionEditorMoveDownButton_Choice_${index - 1}`
        ]?.focus();
      }
    });
  };

  const handleMoveDown = (index: number) => {
    if (autoFillValues) {
      handleSwapAutoValues(index, index + 1);
    }

    fields.move(index, index + 1);
    setImmediate(() => {
      if (index + 1 < fields.length - 1) {
        choiceRefs.current[
          `SectionEditorMoveDownButton_Choice_${index + 1}`
        ]?.focus();
      } else {
        choiceRefs.current[
          `SectionEditorMoveUpButton_Choice_${index + 1}`
        ]?.focus();
      }
    });
  };

  const setRef = (index, el) => {
    choiceRefs.current[index] = el;
  };

  const handleSwapAutoValues = (index1: number, index2: number) => {
    const dataMap = getDataMapBase();
    dataMap[(index2 + 1).toString()] = (index1 + 1).toString();
    dataMap[(index1 + 1).toString()] = (index2 + 1).toString();
    onChoiceValuesChanged(dataMap);
    change(
      FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
      `${fields.name}[${index1}].value`,
      (index2 + 1).toString(),
    );
    change(
      FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
      `${fields.name}[${index2}].value`,
      (index1 + 1).toString(),
    );
  };

  const handleSingleValueChange = (index: number, value: any) => {
    const dataMap = getDataMapBase();
    const currentValue = fields.get(index).value;
    dataMap[currentValue] = value;
    onChoiceValuesChanged(dataMap);
  };

  return (
    <>
      {fields.map((field, i) => {
        const isProtected = protectedValues.includes(fields.get(i).value);
        return (
          <Fragment key={i}>
            <Row>
              <Column small={1}>#{i + 1}</Column>
              <Column small={10}>
                <Row>
                  <Column small={4}>
                    <FormFieldLegacy
                      fieldAttributes={get(
                        attributes,
                        "sections.child.children.fields.child.children.choices.child.children.text",
                      )}
                      name={`${field}.text`}
                      disabled={disabled}
                      overrideValues={{
                        label: "Nimi suomeksi",
                      }}
                    />
                  </Column>
                  <Column small={4}>
                    <FormFieldLegacy
                      fieldAttributes={get(
                        attributes,
                        "sections.child.children.fields.child.children.choices.child.children.text_en",
                      )}
                      name={`${field}.text_en`}
                      disabled={disabled}
                      overrideValues={{
                        label: "Nimi englanniksi",
                      }}
                    />
                  </Column>
                  <Column small={4}>
                    <FormFieldLegacy
                      fieldAttributes={get(
                        attributes,
                        "sections.child.children.fields.child.children.choices.child.children.text_sv",
                      )}
                      name={`${field}.text_sv`}
                      disabled={disabled}
                      overrideValues={{
                        label: "Nimi ruotsiksi",
                      }}
                    />
                  </Column>
                </Row>
              </Column>
              <Column small={1}>
                <IconButton
                  onClick={() => handleRemove(i)}
                  disabled={isProtected}
                >
                  <TrashIcon className="icon-medium" />
                </IconButton>
                <IconButton
                  onClick={() => handleMoveUp(i)}
                  disabled={i === 0}
                  id={`SectionEditorMoveUpButton_Choice_${i}`}
                  ref={(el) =>
                    setRef(`SectionEditorMoveUpButton_Choice_${i}`, el)
                  }
                >
                  <MoveUpIcon className="icon-medium" />
                </IconButton>
                <IconButton
                  onClick={() => handleMoveDown(i)}
                  disabled={i + 1 >= fields.length}
                  id={`SectionEditorMoveDownButton_Choice_${i}`}
                  ref={(el) =>
                    setRef(`SectionEditorMoveDownButton_Choice_${i}`, el)
                  }
                >
                  <MoveDownIcon className="icon-medium" />
                </IconButton>
              </Column>
            </Row>
            <Row>
              <Column small={1} />
              <Column small={10}>
                <Row>
                  <Column small={6}>
                    <FormFieldLegacy
                      fieldAttributes={get(
                        attributes,
                        "sections.child.children.fields.child.children.choices.child.children.value",
                      )}
                      name={`${field}.value`}
                      disabled={disabled || autoFillValues || isProtected}
                      overrideValues={{
                        label: "Arvo",
                      }}
                      onChange={(newValue) =>
                        handleSingleValueChange(i, newValue)
                      }
                    />
                  </Column>
                  <Column small={6}>
                    <FormFieldLegacy
                      fieldAttributes={get(
                        attributes,
                        "sections.child.children.fields.child.children.choices.child.children.has_text_input",
                      )}
                      name={`${field}.has_text_input`}
                      disabled={disabled}
                      overrideValues={{
                        options: [
                          {
                            label: "Näytä tekstikenttä",
                            value: true,
                          },
                        ],
                        type: FieldTypes.BOOLEAN,
                        label: "Näytä tekstikenttä",
                      }}
                      onChange={() => setOtherChoicesTextInputOff(field)}
                    />
                  </Column>
                </Row>
              </Column>
              <Column small={1} />
            </Row>
          </Fragment>
        );
      })}
      <IconButton onClick={handleAdd}>
        <AddIcon className="icon-medium" /> Lisää vaihtoehto
      </IconButton>
    </>
  );
};

type OwnProps = {
  disabled: boolean;
  field: any;
  collapseStates: Record<string, boolean>;
  setSectionEditorCollapseState: (...args: Array<any>) => any;
};
type Props = OwnProps & {
  attributes?: Attributes;
  fieldValues?: Record<string, any>;
  fieldTypeMapping?: Record<number, string>;
  change?: (...args: Array<any>) => any;
  fieldIdentifiers: Array<string>;
  index?: number;
  onDelete: (...args: Array<any>) => any;
  onMoveUp?: ((...args: Array<any>) => any) | null;
  onMoveDown?: ((...args: Array<any>) => any) | null;
  fieldRefs: any;
  form?: string;
};

const EditPlotApplicationSectionFieldForm = ({
  disabled,
  field,
  attributes,
  fieldValues,
  fieldTypeMapping,
  change,
  fieldIdentifiers,
  onDelete,
  onMoveUp,
  onMoveDown,
  collapseStates,
  setSectionEditorCollapseState,
  fieldRefs,
}: Props) => {
  const [isHintPopupOpen, setIsHintPopupOpen] = useState<boolean>(false);
  const id = fieldValues.id ?? fieldValues.temporary_id;
  const upButtonId = `SectionEditorMoveUpButton_Field_${id}`;
  const downButtonId = `SectionEditorMoveDownButton_Field_${id}`;
  const isOpen = collapseStates[`field-${id}`];
  useEffect(() => {
    if (isOpen === undefined) {
      setSectionEditorCollapseState(
        `field-${id}`,
        !fieldValues.id || !fieldValues.type,
      );
    }
  }, []);
  const type = fieldTypeMapping[fieldValues.type];
  const typeChoices = useMemo<Array<Record<string, any>>>(() => {
    return get(
      attributes,
      "sections.child.children.fields.child.children.type.choices",
    )?.map((type) => ({
      value: type.value,
      label: FieldTypeLabels[type.display_name] || type.display_name,
    }));
  }, [fieldTypeMapping]);
  const fieldFeatures = useMemo<Array<string>>(() => {
    return FIELD_TYPE_FEATURES_BY_FIELD_TYPE_NAME[type] || [];
  }, [fieldValues.type]);
  const listSelectionDefaultValueType = useMemo<string>(() => {
    if (fieldFeatures.includes(FieldTypeFeatures.MULTIPLE_SELECTION_OPTIONS)) {
      if (fieldValues.choices.length === 0) {
        return FieldTypes.BOOLEAN;
      } else {
        return FieldTypes.MULTISELECT;
      }
    }

    return FieldTypes.CHOICE;
  }, [fieldValues.type, fieldValues.choices]);

  const updateAutoIdentifier = (
    shouldChange: boolean,
    newName: string,
  ): void => {
    if (shouldChange && !fieldValues.is_protected) {
      change(
        FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
        `${field}.identifier`,
        generateFieldIdentifierFromName(newName, fieldIdentifiers),
      );
    }
  };

  const handleTypeChanged = (newType: number): void => {
    const newFieldFeatures =
      FIELD_TYPE_FEATURES_BY_FIELD_TYPE_NAME[fieldTypeMapping[newType]] || [];
    const prevIsMultiSelect = fieldFeatures.includes(
      FieldTypeFeatures.MULTIPLE_SELECTION_OPTIONS,
    );
    const newIsMultiSelect = newFieldFeatures.includes(
      FieldTypeFeatures.MULTIPLE_SELECTION_OPTIONS,
    );

    if (prevIsMultiSelect && !newIsMultiSelect) {
      change(
        FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
        `${field}.default_value`,
        fieldValues.default_value?.[0] || "",
      );
    } else if (newIsMultiSelect && !prevIsMultiSelect) {
      if (fieldValues.choices.length > 0) {
        change(
          FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
          `${field}.default_value`,
          fieldValues.default_value ? [fieldValues.default_value] : [],
        );
      } else {
        change(
          FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
          `${field}.default_value`,
          false,
        );
      }
    }
  };

  const handleChoiceValuesChanged = (dataMap: Record<string, string>) => {
    if (fieldFeatures.includes(FieldTypeFeatures.MULTIPLE_SELECTION_OPTIONS)) {
      if (
        Object.values(dataMap).filter((choiceValue) => choiceValue !== null)
          .length === 0
      ) {
        change(
          FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
          `${field}.default_value`,
          false,
        );
      } else {
        if (fieldValues.default_value instanceof Array) {
          change(
            FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
            `${field}.default_value`,
            fieldValues.default_value
              .map((choiceValue) => dataMap[choiceValue])
              .filter((choiceValue) => choiceValue !== null) || [],
          );
        } else {
          change(
            FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
            `${field}.default_value`,
            [],
          );
        }
      }
    } else {
      if (dataMap[fieldValues.default_value] !== fieldValues.default_value) {
        change(
          FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
          `${field}.default_value`,
          dataMap[fieldValues.default_value],
        );
      }
    }
  };

  const optionChoices = useMemo<Record<string, any>>(() => {
    const options = fieldValues.choices?.map((option) => ({
      label: option.text,
      value: option.value,
    }));

    if (fieldFeatures.includes(FieldTypeFeatures.SINGLE_SELECTION_OPTIONS)) {
      options.unshift({
        label: "",
        value: null,
      });
    }

    return options;
  }, [fieldValues.choices, fieldValues.type]);

  const setRef = (id, el) => {
    fieldRefs.current[id] = el;
  };

  return (
    <Fragment>
      <Row className="section-field">
        <Column small={8}>
          <FormFieldLegacy
            fieldAttributes={get(
              attributes,
              "sections.child.children.fields.child.children.enabled",
            )}
            name={`${field}.enabled`}
            overrideValues={{
              fieldType: "checkbox",
            }}
            invisibleLabel
            disabled={disabled}
          />
          <FormFieldLegacy
            fieldAttributes={get(
              attributes,
              "sections.child.children.fields.child.children.label",
            )}
            name={`${field}.label`}
            overrideValues={{
              allowEdit: false,
            }}
            invisibleLabel
            disabled={disabled}
          />
          {fieldValues.hint_text && (
            <TooltipWrapper>
              <TooltipToggleButton
                className="section-field__hint-text-button"
                onClick={() => setIsHintPopupOpen(true)}
              >
                <InfoIcon />
              </TooltipToggleButton>
              <Tooltip
                isOpen={isHintPopupOpen}
                onClose={() => setIsHintPopupOpen(false)}
              >
                {fieldValues.hint_text}
              </Tooltip>
            </TooltipWrapper>
          )}
        </Column>
        <Column small={3}>
          <FormFieldLegacy
            fieldAttributes={get(
              attributes,
              "sections.child.children.fields.child.children.required",
            )}
            name={`${field}.required`}
            overrideValues={{
              fieldType: "checkbox",
              options: [
                {
                  label: "Pakollinen tieto",
                  value: true,
                },
              ],
            }}
            className="edit-plot-application-section-form__field-required-field"
            invisibleLabel
            disabled={disabled}
          />
        </Column>
        <Column small={1}>
          <IconButton
            title="Avaa/sulje muokkaustila"
            onClick={() =>
              setSectionEditorCollapseState(`field-${id}`, !isOpen)
            }
          >
            <EditIcon className="icon-medium" />
          </IconButton>
          <IconButton
            title="Poista kenttä"
            onClick={onDelete}
            disabled={fieldValues.is_protected}
          >
            <TrashIcon className="icon-medium" />
          </IconButton>
          <IconButton
            title="Siirrä ylös"
            disabled={!onMoveUp}
            onClick={() => onMoveUp?.(id)}
            id={upButtonId}
            ref={(el) => setRef(upButtonId, el)}
          >
            <MoveUpIcon className="icon-medium" />
          </IconButton>
          <IconButton
            title="Siirrä alas"
            disabled={!onMoveDown}
            onClick={() => onMoveDown?.(id)}
            id={downButtonId}
            ref={(el) => setRef(downButtonId, el)}
          >
            <MoveDownIcon className="icon-medium" />
          </IconButton>
        </Column>
      </Row>
      {isOpen && (
        <Row className="section-field-editor">
          <Column small={12}>
            <Row>
              <Column small={4}>
                <FormFieldLegacy
                  fieldAttributes={get(
                    attributes,
                    "sections.child.children.fields.child.children.label",
                  )}
                  name={`${field}.label`}
                  disabled={disabled}
                  overrideValues={{
                    label: "Nimi suomeksi",
                  }}
                  onChange={(newName) =>
                    updateAutoIdentifier(
                      fieldValues.auto_fill_identifier,
                      newName,
                    )
                  }
                />
              </Column>
              <Column small={4}>
                <FormFieldLegacy
                  fieldAttributes={get(
                    attributes,
                    "sections.child.children.fields.child.children.label_en",
                  )}
                  name={`${field}.label_en`}
                  disabled={disabled}
                  overrideValues={{
                    label: "Nimi englanniksi",
                  }}
                />
              </Column>
              <Column small={4}>
                <FormFieldLegacy
                  fieldAttributes={get(
                    attributes,
                    "sections.child.children.fields.child.children.label_sv",
                  )}
                  name={`${field}.label_sv`}
                  disabled={disabled}
                  overrideValues={{
                    label: "Nimi ruotsiksi",
                  }}
                />
              </Column>
            </Row>
            <Row>
              <Column small={4}>
                <FormFieldLegacy
                  fieldAttributes={get(
                    attributes,
                    "sections.child.children.fields.child.children.type",
                  )}
                  name={`${field}.type`}
                  disabled={disabled}
                  overrideValues={{
                    label: "Tyyppi",
                    options: typeChoices,
                  }}
                  onChange={handleTypeChanged}
                />
              </Column>
              <Column small={4}>
                <FormFieldLegacy
                  fieldAttributes={get(
                    attributes,
                    "sections.child.children.fields.child.children.identifier",
                  )}
                  name={`${field}.identifier`}
                  disabled={
                    disabled ||
                    fieldValues.auto_fill_identifier ||
                    fieldValues.is_protected
                  }
                  overrideValues={{
                    label: "Sisäinen tunnus",
                  }}
                />
                <FormFieldLegacy
                  fieldAttributes={{
                    type: FieldTypes.CHECKBOX,
                    required: false,
                    read_only: false,
                    label: "",
                  }}
                  name={`${field}.auto_fill_identifier`}
                  disabled={disabled || fieldValues.is_protected}
                  invisibleLabel
                  overrideValues={{
                    options: [
                      {
                        label: "Täytä tunnus automaattisesti",
                        value: true,
                      },
                    ],
                  }}
                  onBlur={(value: boolean) => {
                    if (value) {
                      updateAutoIdentifier(true, fieldValues.label);
                    }
                  }}
                />
              </Column>
            </Row>
            <Row>
              <Column small={4}>
                <FormFieldLegacy
                  fieldAttributes={get(
                    attributes,
                    "sections.child.children.fields.child.children.hint_text",
                  )}
                  name={`${field}.hint_text`}
                  disabled={disabled}
                  overrideValues={{
                    label: "Ohjeteksti suomeksi",
                  }}
                />
              </Column>
              <Column small={4}>
                <FormFieldLegacy
                  fieldAttributes={get(
                    attributes,
                    "sections.child.children.fields.child.children.hint_text_en",
                  )}
                  name={`${field}.hint_text_en`}
                  disabled={disabled}
                  overrideValues={{
                    label: "Ohjeteksti englanniksi",
                  }}
                />
              </Column>
              <Column small={4}>
                <FormFieldLegacy
                  fieldAttributes={get(
                    attributes,
                    "sections.child.children.fields.child.children.hint_text_sv",
                  )}
                  name={`${field}.hint_text_sv`}
                  disabled={disabled}
                  overrideValues={{
                    label: "Ohjeteksti ruotsiksi",
                  }}
                />
              </Column>
            </Row>
            {(fieldFeatures.includes(
              FieldTypeFeatures.FREEFORM_DEFAULT_VALUE,
            ) ||
              fieldFeatures.includes(
                FieldTypeFeatures.LIST_SELECTION_DEFAULT_VALUE,
              )) && (
              <Row>
                <Column small={12}>
                  <SubTitle>Kentän arvot</SubTitle>
                </Column>
              </Row>
            )}
            <Row>
              {fieldFeatures.includes(
                FieldTypeFeatures.FREEFORM_DEFAULT_VALUE,
              ) && (
                <Column
                  small={
                    fieldFeatures.includes(FieldTypeFeatures.TEXT_AREA_INPUT)
                      ? 12
                      : 4
                  }
                >
                  <FormFieldLegacy
                    fieldAttributes={{
                      ...get(
                        attributes,
                        "sections.child.children.fields.child.children.default_value",
                      ),
                      type: fieldFeatures.includes(
                        FieldTypeFeatures.TEXT_AREA_INPUT,
                      )
                        ? FieldTypes.TEXTAREA
                        : FieldTypes.STRING,
                    }}
                    name={`${field}.default_value`}
                    disabled={disabled}
                    overrideValues={{
                      label: fieldFeatures.includes(
                        FieldTypeFeatures.UNCHANGEABLE_VALUE,
                      )
                        ? "Vakioarvo"
                        : "Oletusarvo",
                    }}
                  />
                </Column>
              )}
              {fieldFeatures.includes(
                FieldTypeFeatures.LIST_SELECTION_DEFAULT_VALUE,
              ) && (
                <Column small={4}>
                  <FormFieldLegacy
                    fieldAttributes={{
                      ...get(
                        attributes,
                        "sections.child.children.fields.child.children.default_value",
                      ),
                      type: listSelectionDefaultValueType,
                    }}
                    name={`${field}.default_value`}
                    disabled={disabled}
                    overrideValues={{
                      label: "Oletusarvo",
                      options: optionChoices || [],
                    }}
                  />
                </Column>
              )}
            </Row>
            {(fieldFeatures.includes(
              FieldTypeFeatures.SINGLE_SELECTION_OPTIONS,
            ) ||
              fieldFeatures.includes(
                FieldTypeFeatures.MULTIPLE_SELECTION_OPTIONS,
              )) && (
              <>
                <Row>
                  <Column small={12}>
                    <SubTitle>Vaihtoehdot</SubTitle>
                  </Column>
                </Row>
                <Row>
                  <Column small={4}>
                    <FormFieldLegacy
                      fieldAttributes={{
                        type: FieldTypes.CHECKBOX,
                        required: false,
                        read_only: false,
                        label: "",
                      }}
                      name={`${field}.auto_fill_choice_values`}
                      disabled={
                        disabled || fieldValues.protected_values.length > 0
                      }
                      invisibleLabel
                      overrideValues={{
                        options: [
                          {
                            label: "Täytä arvot automaattisesti",
                            value: true,
                          },
                        ],
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12}>
                    <FieldArray
                      name={`${field}.choices`}
                      component={EditPlotApplicationSectionFieldChoice}
                      disabled={disabled}
                      attributes={attributes}
                      change={change}
                      onChoiceValuesChanged={handleChoiceValuesChanged}
                      autoFillValues={fieldValues.auto_fill_choice_values}
                      protectedValues={fieldValues.protected_values}
                    />
                  </Column>
                </Row>
              </>
            )}
          </Column>
        </Row>
      )}
    </Fragment>
  );
};

const selector = formValueSelector(
  FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING,
);
export default connect(
  (state, props: OwnProps) => {
    return {
      attributes: getFormAttributes(state),
      fieldValues: selector(state, props.field),
      fieldTypeMapping: getFieldTypeMapping(state),
    };
  },
  {
    change,
  },
)(EditPlotApplicationSectionFieldForm) as React.ComponentType<Props>;
