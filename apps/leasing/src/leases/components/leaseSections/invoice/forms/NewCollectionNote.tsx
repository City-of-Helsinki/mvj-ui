import React from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormField from "@/components/form/final-form/FormField";
import { useField } from "react-final-form";
import { ButtonColors } from "@/components/enums";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
} from "@/collectionNote/enums";
import { getFieldAttributes, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes as getCollectionNoteAttributes } from "@/collectionNote/selectors";
import type { Attributes } from "types";

type Props = {
  field: any;
  onCancel: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
};

const NewCollectionNote: React.FC<Props> = ({ field, onCancel, onSave }) => {
  const collectionNoteAttributes: Attributes = useSelector(
    getCollectionNoteAttributes,
  );
  const { input: note } = useField(`${field}.note`);
  const { input: collectionStage } = useField(`${field}.collection_stage`);

  const handleSave = () => {
    onSave(note.value, collectionStage.value);
  };

  return (
    <>
      <Row>
        <Column small={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.COLLECTION_STAGE,
            )}
          >
            <FormField
              fieldAttributes={getFieldAttributes(
                collectionNoteAttributes,
                CollectionNoteFieldPaths.COLLECTION_STAGE,
              )}
              name={`${field}.collection_stage`}
              overrideValues={{
                label: CollectionNoteFieldTitles.COLLECTION_STAGE,
              }}
            />
          </Authorization>
        </Column>
        <Column small={12}>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.NOTE,
            )}
          >
            <FormField
              disableDirty
              fieldAttributes={{
                ...getFieldAttributes(
                  collectionNoteAttributes,
                  CollectionNoteFieldPaths.NOTE,
                ),
                type: "textarea",
              }}
              name={`${field}.note`}
              overrideValues={{
                label: CollectionNoteFieldTitles.NOTE,
              }}
            />
          </Authorization>
        </Column>
      </Row>
      <div className="invoice__new-collection-note_button-wrapper">
        <Button
          className={ButtonColors.SECONDARY}
          onClick={onCancel}
          text="Peruuta"
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!note.value}
          onClick={handleSave}
          text="Tallenna"
        />
      </div>
    </>
  );
};

export default NewCollectionNote;
