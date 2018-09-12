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
import DebtCollectionNote from './DebtCollectionNote';
import ExternalLink from '$components/links/ExternalLink';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FileDownloadLink from '$components/file/FileDownloadLink';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {deleteCollectionLetterFile, uploadCollectionLetterFile} from '$src/collectionLetter/actions';
import {ContactType} from '$src/contacts/enums';
import {DecisionTypes} from '$src/decision/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getDecisionOptions} from '$src/decision/helpers';
import {getUserFullName} from '$src/users/helpers';
import {formatDate, getLabelOfOption, getReferenceNumberLink, sortStringByKeyAsc} from '$util/helpers';
import {getCollectionLettersByLease} from '$src/collectionLetter/selectors';
import {getDecisionsByLease} from '$src/decision/selectors';
import {getCurrentLease} from '$src/leases/selectors';

import type {CollectionLetterId} from '$src/collectionLetter/types';
import type {Lease} from '$src/leases/types';

type NotesProps = {
  fields: any,
}

const renderNotes = ({
  fields,
}: NotesProps) => {
  const handleAdd = () => {
    fields.push({});
  };

  return(
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {!!fields.length &&
              <Row>
                <Column small={6}><FormFieldLabel required>Huomautus</FormFieldLabel></Column>
                <Column small={3}><FormFieldLabel>Lisätty</FormFieldLabel></Column>
                <Column small={3}><FormFieldLabel>Lisääjä</FormFieldLabel></Column>
              </Row>
            }
            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.DEBT_COLLECTION_NOTE,
                  deleteModalTitle: DeleteModalTitles.DEBT_COLLECTION_NOTE,
                });
              };

              return(
                <DebtCollectionNote
                  key={index}
                  field={field}
                  onRemove={handleRemove}
                />
              );
            })}
            <AddButtonThird
              label='Lisää huomautus'
              onClick={handleAdd}
            />
          </div>
        );
      }}
    </AppConsumer>

  );
};

type Props = {
  collectionLetters: Array<Object>,
  currentLease: Lease,
  decisions: Array<Object>,
  deleteCollectionLetterFile: Function,
  handleSubmit: Function,
  uploadCollectionLetterFile: Function,
  valid: boolean,
}

type State = {
  collectionLetters: Array<Object>,
  debtCollectionDecisions: Array<Object>,
  decisions: Array<Object>,
  decisionOptions: Array<Object>,
  sortedCollectionLetters: Array<Object>,
}

class DebtCollectionForm extends Component<Props, State> {
  state = {
    collectionLetters: [],
    debtCollectionDecisions: [],
    decisions: [],
    decisionOptions: [],
    sortedCollectionLetters: [],
  }

  handleCollectionLetterFileChange = (e) => {
    const {
      currentLease,
      uploadCollectionLetterFile,
    } = this.props;

    uploadCollectionLetterFile({
      data: {
        lease: currentLease.id,
      },
      file: e.target.files[0],
    });
  }

  handleDeleteCollectionLetterFile = (id: CollectionLetterId) => {
    const {currentLease, deleteCollectionLetterFile} = this.props;
    deleteCollectionLetterFile({
      id: id,
      lease: currentLease.id,
    });
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    const newStates = {};

    if(props.decisions && props.decisions !== state.decisions) {
      newStates.decisions = props.decisions;
      newStates.decisionOptions = getDecisionOptions(props.decisions);
      newStates.debtCollectionDecisions = props.decisions.filter((decision) => decision.type === DecisionTypes.LAND_LEASE_DEMOLITION);
    }

    if(props.collectionLetters && props.collectionLetters !== state.collectionLetters) {
      newStates.collectionLetters = props.collectionLetters;
      newStates.sortedCollectionLetters = props.collectionLetters.sort((a, b) => sortStringByKeyAsc(a, b, 'uploaded_at'));
    }

    if(!isEmpty(newStates)) {
      return newStates;
    }
    return null;
  }

  render() {
    const {
      handleSubmit,
    } = this.props;
    const {
      debtCollectionDecisions,
      decisionOptions,
      sortedCollectionLetters,
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
                          this.handleDeleteCollectionLetterFile(collectionLetter.id);
                        },
                        deleteModalLabel: DeleteModalLabels.COLLECTION_LETTER,
                        deleteModalTitle: DeleteModalTitles.COLLECTION_LETTER,
                      });
                    };

                    return (
                      <Row key={index}>
                        <Column small={6}>
                          <FileDownloadLink
                            fileName={collectionLetter.filename}
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
                  <FieldArray
                    component={renderNotes}
                    name='notes'
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
        collectionLetters: getCollectionLettersByLease(state, currentLease.id),
        currentLease: currentLease,
        decisions: getDecisionsByLease(state, currentLease.id),
      };
    },
    {
      deleteCollectionLetterFile,
      uploadCollectionLetterFile,
    }
  ),
  reduxForm({
    form: formName,
    // TODO: Use mock data until the debt collection API is ready
    initialValues: {
      notes: [
        {
          id: 12,
          date: '2018-05-09',
          note: 'Lorem lorem lorem lorem ipsum',
          user: {
            id: 1,
            first_name: 'Jori',
            is_staff: false,
            last_name: 'Lindell',
            type: ContactType.PERSON,
          },
        },
      ],
    },
  }),
)(DebtCollectionForm);
