import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  change,
  FieldArray,
  formValueSelector,
  initialize,
  getFormValues,
} from "redux-form";
import { Row, Column } from "react-foundation";
import set from "lodash/set";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import AddButtonThird from "@/components/form/AddButtonThird";
import ArchiveButton from "@/components/form/ArchiveButton";
import Authorization from "@/components/authorization/Authorization";
import BasisOfRent from "./BasisOfRent";
import BasisOfRentManagementSubventionEdit from "./BasisOfRentManagementSubventionEdit";
import BasisOfRentTemporarySubventionEdit from "./BasisOfRentTemporarySubventionEdit";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import BoxItem from "@/components/content/BoxItem";
import CopyToClipboardButton from "@/components/form/CopyToClipboardButton";
import Divider from "@/components/content/Divider";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import RemoveButton from "@/components/form/RemoveButton";
import SubTitle from "@/components/content/SubTitle";
import WhiteBox from "@/components/content/WhiteBox";
import { ConfirmationModalTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  BasisOfRentManagementSubventionsFieldPaths,
  BasisOfRentManagementSubventionsFieldTitles,
  BasisOfRentTemporarySubventionsFieldPaths,
  BasisOfRentTemporarySubventionsFieldTitles,
  CalculatorTypes,
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  SubventionTypes,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  getBasisOfRentAmountPerArea,
  calculateAmountFromValue,
  calculateBasisOfRentBasicAnnualRent,
  calculateBasisOfRentDiscountedInitialYearRent,
  calculateBasisOfRentInitialYearRent,
  calculateBasisOfRentSubventionAmount,
  calculateBasisOfRentSubventionPercentage,
  calculateReLeaseDiscountPercent,
  calculateBasicAnnualRentIndexed,
  calculateBasisOfRentSubventionPercent,
  calculateSubventionDiscountTotal,
  calculateSubventionDiscountTotalFromReLease,
  calculateTemporarySubventionDiscountPercentage,
  calculateExtraRent,
  calculateFieldsRent,
  calculateRackAndHeightPrice,
  calculateTemporaryRent,
  getBasisOfRentIndexValue,
  getBasisOfRentById,
  getZonePriceFromValue,
} from "@/leases/helpers";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getUserFullName } from "@/users/helpers";
import {
  copyElementContentsToClipboard,
  displayUIMessage,
  formatDate,
  formatNumber,
  getFieldAttributes,
  getLabelOfOption,
  hasPermissions,
  isEmptyValue,
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
import MastChildrenEdit from "./MastChildrenEdit";
type ManagementSubventionsProps = {
  currentAmountPerArea: number;
  disabled: boolean;
  fields: any;
  formName: string;
  initialYearRent: number;
};

const ManagementSubventions = ({
  currentAmountPerArea,
  disabled,
  fields,
  formName,
  initialYearRent,
}: ManagementSubventionsProps): ReactElement => {
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);

  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        return (
          <>
            {!isFieldAllowedToEdit(
              leaseAttributes,
              BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS,
            ) &&
              (!fields || !fields.length) && (
                <FormText>Ei hallintamuotoja</FormText>
              )}

            {fields && !!fields.length && (
              <Row>
                <Column small={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT,
                      )}
                    >
                      {BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                      )}
                    >
                      {
                        BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                    )}
                  >
                    <FormTextTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                      )}
                    >
                      {
                        BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_PERCENT
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                    )}
                  >
                    <FormTextTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT,
                      )}
                    >
                      {
                        BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT_YEAR
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            )}

            {!!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  appDispatch({
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
                  <BasisOfRentManagementSubventionEdit
                    key={index}
                    currentAmountPerArea={currentAmountPerArea}
                    disabled={disabled}
                    field={field}
                    formName={formName}
                    initialYearRent={initialYearRent}
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
              {!disabled && fields.length < 1 && (
                <Row>
                  <Column>
                    <AddButtonThird
                      label="Lisää hallintamuoto"
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              )}
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

type TemporarySubventionsProps = {
  disabled: boolean;
  fields: any;
  formName: string;
  initialYearRent: number;
  managementSubventions: Record<string, any>;
  temporarySubventions: Record<string, any>;
};

const TemporarySubventions = ({
  disabled,
  fields,
  formName,
  initialYearRent,
  managementSubventions,
  temporarySubventions,
}: TemporarySubventionsProps): ReactElement => {
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);

  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        return (
          <>
            {!isFieldAllowedToEdit(
              leaseAttributes,
              BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS,
            ) &&
              (!fields || !fields.length) && (
                <FormText>Ei tilapäisalennuksia</FormText>
              )}

            {fields && !!fields.length && (
              <Row>
                <Column small={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION,
                      )}
                    >
                      {BasisOfRentTemporarySubventionsFieldTitles.DESCRIPTION}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={4}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
                      )}
                    >
                      {
                        BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_AMOUNT,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_AMOUNT,
                      )}
                    >
                      {
                        BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_AMOUNT
                      }
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            )}

            {!!fields.length &&
              fields.map((field, index) => {
                const handleRemove = () => {
                  appDispatch({
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
                  <BasisOfRentTemporarySubventionEdit
                    key={index}
                    index={index}
                    disabled={disabled}
                    field={field}
                    formName={formName}
                    initialYearRent={initialYearRent}
                    onRemove={handleRemove}
                    managementSubventions={managementSubventions}
                    temporarySubventions={temporarySubventions}
                  />
                );
              })}

            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.ADD_TEMPORARYSUBVENTION,
              )}
            >
              {!disabled && (
                <Row>
                  <Column>
                    <AddButtonThird
                      className="no-bottom-margin"
                      label="Lisää tilapäisalennus"
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              )}
            </Authorization>
          </>
        );
      }}
    </AppConsumer>
  );
};

type renderMastChildrenProps = {
  formName: string;
  parentField: string;
  fields: any;
  fieldsDisabled: boolean;
};

