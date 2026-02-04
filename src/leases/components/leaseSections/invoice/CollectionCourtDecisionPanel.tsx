import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import Authorization from "@/components/authorization/Authorization";
import Button from "@/components/button/Button";
import FileInput from "@/components/file/FileInput";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import FormText from "@/components/form/FormText";
import FormTextTitle from "@/components/form/FormTextTitle";
import ButtonWrapper from "@/components/content/ButtonWrapper";
import { FormNames } from "@/enums";
import {
  CollectionCourtDecisionFieldPaths,
  CollectionCourtDecisionFieldTitles,
} from "@/collectionCourtDecision/enums";
import { ButtonColors } from "@/components/enums";
import { getFieldAttributes, isFieldAllowedToEdit } from "@/util/helpers";
import { getAttributes as getCollectionCourtDecisionAttributes } from "@/collectionCourtDecision/selectors";
import type { Attributes } from "types";
type Props = {
  initialize: (...args: Array<any>) => any;
  isOpen: boolean;
  largeScreen: boolean;
  onClose: (...args: Array<any>) => any;
  onSave: (...args: Array<any>) => any;
  title: string;
  valid: boolean;
};

const CollectionCourtDecisionPanel: React.FC<Props> = ({
  initialize,
  isOpen,
  largeScreen,
  onClose,
  onSave,
  valid,
}) => {
  const collectionCourtDecisionAttributes: Attributes = useSelector(
    getCollectionCourtDecisionAttributes,
  );

  const decisionDate: string | null | undefined = useSelector((state) =>
    selector(state, "decision_date"),
  );
  const note: string | null | undefined = useSelector((state) =>
    selector(state, "note"),
  );

  const [file, setFile] = useState<Record<string, any> | null | undefined>(
    null,
  );

  const clearInputs = useCallback(() => {
    initialize({
      decision_date: undefined,
      note: "",
    });
    setFile(null);
  }, [initialize]);

  useEffect(() => {
    if (isOpen) {
      clearInputs();
    }
  }, [clearInputs, isOpen]);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSave = () => {
    onSave({
      file: file,
      decision_date: decisionDate,
      note: note,
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
            <FormFieldLegacy
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
            <FormFieldLegacy
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
          onClick={onClose}
          text="Peruuta"
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!file || !valid}
          onClick={handleSave}
          text="Tallenna"
        />
      </ButtonWrapper>
    </>
  );
};

const formName = FormNames.LEASE_CREATE_COLLECTION_COURT_DECISION;
const selector = formValueSelector(formName);
export default reduxForm({
  form: formName,
})(CollectionCourtDecisionPanel) as React.ComponentType<any>;
