// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import AddFileButton from '$components/form/AddFileButton';
import NewCollectionNote from './NewCollectionNote';
import ExternalLink from '$components/links/ExternalLink';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FileDownloadLink from '$components/file/FileDownloadLink';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import RemoveButton from '$components/form/RemoveButton';
import ShowMore from '$components/showMore/ShowMore';
import SubTitle from '$components/content/SubTitle';
import {deleteCollectionCourtDecision, uploadCollectionCourtDecision} from '$src/collectionCourtDecision/actions';
import {deleteCollectionLetter, uploadCollectionLetter} from '$src/collectionLetter/actions';
import {createCollectionNote, deleteCollectionNote} from '$src/collectionNote/actions';
import {DecisionTypes} from '$src/decision/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getDecisionOptions} from '$src/decision/helpers';
import {getUserFullName} from '$src/users/helpers';
import {formatDate, getLabelOfOption, getReferenceNumberLink, sortStringByKeyAsc} from '$util/helpers';
import {getCollectionCourtDecisionsByLease} from '$src/collectionCourtDecision/selectors';
import {getCollectionLettersByLease} from '$src/collectionLetter/selectors';
import {getCollectionNotesByLease} from '$src/collectionNote/selectors';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {CollectionCourtDecisionId} from '$src/collectionCourtDecision/types';
import type {CollectionLetterId} from '$src/collectionLetter/types';
import type {Lease} from '$src/leases/types';

type NotesProps = {
  fields: any,
  onCreate: Function,
  saveCallback: Function,
}

const renderNotes = ({
  fields,
  onCreate,
  saveCallback,
}: NotesProps) => {
  const handleAdd = () => {
    fields.push({});
  };

  return(
    <div>
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
            field={field}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        );
      })}
      {!!fields.length < 1 &&
        <AddButtonThird
          label='Lisää huomautus'
          onClick={handleAdd}
        />
      }
    </div>
  );
};

type Props = {
  collectionCourtDecisions: Array<Object>,
  collectionLetters: Array<Object>,
  collectionNotes: Array<Object>,
  createCollectionNote: Function,
  currentLease: Lease,
  decisions: Array<Object>,
  deleteCollectionCourtDecision: Function,
  deleteCollectionLetter: Function,
  deleteCollectionNote: Function,
  handleSubmit: Function,
  uploadCollectionCourtDecision: Function,
  uploadCollectionLetter: Function,
  valid: boolean,
}

type State = {
  collectionCourtDecisions: Array<Object>,
  collectionLetters: Array<Object>,
  collectionNotes: Array<Object>,
  createCollectionNoteCallback: ?Function,
  debtCollectionDecisions: Array<Object>,
  decisions: Array<Object>,
  decisionOptions: Array<Object>,
  sortedCollectionCourtDecisions: Array<Object>,
  sortedCollectionLetters: Array<Object>,
  sortedCollectionNotes: Array<Object>,
}

