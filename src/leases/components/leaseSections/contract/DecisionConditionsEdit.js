// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  title: string,
}

const DecisionConditionsEdit = ({
  attributes,
  fields,
  title,
}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'decisions.child.children.conditions.child.children.type');
  return(
    <GreenBoxEdit>
      <h2>{title}</h2>

      {fields && !!fields.length && fields.map((condition, index) =>
        <GreenBoxItem key={condition.id ? condition.id : `index_${index}`}>
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright-no-padding'
              onClick={() => fields.remove(index)}
              title="Poista ehto"
            />
            <Row>
              <Column small={6} medium={4}>
                <Field
                  component={FieldTypeSelect}
                  label='Käyttötarkoitusehto'
                  name={`${condition}.type`}
                  options={typeOptions}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.conditions.child.children.type')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Valvonta päivämäärä'
                  name={`${condition}.supervision_date`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.conditions.child.children.supervision_date')),
                  ]}
                />
              </Column>
              <Column small={12} medium={4}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Valvottu päivämäärä'
                  name={`${condition}.supervised_date`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.conditions.child.children.supervised_date')),
                  ]}
                />
              </Column>
            </Row>
            <Row>
              <Column small={12} >
                <Field
                  className='no-margin'
                  component={FieldTypeText}
                  label='Selite'
                  name={`${condition}.description`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.conditions.child.children.description')),
                  ]}
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

export default DecisionConditionsEdit;
