import React, { Fragment, PureComponent } from "react";
import { Row, Column } from "react-foundation";
import { reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import classNames from "classnames";
import { connect } from "react-redux";
import { FormNames } from "enums";
import SubTitle from "components/content/SubTitle";
import FormText from "components/form/FormText";
import FormTextTitle from "components/form/FormTextTitle";
import FormField from "components/form/FormField";
import FormHintText from "components/form/FormHintText";
import AddButtonThird from "components/form/AddButtonThird";
import Collapse from "components/collapse/Collapse";
import Button from "components/button/Button";
import { ButtonColors } from "components/enums";
import { getFormAttributes } from "application/selectors";
import type { Attributes } from "types";
type OwnProps = {
  section: Record<string, any>;
  handleToggle: (...args: Array<any>) => any;
  defaultOpen?: boolean;
  openEditPlotApplicationSectionModal?: (...args: Array<any>) => any;
  disabled?: boolean;
};
type Props = OwnProps & {
  attributes: Attributes;
};

class ApplicationPreviewSection extends PureComponent<Props> {
  static defaultProps = {
    defaultOpen: true
  };
  renderSection = (section: Record<string, any>, isFirstLevel: boolean) => {
    return <Fragment>
        {!isFirstLevel && <Row>
          <Column large={12}>
            <SubTitle>
              {get(section, 'title')}
            </SubTitle>
          </Column>
        </Row>}
        <Row>
          {section.fields && section.fields.filter(field => field.enabled).map((field, i) => <Fragment key={i}>{this.renderField(field)}</Fragment>)}
        </Row>
        {section.subsections && section.subsections.filter(section => section.visible).map((subsection, i) => <Fragment key={i}>{this.renderSection(subsection, false)}</Fragment>)}
        {section.add_new_allowed && <Row>
            <Column>
              <AddButtonThird label={section.add_new_text} onClick={() => {}} disabled />
            </Column>
          </Row>}
      </Fragment>;
  };
  renderField = (field: Record<string, any>) => {
    const {
      attributes
    } = this.props;
    const fakeFieldId = `fakeField${field.id}`;
    let fieldSpecificComponents: any = [];
    let columnWidths = {
      small: 12,
      medium: 12,
      large: 12
    };
    const typeMapping = get(attributes, 'sections.child.children.fields.child.children.type.choices');
    const matchingType = typeMapping.find(type => type.value === field.type)?.value;

    if (matchingType === 'hidden') {
      return null;
    }

    switch (matchingType) {
      case 'checkbox':
        fieldSpecificComponents = <FormField name={fakeFieldId} fieldAttributes={{
          type: 'checkbox',
          required: false,
          read_only: false,
          label: get(field, 'label')
        }} overrideValues={{
          options: get(field, 'choices')?.map(choice => ({
            label: choice.has_text_input ? <>
              {choice.text}
              {' '}
              <FormField name={`${fakeFieldId}_input`} fieldAttributes={{
                type: 'string',
                required: false,
                read_only: false,
                label: ''
              }} invisibleLabel disabled />
            </> : choice.text,
            value: choice.value
          }))
        }} disabled />;
        break;

      case 'textarea':
        fieldSpecificComponents = <FormField name={fakeFieldId} fieldAttributes={{
          type: 'textarea',
          required: false,
          read_only: false,
          label: get(field, 'label')
        }} disabled />;
        break;

      case 'radiobutton':
      case 'radiobuttoninline':
        fieldSpecificComponents = <>
          <FormField name={fakeFieldId} fieldAttributes={{
            type: 'radio-with-field',
            required: false,
            read_only: false,
            label: get(field, 'label')
          }} overrideValues={{
            options: get(field, 'choices')?.map(choice => ({
              label: choice.text,
              value: choice.value,
              field: choice.has_text_input ? <FormField name={`${fakeFieldId}_input`} fieldAttributes={{
                type: 'string',
                required: false,
                read_only: false,
                label: ''
              }} invisibleLabel disabled /> : null
            }))
          }} disabled className={field.type === 'radiobuttoninline' ? 'form-field__radio-button-inline' : ''} />
        </>;
        break;

      case 'dropdown':
        fieldSpecificComponents = <FormField name={fakeFieldId} fieldAttributes={{
          type: 'choice',
          required: false,
          read_only: false,
          label: get(field, 'label'),
          choices: []
        }} disabled />;
        break;

      case 'uploadfiles':
        fieldSpecificComponents = <>
          <FormTextTitle>{get(field, 'label')}</FormTextTitle>
          <AddButtonThird label={'Liitä tiedosto'} onClick={() => {}} disabled />
        </>;
        break;

      case 'fractional':
        fieldSpecificComponents = <FormField name={fakeFieldId} fieldAttributes={{
          type: 'fractional',
          required: false,
          read_only: false,
          label: get(field, 'label')
        }} disabled />;
        columnWidths = {
          small: 6,
          medium: 4,
          large: 3
        };
        break;

      case 'textbox':
        fieldSpecificComponents = <FormField name={fakeFieldId} fieldAttributes={{
          type: 'string',
          required: false,
          read_only: false,
          label: get(field, 'label')
        }} disabled />;
        columnWidths = {
          small: 6,
          medium: 4,
          large: 3
        };
        break;

      case 'hidden':
        break;

      default:
        console.error(`Form field type ${matchingType} (${field?.type}) is not implemented`);
        fieldSpecificComponents = <>
          <FormTextTitle>{get(field, 'label')}</FormTextTitle>
          <FormText>NOT IMPLEMENTED</FormText>
        </>;
    }

    return <Column {...columnWidths}>
      {fieldSpecificComponents}
      <FormHintText>{field.hint_text}</FormHintText>
    </Column>;
  };

  render() {
    const {
      section,
      handleToggle,
      defaultOpen,
      openEditPlotApplicationSectionModal,
      disabled
    } = this.props;
    return <Row className='summary__content-wrapper'>
      <Column small={12} style={{
        marginTop: 15
      }}>
        <Collapse defaultOpen={defaultOpen} headerTitle={section.title} headerExtras={openEditPlotApplicationSectionModal && <Button className={classNames(ButtonColors.SECONDARY, 'application-preview-section__edit-button')} onClick={() => {
          openEditPlotApplicationSectionModal();
        }} text='Muokkaa' disabled={disabled} />} onToggle={handleToggle} className="application-preview-section">
          {section.visible ? this.renderSection(section, true) : <div style={{
            marginBottom: 15
          }}>
              <em>Osio on piilotettu kokonaisuudessaan.</em></div>}
        </Collapse>
      </Column>
    </Row>;
  }

}

export default (flowRight(connect(state => {
  return {
    attributes: getFormAttributes(state)
  };
}), reduxForm({
  form: FormNames.PLOT_APPLICATION_PREVIEW
}))(ApplicationPreviewSection) as React.ComponentType<OwnProps>);