class DebtCollectionForm extends Component<Props, State> {
  state = {
    collectionCourtDecisions: [],
    collectionLetters: [],
    collectionNotes: [],
    createCollectionNoteCallback: null,
    debtCollectionDecisions: [],
    decisions: [],
    decisionOptions: [],
    sortedCollectionCourtDecisions: [],
    sortedCollectionLetters: [],
    sortedCollectionNotes: [],
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newStates = {};

    if(props.decisions && props.decisions !== state.decisions) {
      newStates.decisions = props.decisions;
      newStates.decisionOptions = getDecisionOptions(props.decisions);
      newStates.debtCollectionDecisions = props.decisions.filter((decision) => decision.type === DecisionTypes.LAND_LEASE_DEMOLITION);
    }

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
      handleSubmit,
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
              <Row>
                <Column small={12} large={6}>
                  <SubTitle>Perintäkirjeet</SubTitle>
                  {sortedCollectionLetters && !!sortedCollectionLetters.length &&
                    <Row>
                      <Column small={6}><FormFieldLabel>Tiedosto</FormFieldLabel></Column>
                      <Column small={3}><FormFieldLabel>Lisätty</FormFieldLabel></Column>
                      <Column small={3}><FormFieldLabel>Lisääjä</FormFieldLabel></Column>
                    </Row>
                  }
                  {sortedCollectionLetters && !!sortedCollectionLetters.length && sortedCollectionLetters.map((collectionLetter, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_DELETE_MODAL,
                        deleteFunction: () => {
                          this.handleDeleteCollectionLetter(collectionLetter.id);
                        },
                        deleteModalLabel: DeleteModalLabels.COLLECTION_LETTER,
                        deleteModalTitle: DeleteModalTitles.COLLECTION_LETTER,
                      });
                    };

                    return (
                      <Row key={index}>
                        <Column small={6}>
                          <FileDownloadLink
                            fileUrl={collectionLetter.file}
                            label={collectionLetter.filename}
                          />
                        </Column>
                        <Column small={3}>
                          <p>{formatDate(collectionLetter.uploaded_at) || '-'}</p>
                        </Column>
                        <Column small={3}>
                          <FieldAndRemoveButtonWrapper
                            field={<p style={{width: '100%'}}>{getUserFullName(collectionLetter.uploader) || '-'}</p>}
                            removeButton={
                              <RemoveButton
                                className='third-level'
                                onClick={handleRemove}
                                title='Poista tiedosto'
                              />
                            }
                          />
                        </Column>
                      </Row>
                    );
                  })}
                  <AddFileButton
                    label='Lisää perintäkirje'
                    name={'collectionLetterFileButtonId'}
                    onChange={this.handleCollectionLetterFileChange}
                  />

                  <SubTitle>Käräjäoikeuden päätökset</SubTitle>
                  {sortedCollectionCourtDecisions && !!sortedCollectionCourtDecisions.length &&
                    <Row>
                      <Column small={6}><FormFieldLabel>Tiedosto</FormFieldLabel></Column>
                      <Column small={3}><FormFieldLabel>Lisätty</FormFieldLabel></Column>
                      <Column small={3}><FormFieldLabel>Lisääjä</FormFieldLabel></Column>
                    </Row>
                  }
                  {sortedCollectionCourtDecisions && !!sortedCollectionCourtDecisions.length && sortedCollectionCourtDecisions.map((collectionCourtDecision, index) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_DELETE_MODAL,
                        deleteFunction: () => {
                          this.handleDeleteCollectionCourtDecision(collectionCourtDecision.id);
                        },
                        deleteModalLabel: DeleteModalLabels.COLLECTION_COURT_DECISION,
                        deleteModalTitle: DeleteModalTitles.COLLECTION_COURT_DECISION,
                      });
                    };

                    return (
                      <Row key={index}>
                        <Column small={6}>
                          <FileDownloadLink
                            fileUrl={collectionCourtDecision.file}
                            label={collectionCourtDecision.filename}
                          />
                        </Column>
                        <Column small={3}>
                          <p>{formatDate(collectionCourtDecision.uploaded_at) || '-'}</p>
                        </Column>
                        <Column small={3}>
                          <FieldAndRemoveButtonWrapper
                            field={<p style={{width: '100%'}}>{getUserFullName(collectionCourtDecision.uploader) || '-'}</p>}
                            removeButton={
                              <RemoveButton
                                className='third-level'
                                onClick={handleRemove}
                                title='Poista käräjäoikeuden päätös'
                              />
                            }
                          />
                        </Column>
                      </Row>
                    );
                  })}
                  <AddFileButton
                    label='Lisää käräjäoikeuden päätös'
                    name={'collectionCourtDecisionFileButtonId'}
                    onChange={this.handleCollectionCourtDecisionFileChange}
                  />

                  <SubTitle>Vuokrauksen purkamispäätös</SubTitle>
                  {!debtCollectionDecisions.length && <p>Ei purkamispäätöksiä</p>}
                  {!!debtCollectionDecisions.length &&
                    <ListItems>
                      {debtCollectionDecisions.map((decision, index) =>
                        decision.reference_number
                          ? <p key={index} className='no-margin'><ExternalLink
                            className='no-margin'
                            href={getReferenceNumberLink(decision.reference_number)}
                            label={decision.reference_number}
                          /></p>
                          : <p key={index} className='no-margin'>{getLabelOfOption(decisionOptions, decision.id)}</p>
                      )}
                    </ListItems>
                  }

                  <SubTitle>Huomautukset</SubTitle>
                  {sortedCollectionNotes && !!sortedCollectionNotes.length &&
                    <Row>
                      <Column small={6}><FormFieldLabel required>Huomautus</FormFieldLabel></Column>
                      <Column small={3}><FormFieldLabel>Lisätty</FormFieldLabel></Column>
                      <Column small={3}><FormFieldLabel>Lisääjä</FormFieldLabel></Column>
                    </Row>
                  }
                  {sortedCollectionNotes && !!sortedCollectionNotes.length && sortedCollectionNotes.map((note) => {
                    const handleRemove = () => {
                      dispatch({
                        type: ActionTypes.SHOW_DELETE_MODAL,
                        deleteFunction: () => {
                          this.handleDeleteCollectionNote(note.id);
                        },
                        deleteModalLabel: DeleteModalLabels.COLLECTION_NOTE,
                        deleteModalTitle: DeleteModalTitles.COLLECTION_NOTE,
                      });
                    };

                    return(
                      <Row key={note.id}>
                        <Column small={6}><ShowMore text={note.note} /></Column>
                        <Column small={3}><p>{formatDate(note.modified_at)}</p></Column>
                        <Column small={3}>
                          <FieldAndRemoveButtonWrapper
                            field={<p style={{width: '100%'}}>{getUserFullName(note.user)}</p>}
                            removeButton={
                              <RemoveButton
                                className='third-level'
                                onClick={handleRemove}
                                title='Poista huomautus'
                              />
                            }
                          /></Column>
                      </Row>
                    );
                  })}
                  <FieldArray
                    component={renderNotes}
                    name='notes'
                    onCreate={this.handleCreateCollectionNote}
                    saveCallback={this.setSaveCollectionNoteCallback}
                  />
                </Column>
                <Column small={12} large={6}></Column>
              </Row>
            </form>
          );
        }}
      </AppConsumer>
    );
  }
}

const formName = FormNames.DEBT_COLLECTION;

export default flowRight(
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        collectionCourtDecisions: getCollectionCourtDecisionsByLease(state, currentLease.id),
        collectionLetters: getCollectionLettersByLease(state, currentLease.id),
        collectionNotes: getCollectionNotesByLease(state, currentLease.id),
        currentLease: currentLease,
        decisions: getDecisionsByLease(state, currentLease.id),
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
