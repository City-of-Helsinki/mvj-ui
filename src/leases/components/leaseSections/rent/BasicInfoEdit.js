// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import {rentBasicInfoBillingTypeOptions,
  rentBasicInfoIndexTypeOptions,
  rentBasicInfoRentalPeriodOptions,
  rentBasicInfoTypeOptions,
} from '../constants';

type DueDatesProps = {
  fields: any,
}

const renderDueDates = ({fields}: DueDatesProps) => {
  return (
    <div>
      <Row>
        <Column>
          <label className="mvj-form-field-label">Eräpäivät</label>
        </Column>
      </Row>
      {fields && fields.length > 0 && fields.map((due_date, index) => {
        return (
          <Row key={index}>
            <Column medium={9}>
              <Field
                className='list-item'
                component={FieldTypeText}
                name={`${due_date}`}
              />
            </Column>
            <Column medium={3}>
              <button
                className='remove-button'
                type="button"
                title="Poista eräpäivä"
                onClick={() => fields.remove(index)}>
                <img src={trashIcon} alt='Poista' />
              </button>
            </Column>
          </Row>
        );
      })}
      <Row style={{paddingBottom: '0.5rem'}}>
        <Column>
          <a onClick={() => fields.push('')} className='add-button-secondary'><i /><span>Lisää eräpäivä</span></a>
        </Column>
      </Row>
    </div>
  );
};

type FixedInitialYearRentsProps = {
  fields: any,
}

const renderFixedInitialYearRents = ({fields}: FixedInitialYearRentsProps) => {
  return (
    <div>
      {fields && fields.length > 0 &&
        <Row>
          <Column medium={2}><label className="mvj-form-field-label">Kiinteä alkuvuosivuokra</label></Column>
          <Column medium={4}>
            <Row>
              <Column small={6}><label className="mvj-form-field-label">Alkupvm</label></Column>
              <Column small={6}><label className="mvj-form-field-label">Loppupvm</label></Column>
            </Row>
          </Column>
        </Row>
      }
      {fields && fields.length > 0 && fields.map((rent, index) => {
        return (
          <div key={index}>
            <Row>
              <Column medium={2}>
                <Field
                  className='list-item'
                  component={FieldTypeText}
                  name={`${rent}.rent`}
                />
              </Column>
              <Column medium={4}>
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
              <Column>
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
      <Row style={{paddingBottom: '0.5rem'}}>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää kiinteä alkuvuosivuokra</span></a>
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  basicInfo: Object,
}

const BasicInfoEdit = ({basicInfo}: Props) => {
  return (
    <div className="green-box">
      <Row>
        <Column medium={10}>
          <Row>
            <Column medium={3}>
              <Field
                component={FieldTypeSelect}
                label="Vuokralaji"
                name="type"
                options={rentBasicInfoTypeOptions}
              />
            </Column>
            {(basicInfo.type === '0' || basicInfo.type === '4') &&
              <Column medium={3}>
                <Field
                  component={FieldTypeSelect}
                  label="Vuokrakausi"
                  name="rental_period"
                  options={rentBasicInfoRentalPeriodOptions}
                />
              </Column>
            }
            {(basicInfo.type === '0' || basicInfo.type === '4') &&
              <Column medium={3}>
                <Field
                  component={FieldTypeSelect}
                  label="Indeksin tunnusnumero (laskentalaji)"
                  name="index_type"
                  options={rentBasicInfoIndexTypeOptions}
                />
              </Column>
            }
            {basicInfo.type === '1' &&
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label="Kertakaikkinen vuokra"
                  name="rent_amount"
                  options={rentBasicInfoIndexTypeOptions}
                />
              </Column>
            }
            {basicInfo.type === '2' &&
              <Column medium={3}>
                <Field
                  component={FieldTypeText}
                  label="Kiinteä vuokra"
                  name="rent_amount"
                  options={rentBasicInfoIndexTypeOptions}
                />
              </Column>
            }
            {basicInfo.type === '2' &&
              <Column medium={3}></Column>
            }
            {(basicInfo.type === '0' || basicInfo.type === '2' || basicInfo.type === '4') &&
              <Column medium={3}>
                <Field
                  component={FieldTypeSelect}
                  label="Laskutusjako"
                  name="billing_type"
                  options={rentBasicInfoBillingTypeOptions}
                />
              </Column>
            }
          </Row>
          {(basicInfo.type === '0' || basicInfo.type === '4') &&
            <Row>
              <Column medium={3}>
                <Row>
                  <Column small={6} style={{paddingRight: '0'}}>
                    <Field
                      component={FieldTypeText}
                      label="Perusindeksi"
                      name="basic_index"
                    />
                  </Column>
                  <Column small={6}>
                    <Field
                      component={FieldTypeText}
                      label="Pyöristys"
                      name="basic_index_rounding"
                    />
                  </Column>
                </Row>
              </Column>
              <Column medium={3}>
                <Row>
                  <Column small={4}>
                    <Field
                      component={FieldTypeText}
                      label="X-luku"
                      name="x_value"
                    />
                  </Column>
                  <Column small={4}>
                    <Field
                      component={FieldTypeText}
                      label="Y-luku"
                      name="y_value"
                    />
                  </Column>
                  <Column small={4}>
                    <Field
                      component={FieldTypeText}
                      label="Y-alkaen"
                      name="y_value_start"
                    />
                  </Column>
                </Row>
              </Column>
              <Column medium={4}>
                <Row>
                  <Column small={6}>
                    <Field
                      component={FieldTypeDatePicker}
                      label="Tasaus alkupvm"
                      name="adjustment_start_date"
                    />
                  </Column>
                  <Column small={6}>
                    <Field
                      component={FieldTypeDatePicker}
                      label="Tasaus loppupvm"
                      name="adjustment_end_date"
                    />
                  </Column>
                </Row>
              </Column>
            </Row>
          }
          {(basicInfo.type === '0' || basicInfo.type === '4') &&
            <Row>
              <Column>
                <FieldArray
                  name="fidex_initial_year_rents"
                  component={renderFixedInitialYearRents}
                />
              </Column>
            </Row>
          }
        </Column>
        {(basicInfo.type === '0' || basicInfo.type === '2' || basicInfo.type === '4') &&
        <Column medium={2}>
          {basicInfo.billing_type === '0' &&
            <FieldArray
              component={renderDueDates}
              name="due_dates"
            />
          }
          {basicInfo.billing_type === '1' &&
            <Field
              component={FieldTypeText}
              label="Laskut kpl / vuodessa"
              name="bill_amount"
            />
          }
        </Column>
        }
      </Row>
      <Row>
        <Column>
          <Field
            className='no-margin'
            component={FieldTypeText}
            label="Kommentti"
            name="comment"
          />
        </Column>
      </Row>
    </div>
  );
};

export default BasicInfoEdit;
