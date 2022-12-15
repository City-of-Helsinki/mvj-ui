//@flow
import React, {Component} from 'react';
import {getFormValues, reduxForm} from 'redux-form';
import {Column, Row} from 'react-foundation';
import get from 'lodash/get';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';

import {FieldTypes, FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import FormField from '$components/form/FormField';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import Button from '$components/button/Button';
import {getApplicantInfoCheckAttributes} from '$src/plotApplications/selectors';
import type {Attributes} from '$src/types';
import {prepareApplicantInfoCheckForSubmission} from '$src/plotApplications/helpers';
import {getUserFullName} from '$src/users/helpers';
import {PlotApplicationApplicantInfoCheckFieldPaths, PlotApplicationApplicantInfoCheckFieldTitles} from '$src/plotApplications/enums';

type OwnProps = {
  infoCheck: Object,
  onClose: Function,
  onSubmit: Function,
};

type Props = {
  ...OwnProps,
  initialize: Function,
  attributes: Attributes,
  valid: boolean,
  formValues: Object
};

class PlotApplicationApplicantInfoCheckForm extends Component<Props> {
  firstField: ?HTMLInputElement

  componentDidMount(): void {
    const infoCheck = this.props?.infoCheck;

    if (!infoCheck) {
      return;
    }

    const {preparer, ...rest} = infoCheck.data;

    this.props.initialize({
      ...rest,
      preparer: preparer ? {
        value: preparer.id,
        label: getUserFullName(preparer),
      } : null,
    });
  }

  setRefForFirstField = (element: HTMLInputElement): void => {
    this.firstField = element;
  }

  setFocus = (): void => {
    if (this.firstField) {
      this.firstField.focus();
    }
  }

  handleSave = (): void => {
    const {
      onSubmit,
    } = this.props;

    onSubmit(prepareApplicantInfoCheckForSubmission(this.props.formValues));
  };

  render(): React$Node {
    const {
      attributes,
      valid,
      onClose,
    } = this.props;

    return (
      <form>
        <Row>
          <Column small={4}>
            <FormField
              setRefForField={this.setRefForFirstField}
              fieldAttributes={get(attributes, PlotApplicationApplicantInfoCheckFieldPaths.PREPARER)}
              name={PlotApplicationApplicantInfoCheckFieldPaths.PREPARER}
              overrideValues={{
                fieldType: FieldTypes.USER,
                label: PlotApplicationApplicantInfoCheckFieldTitles.PREPARER,
              }}
            />
          </Column>
          <Column small={4}>
            <FormField
              fieldAttributes={get(attributes, PlotApplicationApplicantInfoCheckFieldPaths.STATE)}
              name={PlotApplicationApplicantInfoCheckFieldPaths.STATE}
              overrideValues={{
                label: PlotApplicationApplicantInfoCheckFieldTitles.STATE,
                required: true,
              }}
            />
          </Column>
          <Column small={4}>
            <FormField
              fieldAttributes={get(attributes, PlotApplicationApplicantInfoCheckFieldPaths.MARK_ALL)}
              name={PlotApplicationApplicantInfoCheckFieldPaths.MARK_ALL}
              overrideValues={{
                label: PlotApplicationApplicantInfoCheckFieldTitles.MARK_ALL,
                required: false,
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <FormField
              fieldAttributes={get(attributes, PlotApplicationApplicantInfoCheckFieldPaths.COMMENT)}
              name={PlotApplicationApplicantInfoCheckFieldPaths.COMMENT}
              overrideValues={{
                fieldType: FieldTypes.TEXTAREA,
                label: PlotApplicationApplicantInfoCheckFieldTitles.COMMENT,
              }}
            />
          </Column>
        </Row>
        <ModalButtonWrapper>
          <Button
            className={ButtonColors.SECONDARY}
            onClick={onClose}
            text='Peruuta'
          />
          <Button
            className={ButtonColors.SUCCESS}
            disabled={!valid}
            onClick={this.handleSave}
            text='Tallenna'
          />
        </ModalButtonWrapper>
      </form>
    );
  }
}


export default (flowRight(
  connect(
    (state) => ({
      attributes: getApplicantInfoCheckAttributes(state),
      formValues: getFormValues(FormNames.PLOT_APPLICATION_INFO_CHECK)(state),
    }),
    null,
    null,
    {forwardRef: true}
  ),
  reduxForm({
    form: FormNames.PLOT_APPLICATION_INFO_CHECK,
  })
)(PlotApplicationApplicantInfoCheckForm): React$ComponentType<OwnProps>);
