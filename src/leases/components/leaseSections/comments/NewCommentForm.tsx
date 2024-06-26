import React from "react";
import { connect } from "react-redux";
import { formValueSelector, reduxForm } from "redux-form";
import flowRight from "lodash/flowRight";
import Authorization from "/src/components/authorization/Authorization";
import Button from "/src/components/button/Button";
import FormField from "/src/components/form/FormField";
import { receiveIsSaveClicked } from "/src/comments/actions";
import { FieldTypes, FormNames } from "enums";
import { ButtonColors } from "/src/components/enums";
import { CommentFieldPaths, CommentFieldTitles } from "/src/comments/enums";
import { getUiDataCommentKey } from "uiData/helpers";
import { getFieldAttributes, isFieldAllowedToEdit } from "util/helpers";
import { getAttributes as getCommentAttributes, getIsSaveClicked } from "/src/comments/selectors";
import type { Attributes } from "types";
import type { RootState } from "root/types";
type Props = {
  commentAttributes: Attributes;
  isSaveClicked: boolean;
  onAddComment: (...args: Array<any>) => any;
  receiveIsSaveClicked: (...args: Array<any>) => any;
  text: string;
  topic: string;
  valid: boolean;
};

const NewCommentForm = ({
  commentAttributes,
  isSaveClicked,
  onAddComment,
  receiveIsSaveClicked,
  text,
  topic,
  valid
}: Props) => {
  const handleAddComment = () => {
    receiveIsSaveClicked(true);

    if (valid) {
      onAddComment(text, topic);
    }
  };

  return <form>
      <Authorization allow={isFieldAllowedToEdit(commentAttributes, CommentFieldPaths.TOPIC)}>
        <FormField disableDirty disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(commentAttributes, CommentFieldPaths.TOPIC)} name='topic' overrideValues={{
        label: CommentFieldTitles.TOPIC
      }} enableUiDataEdit uiDataKey={getUiDataCommentKey(CommentFieldPaths.TOPIC)} />
      </Authorization>
      <Authorization allow={isFieldAllowedToEdit(commentAttributes, CommentFieldPaths.TEXT)}>
        <FormField disableDirty disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(commentAttributes, CommentFieldPaths.TEXT)} name='text' overrideValues={{
        label: CommentFieldTitles.TEXT,
        fieldType: FieldTypes.TEXTAREA
      }} enableUiDataEdit uiDataKey={getUiDataCommentKey(CommentFieldPaths.TEXT)} />
      </Authorization>
      <Button className={`${ButtonColors.SUCCESS} no-margin`} disabled={isSaveClicked && !valid} onClick={handleAddComment} text='Kommentoi' />
    </form>;
};

const formName = FormNames.LEASE_NEW_COMMENT;
const selector = formValueSelector(formName);

const mapStateToProps = (state: RootState) => {
  return {
    commentAttributes: getCommentAttributes(state),
    isSaveClicked: getIsSaveClicked(state),
    text: selector(state, 'text'),
    topic: selector(state, 'topic')
  };
};

export default flowRight(connect(mapStateToProps, {
  receiveIsSaveClicked
}), reduxForm({
  form: formName
}))(NewCommentForm) as React.ComponentType<any>;