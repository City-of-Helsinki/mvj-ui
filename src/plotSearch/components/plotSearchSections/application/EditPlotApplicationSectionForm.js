// @flow
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm, getFormValues} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import classNames from 'classnames';

import {FieldArray} from 'redux-form';
import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {getFormAttributes} from '$src/plotSearch/selectors';
import SectionField from './SectionField';
import Collapse from "../../../../components/collapse/Collapse";
import type {Attributes} from '$src/types';
import SubTitle from "../../../../components/content/SubTitle";

type SectionFieldProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  isSaveClicked: Boolean,
  form: string
}

const EditPlotApplicationSectionFormSectionFields = ({
  disabled,
  fields,
  form,
  // usersPermissions,
}: SectionFieldProps): React$Element<*> => {
  return (
    <div className="edit-plot-application-form__section-fields-container">
      {!!fields.length && fields.map((field, index) => {
        return <SectionField
          key={index}
          disabled={disabled}
          field={field}
          form={form}
        />;
      })}
    </div>
  );
};

type SectionSubsectionProps = {
  fields: any,
  form: string,
  attributes: Attributes,
  level: number,
  stagedSectionValues: Object
}

const EditPlotApplicationSectionFormSectionSubsections = ({
  fields,
  form,
  attributes,
  level,
  stagedSectionValues
}: SectionSubsectionProps): React$Element<*> => {
  return fields.map(
    (ss, i) => <EditPlotApplicationSectionFormSubsection
      sectionPath={ss}
      level={level}
      stagedSectionValues={stagedSectionValues}
      form={form}
      attributes={attributes}
      key={i}
    />);
}

type SubsectionProps = {
  attributes: Attributes,
  level: number,
  sectionPath: string,
  form: string,
  stagedSectionValues: Object
}

const EditPlotApplicationSectionFormSubsectionFirstLevelWrapper = ({children, level}) => <div className={classNames(
  'edit-plot-application-section-form__section',
  `edit-plot-application-section-form__section--level-${level}`
)}>{children}</div>;

const EditPlotApplicationSectionFormSubsectionSecondLevelWrapper = ({
  children,
  attributes,
  sectionPath,
  level,
  subsection
}) => <Collapse
  defaultOpen
  headerTitle={subsection.title}
  headerExtras={<div className="edit-plot-application-section-form__subsection-header-options">
    <FormField
      fieldAttributes={get(attributes, 'sections.child.children.visible')}
      name={`${sectionPath}.visible`}
      overrideValues={{
        label: 'Lohko käytössä'
      }}
      className="edit-plot-application-section-form__subsection-header-visible-field"
    />
    {subsection.show_duplication_check ? <FormField
      fieldAttributes={get(attributes, 'sections.child.children.add_new_allowed')}
      name={`${sectionPath}.add_new_allowed`}
      overrideValues={{
        fieldType: 'checkbox',
        options: [
          {
            label: 'Monistettava lohko',
            value: true
          }
        ]
      }}
      className="edit-plot-application-section-form__subsection-header-add-new-allowed-field"
      invisibleLabel
    /> : <div className="edit-plot-application-section-form__subsection-header-add-new-allowed-field" />}
  </div>}
  className={classNames(
    'edit-plot-application-section-form__section',
    `edit-plot-application-section-form__section--level-${level}`,
    {
      'collapse__secondary': level === 2,
      'collapse__third': level > 2
    }
  )}
>{children}</Collapse>;

const EditPlotApplicationSectionFormSubsection: React$ComponentType<SubsectionProps> = ({
  sectionPath,
  level,
  form,
  attributes,
  stagedSectionValues
}: SubsectionProps) => {
  const subsection = get(stagedSectionValues, sectionPath);

  const Wrapper = (level > 1)
    ? EditPlotApplicationSectionFormSubsectionSecondLevelWrapper
    : EditPlotApplicationSectionFormSubsectionFirstLevelWrapper;

  return <Wrapper level={level} attributes={attributes} sectionPath={sectionPath} subsection={subsection}>
    <FieldArray
      component={EditPlotApplicationSectionFormSectionFields}
      disabled={false}
      form={form}
      name={`${sectionPath}.fields`}
    />
    <FieldArray
      component={EditPlotApplicationSectionFormSectionSubsections}
      disabled={false}
      form={form}
      name={`${sectionPath}.subsections`}
      attributes={attributes}
      level={level + 1}
      stagedSectionValues={stagedSectionValues}
    />
  </Wrapper>;
}

type Props = {
  attributes: Attributes,
  onClose: Function,
  onSubmit: Function,
  valid: boolean,
  name: string,
  sectionIndex: number,
  section: Object,
  parentFormSection: Object,
  initialize: Function,
  form: string,
  stagedSectionValues: Object
}

class EditPlotApplicationSectionForm extends Component<Props> {
  firstField: any

  setRefForFirstField = (element: any): void => {
    this.firstField = element;
  }

  setFocus = (): void => {
    if(this.firstField) {
      this.firstField.focus();
    }
  }

  componentDidMount(): void {
    const {
      sectionIndex,
      parentFormSection,
      initialize
    } = this.props;
    if (sectionIndex !== undefined) {
      initialize({
        section: parentFormSection
      });
    }
  }

  componentDidUpdate(prevProps: Props): void {
    const {
      sectionIndex,
      parentFormSection,
      initialize
    } = this.props;
    if (sectionIndex !== prevProps.sectionIndex) {
      initialize({
        section: parentFormSection
      });
    }
  }

  handleSubmit = (): void => {
    const {
      onSubmit,
      onClose,
      stagedSectionValues
    } = this.props;
    onSubmit(stagedSectionValues.section);
    onClose();
  };

  render() {
    const {
      attributes,
      onClose,
      valid,
      parentFormSection,
      stagedSectionValues,
      form,
    } = this.props;

    if (!parentFormSection) {
      return null;
    }

    return (
      <form>
        <SubTitle>
          {parentFormSection.title}
        </SubTitle>
        <Row>
          <Column small={6}>
            <FormField
              fieldAttributes={get(attributes, 'sections.child.children.visible')}
              name={'section.visible'}
              overrideValues={{
                label: 'Osio käytössä'
              }}
            />
          </Column>
          <Column small={6}>
            <FormField
              fieldAttributes={get(attributes, 'sections.child.children.add_new_allowed')}
              name={'section.add_new_allowed'}
              overrideValues={{
                label: 'Monistettava osio'
              }}
            />
          </Column>
        </Row>
        <EditPlotApplicationSectionFormSubsection
          sectionPath='section'
          level={1}
          stagedSectionValues={stagedSectionValues}
          form={form}
          attributes={attributes} />
        <ModalButtonWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onClose}
            text='Peruuta'
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={!valid}
            onClick={this.handleSubmit}
            text='Valmis'
          />
        </ModalButtonWrapper>
      </form>
    );
  }
}

const parentFormName = FormNames.PLOT_SEARCH_APPLICATION;
const parentSelector = formValueSelector(parentFormName);

const formName = FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING;

export default flowRight(
  connect(
    (state, props: Props) => {
      return {
        attributes: getFormAttributes(state),
        parentFormSection: parentSelector(state, `form.sections[${props.sectionIndex}]`),
        stagedSectionValues: getFormValues(formName)(state)
      };
    },
    null,
    null,
    {forwardRef: true}
  ),
  reduxForm({
    form: formName,
  }),
)(EditPlotApplicationSectionForm);
