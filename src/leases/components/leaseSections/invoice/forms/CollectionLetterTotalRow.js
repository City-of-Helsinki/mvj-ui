// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';

import {FormNames} from '$src/leases/enums';
import {formatDecimalNumberForDb, formatNumber} from '$util/helpers';
import {getPenaltyInterestByInvoice} from '$src/penaltyInterest/selectors';

type Props = {
  collectionCharge: number,
  fields: any,
  penaltyInterestArray: Array<Object>,
}

const CollectionLetterTotalRow = ({
  collectionCharge,
  penaltyInterestArray,
}: Props) => {
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
    const formatedCollectionCharge = formatDecimalNumberForDb(collectionCharge);

    if(collectionCharge && !isNaN(formatedCollectionCharge)) {
      penaltyInterestArray.forEach(() => {
        total += formatedCollectionCharge;
      });
    }
    return total;
  };

  const totalOutstandingAmount = getTotalOutstandingAmount(),
    totalInterestAmount = getTotalInterestAmount(),
    totalCollectionCharge = getTotalCollectionCharge(),
    total = totalOutstandingAmount + totalInterestAmount + totalCollectionCharge;

  return(
    <Row>
      <Column small={4}>
        <p>Yhteensä</p>
      </Column>
      <Column small={2}>
        <p>{`${formatNumber(totalOutstandingAmount)} €`}</p>
      </Column>
      <Column small={2}>
        <p>{`${formatNumber(totalInterestAmount)} €`}</p>
      </Column>
      <Column small={2}>
        <p>{`${formatNumber(totalCollectionCharge)} €`}</p>
      </Column>
      <Column small={2}>
        <p><strong>{`${formatNumber(total)} €`}</strong></p>
      </Column>
    </Row>
  );
};

const formName = FormNames.CREATE_COLLECTION_LETTER;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const penaltyInterestArray = [];
    props.fields.forEach((field) => {
      const invoice = selector(state, field),
        penaltyInterest = getPenaltyInterestByInvoice(state, invoice);
      if(!isEmpty(penaltyInterest)) {
        penaltyInterestArray.push(penaltyInterest);
      }
    });

    return {
      penaltyInterestArray: penaltyInterestArray,
    };
  },
)(CollectionLetterTotalRow);
