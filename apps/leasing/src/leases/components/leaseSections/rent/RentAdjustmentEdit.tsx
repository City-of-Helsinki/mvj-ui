import React, { ReactElement, useCallback, useEffect, useRef } from "react";
import { FieldArray } from "react-final-form-arrays";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import AddButtonThird from "@/components/form/AddButtonThird";
import Authorization from "@/components/authorization/Authorization";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import DecisionLink from "@/components/links/DecisionLink";
import Divider from "@/components/content/Divider";
import FormField from "@/components/form/final-form/FormField";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import GreenBox from "@/components/content/GreenBox";
import RemoveButton from "@/components/form/RemoveButton";
import RentAdjustmentManagementSubventionEdit from "./RentAdjustmentManagementSubventionEdit";
import RentAdjustmentTemporarySubventionEdit from "./RentAdjustmentTemporarySubventionEdit";
import SubTitle from "@/components/content/SubTitle";
import { ConfirmationModalTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
  RentAdjustmentManagementSubventionsFieldPaths,
  RentAdjustmentManagementSubventionsFieldTitles,
  RentAdjustmentTemporarySubventionsFieldPaths,
  RentAdjustmentTemporarySubventionsFieldTitles,
  RentAdjustmentAmountTypes,
  RentAdjustmentTypes,
  SubventionTypes,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  calculateReLeaseDiscountPercent,
  calculateRentAdjustmentSubventionPercentCumulative,
  getDecisionById,
  hasSubventionValues,
  isSubventionTypeSpecified,
} from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatNumber,
  getFieldAttributes,
  getLabelOfOption,
  hasPermissions,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
  getIsSaveClicked,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { useForm } from "react-final-form";
import { useFieldValue } from "@/components/helpers";
type ManagementSubventionsProps = {
  fields: any;
  leaseAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const ManagementSubventions = ({
  fields,
  leaseAttributes,
  usersPermissions,
}: ManagementSubventionsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <>
            {!isFieldAllowedToEdit(
              leaseAttributes,
              RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS,
            ) &&
              (!fields || !fields.length) && (
                <FormText>Ei hallintamuotoja</FormText>
              )}

            {fields && !!fields.length && (
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT,
                      )}
                    >
                      {
                        RentAdjustmentManagementSubventionsFieldTitles.MANAGEMENT
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        RentAdjustmentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                      )}
                    >
                      {
                        RentAdjustmentManagementSubventionsFieldTitles.SUBVENTION_PERCENT
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            )}

            {!!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_MANAGEMENT_SUBVENTION
                        .BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_MANAGEMENT_SUBVENTION.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_MANAGEMENT_SUBVENTION.TITLE,
                  });
                };

                return (
                  <RentAdjustmentManagementSubventionEdit
                    key={index}
                    field={field}
                    onRemove={handleRemove}
                  />
                );
              })}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_MANAGEMENTSUBVENTION,
              )}
            >
              <Row>
                <Column>
                  <AddButtonThird
                    label="Lisää hallintamuoto"
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

type TemporarySubventionsProps = {
  fields: any;
  leaseAttributes: Attributes;
  usersPermissions: UsersPermissionsType;
};

const TemporarySubventions = ({
  fields,
  leaseAttributes,
  usersPermissions,
}: TemporarySubventionsProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch }) => {
        return (
          <>
            {!isFieldAllowedToEdit(
              leaseAttributes,
              RentAdjustmentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS,
            ) &&
              (!fields || !fields.length) && (
                <FormText>Ei tilapäisalennuksia</FormText>
              )}

            {fields && !!fields.length && (
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        RentAdjustmentTemporarySubventionsFieldPaths.DESCRIPTION,
                      )}
                    >
                      {
                        RentAdjustmentTemporarySubventionsFieldTitles.DESCRIPTION
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        RentAdjustmentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
                      )}
                    >
                      {
                        RentAdjustmentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            )}

            {!!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText:
                      ConfirmationModalTexts.DELETE_TEMPORARY_SUBVENTION.BUTTON,
                    confirmationModalLabel:
                      ConfirmationModalTexts.DELETE_TEMPORARY_SUBVENTION.LABEL,
                    confirmationModalTitle:
                      ConfirmationModalTexts.DELETE_TEMPORARY_SUBVENTION.TITLE,
                  });
                };

                return (
                  <RentAdjustmentTemporarySubventionEdit
                    key={index}
                    field={field}
                    onRemove={handleRemove}
                  />
                );
              })}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_TEMPORARYSUBVENTION,
              )}
            >
              <Row>
                <Column>
                  <AddButtonThird
                    className="no-bottom-margin"
                    label="Lisää tilapäisalennus"
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  decisionOptions: Array<Record<string, any>>;
  amountTypeOptions: Array<Record<string, any>>;
  field: string;
  onRemove: (...args: Array<any>) => any;
};

