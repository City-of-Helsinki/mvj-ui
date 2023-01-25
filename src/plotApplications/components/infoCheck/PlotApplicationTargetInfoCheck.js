// @flow

import React, {PureComponent} from 'react';
import {Column, Row} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import get from 'lodash/get';
import {FieldArray, getFormValues, reduxForm} from 'redux-form';

import FormField from '$components/form/FormField';
import {formatDate, getFieldAttributes, isFieldAllowedToRead} from '$util/helpers';
import Authorization from '$components/authorization/Authorization';
import RemoveButton from '$components/form/RemoveButton';
import FormTextTitle from '$components/form/FormTextTitle';
import {ButtonColors} from '$components/enums';
import AddButtonThird from '$components/form/AddButtonThird';
import FormFieldLabel from '$components/form/FormFieldLabel';
import Button from '$components/button/Button';
import AddFileButton from '$components/form/AddFileButton';
import FormText from '$components/form/FormText';
import FileDownloadLink from '$components/file/FileDownloadLink';
import type {RootState} from '$src/root/types';
import type {Attributes} from '$src/types';
import {getUserFullName} from '$src/users/helpers';
import {ConfirmationModalTexts, FieldTypes, FormNames} from '$src/enums';
import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import PlotApplicationInfoCheckCollapse from '$src/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse';
import {getAttributes, getIsPerformingFileOperation} from '$src/plotApplications/selectors';
import {PlotApplicationTargetInfoCheckFieldPaths, PlotApplicationTargetInfoCheckFieldTitles} from '$src/plotApplications/enums';
import {
  getInitialTargetInfoCheckValues,
  getMeetingMemoDownloadLink,
} from '$src/plotApplications/helpers';
import {
  deleteTargetInfoCheckMeetingMemo,
  editTargetInfoCheckItem,
  uploadTargetInfoCheckMeetingMemo,
} from '$src/plotApplications/actions';
import LoaderWrapper from '$src/components/loader/LoaderWrapper';
import Loader from '$src/components/loader/Loader';

type TargetSubFieldSetProps = {
  fields: any,
  attributes: Attributes,
  disabled?: boolean,
  isSaveClicked: boolean,
  targetInfoCheck: number,
};

class PlotApplicationTargetInfoCheckManagements extends PureComponent<TargetSubFieldSetProps> {
  render() {
    const {
      fields,
      attributes,
      disabled = false,
      isSaveClicked,
    } = this.props;

    const handleAdd = () => {
      fields.push({
        proposed_management: null,
        proposed_financing: null,
        hitas: null,
      });
    };

    return (
      <AppConsumer>
        {({dispatch}) => (
          <div role="table">
            <Row>
              <Column small={4} medium={4} large={2} role="columnheader">
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_FINANCING}
                </FormTextTitle>
              </Column>
              <Column small={4} medium={4} large={2} role="columnheader">
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_TYPE}
                </FormTextTitle>
              </Column>
              <Column small={3} medium={3} large={2} role="columnheader">
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_HITAS}
                </FormTextTitle>
              </Column>
              <Column small={1} medium={1} large={6}/>
            </Row>
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_PROPOSED_MANAGEMENT.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_PROPOSED_MANAGEMENT.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_PROPOSED_MANAGEMENT.TITLE,
                });
              };

              return <Row role="row" key={index}>
                <Column role="cell" small={4} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, PlotApplicationTargetInfoCheckFieldPaths.PROPOSED_MANAGEMENT_TYPE)}
                    name={`${field}.proposed_management`}
                    invisibleLabel
                    overrideValues={{
                      label: PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_TYPE,
                    }}
                    disabled={disabled}
                    disableTouched={isSaveClicked}
                  />
                </Column>
                <Column role="cell" small={4} medium={4} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, PlotApplicationTargetInfoCheckFieldPaths.PROPOSED_MANAGEMENT_FINANCING)}
                    name={`${field}.proposed_financing`}
                    invisibleLabel
                    overrideValues={{
                      label: PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_FINANCING,
                    }}
                    disabled={disabled}
                    disableTouched={isSaveClicked}
                  />
                </Column>
                <Column role="cell" small={3} medium={3} large={2}>
                  <FormField
                    fieldAttributes={get(attributes, PlotApplicationTargetInfoCheckFieldPaths.PROPOSED_MANAGEMENT_HITAS)}
                    name={`${field}.hitas`}
                    invisibleLabel
                    overrideValues={{
                      label: PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_HITAS,
                    }}
                    disabled={disabled}
                    disableTouched={isSaveClicked}
                  />
                </Column>
                <Column role="cell" small={1} medium={1} large={6}>
                  <RemoveButton
                    className='third-level'
                    onClick={(...rest) => handleRemove(index, ...rest)}
                    style={{height: 'unset'}}
                    title='Poista hallinta- ja rahoitusmuoto'
                    disabled={disabled}
                  />
                </Column>
              </Row>;
            })}
            {!disabled &&
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää rahoitus- ja hallintamuoto'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
          </div>
        )}
      </AppConsumer>
    );
  }
}

