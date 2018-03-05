// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '../../../../components/form/AddButtonSecondary';
import BorderedBoxEdit from '../../../../components/content/BorderedBoxEdit';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import RemoveButton from '../../../../components/form/RemoveButton';
import {priceTypeOptions, purposeOptions} from '../../../../constants';

type Props = {
  fields: any,
  rentType: string,
}

const ContractRentsEdit = ({fields, rentType}: Props) => {
  return (
    <BorderedBoxEdit>
      {fields && fields.length > 0 &&
        <Row>
          <Column small={11}>
            <Row>
              <Column medium={2}>
                <Row>
                  <Column><label className="mvj-form-field-label">Sopimusvuokra</label></Column>
                </Row>
              </Column>
              <Column medium={2}>
                <Row>
                  <Column><label className="mvj-form-field-label">Käyttötarkoitus</label></Column>
                </Row>
              </Column>
              <Column medium={3}>
                {(rentType === '0' || rentType === '4') &&
                  <Row>
                    <Column><label className="mvj-form-field-label">Vuokranlaskennan perusteena oleva vuokra</label></Column>
                  </Row>
                }
              </Column>
              <Column medium={2}>
                {(rentType === '0' || rentType === '4') &&
                  <Row>
                    <Column><label className="mvj-form-field-label">Uusi perusvuosi vuokra</label></Column>
                  </Row>
                }
              </Column>
              <Column medium={3}>
                <Row>
                  <Column><label className="mvj-form-field-label">Voimassaoloaika</label></Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      }
      {fields && fields.length > 0 && fields.map((rent, index) => {
        return(
          <div key={index}>
            <Row>
              <Column small={11}>
                <Row>
                  <Column medium={2}>
                    <Row>
                      <Column small={6} style={{paddingRight: '0'}}>
                        <Field
                          className='list-item'
                          component={FieldTypeText}
                          name={`${rent}.contract_rent`}
                        />
                      </Column>
                      <Column small={6}>
                        <Field
                          className='list-item'
                          component={FieldTypeSelect}
                          name={`${rent}.type`}
                          options={priceTypeOptions}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column medium={2}>
                    <Field
                      className='list-item'
                      component={FieldTypeSelect}
                      name={`${rent}.purpose`}
                      options={purposeOptions}
                    />
                  </Column>
                  <Column medium={3}>
                    {(rentType === '0' ||
                      rentType === '4') &&
                      <Row>
                        <Column small={7} style={{paddingRight: '0'}}>
                          <Field
                            className='list-item'
                            component={FieldTypeText}
                            name={`${rent}.basic_rent`}
                          />
                        </Column>
                        <Column small={5}>
                          <Field
                            className='list-item'
                            component={FieldTypeSelect}
                            name={`${rent}.basic_rent_type`}
                            options={priceTypeOptions}
                          />
                        </Column>
                      </Row>
                    }
                  </Column>
                  <Column medium={2}>
                    {(rentType === '0' ||
                      rentType === '4') &&
                      <Field
                        className='list-item'
                        component={FieldTypeText}
                        name={`${rent}.basic_rent_new`}
                      />
                    }
                  </Column>
                  <Column medium={3}>
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
              </Column>
              <Column small={1}>
                <RemoveButton
                  onClick={() => fields.remove(index)}
                  title="Poista alennus/korotus"
                />
              </Column>
            </Row>
          </div>
        );
      })}
      <Row>
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää sopimusvuokra'
            onClick={() => fields.push({})}
            title='Lisää sopimusvuokra'
          />
        </Column>
      </Row>
    </BorderedBoxEdit>
  );
};

export default ContractRentsEdit;
