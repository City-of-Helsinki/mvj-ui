import React from "react";
import { Row, Column } from "react-foundation";
import { LeaseBasisOfRentsFieldTitles } from "@/leases/enums";
import FormText from "@/components/form/FormText";
import {
  calculateBasisOfRentDiscountedInitialYearRentsTotal,
  calculateInitialYearRentsTotal,
} from "@/leases/helpers";
import { formatNumber } from "@/util/helpers";
import type { BasisOfRent } from "@/leases/types";
type Props = {
  basisOfRents: Array<BasisOfRent>;
  indexOptions: Array<Record<string, any>>;
};

const CalculateRentTotal = ({ basisOfRents, indexOptions }: Props) => {
  const discountedInitialYearRentsTotal =
    calculateBasisOfRentDiscountedInitialYearRentsTotal(
      basisOfRents,
      indexOptions,
    );
  const initialYearRentsTotal = calculateInitialYearRentsTotal(
    basisOfRents,
    indexOptions,
  );
  return (
    <>
      <Row>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_TOTAL}
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT_TOTAL}
          </FormText>
        </Column>
      </Row>
      <Row>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {formatNumber(discountedInitialYearRentsTotal)} €
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {formatNumber(initialYearRentsTotal)} €
          </FormText>
        </Column>
      </Row>
    </>
  );
};

export default CalculateRentTotal;