class PlotApplicationTargetInfoCheckConditions extends PureComponent<TargetSubFieldSetProps> {
  render() {
    const {
      fields,
      attributes,
      disabled = false,
      isSaveClicked,
    } = this.props;

    const handleAdd = () => {
      fields.push('');
    };

    return (
      <AppConsumer>
        {({dispatch}) => (
          <div role="table">
            <Row>
              <Column small={11} medium={11} large={11} role="columnheader">
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.RESERVATION_CONDITIONS}
                </FormTextTitle>
              </Column>
              <Column small={1} medium={1} large={1} />
            </Row>
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_CONDITION.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_CONDITION.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_CONDITION.TITLE,
                });
              };

              return <Row role="row" key={index}>
                <Column role="cell" small={11} medium={11} large={11}>
                  <FormField
                    fieldAttributes={get(attributes, PlotApplicationTargetInfoCheckFieldPaths.RESERVATION_CONDITIONS)}
                    name={field}
                    invisibleLabel
                    overrideValues={{
                      label: `${PlotApplicationTargetInfoCheckFieldTitles.RESERVATION_CONDITION_SINGULAR} ${index + 1}`,
                      fieldType: FieldTypes.TEXTAREA,
                    }}
                    disabled={disabled}
                    disableTouched={isSaveClicked}
                  />
                </Column>
                <Column role="cell" large={1}>
                  <RemoveButton
                    className='third-level'
                    onClick={(...rest) => handleRemove(index, ...rest)}
                    style={{height: 'unset'}}
                    title='Poista ehto'
                    disabled={disabled}
                  />
                </Column>
              </Row>;
            })}
            {!disabled &&
              <Row>
                <Column>
                  <AddButtonThird
                    label='Lisää ehto'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            }
          </div>
        )}
      </AppConsumer>
    );
  }
}

