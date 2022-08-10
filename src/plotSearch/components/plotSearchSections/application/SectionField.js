// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {
  getFormAttributes,
} from '$src/plotSearch/selectors';

import type {Attributes} from '$src/types';

type Props = {
  disabled: boolean,
  field: any,
  formName: string,
  attributes: Attributes,
  onRemove: Function,
}

const SectionField = ({
  disabled,
  field,
  attributes,
  change,
}: Props) => {
  return (
    <Fragment>
      <Row className="section-field">
        <Column large={9}>
          <FormField
            fieldAttributes={get(attributes, 'sections.child.children.fields.child.children.enabled')}
            name={`${field}.enabled`}
            overrideValues={{
              fieldType: 'checkbox'
            }}
            invisibleLabel
          />
          <FormField
            fieldAttributes={get(attributes, 'sections.child.children.fields.child.children.label')}
            name={`${field}.label`}
            overrideValues={{
              allowEdit: false
            }}
            invisibleLabel
          />
        </Column>
        <Column large={3}>
          <FormField
            fieldAttributes={get(attributes, 'sections.child.children.fields.child.children.required')}
            name={`${field}.required`}
            overrideValues={{
              fieldType: 'checkbox',
              options: [
                {
                  label: 'Pakollinen tieto',
                  value: true
                }
              ]
            }}
            className="edit-plot-application-section-form__field-required-field"
            invisibleLabel
          />
        </Column>
      </Row>
    </Fragment>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getFormAttributes(state),
    };
  }
)(SectionField);
