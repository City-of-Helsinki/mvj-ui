import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { LeaseBasisOfRentsFieldTitles } from "src/leases/enums";
import FormText from "src/components/form/FormText";
import { calculateBasisOfRentDiscountedInitialYearRentsTotal, calculateInitialYearRentsTotal } from "src/leases/helpers";
import { formatNumber } from "src/util/helpers";
type Props = {
  basisOfRents: any;
  indexOptions: Array<Record<string, any>>;
};

const CalculateRentTotal = ({
  basisOfRents,
  indexOptions
}: Props) => {
  const discountedInitialYearRentsTotal = calculateBasisOfRentDiscountedInitialYearRentsTotal(basisOfRents, indexOptions);
  const initialYearRentsTotal = calculateInitialYearRentsTotal(basisOfRents, indexOptions);
  return <Fragment>
      <Row>
        <Column small={4} large={4}>
          <FormText className='semibold'>{LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_TOTAL}</FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className='semibold'>{LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT_TOTAL}</FormText>
        </Column>
      </Row>
      <Row>
        <Column small={4} large={4}>
          <FormText className='semibold'>{formatNumber(discountedInitialYearRentsTotal)} €</FormText>
        </Column>
        <Column small={4} large={4}>
          <FormText className='semibold'>{formatNumber(initialYearRentsTotal)} €</FormText>
        </Column>
      </Row>
    </Fragment>;
};

export default connect()(CalculateRentTotal);