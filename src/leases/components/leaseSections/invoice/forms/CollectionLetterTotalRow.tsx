import React from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import isEmpty from "lodash/isEmpty";
import FormText from "src/components/form/FormText";
import { FormNames } from "src/enums";
import { convertStrToDecimalNumber, formatNumber } from "src/util/helpers";
import { getPenaltyInterestByInvoice } from "src/penaltyInterest/selectors";
type OwnProps = {
  selectedInvoices: Array<Record<string, any>>;
};
type Props = OwnProps & {
  fields: any;
  penaltyInterestArray: Array<Record<string, any>>;
};

const CollectionLetterTotalRow = ({
  selectedInvoices,
  penaltyInterestArray
}: Props) => {
  const getTotalOutstandingAmount = () => {
    let total = 0;
    penaltyInterestArray.forEach(penaltyInterest => {
      total += penaltyInterest.outstanding_amount;
    });
    return total;
  };

  const getTotalInterestAmount = () => {
    let total = 0;
    penaltyInterestArray.forEach(penaltyInterest => {
      total += penaltyInterest.total_interest_amount;
    });
    return total;
  };

  const getTotalCollectionCharge = () => {
    let total = 0;

    if (selectedInvoices) {
      selectedInvoices.forEach(invoice => {
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
        total = totalOutstandingAmount + totalInterestAmount + totalCollectionCharge;
  return <Row>
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
        <FormText><strong>{`${formatNumber(total)} €`}</strong></FormText>
      </Column>
    </Row>;
};

const formName = FormNames.LEASE_CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);
export default (connect((state, props) => {
  const penaltyInterestArray = [];
  props.fields.forEach(field => {
    const invoice = selector(state, field),
          penaltyInterest = getPenaltyInterestByInvoice(state, invoice.invoice);

    if (!isEmpty(penaltyInterest)) {
      penaltyInterestArray.push(penaltyInterest);
    }
  });
  return {
    penaltyInterestArray: penaltyInterestArray
  };
})(CollectionLetterTotalRow) as React.ComponentType<OwnProps>);