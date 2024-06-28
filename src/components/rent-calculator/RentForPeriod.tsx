import React from "react";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import FormText from "/src/components/form/FormText";
import RemoveButton from "/src/components/form/RemoveButton";
import RentCalculatorRent from "./RentCalculatorRent";
import RentCalculatorTotalRow from "./RentCalculatorTotalRow";
import { RentCalculatorTypeOptions } from "/src/components/constants";
import { RentCalculatorTypes } from "/src/components/enums";
import { formatDateRange, getLabelOfOption } from "/src/util/helpers";
type Props = {
  onRemove: (...args: Array<any>) => any;
  rentForPeriod: Record<string, any>;
};

const RentForPeriod = ({
  onRemove,
  rentForPeriod
}: Props) => {
  const getTitle = () => {
    switch (rentForPeriod.rentCalculatorType) {
      case RentCalculatorTypes.YEAR:
        return `${getLabelOfOption(RentCalculatorTypeOptions, rentForPeriod.rentCalculatorType) || ''} ${new Date(rentForPeriod.start_date).getFullYear()}`;

      case RentCalculatorTypes.RANGE:
      case RentCalculatorTypes.BILLING_PERIOD:
        return `${getLabelOfOption(RentCalculatorTypeOptions, rentForPeriod.rentCalculatorType) || ''} ${formatDateRange(rentForPeriod.start_date, rentForPeriod.end_date)}`;
    }
  };

  const handleRemove = () => {
    onRemove(rentForPeriod.id);
  };

  const rents = get(rentForPeriod, 'rents', []);
  const title = getTitle();
  return <div className='rent-calculator__rent-wrapper'>
      <div className='rent-calculator__rent-inner-wrapper'>
        <span className='rent-calculator__rent-title'>{title}</span>
        {rentForPeriod.allowDelete && <RemoveButton className='position-topright' onClick={handleRemove} title='Poista' />}
        {(!rents || !rents.length) && <FormText>Ei vuokria</FormText>}
        {!!rents && !!rents.length && <Row>
            <Column small={12} large={8}>
              {rents.map((rent, index) => {
            return <RentCalculatorRent key={index} rent={rent} />;
          })}
              <RentCalculatorTotalRow rents={rents} />
            </Column>
          </Row>}
      </div>
    </div>;
};

export default RentForPeriod;