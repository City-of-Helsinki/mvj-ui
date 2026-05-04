import React, { useEffect, useMemo, useState } from "react";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
import { Row, Column } from "react-foundation";
import ErrorField from "@/components/form/ErrorField";
import FormField from "@/components/form/final-form/FormField";
import { FieldTypes } from "@/enums";
import { RentCalculatorTypes } from "@/components/enums";
import { formatDateRange } from "@/util/helpers";
import { getCurrentLease } from "@/leases/selectors";
import { getBillingPeriodsByLease } from "@/billingPeriods/selectors";
import type { BillingPeriodList } from "@/billingPeriods/types";
import { useSelector } from "react-redux";
type Props = {
  formApi: FormApi;
  onSubmit: (...args: Array<any>) => any;
  showErrors: boolean;
  errors?: Record<string, any>;
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

const RentCalculatorForm: React.FC<Props> = ({
  formApi,
  onSubmit,
  showErrors,
  errors = {},
}) => {
  const currentLease = useSelector(getCurrentLease);
  const billingPeriods: BillingPeriodList = useSelector((state) =>
    getBillingPeriodsByLease(state, currentLease.id),
  );
  const billingPeriodOptions = useMemo(
    () => getBillingPeriodsOptions(billingPeriods),
    [billingPeriods],
  );
  const [type, setType] = useState(RentCalculatorTypes.YEAR);

  useEffect(() => {
    const unsubscribe = formApi.subscribe(
      ({ values }) => {
        setType(values.type);
      },
      { values: true },
    );
    return () => unsubscribe();
  }, [formApi]);

  useEffect(() => {
    const autoselectBillingPeriod = (
      billingPeriodOptions: Array<Record<string, any>>,
    ) => {
      const now = new Date();
      const selected = billingPeriodOptions.find(
        (item) =>
          new Date(item.startDate) <= now && new Date(item.endDate) >= now,
      );

      if (selected) {
        formApi.change("billing_period", selected.value);
      }
    };

    if (billingPeriodOptions.length) {
      autoselectBillingPeriod(billingPeriodOptions);
      formApi.reset(formApi.getState().values);
    }
  }, [billingPeriodOptions, formApi]);

  const getRequestOptions = () => {
    return [
      {
        value: RentCalculatorTypes.YEAR,
        label: "Vuosi",
        labelStyles: {
          minWidth: "115px",
        },
        field: (
          <FormField
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
          <ErrorField
            showError={showErrors && !!errors.yearErrors}
            meta={{ error: errors.yearErrors }}
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
              <FormField
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
              <FormField
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
          <ErrorField
            showError={showErrors && !!errors.rangeErrors}
            meta={{ error: errors.rangeErrors }}
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
          <FormField
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
          <ErrorField
            showError={showErrors && !!errors.billingPeriodErrors}
            meta={{ error: errors.billingPeriodErrors }}
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
    <Form form={formApi} onSubmit={onSubmit}>
      {() => (
        <Row>
          <Column>
            <FormField
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
      )}
    </Form>
  );
};

export default RentCalculatorForm;
