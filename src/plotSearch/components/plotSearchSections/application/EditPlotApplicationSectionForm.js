// @flow
import React, {Fragment, Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm, getFormValues} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import classNames from 'classnames';

import {AppConsumer} from '$src/app/AppContext';
import {FieldArray} from 'redux-form';
import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {getFormAttributes} from '$src/plotSearch/selectors';
import SectionField from './SectionField';
import Collapse from "../../../../components/collapse/Collapse";
import TitleH3 from "../../../../components/content/TitleH3";

import type {Attributes} from '$src/types';

type SectionFieldProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  isSaveClicked: Boolean,
  attributes: Attributes,
}

const renderSectionFields = ({
  disabled,
  fields,
  form,
  // usersPermissions,
}: SectionFieldProps): Element<*> => {
  return (
    <AppConsumer>
      {() => {
        return (
          <Fragment>
            {!!fields.length && fields.map((field, index) => {
              return <SectionField
                key={index}
                disabled={disabled}
                field={field}
                form={form}
              />;
            })}
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  attributes: Attributes,
  change: Function,
  onClose: Function,
  onSubmit: Function,
  valid: boolean,
  name: string,
  sectionIndex: number,
  section: Object
}

class EditPlotApplicationSectionForm extends Component<Props> {
  firstField: any

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  setFocus = () => {
    if(this.firstField) {
      this.firstField.focus();
    }
  }

  componentDidMount(): * {
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

  componentDidUpdate(prevProps: Props): * {
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

  handleSubmit = () => {
    const {
      onSubmit,
      onClose,
      stagedSectionValues
    } = this.props;
    onSubmit(stagedSectionValues.section);
    onClose();
  };

  renderSubsection = (field, level) => {
    const { stagedSectionValues, form, change, attributes } = this.props;
    const subsection = get(stagedSectionValues, field);

    const Wrapper = (level > 1)
      ? ({children}) => <Collapse
          defaultOpen={true}
          headerTitle={subsection.title}
          headerExtras={<div className="edit-plot-application-section-form__add-new-allowed-field">
            <FormField
              fieldAttributes={get(attributes, 'sections.child.children.add_new_allowed')}
              name={`${field}.add_new_allowed`}
              overrideValues={{
                fieldType: 'checkbox',
                options: [
                  {
                    label: 'Monistettava lohko',
                    value: true
                  }
                ]
              }}
              invisibleLabel
            />
          </div>}
          className={classNames(
            'edit-plot-application-section-form__section',
            `edit-plot-application-section-form__section--level-${level}`,
            {
              'collapse__secondary': level === 2,
              'collapse__third': level > 2
            }
          )}
        >{children}</Collapse>
      : ({children}) => <div className={classNames(
        'edit-plot-application-section-form__section',
        `edit-plot-application-section-form__section--level-${level}`
      )}>{children}</div>

    return <Wrapper>
      <FieldArray
        component={renderSectionFields}
        disabled={false}
        form={form}
        name={`${field}.fields`}
        change={change}
        stagedSectionValues={stagedSectionValues}
      />
      <FieldArray
        component={({ fields }) => fields.map(
          (ss, i) => <Fragment key={i}>{this.renderSubsection(ss, level + 1)}</Fragment>)}
        disabled={false}
        form={form}
        name={`${field}.subsections`}
      />
    </Wrapper>;
  };

  render() {
    const {
      attributes,
      onClose,
      valid,
      stagedSectionValues
    } = this.props;

    if (!stagedSectionValues?.section) {
      return null;
    }

    return (
      <form>
        <TitleH3>
          {stagedSectionValues.section.title}
        </TitleH3>
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
        {this.renderSubsection('section', 1)}
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
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state, props: Props) => {
      return {
        attributes: getFormAttributes(state),
        parentFormSection: parentSelector(state, `form.sections[${props.sectionIndex}]`),
        stagedSectionValues: getFormValues(formName)(state)
      };
    },
    {
      change,
    },
    null,
    {forwardRef: true}
  ),
  reduxForm({
    form: formName,
  }),
)(EditPlotApplicationSectionForm);
