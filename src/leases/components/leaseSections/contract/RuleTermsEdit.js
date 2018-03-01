// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';

type Props = {
  fields: any,
  title: string,
}

const RuleTermsEdit = ({title, fields}: Props) => {
  return(
    <div className='green-box'>
      {fields.length > 0 &&
      <Row>
        <Column>
          <h2>{title}</h2>
        </Column>
      </Row>}
      {fields && fields.length > 0 && fields.map((term, index) =>
        <div key={index} className='green-box-item'>
          <button
            className='remove-button'
            type="button"
            title="Poista ehto"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={6}>
              <Field
                name={`${term}.term_purpose`}
                component={FieldTypeSelect}
                label='Käyttötarkoitusehto'
                options={[
                  {value: 'discount', label: 'Alennusehto'},
                ]}
              />
            </Column>
            <Column medium={3}>
              <Field
                name={`${term}.supervision_date`}
                component={FieldTypeDatePicker}
                label='Valvonta päivämäärä'
              />
            </Column>
            <Column medium={3}>
              <Field
                name={`${term}.supervised_date`}
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
                name={`${term}.term_description`}
              />
            </Column>
          </Row>
        </div>
      )}
      <Row>
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Lisää ehto</span></a>
        </Column>
      </Row>
    </div>
  );
};

export default RuleTermsEdit;
