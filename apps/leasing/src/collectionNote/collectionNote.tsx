import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import SubTitle from "@/components/content/SubTitle";
import CollectionNoteItem from "@/collectionNote/CollectionNoteItem";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
} from "@/collectionNote/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { getUiDataCollectionNoteKey } from "@/uiData/helpers";
import { hasPermissions } from "@/util/helpers";
import { getUsersPermissions } from "@/usersPermissions/selectors";

type CollectionNotesProps = {
  sortedCollectionNotes: Array<Record<string, any>>;
  invoices: Array<Record<string, any>>;
  appDispatch: (...args: Array<any>) => any;
  handleDeleteCollectionNote: (...args: Array<any>) => any;
  isServiceUnitSameAsActiveServiceUnit: () => boolean;
};

const CollectionNotes: React.FC<CollectionNotesProps> = ({
  sortedCollectionNotes,
  invoices,
  appDispatch,
  handleDeleteCollectionNote,
  isServiceUnitSameAsActiveServiceUnit,
}) => {
  const usersPermissions = useSelector(getUsersPermissions);

  return (
    <Authorization
      allow={hasPermissions(
        usersPermissions,
        UsersPermissions.VIEW_COLLECTIONNOTE,
      )}
    >
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

          {(!sortedCollectionNotes || !sortedCollectionNotes.length) && (
            <FormText>Ei huomautuksia</FormText>
          )}

          {sortedCollectionNotes && !!sortedCollectionNotes.length && (
            <BoxItemContainer>
              {sortedCollectionNotes.map((note) => (
                <CollectionNoteItem
                  key={note.id}
                  note={note}
                  invoices={invoices}
                  appDispatch={appDispatch}
                  handleDeleteCollectionNote={handleDeleteCollectionNote}
                  isServiceUnitSameAsActiveServiceUnit={
                    isServiceUnitSameAsActiveServiceUnit
                  }
                />
              ))}
            </BoxItemContainer>
          )}
        </Column>
      </Row>
    </Authorization>
  );
};

export default CollectionNotes;
