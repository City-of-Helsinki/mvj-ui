import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/root/hooks";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Loader from "@/components/loader/Loader";
import { Row, Column } from "@/components/grid/Grid";
import FormText from "@/components/form/FormText";
import SubTitle from "@/components/content/SubTitle";
import CollectionNoteItem from "@/collectionNote/components/CollectionNote";
import CollectionNoteEdit from "@/collectionNote/components/CollectionNoteEdit";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import BoxItem from "@/components/content/BoxItem";
import { ActionTypes } from "@/app/AppContext";
import { getUiDataCollectionNoteKey } from "@/uiData/helpers";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
} from "@/collectionNote/enums";
import { ButtonColors } from "@/components/enums";
import { ConfirmationModalTexts } from "@/enums";
import { getIsFetchingByLease } from "../selectors";
import { getCurrentLease } from "@/leases/selectors";
import { editCollectionNote } from "../actions";

import type {
  CollectionNote,
  CollectionNoteId,
  CollectionNotePayload,
} from "../types";

type CollectionNotesProps = {
  collectionNotes: Array<CollectionNote>;
  handleDeleteCollectionNote: (...args: Array<any>) => any;
  isServiceUnitSameAsActiveServiceUnit: () => boolean;
  appDispatch: (...args: Array<any>) => any;
};

const CollectionNotes: React.FC<CollectionNotesProps> = ({
  collectionNotes,
  handleDeleteCollectionNote,
  isServiceUnitSameAsActiveServiceUnit,
  appDispatch,
}) => {
  const dispatch = useAppDispatch();
  const currentLease = useAppSelector(getCurrentLease);
  const isFetchingByLease = useAppSelector((state) =>
    getIsFetchingByLease(state, currentLease?.id),
  );
  const [editingNoteId, setEditingNoteId] = useState<CollectionNoteId | null>(
    null,
  );

  const handlePatchCollectionNote = (payload: CollectionNotePayload) => {
    dispatch(editCollectionNote(payload));
    setEditingNoteId(null);
  };

  return (
    <Row>
      <Column small={12}>
        <SubTitle
          enableUiDataEdit
          uiDataKey={getUiDataCollectionNoteKey(
            CollectionNoteFieldPaths.COLLECTION_NOTES,
          )}
        >
          {CollectionNoteFieldTitles.COLLECTION_NOTES}
        </SubTitle>

        {isFetchingByLease ? (
          <LoaderWrapper>
            <Loader isLoading={true} />
          </LoaderWrapper>
        ) : (
          <>
            {!collectionNotes?.length && <FormText>Ei huomautuksia</FormText>}

            {!!collectionNotes?.length && (
              <BoxItemContainer>
                {[...collectionNotes]
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime(),
                  )
                  .map((note) => {
                    const handleRemove = () => {
                      appDispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          handleDeleteCollectionNote(note.id);
                          setEditingNoteId(null);
                        },
                        confirmationModalButtonClassName: ButtonColors.ALERT,
                        confirmationModalButtonText:
                          ConfirmationModalTexts.DELETE_NOTE.BUTTON,
                        confirmationModalLabel:
                          ConfirmationModalTexts.DELETE_NOTE.LABEL,
                        confirmationModalTitle:
                          ConfirmationModalTexts.DELETE_NOTE.TITLE,
                      });
                    };
                    return editingNoteId === note.id &&
                      isServiceUnitSameAsActiveServiceUnit() ? (
                      <BoxItem key={note.id}>
                        <CollectionNoteEdit
                          note={note}
                          onSave={handlePatchCollectionNote}
                          onDelete={handleRemove}
                          onCancel={() => setEditingNoteId(null)}
                        />
                      </BoxItem>
                    ) : (
                      <BoxItem key={note.id}>
                        <CollectionNoteItem
                          note={note}
                          handleEdit={() => setEditingNoteId(note.id)}
                          enableEdit={editingNoteId === null}
                          isServiceUnitSameAsActiveServiceUnit={
                            isServiceUnitSameAsActiveServiceUnit
                          }
                        />
                      </BoxItem>
                    );
                  })}
              </BoxItemContainer>
            )}
          </>
        )}
      </Column>
    </Row>
  );
};

export default CollectionNotes;
