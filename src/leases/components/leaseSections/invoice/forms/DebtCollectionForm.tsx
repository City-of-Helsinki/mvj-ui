import React, { Fragment, PureComponent, ReactElement } from "react";
import { connect } from "react-redux";
import { FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import isEmpty from "lodash/isEmpty";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import AddButtonThird from "@/components/form/AddButtonThird";
import AddFileButton from "@/components/form/AddFileButton";
import Authorization from "@/components/authorization/Authorization";
import BoxItem from "@/components/content/BoxItem";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import CollectionCourtDecisionPanel from "../CollectionCourtDecisionPanel";
import DecisionLink from "@/components/links/DecisionLink";
import NewCollectionNote from "./NewCollectionNote";
import FieldAndRemoveButtonWrapper from "@/components/form/FieldAndRemoveButtonWrapper";
import FileDownloadLink from "@/components/file/FileDownloadLink";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import RemoveButton from "@/components/form/RemoveButton";
import ShowMore from "@/components/showMore/ShowMore";
import SubTitle from "@/components/content/SubTitle";
import {
  deleteCollectionCourtDecision,
  hideCollectionCourtDecisionPanel,
  showCollectionCourtDecisionPanel,
  uploadCollectionCourtDecision,
} from "@/collectionCourtDecision/actions";
import {
  deleteCollectionLetter,
  uploadCollectionLetter,
} from "@/collectionLetter/actions";
import {
  createCollectionNote,
  deleteCollectionNote,
} from "@/collectionNote/actions";
import { ConfirmationModalTexts, FormNames } from "@/enums";
import {
  CollectionCourtDecisionFieldPaths,
  CollectionCourtDecisionFieldTitles,
} from "@/collectionCourtDecision/enums";
import {
  CollectionLetterFieldPaths,
  CollectionLetterFieldTitles,
} from "@/collectionLetter/enums";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
} from "@/collectionNote/enums";
import { ButtonColors } from "@/components/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import {
  LeaseDecisionsFieldPaths,
  LeaseDecisionsFieldTitles,
} from "@/leases/enums";
import { getUserFullName } from "@/users/helpers";
import {
  getContentDebtCollectionDecisions,
  getDecisionOptions,
} from "@/leases/helpers";
import {
  getUiDataCollectionCourtDecisionKey,
  getUiDataCollectionLetterKey,
  getUiDataCollectionNoteKey,
  getUiDataLeaseKey,
} from "@/uiData/helpers";
import {
  formatDate,
  hasPermissions,
  isFieldAllowedToRead,
  isFieldRequired,
  sortStringByKeyAsc,
} from "@/util/helpers";
import {
  getAttributes as getCollectionCourtDecisionAttributes,
  getCollectionCourtDecisionsByLease,
  getIsCollectionCourtDecisionPanelOpen,
} from "@/collectionCourtDecision/selectors";
import {
  getAttributes as getCollectionLetterAttributes,
  getCollectionLettersByLease,
} from "@/collectionLetter/selectors";
import { getAttributes as getCollectionNoteAttributes } from "@/collectionNote/selectors";
import { getCollectionNotesByLease } from "@/collectionNote/selectors";
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
} from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { withWindowResize } from "@/components/resize/WindowResizeHandler";
import type { Attributes } from "types";
import type { CollectionCourtDecisionId } from "@/collectionCourtDecision/types";
import type { CollectionLetterId } from "@/collectionLetter/types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type NotesProps = {
  fields: any;
  onCreate: (...args: Array<any>) => any;
  saveCallback: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const renderNotes = ({
  fields,
  onCreate,
  saveCallback,
  usersPermissions,
}: NotesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <Fragment>
      {!!fields.length &&
        fields.map((field, index) => {
          const handleCancel = () => {
            fields.remove(index);
          };

          const handleSave = (note: string) => {
            onCreate(note);
            saveCallback(() => {
              fields.remove(index);
            });
          };

          return (
            <NewCollectionNote
              key={index}
              field={field}
              onCancel={handleCancel}
              onSave={handleSave}
            />
          );
        })}
      <Authorization
        allow={hasPermissions(
          usersPermissions,
          UsersPermissions.ADD_COLLECTIONNOTE,
        )}
      >
        {fields.length === 0 && (
          <AddButtonThird label="Lisää huomautus" onClick={handleAdd} />
        )}
      </Authorization>
    </Fragment>
  );
};

