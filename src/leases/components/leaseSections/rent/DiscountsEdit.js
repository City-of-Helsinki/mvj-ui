// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import {rentDiscountAmountTypeOptions,
  rentDiscountTypeOptions} from '../constants';
import {decisionOptions, purposeOptions} from '$src/constants';

type Props = {
  fields: any,
}

const DiscountsEdit = ({fields}: Props) => {
  return (
    <GreenBoxEdit>
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
                <Column medium={6}>
                  <Row>
                    <Column small={3}>
                      <Field
                        component={FieldTypeSelect}
                        label='Tyyppi'
                        name={`${discount}.type`}
                        options={rentDiscountTypeOptions}
                      />
                    </Column>
                    <Column small={4}>
                      <Field
                        component={FieldTypeSelect}
                        label='Käyttötarkoitus'
                        name={`${discount}.purpose`}
                        options={purposeOptions}
                      />
                    </Column>
                    <Column small={5}>
                      <Row>
                        <Column small={6} style={{paddingRight: '0'}}>
                          <Field
                            component={FieldTypeDatePicker}
                            label='Alkupvm'
                            name={`${discount}.start_date`}
                          />
                        </Column>
                        <Column small={6} style={{paddingRight: '0'}}>
                          <Field
                            component={FieldTypeDatePicker}
                            label='Loppupvm'
                            name={`${discount}.end_date`}
                          />
                        </Column>
                      </Row>
                    </Column>
                  </Row>
                </Column>
                <Column medium={6}>
                  <Row>
                    <Column small={6}>
                      <Row>
                        <Column><label className="mvj-form-field-label">Kokonaismäärä</label></Column>
                      </Row>
                      <Row>
                        <Column small={6} style={{paddingRight: '0'}}>
                          <Field
                            component={FieldTypeText}
                            name={`${discount}.amount`}
                          />
                        </Column>
                        <Column small={6} style={{paddingRight: '0'}}>
                          <Field
                            component={FieldTypeSelect}
                            name={`${discount}.amount_type`}
                            options={rentDiscountAmountTypeOptions}
                          />
                        </Column>
                      </Row>
                    </Column>
                    <Column small={3}>
                      <Field
                        component={FieldTypeText}
                        disabled={true}
                        label="Jäljellä (€)"
                        name={`${discount}.amount_left`}
                      />
                    </Column>
                    <Column small={3}>
                      <Field
                        clearable={true}
                        component={FieldTypeSelect}
                        label="Päätös"
                        name={`${discount}.rule`}
                        options={decisionOptions}
                      />
                    </Column>
                  </Row>
                </Column>
              </Row>
              <Row>
                <Column medium={12}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='Kommentti'
                    name={`${discount}.comment`}
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
            className='no-margin'
            label='Lisää sopimuksen muutos'
            onClick={() => fields.push({})}
            title='Lisää sopimuksen muutos'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default DiscountsEdit;
