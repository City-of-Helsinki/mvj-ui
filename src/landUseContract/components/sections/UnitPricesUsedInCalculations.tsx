import React, { Component } from "react";
import { connect } from "react-redux";
import { formValueSelector, change } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import FormField from "@/components/form/FormField";
import RemoveButton from "@/components/form/RemoveButton";
import type { Attributes } from "types";
import { getUsedPrice, getSum } from "@/landUseContract/helpers";
import FormText from "@/components/form/FormText";
import { formatNumber } from "@/util/helpers";
type Props = {
  attributes: Attributes;
  field: any;
  formName: string;
  isSaveClicked: boolean;
  onRemove: (...args: Array<any>) => any;
  change: (...args: Array<any>) => any;
  unitValue: string;
  discount: string;
  area: string;
  usedPrice: string;
};

class UnitPricesUsedInCalculation extends Component<Props> {
  onChangeUsedPrice = () => {
    const { change, formName, field, unitValue, discount } = this.props;
    const calclulatedUsedPrice = getUsedPrice(unitValue, discount);
    change(formName, `${field}.used_price`, calclulatedUsedPrice);
    this.onChangeSum(calclulatedUsedPrice);
  };
  onChangeSum = (calclulatedUsedPrice) => {
    const { change, formName, field, area } = this.props;
    const sum = getSum(area, calclulatedUsedPrice);
    change(formName, `${field}.sum`, sum);
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.discount !== prevProps.discount ||
      this.props.unitValue !== prevProps.unitValue ||
      this.props.usedPrice !== prevProps.usedPrice ||
      this.props.area !== prevProps.area
    ) {
      this.onChangeUsedPrice();
    }
  }

  render() {
    const {
      isSaveClicked,
      attributes,
      field,
      onRemove,
      area,
      unitValue,
      discount,
    } = this.props;
    const sum = getSum(area, getUsedPrice(unitValue, discount));
    return (
      <Row>
        <Column large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(
              attributes,
              "compensations.children.unit_prices_used_in_calculation.child.children.usage",
            )}
            invisibleLabel
            name={`${field}.usage`}
          />
        </Column>
        <Column large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(
              attributes,
              "compensations.children.unit_prices_used_in_calculation.child.children.management",
            )}
            invisibleLabel
            name={`${field}.management`}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(
              attributes,
              "compensations.children.unit_prices_used_in_calculation.child.children.protected",
            )}
            invisibleLabel
            name={`${field}.protected`}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(
              attributes,
              "compensations.children.unit_prices_used_in_calculation.child.children.area",
            )}
            invisibleLabel
            name={`${field}.area`}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(
              attributes,
              "compensations.children.unit_prices_used_in_calculation.child.children.unit_value",
            )}
            invisibleLabel
            name={`${field}.unit_value`}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(
              attributes,
              "compensations.children.unit_prices_used_in_calculation.child.children.discount",
            )}
            invisibleLabel
            name={`${field}.discount`}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(
              attributes,
              "compensations.children.unit_prices_used_in_calculation.child.children.used_price",
            )}
            invisibleLabel
            name={`${field}.used_price`}
          />
        </Column>
        <Column large={1}>
          <FormText>{sum ? `${formatNumber(sum)} €` : "-"}</FormText>
        </Column>
        <Column>
          <RemoveButton
            className="third-level"
            onClick={onRemove}
            title="Poista yksikköhinta"
          />
        </Column>
      </Row>
    );
  }
}

export default connect(
  (state, props: Props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);
    return {
      discount: selector(state, `${props.field}.discount`),
      unitValue: selector(state, `${props.field}.unit_value`),
      usedPrice: selector(state, `${props.field}.used_price`),
      area: selector(state, `${props.field}.area`),
    };
  },
  {
    change,
  },
)(UnitPricesUsedInCalculation);
