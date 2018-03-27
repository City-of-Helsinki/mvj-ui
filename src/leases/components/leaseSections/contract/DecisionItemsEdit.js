// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContentItem from '$components/content/ContentItem';
import DecisionConditionsEdit from './DecisionConditionsEdit';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';
import {genericValidator} from '$components/form/validations';
import {getAttributeFieldOptions} from '$src/util/helpers';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const RuleItemsEdit = ({attributes, fields}: Props) => {
  const decisionMakerOptions = getAttributeFieldOptions(attributes,
    'decisions.child.children.decision_maker');
  const typeOptions = getAttributeFieldOptions(attributes,
    'decisions.child.children.type');
  return(
    <div>
      {fields && fields.length > 0 && fields.map((decision, index) =>
        <ContentItem key={decision.id ? decision.id : `index_${index}`}>
          <WhiteBoxEdit>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
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
                    className='no-margin'
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
          </WhiteBoxEdit>

          <FieldArray
            attributes={attributes}
            component={DecisionConditionsEdit}
            name={`${decision}.conditions`}
            title='Ehdot'
          />
        </ContentItem>
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

export default RuleItemsEdit;
