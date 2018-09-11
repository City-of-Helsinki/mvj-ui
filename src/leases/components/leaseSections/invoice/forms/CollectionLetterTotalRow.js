// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';

import {fetchCollectionCostsByInvoice} from '$src/debtCollection/actions';
import {FormNames} from '$src/leases/enums';
import {formatNumber} from '$util/helpers';
import {getCollectionCostsByInvoice} from '$src/debtCollection/selectors';

type Props = {
  collectionCostsArray: Array<Object>,
  fields: any,
}

const CollectionLetterTotalRow = ({
  collectionCostsArray,
}: Props) => {
  const getTotalFeePayment = () => {
    let total = 0;
    collectionCostsArray.forEach((collectionCost) => {
      total += Number(collectionCost.fee_payment);
    });
    return total;
  };

  const getTotalInterest = () => {
    let total = 0;
    collectionCostsArray.forEach((collectionCost) => {
      total += Number(collectionCost.interest);
    });
    return total;
  };

  const getTotalCollectionFee = () => {
    let total = 0;
    collectionCostsArray.forEach((collectionCost) => {
      total += Number(collectionCost.collection_fee);
    });
    return total;
  };

  const totalFeePayment = getTotalFeePayment(),
    totalInterest = getTotalInterest(),
    totalCollectionFee = getTotalCollectionFee(),
    total = totalFeePayment + totalInterest + totalCollectionFee;

  return(
    <Row>
      <Column small={4}>
        <p>Yhteensä</p>
      </Column>
      <Column small={2}>
        <p>{`${formatNumber(totalFeePayment)} €`}</p>
      </Column>
      <Column small={2}>
        <p>{`${formatNumber(totalInterest)} €`}</p>
      </Column>
      <Column small={2}>
        <p>{`${formatNumber(totalCollectionFee)} €`}</p>
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
    const collectionCostsArray = [];
    props.fields.forEach((field) => {
      const invoice = selector(state, field),
        collectionCosts = getCollectionCostsByInvoice(state, invoice);
      if(!isEmpty(collectionCosts)) {
        collectionCostsArray.push(collectionCosts);
      }
    });

    return {
      collectionCostsArray: collectionCostsArray,
    };
  },
  {
    fetchCollectionCostsByInvoice,
  }
)(CollectionLetterTotalRow);
