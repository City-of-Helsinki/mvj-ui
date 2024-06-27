import React, { Component } from "react";
import { connect } from "react-redux";
import { formValueSelector, isValid } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import Button from "/src/components/button/Button";
import Loader from "/src/components/loader/Loader";
import LoaderWrapper from "/src/components/loader/LoaderWrapper";
import RentCalculatorForm from "./RentCalculatorForm";
import RentForPeriod from "./RentForPeriod";
import SubTitle from "/src/components/content/SubTitle";
import { fetchBillingPeriodsByLease } from "/src/billingPeriods/actions";
import { deleteRentForPeriodByLease, fetchRentForPeriodByLease, receiveIsSaveClicked } from "/src/rentForPeriod/actions";
import { FormNames } from "enums";
import { ButtonColors, RentCalculatorFieldPaths, RentCalculatorFieldTitles, RentCalculatorTypes } from "/src/components/enums";
import { RentCycles } from "/src/leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getContentRents } from "/src/leases/helpers";
import { hasPermissions } from "util/helpers";
import { getCurrentYear } from "util/date";
import { getUiDataRentCalculatorKey } from "uiData/helpers";
import { getBillingPeriodsByLease } from "/src/billingPeriods/selectors";
import { getCurrentLease, getIsEditMode } from "/src/leases/selectors";
import { getIsFetching, getIsSaveClicked, getRentForPeriodArrayByLease } from "/src/rentForPeriod/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Lease } from "/src/leases/types";
import type { RentForPeriodId } from "/src/rentForPeriod/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
let rentForPeriodId = 1;
type Props = {
  billingPeriod: number;
  billingPeriods: Array<Record<string, any>>;
  currentLease: Lease;
  deleteRentForPeriodByLease: (...args: Array<any>) => any;
  endDate: string;
  fetchBillingPeriodsByLease: (...args: Array<any>) => any;
  fetchRentForPeriodByLease: (...args: Array<any>) => any;
  fetching: boolean;
  isEditMode: boolean;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  rentForPeriodArray: Array<Record<string, any>>;
  saveClicked: boolean;
  startDate: string;
  type: string;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
  year: string;
};

class RentCalculator extends Component<Props> {
  componentDidMount() {
    const {
      rentForPeriodArray,
      usersPermissions
    } = this.props;

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) {
      this.fetchBillingPeriods();
    }

