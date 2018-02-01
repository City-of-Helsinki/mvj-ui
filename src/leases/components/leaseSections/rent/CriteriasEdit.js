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
      {fields && fields.length > 0 && fields.map((item, index) => {
        return (
          <div key={index} className='item'>
            <button
              className='remove-button'
              type="button"
              title="Poista vuokranperuste"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
            <Row>
              <Column medium={5}>
                <Row>
                  <Column small={4}>
                    <Field
                      component={FieldTypeSelect}
                      label="Käyttötarkoitus"
                      name={`${item}.purpose`}
                      options={rentCriteriaPurposeOptions}
                    />
                  </Column>
                  <Column small={2}>
                    <Field
                      component={FieldTypeText}
                      label="K-m2"
                      name={`${item}.km2`}
                    />
                  </Column>
                  <Column small={3}>
                    <Field
                      component={FieldTypeText}
                      label="Indeksi"
                      name={`${item}.index`}
                    />
                  </Column>
                  <Column small={3}>
                    <Field
                      component={FieldTypeText}
                      label="€ / k-m2 (ind 100)"
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
                      label="€ / k-m2 (ind)"
                      name={`${item}.ekm2ind`}
                    />
                  </Column>
                  <Column small={2}>
                    <Field
                      component={FieldTypeText}
                      label="Prosenttia"
                      name={`${item}.percentage`}
                    />
                  </Column>
                  <Column small={4}>
                    <Field
                      component={FieldTypeText}
                      label="Perusvuosivuokra €/v (ind 100)"
                      name={`${item}.basic_rent`}
                    />
                  </Column>
                  <Column small={4}>
                    <Field
                      component={FieldTypeText}
                      label="Perusvuosivuokra €/v (ind)"
                      name={`${item}.start_rent`}
                    />
                  </Column>
                </Row>
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
