import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Row, Column } from "@/components/grid/Grid";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FileInput from "@/components/file/FileInput";
import FormField from "@/components/form/final-form/FormField";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import { useField, useForm } from "react-final-form";
import ButtonWrapper from "@/components/content/ButtonWrapper";
import {
  CollectionCourtDecisionFieldPaths,
  CollectionCourtDecisionFieldTitles,
} from "@/collectionCourtDecision/enums";
import { ButtonColors } from "@/components/enums";
import { getFieldAttributes, isFieldAllowedToEdit } from "@/util/helpers";
import {
  getAttributes as getCollectionCourtDecisionAttributes,
  getIsSaveClicked,
} from "@/collectionCourtDecision/selectors";
import type { Attributes } from "types";
type Props = {
  isOpen: boolean;
  largeScreen: boolean;
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
  title: string;
  valid: boolean;
};
const CollectionCourtDecisionPanel: React.FC<Props> = ({
  isOpen,
  largeScreen,
  onClose,
  onSave,
  valid,
}) => {
  const collectionCourtDecisionAttributes: Attributes = useSelector(
    getCollectionCourtDecisionAttributes,
  );
  const isSaveClicked: boolean = useSelector(getIsSaveClicked);

  const { input: decisionDate } = useField("decision_date");
  const { input: note } = useField("note");

  const [file, setFile] = useState<Record<string, any> | null | undefined>(
    null,
  );

  const form = useForm();

  const handleClose = () => {
    onClose();
    form.batch(() => {
      form.change("decision_date", undefined);
      form.change("note", undefined);
    });
    setFile(null);
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSave = () => {
    onSave({
      file: file,
      decision_date: decisionDate.value === "" ? undefined : decisionDate.value,
      note: note.value,
    });
  };

  if (!isOpen) return null;
  return (
    <>
      <Row>
        <Column small={6} large={3}>
          {!largeScreen && (
            <FormTextTitle required>
              {CollectionCourtDecisionFieldTitles.FILE}
            </FormTextTitle>
          )}
          <FileInput
            name={"collection_court_decision_file"}
            onChange={handleFileChange}
            value={file}
          />
        </Column>
        <Column small={3} large={1}>
          {!largeScreen && (
            <FormTextTitle>
              {CollectionCourtDecisionFieldTitles.UPLOADED_AT}
            </FormTextTitle>
          )}
          <FormText>-</FormText>
        </Column>
        <Column small={3} large={2}>
          {!largeScreen && (
            <FormTextTitle>
              {CollectionCourtDecisionFieldTitles.UPLOADER}
            </FormTextTitle>
          )}
          <FormText>-</FormText>
        </Column>
        <Column small={3} large={2}>
          <Authorization
            allow={isFieldAllowedToEdit(
              collectionCourtDecisionAttributes,
              CollectionCourtDecisionFieldPaths.DECISION_DATE,
            )}
          >
            <FormField
              disableDirty
              fieldAttributes={getFieldAttributes(
                collectionCourtDecisionAttributes,
                CollectionCourtDecisionFieldPaths.DECISION_DATE,
              )}
              name="decision_date"
              invisibleLabel={largeScreen}
              overrideValues={{
                label: CollectionCourtDecisionFieldTitles.DECISION_DATE,
              }}
            />
          </Authorization>
        </Column>
        <Column small={9} large={4}>
          <Authorization
            allow={isFieldAllowedToEdit(
              collectionCourtDecisionAttributes,
              CollectionCourtDecisionFieldPaths.NOTE,
            )}
          >
            <FormField
              disableDirty
              fieldAttributes={getFieldAttributes(
                collectionCourtDecisionAttributes,
                CollectionCourtDecisionFieldPaths.NOTE,
              )}
              invisibleLabel={largeScreen}
              name="note"
              overrideValues={{
                label: CollectionCourtDecisionFieldTitles.NOTE,
              }}
            />
          </Authorization>
        </Column>
      </Row>
      <ButtonWrapper>
        <Button
          className={ButtonColors.ALERT}
          onClick={handleClose}
          text="Peruuta"
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!file || !valid || isSaveClicked}
          onClick={handleSave}
          text="Tallenna"
        />
      </ButtonWrapper>
    </>
  );
};

export default CollectionCourtDecisionPanel;
