// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormText from '$components/form/FormText';
import {formatDateRange, formatNumber} from '$util/helpers';
import {getRentSubItemAmount, getRentSubItemDescription} from '../helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  level?: number,
  subItem: Object,
}

const RentCalculatorSubItem = ({attributes, level = 1, subItem}: Props) => {
  const description = getRentSubItemDescription(subItem, attributes);
  const dates = get(subItem, 'date_ranges');
  const amount = getRentSubItemAmount(subItem);
  const subItems = get(subItem, 'sub_items', []);

  return (
    <div>
      <Row>
        <Column small={6}>
          <FormText style={{paddingLeft: (level * 15)}}>
            {description || '-'}
          </FormText>
        </Column>
        <Column small={4}>
          <div>
            {!!dates && !!dates.length &&
              dates.map((date, index) =>
                <FormText key={index}>
                  {formatDateRange(date.start_date, date.end_date)}
                </FormText>
              )
            }
          </div>
        </Column>
        <Column small={2}>
          <FormText className='rent-calculator__sub-item_amount'>
            {amount !== null ? `${formatNumber(amount)} €` : '-'}
          </FormText>
        </Column>
      </Row>
      {!!subItems.length && subItems.map((item, index) => {
        return (
          <RentCalculatorSubItem
            key={index}
            attributes={attributes}
            level={level + 1}
            subItem={item}
          />
        );
      })}
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(RentCalculatorSubItem);
