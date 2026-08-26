import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonVariant,
  DateInput,
  Fieldset,
  IconPlusCircleFill,
  Select,
  StepByStep,
  TextArea,
  TextInput,
} from "hds-react";
import { Form } from "react-final-form";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import {
  landUseConditionTypeOptions,
  landUseDecisionMakerOptions,
  landUseDecisionTypeOptions,
  landUseSectionOptions,
} from "../../options";
import {
  getFieldTextValue,
  normalizeSelectValue,
  readOnlyTextValue,
} from "../../utils/fieldUtils";
import { useTocEntries } from "../../hooks/useTableOfContents";
import { ConfirmDeleteButton } from "../ConfirmDeleteButton";
import type { PartyEntry } from "./LandUseParties";

interface DecisionCondition {
  conditionType?: string;
  valvontapvm: string;
  valvottuPvm: string;
  note: string;
}

interface DecisionItem {
  title: string;
  paattaja?: string;
  paatospvm: string;
  pykala?: string;
  paatoksenTyyppi?: string;
  diaarinumero: string;
  huomautus: string;
  ehdot: DecisionCondition[];
}

export interface LandUseDecisionsFormValues {
  decisions?: DecisionItem[];
}

interface LandUseDecisionsProps {
  form: FormApi<LandUseDecisionsFormValues>;
  isEditMode: boolean;
  /** Kept for API compatibility but unused in this component. */
  parties: PartyEntry[];
}

const handleSelectChange = (
  selectedOptions: { label: string; value: string }[],
  callback: (value: string | undefined) => void,
) => {
  if (selectedOptions.length > 0) {
    callback(selectedOptions[0].value);
  } else {
    callback(undefined);
  }
};

const createNewDecisionCondition = (): DecisionCondition => ({
  conditionType: undefined,
  valvontapvm: "",
  valvottuPvm: "",
  note: "",
});

const createNewDecision = (): DecisionItem => ({
  title: "",
  paattaja: undefined,
  paatospvm: "",
  pykala: undefined,
  paatoksenTyyppi: undefined,
  diaarinumero: "",
  huomautus: "",
  ehdot: [],
});

const getDecisionHeadingText = (decision: DecisionItem): string => {
  const parts = [
    decision.paattaja,
    decision.paatospvm,
    decision.pykala,
    decision.paatoksenTyyppi,
  ]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));

  return parts.join(" ") || "Päätös";
};

const getDecisionHeadingId = (index: number): string =>
  `decision-heading-${index}`;

