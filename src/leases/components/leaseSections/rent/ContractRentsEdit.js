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
import {RentTypes} from '$src/leases/enums';
import {getAttributeFieldOptions} from '$util/helpers';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  rentType: string,
}

const ContractRentsEdit = ({attributes, fields, rentType}: Props) => {
  const amountPeriodOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.amount_period');
  const baseAmountPeriodOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.base_amount_period');
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'rents.child.children.contract_rents.child.children.intended_use');

  return (
    <div>
      {fields && fields.length > 0 && fields.map((rent, index) => {
        return(
          <GreenBoxItem
            key={index}
            className='no-border-on-first-child'>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista alennus/korotus"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
                  <label className="mvj-form-field-label">Sopimusvuokra</label>
                  <Row>
                    <Column small={6}>
                      <Field
                        component={FieldTypeText}
                        name={`${rent}.amount`}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'rents.child.children.contract_rents.child.children.amount')),
                        ]}
                      />
                    </Column>
                    <Column small={6}>
                      <Field
                        component={FieldTypeSelect}
                        name={`${rent}.amount_period`}
                        options={amountPeriodOptions}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'rents.child.children.contract_rents.child.children.amount_period')),
                        ]}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Käyttötarkoitus'
                    name={`${rent}.intended_use`}
                    options={intendedUseOptions}
                    validate={[
                      (value) => genericValidator(value, get(attributes,
                        'rents.child.children.contract_rents.child.children.intended_use')),
                    ]}
                  />
                </Column>
                {(rentType === RentTypes.INDEX ||
                  rentType === '4') &&
                  <Column small={6} medium={4} large={2}>
                    <label className="mvj-form-field-label">Vuokranlaskennan perusteena oleva vuokra</label>
                    <Row>
                      <Column small={6}>
                        <Field
                          component={FieldTypeText}
                          name={`${rent}.base_amount`}
                          validate={[
                            (value) => genericValidator(value, get(attributes,
                              'rents.child.children.contract_rents.child.children.base_amount')),
                          ]}
                        />
                      </Column>
                      <Column small={6}>
                        <Field
                          component={FieldTypeSelect}
                          name={`${rent}.base_amount_period`}
                          options={baseAmountPeriodOptions}
                          validate={[
                            (value) => genericValidator(value, get(attributes,
                              'rents.child.children.contract_rents.child.children.base_amount_period')),
                          ]}
                        />
                      </Column>
                    </Row>
                  </Column>
                }
                {(rentType === RentTypes.INDEX ||
                  rentType === '4') &&
                  <Column small={6} medium={4} large={2} offsetOnLarge={1}>
                    <Field
                      component={FieldTypeText}
                      label='Uusi perusvuosi vuokra'
                      name={`${rent}.base_year_rent`}
                      validate={[
                        (value) => genericValidator(value, get(attributes,
                          'rents.child.children.contract_rents.child.children.base_year_rent')),
                      ]}
                    />
                  </Column>
                }
                <Column small={6} medium={4} large={2}>
                  <label className="mvj-form-field-label">Voimassaoloaika</label>
                  <Row>
                    <Column small={6}>
                      <Field
                        component={FieldTypeDatePicker}
                        name={`${rent}.start_date`}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'rents.child.children.contract_rents.child.children.start_date')),
                        ]}
                      />
                    </Column>
                    <Column small={6}>
                      <Field
                        component={FieldTypeDatePicker}
                        name={`${rent}.end_date`}
                        validate={[
                          (value) => genericValidator(value, get(attributes,
                            'rents.child.children.contract_rents.child.children.end_date')),
                        ]}
                      />
                    </Column>
                  </Row>
                </Column>
              </Row>
            </BoxContentWrapper>
          </GreenBoxItem>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää sopimusvuokra'
            onClick={() => fields.push({})}
            title='Lisää sopimusvuokra'
          />
        </Column>
      </Row>
    </div>
  );
};

export default ContractRentsEdit;