const PlotApplicationTargetInfoCheckMeetingMemos = connect(null, {
  uploadTargetInfoCheckMeetingMemo,
  deleteTargetInfoCheckMeetingMemo,
})(({
  fields,
  disabled = false,
  isPerformingFileOperation,
  uploadTargetInfoCheckMeetingMemo,
  deleteTargetInfoCheckMeetingMemo,
  targetInfoCheck,
  meetingMemoAttributes,
}: TargetSubFieldSetProps & {
  uploadTargetInfoCheckMeetingMemo: Function,
  deleteTargetInfoCheckMeetingMemo: Function,
  meetingMemoAttributes: Attributes,
  isPerformingFileOperation: boolean,
}) => {
  const handleAdd = (e) => {
    uploadTargetInfoCheckMeetingMemo({
      fileData: e.target.files[0],
      targetInfoCheck,
      callback: (data) => {
        fields.push(data);
      },
    });
  };

  return (
    <AppConsumer>
      {({dispatch}) => (
        <div>
          <Row>
            <Column small={12} medium={12} large={12}>
              <FormTextTitle>
                Kokous-/neuvottelumuistiot
              </FormTextTitle>
            </Column>
          </Row>
          {isPerformingFileOperation ? <LoaderWrapper className='small-inline-wrapper'>
            <Loader isLoading={true} className='small' />
          </LoaderWrapper> : <>
            {(fields.length > 0) ?
              <div role="table">
                <Row role="row">
                  <Column role="columnheader" small={3} large={4}>
                    <Authorization allow={isFieldAllowedToRead(meetingMemoAttributes, 'meeting_memo')}>
                      <FormTextTitle>
                        {PlotApplicationTargetInfoCheckFieldTitles.MEETING_MEMO_NAME}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column role="columnheader" small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(meetingMemoAttributes, 'created_at')}>
                      <FormTextTitle>
                        {PlotApplicationTargetInfoCheckFieldTitles.MEETING_MEMO_UPLOAD_DATE}
                      </FormTextTitle>
                    </Authorization>
                  </Column>
                  <Column role="columnheader" small={3} large={2}>
                    <FormTextTitle>
                      {PlotApplicationTargetInfoCheckFieldTitles.MEETING_MEMO_UPLOADED_BY}
                    </FormTextTitle>
                  </Column>
                </Row>
                {fields.getAll().map((entry, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        deleteTargetInfoCheckMeetingMemo({
                          file: entry,
                          callback: () => {
                            fields.remove(index);
                          },
                        });
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_MEETING_MEMO.BUTTON,
                      confirmationModalLabel: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_MEETING_MEMO.LABEL,
                      confirmationModalTitle: ConfirmationModalTexts.DELETE_APPLICATION_TARGET_MEETING_MEMO.TITLE,
                    });
                  };

                  return (
                    <Row role="row" key={index}>
                      <Column role="cell" small={3} large={4}>
                        <Authorization allow={isFieldAllowedToRead(meetingMemoAttributes, 'name')}>
                          {/* not having an associated file shouldn't be possible, but just in case */}
                          {entry.meeting_memo ? <FileDownloadLink
                            fileUrl={getMeetingMemoDownloadLink(entry.id)}
                            label={entry.name}
                          /> : '-'}
                        </Authorization>
                      </Column>
                      <Column role="cell" small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(meetingMemoAttributes, 'created_at')}>
                          <FormText>{formatDate(entry.created_at) || '-'}</FormText>
                        </Authorization>
                      </Column>
                      <Column role="cell" small={3} large={2}>
                        <FormText>{getUserFullName(entry.user) || '-'}</FormText>
                      </Column>
                      <Column role="cell" small={3} large={2}>
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista muistio"
                        />
                      </Column>
                    </Row>
                  );
                })}
              </div>
              :
              <FormText>Ei lisättyjä muistioita.</FormText>
            }
            {!disabled &&
              <AddFileButton
                label='Lisää tiedosto'
                name={`addFileButton--${targetInfoCheck}--${fields.name}`}
                onChange={handleAdd}
              />}
          </>}
        </div>
      )}
    </AppConsumer>
  );
});

type OwnProps = {
  targetId: number,
};

type Props = {
  ...OwnProps,
  attributes: Attributes,
  meetingMemoAttributes: Attributes,
  editTargetInfoCheckItem: Function,
  formValues: Object,
  isPerformingFileOperation: boolean,
};

class PlotApplicationTargetInfoCheck extends PureComponent<Props> {
  handleSave: () => void = () => {
    const {editTargetInfoCheckItem, formValues} = this.props;

    const data = {
      ...formValues,
      meeting_memos: undefined,
      decline_reason: formValues.decline_reason || null,
    };
    editTargetInfoCheckItem(data);
  }

