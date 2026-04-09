import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Authorization from "@/components/authorization/Authorization";
import BasicInfoEdit from "./BasicInfoEdit";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import Collapse from "@/components/collapse/Collapse";
import CollapseHeaderSubtitle from "@/components/collapse/CollapseHeaderSubtitle";
import ContractRentsEdit from "./ContractRentsEdit";
import EqualizedRents from "./EqualizedRents";
import FixedInitialYearRentsEdit from "./FixedInitialYearRentsEdit";
import IndexAdjustedRents from "./IndexAdjustedRents";
import PayableRents from "./PayableRents";
import RentAdjustmentsEdit from "./RentAdjustmentsEdit";
import { receiveCollapseStates } from "@/leases/actions";
import { FormNames, ViewModes } from "@/enums";
import {
  ContractRentPeriods,
  LeaseRentsFieldPaths,
  LeaseRentFixedInitialYearRentsFieldPaths,
  LeaseRentFixedInitialYearRentsFieldTitles,
  LeaseRentContractRentsFieldPaths,
  LeaseRentContractRentsFieldTitles,
  LeaseIndexAdjustedRentsFieldPaths,
  LeaseIndexAdjustedRentsFieldTitles,
  LeaseRentAdjustmentsFieldPaths,
  LeaseRentAdjustmentsFieldTitles,
  LeasePayableRentsFieldPaths,
  LeasePayableRentsFieldTitles,
  LeaseEqualizedRentsFieldPaths,
  LeaseEqualizedRentsFieldTitles,
  RentDueDateTypes,
  RentTypes,
  LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles,
} from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import {
  formatDateRange,
  getFieldOptions,
  getLabelOfOption,
  hasPermissions,
  isActive,
  isArchived,
  isEmptyValue,
  isFieldAllowedToRead,
} from "@/util/helpers";
import {
  getAttributes as getLeaseAttributes,
  getCollapseStateByKey,
  getErrorsByFormName,
  getIsSaveClicked,
  getCurrentLeaseTypeIdentifier,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import OldDwellingsInHousingCompaniesPriceIndexEdit from "./OldDwellingsInHousingCompaniesPriceIndexEdit";
import { getOldDwellingsInHousingCompaniesPriceIndex } from "@/oldDwellingsInHousingCompaniesPriceIndex/selectors";
import { isATypedLease } from "@/leases/helpers";
import { useForm } from "react-final-form";
import { useFieldValue } from "@/components/helpers";

type Props = {
  field: string;
  index: number;
  onRemove: (...args: Array<any>) => any;
  rents: Array<Record<string, any>>;
};

const formName = FormNames.LEASE_RENTS;

const getRentById = (rents: Array<Record<string, any>>, id: number) => {
  if (!id) return null;
  return rents.find((rent) => rent.id === id);
};

const RentItemEdit: React.FC<Props> = ({ field, index, onRemove, rents }) => {
  const dispatch = useDispatch();
  const form = useForm();
  const rentId = useFieldValue(`${field}.id`);
  const contractRents = useFieldValue(`${field}.contract_rents`);
  const dueDates = useFieldValue(`${field}.due_dates`);
  const dueDatesType = useFieldValue(`${field}.due_dates_type`);
  const fixedInitialYearRents = useFieldValue(
    `${field}.fixed_initial_year_rents`,
  );
  const rentOldDwellingsInHousingCompaniesPriceIndex = useFieldValue(
    `${field}.old_dwellings_in_housing_companies_price_index`,
  );
  const rentAdjustments = useFieldValue(`${field}.rent_adjustments`);
  const rentType = useFieldValue(`${field}.type`);
  const usersPermissions = useSelector(getUsersPermissions);

  const errors = useSelector((state) => getErrorsByFormName(state, formName));
  const isSaveClicked = useSelector(getIsSaveClicked);
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const leaseTypeIdentifier = useSelector(getCurrentLeaseTypeIdentifier);
  const oldDwellingsInHousingCompaniesPriceIndex = useSelector(
    getOldDwellingsInHousingCompaniesPriceIndex,
  );

  const rentCollapseState = useSelector((state) =>
    rentId
      ? getCollapseStateByKey(
          state,
          `${ViewModes.EDIT}.${formName}.${rentId}.rent`,
        )
      : undefined,
  );

  const contractRentsCollapseState = useSelector((state) =>
    rentId
      ? getCollapseStateByKey(
          state,
          `${ViewModes.EDIT}.${formName}.${rentId}.contract_rents`,
        )
      : undefined,
  );

  const fixedInitialYearRentsCollapseState = useSelector((state) =>
    rentId
      ? getCollapseStateByKey(
          state,
          `${ViewModes.EDIT}.${formName}.${rentId}.fixed_initial_year_rents`,
        )
      : undefined,
  );

  const indexAdjustedRentsCollapseState = useSelector((state) =>
    rentId
      ? getCollapseStateByKey(
          state,
          `${ViewModes.EDIT}.${formName}.${rentId}.index_adjusted_rents`,
        )
      : undefined,
  );

  const payableRentsCollapseState = useSelector((state) =>
    rentId
      ? getCollapseStateByKey(
          state,
          `${ViewModes.EDIT}.${formName}.${rentId}.payable_rents`,
        )
      : undefined,
  );

  const rentAdjustmentsCollapseState = useSelector((state) =>
    rentId
      ? getCollapseStateByKey(
          state,
          `${ViewModes.EDIT}.${formName}.${rentId}.rent_adjustments`,
        )
      : undefined,
  );

  const oldDwellingsInHousingCompaniesPriceIndexCollapseState = useSelector(
    (state) =>
      rentId
        ? getCollapseStateByKey(
            state,
            `${ViewModes.EDIT}.${formName}.${rentId}.old_dwellings_in_housing_companies_price_index`,
          )
        : undefined,
  );

  const equalizedRentsCollapseState = useSelector((state) =>
    rentId
      ? getCollapseStateByKey(
          state,
          `${ViewModes.EDIT}.${formName}.${rentId}.equalized_rents`,
        )
      : undefined,
  );

  const [contractRentErrors, setContractRentErrors] = useState<Record<
    string,
    any
  > | null>(null);
  const [fixedInitialYearRentErrors, setFixedInitialYearRentErrors] =
    useState<Record<string, any> | null>(null);
  const [rentAdjustmentsErrors, setRentAdjustmentsErrors] = useState<Record<
    string,
    any
  > | null>(null);
  const [rentErrors, setRentErrors] = useState<Record<string, any> | null>(
    null,
  );
  const [typeOptions, setTypeOptions] = useState<Array<Record<string, any>>>(
    [],
  );

  useEffect(() => {
    setTypeOptions(getFieldOptions(leaseAttributes, LeaseRentsFieldPaths.TYPE));
  }, [leaseAttributes]);

  useEffect(() => {
    setContractRentErrors(get(errors, `${field}.contract_rents`));
    setRentErrors(get(errors, field));
    setRentAdjustmentsErrors(get(errors, `${field}.rent_adjustments`));
    setFixedInitialYearRentErrors(
      get(errors, `${field}.fixed_initial_year_rents`),
    );
  }, [errors, field]);

  const clearContractRentPeriodIfNeeded = useCallback(() => {
    if (
      (rentType === RentTypes.INDEX || rentType === RentTypes.INDEX2022) &&
      contractRents &&
      contractRents.length
    ) {
      contractRents.forEach((item, index) => {
        if (
          !isEmptyValue(item.period) &&
          item.period !== ContractRentPeriods.PER_YEAR
        ) {
          form.change(`${field}.contract_rents[${index}].period`, "");
        }

        if (
          !isEmptyValue(item.period) &&
          item.base_amount_period !== ContractRentPeriods.PER_YEAR
        ) {
          form.change(
            `${field}.contract_rents[${index}].base_amount_period`,
            "",
          );
        }
      });
    }
  }, [rentType, contractRents, form, field]);

  const addEmptyContractRentIfNeeded = useCallback(() => {
    if (
      (rentType === RentTypes.INDEX ||
        rentType === RentTypes.INDEX2022 ||
        rentType === RentTypes.FIXED ||
        rentType === RentTypes.MANUAL) &&
      (!contractRents || !contractRents.length)
    ) {
      form.change(`${field}.contract_rents`, [{}]);
    }
  }, [contractRents, field, form, rentType]);

  const addEmptyDueDateIfNeeded = useCallback(() => {
    if (
      dueDatesType === RentDueDateTypes.CUSTOM &&
      (!dueDates || !dueDates.length)
    ) {
      form.change(`${field}.due_dates`, [{}]);
    }
  }, [dueDatesType, dueDates, field, form]);

  useEffect(() => {
    addEmptyContractRentIfNeeded();
    clearContractRentPeriodIfNeeded();
  }, [addEmptyContractRentIfNeeded, clearContractRentPeriodIfNeeded, rentType]);

  useEffect(() => {
    addEmptyDueDateIfNeeded();
  }, [addEmptyDueDateIfNeeded, dueDatesType]);

  const addOldDwellingsInHousingCompaniesPriceIndex = () => {
    form.change(
      `${field}.old_dwellings_in_housing_companies_price_index`,
      oldDwellingsInHousingCompaniesPriceIndex,
    );
  };
  const handleCollapseToggle = (key: string, val: boolean) => {
    if (!rentId) return;
    dispatch(
      receiveCollapseStates({
        [ViewModes.EDIT]: {
          [FormNames.LEASE_RENTS]: {
            [rentId]: {
              [key]: val,
            },
          },
        },
      }),
    );
  };

  const handleRentCollapseToggle = (val: boolean) => {
    handleCollapseToggle("rent", val);
  };

  const handleOldDwellingsInHousingCompaniesPriceIndexCollapseToggle = (
    val: boolean,
  ) => {
    handleCollapseToggle("old_dwellings_in_housing_companies_price_index", val);
  };

  const handleFixedInitialYearRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("fixed_initial_year_rents", val);
  };

  const handleContractRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("contract_rents", val);
  };

  const handleIndexAdjustedRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("index_adjusted_rents", val);
  };

  const handleRentAdjustmentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("rent_adjustments", val);
  };

  const handlePayableRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("payable_rents", val);
  };

  const handleEqualizedRentsCollapseToggle = (val: boolean) => {
    handleCollapseToggle("equalized_rents", val);
  };

  const handleRemove = () => {
    onRemove(index);
  };

  const savedRent: Record<string, any> = rentId
    ? (getRentById(rents, rentId) ?? {})
    : {};
  const active = isActive(savedRent);
  const archived = isArchived(savedRent);
  const indexAdjustedRents: Array<Record<string, any>> = get(
    savedRent,
    "index_adjusted_rents",
    [],
  );
  const payableRents: Array<Record<string, any>> = get(
    savedRent,
    "payable_rents",
    [],
  );
  const equalizedRents: Array<Record<string, any>> = get(
    savedRent,
    "equalized_rents",
    [],
  );
  const rentTypeIsIndex = rentType === RentTypes.INDEX,
    rentTypeIsIndex2022 = rentType === RentTypes.INDEX2022,
    rentTypeIsManual = rentType === RentTypes.MANUAL,
    rentTypeIsFixed = rentType === RentTypes.FIXED;
  const periodicRentAdjustmentType = get(
    savedRent,
    "periodic_rent_adjustment_type",
  );
  const startPriceIndexPointFigureValue = get(
    savedRent,
    "start_price_index_point_figure_value",
  );
  const startPriceIndexPointFigureYear = get(
    savedRent,
    "start_price_index_point_figure_year",
  );
  return (
    <Collapse
      archived={archived}
      defaultOpen={
        rentCollapseState !== undefined
          ? rentCollapseState
          : active || (rents.length === 1 && !archived)
      }
      hasErrors={isSaveClicked && !isEmpty(rentErrors)}
      headerTitle={
        <Authorization
          allow={isFieldAllowedToRead(
            leaseAttributes,
            LeaseRentsFieldPaths.TYPE,
          )}
        >
          <>{getLabelOfOption(typeOptions, get(savedRent, "type")) || "-"}</>
        </Authorization>
      }
      headerSubtitles={
        <Column small={6} medium={8} large={10}>
          <Authorization
            allow={
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentsFieldPaths.END_DATE,
              ) ||
              isFieldAllowedToRead(
                leaseAttributes,
                LeaseRentsFieldPaths.START_DATE,
              )
            }
          >
            <CollapseHeaderSubtitle>
              {formatDateRange(
                get(savedRent, "start_date"),
                get(savedRent, "end_date"),
              ) || "-"}
            </CollapseHeaderSubtitle>
          </Authorization>
        </Column>
      }
      onRemove={
        hasPermissions(usersPermissions, UsersPermissions.DELETE_RENT)
          ? handleRemove
          : null
      }
      onToggle={handleRentCollapseToggle}
    >
      <BoxContentWrapper>
        <BasicInfoEdit field={field} rentType={rentType} />
      </BoxContentWrapper>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentsFieldPaths.OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX,
        )}
      >
        {isATypedLease(leaseTypeIdentifier) && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              oldDwellingsInHousingCompaniesPriceIndexCollapseState !==
              undefined
                ? oldDwellingsInHousingCompaniesPriceIndexCollapseState
                : true
            }
            hasErrors={/*TODO: Error handling*/ false}
            headerTitle={`${LeaseRentOldDwellingsInHousingCompaniesPriceIndexFieldTitles.OLD_DWELLINGS_IN_HOUSING_COMPANIES_PRICE_INDEX}`}
          >
            <OldDwellingsInHousingCompaniesPriceIndexEdit
              oldDwellingsInHousingCompaniesPriceIndex={
                rentOldDwellingsInHousingCompaniesPriceIndex
              }
              periodicRentAdjustmentType={periodicRentAdjustmentType}
              addOldDwellingsInHousingCompaniesPriceIndex={
                addOldDwellingsInHousingCompaniesPriceIndex
              }
              startPriceIndexPointFigureValue={startPriceIndexPointFigureValue}
              startPriceIndexPointFigureYear={startPriceIndexPointFigureYear}
              field={field}
            />
          </Collapse>
        )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS,
        )}
      >
        {(rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsManual) && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              fixedInitialYearRentsCollapseState !== undefined
                ? fixedInitialYearRentsCollapseState
                : true
            }
            hasErrors={isSaveClicked && !isEmpty(fixedInitialYearRentErrors)}
            headerTitle={`${LeaseRentFixedInitialYearRentsFieldTitles.FIXED_INITIAL_YEAR_RENTS} (${fixedInitialYearRents ? fixedInitialYearRents.length : 0})`}
            onToggle={handleFixedInitialYearRentsCollapseToggle}
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseRentFixedInitialYearRentsFieldPaths.FIXED_INITIAL_YEAR_RENTS,
            )}
          >
            <FieldArray name={`${field}.fixed_initial_year_rents`}>
              {(fieldArrayProps) =>
                FixedInitialYearRentsEdit({
                  ...fieldArrayProps,
                })
              }
            </FieldArray>
          </Collapse>
        )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentContractRentsFieldPaths.CONTRACT_RENTS,
        )}
      >
        {(rentTypeIsIndex ||
          rentTypeIsIndex2022 ||
          rentTypeIsFixed ||
          rentTypeIsManual) && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              contractRentsCollapseState !== undefined
                ? contractRentsCollapseState
                : true
            }
            hasErrors={isSaveClicked && !isEmpty(contractRentErrors)}
            headerTitle={`${LeaseRentContractRentsFieldTitles.CONTRACT_RENTS} (${contractRents ? contractRents.length : 0})`}
            onToggle={handleContractRentsCollapseToggle}
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseRentContractRentsFieldPaths.CONTRACT_RENTS,
            )}
          >
            <FieldArray name={`${field}.contract_rents`}>
              {(fieldArrayProps) =>
                ContractRentsEdit({
                  ...fieldArrayProps,
                  rentField: field,
                  rentType: rentType,
                })
              }
            </FieldArray>
          </Collapse>
        )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseIndexAdjustedRentsFieldPaths.INDEX_ADJUSTED_RENTS,
        )}
      >
        {!!indexAdjustedRents.length &&
          (rentTypeIsIndex || rentTypeIsIndex2022 || rentTypeIsManual) && (
            <Collapse
              className="collapse__secondary"
              defaultOpen={
                indexAdjustedRentsCollapseState !== undefined
                  ? indexAdjustedRentsCollapseState
                  : false
              }
              headerTitle={`${LeaseIndexAdjustedRentsFieldTitles.INDEX_ADJUSTED_RENTS} (${indexAdjustedRents.length})`}
              onToggle={handleIndexAdjustedRentsCollapseToggle}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeaseIndexAdjustedRentsFieldPaths.INDEX_ADJUSTED_RENTS,
              )}
            >
              <IndexAdjustedRents indexAdjustedRents={indexAdjustedRents} />
            </Collapse>
          )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS,
        )}
      >
        {(rentTypeIsIndex ||
          rentTypeIsIndex2022 ||
          rentTypeIsFixed ||
          rentTypeIsManual) && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              rentAdjustmentsCollapseState !== undefined
                ? rentAdjustmentsCollapseState
                : false
            }
            hasErrors={isSaveClicked && !isEmpty(rentAdjustmentsErrors)}
            headerTitle={`${LeaseRentAdjustmentsFieldTitles.RENT_ADJUSTMENTS} (${rentAdjustments ? rentAdjustments.length : 0})`}
            onToggle={handleRentAdjustmentsCollapseToggle}
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseRentAdjustmentsFieldPaths.RENT_ADJUSTMENTS,
            )}
          >
            <FieldArray name={`${field}.rent_adjustments`}>
              {(fieldArrayProps) =>
                RentAdjustmentsEdit({
                  ...fieldArrayProps,
                })
              }
            </FieldArray>
          </Collapse>
        )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeasePayableRentsFieldPaths.PAYABLE_RENTS,
        )}
      >
        {!!payableRents.length &&
          (rentTypeIsIndex ||
            rentTypeIsIndex2022 ||
            rentTypeIsFixed ||
            rentTypeIsManual) && (
            <Collapse
              className="collapse__secondary"
              defaultOpen={
                payableRentsCollapseState !== undefined
                  ? payableRentsCollapseState
                  : false
              }
              headerTitle={`${LeasePayableRentsFieldTitles.PAYABLE_RENTS} (${payableRents.length})`}
              onToggle={handlePayableRentsCollapseToggle}
              enableUiDataEdit
              uiDataKey={getUiDataLeaseKey(
                LeasePayableRentsFieldPaths.PAYABLE_RENTS,
              )}
            >
              <PayableRents payableRents={payableRents} />
            </Collapse>
          )}
      </Authorization>

      <Authorization
        allow={isFieldAllowedToRead(
          leaseAttributes,
          LeaseEqualizedRentsFieldPaths.EQUALIZED_RENTS,
        )}
      >
        {!!equalizedRents.length && (
          <Collapse
            className="collapse__secondary"
            defaultOpen={
              equalizedRentsCollapseState !== undefined
                ? equalizedRentsCollapseState
                : false
            }
            headerTitle={`${LeaseEqualizedRentsFieldTitles.EQUALIZED_RENTS} (${equalizedRents.length})`}
            onToggle={handleEqualizedRentsCollapseToggle}
            enableUiDataEdit
            uiDataKey={getUiDataLeaseKey(
              LeaseEqualizedRentsFieldPaths.EQUALIZED_RENTS,
            )}
          >
            <EqualizedRents equalizedRents={equalizedRents} />
          </Collapse>
        )}
      </Authorization>
    </Collapse>
  );
};

export default RentItemEdit;
