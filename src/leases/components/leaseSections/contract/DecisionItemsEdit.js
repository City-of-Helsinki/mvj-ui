// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import Collapse from '$components/collapse/Collapse';
import DecisionConditionsEdit from './DecisionConditionsEdit';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributes} from '$src/leases/selectors';
import {referenceNumber} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const DecisionItemsEdit = ({attributes, fields}: Props) =>
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
              <FormField
                fieldAttributes={get(attributes, 'decisions.child.children.decision_maker')}
                name={`${decision}.decision_maker`}
                overrideValues={{
                  label: 'Päättäjä',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                fieldAttributes={get(attributes, 'decisions.child.children.decision_date')}
                name={`${decision}.decision_date`}
                overrideValues={{
                  label: 'Päätöspvm',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                fieldAttributes={get(attributes, 'decisions.child.children.section')}
                name={`${decision}.section`}
                overrideValues={{
                  label: 'Pykälä',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                fieldAttributes={get(attributes, 'decisions.child.children.type')}
                name={`${decision}.type`}
                overrideValues={{
                  label: 'Päätöksen tyyppi',
                }}
              />
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                fieldAttributes={get(attributes, 'decisions.child.children.reference_number')}
                name={`${decision}.reference_number`}
                validate={referenceNumber}
                overrideValues={{
                  label: 'Diaarinumero',
                }}
              />
            </Column>
          </Row>
          <Row>
            <Column small={12}>
              <FormField
                fieldAttributes={get(attributes, 'decisions.child.children.description')}
                name={`${decision}.description`}
                overrideValues={{
                  label: 'Huomautus',
                }}
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
          label='Lisää päätös'
          onClick={() => fields.push({})}
          title='Lisää päätös'
        />
      </Column>
    </Row>
  </div>;

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(DecisionItemsEdit);
