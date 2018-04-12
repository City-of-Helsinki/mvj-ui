// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$util/helpers';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  decisionOptions: Array<Object>,
}

const RentAdjustmentsEdit = ({attributes, decisionOptions, fields}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.type');
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'basis_of_rents.child.children.intended_use');
  const amountTypeOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.rent_adjustments.child.children.amount_type');

  return (
    <div>
      {fields && fields.length > 0 && fields.map((discount, index) => {
        return (
          <GreenBoxItem className='no-border-on-first-child' key={index}>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista alennus/korotus"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Tyyppi'
                    name={`${discount}.type`}
                    options={typeOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'rents.child.children.rent_adjustments.child.children.type')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Käyttötarkoitus'
                    name={`${discount}.intended_use`}
                    options={intendedUseOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'rents.child.children.rent_adjustments.child.children.intended_use')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Row>
                    <Column small={6}>
                      <Field
                        component={FieldTypeDatePicker}
                        label='Alkupvm'
                        name={`${discount}.start_date`}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'rents.child.children.rent_adjustments.child.children.start_date')),
                        ]}
                      />
                    </Column>
                    <Column small={6}>
                      <Field
                        component={FieldTypeDatePicker}
                        label='Loppupvm'
                        name={`${discount}.end_date`}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'rents.child.children.rent_adjustments.child.children.end_date')),
                        ]}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <label className="mvj-form-field-label">Määrä</label>
                  <Row>
                    <Column small={6}>
                      <Field
                        component={FieldTypeText}
                        name={`${discount}.full_amount`}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'rents.child.children.rent_adjustments.child.children.full_amount')),
                        ]}
                      />
                    </Column>
                    <Column small={6}>
                      <Field
                        component={FieldTypeSelect}
                        name={`${discount}.amount_type`}
                        options={amountTypeOptions}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'rents.child.children.rent_adjustments.child.children.amount_type')),
                        ]}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    disabled={true}
                    label="Jäljellä (€)"
                    name={`${discount}.amount_left`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'rents.child.children.rent_adjustments.child.children.amount_left')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    clearable={true}
                    component={FieldTypeSelect}
                    label="Päätös"
                    name={`${discount}.decision`}
                    options={decisionOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'rents.child.children.rent_adjustments.child.children.decision')),
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column medium={12}>
                  <Field
                    component={FieldTypeText}
                    label='Kommentti'
                    name={`${discount}.note`}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'rents.child.children.rent_adjustments.child.children.note')),
                    ]}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </GreenBoxItem>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää alennus/korotus'
            onClick={() => fields.push({})}
            title='Lisää alennus/korotus'
          />
        </Column>
      </Row>
    </div>
  );
};

export default RentAdjustmentsEdit;
