import { RentCalculatorTypes } from "./enums";
import { isEmptyValue } from "@/util/helpers";
import { year } from "./form/validations";
export const validateRentCalculatorForm = (values: Record<string, any>) => {
  const errors: any = {};

  switch (values.type) {
    case RentCalculatorTypes.YEAR:
      if (isEmptyValue(values.year)) errors.yearErrors = "Vuosi on pakollinen";
      else errors.yearErrors = year(values.year);
      break;

    case RentCalculatorTypes.RANGE:
      if (!values.billing_start_date || !values.billing_end_date) {
        errors.rangeErrors = "Alku- ja loppupvm ovat pakollisia";
      } else if (
        new Date(values.billing_start_date).getFullYear() !==
        new Date(values.billing_end_date).getFullYear()
      ) {
        errors.rangeErrors =
          "Alku- ja loppupäivämäärän tulee olla samana vuonna";
      } else if (values.billing_end_date < values.billing_start_date) {
        errors.rangeErrors =
          "Loppupäivämäärän tulee olla alkupäivämäärän jälkeen";
      }

      break;

    case RentCalculatorTypes.BILLING_PERIOD:
      if (isEmptyValue(values.billing_period))
        errors.billingPeriodErrors = "Laskutuskausi on pakollinen";
      break;
  }

  return errors;
};
