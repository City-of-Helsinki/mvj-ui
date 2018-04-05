// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import {priceTypeOptions, purposeOptions} from '$src/constants';

type Props = {
  fields: any,
  rentType: string,
}

const ContractRentsEdit = ({fields, rentType}: Props) => {
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
                        name={`${rent}.contract_rent`}
                      />
                    </Column>
                    <Column small={6}>
                      <Field
                        component={FieldTypeSelect}
                        name={`${rent}.type`}
                        options={priceTypeOptions}
                      />
                    </Column>
                  </Row>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeSelect}
                    label='Käyttötarkoitus'
                    name={`${rent}.purpose`}
                    options={purposeOptions}
                  />
                </Column>
                {(rentType === '0' ||
                  rentType === '4') &&
                  <Column small={6} medium={4} large={2}>
                    <label className="mvj-form-field-label">Vuokranlaskennan perusteena oleva vuokra</label>
                    <Row>
                      <Column small={6}>
                        <Field
                          component={FieldTypeText}
                          name={`${rent}.basic_rent`}
                        />
                      </Column>
                      <Column small={6}>
                        <Field
                          component={FieldTypeSelect}
                          name={`${rent}.basic_rent_type`}
                          options={priceTypeOptions}
                        />
                      </Column>
                    </Row>
                  </Column>
                }
                {(rentType === '0' ||
                  rentType === '4') &&
                  <Column small={6} medium={4} large={2} offsetOnLarge={1}>
                    <Field
                      component={FieldTypeText}
                      label='Uusi perusvuosi vuokra'
                      name={`${rent}.basic_rent_new`}
                    />
                  </Column>
                }
                <Column small={6} medium={4} large={2}>
                  <label className="mvj-form-field-label">Voimassaoloaika</label>
                  <Row>
                    <Column small={6}>
                      <Field
                        className='list-item'
                        component={FieldTypeDatePicker}
                        name={`${rent}.start_date`}
                      />
                    </Column>
                    <Column small={6}>
                      <Field
                        className='list-item'
                        component={FieldTypeDatePicker}
                        name={`${rent}.end_date`}
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
