//@flow
import React, {Component} from 'react';
import {getFormValues, reduxForm} from 'redux-form';
import {Column, Row} from 'react-foundation';
import get from 'lodash/get';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';

import {FieldTypes, FormNames} from '../../../enums';
import {ButtonColors} from '$components/enums';
import {getInfoCheckAttributes} from '../../selectors';
import type {Attributes} from '../../../types';
import FormField from '../../../components/form/FormField';
import ModalButtonWrapper from '../../../components/modal/ModalButtonWrapper';
import Button from '../../../components/button/Button';
import {prepareInfoCheckForSubmission} from '../../helpers';
import {getUserFullName} from '../../../users/helpers';
import {PlotApplicationInfoCheckFieldPaths, PlotApplicationInfoCheckFieldTitles} from '../../enums';

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

class PlotApplicationInfoCheckForm extends Component<Props> {
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

    onSubmit(prepareInfoCheckForSubmission(this.props.formValues));
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
              fieldAttributes={get(attributes, PlotApplicationInfoCheckFieldPaths.PREPARER)}
              name={PlotApplicationInfoCheckFieldPaths.PREPARER}
              overrideValues={{
                fieldType: FieldTypes.USER,
                label: PlotApplicationInfoCheckFieldTitles.PREPARER,
              }}
            />
          </Column>
          <Column small={4}>
            <FormField
              fieldAttributes={get(attributes, PlotApplicationInfoCheckFieldPaths.STATE)}
              name={PlotApplicationInfoCheckFieldPaths.STATE}
              overrideValues={{
                label: PlotApplicationInfoCheckFieldTitles.STATE,
                required: true,
              }}
            />
          </Column>
          <Column small={4}>
            <FormField
              fieldAttributes={get(attributes, PlotApplicationInfoCheckFieldPaths.MARK_ALL)}
              name={PlotApplicationInfoCheckFieldPaths.MARK_ALL}
              overrideValues={{
                label: PlotApplicationInfoCheckFieldTitles.MARK_ALL,
                required: false,
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12}>
            <FormField
              fieldAttributes={get(attributes, PlotApplicationInfoCheckFieldPaths.COMMENT)}
              name={PlotApplicationInfoCheckFieldPaths.COMMENT}
              overrideValues={{
                fieldType: FieldTypes.TEXTAREA,
                label: PlotApplicationInfoCheckFieldTitles.COMMENT,
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
      attributes: getInfoCheckAttributes(state),
      formValues: getFormValues(FormNames.PLOT_APPLICATION_INFO_CHECK)(state),
    }),
    null,
    null,
    {forwardRef: true}
  ),
  reduxForm({
    form: FormNames.PLOT_APPLICATION_INFO_CHECK,
  })
)(PlotApplicationInfoCheckForm): React$ComponentType<OwnProps>);
