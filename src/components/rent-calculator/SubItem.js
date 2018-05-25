// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import {formatDateRange, formatNumber} from '$util/helpers';
import {getRentSubItemAmount, getRentSubItemDescription} from '../helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  subItem: Object,
}

const Explanation = ({attributes, subItem}: Props) => {
  const description = getRentSubItemDescription(subItem, attributes);
  const dates = get(subItem, 'date_ranges');
  const amount = getRentSubItemAmount(subItem);

  return (
    <div className='rent-calculator__sub-item'>
      <Row>
        <Column small={6}>
          <p className='rent-calculator__sub-item_description'>{description || '-'}</p>
        </Column>
        <Column small={4}>
          <div className='rent-calculator__sub-item_dates'>
            {!!dates && !!dates.length &&
              dates.map((date, index) => {
                return <p key={index}>{formatDateRange(date.start_date, date.end_date)}</p>;
              })
            }
          </div>

        </Column>
        <Column small={2}>
          <p className='rent-calculator__sub-item_amount'>{`${formatNumber(amount)} €`}</p>
        </Column>
      </Row>
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
