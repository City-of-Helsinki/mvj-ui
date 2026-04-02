import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import FormField from "@/components/form/final-form/FormField";
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
import { useForm, useFormState } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { useFieldValue } from "@/components/helpers";
type ManagementSubventionsProps = {
  currentAmountPerArea: number;
  disabled: boolean;
  fields: any;
  initialYearRent: number;
};

const ManagementSubventions = ({
  currentAmountPerArea,
  disabled,
  fields,
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
  initialYearRent: number;
  managementSubventions: Record<string, any>;
  temporarySubventions: Record<string, any>;
};

const TemporarySubventions = ({
  disabled,
  fields,
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
  parentField: string;
  fields: any;
  fieldsDisabled: boolean;
};

const MastChildren = ({
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
  const form = useForm();
  const currentLease = useSelector(getCurrentLease);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions = useSelector(getUsersPermissions);
  const isSaveClicked = useSelector(getIsSaveClicked);

  const { values: formValues } = useFormState({
    subscription: { values: true },
  });

  const amountPerArea = useFieldValue(`${field}.amount_per_area`);
  const currentAmountPerArea = useFieldValue(
    `${field}.current_amount_per_area`,
  );
  const area = useFieldValue(`${field}.area`);
  const zone = useFieldValue(`${field}.zone`);
  const areaUnit = useFieldValue(`${field}.area_unit`);
  const calculatorType = useFieldValue(`${field}.type`);
  const basisOfRent = useFieldValue(`${field}`);
  const discountPercentage = useFieldValue(`${field}.discount_percentage`);
  const id = useFieldValue(`${field}.id`);
  const index = useFieldValue(`${field}.index`);
  const children = useFieldValue(`${field}.children`);
  const intendedUse = useFieldValue(`${field}.intended_use`);
  const lockedAt = useFieldValue(`${field}.locked_at`);
  const managementSubventions = useFieldValue(
    `${field}.management_subventions`,
  );
  const plansInspectedAt = useFieldValue(`${field}.plans_inspected_at`);
  const price = useFieldValue(`${field}.amount_per_area`);
  const profitMarginPercentage = useFieldValue(
    `${field}.profit_margin_percentage`,
  );
  const subventionBasePercent = useFieldValue(
    `${field}.subvention_base_percent`,
  );
  const subventionGraduatedPercent = useFieldValue(
    `${field}.subvention_graduated_percent`,
  );
  const subventionType = useFieldValue(`${field}.subvention_type`);
  const temporarySubventions = useFieldValue(`${field}.temporary_subventions`);

  const [showSubventions, setShowSubventions] = useState(
    () => !!subventionType || !!temporarySubventions?.length,
  );

  const ensureMastChildrenInitialized = useCallback(() => {
    // Initialize MAST children with 2 items if calculator type is MAST and children are empty
    if (
      calculatorType === CalculatorTypes.MAST &&
      (!children || children.length === 0)
    ) {
      form.change(`${field}.children`, [{}, {}]);
    }
  }, [calculatorType, children, field, form]);

  const initialFormValues = () => {
    changeDiscounts();
    ensureMastChildrenInitialized();
    if (
      calculatorType &&
      (calculatorType === CalculatorTypes.LEASE ||
        calculatorType === CalculatorTypes.LEASE2022)
    ) {
      const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
      const currentAmountPerArea = getBasisOfRentAmountPerArea(
        basisOfRent,
        indexValue,
      );
      const newInitialValues = {
        ...formValues,
      };
      set(
        newInitialValues,
        `${field}.current_amount_per_area`,
        currentAmountPerArea,
      );
      // re-initialize the form in order to avoid dirty states on field(s) that change
      form.initialize(newInitialValues);
    }
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
    form.change(
      `${field}.temporary_subvention_discount_percentage`,
      formatNumber(temporarySubventionDiscountPercentage),
    );
  }, [field, form, temporarySubventions]);

  const calculateTotalSubventionPercent = useCallback(() => {
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const currentAmountPerArea = getBasisOfRentAmountPerArea(
      basisOfRent,
      indexValue,
    );
    return calculateBasisOfRentSubventionPercent(
      currentAmountPerArea,
      subventionType,
      subventionBasePercent,
      subventionGraduatedPercent,
      managementSubventions,
      temporarySubventions,
    );
  }, [
    basisOfRent,
    indexOptions,
    subventionType,
    subventionBasePercent,
    subventionGraduatedPercent,
    managementSubventions,
    temporarySubventions,
  ]);

  const changeDiscounts = useCallback(() => {
    form.change(
      `${field}.discount_percentage`,
      calculateTotalSubventionPercent(),
    );

    if (subventionType === SubventionTypes.RE_LEASE) {
      const releaseDiscountPercent = getReLeaseDiscountPercent();
      form.change(
        `${field}.subvention_discount_percentage`,
        releaseDiscountPercent.toFixed(2),
      );
    }

    if (subventionType === SubventionTypes.FORM_OF_MANAGEMENT) {
      if (managementSubventions && managementSubventions[0]) {
        form.change(
          `${field}.subvention_discount_percentage`,
          managementSubventions[0].subvention_percent,
        );
      }
    }

    calculateTotalTemporarySubventionPercent();
  }, [
    form,
    field,
    calculateTotalSubventionPercent,
    subventionType,
    calculateTotalTemporarySubventionPercent,
    getReLeaseDiscountPercent,
    managementSubventions,
  ]);

  useEffect(() => {
    ensureMastChildrenInitialized();
    if (
      showSubventions ||
      (temporarySubventions && !!temporarySubventions.length)
    ) {
      if (managementSubventions !== undefined) {
        changeDiscounts();
      }

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
    ensureMastChildrenInitialized,
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
    form.change(`${field}.subvention_type`, null);

    if (!temporarySubventions?.length) {
      setShowSubventions(false);
    }
  };

  const clearAllFields = () => {
    form.batch(() => {
      form.change(`${field}.amount_per_area`, undefined); // Same field for both "price" and "amountPerArea"
      form.change(`${field}.area`, undefined);
      form.change(`${field}.area_unit`, undefined);
      form.change(`${field}.base_year_rent`, undefined);
      form.change(`${field}.current_amount_per_area`, undefined);
      form.change(`${field}.discount_percentage`, undefined);
      form.change(`${field}.discounted_initial_year_rent`, undefined);
      form.change(`${field}.discounted_initial_year_rent_per_month`, undefined);
      form.change(
        `${field}.discounted_initial_year_rent_per_month_total`,
        undefined,
      );
      form.change(
        `${field}.discounted_initial_year_rent_per_2_months`,
        undefined,
      );
      form.change(
        `${field}.discounted_initial_year_rent_per_2_months_total`,
        undefined,
      );
      form.change(`${field}.index`, undefined);
      form.change(`${field}.initial_year_rent`, undefined);
      form.change(`${field}.intended_use`, undefined);
      form.change(`${field}.profit_margin_percentage`, undefined);
      form.change(`${field}.subvention_base_percent`, undefined);
      form.change(`${field}.subvention_discount_percentage`, undefined);
      form.change(`${field}.subvention_graduated_percent`, undefined);
      form.change(`${field}.subvention_re_lease_discount_amount`, undefined);
      form.change(`${field}.subvention_re_lease_discount_precent`, undefined);
      form.change(
        `${field}.temporary_subvention_discount_percentage`,
        undefined,
      );
      form.change(`${field}.unit_price`, undefined);
      form.change(`${field}.zone`, undefined);
    });
  };

  // Reset all fields when calculator type changes
  const onChangeTypeOptions = (value: any) => {
    if (value !== calculatorType) {
      clearAllFields();
      removeSubventions();
      initialFormValues();

      // Initialize MAST children with 2 items (Laitekaappi and Masto)
      if (value === CalculatorTypes.MAST) {
        form.change(`${field}.children`, [{}, {}]);
      }
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
    form.change(`${field}.current_amount_per_area`, currentAmountPerArea);
  };

  // LEASE & LEASE2022: Yksikköhinta (ind)
  const onChangeCurrentAmountPerArea = (value: any) => {
    if (calculatorType === CalculatorTypes.LEASE2022) {
      form.change(`${field}.amount_per_area`, value);
    } else {
      const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
      const amountPerArea = calculateAmountFromValue(value, indexValue);
      form.change(`${field}.amount_per_area`, amountPerArea);
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
      form.change(`${field}.current_amount_per_area`, currentAmountPerArea);
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
        <FormField
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
      <FormField
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
      <FormField
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
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(
                  leaseAttributes,
                  LeaseBasisOfRentsFieldPaths.TYPE,
                )}
                onChange={onChangeTypeOptions}
                name={`${field}.type`}
                disabled={isLocked}
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
                <FormField
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
                        <FormField
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
                        <FormField
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
                            <FormField
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
                            <FormField
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
                                  <FormField
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
                                <FormField
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
                                <FieldArray name={`${field}.children`}>
                                  {(fieldArrayProps) =>
                                    MastChildren({
                                      ...fieldArrayProps,
                                      parentField: field,
                                      fieldsDisabled: isLocked,
                                    })
                                  }
                                </FieldArray>
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
                            <FormField
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
                            <FormField
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
                        <FormField
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
                        <FormField
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
                    <FormField
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
                  <FormField
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
                  <FormField
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
                <FormField
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
                        <FormField
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
                  <FormField
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
                <FormField
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
              {({ dispatch: appDispatch }) => {
                const handleRemoveSubventions = () => {
                  appDispatch({
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
                          <FormField
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
                              name={`${field}.management_subventions`}
                            >
                              {(fieldArrayProps) =>
                                ManagementSubventions({
                                  ...fieldArrayProps,
                                  disabled: isLocked,
                                  initialYearRent: initialYearRent,
                                  currentAmountPerArea: currentAmountPerArea,
                                })
                              }
                            </FieldArray>
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
                              <FormField
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
                              <FormField
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
                        <FieldArray name={`${field}.temporary_subventions`}>
                          {(fieldArrayProps) =>
                            TemporarySubventions({
                              ...fieldArrayProps,
                              disabled: isLocked,
                              initialYearRent: initialYearRent,
                              managementSubventions: managementSubventions,
                              temporarySubventions: temporarySubventions,
                            })
                          }
                        </FieldArray>
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
