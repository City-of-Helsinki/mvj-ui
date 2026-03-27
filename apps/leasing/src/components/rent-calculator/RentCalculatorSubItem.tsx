import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import classNames from "classnames";
import get from "lodash/get";
import FormText from "@/components/form/FormText";
import { RentSubItemSubjectType } from "@/components/enums";
import { formatDateRange, formatNumber } from "@/util/helpers";
import {
  getRentSubItemAmount,
  getRentSubItemDescription,
} from "@/components/helpers";
import { getAttributes } from "@/leases/selectors";
import type { Attributes } from "types";
type Props = {
  attributes: Attributes;
  level?: number;
  subItem: Record<string, any>;
};

const RentCalculatorSubItem = ({ attributes, level = 1, subItem }: Props) => {
  const subjectType = get(subItem, "subject.subject_type");
  const description = getRentSubItemDescription(subItem, attributes);
  const dates = get(subItem, "date_ranges");
  const amount = getRentSubItemAmount(subItem);
  const subItems = get(subItem, "sub_items", []);
  return (
    <Fragment>
      <Row className="rent-calculator__sub-item">
        <Column small={6}>
          <FormText
            style={{
              paddingLeft: level * 15,
            }}
            className={classNames({
              alert: subjectType === RentSubItemSubjectType.NOTICE,
            })}
          >
            {description || "-"}
          </FormText>
        </Column>
        <Column small={3}>
          <div>
            {!!dates &&
              !!dates.length &&
              dates.map((date, index) => (
                <FormText key={index}>
                  {formatDateRange(date.start_date, date.end_date)}
                </FormText>
              ))}
          </div>
        </Column>
        <Column small={3}>
          <FormText className="rent-calculator__sub-item_amount">
            {amount !== null ? `${formatNumber(amount)} €` : ""}
          </FormText>
        </Column>
      </Row>
      {!!subItems.length &&
        subItems.map((item, index) => {
          return (
            <RentCalculatorSubItem
              key={index}
              attributes={attributes}
              level={level + 1}
              subItem={item}
            />
          );
        })}
    </Fragment>
  );
};

export default connect((state) => {
  return {
    attributes: getAttributes(state),
  };
})(RentCalculatorSubItem);
