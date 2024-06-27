import React, { Component, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm, getFormValues, change } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import classNames from "classnames";
import { FieldArray } from "redux-form";
import Button from "/src/components/button/Button";
import FormField from "/src/components/form/FormField";
import ModalButtonWrapper from "/src/components/modal/ModalButtonWrapper";
import { ConfirmationModalTexts, FieldTypes, FormNames } from "enums";
import { ButtonColors } from "/src/components/enums";
import EditPlotApplicationSectionFieldForm from "/src/plotSearch/components/plotSearchSections/application/EditPlotApplicationSectionFieldForm";
import Collapse from "/src/components/collapse/Collapse";
import SubTitle from "/src/components/content/SubTitle";
import { getFieldTypeMapping, getFormAttributes } from "/src/application/selectors";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import IconButton from "/src/components/button/IconButton";
import TrashIcon from "/src/components/icons/TrashIcon";
import MoveUpIcon from "/src/components/icons/MoveUpIcon";
import MoveDownIcon from "/src/components/icons/MoveDownIcon";
import type { Attributes } from "types";
import type { FormSection } from "/src/application/types";
import { generateSectionIdentifierFromName, getDefaultNewFormField, getDefaultNewFormSection, getInitialFormSectionEditorData, transformCommittedFormSectionEditorData } from "/src/plotSearch/helpers";
import { APPLICANT_SECTION_IDENTIFIER } from "/src/application/constants";
import { getSectionEditorCollapseStates } from "/src/plotSearch/selectors";
import { clearSectionEditorCollapseStates, initializeSectionEditorCollapseStates, setSectionEditorCollapseState } from "/src/plotSearch/actions";
import { uniq } from "lodash/array";
import ErrorBlock from "/src/components/form/ErrorBlock";
type SectionFieldProps = {
  disabled: boolean;
  fields: any;
  formName: string;
  isSaveClicked: Boolean;
  form: string;
  fieldIdentifiers: Array<string>;
  dispatch: (...args: Array<any>) => any;
  collapseStates: Record<string, boolean>;
  setSectionEditorCollapseState: (...args: Array<any>) => any;
  meta: Record<string, any>;
};

const EditPlotApplicationSectionFormSectionFields = ({
  disabled,
  fields,
  form,
  fieldIdentifiers,
  dispatch,
  collapseStates,
  setSectionEditorCollapseState,
  meta // usersPermissions,

}: SectionFieldProps): React.ReactNode => {
  const fieldRefs = useRef({});

  const handleRemove = (index: number) => {
    dispatch({
      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
      confirmationFunction: () => {
        fields.remove(index);
      },
      confirmationModalButtonClassName: ButtonColors.ALERT,
      confirmationModalButtonText: ConfirmationModalTexts.DELETE_SECTION_FIELD.BUTTON,
      confirmationModalLabel: ConfirmationModalTexts.DELETE_SECTION_FIELD.LABEL,
      confirmationModalTitle: ConfirmationModalTexts.DELETE_SECTION_FIELD.TITLE
    });
  };

  return <div className="edit-plot-application-form__section-fields-container">
      {!!fields.length && fields.map((field, index) => {
      const handleMoveUp = id => {
        fields.move(index, index - 1);
        setImmediate(() => {
          if (index - 1 !== 0) {
            fieldRefs.current[`SectionEditorMoveUpButton_Field_${id}`]?.focus();
          } else {
            fieldRefs.current[`SectionEditorMoveDownButton_Field_${id}`]?.focus();
          }
        });
      };

      const handleMoveDown = id => {
        fields.move(index, index + 1);
        setImmediate(() => {
          if (index + 1 < fields.length - 1) {
            fieldRefs.current[`SectionEditorMoveDownButton_Field_${id}`]?.focus();
          } else {
            fieldRefs.current[`SectionEditorMoveUpButton_Field_${id}`]?.focus();
          }
        });
      };

      return <EditPlotApplicationSectionFieldForm key={index} disabled={disabled} field={field} form={form} fieldIdentifiers={fieldIdentifiers.filter((_, i) => index !== i)} onDelete={() => handleRemove(index)} onMoveUp={index > 0 ? handleMoveUp : null} onMoveDown={index < fields.length - 1 ? handleMoveDown : null} collapseStates={collapseStates} setSectionEditorCollapseState={setSectionEditorCollapseState} fieldRefs={fieldRefs} />;
    })}
      <Row className="section-field">
        {meta.error && <ErrorBlock error={meta.error} />}
        <Column small={11}>
          <Button onClick={() => {
          fields.push(getDefaultNewFormField(fieldIdentifiers));
        }} text="Lisää kenttä" />
        </Column>
        <Column small={1} />
      </Row>
    </div>;
};

