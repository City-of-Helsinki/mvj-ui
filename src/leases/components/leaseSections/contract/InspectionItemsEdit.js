// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeText from '../../../../components/form/FieldTypeText';

type Props = {
  fields: any,
}

const InspectionItemsEdit = ({fields}: Props) => {
  return(
    <div className='green-box'>
      {fields && fields.length > 0 && fields.map((inspection, index) =>
        <div key={index} className='green-box-item'>
          <button
            className='remove-button'
            type="button"
            title="Poista tarkastus"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={4}>
              <Field
                name={`${inspection}.inspector`}
                component={FieldTypeText}
                label='Tarkastaja'
              />
            </Column>
            <Column medium={4}>
              <Field
                name={`${inspection}.supervision_date`}
                component={FieldTypeDatePicker}
                label='Valvonta päivämäärä'
              />
            </Column>
            <Column medium={4}>
              <Field
                name={`${inspection}.supervised_date`}
                component={FieldTypeDatePicker}
                label='Valvottu päivämäärä'
              />
            </Column>
          </Row>
          <Row>
            <Column medium={12}>
              <Field
                className='no-margin'
                component={FieldTypeText}
                label='Selite'
                name={`${inspection}.inspection_description`}
              />
            </Column>
          </Row>
        </div>
      )}
      <Row>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää tarkastus</span></a>
        </Column>
      </Row>
    </div>
  );
};

export default InspectionItemsEdit;
