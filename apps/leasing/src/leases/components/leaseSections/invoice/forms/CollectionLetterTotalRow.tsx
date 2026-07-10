import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import { get, isEmpty } from "lodash-es";
import FormText from "@/components/form/FormText";
import { convertStrToDecimalNumber, formatNumber } from "@/util/helpers";
import { getPenaltyInterestByInvoice } from "@/penaltyInterest/selectors";
import { useFormState } from "react-final-form";
type Props = {
  selectedInvoices: Array<Record<string, any>>;
  fields: any;
};

const CollectionLetterTotalRow = ({ fields, selectedInvoices }: Props) => {
  const formState = useFormState();

  const penaltyInterestArray: Array<Record<string, any>> = useSelector(
    (state) => {
      const penaltyInterests = [];
      fields.forEach((field) => {
        const invoiceId = get(formState.values, `${field}.invoice`);
        const penaltyInterest = getPenaltyInterestByInvoice(state, invoiceId);

        if (!isEmpty(penaltyInterest)) {
          penaltyInterests.push(penaltyInterest);
        }
      });
      return penaltyInterests;
    },
  );

  const getTotalOutstandingAmount = () => {
    let total = 0;
    penaltyInterestArray.forEach((penaltyInterest) => {
      total += penaltyInterest.outstanding_amount;
    });
    return total;
  };

  const getTotalInterestAmount = () => {
    let total = 0;
    penaltyInterestArray.forEach((penaltyInterest) => {
      total += penaltyInterest.total_interest_amount;
    });
    return total;
  };

  const getTotalCollectionCharge = () => {
    let total = 0;

    if (selectedInvoices) {
      selectedInvoices.forEach((invoice) => {
        if (invoice.collection_charge) {
          total += convertStrToDecimalNumber(invoice.collection_charge) || 0;
        }
      });
    }

    return total;
  };

  const totalOutstandingAmount = getTotalOutstandingAmount(),
    totalInterestAmount = getTotalInterestAmount(),
    totalCollectionCharge = getTotalCollectionCharge(),
    total =
      totalOutstandingAmount + totalInterestAmount + totalCollectionCharge;
  return (
    <Row>
      <Column small={4}>
        <FormText>Yhteensä</FormText>
      </Column>
      <Column small={2}>
        <FormText>{`${formatNumber(totalOutstandingAmount)} €`}</FormText>
      </Column>
      <Column small={2}>
        <FormText>{`${formatNumber(totalInterestAmount)} €`}</FormText>
      </Column>
      <Column small={2}>
        <FormText>{`${formatNumber(totalCollectionCharge)} €`}</FormText>
      </Column>
      <Column small={2}>
        <FormText>
          <strong>{`${formatNumber(total)} €`}</strong>
        </FormText>
      </Column>
    </Row>
  );
};

export default CollectionLetterTotalRow;
