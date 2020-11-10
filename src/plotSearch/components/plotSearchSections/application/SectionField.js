// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {reduxForm} from 'redux-form';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames} from '$src/enums';
import {
  getFormAttributes,
  // getIsSaveClicked,
} from '$src/plotSearch/selectors';

import type {Attributes} from '$src/types';

type Props = {
  disabled: boolean,
  field: any,
  formName: string,
  // isSaveClicked: boolean,
  attributes: Attributes,
  onRemove: Function,
}

const SectionField = ({
  disabled,
  field,
  // isSaveClicked,
  attributes,
  onRemove,
}: Props) => {
  return (
    <Fragment>
      <Row>
        <Column>
          <Authorization allow={true}>
            {!disabled &&
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                style={{height: 'unset'}}
                title='Poista kenttä'
              />
            }
          </Authorization>
        </Column>
      </Row>
      <Row>
        <Column>
          <FormField
            // disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'section_fields.child.children.field_name')}
            name={`${field}.field_name`}
          />
        </Column>
        <Column>
          <FormField
            // disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'section_fields.child.children.field_type')}
            name={`${field}.field_type`}
          />
        </Column>
        <Column>
          <FormField
            // disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'section_fields.child.children.required_field')}
            name={`${field}.required_field`}
          />
        </Column>
        <Column>
          <FormField
            // disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'section_fields.child.children.duplicate')}
            name={`${field}.duplicate`}
          />
        </Column>
      </Row>
    </Fragment>
  );
};

const formName = FormNames.PLOT_APPLICATION;

export default connect(
  (state) => {
    return {
      attributes: getFormAttributes(state),
      // isSaveClicked: getIsSaveClicked(state),
    };
  },
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(SectionField);
