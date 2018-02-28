// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import RuleTermsEdit from './RuleTermsEdit';

type Props = {
  fields: any,
}

const RuleItemsEdit = ({fields}: Props) => {
  return(
    <div>
      {fields && fields.length > 0 && fields.map((rule, index) =>
        <div key={index} className='item'>
          <div className='white-box'>
            <button
              className='remove-button'
              type="button"
              title="Poista sopimus"
              onClick={() => fields.remove(index)}>
              <img src={trashIcon} alt='Poista' />
            </button>
            <Row>
              <Column medium={4}>
                <Field
                  name={`${rule}.rule_maker`}
                  component={FieldTypeSelect}
                  label='Päättäjä'
                  options={[
                    {value: 'rent-contract', label: 'To be filled'},
                  ]}
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${rule}.rule_date`}
                  component={FieldTypeDatePicker}
                  label='Päätöspäivämäärä'
                />
              </Column>
              <Column medium={2}>
                <Field
                  name={`${rule}.rule_clause`}
                  component={FieldTypeText}
                  label='Pykälä'
                />
              </Column>
              <Column medium={4}>
                <Field
                  name={`${rule}.rule_type`}
                  component={FieldTypeSelect}
                  label='Päätöksen tyyppi'
                  options={[
                    {value: 'rent-contract', label: 'To be filled'},
                  ]}
                />
              </Column>
            </Row>
            <Row>
              <Column medium={12}>
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label='Selite'
                  name={`${rule}.rule_description`}
                />
              </Column>
            </Row>
          </div>

          <FieldArray title='Ehdot' name={`${rule}.terms`} component={RuleTermsEdit}/>
        </div>
      )}
      <Row>
        <Column>
          <button type="button" onClick={() => fields.push({})} className='add-button'>Lisää uusi päätös</button>
        </Column>
      </Row>
    </div>
  );
};

export default RuleItemsEdit;