type SectionSubsectionProps = {
  fields: any;
  sectionPath: string;
  form: string;
  attributes: Attributes;
  level: number;
  stagedSectionValues: Record<string, any>;
  change: (...args: Array<any>) => any;
  dispatch: (...args: Array<any>) => any;
  collapseStates: Record<string, boolean>;
  setSectionEditorCollapseState: (...args: Array<any>) => any;
  meta: Record<string, any>;
};

const EditPlotApplicationSectionFormSectionSubsections = ({
  fields,
  sectionPath,
  form,
  attributes,
  level,
  stagedSectionValues,
  change,
  dispatch,
  collapseStates,
  setSectionEditorCollapseState,
  meta
}: SectionSubsectionProps): React.ReactNode => {
  const handleRemove = (index: number) => {
    dispatch({
      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
      confirmationFunction: () => {
        fields.remove(index);
      },
      confirmationModalButtonClassName: ButtonColors.ALERT,
      confirmationModalButtonText: ConfirmationModalTexts.DELETE_SECTION_SUBSECTION.BUTTON,
      confirmationModalLabel: ConfirmationModalTexts.DELETE_SECTION_SUBSECTION.LABEL,
      confirmationModalTitle: ConfirmationModalTexts.DELETE_SECTION_SUBSECTION.TITLE
    });
  };

  const sectionRefs = useRef({});
  const section = get(stagedSectionValues, sectionPath);
  const subsectionIdentifiers = section.subsections.map(subsection => subsection.identifier);
  return <>
    {fields.map((ss, index) => {
      const handleMoveUp = id => {
        fields.move(index, index - 1);
        setImmediate(() => {
          if (index - 1 !== 0) {
            sectionRefs.current[`SectionEditorMoveUpButton_Section_${id}`]?.focus();
          } else {
            sectionRefs.current[`SectionEditorMoveDownButton_Section_${id}`]?.focus();
          }
        });
      };

      const handleMoveDown = id => {
        fields.move(index, index + 1);
        setImmediate(() => {
          if (index + 1 < fields.length - 1) {
            sectionRefs.current[`SectionEditorMoveDownButton_Section_${id}`]?.focus();
          } else {
            sectionRefs.current[`SectionEditorMoveUpButton_Section_${id}`]?.focus();
          }
        });
      };

      return <EditPlotApplicationSectionFormSubsection sectionPath={ss} level={level} stagedSectionValues={stagedSectionValues} form={form} attributes={attributes} key={index} change={change} peerSectionIdentifiers={subsectionIdentifiers.filter((_, i) => index !== i)} onDelete={() => handleRemove(index)} onMoveUp={index > 0 ? handleMoveUp : null} onMoveDown={index < fields.length - 1 ? handleMoveDown : null} dispatch={dispatch} collapseStates={collapseStates} setSectionEditorCollapseState={setSectionEditorCollapseState} sectionRefs={sectionRefs} />;
    })}
    <div className="section-editor">
      <div>
        {meta.error && <ErrorBlock error={meta.error} />}
        <Button onClick={() => {
          fields.push(getDefaultNewFormSection(subsectionIdentifiers));
        }} text={`Lisää aliosio osioon ${section.title || ''}`} />
      </div>
    </div>
  </>;
};

type SubsectionProps = {
  attributes: Attributes;
  level: number;
  sectionPath: string;
  form: string;
  stagedSectionValues: Record<string, any>;
  change: (...args: Array<any>) => any;
  peerSectionIdentifiers: Array<string>;
  onMoveUp: ((...args: Array<any>) => any) | null | undefined;
  onMoveDown: ((...args: Array<any>) => any) | null | undefined;
  onDelete: ((...args: Array<any>) => any) | null | undefined;
  dispatch: (...args: Array<any>) => any;
  collapseStates: Record<string, boolean>;
  setSectionEditorCollapseState: (...args: Array<any>) => any;
  sectionRefs?: any;
};
type SubsectionWrapperProps = {
  level: number;
  attributes: Attributes;
  sectionPath: string;
  subsection: FormSection;
  children: React.ReactNode;
  stagedSectionValues: Record<string, any>;
  peerSectionIdentifiers: Array<string>;
  change: (...args: Array<any>) => any;
  onMoveUp: (...args: Array<any>) => any;
  onMoveDown: (...args: Array<any>) => any;
  onDelete: (...args: Array<any>) => any;
  isApplicantSecondLevelSubsection: boolean;
  collapseStates: Record<string, boolean>;
  setSectionEditorCollapseState: (...args: Array<any>) => any;
  sectionRefs: any;
};

