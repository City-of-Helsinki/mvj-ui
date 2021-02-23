// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector, reduxForm, change} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import GreenBox from '$components/content/GreenBox';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {convertStrToDecimalNumber, formatNumber} from '$util/helpers';
import {getAttributes, getIsSaveClicked} from '$src/landUseContract/selectors';
import UnitPricesUsedInCalculations from './UnitPricesUsedInCalculations';
import type {Attributes} from '$src/types';

type InvoicesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
  change: Function,
  formName: string,
}

const renderUnitPricesUsedInCalculation = ({attributes, fields, isSaveClicked}: InvoicesProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {fields && !!fields.length &&
              <div>
                <Row>
                  <Column large={2}>
                    <FormTextTitle title='Kaavayksikön käyttötarkoitus' />
                  </Column>
                  <Column large={2}>
                    <FormTextTitle title='Hallintamuoto' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Suojeltu' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='k-m²' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Yksikköhinta €' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Alennus %' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Käytetty hinta' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Summa' />
                  </Column>
                </Row>
                {fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: 'Lisää yksikköhinta', 
                      confirmationModalLabel: 'Poista yksikköhinta',
                      confirmationModalTitle: 'Oletko varma että haluat poistaa yksikköhinnan',
                    });
                  };

                  return (
                    <UnitPricesUsedInCalculations 
                      key={index}
                      onRemove={handleRemove}
                      attributes={attributes}
                      isSaveClicked={isSaveClicked}
                      formName={formName}
                      field={field}
                    />
                  );
                })}
              </div>
            }
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää yksikköhinta'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  isSaveClicked: boolean,
  receiveFormValidFlags: Function,
  valid: boolean,
  cashCompensation: number,
  landCompensation: number,
  otherCompensation: number,
  firstInstallmentIncrease: number,
  change: Function,
}

class CompensationsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid,
      });
    }
  }

  getTotal = () => {
    const {cashCompensation, landCompensation, otherCompensation, firstInstallmentIncrease} = this.props;

    return convertStrToDecimalNumber(cashCompensation) +
      convertStrToDecimalNumber(landCompensation) +
      convertStrToDecimalNumber(otherCompensation) +
      convertStrToDecimalNumber(firstInstallmentIncrease);
  };

  render() {
    const {attributes, isSaveClicked, change} = this.props;
    const total = this.getTotal();

    return (
      <form>
        <GreenBox>
          <Row>
            <Column small={12} large={6}>
              <SubTitle>Maankäyttökorvaus</SubTitle>
              <WhiteBox>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='Maankäyttökorvaus' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='Korvauksen määrä' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Rahakorvaus</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.cash_compensation')}
                      invisibleLabel
                      name='compensations.cash_compensation'
                      unit='€'
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Maakorvaus</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.land_compensation')}
                      invisibleLabel
                      name='compensations.land_compensation'
                      unit='€'
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Muu</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.other_compensation')}
                      invisibleLabel
                      name='compensations.other_compensation'
                      unit='€'
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText className='no-margin'>1. maksuerän korotus</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.first_installment_increase')}
                      invisibleLabel
                      name='compensations.first_installment_increase'
                      unit='€'
                    />
                  </Column>
                </Row>
                <Divider />
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText className='semibold'>Yhteensä</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormText>{`${formatNumber(total)} €`}</FormText>
                  </Column>
                </Row>
              </WhiteBox>
            </Column>
          </Row>
        </GreenBox>
        <GreenBox className={'with-top-margin'}>
          <Row>
            <Column small={12} large={6}>
              <SubTitle>Korvauksetta luovutettavat yleiset alueet</SubTitle>
              <WhiteBox>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='Kaavayksikön käyttötarkoitus' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='Hankinta-arvo €' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='m²' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Katu (9901)</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.street_acquisition_value')}
                      invisibleLabel
                      name='compensations.street_acquisition_value'
                      unit='€'
                    />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.street_area')}
                      invisibleLabel
                      name='compensations.street_area'
                      unit='m²'
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Puisto (9903)</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.park_acquisition_value')}
                      invisibleLabel
                      name='compensations.park_acquisition_value'
                      unit='€'
                    />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.park_area')}
                      invisibleLabel
                      name='compensations.park_area'
                      unit='m²'
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Muut</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.other_acquisition_value')}
                      invisibleLabel
                      name='compensations.other_acquisition_value'
                      unit='€'
                    />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.other_area')}
                      invisibleLabel
                      name='compensations.other_area'
                      unit='m²'
                    />
                  </Column>
                </Row>
              </WhiteBox>
            </Column>
          </Row>
        </GreenBox>
        <GreenBox className={'with-top-margin'}>
          <Row>
            <Column>
              <SubTitle>Laskelmassa käytetyt yksikköhinnat</SubTitle>
              <WhiteBox>
                <Row>
                  <Column>
                    <FieldArray
                      component={renderUnitPricesUsedInCalculation}
                      attributes={attributes}
                      isSaveClicked={isSaveClicked}
                      change={change}
                      disabled={isSaveClicked}
                      formName={FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION}
                      name={'compensations.unit_prices_used_in_calculation'}
                    />
                  </Column>
                </Row>
              </WhiteBox>
            </Column>
          </Row>
        </GreenBox>
      </form>
    );
  }
}

const formName = FormNames.LAND_USE_CONTRACT_COMPENSATIONS;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isSaveClicked: getIsSaveClicked(state),
        cashCompensation: selector(state, 'compensations.cash_compensation'),
        landCompensation: selector(state, 'compensations.land_compensation'),
        otherCompensation: selector(state, 'compensations.other_compensation'),
        firstInstallmentIncrease: selector(state, 'compensations.first_installment_increase'),
      };
    },
    {
      receiveFormValidFlags,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    change,
  })
)(CompensationsEdit);