type Props = {
  collectionCourtDecisions: Array<Record<string, any>>;
  collectionCourtDecisionAttributes: Attributes;
  collectionLetterAttributes: Attributes;
  collectionNoteAttributes: Attributes;
  collectionLetters: Array<Record<string, any>>;
  collectionNotes: Array<Record<string, any>>;
  createCollectionNote: (...args: Array<any>) => any;
  currentLease: Lease;
  deleteCollectionCourtDecision: (...args: Array<any>) => any;
  deleteCollectionLetter: (...args: Array<any>) => any;
  deleteCollectionNote: (...args: Array<any>) => any;
  handleSubmit: (...args: Array<any>) => any;
  hideCollectionCourtDecisionPanel: (...args: Array<any>) => any;
  isCollectionCourtDecisionPanelOpen: boolean;
  largeScreen: boolean;
  leaseAttributes: Attributes;
  showCollectionCourtDecisionPanel: (...args: Array<any>) => any;
  uploadCollectionCourtDecision: (...args: Array<any>) => any;
  uploadCollectionLetter: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
  valid: boolean;
};
type State = {
  collectionCourtDecisions: Array<Record<string, any>>;
  collectionLetters: Array<Record<string, any>>;
  collectionNotes: Array<Record<string, any>>;
  createCollectionNoteCallback:
    | ((...args: Array<any>) => any)
    | null
    | undefined;
  currentLease: Lease;
  debtCollectionDecisions: Array<Record<string, any>>;
  decisionOptions: Array<Record<string, any>>;
  sortedCollectionCourtDecisions: Array<Record<string, any>>;
  sortedCollectionLetters: Array<Record<string, any>>;
  sortedCollectionNotes: Array<Record<string, any>>;
};

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
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newStates: any = {};

    if (
      props.collectionCourtDecisions &&
      props.collectionCourtDecisions !== state.collectionCourtDecisions
    ) {
      newStates.collectionCourtDecisions = props.collectionCourtDecisions;
      newStates.sortedCollectionCourtDecisions =
        props.collectionCourtDecisions.sort((a, b) =>
          sortStringByKeyAsc(a, b, "uploaded_at"),
        );
    }

    if (
      props.collectionLetters &&
      props.collectionLetters !== state.collectionLetters
    ) {
      newStates.collectionLetters = props.collectionLetters;
      newStates.sortedCollectionLetters = props.collectionLetters.sort((a, b) =>
        sortStringByKeyAsc(a, b, "uploaded_at"),
      );
    }

    if (
      props.collectionNotes &&
      props.collectionNotes !== state.collectionNotes
    ) {
      newStates.collectionNotes = props.collectionNotes;
      newStates.sortedCollectionNotes = props.collectionNotes.sort((a, b) =>
        sortStringByKeyAsc(a, b, "modified_at"),
      );
    }

    if (props.currentLease !== state.currentLease) {
      newStates.currentLease = props.currentLease;
      newStates.decisionOptions = getDecisionOptions(props.currentLease);
      newStates.debtCollectionDecisions = getContentDebtCollectionDecisions(
        props.currentLease,
      );
    }

    if (!isEmpty(newStates)) {
      return newStates;
    }

    return null;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.collectionNotes !== this.props.collectionNotes) {
      const { createCollectionNoteCallback } = this.state;

      if (createCollectionNoteCallback) {
        createCollectionNoteCallback();
        this.setState({
          createCollectionNoteCallback: null,
        });
      }
    }
  }

  handleSaveCourtDecisionFile = ({ decision_date, file, note }) => {
    const { currentLease, uploadCollectionCourtDecision } = this.props;
    uploadCollectionCourtDecision({
      data: {
        decision_date: decision_date,
        note: note,
        lease: currentLease.id,
      },
      file: file,
    });
  };
  handleCollectionLetterFileChange = (e) => {
    const { currentLease, uploadCollectionLetter } = this.props;
    uploadCollectionLetter({
      data: {
        lease: currentLease.id,
      },
      file: e.target.files[0],
    });
  };
  handleDeleteCollectionCourtDecision = (id: CollectionCourtDecisionId) => {
    const { currentLease, deleteCollectionCourtDecision } = this.props;
    deleteCollectionCourtDecision({
      id: id,
      lease: currentLease.id,
    });
  };
  handleDeleteCollectionLetter = (id: CollectionLetterId) => {
    const { currentLease, deleteCollectionLetter } = this.props;
    deleteCollectionLetter({
      id: id,
      lease: currentLease.id,
    });
  };
  handleCreateCollectionNote = (note: string) => {
    const { currentLease, createCollectionNote } = this.props;
    createCollectionNote({
      lease: currentLease.id,
      note: note,
    });
  };
  handleDeleteCollectionNote = (id: CollectionLetterId) => {
    const { currentLease, deleteCollectionNote } = this.props;
    deleteCollectionNote({
      id: id,
      lease: currentLease.id,
    });
  };
  setSaveCollectionNoteCallback = (fn: (...args: Array<any>) => any) => {
    this.setState({
      createCollectionNoteCallback: fn,
    });
  };
  handleShowCollectionCourtDecisionPanel = () => {
    const { showCollectionCourtDecisionPanel } = this.props;
    showCollectionCourtDecisionPanel();
  };
  handleHideCollectionCourtDecisionPanel = () => {
    const { hideCollectionCourtDecisionPanel } = this.props;
    hideCollectionCourtDecisionPanel();
  };

  render() {
    const {
      collectionCourtDecisionAttributes,
      collectionLetterAttributes,
      collectionNoteAttributes,
      handleSubmit,
      isCollectionCourtDecisionPanelOpen,
      largeScreen,
      leaseAttributes,
      usersPermissions,
    } = this.props;
    const {
      debtCollectionDecisions,
      decisionOptions,
      sortedCollectionCourtDecisions,
      sortedCollectionLetters,
      sortedCollectionNotes,
    } = this.state;
    return (
      <AppConsumer>
        {({ dispatch }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.VIEW_COLLECTIONLETTER,
                )}
              >
                <Row>
                  <Column small={12}>
                    <SubTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataCollectionLetterKey(
                        CollectionLetterFieldPaths.COLLECTION_LETTERS,
                      )}
                    >
                      {CollectionLetterFieldTitles.COLLECTION_LETTERS}
                    </SubTitle>

                    {!hasPermissions(
                      usersPermissions,
                      UsersPermissions.ADD_COLLECTIONLETTER,
                    ) &&
                      (!sortedCollectionLetters ||
                        !sortedCollectionLetters.length) && (
                        <FormText>Ei perintäkirjeitä</FormText>
                      )}
                    {sortedCollectionLetters &&
                      !!sortedCollectionLetters.length && (
                        <Row>
                          <Column small={6} large={3}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                collectionLetterAttributes,
                                CollectionLetterFieldPaths.FILE,
                              )}
                            >
                              <FormTextTitle
                                enableUiDataEdit
                                uiDataKey={getUiDataCollectionLetterKey(
                                  CollectionLetterFieldPaths.FILE,
                                )}
                              >
                                {CollectionLetterFieldTitles.FILE}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                          <Column small={3} large={1}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                collectionLetterAttributes,
                                CollectionLetterFieldPaths.UPLOADED_AT,
                              )}
                            >
                              <FormTextTitle
                                enableUiDataEdit
                                uiDataKey={getUiDataCollectionLetterKey(
                                  CollectionLetterFieldPaths.UPLOADED_AT,
                                )}
                              >
                                {CollectionLetterFieldTitles.UPLOADED_AT}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                          <Column small={3} large={2}>
                            <FormTextTitle
                              enableUiDataEdit
                              tooltipStyle={{
                                right: 20,
                              }}
                              uiDataKey={getUiDataCollectionLetterKey(
                                CollectionLetterFieldPaths.UPLOADER,
                              )}
                            >
                              {CollectionLetterFieldTitles.UPLOADER}
                            </FormTextTitle>
                          </Column>
                        </Row>
                      )}

                    {sortedCollectionLetters &&
                      !!sortedCollectionLetters.length &&
                      sortedCollectionLetters.map((collectionLetter, index) => {
                        const handleRemove = () => {
                          dispatch({
                            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                            confirmationFunction: () => {
                              this.handleDeleteCollectionLetter(
                                collectionLetter.id,
                              );
                            },
                            confirmationModalButtonClassName:
                              ButtonColors.ALERT,
                            confirmationModalButtonText:
                              ConfirmationModalTexts.DELETE_COLLECTION_LETTER
                                .BUTTON,
                            confirmationModalLabel:
                              ConfirmationModalTexts.DELETE_COLLECTION_LETTER
                                .LABEL,
                            confirmationModalTitle:
                              ConfirmationModalTexts.DELETE_COLLECTION_LETTER
                                .TITLE,
                          });
                        };

                        return (
                          <Row key={index}>
                            <Column small={6} large={3}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  collectionLetterAttributes,
                                  CollectionLetterFieldPaths.FILE,
                                )}
                              >
                                <FileDownloadLink
                                  fileUrl={collectionLetter.file}
                                  label={collectionLetter.filename}
                                />
                              </Authorization>
                            </Column>
                            <Column small={3} large={1}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  collectionLetterAttributes,
                                  CollectionLetterFieldPaths.UPLOADED_AT,
                                )}
                              >
                                <FormText>
                                  {formatDate(collectionLetter.uploaded_at) ||
                                    "-"}
                                </FormText>
                              </Authorization>
                            </Column>
                            <Column small={3} large={2}>
                              <FieldAndRemoveButtonWrapper
                                field={
                                  <FormText className="full-width">
                                    {getUserFullName(
                                      collectionLetter.uploader,
                                    ) || "-"}
                                  </FormText>
                                }
                                removeButton={
                                  <Authorization
                                    allow={hasPermissions(
                                      usersPermissions,
                                      UsersPermissions.DELETE_COLLECTIONLETTER,
                                    )}
                                  >
                                    <RemoveButton
                                      className="third-level"
                                      onClick={handleRemove}
                                      style={{
                                        height: "unset",
                                      }}
                                      title="Poista tiedosto"
                                    />
                                  </Authorization>
                                }
                              />
                            </Column>
                          </Row>
                        );
                      })}

                    <Authorization
                      allow={hasPermissions(
                        usersPermissions,
                        UsersPermissions.ADD_COLLECTIONLETTER,
                      )}
                    >
                      <AddFileButton
                        label="Lisää perintäkirje"
                        name={"collectionLetterFileButtonId"}
                        onChange={this.handleCollectionLetterFileChange}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Authorization>

              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.VIEW_COLLECTIONCOURTDECISION,
                )}
              >
                <Row>
                  <Column small={12}>
                    <SubTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataCollectionCourtDecisionKey(
                        CollectionCourtDecisionFieldPaths.COLLECTION_COURT_DECISIONS,
                      )}
                    >
                      {
                        CollectionCourtDecisionFieldTitles.COLLECTION_COURT_DECISIONS
                      }
                    </SubTitle>

                    {!hasPermissions(
                      usersPermissions,
                      UsersPermissions.ADD_COLLECTIONCOURTDECISION,
                    ) &&
                      (!sortedCollectionCourtDecisions ||
                        !sortedCollectionCourtDecisions.length) && (
                        <FormText>Ei käräjaoikeuden päätöksiä</FormText>
                      )}
                    {largeScreen &&
                      ((sortedCollectionCourtDecisions &&
                        !!sortedCollectionCourtDecisions.length) ||
                        isCollectionCourtDecisionPanelOpen) && (
                        <Row>
                          <Column large={3}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                collectionCourtDecisionAttributes,
                                CollectionCourtDecisionFieldPaths.FILE,
                              )}
                            >
                              <FormTextTitle
                                enableUiDataEdit
                                uiDataKey={getUiDataCollectionCourtDecisionKey(
                                  CollectionCourtDecisionFieldPaths.FILE,
                                )}
                              >
                                {CollectionCourtDecisionFieldTitles.FILE}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                          <Column large={1}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                collectionCourtDecisionAttributes,
                                CollectionCourtDecisionFieldPaths.UPLOADED_AT,
                              )}
                            >
                              <FormTextTitle
                                enableUiDataEdit
                                uiDataKey={getUiDataCollectionCourtDecisionKey(
                                  CollectionCourtDecisionFieldPaths.UPLOADED_AT,
                                )}
                              >
                                {CollectionCourtDecisionFieldTitles.UPLOADED_AT}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                          <Column large={2}>
                            <FormTextTitle
                              enableUiDataEdit
                              tooltipStyle={{
                                right: 20,
                              }}
                              uiDataKey={getUiDataCollectionCourtDecisionKey(
                                CollectionCourtDecisionFieldPaths.UPLOADER,
                              )}
                            >
                              {CollectionCourtDecisionFieldTitles.UPLOADER}
                            </FormTextTitle>
                          </Column>
                          <Column large={2}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                collectionCourtDecisionAttributes,
                                CollectionCourtDecisionFieldPaths.DECISION_DATE,
                              )}
                            >
                              <FormTextTitle
                                enableUiDataEdit
                                uiDataKey={getUiDataCollectionCourtDecisionKey(
                                  CollectionCourtDecisionFieldPaths.DECISION_DATE,
                                )}
                              >
                                {
                                  CollectionCourtDecisionFieldTitles.DECISION_DATE
                                }
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                          <Column large={4}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                collectionCourtDecisionAttributes,
                                CollectionCourtDecisionFieldPaths.NOTE,
                              )}
                            >
                              <FormTextTitle
                                enableUiDataEdit
                                uiDataKey={getUiDataCollectionCourtDecisionKey(
                                  CollectionCourtDecisionFieldPaths.NOTE,
                                )}
                              >
                                {CollectionCourtDecisionFieldTitles.NOTE}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                        </Row>
                      )}
                    {largeScreen &&
                      sortedCollectionCourtDecisions &&
                      !!sortedCollectionCourtDecisions.length &&
                      sortedCollectionCourtDecisions.map(
                        (collectionCourtDecision, index) => {
                          const handleRemove = () => {
                            dispatch({
                              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                              confirmationFunction: () => {
                                this.handleDeleteCollectionCourtDecision(
                                  collectionCourtDecision.id,
                                );
                              },
                              confirmationModalButtonClassName:
                                ButtonColors.ALERT,
                              confirmationModalButtonText:
                                ConfirmationModalTexts
                                  .DELETE_COLLECTION_COURT_DECISIONS.BUTTON,
                              confirmationModalLabel:
                                ConfirmationModalTexts
                                  .DELETE_COLLECTION_COURT_DECISIONS.LABEL,
                              confirmationModalTitle:
                                ConfirmationModalTexts
                                  .DELETE_COLLECTION_COURT_DECISIONS.TITLE,
                            });
                          };

                          return (
                            <Row key={index}>
                              <Column large={3}>
                                <Authorization
                                  allow={isFieldAllowedToRead(
                                    collectionCourtDecisionAttributes,
                                    CollectionCourtDecisionFieldPaths.FILE,
                                  )}
                                >
                                  <FileDownloadLink
                                    fileUrl={collectionCourtDecision.file}
                                    label={collectionCourtDecision.filename}
                                  />
                                </Authorization>
                              </Column>
                              <Column large={1}>
                                <Authorization
                                  allow={isFieldAllowedToRead(
                                    collectionCourtDecisionAttributes,
                                    CollectionCourtDecisionFieldPaths.UPLOADED_AT,
                                  )}
                                >
                                  <FormText>
                                    {formatDate(
                                      collectionCourtDecision.uploaded_at,
                                    ) || "-"}
                                  </FormText>
                                </Authorization>
                              </Column>
                              <Column large={2}>
                                <FormText>
                                  {getUserFullName(
                                    collectionCourtDecision.uploader,
                                  ) || "-"}
                                </FormText>
                              </Column>
                              <Column large={2}>
                                <FormText>
                                  {formatDate(
                                    collectionCourtDecision.decision_date,
                                  ) || "-"}
                                </FormText>
                              </Column>
                              <Column large={4}>
                                <FieldAndRemoveButtonWrapper
                                  field={
                                    <FormText className="full-width">
                                      {collectionCourtDecision.note || "-"}
                                    </FormText>
                                  }
                                  removeButton={
                                    <Authorization
                                      allow={hasPermissions(
                                        usersPermissions,
                                        UsersPermissions.DELETE_COLLECTIONCOURTDECISION,
                                      )}
                                    >
                                      <RemoveButton
                                        className="third-level"
                                        onClick={handleRemove}
                                        style={{
                                          height: "unset",
                                        }}
                                        title="Poista käräjäoikeuden päätös"
                                      />
                                    </Authorization>
                                  }
                                />
                              </Column>
                            </Row>
                          );
                        },
                      )}

                    {!largeScreen &&
                      sortedCollectionCourtDecisions &&
                      !!sortedCollectionCourtDecisions.length && (
                        <BoxItemContainer>
                          {sortedCollectionCourtDecisions.map(
                            (collectionCourtDecision, index) => {
                              const handleRemove = () => {
                                dispatch({
                                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                                  confirmationFunction: () => {
                                    this.handleDeleteCollectionCourtDecision(
                                      collectionCourtDecision.id,
                                    );
                                  },
                                  confirmationModalButtonClassName:
                                    ButtonColors.ALERT,
                                  confirmationModalButtonText:
                                    ConfirmationModalTexts
                                      .DELETE_COLLECTION_COURT_DECISIONS.BUTTON,
                                  confirmationModalLabel:
                                    ConfirmationModalTexts
                                      .DELETE_COLLECTION_COURT_DECISIONS.LABEL,
                                  confirmationModalTitle:
                                    ConfirmationModalTexts
                                      .DELETE_COLLECTION_COURT_DECISIONS.TITLE,
                                });
                              };

                              return (
                                <BoxItem key={index}>
                                  <Authorization
                                    allow={hasPermissions(
                                      usersPermissions,
                                      UsersPermissions.DELETE_COLLECTIONCOURTDECISION,
                                    )}
                                  >
                                    <ActionButtonWrapper>
                                      <RemoveButton
                                        onClick={handleRemove}
                                        title="Poista käräjäoikeuden päätös"
                                      />
                                    </ActionButtonWrapper>
                                  </Authorization>
                                  <Row>
                                    <Column small={6}>
                                      <Authorization
                                        allow={isFieldAllowedToRead(
                                          collectionCourtDecisionAttributes,
                                          CollectionCourtDecisionFieldPaths.FILE,
                                        )}
                                      >
                                        <>
                                          <FormTextTitle
                                            enableUiDataEdit
                                            uiDataKey={getUiDataCollectionCourtDecisionKey(
                                              CollectionCourtDecisionFieldPaths.FILE,
                                            )}
                                          >
                                            {
                                              CollectionCourtDecisionFieldTitles.FILE
                                            }
                                          </FormTextTitle>
                                          <FileDownloadLink
                                            fileUrl={
                                              collectionCourtDecision.file
                                            }
                                            label={
                                              collectionCourtDecision.filename
                                            }
                                          />
                                        </>
                                      </Authorization>
                                    </Column>
                                    <Column small={3}>
                                      <Authorization
                                        allow={isFieldAllowedToRead(
                                          collectionCourtDecisionAttributes,
                                          CollectionCourtDecisionFieldPaths.UPLOADED_AT,
                                        )}
                                      >
                                        <>
                                          <FormTextTitle
                                            enableUiDataEdit
                                            uiDataKey={getUiDataCollectionCourtDecisionKey(
                                              CollectionCourtDecisionFieldPaths.UPLOADED_AT,
                                            )}
                                          >
                                            {
                                              CollectionCourtDecisionFieldTitles.UPLOADED_AT
                                            }
                                          </FormTextTitle>
                                          <FormText>
                                            {formatDate(
                                              collectionCourtDecision.uploaded_at,
                                            ) || "-"}
                                          </FormText>
                                        </>
                                      </Authorization>
                                    </Column>
                                    <Column small={3}>
                                      <FormTextTitle
                                        enableUiDataEdit
                                        uiDataKey={getUiDataCollectionCourtDecisionKey(
                                          CollectionCourtDecisionFieldPaths.UPLOADER,
                                        )}
                                      >
                                        {
                                          CollectionCourtDecisionFieldTitles.UPLOADER
                                        }
                                      </FormTextTitle>
                                      <FormText>
                                        {getUserFullName(
                                          collectionCourtDecision.uploader,
                                        ) || "-"}
                                      </FormText>
                                    </Column>
                                    <Column small={3}>
                                      <FormTextTitle
                                        enableUiDataEdit
                                        uiDataKey={getUiDataCollectionCourtDecisionKey(
                                          CollectionCourtDecisionFieldPaths.DECISION_DATE,
                                        )}
                                      >
                                        {
                                          CollectionCourtDecisionFieldTitles.DECISION_DATE
                                        }
                                      </FormTextTitle>
                                      <FormText>
                                        {formatDate(
                                          collectionCourtDecision.decision_date,
                                        ) || "-"}
                                      </FormText>
                                    </Column>
                                    <Column small={9}>
                                      <FormTextTitle
                                        enableUiDataEdit
                                        uiDataKey={getUiDataCollectionCourtDecisionKey(
                                          CollectionCourtDecisionFieldPaths.NOTE,
                                        )}
                                      >
                                        {
                                          CollectionCourtDecisionFieldTitles.NOTE
                                        }
                                      </FormTextTitle>
                                      <FormText>
                                        {collectionCourtDecision.note || "-"}
                                      </FormText>
                                    </Column>
                                  </Row>
                                </BoxItem>
                              );
                            },
                          )}
                        </BoxItemContainer>
                      )}
                    <Authorization
                      allow={hasPermissions(
                        usersPermissions,
                        UsersPermissions.ADD_COLLECTIONCOURTDECISION,
                      )}
                    >
                      <Fragment>
                        <CollectionCourtDecisionPanel
                          isOpen={isCollectionCourtDecisionPanelOpen}
                          largeScreen={largeScreen}
                          onClose={this.handleHideCollectionCourtDecisionPanel}
                          onSave={this.handleSaveCourtDecisionFile}
                          title="Lisää käräjäoikeuden päätös"
                        />
                        {!isCollectionCourtDecisionPanelOpen && (
                          <AddButtonThird
                            label="Lisää käräjäoikeuden päätös"
                            onClick={
                              this.handleShowCollectionCourtDecisionPanel
                            }
                            style={{
                              margin: 0,
                            }}
                          />
                        )}
                      </Fragment>
                    </Authorization>
                  </Column>
                </Row>
              </Authorization>

              <Authorization
                allow={
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseDecisionsFieldPaths.DECISIONS,
                  ) &&
                  isFieldAllowedToRead(
                    leaseAttributes,
                    LeaseDecisionsFieldPaths.REFERENCE_NUMBER,
                  )
                }
              >
                <Row>
                  <Column small={12} large={6}>
                    <SubTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(
                        LeaseDecisionsFieldPaths.DEBT_COLLECTION_DECISIONS,
                      )}
                    >
                      {LeaseDecisionsFieldTitles.DEBT_COLLECTION_DECISIONS}
                    </SubTitle>

                    {!debtCollectionDecisions.length && (
                      <FormText>Ei purkamispäätöksiä</FormText>
                    )}
                    {!!debtCollectionDecisions.length &&
                      debtCollectionDecisions.map((decision, index) => (
                        <DecisionLink
                          key={index}
                          decision={decision}
                          decisionOptions={decisionOptions}
                        />
                      ))}
                  </Column>
                </Row>
              </Authorization>

              <Authorization
                allow={hasPermissions(
                  usersPermissions,
                  UsersPermissions.VIEW_COLLECTIONNOTE,
                )}
              >
                <Row>
                  <Column small={12} large={6}>
                    <SubTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataCollectionNoteKey(
                        CollectionNoteFieldPaths.COLLECTION_NOTES,
                      )}
                    >
                      {CollectionNoteFieldTitles.COLLECTION_NOTES}
                    </SubTitle>

                    {!hasPermissions(
                      usersPermissions,
                      UsersPermissions.VIEW_COLLECTIONNOTE,
                    ) &&
                      (!sortedCollectionNotes ||
                        !sortedCollectionNotes.length) && (
                        <FormText>Ei huomautuksia</FormText>
                      )}
                    {sortedCollectionNotes &&
                      !!sortedCollectionNotes.length && (
                        <Row>
                          <Column small={6}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                collectionNoteAttributes,
                                CollectionNoteFieldPaths.NOTE,
                              )}
                            >
                              <FormTextTitle
                                required={isFieldRequired(
                                  collectionNoteAttributes,
                                  CollectionNoteFieldPaths.NOTE,
                                )}
                                enableUiDataEdit
                                uiDataKey={getUiDataCollectionNoteKey(
                                  CollectionNoteFieldPaths.NOTE,
                                )}
                              >
                                {CollectionNoteFieldTitles.NOTE}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                          <Column small={3}>
                            <Authorization
                              allow={isFieldAllowedToRead(
                                collectionNoteAttributes,
                                CollectionNoteFieldPaths.MODIFIED_AT,
                              )}
                            >
                              <FormTextTitle
                                enableUiDataEdit
                                uiDataKey={getUiDataCollectionNoteKey(
                                  CollectionNoteFieldPaths.MODIFIED_AT,
                                )}
                              >
                                {CollectionNoteFieldTitles.MODIFIED_AT}
                              </FormTextTitle>
                            </Authorization>
                          </Column>
                          <Column small={3}>
                            <FormTextTitle
                              enableUiDataEdit
                              tooltipStyle={{
                                right: 20,
                              }}
                              uiDataKey={getUiDataCollectionNoteKey(
                                CollectionNoteFieldPaths.USER,
                              )}
                            >
                              {CollectionNoteFieldTitles.USER}
                            </FormTextTitle>
                          </Column>
                        </Row>
                      )}
                    {sortedCollectionNotes &&
                      !!sortedCollectionNotes.length &&
                      sortedCollectionNotes.map((note) => {
                        const handleRemove = () => {
                          dispatch({
                            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                            confirmationFunction: () => {
                              this.handleDeleteCollectionNote(note.id);
                            },
                            confirmationModalButtonClassName:
                              ButtonColors.ALERT,
                            confirmationModalButtonText:
                              ConfirmationModalTexts.DELETE_NOTE.BUTTON,
                            confirmationModalLabel:
                              ConfirmationModalTexts.DELETE_NOTE.LABEL,
                            confirmationModalTitle:
                              ConfirmationModalTexts.DELETE_NOTE.TITLE,
                          });
                        };

                        return (
                          <Row key={note.id}>
                            <Column small={6}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  collectionNoteAttributes,
                                  CollectionNoteFieldPaths.NOTE,
                                )}
                              >
                                <ShowMore text={note.note} />
                              </Authorization>
                            </Column>
                            <Column small={3}>
                              <Authorization
                                allow={isFieldAllowedToRead(
                                  collectionNoteAttributes,
                                  CollectionNoteFieldPaths.MODIFIED_AT,
                                )}
                              >
                                <FormText>
                                  {formatDate(note.modified_at)}
                                </FormText>
                              </Authorization>
                            </Column>
                            <Column small={3}>
                              <FieldAndRemoveButtonWrapper
                                field={
                                  // TODO: Check that attributes has CollectionNoteFieldPaths.USER when added API
                                  <FormText className="full-width">
                                    {getUserFullName(note.user)}
                                  </FormText>
                                }
                                removeButton={
                                  <Authorization
                                    allow={hasPermissions(
                                      usersPermissions,
                                      UsersPermissions.DELETE_COLLECTIONNOTE,
                                    )}
                                  >
                                    <RemoveButton
                                      className="third-level"
                                      onClick={handleRemove}
                                      style={{
                                        height: "unset",
                                      }}
                                      title="Poista huomautus"
                                    />
                                  </Authorization>
                                }
                              />
                            </Column>
                          </Row>
                        );
                      })}

                    <Authorization
                      allow={hasPermissions(
                        usersPermissions,
                        UsersPermissions.ADD_COLLECTIONNOTE,
                      )}
                    >
                      <FieldArray
                        component={renderNotes}
                        name="notes"
                        onCreate={this.handleCreateCollectionNote}
                        saveCallback={this.setSaveCollectionNoteCallback}
                        usersPermissions={usersPermissions}
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

