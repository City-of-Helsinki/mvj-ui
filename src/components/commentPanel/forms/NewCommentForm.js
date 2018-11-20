// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';
import {receiveIsSaveClicked} from '$src/comments/actions';
import {FormNames} from '$components/enums';
import {getIsSaveClicked} from '$src/comments/selectors';

import type {RootState} from '$src/root/types';

type Props = {
  attributes: Object,
  isSaveClicked: boolean,
  onAddComment: Function,
  receiveIsSaveClicked: Function,
  text: string,
  topic: string,
  valid: boolean,
}

const NewCommentForm = ({
  attributes,
  isSaveClicked,
  onAddComment,
  receiveIsSaveClicked,
  text,
  topic,
  valid,
}: Props) => {
  const handleAddComment = () => {
    receiveIsSaveClicked(true);

    if(valid) {
      onAddComment(text, topic);
    }

  };

  return (
    <form>
      <FormSection>
        <FormField
          disableDirty
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'topic')}
          name='topic'
          overrideValues={{
            label: 'Aihealue',
          }}
        />
        <FormField
          disableDirty
          disableTouched={isSaveClicked}
          fieldAttributes={get(attributes, 'text')}
          name='text'
          overrideValues={{
            label: 'Kommentti',
            fieldType: 'textarea',
          }}
        />
        <Button
          className={'button-green no-margin'}
          disabled={isSaveClicked && !valid}
          onClick={handleAddComment}
          text='Kommentoi'
        />
      </FormSection>
    </form>
  );
};

const formName = FormNames.NEW_COMMENT;
const selector = formValueSelector(formName);

const mapStateToProps = (state: RootState) => {
  return {
    isSaveClicked: getIsSaveClicked(state),
    text: selector(state, 'text'),
    topic: selector(state, 'topic'),
  };
};

export default flowRight(
  connect(
    mapStateToProps,
    {
      receiveIsSaveClicked,
    }
  ),
  reduxForm({
    form: formName,
  }),
)(NewCommentForm);
