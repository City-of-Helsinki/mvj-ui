// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import DecisionConditionsEdit from './DecisionConditionsEdit';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributes} from '$src/leases/selectors';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const RuleItemsEdit = ({attributes, fields}: Props) => {
  console.log(attributes);
  const decisionMakerOptions = getAttributeFieldOptions(attributes,
    'decisions.child.children.decision_maker');
  const typeOptions = getAttributeFieldOptions(attributes,
    'decisions.child.children.type');
  return(
    <div>
      {fields && !!fields.length && fields.map((decision, index) =>
        <Collapse
           key={decision.id ? decision.id : `index_${index}`}
          defaultOpen={true}
          headerTitle={
            <h3 className='collapse__header-title'>Päätös {index + 1}</h3>
          }
        >
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright'
              onClick={() => fields.remove(index)}
              title="Poista sopimus"
            />
            <Row>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeSelect}
                  label='Päättäjä'
                  name={`${decision}.decision_maker`}
                  options={decisionMakerOptions}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.decision_maker')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeDatePicker}
                  label='Päätöspäivämäärä'
                  name={`${decision}.decision_date`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.decision_date')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeText}
                  label='Pykälä'
                  name={`${decision}.section`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.section')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeSelect}
                  label='Päätöksen tyyppi'
                  name={`${decision}.type`}
                  options={typeOptions}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.type')),
                  ]}
                />
              </Column>
              <Column small={6} medium={4} large={2}>
                <Field
                  component={FieldTypeText}
                  label='Diaarinumero'
                  name={`${decision}.reference_number`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.reference_number')),
                  ]}
                />
              </Column>
            </Row>
            <Row>
              <Column small={12}>
                <Field
                  component={FieldTypeText}
                  label='Selite'
                  name={`${decision}.description`}
                  validate={[
                    (value) => genericValidator(value,
                      get(attributes, 'decisions.child.children.description')),
                  ]}
                />
              </Column>
            </Row>
          </BoxContentWrapper>

          <FieldArray
            component={DecisionConditionsEdit}
            name={`${decision}.conditions`}
          />
        </Collapse>
      )}
      <Row>
        <Column>
          <AddButton
            label='Lisää uusi päätös'
            onClick={() => fields.push({})}
            title='Lisää uusi päätös'
          />
        </Column>
      </Row>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(RuleItemsEdit);
