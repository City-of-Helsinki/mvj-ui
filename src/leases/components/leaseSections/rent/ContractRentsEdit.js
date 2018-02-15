// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import {rentContractRentPurposeOptions,
  rentContractRentTypeOptions,
} from '../constants';

type Props = {
  fields: any,
  rentType: string,
}

const ContractRentsEdit = ({fields, rentType}: Props) => {
  return (
    <div className="bordered-box">
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
                          component={FieldTypeText}
                          name={`${rent}.contract_rent`}
                        />
                      </Column>
                      <Column small={6}>
                        <Field
                          component={FieldTypeSelect}
                          name={`${rent}.type`}
                          options={rentContractRentTypeOptions}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column medium={2}>
                    <Field
                      component={FieldTypeSelect}
                      name={`${rent}.purpose`}
                      options={rentContractRentPurposeOptions}
                    />
                  </Column>
                  <Column medium={3}>
                    {(rentType === '0' || rentType === '4') &&
                      <Row>
                        <Column small={7} style={{paddingRight: '0'}}>
                          <Field
                            component={FieldTypeText}
                            name={`${rent}.basic_rent`}
                          />
                        </Column>
                        <Column small={5}>
                          <Field
                            component={FieldTypeSelect}
                            name={`${rent}.basic_rent_type`}
                            options={rentContractRentTypeOptions}
                          />
                        </Column>
                      </Row>
                    }
                  </Column>
                  <Column medium={2}>
                    {(rentType === '0' || rentType === '4') &&
                      <Field
                        component={FieldTypeText}
                        name={`${rent}.basic_rent_new`}
                      />
                    }
                  </Column>
                  <Column medium={3}>
                    <Row>
                      <Column small={6}>
                        <Field
                          component={FieldTypeDatePicker}
                          name={`${rent}.start_date`}
                        />
                      </Column>
                      <Column small={6}>
                        <Field
                          component={FieldTypeDatePicker}
                          name={`${rent}.end_date`}
                        />
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Column>
              <Column small={1}>
                <button
                  className='remove-button'
                  type="button"
                  title="Poista alennus/korotus"
                  onClick={() => fields.remove(index)}>
                  <img src={trashIcon} alt='Poista' />
                </button>
              </Column>
            </Row>
          </div>
        );
      })}
      <Row>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää sopimusvuokra</span></a>
        </Column>
      </Row>
    </div>
  );
};

export default ContractRentsEdit;
