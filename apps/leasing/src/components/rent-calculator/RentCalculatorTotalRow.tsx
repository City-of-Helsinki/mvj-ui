import React from "react";
import { Row, Column } from "react-foundation";
import isAfter from "date-fns/isAfter";
import get from "lodash/get";
import AmountWithVat from "@/components/vat/AmountWithVat";
import Divider from "@/components/content/Divider";
import FormText from "@/components/form/FormText";
import { getRentsTotalAmount } from "@/components/helpers";
type Props = {
  rents: Array<Record<string, any>>;
};

const RentCalculatorTotalRow = ({ rents }: Props) => {
  const getEndDate = () => {
    let endDate = null;
    rents.forEach((rent) => {
      get(rent, "explanation.items", []).forEach((explanation) => {
        let rentEndDate = null;
        get(explanation, "date_ranges", []).forEach((dateRange) => {
          if (
            dateRange.end_date &&
            (!rentEndDate ||
              isAfter(new Date(rentEndDate), new Date(dateRange.end_date)))
          ) {
            rentEndDate = dateRange.end_date;
          }
        });

        if (
          rentEndDate &&
          (!endDate || isAfter(new Date(endDate), new Date(rentEndDate)))
        ) {
          endDate = rentEndDate;
        }
      });
    });
    return endDate;
  };

  if (!rents || rents.length <= 1) {
    return null;
  }

  const amount = getRentsTotalAmount(rents);
  const date = getEndDate();
  return (
    <div className="rent-calculator__rent">
      <Divider className="invoice-divider" />
      <Row>
        <Column small={4}>
          <FormText>
            <strong>Yhteensä</strong>
          </FormText>
        </Column>
        <Column small={8}>
          <FormText className="rent-calculator__rent_amount">
            <strong>
              <AmountWithVat amount={amount} date={date} />
            </strong>
          </FormText>
        </Column>
      </Row>
    </div>
  );
};

export default RentCalculatorTotalRow;
