import React from "react";
import { useSelector } from "react-redux";
import LoaderWrapper from "@/components/loader/LoaderWrapper";
import Loader from "@/components/loader/Loader";
import { Row, Column } from "@/components/grid/Grid";
import FormText from "@/components/form/FormText";
import SubTitle from "@/components/content/SubTitle";
import CollectionNoteItem from "@/collectionNote/components/CollectionNote";
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

import type { CollectionNote } from "../types";

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
  const currentLease = useSelector(getCurrentLease);
  const isFetchingByLease = useSelector((state) =>
    getIsFetchingByLease(state, currentLease?.id),
  );

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
            {(!collectionNotes || !collectionNotes.length) && (
              <FormText>Ei huomautuksia</FormText>
            )}

            {collectionNotes && !!collectionNotes.length && (
              <>
                {collectionNotes
                  .sort(
                    (a, b) =>
                      new Date(b.modified_at).getTime() -
                      new Date(a.modified_at).getTime(),
                  )
                  .map((note) => {
                    const handleRemove = () => {
                      appDispatch({
                        type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                        confirmationFunction: () => {
                          handleDeleteCollectionNote(note.id);
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
                    return (
                      <CollectionNoteItem
                        key={note.id}
                        note={note}
                        handleRemove={handleRemove}
                        isServiceUnitSameAsActiveServiceUnit={
                          isServiceUnitSameAsActiveServiceUnit
                        }
                      />
                    );
                  })}
              </>
            )}
          </>
        )}
      </Column>
    </Row>
  );
};

export default CollectionNotes;
