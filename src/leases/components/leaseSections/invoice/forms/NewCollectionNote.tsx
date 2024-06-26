import React, { Fragment } from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import Authorization from "/src/components/authorization/Authorization";
import Button from "/src/components/button/Button";
import FormField from "/src/components/form/FormField";
import { FormNames } from "enums";
import { ButtonColors } from "/src/components/enums";
import { CollectionNoteFieldPaths, CollectionNoteFieldTitles } from "/src/collectionNote/enums";
import { getFieldAttributes, isFieldAllowedToRead } from "util/helpers";
import { getAttributes as getCollectionNoteAttributes } from "/src/collectionNote/selectors";
import type { Attributes } from "types";
type Props = {
  collectionNoteAttributes: Attributes;
  field: any;
  note: string | null | undefined;
  onCancel: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
};

const NewCollectionNote = ({
  collectionNoteAttributes,
  field,
  note,
  onCancel,
  onSave
}: Props) => {
  const handleSave = () => {
    onSave(note);
  };

  return <Fragment>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(collectionNoteAttributes, CollectionNoteFieldPaths.NOTE)}>
            <FormField disableDirty fieldAttributes={{ ...getFieldAttributes(collectionNoteAttributes, CollectionNoteFieldPaths.NOTE),
            type: 'textarea'
          }} invisibleLabel={true} name={`${field}.note`} overrideValues={{
            label: CollectionNoteFieldTitles.NOTE
          }} />
          </Authorization>
        </Column>
      </Row>
      <div className='invoice__new-collection-note_button-wrapper'>
        <Button className={ButtonColors.SECONDARY} onClick={onCancel} text='Peruuta' />
        <Button className={ButtonColors.SUCCESS} disabled={!note} onClick={handleSave} text='Tallenna' />
      </div>
    </Fragment>;
};

const formName = FormNames.LEASE_DEBT_COLLECTION;
const selector = formValueSelector(formName);
export default connect((state, props) => {
  return {
    collectionNoteAttributes: getCollectionNoteAttributes(state),
    note: selector(state, `${props.field}.note`)
  };
})(NewCollectionNote);