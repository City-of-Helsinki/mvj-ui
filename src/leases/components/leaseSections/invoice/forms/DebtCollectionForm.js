// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import AddFileButton from '$components/form/AddFileButton';
import Authorization from '$components/authorization/Authorization';
import DecisionLink from '$components/links/DecisionLink';
import NewCollectionNote from './NewCollectionNote';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FileDownloadLink from '$components/file/FileDownloadLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import ShowMore from '$components/showMore/ShowMore';
import SubTitle from '$components/content/SubTitle';
import {deleteCollectionCourtDecision, uploadCollectionCourtDecision} from '$src/collectionCourtDecision/actions';
import {deleteCollectionLetter, uploadCollectionLetter} from '$src/collectionLetter/actions';
import {createCollectionNote, deleteCollectionNote} from '$src/collectionNote/actions';
import {CollectionCourtDecisionFieldPaths, CollectionCourtDecisionFieldTitles} from '$src/collectionCourtDecision/enums';
import {CollectionLetterFieldPaths, CollectionLetterFieldTitles} from '$src/collectionLetter/enums';
import {CollectionNoteFieldPaths, CollectionNoteFieldTitles} from '$src/collectionNote/enums';
import {ButtonColors} from '$components/enums';
import {
  DecisionTypes,
  DeleteModalLabels,
  DeleteModalTitles,
  FormNames,
  LeaseDecisionsFieldPaths,
  LeaseDecisionsFieldTitles,
} from '$src/leases/enums';
import {Methods} from '$src/enums';
import {getUserFullName} from '$src/users/helpers';
import {getContentDecisions, getDecisionOptions} from '$src/leases/helpers';
import {
  getUiDataCollectionCourtDecisionKey,
  getUiDataCollectionLetterKey,
  getUiDataCollectionNoteKey,
  getUiDataLeaseKey,
} from '$src/uiData/helpers';
import {
  formatDate,
  isFieldAllowedToRead,
  isFieldRequired,
  isMethodAllowed,
  sortStringByKeyAsc,
} from '$util/helpers';
import {getCollectionCourtDecisionsByLease} from '$src/collectionCourtDecision/selectors';
import {getCollectionLettersByLease} from '$src/collectionLetter/selectors';
import {getCollectionNotesByLease} from '$src/collectionNote/selectors';
import {getAttributes as getLeaseAttributes, getCurrentLease} from '$src/leases/selectors';
import {withLeasePageAttributes} from '$components/attributes/LeasePageAttributes';

import type {Attributes, Methods as MethodsType} from '$src/types';
import type {CollectionCourtDecisionId} from '$src/collectionCourtDecision/types';
import type {CollectionLetterId} from '$src/collectionLetter/types';
import type {Lease} from '$src/leases/types';

type NotesProps = {
  collectionNoteAttributes: Attributes,
  collectionNoteMethods: MethodsType,
  fields: any,
  onCreate: Function,
  saveCallback: Function,
}

const renderNotes = ({
  collectionNoteAttributes,
  collectionNoteMethods,
  fields,
  onCreate,
  saveCallback,
}: NotesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return(
    <Fragment>
      {!!fields.length && fields.map((field, index) => {
        const handleCancel = () => {
          fields.remove(index);
        };

        const handleSave = (note: string) => {
          onCreate(note);
          saveCallback(() => {
            fields.remove(index);
          });
        };

        return(
          <NewCollectionNote
            key={index}
            collectionNoteAttributes={collectionNoteAttributes}
            field={field}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        );
      })}
      <Authorization allow={isMethodAllowed(collectionNoteMethods, Methods.POST)}>
        {!!fields.length < 1 &&
          <AddButtonThird
            label='Lisää huomautus'
            onClick={handleAdd}
          />
        }
      </Authorization>
    </Fragment>
  );
};

type Props = {
  collectionCourtDecisions: Array<Object>,
  collectionCourtDecisionAttributes: Attributes,  // get via withLeasePageAttributes HOC
  collectionCourtDecisionMethods: MethodsType,    // get via withLeasePageAttributes HOC
  collectionLetterAttributes: Attributes,         // get via withLeasePageAttributes HOC
  collectionLetterMethods: MethodsType,           // get via withLeasePageAttributes HOC
  collectionNoteAttributes: Attributes,           // get via withLeasePageAttributes HOC
  collectionNoteMethods: MethodsType,             // get via withLeasePageAttributes HOC
  collectionLetters: Array<Object>,
  collectionNotes: Array<Object>,
  createCollectionNote: Function,
  currentLease: Lease,
  deleteCollectionCourtDecision: Function,
  deleteCollectionLetter: Function,
  deleteCollectionNote: Function,
  handleSubmit: Function,
  leaseAttributes: Attributes,
  uploadCollectionCourtDecision: Function,
  uploadCollectionLetter: Function,
  valid: boolean,
}

