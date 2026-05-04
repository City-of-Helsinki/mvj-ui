import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { FormApi } from "final-form";
import { Row, Column } from "react-foundation";
import Button from "@/components/button/Button";
import Loader from "@/components/loader/Loader";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import RentCalculatorForm from "./RentCalculatorForm";
import RentForPeriod from "./RentForPeriod";
import SubTitle from "@/components/content/SubTitle";
import { fetchBillingPeriodsByLease } from "@/billingPeriods/actions";
import {
  deleteRentForPeriodByLease,
  fetchRentForPeriodByLease,
  receiveIsSaveClicked,
} from "@/rentForPeriod/actions";
import {
  ButtonColors,
  RentCalculatorFieldPaths,
  RentCalculatorFieldTitles,
  RentCalculatorTypes,
} from "@/components/enums";
import { RentCycles } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getContentRents } from "@/leases/helpers";
import { hasPermissions } from "@/util/helpers";
import { getCurrentYear } from "@/util/date";
import { getUiDataRentCalculatorKey } from "@/uiData/helpers";
import { getBillingPeriodsByLease } from "@/billingPeriods/selectors";
import { getCurrentLease, getIsEditMode } from "@/leases/selectors";
import {
  getIsFetching,
  getIsSaveClicked,
  getRentForPeriodArrayByLease,
} from "@/rentForPeriod/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type {
  RentCalculatorType,
  RentForPeriodId,
} from "@/rentForPeriod/types";
let rentForPeriodId = 1;

type Props = {
  formApi: FormApi;
};

const RentCalculator: React.FC<Props> = ({ formApi }) => {
  const dispatch = useDispatch();
  const currentLease = useSelector(getCurrentLease);
  const saveClicked = useSelector(getIsSaveClicked);
  const usersPermissions = useSelector(getUsersPermissions);
  const fetching = useSelector(getIsFetching);
  const isEditMode = useSelector(getIsEditMode);
  const billingPeriods = useSelector((state) =>
    getBillingPeriodsByLease(state, currentLease.id),
  );
  const rentForPeriodArray = useSelector((state) =>
    getRentForPeriodArrayByLease(state, currentLease.id),
  );
  const [formValues, setFormValues] = useState(() => formApi.getState().values);
  const [calculatorErrors, setCalculatorErrors] = useState<Record<string, any>>(
    {},
  );

  useEffect(() => {
    const unsubscribe = formApi.subscribe(
      (state) => {
        setFormValues(state.values);
        setCalculatorErrors(state.errors);
      },
      { values: true, errors: true },
    );
    return () => unsubscribe();
  }, [formApi]);

  const billingPeriod = formValues.billing_period;
  const endDate = formValues.billing_end_date;
  const startDate = formValues.billing_start_date;
  const type: RentCalculatorType = formValues.type;
  const year = formValues.year;

  const getYearStartAndEndDates = useCallback(
    (year: string) => {
      const rents = getContentRents(currentLease);
      const isAnyCycleAprilToMarch = rents.some(
        (rent) => rent.cycle === RentCycles.APRIL_TO_MARCH,
      );

      if (isAnyCycleAprilToMarch) {
        return {
          startDate: `${year}-04-01`,
          endDate: `${Number(year) + 1}-03-31`,
        };
      }

      return {
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
      };
    },
    [currentLease],
  );

  useEffect(() => {
    const year = getCurrentYear();
    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) {
      dispatch(
        fetchBillingPeriodsByLease({
          leaseId: currentLease.id,
          year: year,
        }),
      );
    }
  }, [currentLease.id, dispatch, usersPermissions]);

  useEffect(() => {
    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE) &&
      (!rentForPeriodArray || !rentForPeriodArray.length)
    ) {
      const currentYear = getCurrentYear();
      const { startDate, endDate } = getYearStartAndEndDates(currentYear);
      dispatch(
        fetchRentForPeriodByLease({
          id: rentForPeriodId++,
          allowDelete: false,
          type: RentCalculatorTypes.YEAR as RentCalculatorType,
          endDate: endDate,
          leaseId: currentLease.id,
          startDate: startDate,
        }),
      );
    }
  }, [
    currentLease.id,
    dispatch,
    getYearStartAndEndDates,
    rentForPeriodArray,
    usersPermissions,
  ]);

  const handleCreateRentsForPeriod = () => {
    let requestStartDate, requestEndDate;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE))
      return;

    switch (type) {
      case RentCalculatorTypes.YEAR: {
        const { startDate: tempStartDate, endDate: tempEndDate } =
          getYearStartAndEndDates(year);
        requestStartDate = tempStartDate;
        requestEndDate = tempEndDate;
        break;
      }

      case RentCalculatorTypes.RANGE:
        requestStartDate = startDate;
        requestEndDate = endDate;
        break;

      case RentCalculatorTypes.BILLING_PERIOD:
        if (billingPeriods.length > billingPeriod) {
          requestStartDate = billingPeriods[billingPeriod][0];
          requestEndDate = billingPeriods[billingPeriod][1];
        }

        break;
    }

    const errors = formApi.getState().errors;
    dispatch(receiveIsSaveClicked(true));

    if (Object.keys(errors).length === 0) {
      dispatch(
        fetchRentForPeriodByLease({
          id: rentForPeriodId++,
          allowDelete: true,
          type: type,
          endDate: requestEndDate,
          leaseId: currentLease.id,
          startDate: requestStartDate,
        }),
      );
    }
  };

  const handleRentForPeriodDelete = (id: RentForPeriodId) => {
    dispatch(
      deleteRentForPeriodByLease({
        id: id,
        leaseId: currentLease.id,
      }),
    );
  };

  if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE))
    return null;
  return (
    <div className="rent-calculator">
      <SubTitle
        style={{
          textTransform: "uppercase",
        }}
        enableUiDataEdit={isEditMode}
        uiDataKey={getUiDataRentCalculatorKey(RentCalculatorFieldPaths.TYPE)}
      >
        {RentCalculatorFieldTitles.TYPE}
      </SubTitle>
      <Row>
        <Column small={12} medium={6} large={4}>
          <RentCalculatorForm
            formApi={formApi}
            onSubmit={handleCreateRentsForPeriod}
            showErrors={saveClicked}
            errors={calculatorErrors}
          />
        </Column>
        <Column small={12} medium={6} large={8}>
          <div className="rent-calculator__button-wrapper">
            <Button
              className={`${ButtonColors.SUCCESS} no-margin`}
              disabled={
                fetching ||
                (saveClicked && Object.keys(calculatorErrors).length > 0)
              }
              onClick={handleCreateRentsForPeriod}
              text="Laske"
            />
          </div>
        </Column>
      </Row>
      <Row>
        <Column>
          {rentForPeriodArray &&
            !!rentForPeriodArray.length &&
            rentForPeriodArray.map((rentForPeriod, index) => {
              return (
                <RentForPeriod
                  key={index}
                  onRemove={handleRentForPeriodDelete}
                  rentForPeriod={rentForPeriod}
                />
              );
            })}
        </Column>
      </Row>
      {fetching && (
        <LoaderWrapper>
          <Loader isLoading={fetching} />
        </LoaderWrapper>
      )}
    </div>
  );
};

export default RentCalculator;
