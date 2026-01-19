import React, { Fragment } from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { FormNames } from "@/enums";
import { ButtonColors } from "@/components/enums";
import {
  CollectionNoteFieldPaths,
  CollectionNoteFieldTitles,
} from "@/collectionNote/enums";
import { getFieldAttributes, isFieldAllowedToRead } from "@/util/helpers";
import { getAttributes as getCollectionNoteAttributes } from "@/collectionNote/selectors";
import type { Attributes } from "types";
type Props = {
  collectionNoteAttributes: Attributes;
  field: any;
  note: string | null | undefined;
  stage: string | null | undefined;
  onCancel: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
};

const NewCollectionNote = ({
  collectionNoteAttributes,
  field,
  note,
  stage,
  onCancel,
  onSave,
}: Props) => {
  const handleSave = () => {
    onSave(note, stage);
  };

  return (
    <Fragment>
      <Row>
        <Column small={3}>
          <Authorization
            allow={isFieldAllowedToRead(
              collectionNoteAttributes,
              CollectionNoteFieldPaths.STAGE,
            )}
          >
            <FormFieldLegacy
              disableDirty
              fieldAttributes={getFieldAttributes(
                collectionNoteAttributes,
                CollectionNoteFieldPaths.STAGE,
              )}
              name={`${field}.stage`}
              overrideValues={{
                label: CollectionNoteFieldTitles.STAGE,
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
            <FormFieldLegacy
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
          disabled={!note}
          onClick={handleSave}
          text="Tallenna"
        />
      </div>
    </Fragment>
  );
};

const formName = FormNames.LEASE_DEBT_COLLECTION;
const selector = formValueSelector(formName);
export default connect((state, props: Props) => {
  return {
    collectionNoteAttributes: getCollectionNoteAttributes(state),
    note: selector(state, `${props.field}.note`),
    stage: selector(state, `${props.field}.stage`),
  };
})(NewCollectionNote);