const EditPlotApplicationSectionFormSubsectionFirstLevelWrapper = ({
  children,
  level
}: SubsectionWrapperProps) => <div className={classNames('edit-plot-application-section-form__section', `edit-plot-application-section-form__section--level-${level}`)}>{children}</div>;

const EditPlotApplicationSectionFormSubsectionSecondLevelWrapper = ({
  children,
  attributes,
  sectionPath,
  level,
  subsection,
  stagedSectionValues,
  peerSectionIdentifiers,
  change,
  onDelete,
  onMoveUp,
  onMoveDown,
  isApplicantSecondLevelSubsection,
  collapseStates,
  setSectionEditorCollapseState,
  sectionRefs
}: SubsectionWrapperProps) => {
  const autoIdentifier = get(stagedSectionValues, `${sectionPath}.auto_fill_identifier`);
  const isProtected = get(stagedSectionValues, `${sectionPath}.is_protected`);
  const id = get(stagedSectionValues, `${sectionPath}.id`) ?? get(stagedSectionValues, `${sectionPath}.temporary_id`);
  const upButtonId = `SectionEditorMoveUpButton_Section_${id}`;
  const downButtonId = `SectionEditorMoveDownButton_Section_${id}`;
  const isOpen = collapseStates[`section-${id}`];
  useEffect(() => {
    if (isOpen === undefined) {
      setSectionEditorCollapseState(`section-${id}`, true);
    }
  }, []);

  const updateAutoIdentifier = (shouldChange: boolean, sectionPath: string, newName: string): void => {
    if (shouldChange && !isProtected) {
      change(`${sectionPath}.identifier`, generateSectionIdentifierFromName(newName, peerSectionIdentifiers));
    }
  };

  const handleMoveUp = () => {
    onMoveUp(id);
  };

  const handleMoveDown = () => {
    onMoveDown(id);
  };

  const setRef = (id, el) => {
    if (sectionRefs) {
      sectionRefs.current[id] = el;
    }
  };

  const sectionValuesColumnWidth = isApplicantSecondLevelSubsection ? 4 : 3;
  return <Collapse defaultOpen isOpen={isOpen} onToggle={newIsOpen => setSectionEditorCollapseState(`section-${id}`, newIsOpen)} className={classNames('edit-plot-application-section-form__section', `edit-plot-application-section-form__section--level-${level}`, {
    'collapse__secondary': level === 2,
    'collapse__third': level > 2
  })} headerTitle={subsection.title || '-'} headerExtras={<div className="edit-plot-application-section-form__subsection-header-options">
      <FormField fieldAttributes={get(attributes, 'sections.child.children.visible')} name={`${sectionPath}.visible`} overrideValues={{
      label: 'Lohko käytössä'
    }} className="edit-plot-application-section-form__subsection-header-visible-field" />
      {subsection.show_duplication_check ? <FormField fieldAttributes={get(attributes, 'sections.child.children.add_new_allowed')} name={`${sectionPath}.add_new_allowed`} overrideValues={{
      fieldType: 'checkbox',
      options: [{
        label: 'Monistettava lohko',
        value: true
      }]
    }} className="edit-plot-application-section-form__subsection-header-add-new-allowed-field" invisibleLabel /> : <div className="edit-plot-application-section-form__subsection-header-add-new-allowed-field" />}
      <IconButton disabled={isProtected} onClick={onDelete}>
        <TrashIcon className="icon-medium" />
      </IconButton>
      <IconButton disabled={!onMoveUp} onClick={handleMoveUp} id={upButtonId} ref={el => setRef(upButtonId, el)}>
        <MoveUpIcon className="icon-medium" />
      </IconButton>
      <IconButton disabled={!onMoveDown} onClick={handleMoveDown} id={downButtonId} ref={el => setRef(downButtonId, el)}>
        <MoveDownIcon className="icon-medium" />
      </IconButton>
    </div>}>
    <Row className="section-editor">
      <Column small={sectionValuesColumnWidth}>
        <FormField fieldAttributes={get(attributes, 'sections.child.children.title')} name={`${sectionPath}.title`} overrideValues={{
          label: 'Nimi suomeksi'
        }} onChange={newName => updateAutoIdentifier(autoIdentifier, sectionPath, newName)} />
      </Column>
      <Column small={sectionValuesColumnWidth}>
        <FormField fieldAttributes={get(attributes, 'sections.child.children.title_en')} name={`${sectionPath}.title_en`} overrideValues={{
          label: 'Nimi englanniksi'
        }} />
      </Column>
      <Column small={sectionValuesColumnWidth}>
        <FormField fieldAttributes={get(attributes, 'sections.child.children.title_sv')} name={`${sectionPath}.title_sv`} overrideValues={{
          label: 'Nimi ruotsiksi'
        }} />
      </Column>
      <Column small={sectionValuesColumnWidth}>
        <FormField fieldAttributes={get(attributes, 'sections.child.children.identifier')} name={`${sectionPath}.identifier`} overrideValues={{
          label: 'Sisäinen tunnus'
        }} disabled={autoIdentifier || isProtected} />
        <FormField fieldAttributes={{
          type: FieldTypes.CHECKBOX,
          required: false,
          read_only: false,
          label: ''
        }} name={`${sectionPath}.auto_fill_identifier`} invisibleLabel overrideValues={{
          options: [{
            label: 'Täytä automaattisesti',
            value: true
          }]
        }} disabled={isProtected} onBlur={(value: boolean) => {
          if (value) {
            updateAutoIdentifier(true, sectionPath, get(stagedSectionValues, `${sectionPath}.title`));
          }
        }} />
      </Column>
      {isApplicantSecondLevelSubsection && <Column small={4}>
        <FormField fieldAttributes={get(attributes, 'sections.child.children.applicant_type')} name={`${sectionPath}.applicant_type`} overrideValues={{
          label: 'Hakijatyyppi, jota osio koskee'
        }} disabled={isProtected} />
      </Column>}
    </Row>
    {children}
  </Collapse>;
};

