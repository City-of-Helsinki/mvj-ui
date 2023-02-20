// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormField from '$components/form/FormField';
import {
  getFormAttributes,
} from '$src/plotSearch/selectors';

import type {Attributes} from '$src/types';

type OwnProps = {

  disabled: boolean,
  field: any,
};

type Props = {
  ...OwnProps,
  attributes: Attributes,
}

const SectionField = ({
  disabled,
  field,
  attributes,
}: Props) => {
  return (
    <Fragment>
      <Row className="section-field">
        <Column large={9}>
          <FormField
            fieldAttributes={get(attributes, 'sections.child.children.fields.child.children.enabled')}
            name={`${field}.enabled`}
            overrideValues={{
              fieldType: 'checkbox',
            }}
            invisibleLabel
            disabled={disabled}
          />
          <FormField
            fieldAttributes={get(attributes, 'sections.child.children.fields.child.children.label')}
            name={`${field}.label`}
            overrideValues={{
              allowEdit: false,
            }}
            invisibleLabel
            disabled={disabled}
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
                  value: true,
                },
              ],
            }}
            className="edit-plot-application-section-form__field-required-field"
            invisibleLabel
            disabled={disabled}
          />
        </Column>
      </Row>
    </Fragment>
  );
};

export default (connect(
  (state) => {
    return {
      attributes: getFormAttributes(state),
    };
  }
)(SectionField): React$ComponentType<OwnProps>);
