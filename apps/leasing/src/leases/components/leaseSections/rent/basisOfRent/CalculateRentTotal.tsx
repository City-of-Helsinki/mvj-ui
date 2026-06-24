import React from "react";
import { Row, Column } from "@/components/grid/Grid";
import { LeaseBasisOfRentsFieldTitles } from "@/leases/enums";
import FormText from "@/components/form/FormText";
import {
  calculateBasisOfRentDiscountedInitialYearRentTotals,
  calculateInitialYearRentTotals,
} from "@/leases/helpers";
import { formatNumber } from "@/util/helpers";
import type { BasisOfRent } from "@/leases/types";
import Divider from "@/components/content/Divider";
type Props = {
  basisOfRents: Array<BasisOfRent>;
  indexOptions: Array<Record<string, any>>;
};

const CalculateRentTotal = ({ basisOfRents, indexOptions }: Props) => {
  const {
    unlocked: discountedInitialYearRentsUnlocked,
    locked: discountedInitialYearRentsLocked,
    total: discountedInitialYearRentsTotal,
  } = calculateBasisOfRentDiscountedInitialYearRentTotals(
    basisOfRents,
    indexOptions,
  );

  const {
    unlocked: initialYearRentsUnlocked,
    locked: initialYearRentsLocked,
    total: initialYearRentsTotal,
  } = calculateInitialYearRentTotals(basisOfRents, indexOptions);
  return (
    <>
      <Row>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT}
          </FormText>
        </Column>
      </Row>
      <Row>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.UNLOCKED}
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.LOCKED}
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.TOTAL}
          </FormText>
        </Column>
      </Row>
      <Row>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {formatNumber(discountedInitialYearRentsUnlocked)} €
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {formatNumber(discountedInitialYearRentsLocked)} €
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {formatNumber(discountedInitialYearRentsTotal)} €
          </FormText>
        </Column>
      </Row>
      <Divider />
      <Row>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT}
          </FormText>
        </Column>
      </Row>
      <Row>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.UNLOCKED}
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.LOCKED}
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {LeaseBasisOfRentsFieldTitles.TOTAL}
          </FormText>
        </Column>
      </Row>
      <Row>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {formatNumber(initialYearRentsUnlocked)} €
          </FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className="semibold">
            {formatNumber(initialYearRentsLocked)} €
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