const EditPlotApplicationSectionFormSubsection: React.ComponentType<SubsectionProps> = ({
  sectionPath,
  level,
  form,
  attributes,
  stagedSectionValues,
  change,
  peerSectionIdentifiers,
  onMoveUp,
  onMoveDown,
  onDelete,
  dispatch,
  collapseStates,
  setSectionEditorCollapseState,
  sectionRefs
}: SubsectionProps) => {
  const subsection = get(stagedSectionValues, sectionPath);

  if (Object.keys(subsection || {}).length === 0) {
    return null;
  }

  const fieldIdentifiers = subsection.fields.map(field => field.identifier);
  const Wrapper = level > 1 ? EditPlotApplicationSectionFormSubsectionSecondLevelWrapper : EditPlotApplicationSectionFormSubsectionFirstLevelWrapper;
  return <Wrapper level={level} attributes={attributes} sectionPath={sectionPath} subsection={subsection} stagedSectionValues={stagedSectionValues} peerSectionIdentifiers={peerSectionIdentifiers} change={change} onDelete={onDelete} onMoveUp={onMoveUp} onMoveDown={onMoveDown} isApplicantSecondLevelSubsection={stagedSectionValues.identifier === APPLICANT_SECTION_IDENTIFIER && level === 2} collapseStates={collapseStates} setSectionEditorCollapseState={setSectionEditorCollapseState} sectionRefs={sectionRefs}>
    <FieldArray component={EditPlotApplicationSectionFormSectionFields} disabled={false} form={form} name={`${sectionPath}.fields`} fieldIdentifiers={fieldIdentifiers} dispatch={dispatch} collapseStates={collapseStates} setSectionEditorCollapseState={setSectionEditorCollapseState} validate={value => {
      if (value && uniq(value.map(v => v.identifier)).length < value.length) {
        return 'Kahdella kentällä ei saa olla samaa sisäistä tunnusta!';
      }
    }} />
    <FieldArray component={EditPlotApplicationSectionFormSectionSubsections} disabled={false} form={form} name={`${sectionPath}.subsections`} attributes={attributes} level={level + 1} stagedSectionValues={stagedSectionValues} change={change} sectionPath={sectionPath} dispatch={dispatch} collapseStates={collapseStates} setSectionEditorCollapseState={setSectionEditorCollapseState} validate={value => {
      if (value && uniq(value.map(v => v.identifier)).length < value.length) {
        return 'Kahdella osiolla ei saa olla samaa sisäistä tunnusta!';
      }
    }} />
  </Wrapper>;
};

