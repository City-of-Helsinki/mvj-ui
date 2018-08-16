// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {FieldArray, formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import type {Element} from 'react';

import AddButtonThird from '$components/form/AddButtonThird';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import GreenBox from '$components/content/GreenBox';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {receiveFormValidFlags} from '$src/landUseContract/actions';
import {FormNames} from '$src/landUseContract/enums';
import {formatDecimalNumberForDb, formatNumber} from '$util/helpers';
import {getAttributes, getIsSaveClicked} from '$src/landUseContract/selectors';

import type {Attributes} from '$src/landUseContract/types';

type InvoicesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const renderInvoices = ({attributes, fields, isSaveClicked}: InvoicesProps): Element<*> => {
  const handleAdd = () => fields.push({});

  return(
    <div>
      <SubTitle>Korvauksen maksaminen</SubTitle>
      {!fields || !fields.length && <p>Ei laskuja</p>}
      {fields && !!fields.length &&
        <div>
          <Row>
            <Column small={4} medium={3} large={2}><FormFieldLabel>Määrä</FormFieldLabel></Column>
            <Column small={4} medium={3} large={2}><FormFieldLabel>Eräpäivä</FormFieldLabel></Column>
          </Row>
          {fields.map((invoice, index) => {
            const handleRemove = () => fields.remove(index);
            return (
              <Row key={index}>
                <Column small={4} medium={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'compensations.child.children.invoices.child.children.amount')}
                    name={`${invoice}.amount`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={4} medium={3} large={2}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'compensations.child.children.invoices.child.children.due_date')}
                    name={`${invoice}.due_date`}
                    overrideValues={{
                      label: '',
                    }}
                  />
                </Column>
                <Column small={4} medium={3} large={2}>
                  <RemoveButton
                    className='third-level'
                    onClick={handleRemove}
                    title="Poista korvaus"
                  />
                </Column>
              </Row>
            );
          })}
        </div>
      }
      <Row>
        <Column>
          <AddButtonThird
            label='Lisää korvaus'
            onClick={handleAdd}
            title='Lisää korvaus'
          />
        </Column>
      </Row>
    </div>
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
}

class CompensationsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.COMPENSATIONS]: this.props.valid,
      });
    }
  }

  getTotal = () => {
    const {cashCompensation, landCompensation, otherCompensation, firstInstallmentIncrease} = this.props;
    return formatDecimalNumberForDb(cashCompensation) +
      formatDecimalNumberForDb(landCompensation) +
      formatDecimalNumberForDb(otherCompensation) +
      formatDecimalNumberForDb(firstInstallmentIncrease);
  };

  render() {
    const {attributes, isSaveClicked} = this.props;
    const total = this.getTotal();

    return (
      <form>
        <GreenBox>
          <Row>
            <Column small={12} large={6}>
              <WhiteBox>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormFieldLabel>Maankäyttökorvaus</FormFieldLabel>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormFieldLabel>Korvauksen määrä</FormFieldLabel>
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <p>Rahakorvaus</p>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.cash_compensation')}
                      name='compensations.cash_compensation'
                      unit='€'
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <p>Maakorvaus</p>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.land_compensation')}
                      name='compensations.land_compensation'
                      unit='€'
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <p>Muu</p>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.other_compensation')}
                      name='compensations.other_compensation'
                      unit='€'
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <p className='no-margin'>1. maksuerän korotus</p>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'compensations.child.children.first_installment_increase')}
                      name='compensations.first_installment_increase'
                      unit='€'
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                </Row>
                <Divider />
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <p>Yhteensä</p>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <p>{`${formatNumber(total)} €`}</p>
                  </Column>
                </Row>
              </WhiteBox>
            </Column>
          </Row>
          <Row>
            <Column small={6} medium={3} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'compensations.child.children.free_delivery_area')}
                name='compensations.free_delivery_area'
                unit='m²'
                overrideValues={{
                  label: 'Ilmaisluovutusala',
                }}
              />
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'compensations.child.children.free_delivery_amount')}
                name='compensations.free_delivery_amount'
                unit='€'
                overrideValues={{
                  label: 'Ilmaisluovutusarvo',
                }}
              />
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'compensations.child.children.additional_floor_area_apartment')}
                name='compensations.additional_floor_area_apartment'
                unit='k-m²'
                overrideValues={{
                  label: 'Lisäkerrosala asunto',
                }}
              />
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'compensations.child.children.additional_floor_area_company')}
                name='compensations.additional_floor_area_company'
                unit='k-m²'
                overrideValues={{
                  label: 'Lisäkerrosala yritys',
                }}
              />
            </Column>
          </Row>
          <FieldArray
            attributes={attributes}
            component={renderInvoices}
            isSaveClicked={isSaveClicked}
            name="compensations.invoices"
          />
        </GreenBox>
      </form>
    );
  }
}

const formName = FormNames.COMPENSATIONS;
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
  })
)(CompensationsEdit);
