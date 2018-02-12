// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {Field} from 'redux-form';

import FieldTypeCheckboxSingle from '../../../../components/form/FieldTypeCheckboxSingle';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeText from '../../../../components/form/FieldTypeText';

type Props = {
  onSave: Function,
}

const AddBillEdit = ({onSave}: Props) => {
  return (
    <div>
      <div className='green-box'>
        <h2>Laskun tiedot</h2>
        <Row>
          <Column medium={3}>
            <label className='mvj-form-field-label'>Laskutuskausi</label>
            <Row>
              <Column small={6} style={{paddingRight: '0.25rem'}}>
                <Field
                  component={FieldTypeDatePicker}
                  name='billing_period_start_date'
                />
              </Column>
              <Column small={6} style={{paddingLeft: '0.25rem'}}>
                <Field
                  component={FieldTypeDatePicker}
                  name='billing_period_end_date'
                />
              </Column>
            </Row>
          </Column>
          <Column medium={2}>
            <Field
              className='no-label'
              component={FieldTypeCheckboxSingle}
              name='is_utter'
              optionLabel='Kertakaikkinen'
            />
          </Column>
          <Column medium={5}>
            <Row>
              <Column medium={4}>
                <Field
                  component={FieldTypeText}
                  label='Laskun pääoma'
                  name='capital_amount'
                />
              </Column>
              <Column medium={4}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Eräpäivä'
                  name='due_date'
                />
              </Column>
              <Column medium={4}>
                <Field
                  component={FieldTypeText}
                  label='Saamislaji'
                  name='type'
                />
              </Column>
            </Row>
          </Column>

          <Column medium={2}>
            <Field
              className='no-label'
              component={FieldTypeCheckboxSingle}
              name='is_abnormal_debt'
              optionLabel='Poikkeava perintä'
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <Field
              component={FieldTypeText}
              label='Tiedote'
              name='info'
            />
          </Column>
        </Row>
      </div>
      <Row style={{marginTop: '1rem'}}>
        <Column>
          <button
            className='add-button'
            onClick={() => onSave()}
            type='button'>Tallenna</button>
        </Column>
      </Row>
    </div>
  );
};

export default AddBillEdit;