type State = {
  collectionCourtDecisions: Array<Object>,
  collectionLetters: Array<Object>,
  collectionNotes: Array<Object>,
  createCollectionNoteCallback: ?Function,
  currentLease: Lease,
  debtCollectionDecisions: Array<Object>,
  decisionOptions: Array<Object>,
  sortedCollectionCourtDecisions: Array<Object>,
  sortedCollectionLetters: Array<Object>,
  sortedCollectionNotes: Array<Object>,
}

class DebtCollectionForm extends PureComponent<Props, State> {
  state = {
    collectionCourtDecisions: [],
    collectionLetters: [],
    collectionNotes: [],
    createCollectionNoteCallback: null,
    currentLease: {},
    debtCollectionDecisions: [],
    decisionOptions: [],
    sortedCollectionCourtDecisions: [],
    sortedCollectionLetters: [],
    sortedCollectionNotes: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newStates = {};

    if(props.collectionCourtDecisions && props.collectionCourtDecisions !== state.collectionCourtDecisions) {
      newStates.collectionCourtDecisions = props.collectionCourtDecisions;
      newStates.sortedCollectionCourtDecisions = props.collectionCourtDecisions.sort((a, b) => sortStringByKeyAsc(a, b, 'uploaded_at'));
    }

    if(props.collectionLetters && props.collectionLetters !== state.collectionLetters) {
      newStates.collectionLetters = props.collectionLetters;
      newStates.sortedCollectionLetters = props.collectionLetters.sort((a, b) => sortStringByKeyAsc(a, b, 'uploaded_at'));
    }

    if(props.collectionNotes && props.collectionNotes !== state.collectionNotes) {
      newStates.collectionNotes = props.collectionNotes;
      newStates.sortedCollectionNotes = props.collectionNotes.sort((a, b) => sortStringByKeyAsc(a, b, 'modified_at'));
    }

    if(props.currentLease !== state.currentLease) {
      newStates.currentLease = props.currentLease;
      newStates.decisionOptions = getDecisionOptions(props.currentLease);
      newStates.debtCollectionDecisions = getContentDecisions(props.currentLease)
        .filter((decision) => decision.type === DecisionTypes.LAND_LEASE_DEMOLITION);
    }

    if(!isEmpty(newStates)) {
      return newStates;
    }

    return null;
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.collectionNotes !== this.props.collectionNotes) {
      const {createCollectionNoteCallback} = this.state;
      if(createCollectionNoteCallback) {
        createCollectionNoteCallback();
        this.setState({
          createCollectionNoteCallback: null,
        });
      }
    }
  }

  handleCollectionCourtDecisionFileChange = (e) => {
    const {
      currentLease,
      uploadCollectionCourtDecision,
    } = this.props;

    uploadCollectionCourtDecision({
      data: {
        lease: currentLease.id,
      },
      file: e.target.files[0],
    });
  }

  handleCollectionLetterFileChange = (e) => {
    const {
      currentLease,
      uploadCollectionLetter,
    } = this.props;

    uploadCollectionLetter({
      data: {
        lease: currentLease.id,
      },
      file: e.target.files[0],
    });
  }

  handleDeleteCollectionCourtDecision = (id: CollectionCourtDecisionId) => {
    const {currentLease, deleteCollectionCourtDecision} = this.props;
    deleteCollectionCourtDecision({
      id: id,
      lease: currentLease.id,
    });
  }

  handleDeleteCollectionLetter = (id: CollectionLetterId) => {
    const {currentLease, deleteCollectionLetter} = this.props;
    deleteCollectionLetter({
      id: id,
      lease: currentLease.id,
    });
  }

  handleCreateCollectionNote = (note: string) => {
    const {currentLease, createCollectionNote} = this.props;
    createCollectionNote({
      lease: currentLease.id,
      note: note,
    });
  }

  handleDeleteCollectionNote = (id: CollectionLetterId) => {
    const {currentLease, deleteCollectionNote} = this.props;
    deleteCollectionNote({
      id: id,
      lease: currentLease.id,
    });
  }

  setSaveCollectionNoteCallback = (fn: Function) => {
    this.setState({
      createCollectionNoteCallback: fn,
    });
  }

  render() {
    const {
      collectionCourtDecisionAttributes,
      collectionCourtDecisionMethods,
      collectionLetterAttributes,
      collectionLetterMethods,
      collectionNoteAttributes,
      collectionNoteMethods,
      handleSubmit,
      leaseAttributes,
    } = this.props;
    const {
      debtCollectionDecisions,
      decisionOptions,
      sortedCollectionCourtDecisions,
      sortedCollectionLetters,
      sortedCollectionNotes,
    } = this.state;

    return(
      <AppConsumer>
        {({dispatch}) => {
          return(
            <form onSubmit={handleSubmit}>
              <Authorization allow={isMethodAllowed(collectionLetterMethods, Methods.GET)}>
                <Row>
                  <Column small={12} large={6}>
                    <SubTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataCollectionLetterKey(CollectionLetterFieldPaths.COLLECTION_LETTERS)}
                    >
                      {CollectionLetterFieldTitles.COLLECTION_LETTERS}
                    </SubTitle>

                    {!isMethodAllowed(collectionNoteMethods, Methods.POST) && (!sortedCollectionLetters || !sortedCollectionLetters.length) && <FormText>Ei perintäkirjeitä</FormText>}
                    {sortedCollectionLetters && !!sortedCollectionLetters.length &&
                      <Row>
                        <Column small={6}>
                          <Authorization allow={isFieldAllowedToRead(collectionLetterAttributes, CollectionLetterFieldPaths.FILE)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataCollectionLetterKey(CollectionLetterFieldPaths.FILE)}>
                              {CollectionLetterFieldTitles.FILE}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3}>
                          <Authorization allow={isFieldAllowedToRead(collectionLetterAttributes, CollectionLetterFieldPaths.UPLOADED_AT)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataCollectionLetterKey(CollectionLetterFieldPaths.UPLOADED_AT)}>
                              {CollectionLetterFieldTitles.UPLOADED_AT}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataCollectionLetterKey(CollectionLetterFieldPaths.UPLOADER)}>
                            {CollectionLetterFieldTitles.UPLOADER}
                          </FormTextTitle>
                        </Column>
                      </Row>
                    }

                    {sortedCollectionLetters && !!sortedCollectionLetters.length && sortedCollectionLetters.map((collectionLetter, index) => {
                      const handleRemove = () => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            this.handleDeleteCollectionLetter(collectionLetter.id);
                          },
                          confirmationModalButtonClassName: ButtonColors.ALERT,
                          confirmationModalButtonText: 'Poista',
                          confirmationModalLabel: DeleteModalLabels.COLLECTION_LETTER,
                          confirmationModalTitle: DeleteModalTitles.COLLECTION_LETTER,
                        });
                      };

                      return (
                        <Row key={index}>
                          <Column small={6}>
                            <Authorization allow={isFieldAllowedToRead(collectionLetterAttributes, CollectionLetterFieldPaths.FILE)}>
                              <FileDownloadLink
                                fileUrl={collectionLetter.file}
                                label={collectionLetter.filename}
                              />
                            </Authorization>
                          </Column>
                          <Column small={3}>
                            <Authorization allow={isFieldAllowedToRead(collectionLetterAttributes, CollectionLetterFieldPaths.UPLOADED_AT)}>
                              <FormText>{formatDate(collectionLetter.uploaded_at) || '-'}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={3}>
                            <FieldAndRemoveButtonWrapper
                              field={
                                // TODO: Check that CollectionLetterFieldPaths.UPLOADER field exists in attributes when added to API
                                <FormText className='full-width'>{getUserFullName(collectionLetter.uploader) || '-'}</FormText>
                              }
                              removeButton={
                                <Authorization allow={isMethodAllowed(collectionLetterMethods, Methods.DELETE)}>
                                  <RemoveButton
                                    className='third-level'
                                    onClick={handleRemove}
                                    title='Poista tiedosto'
                                  />
                                </Authorization>
                              }
                            />
                          </Column>
                        </Row>
                      );
                    })}

                    <Authorization allow={isMethodAllowed(collectionLetterMethods, Methods.POST)}>
                      <AddFileButton
                        label='Lisää perintäkirje'
                        name={'collectionLetterFileButtonId'}
                        onChange={this.handleCollectionLetterFileChange}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Authorization>

              <Authorization allow={isMethodAllowed(collectionCourtDecisionMethods, Methods.GET)}>
                <Row>
                  <Column small={12} large={6}>
                    <SubTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataCollectionCourtDecisionKey(CollectionCourtDecisionFieldPaths.COLLECTION_COURT_DECISIONS)}
                    >
                      {CollectionCourtDecisionFieldTitles.COLLECTION_COURT_DECISIONS}
                    </SubTitle>

                    {!isMethodAllowed(collectionNoteMethods, Methods.POST) && (!sortedCollectionCourtDecisions || !sortedCollectionCourtDecisions.length) && <FormText>Ei käräjaoikeuden päätöksiä</FormText>}
                    {sortedCollectionCourtDecisions && !!sortedCollectionCourtDecisions.length &&
                      <Row>
                        <Column small={6}>
                          <Authorization allow={isFieldAllowedToRead(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.FILE)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataCollectionCourtDecisionKey(CollectionCourtDecisionFieldPaths.FILE)}>
                              {CollectionCourtDecisionFieldTitles.FILE}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3}>
                          <Authorization allow={isFieldAllowedToRead(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.UPLOADED_AT)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataCollectionCourtDecisionKey(CollectionCourtDecisionFieldPaths.UPLOADED_AT)}>
                              {CollectionCourtDecisionFieldTitles.UPLOADED_AT}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataCollectionCourtDecisionKey(CollectionCourtDecisionFieldPaths.UPLOADER)}>
                            {CollectionCourtDecisionFieldTitles.UPLOADER}
                          </FormTextTitle>
                        </Column>
                      </Row>
                    }
                    {sortedCollectionCourtDecisions && !!sortedCollectionCourtDecisions.length && sortedCollectionCourtDecisions.map((collectionCourtDecision, index) => {
                      const handleRemove = () => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            this.handleDeleteCollectionCourtDecision(collectionCourtDecision.id);
                          },
                          confirmationModalButtonClassName: ButtonColors.ALERT,
                          confirmationModalButtonText: 'Poista',
                          confirmationModalLabel: DeleteModalLabels.COLLECTION_COURT_DECISION,
                          confirmationModalTitle: DeleteModalTitles.COLLECTION_COURT_DECISION,
                        });
                      };

                      return (
                        <Row key={index}>
                          <Column small={6}>
                            <Authorization allow={isFieldAllowedToRead(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.FILE)}>
                              <FileDownloadLink
                                fileUrl={collectionCourtDecision.file}
                                label={collectionCourtDecision.filename}
                              />
                            </Authorization>
                          </Column>
                          <Column small={3}>
                            <Authorization allow={isFieldAllowedToRead(collectionCourtDecisionAttributes, CollectionCourtDecisionFieldPaths.UPLOADED_AT)}>
                              <FormText>{formatDate(collectionCourtDecision.uploaded_at) || '-'}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={3}>
                            <FieldAndRemoveButtonWrapper
                              field={
                                // TODO: Check that attributes has CollectionCourtDecisionFieldPaths.UPLOADER when added API
                                <FormText className='full-width'>{getUserFullName(collectionCourtDecision.uploader) || '-'}</FormText>
                              }
                              removeButton={
                                <Authorization allow={isMethodAllowed(collectionCourtDecisionMethods, Methods.DELETE)}>
                                  <RemoveButton
                                    className='third-level'
                                    onClick={handleRemove}
                                    title='Poista käräjäoikeuden päätös'
                                  />
                                </Authorization>
                              }
                            />
                          </Column>
                        </Row>
                      );
                    })}

                    <Authorization allow={isMethodAllowed(collectionCourtDecisionMethods, Methods.POST)}>
                      <AddFileButton
                        label='Lisää käräjäoikeuden päätös'
                        name={'collectionCourtDecisionFileButtonId'}
                        onChange={this.handleCollectionCourtDecisionFileChange}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Authorization>

              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseDecisionsFieldPaths.DECISIONS) && isFieldAllowedToRead(leaseAttributes, LeaseDecisionsFieldPaths.REFERENCE_NUMBER)}>
                <Row>
                  <Column small={12} large={6}>
                    <SubTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseDecisionsFieldPaths.DEBT_COLLECTION_DECISIONS)}
                    >
                      {LeaseDecisionsFieldTitles.DEBT_COLLECTION_DECISIONS}
                    </SubTitle>

                    {!debtCollectionDecisions.length && <FormText>Ei purkamispäätöksiä</FormText>}
                    {!!debtCollectionDecisions.length && debtCollectionDecisions.map((decision, index) =>
                      <DecisionLink
                        key={index}
                        decision={decision}
                        decisionOptions={decisionOptions}
                      />
                    )}
                  </Column>
                </Row>
              </Authorization>

              <Authorization allow={isMethodAllowed(collectionNoteMethods, Methods.GET)}>
                <Row>
                  <Column small={12} large={6}>
                    <SubTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataCollectionNoteKey(CollectionNoteFieldPaths.COLLECTION_NOTES)}
                    >
                      {CollectionNoteFieldTitles.COLLECTION_NOTES}
                    </SubTitle>

                    {!isMethodAllowed(collectionNoteMethods, Methods.POST) && (!sortedCollectionNotes || !sortedCollectionNotes.length) && <FormText>Ei huomautuksia</FormText>}
                    {sortedCollectionNotes && !!sortedCollectionNotes.length &&
                      <Row>
                        <Column small={6}>
                          <Authorization allow={isFieldAllowedToRead(collectionNoteAttributes, CollectionNoteFieldPaths.NOTE)}>
                            <FormTextTitle
                              required={isFieldRequired(collectionNoteAttributes, CollectionNoteFieldPaths.NOTE)}
                              enableUiDataEdit
                              uiDataKey={getUiDataCollectionNoteKey(CollectionNoteFieldPaths.NOTE)}
                            >
                              {CollectionNoteFieldTitles.NOTE}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3}>
                          <Authorization allow={isFieldAllowedToRead(collectionNoteAttributes, CollectionNoteFieldPaths.MODIFIED_AT)}>
                            <FormTextTitle enableUiDataEdit uiDataKey={getUiDataCollectionNoteKey(CollectionNoteFieldPaths.MODIFIED_AT)}>
                              {CollectionNoteFieldTitles.MODIFIED_AT}
                            </FormTextTitle>
                          </Authorization>
                        </Column>
                        <Column small={3}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataCollectionNoteKey(CollectionNoteFieldPaths.USER)}>
                            {CollectionNoteFieldTitles.USER}
                          </FormTextTitle>
                        </Column>
                      </Row>
                    }
                    {sortedCollectionNotes && !!sortedCollectionNotes.length && sortedCollectionNotes.map((note) => {
                      const handleRemove = () => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            this.handleDeleteCollectionNote(note.id);
                          },
                          confirmationModalButtonClassName: ButtonColors.ALERT,
                          confirmationModalButtonText: 'Poista',
                          confirmationModalLabel: DeleteModalLabels.COLLECTION_NOTE,
                          confirmationModalTitle: DeleteModalTitles.COLLECTION_NOTE,
                        });
                      };

                      return(
                        <Row key={note.id}>
                          <Column small={6}>
                            <Authorization allow={isFieldAllowedToRead(collectionNoteAttributes, CollectionNoteFieldPaths.NOTE)}>
                              <ShowMore text={note.note} />
                            </Authorization>
                          </Column>
                          <Column small={3}>
                            <Authorization allow={isFieldAllowedToRead(collectionNoteAttributes, CollectionNoteFieldPaths.MODIFIED_AT)}>
                              <FormText>{formatDate(note.modified_at)}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={3}>
                            <FieldAndRemoveButtonWrapper
                              field={
                                // TODO: Check that attributes has CollectionNoteFieldPaths.USER when added API
                                <FormText className='full-width'>{getUserFullName(note.user)}</FormText>
                              }
                              removeButton={
                                <Authorization allow={isMethodAllowed(collectionNoteMethods, Methods.DELETE)}>
                                  <RemoveButton
                                    className='third-level'
                                    onClick={handleRemove}
                                    title='Poista huomautus'
                                  />
                                </Authorization>
                              }
                            />
                          </Column>
                        </Row>
                      );
                    })}

                    <Authorization allow={isMethodAllowed(collectionNoteMethods, Methods.POST)}>
                      <FieldArray
                        component={renderNotes}
                        collectionNoteAttributes={collectionNoteAttributes}
                        collectionNoteMethods={collectionNoteMethods}
                        name='notes'
                        onCreate={this.handleCreateCollectionNote}
                        saveCallback={this.setSaveCollectionNoteCallback}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Authorization>
            </form>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.DEBT_COLLECTION;

export default flowRight(
  withLeasePageAttributes,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        collectionCourtDecisions: getCollectionCourtDecisionsByLease(state, currentLease.id),
        collectionLetters: getCollectionLettersByLease(state, currentLease.id),
        collectionNotes: getCollectionNotesByLease(state, currentLease.id),
        currentLease: currentLease,
        leaseAttributes: getLeaseAttributes(state),
      };
    },
    {
      createCollectionNote,
      deleteCollectionCourtDecision,
      deleteCollectionLetter,
      deleteCollectionNote,
      uploadCollectionCourtDecision,
      uploadCollectionLetter,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(DebtCollectionForm);
