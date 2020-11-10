// @flow
import React, {Fragment, Component} from 'react';
import {connect} from 'react-redux';
import {change, formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import {FieldArray} from 'redux-form';
import TitleH3 from '$components/content/TitleH3';
import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import ModalButtonWrapper from '$components/modal/ModalButtonWrapper';
import {FormNames} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {getApplicationAttributes} from '$src/plotSearch/selectors';
import AddButtonThird from '$components/form/AddButtonThird';
import {ConfirmationModalTexts} from '$src/enums';

import type {Attributes} from '$src/types';
import SectionField from './SectionField';

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
  formName,
  // usersPermissions,
}: SectionFieldProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };
  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT, 
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_SECTION_FIELD.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_SECTION_FIELD.LABEL, 
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_SECTION_FIELD.TITLE,
                });
              };

              return <SectionField
                key={index}
                disabled={disabled}
                field={field}
                formName={formName}
                onRemove={handleRemove}
              />;
            })}

            {!disabled &&
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää kenttä'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
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
}

class EditPlotApplicationForm extends Component<Props> {
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
    console.log(attributes);
    return (
      <form>
        <Row>
          <Column small={4}>
            <FormField
              setRefForField={this.setRefForFirstField}
              fieldAttributes={get(attributes, 'search_name')}
              name='search_name'
            />
          </Column>
        </Row>
        <TitleH3 style={{marginTop: 15}}>
          {'Osion kentät'}
        </TitleH3>
        <Column>
          <FieldArray
            component={renderSectionFields}
            disabled={false}
            formName={FormNames.EDIT_PLOT_APPLICATION}
            name={'section_fields'}
          />
        </Column>
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
            text='Valmis'
          />
        </ModalButtonWrapper>
      </form>
    );
  }
}

const formName = FormNames.EDIT_PLOT_APPLICATION;
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        attributes: getApplicationAttributes(state),
        search_name: selector(state, 'search_name'),
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
)(EditPlotApplicationForm);
