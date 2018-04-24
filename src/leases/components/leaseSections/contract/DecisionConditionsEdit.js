// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {getAttributes} from '$src/leases/selectors';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const DecisionConditionsEdit = ({
  attributes,
  fields,
}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'decisions.child.children.conditions.child.children.type');
  return(
    <Collapse
      className='collapse__secondary'
      defaultOpen={true}
      headerTitle={
        <h4 className='collapse__header-title'>Ehdot</h4>
      }
    >
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((condition, index) =>
          <BoxItem
            key={condition.id ? condition.id : `index_${index}`}
            className='no-border-on-first-child'
          >
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista ehto"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
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
                <Column small={6} medium={4} large={2}>
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
                <Column small={12} medium={4} large={2}>
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
                <Column small={12} medium={12} large={6}>
                  <Field
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
          </BoxItem>
        )}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää ehto'
            onClick={() => fields.push({})}
            title='Lisää ehto'
          />
        </Column>
      </Row>
    </Collapse>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(DecisionConditionsEdit);
