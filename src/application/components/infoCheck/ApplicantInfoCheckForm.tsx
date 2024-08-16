import React, { Component } from "react";
import { getFormValues, reduxForm } from "redux-form";
import { Column, Row } from "react-foundation";
import get from "lodash/get";
import flowRight from "lodash/flowRight";
import { connect } from "react-redux";
import { FieldTypes, FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import FormField from "@/components/form/FormField";
import ModalButtonWrapper from "@/components/modal/ModalButtonWrapper";
import Button from "@/components/button/Button";
import { ApplicantInfoCheckFieldPaths, ApplicantInfoCheckFieldTitles } from "@/application/enums";
import { getApplicantInfoCheckAttributes } from "@/application/selectors";
import type { Attributes } from "types";
type OwnProps = {
  infoCheck: Record<string, any>;
  onClose: (...args: Array<any>) => any;
  onSubmit: (...args: Array<any>) => any;
  showMarkAll: boolean;
  ref?: Function;
};
type Props = OwnProps & {
  initialize: (...args: Array<any>) => any;
  attributes: Attributes;
  valid: boolean;
  formValues: Record<string, any>;
  isPreparerDirty: boolean;
};

class ApplicantInfoCheckForm extends Component<Props> {
  firstField: HTMLInputElement | null | undefined;

  componentDidMount(): void {
    const infoCheck = this.props?.infoCheck;

    if (!infoCheck) {
      return;
    }

    const {
      preparer,
      ...rest
    } = infoCheck.data;
    this.props.initialize({ ...rest,
      preparer
    });
  }

  setRefForFirstField = (element: HTMLInputElement): void => {
    this.firstField = element;
  };
  setFocus = (): void => {
    if (this.firstField) {
      this.firstField.focus();
    }
  };
  handleSave = (): void => {
    const {
      onSubmit,
      formValues
    } = this.props;
    onSubmit(formValues);
  };

  render(): JSX.Element {
    const {
      attributes,
      valid,
      onClose,
      showMarkAll
    } = this.props;
    return <form>
        <Row>
          <Column small={4}>
            <FormField setRefForField={this.setRefForFirstField} fieldAttributes={get(attributes, ApplicantInfoCheckFieldPaths.PREPARER)} name={ApplicantInfoCheckFieldPaths.PREPARER} overrideValues={{
            fieldType: FieldTypes.USER,
            label: ApplicantInfoCheckFieldTitles.PREPARER
          }} />
          </Column>
          <Column small={4}>
            <FormField fieldAttributes={get(attributes, ApplicantInfoCheckFieldPaths.STATE)} name={ApplicantInfoCheckFieldPaths.STATE} overrideValues={{
            label: ApplicantInfoCheckFieldTitles.STATE
          }} />
          </Column>
          {showMarkAll === true && <Column small={4}>
              <FormField fieldAttributes={get(attributes, ApplicantInfoCheckFieldPaths.MARK_ALL)} name={ApplicantInfoCheckFieldPaths.MARK_ALL} overrideValues={{
            label: ApplicantInfoCheckFieldTitles.MARK_ALL,
            required: false
          }} />
            </Column>}
          
        </Row>
        <Row>
          <Column small={12}>
            <FormField fieldAttributes={get(attributes, ApplicantInfoCheckFieldPaths.COMMENT)} name={ApplicantInfoCheckFieldPaths.COMMENT} overrideValues={{
            fieldType: FieldTypes.TEXTAREA,
            label: ApplicantInfoCheckFieldTitles.COMMENT
          }} />
          </Column>
        </Row>
        <ModalButtonWrapper>
          <Button className={ButtonColors.SECONDARY} onClick={onClose} text='Peruuta' />
          <Button className={ButtonColors.SUCCESS} disabled={!valid} onClick={this.handleSave} text='Tallenna' />
        </ModalButtonWrapper>
      </form>;
  }

}

export default (flowRight(connect(state => ({
  attributes: getApplicantInfoCheckAttributes(state),
  formValues: getFormValues(FormNames.APPLICANT_INFO_CHECK)(state)
}), null, null, {
  forwardRef: true
}), reduxForm({
  form: FormNames.APPLICANT_INFO_CHECK
}))(ApplicantInfoCheckForm) as React.ComponentType<OwnProps>);