const MastChildren = ({
  formName,
  fields,
  parentField,
  fieldsDisabled,
}: renderMastChildrenProps): ReactElement => {
  return (
    <AppConsumer>
      {() => {
        return (
          <>
            {!!fields.length &&
              fields.map((_, index) => {
                return (
                  <MastChildrenEdit
                    index={index}
                    formName={formName}
                    key={index}
                    parentField={parentField}
                    fieldsDisabled={fieldsDisabled}
                  />
                );
              })}
          </>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  archived: boolean;
  areaUnitOptions: Array<Record<string, any>>;
  field: string;
  formName: string;
  indexOptions: Array<Record<string, any>>;
  intendedUseOptions: Array<Record<string, any>>;
  managementTypeOptions: Array<Record<string, any>>;
  onArchive?: (...args: Array<any>) => any;
  onRemove: (...args: Array<any>) => any;
  onUnarchive?: (...args: Array<any>) => any;
  showLockedAt?: boolean;
  showPlansInspectedAt?: boolean;
  showTotal: boolean;
  subventionTypeOptions: Array<Record<string, any>>;
  totalDiscountedInitialYearRent: number;
};

const BasisOfRentEdit: React.FC<Props> = ({
  archived,
  areaUnitOptions,
  field,
  formName,
  indexOptions,
  intendedUseOptions,
  managementTypeOptions,
  onArchive,
  onRemove,
  onUnarchive,
  showLockedAt = true,
  showPlansInspectedAt = true,
  showTotal,
  subventionTypeOptions,
  totalDiscountedInitialYearRent,
}) => {
  const dispatch = useDispatch();
  const selector = formValueSelector(formName);

  const currentLease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);
  const isSaveClicked = useSelector(getIsSaveClicked);

  const formValues = useSelector(getFormValues(formName)) || {};
  const amountPerArea = useSelector((state) =>
    selector(state, `${field}.amount_per_area`),
  );
  const currentAmountPerArea = useSelector((state) =>
    selector(state, `${field}.current_amount_per_area`),
  );
  const area = useSelector((state) => selector(state, `${field}.area`));
  const zone = useSelector((state) => selector(state, `${field}.zone`));
  const areaUnit = useSelector((state) =>
    selector(state, `${field}.area_unit`),
  );
  const calculatorType = useSelector((state) =>
    selector(state, `${field}.type`),
  );
  const basisOfRent = useSelector((state) => selector(state, `${field}`) || {});
  const discountPercentage = useSelector((state) =>
    selector(state, `${field}.discount_percentage`),
  );
  const id = useSelector((state) => selector(state, `${field}.id`));
  const index = useSelector((state) => selector(state, `${field}.index`));
  const children = useSelector((state) => selector(state, `${field}.children`));
  const intendedUse = useSelector((state) =>
    selector(state, `${field}.intended_use`),
  );
  const lockedAt = useSelector((state) =>
    selector(state, `${field}.locked_at`),
  );
  const managementSubventions = useSelector((state) =>
    selector(state, `${field}.management_subventions`),
  );
  const plansInspectedAt = useSelector((state) =>
    selector(state, `${field}.plans_inspected_at`),
  );
  const price = useSelector((state) =>
    selector(state, `${field}.amount_per_area`),
  );
  const profitMarginPercentage = useSelector((state) =>
    selector(state, `${field}.profit_margin_percentage`),
  );
  const subventionBasePercent = useSelector((state) =>
    selector(state, `${field}.subvention_base_percent`),
  );
  const subventionGraduatedPercent = useSelector((state) =>
    selector(state, `${field}.subvention_graduated_percent`),
  );
  const subventionType = useSelector((state) =>
    selector(state, `${field}.subvention_type`),
  );
  const temporarySubventions = useSelector((state) =>
    selector(state, `${field}.temporary_subventions`),
  );

  const [showSubventions, setShowSubventions] = useState(
    () => !!subventionType || !!temporarySubventions?.length,
  );

  const fieldsToClearOnTypeChange = [
    `${field}.amount_per_area`, // Same field for both "price" and "amountPerArea"
    `${field}.area`,
    `${field}.area_unit`,
    `${field}.base_year_rent`,
    `${field}.current_amount_per_area`,
    `${field}.discount_percentage`,
    `${field}.discounted_initial_year_rent`,
    `${field}.discounted_initial_year_rent_per_month`,
    `${field}.discounted_initial_year_rent_per_month_total`,
    `${field}.discounted_initial_year_rent_per_2_months`,
    `${field}.discounted_initial_year_rent_per_2_months_total`,
    `${field}.index`,
    `${field}.initial_year_rent`,
    `${field}.intended_use`,
    `${field}.profit_margin_percentage`,
    `${field}.subvention_base_percent`,
    `${field}.subvention_discount_percentage`,
    `${field}.subvention_graduated_percent`,
    `${field}.subvention_re_lease_discount_amount`,
    `${field}.subvention_re_lease_discount_precent`,
    `${field}.temporary_subvention_discount_percentage`,
    `${field}.unit_price`,
    `${field}.zone`,
    `${field}.children`,
  ];

  const initialFormValues = (
    calculatorTypeValue: string | null | undefined = calculatorType,
    forceInitialization = false,
  ) => {
    if (!calculatorTypeValue) return;

    const newInitialValues = {
      ...formValues,
    };

    if (forceInitialization) {
      fieldsToClearOnTypeChange.forEach((fieldPath) => {
        set(newInitialValues, fieldPath, undefined);
      });
      set(newInitialValues, `${field}.subvention_type`, null);
    }

    switch (calculatorTypeValue) {
      case CalculatorTypes.MAST: {
        if (!forceInitialization && children && children.length > 0) {
          return;
        }

        const areaDefaultValue = 0;
        set(newInitialValues, `${field}.area`, areaDefaultValue);
        set(newInitialValues, `${field}.children`, [
          { area: areaDefaultValue },
          { area: areaDefaultValue },
        ]);
        break;
      }
      case CalculatorTypes.LEASE:
      case CalculatorTypes.LEASE2022: {
        const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
        const currentAmountPerArea = getBasisOfRentAmountPerArea(
          basisOfRent,
          indexValue,
        );

        set(
          newInitialValues,
          `${field}.current_amount_per_area`,
          currentAmountPerArea,
        );

        // Calculate and set discounts, temporary subvention percents and
        // management subventions manually on initialization to avoid dirtying the form
        set(
          newInitialValues,
          `${field}.discount_percentage`,
          calculateTotalSubventionPercent(),
        );
        set(
          newInitialValues,
          `${field}.temporary_subvention_discount_percentage`,
          formatNumber(
            calculateTemporarySubventionDiscountPercentage(
              temporarySubventions,
            ),
          ),
        );
        if (Array.isArray(managementSubventions)) {
          managementSubventions.forEach((subvention, index) => {
            const subventionPercent = calculateBasisOfRentSubventionPercentage(
              subvention?.subvention_amount,
              currentAmountPerArea,
            );
            set(
              newInitialValues,
              `${field}.management_subventions[${index}].subvention_percent`,
              subventionPercent,
            );
          });
        }
        if (subventionType === SubventionTypes.RE_LEASE) {
          const releaseDiscountPct = calculateReLeaseDiscountPercent(
            subventionBasePercent,
            subventionGraduatedPercent,
          );
          set(
            newInitialValues,
            `${field}.subvention_discount_percentage`,
            releaseDiscountPct.toFixed(2),
          );
        } else if (
          subventionType === SubventionTypes.FORM_OF_MANAGEMENT &&
          managementSubventions?.[0]
        ) {
          set(
            newInitialValues,
            `${field}.subvention_discount_percentage`,
            managementSubventions[0].subvention_percent,
          );
        }
        break;
      }
      default:
        if (!forceInitialization) {
          return;
        }
    }

    // Ensure the calculator type is updated, then the form doesnt end up initialized with new form values for the _previous_ type.
    set(newInitialValues, `${field}.type`, calculatorTypeValue);
    dispatch(initialize(formName, newInitialValues));
  };

  useEffect(() => {
    initialFormValues();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getReLeaseDiscountPercent = useCallback(() => {
    return calculateReLeaseDiscountPercent(
      subventionBasePercent,
      subventionGraduatedPercent,
    );
  }, [subventionBasePercent, subventionGraduatedPercent]);

  const calculateTotalTemporarySubventionPercent = useCallback(() => {
    const temporarySubventionDiscountPercentage =
      calculateTemporarySubventionDiscountPercentage(temporarySubventions);
    dispatch(
      change(
        formName,
        `${field}.temporary_subvention_discount_percentage`,
        formatNumber(temporarySubventionDiscountPercentage),
      ),
    );
  }, [dispatch, formName, field, temporarySubventions]);

  const calculateTotalSubventionPercent = useCallback(() => {
    return calculateBasisOfRentSubventionPercent(
      currentAmountPerArea,
      subventionType,
      subventionBasePercent,
      subventionGraduatedPercent,
      managementSubventions,
      temporarySubventions,
    );
  }, [
    currentAmountPerArea,
    subventionType,
    subventionBasePercent,
    subventionGraduatedPercent,
    managementSubventions,
    temporarySubventions,
  ]);

  const changeDiscounts = useCallback(() => {
    dispatch(
      change(
        formName,
        `${field}.discount_percentage`,
        calculateTotalSubventionPercent(),
      ),
    );

    if (subventionType === SubventionTypes.RE_LEASE) {
      const releaseDiscountPercent = getReLeaseDiscountPercent();
      dispatch(
        change(
          formName,
          `${field}.subvention_discount_percentage`,
          releaseDiscountPercent.toFixed(2),
        ),
      );
    }

    if (subventionType === SubventionTypes.FORM_OF_MANAGEMENT) {
      if (managementSubventions && managementSubventions[0]) {
        dispatch(
          change(
            formName,
            `${field}.subvention_discount_percentage`,
            managementSubventions[0].subvention_percent,
          ),
        );
      }
    }

    calculateTotalTemporarySubventionPercent();
  }, [
    dispatch,
    formName,
    field,
    calculateTotalSubventionPercent,
    subventionType,
    calculateTotalTemporarySubventionPercent,
    getReLeaseDiscountPercent,
    managementSubventions,
  ]);

  useEffect(() => {
    if (
      showSubventions ||
      (temporarySubventions && !!temporarySubventions.length)
    ) {
      // Don't change discount_percent automatically if basis of rent is deleted
      if (
        subventionType !== undefined ||
        subventionBasePercent !== undefined ||
        subventionGraduatedPercent !== undefined ||
        managementSubventions !== undefined ||
        temporarySubventions !== undefined
      ) {
        changeDiscounts();
      }
    }
  }, [
    currentAmountPerArea,
    managementSubventions,
    subventionType,
    subventionBasePercent,
    subventionGraduatedPercent,
    temporarySubventions,
    showSubventions,
    changeDiscounts,
  ]);

  const getAreaText = (amount: number | null | undefined) => {
    if (isEmptyValue(amount)) return "-";
    if (isEmptyValue(areaUnit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} ${getLabelOfOption(areaUnitOptions, areaUnit) || ""}`;
  };

  const getAmountPerAreaText = (amount: number | null | undefined) => {
    if (isEmptyValue(amount)) return "-";
    if (isEmptyValue(areaUnit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} € / ${getLabelOfOption(areaUnitOptions, areaUnit) || ""}`;
  };

  const getPlansInspectedText = () => {
    const savedBasisOfRent = getBasisOfRentById(currentLease, id);
    if (
      !plansInspectedAt ||
      !savedBasisOfRent ||
      !savedBasisOfRent.plans_inspected_at
    )
      return "-";
    if (!savedBasisOfRent.plans_inspected_by)
      return formatDate(savedBasisOfRent.plans_inspected_at) || "-";
    return `${formatDate(savedBasisOfRent.plans_inspected_at) || ""} ${getUserFullName(savedBasisOfRent.plans_inspected_by)}`;
  };

  const getLockedText = () => {
    const savedBasisOfRent = getBasisOfRentById(currentLease, id);
    if (!lockedAt || !savedBasisOfRent || !savedBasisOfRent.locked_at)
      return "-";
    if (!savedBasisOfRent.locked_by)
      return formatDate(savedBasisOfRent.locked_at) || "-";
    return `${formatDate(savedBasisOfRent.locked_at) || ""} ${getUserFullName(savedBasisOfRent.locked_by)}`;
  };

  const handleArchive = () => {
    const savedBasisOfRent = getBasisOfRentById(currentLease, id);

    if (onArchive) {
      onArchive(savedBasisOfRent);
    }
  };

  const handleCopyToClipboard = () => {
    const tableContent = getTableContentForClipBoard(),
      el = document.createElement("table");
    el.className = "sortable-table__clipboard-table";
    el.innerHTML = tableContent;

    if (copyElementContentsToClipboard(el)) {
      displayUIMessage({
        title: "",
        body: "Vuokralaskuri on kopioitu leikepöydälle.",
      });
    }
  };

  const handleUnarchive = () => {
    const savedBasisOfRent = getBasisOfRentById(currentLease, id);

    if (onUnarchive) {
      onUnarchive(savedBasisOfRent);
    }
  };

  const getTableContentForClipBoard = () => {
    const areaText = getAreaText(area);
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const currentAmountPerArea = getBasisOfRentAmountPerArea(
      basisOfRent,
      indexValue,
    );
    const currentAmountPerAreaText = getAmountPerAreaText(currentAmountPerArea);
    const amountPerAreaText = getAmountPerAreaText(amountPerArea);
    const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(
      basisOfRent,
      indexValue,
    );
    const initialYearRent = calculateBasisOfRentInitialYearRent(
      basisOfRent,
      indexValue,
      basicAnnualRent,
    );
    const discountedInitialYearRent =
      calculateBasisOfRentDiscountedInitialYearRent(basisOfRent, indexValue);
    const rentPerMonth =
      discountedInitialYearRent != null ? discountedInitialYearRent / 12 : null;
    const rentPer2Months =
      discountedInitialYearRent != null ? discountedInitialYearRent / 6 : null;
    const temporarySubventionDiscountPercentage =
      calculateTemporarySubventionDiscountPercentage(temporarySubventions);
    let subvention_discount_percentage = null;

    if (subventionType === SubventionTypes.RE_LEASE) {
      const releaseDiscountPercent = getReLeaseDiscountPercent();
      subvention_discount_percentage = releaseDiscountPercent.toFixed(2);
    }

    if (subventionType === SubventionTypes.FORM_OF_MANAGEMENT) {
      if (managementSubventions && managementSubventions[0]) {
        subvention_discount_percentage =
          managementSubventions[0].subvention_percent;
      }
    }

    return `<thead>
        <tr>
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE) ? `<th>${LeaseBasisOfRentsFieldTitles.INTENDED_USE}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) ? `<th>${LeaseBasisOfRentsFieldTitles.AREA}</th>` : ""}
          ${calculatorType === CalculatorTypes.LEASE && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) ? `<th>${LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) ? `<th>${LeaseBasisOfRentsFieldTitles.INDEX}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) ? `<th>${LeaseBasisOfRentsFieldTitles.UNIT_PRICE}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) ? `<th>${LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) ? `<th>${LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) ? `<th>${LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<th>${LeaseBasisOfRentsFieldTitles.SUBVENTION_DISCOUNT_PERCENTAGE}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<th>${LeaseBasisOfRentsFieldTitles.TEMPORARY_DISCOUNT_PERCENTAGE}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<th>${LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<th>${LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH}</th>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<th>${LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS}</th>` : ""}
        </tr>
      </thead>
      <tbody>
        <tr>
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE) ? `<td>${getLabelOfOption(intendedUseOptions, intendedUse) || "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) ? `<td>${areaText}</td>` : ""}
          ${calculatorType === CalculatorTypes.LEASE && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) ? `<td>${amountPerAreaText}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) ? `<td>${getLabelOfOption(indexOptions, index) || "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) ? `<td>${currentAmountPerAreaText}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) ? `<td>${!isEmptyValue(profitMarginPercentage) ? `${formatNumber(profitMarginPercentage)} %` : "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) ? `<td>${!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) ? `<td>${!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<td>${!isEmptyValue(subvention_discount_percentage) ? `${formatNumber(subvention_discount_percentage)} %` : "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<td>${!isEmptyValue(temporarySubventionDiscountPercentage) ? `${formatNumber(temporarySubventionDiscountPercentage)} %` : "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<td>${!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<td>${!isEmptyValue(rentPerMonth) ? `${formatNumber(rentPerMonth)} €/kk` : "-"}</td>` : ""}
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE) ? `<td>${!isEmptyValue(rentPer2Months) ? `${formatNumber(rentPer2Months)} €/2kk` : "-"}</td>` : ""}
        </tr>
      </tbody>`;
  };

  const handleAddSubventions = () => {
    setShowSubventions(true);
  };
  const removeSubventions = () => {
    dispatch(change(formName, `${field}.subvention_type`, null));

    if (!temporarySubventions?.length) {
      setShowSubventions(false);
    }
  };

  // Reset all fields when calculator type changes
  const onChangeTypeOptions = (value: any) => {
    if (value !== calculatorType) {
      setShowSubventions(false);
      initialFormValues(value, true);
    }
  };

  // LEASE: Yksikköhinta(ind 100)
  const onChangeAmountPerArea = (value: any) => {
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const currentAmountPerArea = getBasisOfRentAmountPerArea(
      {
        amount_per_area: value,
      },
      indexValue,
    );
    dispatch(
      change(
        formName,
        `${field}.current_amount_per_area`,
        currentAmountPerArea,
      ),
    );
  };

  // LEASE & LEASE2022: Yksikköhinta (ind)
  const onChangeCurrentAmountPerArea = (value: any) => {
    if (calculatorType === CalculatorTypes.LEASE2022) {
      dispatch(change(formName, `${field}.amount_per_area`, value));
    } else {
      const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
      const amountPerArea = calculateAmountFromValue(value, indexValue);
      dispatch(change(formName, `${field}.amount_per_area`, amountPerArea));
    }
  };

  // LEASE & LEASE2022: Indeksi
  const onChangeIndexOptions = (value: any) => {
    if (calculatorType === CalculatorTypes.LEASE) {
      const indexValue = getBasisOfRentIndexValue(
        {
          index: value,
        },
        indexOptions,
      );
      const currentAmountPerArea = getBasisOfRentAmountPerArea(
        basisOfRent,
        indexValue,
      );
      dispatch(
        change(
          formName,
          `${field}.current_amount_per_area`,
          currentAmountPerArea,
        ),
      );
    }
  };

  const getSubventionDiscountedInitial = () => {
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const releaseDiscountPercent = getReLeaseDiscountPercent();
    const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(
      basisOfRent,
      indexValue,
    );
    const initialYearRent = calculateBasisOfRentInitialYearRent(
      basisOfRent,
      indexValue,
      basicAnnualRent,
    );
    const currentAmountPerArea = getBasisOfRentAmountPerArea(
      basisOfRent,
      indexValue,
    );
    if (subventionType === SubventionTypes.RE_LEASE)
      return calculateSubventionDiscountTotalFromReLease(
        initialYearRent,
        releaseDiscountPercent,
      );
    if (subventionType === SubventionTypes.FORM_OF_MANAGEMENT)
      return calculateSubventionDiscountTotal(
        initialYearRent,
        managementSubventions,
        currentAmountPerArea,
      );
    return 0;
  };

  const savedBasisOfRent = getBasisOfRentById(currentLease, id);
  // Used by all CalculatorTypes
  const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
  const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(
    basisOfRent,
    indexValue,
  );
  const areaText = getAreaText(area);
  const lockedAtText = getLockedText();
  const isLocked = !!savedBasisOfRent && !!savedBasisOfRent.locked_at;
  const isExistingBasisOfRent = !isEmptyValue(id);
  // Used by CalculatorTypes.LEASE
  const amountPerAreaText = getAmountPerAreaText(amountPerArea);
  // Used by CalculatorTypes.LEASE and CalculatorTypes.LEASE2022
  const plansInspectedAtText = getPlansInspectedText();
  const initialYearRent = calculateBasisOfRentInitialYearRent(
    basisOfRent,
    indexValue,
    basicAnnualRent,
  );
  const releaseDiscountPercent = getReLeaseDiscountPercent();
  const releaseDiscountAmount = calculateBasisOfRentSubventionAmount(
    initialYearRent,
    releaseDiscountPercent.toString(),
  );
  const totalSubventionPercent = calculateTotalSubventionPercent();
  const totalSubventionAmount = calculateBasisOfRentSubventionAmount(
    initialYearRent,
    totalSubventionPercent.toString(),
  );
  const subventionDiscountedInitial = getSubventionDiscountedInitial();
  const discountedInitialYearRent =
    calculateBasisOfRentDiscountedInitialYearRent(basisOfRent, indexValue);
  const rentPerMonth =
    discountedInitialYearRent != null ? discountedInitialYearRent / 12 : null;
  const rentPer2Months =
    discountedInitialYearRent != null ? discountedInitialYearRent / 6 : null;
  const rentPerMonthTotal = totalDiscountedInitialYearRent / 12;
  const rentPer2MonthsTotal = totalDiscountedInitialYearRent / 6;
  // Used by CalculatorTypes.TEMPORARY
  const zonePrice = getZonePriceFromValue(zone);
  const temporaryRent = calculateTemporaryRent(zonePrice, area);
  const temporaryRentIndexed = calculateBasicAnnualRentIndexed(
    temporaryRent * 12,
    indexValue,
  );
  // Used by CalculatorTypes.ADDITIONAL_YARD
  const rentExtra = calculateExtraRent(price, area);
  const rentExtraIndexed = calculateBasicAnnualRentIndexed(
    rentExtra,
    indexValue,
  );
  // Used by CalculatorTypes.FIELD
  const fieldsRent = calculateFieldsRent(price, area);
  const basicAnnualFieldRentIndexed = calculateBasicAnnualRentIndexed(
    fieldsRent,
    indexValue,
  );
  // Used by CalculatorTypes.MAST
  const mastAreaRent = 1.5 * calculateFieldsRent(price, area);
  const rackAndHeightPrice = calculateRackAndHeightPrice(children);
  const mastTotal = (mastAreaRent + rackAndHeightPrice) * 0.05;
  const mastTotalIndexed = calculateBasicAnnualRentIndexed(
    mastTotal,
    indexValue,
  );

  // Yksikköhinta (ind)
  // text input
  const UnitPriceFormField = (showLabel: boolean) => (
    <Authorization
      allow={
        isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
        ) &&
        isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
      }
    >
      <>
        {showLabel && (
          <FormTextTitle
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseBasisOfRentsFieldPaths.UNIT_PRICE,
            )}
          >
            {LeaseBasisOfRentsFieldTitles.UNIT_PRICE}
          </FormTextTitle>
        )}
        <FormFieldLegacy
          disableTouched={isSaveClicked}
          onChange={onChangeCurrentAmountPerArea}
          fieldAttributes={{
            decimal_places: 2,
            label: "Yksikköhinta",
            max_digits: 10,
            read_only: false,
            required: false,
            type: "decimal",
          }}
          disabled={isLocked}
          name={`${field}.current_amount_per_area`}
          unit="€"
          invisibleLabel
          overrideValues={{
            label: LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA,
          }}
        />
      </>
    </Authorization>
  );

  // Tuottoprosentti
  // text input
  const ProfitMarginPercentageFormField = () => (
    <Authorization
      allow={isFieldAllowedToRead(
        leaseAttributes,
        LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
      )}
    >
      <FormFieldLegacy
        disableTouched={isSaveClicked}
        fieldAttributes={
          savedBasisOfRent && !!savedBasisOfRent.locked_at
            ? {
                ...getFieldAttributes(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
                ),
                required: false,
              }
            : getFieldAttributes(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
              )
        }
        disabled={isLocked}
        name={`${field}.profit_margin_percentage`}
        unit="%"
        overrideValues={{
          label: LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE,
        }}
        enableUiDataEdit
        tooltipStyle={{
          right: 17,
        }}
        uiDataKey={getUiDataLeaseKey(
          LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
        )}
      />
    </Authorization>
  );

  // Alkuvuosivuokra (ind)
  // Read only text
  const InitialYearRentFormField = () => (
    <Authorization
      allow={
        isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.AREA,
        ) &&
        isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
        ) &&
        isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.INDEX,
        ) &&
        isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
        )
      }
    >
      <>
        <FormTextTitle
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseBasisOfRentsFieldPaths.INITIAL_YEAR_RENT,
          )}
        >
          {LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT}
        </FormTextTitle>
        <FormText>
          {!isEmptyValue(initialYearRent)
            ? `${formatNumber(initialYearRent)} €/v`
            : "-"}
        </FormText>
      </>
    </Authorization>
  );

  // Indeksi
  // Dropdown
  const IndexFormField = () => (
    <Authorization
      allow={isFieldAllowedToRead(
        leaseAttributes,
        LeaseBasisOfRentsFieldPaths.INDEX,
      )}
    >
      <FormFieldLegacy
        disableTouched={isSaveClicked}
        fieldAttributes={{
          ...getFieldAttributes(
            leaseAttributes,
            LeaseBasisOfRentsFieldPaths.INDEX,
          ),
          required: false,
        }}
        onChange={onChangeIndexOptions}
        disabled={isLocked}
        name={`${field}.index`}
        overrideValues={{
          label: LeaseBasisOfRentsFieldTitles.INDEX,
          options: indexOptions,
        }}
        enableUiDataEdit
        uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}
      />
    </Authorization>
  );

  // Perusvuosivuokra (ind 100)
  // Read only
  const BaseYearRentFormField = () => (
    <Authorization
      allow={
        isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.AREA,
        ) &&
        isFieldAllowedToRead(
          leaseAttributes,
          LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
        )
      }
    >
      <>
        <FormTextTitle
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(
            LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT,
          )}
        >
          {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
        </FormTextTitle>
        <FormText>
          {!isEmptyValue(basicAnnualRent)
            ? `${formatNumber(basicAnnualRent)} €/v`
            : "-"}
        </FormText>
      </>
    </Authorization>
  );

  if (archived && savedBasisOfRent) {
    return (
      <BasisOfRent
        areaUnitOptions={areaUnitOptions}
        basisOfRent={basisOfRent}
        indexOptions={indexOptions}
        intendedUseOptions={intendedUseOptions}
        managementTypeOptions={managementTypeOptions}
        onRemove={onRemove}
        onUnarchive={handleUnarchive}
        showTotal={showTotal}
        subventionTypeOptions={subventionTypeOptions}
        totalDiscountedInitialYearRent={totalDiscountedInitialYearRent}
      />
    );
  }

  return (
    <BoxItem className="no-border-on-first-child">
      <BoxContentWrapper>
        <ActionButtonWrapper>
          {(calculatorType === CalculatorTypes.LEASE ||
            calculatorType === CalculatorTypes.LEASE2022) && (
            <CopyToClipboardButton onClick={handleCopyToClipboard} />
          )}
          <Authorization
            allow={isFieldAllowedToEdit(
              leaseAttributes,
              LeaseBasisOfRentsFieldPaths.ARCHIVED_AT,
            )}
          >
            {onArchive && savedBasisOfRent && !savedBasisOfRent.locked_at && (
              <ArchiveButton onClick={handleArchive} />
            )}
          </Authorization>
          {(!savedBasisOfRent || !savedBasisOfRent.locked_at) && (
            <Authorization
              allow={hasPermissions(
                usersPermissions,
                UsersPermissions.DELETE_LEASEBASISOFRENT,
              )}
            >
              <RemoveButton onClick={onRemove} title="Poista vuokralaskuri" />
            </Authorization>
          )}
        </ActionButtonWrapper>
        <Row>
          <Authorization
            allow={isFieldAllowedToRead(
              leaseAttributes,
              LeaseBasisOfRentsFieldPaths.TYPE,
            )}
          >
            <Column small={6} medium={4} large={2}>
              {/* Mark disabled for existing values, prevents stale values leaking between form types. */}
              <FormFieldLegacy
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.TYPE,
                )}
                onChange={onChangeTypeOptions}
                name={`${field}.type`}
                disabled={isLocked || isExistingBasisOfRent}
                overrideValues={{
                  label: "Laskurin tyyppi",
                }}
                enableUiDataEdit
                uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.TYPE)}
              />
            </Column>
          </Authorization>
          {(calculatorType === CalculatorTypes.LEASE ||
            calculatorType === CalculatorTypes.LEASE2022) && (
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.INTENDED_USE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={
                    savedBasisOfRent && !!savedBasisOfRent.locked_at
                      ? {
                          ...getFieldAttributes(
                            leaseAttributes,
                            LeaseBasisOfRentsFieldPaths.INTENDED_USE,
                          ),
                          required: false,
                        }
                      : getFieldAttributes(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.INTENDED_USE,
                        )
                  }
                  disabled={isLocked}
                  name={`${field}.intended_use`}
                  overrideValues={{
                    label: LeaseBasisOfRentsFieldTitles.INTENDED_USE,
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseBasisOfRentsFieldPaths.INTENDED_USE,
                  )}
                />
              </Authorization>
            </Column>
          )}
          {(calculatorType === CalculatorTypes.LEASE ||
            calculatorType === CalculatorTypes.LEASE2022) && (
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={
                  isFieldAllowedToEdit(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.AREA,
                  ) ||
                  isFieldAllowedToEdit(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                  )
                }
                errorComponent={
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.AREA,
                    )}
                  >
                    <>
                      <FormTextTitle
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseBasisOfRentsFieldPaths.AREA,
                        )}
                      >
                        {LeaseBasisOfRentsFieldTitles.AREA}
                      </FormTextTitle>
                      <FormText>{areaText}</FormText>
                    </>
                  </Authorization>
                }
              >
                <>
                  <FormTextTitle
                    required={isFieldRequired(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.AREA,
                    )}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseBasisOfRentsFieldPaths.AREA,
                    )}
                  >
                    {LeaseBasisOfRentsFieldTitles.AREA}
                  </FormTextTitle>
                  <Row>
                    <Column small={6}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.AREA,
                        )}
                      >
                        <FormFieldLegacy
                          disableTouched={isSaveClicked}
                          fieldAttributes={
                            savedBasisOfRent && !!savedBasisOfRent.locked_at
                              ? {
                                  ...getFieldAttributes(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AREA,
                                  ),
                                  required: false,
                                }
                              : getFieldAttributes(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.AREA,
                                )
                          }
                          disabled={isLocked}
                          name={`${field}.area`}
                          invisibleLabel
                          overrideValues={{
                            label: LeaseBasisOfRentsFieldTitles.AREA,
                          }}
                        />
                      </Authorization>
                    </Column>
                    <Column small={6}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                        )}
                      >
                        <FormFieldLegacy
                          disableTouched={isSaveClicked}
                          fieldAttributes={
                            savedBasisOfRent && !!savedBasisOfRent.locked_at
                              ? {
                                  ...getFieldAttributes(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                                  ),
                                  required: false,
                                }
                              : getFieldAttributes(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                                )
                          }
                          disabled={isLocked}
                          name={`${field}.area_unit`}
                          invisibleLabel
                          overrideValues={{
                            label: LeaseBasisOfRentsFieldTitles.AREA_UNIT,
                            options: areaUnitOptions,
                          }}
                        />
                      </Authorization>
                    </Column>
                  </Row>
                </>
              </Authorization>
            </Column>
          )}
          {!!calculatorType &&
            calculatorType !== CalculatorTypes.LEASE &&
            calculatorType !== CalculatorTypes.LEASE2022 && (
              <Column>
                <Row>
                  <Authorization
                    allow={
                      isFieldAllowedToEdit(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.AREA,
                      ) ||
                      isFieldAllowedToEdit(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                      )
                    }
                    errorComponent={
                      <Authorization
                        allow={isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.AREA,
                        )}
                      >
                        <>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                          >
                            {LeaseBasisOfRentsFieldTitles.AREA}
                          </FormTextTitle>
                          <FormText>{areaText}</FormText>
                        </>
                      </Authorization>
                    }
                  >
                    <>
                      {calculatorType === CalculatorTypes.TEMPORARY && (
                        <Column small={6} medium={4} large={2}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                          >
                            <FormFieldLegacy
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.ZONE,
                              )}
                              name={`${field}.zone`}
                              disabled={isLocked}
                              overrideValues={{
                                label: LeaseBasisOfRentsFieldTitles.ZONE,
                              }}
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(
                                LeaseBasisOfRentsFieldPaths.ZONE,
                              )}
                            />
                          </Authorization>
                        </Column>
                      )}
                      {(calculatorType === CalculatorTypes.ADDITIONAL_YARD ||
                        calculatorType === CalculatorTypes.FIELD) && (
                        <Column small={4} medium={2} large={1}>
                          <FormTextTitle
                            required={isFieldRequired(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                          >
                            {LeaseBasisOfRentsFieldTitles.PRICE}
                          </FormTextTitle>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                          >
                            <FormFieldLegacy
                              disableTouched={isSaveClicked}
                              fieldAttributes={
                                savedBasisOfRent && !!savedBasisOfRent.locked_at
                                  ? {
                                      ...getFieldAttributes(
                                        leaseAttributes,
                                        LeaseBasisOfRentsFieldPaths.AREA,
                                      ),
                                      required: false,
                                    }
                                  : getFieldAttributes(
                                      leaseAttributes,
                                      LeaseBasisOfRentsFieldPaths.AREA,
                                    )
                              }
                              name={`${field}.amount_per_area`}
                              disabled={isLocked}
                              invisibleLabel
                              unit="€"
                              overrideValues={{
                                label: LeaseBasisOfRentsFieldTitles.PRICE,
                              }}
                            />
                          </Authorization>
                        </Column>
                      )}
                      {calculatorType === CalculatorTypes.ADDITIONAL_YARD && (
                        <Column small={4} medium={2} large={1}>
                          <FormTextTitle>{"Kerroin"}</FormTextTitle>
                          <FormText>{"* 1,5"}</FormText>
                        </Column>
                      )}
                      {calculatorType === CalculatorTypes.TEMPORARY && (
                        <Column small={4} medium={2} large={1}>
                          <Authorization
                            allow={
                              isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AREA,
                              ) &&
                              isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                              )
                            }
                          >
                            <>
                              <FormTextTitle>{"Hinta"}</FormTextTitle>
                              <FormText>
                                {!isEmptyValue(zonePrice)
                                  ? `${formatNumber(zonePrice)} €`
                                  : "-"}
                              </FormText>
                            </>
                          </Authorization>
                        </Column>
                      )}
                      {calculatorType === CalculatorTypes.MAST && (
                        <Column large={6} medium={9} small={12}>
                          <Row>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={
                                  isFieldAllowedToRead(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AREA,
                                  ) &&
                                  isFieldAllowedToRead(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                                  )
                                }
                              >
                                <>
                                  <FormTextTitle>{"Laskuri"}</FormTextTitle>
                                  <FormText>{`Alue`}</FormText>
                                </>
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                                )}
                              >
                                {
                                  <FormFieldLegacy
                                    disableTouched={isSaveClicked}
                                    fieldAttributes={getFieldAttributes(
                                      leaseAttributes,
                                      LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                                    )}
                                    name={`${field}.amount_per_area`}
                                    disabled={isLocked}
                                    unit="€"
                                    overrideValues={{
                                      label: "Hinta",
                                    }}
                                  />
                                }
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={
                                  isFieldAllowedToRead(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AREA,
                                  ) &&
                                  isFieldAllowedToRead(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                                  )
                                }
                              >
                                <>
                                  <FormTextTitle>{"Kerroin"}</FormTextTitle>
                                  <FormText>{`*1,5`}</FormText>
                                </>
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.AREA,
                                )}
                              >
                                <FormFieldLegacy
                                  disableTouched={isSaveClicked}
                                  fieldAttributes={getFieldAttributes(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AREA,
                                  )}
                                  name={`${field}.area`}
                                  disabled={isLocked}
                                  overrideValues={{
                                    label: "Ala/korkeus",
                                  }}
                                />
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={
                                  isFieldAllowedToRead(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AREA,
                                  ) &&
                                  isFieldAllowedToRead(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                                  )
                                }
                              >
                                <>
                                  <FormTextTitle>{"Yksikkö"}</FormTextTitle>
                                  <FormText>{`m${String.fromCharCode(178)}`}</FormText>
                                </>
                              </Authorization>
                            </Column>
                            <Column small={6} medium={4} large={2}>
                              <Authorization
                                allow={
                                  isFieldAllowedToRead(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AREA,
                                  ) &&
                                  isFieldAllowedToRead(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                                  )
                                }
                              >
                                <>
                                  <FormTextTitle>
                                    {LeaseBasisOfRentsFieldTitles.RENT}
                                  </FormTextTitle>
                                  <FormText>
                                    {!isEmptyValue(mastAreaRent)
                                      ? `${formatNumber(mastAreaRent)} €`
                                      : "-"}
                                  </FormText>
                                </>
                              </Authorization>
                            </Column>
                          </Row>
                        </Column>
                      )}
                      {calculatorType === CalculatorTypes.MAST && (
                        <Column large={6} medium={9} small={12}></Column>
                      )}
                      {calculatorType === CalculatorTypes.MAST && (
                        <AppConsumer>
                          {() => {
                            return (
                              <Column large={6} medium={9} small={12}>
                                <FieldArray
                                  component={MastChildren}
                                  name={`${field}.children`}
                                  formName={formName}
                                  parentField={field}
                                  fieldsDisabled={isLocked}
                                />
                              </Column>
                            );
                          }}
                        </AppConsumer>
                      )}
                      {calculatorType !== CalculatorTypes.MAST && (
                        <Column small={6} medium={4} large={2}>
                          <FormTextTitle
                            required={isFieldRequired(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                          >
                            {LeaseBasisOfRentsFieldTitles.AREA}
                          </FormTextTitle>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                          >
                            <FormFieldLegacy
                              disableTouched={isSaveClicked}
                              fieldAttributes={
                                savedBasisOfRent && !!savedBasisOfRent.locked_at
                                  ? {
                                      ...getFieldAttributes(
                                        leaseAttributes,
                                        LeaseBasisOfRentsFieldPaths.AREA,
                                      ),
                                      required: false,
                                    }
                                  : getFieldAttributes(
                                      leaseAttributes,
                                      LeaseBasisOfRentsFieldPaths.AREA,
                                    )
                              }
                              disabled={isLocked}
                              name={`${field}.area`}
                              invisibleLabel
                              unit={
                                calculatorType === CalculatorTypes.FIELD
                                  ? "ha"
                                  : `m${String.fromCharCode(178)}`
                              }
                              overrideValues={{
                                label: LeaseBasisOfRentsFieldTitles.AREA,
                              }}
                            />
                          </Authorization>
                        </Column>
                      )}
                      {calculatorType === CalculatorTypes.ADDITIONAL_YARD && (
                        <Column
                          small={3}
                          medium={2}
                          large={1}
                          style={{
                            marginTop: 15,
                          }}
                        >
                          <Authorization
                            allow={isFieldAllowedToRead(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.AREA,
                            )}
                          >
                            <FormText>{"*5%"}</FormText>
                          </Authorization>
                        </Column>
                      )}
                      {calculatorType !== CalculatorTypes.MAST && (
                        <Column small={3} medium={2} large={1}>
                          <Authorization
                            allow={
                              isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AREA,
                              ) &&
                              isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                              )
                            }
                          >
                            <>
                              {calculatorType !== CalculatorTypes.TEMPORARY && (
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT,
                                  )}
                                >
                                  {LeaseBasisOfRentsFieldTitles.RENT_PER_YEAR}
                                </FormTextTitle>
                              )}
                              {calculatorType === CalculatorTypes.TEMPORARY && (
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT,
                                  )}
                                >
                                  {LeaseBasisOfRentsFieldTitles.RENT_PER_MONTH}
                                </FormTextTitle>
                              )}
                              {calculatorType === CalculatorTypes.TEMPORARY && (
                                <FormText>
                                  {!isEmptyValue(temporaryRent)
                                    ? `${formatNumber(temporaryRent)} €`
                                    : "-"}
                                </FormText>
                              )}
                              {calculatorType ===
                                CalculatorTypes.ADDITIONAL_YARD && (
                                <FormText>
                                  {!isEmptyValue(rentExtra)
                                    ? `${formatNumber(rentExtra)} €`
                                    : "-"}
                                </FormText>
                              )}
                              {calculatorType === CalculatorTypes.FIELD && (
                                <FormText>
                                  {!isEmptyValue(fieldsRent)
                                    ? `${formatNumber(fieldsRent)} €`
                                    : "-"}
                                </FormText>
                              )}
                            </>
                          </Authorization>
                        </Column>
                      )}
                      {calculatorType === CalculatorTypes.TEMPORARY && (
                        <Column small={3} medium={2} large={1}>
                          <Authorization
                            allow={
                              isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AREA,
                              ) &&
                              isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                              )
                            }
                          >
                            <>
                              {calculatorType === CalculatorTypes.TEMPORARY && (
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT,
                                  )}
                                >
                                  {LeaseBasisOfRentsFieldTitles.RENT_PER_YEAR}
                                </FormTextTitle>
                              )}
                              <FormText>
                                {!isEmptyValue(temporaryRent)
                                  ? `${formatNumber(temporaryRent * 12)} €`
                                  : "-"}
                              </FormText>
                            </>
                          </Authorization>
                        </Column>
                      )}
                      {calculatorType !== CalculatorTypes.MAST && (
                        <Column small={6} medium={4} large={2}>
                          <Authorization
                            allow={isFieldAllowedToRead(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.INDEX,
                            )}
                          >
                            <FormFieldLegacy
                              disableTouched={isSaveClicked}
                              fieldAttributes={
                                savedBasisOfRent && !!savedBasisOfRent.locked_at
                                  ? {
                                      ...getFieldAttributes(
                                        leaseAttributes,
                                        LeaseBasisOfRentsFieldPaths.INDEX,
                                      ),
                                      required: false,
                                    }
                                  : getFieldAttributes(
                                      leaseAttributes,
                                      LeaseBasisOfRentsFieldPaths.INDEX,
                                    )
                              }
                              disabled={isLocked}
                              name={`${field}.index`}
                              overrideValues={{
                                label: LeaseBasisOfRentsFieldTitles.INDEX,
                                options: indexOptions,
                              }}
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(
                                LeaseBasisOfRentsFieldPaths.INDEX,
                              )}
                            />
                          </Authorization>
                        </Column>
                      )}
                      {calculatorType !== CalculatorTypes.MAST && (
                        <Column small={6} medium={4} large={2}>
                          <Authorization
                            allow={
                              isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AREA,
                              ) &&
                              isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                              )
                            }
                          >
                            <>
                              <FormTextTitle
                                enableUiDataEdit
                                uiDataKey={getUiDataLeaseKey(
                                  LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT,
                                )}
                              >
                                {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
                              </FormTextTitle>
                              {calculatorType === CalculatorTypes.TEMPORARY && (
                                <FormText>
                                  {!isEmptyValue(temporaryRentIndexed)
                                    ? `${formatNumber(temporaryRentIndexed)} €/v`
                                    : "-"}
                                </FormText>
                              )}
                              {calculatorType ===
                                CalculatorTypes.ADDITIONAL_YARD && (
                                <FormText>
                                  {!isEmptyValue(rentExtraIndexed)
                                    ? `${formatNumber(rentExtraIndexed)} €/v`
                                    : "-"}
                                </FormText>
                              )}
                              {calculatorType === CalculatorTypes.FIELD && (
                                <FormText>
                                  {!isEmptyValue(basicAnnualFieldRentIndexed)
                                    ? `${formatNumber(basicAnnualFieldRentIndexed)} €/v`
                                    : "-"}
                                </FormText>
                              )}
                            </>
                          </Authorization>
                        </Column>
                      )}
                    </>
                  </Authorization>
                </Row>
              </Column>
            )}
        </Row>

        {calculatorType === CalculatorTypes.LEASE && (
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToEdit(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                )}
                errorComponent={
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                    )}
                  >
                    <>
                      <FormTextTitle
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                        )}
                      >
                        {LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}
                      </FormTextTitle>
                      <FormText>{amountPerAreaText}</FormText>
                    </>
                  </Authorization>
                }
              >
                <>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                    )}
                  >
                    <FormTextTitle
                      required={isFieldRequired(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                      )}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                      )}
                    >
                      {LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}
                    </FormTextTitle>
                  </Authorization>
                  <Row>
                    <Column small={6}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                        )}
                      >
                        <FormFieldLegacy
                          onChange={onChangeAmountPerArea}
                          disableTouched={isSaveClicked}
                          fieldAttributes={
                            savedBasisOfRent && !!savedBasisOfRent.locked_at
                              ? {
                                  ...getFieldAttributes(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                                  ),
                                  required: false,
                                }
                              : getFieldAttributes(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                                )
                          }
                          disabled={isLocked}
                          name={`${field}.amount_per_area`}
                          unit="€"
                          invisibleLabel
                          overrideValues={{
                            label: LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA,
                          }}
                        />
                      </Authorization>
                    </Column>
                    <Column small={6}>
                      <Authorization
                        allow={isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                        )}
                      >
                        <FormFieldLegacy
                          className="with-slash"
                          disableTouched={isSaveClicked}
                          fieldAttributes={
                            savedBasisOfRent && !!savedBasisOfRent.locked_at
                              ? {
                                  ...getFieldAttributes(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                                  ),
                                  required: false,
                                }
                              : getFieldAttributes(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                                )
                          }
                          name={`${field}.area_unit`}
                          disabled
                          invisibleLabel
                          overrideValues={{
                            label: LeaseBasisOfRentsFieldTitles.AREA_UNIT,
                            options: areaUnitOptions,
                          }}
                        />
                      </Authorization>
                    </Column>
                  </Row>
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              {IndexFormField()}
            </Column>
            <Column small={6} medium={4} large={2}>
              {UnitPriceFormField(true)}
            </Column>
            <Column small={6} medium={4} large={2}>
              {ProfitMarginPercentageFormField()}
            </Column>
            <Column small={6} medium={4} large={2}>
              {BaseYearRentFormField()}
            </Column>
            <Column small={6} medium={4} large={2}>
              {InitialYearRentFormField()}
            </Column>
          </Row>
        )}

        {calculatorType === CalculatorTypes.LEASE2022 && (
          <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                )}
              >
                <FormTextTitle
                  required={isFieldRequired(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.UNIT_PRICE,
                  )}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(
                    LeaseBasisOfRentsFieldPaths.UNIT_PRICE,
                  )}
                >
                  {LeaseBasisOfRentsFieldTitles.UNIT_PRICE}
                </FormTextTitle>
              </Authorization>
              <Row>
                <Column small={6}>{UnitPriceFormField(false)}</Column>
                <Column small={6}>
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                    )}
                  >
                    <FormFieldLegacy
                      className="with-slash"
                      disableTouched={isSaveClicked}
                      fieldAttributes={
                        savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {
                              ...getFieldAttributes(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                              ),
                              required: false,
                            }
                          : getFieldAttributes(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.AREA_UNIT,
                            )
                      }
                      name={`${field}.area_unit`}
                      disabled
                      invisibleLabel
                      overrideValues={{
                        label: LeaseBasisOfRentsFieldTitles.AREA_UNIT,
                        options: areaUnitOptions,
                      }}
                    />
                  </Authorization>
                </Column>
              </Row>
            </Column>
            <Column small={6} medium={4} large={2}>
              {ProfitMarginPercentageFormField()}
            </Column>
            <Column small={6} medium={4} large={2}>
              {InitialYearRentFormField()}
            </Column>
            <Column small={6} medium={4} large={2}>
              {IndexFormField()}
            </Column>
            <Column small={6} medium={4} large={2}>
              {BaseYearRentFormField()}
            </Column>
          </Row>
        )}

        {(subventionType === SubventionTypes.FORM_OF_MANAGEMENT ||
          subventionType === SubventionTypes.RE_LEASE) &&
          showSubventions &&
          (calculatorType === CalculatorTypes.LEASE ||
            calculatorType === CalculatorTypes.LEASE2022) && (
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={
                      savedBasisOfRent && !!savedBasisOfRent.locked_at
                        ? {
                            ...getFieldAttributes(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                            ),
                            required: false,
                          }
                        : getFieldAttributes(
                            leaseAttributes,
                            LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                          )
                    }
                    disabled={
                      (savedBasisOfRent && !!savedBasisOfRent.locked_at) ||
                      showSubventions
                    }
                    name={`${field}.subvention_discount_percentage`}
                    unit="%"
                    overrideValues={{
                      label: "Subventioprosentti",
                    }}
                    enableUiDataEdit
                    tooltipStyle={{
                      right: 17,
                    }}
                  />
                </Authorization>
              </Column>
              <Column small={5} medium={4} large={3}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                  )}
                >
                  <>
                    <FormTextTitle>
                      {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL}
                    </FormTextTitle>
                    <FormText>
                      {!isEmptyValue(subventionDiscountedInitial)
                        ? `${formatNumber(subventionDiscountedInitial)} €/v`
                        : "-"}
                    </FormText>
                  </>
                </Authorization>
              </Column>
              <Column small={0} medium={3} large={6}></Column>
            </Row>
          )}

        {showSubventions &&
          (calculatorType === CalculatorTypes.LEASE ||
            calculatorType === CalculatorTypes.LEASE2022) && (
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                  )}
                >
                  <FormFieldLegacy
                    disableTouched={isSaveClicked}
                    fieldAttributes={
                      savedBasisOfRent && !!savedBasisOfRent.locked_at
                        ? {
                            ...getFieldAttributes(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                            ),
                            required: false,
                          }
                        : getFieldAttributes(
                            leaseAttributes,
                            LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                          )
                    }
                    disabled={
                      (savedBasisOfRent && !!savedBasisOfRent.locked_at) ||
                      showSubventions
                    }
                    name={`${field}.temporary_subvention_discount_percentage`}
                    unit="%"
                    overrideValues={{
                      label: "Tilapäisalennuksen prosentti",
                    }}
                    enableUiDataEdit
                    tooltipStyle={{
                      right: 17,
                    }}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={8} large={10}></Column>
            </Row>
          )}

        {(calculatorType === CalculatorTypes.LEASE ||
          calculatorType === CalculatorTypes.LEASE2022) && (
          <Row>
            <Column small={6} medium={4} large={2} hidden>
              <Authorization
                allow={isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                )}
              >
                <FormFieldLegacy
                  disableTouched={isSaveClicked}
                  fieldAttributes={{
                    label: "Lopullinen alennusprosentti",
                    read_only: true,
                    required: false,
                    type: "string",
                  }}
                  disabled={
                    (savedBasisOfRent && !!savedBasisOfRent.locked_at) ||
                    showSubventions
                  }
                  name={`${field}.discount_percentage`}
                  overrideValues={{
                    label: LeaseBasisOfRentsFieldTitles.DISCOUNT_PERCENTAGE,
                  }}
                  enableUiDataEdit
                  tooltipStyle={{
                    right: 17,
                  }}
                  uiDataKey={getUiDataLeaseKey(
                    LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                  )}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={3}>
              <Authorization
                allow={
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.AREA,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.INDEX,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                  )
                }
              >
                <>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT,
                    )}
                  >
                    {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT}
                  </FormTextTitle>
                  <FormText>
                    {!isEmptyValue(discountedInitialYearRent)
                      ? `${formatNumber(discountedInitialYearRent)} €/v`
                      : "-"}
                  </FormText>
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.AREA,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.INDEX,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                  )
                }
              >
                <>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH,
                    )}
                  >
                    {
                      LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH
                    }
                  </FormTextTitle>
                  <FormText>
                    {!isEmptyValue(rentPerMonth)
                      ? `${formatNumber(rentPerMonth)} €`
                      : "-"}
                  </FormText>
                </>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.AREA,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.INDEX,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                  )
                }
              >
                <>
                  <FormTextTitle
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(
                      LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS,
                    )}
                  >
                    {
                      LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS
                    }
                  </FormTextTitle>
                  <FormText>
                    {!isEmptyValue(rentPer2Months)
                      ? `${formatNumber(rentPer2Months)} €`
                      : "-"}
                  </FormText>
                </>
              </Authorization>
            </Column>
            {showTotal && (
              <>
                <Column small={6} medium={4} large={2}>
                  <Authorization
                    allow={
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.AREA,
                      ) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                      ) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.INDEX,
                      ) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
                      ) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                      )
                    }
                  >
                    <>
                      <FormTextTitle
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL,
                        )}
                      >
                        {
                          LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL
                        }
                      </FormTextTitle>
                      <FormText>
                        {!isEmptyValue(rentPerMonthTotal)
                          ? `${formatNumber(rentPerMonthTotal)} €`
                          : "-"}
                      </FormText>
                    </>
                  </Authorization>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Authorization
                    allow={
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.AREA,
                      ) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                      ) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.INDEX,
                      ) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE,
                      ) &&
                      isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE,
                      )
                    }
                  >
                    <>
                      <FormTextTitle
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(
                          LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL,
                        )}
                      >
                        {
                          LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL
                        }
                      </FormTextTitle>
                      <FormText>
                        {!isEmptyValue(rentPer2MonthsTotal)
                          ? `${formatNumber(rentPer2MonthsTotal)} €`
                          : "-"}
                      </FormText>
                    </>
                  </Authorization>
                </Column>
              </>
            )}
          </Row>
        )}

        {calculatorType === CalculatorTypes.MAST && (
          <Row>
            <Authorization
              allow={
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.AREA,
                ) &&
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                )
              }
            >
              <>
                <Column large={2} medium={4} small={6}></Column>
                <Column>
                  <Row>
                    <Column small={6}>
                      <Divider />
                    </Column>
                  </Row>
                </Column>
              </>
            </Authorization>
          </Row>
        )}

        {calculatorType === CalculatorTypes.MAST && (
          <Row>
            <Authorization
              allow={
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.AREA,
                ) &&
                isFieldAllowedToRead(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                )
              }
            >
              <>
                <Column large={2} medium={4} small={6}></Column>
                <Column>
                  <Row>
                    <Column small={6}>
                      <Row>
                        <Column small={6} medium={4} large={2}>
                          <FormText className="semibold">{"Yhteensä"}</FormText>
                        </Column>
                        <Column small={6}></Column>
                        <Column small={6} medium={4} large={2}>
                          <FormText>{"*5%"}</FormText>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <FormText className="semibold">{`${formatNumber(mastTotal)} €`}</FormText>
                        </Column>
                      </Row>
                    </Column>
                    <Column
                      small={6}
                      medium={4}
                      large={2}
                      style={{
                        marginTop: -15,
                      }}
                    >
                      <Authorization
                        allow={isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.INDEX,
                        )}
                      >
                        <FormFieldLegacy
                          disableTouched={isSaveClicked}
                          fieldAttributes={
                            savedBasisOfRent && !!savedBasisOfRent.locked_at
                              ? {
                                  ...getFieldAttributes(
                                    leaseAttributes,
                                    LeaseBasisOfRentsFieldPaths.INDEX,
                                  ),
                                  required: false,
                                }
                              : getFieldAttributes(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.INDEX,
                                )
                          }
                          disabled={isLocked}
                          name={`${field}.index`}
                          overrideValues={{
                            label: LeaseBasisOfRentsFieldTitles.INDEX,
                            options: indexOptions,
                          }}
                          enableUiDataEdit
                          uiDataKey={getUiDataLeaseKey(
                            LeaseBasisOfRentsFieldPaths.INDEX,
                          )}
                        />
                      </Authorization>
                    </Column>
                    <Column
                      small={6}
                      medium={4}
                      large={2}
                      style={{
                        marginTop: -15,
                      }}
                    >
                      <Authorization
                        allow={
                          isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseBasisOfRentsFieldPaths.AREA,
                          ) &&
                          isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                          )
                        }
                      >
                        <>
                          <FormTextTitle
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT,
                            )}
                          >
                            {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
                          </FormTextTitle>
                          <FormText>
                            {!isEmptyValue(mastTotalIndexed)
                              ? `${formatNumber(mastTotalIndexed)} €/v`
                              : "-"}
                          </FormText>
                        </>
                      </Authorization>
                    </Column>
                  </Row>
                </Column>
              </>
            </Authorization>
          </Row>
        )}

        <Row>
          {showPlansInspectedAt &&
            (calculatorType === CalculatorTypes.LEASE ||
              calculatorType === CalculatorTypes.LEASE2022) && (
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToEdit(
                    leaseAttributes,
                    LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT,
                  )}
                  errorComponent={
                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT,
                      )}
                    >
                      <>
                        <FormTextTitle>
                          {LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}
                        </FormTextTitle>
                        <FormText>{plansInspectedAtText}</FormText>
                      </>
                    </Authorization>
                  }
                >
                  <FormFieldLegacy
                    className="with-top-padding"
                    disableTouched={isSaveClicked}
                    fieldAttributes={
                      savedBasisOfRent && !!savedBasisOfRent.locked_at
                        ? {
                            ...getFieldAttributes(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT,
                            ),
                            required: false,
                            type: "checkbox-date-time",
                          }
                        : {
                            ...getFieldAttributes(
                              leaseAttributes,
                              LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT,
                            ),
                            type: "checkbox-date-time",
                          }
                    }
                    disabled={isLocked}
                    invisibleLabel
                    name={`${field}.plans_inspected_at`}
                    overrideValues={{
                      label: LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT,
                    }}
                  />
                </Authorization>
              </Column>
            )}

          {showLockedAt && (
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToEdit(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.LOCKED_AT,
                )}
                errorComponent={
                  <Authorization
                    allow={isFieldAllowedToRead(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.LOCKED_AT,
                    )}
                  >
                    <>
                      <FormTextTitle>
                        {LeaseBasisOfRentsFieldTitles.LOCKED_AT}
                      </FormTextTitle>
                      <FormText>{lockedAtText}</FormText>
                    </>
                  </Authorization>
                }
              >
                <FormFieldLegacy
                  className="with-top-padding"
                  disableTouched={isSaveClicked}
                  fieldAttributes={{
                    ...getFieldAttributes(
                      leaseAttributes,
                      LeaseBasisOfRentsFieldPaths.LOCKED_AT,
                    ),
                    type: "checkbox-date-time",
                  }}
                  invisibleLabel
                  name={`${field}.locked_at`}
                  overrideValues={{
                    label: LeaseBasisOfRentsFieldTitles.LOCKED_AT,
                  }}
                />
              </Authorization>
            </Column>
          )}
        </Row>

        {(!savedBasisOfRent || !savedBasisOfRent.locked_at) &&
          !showSubventions &&
          (calculatorType === CalculatorTypes.LEASE ||
            calculatorType === CalculatorTypes.LEASE2022) && (
            <Authorization
              allow={isFieldAllowedToRead(
                leaseAttributes,
                LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE,
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
        {showSubventions &&
          (calculatorType === CalculatorTypes.LEASE ||
            calculatorType === CalculatorTypes.LEASE2022) && (
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
                  <WhiteBox>
                    {(!savedBasisOfRent || !savedBasisOfRent.locked_at) && (
                      <ActionButtonWrapper>
                        <RemoveButton
                          onClick={handleRemoveSubventions}
                          title="Poista subventiot"
                        />
                      </ActionButtonWrapper>
                    )}
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE,
                          )}
                        >
                          <FormFieldLegacy
                            disableTouched={isSaveClicked}
                            fieldAttributes={{
                              ...getFieldAttributes(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE,
                              ),
                              required: false,
                            }}
                            name={`${field}.subvention_type`}
                            disabled={isLocked}
                            overrideValues={{
                              label:
                                LeaseBasisOfRentsFieldTitles.SUBVENTION_TYPE,
                            }}
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(
                              LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE,
                            )}
                          />
                        </Authorization>
                      </Column>
                    </Row>
                    {subventionType === SubventionTypes.FORM_OF_MANAGEMENT &&
                      (calculatorType === CalculatorTypes.LEASE ||
                        calculatorType === CalculatorTypes.LEASE2022) && (
                        <Authorization
                          allow={isFieldAllowedToRead(
                            leaseAttributes,
                            BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS,
                          )}
                        >
                          <>
                            <SubTitle
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(
                                BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS,
                              )}
                            >
                              {
                                BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT_SUBVENTIONS
                              }
                            </SubTitle>
                            <FieldArray
                              component={ManagementSubventions}
                              disabled={isLocked}
                              formName={formName}
                              initialYearRent={initialYearRent}
                              currentAmountPerArea={currentAmountPerArea}
                              name={`${field}.management_subventions`}
                            />
                          </>
                        </Authorization>
                      )}
                    {subventionType === SubventionTypes.RE_LEASE &&
                      (calculatorType === CalculatorTypes.LEASE ||
                        calculatorType === CalculatorTypes.LEASE2022) && (
                        <Row>
                          <Column small={4} large={2}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT,
                                )}
                                name={`${field}.subvention_base_percent`}
                                disabled={isLocked}
                                overrideValues={{
                                  label:
                                    LeaseBasisOfRentsFieldTitles.SUBVENTION_BASE_PERCENT,
                                }}
                                unit="%"
                                enableUiDataEdit
                                uiDataKey={getUiDataLeaseKey(
                                  LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT,
                                )}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4} large={2}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT,
                              )}
                            >
                              <FormFieldLegacy
                                disableTouched={isSaveClicked}
                                fieldAttributes={getFieldAttributes(
                                  leaseAttributes,
                                  LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT,
                                )}
                                name={`${field}.subvention_graduated_percent`}
                                disabled={isLocked}
                                overrideValues={{
                                  label:
                                    LeaseBasisOfRentsFieldTitles.SUBVENTION_GRADUATED_PERCENT,
                                }}
                                unit="%"
                                enableUiDataEdit
                                uiDataKey={getUiDataLeaseKey(
                                  LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT,
                                )}
                              />
                            </Authorization>
                          </Column>
                          <Column small={4} large={2}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT,
                              )}
                            >
                              <>
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT,
                                  )}
                                >
                                  {
                                    LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT
                                  }
                                </FormTextTitle>
                                <FormText>
                                  {formatNumber(releaseDiscountPercent)} %
                                </FormText>
                              </>
                            </Authorization>
                          </Column>
                          <Column small={4} large={2}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                leaseAttributes,
                                LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT,
                              )}
                            >
                              <>
                                <FormTextTitle
                                  enableUiDataEdit
                                  uiDataKey={getUiDataLeaseKey(
                                    LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT,
                                  )}
                                >
                                  {
                                    LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT
                                  }
                                </FormTextTitle>
                                <FormText>
                                  {formatNumber(releaseDiscountAmount)} €
                                </FormText>
                              </>
                            </Authorization>
                          </Column>
                        </Row>
                      )}

                    <Authorization
                      allow={isFieldAllowedToRead(
                        leaseAttributes,
                        BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS,
                      )}
                    >
                      <>
                        <SubTitle
                          enableUiDataEdit
                          uiDataKey={getUiDataLeaseKey(
                            BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS,
                          )}
                        >
                          {
                            BasisOfRentTemporarySubventionsFieldTitles.TEMPORARY_SUBVENTIONS
                          }
                        </SubTitle>
                        <FieldArray
                          component={TemporarySubventions}
                          disabled={isLocked}
                          formName={formName}
                          initialYearRent={initialYearRent}
                          name={`${field}.temporary_subventions`}
                          managementSubventions={managementSubventions}
                          temporarySubventions={temporarySubventions}
                        />
                      </>
                    </Authorization>

                    <Authorization
                      allow={
                        isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.AREA,
                        ) &&
                        isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA,
                        ) &&
                        isFieldAllowedToRead(
                          leaseAttributes,
                          LeaseBasisOfRentsFieldPaths.INDEX,
                        )
                      }
                    >
                      <>
                        <Row>
                          <Column small={12} large={8}>
                            <Divider />
                          </Column>
                        </Row>
                        <Row>
                          <Column small={4} large={6}>
                            <FormText className="semibold">Yhteensä</FormText>
                          </Column>
                          <Column small={4} large={2}>
                            <FormText className="semibold">
                              {formatNumber(totalSubventionAmount)} €
                            </FormText>
                          </Column>
                        </Row>
                      </>
                    </Authorization>
                  </WhiteBox>
                );
              }}
            </AppConsumer>
          )}
      </BoxContentWrapper>
    </BoxItem>
  );
};

export default BasisOfRentEdit;
