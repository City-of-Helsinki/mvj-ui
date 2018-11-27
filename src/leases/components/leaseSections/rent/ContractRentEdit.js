// @flow
import React, {PureComponent} from 'react';
import {change, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import throttle from 'lodash/throttle';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {formatDecimalNumberForDb, isLargeScreen} from '$util/helpers';
import {FormNames, IndexTypes, RentTypes} from '$src/leases/enums';
import {getAttributes, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  amount: string,
  attributes: Attributes,
  change: Function,
  field: string,
  indexType: string,
  isSaveClicked: boolean,
  onRemove: Function,
  rentField: string,
  rentType: string,
}
type State = {
  largeScreen: boolean,
}

class ContractRent extends PureComponent<Props, State> {
  state = {
    largeScreen: isLargeScreen(),
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps: Props) {
    if(this.props.amount !== prevProps.amount ||
      this.props.indexType !== prevProps.indexType
    ) {
      const {amount} = this.props,
        formatedAmount = formatDecimalNumberForDb(amount);

      if(!isNaN(formatedAmount) && formatedAmount !== null) {
        this.setCalculatedBaseAmount(formatedAmount);
      }
    }
  }

  handleResize = throttle(() => {
    this.setState({largeScreen: isLargeScreen()});
  }, 100);

  setCalculatedBaseAmount = (amount: number) => {
    const {change, field, indexType} = this.props;
    let baseAmount = null;

    switch(indexType) {
      case IndexTypes.INDEX_50620:
        baseAmount = amount * 36.43;
        break;
      case IndexTypes.INDEX_4661:
        baseAmount = amount * 33.55;
        break;
      case IndexTypes.INDEX_418_10:
        baseAmount = amount * 3.0;
        break;
      case IndexTypes.INDEX_418_20:
        baseAmount = amount * 3.0;
        break;
      case IndexTypes.INDEX_392:
        baseAmount = amount * 1.3596;
        break;
    }

    if(baseAmount !== null) {
      change(formName, `${field}.base_amount`, baseAmount.toFixed(2));
    }
  }

  render() {
    const {attributes, field, isSaveClicked, onRemove, rentType} = this.props;
    const {largeScreen} = this.state;

    if(largeScreen) {
      return(
        <Row>
          <Column small={6} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.amount')}
                  invisibleLabel
                  name={`${field}.amount`}
                  unit='€'
                />
              </Column>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.period')}
                  invisibleLabel
                  name={`${field}.period`}
                />
              </Column>
            </Row>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.intended_use')}
              invisibleLabel={largeScreen}
              name={`${field}.intended_use`}
              overrideValues={{
                label: 'Käyttötarkoitus',
              }}
            />
          </Column>
          {(rentType === RentTypes.INDEX ||
            rentType === RentTypes.MANUAL) &&
            <Column small={6} medium={4} large={2}>
              <Row>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount')}
                    invisibleLabel
                    name={`${field}.base_amount`}
                    unit='€'
                  />
                </Column>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount_period')}
                    invisibleLabel
                    name={`${field}.base_amount_period`}
                  />
                </Column>
              </Row>
            </Column>
          }
          {(rentType === RentTypes.INDEX ||
            rentType === RentTypes.MANUAL) &&
            <Column small={6} medium={4} large={2} offsetOnLarge={1}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_year_rent')}
                invisibleLabel={largeScreen}
                name={`${field}.base_year_rent`}
                unit='€'
                overrideValues={{
                  label: 'Uusi perusvuosivuokra',
                }}
              />
            </Column>
          }
          <Column small={6} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.start_date')}
                  invisibleLabel={largeScreen}
                  name={`${field}.start_date`}
                  overrideValues={{
                    label: 'Alkupvm',
                  }}
                />
              </Column>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.end_date')}
                  invisibleLabel={largeScreen}
                  name={`${field}.end_date`}
                  overrideValues={{
                    label: 'Loppupvm',
                  }}
                />
              </Column>
            </Row>
          </Column>
          <Column>
            <RemoveButton
              className='third-level'
              onClick={onRemove}
              title="Poista sopimusvuokra"
            />
          </Column>
        </Row>
      );
    } else {
      // For small and medium screens
      return(
        <BoxItem
          className='no-border-on-first-child'>
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright'
              onClick={onRemove}
              title="Poista sopimusvuokra"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle
                  title='Perusvuosivuokra'
                  required={get(attributes, 'rents.child.children.contract_rents.child.children.amount.required')}
                />
                <Row>
                  <Column small={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.amount')}
                      invisibleLabel
                      name={`${field}.amount`}
                      unit='€'
                    />
                  </Column>
                  <Column small={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.period')}
                      invisibleLabel
                      name={`${field}.period`}
                    />
                  </Column>
                </Row>
              </Column>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.intended_use')}
                  invisibleLabel={largeScreen}
                  name={`${field}.intended_use`}
                  overrideValues={{
                    label: 'Käyttötarkoitus',
                  }}
                />
              </Column>
              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.MANUAL) &&
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle
                    title='Vuokranlaskennan perusteena oleva vuokra'
                    required={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount.required')}
                  />
                  <Row>
                    <Column small={6}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount')}
                        invisibleLabel
                        name={`${field}.base_amount`}
                        unit='€'
                      />
                    </Column>
                    <Column small={6}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount_period')}
                        invisibleLabel
                        name={`${field}.base_amount_period`}
                      />
                    </Column>
                  </Row>
                </Column>
              }
              {(rentType === RentTypes.INDEX ||
                rentType === RentTypes.MANUAL) &&
                <Column small={6} medium={4} large={2} offsetOnLarge={1}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_year_rent')}
                    invisibleLabel={largeScreen}
                    name={`${field}.base_year_rent`}
                    unit='€'
                    overrideValues={{
                      label: 'Uusi perusvuosivuokra',
                    }}
                  />
                </Column>
              }
              <Column small={6} medium={4} large={2}>
                <Row>
                  <Column small={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.start_date')}
                      invisibleLabel={largeScreen}
                      name={`${field}.start_date`}
                      overrideValues={{
                        label: 'Alkupvm',
                      }}
                    />
                  </Column>
                  <Column small={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.end_date')}
                      invisibleLabel={largeScreen}
                      name={`${field}.end_date`}
                      overrideValues={{
                        label: 'Loppupvm',
                      }}
                    />
                  </Column>
                </Row>
              </Column>
            </Row>
          </BoxContentWrapper>
        </BoxItem>
      );
    }
  }
}

const formName = FormNames.RENTS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    return {
      amount: selector(state, `${props.field}.amount`),
      attributes: getAttributes(state),
      indexType: selector(state, `${props.rentField}.index_type`),
      isSaveClicked: getIsSaveClicked(state),
    };
  },
  {
    change,
  }
)(ContractRent);
