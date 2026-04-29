import React from "react";
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
import { useSelector } from "react-redux";
type Props = {
  level?: number;
  subItem: Record<string, any>;
};

const RentCalculatorSubItem = ({ level = 1, subItem }: Props) => {
  const attributes: Attributes = useSelector(getAttributes);
  const subjectType = get(subItem, "subject.subject_type");
  const description = getRentSubItemDescription(subItem, attributes);
  const dates = get(subItem, "date_ranges");
  const amount = getRentSubItemAmount(subItem);
  const subItems = get(subItem, "sub_items", []);
  return (
    <>
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
              level={level + 1}
              subItem={item}
            />
          );
        })}
    </>
  );
};

export default RentCalculatorSubItem;
