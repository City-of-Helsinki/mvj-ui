import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FieldArray } from "react-final-form-arrays";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { Row, Column } from "react-foundation";
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
  receiveIsSaveClicked,
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
  getFieldOptions,
  getLabelOfOption,
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
import {
  getUserActiveServiceUnit,
  getUsersPermissions,
} from "@/usersPermissions/selectors";
import { useWindowResize } from "@/components/resize/WindowResizeHandler";
import type { Attributes } from "types";
import type { CollectionCourtDecisionId } from "@/collectionCourtDecision/types";
import type { CollectionLetterId } from "@/collectionLetter/types";
import type { Lease } from "@/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type NotesProps = {
  fields: any;
  onCreate: (...args: Array<any>) => any;
  saveCallback: (...args: Array<any>) => any;
};

const Notes: React.FC<NotesProps> = ({ fields, onCreate, saveCallback }) => {
  const usersPermissions = useSelector(getUsersPermissions);

  const handleAdd = () => {
    fields.push({});
  };

  return (
    <>
      {!!fields.length &&
        fields.map((field, index) => {
          const handleCancel = () => {
            fields.remove(index);
          };

          const handleSave = (note: string, collectionStage: string) => {
            onCreate(note, collectionStage);
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
    </>
  );
};

const DebtCollectionForm: React.FC = () => {
  const currentLease: Lease = useSelector(getCurrentLease);
  const collectionCourtDecisions = useSelector((state) =>
    getCollectionCourtDecisionsByLease(state, currentLease.id),
  );
  const collectionCourtDecisionAttributes: Attributes = useSelector(
    getCollectionCourtDecisionAttributes,
  );
  const collectionLetterAttributes: Attributes = useSelector(
    getCollectionLetterAttributes,
  );
  const collectionLetters = useSelector((state) =>
    getCollectionLettersByLease(state, currentLease.id),
  );
  const collectionNoteAttributes: Attributes = useSelector(
    getCollectionNoteAttributes,
  );
  const collectionNotes = useSelector((state) =>
    getCollectionNotesByLease(state, currentLease.id),
  );
  const isCollectionCourtDecisionPanelOpen = useSelector(
    getIsCollectionCourtDecisionPanelOpen,
  );
  const leaseAttributes: Attributes = useSelector(getLeaseAttributes);
  const usersPermissions: UsersPermissionsType =
    useSelector(getUsersPermissions);
  const activeServiceUnit = useSelector(getUserActiveServiceUnit);
  const largeScreen = useWindowResize();
  const dispatch = useDispatch();

  const [sortedCollectionCourtDecisions, setSortedCollectionCourtDecisions] =
    useState<Array<Record<string, any>>>([]);
  const [sortedCollectionLetters, setSortedCollectionLetters] = useState<
    Array<Record<string, any>>
  >([]);
  const [sortedCollectionNotes, setSortedCollectionNotes] = useState<
    Array<Record<string, any>>
  >([]);
  const [createCollectionNoteCallback, setCreateCollectionNoteCallback] =
    useState<((...args: Array<any>) => any) | null>(null);

  const debtCollectionDecisions = useMemo(
    () => getContentDebtCollectionDecisions(currentLease),
    [currentLease],
  );
  const decisionOptions = useMemo(
    () => getDecisionOptions(currentLease),
    [currentLease],
  );

  const isServiceUnitSameAsActiveServiceUnit = () => {
    return activeServiceUnit?.id === currentLease?.service_unit?.id;
  };

  useEffect(() => {
    if (collectionCourtDecisions) {
      setSortedCollectionCourtDecisions(
        collectionCourtDecisions.sort((a, b) =>
          sortStringByKeyAsc(a, b, "uploaded_at"),
        ),
      );
    }
  }, [collectionCourtDecisions]);

  useEffect(() => {
    if (collectionLetters) {
      setSortedCollectionLetters(
        collectionLetters.sort((a, b) =>
          sortStringByKeyAsc(a, b, "uploaded_at"),
        ),
      );
    }
  }, [collectionLetters]);

  useEffect(() => {
    if (collectionNotes) {
      setSortedCollectionNotes(
        collectionNotes.sort((a, b) => sortStringByKeyAsc(a, b, "modified_at")),
      );
    }
  }, [collectionNotes]);

  useEffect(() => {
    if (createCollectionNoteCallback) {
      createCollectionNoteCallback();
      setCreateCollectionNoteCallback(null);
    }
  }, [collectionNotes, createCollectionNoteCallback]);

  const handleSaveCourtDecisionFile = ({ decision_date, file, note }) => {
    dispatch(
      uploadCollectionCourtDecision({
        data: {
          decision_date: decision_date,
          note: note,
          lease: currentLease.id,
        },
        file: file,
      }),
    );
    dispatch(receiveIsSaveClicked(true));
  };

  const handleCollectionLetterFileChange = (e) => {
    dispatch(
      uploadCollectionLetter({
        data: {
          lease: currentLease.id,
        },
        file: e.target.files[0],
      }),
    );
  };

  const handleDeleteCollectionCourtDecision = (
    id: CollectionCourtDecisionId,
  ) => {
    dispatch(
      deleteCollectionCourtDecision({
        id: id,
        lease: currentLease.id,
      }),
    );
  };

  const handleDeleteCollectionLetter = (id: CollectionLetterId) => {
    dispatch(
      deleteCollectionLetter({
        id: id,
        lease: currentLease.id,
      }),
    );
  };

  const handleCreateCollectionNote = (
    note: string,
    collectionStage: string,
  ) => {
    dispatch(
      createCollectionNote({
        lease: currentLease.id,
        note: note,
        collection_stage: collectionStage,
      }),
    );
  };
  const handleDeleteCollectionNote = (id: CollectionLetterId) => {
    dispatch(
      deleteCollectionNote({
        id: id,
        lease: currentLease.id,
      }),
    );
  };

  const setSaveCollectionNoteCallback = (fn: (...args: Array<any>) => any) => {
    setCreateCollectionNoteCallback(() => fn);
  };

  const handleShowCollectionCourtDecisionPanel = () => {
    dispatch(showCollectionCourtDecisionPanel());
  };

  const handleHideCollectionCourtDecisionPanel = () => {
    dispatch(hideCollectionCourtDecisionPanel());
  };

  return (
    <AppConsumer>
      {({ dispatch: appDispatch }) => {
        return (
          <Form onSubmit={() => {}} mutators={{ ...arrayMutators }}>
            {({ handleSubmit, valid }) => (
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
                        sortedCollectionLetters.map(
                          (collectionLetter, index) => {
                            const handleRemove = () => {
                              appDispatch({
                                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                                confirmationFunction: () => {
                                  handleDeleteCollectionLetter(
                                    collectionLetter.id,
                                  );
                                },
                                confirmationModalButtonClassName:
                                  ButtonColors.ALERT,
                                confirmationModalButtonText:
                                  ConfirmationModalTexts
                                    .DELETE_COLLECTION_LETTER.BUTTON,
                                confirmationModalLabel:
                                  ConfirmationModalTexts
                                    .DELETE_COLLECTION_LETTER.LABEL,
                                confirmationModalTitle:
                                  ConfirmationModalTexts
                                    .DELETE_COLLECTION_LETTER.TITLE,
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
                                      {formatDate(
                                        collectionLetter.uploaded_at,
                                      ) || "-"}
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
                                        allow={
                                          hasPermissions(
                                            usersPermissions,
                                            UsersPermissions.DELETE_COLLECTIONLETTER,
                                          ) &&
                                          isServiceUnitSameAsActiveServiceUnit()
                                        }
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
                          },
                        )}

                      <Authorization
                        allow={
                          hasPermissions(
                            usersPermissions,
                            UsersPermissions.ADD_COLLECTIONLETTER,
                          ) && isServiceUnitSameAsActiveServiceUnit()
                        }
                      >
                        <AddFileButton
                          label="Lisää perintäkirje"
                          name={"collectionLetterFileButtonId"}
                          onChange={handleCollectionLetterFileChange}
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
                                  {
                                    CollectionCourtDecisionFieldTitles.UPLOADED_AT
                                  }
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
                              appDispatch({
                                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                                confirmationFunction: () => {
                                  handleDeleteCollectionCourtDecision(
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
                                        allow={
                                          hasPermissions(
                                            usersPermissions,
                                            UsersPermissions.DELETE_COLLECTIONCOURTDECISION,
                                          ) &&
                                          isServiceUnitSameAsActiveServiceUnit()
                                        }
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
                                  appDispatch({
                                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                                    confirmationFunction: () => {
                                      handleDeleteCollectionCourtDecision(
                                        collectionCourtDecision.id,
                                      );
                                    },
                                    confirmationModalButtonClassName:
                                      ButtonColors.ALERT,
                                    confirmationModalButtonText:
                                      ConfirmationModalTexts
                                        .DELETE_COLLECTION_COURT_DECISIONS
                                        .BUTTON,
                                    confirmationModalLabel:
                                      ConfirmationModalTexts
                                        .DELETE_COLLECTION_COURT_DECISIONS
                                        .LABEL,
                                    confirmationModalTitle:
                                      ConfirmationModalTexts
                                        .DELETE_COLLECTION_COURT_DECISIONS
                                        .TITLE,
                                  });
                                };

                                return (
                                  <BoxItem key={index}>
                                    <Authorization
                                      allow={
                                        hasPermissions(
                                          usersPermissions,
                                          UsersPermissions.DELETE_COLLECTIONCOURTDECISION,
                                        ) &&
                                        isServiceUnitSameAsActiveServiceUnit()
                                      }
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
                        allow={
                          hasPermissions(
                            usersPermissions,
                            UsersPermissions.ADD_COLLECTIONCOURTDECISION,
                          ) && isServiceUnitSameAsActiveServiceUnit()
                        }
                      >
                        <>
                          <CollectionCourtDecisionPanel
                            isOpen={isCollectionCourtDecisionPanelOpen}
                            largeScreen={largeScreen}
                            onClose={handleHideCollectionCourtDecisionPanel}
                            onSave={handleSaveCourtDecisionFile}
                            title="Lisää käräjäoikeuden päätös"
                            valid={valid}
                          />
                          {!isCollectionCourtDecisionPanelOpen && (
                            <AddButtonThird
                              label="Lisää käräjäoikeuden päätös"
                              onClick={handleShowCollectionCourtDecisionPanel}
                              style={{
                                margin: 0,
                              }}
                            />
                          )}
                        </>
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
                    <Column small={12} large={9}>
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
                            <Column small={5} large={4}>
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
                                  CollectionNoteFieldPaths.COLLECTION_STAGE,
                                )}
                              >
                                <FormTextTitle
                                  required={isFieldRequired(
                                    collectionNoteAttributes,
                                    CollectionNoteFieldPaths.COLLECTION_STAGE,
                                  )}
                                  enableUiDataEdit
                                  uiDataKey={getUiDataCollectionNoteKey(
                                    CollectionNoteFieldPaths.COLLECTION_STAGE,
                                  )}
                                >
                                  {CollectionNoteFieldTitles.COLLECTION_STAGE}
                                </FormTextTitle>
                              </Authorization>
                            </Column>
                            <Column small={2}>
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
                            <Column small={2}>
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
                            appDispatch({
                              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                              confirmationFunction: () => {
                                handleDeleteCollectionNote(note.id);
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
                              <Column small={5} large={4}>
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
                                    CollectionNoteFieldPaths.COLLECTION_STAGE,
                                  )}
                                >
                                  <FormText>
                                    {getLabelOfOption(
                                      getFieldOptions(
                                        collectionNoteAttributes,
                                        CollectionNoteFieldPaths.COLLECTION_STAGE,
                                      ),
                                      note.collection_stage,
                                    ) || "-"}
                                  </FormText>
                                </Authorization>
                              </Column>
                              <Column small={2}>
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
                              <Column small={2}>
                                <FieldAndRemoveButtonWrapper
                                  field={
                                    // TODO: Check that attributes has CollectionNoteFieldPaths.USER when added API
                                    <FormText className="full-width">
                                      {getUserFullName(note.user)}
                                    </FormText>
                                  }
                                  removeButton={
                                    <Authorization
                                      allow={
                                        hasPermissions(
                                          usersPermissions,
                                          UsersPermissions.DELETE_COLLECTIONNOTE,
                                        ) &&
                                        isServiceUnitSameAsActiveServiceUnit()
                                      }
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
                        allow={
                          hasPermissions(
                            usersPermissions,
                            UsersPermissions.ADD_COLLECTIONNOTE,
                          ) && isServiceUnitSameAsActiveServiceUnit()
                        }
                      >
                        <FieldArray name="notes">
                          {(fieldArrayProps) =>
                            Notes({
                              ...fieldArrayProps,
                              onCreate: handleCreateCollectionNote,
                              saveCallback: setSaveCollectionNoteCallback,
                            })
                          }
                        </FieldArray>
                      </Authorization>
                    </Column>
                  </Row>
                </Authorization>
              </form>
            )}
          </Form>
        );
      }}
    </AppConsumer>
  );
};

export default DebtCollectionForm;