  render(): React$Node {
    const {attributes, formValues, isPerformingFileOperation} = this.props;

    // todo: temp
    const isSaveClicked = false;
    const targetInfoCheck = formValues?.id;

    return (
      <PlotApplicationInfoCheckCollapse headerTitle="Kohteen käsittelytiedot">
        <form>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.RESERVED)}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  name="reserved"
                  fieldAttributes={getFieldAttributes(attributes, PlotApplicationTargetInfoCheckFieldPaths.RESERVED)}
                  disableTouched={isSaveClicked}
                  overrideValues={{
                    label: PlotApplicationTargetInfoCheckFieldTitles.RESERVED,
                  }}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.SHARE_OF_RENT_INDICATOR)}>
              <Column small={6} medium={4} large={2}>
                <FormFieldLabel htmlFor="share_of_rental_indicator">
                  {PlotApplicationTargetInfoCheckFieldTitles.SHARE_OF_RENT}
                </FormFieldLabel>
                <Row>
                  <Column large={6}>
                    <FormField
                      name="share_of_rental_indicator"
                      fieldAttributes={getFieldAttributes(attributes, PlotApplicationTargetInfoCheckFieldPaths.SHARE_OF_RENT_INDICATOR)}
                      disableTouched={isSaveClicked}
                      invisibleLabel
                      overrideValues={{
                        label: PlotApplicationTargetInfoCheckFieldTitles.SHARE_OF_RENT_INDICATOR,
                      }}
                    />
                  </Column>
                  <Column large={6}>
                    <FormField
                      name="share_of_rental_denominator"
                      fieldAttributes={getFieldAttributes(attributes, PlotApplicationTargetInfoCheckFieldPaths.SHARE_OF_RENT_DENOMINATOR)}
                      disableTouched={isSaveClicked}
                      invisibleLabel
                      className='with-slash'
                      overrideValues={{
                        label: PlotApplicationTargetInfoCheckFieldTitles.SHARE_OF_RENT_DENOMINATOR,
                      }}
                    />
                  </Column>
                </Row>


              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.NEGOTIATION_DATE)}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  name="counsel_date"
                  fieldAttributes={getFieldAttributes(attributes, PlotApplicationTargetInfoCheckFieldPaths.NEGOTIATION_DATE)}
                  overrideValues={{
                    label: PlotApplicationTargetInfoCheckFieldTitles.NEGOTIATION_DATE,
                    fieldType: FieldTypes.DATE,
                  }}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.DECLINE_REASON)}>
              <Column small={6} medium={4} large={3}>
                <FormField
                  name="decline_reason"
                  fieldAttributes={getFieldAttributes(attributes, PlotApplicationTargetInfoCheckFieldPaths.DECLINE_REASON)}
                  overrideValues={{
                    label: PlotApplicationTargetInfoCheckFieldTitles.DECLINE_REASON,
                  }}
                />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.ADDED_TARGET_TO_APPLICANT)}>
              <Column small={6} medium={4} large={3}>
                <FormField
                  name="added_target_to_applicant"
                  fieldAttributes={getFieldAttributes(attributes, PlotApplicationTargetInfoCheckFieldPaths.ADDED_TARGET_TO_APPLICANT)}
                  overrideValues={{
                    label: PlotApplicationTargetInfoCheckFieldTitles.ADDED_TARGET_TO_APPLICANT,
                  }}
                />
              </Column>
            </Authorization>
          </Row>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.PROPOSED_MANAGEMENTS)}>
              <Column small={12} medium={12} large={12}>
                <FieldArray
                  name="proposed_managements"
                  component={PlotApplicationTargetInfoCheckManagements}
                  attributes={attributes}
                  targetInfoCheck={targetInfoCheck}
                />
              </Column>
            </Authorization>
          </Row>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.RESERVATION_CONDITIONS)}>
              <Column small={12} medium={12} large={12}>
                <FieldArray
                  name="reservation_conditions"
                  component={PlotApplicationTargetInfoCheckConditions}
                  attributes={attributes}
                  targetInfoCheck={targetInfoCheck}
                />
              </Column>
            </Authorization>
          </Row>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.ARGUMENTS)}>
              <Column small={12} medium={12} large={12}>
                <FormField
                  name="arguments"
                  fieldAttributes={getFieldAttributes(attributes, PlotApplicationTargetInfoCheckFieldPaths.ARGUMENTS)}
                  overrideValues={{
                    fieldType: FieldTypes.TEXTAREA,
                    label: PlotApplicationTargetInfoCheckFieldTitles.ARGUMENTS,
                  }}
                />
              </Column>
            </Authorization>
          </Row>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.MEETING_MEMOS)}>
              <Column small={12} medium={12} large={12}>
                <FieldArray
                  name="meeting_memos"
                  component={PlotApplicationTargetInfoCheckMeetingMemos}
                  meetingMemoAttributes={get(attributes, PlotApplicationTargetInfoCheckFieldPaths.MEETING_MEMOS)}
                  targetInfoCheck={targetInfoCheck}
                  isPerformingFileOperation={isPerformingFileOperation}
                />
              </Column>
            </Authorization>
          </Row>
          {/* TODO: temporary, will be removed in the edit mode refactoring */}
          <Row style={{marginBottom: 15, marginTop: 15}}>
            <Button onClick={this.handleSave} disabled={isPerformingFileOperation} text="Tallenna" />
          </Row>
        </form>
      </PlotApplicationInfoCheckCollapse>
    );
  }
}

export default (flowRight(
  connect((state: RootState, props: Props) => ({
    attributes: getAttributes(state),
    form: `${FormNames.PLOT_APPLICATION_INFO_CHECK}--${props.targetId}`,
    initialValues: getInitialTargetInfoCheckValues(state, props.targetId),
    formValues: getFormValues(`${FormNames.PLOT_APPLICATION_INFO_CHECK}--${props.targetId}`)(state),
    isPerformingFileOperation: getIsPerformingFileOperation(state),
  }), {
    editTargetInfoCheckItem,
  }),
  reduxForm(),
)(PlotApplicationTargetInfoCheck): React$ComponentType<OwnProps>);
