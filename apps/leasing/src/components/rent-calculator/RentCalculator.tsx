import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formValueSelector, isValid } from "redux-form";
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
import { FormNames } from "@/enums";
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

const formName = FormNames.RENT_CALCULATOR;
const selector = formValueSelector(formName);

const RentCalculator: React.FC = () => {
  const dispatch = useDispatch();
  const currentLease = useSelector(getCurrentLease);
  const billingPeriod = useSelector((state) =>
    selector(state, "billing_period"),
  );
  const billingPeriods = useSelector((state) =>
    getBillingPeriodsByLease(state, currentLease.id),
  );
  const endDate = useSelector((state) => selector(state, "billing_end_date"));
  const fetching = useSelector(getIsFetching);
  const isEditMode = useSelector(getIsEditMode);
  const rentForPeriodArray = useSelector((state) =>
    getRentForPeriodArrayByLease(state, currentLease.id),
  );
  const saveClicked = useSelector(getIsSaveClicked);
  const startDate = useSelector((state) =>
    selector(state, "billing_start_date"),
  );
  const type: RentCalculatorType = useSelector((state) =>
    selector(state, "type"),
  );
  const usersPermissions = useSelector(getUsersPermissions);
  const valid = useSelector((state) => isValid(formName)(state));
  const year = useSelector((state) => selector(state, "year"));

  useEffect(() => {
    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) {
      fetchBillingPeriods();
    }
    if (
      hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE) &&
      (!rentForPeriodArray || !rentForPeriodArray.length)
    ) {
      fetchDefaultRentForPeriod();
    }
    //TODO handle hook dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBillingPeriods = () => {
    const year = getCurrentYear();
    dispatch(
      fetchBillingPeriodsByLease({
        leaseId: currentLease.id,
        year: year,
      }),
    );
  };

  const fetchDefaultRentForPeriod = () => {
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
  };

  const getYearStartAndEndDates = (year: string) => {
    const rents = getContentRents(currentLease);
    let isAnyCycleAprilToMarch = false;
    rents.forEach((rent) => {
      if (rent.cycle === RentCycles.APRIL_TO_MARCH) {
        isAnyCycleAprilToMarch = true;
        return false;
      }
    });

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
  };

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

    dispatch(receiveIsSaveClicked(true));

    if (valid) {
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
            onSubmit={handleCreateRentsForPeriod}
            showErrors={saveClicked}
          />
        </Column>
        <Column small={12} medium={6} large={8}>
          <div className="rent-calculator__button-wrapper">
            <Button
              className={`${ButtonColors.SUCCESS} no-margin`}
              disabled={fetching || (saveClicked && !valid)}
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