    if (hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE) && (!rentForPeriodArray || !rentForPeriodArray.length)) {
      this.fetchDefaultRentForPeriod();
    }
  }

  fetchBillingPeriods = () => {
    const {
      currentLease,
      fetchBillingPeriodsByLease
    } = this.props;
    const year = getCurrentYear();
    fetchBillingPeriodsByLease({
      leaseId: currentLease.id,
      year: year
    });
  };
  fetchDefaultRentForPeriod = () => {
    const {
      currentLease,
      fetchRentForPeriodByLease
    } = this.props;
    const currentYear = getCurrentYear();
    const {
      startDate,
      endDate
    } = this.getYearStartAndEndDates(currentYear);
    fetchRentForPeriodByLease({
      id: rentForPeriodId++,
      allowDelete: false,
      rentCalculatorType: RentCalculatorTypes.YEAR,
      endDate: endDate,
      leaseId: currentLease.id,
      startDate: startDate
    });
  };
  getYearStartAndEndDates = (year: string) => {
    const {
      currentLease
    } = this.props;
    const rents = getContentRents(currentLease);
    let isAnyCycleAprilToMarch = false;
    rents.forEach(rent => {
      if (rent.cycle === RentCycles.APRIL_TO_MARCH) {
        isAnyCycleAprilToMarch = true;
        return false;
      }
    });

    if (isAnyCycleAprilToMarch) {
      return {
        startDate: `${year}-04-01`,
        endDate: `${Number(year) + 1}-03-31`
      };
    }

    return {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`
    };
  };
  handleCreateRentsForPeriod = () => {
    const {
      billingPeriod,
      billingPeriods,
      currentLease,
      endDate,
      fetchRentForPeriodByLease,
      receiveIsSaveClicked,
      startDate,
      type,
      usersPermissions,
      valid,
      year
    } = this.props;
    let requestStartDate, requestEndDate;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) return;

    switch (type) {
      case RentCalculatorTypes.YEAR:
        const {
          startDate: tempStartDate,
          endDate: tempEndDate
        } = this.getYearStartAndEndDates(year);
        requestStartDate = tempStartDate;
        requestEndDate = tempEndDate;
        break;

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

    receiveIsSaveClicked(true);

    if (valid) {
      fetchRentForPeriodByLease({
        id: rentForPeriodId++,
        allowDelete: true,
        rentCalculatorType: type,
        endDate: requestEndDate,
        leaseId: currentLease.id,
        startDate: requestStartDate
      });
    }
  };
  handleRentForPeriodDelete = (id: RentForPeriodId) => {
    const {
      currentLease,
      deleteRentForPeriodByLease
    } = this.props;
    deleteRentForPeriodByLease({
      id: id,
      leaseId: currentLease.id
    });
  };

  render() {
    const {
      fetching,
      isEditMode,
      rentForPeriodArray,
      saveClicked,
      usersPermissions,
      valid
    } = this.props;
    if (!hasPermissions(usersPermissions, UsersPermissions.VIEW_INVOICE)) return null;
    return <div className='rent-calculator'>
        <SubTitle style={{
        textTransform: 'uppercase'
      }} enableUiDataEdit={isEditMode} uiDataKey={getUiDataRentCalculatorKey(RentCalculatorFieldPaths.TYPE)}>
          {RentCalculatorFieldTitles.TYPE}
        </SubTitle>
        <Row>
          <Column small={12} medium={6} large={4}>
            <RentCalculatorForm onSubmit={this.handleCreateRentsForPeriod} showErrors={saveClicked} />
          </Column>
          <Column small={12} medium={6} large={8}>
            <div className='rent-calculator__button-wrapper'>
              <Button className={`${ButtonColors.SUCCESS} no-margin`} disabled={fetching || saveClicked && !valid} onClick={this.handleCreateRentsForPeriod} text='Laske' />
            </div>
          </Column>
        </Row>
        <Row>
          <Column>
            {rentForPeriodArray && !!rentForPeriodArray.length && rentForPeriodArray.map((rentForPeriod, index) => {
            return <RentForPeriod key={index} onRemove={this.handleRentForPeriodDelete} rentForPeriod={rentForPeriod} />;
          })}
          </Column>
        </Row>
        {fetching && <LoaderWrapper>
            <Loader isLoading={fetching} />
          </LoaderWrapper>}
      </div>;
  }

}

const formName = FormNames.RENT_CALCULATOR;
const selector = formValueSelector(formName);
export default flowRight(connect(state => {
  const currentLease = getCurrentLease(state);
  return {
    billingPeriod: selector(state, 'billing_period'),
    billingPeriods: getBillingPeriodsByLease(state, currentLease.id),
    currentLease: currentLease,
    endDate: selector(state, 'billing_end_date'),
    fetching: getIsFetching(state),
    isEditMode: getIsEditMode(state),
    rentForPeriodArray: getRentForPeriodArrayByLease(state, currentLease.id),
    saveClicked: getIsSaveClicked(state),
    startDate: selector(state, 'billing_start_date'),
    type: selector(state, 'type'),
    usersPermissions: getUsersPermissions(state),
    valid: isValid(formName)(state),
    year: selector(state, 'year')
  };
}, {
  deleteRentForPeriodByLease,
  fetchBillingPeriodsByLease,
  fetchRentForPeriodByLease,
  receiveIsSaveClicked
}))(RentCalculator);