export const LandUseDecisions: React.FC<LandUseDecisionsProps> = ({
  form,
  isEditMode,
}) => {
  const [decisions, setDecisions] = useState<DecisionItem[]>(
    () => form.getState().values.decisions ?? [],
  );

  useEffect(
    () =>
      form.subscribe((state) => setDecisions(state.values.decisions ?? []), {
        values: true,
      }),
    [form],
  );

  const tocEntries = useMemo(
    () =>
      decisions.map((decision, index) => ({
        id: getDecisionHeadingId(index),
        text: getDecisionHeadingText(decision),
        level: 2,
      })),
    [decisions],
  );

  useTocEntries(tocEntries);

  return (
    <Form<LandUseDecisionsFormValues>
      form={form}
      onSubmit={() => {}}
      render={({ handleSubmit, values }) => {
        const decisions = values.decisions ?? [];

        return (
          <form onSubmit={handleSubmit}>
            <div className="landuse-detail__content">
              <h1>Päätökset</h1>

              {decisions.map((decision, decisionIndex) => {
                const decisionName = `decisions.${decisionIndex}`;
                const conditions = decision.ehdot ?? [];

                return (
                  <div
                    className="landuse-detail__party-entry"
                    key={`decision-${decisionIndex}`}
                  >
                    <div className="landuse-detail__heading-with-delete">
                      <h2 id={getDecisionHeadingId(decisionIndex)}>
                        {getDecisionHeadingText(decision)}
                      </h2>
                      {isEditMode && (
                        <ConfirmDeleteButton
                          id={`decision-delete-${decisionIndex}`}
                          buttonLabel="Poista päätös"
                          onConfirm={() => {
                            const currentDecisions =
                              form.getState().values.decisions ?? [];
                            form.change(
                              "decisions",
                              currentDecisions.filter(
                                (_, currentDecisionIndex) =>
                                  currentDecisionIndex !== decisionIndex,
                              ),
                            );
                          }}
                          dialogTitle="Poista päätös"
                          dialogContent={`Haluatko varmasti poistaa päätöksen ${getDecisionHeadingText(decision)}?`}
                        />
                      )}
                    </div>

                    <StepByStep
                      numberedList
                      steps={[
                        {
                          title: "Päätöksen tiedot",
                          key: "decision-details",
                          description: (
                            <Fieldset heading="" className="full-width">
                              <div className="landuse-grid landuse-grid__bottom-margin">
                                <div className="landuse-grid__column-6">
                                  <Field name={`${decisionName}.paattaja`}>
                                    {({ input }) =>
                                      isEditMode ? (
                                        <Select
                                          id={`decision-paattaja-${decisionIndex}`}
                                          texts={{
                                            label: "Päättäjä",
                                            placeholder: "Valitse",
                                          }}
                                          options={landUseDecisionMakerOptions}
                                          value={normalizeSelectValue(
                                            input.value,
                                          )}
                                          onChange={(selected) =>
                                            handleSelectChange(
                                              selected,
                                              input.onChange,
                                            )
                                          }
                                        />
                                      ) : (
                                        <TextInput
                                          id={`decision-paattaja-${decisionIndex}`}
                                          label="Päättäjä"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field name={`${decisionName}.paatospvm`}>
                                    {({ input }) =>
                                      isEditMode ? (
                                        <DateInput
                                          id={`decision-paatospvm-${decisionIndex}`}
                                          label="Päätöspvm"
                                          value={input.value}
                                          onChange={input.onChange}
                                          placeholder="DD.MM.YYYY"
                                          language="fi"
                                        />
                                      ) : (
                                        <TextInput
                                          id={`decision-paatospvm-${decisionIndex}`}
                                          label="Päätöspvm"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field name={`${decisionName}.pykala`}>
                                    {({ input }) =>
                                      isEditMode ? (
                                        <Select
                                          id={`decision-pykala-${decisionIndex}`}
                                          texts={{
                                            label: "Pykälä",
                                            placeholder: "Valitse",
                                          }}
                                          options={landUseSectionOptions}
                                          value={normalizeSelectValue(
                                            input.value,
                                          )}
                                          onChange={(selected) =>
                                            handleSelectChange(
                                              selected,
                                              input.onChange,
                                            )
                                          }
                                        />
                                      ) : (
                                        <TextInput
                                          id={`decision-pykala-${decisionIndex}`}
                                          label="Pykälä"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field
                                    name={`${decisionName}.paatoksenTyyppi`}
                                  >
                                    {({ input }) =>
                                      isEditMode ? (
                                        <Select
                                          id={`decision-paatoksen-tyyppi-${decisionIndex}`}
                                          texts={{
                                            label: "Päätöksen tyyppi",
                                            placeholder: "Valitse",
                                          }}
                                          options={landUseDecisionTypeOptions}
                                          value={normalizeSelectValue(
                                            input.value,
                                          )}
                                          onChange={(selected) =>
                                            handleSelectChange(
                                              selected,
                                              input.onChange,
                                            )
                                          }
                                        />
                                      ) : (
                                        <TextInput
                                          id={`decision-paatoksen-tyyppi-${decisionIndex}`}
                                          label="Päätöksen tyyppi"
                                          value={readOnlyTextValue(input.value)}
                                          readOnly
                                        />
                                      )
                                    }
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6 landuse-detail__decisions-link-column">
                                  <Field name={`${decisionName}.diaarinumero`}>
                                    {({ input }) => (
                                      <TextInput
                                        id={`decision-diaarinumero-${decisionIndex}`}
                                        label="Diaarinumero"
                                        value={getFieldTextValue(
                                          isEditMode,
                                          input.value,
                                        )}
                                        onChange={input.onChange}
                                        readOnly={!isEditMode}
                                      />
                                    )}
                                  </Field>
                                </div>

                                <div className="landuse-grid__column-6">
                                  <Field name={`${decisionName}.huomautus`}>
                                    {({ input }) => (
                                      <TextArea
                                        id={`decision-huomautus-${decisionIndex}`}
                                        label="Huomautus"
                                        value={getFieldTextValue(
                                          isEditMode,
                                          input.value,
                                        )}
                                        onChange={input.onChange}
                                        readOnly={!isEditMode}
                                      />
                                    )}
                                  </Field>
                                </div>
                              </div>
                            </Fieldset>
                          ),
                        },
                        {
                          title: "Ehdot",
                          key: "decision-conditions",
                          description: (
                            <Fieldset heading="" className="full-width">
                              {conditions.map((_, conditionIndex) => {
                                const conditionName = `${decisionName}.ehdot.${conditionIndex}`;
                                return (
                                  <div
                                    className="landuse-grid landuse-grid__bottom-separator"
                                    key={`${conditionName}-${conditionIndex}`}
                                  >
                                    <div className="landuse-grid__column-6">
                                      <Field
                                        name={`${conditionName}.conditionType`}
                                      >
                                        {({ input }) =>
                                          isEditMode ? (
                                            <Select
                                              id={`decision-ehto-tyyppi-${decisionIndex}-${conditionIndex}`}
                                              texts={{
                                                label: "Ehtotyyppi",
                                                placeholder: "Valitse",
                                              }}
                                              options={
                                                landUseConditionTypeOptions
                                              }
                                              value={normalizeSelectValue(
                                                input.value,
                                              )}
                                              onChange={(selected) =>
                                                handleSelectChange(
                                                  selected,
                                                  input.onChange,
                                                )
                                              }
                                            />
                                          ) : (
                                            <TextInput
                                              id={`decision-ehto-tyyppi-${decisionIndex}-${conditionIndex}`}
                                              label="Ehtotyyppi"
                                              value={readOnlyTextValue(
                                                input.value,
                                              )}
                                              readOnly
                                            />
                                          )
                                        }
                                      </Field>
                                    </div>

                                    <div className="landuse-grid__column-6">
                                      <Field
                                        name={`${conditionName}.valvontapvm`}
                                      >
                                        {({ input }) =>
                                          isEditMode ? (
                                            <DateInput
                                              id={`decision-ehto-valvontapvm-${decisionIndex}-${conditionIndex}`}
                                              label="Valvontapvm"
                                              value={input.value}
                                              onChange={input.onChange}
                                              placeholder="DD.MM.YYYY"
                                              language="fi"
                                            />
                                          ) : (
                                            <TextInput
                                              id={`decision-ehto-valvontapvm-${decisionIndex}-${conditionIndex}`}
                                              label="Valvontapvm"
                                              value={readOnlyTextValue(
                                                input.value,
                                              )}
                                              readOnly
                                            />
                                          )
                                        }
                                      </Field>
                                    </div>

                                    <div className="landuse-grid__column-6">
                                      <Field
                                        name={`${conditionName}.valvottuPvm`}
                                      >
                                        {({ input }) =>
                                          isEditMode ? (
                                            <DateInput
                                              id={`decision-ehto-valvottu-pvm-${decisionIndex}-${conditionIndex}`}
                                              label="Valvottu pvm"
                                              value={input.value}
                                              onChange={input.onChange}
                                              placeholder="DD.MM.YYYY"
                                              language="fi"
                                            />
                                          ) : (
                                            <TextInput
                                              id={`decision-ehto-valvottu-pvm-${decisionIndex}-${conditionIndex}`}
                                              label="Valvottu pvm"
                                              value={readOnlyTextValue(
                                                input.value,
                                              )}
                                              readOnly
                                            />
                                          )
                                        }
                                      </Field>
                                    </div>

                                    <div className="landuse-grid__column-6">
                                      <Field name={`${conditionName}.note`}>
                                        {({ input }) => (
                                          <TextArea
                                            id={`decision-ehto-huomautus-${decisionIndex}-${conditionIndex}`}
                                            label="Huomautus"
                                            value={getFieldTextValue(
                                              isEditMode,
                                              input.value,
                                            )}
                                            onChange={input.onChange}
                                            readOnly={!isEditMode}
                                          />
                                        )}
                                      </Field>
                                    </div>
                                  </div>
                                );
                              })}

                              {isEditMode && (
                                <div className="landuse-detail__decisions-add-row">
                                  <Button
                                    type="button"
                                    variant={ButtonVariant.Supplementary}
                                    iconStart={<IconPlusCircleFill />}
                                    onClick={() => {
                                      form.mutators.push(
                                        `decisions.${decisionIndex}.ehdot`,
                                        createNewDecisionCondition(),
                                      );
                                    }}
                                  >
                                    Lisää ehto
                                  </Button>
                                </div>
                              )}
                            </Fieldset>
                          ),
                        },
                      ]}
                    />
                  </div>
                );
              })}

              {isEditMode && (
                <div className="landuse-detail__decisions-add-row">
                  <Button
                    type="button"
                    variant={ButtonVariant.Supplementary}
                    iconStart={<IconPlusCircleFill />}
                    onClick={() => {
                      form.mutators.push("decisions", createNewDecision());
                    }}
                  >
                    Lisää päätös
                  </Button>
                </div>
              )}
            </div>
          </form>
        );
      }}
    />
  );
};
