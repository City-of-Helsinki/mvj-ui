// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, change} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import type {Attributes} from '$src/types';
import {
  getUsedPrice,
  getSum,
} from '$src/landUseContract/helpers';

type Props = {
  attributes: Attributes,
  field: any,
  formName: string,
  isSaveClicked: boolean,
  onRemove: Function,
  change: Function,
  unitValue: string,
  discount: string,
  area: string,
  usedPrice: string,
}

class UnitPricesUsedInCalculation extends Component<Props> {

  onChangeUsedPrice = () => {
    const {change, formName, field, unitValue, discount} = this.props;
    const calclulatedUsedPrice = getUsedPrice(unitValue, discount);
    change(formName, `${field}.used_price`, calclulatedUsedPrice);
    this.onChangeSum(calclulatedUsedPrice);
  };

  onChangeSum = (calclulatedUsedPrice) => {
    const {change, formName, field, area} = this.props;
    const sum = getSum(area, calclulatedUsedPrice);
    change(formName, `${field}.sum`, sum);
  }

  render(){
    const {isSaveClicked, attributes, field, onRemove} = this.props;
    return(    
      <Row>
        <Column large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'compensations.child.children.unit_prices_used_in_calculation.child.children.usage')}
            invisibleLabel
            name={`${field}.usage`}
          />
        </Column>
        <Column large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'compensations.child.children.unit_prices_used_in_calculation.child.children.management')}
            invisibleLabel
            name={`${field}.management`}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'compensations.child.children.unit_prices_used_in_calculation.child.children.protected')}
            invisibleLabel
            name={`${field}.protected`}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'compensations.child.children.unit_prices_used_in_calculation.child.children.area')}
            invisibleLabel
            name={`${field}.area`}
            onChange={this.onChangeUsedPrice}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'compensations.child.children.unit_prices_used_in_calculation.child.children.unit_value')}
            invisibleLabel
            name={`${field}.unit_value`}
            onChange={this.onChangeUsedPrice}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'compensations.child.children.unit_prices_used_in_calculation.child.children.discount')}
            invisibleLabel
            name={`${field}.discount`}
            onChange={this.onChangeUsedPrice}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'compensations.child.children.unit_prices_used_in_calculation.child.children.used_price')}
            invisibleLabel
            name={`${field}.used_price`}
          />
        </Column>
        <Column large={1}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'compensations.child.children.unit_prices_used_in_calculation.child.children.used_price')}
            invisibleLabel
            name={`${field}.sum`}
          />
        </Column>
        <Column>
          <RemoveButton
            className='third-level'
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
