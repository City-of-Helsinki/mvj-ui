// @flow
import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import FormField from '$components/form/FormField';
import {
  getFormAttributes,
} from '$src/plotSearch/selectors';

import type {Attributes} from '$src/types';
import InfoIcon from '$components/icons/InfoIcon';
import Tooltip from '$components/tooltip/Tooltip';
import {FormNames} from '$src/enums';
import {formValueSelector} from 'redux-form';
import TooltipToggleButton from '$components/tooltip/TooltipToggleButton';
import TooltipWrapper from '$components/tooltip/TooltipWrapper';

type OwnProps = {
  disabled: boolean,
  field: any,
};

type Props = {
  ...OwnProps,
  attributes: Attributes,
  fieldValues: Object,
}

const SectionField = ({
  disabled,
  field,
  attributes,
  fieldValues,
}: Props) => {
  const [isHintPopupOpen, setIsHintPopupOpen] = useState<boolean>(false);

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
          {fieldValues.hint_text &&
            <TooltipWrapper>
              <TooltipToggleButton
                className='section-field__hint-text-button'
                onClick={() => setIsHintPopupOpen(true)}>
                <InfoIcon />
              </TooltipToggleButton>
              <Tooltip
                isOpen={isHintPopupOpen}
                onClose={() => setIsHintPopupOpen(false)}>
                {fieldValues.hint_text}
              </Tooltip>
            </TooltipWrapper>
          }
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

const selector = formValueSelector(FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING);

export default (connect(
  (state, props: OwnProps) => {
    return {
      attributes: getFormAttributes(state),
      fieldValues: selector(state, props.field),
    };
  }
)(SectionField): React$ComponentType<OwnProps>);
