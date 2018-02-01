// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import {rentCriteriaPurposeOptions} from '../constants';

type Props = {
  fields: any,
}

const CriteriasEdit = ({fields}: Props) => {
  return (
    <div className="bordered-box">
      {fields && fields.length > 0 &&
        <Row>
          <Column small={11}>
            <Row>
              <Column medium={5}>
                <Row>
                  <Column small={4}>
                    <label className="mvj-form-field-label">Käyttötarkoitus</label>
                  </Column>
                  <Column small={2}>
                    <label className="mvj-form-field-label">K-m2</label>
                  </Column>
                  <Column small={3}>
                    <label className="mvj-form-field-label">Indeksi</label>
                  </Column>
                  <Column small={3}>
                    <label className="mvj-form-field-label">€ / k-m2 (ind 100)</label>
                  </Column>
                </Row>
              </Column>
              <Column medium={7}>
                <Row>
                  <Column small={2}>
                    <label className="mvj-form-field-label">€ / k-m2 (ind)</label>
                  </Column>
                  <Column small={2}>
                    <label className="mvj-form-field-label">Prosenttia</label>
                  </Column>
                  <Column small={4}>
                    <label className="mvj-form-field-label">Perusvuosivuokra €/v (ind 100)</label>
                  </Column>
                  <Column small={4}>
                    <label className="mvj-form-field-label">Perusvuosivuokra €/v (ind)</label>
                  </Column>
                </Row>
              </Column>
            </Row>
          </Column>
        </Row>
      }
      {fields && fields.length > 0 && fields.map((item, index) => {
        return (
          <div key={index}>
            <Row>
              <Column small={11}>
                <Row>
                  <Column medium={5}>
                    <Row>
                      <Column small={4}>
                        <Field
                          component={FieldTypeSelect}
                          name={`${item}.purpose`}
                          options={rentCriteriaPurposeOptions}
                        />
                      </Column>
                      <Column small={2}>
                        <Field
                          component={FieldTypeText}
                          name={`${item}.km2`}
                        />
                      </Column>
                      <Column small={3}>
                        <Field
                          component={FieldTypeText}
                          name={`${item}.index`}
                        />
                      </Column>
                      <Column small={3}>
                        <Field
                          component={FieldTypeText}
                          name={`${item}.ekm2ind100`}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column medium={7}>
                    <Row>
                      <Column small={2}>
                        <Field
                          component={FieldTypeText}
                          name={`${item}.ekm2ind`}
                        />
                      </Column>
                      <Column small={2}>
                        <Field
                          component={FieldTypeText}
                          name={`${item}.percentage`}
                        />
                      </Column>
                      <Column small={4}>
                        <Field
                          component={FieldTypeText}
                          name={`${item}.basic_rent`}
                        />
                      </Column>
                      <Column small={4}>
                        <Field
                          component={FieldTypeText}
                          name={`${item}.start_rent`}
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
                  title="Poista vuokranperuste"
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
          <a onClick={() => fields.push({agreed: false, index: 1880})} className='add-button-secondary'><i /><span>Lisää vuokranperuste</span></a>
        </Column>
      </Row>
    </div>
  );
};

export default CriteriasEdit;
