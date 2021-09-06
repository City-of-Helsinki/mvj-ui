// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {getAttributes} from '$src/plotSearch/selectors';
import {PlotSearchFieldTitles} from '$src/plotSearch/enums';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  change: Function,
  onClose: Function,
  onSubmit: Function,
  valid: boolean,
  name: string,
}

class CreatePlotSearchForm extends Component<Props> {
  firstField: any

  setRefForFirstField = (element: any) => {
    this.firstField = element;
  }

  setFocus = () => {
    if(this.firstField) {
      this.firstField.focus();
    }
  }

  handleCreate = () => {
    const {
      onSubmit,
      name,
    } = this.props;

    onSubmit({
      name: name,
    });
  };

  render() {
    const {
      attributes,
      onClose,
      valid,
    } = this.props;

    return (
      <form>
        <Row>
          <Column small={4}>
            <FormField
              setRefForField={this.setRefForFirstField}
              fieldAttributes={get(attributes, 'name')}
              name='name'
              overrideValues={{
                label: PlotSearchFieldTitles.NAME
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
            onClick={this.handleCreate}
            text='Luo tonttihaku'
          />
        </ModalButtonWrapper>
      </form>
    );
  }
}

const formName = FormNames.PLOT_SEARCH_CREATE;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        name: selector(state, 'name'),
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
)(CreatePlotSearchForm);