type OwnProps = {
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  sectionIndex: number;
  isOpen: boolean;
  ref?: Function;
};
type Props = OwnProps & {
  attributes: Attributes;
  valid: boolean;
  name: string;
  section: Record<string, any>;
  parentFormSection: any;
  initialize: (...args: Array<any>) => any;
  form: string;
  stagedSectionValues: Record<string, any>;
  change: (...args: Array<any>) => any;
  collapseStates: Record<string, boolean>;
  setSectionEditorCollapseState: (...args: Array<any>) => any;
  clearSectionEditorCollapseStates: (...args: Array<any>) => any;
  initializeSectionEditorCollapseStates: (...args: Array<any>) => any;
  fieldTypeMapping: Record<string, any>;
};

class EditPlotApplicationSectionForm extends Component<Props> {
  firstField: any;
  setRefForFirstField = (element: any): void => {
    this.firstField = element;
  };
  setFocus = (): void => {
    if (this.firstField) {
      this.firstField.focus();
    }
  };

  componentDidMount(): void {
    const {
      sectionIndex
    } = this.props;

    if (sectionIndex !== undefined) {
      this.initializeData();
    }
  }

  componentDidUpdate(prevProps: Props): void {
    const {
      sectionIndex,
      isOpen
    } = this.props;

    if (sectionIndex !== prevProps.sectionIndex || isOpen && !prevProps.isOpen) {
      this.initializeData();
    }
  }

  initializeData = (): void => {
    const {
      parentFormSection,
      initialize,
      clearSectionEditorCollapseStates,
      initializeSectionEditorCollapseStates,
      fieldTypeMapping
    } = this.props;
    const {
      sectionData,
      collapseInitialState
    } = getInitialFormSectionEditorData(fieldTypeMapping, parentFormSection);
    clearSectionEditorCollapseStates();
    initialize({
      section: sectionData,
      identifier: parentFormSection.identifier
    });
    initializeSectionEditorCollapseStates(collapseInitialState);
  };
  handleSubmit = (): void => {
    const {
      onSubmit,
      onClose,
      stagedSectionValues
    } = this.props;
    onSubmit(transformCommittedFormSectionEditorData(stagedSectionValues.section));
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
      change,
      collapseStates,
      setSectionEditorCollapseState
    } = this.props;

    if (!parentFormSection) {
      return null;
    }

    return <AppConsumer>
        {({
        dispatch
      }) => <form>
          <SubTitle>
            {parentFormSection.title}
          </SubTitle>
          <Row>
            <Column small={6}>
              <FormField fieldAttributes={get(attributes, 'sections.child.children.visible')} name={'section.visible'} overrideValues={{
              label: 'Osio käytössä'
            }} />
            </Column>
            <Column small={6}>
              <FormField fieldAttributes={get(attributes, 'sections.child.children.add_new_allowed')} name={'section.add_new_allowed'} overrideValues={{
              label: 'Monistettava osio'
            }} />
            </Column>
          </Row>
          <EditPlotApplicationSectionFormSubsection sectionPath='section' level={1} stagedSectionValues={stagedSectionValues} form={form} attributes={attributes} change={change} dispatch={dispatch} collapseStates={collapseStates} setSectionEditorCollapseState={setSectionEditorCollapseState} // Root section has limited editing capabilities
        peerSectionIdentifiers={[]} onMoveDown={null} onMoveUp={null} onDelete={null} />
          <ModalButtonWrapper>
            <Button className={ButtonColors.SECONDARY} onClick={onClose} text='Peruuta' />
            <Button className={ButtonColors.SUCCESS} disabled={!valid} onClick={this.handleSubmit} text='Valmis' />
          </ModalButtonWrapper>
        </form>}
      </AppConsumer>;
  }

}

const parentFormName = FormNames.PLOT_SEARCH_APPLICATION;
const parentSelector = formValueSelector(parentFormName);
const formName = FormNames.PLOT_SEARCH_APPLICATION_SECTION_STAGING;
export default (flowRight(connect((state, props: Props) => {
  return {
    attributes: getFormAttributes(state),
    parentFormSection: parentSelector(state, `form.sections[${props.sectionIndex}]`),
    stagedSectionValues: getFormValues(formName)(state),
    collapseStates: getSectionEditorCollapseStates(state),
    fieldTypeMapping: getFieldTypeMapping(state)
  };
}, {
  change,
  setSectionEditorCollapseState,
  clearSectionEditorCollapseStates,
  initializeSectionEditorCollapseStates
}, null, {
  forwardRef: true
}), reduxForm({
  form: formName
}))(EditPlotApplicationSectionForm) as React.ComponentType<OwnProps>);