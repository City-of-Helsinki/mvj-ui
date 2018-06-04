// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';

import SubItem from './SubItem';
import {RentExplanationSubjectType} from '../enums';
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
  const subjectType = get(explanation, 'subject.subject_type');

  return (
    <div className='rent-calculator__explanation'>
      <Row>
        <Column small={6}>
          <p className={classNames({'rent-calculator__explanation_type-rent': subjectType === RentExplanationSubjectType.RENT})}>
            {description || '-'}
          </p>
        </Column>
        <Column small={4}>
          <div className='rent-calculator__explanation_dates'>
            {!!dates && !!dates.length &&
              dates.map((date, index) => {
                return <p
                  key={index}
                  className={classNames({'rent-calculator__explanation_type-rent': subjectType === RentExplanationSubjectType.RENT})}>{formatDateRange(date.start_date, date.end_date)}</p>;
              })
            }
          </div>
        </Column>
        <Column small={2}>
          <p className={classNames('rent-calculator__explanation_amount', {'rent-calculator__explanation_type-rent': subjectType === RentExplanationSubjectType.RENT})}>
            {`${formatNumber(amount)} €`}
          </p>
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