const RentAdjustmentsEdit: React.FC<Props> = ({
  decisionOptions,
  amountTypeOptions,
  field,
  onRemove,
}) => {
  const form = useForm();

  const amountType = useFieldValue(`${field}.amount_type`);
  const fullAmount = useFieldValue(`${field}.full_amount`);

  const managementSubventions = useFieldValue(
    `${field}.management_subventions`,
  );
  const subventionBasePercent = useFieldValue(
    `${field}.subvention_base_percent`,
  );
  const subventionGraduatedPercent = useFieldValue(
    `${field}.subvention_graduated_percent`,
  );
  const subventionType = useFieldValue(`${field}.subvention_type`);
  const temporarySubventions = useFieldValue(`${field}.temporary_subventions`);
  const type = useFieldValue(`${field}.type`);
  const currentLease = useSelector(getCurrentLease);
  const leaseAttributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);
  const isSaveClicked = useSelector(getIsSaveClicked);

  const calculateTotalSubventionPercent = useCallback(() => {
    return calculateRentAdjustmentSubventionPercentCumulative(
      subventionType,
      subventionBasePercent,
      subventionGraduatedPercent,
      managementSubventions,
      temporarySubventions,
    );
  }, [
    managementSubventions,
    subventionBasePercent,
    subventionGraduatedPercent,
    subventionType,
    temporarySubventions,
  ]);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    if (
      isSubventionTypeSpecified(subventionType) &&
      hasSubventionValues(
        managementSubventions,
        temporarySubventions,
        subventionBasePercent,
        subventionGraduatedPercent,
      )
    ) {
      const newFullAmount = calculateTotalSubventionPercent();
      form.change(`${field}.full_amount`, formatNumber(newFullAmount));
    }
  }, [
    subventionType,
    managementSubventions,
    temporarySubventions,
    subventionBasePercent,
    subventionGraduatedPercent,
    field,
    calculateTotalSubventionPercent,
    form,
  ]);

  const decisionReadOnlyRenderer = (value: number | null | undefined) => {
    return (
      <DecisionLink
        decision={getDecisionById(currentLease, value)}
        decisionOptions={decisionOptions}
      />
    );
  };

  const getFullAmountText = () => {
    if (!fullAmount) return null;
    return `${formatNumber(fullAmount)} ${getLabelOfOption(amountTypeOptions, amountType) || ""}`;
  };

  const handleAddSubventions = () => {
    // To make the subvention form visible: null => "unspecified"
    form.change(`${field}.subvention_type`, "unspecified");
  };

  const removeSubventions = () => {
    form.batch(() => {
      form.change(`${field}.subvention_type`, null);
      form.change(`${field}.management_subventions`, []);
      form.change(`${field}.temporary_subventions`, []);
    });
  };

  const getReLeaseDiscountPercent = () => {
    return calculateReLeaseDiscountPercent(
      subventionBasePercent,
      subventionGraduatedPercent,
    );
  };

  const showSubventions =
    subventionType !== null &&
    subventionType !== undefined &&
    subventionType !== "";
  const totalSubventionPercent = calculateTotalSubventionPercent();
  return (
    <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <Authorization
            allow={hasPermissions(
              usersPermissions,
              UsersPermissions.DELETE_RENTADJUSTMENT,
            )}
          >
            <RemoveButton onClick={onRemove} title="Poista alennus/korotus" />
          </Authorization>
        </ActionButtonWrapper>
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.TYPE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentAdjustmentsFieldPaths.TYPE,
                )}
                name={`${field}.type`}
                overrideValues={{
                  label: LeaseRentAdjustmentsFieldTitles.TYPE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentAdjustmentsFieldPaths.TYPE,
                )}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.INTENDED_USE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentAdjustmentsFieldPaths.INTENDED_USE,
                )}
                name={`${field}.intended_use`}
                overrideValues={{
                  label: LeaseRentAdjustmentsFieldTitles.INTENDED_USE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentAdjustmentsFieldPaths.INTENDED_USE,
                )}
              />
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentAdjustmentsFieldPaths.START_DATE,
                  )}
                >
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(
                      leaseAttributes,
                      LeaseRentAdjustmentsFieldPaths.START_DATE,
                    )}
                    name={`${field}.start_date`}
                    overrideValues={{
                      label: LeaseRentAdjustmentsFieldTitles.START_DATE,
                    }}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseRentAdjustmentsFieldPaths.START_DATE,
                    )}
                  />
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseRentAdjustmentsFieldPaths.END_DATE,
                  )}
                >
                  {amountType !== RentAdjustmentAmountTypes.AMOUNT_TOTAL && (
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(
                        leaseAttributes,
                        LeaseRentAdjustmentsFieldPaths.END_DATE,
                      )}
                      name={`${field}.end_date`}
                      overrideValues={{
                        label: LeaseRentAdjustmentsFieldTitles.END_DATE,
                      }}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        LeaseRentAdjustmentsFieldPaths.END_DATE,
                      )}
                    />
                  )}
                </Authorization>
              </Column>
            </Row>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT,
              )}
            >
              <>
                <FormTextTitle
                  required={
                    isFieldRequired(
                      leaseAttributes,
                      LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT,
                    ) ||
                    isFieldRequired(
                      leaseAttributes,
                      LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE,
                    )
                  }
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT,
                  )}
                >
                  {LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT}
                </FormTextTitle>

                <Row>
                  <Authorization
                    allow={
                      isFieldAllowedToEdit(
                        leaseAttributes,
                        LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT,
                      ) ||
                      isFieldAllowedToEdit(
                        leaseAttributes,
                        LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE,
                      )
                    }
                    errorComponent={
                      <Column>
                        <FormText>{getFullAmountText()}</FormText>
                      </Column>
                    }
                  >
                    <>
                      <Column small={6}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT,
                          )}
                        >
                          <FormField
                            disabled={
                              type === RentAdjustmentTypes.DISCOUNT &&
                              showSubventions
                            }
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              leaseAttributes,
                              LeaseRentAdjustmentsFieldPaths.FULL_AMOUNT,
                            )}
                            invisibleLabel
                            name={`${field}.full_amount`}
                            overrideValues={{
                              label:
                                LeaseRentAdjustmentsFieldTitles.FULL_AMOUNT,
                            }}
                          />
                        </Authorization>
                      </Column>
                      <Column small={6}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE,
                          )}
                        >
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              leaseAttributes,
                              LeaseRentAdjustmentsFieldPaths.AMOUNT_TYPE,
                            )}
                            invisibleLabel
                            name={`${field}.amount_type`}
                            overrideValues={{
                              label:
                                LeaseRentAdjustmentsFieldTitles.AMOUNT_TYPE,
                            }}
                          />
                        </Authorization>
                      </Column>
                    </>
                  </Authorization>
                </Row>
              </>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT,
              )}
            >
              {amountType === RentAdjustmentAmountTypes.AMOUNT_TOTAL && (
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(
                    leaseAttributes,
                    LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT,
                  )}
                  name={`${field}.amount_left`}
                  unit="€"
                  overrideValues={{
                    label: LeaseRentAdjustmentsFieldTitles.AMOUNT_LEFT,
                  }}
                  enableUiDataEdit
                  tooltipStyle={{
                    right: 12,
                  }}
                  uiDataKey={getUiDataLeaseKey(
                    LeaseRentAdjustmentsFieldPaths.AMOUNT_LEFT,
                  )}
                />
              )}
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.DECISION,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentAdjustmentsFieldPaths.DECISION,
                )}
                name={`${field}.decision`}
                readOnlyValueRenderer={decisionReadOnlyRenderer}
                overrideValues={{
                  label: LeaseRentAdjustmentsFieldTitles.DECISION,
                  options: decisionOptions,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentAdjustmentsFieldPaths.DECISION,
                )}
              />
            </Authorization>
          </Column>
        </Row>
        <Row>
          <Column medium={12}>
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentAdjustmentsFieldPaths.NOTE,
              )}
            >
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseRentAdjustmentsFieldPaths.NOTE,
                )}
                name={`${field}.note`}
                overrideValues={{
                  label: LeaseRentAdjustmentsFieldTitles.NOTE,
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(
                  LeaseRentAdjustmentsFieldPaths.NOTE,
                )}
              />
            </Authorization>
          </Column>
        </Row>

        {type === RentAdjustmentTypes.DISCOUNT && !showSubventions && (
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE,
            )}
          >
            <Row>
              <Column>
                <AddButtonSecondary
                  label="Lisää subventio"
                  onClick={handleAddSubventions}
                />
              </Column>
            </Row>
          </Authorization>
        )}
        {type === RentAdjustmentTypes.DISCOUNT && showSubventions && (
          <AppConsumer>
            {({ dispatch }) => {
              const handleRemoveSubventions = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    removeSubventions();
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText:
                    ConfirmationModalTexts.DELETE_SUBVENTION.BUTTON,
                  confirmationModalLabel:
                    ConfirmationModalTexts.DELETE_SUBVENTION.LABEL,
                  confirmationModalTitle:
                    ConfirmationModalTexts.DELETE_SUBVENTION.TITLE,
                });
              };

              return (
                <GreenBox className="with-bottom-margin">
                  <ActionButtonWrapper>
                    <RemoveButton
                      onClick={handleRemoveSubventions}
                      title="Poista subventiot"
                    />
                  </ActionButtonWrapper>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE,
                        )}
                      >
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={{
                            ...getFieldAttributes(
                              leaseAttributes,
                              LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE,
                            ),
                            required: true,
                          }}
                          name={`${field}.subvention_type`}
                          overrideValues={{
                            label:
                              LeaseRentAdjustmentsFieldTitles.SUBVENTION_TYPE,
                          }}
                          enableUiDataEdit
                          uiDataKey={getUiDataLeaseKey(
                            LeaseRentAdjustmentsFieldPaths.SUBVENTION_TYPE,
                          )}
                        />
                      </Authorization>
                    </Column>
                  </Row>
                  {subventionType === SubventionTypes.FORM_OF_MANAGEMENT && (
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS,
                      )}
                    >
                      <>
                        <SubTitle
                          enableUiDataEdit
                          uiDataKey={getUiDataLeaseKey(
                            RentAdjustmentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS,
                          )}
                        >
                          {
                            RentAdjustmentManagementSubventionsFieldTitles.MANAGEMENT_SUBVENTIONS
                          }
                        </SubTitle>
                        <FieldArray name={`${field}.management_subventions`}>
                          {(fieldArrayProps) =>
                            ManagementSubventions({
                              ...fieldArrayProps,
                              leaseAttributes: leaseAttributes,
                              usersPermissions: usersPermissions,
                            })
                          }
                        </FieldArray>
                      </>
                    </Authorization>
                  )}
                  {subventionType === SubventionTypes.RE_LEASE && (
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT,
                          )}
                        >
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              leaseAttributes,
                              LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT,
                            )}
                            name={`${field}.subvention_base_percent`}
                            overrideValues={{
                              label:
                                LeaseRentAdjustmentsFieldTitles.SUBVENTION_BASE_PERCENT,
                            }}
                            unit="%"
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT,
                            )}
                          />
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT,
                          )}
                        >
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={getFieldAttributes(
                              leaseAttributes,
                              LeaseRentAdjustmentsFieldPaths.SUBVENTION_GRADUATED_PERCENT,
                            )}
                            name={`${field}.subvention_graduated_percent`}
                            overrideValues={{
                              label:
                                LeaseRentAdjustmentsFieldTitles.SUBVENTION_GRADUATED_PERCENT,
                            }}
                            unit="%"
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseRentAdjustmentsFieldPaths.SUBVENTION_GRADUATED_PERCENT,
                            )}
                          />
                        </Authorization>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseRentAdjustmentsFieldPaths.SUBVENTION_BASE_PERCENT,
                          )}
                        >
                          <>
                            <FormTextTitle
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(
                                LeaseRentAdjustmentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT,
                              )}
                            >
                              {
                                LeaseRentAdjustmentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT
                              }
                            </FormTextTitle>
                            <FormText>
                              {formatNumber(getReLeaseDiscountPercent()) || "-"}{" "}
                              %
                            </FormText>
                          </>
                        </Authorization>
                      </Column>
                    </Row>
                  )}

                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      RentAdjustmentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS,
                    )}
                  >
                    <>
                      <SubTitle
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          RentAdjustmentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS,
                        )}
                      >
                        {
                          RentAdjustmentTemporarySubventionsFieldTitles.TEMPORARY_SUBVENTIONS
                        }
                      </SubTitle>
                      <FieldArray name={`${field}.temporary_subventions`}>
                        {(fieldArrayProps) =>
                          TemporarySubventions({
                            ...fieldArrayProps,
                            leaseAttributes: leaseAttributes,
                            usersPermissions: usersPermissions,
                          })
                        }
                      </FieldArray>
                    </>
                  </Authorization>

                  <Row>
                    <Column small={12} large={6}>
                      <Divider />
                    </Column>
                  </Row>
                  <Row>
                    <Column small={6} medium={4} large={2}>
                      <FormText className="semibold">Yhteensä</FormText>
                    </Column>
                    <Column small={6} medium={4} large={2}>
                      <FormText className="semibold">
                        {formatNumber(totalSubventionPercent)} %
                      </FormText>
                    </Column>
                  </Row>
                </GreenBox>
              );
            }}
          </AppConsumer>
        )}
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default RentAdjustmentsEdit;
