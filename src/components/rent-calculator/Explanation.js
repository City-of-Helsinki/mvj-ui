// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import SubItem from './SubItem';
import {formatDateRange, formatNumber} from '$util/helpers';
import {getRentExplanationAmount, getRentExplanationDescription} from '../helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  explanation: Object,
}

const Explanation = ({attributes, explanation}: Props) => {
  const description = getRentExplanationDescription(explanation, attributes);
  const dates = get(explanation, 'date_ranges');
  const amount = getRentExplanationAmount(explanation);
  const subItems = get(explanation, 'sub_items');

  return (
    <div className='rent-calculator__explanation'>
      <Row>
        <Column small={6}>
          <p>{description || '-'}</p>
        </Column>
        <Column small={4}>
          <div className='rent-calculator__explanation_dates'>
            {!!dates && !!dates.length &&
              dates.map((date, index) => {
                return <p key={index}>{formatDateRange(date.start_date, date.end_date)}</p>;
              })
            }
          </div>
        </Column>
        <Column small={2}>
          <p className='rent-calculator__explanation_amount'>{`${formatNumber(amount)} €`}</p>
        </Column>
      </Row>
      {!!subItems && !!subItems.length &&
        subItems.map((item, index) => {
          return <SubItem key={index} subItem={item} />;
        })
      }
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(Explanation);
