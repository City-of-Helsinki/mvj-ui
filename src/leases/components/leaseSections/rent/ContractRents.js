// @flow
import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import BoxItemContainer from '$components/content/BoxItemContainer';
import ContractRent from './ContractRent';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import {RentTypes} from '$src/leases/enums';
import {getAttributeFieldOptions} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  contractRents: Array<Object>,
  largeScreen: boolean,
  rentType: string
}

type State = {
  amountPeriodOptions: Array<Object>,
  attributes: Attributes,
  baseAmountPeriodOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
}

class ContractRents extends PureComponent<Props, State> {
  state = {
    amountPeriodOptions: [],
    attributes: {},
    baseAmountPeriodOptions: [],
    intendedUseOptions: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState = {};

    if(props.attributes !== state.attributes) {
      newState.attributes = props.attributes;
      newState.amountPeriodOptions = getAttributeFieldOptions(props.attributes,
        'rents.child.children.contract_rents.child.children.period');
      newState.baseAmountPeriodOptions = getAttributeFieldOptions(props.attributes,
        'rents.child.children.contract_rents.child.children.base_amount_period');
      newState.intendedUseOptions = getAttributeFieldOptions(props.attributes,
        'rents.child.children.contract_rents.child.children.intended_use');
    }
    return newState;
  }

  render() {
    const {contractRents, largeScreen, rentType} = this.props;
    const {
      amountPeriodOptions,
      baseAmountPeriodOptions,
      intendedUseOptions,
    } = this.state;

    return (
      <div>
        <BoxItemContainer>
          {(!contractRents || !contractRents.length) && <FormText>Ei sopimusvuokria</FormText>}
          {contractRents && !!contractRents.length && largeScreen &&
            <Row>
              <Column large={2}>
                <FormTextTitle title='Perusvuosivuokra' />
              </Column>
              <Column large={2}>
                <FormTextTitle title='Käyttötarkoitus' />
              </Column>
              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.MANUAL) &&
                <Column large={3}>
                  <FormTextTitle title='Vuokranlaskennan perusteena oleva vuokra' />
                </Column>
              }
              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.MANUAL) &&
                <Column large={2}>
                  <FormTextTitle title='Uusi perusvuosivuokra' />
                </Column>
              }
              <Column large={1}>
                <FormTextTitle title='Alkupvm' />
              </Column>
              <Column large={1}>
                <FormTextTitle title='Loppupvm' />
              </Column>
            </Row>
          }

          {contractRents && !!contractRents.length && contractRents.map((contractRent, index) => {
            return <ContractRent
              key={index}
              amountPeriodOptions={amountPeriodOptions}
              baseAmountPeriodOptions={baseAmountPeriodOptions}
              contractRent={contractRent || {}}
              intendedUseOptions={intendedUseOptions}
              largeScreen={largeScreen}
              rentType={rentType}
            />;
          })}
        </BoxItemContainer>
      </div>
    );
  }
}

export default flowRight(
  withWindowResize,
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
      };
    },
  ),
)(ContractRents);
