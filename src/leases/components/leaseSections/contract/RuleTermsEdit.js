// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButtonSecondary from '../../../../components/form/AddButtonSecondary';
import BoxContentWrapper from '../../../../components/content/BoxContentWrapper';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';
import GreenBoxEdit from '../../../../components/content/GreenBoxEdit';
import GreenBoxItem from '../../../../components/content/GreenBoxItem';
import RemoveButton from '../../../../components/form/RemoveButton';

type Props = {
  fields: any,
  title: string,
}

const RuleTermsEdit = ({title, fields}: Props) => {
  return(
    <GreenBoxEdit>
      <h2>{title}</h2>

      {fields && fields.length > 0 && fields.map((term, index) =>
        <GreenBoxItem key={index}>
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright-no-padding'
              onClick={() => fields.remove(index)}
              title="Poista ehto"
            />
            <Row>
              <Column medium={6}>
                <Field
                  component={FieldTypeSelect}
                  label='Käyttötarkoitusehto'
                  name={`${term}.term_purpose`}
                  options={[
                    {value: 'discount', label: 'Alennusehto'},
                  ]}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Valvonta päivämäärä'
                  name={`${term}.supervision_date`}
                />
              </Column>
              <Column medium={3}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Valvottu päivämäärä'
                  name={`${term}.supervised_date`}
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
          </BoxContentWrapper>
        </GreenBoxItem>
      )}
      <Row>
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää ehto'
            onClick={() => fields.push({})}
            title='Lisää ehto'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default RuleTermsEdit;
