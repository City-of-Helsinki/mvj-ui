import React, { useEffect, useState } from "react";
import { change, Field, formValueSelector, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import ErrorField from "@/components/form/ErrorField";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { FieldTypes, FormNames } from "@/enums";
import { RentCalculatorTypes } from "@/components/enums";
import { validateRentCalculatorForm } from "@/components/formValidations";
import { formatDateRange } from "@/util/helpers";
import { getCurrentYear } from "@/util/date";
import { getCurrentLease } from "@/leases/selectors";
import { getBillingPeriodsByLease } from "@/billingPeriods/selectors";
import type { BillingPeriodList } from "@/billingPeriods/types";
import { useDispatch, useSelector } from "react-redux";
type Props = {
  onSubmit: (...args: Array<any>) => any;
  showErrors: boolean;
  valid: boolean;
};

const getBillingPeriodsOptions = (billingPeriods: BillingPeriodList) => {
  if (!billingPeriods || !billingPeriods.length) return [];
  return billingPeriods.map((item, index) => {
    return {
      value: index,
      label: formatDateRange(item[0], item[1]),
      startDate: item[0],
      endDate: item[1],
    };
  });
};
const formName = FormNames.RENT_CALCULATOR;
const selector = formValueSelector(formName);

const RentCalculatorForm: React.FC<Props> = ({ onSubmit, showErrors }) => {
  const dispatch = useDispatch();
  const currentLease = useSelector(getCurrentLease);
  const billingPeriod = useSelector((state) =>
    selector(state, "billing_period"),
  );
  const billingPeriods: BillingPeriodList = useSelector((state) =>
    getBillingPeriodsByLease(state, currentLease.id),
  );
  const type = useSelector((state) => selector(state, "type"));

  const [billingPeriodOptions, setBillingPeriodOptions] = useState(
    getBillingPeriodsOptions(billingPeriods),
  );

  useEffect(() => {
    setBillingPeriodOptions(getBillingPeriodsOptions(billingPeriods));
  }, [billingPeriods]);

  useEffect(() => {
    const setDefaultValues = () => {
      const currentYear = getCurrentYear();
      dispatch(change(formName, "type", RentCalculatorTypes.YEAR));
      dispatch(change(formName, "year", currentYear));
      dispatch(change(formName, "billing_start_date", `${currentYear}-01-01`));
      dispatch(change(formName, "billing_end_date", `${currentYear}-12-31`));
    };

    const autoselectBillingPeriod = (
      billingPeriodOptions: Array<Record<string, any>>,
    ) => {
      const now = new Date();
      const selected = billingPeriodOptions.find(
        (item) =>
          new Date(item.startDate) <= now && new Date(item.endDate) >= now,
      );

      if (selected) {
        dispatch(change(formName, "billing_period", selected.value));
      }
    };

    if (billingPeriodOptions.length) {
      autoselectBillingPeriod(billingPeriodOptions);
    }
    setDefaultValues();
  }, [billingPeriodOptions, dispatch]);

  const handleSubmit = (e: any) => {
    onSubmit();
    e.preventDefault();
  };
  const getRequestOptions = () => {
    return [
      {
        value: RentCalculatorTypes.YEAR,
        label: "Vuosi",
        labelStyles: {
          minWidth: "115px",
        },
        field: (
          <FormFieldLegacy
            fieldAttributes={{
              label: "Vuosi",
              type: "string",
              read_only: false,
            }}
            name="year"
            disabled={type !== RentCalculatorTypes.YEAR}
            disableDirty
            invisibleLabel
          />
        ),
        fieldStyles: {
          width: "180px",
        },
        errorField: (
          <Field
            name="yearErrors"
            component={ErrorField}
            showError={showErrors}
            style={{
              marginTop: "-10px",
            }}
          />
        ),
        errorFieldStyles: {
          width: "180px",
        },
      },
      {
        value: RentCalculatorTypes.RANGE,
        label: "Aikaväli",
        labelStyles: {
          minWidth: "115px",
        },
        field: (
          <Row>
            <Column small={6}>
              <FormFieldLegacy
                fieldAttributes={{
                  label: "Alkupvm",
                  type: "date",
                  read_only: false,
                }}
                name="billing_start_date"
                disabled={type !== RentCalculatorTypes.RANGE}
                disableDirty
                invisibleLabel
              />
            </Column>
            <Column small={6}>
              <FormFieldLegacy
                className="with-dash"
                fieldAttributes={{
                  label: "Loppupvm",
                  type: "date",
                  read_only: false,
                }}
                name="billing_end_date"
                disabled={type !== RentCalculatorTypes.RANGE}
                disableDirty
                invisibleLabel
              />
            </Column>
          </Row>
        ),
        fieldStyles: {
          width: "180px",
        },
        errorField: (
          <Field
            name="rangeErrors"
            component={ErrorField}
            showError={showErrors}
            style={{
              marginTop: "-10px",
            }}
          />
        ),
        errorFieldStyles: {
          width: "180px",
        },
      },
      {
        value: RentCalculatorTypes.BILLING_PERIOD,
        label: "Laskutuskausi",
        labelStyles: {
          minWidth: "115px",
        },
        field: (
          <FormFieldLegacy
            fieldAttributes={{
              label: "Laskutuskausi",
              type: "choice",
              read_only: false,
            }}
            name="billing_period"
            disabled={type !== RentCalculatorTypes.BILLING_PERIOD}
            disableDirty
            disableTouched={showErrors}
            invisibleLabel
            overrideValues={{
              options: billingPeriodOptions,
            }}
          />
        ),
        fieldStyles: {
          width: "180px",
          marginBottom: 0,
        },
        errorField: (
          <Field
            name="billingPeriodErrors"
            component={ErrorField}
            showError={true}
            style={{
              marginTop: "-10px",
            }}
          />
        ),
        errorFieldStyles: {
          width: "180px",
        },
      },
    ];
  };

  const requestOptions = getRequestOptions();
  return (
    <div onSubmit={handleSubmit}>
      <Row>
        <Column>
          <FormFieldLegacy
            className="no-margin"
            fieldAttributes={{
              label: "Laskelman tyyppi",
              type: FieldTypes.RADIO_WITH_FIELD,
              required: true,
              read_only: false,
            }}
            name="type"
            invisibleLabel
            disableDirty
            overrideValues={{
              options: requestOptions,
            }}
          />
        </Column>
      </Row>
    </div>
  );
};

export default reduxForm({
  form: formName,
  validate: validateRentCalculatorForm,
})(RentCalculatorForm);
