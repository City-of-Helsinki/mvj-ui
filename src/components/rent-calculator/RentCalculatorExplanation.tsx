import React from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import classNames from "classnames";
import get from "lodash/get";
import AmountWithVat from "/src/components/vat/AmountWithVat";
import FormText from "/src/components/form/FormText";
import RentCalculatorSubItem from "./RentCalculatorSubItem";
import { RentExplanationSubjectType } from "../enums";
import { formatDateRange, formatNumber } from "util/helpers";
import { getRentExplanationAmount, getRentExplanationDescription } from "../helpers";
import { getAttributes } from "leases/selectors";
import type { Attributes } from "types";
type Props = {
  attributes: Attributes;
  date: string;
  explanation: Record<string, any>;
};

const RentCalculatorExplanation = ({
  attributes,
  date,
  explanation
}: Props) => {
  const description = getRentExplanationDescription(explanation, attributes);
  const dates = get(explanation, 'date_ranges');
  const amount = getRentExplanationAmount(explanation);
  const subItems = get(explanation, 'sub_items');
  const subjectType = get(explanation, 'subject.subject_type');
  return <div className='rent-calculator__explanation'>
      <Row className='rent-calculator__explanation_row'>
        <Column small={6}>
          <FormText className={classNames({
          'semibold': subjectType === RentExplanationSubjectType.RENT
        })}>
            {description || '-'}
          </FormText>
        </Column>
        <Column small={3}>
          <div className='rent-calculator__explanation_dates'>
            {!!dates && !!dates.length && dates.map((date, index) => {
            return <FormText key={index} className={classNames({
              'semibold': subjectType === RentExplanationSubjectType.RENT
            })}>{formatDateRange(date.start_date, date.end_date)}
                </FormText>;
          })}
          </div>
        </Column>
        <Column small={3}>
          {subjectType === RentExplanationSubjectType.RENT ? <FormText className={classNames('rent-calculator__explanation_amount', 'semibold')}>
              <AmountWithVat amount={amount} date={date} />
            </FormText> : <FormText className='rent-calculator__explanation_amount'>
              {`${formatNumber(amount)} €`}
            </FormText>}
        </Column>
      </Row>
      {!!subItems && !!subItems.length && subItems.map((item, index) => {
      return <RentCalculatorSubItem key={index} subItem={item} />;
    })}
    </div>;
};

export default connect(state => {
  return {
    attributes: getAttributes(state)
  };
})(RentCalculatorExplanation);