const formName = FormNames.LEASE_DEBT_COLLECTION;
export default flowRight(
  withWindowResize,
  connect(
    (state) => {
      const currentLease = getCurrentLease(state);
      return {
        collectionCourtDecisionAttributes:
          getCollectionCourtDecisionAttributes(state),
        collectionCourtDecisions: getCollectionCourtDecisionsByLease(
          state,
          currentLease.id,
        ),
        collectionLetterAttributes: getCollectionLetterAttributes(state),
        collectionLetters: getCollectionLettersByLease(state, currentLease.id),
        collectionNoteAttributes: getCollectionNoteAttributes(state),
        collectionNotes: getCollectionNotesByLease(state, currentLease.id),
        currentLease: currentLease,
        isCollectionCourtDecisionPanelOpen:
          getIsCollectionCourtDecisionPanelOpen(state),
        leaseAttributes: getLeaseAttributes(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      createCollectionNote,
      deleteCollectionCourtDecision,
      deleteCollectionLetter,
      deleteCollectionNote,
      hideCollectionCourtDecisionPanel,
      showCollectionCourtDecisionPanel,
      uploadCollectionCourtDecision,
      uploadCollectionLetter,
    },
  ),
  reduxForm({
    form: formName,
  }),
)(DebtCollectionForm);
